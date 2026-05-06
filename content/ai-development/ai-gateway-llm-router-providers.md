# AI Gateway & LLM Router Providers: Vercel AI Gateway, OpenRouter, Portkey, LiteLLM, Helicone, Cloudflare AI Gateway, Kong, Bifrost

[⬅️ AI Development Overview](../ai-development/)

If you ship an AI feature in production, you eventually run into the same problem: one provider goes down, another raises prices, a third ships a model that's twice as good for half the cost — and your code is hardwired to the first one. An AI gateway is the indirection layer that fixes this. It sits between your application and the model providers (OpenAI, Anthropic, Google, Meta, Mistral, plus dozens of hosts), terminates one consistent API, and handles the messy operational concerns: failover when a provider returns 5xx, retry with backoff, request/response caching, cost tracking by model and team, key rotation, rate limiting, prompt redaction, and observability traces. The result is that swapping `claude-sonnet-4-6` for `gpt-5` or `gemini-2.5-pro` becomes a config change, not a refactor — and a regional outage at one provider doesn't take your product down.

This is one of the highest-leverage pieces of infrastructure for any team running LLMs in production. Most indie SaaS teams skip it for the first six months — direct provider SDK calls, hardcoded model strings, no caching — and that's fine until the first incident. After that, every team rebuilds some subset of gateway functionality (retry wrappers, fallback chains, cost dashboards). Adopting a real gateway upfront skips the rebuild and gets you observability + reliability + cost control in a few hours of integration work.

This is distinct from [LLM Observability Providers](./llm-observability-providers.md) (which trace requests but don't typically route them), [Prompt Management Platforms](./prompt-management-platforms.md) (which version prompts but don't proxy traffic), [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md) (which screen content but aren't routing layers), and the [Vercel AI SDK](./ai-sdk.md) (which is a client SDK that can call gateways but isn't itself a gateway). Many of the players below blur category lines — Helicone is observability + a proxy; Portkey is a gateway + governance; Vercel AI Gateway pairs with the AI SDK. Pick by primary need.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing Posture | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| **Hosted gateways (multi-provider catalog)** | | | | | | |
| Vercel AI Gateway | Hosted SaaS | $5/mo credit on team accounts | Pass-through token cost, no markup | No | Very high | Already on Vercel; AI SDK users |
| OpenRouter | Hosted SaaS | Limited free models | Provider price + ~5.5% markup | No | Very high | Widest model catalog (300+); credit-based billing |
| Portkey | Hosted + OSS proxy | Generous free tier | $49/mo team plan; usage-based on top | Yes (OSS gateway) | High | Gateway + governance + guardrails in one |
| Helicone | Hosted + OSS | Free up to 100K logs/mo | $20+/mo Pro | Yes | Very high | Observability-first; passive proxy mode |
| TrueFoundry AI Gateway | Hosted + self-host | Trial | Enterprise pricing | Yes (BYOC) | Medium | Regulated enterprises; on-prem |
| Together AI / Anyscale | Bundled with inference | Pay-per-use | Pay-per-token | No | High | Already paying for OSS-model inference |
| Inworld Router | Hosted SaaS | Research preview | Pass-through during preview | No | Medium | Cost/quality optimization across many models |
| Martian | Hosted SaaS | Free tier | Pay-per-call routing fee | No | Medium | Model-routing-as-product |
| **Cloud-native gateways** | | | | | | |
| Cloudflare AI Gateway | Edge proxy | Generous free tier | Workers Paid pricing | No | High | Edge caching; you're already on Cloudflare |
| AWS Bedrock | Cloud-native | None | Per-token | No | Medium | AWS-locked workloads; SOC 2 already done |
| Azure AI Foundry | Cloud-native | Azure credits | Per-token + Azure infra | No | Low | Microsoft shop; enterprise compliance |
| Google Vertex AI | Cloud-native | Trial credits | Per-token | No | Medium | Already on GCP |
| **OSS proxies (self-hosted)** | | | | | | |
| LiteLLM | OSS Python proxy | Free | Self-host cost only; managed available | Yes | Very high | Engineering teams that want full control |
| Bifrost (Maxim AI) | OSS Go proxy | Free | Self-host; managed available | Yes | Very high | Highest-throughput / lowest-overhead self-host |
| Kong AI Gateway | OSS API gateway | Free community | Enterprise tiers | Yes | Medium | Already running Kong for non-AI traffic |
| Tetrate Envoy AI Gateway | OSS / Envoy plugin | Free | Enterprise via Tetrate | Yes | Low | Kubernetes / service-mesh shops |
| Apigee AI extensions | Google Cloud | GCP pricing | Enterprise | No | Low | Apigee customers extending to LLMs |

