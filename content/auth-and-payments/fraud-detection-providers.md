# Fraud Detection & Anti-Abuse Providers: Sift, Castle, Stripe Radar, Forter, Signifyd, Riskified, Kount, Sardine

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you process payments, run a marketplace, or have valuable user actions in your SaaS in 2026, you face fraud at scale. The threats are concrete: stolen-card chargebacks (eat margins; threaten ESP / payment-processor relationships), account takeover (customer trust collapse), trial / referral abuse (free-tier draining), promo-code stacking, fake account farms, and increasingly AI-driven sophisticated fraud (LLM-generated personas; coordinated fraud rings). Most indie SaaS handles this by default — Stripe Radar comes free with Stripe and catches obvious card fraud. The next tier matters when you face account-takeover, content-spam, marketplace fraud, or chargebacks above 1%. The right pick depends on whether you need payment-fraud (Radar / Signifyd / Riskified), behavioral-account-fraud (Sift / Castle / Sardine), or industry-specialist (Forter for ecommerce; SEON for fintech).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Stripe Radar | Card-fraud bundled w/ Stripe | Bundled (Standard) | $0.05/txn (Pro) | Very high | Default for Stripe-using SaaS |
| Sift | Comprehensive behavioral fraud | Custom | $$$ | Medium | Mid-market+ multi-vector |
| Castle | Modern account-takeover focus | Free trial | $$$ | Medium | Account / login fraud |
| Signifyd | E-commerce chargeback guarantee | Custom | % of GMV | Medium | E-commerce |
| Riskified | E-commerce; chargeback guarantee | Custom | % of GMV | Low | Mid-large e-commerce |
| Forter | E-commerce + travel | Custom | $$$ | Low | Enterprise e-commerce |
| Kount | Established (Equifax-owned) | Custom | $$$ | Medium | Mid-market established |
| Sardine | Modern fintech-flavored | Trial | $$$ | High | Fintech / banking |
| SEON | Modern fintech | Free trial | $$$ | High | Fintech alternative |
| Adjust / AppsFlyer | Mobile-app fraud (install) | Custom | Per-event | Medium | Mobile app advertising |
| FraudLabs Pro | E-comm bundled | Free 500/mo | $35/mo+ | Medium | SMB e-commerce |
| MaxMind minFraud | Bundled w/ MaxMind | Pay-per-use | $0.01-0.10/check | High | Geo-aware fraud |
| Ravelin | E-commerce + payments | Custom | $$$ | Low | Mid-market e-commerce |
| Datadome | Bot + fraud bundled | Trial | $$$ | Low | Bot + fraud combined |

The first decision is **what kind of fraud**. Card-fraud / chargebacks (Radar / Signifyd / Riskified), account fraud (Sift / Castle), fintech / banking compliance (Sardine / SEON), or industry-specialist (Forter / Ravelin / Adjust) are different jobs.

## Decide What You Need First

Tools are not interchangeable. Pick by use case + scale.

### Card / payment fraud (the 50% case)
You take payments via Stripe / similar. Worried about stolen cards, chargebacks.

Right tools:
- **Stripe Radar** (Standard bundled; Pro extra) — default for Stripe users
- **Signifyd** / **Riskified** — chargeback-guarantee for e-commerce
- **Forter** — enterprise e-commerce + travel

### Account fraud / takeover (the 25% case)
Login fraud; mass-signup abuse; credential stuffing fallout.

Right tools:
- **Castle** — login / account focus
- **Sift** — comprehensive
- **Sardine** — fintech-grade
- **Cloudflare BotID** + behavioral signals (cheaper)

### Fintech / banking / lending (the 15% case)
KYC, AML, sanctions, lending risk.

Right tools:
- **Sardine** — modern fintech
- **SEON** — alternative
- **Plaid Identity Verification** — KYC
- **Persona** / **Onfido** — KYC specialists (see VR identity-verification-kyc-tools)

### Marketplace / multi-sided (the 10% case)
Trust-and-safety on both buyers and sellers; review fraud; listing fraud.

Right tools:
- **Sift Trust Suite** — full marketplace coverage
- Combined with content moderation (Hive / etc.)

## Provider Deep-Dives

### Stripe Radar — bundled default
The most-used fraud tool because it comes with Stripe. Often "good enough" for indie SaaS.

Pricing in 2026: Standard bundled with Stripe payments (free); Radar Pro $0.05 per screened transaction.

