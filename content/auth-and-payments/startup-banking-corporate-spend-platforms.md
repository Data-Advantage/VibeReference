# Startup Banking & Corporate Spend Platforms: Mercury, Brex, Ramp, Bluevine, Relay, Airbase, Spendesk

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're forming a startup in 2026 and trying to figure out where to bank, what corporate card to issue, and how to manage employee spend, this is the consolidated comparison. The category fragmented after Silicon Valley Bank's collapse in March 2023 — the "default" startup banking choice splintered into Mercury, Brex (now banking-adjacent), and a tier of fintech challenger banks. Most founders pick whichever one Y Combinator told them to and discover six months later that wire limits, FDIC coverage, AP automation, or treasury yields don't match their needs. Pick the right shape and money plumbing is invisible; pick wrong and you spend a quarter migrating banks while running payroll, paying contractors internationally, and reconciling employee receipts.

## TL;DR Decision Matrix

| Provider | Type | FDIC / Insurance | Best For |
|---|---|---|---|
| Mercury | Startup-focused fintech bank | $5M sweep across partner banks | Default for venture-backed SaaS |
| Brex | Corporate cards + cash + spend | $6M sweep + SIPC for treasury | Mid-market+ SaaS with significant card spend |
| Ramp | Spend management + corporate cards (banking lighter) | Banking via partners; full FDIC on cash | Companies prioritizing spend control + automation |
| Bluevine | Online business bank | Per-partner FDIC | Bootstrap / SMB; some lending |
| Relay | No-fee business banking | Per-partner FDIC | Bootstrap / agencies wanting envelope budgets |
| Stripe (Issuing + Treasury) | Embedded financial services | Stripe Treasury via partner banks | Platforms / marketplaces (not direct startups) |
| Airbase | All-in-one spend platform | Banking via partners | Mid-market with complex AP + reimbursement |
| Spendesk | European spend management | Per-region partners | EU-based startups |
| Pleo | European corporate cards + spend | EU-based | EU SMB / startups |
| Float (Canada) | Canadian corporate spend | CDIC | Canadian startups |
| Wise (formerly TransferWise) Business | International + multi-currency | Per-partner | Cross-border / international payments |
| SVB → First Citizens | Traditional bank (post-acquisition) | Standard FDIC | Late-stage / public companies |
| JPMorgan Chase / Silicon Valley | Traditional banks | Standard FDIC | Pre-IPO / mature companies |

The first decision is **whether you need a bank or a spend platform**. Mercury and Bluevine are banks (they hold money, issue checks, do wires). Brex and Ramp are primarily spend platforms (they issue cards, automate expenses, sit on top of a bank). Many companies need one of each — a primary bank plus a spend platform. Some platforms (Mercury, Brex) increasingly bundle both.

## Decide What You Need First

Banking + spend platforms are not interchangeable. The same SaaS at $0M / $5M / $50M ARR has very different needs.

### Pre-revenue / Pre-funded (the 25% case)

You just incorporated. You need: a business checking account, an EIN-linked debit card, ACH in/out, occasional wire. You don't need: corporate card limits, AP automation, treasury yields, multi-entity. **Mercury** is the default — opens online in days; no minimums; fee-free for the basics.

### Seed-funded / Early-stage ($1M-15M raised, the 30% case)

You have $5-15M sitting in a checking account; you're hiring; corporate card spend is $20-100K/mo across team. You want: high FDIC coverage on the raise; corporate cards for the team; automated expense reports; some treasury yield without locking up cash. **Mercury + Brex/Ramp** is the dominant pattern. Mercury holds cash with sweep insurance; Brex or Ramp handles cards + spend control.

### Growth-stage SaaS ($25-100M ARR, the 30% case)

You have $20-50M in cash; AP volume is $500K-2M/mo; international vendors; reimbursement processing; finance team using NetSuite/QuickBooks Online. You want: full AP automation, multi-entity support, treasury management, integration with your ERP, and possibly a primary bank with relationship banking. **Brex enterprise** or **Ramp + a primary bank (Mercury or traditional)** + **Airbase for AP** is common.

