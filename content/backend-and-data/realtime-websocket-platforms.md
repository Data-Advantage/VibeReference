# Realtime & WebSocket Platforms: Pusher, Ably, PubNub, Liveblocks, PartyKit, Supabase Realtime, Soketi, Hocuspocus

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building any product feature that needs sub-second update propagation in 2026 — live notifications, collaborative cursors, presence indicators, chat, real-time dashboards, multiplayer editors, live polls, sports/finance tickers, IoT telemetry — this is the consolidated platform comparison. Building your own WebSocket infrastructure in 2026 is technically possible (Node `ws`, Cloudflare Durable Objects, Phoenix Channels, etc.) but is rarely the right call for a SaaS team unless you have a very specific use case or are at scale where vendor cost dominates. Most teams that try to DIY end up rebuilding Pusher poorly, then migrating six months later. The right pick depends on your shape (broadcast-only vs. presence vs. collaborative-editing), team profile, and stage.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Pusher Channels | Pub/sub WebSocket as a service | Free (200K msgs/day) | $49/mo+ | No | High | Indie + mid-market broadcast use cases |
| Ably | Realtime infra (broadcast + advanced) | Free (3M msgs/mo) | $29/mo+ | No | High | Mission-critical realtime at scale |
| PubNub | Enterprise realtime / IoT | Free (200 conn) | Custom | No | Low | Enterprise + IoT-heavy use cases |
| Liveblocks | Collaborative apps SDK | Free (100 MAU) | $25/mo+ | No | Very high | Multiplayer editors / collaborative SaaS |
| PartyKit (Cloudflare-acquired) | Edge-native realtime + Durable Objects SDK | Free | Custom (Cloudflare) | Yes (Apache) | Very high | Modern, edge-first multiplayer |
| Supabase Realtime | Postgres-driven realtime | Free (200 conn) | Bundled with Supabase | Yes (Apache) | Very high | Supabase-native; data-driven realtime |
| Soketi | Pusher-protocol-compatible OSS | Free | Free (self-host) | Yes (MIT) | Very high | Pusher migration, self-host budgets |
| Hocuspocus | Yjs-based collaboration (TipTap team) | Free (OSS) | Custom (cloud) | Yes (MIT) | High | TipTap / Yjs-based collaboration |
| Centrifugo | OSS realtime server | Free | Free (self-host) | Yes (Apache) | High | DIY-friendly self-hosted broadcast |
| Cloudflare Durable Objects | Stateful primitives at edge | Bundled with Workers | Workers pricing | No (proprietary) | High | Building YOUR own realtime infra |
| Vercel WebSockets / Streaming | Streaming via Functions / Queues | Bundled | Bundled | No | High | Vercel-native; SSE-friendly |
| AWS API Gateway WebSockets | AWS-native WebSocket | Per-message | Pay-as-you-go | No | Medium | AWS-shop budgets; integration with Lambda |
| Fauna Streaming | DB-driven streams | Bundled | Fauna pricing | No | Medium | Fauna users |
| Hasura Realtime / Subscriptions | GraphQL subscriptions | Bundled with Hasura | Hasura pricing | No | Medium | Hasura-shop |
| Centrifuge.io | OSS Centrifuge SaaS | Free trial | Custom | Yes (OSS Centrifugo) | Medium | Hosted Centrifugo |

The first decision is **what shape of realtime you actually need**: simple pub/sub broadcast (Pusher / Ably / Soketi), presence + collaborative editing (Liveblocks / PartyKit / Hocuspocus), data-driven realtime (Supabase Realtime / Hasura Subscriptions), or DIY infrastructure (Cloudflare Durable Objects / API Gateway). Picking wrong here is the most common mistake — usually defaulting to Pusher when you actually needed Liveblocks, or hand-rolling on Durable Objects when Pusher's free tier would have worked.

## Decide What You Need First

Realtime platforms are not interchangeable. Get the shape wrong and you'll either pay for capability you don't use or hit a feature ceiling you didn't see coming.

### Broadcast / pub-sub (the 60% case)

You want to publish a message and have it reach all subscribers in real time: notifications, chat, live counters, basic presence ("X users online"), live dashboards.

