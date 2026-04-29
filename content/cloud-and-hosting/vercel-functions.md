# Vercel Functions

Vercel Functions is the compute layer of the Vercel platform — the runtime that executes your API routes, Server Actions, Server Components, and any other server-side code. In 2026 it is unified under **Fluid Compute**, a model that runs Node.js, Edge, Bun, and Rust workloads with shared concurrency, longer durations, and Active CPU pricing that charges only for time the CPU actually does work.

If you have shipped a Next.js API route or a Route Handler on Vercel, you have used Vercel Functions. This page is the reference: function types, runtime selection, Fluid Compute, streaming, cron jobs, and the diagnostic ladder when something goes wrong.

## What changed in 2026

If your mental model of Vercel Functions came from articles written before 2026, three things are different now:

- **Fluid Compute is the default.** It used to be opt-in. Now every Vercel project runs on Fluid by default, with the per-instance concurrency and Active CPU pricing applied automatically.
- **Default function timeout is 300 seconds**, on every plan. The old 10-second Hobby ceiling and the 60-second Pro default are gone. Pro and Enterprise can extend to 800 seconds.
- **Edge Functions are not the recommended default for most workloads.** Middleware and route handlers now run on Fluid Compute with full Node.js, which means the legacy "use edge for speed" pattern is no longer correct — Fluid runs in the same regions as Edge, charges the same, and supports the entire Node.js ecosystem.

## Function types

### Serverless Functions (Node.js)

The default. Full Node.js runtime, every npm package available, the right choice for almost any handler that needs database access, third-party SDKs, or anything that imports a Node-only module.

```ts
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello from Node.js" });
}
```

Cold starts: typically 800 ms to 2.5 s, depending on bundle size and how many database connections need to wake up. Maximum duration: 300 seconds default, up to 800 seconds on Pro and Enterprise. Node.js 24 LTS is the current default, with V8 13.6, global `URLPattern`, and Undici v7's faster `fetch()`.

### Edge Functions (V8 Isolates)

A V8-only runtime with Web Standard APIs (no `fs`, no Node modules). Cold starts under one millisecond, runs at the edge globally. Best for auth checks, redirects, A/B test bucketing, and simple transformations where the work is light and the request just needs to be routed somewhere.

```ts
// app/api/hello/route.ts
export const runtime = "edge";

export async function GET() {
  return new Response("Hello from the Edge");
}
```

The hard ceiling is 25 seconds (not configurable). Past that the function returns `EDGE_FUNCTION_INVOCATION_TIMEOUT`. The old guidance to default to Edge for latency has been displaced — for any workload with non-trivial logic, Fluid Compute on Node.js is now the right call.

### Bun runtime (public beta)

Add `"bunVersion": "1.x"` to `vercel.json` to run a Node.js function on Bun. Roughly 28% lower latency for CPU-bound workloads. Compatible with Next.js, Express, Hono, Nitro. The trade-off: Bun's compatibility surface is broad but not yet 100% — verify your dependencies before flipping the switch in production.

### Rust runtime (public beta)

Rust functions run on Fluid Compute with HTTP streaming and Active CPU pricing. Built on the community Rust runtime, supports environment variables up to 64 KB. Native-speed compute for systems-level work or anywhere you would otherwise reach for a sidecar service.

### Choosing a runtime

| Need | Runtime | Why |
|------|---------|-----|
| Full Node.js APIs, npm packages | `nodejs` | Full compatibility |
| CPU-bound work, lower latency | `nodejs` + Bun | ~28% latency reduction |
| Ultra-low latency, simple logic | `edge` | Sub-millisecond cold start |
| Database connections, heavy deps | `nodejs` | Edge cannot import Node modules |
| Auth or redirect at the edge | `edge` | Fastest response |
| AI streaming | Either | Both support streaming |
| Systems-level performance | `rust` (beta) | Native speed on Fluid Compute |

The pragmatic 2026 default: `nodejs`. The cases where Edge is still the right call are narrow (sub-millisecond redirects, geographic routing, header-based auth checks before the rest of the pipeline runs).

## Fluid Compute

