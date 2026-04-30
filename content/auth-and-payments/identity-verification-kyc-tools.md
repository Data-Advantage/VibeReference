# Identity Verification & KYC Tools: Persona, Stripe Identity, Veriff, Onfido, Jumio, Plaid Identity, Trulioo, Sumsub

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're building a SaaS in 2026 that needs to verify user identity — KYC for financial services, age verification, fraud prevention, vendor onboarding, marketplace seller verification — this is the consolidated comparison. Identity verification is the line item founders skip until a regulator (FinCEN, FCA, BaFin) sends a letter or until fraud losses cross $10K/month. Most indie SaaS over-rely on email verification (insufficient for regulated use cases) or jump to enterprise KYC (Onfido at $50K/yr) when Persona or Stripe Identity at $1.50/verification would have served them through 100K verifications/year.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Persona | Modern KYC platform | 14-day trial | $1-2/verification | Very high | Indie SaaS / fintech in 2026 |
| Stripe Identity | Bundled with Stripe | $1.50/verification | Pay-per-use | Very high | Already on Stripe |
| Veriff | Modern KYC | Custom | $0.80-2/verification | High | Mid-market alternative to Persona |
| Onfido (Entrust) | Enterprise KYC | Custom | $$$ | Low | Enterprise fintech |
| Jumio | Enterprise KYC | Custom | $$$$ | Very low | Large fintech / banking |
| Plaid Identity | Identity + bank data | Custom | $$ | Medium | Already on Plaid for bank linking |
| Trulioo | Global identity | Custom | $1-3/verification | Medium | Global / multi-jurisdiction |
| Sumsub | Multi-product KYC + AML | Trial | $1.35/verification | Medium | KYC + AML + transaction monitoring |
| Alloy | KYC orchestration | Custom | $$$ | Low | Enterprise; multi-vendor routing |
| iDenfy | Indie-friendly KYC | Trial | $0.65/verification | High | Cost-sensitive indie |
| Ondato | EU-focused KYC | Custom | $$ | Medium | EU regulatory needs |
| Plaid (transactions only) | Bank linking | $0.30/transaction | Per-call | Medium | Bank account linking only |
| Stripe Tax verification | Bundled with Stripe Tax | Bundled | Bundled | Very high | VAT-ID verification specifically |

The first decision is **what shape of identity verification you need**. Document + selfie KYC (Persona / Stripe Identity / Veriff), age verification (subset of KYC), bank-account verification (Plaid), AML / sanctions screening (Sumsub / Jumio), and global KYC across jurisdictions (Trulioo) are five different problems with overlapping tools.

## Decide What You Need First

Verification tools are not interchangeable. Pick by regulatory + business need.

### Standard KYC (the 50% case)
You need to verify a real human, with valid government ID, matching their selfie. Used for: financial services, marketplace sellers, age-restricted products, regulated services.

Right tools:
- **Persona** — modern indie default
- **Stripe Identity** — if on Stripe
- **Veriff** — alternative
- **iDenfy** — cost-sensitive

### KYB (Know Your Business) (the 20% case)
You need to verify a business entity (LLC, corporation): registered with state, beneficial owners verified, sanctions cleared.

Right tools:
- **Persona KYB** — modern KYB
- **Onfido KYB** — enterprise
- **Sumsub** — covers KYB
- **Middesk** — KYB-specific

### Bank account linking (the 15% case)
You need to confirm bank account ownership: link account, verify balances, pull transactions.

Right tools:
- **Plaid** — North American default
- **Tink** — European
- **Yodlee** — alternative
- **Stripe Financial Connections** — bundled

### AML / sanctions screening (the 10% case)
You need to screen users against sanctions lists (OFAC, EU sanctions, PEPs).

Right tools:
- **Sumsub** — combined KYC + AML
- **Jumio** — enterprise
- **ComplyAdvantage** — AML-focused
- **Refinitiv World-Check** — enterprise

### Global / multi-jurisdiction (the 5% case)
You verify users across many countries with different requirements.

Right tools:
- **Trulioo** — strongest global coverage
- **Sumsub** — multi-region
- **Onfido** — enterprise global

For most indie SaaS in 2026: **Persona or Stripe Identity for KYC; Plaid for bank linking; skip enterprise KYC until you have AML obligations**.

## Provider Deep-Dives

### Persona — Modern Indie Default
Persona has become the indie SaaS / fintech default. Modern API, embeddable widget, customizable flows.

Strengths:
- Best-in-class developer DX
- Customizable verification flows (drag-and-drop builder)
- Hosted flows + embeddable widgets
- $1-2 per verification (volume tiers)
- 200+ document types supported
- 200+ countries
- Modern API + webhooks
- KYB included

