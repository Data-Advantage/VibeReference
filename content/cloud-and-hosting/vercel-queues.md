# Vercel Queues

Vercel Queues is a managed, durable event-streaming primitive built into the Vercel platform. You publish messages to topics, define consumer groups in your codebase, and the platform handles delivery, retries, partitioning, and visibility timeouts. It is the lower-level building block that powers [Vercel Workflow DevKit](/cloud-and-hosting/vercel-workflow), exposed as a standalone product for teams who need raw event streaming rather than full durable workflows.

## What it is

A queue in the Vercel sense is closer to a Kafka topic than to a classic AWS SQS queue. Messages are written to a topic, retained for a configurable window (60 seconds to 24 hours), and consumed by independent consumer groups that each track their own position. The system guarantees **at-least-once delivery**, with idempotency keys available for deduplication. Messages are durably written to three availability zones before `send()` returns.

The mental model:

- **Topic** — a stream of messages identified by name (`order-events`, `email-jobs`).
- **Message** — a JSON, buffer, or stream payload, optionally with headers and a delay.
- **Consumer group** — one or more deployed function routes that receive the topic's messages, each independently tracking which messages have been processed.
- **Two delivery modes** — *push* (Vercel invokes your function on each message) and *poll* (your code calls `receive()` and processes a batch).

If you have used SQS, EventBridge, or Cloudflare Queues, the shape is familiar. The differentiator is the integration: queues live in the same project as your functions, the platform authenticates with OIDC automatically, observability lives in the same dashboard as your other Vercel telemetry, and consumer routes are air-gapped from the public internet by default.

## Status and pricing

Vercel Queues entered **public beta on February 27, 2026** and is available on every plan.

| | |
|---|---|
| **Billing unit** | API operation — each `send`, `receive`, `delete`, visibility-timeout change, or push notification |
| **Rate** | $0.60 per 1M operations (regional pricing) |
| **Message metering** | Messages charged in 4 KiB chunks; a 12 KiB message counts as 3 operations |
| **Idempotent sends** | Sends with `idempotencyKey` are billed at 2× — the dedup machinery is the cost |
| **Push compute** | Functions invoked by push delivery are billed at the standard Fluid Compute rate |

Practical floor: a workload doing 10M operations a month with average message size under 4 KiB costs roughly $6 plus the function-time charges, before any volume tiering. For most application workloads, queue ops are a rounding error compared to the compute they trigger.

## Installing the SDK

```bash
npm install @vercel/queue
```

Node.js 22 or later is required. On Vercel, authentication happens automatically through OIDC. For local development or external infrastructure, set `VERCEL_QUEUE_API_TOKEN`.

## Sending messages

```ts
import { send } from "@vercel/queue";

const { messageId } = await send(
  "order-events",
  { orderId: "123", action: "created" },
  {
    delaySeconds: 30,
    idempotencyKey: "order-123",
    retentionSeconds: 3600,
    headers: { "x-trace-id": "abc" },
  },
);
```

Five options that matter:

- **`delaySeconds`** — make the message invisible until the delay elapses. Use this for the "follow up in 24 hours if no action" pattern without a scheduler of your own.
- **`idempotencyKey`** — deduplicate within the retention window. Two `send()` calls with the same key return the same `messageId`.
- **`retentionSeconds`** — message TTL. Default is 24 hours; minimum 60 seconds.
- **`headers`** — arbitrary metadata that travels with the message, surfaces in observability, and is available in the consumer.
- **Transport** — by default, messages are JSON. The `BufferTransport` accepts raw binary; `StreamTransport` accepts a `ReadableStream` for payloads up to the 100 MB limit.

## Push-mode consumer

A push-mode consumer is a Next.js (or any framework) route handler that Vercel invokes whenever a message is available on the topic. The route is *air-gapped from the public internet* — only the queue infrastructure can call it.

```ts
// app/api/queues/fulfill-order/route.ts
import { handleCallback } from "@vercel/queue";

export const POST = handleCallback(
  async (message, metadata) => {
    // metadata: messageId, deliveryCount, createdAt, expiresAt,
    //           topicName, consumerGroup, region
    await processOrder(message);
    // Returning normally acknowledges the message.
    // Throwing triggers retry with backoff.
  },
  {
    visibilityTimeoutSeconds: 600, // lease duration, default 300s
    retry: (error, metadata) => {
      if (metadata.deliveryCount > 5) {
        return { acknowledge: true }; // give up, do not retry further
      }
      const delay = Math.min(300, 2 ** metadata.deliveryCount * 5);
      return { afterSeconds: delay };
    },
  },
);
```