Right tools:
- **Pusher Channels** — the indie default; battle-tested
- **Ably** — Pusher peer; better SLA + advanced features at scale
- **Soketi** — OSS Pusher-compatible; self-host alternative
- **Centrifugo** — OSS broadcast server; alternative shape
- **Supabase Realtime** — if you're already on Supabase

### Presence + collaborative editing (multiplayer SaaS)

You want live cursors, multiplayer documents, shared selections, conflict-free editing — the Notion/Figma/Linear shape.

Right tools:
- **Liveblocks** — best-in-class multiplayer SDK
- **PartyKit** — modern alternative; edge-native
- **Hocuspocus** — TipTap/Yjs ecosystem (if your editor is TipTap)
- **Yjs** + custom backend — DIY route

### Data-driven realtime (DB → client)

You want every database write to propagate to subscribed clients, e.g. "show new rows in this table immediately."

Right tools:
- **Supabase Realtime** — Postgres-native; CDC-driven
- **Hasura Subscriptions** — GraphQL subscriptions over Postgres
- **PowerSync** — offline-first sync
- **ElectricSQL** — local-first sync (newer category)

### IoT / telemetry / sub-second broadcast at scale

You're streaming sensor data, real-time bidding, financial tickers, gaming.

Right tools:
- **Ably** — strong on SLA + global presence
- **PubNub** — IoT-heavy enterprise
- **AWS IoT Core** — if AWS-bound

### DIY at edge

You want to build YOUR OWN realtime infra because you have specific requirements (game state, niche protocols, cost control).

Right tools:
- **Cloudflare Durable Objects** — stateful at edge
- **PartyKit** (Cloudflare-owned now) — DO with better DX
- **Vercel Functions** + streaming — for SSE / partial-streaming use cases

## Provider Deep-Dives

### Pusher Channels

The classic. Pusher (founded 2011, acquired by MessageBird 2020) was the first hosted-WebSocket-as-a-service product and remains the indie default for broadcast use cases. If you ask "where do I start with realtime?" the most common answer remains Pusher.

**Strengths:**
- Mature, battle-tested SDKs in every major language.
- Simple pub/sub API: subscribe to channel, publish message, done.
- Presence channels (built-in user list per channel).
- Private channels (server-authenticated).
- Encrypted channels (E2E for sensitive data).
- Webhooks for server-side notifications of client events.
- Solid uptime track record.
- Decent free tier (200K messages/day, 100 concurrent connections).
- Excellent docs.

**Weaknesses:**
- Pricing escalates fast at scale (>1M concurrent connections gets expensive).
- Limited compared to Ably for advanced features (geo-replication, message history beyond basic).
- Less innovation in 2024-2026 vs newer competitors (Liveblocks, PartyKit).
- Not for collaborative-editing use cases (no CRDT support).
- MessageBird acquisition: roadmap uncertainty for some teams.
- No real edge story.

**Pricing:** Free (200K msgs/day, 100 conn). Paid: $49/mo (Startup) → $99/mo (Pro) → custom enterprise. Costs scale with concurrent connections + message volume.

**Best for:** Indie / mid-market teams needing simple pub/sub broadcast. Notifications, chat, live counters, basic presence. The default if you don't need fancy.

### Ably

The "Pusher for serious workloads." Ably (founded 2016) competes head-to-head with Pusher on broadcast but adds enterprise-grade SLAs, global low-latency, message history, and advanced features.

**Strengths:**
- 99.999% uptime SLA (mission-critical-grade).
- Globally distributed: low latency from anywhere.
- Message history + replay (subscribers reconnecting can catch up).
- Push notifications integrated (mobile + web).
- Strong on data integrity guarantees (durable, ordered messaging).
- Generous free tier (3M messages/mo).
- Webhooks, integrations (Kafka, AMQP, Lambda, etc.).
- Solid SDKs across languages.
- Better than Pusher for workloads requiring delivery guarantees.

**Weaknesses:**
- Steeper learning curve than Pusher.
- More expensive than Pusher at small scale.
- Less innovation in collaborative-editing (not the right tool for Liveblocks-shaped use cases).
- Smaller community than Pusher.

**Pricing:** Free (3M messages/mo). Paid: from $29/mo. Production / enterprise custom.

