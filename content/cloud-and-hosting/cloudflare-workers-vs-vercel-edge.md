---
description: Compare Cloudflare Workers and Vercel Edge Functions. Runtime, cold starts, global distribution, pricing, data stores, and when each platform wins.
---

# Cloudflare Workers vs Vercel Edge Functions

Cloudflare Workers and Vercel Edge Functions are the two mainstream ways to run JavaScript at the edge in 2026. They share a runtime philosophy (V8 isolates, Web Standards APIs, no containers) but target different kinds of teams. Workers is a general-purpose edge compute platform with the broadest global network. Vercel Edge is a first-class part of the Next.js deploy target, optimized for frontend-heavy teams.

## The Short Answer

Pick **Cloudflare Workers** when you care about global latency, edge-native storage, cost at scale, or framework-agnostic deploys. Pick **Vercel Edge Functions** when your app is Next.js (or any Vercel-hosted framework) and you want the deploy pipeline, preview URLs, and SSR integration to just work.

## Runtime Architecture

Both platforms run JavaScript inside V8 isolates — lightweight sandboxes that share a single V8 instance rather than spinning up a container per request. That is why cold starts are measured in milliseconds instead of hundreds of milliseconds.

Where they diverge:

- **Workers** uses a pure isolate model. An isolate is roughly 10 KB plus your code, with millions of isolates running on a single Cloudflare data center.
- **Vercel Edge** uses Fluid Compute, a V8-based runtime tuned for server-rendered React with extra memory headroom for larger page trees.

Both support Web Standards APIs (`fetch`, `Request`, `Response`, `Headers`, `URL`). Vercel Edge has slightly broader Node.js compatibility through polyfills; Workers has a `nodejs_compat` flag that covers an expanding subset of the Node standard library.

## Cold Start and Latency

Cloudflare Workers is the cold-start leader. Published sub-5ms cold starts across a 330+ city network are real in practice. Vercel Edge keeps active functions warm and achieves near-zero latency for hot endpoints, but cold starts outside the regions your app lives in are measurably slower.

If your product serves users globally and latency on the first request from Tokyo, São Paulo, or Lagos matters, Workers has a structural advantage. If your audience is concentrated in North America or Europe and your app is mostly SSR, the difference is rarely noticeable.

## Global Distribution

| Dimension | Cloudflare Workers | Vercel Edge Functions |
|-----------|-------------------|------------------------|
| Locations | 330+ cities | ~19 regions |
| PoPs | 300+ | 100+ edge locations |
| Anycast routing | Yes (native) | Yes |

Cloudflare's footprint is larger because Cloudflare is a network-first company. Vercel piggybacks on a smaller set of strategic regions. For most B2B SaaS, the Vercel footprint is fine. For consumer apps serving emerging markets, the Cloudflare footprint pays off.

## Bundle Size and Memory

- **Workers** — 1 MB compressed script on the free tier, 10 MB on paid. 128 MB of memory per request.
- **Vercel Edge** — 1 MB compressed for hobby, up to 4 MB on Pro. Fluid Compute allocates up to 2 vCPU and 4 GB RAM for SSR-heavy endpoints, though individual request memory is tighter.

Vercel's larger memory ceiling is the reason SSR of heavy React trees tends to benchmark faster on Vercel than on Workers. If you ship a minimal API or a small middleware layer, you will not hit either limit.

## CPU Time Limits

Workers enforces CPU time limits that have been progressively lifted:

- Free tier: 10 ms CPU per request (enough for most API work; generous in practice because I/O does not count).
- Paid tier: 30 seconds CPU per request.

Vercel Edge limits are similar for streaming responses, with longer caps for background-style work on Fluid Compute. Both are fine for typical web traffic. Long-running background jobs belong on a different compute model — Cloudflare Queues + Workers or Vercel Cron + a Node function.

## Pricing

| Platform | Free tier | Paid starting price |
|----------|-----------|---------------------|
| Cloudflare Workers | 100,000 requests/day | $5/month Workers Paid |
| Vercel Edge | Included with hobby plan | $20/month Pro plan |

