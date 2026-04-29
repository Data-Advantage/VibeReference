# Vercel Workflow DevKit

Vercel Workflow DevKit (WDK) is an open-source TypeScript framework for writing durable, long-running async functions that survive crashes, deployments, and serverless function timeouts. Two compiler directives — `"use workflow"` and `"use step"` — turn ordinary code into orchestrators with retries, suspension, resumption, and observability built in.

## What "durable" actually means here

A normal Next.js Route Handler runs once. If the function times out, the host crashes, or the deployment rolls over, the work in flight is gone. That is fine for a request that fits in a few hundred milliseconds. It is not fine for an AI agent making twelve tool calls, a multi-step content pipeline that has to wait for editorial approval, or a saga that charges a card and then provisions a tenant.

Durable execution platforms solve this by recording each step's input, output, and side effects to a persistent log. If the process dies mid-run, a new process picks up exactly where the old one left off — without re-charging the card or re-sending the email. Temporal popularized this pattern. Inngest, Trigger.dev, and AWS Step Functions implement variants of it. WDK is Vercel's entry, and its bet is that durability should be a *language-level* concept, not an SDK call.

## How the directives work

WDK uses build-time compilation. When you mark a function with `"use workflow"`, a Vite/esbuild plugin compiles it into a sandboxed orchestrator. When you mark a function with `"use step"`, the compiler emits an isolated handler with state persistence and automatic retries.

```ts
// workflows/welcome.ts
export async function welcome(email: string, name: string, plan: string) {
  "use workflow";

  const { subject, body } = await generateEmail({ name, plan });
  const { status } = await sendEmail({ to: email, subject, body });

  return { status, subject, body };
}

async function generateEmail(input: { name: string; plan: string }) {
  "use step";
  // Full Node.js access here — fetch, db calls, AI SDK calls
  // If this throws, WDK retries it automatically.
  const res = await fetch("https://api.example.com/copy", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.json();
}

async function sendEmail(args: { to: string; subject: string; body: string }) {
  "use step";
  // Sends through your email provider; retries on transient failure.
  return { status: "sent" };
}
```

The workflow function looks like ordinary async code. Under the hood, the compiler rewrites every `await` of a step into a checkpoint: input gets recorded, the step executes in its own handler, and the output gets memoized. If the workflow process dies between `generateEmail` and `sendEmail`, the next attempt replays the recorded result of `generateEmail` and resumes at `sendEmail`.

## The sandbox rule

Workflow functions run in a sandbox. Step functions do not.

| Scope | What you can do |
|-------|-----------------|
| Inside `"use workflow"` | Orchestration only. `sleep`, `Promise.race`, hooks, calling other steps. No native `fetch`, no `setTimeout`, no Node modules, no streaming writes. |
| Inside `"use step"` | Anything Node.js can do. Database queries, third-party APIs, file I/O, AI SDK calls, streaming output. |

The sandbox is what makes replay deterministic. If the workflow function called `Date.now()` directly, two replays would see different values and the persisted log would diverge. By forcing all I/O into steps, WDK guarantees the workflow's control flow is reproducible.

## Installation

```bash
npx create-next-app@latest my-app --no-src-dir --tailwind --eslint --app --ts
cd my-app
npm install workflow@latest
```

Use the `--no-src-dir` flag. WDK expects `workflows/` and `app/` to be siblings at the project root so the `@/workflows/...` alias resolves correctly. If you already have a `src/` layout, keep `workflows/` inside `src/` and adjust `tsconfig.json` paths accordingly.

Add the Next.js plugin:

```ts
// next.config.ts
import { withWorkflow } from "workflow/next";

const nextConfig = {};
export default withWorkflow(nextConfig);
```

Without `withWorkflow`, the compiler never sees your workflow files and `start()` calls fail at runtime.

If your workflow uses the AI SDK with Vercel AI Gateway, run `vercel link` and `vercel env pull` before starting the dev server. Workflows execute in their own sandbox and need OIDC credentials in `.env.local` to authenticate gateway calls — without them, gateway requests fail silently inside steps.

## Project layout

A complete WDK setup needs four files:

```
workflows/
  my-workflow.ts                ← "use workflow" + "use step" definitions
app/api/
  my-workflow/route.ts          ← POST — start a run, returns runId
  readable/[runId]/route.ts     ← GET — SSE stream of events from getWritable()
  run/[runId]/route.ts          ← GET — poll run status
```