**Best for:** Mission-critical realtime; sports/finance tickers; teams who outgrew Pusher; global audience needing low latency; teams who want delivery guarantees.

### PubNub

The IoT / enterprise pioneer. PubNub (founded 2010) was an early WebSocket-as-a-service contender, now positioned for enterprise + IoT workloads.

**Strengths:**
- Strong global low-latency network.
- IoT-heavy use cases supported (MQTT bridge, telemetry).
- Robust geo-fencing + presence.
- Enterprise-strong (SOC 2, HIPAA, FedRAMP).
- Functions (serverless inline message processing).
- Multi-tenant strong.
- Mature SDKs.

**Weaknesses:**
- Pricing is enterprise-tier; opaque.
- UI / DX feels older than competitors.
- Less indie-friendly.
- Smaller community than Pusher / Ably.
- Lost ground to Ably in mission-critical SaaS workloads.

**Pricing:** Free (200 concurrent). Paid: custom; expect $500-50K+/mo at any scale.

**Best for:** IoT-heavy enterprise; teams already on PubNub; regulated industries needing compliance.

### Liveblocks

The multiplayer specialist. Liveblocks (founded 2021) built the SDK for collaborative apps — live cursors, presence, multiplayer editors, comments, threads, notifications. If you're building "Figma but for X," Liveblocks is the answer in 2026.

**Strengths:**
- Best-in-class developer experience for multiplayer apps.
- Built-in presence (users, cursors, selections, custom data).
- CRDT-based collaborative storage (resolve conflicts automatically).
- Comments + threads SDK.
- Notifications SDK (in-app real-time).
- Excellent React + Next.js integration.
- AI Copilots SDK (real-time + LLM).
- Frequent updates; active community.
- Generous free tier (100 MAU).
- Roadmap-aligned with multiplayer SaaS trends.