Fluid Compute is the unified execution model under both Node.js and Edge functions. Five things it changes versus traditional one-request-per-instance serverless:

- **Optimized concurrency.** A single instance can serve many concurrent requests rather than spawning a new instance per request. For high-concurrency workloads — chat apps, AI streaming, burst APIs — this delivers documented cost reductions of up to 85%.
- **Extended durations.** 300 seconds default on all plans, up to 800 seconds on Pro and Enterprise.
- **Active CPU pricing.** You pay for CPU time when the CPU is actually executing, plus a much lower rate for memory-only periods (idle waits on databases, network, AI provider responses). For AI workloads where most of the wall-clock time is waiting on a model, this is meaningfully cheaper than wall-clock GB-seconds.
- **Background processing.** `waitUntil` and Next.js `after` let you keep working after the response goes out — analytics writes, log forwarding, cache warming.
- **Bytecode caching.** A Rust-based runtime pre-compiles function code, lowering cold-start latency.

### Instance sizes

| Size | CPU | Memory |
|------|-----|--------|
| Standard (default) | 1 vCPU | 2 GB |
| Performance | 2 vCPU | 4 GB |

Hobby projects use Standard. The legacy Basic CPU instance has been removed.

### Background processing with `waitUntil`

```ts
import { waitUntil } from "@vercel/functions";

export async function POST(req: Request) {
  const data = await req.json();

  const response = Response.json({ received: true });

  waitUntil(async () => {
    await processAnalytics(data);
    await sendNotification(data);
  });

  return response;
}
```

The Next.js equivalent is `after`:

```ts
import { after } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  after(async () => {
    await logToAnalytics(data);
  });

  return Response.json({ ok: true });
}
```

The pattern: send the user-facing response immediately, then keep working. Critical for chat UIs and any AI workflow where you do not want to make the user wait for analytics or webhook fan-out.

## Streaming

Streaming is zero-config on both Node.js and Edge functions. Essential for AI responses where the user should see tokens as they arrive.