The trigger is wired in `vercel.json`:

```json
{
  "functions": {
    "app/api/queues/fulfill-order/route.ts": {
      "experimentalTriggers": [
        {
          "type": "queue/v2beta",
          "topic": "order-events",
          "retryAfterSeconds": 60,
          "initialDelaySeconds": 0
        }
      ]
    }
  }
}
```

Multiple route files subscribed to the same topic become **separate consumer groups** automatically — useful for fan-out (one event drives an email, an analytics row, and an external webhook in parallel without any of them blocking the others).

## Poll-mode consumer

For workloads that prefer their own loop — long-running workers, cross-cloud bridges, or batch processors — there is a polling client:

```ts
import { PollingQueueClient } from "@vercel/queue";

const { receive } = new PollingQueueClient({ region: "iad1" });

const result = await receive(
  "orders",
  "fulfillment",
  async (message, metadata) => {
    await processOrder(message);
  },
  { limit: 10 }, // up to 10 messages per poll
);

if (!result.ok && result.reason === "empty") {
  // no messages currently available
}
```

`receive()` automatically handles the visibility-timeout dance: messages are leased to the consumer for the timeout window, deleted on success, and re-released on failure or timeout. Up to ten messages can be claimed per poll.

## Per-region clients

By default, the SDK auto-selects a region. To pin a specific region (for cross-region workloads or compliance reasons), construct a client:

```ts
import { QueueClient } from "@vercel/queue";

const queue = new QueueClient({ region: "sfo1" });
export const { send, handleCallback } = queue;
```

Important constraint: messages sent to one region cannot be consumed from another. Pick a region per topic and stay there.

## Transports

| Transport | Use it for |
|-----------|------------|
| `JsonTransport` (default) | Anything JSON-serialisable. The 99% case. |
| `BufferTransport` | Raw binary payloads — image bytes, encoded protobufs. |
| `StreamTransport` | Large payloads via `ReadableStream`, up to the 100 MB ceiling. |

## Queues vs. Workflow vs. Cron

These three Vercel primitives overlap in confusing ways. The right pick depends on what you actually need:

| Need | Use | Why |
|------|-----|-----|
| Async fan-out and event routing | **Queues** | Topics, consumer groups, message-level retries |
| Multi-step business logic with state | **Workflow** | Deterministic replay, pause/resume — built *on top of* Queues |
| Recurring scheduled tasks | **Cron Jobs** | Simple time-based triggers, no message passing |
| Single delayed execution with deduplication | **Queues** (`delaySeconds` + `idempotencyKey`) | Precise delay with at-least-once delivery |
| Consuming from external systems | **Queues** (poll mode) | Works from any infrastructure, not just Vercel deployments |

If your code is reaching for a state machine, Workflow is almost always the better answer than building one on raw Queues. If your code is "publish event, do thing, done," Queues is the right primitive.

## Limits to know

| Resource | Default / Max |
|----------|---------------|
| Message retention | 60s minimum, 24h maximum (default 24h) |
| Max message size | 100 MB |
| Messages per `receive()` | 1–10 |
| Visibility timeout | 0s – 60 min (default 5 min in SDK; 60s at the API level) |
| Topics per project | Unlimited |
| Consumer groups per topic | Unlimited |
| Write ordering | Approximate, not strict FIFO |

The lack of strict FIFO is the one to internalise. If your workload depends on processing events in the exact order they were published, you need to add ordering in user-space (a sequence number plus a lookup at consume time) or pick a different primitive.

## Deployment partitioning

By default, push-mode topics are partitioned by **deployment ID**. Messages published from a deployment are delivered back to that same deployment. The practical effect: rolling out a new version of the consumer with a different message schema does not break the in-flight messages from the old deployment — they continue to be processed by the version that produced them.

This is convenient for forward compatibility and a meaningful operational difference from pure SQS or Kafka, where schema changes are a permanent migration burden. The trade-off: very long-tail messages (hours old) only finish if the originating deployment stays running. For workloads with day-long retention, plan accordingly.