**Weaknesses:**
- Pricing scales with MAU + storage; can get expensive at scale.
- Smaller for non-multiplayer use cases (don't pick this for "just notifications").
- React-first; other frameworks supported but less polished.
- Newer; less brand recognition than Pusher/Ably outside multiplayer space.

**Pricing:** Free (100 MAU). Paid: $25/mo (Pro) → custom. MAU-based.

**Best for:** Multiplayer SaaS — collaborative editors, whiteboards, design tools, project tools, anywhere users co-edit. Default for the Notion/Figma shape.

### PartyKit

The modern edge-native alternative. PartyKit (founded 2023, acquired by Cloudflare 2024) is built on Cloudflare Durable Objects with a developer-friendly SDK.

**Strengths:**
- Built on Durable Objects (stateful at edge; sub-100ms globally).
- Modern DX; TypeScript-first.
- Open-source SDK (Apache 2.0).
- Pricing: integrated with Cloudflare Workers.
- Innovation pace: fast.
- Pairs naturally with Yjs for collaborative editing.
- Good for game state / multiplayer / presence at scale.
- Cloudflare-backed reliability.

**Weaknesses:**
- Newer; less production-tested than Pusher/Ably/Liveblocks.
- Cloudflare-locked-in (you're really using Workers + DO).
- Smaller community.
- Less "complete-stack" than Liveblocks (you assemble more yourself).
- Pricing model still evolving post-acquisition.

**Pricing:** Free tier; Cloudflare Workers pricing applies.

**Best for:** Modern, edge-first teams. Cloudflare-based stacks. Multiplayer where you want lower-level control than Liveblocks. Game-state servers.

### Supabase Realtime

The Postgres-driven realtime. Supabase Realtime (Apache 2.0) is open-source and bundled with Supabase, providing CDC-based broadcasts (every Postgres change → subscribed clients).

**Strengths:**
- Bundled with Supabase (zero marginal cost if already on it).
- Postgres-native: subscribe to row-level changes.
- Broadcast channels for ad-hoc messaging.
- Presence channels.
- Open-source (Apache 2.0); self-host if needed.
- Modern, lean.
- RLS (Row Level Security) integrated for auth.
- Frequent updates.

**Weaknesses:**
- Tied to Supabase / Postgres ecosystem.
- Less optimized for non-DB-driven use cases.
- Connection limits on lower Supabase tiers.
- Postgres logical-replication can become a bottleneck at scale (>10K writes/sec).

**Pricing:** Free with Supabase free tier (200 concurrent). Bundled into paid Supabase tiers.

**Best for:** Supabase-native teams. Use cases where DB writes drive client updates ("when row changes, all clients see it"). Realtime dashboards on Postgres data.

### Soketi

The Pusher-compatible OSS. Soketi (MIT) implements Pusher's protocol — your existing Pusher SDKs work — but is self-hostable and free.

**Strengths:**
- 100% Pusher-protocol compatible (drop-in replacement).
- Self-host; control data sovereignty.
- Free (OSS).
- Lightweight (Node.js).
- Easy migration from Pusher: change endpoint URL.
- Good for high-volume teams hitting Pusher's pricing ceiling.

**Weaknesses:**
- You operate it (Kubernetes / your cluster).
- Smaller community than Pusher.
- No managed cloud option (self-host only).
- Lacks Pusher's advanced features (encrypted channels, etc.).
- Scaling beyond single-node requires Redis cluster work.

**Pricing:** Free (OSS); pay for your own infrastructure.

**Best for:** Cost-sensitive teams hitting Pusher pricing ceilings. Compliance-strict customers needing self-host. Pusher migrations.

### Hocuspocus

The Yjs-collaborative-editing backend. Built by the TipTap team, Hocuspocus is OSS realtime collaboration server based on Yjs CRDTs.

**Strengths:**
- Yjs-native (best CRDT library for collaborative editing).
- TipTap integration (most polished rich-text editor for collab).
- OSS (MIT).
- Webhooks for hooks (auth, persistence, broadcast).
- Cloud version available for managed.

**Weaknesses:**
- Tied to Yjs ecosystem (not for non-CRDT use cases).
- Smaller community than Liveblocks.
- More assembly required (you wire up auth, persistence yourself).
- Less polished UX for non-TipTap editors.

**Pricing:** Free (OSS). Cloud custom.

**Best for:** Teams using TipTap for collaborative editing. Yjs ecosystem teams. OSS-leaning collaborative-editing apps.

### Centrifugo / Centrifuge

The OSS realtime server. Centrifugo (Apache 2.0) is a Go-based realtime broadcast server.

**Strengths:**
- OSS, self-host.
- High performance (Go; tens of thousands of concurrent per node).
- Multiple transport: WebSocket, SSE, HTTP-streaming.
- Pluggable backends (Redis, Tarantool, etc.).
- Cloud option (Centrifuge.io).

**Weaknesses:**
- DIY ops if self-hosted.
- Smaller community than Pusher/Ably.
- Less polished SDKs than commercial competitors.
- Documentation sometimes thin for advanced features.

**Pricing:** Free (OSS). Cloud custom.

**Best for:** Self-hosted teams who don't want to use Soketi (some prefer Centrifugo's design).

### Cloudflare Durable Objects + WebSockets

The DIY edge primitive. Cloudflare Durable Objects are stateful workers — perfect for game state, real-time servers, custom WebSocket logic.

**Strengths:**
- Edge-native, sub-100ms globally.
- Stateful at scale (one DO can be source-of-truth for thousands of clients).
- Cheap (Workers pricing).
- Native WebSockets support.
- PartyKit makes the DX better.

**Weaknesses:**
- DIY; you write the logic.
- Cloudflare-locked-in.
- Steeper learning curve than Pusher/Ably.
- Custom SDK; no off-the-shelf protocols.

**Pricing:** Workers pricing; cheap.

**Best for:** Teams comfortable building infrastructure who want edge + cost control + custom logic.

### Vercel WebSockets / SSE Streaming

Vercel Functions on Fluid Compute support streaming responses (SSE — Server-Sent Events) and WebSockets in 2026.

**Strengths:**
- Bundled with Vercel; zero extra setup.
- SSE works great for one-way streaming (AI tokens, notifications, dashboards).
- Pairs with Vercel Queues for durable event streams.
- Edge regions globally.
- AI-streaming-native (e.g. AI SDK over SSE).

**Weaknesses:**
- Less fully-featured than dedicated realtime providers (no presence, no channels out of the box).
- WebSocket support newer; not as battle-tested as dedicated platforms.
- Best for simpler one-way patterns.

**Pricing:** Bundled with Vercel.

**Best for:** Vercel-native teams. AI-streaming (chat tokens to UI). Notifications. One-way realtime where complexity is low.

## What Realtime Platforms Won't Do

Useful to be clear-eyed about limits:

- **They won't fix bad data architecture.** A "realtime" feature that updates 10,000 clients on a single user action will overwhelm any platform. Design batching, throttling, and rate limits.
- **They won't replace your DB.** Pusher/Ably broadcasts ARE NOT durable storage. Persist to DB; broadcast notification of change.
- **They won't solve eventual consistency.** Real-time delivery is BEST-EFFORT in most products. Ably has strong delivery guarantees; Pusher/PubNub are best-effort. Pick accordingly.
- **They won't handle offline / sync-on-reconnect for free.** Most platforms require you to design re-fetch-on-reconnect logic. (Liveblocks + Yjs handle this well; pure pub/sub doesn't.)
- **They won't scale linearly with your team.** As realtime use grows, you'll hit cost-per-connection cliffs. Plan to revisit pricing every 12 months.
- **They won't give you collaborative editing for free.** "Realtime" ≠ "collaboration." Collaborative editing requires CRDTs (Yjs/Automerge) or OT — a separate product layer. Liveblocks/Hocuspocus include it; Pusher/Ably don't.
- **They won't solve presence at scale without thought.** "200K users in one channel watching presence" is a hard problem. Plan for fan-out, sampling, presence-pruning.

