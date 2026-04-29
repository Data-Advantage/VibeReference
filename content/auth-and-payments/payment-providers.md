# Payment Providers for SaaS: Stripe, Paddle, Lemon Squeezy, Polar, Chargebee, RevenueCat

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're building a SaaS, marketplace, or app and trying to decide who processes your payments, this is the consolidated decision guide. Pick wrong here and you spend a year fighting compliance, tax, and dunning instead of shipping product. Pick right and the whole thing fades into the background.

## TL;DR Decision Matrix

| Provider | Type | Best For | Tax & VAT | Fees | Speed to Live | Subscription Power | Indie Vibe |
|---|---|---|---|---|---|---|---|
| [Stripe](stripe.md) | Direct PSP | SaaS founders who want flexibility, US-first, want to own their billing logic | You handle (Stripe Tax add-on) | 2.9% + 30¢ + 0.5% Tax | Hours | Excellent | High |
| Paddle | Merchant of Record | International SaaS, indie founders selling globally without a tax team | Paddle handles | ~5% + 50¢ all-in | 1–3 days | Strong | Medium |
| Lemon Squeezy | Merchant of Record | Indie hackers, digital products, fast launch with global tax handled | Lemon handles | 5% + 50¢ | Hours | Good | Very high |
| [Polar](polar.md) | Merchant of Record | Open-source / dev-tool monetization, GitHub-native developer products | Polar handles | 4% + 40¢ | Hours | Good | Very high |
| Chargebee | Billing layer on Stripe/others | SaaS scaling past $1M ARR with complex pricing, dunning, and revops | Stripe Tax / passthrough | $0–$599+/mo plus PSP fees | Days | Excellent | Low |
| Recurly | Billing layer | Enterprise subscriptions, complex catalog, tax integrations | Avalara integration | Custom | Weeks | Excellent | Low |
| RevenueCat | Mobile subscription mgmt | iOS/Android subscription apps using App Store / Play Store IAP | Apple/Google handle | Free up to $2.5K MTR, then 1% | Hours | Excellent (mobile only) | High |
| PayPal / Braintree | Direct PSP + wallet | Adding PayPal as a checkout method, B2C with PayPal-leaning customers | You handle | 2.9% + 30¢ | Hours | OK | Low |
| Adyen | Direct PSP | Mid-market and enterprise with multi-region requirements | You handle | Custom (interchange++) | Weeks | Strong | Low |
| Square | Direct PSP | Hybrid online + in-person commerce, US-focused | You handle | 2.9% + 30¢ online | Hours | Limited | Low |

The first decision is **direct vs merchant of record (MoR)**. Direct (Stripe, Adyen, Square) means you are the merchant of record — you collect tax, you file tax, you handle compliance, you handle disputes. MoR (Paddle, Lemon Squeezy, Polar) means the provider is the seller of record — they collect VAT/sales tax in 100+ jurisdictions, remit on your behalf, and take chargebacks. You pay 1–2% more in fees and lose some flexibility, but you skip a six-figure compliance team.

## Category Overview: Direct PSP vs Merchant of Record vs Billing Layer

### Direct PSP (Stripe, Square, Adyen, Braintree)
You are the merchant. The PSP is just moving money. You're responsible for:
- Sales tax / VAT / GST registration in every jurisdiction you sell into (the EU, the UK, India, Australia, plus US states post-Wayfair). Stripe Tax automates calculation but does not file.
- Chargebacks and disputes
- Dunning / retry logic for failed payments
- Currency exposure on international sales
- Subscription state machine (you own it, the PSP only moves money)

You get:
- Lowest fees (2.6–2.9% + 30¢)
- Maximum flexibility (custom flows, custom tax logic, custom dunning)
- Direct API access, large ecosystem of plugins and integrations

### Merchant of Record (Paddle, Lemon Squeezy, Polar)
The provider is the seller. You're responsible for:
- The product, the customer relationship, the support
- Pricing decisions
- Sending receipts that say "Paddle Inc. on behalf of YourCo" (some MoRs are more white-label than others)

The MoR is responsible for:
- Sales tax / VAT collection and remittance worldwide
- Chargeback handling
- Fraud prevention
- Compliance filings

You pay:
- 4–5% + 30–50¢ all-in (vs 2.9% + 30¢ for direct + ~0.5% for Stripe Tax)
- Some loss of customization (fewer custom checkout fields, less direct API access in some cases)