```ts
export async function POST(req: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of data) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, 100));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

For AI streaming with the [Vercel AI SDK](/ai-development/ai-sdk), use `toUIMessageStreamResponse()` rather than rolling SSE by hand — it integrates with `useChat` on the client and handles formatting automatically.

## Cron jobs

Schedule function invocations from `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/daily-report", "schedule": "0 8 * * *" },
    { "path": "/api/cleanup",       "schedule": "0 */6 * * *" }
  ]
}
```

The cron endpoint receives a normal HTTP request. Always verify the caller is Vercel:

```ts
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  // do scheduled work
  return Response.json({ ok: true });
}
```

For workloads more complex than "fire a request on a schedule" — multi-step pipelines, retries, pause/resume — reach for [Vercel Workflow DevKit](/cloud-and-hosting/vercel-workflow) or [Vercel Queues](/cloud-and-hosting/vercel-queues) instead. Cron is the right tool when each invocation is independent and stateless.

## Configuration via `vercel.json`

```json
{
  "functions": {
    "app/api/heavy/**": {
      "maxDuration": 300,
      "memory": 1024
    },
    "app/api/edge/**": {
      "runtime": "edge"
    }
  }
}
```

`maxDuration` accepts seconds up to your plan's ceiling (300 for Hobby, 800 for Pro / Enterprise). `memory` is in megabytes; the practical ceiling on Pro is 3008 MB.

The legacy `now.json` config file is being removed on **March 31, 2026** — rename to `vercel.json` if you have not yet (no content changes required). For new projects, `vercel.ts` is now the recommended way to configure projects, with full TypeScript support and dynamic logic.

## Timeout limits

| Plan | Default | Max |
|------|---------|-----|
| Hobby | 300 s | 300 s |
| Pro | 300 s | 800 s |
| Enterprise | 300 s | 800 s |

These ceilings are wall-clock limits, not Active-CPU limits. A function waiting on a slow AI provider response counts against the wall-clock total even though the CPU is mostly idle.

## Diagnostic ladder when things go wrong

Most production incidents on Vercel Functions fall into one of five categories. Walk the relevant ladder before guessing.

### 504 Gateway Timeout

```
All plans default to 300s with Fluid Compute.
├─ Pro/Enterprise can configure up to 800s in vercel.json
├─ Long-running task?
│   ├─ Under 5 min → keep on Fluid + stream the response
│   ├─ Up to ~15 min → set maxDuration explicitly
│   └─ Hours / days / multi-step → use Workflow DevKit
└─ DB query slow? → connection pooling, cold-start audit, Edge Config for hot reads
```

### 500 Internal Server Error

- Check Vercel Runtime Logs (Dashboard → Deployments → Functions tab).
- Missing env vars? Compare `.env.local` against Vercel dashboard settings.
- Import error? Verify the package is in `dependencies`, not `devDependencies`.
- Uncaught exception? Wrap the handler in try/catch and use `after()` for error reporting.

### `FUNCTION_INVOCATION_FAILED`

- Memory exceeded? Increase `memory` in `vercel.json` (up to 3008 MB on Pro).
- Crashed during init? Look for top-level `await` or heavy imports at module scope — these run on every cold start.
- Edge Function crash? Check for Node.js APIs not available in the Edge runtime (`fs`, native modules, parts of `crypto`).

### Slow cold starts (>1 s)

- On Node.js? Consider Edge Functions for genuinely latency-sensitive routes.
- Large bundle? Audit imports, use dynamic imports, tree-shake.
- DB connection in cold path? Use a connection pooler (Neon's `@neondatabase/serverless` is the canonical 2026 example).
- Make sure Fluid Compute is enabled — it is the default, but custom configurations can disable it.

### `EDGE_FUNCTION_INVOCATION_TIMEOUT`

- Edge functions have a 25-second hard limit. It is not configurable.
- Move heavy computation to a Node.js Serverless Function.
- Or stream the response immediately and process in the background with `waitUntil`.

## Common pitfalls

- **Cold starts with database connections.** Use connection pooling. Neon's serverless driver, Supabase Pooler, or PgBouncer in front of any direct Postgres connection.
- **Edge limitations.** No `fs`, no native modules, limited `crypto`. If your code imports any of these, you cannot run on Edge — pick Node.js.
- **Module-scope work runs on every cold start.** Importing a 200 MB bundle of Tesseract at the top of your file means every cold start is multi-second. Defer heavy initialization to first invocation, ideally inside `waitUntil` for warming.
- **`devDependencies` are not bundled.** A package only listed under `devDependencies` will be missing in production. Move it to `dependencies` if your function imports it.
- **Environment variables.** Available in every function automatically. Use `vercel env pull` for local development; do not rely on a separate `.env` file diverging from production.

## When to reach for it

- Almost any HTTP handler in a Next.js, Nuxt, SvelteKit, Astro, Express, or Hono app deployed to Vercel.
- AI streaming responses — both Node.js and Edge support streaming with no additional configuration.
- Background jobs that should outlive a request — `waitUntil` is the simplest tool for fan-out work.
- Cron-triggered batch jobs that fit inside the 300-second window.

## When to skip it

- Hours-long workloads or multi-step pipelines with state — use [Vercel Workflow DevKit](/cloud-and-hosting/vercel-workflow).
- Untrusted code execution — use [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox).
- Persistent worker processes that need to stay running between requests — use a dedicated server platform.

## Further reading

- [Vercel Functions docs](https://vercel.com/docs/functions)
- [Fluid Compute](https://vercel.com/docs/fluid-compute)
- [Streaming](https://vercel.com/docs/functions/streaming)
- [Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Runtimes](https://vercel.com/docs/functions/runtimes)
- [vercel/vercel on GitHub](https://github.com/vercel/vercel)

For other Vercel infrastructure references on this site, see [Vercel](/cloud-and-hosting/vercel), [Vercel Workflow DevKit](/cloud-and-hosting/vercel-workflow), [Vercel Queues](/cloud-and-hosting/vercel-queues), [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox), [Vercel Firewall](/cloud-and-hosting/vercel-firewall), [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway), and [Vercel Blob](/cloud-and-hosting/vercel-blob).