### Starting a run

```ts
// app/api/my-workflow/route.ts
import { NextResponse } from "next/server";
import { start } from "workflow/api";
import { myWorkflow } from "@/workflows/my-workflow";

export async function POST(request: Request) {
  const body = await request.json();
  const run = await start(myWorkflow, [body.input]);
  return NextResponse.json({ runId: run.runId });
}
```

Never call the workflow function directly. `start()` registers the run, allocates a `runId`, and returns immediately so the client can subscribe to the stream.

### Streaming progress

Each run has a writable stream. Steps write events; clients subscribe via SSE:

```ts
// In the workflow
import { getWritable } from "workflow";

async function processOrder(orderId: string) {
  "use step";
  const writer = getWritable<{ type: string; orderId: string }>().getWriter();
  try {
    await writer.write({ type: "step_start", orderId });
    const result = await doWork(orderId);
    await writer.write({ type: "step_done", orderId });
    return result;
  } finally {
    writer.releaseLock();
  }
}
```

```ts
// app/api/readable/[runId]/route.ts
import { getRun } from "workflow/api";

export async function GET(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await getRun(runId);
  const readable = run.getReadable();
  const encoder = new TextEncoder();
  const sseStream = (readable as unknown as ReadableStream).pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        const data = typeof chunk === "string" ? chunk : JSON.stringify(chunk);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      },
    }),
  );
  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
```

This is the WDK pattern for "stream each phase of a long-running pipeline to the UI" — the same idea Temporal Updates and Inngest's stream API solve, but expressed as a normal `WritableStream` you write to from inside a step.

## Pausing for external events

Hooks let a workflow suspend and wait for an outside signal — an approval click, a payment webhook, a manual review. The workflow does not consume compute while paused; the orchestrator records its position and tears down the process.

```ts
import { defineHook, getWritable, sleep } from "workflow";

export interface ApprovalPayload {
  approved: boolean;
  comment?: string;
}

export const approvalHook = defineHook<ApprovalPayload>();

export async function approvalGate(orderId: string) {
  "use workflow";

  const hook = approvalHook.create({ token: `approval:${orderId}` });
  await emitToken(hook.token, orderId); // tell the UI the run is awaiting approval

  const result = await Promise.race([
    hook.then((payload) => ({ type: "approval" as const, payload })),
    sleep("24h").then(() => ({ type: "timeout" as const })),
  ]);

  if (result.type === "timeout") return { status: "timeout" };
  return { status: result.payload.approved ? "approved" : "rejected" };
}
```

The client resumes the workflow by POSTing to a route that calls `resumeHook`:

```ts
// app/api/approve/route.ts
import { resumeHook } from "workflow/api";

export async function POST(req: Request) {
  const { token, ...data } = await req.json();
  await resumeHook(token, data);
  return Response.json({ ok: true });
}
```

This is human-in-the-loop, expressed without a state machine, a queue, or a polling job. The workflow looks like it is awaiting a value because it is — the value just happens to come from an HTTP request that may arrive hours later.

## Errors and retries

Steps retry automatically on thrown errors. Two error classes let you control the retry behavior:

```ts
import { FatalError, RetryableError } from "workflow";

async function callExternalAPI(url: string) {
  "use step";
  const res = await fetch(url);

  if (res.status >= 400 && res.status < 500) {
    throw new FatalError(`Client error: ${res.status}`); // do not retry
  }
  if (res.status === 429) {
    throw new RetryableError("Rate limited", { retryAfter: "5m" });
  }
  return res.json();
}
```

`FatalError` short-circuits the retry loop and fails the workflow. `RetryableError` lets you set a backoff explicitly. Anything else uses the default retry policy. Inside a step you can read `getStepMetadata().retryCount` to bound retries by hand if you need to, though this returns `undefined` on the first attempt — guard with `(meta.retryCount ?? 0) + 1`.

## Durable AI agents

The headline use case is agents. `DurableAgent` from `@workflow/ai/agent` wraps the AI SDK so every LLM call and tool execution becomes a retryable step:

