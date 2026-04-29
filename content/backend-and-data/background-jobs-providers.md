# Background Jobs and Queues: Inngest, Trigger.dev, Vercel Queues, Vercel Workflow, Upstash QStash, BullMQ, Temporal, Hatchet

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and need to run code that doesn't fit in a single HTTP request — async webhooks, scheduled jobs, long-running AI generation, durable multi-step workflows, retry-with-backoff on flaky third-party APIs — this is the consolidated comparison. Pick wrong and you bolt together cron + Redis + custom retry logic forever. Pick right and durable execution becomes a primitive you reach for without thinking.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Inngest | Event-driven durable workflows | DX, function-as-a-step pattern, replays | Free → $50/mo | Very high | Indie SaaS doing event-driven async work |
| Trigger.dev | Durable workflows + cron | OSS-friendly, GitHub-native, agent-friendly | Free → $20/mo | Very high | TypeScript-heavy teams, AI agents |
| [Vercel Queues](../cloud-and-hosting/vercel-queues.md) | Event streaming (durable, at-least-once) | Vercel-native, Fluid Compute | Public beta | High | Vercel-stack apps that want first-party queueing |
| [Vercel Workflow](../cloud-and-hosting/vercel-workflow.md) | Durable workflows (WDK) | Crash-safe step execution, Vercel-native | Public beta | High | Vercel-stack apps needing pause/resume orchestration |
| Upstash QStash | HTTP message queue | Serverless-friendly, REST-based | Free → $10/mo | High | Edge / serverless apps wanting simple HTTP queueing |
| Defer | Durable jobs | TypeScript-first, simple SDK | Free → $25/mo | High | TypeScript apps wanting simple background jobs |
| BullMQ | Self-hosted Redis queue | Maturity, Node ecosystem | Self-host (~$10/mo Redis) | Very high | Teams running their own infra with Redis |
| Hatchet | OSS durable execution | Self-host or cloud, Postgres-backed | Free / OSS | High | Teams wanting OSS-first durable execution |
| Temporal | Durable execution platform | Long-running workflows at scale | Free OSS / $0+ Cloud | Medium | Teams with complex multi-day workflows |
| AWS SQS + Lambda | Cloud-native queue + worker | AWS-native, scales | Pay-as-you-go | Low | Teams already deep in AWS |
| AWS Step Functions | Cloud-native workflows | AWS-native state machines | Pay-as-you-go | Low | AWS-heavy teams with complex orchestration |
| GCP Cloud Tasks / Pub/Sub | Cloud-native | GCP-native | Pay-as-you-go | Low | Teams already deep in GCP |

The first decision is **what shape of work**. Cron jobs, fire-and-forget async tasks, multi-step durable workflows, and high-throughput event streams are different problem categories with different best-in-class tools.

## Categorize the Work First

### Just-cron
You need to run code on a schedule — daily summary email, hourly cleanup, weekly billing job. No multi-step orchestration, no need to retry indefinitely, no parallelism worth tracking.

Right tools:
- **Vercel Cron** (built into Vercel) — schedule a route hit; works for most indie SaaS
- **GitHub Actions scheduled workflows** — surprisingly capable, free for public repos
- **Cron-job.org / EasyCron** — external HTTP-based cron, works regardless of your hosting

Skip the durable-execution category for plain cron. Adding Inngest or Temporal for "send a daily email" is overkill.

### Fire-and-forget async tasks
A user clicks "send invoices to all customers" and you want the request to return immediately while the work happens in the background. Each task is independent; some retry on failure; you don't need a multi-step workflow.

Right tools:
- **Upstash QStash** — HTTP POST to the queue, worker is a regular HTTP endpoint. Simple, serverless-friendly.
- **Vercel Queues** (public beta) — same shape, Vercel-native
- **BullMQ** if you're self-hosting and have Redis
- **Inngest / Trigger.dev** also work but are richer than necessary for simple fire-and-forget

### Multi-step durable workflows
"User signs up → wait 24h → send onboarding email 1 → wait 7 days → send onboarding email 2 → if user activated, branch A; else branch B." Each step might fail and need retries; the entire workflow needs to survive a server restart; you want the step graph visible somewhere.

