# Financial Data & Open Banking APIs: Plaid, Yodlee, Finicity, MX, TrueLayer, Tink, GoCardless, Stripe Financial Connections

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're building a SaaS in 2026 that needs to read bank account data, verify income, automate ACH transfers, pull transaction histories, or move money between bank accounts, this is the consolidated comparison. The category goes under various names: "open banking," "financial data aggregation," "account information services," "PFM (Personal Financial Management) APIs." The use cases: payment authorization (ACH without manual account number entry), fraud prevention (verify the user's bank account is real + theirs), income/employment verification (loan underwriting; rental applications), spend analytics (categorize transactions), B2B / accounting (sync transactions into QuickBooks-equivalent products), and increasingly: AI agents that read user finances.

The dominant US player is **Plaid**. Visa acquired **Tink** (EU). Mastercard acquired **Finicity** (US). **MX** is the largest standalone US player. **TrueLayer** is the EU/UK leader for newer fintech. **Stripe Financial Connections** is Stripe's bundled offering. **GoCardless** specializes in bank-debit (ACH-equivalents globally).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Geographic Coverage | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Plaid | US-leading aggregator + ACH | Free dev sandbox | $0.30-$1+/account-link + monthly | US (12K+ banks); EU/UK growing | High | Default for US fintech / SaaS |
| Stripe Financial Connections | Stripe-native bank linking | Bundled | $1.50/successful link | US-only (currently) | Very high | Stripe customers wanting ACH + verification |
| Finicity (Mastercard) | Open banking + verification | Custom | Custom | US + Canada | Low | Mortgage / lending vertical |
| Yodlee | Enterprise aggregator (oldest) | Custom | Sales-led | US + global (limited) | Very low | Enterprise / regulated; fading vs Plaid |
| MX | US enterprise; financial wellness | Custom | Custom | US-focus | Medium | Banks + credit unions; mid-market fintech |
| TrueLayer | EU/UK open banking leader | Trial | Custom | UK + EU + AUS | High | EU/UK fintech |
| Tink (Visa) | EU open banking | Custom | Custom | EU primarily | Medium | EU bank-affiliated fintech |
| GoCardless | Bank-debit recurring payments | Free | 1% per transaction (capped) | UK + EU + US + AU + global | High | Recurring SEPA / BACS / ACH-equivalents |
| Salt Edge | Global aggregator | Custom | Custom | Global; emerging markets | Medium | International / multi-region fintech |
| Belvo | LATAM open banking | Custom | Custom | Brazil + Mexico + Colombia | Medium | LATAM fintech |
| Kontomatik | EU smaller markets | Custom | Custom | CEE + EU | Medium | Specific European markets |
| Codat | Accounting + commerce data | Custom | Custom | US + UK + AU global | Medium | B2B fintech accessing accounting / commerce data |
| Tellus | API-first US aggregator | Custom | Custom | US | Medium | Newer Plaid alternative |
| Akoya | Bank-led data network | Custom | Custom | US | Low | Banks negotiating direct connections |

The first decision is **what you actually need**:

- **Bank account verification + ACH** (most common for B2B SaaS): Plaid or Stripe Financial Connections
- **Transaction data for analytics / fintech app**: Plaid (US), TrueLayer (EU)
- **Income / employment verification** (lending): Plaid, Finicity, Yodlee
- **Recurring bank debit globally**: GoCardless
- **EU / UK open banking**: TrueLayer or Tink
- **LATAM**: Belvo
- **Global multi-region**: Plaid (expanding) or Salt Edge

## Decide What You Need First

### B2B SaaS adding ACH for billing (the 30% case)

You bill enterprise customers who prefer ACH over credit card. Need: customer connects bank; you verify; charge ACH.

**Pick: Stripe Financial Connections** ($1.50/link, US-only) if you're on Stripe; **Plaid** if you need broader features or integrations beyond Stripe.

### Fintech building a consumer app (the 25% case)

You're building Mint / Copilot / YNAB style — pull transactions, categorize, show insights.

**Pick: Plaid** (US) or **TrueLayer** (EU/UK). Volume pricing matters at scale; negotiate.

### Lending / underwriting (the 15% case)

You're making credit decisions; need bank statements + income verification.

**Pick: Plaid + Finicity** combination is common. Plaid for core data; Finicity (Mastercard) for verification reports often required by Fannie/Freddie.

### Accounting integration / B2B fintech (the 10% case)

