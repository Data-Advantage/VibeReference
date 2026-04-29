# Subscription Billing Providers: Stripe Billing, Lago, Orb, Metronome, Chargebee, Recurly, Maxio, Paddle Billing, Hyperline

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're building a SaaS in 2026 and trying to pick a billing system, this is the consolidated comparison. Subscription billing is the line item that looks free until you discover that "monthly per-seat with annual discount, prorated mid-cycle, with metered overages, with usage-based AI credits, with regional tax" is roughly six features deep — at which point you're either rebuilding billing in your app code or staring at a $50K Salesforce CPQ proposal. Most indie SaaS over-stretch Stripe Billing into shapes it wasn't designed for, then spend a month migrating to a dedicated billing engine. Pick the right shape early and billing becomes invisible plumbing; pick wrong and it's a perpetual project.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Stripe Billing | Payments + basic billing | Free (Stripe rates) | 0.4-0.7% on top of payment | No | Very high | Default for indie SaaS with simple recurring |
| Paddle Billing | Merchant of record + billing | Free (Paddle rates) | 5%+50¢ all-in | No | High | Indie SaaS that wants tax / global compliance bundled |
| Lemon Squeezy | Merchant of record (smaller) | Free (LS rates) | 5%+50¢ | No | Very high | Solo founders / one-person SaaS with global sales |
| Lago | Usage-based billing engine | Free (OSS) / Cloud free tier | $400/mo (Cloud Pro) | Yes (AGPL) | Very high | Usage-based products needing OSS / self-host |
| Orb | Usage-based billing engine | Custom | $1K-2K/mo | No | Medium | High-volume usage-based / metered SaaS |
| Metronome | Usage-based / consumption | Custom | $1K+/mo | No | Low | AI / infra products with complex usage models |
| Hyperline | Modern subscription engine | Custom (free trial) | $500+/mo | No | High | Mid-market B2B SaaS with hybrid pricing |
| Chargebee | Subscription + revops platform | 30-day trial | $599/mo (Performance) | No | Low | Mid-market+ that wants billing + revenue ops bundled |
| Recurly | Mature subscription billing | 14-day trial | $249/mo+ | No | Low | Established teams with complex subscription rules |
| Maxio (formerly Chargify) | B2B subscription billing | Custom | Sales-led | No | Very low | Enterprise B2B SaaS with complex contracts |
| Stripe Billing + custom code | DIY-extended | Free | Cost of your time | N/A | Medium | Teams who outgrew Stripe basics but aren't ready to migrate |

The first decision is **what shape of billing you actually need**. Simple recurring (per-seat or flat tiers), pure usage-based (metered consumption), or hybrid (recurring + overages + add-ons) are three different problems with three different tools. Most indie SaaS need the first; a growing minority need the third; only specific verticals need the second.

## Decide What You Need First

Billing tools are not interchangeable. Get the shape wrong and you'll either underpay for a tool that can't model your pricing or overpay for capabilities you'll never use.

### Simple recurring (the 70% case for indie SaaS)
Per-seat or flat tiers, monthly or annual, prorated mid-cycle changes, basic coupons. No metered usage, no complex contracts, no manual invoicing for enterprise.

Right tools:
- **Stripe Billing** — overwhelming default for SMB SaaS
- **Paddle / Lemon Squeezy** — when merchant-of-record (tax handled) matters
- **Polar** — newer entrant, dev-focused

### Hybrid (recurring + usage)
Per-seat base subscription PLUS usage-based overages or AI credits. Common modern shape; outgrows Stripe Billing fast at scale.

Right tools:
- **Lago** for OSS / self-host
- **Hyperline** for hosted, mid-market
- **Stripe Billing + extensions** for teams not ready to migrate

### Pure usage-based / metered
Customers pay only for what they use; no flat baseline. Common in AI, infra, communications APIs.

Right tools:
- **Orb** — usage-billing-first
- **Metronome** — high-volume usage-billing
- **Lago** — OSS option

### Enterprise / complex contracts
Custom contracts, multi-year, ramp deals, mid-cycle plan changes, custom invoicing, ASC 606 revenue recognition.

Right tools:
- **Chargebee** — mid-market default
- **Recurly** — mature alternative
- **Maxio** — enterprise B2B
- **Salesforce CPQ + Billing** — if you're already in Salesforce world

For most indie SaaS in 2026: **Stripe Billing if your pricing is simple; Lago if you have usage-based components; Paddle if you want merchant-of-record tax handling**. Don't migrate off Stripe Billing until your billing logic in app code starts looking dangerous.

