# Session Replay Providers: PostHog, LogRocket, FullStory, Hotjar, Microsoft Clarity, Highlight, Mouseflow, Pendo, Heap, Smartlook

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a SaaS in 2026 and trying to pick a session replay tool, this is the consolidated comparison. Session replay is the line item that customers love when they need it — "show me what the user did before the bug" — and resent the rest of the time, because the bills can balloon and the privacy implications get loud. Most indie SaaS over-invest in LogRocket too early ("we'll debug everything from replays") or default to free Microsoft Clarity and miss the dev signal they actually needed. Pick the right shape and replay becomes a debugging superpower; pick wrong and it becomes a privacy headache and a $400/mo invoice for sessions nobody watches.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| PostHog Session Replay | Replay + analytics + flags | Free (5K replays/mo) | Bundled with PostHog | Yes (AGPL) | Very high | Default for indie SaaS already on PostHog |
| LogRocket | Dev-focused replay | 1K sessions/mo | $31/mo (Team) | No | High | Frontend-heavy debugging with stack traces |
| FullStory | UX + replay enterprise | 14-day trial | $99+/mo (custom) | No | Low | Enterprise UX research teams |
| Hotjar | Heatmaps + replay (UX) | Free (35 sessions/day) | $32/mo (Plus) | No | Medium | Marketing / CRO use cases |
| Microsoft Clarity | Free everything | Truly free, unlimited | $0 | No | High | Truly budget-zero replay |
| Highlight.io | Open-source dev replay | Free (500 sessions/mo) | $50/mo | Yes (Apache 2.0) | High | Frontend devs who want OSS replay |
| Mouseflow | UX + replay | 14-day trial | $39/mo (Starter) | No | Medium | UX teams comparing tools |
| Pendo | Product + replay | Custom | Sales-led | No | Very low | Mid-market+ product teams already on Pendo |
| Heap | Retroactive analytics + replay | Custom | Sales-led | No | Low | Data-driven product teams |
| Smartlook | Web + mobile replay | Free (1.5K sessions/mo) | $39/mo | No | Medium | Mobile-app replay with web parity |

The first decision is **what shape of replay you actually need**. Dev-debugging replay (errors + console + network), UX research replay (heatmaps + scrolls + clicks), and product-analytics replay (sessions tied to events + cohorts) are three overlapping but different problems with three different bills. Most indie SaaS need exactly one of these — picking wrong wastes the budget.

## Decide What You Need First

Replay tools are not interchangeable. Get the use case wrong and you'll either pay for capabilities you ignore or miss the ones you actually needed.

### Dev debugging replay (the 50% case for indie SaaS)
You want replays tied to errors so you can see what the user did before the exception. The replay shows console logs, network requests, Redux/state inspection, and stack traces. Your audience is engineers, not marketers.

Right tools:
- **PostHog Session Replay** if you're on PostHog
- **LogRocket** for dev-first replay with strong stack-trace integration
- **Highlight.io** for OSS dev replay
- **Sentry Session Replay** if you're already on Sentry — see [error-monitoring-providers](error-monitoring-providers.md)

### UX research replay (when you want to understand how users move through the product)
You want heatmaps, click maps, scroll depth, rage clicks, and replays you can filter by user journey. Your audience is designers and PMs.

Right tools:
- **Hotjar** — UX research default
- **Mouseflow** — alternative with similar feature set
- **FullStory** — premium-priced; deeper insights
- **Microsoft Clarity** — free heatmaps + replay

### Product-analytics replay (when replays are linked to events and cohorts)
You want sessions filtered by feature usage, cohort, or funnel position. The replay is one tab inside a product analytics platform.

Right tools:
- **PostHog Session Replay** — bundled with PostHog
- **Pendo Session Replay** — bundled with Pendo
- **Heap Session Replay** — bundled with Heap
- **Amplitude Session Replay** — bundled with Amplitude

For most indie SaaS in 2026: **PostHog Session Replay if you already use PostHog; LogRocket or Sentry Replay if you don't**. Skip enterprise tools (FullStory, Pendo, Heap) until your scale justifies them.

## Provider Deep-Dives

### PostHog Session Replay — The Indie Default
PostHog includes session replay as a core product alongside analytics, feature flags, and surveys. Free tier is generous; OSS option means full self-host control. Most indie SaaS that have any product-analytics need should default here.

