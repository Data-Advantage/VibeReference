# Vercel Sandbox

Vercel Sandbox is a managed compute primitive for running untrusted or AI-generated code in ephemeral Firecracker microVMs. Each sandbox boots in milliseconds, exposes a Node.js or Python runtime with a writable filesystem and outbound network controls, and shuts down automatically when the work is done. It is the production answer to "how do I let an AI agent run arbitrary code without it eating my server."

## What it is

A Vercel Sandbox is a per-invocation virtual machine, not a container and not a serverless function. Vercel runs the same Firecracker infrastructure that powers two million build executions a day — a sandbox is one of those VMs, exposed as a programmable resource with an SDK and a REST API.

The shape:

- **Base OS**: Amazon Linux 2023 with `git`, `tar`, `openssl`, and `dnf` preinstalled
- **Runtimes**: `node24` (default since March 2026), `node22`, `python3.13`
- **Working directory**: `/vercel/sandbox`
- **User**: `vercel-sandbox` with `sudo` access
- **Filesystem**: ephemeral — anything you do not export is gone when the VM stops
- **Network**: full egress by default, lockable to a domain allow-list at runtime

The combination is unusual. Containers are slow to boot for one-shot work; serverless functions cannot run arbitrary processes; raw VMs take seconds to provision. Firecracker microVMs are the AWS technology that closed that gap inside Lambda, and Vercel Sandbox is what it looks like exposed as a developer API rather than an internal implementation detail.

## Status and pricing

