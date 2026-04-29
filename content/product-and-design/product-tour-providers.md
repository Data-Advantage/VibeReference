# Product Tour & Onboarding Providers: Userpilot, Appcues, Pendo, Userflow, Chameleon, Intro.js, Userguiding, WalkMe, Frigade

[⬅️ Product & Design Overview](../product-and-design/)

If you're building a SaaS in 2026 and trying to pick a product-tour or in-app onboarding tool, this is the consolidated comparison. Product tours are the line item that looks like a quick "show new users around" feature until you discover that "the right time to show this checklist" is roughly twelve product decisions deep — at which point you're either rebuilding it as in-app code or writing a $40K/yr check to Pendo. Most indie SaaS over-rely on tooltips and never measure activation lift; mid-market teams over-invest in WalkMe before they have a working onboarding hypothesis. Pick the right shape early and your activation rate compounds; pick wrong and you ship "tour theater" that users dismiss without reading.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Frigade | Modern dev-friendly checklist + tours | Free (up to 1K MAU) | $99/mo | No | Very high | Indie SaaS / dev-leaning teams in 2026 |
| Userflow (now Appcues) | Modern visual builder | 14-day trial | $250/mo+ | No | High | Mid-market that wants no-code flows |
| Appcues | Mature in-app onboarding | 14-day trial | $300/mo+ | No | Medium | Established SaaS with PM-led flows |
| Userpilot | Onboarding + analytics | 14-day trial | $249/mo+ | No | Medium | Mid-market focused on activation metrics |
| Pendo Guide | Bundled with Pendo analytics | Custom | Sales-led ($1K+/mo) | No | Low | Teams already on Pendo |
| Chameleon | Targeted onboarding | 14-day trial | $279/mo+ | No | Medium | Highly-segmented onboarding flows |
| Userguiding | Budget option | 14-day trial | $89/mo | No | High | Bootstrapped indies wanting tours |
| WalkMe | Enterprise digital adoption | Custom | $50K+/yr | No | Very low | Enterprise digital-adoption programs |
| Intro.js / Driver.js | OSS DIY libraries | Free | Free | Yes (MIT) | Very high | Devs who want to roll their own |
| Custom in-app code | DIY | Free | Cost of your time | N/A | Medium | When tours are deeply product-coupled |

The first decision is **whether you actually need a tool**. Many SaaS products ship "tours" that nobody completes; the right answer is often a sharper empty state, better defaults, and one or two contextual nudges — not a 9-step product walkthrough.

## Decide What You Need First

Product-tour tools are not interchangeable. Worse, "we need product tours" is often the wrong frame. Decide what onboarding pattern you actually need.

### Activation-driven nudges (the 60% case for indie SaaS)
You want small, contextual prompts that appear when a new user is one click away from a key action: "Try creating your first project" or "Connect your data to see results." Not a 9-step tour; a few well-placed hints.

Right tools:
- **Frigade** — modern dev-friendly default in 2026
- **Intro.js / Driver.js** — OSS libraries
- **Custom in-app code** — when nudges are deeply product-coupled

### Multi-step guided onboarding (when first-run requires a flow)
You want a structured, multi-step flow new users walk through before reaching the main app. Common in products with high setup overhead (data ingestion, integrations, configuration).

Right tools:
- **Frigade** for indie scale
- **Userpilot** or **Appcues** for mid-market with PM-led ownership
- **Chameleon** for segmented variants

### Adoption / change management (enterprise)
Existing users have to learn new features as the product evolves. Or: the product is complex and ongoing in-app guidance is part of the experience.

Right tools:
- **Pendo Guide** — bundled with analytics
- **WalkMe** — enterprise digital adoption
- **Userpilot** with onboarding-analytics integration

### Empty states + defaults (often the best answer)
You don't need a tool. You need:
- A useful empty state showing what to do
- Sensible defaults so the user lands on something workable
- Sample data populated automatically
- A first-run experience designed into the product itself

For most indie SaaS in 2026: **fix empty states first; add Frigade for activation nudges; skip enterprise tools until you have enterprise scale**. Tour tools are the answer to a question you should ask third, not first.

## Provider Deep-Dives

### Frigade — The Modern Dev-Friendly Default
Frigade emerged in 2023 as a developer-focused alternative to Appcues. React-first, Git-friendly content, generous free tier. Has gained traction in 2024-2026 among indie SaaS and dev-leaning teams.

Strengths:
- React-first (drop-in components for checklists, flows, tours)
- Free tier (up to 1,000 MAU)
- $99/mo Pro for indie-scale
- Content can live in code (not just a no-code builder)
- Modern UX
- Good analytics integration
- Strong API and event-tracking

