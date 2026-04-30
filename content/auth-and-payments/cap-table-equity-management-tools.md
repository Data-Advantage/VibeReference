# Cap Table & Equity Management Tools: Carta, Pulley, AngelList Stack, Capboard, Shareworks, Ledgy, Equiteo

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you've raised any money or issued any equity (founder shares, advisor grants, employee options) in 2026, you need a cap table tool. Spreadsheets work for the first 3 months and then break catastrophically: missed grants; expired options never converted; 409A valuation late; tax bombs at exit. The right tool tracks ownership, manages grants + vesting, runs 409A valuations, generates board consents, files Form 3921 / IRS reporting, and shows what a future round would do to ownership. Most US founders default-buy Carta (the dominant US tool); Pulley is the modern challenger; AngelList Stack is bundled-with-incorporation; international founders pick Ledgy / Capboard. The wrong choice creates ongoing friction and surprise tax bills at exit.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Carta | US dominant | Free <25 stakeholders | $1.5K-50K+/yr | Medium | US-default; established |
| Pulley | Modern challenger | Free pre-seed | $1K-25K/yr | Very high | Modern startups |
| AngelList Stack | Bundled w/ incorporation | $99/mo | $99-499/mo | High | AngelList-incorporated |
| Capboard | EU / global | Free trial | $$ | High | EU / global ex-US |
| Ledgy | EU equity management | Custom | $$$ | Medium | EU mid-market |
| Shareworks (Morgan Stanley) | Enterprise / public | Custom | $$$$ | Low | Public companies / large pre-IPO |
| Equiteo | UK-focused | Custom | $$ | Medium | UK / EU |
| Vauban | EU / global SPVs | Custom | $$$ | Medium | SPV-heavy stacks |
| Capdesk (acquired by Carta) | Was EU; merged into Carta | -- | -- | -- | (legacy) |
| Computershare | Public companies | Custom | $$$$ | Very low | Post-IPO |
| Eqvista | Indie-friendly | Free <99 stakeholders | $$ | High | Bootstrapped indies |
| Cake Equity | AU / international | Free trial | $$ | High | AU / NZ / non-US |

The first decision is **country / jurisdiction**. US: Carta / Pulley / AngelList Stack. UK / EU: Ledgy / Capboard / Equiteo. Multi-jurisdiction: Carta has best coverage; others growing.

## Decide What You Need First

Tools are not interchangeable. Pick by jurisdiction + stage.

### Pre-seed / seed US ($0-200/mo)
You've raised <$5M; <30 stakeholders.

Right tools:
- **Carta Free** (<25 stakeholders; full features)
- **Pulley Free** (pre-seed)
- **AngelList Stack** if AngelList-incorporated ($99/mo)

### Series A US ($1.5-5K/yr)
You've raised ~$5-25M; 30-100 stakeholders; have employees with options.

Right tools:
- **Carta** Launch tier
- **Pulley** Series A tier
- 409A valuation included

### Series B+ US ($5-30K/yr)
Multiple rounds; complex equity (RSUs / SARs); large team.

Right tools:
- **Carta** Mid-Market
- **Pulley** Scale
- Add: secondary marketplace if relevant

### EU / UK / Global ($/£/€)
Different tax regimes; different equity vehicles (EMI / BSPCE / RSU variants).

Right tools:
- **Ledgy** — EU mid-market
- **Capboard** — multi-jurisdiction
- **Equiteo** — UK
- **Carta** has EU support but not always best for local rules

### Bootstrapped / no-VC ($0-200/mo)
You've issued founder shares + maybe advisor grants; no VC investors.