Right tools:
- **Inngest** — event-driven, function-as-a-step, beautiful DX, indie default
- **Trigger.dev** — similar shape, more OSS-leaning, GitHub-native
- **Vercel Workflow** (WDK) — Vercel-native durable workflows
- **Temporal** — overkill for indie but unmatched for genuinely complex long-running orchestration
- **Hatchet** — OSS-first, Postgres-backed, growing in 2026

### High-throughput event streams
You're emitting hundreds of thousands of events per minute that fan out to many consumers. Order matters; durability matters; backpressure matters.

Right tools:
- **Vercel Queues** (public beta) — built on Fluid Compute
- **AWS SQS / Kinesis** — at scale
- **GCP Pub/Sub** — at scale
- **Apache Kafka / Confluent / Redpanda** — for true streaming, usually beyond indie SaaS scope

Most indie SaaS in 2026 do not have this problem and don't need event-streaming infrastructure. If you think you do, measure first.

### AI / agent workflows
Increasingly common: "an LLM call kicks off a multi-step agent that calls tools, waits for human approval, retries on rate limits, eventually returns a result hours later."

Right tools:
- **Inngest** — strong AI/agent support patterns, function-as-step works well for tool calls
- **Trigger.dev** — first-class agent runs, retries on LLM rate limits
- **Vercel Workflow** — durable execution semantics fit agent loops
- **Temporal** — true durable execution at scale

## Provider Deep-Dives

### Inngest — Event-Driven Durable Workflows
Inngest is the indie favorite for durable workflows in 2026. You define functions that listen to events; each step in a function is independently retried, persisted, and replayable.

Strengths:
- Beautiful DX (the dev server is best-in-class)
- Function-as-a-step pattern (each `step.run("name", () => ...)` is durable, retried, observable)
- Strong AI/agent support
- Generous free tier
- Good replay tooling for debugging
- Works with any framework (Next.js, Hono, Express, Bun, Cloudflare Workers)
- Step-level cancellation, sleep-until, parallel-fanout primitives

Weaknesses:
- Smaller ecosystem than the cloud-native options
- Some enterprise features (multi-region, dedicated infrastructure) require paid tiers
- "Vendor lock-in light" — you can self-host the OSS version but most teams use the cloud

Default for: most indie SaaS doing event-driven async work or AI/agent workflows in 2026.

### Trigger.dev — OSS-Forward Workflows
Trigger.dev is similar in shape to Inngest but with a stronger OSS lean and GitHub-native ergonomics. v3 (2024) was a significant rewrite that brought it to feature parity for most use cases.

Strengths:
- OSS-first (Apache 2.0); you can self-host fully
- GitHub-native deploy via `trigger.dev/cli`
- Strong agent / AI run support
- Good DX (improving fast)
- Generous free tier
- Frame-agnostic

Weaknesses:
- Smaller community than Inngest
- Self-hosting is real but operational
- Some niche primitives lag Inngest

Pick Trigger.dev when: you value OSS-first, you want self-host as an option, or your team prefers GitHub-native workflows.

### Vercel Queues — Vercel-Native Event Streaming
[Vercel Queues](../cloud-and-hosting/vercel-queues.md) is Vercel's durable event streaming primitive, public beta as of late 2025. Built on Fluid Compute.

