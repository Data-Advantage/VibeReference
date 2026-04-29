# Product Analytics Providers: PostHog, Mixpanel, Amplitude, Heap, June, Vercel Analytics

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a SaaS in 2026 and trying to pick where your product analytics live, this is the consolidated comparison. Different from the generic "what is analytics" overview at [Analytics](analytics.md) — this one is opinionated about which provider to pick for which job.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| PostHog | All-in-one open-source | Bundle (analytics + replay + flags + experiments + LLM obs) | Free → $0.000248/event | Very high | Indie SaaS that wants one tool for everything |
| Mixpanel | Event-based product analytics | Event-funnel rigor + cohorts | Free → $24/mo (1M events) | High | Teams that already speak event-taxonomy |
| Amplitude | Enterprise product analytics | Sophisticated cohorting, predictive | Free → $49/mo (Plus), enterprise contracts | Medium | Teams scaling toward enterprise |
| Heap | Auto-capture analytics | Capture every event without manual instrumentation | Free → $0.0008/event | Medium | Teams that don't want to maintain event taxonomy |
| June | Product analytics for SaaS | Pre-built reports, fast time-to-insight | Free → $149/mo | Very high | B2B SaaS that wants templated reports |
| Vercel Analytics | Web traffic + Speed Insights | Vercel-native, privacy-first | Free → $10/mo+ | Very high | Vercel apps wanting traffic + Web Vitals |
| Plausible / Fathom / Simple Analytics | Privacy-first web analytics | GA replacement, no cookies | $9-$19/mo | Very high | Marketing sites and content sites |
| Google Analytics 4 | Web + app traffic analytics | Free, broad ecosystem | Free | Low | Marketing sites needing free + broad tooling |
| Statsig | Experimentation + analytics | Experiments-first with analytics | Free → enterprise | Medium | Teams centered on experimentation velocity |
| Pendo / Gainsight PX | Product analytics + customer success | Tied to customer-success motion | Enterprise | Low | Mid-market with dedicated CS team |