### Pre-IPO / Mature ($100M+ ARR, the 10% case)

You're managing $50M-500M+ cash, multi-entity, multi-currency, complex AP, audited financials. Most companies migrate to **JPMorgan Chase**, **First Citizens (post-SVB)**, or **regional bank with deep startup practice** for primary banking, plus enterprise spend platforms.

### Bootstrap / Solo founder (the 5% case)

You're not VC-backed; revenue is the funding source; you need cheap, fee-free, simple. **Relay**, **Bluevine**, or **Mercury** all work. Skip the enterprise spend platforms.

## Provider Deep-Dives

### Mercury

The default startup banking choice in 2026. Founded 2017. Customer base: thousands of YC-backed and venture-backed SaaS, fintech, and tech startups.

Strengths:

- **Best startup-banking UX** — sign up online in days; no in-person visits; clean app
- $5M FDIC sweep across partner banks (after the SVB scare, this matters)
- Free domestic wires, ACH, checking; no minimums
- Mercury Treasury for excess cash yield (~4-5%/yr in 2026, via T-bills + money market funds)
- Mercury IO (corporate card) added 2023; competitive with Brex/Ramp for small/medium use
- API access for engineering teams
- Strong Slack-vs-bank-app parity for finance ops
- Multi-user permissions; clean admin
- Good support response — actual humans, fast

Weaknesses:

- **Not a bank** — Mercury is a fintech that holds your money at partner banks (Choice Financial, Evolve, Column). Different from a chartered bank.
- IO (corporate card) is younger than Brex; some controls and integrations less mature
- AP automation lighter than Ramp/Airbase; bigger AP shops outgrow it
- International wires available but limited compared to Brex / Wise
- Customer support response time has degraded as scaled
- Not great for credit lines, lending, or complex treasury

Use Mercury when:

- You're seed/Series A SaaS; $5-50M cash
- You want one platform for cash + cards + treasury without enterprise complexity
- You value modern UX and quick onboarding

Avoid when:

- You need traditional relationship banking
- You have heavy AP automation needs (use Ramp/Airbase alongside)
- You're pre-IPO or public — migrate to JPMorgan/First Citizens

### Brex

Originally corporate cards for startups (2017 launch). Pivoted to "all-in-one finance" — cards, business accounts, expense automation, AP, travel.

Strengths:

- **Most generous corporate card limits** for early-stage (qualifies based on cash on hand, not credit score)
- Brex Cash account + treasury yield (similar to Mercury Treasury)
- Strong AP automation (Brex AP)
- Brex Empower for travel + expense management
- Tight integrations with QuickBooks, NetSuite, Sage Intacct
- Strong reward points program for travel + SaaS
- Mature integrations with Slack, Gusto, Rippling, Workday
- Multi-entity support (better than Mercury at scale)

Weaknesses:

- **Pivoted away from non-VC-backed startups** in 2022 — bootstrap and small businesses were de-prioritized; most have moved to Ramp or Mercury
- Dropped some self-serve tiers; sales-led for many features now
- Higher AUM requirements for premium features
- Brex Cash is fintech, not a bank charter (similar to Mercury)
- Some users report degraded support since scaling

Use Brex when:

- You're VC-backed Series A+ with $5M+ cash
- You want bundled cards + cash + AP in one platform
- Travel + expense is a real workflow (Empower handles it well)
- You value premium reward points

Avoid when:

- You're bootstrapped — Brex de-prioritized that segment
- You want pure card-only with strong spend controls (Ramp may fit better)

### Ramp

Founded 2019. The "spend management first, banking second" platform. Most aggressive AI/automation push of any spend platform.

Strengths:

- **Most aggressive automation** — receipt matching, policy enforcement, AP automation, vendor management all AI-driven
- Free for most use cases (revenue from interchange + premium AP/treasury features)
- Strong corporate card with built-in spend controls
- Bill Pay (Ramp's AP automation) is competitive with Bill.com / Airbase
- Ramp Plus (~$15/user/mo) adds advanced controls + procurement
- Treasury (Ramp Cash) added 2023; competitive yields
- Best-in-class reporting + dashboard for spend visibility
- Integrations with QuickBooks, NetSuite, Xero, Workday, Gusto, Rippling
- Multi-entity at higher tiers
- Mobile app + Slack integration for fast approvals

Weaknesses:

- Banking is via partner banks (Sutton Bank); less robust than Mercury for primary banking
- Newer than Brex — some enterprise features still maturing
- Customer support has scaled but quality variable
- Ramp's "free" model means some advanced features require Ramp Plus tier

Use Ramp when:

- Spend visibility + control + automation is your priority
- You want corporate cards + AP automation as one stack
- You're $5M-100M ARR with active expense workflows

Avoid when:

- You need primary banking with relationship management
- You're heavily international (Brex / Wise have better cross-border)

### Bluevine

Online business bank since 2013. Targets bootstrap / SMB more than venture-backed.

Strengths:

- **Earns interest on checking** — competitive yield without separate treasury account
- Real bank charter via partner (FDIC standard)
- Lending (line of credit, term loans) more accessible than Mercury / Brex
- Lower friction for non-VC-backed businesses
- ACH/wire/check infrastructure standard

Weaknesses:

- Less startup-focused UX/feature set than Mercury
- No corporate card platform comparable to Brex/Ramp
- AP automation lighter
- Less attractive for venture-backed companies who want broader feature set

Use Bluevine when:

- You're bootstrapped / SMB
- Yield on operating cash matters
- You may need lending and Mercury/Brex won't underwrite you

### Relay

Online business bank since 2018. Targets agencies, SMB, and "envelope budgeting" workflows.

Strengths:

- **Up to 20 sub-accounts** for envelope budgeting (great for agencies separating client funds, project budgets)
- Free domestic wires
- Real bank charter via partner
- Multi-user with role-based controls
- Clean UX

Weaknesses:

- Not designed for venture-backed startups
- No corporate card platform
- Yield lower than Bluevine
- Less startup-tooling integration than Mercury/Brex

Use Relay when:

- You're an agency or services business with envelope-style budgeting needs
- You want simple, fee-free banking without startup-specific features

### Airbase

Spend management platform — corporate cards + AP + reimbursement + procurement. Founded 2017. Targets mid-market+.

Strengths:

- **Most comprehensive spend platform** — cards + AP + reimbursement + procurement in one
- Strong approval workflows for complex orgs
- Multi-entity, multi-currency
- Strong NetSuite + Sage Intacct integrations
- Procurement workflows (vendor onboarding, PO generation)

Weaknesses:

- Pricing complex (sales-led, custom)
- Newer player; less brand recognition than Brex/Ramp
- Most useful at $25M+ ARR with finance team

Use Airbase when:

- You're $25M+ ARR with finance ops needs
- AP + reimbursement + procurement complexity warrants a unified platform
- NetSuite is your ERP

### Spendesk

European spend management. Founded 2016 (France). Strong in EU.

Strengths:

- **EU-native** with multi-currency and SEPA support
- Cards + reimbursement + invoice management
- Compliance with EU regulations (DAC7, etc.) built in
- Local language support across EU markets

Weaknesses:

- Less feature-deep than Brex/Ramp in US
- US footprint smaller

Use Spendesk when:

- You're EU-based or have heavy EU spend
- You want native EU compliance

### Pleo

European corporate cards + spend. Founded 2015 (Denmark). Targets SMB through mid-market.

Strengths:

- **Strong UX for SMB EU companies**
- Cards + reimbursement + receipts
- VAT extraction from receipts (useful for EU compliance)
- Pricing accessible to small teams

Weaknesses:

- Limited US presence
- Smaller than Spendesk for enterprise

Use Pleo when:

- You're EU SMB wanting modern card + spend stack

### Float (Canada)

Canadian corporate spend platform.

Strengths:

- **CDIC-protected** Canadian banking
- Modern card + spend platform for Canadian startups

Use Float when:

- You're a Canadian startup

### Wise Business (formerly TransferWise)

Multi-currency international payments.

Strengths:

- **Best-in-class international transfers** at near-mid-market rates
- Multi-currency holding accounts (USD, EUR, GBP, etc.)
- Pay international contractors at low cost

Weaknesses:

- Not a primary bank — supplement, not replacement
- Limited US-specific features

Use Wise when:

- You pay international contractors or vendors regularly
- Currency conversion costs are meaningful

### Stripe Issuing + Treasury

Embedded financial services. Not for direct use as a startup's primary bank — for *building* fintech features into your own product.

Use Stripe Treasury when:

- You're building a marketplace / platform that holds funds for users
- Not for general startup banking

### SVB → First Citizens / Traditional Banks

Traditional banks for startups: First Citizens (post-SVB acquisition), JPMorgan Chase, Silicon Valley Bank (now First Citizens), Pacific Western, Comerica.

Strengths:

- **Relationship banking** — actual humans who know your business
- Lending at scale (revenue-based, venture debt, equipment financing)
- Multi-entity / international wire infrastructure mature
- Required by some institutional investors / acquirers

Weaknesses:

- Slower onboarding (weeks to months)
- Worse UX than fintech challengers
- Higher minimum balances

Use traditional banks when:

- You're $50M+ ARR or pre-IPO
- You need venture debt / lines of credit
- Acquirer or investor expects it

## What Startup Banking Won't Do

**Don't expect fintech challengers to be banks.** Mercury, Brex, Ramp don't hold a banking charter. Your money sits at partner banks (Evolve, Choice Financial, Sutton, etc.). FDIC protection is via the partner banks. This matters in extreme scenarios (the partner bank's solvency).

**Don't expect them to issue checks freely.** Most fintech challengers issue checks slowly or charge for them. If your AP requires checks (some vendors won't take ACH), you'll find this annoying. Workarounds: Bill.com, Airbase, or maintain a small traditional account for checks.

**Don't expect lending early.** Pre-revenue or pre-Series-B, lending is rare from any of these. Bluevine is the most lending-friendly; Brex's "Brex Credit" is essentially charge-card spending limit, not a real line of credit.

**Don't expect identical APIs.** Some integrate with QuickBooks; some with NetSuite; some with both; some with neither. Verify your accounting + ERP fit before committing.

**Don't expect frictionless international.** US-domiciled banks paying international contractors is messy. Wise, Brex, or Mercury international wires solve some of it; full international AP usually requires Wise + a primary US bank.

## Pragmatic Stack Patterns

### Pre-seed / Pre-revenue

- Mercury (operating account)
- Mercury IO debit card or 1-2 cards from Mercury IO / Brex
- No spend management platform yet
- Total: Free

### Seed / Series A ($1-15M cash)

- Mercury or Brex Cash for primary banking
- Brex or Ramp for corporate cards + spend
- Mercury Treasury or Brex Treasury for excess yield
- Wise for international vendors
- Total: ~Free (revenue from interchange + treasury fees)

### Series B ($15-50M cash, $5-25M ARR)

- Mercury (or Brex Cash) for operating
- Ramp (or Brex) for corporate cards + AP
- Treasury account for excess cash
- Bill.com or Airbase for AP at higher complexity
- Wise for international AP
- Maybe a small traditional bank account for checks
- Total: $0-2K/mo software (interchange covers most)

### Series C+ ($50M+ ARR)

- First Citizens or JPMorgan Chase for primary banking + relationship
- Brex or Ramp for corporate cards
- Airbase for spend + AP
- Wise / specialized international
- Treasury management at primary bank or BlackRock / institutional
- Total: $5K-30K/mo software + bank fees

### Bootstrap / Agency

- Mercury, Bluevine, or Relay for operating
- Maybe Ramp Cash for cards (free tier)
- No need for enterprise spend
- Total: $0-50/mo

## Decision Framework: Six Questions

1. **Are you VC-backed or bootstrapped?**
   - VC-backed: Mercury or Brex
   - Bootstrap / SMB: Mercury, Bluevine, or Relay

2. **What's your cash on hand?**
   - <$500K: Mercury (FDIC sweep matters less)
   - $500K-5M: Mercury (sweep up to $5M); Brex viable
   - $5M+: Mercury, Brex, plus possible second bank for redundancy

3. **What's your card spend?**
   - <$10K/mo: Mercury IO sufficient
   - $10K-100K/mo: Brex or Ramp (better controls + rewards)
   - $100K+/mo: Brex enterprise or Ramp Plus

4. **AP complexity?**
   - Light (<10 invoices/mo): Mercury Bill Pay or Brex AP
   - Medium (10-100 invoices/mo): Ramp Bill Pay or Bill.com
   - Heavy (100+/mo, multi-entity): Airbase or Bill.com enterprise

5. **International payments?**
   - Rare: any platform's international wire
   - Frequent: Wise Business + your primary platform

6. **What's your ERP / accounting?**
   - QuickBooks Online: any platform integrates
   - Xero: most integrate
   - NetSuite: Brex, Ramp, Airbase have strongest integrations
   - Sage Intacct: Brex, Airbase

## Verdict

**Default for VC-backed seed / Series A**: Mercury for cash + Mercury IO or Brex/Ramp for cards. Free, fast, modern. Migrate when you outgrow.

**Default for VC-backed Series B+**: Mercury or Brex for cash + Ramp for spend + Wise for international + Bill.com/Airbase for AP at scale.

**Default for bootstrap / SMB**: Mercury or Relay or Bluevine. Pick on your specific need (modern UX → Mercury; envelope budgeting → Relay; lending → Bluevine).

**Default for EU-based**: Spendesk for spend management; primary banking via Wise Business or local bank.

**Default for late-stage / pre-IPO**: First Citizens or JPMorgan Chase for primary; Brex/Ramp + Airbase for spend; institutional treasury.

The most common mistake is **using one platform for everything when two specialize better** — Mercury for banking + Ramp for spend is dramatically better than Mercury alone past Series A. The second is **panic-switching after a banking scare** without migrating cleanly (transactions in flight, vendor ACH redirects, payroll cutover) — plan migrations in low-AP windows. The third is **ignoring FDIC sweep** — at $1M+ cash, knowing whether your platform sweeps is non-negotiable.

## See Also

- [Subscription Billing Providers](./subscription-billing-providers.md) — Stripe Billing alongside cash management
- [Subscription Analytics Platforms](./subscription-analytics-platforms.md) — measuring revenue against spend
- [Stripe](./stripe.md) — payments, distinct from your cash account
- [Payment Providers](./payment-providers.md) — receiving customer payments
- [Tax Compliance Tools](./tax-compliance-tools.md) — Stripe Tax / Avalara / Anrok
- [Accounting & Bookkeeping Software](./accounting-bookkeeping-software.md) — QuickBooks / Xero / NetSuite
- [HR & Payroll Tools](./hr-payroll-tools.md) — Gusto / Rippling / Justworks (payroll runs through banks)
- [Performance Management Tools](./performance-management-tools.md)
- [Recruiting / ATS Platforms](./recruiting-ats-platforms.md)
- [eSignature & Document Signing Tools](./esignature-document-signing-tools.md)
- [CPQ & Quote-to-Cash Tools](./cpq-quote-to-cash-tools.md)
- [Contract Lifecycle Management Platforms](./contract-lifecycle-management-clm-platforms.md)
- [Identity Verification & KYC Tools](./identity-verification-kyc-tools.md)
- [Fraud Detection Providers](./fraud-detection-providers.md)
- [Cap Table & Equity Management Tools](./cap-table-equity-management-tools.md)