Strengths:
- Bundled with PostHog free tier (5K replays/mo)
- Open-source (AGPL); fully self-hostable
- Replays linked to PostHog cohorts, events, and feature flags
- Console logs and network requests captured
- Strong React, Next.js, Vue, mobile (iOS/Android) SDKs
- Local SDK evaluation for flags reduces friction
- Data ownership: your replays, your DB

Weaknesses:
- Less feature-rich than LogRocket for pure dev debugging
- AGPL license has implications for some legal teams
- Self-host requires infra (Postgres + ClickHouse + Redis)
- Tied to PostHog product analytics — picking it often means picking PostHog

Pick when: you already use PostHog (or plan to). There's no reason to pay another vendor for replay if PostHog is in your stack.

### LogRocket — Frontend Dev Debugging
LogRocket is the dev-focused replay tool. Strong on Redux/state inspection, stack-trace tying, and frontend performance. Best for engineering teams whose primary use is "what did the user do before this exception?"

Strengths:
- Strong dev signal: console logs, network requests, Redux/state, stack traces
- Replays tied to errors automatically
- Performance metrics (Web Vitals, slow renders) bundled
- Good React, Vue, Angular, mobile SDKs
- Reasonable starter pricing ($31/mo Team)
- Fast initial setup

Weaknesses:
- Not OSS / no self-host
- Pricing scales with sessions (can grow fast at indie scale)
- Less useful for UX research / non-dev teams
- Sample-based recording at lower tiers

Pick when: you're frontend-heavy, your primary use case is debugging, and you don't already have PostHog or Sentry replay covered.

### FullStory — Enterprise UX + Replay
FullStory is the enterprise-grade UX research and replay tool. Pixel-perfect replays, AI-driven anomaly detection, and powerful funnel analysis. The bill matches the capability.

Strengths:
- Pixel-perfect replays (highest fidelity in this list)
- AI-driven anomaly detection ("users are rage-clicking a new button")
- Strong funnel and journey analysis
- Robust enterprise compliance (SOC 2, HIPAA, automated data masking)
- Good Mobile SDKs

Weaknesses:
- Starter pricing is mid-market territory; indie tiers don't really exist
- Sales-led even at lower tiers
- Overkill for most indie SaaS
- UI is dense; learning curve

Pick when: you've outgrown indie-tier tools, you have a UX research team, and pixel-perfect fidelity is required (highly visual UI, design-led product).

### Hotjar — UX Research Default
Hotjar is the marketing/CRO/UX team's default. Heatmaps, scroll maps, session recordings, surveys, and feedback widgets in one tool. Less dev-focused than LogRocket.

Strengths:
- Best-in-class heatmaps
- Session recording with rage-click and U-turn detection
- On-page surveys and feedback widgets
- Free tier (35 sessions/day)
- Reasonable starter pricing
- Easy to set up; non-technical-team friendly