The math: at $1M ARR, MoR fees cost you ~$20K more per year than direct + Stripe Tax. A finance hire to handle global tax compliance costs $80K+ all-in, ignoring the time it takes to set up registrations. MoR makes sense until you are big enough that the team is cheaper than the fee.

### Billing Layer (Chargebee, Recurly, Maxio/SaaSOptics)
These sit on top of a PSP (usually Stripe) and add subscription-management primitives the PSP doesn't have natively:
- Coupon / promo / credit logic
- Multi-tier proration
- Revenue recognition exports for accounting
- Dunning workflows with branded emails
- Multi-currency catalog with FX-aware pricing
- Quoting / contract / sales-led billing

You pay the platform fee on top of your PSP fees. Worth it past ~$1M ARR if your billing is complex. Overkill at $0–500K ARR — Stripe's native subscription primitives cover most of what indie SaaS needs.

### Mobile-First (RevenueCat, Adapty)
If you're shipping an iOS or Android app with subscriptions, Apple and Google are your real PSPs. You can't bypass them for in-app subscriptions (Apple takes 15–30%, Google takes 15–30%). RevenueCat doesn't replace Apple/Google — it sits on top to give you a unified API across iOS/Android/web, server-side receipt validation, entitlement management, and subscription analytics. It's free up to $2.5K monthly tracked revenue, then 1%.

## Stripe — The Default for Web SaaS

[Stripe](stripe.md) is what most SaaS use. Excellent docs, broad ecosystem, sane defaults, and a depth of features that scales from "first $100 in revenue" to "$10B in payments routed through us." Strengths:
- Best-in-class developer experience and SDK quality
- Stripe Billing for subscriptions: free with PSP fees up to ~$1M, then 0.5–0.7%
- Stripe Tax: 0.5% on transactions in jurisdictions where you've registered
- Stripe Connect for marketplaces
- [Customer Portal](stripe-customer-portal.md) — free hosted self-serve billing UI
- [Usage-based billing](stripe-usage-based-billing.md) — meters, tiered/graduated/volume pricing
- Strong fraud prevention (Radar)
- Broad payment-method support: cards, ACH, SEPA, BACS, iDEAL, Klarna, Afterpay, Apple/Google Pay, Link, etc.

Where Stripe is weak:
- You are merchant of record. Stripe Tax automates calculation, but you still register and file in every jurisdiction. EU VAT registration in particular is a multi-month project with a registered fiscal representative requirement in some countries.
- Outside the US, payouts can take longer and require more documentation
- Subscription complexity past a certain point requires Stripe Billing (cheap) plus Chargebee (not cheap), or a custom orchestration layer

If you are US-based and selling primarily to US customers, Stripe + Stripe Tax is the default and right answer. If you're indie, EU-based, or selling globally, the math shifts toward MoR.

## Paddle — Mature Merchant of Record

Paddle has been doing MoR for software for over a decade, mostly serving traditional desktop software and increasingly SaaS. Strengths:
- Handles global sales tax / VAT in ~140 countries
- Strong invoicing and B2B handling (good for European customers who need a proper tax invoice)
- Subscriptions, one-time, and lifetime deals supported
- Reasonable API and webhooks
- Will assist with dunning, chargebacks, and tax investigations

Weaknesses:
- Less developer-friendly than Stripe or Lemon Squeezy
- Customization on the checkout is limited compared to Stripe
- Approval / onboarding takes longer than Lemon Squeezy or Polar (Paddle vets sellers)
- Branding on receipts says "Paddle.com Market Limited"

Paddle works best for established indie SaaS with global revenue (>30% non-US) where the tax-handling savings clearly exceed the fee delta.

## Lemon Squeezy — Indie-First MoR (Acquired by Stripe in 2024)

Lemon Squeezy launched in 2021 as the indie hacker's Paddle. Beautiful checkout UX, fast onboarding, transparent pricing, no minimum revenue. Acquired by Stripe in 2024; long-term roadmap is now folded into Stripe's broader strategy but the product remains operational and well-loved.

Strengths:
- Sign-up to first sale in a few hours
- Beautiful hosted checkout, customer portal, and dashboard
- Handles VAT/tax globally as MoR
- Strong support for digital products, software licenses, subscriptions, lifetime deals
- Affiliate program built in
- API + webhooks adequate for most apps