## Pragmatic Stack Patterns

Common patterns for B2B SaaS in 2026:

### Indie / pre-PMF

```
Pusher free tier (200K msgs/day) for notifications, chat, basic presence
+ Server-Sent Events (Vercel/Next.js) for one-way streams
+ no fancy collaboration yet
```

Rationale: don't pay for realtime until volumes justify. Pusher free tier covers a lot.

### Multiplayer-first SaaS (Notion/Figma/Linear shape)

```
Liveblocks (multiplayer SDK + storage + comments + presence)
+ for ancillary broadcast (notifications): Liveblocks Notifications API or Pusher
+ Yjs underneath where applicable
```

Rationale: Liveblocks is purpose-built; don't rebuild it.

### Modern edge-native multiplayer

```
PartyKit (Cloudflare DO + SDK)
+ Yjs for collaborative state
+ Pusher or your own broadcast for outside-the-multiplayer use cases
```

Rationale: edge-native, lower cost at scale, more control. Trades convenience for flexibility.

### Supabase-native team

```
Supabase Realtime (broadcast + DB-changes)
+ Liveblocks ONLY for multiplayer-editing surfaces (don't reuse Supabase Realtime for that)
```

Rationale: bundled cost; one less vendor.

### Mission-critical, global, high-volume

```
Ably (broadcast + delivery guarantees + global)
+ Liveblocks for multiplayer surfaces
+ AWS / GCP / Cloudflare-side queue (SQS / SNS / PubSub) for durable streams
```

Rationale: Ably's SLA is the differentiator; pair with platform-grade durability.

### Self-hosted / OSS-first

```
Soketi (Pusher-compatible) for broadcast
+ Hocuspocus (Yjs-based) for collaborative editing
+ Redis for state
+ self-deployed
```

Rationale: OSS-leaning teams; trades managed convenience for control.

### Vercel-native AI streaming

```
Vercel Functions + AI SDK + SSE streaming for AI chat
+ Pusher for in-app notifications outside the AI surface
+ Liveblocks if you have multiplayer
```

Rationale: stay in Vercel ecosystem for the AI streaming; complement with specialists.

### IoT / device-heavy

```
Ably or PubNub (proven IoT scale)
+ MQTT bridge if needed
+ Time-series DB (InfluxDB / Timescale) for stored telemetry
```

Rationale: IoT has unique requirements — mass connections, telemetry, presence at scale.

## Decision Framework

Use this five-question framework:

### 1. What shape do you actually need?

- **Broadcast only:** Pusher, Ably, Soketi, Centrifugo.
- **Presence + cursors + multiplayer editing:** Liveblocks, PartyKit (+Yjs), Hocuspocus.
- **Data-driven (DB → client):** Supabase Realtime, Hasura Subscriptions.
- **DIY at edge:** Cloudflare Durable Objects, PartyKit.

