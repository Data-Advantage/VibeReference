# Tax Compliance Tools: Stripe Tax, TaxJar, Avalara, Anrok, Sphere, Quaderno, Paddle, Lemon Squeezy

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're building a SaaS in 2026 and trying to pick a tax-compliance tool, this is the consolidated comparison. Tax is the line item founders skip until a state DOR or EU tax authority sends a letter — and back-taxes plus penalties land in the same week. Most indie SaaS default to Stripe Tax (correct for most cases) without comparing; mid-market teams jump to Avalara (overkill at $20K/yr) when Anrok or TaxJar would have served them. Pick the right shape and tax becomes invisible plumbing; pick wrong and you're either paying for capability you don't need or facing a back-tax surprise.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Stripe Tax | Bundled with Stripe | Free under $100K txn | 0.5% of transactions | Very high | Default for indie SaaS on Stripe in 2026 |
| Paddle (MoR) | Merchant of record | Free | 5%+50¢ all-in | High | Solo founders selling globally |
| Lemon Squeezy (MoR) | Merchant of record | Free | 5%+50¢ | Very high | Indie founders wanting zero tax compliance |
| Polar (MoR option) | Indie MoR | Free | 4%+40¢ | Very high | Modern indie alternative to LS |
| Anrok | SaaS-focused tax | Demo | Custom (~$5K/yr) | High | Mid-market SaaS scaling tax compliance |
| TaxJar (Stripe-owned) | Auto-filing US tax | Trial | $19/mo (Starter) | High | US-focused SMB |
| Avalara | Enterprise tax | Custom | $5K-50K+/yr | Low | Enterprise / multi-jurisdiction at scale |
| Quaderno | EU-friendly compliance | Trial | $49/mo | High | EU-based or EU-customer-heavy SaaS |
| Vertex | Enterprise tax (legacy) | Custom | Sales-led | Very low | Large-enterprise tax / ERP integrations |
| DIY accountant + spreadsheets | Manual | Free + accountant fees | $200-1K/quarter | Medium | <$100K ARR; few jurisdictions |

The first decision is **how much of the tax problem you want to outsource**. Stripe Tax (calculate at checkout; you file) vs MoR (Paddle / Lemon Squeezy / Polar handles everything) vs Avalara/Anrok (calculate + auto-file) are three different shapes. Most indie SaaS need the first; some need the second; only mid-market+ needs the third with autonomous filing.

## Decide What You Need First

Tax tools are not interchangeable. Pick by ARR and complexity, not by reputation.

### Stripe Tax bundle (the 70% case for indie SaaS)
You're on Stripe; you want tax calculated automatically at checkout; you file returns yourself or via accountant.

Right tool: **Stripe Tax** — at 0.5% of transactions, it's basically free.

### Merchant-of-record (zero compliance)
You don't want to register, file, or remit anywhere. The MoR is the legal seller; tax is their problem.

Right tools:
- **Paddle Billing** — established
- **Lemon Squeezy** — indie-friendly
- **Polar** — modern alternative

### Auto-filing add-on (US-focused)
You're on Stripe Tax for calculation; you want to automate filing US sales tax instead of doing it manually.

Right tools:
- **TaxJar** (Stripe-owned now) — auto-files in US states
- **Anrok** — SaaS-focused alternative
- Accountant who does it for you

### Enterprise multi-jurisdiction
You operate in many countries with complex rules; you have a finance team; you need ERP integration.

Right tools:
- **Avalara** — enterprise default
- **Vertex** — alternative
- **Anrok** — modern alternative for SaaS specifically

For most indie SaaS in 2026: **Stripe Tax + accountant for filing if you're direct-billing; Paddle / Lemon Squeezy if you want zero compliance burden**. Avalara is overkill until $5M+ ARR.

## Provider Deep-Dives

### Stripe Tax — Bundled and Cheap
Stripe Tax went GA in 2021 and dramatically reduced the friction of tax compliance for Stripe customers. Calculates at checkout; reports for filing; handles VAT validation.

Strengths:
- Bundled with Stripe (no separate vendor)
- 0.5% transaction fee (cheap)
- Free under $100K of taxed transactions per year
- Real-time tax-rate calculation per jurisdiction
- VAT validation via VIES API
- B2B reverse-charge handling
- Reports for filing
- Integrated with Stripe products (Subscriptions, Invoicing, Checkout)

Weaknesses:
- Doesn''t auto-file (you remit)
- US state-specific exemptions less granular than Avalara
- Stripe-only (doesn''t work outside Stripe ecosystem)