```ts
import { DurableAgent } from "@workflow/ai/agent";
import { getWritable } from "workflow";
import { z } from "zod";

async function searchDatabase(query: string) {
  "use step";
  return `Results for "${query}"`;
}

export async function researchAgent(topic: string) {
  "use workflow";

  const agent = new DurableAgent({
    model: "anthropic/claude-sonnet-4-5",
    system: "You are a research assistant.",
    tools: {
      search: {
        description: "Search the database",
        inputSchema: z.object({ query: z.string() }),
        execute: searchDatabase,
      },
    },
  });

  const result = await agent.stream({
    messages: [{ role: "user", content: `Research ${topic}` }],
    writable: getWritable(),
    maxSteps: 10,
  });

  return result.messages;
}
```

If the deployment redeploys mid-conversation, the agent picks up at the next tool call. If a tool throws, the step retries. The whole multi-turn conversation is recoverable from the run log — which is what makes "leave the agent running for an hour" actually safe in production.

## How it compares

| | Vercel WDK | Temporal | Inngest | Trigger.dev |
|---|------------|----------|---------|-------------|
| **Approach** | Compiler directives (`"use workflow"`, `"use step"`) | Explicit SDK with workflows, activities, signals | Explicit functions invoked by event/cron | Explicit task definitions |
| **Where it runs** | Vercel Functions (managed) or self-host | Self-host or Temporal Cloud | Inngest Cloud or self-host | Trigger.dev Cloud or self-host |
| **Setup** | `npm install workflow` + Next.js plugin | Run a Temporal cluster, define workers | SDK + Inngest dev server | SDK + Trigger.dev project |
| **Best for** | Teams already on Vercel; AI agents; product workflows | Enterprise orchestration, complex sagas | Event-driven background jobs | Background jobs and cron |
| **Lock-in** | Open source SDK; managed service is Vercel-specific | Open source; portable across runtimes | Cloud-managed default | Cloud-managed default |

WDK trades Temporal's explicit, portable APIs for tighter integration and a much shorter learning curve. The directive model is the differentiator — and the polarizing choice. Inngest's team has [argued for explicit APIs](https://www.inngest.com/blog/explicit-apis-vs-magic-directives) on grounds that compiler magic obscures execution semantics. The counter-argument is that durability is fundamentally a non-functional concern and pushing it into the type system rather than the call site keeps business logic readable.

## Pricing

WDK is open source and free to self-host. The managed Vercel Workflow service prices the runtime in three buckets:

- **Workflow Observability** — free during the public beta on every plan.
- **Workflow Steps** — billed per step execution at published rates.
- **Workflow Storage** — billed for the run log and step state.

Steps that run inside a workflow still consume the underlying Vercel Function compute, billed normally. The workflow-specific costs are on top of that, and they're what funds the durability layer (state persistence, replay, retry coordination).

## When to reach for WDK

- A multi-step pipeline where each step must complete before moving on, even if the host crashes.
- An AI agent that may run for minutes and call tools you do not want to repeat.
- A saga that charges money or provisions resources and needs compensation logic.
- A background job that pauses for a webhook, an editorial approval, or a scheduled trigger.
- Any code where "it timed out and the next request retried it from scratch" is not an acceptable failure mode.

When to skip it:

- Simple Route Handlers that finish in under a second.
- One-shot LLM calls with no tool use.
- Cron jobs that have no shared state and tolerate being re-run.

## Status and stability

WDK has been in public beta since October 2025. The `workflow` package is on npm; the source lives at [github.com/vercel/workflow](https://github.com/vercel/workflow). API surface area has shifted between betas — check the docs at [vercel.com/docs/workflow](https://vercel.com/docs/workflow) and [useworkflow.dev](https://useworkflow.dev) before pinning a version, and run `npx workflow@latest` periodically to pick up security and ergonomics fixes.

Frameworks supported today: Next.js, SvelteKit, Astro, Nitro, Express, Hono. TanStack Start and React Router are in development.

## Further reading

- [Vercel Workflow DevKit docs](https://vercel.com/docs/workflow)
- [useworkflow.dev](https://useworkflow.dev)
- [vercel/workflow on GitHub](https://github.com/vercel/workflow)
- [Workflow Builder template](https://vercel.com/templates/next.js/workflow-builder)

For other Vercel infrastructure references on this site, see [Vercel](/cloud-and-hosting/vercel), [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway), and [Vercel Blob](/cloud-and-hosting/vercel-blob).
