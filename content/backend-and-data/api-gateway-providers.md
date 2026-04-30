# API Gateway Providers: Kong, Tyk, AWS API Gateway, Cloudflare, Zuplo, KrakenD, Apigee, Gravitee

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and trying to pick an API gateway, this is the consolidated comparison. API gateways are the line item founders skip until their public API has 50 customers and authentication, rate-limiting, analytics, and quota enforcement become impossible to manage in application code. Most indie SaaS over-rely on Express middleware and a Postgres rate-limit table for too long, then jump to Kong (overkill at the indie tier) when Cloudflare API Gateway, Zuplo, or AWS API Gateway would have served them through $5M ARR. Pick the right shape and gateway concerns become invisible plumbing; pick wrong and your engineering team owns a piece of infrastructure they shouldn't be operating.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Cloudflare API Gateway | Edge / managed | Free (limits) | $25/mo (Pro) | Very high | Indie SaaS already on Cloudflare |
| Zuplo | Modern serverless gateway | Free (5K req/mo) | $250/mo (Pro) | Very high | API-first SaaS wanting modern DX |
| AWS API Gateway | Managed cloud-native | Free (1M req/mo) | Pay-per-request | Medium | Already on AWS |
| Kong Gateway | Self-hostable + Konnect cloud | OSS free | $250/mo (Plus) | Medium | Mid-market with custom needs |
| Tyk | Self-hostable + cloud | OSS free | Custom | Medium | Self-host + multi-region |
| KrakenD | Open-source aggregator | OSS free | Self-host or Enterprise | High | Backend-for-frontend aggregation |
| Apigee (Google) | Enterprise gateway | Trial | $500/mo+ | Very low | Enterprise multi-team / hybrid cloud |
| Azure API Management | Microsoft enterprise | Free (consumption) | $0.07/10K req | Low | Already on Azure |
| Gravitee | Open-source enterprise | OSS free | Custom | Medium | Open-source enterprise |
| MuleSoft Anypoint | Enterprise (Salesforce) | Custom | $$$ | Very low | Salesforce-heavy enterprise |
| Hono / Express + middleware | DIY in-app | Free | $0 | Very high | <50 API consumers; small surface |
| Vercel + Routing Middleware | Edge serverless | Bundled | Bundled | Very high | Vercel apps with light gateway needs |

The first decision is **whether you need a dedicated gateway at all**. Many indie SaaS run perfectly fine with framework middleware (Hono, Express, Next.js Routing Middleware) until the API has external developers, multiple authentication schemes, complex rate-limiting, or revenue-critical SLAs. Don't add Kong because the diagram looks more "real."

## Decide What You Need First

API gateways are not interchangeable. Pick by the actual job to be done.

### In-app middleware (the 60% case for indie SaaS)
You have a small public API surface (<20 endpoints), single authentication scheme (API keys or JWT), basic rate-limiting, and <50 external consumers.

Right tools:
- **Hono / Express / Fastify middleware** — auth + rate-limit in your app code
- **Next.js Routing Middleware** (per [vercel-routing-middleware](../cloud-and-hosting/vercel-routing-middleware.md))
- **Vercel Functions** with built-in JWT helpers
- Skip dedicated gateway entirely

### Managed cloud gateway (the 25% case)
You've outgrown middleware: multiple authentication schemes, quota enforcement per customer, public developer portal, request transformation. You don't want to operate gateway infrastructure.

Right tools:
- **Cloudflare API Gateway** — if already on Cloudflare
- **Zuplo** — modern indie/mid-market default
- **AWS API Gateway** — if on AWS
- **Azure API Management** — if on Azure

### Self-hosted gateway (the 10% case)
You have specific compliance requirements (data residency, air-gapped), heavy custom plugin needs, or run multi-cloud/hybrid.

Right tools:
- **Kong Gateway (OSS)** — most mature
- **Tyk** — solid alternative
- **KrakenD** — for BFF aggregation
- **Gravitee** — for open-source enterprise

### Enterprise (the 5% case)
You're a mid-market+ company with multiple teams shipping APIs, formal API governance, partner-facing developer portals, hybrid-cloud topology.

Right tools:
- **Kong Konnect** (managed Kong)
- **Apigee** (Google)
- **MuleSoft Anypoint** (Salesforce)
- **Azure APIM** (premium tier)

For most indie SaaS in 2026: **stay in middleware until you can't; then Cloudflare API Gateway or Zuplo**. Skip Kong/Apigee until enterprise.

## Provider Deep-Dives

### Cloudflare API Gateway — The Edge-Native Default
Cloudflare API Gateway sits on top of their existing CDN/Workers stack. If your traffic is already going through Cloudflare, this is nearly zero-friction.

Strengths:
- Bundled with Cloudflare (per [cloudflare](../cloud-and-hosting/cloudflare.md))
- Edge-deployed (low latency globally)
- mTLS, JWT validation, schema validation built in
- Free tier covers many indie SaaS
- Strong DDoS protection bundled
- $25/mo Pro tier
- Tight integration with Workers + Durable Objects