Strengths:
- First-party Vercel integration (zero auth setup if you're on Vercel)
- At-least-once delivery
- Streaming semantics (multiple consumers per stream)
- Pricing tied to Vercel platform usage

Weaknesses:
- Public beta — not yet GA-promised stability
- Vercel-stack lock-in
- Less expressive than Inngest/Trigger for multi-step durable workflows

Pick Vercel Queues when: you're Vercel-native, you want first-party queueing, and your work is fire-and-forget or simple fan-out (not multi-step durable workflows).

### Vercel Workflow (WDK) — Vercel-Native Durable Workflows
[Vercel Workflow](../cloud-and-hosting/vercel-workflow.md), public beta, is Vercel's durable workflow SDK. Pause/resume, retries, step-based execution.

Strengths:
- Vercel-native, integrates with Functions and Queues
- Durable across crashes
- Step-based execution model
- TypeScript-first

Weaknesses:
- Public beta
- Vercel-stack lock-in
- Smaller community than Inngest/Trigger

Pick Vercel Workflow when: you're committed to Vercel, you want first-party durable execution, and you don't mind beta-stage maturity.

### Upstash QStash — HTTP Message Queue
QStash is a serverless message queue with an HTTP API. POST a message; QStash delivers it to your worker URL with retry semantics. Simple, edge-friendly.

Strengths:
- HTTP-based — works from any runtime (edge, serverless, regular Node)
- Generous free tier
- Built-in scheduling (cron-style)
- Retry policy with exponential backoff
- Signature verification for inbound deliveries

Weaknesses:
- Not a durable workflow tool — single-message delivery, not multi-step
- Each delivery is an HTTP call, so latency-sensitive workloads have overhead
- Smaller feature set than Inngest/Trigger

Pick QStash when: you want simple, HTTP-based queueing without learning a new SDK, and your jobs are mostly fire-and-forget.

### Defer — Simple Durable Jobs
Defer focuses on TypeScript developers who want background jobs without the complexity of durable workflows.

Strengths:
- Clean SDK (`defer(myFunction)` and call it from anywhere)
- Free tier generous
- Good observability dashboard
- Lightweight learning curve

Weaknesses:
- Smaller feature set than Inngest/Trigger
- Smaller community
- Less expressive for multi-step workflows

Pick Defer when: you want background jobs as a one-line SDK and your needs aren't multi-step orchestration.

### BullMQ — Self-Hosted Redis Queue
BullMQ is the modern Node.js job queue built on Redis streams. Self-hosted; you bring the Redis.

Strengths:
- Mature (BullMQ is the successor to Bull, which has been around since 2014)
- Strong Node.js ecosystem
- Bull Board / Arena dashboards for inspection
- No vendor lock-in
- Cheap (Redis on Upstash for ~$10/mo handles a lot of throughput)

Weaknesses:
- You operate it (Redis sizing, persistence config, retention policy)
- Not edge-friendly (needs persistent Redis connection from worker)
- Less expressive than durable workflows for multi-step orchestration
- Workers need to be long-running; doesn't fit pure-serverless

Pick BullMQ when: you have or want long-running Node workers, you don't mind operating Redis, and you want the OSS-everywhere pattern.

### Hatchet — OSS Durable Execution
Hatchet is a newer (2023) OSS durable execution platform built on Postgres. Cloud version available.

Strengths:
- Postgres-backed (you already have a database)
- OSS-first (MIT license)
- Self-hostable end-to-end
- Step-based durable execution
- Growing community in 2026

Weaknesses:
- Younger than Inngest/Trigger
- Smaller ecosystem of integrations
- Self-hosting is real ops work

Pick Hatchet when: you want true OSS-first durable execution with the option to fully self-host.

### Temporal — Durable Execution at Scale
Temporal is the heavyweight of durable execution. Originally Uber's Cadence. Used by Stripe, Snap, Coinbase, Snowflake.

Strengths:
- Best-in-class for genuinely complex multi-day workflows
- OSS (MIT) with Cloud option
- Polyglot (Go, TypeScript, Java, Python, .NET, PHP, Ruby SDKs)
- Battle-tested at massive scale

Weaknesses:
- Steep learning curve (worker / activity / workflow concepts)
- Operational complexity for self-host
- Cloud pricing scales fast at high volume
- Overkill for indie SaaS unless your workflow shape demands it

Pick Temporal when: you have polyglot services, multi-day workflows, or are explicitly building toward enterprise scale where Inngest/Trigger don't yet have the same operational track record.

### AWS SQS + Lambda
The cloud-native default in AWS-heavy teams. SQS is the queue; Lambda is the worker. Step Functions adds workflow semantics.

Pick when: you're already deep in AWS and the operational team prefers AWS-native tooling. Skip when starting fresh — the DX gap vs Inngest/Trigger is significant for indie teams.

### GCP Cloud Tasks + Pub/Sub
Same shape on GCP. Cloud Tasks for queues, Pub/Sub for streaming, Workflows for orchestration.

Pick when: GCP-deep teams. Skip otherwise.

## What None of Them Solve

- **Idempotency.** Every retry semantics requires you to design idempotent handlers. The provider gives you "at-least-once delivery"; you have to handle the "least-once" case where a job runs twice. Use unique job IDs and track completion in your own database.
- **Backpressure on third-party APIs.** When OpenAI rate-limits you, the queue keeps adding jobs. The retry policy has to know not to keep hammering. Most providers offer rate-limited concurrency as a primitive; configure it.
- **Cost observability.** A runaway job that fires 10K times before someone notices is real money on every cloud-native provider. Set hard concurrency caps and alert on unusual queue depth.
- **Workflow versioning.** When you ship a new version of a workflow that's currently running, what happens to in-flight executions? Each provider handles this differently; read the docs before you ship the change.
- **Ordering guarantees.** Most providers default to no-order or partial-order. If your workflow requires strict ordering, you're either using FIFO queues or tracking ordering yourself.
- **Local development experience.** Some providers' local dev story is great (Inngest's dev server is a standout); others require a real cloud connection to work. Plan for it before the team is dependent.

