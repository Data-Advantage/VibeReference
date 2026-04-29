# LLM Observability Providers: Langfuse, LangSmith, Helicone, Braintrust, Phoenix (Arize), Weave (W&B), Traceloop

[⬅️ AI Development Overview](../ai-development/)

If you're building AI-powered features in 2026 and trying to pick an observability tool, this is the consolidated comparison. LLM observability is the line item that looks unnecessary until production hits and you discover you have no idea why a customer's chat session went off the rails. Most indie SaaS that ship LLM features start with `console.log` and a Datadog dashboard, then realize traditional observability doesn't show prompt/response/token-usage in any useful way. Pick the right tool early and debugging AI features takes minutes; pick wrong (or nothing) and every LLM bug is an archaeology project.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Langfuse | OSS LLM observability + evals | Free (50K observations/mo) | $59/mo (Pro) | Yes (MIT for core) | Very high | Default for indie SaaS in 2026 |
| LangSmith | LangChain-native observability | Free (5K traces/mo) | $39/dev/mo | No | High | LangChain users |
| Helicone | Proxy-based observability | Free (10K reqs/mo) | $20/mo | Yes (Apache 2.0) | High | Cost-tracking-first |
| Braintrust | Evals-first, observability-second | Free trial | $50/dev/mo | No | Medium | Eval-heavy teams |
| Phoenix (Arize) | OSS, OpenTelemetry-based | Free OSS / hosted free tier | $50+/mo | Yes (Apache 2.0) | High | Existing Arize / OpenTelemetry users |
| Weave (Weights & Biases) | ML + LLM observability | Free | Bundled with W&B | Partial | Medium | ML-heavy teams |
| Traceloop | OpenTelemetry-native | Free (50K spans/mo) | Custom | Yes (OSS SDK) | High | OpenTelemetry-stack teams |
| Vercel AI Gateway | Observability bundled with AI Gateway | Bundled with Vercel | Bundled | No | Very high | Vercel + AI Gateway users |
| OpenAI / Anthropic dashboards | Built-in | Free | Bundled | No | High | Single-provider apps |
| OpenLLMetry | OSS standard library | Free | Free | Yes (Apache 2.0) | Very high | Self-host with own backend |
| Datadog LLM Observability | Bundled with Datadog APM | Datadog trial | Custom | No | Low | Existing Datadog shops |

The first decision is **what shape of observability you actually need**. Per-LLM-call tracing, evals + dataset management, cost tracking, and end-to-end agent observability are four overlapping but different problems. Most indie SaaS need at least the first two; agent-heavy teams need all four.

## Decide What You Need First

LLM observability tools are not interchangeable. Get the shape wrong and you'll either pay for capabilities you don't use or miss the signal that actually matters when something breaks.

### Per-call tracing + cost tracking (the 70% case for indie SaaS)
You want to see every LLM call: what prompt was sent, what response came back, how long it took, how many tokens (input + output), how much it cost. When a customer reports "the AI gave me a bad answer," you can find their session and inspect.

Right tools:
- **Langfuse** — modern OSS default
- **Helicone** — proxy-based; cost-tracking-strong
- **Vercel AI Gateway** — bundled if on Vercel
- Provider dashboards (OpenAI / Anthropic) — for very simple cases

### Evals + dataset management
You want to test prompt changes against a dataset of known-good cases. CI integration so a "prompt update" doesn't regress quality.

Right tools:
- **Braintrust** — evals-first
- **LangSmith** — strong evals
- **Langfuse** — evals included

### Agent observability (multi-step AI workflows)
You're building agents (per [AI agents](ai-agents.md)) that chain LLM calls + tool use. You need to see the full trace: which tools were called, in what order, what intermediate state.

Right tools:
- **LangSmith** if on LangChain
- **Langfuse** for framework-agnostic
- **Phoenix** for OpenTelemetry-style trace viewing

