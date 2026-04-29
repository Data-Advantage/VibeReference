# Feature Flag Providers: LaunchDarkly, Statsig, PostHog, GrowthBook, Flagsmith, Unleash, ConfigCat, Hypertune, Vercel Flags

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a SaaS in 2026 and trying to pick a feature flag tool, this is the consolidated comparison. Feature flags are the cheapest way to ship safer — gate risky changes behind a switch, ramp gradually, and turn things off without redeploying. Most indie SaaS over-invest in DIY flag systems they regret 6 months later, or pick LaunchDarkly because they've heard of it and watch the bill spike. Pick the right shape and flagging becomes a velocity multiplier; pick wrong and it becomes a tax on every release.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| LaunchDarkly | Enterprise flags + experimentation | 14-day trial | $12/service connection/mo | No | Low | Enterprise teams already paying for it |
| Statsig | Flags + experimentation + analytics | Free up to 1M events/mo | Custom (mid-market) | No | High | Teams that want flags AND product analytics in one |
| PostHog Feature Flags | Flags + analytics + replay | Free up to 1M evals/mo | $0 (bundled with PostHog) | Yes (AGPL) | Very high | PostHog users — flags are free with the platform |
| GrowthBook | Flags + experimentation | Free (unlimited seats, hosted) | $40/user/mo (Pro) | Yes (MIT) | Very high | OSS-leaning teams that want experimentation built in |
| Flagsmith | Flags + segments + remote config | Free (50K reqs/mo) | $45/mo (3 users) | Yes (BSD-3) | High | Teams that want self-host without giving up SaaS quality |
| Unleash | Enterprise OSS flags | Free (self-host) / 14-day trial hosted | $80/mo (5 users hosted) | Yes (Apache 2.0) | High | Enterprises that want OSS with paid support |
| ConfigCat | Pure flags | Free (10 flags / 5 users / 5M reqs) | $99/mo (unlimited seats) | No | High | Indie teams that want simple flags with predictable pricing |
| Hypertune | Type-safe flags + Git-style branching | Free (3 users / unlimited flags) | $30/user/mo | No | Very high | TypeScript teams that want flags as typed code |
| Vercel Flags | Flags inside Vercel | Free with Vercel | Bundled with Vercel plan | Partial (Flags SDK is OSS) | Very high | Next.js teams already on Vercel |
| Split.io (Harness) | Flags + experimentation | Free (5 users / 5M MTUs) | Custom | No | Low | DevOps teams already on Harness |
| Optimizely | Flags + experimentation + DXP | Free demo | Custom (enterprise) | No | Very low | Enterprise marketing-led orgs |
| DIY (env vars + DB row) | Roll your own | Free | Cost of your time | N/A | Low | Skip — you'll regret it within 6 months |

The first decision is **what shape of flagging you actually need**. Pure flags, flags plus experimentation, or flags as one tab inside an analytics platform are three different problems with three different bills. Most indie SaaS need exactly one of these.

## Decide What You Need First

Feature flag products are not interchangeable. Get this part wrong and you'll either underpay for a tool you outgrow in 3 months or overpay for capacity you'll never use.

### Pure flagging (the 70% case for indie SaaS)
You want a tool that toggles features on/off, supports user/segment targeting, ramps gradually (1% → 10% → 100%), and exposes a simple SDK in your language. No experimentation, no analytics, no replay.