Pick when: you''re on Stripe and don''t need auto-filing. Default for most indie SaaS in 2026.

### Paddle Billing — Merchant of Record
Paddle is the legal seller on every transaction. They handle tax in every jurisdiction. You get one bill.

Strengths:
- Zero tax compliance burden
- Global tax handling (US sales tax, EU VAT, GST in Canada / Australia / India / etc.)
- Single payout
- Modern API
- Subscription management included

Weaknesses:
- 5%+50¢ per transaction (vs Stripe direct ~3.4%)
- Customer sees Paddle on credit-card statement (sometimes confusing)
- Less flexibility on custom contracts

Pick when: you sell globally; you don''t want to handle tax compliance ever; the higher fee is worth the operational simplicity.

### Lemon Squeezy — Indie MoR
Lemon Squeezy is the indie-focused MoR. Acquired by Stripe in 2024; continues operating independently. Cleaner UX than Paddle for solo founders.

Strengths:
- MoR (zero tax compliance)
- Simpler onboarding than Paddle
- Indie-friendly
- 5%+50¢ pricing
- License-key product included
- Affiliate program built in

Weaknesses:
- Smaller scale than Paddle
- Less suited for enterprise / large transactions
- Stripe acquisition raises long-term roadmap questions

Pick when: solo founder; small team; want global tax handled; comfortable with the merchant-of-record on customer statements.

### Polar — Modern Indie MoR Alternative
Polar offers a MoR option alongside their direct-billing platform. Modern; dev-friendly; cheaper than Paddle.

Strengths:
- 4%+40¢ MoR pricing (cheaper than Paddle / Lemon Squeezy)
- Modern API
- Direct-billing also available (vs Paddle which is MoR-only)
- Indie-friendly UX
- Open-source company

Weaknesses:
- Smaller user base
- Newer product

Pick when: you want a MoR with a slightly better fee; or you want flexibility (MoR for some customers; direct for others).

### Anrok — SaaS-Focused Tax Compliance
Anrok was founded specifically for SaaS tax (sales tax + VAT). Modern API; auto-filing; Stripe / Chargebee / Recurly integrations.

Strengths:
- SaaS-first design
- Auto-filing in US states
- VAT registration + filing in EU
- Modern API; faster integration than Avalara
- Pricing transparent (vs Avalara''s sales-led)

Weaknesses:
- Custom pricing (typically ~$5K/yr starting)
- Smaller community than Avalara
- Mid-market focus; overkill for solo founders

Pick when: you''re mid-market SaaS ($1M+ ARR); you''re on Stripe Tax for calculation but want auto-filing; you don''t want to deal with Avalara''s sales process.

### TaxJar — Auto-Filing for US States
TaxJar (acquired by Stripe in 2021) automates US state sales-tax filing. Connects to Stripe / Shopify / etc.

Strengths:
- Auto-files in all US states
- $19/mo Starter
- Transparent pricing
- Owned by Stripe (good integration)

Weaknesses:
- US-only
- Not for EU / international
- Stripe direction may merge into Stripe Tax over time

Pick when: you''re US-only; you''re on Stripe Tax for calculation; you want auto-filing without the cost of Anrok/Avalara.

### Avalara — Enterprise Tax
Avalara is the long-standing enterprise tax-compliance platform. Powerful, expensive, complex.

Strengths:
- Most-comprehensive tax engine
- Multi-jurisdiction (US, EU, all major countries)
- ERP integrations (NetSuite, SAP, Oracle)
- Strong audit support
- Telecom, lodging, fuel, alcohol — niche tax types

Weaknesses:
- Custom pricing ($5K-50K+/yr)
- Sales-led implementation (months)
- Heavy product surface
- Overkill for indie SaaS

Pick when: you''re mid-market+ ($10M+ ARR); you have multi-jurisdiction complexity; you have a finance team to operate it.

### Quaderno — EU-Friendly Compliance
Quaderno is EU-based; strong on VAT compliance; smaller than Avalara.

Strengths:
- EU-first design
- Strong VAT handling
- $49/mo Starter
- Auto-filing in EU + selected jurisdictions
- Stripe / Paddle / etc. integrations

Weaknesses:
- US sales-tax handling less mature than TaxJar/Anrok
- Smaller community

Pick when: you''re EU-based or EU-heavy; you want auto-filing without Avalara complexity.

### Vertex — Legacy Enterprise
Vertex predates most modern tax platforms. Strong in enterprise / ERP integration. Heavy implementation.

Pick when: you''re large enterprise with a finance team and existing Vertex investment.

### DIY (Accountant + Spreadsheets)
For indie SaaS at <$100K ARR with limited jurisdictions, manual filing via accountant is fine.