### Just an OTel sink (DIY)
You want OpenTelemetry-formatted traces; you'll send them to your existing Datadog / Honeycomb / Grafana. No specialized LLM tool.

Right tools:
- **OpenLLMetry** instrumentation library
- **Traceloop** OSS SDK
- Send to existing OTel backend

For most indie SaaS in 2026: **Langfuse if you want OSS / self-host option; Vercel AI Gateway if you're on Vercel; Helicone if cost tracking is the primary need**. Skip Datadog LLM Observability unless you''re already on Datadog.

## Provider Deep-Dives

### Langfuse — The OSS Default
Langfuse launched in 2023 and rapidly became the default OSS LLM observability tool. MIT licensed (core); generous free tier; full feature set including evals, datasets, prompts.

Strengths:
- MIT license; truly open source
- Self-hostable (Postgres + ClickHouse + Redis)
- Generous free hosted tier (50K observations/mo)
- $59/mo Pro for indie scale
- Strong evals + datasets + prompt-management bundled
- SDK in TypeScript / Python / Go / Java
- OpenTelemetry support
- Active community + frequent releases

Weaknesses:
- Self-host requires meaningful infra
- Smaller community than LangSmith (LangChain ecosystem)
- Some advanced features in paid tier

Pick when: you want OSS LLM observability with the option to self-host. Most indie SaaS in 2026 should default here.

### LangSmith — LangChain-Native
LangSmith is the official observability tool from LangChain. Best fit if you''re already on LangChain; competent enough if you''re not.

Strengths:
- Native LangChain integration (tracing automatic)
- Strong evals + datasets
- Prompt management + versioning
- Solid debugging UI for chains and agents
- Hosted only; reliable

Weaknesses:
- Closed source
- Pricing per-developer ($39/dev/mo) adds up
- Best fit only if on LangChain (the SDK works for non-LangChain but feels secondary)
- Vendor lock-in concerns

Pick when: you''re a LangChain shop. If you''re framework-agnostic or use the AI SDK, Langfuse is usually a better fit.

### Helicone — Proxy-Based, Cost-Focused
Helicone takes a different approach: act as a proxy in front of your LLM calls. Set the base URL to Helicone; everything is logged automatically. Strong on cost tracking.

Strengths:
- Proxy approach: zero code change beyond base URL
- Apache 2.0 OSS
- Self-hostable
- Strong cost-tracking dashboards
- Caching built in (saves money)
- Generous free tier (10K reqs/mo)
- Cheap ($20/mo Pro)

Weaknesses:
- Proxy adds latency (typically 50-100ms)
- Less feature-rich than Langfuse for evals / agents
- Some providers don''t work well behind proxies (image / audio APIs)

Pick when: cost tracking is your primary concern, OR you want the simplest possible setup (just change base URL).

### Braintrust — Evals-First
Braintrust focuses on evals — running prompt experiments, comparing model outputs, tracking quality over time. Observability is secondary.

Strengths:
- Best-in-class eval workflow
- Strong dataset management
- Side-by-side prompt comparison
- CI integration for "fail PR if eval regresses"
- Modern UX

Weaknesses:
- Closed source
- Mid-market pricing ($50/dev/mo)
- Less emphasis on production observability
- Smaller community

Pick when: you''re running serious eval programs (prompt engineering with measurable quality gates) and need eval depth.

### Phoenix (Arize) — OpenTelemetry-Based OSS
Phoenix is the OSS LLM observability tool from Arize. Apache 2.0; OpenTelemetry-native; strong for teams already on OpenTelemetry.

Strengths:
- Apache 2.0 OSS
- OpenTelemetry-native (sends standard traces)
- Self-hostable with Phoenix server or run in notebook
- Strong dataset + eval workflows
- Good integration with Arize''s broader ML observability platform

Weaknesses:
- Smaller indie SaaS community than Langfuse
- Best fit if you''re already in the Arize / OTel ecosystem
- UI can be denser than Langfuse