## Provider Deep-Dives

### Stripe Billing — The Indie Default
Stripe Billing is bundled with Stripe Payments and is the default subscription billing engine for indie SaaS. Free aside from the standard Stripe payment processing fees (plus 0.4-0.7% on Billing-managed subscriptions). The product is good enough for ~70% of indie use cases.

Strengths:
- Bundled with Stripe Payments — no separate vendor
- Free tier (just standard Stripe rates)
- Customer Portal for self-serve subscription management
- Subscription Schedules for ramp deals
- Stripe Tax (separate add-on) for tax compliance
- Hosted invoice pages, Smart Retries, dunning emails included
- Massive ecosystem of integrations
- Excellent documentation
- Recent Pricing Tables product simplifies hosted checkout

Weaknesses:
- Usage-based billing (metering) is competent but limited (single-meter, harder for multi-axis usage)
- Plan changes mid-cycle have non-obvious proration math
- Reporting is light vs dedicated billing engines
- Multi-product subscriptions with multiple meters get complicated fast
- ASC 606 revenue recognition requires manual work or third-party tool
- Not a fit when you need merchant-of-record (taxes paid by Stripe)

Pick when: you're starting out with simple recurring (per-seat or flat tier) and you don't have multi-axis usage-based billing. Most indie SaaS should default here.

### Paddle Billing — Merchant of Record + Billing
Paddle handles the entire transaction — they're the merchant of record (MoR), meaning they pay the tax, handle compliance, and you get a single payout. Higher per-transaction fee than Stripe; lower operational overhead.

Strengths:
- Merchant of record: Paddle handles VAT, sales tax, GST, etc. globally
- Single bill from Paddle; tax compliance is their problem
- Strong for products selling globally without country-by-country compliance burden
- Decent subscription management
- Recent product expansion (Billing, Retain) brings parity with Stripe Billing
- ProfitWell (now Paddle Retain) bundled for retention metrics

Weaknesses:
- 5%+50¢ per transaction is higher than Stripe's 2.9%+30¢
- Less ecosystem depth than Stripe
- Some customers have had payout / approval friction during signup
- MoR model means Paddle, not you, is the merchant on customer statements

Pick when: you sell globally, you don't want to deal with tax compliance, and you accept the higher per-transaction fee for the operational simplicity.

### Lemon Squeezy — Indie Merchant of Record
Lemon Squeezy is the indie-focused MoR alternative to Paddle. Smaller scale, lower friction, popular with solo founders and small SaaS. Acquired by Stripe in 2024 (though continues to operate independently).

Strengths:
- Merchant of record (same tax-compliance benefit as Paddle)
- Simpler onboarding than Paddle
- Indie-friendly UX
- License-key product for software licensing
- Affiliate program built in
- Stripe-acquired (more longevity confidence)

Weaknesses:
- 5%+50¢ pricing
- Smaller scale than Paddle
- Less suited for large enterprises or complex contracts
- Some uncertainty about long-term roadmap post-Stripe acquisition

Pick when: you're a solo founder or small team, you want global tax handled, and your pricing model is simple.

### Lago — Open-Source Usage-Based Billing
Lago is the open-source alternative to Orb / Metronome. AGPL-licensed, fully self-hostable, with a hosted Cloud option. Strong fit for usage-based products and OSS-leaning teams.

Strengths:
- AGPL OSS; self-hostable
- Modern usage-based primitives (multi-meter, aggregations, prorations)
- Free tier on hosted Cloud
- Hyperline-style hybrid pricing (recurring + usage + add-ons)
- Active development; growing community
- Strong API; integrates with your stack
- Coupons, taxes, multi-currency

Weaknesses:
- Younger product than Stripe Billing (less battle-tested at scale)
- AGPL has implications for some legal teams
- Self-host requires Postgres + Redis + ClickHouse
- Cloud Pro at $400/mo is real money

Pick when: you have usage-based or hybrid pricing, you want OSS, or you've outgrown Stripe Billing's metering model.

### Orb — Usage-Based Billing for Scale
Orb is purpose-built for high-volume usage-based billing. Strong for AI, infra, and communications products that bill on consumption.

Strengths:
- Best-in-class usage-based primitives
- Handles complex aggregations, tiers, and overages
- ASC 606 revenue recognition support
- Strong API; well-documented
- Real-time metering with backfill capability
- Used by Vercel, Replicate, and many AI-infra companies