## Observability

The Vercel dashboard exposes a Queues tab under each project's Observability section, with three views:

- **Project-level** — total messages per second, queued, received, deleted, with sparkline trends.
- **Queue-level** — throughput per second by consumer group, plus a critical metric: **max message age**, which tells you whether any consumer is falling behind.
- **Consumer-level** — processed, received, deleted per consumer group.

If `max message age` keeps climbing, a consumer is choking — usually a downstream dependency is slow or returning errors that trigger retries. The dashboard is the first place to look during an incident.

## Local development

Queues work in `vercel dev` without any local broker. When your code calls `send()` in development, the SDK publishes to the real Vercel Queue service and invokes your registered `handleCallback` handlers in-process. No Docker, no LocalStack, no separate queue runtime. The trade-off is that local development counts against your queue operation billing — fine for prototyping, worth being aware of for high-volume test loops.

## Common patterns

- **Defer expensive work.** A request handler publishes a message and returns instantly; the consumer does the slow work (PDF rendering, email send, third-party API call) without blocking the user.
- **Absorb traffic spikes.** A bursty source publishes thousands of messages a second; consumers process at a controlled rate. Backpressure is automatic — the queue is the buffer.
- **Crash-safe processing.** A consumer that crashes mid-message gets the message redelivered automatically once the visibility timeout expires.
- **Fan-out to independent pipelines.** Three consumer groups subscribed to the same topic each get every message. Add a fourth pipeline by adding a fourth route file — no upstream changes needed.
- **Single deduplicated job.** Use `idempotencyKey` to ensure that "send password reset email for user X" only fires once even if the upstream code retries.
- **Bridges from other clouds.** Poll-mode consumers running on AWS, GCP, or your own server can drain a Vercel-hosted queue, opening migration paths and hybrid deployments.

## When to reach for it

- An action in a request handler is slow, flaky, or non-essential to the response — defer it.
- Multiple downstream systems should react to the same event independently.
- A burst of work needs to be processed at a steady rate without rate-limiting upstream callers.
- A scheduled retry pattern (delay + idempotency) needs guaranteed-delivery semantics.

## When to skip it

- The work is fast and deterministic — just do it inline.
- The work is multi-step with state and explicit failure semantics — use [Workflow](/cloud-and-hosting/vercel-workflow), which is built on top of Queues but adds the orchestration layer.
- The work is on a wall-clock schedule (run nightly at 2 AM) — use a Cron Job.
- Strict FIFO is required and you cannot add ordering in user-space.

## How it compares

| | Vercel Queues | AWS SQS | Cloudflare Queues | Inngest / Trigger.dev events |
|---|---------------|---------|-------------------|------------------------------|
| **Delivery model** | At-least-once, push or poll | At-least-once, poll only (FIFO opt-in) | At-least-once, push or poll | At-least-once, event-driven |
| **Setup** | `npm install`, no infra | IAM, queue config, dead-letter wiring | Wrangler config | SDK + cloud account |
| **Observability** | Built into Vercel dashboard | CloudWatch | Cloudflare dashboard | Built-in |
| **Pricing** | $0.60 per 1M ops | $0.40 per 1M (standard) | Free tier + per-op | Per event / per workflow |
| **Best for** | Vercel-hosted apps | AWS-native architectures | Cloudflare Workers apps | Workflow-shaped tasks |

The pragmatic 2026 default for an app already on Vercel: Queues for plain event delivery, [Workflow](/cloud-and-hosting/vercel-workflow) when state and replay matter, Cron Jobs for time-based triggers. The three primitives compose; you do not need to pick exactly one.

## Further reading

- [Vercel Queues docs](https://vercel.com/docs/queues)
- [Queues quickstart](https://vercel.com/docs/queues/quickstart)
- [API reference](https://vercel.com/docs/queues/api)
- [@vercel/queue on npm](https://www.npmjs.com/package/@vercel/queue)

For other Vercel infrastructure references on this site, see [Vercel](/cloud-and-hosting/vercel), [Vercel Workflow DevKit](/cloud-and-hosting/vercel-workflow), [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox), [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway), and [Vercel Blob](/cloud-and-hosting/vercel-blob).