Pick when: you''re using OpenTelemetry across your stack and want LLM traces in the same pipeline.

### Weave (Weights & Biases) — ML-Heavy Teams
Weights & Biases shipped Weave for LLM observability alongside their existing ML platform. Good fit for teams already on W&B.

Strengths:
- Bundled with W&B if you have it
- Strong ML lineage / experiment tracking
- Notebook-friendly
- Free tier

Weaknesses:
- Best if you have ML / DS team
- Less indie SaaS-shaped
- Smaller community for LLM-specific use vs Langfuse

Pick when: you''re a research-oriented or ML-heavy team already on W&B.

### Traceloop — OpenTelemetry-Native
Traceloop is the OpenLLMetry company. They provide an OTel SDK + a hosted backend (or you bring your own).

Strengths:
- OpenTelemetry-native (standard, portable)
- OSS SDK (Apache 2.0)
- Free hosted tier (50K spans/mo)
- Send to existing OTel backends (Datadog, Honeycomb, Grafana, Langfuse)

Weaknesses:
- Hosted product less feature-rich than Langfuse
- Some teams just use the SDK + their existing OTel backend (Traceloop''s hosted is optional)

Pick when: you''re committed to OpenTelemetry as the standard and want LLM traces flowing through it.

### Vercel AI Gateway — Bundled With Vercel
Vercel AI Gateway includes observability for LLM calls made through the gateway. If you''re using AI Gateway already, this is the default.

Strengths:
- Bundled with Vercel
- Zero setup beyond using AI Gateway
- Modern UI in the Vercel dashboard
- Cost tracking + latency metrics + per-provider observability
- Works with any model accessible through the gateway

Weaknesses:
- Tied to AI Gateway (route through Vercel)
- Less feature-rich than dedicated tools (Langfuse, Braintrust)
- No deep eval workflows

Pick when: you''re using Vercel AI Gateway and basic observability is enough. Add Langfuse later if you outgrow.

### OpenAI / Anthropic Dashboards — Built-In
For single-provider AI apps, the provider''s own dashboard gives basic visibility — usage, costs, error rates.

Strengths:
- Free; bundled with API access
- No setup
- Accurate cost data

Weaknesses:
- Provider-specific (no cross-provider view)
- Limited to high-level metrics
- No prompt / response inspection
- No evals
- No tracing of multi-step calls

Pick when: you''re early-stage on one provider and basic visibility is enough until you outgrow.

### OpenLLMetry — OSS Library Standard
OpenLLMetry is the open-source standard for LLM telemetry. It''s a library you instrument your code with; sends OTel-format traces to whatever backend you choose.

Strengths:
- Standard OSS library (Apache 2.0)
- Send anywhere (Langfuse, Traceloop, Datadog, custom)
- Future-proof (standardizes the format)
- Auto-instrumentation for OpenAI, Anthropic, LangChain, LlamaIndex

Weaknesses:
- It''s a library, not a hosted product
- Backend choice is yours (some assembly required)

Pick when: you want vendor independence and you''ll send traces to your chosen backend.

### Datadog LLM Observability — Enterprise/Existing-Datadog
Datadog added LLM Observability to their APM platform. Bundled with Datadog if you have it.

Strengths:
- Bundled with existing Datadog
- Enterprise-grade scaling
- Unified with traditional APM

Weaknesses:
- Sales-led pricing
- Overkill for indie scale
- Tied to Datadog

Pick when: you''re already on Datadog and want LLM traces in the same UI.

## What LLM Observability Won''t Do