You access customer's QuickBooks / Xero / NetSuite to sync transactions.

**Pick: Codat** (built for accounting/commerce APIs) or **Rutter** (similar). Different category from bank aggregation.

### Recurring international payments (the 10% case)

You bill customers via bank debit (BACS, SEPA, ACH-equivalent) globally, not credit cards.

**Pick: GoCardless.** Specializes in cross-region bank debits.

### EU / UK only (the 10% case)

You're UK or EU-focused. PSD2 open banking regulation drives this market.

**Pick: TrueLayer or Tink.** TrueLayer for newer fintech; Tink for bank-affiliated.

## Provider Deep-Dives

### Plaid

The dominant US financial data aggregator. Founded 2013. Failed Visa acquisition (2020) led to independence. ~$13B valuation as of 2021.

Strengths:

- **Largest US bank coverage** — 12K+ institutions including all major banks
- Multiple products (Auth, Identity, Transactions, Income, Assets, Investments, Liabilities)
- Strong developer experience (best docs in the category)
- Plaid Link UI (white-label-able) is the de facto standard for "connect bank" flows
- Sandbox environment for testing (predictable test credentials)
- Support for both screen-scraping (legacy) and direct API (modern, post-PSD2 / Open Banking US discussions)
- Strong webhooks for transaction updates
- Identity verification (income, employment) products
- Expanding to EU/UK (acquired Cognito 2024 for KYC)

Weaknesses:

- **Pricing has gotten expensive** — startup-friendly until you scale; renegotiation needed past $1M+ link volume
- Some bank connections occasionally break (regulatory + technical)
- US-first; EU/UK still catching up
- Connecting to certain regional banks/credit unions can be flaky

Use Plaid when:

- US fintech / SaaS
- Need broad bank coverage
- Modern developer experience matters

### Stripe Financial Connections

Stripe's native bank-linking product. Launched 2022 as part of Stripe's payments expansion.

Strengths:

- **Tight Stripe integration** — uses Stripe Customer + Payment Intent objects natively
- Lower friction than third-party Plaid for Stripe customers
- $1.50 per successful bank link — predictable
- ACH + Verified Customer Bank Accounts integrated
- Good for verifying ownership of accounts

Weaknesses:

- **US-only currently** (expanding)
- Smaller bank network than Plaid (~5K vs 12K)
- Limited beyond verification + ACH (no transactions, income, etc. as standalone)
- Locked to Stripe ecosystem

Use Stripe Financial Connections when:

- Already on Stripe
- Need ACH + bank verification specifically
- Don't need transaction data / financial analytics

### Finicity (Mastercard)

Acquired by Mastercard 2020. Specialized in verification + lending data.

Strengths:

- **Strong for mortgage / lending** — Verification of Assets (VOA), Verification of Income / Employment (VOIE) reports recognized by Fannie Mae / Freddie Mac
- Mastercard ownership = enterprise credibility
- Financial wellness data products

Weaknesses:

- Less developer-friendly than Plaid
- Sales-led
- Smaller indie ecosystem

Use Finicity when:

- Mortgage / lending products need GSE-recognized verification
- Mastercard relationship matters

### Yodlee

The OG aggregator. Founded 1999. Owned by Envestnet. Mainly enterprise + financial-institution-facing.

Strengths:

- **Long-standing brand**; banks trust it
- Enterprise-grade scale + compliance
- Global coverage broader than Plaid in some regions

Weaknesses:

- **Outdated developer experience**
- Sales-led only (no self-serve)
- Slower innovation pace
- Plaid has eaten Yodlee's mindshare for new fintech

Use Yodlee when:

- Enterprise / regulated financial institution
- Pre-existing Yodlee relationship

### MX

US-focused; founded 2010 (Utah). Strong with banks + credit unions.

Strengths:

- **Banks + credit unions trust them**
- Strong financial-wellness data products
- Mid-market fintech accessible

Weaknesses:

- Smaller indie / startup adoption
- Less ubiquitous than Plaid

Use MX when:

- Targeting credit unions or community banks
- Financial wellness use case

### TrueLayer

UK/EU open banking leader. Founded 2016 (London). PSD2-compliant Account Information Service Provider (AISP).

Strengths:

- **Best EU/UK coverage** — most major UK banks; expanding EU
- Native PSD2 / Open Banking compliance
- Strong developer experience; matches Plaid's quality
- Bank-debit (Variable Recurring Payments / VRP) emerging