Weaknesses:
- Mid-market pricing ($1-2K/mo starter)
- Overkill for simple recurring
- Sales-led for serious deployments
- Smaller ecosystem of UI / dashboard integrations

Pick when: you're high-volume usage-based, you've outgrown Stripe metering, and you have real revenue to justify the price.

### Metronome — Consumption Billing for Modern Infra
Metronome is similar in shape to Orb — usage-billing-first, mid-market+, modern API. Differentiation around real-time consumption visibility for the customer.

Strengths:
- Real-time consumption dashboards (customer-facing)
- Strong for AI / inference / API-call billing
- Handles complex multi-product consumption
- Native Salesforce integration for sales-led handoff
- ASC 606 support

Weaknesses:
- Sales-led pricing
- Overkill for indie scale
- Smaller community than Stripe / Chargebee

Pick when: you're an AI or infra company with consumption-based billing and you need real-time customer-facing dashboards.

### Hyperline — Modern Subscription Engine
Hyperline is a newer entrant focused on B2B SaaS with hybrid pricing models. Modern API; replaces hand-rolled billing logic for teams that have outgrown Stripe Billing but don't need Orb's volume.

Strengths:
- Designed for hybrid (recurring + usage + add-ons + one-off)
- Modern API; clean docs
- Subscription Schedules, ramps, multi-product
- Strong customer portal
- Reasonable mid-market pricing ($500+/mo)

Weaknesses:
- Younger; smaller community
- Hosted-only
- Less differentiation vs Lago Cloud at similar price point

Pick when: you've outgrown Stripe Billing, you're running hybrid pricing, and you want a hosted modern engine.

### Chargebee — Mid-Market Subscription + RevOps
Chargebee is the mature mid-market subscription billing platform. Bundles billing with retention analytics, revenue recognition, and Salesforce integration.

Strengths:
- Battle-tested at scale (>50K customers)
- Strong revops features (RevRec, retention metrics, dunning)
- Mature integrations: Salesforce, NetSuite, Quickbooks, Xero
- Good support
- Compliance-ready (SOC 2, PCI, GDPR)

Weaknesses:
- $599/mo Performance tier is real money for indie
- UX feels older than newer entrants
- Sales-led for advanced features
- Migrating in/out is heavy lift

Pick when: you're mid-market+ ($1M+ ARR), you have complex billing rules, and you want billing + revops in one tool.

### Recurly — Mature Subscription Billing
Recurly is similar to Chargebee in shape — mature, mid-market, opinionated. Strong on retention features (account-level recovery, smart retries, address verification).

Strengths:
- Best-in-class dunning and recovery
- Mature subscription management
- Account-level multi-subscription support
- Good for B2B with complex contracts
- Strong Salesforce integration

Weaknesses:
- $249/mo+ pricing
- Less modern UX than newer entrants
- Smaller community than Chargebee

Pick when: dunning / retention is your primary pain, or you want Chargebee-equivalent without the bundle.

### Maxio (formerly Chargify + SaaSOptics) — Enterprise B2B
Maxio is the enterprise B2B subscription billing tool — formed from the merger of Chargify (billing) and SaaSOptics (revenue recognition). Sales-led; deep features for complex contracts.

Strengths:
- Strong revenue recognition (ASC 606, IFRS 15)
- Complex contract support (multi-year, ramps, custom terms)
- Strong financial reporting
- Built for B2B mid-market+

Weaknesses:
- Sales-led; opaque pricing
- Heavy product surface; long onboarding
- Not indie-friendly
- Brand confusion post-merger

Pick when: you're B2B mid-market+, you have complex contracts, and you need ASC 606 revenue recognition built-in.

### Stripe Billing + Custom Code — The Stretch Pattern
The pattern most indie SaaS find themselves in: outgrew Stripe Billing's primitives but not ready for a full migration. They build proration logic, usage metering, or invoicing on top of Stripe.

When this works:
- Edge cases stay edge cases
- Engineering team has bandwidth to maintain billing-adjacent code
- The custom logic is well-tested

When this stops working:
- Bug-fix-rate on billing code becomes a known issue
- New pricing models can't be modeled in app code reasonably
- Auditors / accountants are asking questions
- A new pricing model is half-shipped because billing won't support it

Migrate when: you're spending >2 engineering weeks per quarter on billing code, or any pricing experiment is gated by billing capability.

## What Subscription Billing Won't Do