Pros: cheap; flexible
Cons: doesn''t scale; manual work

Pick when: small ARR; few jurisdictions; cost-sensitive.

## What Tax Tools Won''t Do

- **Replace registration.** Tools calculate; you (or your accountant) register in jurisdictions. Per [tax-vat-handling-chat](https://www.vibeweek.com/6-grow/tax-vat-handling-chat) — registration is your responsibility before collection.
- **Replace your accountant.** Tools handle mechanical work; complex cases (audits, exemptions) need human judgment.
- **Replace nexus tracking.** Stripe Tax warns; you act. Don''t ignore warnings.
- **Be perfectly accurate.** Each tool has edge cases; reconcile quarterly.
- **Handle every jurisdiction.** 200+ countries; even Avalara has gaps. Plan for manual work in obscure markets.

## Pragmatic Stack Patterns

**Indie SaaS, US-focused, on Stripe**:
- Stripe Tax (calculation)
- Accountant for quarterly filing
- TaxJar (Stripe-owned) when filing volume justifies
- Total: 0.5% Stripe Tax + $200-500/quarter accountant

**Indie SaaS, global**:
- Lemon Squeezy or Polar (MoR — they handle everything)
- Or: Stripe + Stripe Tax + accountant + EU OSS registration
- Total: 5%+50¢ MoR; or ~3.4% Stripe + accountant fees

**Mid-market SaaS, $1-10M ARR**:
- Stripe + Stripe Tax + Anrok (auto-filing)
- Or: Stripe + Avalara
- Total: 0.5% + $5-15K/yr Anrok or Avalara

**Enterprise SaaS, $10M+ ARR**:
- Avalara or Vertex
- ERP integration
- Finance team
- Total: $20-100K+/yr

**Already on a MoR**:
- Lemon Squeezy / Paddle / Polar handles everything
- Skip TaxJar / Anrok / Avalara
- Total: bundled in MoR fee

**EU-based / EU-heavy**:
- Stripe + Stripe Tax + Quaderno (auto-filing)
- Or: Paddle / Lemon Squeezy if global
- Total: 0.5% Stripe Tax + $49/mo Quaderno

## Decision Framework: Three Questions

1. **Are you on Stripe?** → Yes: Stripe Tax (default). No: provider-specific.
2. **Do you want zero compliance burden?** → Yes: Lemon Squeezy / Paddle / Polar (MoR). No: continue.
3. **What''s your ARR / scale?** → <$1M: Stripe Tax + accountant. $1-10M: + Anrok / TaxJar. $10M+: Avalara.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Stripe Tax if direct-billing; Lemon Squeezy or Paddle if you want MoR; Anrok at mid-market scale**. Skip Avalara until enterprise.

## Verdict

For most readers building a SaaS in 2026:
- **Default for direct-billing**: Stripe Tax.
- **Default for zero compliance**: Lemon Squeezy or Paddle.
- **Mid-market auto-filing**: Anrok or TaxJar.
- **EU-heavy**: Quaderno.
- **Enterprise**: Avalara.
- **Polar shop**: Polar with MoR mode.

The hidden cost of weak tax handling: **back-taxes from a jurisdiction you didn''t register in.** A $50K letter from a US state DOR or EU tax authority lands two years into operating; the cost dwarfs the small fees you would have paid for proper compliance. The infrastructure (Stripe Tax: 0.5%; MoR: 5%) is much cheaper than the audit. Pay the small fee; sleep well.

## See Also

- [Tax & VAT Handling (engineering side)](https://www.vibeweek.com/6-grow/tax-vat-handling-chat) — companion implementation guide
- [Payment Providers](payment-providers.md) — Stripe / Polar / Paddle / Lemon Squeezy
- [Subscription Billing Providers](subscription-billing-providers.md) — billing engines that integrate
- [Stripe](stripe.md) — Stripe deep-dive
- [Stripe Customer Portal](stripe-customer-portal.md) — customer self-serve
- [Stripe Usage-Based Billing](stripe-usage-based-billing.md) — usage billing
- [Polar](polar.md) — modern indie payments + billing
- [Refunds & Chargebacks](https://www.vibeweek.com/6-grow/refunds-chargebacks-chat) — companion topic
- [Dunning & Failed Payments](https://www.vibeweek.com/6-grow/dunning-failed-payments-chat) — companion topic
- [Trust Center & Security Page](https://www.launchweek.com/4-convert/trust-center-security-page) — procurement asks about tax compliance

---

[⬅️ Auth & Payments Overview](../auth-and-payments/)