Weaknesses:
- Stripe acquisition means future direction is uncertain. Existing functionality continues but new feature velocity has slowed in favor of Stripe-native MoR features.
- Less customizable than Stripe direct
- Smaller ecosystem of integrations

If you're shipping a paid digital product or indie SaaS in 2026 and want to go from zero to first revenue this week, Lemon Squeezy still works. Watch Stripe's announcements for the eventual unified MoR offering.

## Polar — Open-Source MoR for Developer Products

[Polar](polar.md) is newer (launched 2023, raised from Stripe in 2024) and explicitly targets developer-tool and open-source monetization. GitHub-native — you can sell sponsorships, paid issues, paid features, and SaaS subscriptions tied to GitHub identity. Strengths:
- Merchant of Record (Polar handles VAT and sales tax)
- 4% + 40¢ — slightly cheaper than Lemon Squeezy and Paddle
- Open-source-friendly: built-in patterns for sponsorships, donations, issue funding
- Modern API, modern docs, strong TypeScript SDK
- GitHub OAuth-native checkout for developer products
- Customer portal for self-serve

Weaknesses:
- Younger product — fewer integrations, smaller community
- Less battle-tested at scale than Paddle / Stripe
- Better for developer tools than for B2C consumer SaaS

If you're shipping a developer tool, dev-focused SaaS, or open-source product with paid tier, Polar is the most aligned MoR. For traditional consumer SaaS, Lemon Squeezy or Paddle has more polish.

## Chargebee — Billing Platform for Scale

Chargebee sits on top of Stripe (or Adyen, Braintree, Worldpay, etc.) and adds the subscription-management primitives Stripe doesn't have natively. Worth it when:
- You have multiple pricing tiers with overlapping coupons, credits, proration rules
- You have a sales-led motion with custom-quoted contracts
- You have multi-entity revenue recognition needs (ASC 606, IFRS 15)
- You have multi-currency catalog with FX-aware pricing
- You're past $1M ARR and the cost of an under-built billing system is real lost revenue

Pricing: starts free up to $250K cumulative revenue, then $599+/mo at the Performance tier, scaling up to enterprise pricing. You still pay PSP fees on top. Worth it if you have a real billing problem; overkill if you don't.

## Recurly — Enterprise Subscription Management

Similar to Chargebee — billing platform on top of a PSP. Tends to be stronger in:
- Enterprise contract management
- Avalara tax integration
- B2B invoicing
- Complex usage-based billing scenarios (mediation engine for telecom-style billing)

Custom pricing. Generally for $5M+ ARR companies with sales-led motion.

## RevenueCat — Mobile Subscriptions

If you're building an iOS or Android app with in-app subscriptions, you are stuck with Apple's StoreKit and Google Play Billing as your PSPs. Apple takes 15% (small business) or 30% (above $1M / >1 year customer). Google is similar. RevenueCat doesn't replace this — it sits on top.

What RevenueCat gives you:
- One unified API across StoreKit, Play Billing, Stripe (web upgrade), Amazon
- Server-side receipt validation
- Entitlement management (which features does this user have access to right now?)
- Subscription analytics: trial-to-paid, churn, LTV, cohort analysis
- A/B testing of paywalls and offers
- Cross-platform purchase restoration

Free up to $2.5K monthly tracked revenue. 1% above that. Default choice for any subscription mobile app — building this yourself is a 6-month engineering project that will leak money.

## PayPal / Braintree

PayPal is a checkout method, primarily. Adding PayPal as a payment option (alongside cards via Stripe) increases conversion 5–10% in some B2C segments — especially older demographics, Germany, parts of Asia. Braintree is PayPal's developer platform, comparable to Stripe but less polished.

Most B2B SaaS can skip PayPal. Most B2C SaaS in markets with strong PayPal adoption (DE, BR, etc.) should add it as a secondary method.

## Square

Square's strength is hybrid online + in-person commerce — restaurants, retail, services. For pure online SaaS, Stripe or MoR is better. Mention only because some founders ask: "Should I use Square because I already have a Square account from my coffee shop?" Answer: no.

## Adyen

Adyen is the enterprise option — Spotify, Uber, Microsoft, eBay use it. Interchange++ pricing means lower fees than Stripe at very large scale. Onboarding is months, not minutes. Multi-region native. Skip until you have a finance team and clear evidence Stripe is materially more expensive at your volume.

## What None of Them Solve