## Why Use a Gateway Instead of Provider SDKs Directly?

Most teams start with a provider SDK (`openai`, `anthropic`, `@google/generative-ai`) and a hardcoded model name. That works until one of the following happens:

- **A provider has an outage.** OpenAI, Anthropic, and Google all have regional incidents a few times a year. Without a gateway, your app is down for the duration. With one, requests fail over to a secondary provider on the same call.
- **Pricing changes mid-quarter.** A new model release reshuffles the price/quality frontier. Without a gateway, you ship an SDK upgrade and a deploy. With one, you change the model string in a config.
- **Costs are opaque per-team or per-feature.** Direct SDK calls log to provider dashboards, which don't know about your customers, features, or environments. A gateway tags requests with metadata (`user_id`, `feature`, `env`) and gives you cost-by-anything reporting.
- **Cache hits are leaving money on the table.** ~10–40% of LLM traffic is repeat or near-repeat queries. Direct SDKs don't cache; gateways do (semantic cache, exact-match cache, per-tenant cache).
- **Rate limits hit you faster than expected.** A single API key shared across teams gets throttled. Gateways virtualize keys per team / per env and load-balance across multiple provider keys.
- **Prompt PII leaks into provider logs.** Without a gateway, every request body lives in the provider's audit trail. Gateways can redact emails, names, account numbers before forwarding.

Adopting a gateway is rarely the highest priority on day one — but it's almost always in the top three by the time you have paying customers and >100k LLM calls per month.

## Decide Before You Pick

Six honest questions.

### 1. Are you already on a platform that includes a gateway?