Right tools:
- **Eqvista Free** (<99 stakeholders)
- **Carta Free** (<25)
- Spreadsheet (just kidding; don't)

## Provider Deep-Dives

### Carta — US dominant
Founded 2012. The dominant US cap table tool. Handles 40K+ companies; massive ecosystem.

Pricing in 2026: Free for ≤25 stakeholders; Launch (~$1.5K/yr); Build (~$5K/yr); Scale (~$10-25K/yr); Mid-Market / Enterprise custom.

Features: cap table, options + RSUs + SARs, 409A valuations (in-house), board consents, employee equity portal, transfer agent services, secondary tender offers, fund administration, Carta X (private-market secondary).

Why Carta wins in US: ecosystem; investors expect it; CPAs / lawyers know it; everyone integrates.

Trade-offs: pricing climbs steeply; UX has issues; controversy around Carta X (2024 employee-data scandal damaged trust temporarily); some US founders have migrated.

Pick if: US default; want broad ecosystem. Don't pick if: cost-conscious or post-controversy distrust.

### Pulley — modern challenger
Founded 2019; YC-backed. Modern UX; growing fast 2023-2026. Y Combinator's recommended cap table tool.

Pricing in 2026: Free pre-seed; Seed Track $850/yr; Series A $2K/yr; Scale $$$.

Features: cap table, options, 409A valuations, scenario modeling, employee portal, board consents.

Why Pulley wins: modern UX; YC partnership; pricing transparency (Carta is opaque); quality customer service.

Trade-offs: smaller ecosystem; some integrations weaker; less tested at scale.

Pick if: new company starting fresh; YC company; want modern UX. Don't pick if: existing Carta migration overhead high.

### AngelList Stack
Bundled with AngelList incorporation. If you incorporate via AngelList, cap table included.

Pricing in 2026: $99/mo basic; $499/mo for some advanced.

Features: cap table, SAFE management, employee equity, integration with AngelList rolling fund infrastructure, banking via AngelList partners.

Why AngelList Stack: zero-friction if AngelList-incorporated; bundled bookkeeping / banking / cap table / SAFE.

Pick if: AngelList-incorporated. Don't pick if: not AngelList; or want deepest cap-table features (Carta / Pulley deeper).

### Capboard / Ledgy / Equiteo / Cake Equity
EU / international options:

- **Ledgy** — Swiss; popular in EU / mid-market
- **Capboard** — Spanish; multi-jurisdiction
- **Equiteo** — UK-focused; EMI / BSPCE handling
- **Cake Equity** — AU / NZ / international

Pick by jurisdiction.

### Eqvista
Indie-friendly; free for <99 stakeholders.

Features: cap table, 409A, basic options, IRS reporting.

Pick if: bootstrapped; cost-conscious; under 100 stakeholders. Don't pick if: VC-backed (investors prefer Carta / Pulley).

### Shareworks / Computershare
Enterprise / public company territory. Used post-IPO and very-large-private.

Pick if: $200M+ valuation private or public. Don't pick if: smaller scale.

### Vauban
SPV-management focused. Helpful if running rolling-fund / SPV vehicles.

Pick if: SPV-heavy fund structure. Don't pick if: just running an operating company.

## What Cap Table Tools Won't Do

Buying a cap table tool doesn't:

1. **Replace your lawyer.** Tools generate documents; lawyer reviews; signs as counsel.
2. **Replace 409A valuation analyst.** Some tools include 409A in their service; they're hiring an analyst behind the scenes; you still need expert review.
3. **File your taxes.** Tools generate Form 3921 (incentive stock option exercise reporting), but tax filings happen via CPA.
4. **Track non-equity compensation.** Cash bonuses / RSUs not yet granted / etc. handled elsewhere.
5. **Manage non-equity ownership.** Real estate / IP licensing / royalty agreements aren't cap table items.

The honest framing: cap table tools are systems-of-record for equity ownership. Lawyer / CPA / valuation analyst are still essential.

## Pragmatic Stack Patterns

### Pattern 1: Pre-seed indie ($0/mo)
- **Carta Free** (<25 stakeholders) OR **Pulley Free**
- Lawyer at incorporation ($1-3K) draws docs
- Self-managed grants
- Total: $0-3K/yr (lawyer)

### Pattern 2: Seed-funded ($1.5-5K/yr)
- **Carta Launch** OR **Pulley Seed Track**
- 409A valuation (annual; ~$3-5K)
- Lawyer for grants / round docs
- Total: $5-15K/yr

### Pattern 3: Series A ($5-15K/yr)
- **Carta Build** OR **Pulley Series A**
- 409A valuation included or separate
- Lawyer for major events
- Total: $15-30K/yr

### Pattern 4: Series B+ ($15-50K/yr)
- **Carta Mid-Market** OR **Pulley Scale**
- 409A quarterly
- In-house finance team
- Lawyer + tax CPA
- Total: $50-150K/yr

### Pattern 5: EU / UK ($/yr)
- **Ledgy** OR **Capboard** OR **Equiteo** (jurisdiction-specific)
- Local lawyer + tax advisor
- Total: $5-30K/yr

### Pattern 6: AngelList ecosystem ($99-499/mo)
- **AngelList Stack** bundled cap table + banking + bookkeeping
- For AngelList-incorporated companies
- Total: $1.2K-6K/yr

## Decision Framework: Three Questions

1. **Where are you incorporated?**
   - US → Carta / Pulley / AngelList
   - UK / EU → Ledgy / Capboard / Equiteo
   - Multi-jurisdiction → Carta (broadest) or specialized per

2. **What's your stage?**
   - Pre-seed → Free tiers (Carta / Pulley / Eqvista)
   - Seed → Launch / Seed Track tiers ($1-2K/yr)
   - Series A+ → mid-tier ($5-15K/yr)
   - Series B+ → enterprise tiers ($15K+/yr)

3. **VC-backed or bootstrapped?**
   - VC-backed → Carta / Pulley (investor-expected)
   - Bootstrapped → Eqvista / Carta Free / spreadsheet-then-Carta

## Verdict

For 50% of US-incorporated VC-backed startups in 2026: **Carta**. Ecosystem moats; investors expect it; CPAs know it. The default unless you specifically prefer modern UX.

For 25%: **Pulley**. YC-backed; modern UX; transparent pricing. The 2026 default for new YC companies and Carta-skeptics.

For 10%: **AngelList Stack**. If you incorporated via AngelList; bundled is convenient.

For 10%: **Ledgy / Capboard / Equiteo** for EU / UK / global.

For 5%: **Eqvista** for bootstrapped / cost-conscious indies.

The mistake to avoid: **maintaining a spreadsheet past 5 stakeholders**. Inevitable: missed grants; expired options that should have been re-granted; 83(b) elections forgotten; surprise tax at exit. Even at indie scale, free tier of Carta / Pulley / Eqvista is right tool.

The second mistake: **delaying 409A**. Required for issuing options at fair-market-value strike. Without: penalty taxes for option holders (IRS 409A penalty = ~20% + interest). Pay $3-5K annually; worth it.

## See Also

- [Subscription Billing Providers](./subscription-billing-providers.md) — adjacent finance infra
- [Stripe](./stripe.md) — payments
- [Tax Compliance Tools](./tax-compliance-tools.md) — adjacent tax compliance
- [E-Signature & Document Signing Tools](./esignature-document-signing-tools.md) — option grants need signatures
- [Identity Verification & KYC Tools](./identity-verification-kyc-tools.md) — KYC for investors
- [Accounting & Bookkeeping Software](./accounting-bookkeeping-software.md) — equity expense flows to accounting
- [Payment Providers](./payment-providers.md) — broader context
- [LaunchWeek: Founder Hiring Playbook](https://launchweek.dev/4-convert/founder-hiring-playbook) — equity grants for hires
- [LaunchWeek: Investor Monthly Updates](https://launchweek.dev/5-launch/investor-monthly-updates) — cap table updates feed investor updates
- [LaunchWeek: Annual Planning & OKRs](https://launchweek.dev/1-position/annual-planning-okrs) — equity-tied OKRs
- [LaunchWeek: Acquisition & Exit Strategy](https://launchweek.dev/5-launch/acquisition-exit-strategy) — exit triggers cap-table waterfall
- [LaunchWeek: Pitch Deck](https://launchweek.dev/1-position/pitch-deck) — cap table on pitch
- [LaunchWeek: Sales Compensation Plans](https://launchweek.dev/4-convert/sales-compensation-plans) — equity in sales comp