## Pragmatic Stack Patterns

**Indie SaaS, just-cron + occasional async tasks**:
- Vercel Cron for scheduled jobs (free)
- Upstash QStash for fire-and-forget tasks ($0–$10/mo)
- Total: $0–$10/mo. Don't add complexity.

**Indie SaaS, real durable workflows (onboarding sequences, AI agents, multi-step business logic)**:
- Inngest or Trigger.dev (free tier → $20-50/mo as you scale)
- Vercel Cron for plain scheduled jobs you don't want to run through Inngest
- Total: $0–$50/mo

**Vercel-native, all-in on platform**:
- [Vercel Cron](../cloud-and-hosting/vercel-functions.md) for schedules
- [Vercel Queues](../cloud-and-hosting/vercel-queues.md) for fire-and-forget
- [Vercel Workflow](../cloud-and-hosting/vercel-workflow.md) for durable workflows
- All on the Vercel bill

**TypeScript team that wants OSS-first**:
- Trigger.dev (cloud or self-host) for workflows
- Vercel Cron / GitHub Actions for plain scheduled jobs

**Self-hosted, Node-heavy team**:
- BullMQ + Redis (Upstash, Railway, Fly) for queues
- node-cron or GitHub Actions for schedules
- Bull Board for inspection

**Polyglot scale (mid-market+, multiple service languages)**:
- Temporal Cloud
- Polyglot worker fleet
- Budget: $500-$5K/mo depending on usage

**AI agent-heavy product**:
- Inngest or Trigger.dev — both have strong agent run support
- Combined with [observability](../devops-and-tools/observability-providers.md) (Helicone or Langfuse) for the LLM calls themselves

## Decision Framework: Three Questions

1. **Are you on Vercel and want first-party?** → Vercel Queues + Vercel Workflow + Vercel Cron. Stop here.
2. **Do you need multi-step durable workflows?** → Inngest (default) or Trigger.dev (OSS-leaning). Stop here.
3. **Do you only need fire-and-forget tasks or cron?** → Vercel Cron + Upstash QStash. Stop here.

Three questions, three picks. Most indie SaaS in 2026 will land on either Inngest/Trigger or the Vercel-native trio. Don't reach for Temporal unless you can articulate why Inngest/Trigger don't fit your workload.

## Verdict

For most readers building a SaaS in 2026:
- **Default for durable workflows**: Inngest. The DX is best-in-class and the free tier is generous.
- **OSS-leaning team**: Trigger.dev or Hatchet.
- **Vercel-stack apps**: Vercel Queues + Vercel Workflow.
- **Simple async tasks + cron**: Vercel Cron + Upstash QStash.
- **Self-host with Redis**: BullMQ.
- **Genuine enterprise scale, polyglot**: Temporal.

Most importantly: **don't over-engineer.** The "I'll set up Temporal because we'll definitely need it" trap kills 6 weeks of engineering for a workload that runs 200 jobs a day. Pick the simplest tool that handles your current shape; revisit at the next plateau.

## See Also

- [Vercel Queues](../cloud-and-hosting/vercel-queues.md) — deep-dive on the Vercel-native event stream
- [Vercel Workflow](../cloud-and-hosting/vercel-workflow.md) — deep-dive on Vercel's durable workflow SDK
- [Vercel Functions](../cloud-and-hosting/vercel-functions.md) — the runtime workers run on
- [Vercel Sandbox](../cloud-and-hosting/vercel-sandbox.md) — for jobs that need isolated code execution
- [Database Providers](database-providers.md) — for state durability backing your jobs
- [Observability Providers](../devops-and-tools/observability-providers.md) — for monitoring queue depth and worker health
- [AI Agent Frameworks](../ai-development/ai-agent-frameworks.md) — for agent-shaped workloads
- [AI Agent Orchestration](../ai-development/ai-agent-orchestration.md) — companion for orchestrating agent calls

---

[⬅️ Backend & Data Overview](../backend-and-data/)