Vercel Sandbox went generally available on January 30, 2026. The CLI and SDK are open source and live at [github.com/vercel/sandbox](https://github.com/vercel/sandbox).

| Resource | Hobby (free) | Pro / Enterprise |
|----------|-------------|------------------|
| CPU hours | 5 / month | $0.128 per CPU-hour |
| Provisioned memory | 420 GB-hours / month | $0.0106 per GB-hour |
| Network bandwidth | 20 GB / month | $0.15 per GB |
| Sandbox creations | 5,000 / month | $0.60 per million creations |

Each sandbox can use up to **8 vCPUs**, **2 GB RAM per vCPU**, and expose up to **4 public ports**. Maximum lifetime depends on plan: 5 minutes on the default tier, 45 minutes on Hobby, and 5 hours on Pro / Enterprise.

## Installing the SDK

```bash
npm install @vercel/sandbox
```

Authentication is automatic when you call the SDK from a deployment in the same Vercel team. From a local script, set `VERCEL_TOKEN` (and optionally `VERCEL_TEAM_ID`) in your environment.

## Hello world

```ts
import { Sandbox } from '@vercel/sandbox';

const sandbox = await Sandbox.create({
  runtime: 'node24',
});

const result = await sandbox.runCommand('node', ['-e', 'console.log(42)']);
console.log(await result.stdout()); // "42\n"

await sandbox.stop();
```

That is the whole API. Create a sandbox, run a command, read stdout, stop it.

## Running commands with options

`runCommand` accepts either a positional `(cmd, args)` pair or an options object. The options form gives you per-command working directory, environment overrides, and `sudo` access:

```ts
await sandbox.runCommand({
  cmd: 'npm',
  args: ['install', 'express'],
  cwd: '/vercel/sandbox/app',
  env: { NODE_ENV: 'development' }, // overrides creation-level env
  sudo: true,
});
```

Environment variables provided at `Sandbox.create()` are inherited by every subsequent command; per-command env overrides them. This is the standard way to inject API keys exactly once and have every step see them.

For long-running processes (a dev server, a worker, anything you want to keep alive past the API call), use `detached: true` and stream logs:

```ts
const cmd = await sandbox.runCommand({
  cmd: 'node',
  args: ['server.js'],
  detached: true,
});

for await (const log of cmd.logs()) {
  console.log(`[${log.stream}] ${log.data}`); // log.stream is 'stdout' | 'stderr'
}

await cmd.wait(); // resolves when the process exits
```

## File I/O

The two patterns that cover ~90% of agent use cases:

```ts
// Write generated source files into the sandbox
await sandbox.writeFiles([
  { path: 'app.js', content: Buffer.from('console.log("hello")') },
  { path: 'package.json', content: Buffer.from('{"type":"module"}') },
]);

// Read a single result file
const buf = await sandbox.readFileToBuffer({ path: 'output.json' });

// Stream a larger file
const stream = await sandbox.readFile({ path: 'build.log' });

// Download a file straight to local disk
await sandbox.downloadFile('artifacts/output.zip', './local-output.zip');

// Create a directory before writing into it
await sandbox.mkDir('src/components');
```

Everything in the sandbox is ephemeral. If you need to persist work across invocations, export the artifact (`downloadFile` or upload it to Blob/S3) before calling `stop()`.

## Initialising from source

Three options when you need code in the sandbox before you start running commands:

```ts
// Shallow git clone
const sandbox = await Sandbox.create({
  source: { type: 'git', url: 'https://github.com/user/repo', depth: 1 },
});

// Mount a tarball at boot
const sandbox = await Sandbox.create({
  source: { type: 'tarball', url: 'https://example.com/project.tar.gz' },
});

// Restore from a snapshot — skip the install step entirely
const sandbox = await Sandbox.create({
  source: { type: 'snapshot', snapshotId: 'snap_abc123' },
});
```

The snapshot option is the one that matters for production agents. It is the difference between "install dependencies on every invocation" and "install once, reuse the warmed-up VM image forever."

## Snapshots

A snapshot captures the full VM state — filesystem and installed packages — and stores it for fast rehydration. The pattern:

```ts
// 1. Bootstrap a sandbox with whatever expensive setup you need
const setup = await Sandbox.create({ runtime: 'node24' });
await setup.runCommand('npm', ['install', 'large-toolchain']);

// 2. Snapshot it (note: the sandbox shuts down after snapshot creation)
const snapshot = await setup.snapshot({ expiration: 86_400_000 }); // 24 hours
console.log(snapshot.snapshotId);

// 3. Subsequent runs skip the install
const sandbox = await Sandbox.create({
  source: { type: 'snapshot', snapshotId: snapshot.snapshotId },
});
```

This collapses cold-start time for any pipeline that needs the same toolchain repeatedly — code execution playgrounds, FFmpeg workers, AI coding agents, automated test runners.

Lifecycle helpers for managing snapshots:

```ts
import { Snapshot } from '@vercel/sandbox';

const { snapshots } = await Snapshot.list();
const snap = await Snapshot.get({ snapshotId: 'snap_abc' });
await snap.delete();
```

## Network isolation

The sandbox firewall does egress filtering using **SNI inspection** on the TLS client hello — outbound connections are matched against an allow-list at handshake time and unauthorized destinations are rejected before any data transmits. For non-TLS traffic, CIDR rules are also supported.

Policies can be updated at runtime without restarting the VM, which enables a critical pattern: open access during setup, locked access before running anything you do not trust.

```ts
// Allow everything during npm install
const sandbox = await Sandbox.create({ runtime: 'node24' });
await sandbox.runCommand('npm', ['install']);

// Lock down before running the AI-generated code
await sandbox.updateNetworkPolicy('deny-all');
await sandbox.runCommand('node', ['ai-output.js']);
```

For a more permissive but still safe posture, allow specific domains:

```ts
await sandbox.updateNetworkPolicy({
  allow: ['api.openai.com', '*.googleapis.com'],
});
```

### Credential brokering

Network policies can also rewrite outbound requests, which is how you let untrusted code call an authenticated API without ever giving it the API key:

```ts
await sandbox.updateNetworkPolicy({
  allow: {
    'ai-gateway.vercel.sh': [
      {
        transform: [
          { headers: { 'x-api-key': process.env.SECRET_KEY! } },
        ],
      },
    ],
  },
});
```

The sandbox proxy injects the header on every request to that host. The user-generated code never sees the key, never logs it, and cannot exfiltrate it — it is added in the network layer after the request leaves the VM.

## Public URLs

Sandboxes can serve traffic. Expose a port at creation, then ask for the public URL:

```ts
const sandbox = await Sandbox.create({ ports: [3000] });
const url = sandbox.domain(3000); // https://sbx-xxxx-3000.vercel.run

await sandbox.runCommand({
  cmd: 'node',
  args: ['server.js'],
  detached: true,
});

console.log(`Live at ${url}`);
```

This is the pattern for AI-generated app previews, interactive tutorials, and "ship a working demo URL within seconds of code generation" workflows.

## Lifecycle and resource tracking

```ts
// Extend the timeout if a job is taking longer than expected
await sandbox.extendTimeout(300_000); // +5 minutes

// Status changes through: 'pending' → 'running' → 'stopping' → 'stopped' (or 'failed')
console.log(sandbox.status);

// After stop, query usage for billing or telemetry
console.log(sandbox.activeCpuUsageMs);
console.log(sandbox.networkUsage); // { ingress: bytes, egress: bytes }

await sandbox.stop();
```

`Sandbox.list()` and `Sandbox.get()` let you reconnect to existing sandboxes — useful for orchestrators that hand off work between processes:

```ts
const { sandboxes } = await Sandbox.list({ limit: 10 });
const sandbox = await Sandbox.get({ sandboxId: 'sbx_abc123' });
```

## Common patterns

**Safe AI code execution.** Generate code with an LLM, write it into the sandbox, run it, capture stdout. Lock the network before execution if you do not trust the output to call only what you expect.

**Snapshot-based fast restart.** Install dependencies once, snapshot the VM, then boot every subsequent run from the snapshot. Cold starts measured in tens of milliseconds, not seconds.

**Code review validation.** This is what Vercel Agent uses internally — pull a PR, run its tests inside a sandbox, capture results without giving the PR author's code any access to your build environment.

**FFmpeg workers and other long-running CPU jobs.** Sandboxes have up to 8 vCPUs and 5-hour lifetimes on Pro, which is the right shape for one-shot media processing without paying for a permanent worker.

**Live previews of generated apps.** Boot a sandbox, write the generated code, run `npm install && npm run dev`, expose port 3000, return `sandbox.domain(3000)` to the user. Sub-second from "write me a Next.js app that does X" to a working demo URL.

**Credential-brokered API access.** Hand AI-generated code an HTTP client that hits `https://ai-gateway.vercel.sh` directly; the sandbox network layer injects the API key. The code can call the API without ever knowing the credential.

## When to reach for it

- An AI agent needs to execute code it just generated, and you cannot let that code run anywhere it could affect production state.
- You are building a developer playground, an interactive tutorial, or a coding interview tool — anywhere users submit code you have to run.
- A pipeline needs disposable Linux compute with a real filesystem and outbound network, but you do not want to manage a worker pool.
- You are running media processing (FFmpeg), build pipelines, or analysis jobs that need real CPU but only briefly.

## When to skip it

- **Production HTTP services.** Use [Vercel Functions](/cloud-and-hosting/vercel) — Fluid Compute is cheaper for short-lived requests and has lower per-invocation latency.
- **Long-running daemons.** Sandboxes have a 5-hour ceiling. Use a dedicated server or a managed worker platform.
- **Pure function execution with no filesystem or network needs.** A Serverless Function will be faster and cheaper.

## How it compares

The closest comparable products:

- **AWS Lambda** — also Firecracker-based, but built for short HTTP-shaped responses, not interactive sessions. No file I/O API, no port exposure, no first-class snapshot/rehydrate workflow for long-form code execution.
- **E2B** — code-interpreter-style sandboxes for AI agents, dedicated to that use case. Comparable feature set, different pricing posture, separate platform.
- **Modal** — Python-first compute platform with sandbox-style isolation for ML workloads. Heavier and more featured; Sandbox is lighter and tighter on the JavaScript side.
- **CodeSandbox / StackBlitz** — IDE-shaped products for human developers. Different category — those are for editing code in a browser, not for letting agents run code from a server.

The thing that makes Vercel Sandbox interesting in 2026 is that it sits inside the same platform as your Functions, your AI Gateway, and (if you use it) your Workflow runs — the network policy can broker AI Gateway calls, the sandboxed app can be reached at a `*.vercel.run` URL, and the whole cost shows up on a single Vercel bill.

## Further reading

- [Vercel Sandbox docs](https://vercel.com/docs/vercel-sandbox)
- [SDK reference](https://vercel.com/docs/vercel-sandbox/sdk-reference)
- [vercel/sandbox on GitHub](https://github.com/vercel/sandbox)

For other Vercel infrastructure references on this site, see [Vercel](/cloud-and-hosting/vercel), [Vercel Workflow DevKit](/cloud-and-hosting/vercel-workflow), [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway), and [Vercel Blob](/cloud-and-hosting/vercel-blob).