Weaknesses:
- Pricing climbs at high volume
- Some enterprise features sales-led

Pick when: you''re indie SaaS / SMB / fintech building any KYC need; want modern DX.

### Stripe Identity — Bundled with Stripe
If you''re on Stripe (per [stripe](stripe.md)), Stripe Identity provides KYC.

Strengths:
- Bundled with Stripe ecosystem
- $1.50 per verification (cheaper than most)
- Simple integration if already on Stripe
- 60+ document types
- Selfie + document verification
- Compliance built-in

Weaknesses:
- Stripe-only
- Less customizable than Persona
- Fewer document types than Persona / Onfido
- Limited KYB

Pick when: already on Stripe; standard KYC needs; want simplest integration.

### Veriff — Modern Mid-Market
Veriff is similar in shape to Persona. Strong for mid-market verification.

Strengths:
- $0.80-2 per verification
- 200+ countries
- Strong fraud detection
- Modern API
- Good support

Weaknesses:
- Smaller community than Persona
- Less polished customization

Pick when: alternative to Persona; pricing fits.

### Onfido (Entrust) — Enterprise Default
Onfido (acquired by Entrust) is the enterprise KYC platform. Strong fraud detection; large enterprises.

Strengths:
- Best-in-class fraud detection
- Strong global coverage
- Enterprise compliance support
- Mobile SDKs
- Strong KYB

Weaknesses:
- Custom pricing (typically $30K+/yr)
- Sales-led implementation
- Heavy product surface
- Overkill for indie

Pick when: enterprise fintech; budget supports; need strongest fraud detection.

### Jumio — Enterprise Banking
Jumio is the long-standing enterprise KYC. Used by major banks + crypto exchanges.

Strengths:
- Strong banking compliance
- Multi-product (KYC, AML, document verification)
- Large enterprise support

Weaknesses:
- Custom pricing ($$$$)
- Heavy implementation
- Older feel than Persona/Veriff

Pick when: large fintech / banking; existing Jumio relationship.

### Plaid Identity — Identity + Bank
Plaid Identity adds identity verification on top of Plaid''s bank-linking infrastructure.

Strengths:
- Combined identity + bank data
- Strong North American coverage
- Existing Plaid integrations
- Identity from bank (real-time)

Weaknesses:
- Requires Plaid usage
- North America focus

Pick when: already on Plaid for bank linking; want bundled identity.

### Trulioo — Global Coverage
Trulioo specializes in global identity verification across 100+ countries.

Strengths:
- Best global coverage
- 5+ billion identities accessible
- Multi-data-source verification (not just docs)
- Strong for emerging markets

Weaknesses:
- Custom pricing
- Sales-led

Pick when: global / multi-jurisdiction is the constraint.

### Sumsub — KYC + AML Combined
Sumsub combines KYC, KYB, AML, and transaction monitoring in one platform.

Strengths:
- Multi-product (KYC + AML + monitoring)
- Strong fraud detection
- $1.35 per verification
- 200+ countries
- Crypto-friendly

Weaknesses:
- Less polished than Persona for pure KYC
- Pricing can climb with multi-product

Pick when: you need KYC AND AML / transaction monitoring (regulated fintech).

### Alloy — KYC Orchestration
Alloy isn''t a single KYC vendor — it''s an orchestration layer that routes between multiple KYC providers based on rules.

Strengths:
- Multi-vendor (Persona, Veriff, Onfido, etc. behind one API)
- Decision engine for routing
- Strong fraud features
- Used by Brex, Marqeta

Weaknesses:
- Custom pricing (enterprise)
- Adds complexity
- Overkill for single-vendor use

Pick when: enterprise fintech with multi-vendor strategy.

### iDenfy — Cost-Sensitive
iDenfy is positioned as the indie-friendly KYC option.

Strengths:
- $0.65 per verification (cheapest)
- Solid feature set
- 200+ countries
- Modern API

Weaknesses:
- Smaller community
- Less battle-tested at scale

Pick when: cost-sensitive; willing to trade community size for price.

### Ondato — EU-Focused
Ondato is European KYC with strong GDPR alignment.

Strengths:
- EU regulatory expertise
- GDPR-native
- Lithuanian (EU) jurisdiction

Weaknesses:
- Less global coverage
- Smaller community

Pick when: EU-focused; regulatory needs align.

### Plaid (transactions / bank linking only)
For purely bank-account verification (without identity):

Strengths:
- Industry-standard for North American bank linking
- Per-call pricing
- Strong API

Weaknesses:
- Not full KYC (don''t use as a KYC substitute)

Pick when: you only need bank-account ownership / transactions.