- **Replace traditional APM.** Latency / error / infrastructure metrics still go to [observability providers](../devops-and-tools/observability-providers.md). LLM observability adds a layer on top.
- **Evaluate quality automatically.** Tools track what happened; humans (or eval datasets) judge whether it was good.
- **Solve hallucinations.** Tools surface them; product / prompt design fixes them.
- **Replace [error monitoring](../devops-and-tools/error-monitoring-providers.md).** Different category. LLM observability captures LLM-specific data; error monitoring captures exceptions everywhere.
- **Be free of cost itself.** Storing 100K traces/mo with full prompt+response is real storage.

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / TypeScript with LLM features**:
- Langfuse (free tier or $59/mo)
- Plus error monitoring (Sentry / similar)
- Plus traditional APM (lightweight)
- Total: $0-59/mo

**On Vercel + AI Gateway**:
- Vercel AI Gateway observability (bundled)
- Optionally add Langfuse for evals later
- Total: bundled

**LangChain shop**:
- LangSmith
- Total: $39/dev/mo

**OSS / self-host required**:
- Langfuse self-hosted
- Or Phoenix self-hosted
- Total: infrastructure cost only

**Cost-tracking-priority**:
- Helicone
- Total: $20/mo

**Evals-heavy**:
- Braintrust
- Plus Langfuse for production observability
- Total: $50+/mo per dev

**Already on OpenTelemetry**:
- OpenLLMetry SDK + Traceloop or existing OTel backend
- Total: existing infra cost

**Already on Datadog**:
- Datadog LLM Observability (bundled)
- Total: bundled

## Decision Framework: Three Questions

1. **What stack are you on?** → Vercel AI Gateway: bundled. LangChain: LangSmith. OpenTelemetry: Phoenix or OpenLLMetry. Generic: Langfuse.
2. **What''s your primary need?** → Cost tracking: Helicone. Evals: Braintrust or LangSmith. Observability: Langfuse. Agent traces: LangSmith or Langfuse.
3. **Do you need OSS / self-host?** → Yes: Langfuse, Phoenix, Helicone. No: any commercial.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Langfuse if you want OSS / self-host option; Vercel AI Gateway observability if you''re on Vercel; LangSmith if you''re on LangChain**.

## Verdict

For most readers building AI features in 2026:
- **Default**: Langfuse (free tier or $59/mo).
- **On Vercel + AI Gateway**: Vercel''s bundled observability.
- **LangChain shop**: LangSmith.
- **Cost-focused**: Helicone.
- **Evals-heavy**: Braintrust.
- **OpenTelemetry-stack**: Phoenix or OpenLLMetry.
- **Already on Datadog**: Datadog LLM Observability.

The hidden cost in LLM observability isn''t the seat fee — it''s **shipping AI features blind**. A team without LLM observability has no answer when "why did the AI say this?" arises. The first time a customer flags a hallucination and you can pull up the exact prompt + response + tool calls + intermediate state, you understand why this category exists. Set it up before launch; tune it as you scale.

## See Also

- [AI SDK](ai-sdk.md) — works with most observability providers via instrumentation
- [AI SDK Core](ai-sdk-core.md) — instrument calls here
- [Vercel AI Gateway](../cloud-and-hosting/vercel-ai-gateway.md) — bundled observability
- [AI Gateways (comparison)](../cloud-and-hosting/comparing-ai-gateways.md) — gateway choice affects observability
- [AI Agent Frameworks](ai-agent-frameworks.md) — agents need observability more than chat
- [AI Agents](ai-agents.md) — the workloads you''re observing
- [AI Agent Evaluation](ai-agent-evaluation.md) — eval workflows
- [LLM Cost Optimization](https://www.vibeweek.com/6-grow/llm-cost-optimization-chat) — observability is prerequisite
- [LLM Quality Monitoring](https://www.vibeweek.com/6-grow/llm-quality-monitoring-chat) — companion product feature
- [Observability Providers](../devops-and-tools/observability-providers.md) — traditional APM
- [Error Monitoring Providers](../devops-and-tools/error-monitoring-providers.md) — exceptions are different
- [OpenAI / Anthropic / Google Gemini](claude.md) — provider-specific basics

---

[⬅️ AI Development Overview](../ai-development/)
