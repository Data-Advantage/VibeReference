# Webhook Delivery Services: Hookdeck, Svix, Inngest, ngrok, Webhook.site, Convoy, EventBridge

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and either sending webhooks to customers or receiving webhooks from third parties, this is the consolidated comparison for managed webhook infrastructure. Webhook delivery is the line item founders skip until customers complain "your webhook didn't fire" or your endpoint times out and Stripe stops trying. Most indie SaaS DIY webhooks (works at small scale; breaks at retry-storm), then realize at $1M ARR that Hookdeck or Svix at $99/mo would have prevented six incidents per quarter.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Hookdeck | Webhook gateway (in + out) | Free (limited) | $99/mo+ | Very high | Indie SaaS receiving + sending webhooks |
| Svix | Outbound webhook SaaS | Free (1K events) | $490/mo+ | High | SaaS sending webhooks to customers |
| Inngest | Event-driven workflows | Free (50K events/mo) | $50/mo+ | Very high | Background jobs + webhooks combined |
| Convoy | OSS webhook gateway | Free OSS | Self-host | High | OSS / privacy-first |
| ngrok | Local dev webhook tunneling | Free | $10/mo+ | Very high | Development; not production |
| Webhook.site | Webhook debugging | Free | $9/mo (Premium) | Very high | Debugging only |
| AWS EventBridge | AWS-native event bus | Pay-per-event | Pay-as-you-go | Low | AWS-heavy stacks |
| Knock | Notification orchestration (incl. webhooks) | Free trial | $200/mo+ | Medium | Notification-heavy SaaS |
| Vercel Queues | Bundled with Vercel | Bundled | Bundled | Very high | Already on Vercel |
| Trigger.dev | Workflow + jobs (incl. webhooks) | Free OSS / trial | $100/mo+ | High | Modern workflow engine |
| DIY (Postgres + cron) | Self-built | Free | $0 | Medium | Small scale; specific needs |

The first decision is **what shape of webhook problem you have**. Sending webhooks to customers (Svix / Hookdeck), receiving + processing webhooks (Hookdeck / Inngest), webhook debugging during dev (ngrok / Webhook.site), and bundled-with-event-bus (EventBridge / Vercel Queues) are four different problems with overlapping tools.

## Decide What You Need First

Tools are not interchangeable. Pick by direction + scale.

### Sending webhooks to customers (the 40% case)
You expose webhook events to your API customers. They register endpoints; you POST events.

Right tools:
- **Svix** — outbound webhook specialist
- **Hookdeck** — bidirectional
- **Inngest** — events + workflows
- DIY with retry queue

### Receiving / processing inbound webhooks (the 30% case)
You receive webhooks from Stripe / GitHub / Slack / etc. Need reliable processing.