Features: 
- Standard: ML-based fraud scoring; rule sets; block rules; manual review
- Pro: custom rules; teams; advanced ML signals; chargeback evidence collection
- 3D Secure smart triggering
- Velocity rules
- Card testing protection (Radar prevents Stripe-account abuse via tiny test charges)

Why Radar wins: bundled with Stripe; ML trained on $1T+ in transactions; zero integration work.

Trade-offs: payment-fraud only (not account / behavioral); some advanced features Pro-only ($).

Pick if: Stripe customer; payment-fraud is primary concern. Don't pick if: not on Stripe; account-fraud is primary.

### Sift — comprehensive
Founded 2011; the established multi-vector fraud platform. Covers payment / account / content / promotion / refund fraud.

Pricing in 2026: custom; typically $5K-50K+/mo for mid-market.

Features: account-takeover detection, payment fraud, content abuse (review fraud), promo abuse, AI-powered models, automated decisioning, manual review console.

Why Sift: comprehensive; battle-tested; mid-market default for non-payment-only fraud.

Trade-offs: enterprise-priced; long sales cycle; some setup complexity.

Pick if: $5M+ ARR; multi-vector fraud (account + payment + content). Don't pick if: indie scale (overkill).

### Castle — modern account-fraud
Founded 2015. Account-takeover and login-fraud specialist. Modern API.

Pricing in 2026: free trial; tiers from $$$.

Features: device fingerprinting, login-risk scoring, account-takeover detection, breach detection, custom rules.

Why Castle: best-in-class for login fraud; modern API; lighter than Sift for account-only use.

Pick if: account / login fraud is primary; modern stack. Don't pick if: payment fraud focus (Radar / Signifyd).

### Signifyd — chargeback guarantee
E-commerce specialist. Different model: pay 1-3% of GMV; Signifyd guarantees chargebacks on approved orders.

Pricing in 2026: percentage of GMV (% varies; typically 0.5-1.5%).

Features: payment-fraud screening, chargeback guarantee (they pay if approved → chargeback), account abuse, returns abuse.

Why Signifyd: shifts chargeback risk to vendor. For high-AOV e-commerce, often profitable.

Pick if: e-commerce; chargeback rate is hurting; willing to pay % of GMV. Don't pick if: SaaS-subscription (less applicable).

### Riskified — similar to Signifyd
Competitor in e-commerce chargeback-guarantee category.

Similar pricing model and features.

Pick by team preference / commercial terms.

### Forter — enterprise e-commerce + travel
Enterprise fraud platform. Strong in travel / hospitality.

Pricing in 2026: enterprise; custom.

Pick if: enterprise e-commerce / travel; budget for premium; need their network signal.

### Sardine — modern fintech
Founded 2020. Fintech-flavored; modern; popular with crypto / banking / lending.

Pricing in 2026: tiers; usage-based.

Features: device intelligence, behavioral biometrics, KYC, AML, sanctions screening, fraud detection.

Why Sardine: modern API; fintech-focused; growing.

Pick if: fintech / banking / lending; modern stack; need KYC + fraud combined.

### SEON
Modern fintech alternative to Sardine.

Pick if: cheaper option; testing alternative.

### Kount (Equifax-owned)
Established mid-market; Equifax acquired 2021.

Pick if: existing Equifax data partner; enterprise procurement.

### MaxMind minFraud
Bundled with MaxMind (geo-aware). Cheaper option.

Pricing in 2026: $0.01-0.10 per check.

Features: geolocation-based fraud signals; proxy / VPN detection; transaction risk scoring.

Pick if: cost-conscious; already MaxMind customer; geo-aware fraud is dominant pattern.

### FraudLabs Pro
SMB e-commerce; bundled multi-signal.

Pricing in 2026: free 500/mo; $35/mo+.

Pick if: small e-commerce; budget-conscious.

### Ravelin / Adjust / AppsFlyer / Datadome
Specialty picks:
- **Ravelin** — e-commerce
- **Adjust / AppsFlyer** — mobile-app install fraud
- **Datadome** — bot + fraud combined

## What Fraud Tools Won't Do

Buying fraud detection doesn't:

1. **Eliminate fraud entirely.** All systems have false-negatives. Goal: reduce to acceptable %, not zero.
2. **Replace human review.** Borderline cases need human judgment; tools surface; don't decide.
3. **Solve operational fraud.** Refund-abuse / chargeback-fraud requires policy + ops, not just detection.
4. **Work without good data.** Signals from device + behavior + history feed the model. Sparse data = weak detection.
5. **Replace KYC.** KYC is identity verification; fraud is behavior detection. Different but adjacent layers.