At scale, Workers is meaningfully cheaper per invocation. Vercel's value is bundled with the rest of the Vercel stack (builds, bandwidth, analytics). If you already pay for Vercel for your frontend, Edge Functions are essentially free.

High-volume consumer apps with millions of requests per day almost always land cheaper on Workers. Low-volume internal tools or marketing sites are a wash.

## Data Stores at the Edge

This is often the deciding factor for real applications.

| Store | Cloudflare | Vercel |
|-------|-----------|--------|
| Key-value | Workers KV (global, eventually consistent) | Vercel KV (Redis, regional) |
| Object storage | R2 (no egress fees) | Vercel Blob |
| SQL database | D1 (SQLite, globally replicated) | Vercel Postgres (Neon), Supabase |
| Durable state | Durable Objects | — |
| Queues | Cloudflare Queues | — (external) |

Workers ships with edge-native storage primitives. You can stand up a read-heavy app with KV, a relational app with [D1](https://developers.cloudflare.com/d1/) or [Neon](https://neon.tech), and stateful coordination with Durable Objects, all without leaving Cloudflare's network.

Vercel's data story assumes you will use a managed third party — Neon, Supabase, PlanetScale, Upstash — and gives you a smooth integration. That is often fine; it just means the database sits in one region and edge functions need to reach for it.

## Framework and Deploy Experience

Vercel wins clearly on DX for Next.js. Zero-config Edge Runtime, automatic preview URLs per pull request, branch deploys, streaming SSR — all of it is built into the Vercel pipeline. Teams building on Next.js should default to Vercel Edge unless there is a specific reason not to.

Cloudflare's DX has improved dramatically with Wrangler, Cloudflare Pages, and the Next.js adapter, but there are still rough edges. Some Next.js features require workarounds or are not supported at all on Pages. For a greenfield Next.js app, Vercel is easier. For a SvelteKit, Hono, Remix, or custom app, the platforms are comparable.

## Cron and Background Work

- **Workers** — Cron Triggers are built in. Combine with Queues for durable background pipelines.
- **Vercel** — Cron Jobs are available on Pro and above. Background processing beyond a single request usually means an external queue.

For event-driven pipelines (webhook fan-out, scheduled jobs, rate-limited consumers), Cloudflare's Queues + Workers model is more complete.

## Observability

Both platforms offer built-in logs, basic metrics, and integrations with third-party observability tools. Vercel's Analytics and Speed Insights are the most polished out of the box. Cloudflare's Workers Observability adds tail logs, errors, and request traces on the paid tier, plus Logpush for exporting to your own SIEM.

If you want server-side [analytics](/devops-and-tools/analytics) tied directly to your deploy, Vercel is ahead. If you want granular request-level logs delivered to S3 or BigQuery, Cloudflare is easier.

## When to Choose Cloudflare Workers

- Global latency across many continents is a first-class product requirement.
- You want edge-native storage ([KV](/backend-and-data/nextjs-api), R2, D1, Durable Objects) without managing regional databases.
- Your app ships on a non-Next.js framework (Hono, Elysia, SvelteKit).
- Cost per request matters at your scale (millions/day).
- You need queues, cron, and durable state in one platform.

## When to Choose Vercel Edge Functions

- Your app is [Next.js](/frontend) (or will be).
- You want preview URLs, Git-based deploys, and instant rollbacks with no extra config.
- SSR of large React trees is your primary workload.
- Your team already pays for Vercel for the frontend and wants one bill, one dashboard.
- You can tolerate a smaller regional footprint in exchange for DX.

## Can You Mix Them?

Yes, and many teams do. A common pattern: Vercel hosts the frontend and Next.js app, while a small set of hot-path APIs — image resizing, webhook processing, global rate limiters — run on Cloudflare Workers in front of Vercel. The two platforms are interoperable over HTTP like any other services.

For most teams in 2026, the deciding question is simple. If you are a frontend-heavy team on Next.js, start on Vercel Edge. If you are an infrastructure-heavy team building APIs, middleware, or globally distributed logic, start on Workers. Either platform will scale past most startups' needs without forcing a rewrite.