### 2. What's your scale?

- **<100K monthly conn-hours:** Pusher free or Ably free; Supabase if already on.
- **100K-1M:** Pusher Pro, Ably Production, Liveblocks Pro.
- **1M-10M:** Ably enterprise, Liveblocks Enterprise, Cloudflare DO.
- **>10M / global / mission-critical:** Ably enterprise, custom infra, PubNub for IoT.

### 3. Are you already on a stack that has realtime?

- **Supabase user:** Default to Supabase Realtime; add Liveblocks for multiplayer.
- **Vercel + AI:** Vercel SSE for AI streams; Pusher for general broadcast.
- **Hasura user:** Hasura Subscriptions for data-driven; specialist for the rest.
- **Cloudflare-heavy:** PartyKit / Durable Objects.

### 4. Compliance / data-residency requirements?

- **Strict (EU, healthcare, government):** Self-host Soketi or Centrifugo or Hocuspocus. Or Ably with EU regions.
- **Standard:** any cloud provider works.

### 5. Team profile?

- **Indie / DX-first:** Pusher (broadcast) or Liveblocks (multiplayer).
- **OSS-leaning / self-hosting comfortable:** Soketi or Centrifugo.
- **Modern / edge-first / TypeScript:** PartyKit, Liveblocks.
- **Enterprise:** Ably or PubNub.

## Verdict

For 2026 realtime infrastructure:

- **Default for indie broadcast:** **Pusher**. Boring, works, free tier real.
- **Default for multiplayer SaaS:** **Liveblocks**. The category leader for collaborative apps.
- **Modern edge-native multiplayer:** **PartyKit**. Cloudflare-backed; rising star.
- **Mission-critical / global / SLA-strict:** **Ably**. Worth the premium.
- **Supabase-native:** **Supabase Realtime**. Use what's bundled.
- **Vercel-native AI streaming:** **Vercel SSE / streaming + AI SDK**. Don't add Pusher just for AI tokens.
- **Self-hosted / OSS / cost-sensitive:** **Soketi** (Pusher-compatible) or **Centrifugo**.
- **Yjs-based collaborative editing:** **Hocuspocus**.
- **DIY at edge:** **Cloudflare Durable Objects** (with or without PartyKit SDK).
- **IoT / enterprise telemetry:** **Ably** or **PubNub**.

The most common mistake in 2026: defaulting to Pusher for multiplayer use cases. Pusher is great for broadcast — but presence + cursors + collaborative editing belongs in Liveblocks/PartyKit/Hocuspocus.

The second mistake: building DIY on Cloudflare Durable Objects when Pusher's free tier would have covered the use case for 12 months. Don't optimize prematurely; revisit when you outgrow.

The third mistake: skipping the durable-storage decision. Realtime broadcasts are NOT durable. Persist to DB first; broadcast notification second. The DB is your source of truth.

## See Also

- [Database Providers](./database-providers) — your source of truth; broadcast layer adds realtime
- [Background Jobs Providers](./background-jobs-providers) — durable async; pairs with realtime broadcast
- [Webhook Delivery Services](./webhook-delivery-services) — sister category for outbound events
- [Notification Providers](./notification-providers) — adjacent (push/email; not realtime in-app)
- [Search Providers](./search-providers) — adjacent (real-time search-as-you-type uses similar latency tooling)
- [Vercel Functions](../cloud-and-hosting/vercel.md) — Vercel-native realtime via Fluid Compute streaming
- [Supabase](./supabase) — bundled realtime offering
- [Convex](./convex) — adjacent reactive-database alternative
- [Convex AI Memory Tutorial](./convex-ai-memory-tutorial) — Convex-stack pattern
- [API Gateway Providers](./api-gateway-providers) — adjacent (some support WebSocket gateways)
- [Time-Series Database Providers](./time-series-database-providers) — adjacent for stored real-time data
- [Reverse ETL Providers](./reverse-etl-providers) — different motion (warehouse → SaaS, not realtime broadcast)
- [Data Pipeline & ETL Platforms](./data-pipeline-etl-platforms) — sister data-movement comparison
- [API Documentation Tools](./api-documentation-tools) — adjacent for documenting realtime APIs