Weaknesses:
- Younger product; smaller integration ecosystem than Appcues
- Less polished no-code editor than Userflow / Appcues
- React-leaning (other frameworks supported but not the strength)

Pick when: you''re a React-based SaaS, you want dev-friendly tooling, and you don''t need enterprise procurement features.

### Userflow (now Appcues) — Modern Visual Builder
Userflow was acquired by Appcues in 2024 and continues as a sister product. Modern, visual-first builder with a slightly cleaner UX than parent Appcues for in-app flows.

Strengths:
- Clean visual builder
- Good targeting (segment users by attributes / events)
- Strong checklist + flow + survey + announcement coverage
- Customizable styling
- Solid analytics

Weaknesses:
- $250/mo+ entry; mid-market territory
- Acquisition by Appcues creates roadmap uncertainty
- Smaller community than Appcues / Pendo

Pick when: you want a visual-first builder and you''re mid-market scale.

### Appcues — Mature Mid-Market Default
Appcues has been the in-app onboarding default for years. Mature; PM-friendly visual editor; broad integration ecosystem.

Strengths:
- Most mature in this list (founded 2013)
- Strong visual builder for non-technical PMs
- Good targeting and segmentation
- Mobile (iOS / Android) support
- Strong checklist + flow + tooltip coverage
- Established integration ecosystem

Weaknesses:
- $300/mo+ entry pricing
- Some legacy UX patterns
- Tour-heavy products end up looking similar across customers
- Less dev-friendly than Frigade

Pick when: you''re mid-market, you have a PM owning onboarding, and you''ve outgrown Frigade.

### Userpilot — Onboarding + Analytics
Userpilot bundles onboarding with product analytics. Useful when you want one tool for "show this hint" and "measure activation."

Strengths:
- Onboarding + product analytics in one tool
- Good segmentation
- Activation-funnel reporting built-in
- $249/mo+ entry
- Strong NPS / survey integration

Weaknesses:
- Less mature than Appcues
- Smaller community
- Bundled analytics may not be best-in-class (compare to PostHog / Mixpanel / Amplitude)

Pick when: you want one tool for onboarding + analytics and you don''t already have a separate product-analytics platform.

### Pendo Guide — Bundled With Pendo Analytics
Pendo Guide is the in-app guidance product inside Pendo''s broader product platform. Compelling if you''re already on Pendo; less compelling otherwise.

Strengths:
- Bundled with Pendo product analytics
- Strong segmentation and targeting
- Enterprise-grade compliance (SOC 2, HIPAA, etc.)
- Pendo session replay integration
- In-app feedback / NPS bundled

Weaknesses:
- Custom pricing; sales-led; $1K-$5K+/mo typical
- Heavy product surface; long onboarding for the team to learn
- Tied to Pendo — picking Guide often means picking Pendo

Pick when: you''re already on Pendo or planning to be. Don''t pick standalone for indie scale.

### Chameleon — Segmented Onboarding
Chameleon is similar to Appcues / Userpilot but emphasizes segmentation and personalization. Good fit for products with diverse user types needing different onboarding flows.

Strengths:
- Strong segmentation primitives
- Good multi-flow management
- Survey + product tour + announcement coverage
- A/B testing built in
- Reasonable pricing for the feature set

Weaknesses:
- $279/mo+ entry
- Smaller community than Appcues / Pendo
- UI feels a bit older

Pick when: you have multiple distinct user personas needing different onboarding flows.

### Userguiding — Budget Option
Userguiding is the cheap option in this category. Solid feature set; lower polish; lower price.

Strengths:
- $89/mo entry — cheapest serious tool
- Workable feature set (tours, checklists, hotspots, NPS)
- Reasonable for bootstrapped indies
- Decent visual builder

Weaknesses:
- UI / UX less polished than category leaders
- Smaller community
- Less feature depth at scale

Pick when: budget is the primary constraint and Frigade''s free tier doesn''t fit.

### WalkMe — Enterprise Digital Adoption
WalkMe is the enterprise-scale digital adoption platform. Used to overlay guidance across enterprise software stacks (Salesforce, Workday, etc.) — not just one product.

Strengths:
- Most powerful in this list at enterprise scale
- Cross-application overlay (works across multiple tools)
- Strong analytics on adoption
- Enterprise compliance and procurement-ready

Weaknesses:
- $50K+/yr starting; not for indie
- Heavy implementation
- Sales-led
- Overkill for single-product SaaS

Pick when: you''re enterprise; cross-application adoption is the use case (rare for product SaaS).

### Intro.js / Driver.js — OSS DIY Libraries
Intro.js and Driver.js are OSS JavaScript libraries that let you build product tours yourself. Low cost; high control; more engineering time.