Right tools:
- **ConfigCat** — simplest, predictable pricing, unlimited seats
- **Hypertune** — typed flags for TypeScript-first teams
- **Vercel Flags** — if you're already on Vercel
- **Flagsmith** (self-host) — if you want OSS with no per-user pricing
- **DIY** — only if you have one engineer and three flags forever (you don't)

### Flags + experimentation (when A/B testing matters)
You want flags AND statistical analysis of variant performance — A/B tests, sequential testing, holdouts, guardrails on engagement metrics. The flagging engine and the experimentation engine become coupled.

Right tools:
- **Statsig** — strongest experimentation engine in this list
- **PostHog Feature Flags** — bundled free with PostHog product analytics
- **GrowthBook** — OSS with Bayesian and Frequentist methods
- **LaunchDarkly Experimentation** — premium-priced; enterprise default

### Flags inside an analytics platform
You already use PostHog, Amplitude, or Mixpanel for product analytics. You want flags as one feature inside that tool so the events and the flag-targeting are unified.

Right tools:
- **PostHog Feature Flags** — bundled free with PostHog
- **Amplitude Experiment** — if you're an Amplitude shop
- **Statsig** — strong analytics layer alongside flags

For most indie SaaS in 2026: **PostHog Feature Flags if you already use PostHog; Hypertune or Vercel Flags if you don't**. Skip LaunchDarkly until you have a real reason. Skip DIY entirely.

## Provider Deep-Dives

### LaunchDarkly — The Enterprise Default
LaunchDarkly invented the modern feature flag category and remains the enterprise default. The product is excellent; the pricing is the problem.

Strengths:
- Mature platform; nothing surprises in production
- Strong enterprise features (RBAC, SSO, audit logs, approvals, scheduled releases)
- Large catalog of integrations (Datadog, Slack, Jira, GitHub, Terraform)
- SDKs in essentially every language and runtime
- Strong contexts/targeting model (user attributes, multi-context, segment APIs)
- Code references show every flag use in your repo
- Experimentation product is competent

Weaknesses:
- Pricing scales by service connections; bills are notoriously hard to predict
- No real free tier — 14-day trial only
- Most expensive option in this list at indie scale
- Per-feature pricing on advanced capabilities (Experimentation, Code References, etc.)
- Sales-led for anything serious

Pick when: you're an enterprise team and budget isn't the constraint, or you need a specific feature like multi-context targeting at scale.

### Statsig — Experimentation-First
Statsig leads with statistical rigor — the experimentation engine is the strongest in this list, with sequential testing, CUPED, and holdouts as first-class. Flags are bundled.

Strengths:
- Best-in-class experimentation engine
- Generous free tier (1M events/mo, unlimited flags)
- Strong analytics layer included; doesn't require Amplitude or PostHog
- Warehouse-native option (run experiments on your own data warehouse)
- Fast SDKs with good caching
- Modern UI

Weaknesses:
- Pricing past the free tier is custom / sales-led
- Less mature than LaunchDarkly for pure flag use cases
- Fewer integrations than LaunchDarkly
- Newer in the category — community is smaller

Pick when: you actually run experiments (not just A/B tests as marketing copy) and want flags AND analytics in one tool.

### PostHog Feature Flags — Free With PostHog
PostHog includes feature flags as a core product alongside analytics, session replay, and surveys. For PostHog users, there's no reason to pay another vendor for flags.

Strengths:
- Bundled with PostHog free tier (1M flag evaluations/mo)
- Open-source (AGPL); fully self-hostable
- Flags integrate with PostHog cohorts, replay, and analytics
- A/B testing built in
- Local evaluation in SDKs (low latency, no per-eval billing)
- Strong React, Next.js, Python, and Node SDKs

Weaknesses:
- Less feature-rich than dedicated flag tools at the enterprise tier
- Tied to PostHog — picking PostHog Flags often means picking PostHog as your analytics tool
- AGPL self-host has license implications for some companies

Pick when: you already use PostHog (or plan to) — there's no reason to pay LaunchDarkly when PostHog Flags is free with the platform.

### GrowthBook — OSS With Statistical Rigor
GrowthBook is the OSS leader for experimentation. MIT-licensed, strong on Bayesian + Frequentist statistical methods, designed for product teams that want experimentation as serious analysis, not vibes.

Strengths:
- MIT-licensed; truly open source (no AGPL)
- Strong stats engine with Bayesian and Frequentist methods
- Warehouse-native experimentation (BigQuery, Snowflake, Redshift, ClickHouse, Postgres)
- Free hosted tier with unlimited seats
- Experimentation-first; flags included
- Active community

Weaknesses:
- Smaller integration ecosystem than LaunchDarkly
- Pro plan ($40/user/mo) gets expensive for larger teams
- Less polished UI than commercial alternatives
- Targeting model less expressive than LaunchDarkly's at the enterprise tier

Pick when: you want OSS experimentation with statistical rigor and you're comfortable running self-host or paying per-user.

### Flagsmith — Self-Host-Friendly OSS
Flagsmith is BSD-3 licensed and runs equally well self-hosted or as a SaaS. Targeting is solid; remote config is bundled; pricing is friendly.

Strengths:
- BSD-3 license (more permissive than AGPL)
- Self-host story is genuinely first-class
- Free SaaS tier (50K req/mo)
- Remote config alongside flags (a/b strings, configs, JSON)
- Solid SDK coverage
- Identity-based targeting

Weaknesses:
- Less feature-rich than LaunchDarkly at enterprise scale
- Smaller community than Unleash
- Experimentation isn't as strong as Statsig or GrowthBook
- UI feels older than newer entrants

Pick when: you want self-host without compromising on quality, or you need remote config alongside flags.

### Unleash — Enterprise OSS Flags
Unleash is the Apache-2.0 OSS option positioned for enterprises that want self-host with paid support. The free OSS tier is genuinely usable; the paid hosted tier adds enterprise features.

Strengths:
- Apache-2.0 OSS; corporate-friendly license
- Strong enterprise OSS positioning
- Mature targeting model
- Custom strategies via plugins
- Self-hostable on Kubernetes, Docker, or Postgres-only setups

Weaknesses:
- Hosted pricing per-user adds up ($80/mo for 5 users)
- Less polish than commercial alternatives
- Smaller ecosystem of integrations
- No experimentation engine to speak of

Pick when: you're enterprise, want OSS with a license your legal team accepts, and want commercial support available.

### ConfigCat — Predictable Pricing for Indies
ConfigCat is the simplest tool in this list. No experimentation, no analytics — just flags. Pricing is predictable: a single $99/mo plan with unlimited seats, unlimited flags, 5M evaluations.

Strengths:
- Simplest setup of any tool in this list
- Predictable pricing — no per-user, no per-environment, no per-flag pricing trap
- Free tier covers most indie projects
- Local SDK evaluation (no per-eval billing)
- Clean UI; fast to learn
- Solid SDK coverage (30+ languages)

Weaknesses:
- No experimentation
- No analytics integration
- Targeting is competent but less expressive than LaunchDarkly
- No self-host option

Pick when: you want pure flags, predictable bills, and to never think about flag tooling pricing again.

### Hypertune — Type-Safe Flags as Code
Hypertune is the newest serious entrant and the most opinionated. Flags are typed via schema; the SDK generates TypeScript types; flag changes are previewed and merged like Git. Built for TypeScript-first teams.

Strengths:
- Type-safe flags — the SDK refuses to compile if you reference a flag that doesn't exist
- Git-style branching for flag changes (preview + merge)
- Excellent TypeScript ergonomics
- Free tier (3 users, unlimited flags)
- $30/user/mo above the free tier
- Vercel-native integration via Vercel Flags

Weaknesses:
- TypeScript-centric (other-language SDKs exist but the value is highest in TS)
- Smaller community than older tools
- No self-host
- No experimentation engine
- Younger product — less battle-tested than LaunchDarkly

Pick when: you ship TypeScript and you want flags to be typed, branchable code rather than a separate dashboard.

### Vercel Flags — Bundled With Vercel
Vercel Flags is a thin layer that lets you read flags from any provider (Hypertune, LaunchDarkly, Statsig, Edge Config) inside Next.js with Vercel-aware caching and instrumentation. It's not a flag store — it's the integration layer.

Strengths:
- Bundled with Vercel — no extra bill for the integration
- The Flags SDK is OSS (`@vercel/flags`)
- Edge Config is the cheapest possible flag store at scale
- Native Next.js integration (cookies, route handlers, server components)
- Pluggable backends — swap providers without changing app code
- Per-environment overrides via Vercel env

Weaknesses:
- It's an integration layer, not a flag store with a UI — you still need a backing provider for serious flag management
- Vercel Edge Config is great for static-ish flags; not for per-user targeting at scale
- Tied to the Vercel platform

Pick when: you're on Vercel + Next.js and want flags wired up with first-class platform support. Pair with Hypertune, LaunchDarkly, or Edge Config depending on scale.

### Split.io / Optimizely / Eppo — Enterprise Specialists
Split (now part of Harness), Optimizely, and Eppo round out the enterprise list. Each is strong in its niche; none is the right starting pick for an indie SaaS.

- **Split.io (Harness)**: deep experimentation, traffic segmentation, real-time monitoring. Best fit for DevOps-led orgs already paying for Harness CD.
- **Optimizely**: digital experience platform with flags as one piece. Marketing-led; not a developer tool.
- **Eppo**: warehouse-native experimentation; strong stats engine. Mid-market+ pricing; smaller flagging surface.

Pick when: you've outgrown the indie tier and have specific enterprise requirements that map to one of these.

## What Feature Flags Won't Do

- **Replace your CI/CD pipeline.** Flags ship code that's already merged. They don't replace [CI/CD providers](cicd-providers.md), tests, or staging environments.
- **Save you from a bad design.** A flag around a 90%-complete feature is worse than not shipping the feature at all. Flag the right slice.
- **Replace incident response.** A "kill switch" flag helps roll back, but only for changes you anticipated. The flag tool is a tool, not a strategy.
- **Stay clean by themselves.** Every team accumulates dead flags. Schedule quarterly removal. Tools like LaunchDarkly Code References and the OSS `flagcleaner` help, but the discipline is yours.
- **Be a config system.** Flags are for boolean-ish gating with rollback. Long-lived configuration (timeouts, thresholds, copy variants) is a different problem — use remote config or env vars.

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / SvelteKit / Astro on Vercel**:
- Vercel Flags + Hypertune (typed) or Edge Config (static)
- Total: $0–$30/user/mo

**Indie SaaS already on PostHog**:
- PostHog Feature Flags (free with PostHog)
- Total: $0 added cost

**Self-host-required (enterprise-OSS posture)**:
- Flagsmith or Unleash, self-hosted
- Add Postgres + Redis; small ops cost
- Total: infrastructure cost only

**Experimentation-serious team**:
- Statsig (hosted) or GrowthBook (warehouse-native)
- Pair with your data warehouse if running long experiments
- Total: free tier covers most indie volume; $40-100s/mo as you scale

**Enterprise (LaunchDarkly's lane)**:
- LaunchDarkly with Code References + Experimentation
- Plan a multi-month rollout; budget for the bill
- Total: high four figures to low five figures per month

**Pure flagging, predictable bill, no surprises**:
- ConfigCat ($99/mo or free tier)
- Total: $0–$99/mo

## Decision Framework: Three Questions

1. **Are you running real experiments?** → Yes: Statsig, PostHog, or GrowthBook. No: ConfigCat, Hypertune, or Vercel Flags.
2. **Are you already on PostHog or Vercel?** → Yes: use the bundled flag tool. No: pick from the standalone list.
3. **Is self-host required?** → Yes: PostHog, GrowthBook, Flagsmith, or Unleash. No: ConfigCat, Hypertune, or LaunchDarkly.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **PostHog Feature Flags if you use PostHog; Hypertune or Vercel Flags if you don't**. Don't pay LaunchDarkly until you have to.

## Verdict

For most readers building a SaaS in 2026:
- **Already on PostHog**: PostHog Feature Flags (bundled).
- **Already on Vercel**: Vercel Flags + Hypertune or Edge Config.
- **Pure flags, predictable bills**: ConfigCat.
- **Self-host**: Flagsmith or Unleash.
- **Serious experimentation**: Statsig or GrowthBook.
- **Enterprise**: LaunchDarkly.
- **DIY**: don't.

The hidden cost in feature flags isn't the SDK — it's **dead flags accumulating in your codebase**. A team with 200 flags and no removal cadence is paying tax on every release. Treat flags as temporary scaffolding; schedule quarterly removal; use Code References (LaunchDarkly) or `flagcleaner`-style tools to keep the count down. The tool you pick matters less than the discipline of removing flags after they ship.

## See Also

- [CI/CD Providers](cicd-providers.md) — flags ship code that's already gone through CI; they don't replace it
- [Product Analytics Providers](product-analytics-providers.md) — PostHog, Amplitude, Mixpanel; flags often live here
- [Observability Providers](observability-providers.md) — instrument flag exposure in your traces
- [Error Monitoring Providers](error-monitoring-providers.md) — flag rollouts often correlate with error spikes
- [Vercel Functions](../cloud-and-hosting/vercel-functions.md) — Vercel Flags is the platform-native integration

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