The honest framing: fraud tools are filters in a stack. Stack: rate limit + CAPTCHA + KYC + fraud detection + manual review. Each layer catches different fraud.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS on Stripe ($0/mo + $0.05/txn)
- **Stripe Radar Standard** (free)
- Add **Radar Pro** when chargeback rate > 0.5% ($0.05/txn)
- Honeypot + email-validation on signup
- Total: $0-200/mo at indie scale

### Pattern 2: Mid-market multi-vector ($1-5K/mo)
- **Stripe Radar Pro** for payment
- **Castle** for account / login
- Manual review console
- Total: $1-5K/mo

### Pattern 3: E-commerce with chargeback exposure (% of GMV)
- **Signifyd** OR **Riskified** chargeback-guarantee
- Stripe Radar as fallback layer
- Returns-abuse policy

### Pattern 4: Fintech / banking ($$$+)
- **Sardine** OR **SEON** for fraud + KYC
- **Plaid** banking signals
- **Persona / Onfido** KYC
- Comprehensive AML / sanctions

### Pattern 5: Enterprise multi-vector ($10K+/mo)
- **Sift** comprehensive
- **Forter** for e-commerce specifically
- Manual T&S team

### Pattern 6: Cost-conscious DIY
- **Stripe Radar Standard** + custom rules
- **MaxMind minFraud** for geo signals
- Honeypot + behavioral checks
- Total: pay-per-use + minimal

## Decision Framework: Three Questions

1. **What's the dominant fraud type?**
   - Stolen cards / chargebacks → Stripe Radar / Signifyd
   - Account takeover / login → Castle / Sift
   - Fintech / banking → Sardine / SEON
   - Marketplace / content → Sift Trust Suite

2. **What's your scale?**
   - <$1M ARR → Stripe Radar Standard (bundled)
   - $1-10M → Radar Pro + Castle (or single tool)
   - $10M+ → Sift / Forter / specialists

3. **Stripe customer?**
   - Yes → start with Radar; upgrade as needed
   - No → standalone (Sift / Castle / SEON)

## Verdict

For 70% of indie / mid-market SaaS in 2026: **Stripe Radar**. Bundled with Stripe; ML-trained on massive scale; zero integration. Default unless you're not on Stripe or face non-payment fraud.

For 15%: **Castle** for account / login fraud as add-on to Radar.

For 10%: **Signifyd** / **Riskified** for e-commerce chargeback guarantee.

For 3%: **Sift** for comprehensive enterprise multi-vector.

For 2%: **Sardine** / **SEON** for fintech.

The mistake to avoid: **buying enterprise fraud platform pre-fraud-problem**. If you have <0.5% chargeback rate and no account-takeover incidents, Radar Standard is enough. Add layers when fraud actually appears.

The second mistake: **fraud detection without manual review**. Tools surface 100 borderline cases; if no team reviews, all 100 either pass or block. Manual review is the highest-value action, not the tool.

## See Also

- [Identity Verification & KYC Tools](./identity-verification-kyc-tools.md) — adjacent compliance
- [Payment Providers](./payment-providers.md) — payment infra
- [Stripe](./stripe.md) — Radar context
- [Subscription Billing Providers](./subscription-billing-providers.md) — companion
- [Authentication](./authentication.md) — login flow
- [Bot Detection Providers](../devops-and-tools/bot-detection-providers.md) — distinct but adjacent
- [IP Geolocation Providers](../backend-and-data/ip-geolocation-providers.md) — geo signals
- [Email Verification & List-Hygiene Tools](../marketing-and-seo/email-verification-validation-tools.md) — anti-abuse layer
- [VibeWeek: CAPTCHA & Bot Protection](https://vibeweek.dev/6-grow/captcha-bot-protection-chat) — companion abuse layer
- [VibeWeek: Content Moderation Pipeline](https://vibeweek.dev/6-grow/content-moderation-pipeline-chat) — content-side abuse
- [VibeWeek: Password Reset & Magic Link](https://vibeweek.dev/6-grow/password-reset-magic-link-chat) — auth-side companion
- [VibeWeek: Rate Limiting & Abuse](https://vibeweek.dev/6-grow/rate-limiting-abuse-chat) — first defense layer
- [VibeWeek: Refunds & Chargebacks](https://vibeweek.dev/6-grow/refunds-chargebacks-chat) — companion ops layer