Strengths:
- Free; OSS
- Full control over behavior and styling
- No vendor lock-in
- Lightweight (a few KB)
- React, Vue, vanilla JS support

Weaknesses:
- You build everything (segmentation, targeting, analytics)
- No visual builder
- Limited features vs hosted tools
- Maintenance burden

Pick when: tours are very simple, devs are cheap, or you want zero vendor dependency.

### Custom In-App Code — When Tours Are Product-Coupled
Sometimes the "tour" is too tightly coupled to product state to fit any tool. Build it natively.

When this works:
- The empty state IS the tour
- Tour steps depend on user data state in ways tools can''t target easily
- The team has React / frontend bandwidth

When this fails:
- The tour becomes an unmaintained pile of conditionals
- Adding new tour steps requires deploys
- Non-engineers can''t edit copy

Pick when: tours are integrated deeply with product state, and you have engineering bandwidth.

## What Product-Tour Tools Won''t Do

- **Replace a working empty state.** A 9-step tour that walks users through "click here, now click here" doesn''t teach intent. Empty states with one clear CTA outperform.
- **Replace product analytics.** Most tools track tour completion; they don''t track downstream activation. Pair with [product analytics](../devops-and-tools/product-analytics-providers.md).
- **Fix a confusing product.** A complex product needs simplification, not a tour overlaid on the complexity. Tours can''t cover up bad UX forever.
- **Drive long-term retention.** Activation lift is real; retention lift is rare. Don''t expect tours to fix churn.
- **Replace customer support.** Tours teach the basics; complex questions still need [support tools](customer-support-tools.md).

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / TypeScript**:
- Frigade for activation nudges + first-run flow
- PostHog for activation analytics
- Total: Frigade free tier or $99/mo

**OSS / DIY**:
- Intro.js or Driver.js for the tour mechanics
- Custom in-app components for activation milestones
- Total: $0

**Mid-market PM-owned**:
- Appcues or Userpilot
- Pair with separate product analytics (PostHog / Mixpanel)
- Total: $249-300/mo

**Already on Pendo**:
- Pendo Guide
- One vendor; consolidated UX
- Total: depends on Pendo plan

**Budget-driven**:
- Userguiding ($89/mo) or Frigade free tier
- Total: $0-89/mo

**Enterprise**:
- WalkMe or Pendo Guide Enterprise
- Plan multi-month rollout
- Total: $50K+/yr

**Don''t-need-a-tool**:
- Sharper empty states + sensible defaults + sample data
- 1-2 inline tooltips in product code
- Total: $0; engineering time

## Decision Framework: Three Questions

1. **Have you fixed empty states and defaults yet?** → No: do that first; you may not need a tool. Yes: continue.
2. **What''s your team shape?** → Dev-led: Frigade or Intro.js. PM-led: Appcues or Userpilot. Pendo shop: Pendo Guide.
3. **What''s your scale?** → Indie (<5K MAU): Frigade or DIY. Mid-market: Appcues / Userpilot. Enterprise: WalkMe / Pendo.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Frigade if you want a hosted tool; Intro.js if you want OSS; nothing if your empty states aren''t great yet**.

## Verdict

For most readers building a SaaS in 2026:
- **Default for indie**: Frigade (free tier or $99/mo).
- **OSS / DIY**: Intro.js or Driver.js.
- **Mid-market PM-owned**: Appcues or Userpilot.
- **Already on Pendo**: Pendo Guide.
- **Budget-constrained**: Userguiding or Frigade free.
- **Enterprise**: WalkMe.
- **Don''t need a tool**: invest in empty states + defaults instead.

The hidden cost in product tours isn''t the seat fee — it''s **tour theater**. A 9-step tour that 80% of users dismiss in the first 3 seconds is worse than no tour. Measure tour completion AND downstream activation; cut tours that don''t move the needle. The discipline of "fewer, better tours, only at decision points" outperforms the volume strategy.

## See Also

- [Customer Support Tools](customer-support-tools.md) — distinct category; complementary
- [User Feedback](user-feedback.md) — feedback widgets often bundle with onboarding tools
- [UX Design](ux-design.md) — empty states and defaults live here
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — measure activation lift
- [Session Replay Providers](../devops-and-tools/session-replay-providers.md) — see where users drop off
- [Onboarding Flow](https://www.launchweek.com/4-convert/onboarding-flow) — strategic side of onboarding
- [Activation Funnel](https://www.vibeweek.com/6-grow/activation-funnel-chat) — the metric tours should move
- [PostHog Setup](https://www.vibeweek.com/6-grow/posthog-setup-chat) — pair tours with PostHog analytics
- [Free to Paid](https://www.launchweek.com/4-convert/free-to-paid) — tours play in this conversion path

---

[⬅️ Product & Design Overview](../product-and-design/)