Weaknesses:

- US footprint limited
- EU regulatory complexity (each country has variations)

Use TrueLayer when:

- UK / EU primary market
- Modern fintech building on PSD2

### Tink (Visa)

Visa-acquired (2022). EU open banking; bank-affiliated focus.

Strengths:

- Visa ownership = enterprise credibility
- Strong EU bank coverage
- Compliance + regulatory expertise

Weaknesses:

- Less indie-friendly
- Slower than TrueLayer for new fintech

Use Tink when:

- Bank-affiliated fintech in EU
- Visa relationship matters

### GoCardless

Bank-debit specialist. Founded 2011 (London). Specializes in pull-payments (customer authorizes; you debit on schedule).

Strengths:

- **Best for global recurring bank debit** — BACS (UK), SEPA (EU), ACH (US), BECS (AU), and more
- Predictable 1% (capped) pricing
- Excellent for B2B SaaS billing without credit card fees
- Strong UX for mandate signup

Weaknesses:

- Bank debit only; not a general aggregator
- Different from Plaid (different problem)

Use GoCardless when:

- B2B SaaS billing internationally
- Cost savings vs credit cards (1% vs 2.9%)
- Subscription / recurring is the primary use case

### Codat

Specialized in accounting + commerce data. Founded 2017 (London).

Strengths:

- **Connects to QuickBooks / Xero / NetSuite / Sage / Square / Shopify / etc.**
- Different category from bank aggregation: accesses business records, not personal banking
- Used by B2B fintech (lending, factoring, payroll syncing, expense reconciliation)

Weaknesses:

- Not a bank aggregator
- Specialized in B2B accounting use cases

Use Codat when:

- B2B fintech needs business accounting data
- Lending against books, not bank accounts

### Belvo

LATAM open banking. Founded 2019.

Strengths:

- **Strongest LATAM coverage** (Brazil, Mexico, Colombia)
- Local regulatory expertise (Brazil's Open Finance especially)

Use Belvo when:

- LATAM fintech / cross-border to LATAM

### Salt Edge

Global aggregator with emerging-market focus.

Strengths:

- Coverage in markets Plaid doesn't reach (Eastern Europe, Asia)
- Multi-region single-API approach

Use Salt Edge when:

- Multi-region beyond Plaid + TrueLayer
- Emerging-market focus

### Akoya

Bank-led data network. Founded 2018 (Fidelity-backed). Focuses on direct API connections (vs screen-scraping).

Strengths:

- Direct API connections to participating banks (more reliable than screen-scraping)
- Bank-friendly model
- Strong on permission management

Weaknesses:

- Smaller network than Plaid
- Bank participation still growing

Use Akoya when:

- Direct API connections matter
- Banks in your stack are Akoya-participating

## What These APIs Won't Do

**Don't expect 100% bank coverage.** Even Plaid misses some smaller credit unions + regional banks. Have fallbacks (manual account entry; alternative aggregators).

**Don't expect connections to be permanent.** Banks update auth flows; connections break monthly. Build retry + re-auth UX.

**Don't expect free for production.** Most aggregators have generous dev sandboxes; production usage costs ramp quickly. Negotiate volume pricing past $10K-50K monthly link volume.

**Don't expect open banking to solve everything in EU.** PSD2 mandated bank APIs; reality is uneven implementation. Some banks still flaky.

**Don't expect aggregators to handle reconciliation.** They give you raw data; you need to categorize + match against your transactions.

**Don't expect cross-region single-vendor.** Plaid doesn't fully cover EU; TrueLayer doesn't cover US; Belvo doesn't cover EU. Multi-vendor is the default for global products.

**Don't expect Stripe Financial Connections to replace Plaid for fintech apps.** It's optimized for ACH + verification, not transaction-heavy use cases.

## Pragmatic Stack Patterns

### B2B SaaS adding ACH

- **Stripe Financial Connections** if on Stripe ($1.50/link)
- OR **Plaid** if not on Stripe
- Total: $1-2/successful link

### US Consumer Fintech (Mint / Copilot style)

- **Plaid** for transactions + balances
- Cost scales with users; negotiate enterprise contract past 10K active users
- Total: $0.30-$2/user/month at scale

### Lending / Underwriting

- **Plaid** for primary data
- **Finicity** for GSE-recognized verification reports
- Total: $5-50/application depending on data depth

### Accounting Integration B2B

- **Codat** or **Rutter** for QuickBooks / Xero / NetSuite
- Cost varies; sales-led
- Total: $50-500/connected business

### Global Recurring Billing

- **GoCardless** for bank debit
- 1% per transaction (capped); savings vs credit cards meaningful at >$50/transaction
- Total: 1% revenue

### EU / UK Fintech

- **TrueLayer** for transactions + account info
- **GoCardless** for bank debit if applicable
- Total: usage-based

### Multi-Region Coverage

- **Plaid** (US) + **TrueLayer** (EU/UK) + **Belvo** (LATAM) often combined
- Significant integration work to abstract differences
- Total: per-region pricing combined

## Decision Framework: Five Questions

1. **What's the primary use case?**
   - ACH + verification: Stripe Financial Connections / Plaid
   - Transaction data: Plaid / TrueLayer / MX
   - Lending verification: Plaid + Finicity
   - Accounting integration: Codat / Rutter
   - Bank debit recurring: GoCardless

2. **What's your geography?**
   - US: Plaid / Stripe Financial Connections
   - UK / EU: TrueLayer / Tink
   - LATAM: Belvo
   - Global: Plaid + regional alternatives combined

3. **Are you on Stripe?**
   - Yes + need ACH-only: Stripe Financial Connections (cheapest path)
   - Yes + need more: Plaid (broader features)
   - No: Plaid

4. **What's your scale?**
   - <1K connections/mo: any tier; sandbox-ish pricing
   - 1K-100K: standard pricing; some optimization
   - 100K+: negotiate enterprise contract aggressively

5. **Lending / regulated use?**
   - Mortgage / GSE-recognized: Finicity required
   - Other lending: Plaid + supplementary
   - Non-regulated fintech: Plaid alone

## Verdict

**Default for US fintech**: Plaid. Most coverage; best DX; most ecosystem.

**Default for B2B SaaS adding ACH**: Stripe Financial Connections (if on Stripe) or Plaid (if not).

**Default for UK/EU fintech**: TrueLayer.

**Default for global recurring B2B billing**: GoCardless.

**Default for B2B accounting integration**: Codat.

**Default for LATAM**: Belvo.

**Default for mortgage/lending**: Plaid + Finicity combination.

The most common mistakes:

1. **Underestimating per-link cost.** $1.50/link sounds cheap; 100K links/year = $150K. Negotiate before scale.
2. **Not building re-auth UX.** Bank connections break; users abandon. Make re-auth one-click + non-intrusive.
3. **Choosing aggregator without testing connection quality on YOUR target banks.** Plaid covers 12K banks but not all are equally reliable. Test top user banks in sandbox + production.
4. **Ignoring privacy / consent.** Open banking requires explicit user consent + clear permission UX. PSD2 + GDPR + CCPA all impose requirements.

## See Also

- [Stripe](./stripe.md)
- [Stripe Customer Portal](./stripe-customer-portal.md)
- [Payment Providers](./payment-providers.md)
- [Subscription Billing Providers](./subscription-billing-providers.md)
- [Subscription Analytics Platforms](./subscription-analytics-platforms.md)
- [Tax Compliance Tools](./tax-compliance-tools.md)
- [Identity Verification & KYC Tools](./identity-verification-kyc-tools.md)
- [Fraud Detection Providers](./fraud-detection-providers.md)
- [Accounting & Bookkeeping Software](./accounting-bookkeeping-software.md)
- [HR & Payroll Tools](./hr-payroll-tools.md)
- [eSignature & Document Signing Tools](./esignature-document-signing-tools.md)
- [CPQ & Quote-to-Cash Tools](./cpq-quote-to-cash-tools.md)
- [Contract Lifecycle Management Platforms](./contract-lifecycle-management-clm-platforms.md)
- [Startup Banking & Corporate Spend Platforms](./startup-banking-corporate-spend-platforms.md)
- [Cap Table & Equity Management Tools](./cap-table-equity-management-tools.md)
- [Compliance Automation Tools](../devops-and-tools/compliance-automation-tools.md)
- [Unified API Integration Providers](../backend-and-data/unified-api-integration-providers.md) — Merge / Finch / Codat / Rutter
- [Inventory & Order Management Systems](../backend-and-data/inventory-order-management-systems.md)
- [Stripe Usage-Based Billing](./stripe-usage-based-billing.md)
- [Polar](./polar.md)
- [Better Auth](./better-auth.md)
- [Auth Providers](./auth-providers.md)