- **Pricing strategy.** No payment provider tells you what to charge or how to package. You decide tiers, trials, usage caps, annual discounts. The provider just collects the money.
- **Pricing migrations.** Moving customers from a v1 pricing model to v2 without churning them is a manual project — grandfathering rules, migration windows, communication. The provider gives you primitives; you write the migration.
- **Tax filing.** MoR providers remit on your behalf. Direct PSPs (with Stripe Tax) calculate but don't file. You still need a CPA and (for certain jurisdictions) a registered fiscal representative.
- **Customer success / dunning quality.** All providers have dunning, but the recipe matters: how many retry attempts, on what schedule, with what email copy, with what in-app prompts. The default settings are generic. Custom dunning recovers 30–50% more failed payments.
- **Revenue recognition.** None of these export ASC-606-compliant deferred revenue schedules out of the box. You bolt on a tool (Chargebee, Maxio, Stripe Revrec) or you do it manually in spreadsheets.

## Pragmatic Stack Patterns

**Indie SaaS, US, $0–500K ARR**: Stripe direct + Stripe Tax + Stripe Customer Portal. Don't add Chargebee yet. Monthly + annual + a usage tier covers it.

**Indie SaaS, EU-based or global, $0–500K ARR**: Lemon Squeezy or Polar (MoR). Skip the tax registration headache. Revisit in 18 months when fees vs in-house finance math flips.

**Developer tool / open-source product, any region, $0–500K ARR**: Polar. GitHub-native auth and checkout meets your audience where they are.

**Mobile app with in-app subscriptions**: StoreKit + Play Billing + RevenueCat. If you also have web upgrade, RevenueCat unifies it with Stripe.

**SaaS, $500K–$2M ARR, complex pricing or contracts**: Stripe direct + Stripe Billing + Stripe Tax. Consider Chargebee if you have multi-tier coupons, sales contracts, or multi-currency complexity that Stripe Billing alone can't handle.

**SaaS, $2M+ ARR, sales-led motion**: Stripe + Chargebee or Recurly. CPQ tooling (Salesforce CPQ, HubSpot, etc.) for quoting.

**Marketplace (multi-sided, paying out to suppliers)**: Stripe Connect. No real alternative at indie scale.

**Hybrid online + offline**: Square for in-person, Stripe for online. Or Stripe Terminal if you want one stack.

## Decision Framework: Three Questions

1. **Are you mobile-only?** → RevenueCat + StoreKit/Play. Stop here.
2. **Are you global or EU-based with no tax compliance team?** → Pick an MoR (Lemon Squeezy / Polar / Paddle). Stop here.
3. **Are you US-based or willing to handle global tax registration?** → Stripe direct. Add Chargebee at $1M+ if billing complexity demands it.

Three questions, three decisions. The 90% answer for indie founders is "Stripe direct if US, Lemon Squeezy or Polar if not." Spending more than a day deciding payment provider is a sign you're avoiding the harder work of figuring out pricing and conversion.

## Verdict

For most readers of this site building a B2B SaaS in 2026:
- **US-based, want maximum flexibility**: [Stripe](stripe.md) + Stripe Tax. Default.
- **Global / EU / indie, want zero tax headache**: Lemon Squeezy (proven indie) or [Polar](polar.md) (developer-focused). Pay 1–2% more, save a finance hire.
- **Mobile-first**: RevenueCat on StoreKit/Play.
- **Past $1M ARR with billing complexity**: Stripe + Chargebee.

What the math doesn't capture: every hour you spend on tax registration, dunning logic, and chargeback workflow is an hour you're not improving the product. The right call is the one that lets you forget about payments for the longest stretch. For most indie SaaS in 2026, that's Stripe (if US) or an MoR (if not), and you revisit only when you've outgrown the choice.

## See Also

- [Stripe](stripe.md) — direct PSP deep-dive
- [Polar](polar.md) — open-source MoR deep-dive
- [Stripe Customer Portal](stripe-customer-portal.md) — hosted self-serve billing
- [Stripe Usage-Based Billing](stripe-usage-based-billing.md) — metered pricing
- [Clerk Billing](clerk-billing.md) — auth + billing combined
- [Auth Providers](auth-providers.md) — companion comparison for the other half of the stack
- [Email Providers](../backend-and-data/email-providers.md) — transactional receipts and dunning emails

---

[⬅️ Auth & Payments Overview](../auth-and-payments/)