- **Replace your accounting system.** Billing engines produce invoices and revenue events. Your accounting system (QuickBooks, NetSuite, Xero) reconciles them. They're complementary.
- **Replace your CRM.** Billing tracks customers; CRM tracks deals and prospects. See [CRM providers](../marketing-and-seo/crm-providers.md).
- **Be a tax engine on their own.** Stripe Billing requires Stripe Tax (separate); Paddle / Lemon Squeezy bundle MoR tax compliance; Lago integrates with TaxJar / Avalara. None of them replace local tax advice.
- **Solve "what should our pricing be?"** Billing implements pricing; it doesn't design it. See [pricing strategy](https://www.launchweek.com/1-position/pricing-strategy).
- **Make migration painless.** Migrating subscription customers between billing engines is one of the highest-risk operations in any SaaS. Plan multi-month transitions; test extensively.

## Pragmatic Stack Patterns

**Indie SaaS, simple recurring (the 70% case)**:
- Stripe Billing (with Stripe Customer Portal)
- Stripe Tax for tax compliance
- Total: payment processing rates only

**Indie SaaS, global with tax simplification**:
- Paddle Billing or Lemon Squeezy (MoR)
- Total: 5%+50¢ all-in

**Hybrid recurring + usage**:
- Lago (self-host) or Hyperline (hosted)
- Stripe Payments as the underlying processor
- Total: $400-500/mo + processing

**Pure usage-based / consumption**:
- Orb or Metronome (mid-market+)
- Lago for OSS
- Total: $1K+/mo

**Mid-market B2B with complex contracts**:
- Chargebee or Recurly
- Total: $249-599/mo

**Enterprise B2B**:
- Maxio or Salesforce CPQ + Billing
- Total: sales-led pricing

**Outgrew Stripe Billing**:
- Audit pain points; choose target tool; plan 3-6 month migration
- Lago is the typical landing spot for OSS-leaning teams

## Decision Framework: Three Questions

1. **What's your pricing model?** → Simple recurring: Stripe Billing. Hybrid: Lago / Hyperline. Pure usage: Orb / Metronome / Lago. Enterprise contracts: Chargebee / Maxio.
2. **Do you sell globally and want tax handled?** → Yes: Paddle / Lemon Squeezy. No: Stripe + Stripe Tax (or any other).
3. **Do you need OSS / self-host?** → Yes: Lago. No: any hosted option.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Stripe Billing for simple recurring; Lago when usage enters the picture; Paddle or Lemon Squeezy for global tax simplification**. Don't migrate off Stripe until pricing complexity demands it.

## Verdict

For most readers building a SaaS in 2026:
- **Default**: Stripe Billing.
- **Global with tax handled**: Paddle Billing or Lemon Squeezy.
- **Hybrid pricing**: Lago (OSS) or Hyperline (hosted).
- **Pure usage**: Orb or Metronome (mid-market+); Lago for OSS.
- **Mid-market complex**: Chargebee or Recurly.
- **Enterprise B2B**: Maxio or Salesforce CPQ + Billing.
- **Outgrowing Stripe**: Lago as the typical migration target.

The hidden cost in subscription billing isn't the per-transaction fee — it's **billing logic in app code**. A team that builds proration math, usage aggregation, and invoice generation in their own backend has signed up for a perpetual maintenance project. Billing is its own product surface; outsource it to a tool that specializes in it. Migrate when the in-app billing code starts feeling fragile, not when it breaks.

## See Also

- [Payment Providers](payment-providers.md) — Stripe, Polar, Paddle for raw payment processing
- [Stripe](stripe.md) — deep-dive on Stripe specifics
- [Stripe Customer Portal](stripe-customer-portal.md) — self-serve subscription management
- [Stripe Usage-Based Billing](stripe-usage-based-billing.md) — Stripe's metering capabilities
- [Polar](polar.md) — modern indie payments + billing
- [Clerk Billing](clerk-billing.md) — bundled with Clerk auth
- [Pricing Strategy](https://www.launchweek.com/1-position/pricing-strategy) — what your billing model should implement
- [Self-Serve vs Sales-Led](https://www.launchweek.com/4-convert/self-serve-vs-sales-led) — motion drives billing complexity
- [Free Trial vs Freemium](https://www.launchweek.com/1-position/free-trial-vs-freemium) — trial mechanics live in billing
- [CRM Providers](../marketing-and-seo/crm-providers.md) — billing data flows here for sales / support
- [Refunds & Chargebacks](https://www.vibeweek.com/6-grow/refunds-chargebacks-chat) — companion product feature

---

[⬅️ Auth & Payments Overview](../auth-and-payments/)