The first decision is **what shape of analytics you actually need**. Web traffic, product-event analytics, session replay, A/B testing, error tracking, customer journey — these are different jobs with different best-in-class tools. Pretending one tool does all of them is what makes Datadog (and Datadog's bills) happen in product analytics too.

## Categorize What You Need

### Web traffic analytics (marketing site)
You need to know visitors, sources, conversion to signup. Bounce rate, top pages, referrer breakdown.

Right tools:
- **Vercel Analytics** — built into Vercel, privacy-first, free tier real
- **Plausible / Fathom / Simple Analytics** — GA replacements, lightweight, $9-$19/mo
- **GA4** — free, comprehensive, Google ecosystem; UX is rough
- **PostHog** — also handles web analytics in addition to product analytics

Skip product-analytics tools for marketing-site traffic. They're priced per event, and a content site fires hundreds of pageviews per visit; the bill scales painfully.

### Product analytics (in-app behavior)
The core job: who's doing what inside your product. Activation funnels, retention curves, feature adoption, churn signals.

Right tools:
- **PostHog** — indie default in 2026
- **Mixpanel** — best for teams that want event-funnel rigor
- **Amplitude** — best for scale + predictive features
- **Heap** — best if you don't want to define event taxonomy
- **June** — best for templated B2B SaaS reports

This is where most of your analytics investment goes. Pick deliberately.

### Session replay
Watch real user sessions to debug UX problems and feature confusion. The "what did they actually do?" tool.

Right tools:
- **PostHog** — bundled
- **LogRocket** — strong dev focus, includes errors
- **FullStory** — enterprise
- **Hotjar** — also has heatmaps
- **Highlight.io** — open-source full-stack

Most indie SaaS in 2026 use PostHog's bundled session replay rather than buying a separate tool.

### Feature flags + experimentation
Ship features behind flags; A/B test variations.

Right tools:
- **PostHog** — bundled
- **Statsig** — experimentation-first
- **LaunchDarkly** — enterprise
- **GrowthBook** — open-source experimentation

Per [A/B Testing](../../../VibeWeek/6-grow/ab-testing-chat.md), most indie SaaS get all of this from PostHog. Statsig becomes valuable when experimentation is genuinely the team's primary practice.

### Customer journey analytics
Stitch identity across anonymous → signed-up → paying → expansion. The "from first visit to revenue" view.

Right tools:
- **PostHog** — handles this with identify-merge
- **Mixpanel** — strong at it
- **Segment** + warehouse — for teams that want their own warehouse to be source of truth
- **Twilio Engage / Hightouch / Census** — reverse-ETL approaches

For most indie SaaS in 2026: PostHog or Mixpanel handles the journey natively. Segment + warehouse is overkill until you have a data team.

## Provider Deep-Dives

### PostHog — Indie All-in-One
PostHog is the default for indie SaaS in 2026. Open-source, generous free tier, and a bundle that includes product analytics + session replay + feature flags + A/B testing + LLM observability + (newer) error tracking.

Strengths:
- One bill, one SDK, one identity layer across analytics surfaces
- Generous free tier (1M events/mo, 5K replays/mo, 1M flag requests/mo, free)
- Open-source — option to self-host (most teams use cloud)
- Strong product velocity (new features every quarter)
- Decent UX, improving fast
- pgvector / SQL access if you want raw data
- LLM observability for AI products

Weaknesses:
- Per-event pricing scales — at very high event volume, can be expensive
- The bundle is broad; some individual surfaces (cohort analysis, funnel sophistication) lag dedicated competitors
- Self-host operational overhead is real if you choose that path
- Some enterprise features mature compared to Amplitude

Default for: most indie SaaS in 2026. The "I'll just use PostHog" answer is correct ~70% of the time.

### Mixpanel — Event-Funnel Rigor
Mixpanel has been the product-analytics category leader since the early 2010s. Strong on event-based funnels, cohort analysis, and the discipline of well-defined event taxonomy.

Strengths:
- Best-in-class funnel analysis
- Strong cohort and segmentation
- Mature SDKs across every platform
- Generous free tier (20M events/mo on the free plan as of 2026)
- Good for teams who want to enforce event-taxonomy hygiene

Weaknesses:
- No bundled session replay, feature flags, or A/B testing — those need separate tools
- Event-based-first means web-traffic-style use cases need workarounds
- Pricing past free tier is event-volume sensitive

Pick Mixpanel when: product analytics is the only need (you have separate tools for replay/flags), and your team values event-taxonomy discipline.

### Amplitude — Enterprise Product Analytics
Amplitude targets mid-market and enterprise. Strong on predictive analytics, cohort sophistication, and behavioral modeling.

Strengths:
- Most sophisticated cohort definitions in the category
- Predictive analytics (likelihood-to-convert, likelihood-to-churn)
- Strong governance and team-management features
- Recommendations engine
- Good enterprise SLAs

Weaknesses:
- Pricing scales fast at volume; Plus tier ($49/mo) is limited; enterprise contracts are real
- The UI is dense (powerful but not friendly)
- Overkill for indie SaaS in early stages

Pick Amplitude when: scaling toward enterprise, willing to pay for the sophistication, and have a dedicated data person who can use the depth.

### Heap — Auto-Capture
Heap's bet: capture every event automatically (clicks, page views, form submissions) and let you define funnels retroactively. No manual instrumentation. The trade-off: data volumes are massive.

Strengths:
- Zero instrumentation effort
- Retroactive funnel definition (define a funnel today using events from 6 months ago, no setup needed at the time)
- Strong session replay
- Surfaces unexpected behaviors you wouldn't have known to instrument

Weaknesses:
- Auto-capture means a lot of noise in events
- Pricing scales with event volume (and event volume is huge with auto-capture)
- Less control over event quality
- Smaller community than Mixpanel/Amplitude

Pick Heap when: small team that doesn't want to maintain event-taxonomy discipline, willing to pay for auto-capture convenience.

### June — B2B SaaS-Templated
June targets B2B SaaS specifically. Pre-built reports for the questions B2B founders actually ask: who's at risk, who's expanding, what's our activation rate.

Strengths:
- Pre-built reports save weeks of dashboard-building
- Integrates with HubSpot / Stripe / Salesforce out of the box
- Customer-shaped data model (account-first, not just user-first)
- Generous free tier
- Strong DX

Weaknesses:
- Less flexible than PostHog / Mixpanel / Amplitude for custom queries
- Smaller surface for non-B2B-SaaS use cases
- Newer; smaller community

Pick June when: B2B SaaS, value out-of-the-box reports over flexibility, want fast time-to-insight.

### Vercel Analytics — Vercel-Native Web + Web Vitals
[Vercel Analytics](../cloud-and-hosting/vercel-analytics.md) covers web traffic + Web Vitals (RUM) for Vercel-deployed apps.

Strengths:
- Privacy-first (no cookies, no personal data tracked)
- Web Vitals built in (Core Web Vitals scoring)
- Zero setup if you're on Vercel
- Generous Hobby tier
- Pairs well with Vercel Speed Insights

Weaknesses:
- Web traffic + Web Vitals only — not product analytics
- Vercel-stack lock-in
- Less detailed than full analytics tools

Pick Vercel Analytics when: Vercel-native, want privacy-first marketing-site analytics, pair with PostHog or Mixpanel for product analytics.

### Plausible / Fathom / Simple Analytics
GA replacements. Privacy-first, lightweight, EU-friendly (no cookies, no PII tracking, GDPR-compliant by default).

Pick when: marketing site analytics, value privacy + lightweight + EU-compliance over feature depth.

### Google Analytics 4
Free, comprehensive, integrated with Google Ads. UX is rough. GDPR-compliance requires careful configuration.

Pick when: you need free + ecosystem (Google Ads / Search Console integration).

### Statsig — Experimentation-First
Statsig leads with feature flags + experimentation, with analytics as a layer on top. Strong fit for teams whose primary practice is shipping behind flags.

Pick when: your team's velocity depends on experimentation more than analytics.

### Pendo / Gainsight PX
Mid-market product analytics tied to customer-success motions. In-product guides + analytics + customer health.

Pick when: you have a dedicated customer-success team and a complex product onboarding motion.

## What None of Them Solve

- **Defining what to measure.** Tools track events; you decide which events matter. Bad event taxonomy with great tooling produces garbage in, garbage out. Define your activation event, retention event, and conversion event before you instrument.
- **Identity unification.** Anonymous user → email signup → paid customer → enterprise account. Stitching identities across these stages is the hardest analytics problem; every tool half-solves it. Manual hygiene matters.
- **Acting on data.** Most teams build dashboards, look at them once, and never act. Analytics that don't change behavior are decoration. Build the cadence of weekly review and quarterly retro per [A/B Testing](../../../VibeWeek/6-grow/ab-testing-chat.md).
- **Privacy compliance.** GDPR, CCPA, India DPDP, etc. The tool gives you knobs; you configure them correctly. Default settings are not GDPR-safe in most cases.
- **The bus-factor problem.** If only one person on the team understands the analytics tool, knowledge dies when they leave. Document the event taxonomy and the dashboard catalog.
- **Cost predictability.** Per-event pricing means a viral spike or instrumentation bug can multiply your bill 10x in a week. Set hard caps where possible; alert on spend.

## Pragmatic Stack Patterns

**Indie SaaS, pre-revenue → first 1,000 customers**:
- PostHog (free tier covers everything)
- Vercel Analytics (free) for marketing site if on Vercel
- Total: $0/mo. Don't add complexity.

**Indie SaaS, $1K-$50K MRR**:
- PostHog ($0-$50/mo as you scale)
- Skip Mixpanel/Amplitude until PostHog genuinely doesn't fit
- Web traffic: Vercel Analytics or Plausible
- Total: $0-$70/mo

**B2B SaaS that wants out-of-the-box reports**:
- June ($149/mo) for templated B2B reports
- PostHog (free) for replay + flags
- Or: PostHog only with manual dashboard build

**Mid-market, scaling team, Mixpanel/Amplitude existing investment**:
- Mixpanel or Amplitude for product analytics
- Plus a separate replay tool (PostHog replay free tier, FullStory enterprise)
- Plus a separate flags tool (PostHog, LaunchDarkly, Statsig)
- Plus warehouse-driven analytics for revenue/finance views (Snowflake/BigQuery + Looker/Mode)

**Marketing-site only, no app yet**:
- Vercel Analytics (Vercel) or Plausible / Fathom
- Skip product analytics until there's a product

**LLM-heavy product**:
- PostHog LLM Observability or Helicone/Langfuse (per [Observability Providers](observability-providers.md))
- Plus product analytics for non-LLM behaviors

## Decision Framework: Three Questions

1. **Are you mostly product analytics, or marketing-site analytics, or both?** → Both: PostHog. Product only: PostHog or Mixpanel. Marketing only: Vercel Analytics or Plausible.
2. **Do you want bundled (replay + flags + experiments) or best-in-class per surface?** → Bundled: PostHog. Best-in-class: Mixpanel for funnels + LogRocket for replay + LaunchDarkly for flags.
3. **Are you B2B SaaS wanting out-of-the-box reports?** → June. Otherwise: PostHog or Mixpanel.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **PostHog**. Spending more than a day picking is a sign you're avoiding the harder work of defining what to measure.

## Verdict

For most readers building a SaaS in 2026:
- **Default**: PostHog. Free tier real, bundle is broad, scaling path clear.
- **Marketing-site only**: Vercel Analytics or Plausible.
- **Product analytics with strong taxonomy**: Mixpanel.
- **Scaling toward enterprise with predictive needs**: Amplitude.
- **Don't want to maintain taxonomy**: Heap.
- **B2B SaaS with templated reports**: June.
- **Experimentation-led team**: Statsig.

The hidden cost in analytics is the *team's* time defining and maintaining event taxonomy. Picking a tool with bundled features (PostHog) reduces tool-juggling but increases the importance of clean events. Picking a best-in-class-per-surface stack (Mixpanel + LogRocket + LaunchDarkly) gives you depth at the cost of identity fragmentation. Most indie SaaS in 2026 should bundle.

## See Also

- [Analytics](analytics.md) — generic concepts overview (this guide is the opinionated provider comparison)
- [PostHog Setup](../../../VibeWeek/6-grow/posthog-setup-chat.md) — companion implementation guide for the default choice
- [Vercel Analytics](../cloud-and-hosting/vercel-analytics.md) — Vercel-native web traffic deep-dive
- [Observability Providers](observability-providers.md) — companion comparison for app/error/log monitoring
- [A/B Testing](../../../VibeWeek/6-grow/ab-testing-chat.md) — uses analytics + flags + experimentation
- [Activation Funnel](../../../VibeWeek/6-grow/activation-funnel-chat.md) — the analytics-driven activation diagnosis
- [Reduce Churn](../../../VibeWeek/6-grow/reduce-churn-chat.md) — analytics-driven churn risk model
- [Trial-to-Paid Conversion](../../../VibeWeek/6-grow/trial-to-paid-chat.md) — funnel that depends on analytics instrumentation

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