Weaknesses:
- Sample-based recording (misses sessions at scale)
- Less dev-friendly (no stack traces, limited console capture)
- No event-based filtering (can't say "show me replays where user clicked X")
- Limited mobile-app support

Pick when: your replay use case is UX research and CRO (conversion-rate optimization), not engineering debugging.

### Microsoft Clarity — Truly Free
Clarity is Microsoft's free session replay + heatmaps tool. Unlimited sessions, no paid tier, ads-funded somehow. Useful for budget-zero starts; trade-offs are real.

Strengths:
- Truly free, unlimited sessions, no upsell
- Heatmaps, scroll maps, click maps included
- Surprisingly polished UI
- Quick setup
- Good for high-traffic sites

Weaknesses:
- Microsoft owns the data; some teams won't accept this
- Data residency questions (especially for EU customers)
- No deep event integration
- Limited dev-focused features (no stack traces, limited console)
- Privacy posture is acceptable but less granular than paid tools
- Not a fit for B2B SaaS handling sensitive data

Pick when: you want zero-cost replay, you're consumer or low-sensitivity B2B, and you're comfortable with Microsoft holding the data.

### Highlight.io — Open-Source Dev Replay
Highlight.io is the OSS dev-replay tool. Apache 2.0 licensed, fully self-hostable, with errors + traces + replay stitched together. Strong fit for OSS-leaning teams.

Strengths:
- Apache 2.0 OSS; corporate-friendly license
- Fully self-hostable
- Replay tied to errors and traces (similar to LogRocket but OSS)
- Strong React, Next.js, Vue, Angular SDKs
- Active community; growing fast
- Free hosted tier (500 sessions/mo)

Weaknesses:
- Younger product than LogRocket
- Smaller ecosystem of integrations
- Backend tracing is newer; less mature than the frontend story
- Self-host is non-trivial (multiple services)

Pick when: you want OSS dev replay, you're frontend-heavy, and you'd rather self-host or pick a tool with a license your legal team accepts.

### Mouseflow — Hotjar Alternative
Mouseflow is a direct Hotjar competitor with similar feature set. Heatmaps, replays, funnels, form analytics. Pricing similar; pick based on UX preference and trial.

Strengths:
- Strong heatmaps and friction analysis
- Form analytics (which fields cause abandonment)
- Funnel + replay integration
- Reasonable pricing

Weaknesses:
- Brand awareness lower than Hotjar
- Less UX-research depth than FullStory
- No deep dev integration
- Smaller community

Pick when: you want a Hotjar-equivalent and you've evaluated both — Mouseflow occasionally wins on form analytics specifically.

### Pendo Session Replay — Bundled With Pendo
Pendo bundles session replay with in-app guides, surveys, and product analytics. If you're a Pendo shop, replay comes naturally; if not, the bundling is the cost.

Strengths:
- Bundled with Pendo product platform
- Replay tied to Pendo events and segments
- Strong in-app guidance and onboarding tooling
- SOC 2 + enterprise-grade compliance

Weaknesses:
- Custom pricing; no free tier
- Sales-led from the start
- Indie scale doesn't exist
- Tied to Pendo — picking replay means picking Pendo

Pick when: you're already on Pendo or are planning to be. Don't pick standalone for indie scale.

### Heap Session Replay — Retroactive + Replay
Heap's product analytics auto-captures every event by default; replay is the visual layer on top. Useful for teams that want "see every interaction" without instrumentation.

Strengths:
- Auto-capture of all events
- Retroactive analytics (analyze events from before they were defined)
- Replay tied to event sessions
- Good cohort and funnel analysis

Weaknesses:
- Custom pricing; no indie-friendly free tier
- Auto-capture creates noise (everything is captured, signal-to-noise ratio matters)
- Sales-led
- Mid-market+ pricing

Pick when: you're already on Heap or moving to it. Auto-capture is the differentiator; replay is the surface.

### Smartlook — Web + Mobile Replay
Smartlook is dual-strong on web and mobile (iOS/Android). Free tier exists. Best fit for mobile-app replay parity.

Strengths:
- Strong mobile SDKs (web + iOS + Android)
- Free tier (1.5K sessions/mo)
- Heatmaps + replay
- Crash analytics on mobile
- GDPR-conscious

Weaknesses:
- Smaller community
- Less feature depth than category leaders
- Pricing scales with session count
- Less integration breadth

Pick when: mobile-app replay is a primary use case alongside web — most pure-web tools have weaker mobile stories.

## What Session Replay Won't Do

- **Replace product analytics.** Replay shows individual sessions; analytics shows aggregate behavior. You need both. See [product-analytics-providers](product-analytics-providers.md).
- **Replace error monitoring.** Replay shows what happened; error monitoring tells you it's broken. See [error-monitoring-providers](error-monitoring-providers.md).
- **Be GDPR-compliant by default.** Every replay tool can capture PII (names, emails, payment info) inside form fields. You configure masking rules; the tool doesn't read your privacy policy. Get this wrong and you're shipping a privacy violation.
- **Help if nobody watches.** A team that captures 100K replays/mo and watches 5 of them is paying for storage. Either watch them in response to specific signals (errors, user feedback) or cut the volume.
- **Replace user research.** Replays tell you WHAT happened, not WHY. Pair with [customer feedback](https://www.vibeweek.com/6-grow/customer-feedback-surveys-chat) or interviews to understand intent.

## Privacy: Don't Skip This

Session replay is the highest-risk product category for accidental privacy violations. Every tool below requires deliberate configuration to avoid capturing sensitive data.

```
The non-negotiable privacy checklist:

**1. Mask all input fields by default.**
- Most tools support `data-private` or class-based masking — apply globally
- Then opt-out specific fields you DO want to see (search, filters, etc.)
- NEVER let payment forms, password fields, or PII through

**2. Block specific URLs from recording.**
- /billing, /checkout, /password-reset, /onboarding-with-pii — exclude entirely
- Sensitive workflows shouldn''t be recorded at all

**3. Configure consent (GDPR / CCPA).**
- For EU users: cookie consent must include session replay opt-in
- Default to NOT recording until consent is given (in EU)
- Some tools (PostHog, Clarity) support consent-aware capture

**4. Set short retention.**
- 30 days is enough for most debugging
- Longer retention means more data at risk in a breach
- Pick retention by tier: longer for paying customers if needed

**5. Document what you capture and where it goes.**
- Privacy policy needs an explicit section
- DPA / data processing addendum if you''re selling to EU customers
- Subprocessor list (the replay vendor) published in your trust center

**6. Audit what you''re capturing periodically.**
- Quarterly: open 10 random replays. Are they showing PII you didn''t intend to capture?
- Fix any leaks immediately
```

The single biggest failure mode: **defaulting to "capture everything; mask later."** Once a payment form gets recorded, the tape is in someone else's database — even after you "delete" it. Default to masked; opt-in to capture; audit regularly.

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / SvelteKit / Astro**:
- PostHog Session Replay (bundled with analytics + flags)
- Total: $0 on free tier; $250/mo at moderate scale

**Frontend-heavy debugging**:
- Sentry Session Replay (if already on Sentry)
- Or LogRocket
- Total: $26-50/mo

**Budget-zero, low-sensitivity**:
- Microsoft Clarity (free, unlimited)
- Total: $0

**OSS / self-host**:
- PostHog (self-hosted) or Highlight.io (self-hosted)
- Total: infrastructure cost only

**UX research / CRO-heavy**:
- Hotjar or FullStory
- Pair with PostHog for product analytics
- Total: $32-99/mo for replay; +PostHog cost

**Mobile-first product**:
- Smartlook for mobile
- Or PostHog (mobile SDKs are competent)
- Total: $39+/mo

## Decision Framework: Three Questions

1. **Are you already on a product analytics platform?** → Yes: use the bundled replay (PostHog, Heap, Pendo, Amplitude). No: standalone (LogRocket, Hotjar, Clarity).
2. **What's the primary use case?** → Dev debugging: LogRocket / Highlight / Sentry. UX research: Hotjar / FullStory. Both: PostHog.
3. **Self-host required?** → Yes: PostHog or Highlight. No: anything else.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **PostHog Session Replay if you use PostHog; LogRocket or Sentry Replay if you don't**. Skip the enterprise tools until you've outgrown indie scale.

## Verdict

For most readers building a SaaS in 2026:
- **Default if on PostHog**: PostHog Session Replay (bundled, free tier).
- **Default if not on PostHog**: LogRocket ($31/mo) or Sentry Replay (already paying for Sentry).
- **Budget-zero**: Microsoft Clarity.
- **OSS / self-host**: PostHog or Highlight.io.
- **UX research / CRO**: Hotjar.
- **Enterprise UX**: FullStory.
- **Mobile-first**: Smartlook or PostHog mobile.

The hidden cost in session replay isn't the SDK — it's **bandwidth, storage, and PII risk**. A team that records 50K sessions/mo and watches 20 is overpaying and over-collecting. Pair sampling with on-demand capture (record sessions only when an error fires; record only X% of all sessions; record 100% on the checkout flow with full masking). Tune the volume. Audit privacy quarterly. The tool is the easy part; the operational discipline is what makes replay sustainable.

## See Also

- [Error Monitoring Providers](error-monitoring-providers.md) — replay is most useful tied to errors
- [Product Analytics Providers](product-analytics-providers.md) — replay complements aggregate analytics
- [Observability Providers](observability-providers.md) — backend traces complement frontend replays
- [Feature Flag Providers](feature-flag-providers.md) — replays filtered by flag exposure are powerful
- [PostHog Setup](https://www.vibeweek.com/6-grow/posthog-setup-chat) — implementation guide
- [Customer Feedback Surveys](https://www.vibeweek.com/6-grow/customer-feedback-surveys-chat) — replay shows what; surveys explain why

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
