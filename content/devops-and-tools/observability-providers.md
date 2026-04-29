# Observability Providers: Sentry, Datadog, New Relic, Axiom, Better Stack, Honeycomb, Grafana Cloud

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're shipping a SaaS in 2026 and trying to figure out where to send your errors, logs, traces, and uptime checks, this is the consolidated comparison. Pick wrong and you either bleed money to Datadog or fly blind on the day a customer pages you. Pick right and the system fades into the background and shows up only when you need it.

## TL;DR Decision Matrix

| Provider | Strongest at | Pricing Posture | Indie Vibe | Best For |
|---|---|---|---|---|
| Sentry | Errors + Replay + Perf | Generous free tier, 5K errors/mo free | High | Default error monitoring for almost everyone |
| Datadog | Full-stack APM + infra + logs | Enterprise; easy to spend $5K+/mo | Low | Mid-to-large SaaS with infra to monitor |
| New Relic | Full-stack APM | 100GB/mo free per user, then $0.30/GB | Medium | Cost-conscious teams who want one tool |
| Axiom | Logs + events at scale | $25/mo entry, unlimited log volume on plan | High | Indie SaaS with high event volume |
| Better Stack | Uptime + logs + status pages | Free tier real, $24/mo grows useful | Very high | Indie SaaS that wants one bill, one UI |
| Honeycomb | Distributed tracing | Free up to 20M events/mo | Medium | Teams committed to deep observability |
| Grafana Cloud | OSS stack hosted (Loki, Tempo, Mimir) | Generous free tier | High | Open-standards teams, cost-controlled |
| Highlight.io | Full-stack OSS (errors + replay + traces) | Self-host free; cloud usage-priced | High | Teams wanting Sentry+LogRocket in one tool |
| OpenTelemetry | Vendor-neutral protocol | Free (it's a spec) | Very high | Anyone who wants instrumentation portability |
| Vercel Observability | Built-in for Vercel apps | Included on paid plans + add-ons | High | Vercel-native projects |
| Logtail / Logflare | Logs only | Cheap, focused | Medium | Add-on logs when paired with another tool |
| PostHog | Product analytics + errors + LLM obs | Generous free tier | Very high | Indie SaaS already using PostHog |
| Helicone / Langfuse / Baselime | AI/LLM observability | Free tiers, then usage-priced | High | LLM apps that need prompt-trace observability |

The first decision is **what you actually need to observe**. Most early-stage SaaS conflate four things: errors (a thing crashed), traces (a request was slow), logs (a thing wrote text), and uptime (a thing is reachable). Each has a different best-in-class tool. Pretending one tool is best at all of them is what makes Datadog bills surprise you.

## The Four Pillars

### 1. Error Monitoring (do you have a `try/catch` survival problem?)
Catches uncaught exceptions, captures stack traces, deduplicates issues, alerts on regressions. The category leader for 10+ years is Sentry. Free up to 5K errors/month. After that, $26/mo for the Team plan. Default for almost every SaaS in 2026.

Alternatives:
- **Bugsnag** — solid, slightly more expensive than Sentry, no major edge
- **Rollbar** — older, fine, no edge over Sentry
- **Highlight.io** — open-source, includes errors + session replay + traces in one. Stronger if you want all three.
- **PostHog** — added error tracking in 2024. Useful if you already have PostHog and don't want a second tool. Less mature than Sentry on dedup/triage but improving.

If you do nothing else: ship Sentry on day 1.

### 2. Distributed Tracing (where in the request did the time go?)
Captures spans across services with timing and metadata. Critical when your SaaS has more than 2–3 internal services and one user request can fan out across them. Less critical if your app is "Next.js + a Postgres" — Vercel Observability and Sentry Performance cover that case.

Category leader: **Honeycomb**. Pioneers of "high-cardinality observability" — query traces by any tag, fast. Best-in-class for engineers who want to debug production by interactive query. Free up to 20M events/mo, then usage-based.

Alternatives:
- **Datadog APM** — integrated with their other products, expensive but powerful
- **New Relic APM** — fine, included in their generous free tier
- **Grafana Tempo** — OSS standard, hosted on Grafana Cloud
- **Sentry Performance** — added on top of error monitoring, sufficient for most B2B SaaS that doesn't have a microservices fleet

For most indie SaaS in 2026, Sentry Performance + the database query plan is enough. Honeycomb pays off when you have a real distributed system and a team that uses it.

### 3. Logs and Events (what happened, in order, with context?)
The unstructured-text part of observability. Where errors describe "what crashed" and traces describe "where time went," logs describe "what the system was doing at the moment." The decision here is mostly volume and price.

- **Axiom** — modern, generous pricing, fast queries, unlimited volume on most plans. Strong indie default.
- **Better Stack Logs** (formerly Logtail) — clean UI, integrates with their uptime + status page products. Strong indie default if you want one vendor.
- **Datadog Logs** — full-featured, expensive at volume. Easy to overspend.
- **Grafana Loki** — OSS, hosted on Grafana Cloud, indexes labels not full text (so it's cheap but less expressive).
- **Logflare** — cheap, integrated with Supabase, Postgres-native query.
- **Vercel Logs** — built-in for Vercel apps, retained 30 days on Pro plans, longer with Observability Plus.
- **CloudWatch / Cloud Logging / Azure Monitor** — what you have if you're on AWS / GCP / Azure. Functional but the UX is from 2015.

For an indie SaaS in 2026, Axiom or Better Stack are the right defaults. Datadog Logs is for teams that already pay Datadog for everything else.

### 4. Uptime and Status (is the thing reachable?)
External health checks against your URLs from multiple regions. Ping every 30s, alert when down, publish a status page.

- **Better Stack Uptime** — formerly Better Uptime, the indie favorite. Free tier covers 10 monitors at 3-minute intervals. Pro at $24/mo brings 30s intervals, branded status pages, on-call rotations.
- **Pingdom** — long-standing, good for non-developer teams, more expensive
- **UptimeRobot** — cheap and cheerful, fine for pre-revenue
- **Statuspage.io** — by Atlassian, status pages only (no monitoring), expensive
- **Instatus** — modern status pages, indie-friendly pricing
- **Cronitor** — also covers cron-job monitoring, useful if you have scheduled jobs

For most indie SaaS, Better Stack covers uptime + status page + logs in one bill. Worth the lock-in.

## Specialty: AI / LLM Observability

If your app calls LLMs, the four pillars above don't capture what you actually need to debug — prompt versions, model outputs, token usage, evaluation scores, conversation traces. AI-specific tools fill this gap.

- **Helicone** — proxy-based, drop-in for any LLM provider, captures every request with prompt + response + cost. Generous free tier.
- **Langfuse** — open-source-first, broader observability primitives (sessions, traces, scores, datasets, evaluations). Strong fit for serious LLM apps.
- **Braintrust** — eval-first, integrates traces with evaluation pipelines.
- **Baselime** — broader observability with strong AI/agent support. Acquired by Cloudflare in 2024 and integrated into the Cloudflare Workers stack.
- **PostHog LLM Observability** — added 2024. Useful if PostHog is already in your stack.
- **OpenLLMetry** — OpenTelemetry semantic conventions for LLMs, vendor-neutral.

Most LLM apps in 2026 should ship with Helicone or Langfuse from day 1. The cost is small, the visibility is large, and prompt-debugging in production is the single biggest pain in this category.

## Vercel-Native Stack

If your app runs on Vercel, the platform now includes a meaningful observability stack:
- **Vercel Logs** — built-in
- **Vercel Observability** — request traces, function logs, framework-aware insights
- **Vercel Speed Insights** — RUM (real user monitoring) for Web Vitals
- **Vercel Analytics** — privacy-first traffic analytics
- **Vercel Agent** — AI-powered investigation of incidents (public beta)
- **Vercel Firewall + BotID** — attack and bot visibility

For a Next.js or framework-on-Vercel app, the built-in stack covers the bottom of the four-pillar pyramid. Add Sentry for error grouping/triage, optionally add Honeycomb if you have a complex backend, and you have a complete setup without juggling 6 vendors.

## OpenTelemetry: The Spec, Not a Vendor

OpenTelemetry (OTel) is the open standard for instrumentation: traces, metrics, and logs in vendor-neutral format. Every modern observability vendor (Honeycomb, Datadog, New Relic, Grafana, Axiom, Sentry, Highlight, Vercel) accepts OTel data.

The strategic value: instrument your app once with OTel SDKs and route the data anywhere. Switch vendors without rewriting instrumentation. Send traces to Honeycomb, metrics to Grafana, logs to Axiom — all from the same client library.

The cost: more setup work upfront, especially if you want it to "just work" with your framework. Most vendors offer their own SDKs that are lower-friction; OTel pays off when you expect to outgrow your first vendor or when you have polyglot services.

For most indie SaaS in 2026, start with vendor-native SDKs (Sentry's SDK, Axiom's SDK). Migrate to OTel when you have real reasons — multi-service polyglot stack, vendor renegotiation leverage, multi-vendor routing.

## What None of Them Solve

- **Alerting fatigue.** Every tool has alerts. The art of alerting — what to page on, what to email, what to ignore — is yours. A bad alert policy on a great observability stack is worse than a quiet one on a mediocre stack.
- **The cost question at scale.** Datadog horror stories ($65K/mo for a small team) and New Relic surprise bills are not bugs in those tools — they're the result of capturing more data than you query. Set hard budget caps and review weekly.
- **Custom dashboards that anyone uses.** Most teams build a dashboard, look at it twice, and never again. The reliable pattern: a small number of high-signal dashboards (one per critical user flow), reviewed during incident response and weekly business review. Do not build 47.
- **Knowing what to instrument.** Every tool will accept whatever data you send. The art of *what to capture* — what tags, what cardinality, what spans, what events — is a skill that takes 6 months to develop.
- **Replacing customer support tickets.** Observability tells you "the system did X." It does not tell you "the customer expected Y." A great support+ops loop pairs observability with a support tool ([Plain](https://www.vibereference.com/auth-and-payments/) / Linear / Intercom) so customer-reported issues feed observability investigations.

## Pragmatic Stack Patterns

**Indie SaaS, pre-revenue → first 100 customers:**
- Sentry (errors) — free tier
- Better Stack (uptime + status page) — free tier
- Vercel Logs (built-in) or Axiom (if not on Vercel)
- That's it. Total cost: $0–$25/mo.

**Indie SaaS, $1K–$50K MRR:**
- Sentry Team ($26/mo) — errors + performance + replay
- Better Stack ($24/mo) — uptime, logs, status page in one
- PostHog (free tier) — product analytics + session replay
- If LLM-heavy: Helicone or Langfuse on top
- Total: $50–100/mo

**SaaS, $50K–$500K MRR with multi-service backend:**
- Sentry Business — errors + perf
- Honeycomb — distributed tracing for the backend
- Better Stack or Axiom — logs
- Better Stack — uptime + status
- Datadog — only for the infra you can't see in the app layer (Kubernetes if you have it)
- Total: $300–$1500/mo

**Mid-market SaaS, $500K+ MRR:**
- Probably consolidating to Datadog or New Relic for a single pane
- Plus Sentry for developer-loved error UX
- Plus a status page (Better Stack or Statuspage.io)
- Budget: $3K–$30K/mo depending on infra footprint

**Vercel-native, any stage:**
- Vercel Observability + Vercel Logs (built-in)
- Sentry for errors (better triage UX than Vercel's)
- Better Stack for status page
- Add Axiom only if you outgrow Vercel Logs retention

**LLM-heavy app:**
- Standard four-pillar setup +
- Helicone (proxy-style, lowest friction) or Langfuse (deeper, OSS)
- PostHog LLM Observability if PostHog is already in the stack
- Eval pipeline that's separate from observability — Braintrust or in-house

## Decision Framework: Three Questions

1. **Are you on Vercel?** → Use Vercel built-ins + Sentry + Better Stack. Stop here for v1.
2. **Do you have multi-service backend?** → Add Honeycomb or Datadog APM. Otherwise skip.
3. **Do you call LLMs?** → Add Helicone or Langfuse. Otherwise skip.

Three questions, three add-ons. Most SaaS at $0–$50K MRR end up with 2–3 tools. More than that and you're building observability theater, not observability.

## Verdict

For most readers building a SaaS in 2026:
- **Errors**: Sentry. Default. Don't overthink.
- **Logs**: Axiom (high-volume) or Better Stack (one-vendor consolidation) or Vercel built-ins (if on Vercel).
- **Uptime + Status**: Better Stack.
- **Tracing**: Skip until you have a real distributed system. Then Honeycomb.
- **APM (one-vendor consolidation)**: Datadog if you can afford it. New Relic if you want generous free tier. Vercel Observability if you're Vercel-native.
- **AI/LLM**: Helicone or Langfuse.
- **Spec**: OpenTelemetry — instrument with portability when budget allows.

The hidden cost in observability is *learning to use the tool* and *operating the alerts*. Picking fewer tools and going deep on each is almost always better than picking more tools and skimming each. Aim for 3–4 vendors total at any point in the journey, and consolidate aggressively.

## See Also

- [Vercel Analytics](../cloud-and-hosting/vercel-analytics.md) — privacy-first traffic analytics
- [Vercel Functions](../cloud-and-hosting/vercel-functions.md) — built-in logs and observability
- [Vercel Agent](../ai-development/vercel-agent.md) — AI-powered incident investigation
- [Web Vitals](web-vitals.md) — what RUM tools are measuring
- [Performance Optimization](performance-optimization.md) — what observability data drives
- [AI Agent Evaluation](../ai-development/ai-agent-evaluation.md) — companion for LLM apps
- [Rate Limiting](../backend-and-data/rate-limiting.md) — pairs with observability for API health

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