Weaknesses:
- Less developer-portal capability than Kong / Apigee
- Cloudflare-only (lock-in)
- Custom plugin model is Workers-based (capable but niche)

Pick when: you're already on Cloudflare and want gateway capability without operating new infrastructure.

### Zuplo — Modern Serverless Gateway
Zuplo emerged as a developer-first API gateway. Edge-deployed, code-based config (TypeScript), fast to set up.

Strengths:
- Code-based config (Git-managed)
- Edge runtime (low latency)
- Built-in developer portal generation
- Free tier (5K req/mo) for trial
- $250/mo Pro tier
- Modern DX (TypeScript / React-flavored)
- Strong API-key + JWT auth out of box
- Quota / rate-limit per customer built in

Weaknesses:
- Smaller community than Kong
- Newer (less battle-tested at scale)
- Pricing climbs at high request volumes

Pick when: you're API-first SaaS, want modern DX, and Cloudflare isn't already in the stack.

### AWS API Gateway — Managed AWS Native
AWS API Gateway is the obvious pick if your backend is on AWS. Tight Lambda integration; pay-per-request pricing.

Strengths:
- Native to AWS ecosystem
- Free tier (1M req/mo for first 12 months)
- Pay-per-request after ($1-3.50/M depending on type)
- HTTP API + REST API + WebSocket variants
- Native Lambda integration
- IAM-based authorization
- Stage-based environments

Weaknesses:
- AWS-only (lock-in)
- Configuration via CloudFormation / Terraform — not great DX
- Cold-start latency on Lambda integrations
- Two product variants (HTTP vs REST API) confuse new users
- Developer portal is weak

Pick when: you're on AWS and want the path of least resistance.

### Kong Gateway — Self-Hostable + Konnect Cloud
Kong is the long-standing open-source gateway. Self-host (OSS) or use Konnect (managed).

Strengths:
- Most mature OSS API gateway
- Plugin ecosystem (auth, rate-limiting, transformations, etc.)
- Self-host or managed (Konnect)
- Strong developer portal (Konnect)
- Active community
- $250/mo+ Plus tier (Konnect)
- Service mesh option (Kong Mesh)

Weaknesses:
- Self-host requires Postgres + DevOps
- Konnect pricing climbs at scale
- Heavy product surface; learning curve
- Lua-based plugins (or Go via Plugin Server)

Pick when: you have specific custom plugin needs, multi-cloud topology, or heavy enterprise governance requirements.

### Tyk — Self-Hostable + Cloud
Tyk is similar in shape to Kong. Open-source with managed cloud option.

Strengths:
- OSS gateway with reasonable feature parity to Kong
- Strong multi-region support
- GraphQL Federation built in
- Developer portal
- Self-host or Tyk Cloud

Weaknesses:
- Smaller community than Kong
- UI / DX behind Zuplo / Konnect
- Sales-led for enterprise

Pick when: you want self-host alternative to Kong, or multi-region is critical.

### KrakenD — BFF Aggregator
KrakenD is purpose-built for backend-for-frontend (BFF) aggregation — composing multiple downstream APIs into a single response.

Strengths:
- Excellent at multi-source aggregation
- Stateless (no DB)
- High performance
- Open-source
- Declarative config (JSON)

Weaknesses:
- Not a general-purpose gateway (no plugin ecosystem like Kong)
- Limited auth options
- Smaller community

Pick when: you specifically need to aggregate microservices into a unified API; not for general API management.

### Apigee — Enterprise Gateway
Apigee (Google-owned) is the long-standing enterprise API management platform. Strong governance, expensive.

Strengths:
- Most comprehensive enterprise feature set
- Strong developer portal
- API monetization features
- Hybrid-cloud topology
- Compliance + audit support

Weaknesses:
- $500/mo+ entry; enterprise tiers $1K+/mo
- Sales-led implementation (months)
- Complex product surface
- Overkill for indie SaaS

Pick when: enterprise with multi-team API governance; budget supports it; have a platform team to operate.

### Azure API Management — Microsoft Enterprise
Azure APIM is similar to Apigee. Native to Azure ecosystem.

Strengths:
- Native to Azure (per [azure](../cloud-and-hosting/azure.md))
- Consumption tier (pay-per-request)
- Strong developer portal
- Enterprise compliance

Weaknesses:
- Azure-only
- Heavy DX
- Pricing climbs

Pick when: you're on Azure and want native gateway.

### Gravitee — Open-Source Enterprise
Gravitee is OSS-first enterprise gateway with strong access management.

Strengths:
- OSS with enterprise features
- Strong AM (access management) capabilities
- Event-native (Kafka / MQTT support)
- Developer portal

Weaknesses:
- Smaller community than Kong
- Self-host or Gravitee Cloud

Pick when: you want OSS-first with enterprise capability and event-streaming support.

### MuleSoft Anypoint — Salesforce Enterprise
MuleSoft (Salesforce-owned) is integration-platform heavy. API gateway is part of the broader stack.

Strengths:
- Tight Salesforce integration
- Enterprise-grade
- Integration-platform breadth (iPaaS + gateway)

Weaknesses:
- Very expensive
- Enterprise sales-led
- Integration-stack lock-in