- On Vercel? Use [Vercel AI Gateway](https://vercel.com/docs/ai-gateway). It's wired into the AI SDK, charges pass-through token cost with no markup, and has a $5/mo credit on team accounts. Onboarding is a one-line `provider/model` string change.
- On Cloudflare? Use Cloudflare AI Gateway. Edge-cached, very low overhead, and your existing Workers Paid tier covers a lot of usage.
- On AWS? Bedrock is the native option, though it's narrower on model selection than the multi-provider gateways. Many AWS shops still front Bedrock with Portkey or LiteLLM to expand the catalog.
- On Azure? Azure AI Foundry is the native path. Same caveat as AWS — you'll likely want a multi-provider gateway in front for non-Azure-hosted models.

If you're not married to a platform, this question doesn't filter — pick on features.

### 2. SaaS or self-host?

- **SaaS gateway**: fastest to integrate, no infra to run, billing is one line item. Pay markup or subscription. Best for teams under ~$10k/mo in LLM spend.
- **OSS proxy (self-hosted)**: zero markup on tokens, full control over data residency, you run the infra. Best for teams over ~$50k/mo in LLM spend or with strict data residency requirements (EU, healthcare, regulated finance).
- **Hybrid**: Portkey, Helicone, and TrueFoundry offer both. Start managed, move to BYOC later if scale or compliance demands it.

A rough breakeven: at ~$20k/mo in LLM spend, the operational overhead of self-hosting LiteLLM/Bifrost is usually less than the markup or per-seat pricing of a SaaS gateway. Below that, SaaS wins on engineering time.

### 3. How important is model breadth?

- **Need 100+ models / experimenting constantly**: OpenRouter has the deepest catalog. Vercel AI Gateway covers most of what production teams use. LiteLLM supports 100+ via plugins.
- **Stick to 3–5 frontier models**: any gateway works. Pick on observability + cost.
- **Need image / video / embedding / TTS / STT in one gateway**: Vercel AI Gateway, Portkey, and OpenRouter all support modalities beyond chat. Confirm specific endpoints during eval.

### 4. What does failover need to look like?

- **Same-call failover** (the gateway retries to a different provider transparently when the first fails): Portkey, LiteLLM, Vercel AI Gateway, Bifrost.
- **Cross-region failover** (regional outage routes to a different region): Cloudflare AI Gateway, AWS Bedrock multi-region.
- **Fallback chains** (Claude → GPT → Gemini in priority order): LiteLLM, Portkey, Bifrost. Vercel AI Gateway supports this via the AI SDK.
- **Smart routing** (best model picked per query based on task / cost / latency): Inworld Router, Martian, Portkey conditional routes.

If you don't have a clear failover policy, default to fallback chains across two providers (e.g., Anthropic primary → OpenAI secondary on same model class). It's the highest-ROI reliability lever.

### 5. What's your observability stack today?

- **No LLM observability yet**: Helicone or Portkey both ship observability + gateway in one. Pick Helicone if observability is the bigger pain; Portkey if governance/routing is.
- **Already have Langfuse / LangSmith / Braintrust**: pair a thin gateway (Vercel, LiteLLM) with your existing observability tool via OpenTelemetry. See [LLM Observability Providers](./llm-observability-providers.md).
- **Need full audit logs for compliance**: Portkey, TrueFoundry, AWS Bedrock retain request/response with retention controls. SaaS-only gateways without audit retention are not viable for regulated workloads.

### 6. Will you need governance / guardrails / PII redaction?

- **Yes, immediately**: Portkey is the most opinionated; TrueFoundry is enterprise-grade. Both pair with [AI Guardrails platforms](./ai-guardrails-llm-application-security.md) for content safety.
- **Yes, eventually**: any gateway can add this layer later. Vercel + LiteLLM + Helicone all support custom middleware for redaction.
- **Not a concern**: skip the heavy platforms; OpenRouter and Vercel AI Gateway are leaner.

## Provider Notes

### Hosted Multi-Provider Gateways

**Vercel AI Gateway** is the clean default for any team already on Vercel. Free $5/month credit per team account, pay-as-you-go pass-through pricing on token costs, no markup. Native integration with the AI SDK — you call `generateText({ model: 'anthropic/claude-sonnet-4-6' })` and the gateway routes, retries, caches, and reports usage. Custom Reporting API on Pro/Enterprise breaks down spend by model, provider, user, and feature. Best for: AI SDK users; teams that don't want a separate vendor relationship for their gateway. Weak spot: catalog is curated rather than exhaustive — extremely niche / new models may not be available immediately.

**OpenRouter** is the deepest model catalog (300+) and the easiest way to A/B providers. Pricing is provider cost + ~5.5% markup, billed against prepaid credits. Strong on availability-based routing across providers (if Anthropic is degraded, OpenRouter routes to a backup automatically). Weak on enterprise governance — there's no native PII redaction or audit retention. Best for: experimentation, model breadth, indie hackers. Less ideal for regulated or enterprise contexts.

**Portkey** is the most feature-complete commercial gateway: routing, fallbacks, semantic cache, guardrails, governance, virtual keys, prompt management, observability, all in one product. Free tier is usable. $49/mo team plan; usage-based above. OSS gateway is also available for self-host. Best for: teams that want one platform for governance + routing + observability rather than stitching three tools. Weak spot: complexity — you're paying for breadth you may not use early on.

**Helicone** started as observability and grew a passive-proxy mode. Free 100K logs/month, $20+/mo Pro tier. Strong on cost tracking, latency breakdowns, prompt versioning. Lighter on routing logic than Portkey or LiteLLM, but the observability is the best in this group. OSS self-host available. Best for: observability-first teams; small teams that want logging without a heavy platform.

**TrueFoundry AI Gateway** is the enterprise BYOC option. Self-host on customer cloud, full audit trail, RBAC, cost attribution by team. Targets regulated industries. Best for: companies that can't send tokens to a third-party SaaS for compliance reasons. Pricing is enterprise (talk to sales).

**Together AI** and **Anyscale** are not pure gateways but bundle gateway-style features (multi-provider routing, observability) on top of their hosted OSS-model inference. If you're already paying for Llama / Mixtral / Qwen on Together, the gateway features come bundled.

**Inworld Router** and **Martian** are intelligent-routing products: instead of you picking a model per call, they pick a model per query based on cost / quality / latency goals. Newer category, worth piloting on workloads where cost is the dominant constraint.

### Cloud-Native Gateways

**Cloudflare AI Gateway** is the edge-cache play. Sits at Cloudflare's edge, ~10–20ms overhead, semantic cache, function-call routing, generous free tier. Works with any provider as long as you bring API keys. Best for: teams already on Cloudflare; edge-deployed apps; aggressive cache use. Weak spot: governance and audit features are lighter than Portkey/TrueFoundry.

**AWS Bedrock** is a managed model-host AND gateway in one — Bedrock-hosted models are first-class; non-Bedrock models require additional plumbing. SOC 2, HIPAA, FedRAMP options. Best for: AWS shops with strict compliance; teams that can stay inside the Bedrock model catalog (Claude, Llama, Mistral, Cohere, Stability, plus Amazon's own).

**Azure AI Foundry** is the Microsoft equivalent. Strong if you're an Azure shop, weak on non-Microsoft models.

**Google Vertex AI** mirrors the same pattern on GCP.

### OSS Proxies (Self-Hosted)

**LiteLLM** is the de facto OSS gateway. Python proxy, supports 100+ providers via a unified OpenAI-compatible API, fallback chains, budget controls, virtual keys, request logging. Free to self-host; managed offering exists. Best for: engineering teams that want full control, multi-language stacks (LiteLLM speaks OpenAI-compatible HTTP, so any client works). Weak spot: Python-runtime overhead is real at high RPS — most teams that grow past ~1000 RPS look at Bifrost or Kong.

**Bifrost** (Maxim AI) is the high-performance Go-based OSS gateway. Sub-microsecond overhead at thousands of RPS, semantic cache, virtual keys, fallback chains, OpenTelemetry traces. Best for: teams that need self-host AND high throughput. Newer than LiteLLM, smaller community, but the perf characteristics are dramatically better.

**Kong AI Gateway** is Kong's API-management platform extended with LLM-specific features (token rate limiting, prompt transformation, multi-provider routing). Best for: teams already running Kong for non-AI API traffic — extending to LLMs is configuration rather than a new platform. Weak spot: heavyweight if you're not already a Kong shop.

**Tetrate Envoy AI Gateway** lives in the service-mesh world. If you're running Envoy / Istio in Kubernetes, this slots in as another filter. Best for: large platform teams; not for indie SaaS.

## What a Real Gateway Integration Looks Like

The smallest viable integration for most teams is roughly:

1. **Pick a primary gateway.** Default: Vercel AI Gateway if you're on Vercel, otherwise Portkey or OpenRouter.
2. **Replace direct SDK calls with the gateway client.** Most gateways expose an OpenAI-compatible HTTP endpoint, so you change `baseURL` and an API key.
3. **Pick a model string format you'll standardize on.** `provider/model` (e.g., `anthropic/claude-sonnet-4-6`) is the de facto standard.
4. **Add a fallback policy.** At minimum, `[primary, secondary]` across two providers per model class.
5. **Tag requests with metadata.** `user_id`, `feature`, `env` so you can attribute cost.
6. **Set per-team / per-key budgets.** Hard cap on monthly spend per environment to prevent runaways.
7. **Wire observability.** Either use the gateway's built-in dashboards or export OpenTelemetry to your existing observability tool.

Most of this is one afternoon of work. The payoff — provider failover, cost transparency, cache savings, key rotation, governance — compounds for the life of the product.

## Where Gateways Don't Help

- **Single-provider, low-volume hobby projects.** If you're shipping a side project with <1000 calls/month against one model, the gateway adds complexity for no operational benefit.
- **Very latency-sensitive workloads where the gateway hop matters.** A 10–50ms gateway overhead is fine for chat; not fine for sub-100ms voice agent loops or real-time game NPCs. For those, talk to providers directly or use the lowest-overhead options (Cloudflare edge, Bifrost self-host).
- **When you need provider-specific features.** Some gateways drop or normalize provider-specific parameters (system prompt caching, structured-output schemas, vision tokens). Verify your must-have features survive the gateway translation before committing.

## Related Reference

- [Vercel AI SDK](./ai-sdk.md) — the client SDK that pairs with Vercel AI Gateway and works with most other gateways too.
- [LLM Observability Providers](./llm-observability-providers.md) — what to pair with a thin gateway.
- [Prompt Management Platforms](./prompt-management-platforms.md) — for prompt versioning separate from routing.
- [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md) — content safety layer that often sits behind the gateway.
- [Agent Reliability & Production Operations](./agent-reliability-production-operations.md) — broader reliability patterns including but not limited to gateways.