### Stripe Tax verification — VAT IDs
For B2B VAT-ID verification (tax compliance):

Strengths:
- Bundled with Stripe Tax (per [tax-compliance-tools](tax-compliance-tools.md))
- VAT-ID validation via VIES
- Free with Stripe Tax

Weaknesses:
- VAT only; not full KYC

Pick when: B2B EU VAT compliance is the need.

## What Identity Verification Won''t Do

- **Replace your fraud-prevention strategy.** KYC verifies; doesn''t monitor ongoing fraud (per [bot-detection-providers](../devops-and-tools/bot-detection-providers.md)).
- **Replace AML monitoring.** KYC is one-time; AML is continuous (use Sumsub / ComplyAdvantage if needed).
- **Eliminate fake IDs.** Sophisticated forgeries get through; layered detection helps.
- **Be 100% accurate.** False positives (rejecting real users) and false negatives (accepting fakes) both happen.
- **Replace legal review.** Compliance officer / lawyer must define what verification you need by jurisdiction.
- **Be free.** Per-verification cost is real; budget accordingly.

## Pragmatic Stack Patterns

**Indie SaaS, basic age / fraud check**:
- Persona or Stripe Identity
- Total: $1-2/verification

**Indie fintech, KYC + KYB**:
- Persona (covers both)
- Total: $1-3/verification

**Already on Stripe**:
- Stripe Identity (KYC)
- Plus Persona for KYB if needed
- Total: $1.50-3/verification

**Bank-linking heavy product**:
- Plaid for bank
- Plaid Identity OR Persona for KYC
- Total: $0.30/transaction + $1-2/verification

**Regulated fintech with AML**:
- Sumsub (KYC + AML combined)
- Or: Persona + ComplyAdvantage
- Total: $1.35-5/verification

**Global / multi-jurisdiction**:
- Trulioo
- Total: $1-3/verification

**Enterprise**:
- Onfido or Jumio
- Plus Alloy for orchestration
- Total: $30K-200K/yr

**EU-only**:
- Ondato or Veriff (EU strong)
- Total: $1-2/verification

## Decision Framework: Three Questions

1. **What''s the regulatory need?** → Standard KYC: Persona / Stripe Identity. KYC + AML: Sumsub. Global: Trulioo.
2. **Are you on Stripe?** → Yes: Stripe Identity. No: Persona.
3. **What''s your scale?** → < 10K/year: any modern. > 100K/year: negotiate Persona/Veriff. Enterprise: Onfido/Jumio.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Persona for general KYC; Stripe Identity if on Stripe; Sumsub for combined KYC + AML**. Skip Onfido / Jumio until enterprise scale.

## Verdict

For most readers building a SaaS in 2026:
- **Default for indie / mid-market**: Persona.
- **Already on Stripe**: Stripe Identity.
- **KYC + AML combined**: Sumsub.
- **Bank linking + identity**: Plaid + Plaid Identity.
- **Global**: Trulioo.
- **Enterprise**: Onfido or Jumio.
- **Cost-sensitive**: iDenfy.
- **EU-focused**: Ondato or Veriff.
- **Multi-vendor orchestration**: Alloy.

The hidden cost in identity verification isn''t the per-verification fee — it''s **friction at signup.** A 5-step KYC flow loses 30-50% of users; a streamlined Persona embed loses 5-15%. The cost-per-acquired-customer math changes dramatically with friction. The discipline of: verify only what regulation requires; embed inline rather than separate page; mobile-first; clear progress UX — matters more than which vendor. Pick a modern provider; obsess over the user-facing flow.

## See Also

- [Auth Providers](auth-providers.md) — auth layer (Clerk / Better Auth / etc.)
- [Authentication](authentication.md) — auth fundamentals
- [Stripe](stripe.md) — Stripe Identity bundled
- [Stripe Customer Portal](stripe-customer-portal.md) — customer-facing
- [Payment Providers](payment-providers.md) — payment layer
- [Tax Compliance Tools](tax-compliance-tools.md) — VAT-ID verification
- [Subscription Billing Providers](subscription-billing-providers.md) — billing layer
- [Security](security.md) — security fundamentals
- [Bot Detection Providers](../devops-and-tools/bot-detection-providers.md) — fraud prevention
- [VibeWeek: Audit Logs](https://www.vibeweek.com/6-grow/audit-logs-chat) — KYC events in audit trail
- [VibeWeek: Account Deletion & Data Export](https://www.vibeweek.com/6-grow/account-deletion-data-export-chat) — KYC data deletion
- [LaunchWeek: Trust Center & Security Page](https://www.launchweek.com/4-convert/trust-center-security-page) — compliance evidence

---

[⬅️ Auth & Payments Overview](../auth-and-payments/)