Pick when: you're Salesforce-heavy enterprise; budget supports it.

### DIY in-app middleware (Hono / Express / Fastify)
Most indie SaaS start here and stay here. Auth + rate-limit + logging in application code is fine until the API surface gets big.

Strengths:
- Zero infrastructure to operate
- Full control
- Free
- Fast iteration

Weaknesses:
- Can't enforce gateway-style policies across multiple services
- Per-customer quota is hand-rolled
- No developer portal
- No standardized API analytics

Pick when: API surface is small (<20 endpoints), <50 external consumers, no developer portal needed.

## What API Gateways Won't Do

- **Replace authentication.** Gateways validate tokens; identity provider issues them. Per [authentication-providers](../auth-and-payments/authentication-providers.md).
- **Replace API design.** A gateway can't make a bad API good. Design first; deploy through gateway second.
- **Replace observability.** Gateway gives surface metrics; full tracing needs APM (per [error-monitoring-providers](../devops-and-tools/error-monitoring-providers.md)).
- **Replace rate-limit logic in application.** Some rate-limits are business logic (per-customer per-feature) — keep close to the data.
- **Be free of cost at high volume.** Pay-per-request pricing adds up. Always model the cost at projected scale.
- **Replace WAF.** Gateways do API-shape validation; WAF blocks attacks. Use both (per [bot-detection-providers](../devops-and-tools/bot-detection-providers.md)).

## Pragmatic Stack Patterns

**Indie SaaS, internal API + small public surface**:
- Hono / Express middleware
- Total: $0 (in-app)

**Indie SaaS already on Cloudflare**:
- Cloudflare API Gateway
- Total: $25/mo Pro

**API-first SaaS not on Cloudflare**:
- Zuplo
- Total: $0-250/mo

**SaaS on AWS**:
- AWS API Gateway HTTP API
- Total: $0-200/mo (depends on volume)

**Mid-market with custom needs**:
- Kong Konnect
- Total: $250-2K/mo

**Enterprise**:
- Apigee or Azure APIM
- Total: $500+/mo

**BFF aggregation specifically**:
- KrakenD (open-source)
- Total: $0 self-host + infra

## Decision Framework: Three Questions

1. **Do you have an external API with paying developers?** → No: stay with middleware. Yes: continue.
2. **Are you already on Cloudflare / AWS / Azure?** → Yes: use their gateway. No: Zuplo or Kong.
3. **Do you need a developer portal + multi-team governance?** → No: managed (Cloudflare / Zuplo). Yes: Kong Konnect or Apigee.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **middleware until you can't; then Cloudflare or Zuplo; then Kong if self-host is required**. Skip Apigee until enterprise.

## Verdict

For most readers building a SaaS in 2026:
- **Default for small API surface**: Hono / Express middleware.
- **Default for Cloudflare users**: Cloudflare API Gateway.
- **Default for API-first SaaS**: Zuplo.
- **AWS-native**: AWS API Gateway.
- **Mid-market with self-host requirement**: Kong (OSS or Konnect).
- **BFF aggregation**: KrakenD.
- **Enterprise**: Apigee or Azure APIM.

The hidden cost in API gateways isn't the seat fee — it's **adopting too early.** A founder who deploys Kong at 5 endpoints and 3 internal consumers spends 2 weeks on configuration that could have been a 4-line Hono middleware. The right time to add a gateway is when middleware genuinely creaks: external developer portal needed, per-customer quotas required, multiple auth schemes converging, or revenue-critical SLAs at risk. Until then, in-app is faster, cheaper, and more flexible.

## See Also

- [Database Providers](database-providers.md) — gateway backs onto DB
- [Background Jobs Providers](background-jobs-providers.md) — async work after gateway
- [Rate Limiting](rate-limiting.md) — gateway enforces it
- [API Integration](api-integration.md) — consuming third-party APIs
- [API](api.md) — API design fundamentals
- [Webhook](webhook.md) — webhook ingestion patterns
- [Cloudflare](../cloud-and-hosting/cloudflare.md) — Cloudflare ecosystem
- [Vercel Routing Middleware](../cloud-and-hosting/vercel-routing-middleware.md) — Vercel''s gateway-lite
- [AI Gateways](../cloud-and-hosting/ai-gateways.md) — AI-specific gateways (different problem)
- [Error Monitoring Providers](../devops-and-tools/error-monitoring-providers.md) — gateway observability
- [Bot Detection Providers](../devops-and-tools/bot-detection-providers.md) — WAF complement
- [Authentication Providers](../auth-and-payments/authentication-providers.md) — identity layer
- [VibeWeek: Public API](https://www.vibeweek.com/6-grow/public-api-chat) — productizing your API
- [VibeWeek: Rate Limiting & Abuse](https://www.vibeweek.com/6-grow/rate-limiting-abuse-chat) — rate-limit implementation
- [VibeWeek: API Versioning](https://www.vibeweek.com/6-grow/api-versioning-chat) — versioning strategy
- [VibeWeek: API Keys](https://www.vibeweek.com/6-grow/api-keys-chat) — API key management

---

[⬅️ Backend & Data Overview](../backend-and-data/)