Right tools:
- **Hookdeck** — receive + retry + filter
- **Inngest** — receive + workflow
- **Convoy** — OSS receiver
- DIY (per [VibeWeek inbound-webhooks-chat](https://www.vibeweek.com/6-grow/inbound-webhooks-chat))

### Both (bidirectional gateway) (the 20% case)
You both send to customers AND receive from third parties. Want unified infra.

Right tools:
- **Hookdeck** — best at both
- **Inngest** — events + jobs combined

### Development / debugging (the 10% case)
Local development webhook testing.

Right tools:
- **ngrok** — tunneling localhost to public URL
- **Webhook.site** — capture + inspect webhooks
- **Hookdeck** local dev features

For most indie SaaS in 2026: **Hookdeck for both directions; Svix if outbound-only with high volume; Inngest if you also want background jobs combined**. Skip EventBridge until AWS-mandated.

## Provider Deep-Dives

### Hookdeck — Modern Bidirectional Default
Hookdeck is the modern indie default for webhook infrastructure. Handles both sending AND receiving with retries, filtering, transformations.

Strengths:
- Bidirectional (in + out)
- Retry with exponential backoff
- Filter / transform incoming
- Replay events
- Modern dashboard
- $99/mo+ paid; free tier
- Vercel-friendly (handles 300s timeout reality)
- Local dev mode

Weaknesses:
- Pricing climbs at scale
- Newer than Svix

Pick when: you both send AND receive webhooks; want unified infra.

### Svix — Outbound Webhook Specialist
Svix specializes in outbound webhooks at scale. Used by SaaS like Brex, Resend.

Strengths:
- Outbound-focused
- Strong retry mechanics
- Customer-facing portal (webhooks.example.com)
- Operational events
- Sign + verify
- $490/mo+ Pro

Weaknesses:
- Outbound only
- Higher entry price
- Less DIY-friendly

Pick when: you send webhooks to many customers; want managed infrastructure.

### Inngest — Events + Workflows
Inngest combines event ingestion + background jobs (per [VibeWeek cron-scheduled-tasks-chat](https://www.vibeweek.com/6-grow/cron-scheduled-tasks-chat)) + webhooks in one platform.

Strengths:
- Event-driven workflows (workflow engine + webhooks)
- Free tier (50K events/mo)
- $50/mo+ Cloud
- Local dev with mock events
- Multi-language (TypeScript / Python / Go)

Weaknesses:
- Workflow-centric (some webhook scenarios feel awkward)
- Newer

Pick when: you have background jobs + want webhooks unified.

### Convoy — OSS Webhook Gateway
Convoy is open-source webhook gateway. Self-host or cloud.

Strengths:
- Open source
- Self-host option
- Modern features

Weaknesses:
- Self-host overhead
- Smaller community

Pick when: OSS / privacy-first preference; willing to self-host.

### ngrok — Development Tunneling
ngrok tunnels localhost to public URL. Used during development to receive webhooks.

Strengths:
- Free tier sufficient for dev
- Industry standard for webhook dev
- $10/mo+ paid (custom domain)

Weaknesses:
- Dev only (not production)
- URL changes on free tier

Pick when: developing webhook receivers locally.

### Webhook.site — Debugging
Webhook.site captures any webhook to a temporary URL for inspection.

Strengths:
- Free
- Quick debugging
- Inspect headers / payload / timing

Weaknesses:
- Debugging only
- Public URL

Pick when: troubleshooting "what does this webhook actually look like?"

### AWS EventBridge — AWS-Native Event Bus
EventBridge is AWS''s event bus / scheduler.

Strengths:
- Native AWS integration
- Pay-per-event ($1/M events)
- 100+ AWS service integrations
- Schemas + filtering

Weaknesses:
- AWS-only
- Less webhook-specific
- Configuration complexity

Pick when: AWS-heavy stack; want native event bus.

### Knock — Notification-Specialist with Webhooks
Knock (per [notification-providers](notification-providers.md)) handles multi-channel notifications including webhooks.

Strengths:
- Notification-focused (email + push + SMS + webhook)
- Preference management
- $200/mo+ Pro

Weaknesses:
- Notification-flavored (less "pure" webhook infra)
- Pricing climbs

Pick when: webhooks are part of broader notification strategy.

### Vercel Queues — Bundled
Vercel Queues (GA in 2025; per [vercel-queues](../cloud-and-hosting/vercel-queues.md)) provides durable event streaming.

Strengths:
- Bundled with Vercel
- Fluid Compute integration
- At-least-once delivery

Weaknesses:
- Vercel-only
- Less webhook-specialized than Hookdeck

Pick when: on Vercel; want bundled event handling.

### Trigger.dev — Modern Workflow Engine
Trigger.dev is workflow engine with webhook + cron + job features.

Strengths:
- Modern DX
- Workflow + webhook + jobs
- $100/mo+ Cloud
- OSS

Weaknesses:
- Workflow-centric

Pick when: similar to Inngest; pick on DX preference.

### DIY (Postgres + cron + retry)
Build your own with:
- Postgres table for outbox
- Cron / queue worker
- Retry logic
- Sign + verify (per [VibeWeek webhook-signature-verification-chat](https://www.vibeweek.com/6-grow/webhook-signature-verification-chat))

Strengths: full control; cheap
Weaknesses: significant engineering investment; reinventing wheels

Pick when: < 100K events/mo; specific custom needs; engineering team enjoys infrastructure.

## What Webhook Services Won''t Do

- **Replace signature verification.** Per [VibeWeek webhook-signature-verification-chat](https://www.vibeweek.com/6-grow/webhook-signature-verification-chat). Tool delivers; you verify on receipt.
- **Be free at scale.** Per-event or per-month pricing climbs.
- **Replace your endpoint reliability.** If your endpoint is broken: webhook service can''t fix it; just retries.
- **Fix bad event design.** Granular events (per-property change) overwhelm receivers; design events well.
- **Replace good documentation.** Customers need to integrate; document the events / signing / etc.

## Pragmatic Stack Patterns

**Indie SaaS receiving webhooks (Stripe / GitHub / etc.)**:
- Hookdeck or Inngest (managed receiver)
- DIY signature verification per provider
- Total: $0-99/mo

**Indie SaaS sending webhooks to customers**:
- Hookdeck or Svix
- Customer portal (Hookdeck has it; Svix has it)
- Total: $99-490/mo

**Bidirectional**:
- Hookdeck (does both)
- Total: $99/mo+

**On Vercel**:
- Vercel Queues (bundled)
- Plus Hookdeck for customer-facing webhook portal if outbound to customers
- Total: bundled + $0-99/mo

**OSS / privacy-first**:
- Convoy (self-host)
- Plus DIY components
- Total: $0 hosting

**Notification-heavy**:
- Knock
- Total: $200+/mo

**Development**:
- ngrok during dev
- Webhook.site for debugging
- Total: $0-10/mo

**Inngest pattern (events + jobs combined)**:
- Inngest for everything event-driven
- Total: $50/mo+

## Decision Framework: Three Questions

1. **What direction?** → Outbound only: Svix. Inbound only: Hookdeck / Inngest. Both: Hookdeck.
2. **Are you on Vercel / AWS?** → Vercel: Vercel Queues. AWS: EventBridge. Otherwise: Hookdeck / Inngest.
3. **What''s your scale?** → < 10K events/mo: free tier. 10-100K: $99/mo. 1M+: enterprise tier.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Hookdeck for bidirectional; Inngest if you also have background jobs; Svix for outbound-only at high volume**. Skip EventBridge unless AWS-mandated.

## Verdict

For most readers building a SaaS in 2026:
- **Default for bidirectional**: Hookdeck.
- **Default for outbound-only at scale**: Svix.
- **Events + workflows combined**: Inngest.
- **OSS preference**: Convoy.
- **AWS-native**: EventBridge.
- **On Vercel**: Vercel Queues + Hookdeck for customer portal.
- **Development tunneling**: ngrok.
- **Debugging payloads**: Webhook.site.
- **Notification-heavy**: Knock.
- **Modern workflow engine**: Trigger.dev.

The hidden cost in webhook delivery isn''t the seat fee — it''s **engineering time spent debugging "why didn''t the webhook fire?"** A founder who DIY-builds webhook infrastructure will spend 30 hours per quarter on retry logic, dead-letter handling, signature verification, etc. A managed service handles all of this. The fix: managed for production webhooks; DIY only at very small scale OR for specific custom needs.

## See Also

- [Notification Providers](notification-providers.md) — adjacent (Knock covered)
- [Background Jobs Providers](background-jobs-providers.md) — Inngest / Trigger.dev cross-listed
- [API Gateway Providers](api-gateway-providers.md) — adjacent
- [Webhook](webhook.md) — webhook fundamentals
- [Vercel Queues](../cloud-and-hosting/vercel-queues.md) — Vercel event bus
- [Vercel Functions](../cloud-and-hosting/vercel-functions.md) — adjacent
- [Workflow Automation Providers](../devops-and-tools/workflow-automation-providers.md) — adjacent (workflow engines)
- [VibeWeek: Outbound Webhooks](https://www.vibeweek.com/6-grow/outbound-webhooks-chat) — implementation
- [VibeWeek: Inbound Webhooks](https://www.vibeweek.com/6-grow/inbound-webhooks-chat) — implementation
- [VibeWeek: Webhook Signature Verification](https://www.vibeweek.com/6-grow/webhook-signature-verification-chat) — security
- [VibeWeek: Idempotency Patterns](https://www.vibeweek.com/6-grow/idempotency-patterns-chat) — replay protection
- [VibeWeek: Cron Jobs & Scheduled Tasks](https://www.vibeweek.com/6-grow/cron-scheduled-tasks-chat) — adjacent
- [VibeWeek: Public API](https://www.vibeweek.com/6-grow/public-api-chat) — webhooks as part of API

---

[⬅️ Backend & Data Overview](../backend-and-data/)
