# Subscription Analytics Platforms: ChartMogul, Baremetrics, Paddle Retain, Maxio, Stripe Sigma, Equals

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're running a SaaS in 2026 and trying to figure out your real ARR, MRR movement, churn cohorts, NRR, and LTV, this is the consolidated comparison. Subscription analytics is the line item founders skip until a board meeting where someone asks "what's your gross dollar churn by cohort?" and the spreadsheet answer doesn't match the Stripe dashboard. Most indie SaaS try to derive metrics from raw Stripe data ("we'll just write SQL") and discover three months later that revenue recognition, ARR rollup logic, and churn classification are surprisingly hard. Pick the right shape and your metrics are trustworthy from day one; pick wrong and every board deck starts with "the numbers don't match because…"

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Paddle Retain (formerly ProfitWell Metrics) | Free SaaS metrics | Free forever | Free | Very high | Indie SaaS wanting free Stripe metrics |
| Baremetrics | Stripe-native metrics dashboard | 14-day trial | $129/mo | High | Indie / SMB SaaS on Stripe |
| ChartMogul | Multi-source SaaS metrics | Free up to $10K MRR | $129/mo+ | High | SMB to mid-market SaaS |
| Maxio (Chargify + SaaSOptics merged) | Billing + analytics combined | Demo | $5K-50K+/yr | Medium | Mid-market SaaS needing revenue + billing |
| Stripe Sigma | Raw SQL on Stripe data | Pay per query | ~$0.05/query | Medium | Devs comfortable with SQL |
| Equals | Spreadsheet-style analytics | Free trial | $99/mo | High | Finance teams who live in spreadsheets |
| Mosaic | Strategic finance / FP&A | Demo | $20K-100K+/yr | Low | Series A+ with dedicated finance |
| SaaSGrid | Modern entrant | Free trial | $200/mo+ | High | Newer SaaS metrics platform |
| Subscript | Modern entrant (B2B-focused) | Demo | Custom | Medium | B2B SaaS with custom contracts |
| DIY: dbt + Looker / Metabase | Build your own | Self-hosted free | $0-2K/mo | Medium | Data teams already on a warehouse |
| DIY: Stripe + Google Sheets | Manual | Free | Time cost only | Medium | Pre-revenue / tiny scale |

The first decision is **how much of your subscription complexity these tools need to handle**. Pure self-serve Stripe ($X/seat/mo, monthly + annual) is straightforward — most platforms handle this fine. Mixed pricing (per-seat + usage-based + custom enterprise contracts + non-Stripe revenue from Apple/Google/wire transfers) is genuinely hard, and only some tools handle it well.

## Decide What You Need First

Subscription analytics tools are not interchangeable. The same SaaS at $50K MRR vs $500K MRR vs $5M MRR has very different correct answers.

### Stripe-only self-serve SaaS (the 60% case for indie SaaS)
You're on Stripe; pricing is simple ($X/seat/mo or $Y/mo flat); you want MRR, churn, LTV, ARPU, cohort retention out of the box. You don't have non-Stripe revenue. Use **Paddle Retain (free)** as default; upgrade to **Baremetrics** ($129/mo) when you want better cohort views or richer dashboards.

### Multi-source revenue SaaS (the 25% case)
You have Stripe + manual invoices + maybe Apple/Google App Store + wire transfers. You need a single ARR view that combines all of them. **ChartMogul** is the dominant pick because it pulls from multiple sources (Stripe + Recurly + Chargebee + manual CSV imports) and reconciles into one coherent ARR/MRR view.

### B2B SaaS with custom contracts (the 10% case)
You sell annual contracts negotiated by sales; pricing varies; some customers have "off-platform" terms (multi-year, custom discounts, implementation fees). **Maxio** or **Subscript** handle this — built for ARR rollup with custom contract terms, not derived from per-seat self-serve assumptions.

### Series A+ with dedicated finance team (the 5% case)
You have a finance hire; you want full FP&A capability — budgets, forecasts, scenarios, board-ready reporting. **Mosaic** is the FP&A platform; ChartMogul/Maxio are subscription metrics. They serve different roles and you may need both at scale.

## Provider Deep-Dives

### Paddle Retain (formerly ProfitWell Metrics)

ProfitWell's free metrics tool, acquired by Paddle in 2022, rebranded to **Paddle Retain**. Free forever for SaaS metrics; commercial product is the retention/dunning add-ons. Paddle (the MoR) is separate from Retain (the metrics tool).

Strengths:

- **Free forever for SaaS metrics** — MRR, churn, ARPU, LTV, cohorts, retention curves
- Connects to Stripe, Chargebee, Recurly, Braintree, Zuora
- Best free option in the category by a wide margin
- Good cohort analysis and revenue waterfall views
- Reliable; been around since 2014; trusted by thousands of SaaS

Weaknesses:

- Free tier is the lead magnet for Paddle's other products (Retain dunning, MoR billing) — sales follow-ups happen
- Less depth than ChartMogul on multi-source consolidation
- Custom contracts / non-Stripe revenue support weaker
- Reporting customization limited compared to paid tools

Use Paddle Retain when:

- You're indie / bootstrap and don't want to pay for metrics
- You're on Stripe and want quick out-of-the-box dashboards
- You can tolerate occasional "want to migrate to Paddle MoR?" outreach

Avoid when:

- You need deep multi-source ARR consolidation
- You have custom contract revenue Paddle Retain can't model

### Baremetrics

Stripe-native metrics dashboard. One of the originals (founded 2013). Premium polished tool.

Strengths:

- Clean, beautiful Stripe-native dashboards out of the box
- Cancellation insights (why customers churn — survey + automation)
- Forecasting, segmentation, augmentation tools
- Recover (failed-payment dunning) is solid
- Trial Insights, Forecast, and Augmented dashboards
- API + integrations to Slack, Hubspot, Intercom

Weaknesses:

- Pricing scales with MRR — gets expensive past $1M ARR
- Less strong than ChartMogul for non-Stripe sources
- Smaller team; less product velocity than ChartMogul

Use Baremetrics when:

- You're Stripe-only and want a polished dashboard from day one
- You value design / UX (Baremetrics is the prettiest)
- You want bundled cancellation insights without separate tooling

Avoid when:

- You're cost-conscious and Paddle Retain free works
- You have substantial non-Stripe revenue

### ChartMogul

Multi-source SaaS metrics platform. Founded 2014. Now mid-market default for SaaS with mixed billing sources.

Strengths:

- **Multi-source consolidation is best in class** — Stripe + Recurly + Chargebee + Zuora + Braintree + manual CSV
- Custom subscription import API for non-standard sources
- Customer-level views; segmentation by plan, country, MRR tier, custom attributes
- Cohort analysis, retention curves, NRR, GRR
- Free up to $10K MRR — excellent for early-stage
- API access for syncing metrics to data warehouse / dashboards
- HubSpot / Salesforce CRM enrichment integrations

Weaknesses:

- More complex than Baremetrics — takes time to set up properly
- Pricing climbs past $50K MRR; can hit $1K-$2K/mo at scale
- Custom contract handling weaker than Maxio for B2B-heavy SaaS

Use ChartMogul when:

- You have 2+ revenue sources and need unified ARR
- You're at $10K-500K MRR and want a tool that scales with you
- You want CRM enrichment to attach financial data to accounts

Avoid when:

- You're Stripe-only and want simpler (Baremetrics or Paddle Retain)
- You have $5M+ ARR with complex enterprise contracts (Maxio better)

### Maxio (Chargify + SaaSOptics merged)

In 2022, Chargify (subscription billing) and SaaSOptics (subscription analytics) merged into **Maxio**. The result is billing + analytics + revenue recognition in one platform — explicitly built for B2B SaaS with custom contracts.

Strengths:

- **Custom contract revenue handling is best in class** — multi-year deals, ramp pricing, off-cycle invoicing, line-item discounts
- Revenue recognition built in (ASC 606 / IFRS 15) — important for audit-track SaaS
- Combined billing + analytics — single source of truth
- ARR rollup logic handles the messy stuff (mid-term upgrades, downgrades, suspensions)
- Strong for $5M+ ARR B2B SaaS

Weaknesses:

- Enterprise-tier pricing — $5K-50K+/yr
- Setup is heavy — implementation projects measured in weeks
- Overkill for indie / SMB self-serve SaaS

Use Maxio when:

- You're B2B SaaS with custom annual contracts and complex terms
- You need ASC 606 revenue recognition for audit
- You want billing + analytics consolidated (avoiding Stripe + ChartMogul)

Avoid when:

- You're indie self-serve on Stripe — total overkill
- You don't need revenue recognition complexity

### Stripe Sigma

Stripe's SQL-on-your-Stripe-data product. Pay per query (~$0.05/query). Not a metrics platform — a SQL interface.

Strengths:

- Direct SQL access to your Stripe data (subscriptions, charges, invoices, customers)
- No data sync delay — runs against Stripe's data in near-real-time
- Cheap if usage is light
- Build whatever custom metrics you want
- Combines well with dbt / metabase if you ETL Stripe data into a warehouse

Weaknesses:

- **You build everything yourself** — no out-of-the-box dashboards
- Pure SQL — non-technical teams can't use directly
- Per-query pricing scales unpredictably with usage
- No retention / cohort views built in — you write them

Use Stripe Sigma when:

- You have data engineering capacity
- You want full custom metrics without ETL pipeline overhead
- Volume is light (few hundred queries / mo)

Avoid when:

- Non-technical team needs to read metrics
- You want anything pre-built (use a metrics platform for that)

### Equals

Spreadsheet-style SaaS analytics. Founded by ex-Intercom team. Hybrid: a spreadsheet that connects to live data sources.

Strengths:

- **Familiar spreadsheet UX** for finance teams who live in Excel/Sheets
- Connects to Stripe, HubSpot, Snowflake, Postgres, etc.
- Pre-built SaaS metrics templates (MRR, churn, LTV)
- Schedule reports to email / Slack
- Way more flexible than fixed-dashboard tools

Weaknesses:

- Smaller player — less ecosystem than ChartMogul
- Spreadsheet model can hide errors at scale
- Pricing $99-499/mo

Use Equals when:

- Your finance lead lives in spreadsheets and resists dashboard tools
- You want flexible custom metrics without writing SQL
- You're doing FP&A modeling alongside metrics

Avoid when:

- You want pure dashboards (use Baremetrics / ChartMogul)
- You have a data team that prefers SQL + BI

### Mosaic

Strategic finance / FP&A platform. Series A+ tool. Targets $5M-100M ARR.

Strengths:

- Full FP&A: budgets, forecasts, scenarios, board-ready outputs
- Connects to ERP, CRM, billing, HRIS — single source of truth
- Built for finance teams (CFO + 1-3 analysts)
- Scenario planning and what-if modeling
- Supports custom KPIs and metric definitions

Weaknesses:

- Enterprise pricing — $20K-100K+/yr
- Implementation time: weeks to months
- Overkill for early-stage SaaS

Use Mosaic when:

- You have a finance hire; you're past Series A
- You need full FP&A, not just SaaS metrics
- You're presenting to a board / investors quarterly

Avoid when:

- You don't have finance ops capacity
- ChartMogul + spreadsheet works fine

### SaaSGrid

Modern entrant. Founded 2022. Targets the gap between Baremetrics (single-source) and Maxio (heavy implementation).

Strengths:

- Modern UX; faster to set up than Maxio
- Multi-source revenue consolidation
- B2B SaaS focus (handles annual contracts well)
- More accessible pricing than Maxio ($200-2K/mo range)

Weaknesses:

- Newer; smaller customer base than ChartMogul
- Less mature than the established players

Use SaaSGrid when:

- You want B2B-aware metrics without Maxio's enterprise overhead
- Modern UX matters; you're early enough to bet on a newer player

### Subscript

Modern B2B SaaS metrics. Founded 2021. Targets B2B with custom contracts.

Strengths:

- Custom contract terms handled natively
- ARR waterfall + cohort views
- Revenue recognition (ASC 606)
- Modern UX

Weaknesses:

- Custom pricing only
- Smaller; less mature than Maxio

### DIY: dbt + Looker / Metabase / your warehouse

If you have a data team and warehouse (Snowflake / BigQuery / Postgres), you can build SaaS metrics in dbt with off-the-shelf packages and visualize in Looker / Metabase / Hex / Mode.

Strengths:

- Full control + customization
- One source of truth across product, finance, marketing
- Integrates with everything else in your stack
- No per-MRR pricing — flat warehouse + tooling cost

Weaknesses:

- Requires data engineer + analyst time (1-3 person-months to set up well)
- Definitions drift unless governance is strong
- Reinventing the wheel for what ChartMogul does out of box

Use DIY when:

- You have a data team and warehouse
- You're integrating subscription metrics into broader business reporting
- You're at scale where a $1K/mo SaaS analytics tool is a fraction of warehouse cost anyway

Avoid when:

- You don't have data engineering capacity
- "Just give me MRR and churn" is what you actually need

## What These Tools Won't Do

**Don't expect any of these to be your single source of truth without setup work.** Even Paddle Retain free needs you to validate that "MRR" matches your interpretation (one-time fees? trials? non-Stripe revenue?). Spend a day reconciling against a manual count.

**Don't expect them to handle weird revenue without configuration.** Implementation fees, multi-year discounts, off-cycle invoices, hardware components, services revenue — most platforms have ways to model these but they're rarely default.

**Don't expect AI/LLM-anything to replace these.** Subscription metrics is a deterministic accounting problem. AI doesn't help you compute MRR; it helps with explanations and anomaly detection on top of correctly computed metrics.

**Don't expect product analytics to substitute.** Mixpanel/Amplitude tell you what users do. ChartMogul tells you what they pay. Different problems; both needed.

**Don't expect zero data hygiene work.** The platforms surface what's in Stripe; if Stripe metadata is messy (no plan grouping, no customer attributes), the dashboards will reflect that.

## Pragmatic Stack Patterns

### Indie / Bootstrap (under $50K MRR)

- **Paddle Retain** (free) for MRR / churn / cohorts
- **Stripe dashboard** for raw transaction-level views
- **Google Sheets** for board updates + custom analysis
- Total cost: $0/mo

### Early Growth ($50K-500K MRR)

- **Baremetrics** ($129-499/mo) or **ChartMogul** ($129-500/mo)
- Pick **Baremetrics** if Stripe-only; **ChartMogul** if multi-source
- **Stripe Sigma** ($20-50/mo of queries) for ad-hoc SQL
- Total: $200-700/mo

### Mid-Market ($500K-5M ARR, B2B)

- **ChartMogul** ($500-2K/mo) for SaaS metrics
- **Maxio** or **Subscript** if custom contracts dominate
- **Equals** ($300-500/mo) for finance modeling on top
- Total: $1K-3K/mo

### Mature SaaS ($5M+ ARR)

- **Maxio** ($2K-5K/mo) or **dbt + warehouse + Looker** for metrics
- **Mosaic** ($2K-8K/mo) for FP&A
- Stripe Sigma + warehouse ETL for everything custom
- Total: $5K-15K/mo

### Multi-Channel / App Store SaaS

- **ChartMogul** (handles non-Stripe via CSV import or API)
- Manual reconciliation for App Store / Play Store
- Spreadsheet for hybrid contracts

## Decision Framework: Five Questions

1. **What's your MRR scale?**
   - Under $50K: Paddle Retain free
   - $50K-500K: Baremetrics or ChartMogul
   - $500K-5M: ChartMogul or Maxio (B2B)
   - $5M+: Maxio or DIY warehouse

2. **How many revenue sources?**
   - One (Stripe-only): Baremetrics
   - Two-three (Stripe + something): ChartMogul
   - Many + custom contracts: Maxio or Subscript

3. **Do you need revenue recognition (ASC 606)?**
   - No: any platform
   - Yes: Maxio, Subscript, or DIY warehouse

4. **What's your finance org maturity?**
   - No finance hire: Paddle Retain or Baremetrics
   - Finance hire: ChartMogul + spreadsheets
   - Finance team: Mosaic + Maxio + warehouse

5. **Is data engineering an option?**
   - Yes, with capacity: DIY with dbt + warehouse
   - No: SaaS metrics platform

## Verdict

**Indie / Bootstrap default**: Paddle Retain free. The price is right and the product is good. Don't pay for metrics until you outgrow it.

**SMB / Early Growth default**: Baremetrics if Stripe-only; ChartMogul if multi-source. Both have free trials — try both.

**B2B SaaS with custom contracts**: Maxio. The combined billing + analytics + revenue recognition is the right shape for that use case.

**Series A+ with finance team**: ChartMogul + Mosaic. Different tools for different jobs. You'll outgrow either alone.

**Data-team-heavy companies**: dbt + warehouse + Looker. You'll do it eventually anyway; bypass the SaaS analytics layer if you have capacity.

The single most common mistake is **trying to derive metrics from raw Stripe SQL forever**. It works at $10K MRR; it doesn't at $1M ARR. The second most common mistake is **paying for ChartMogul or Baremetrics before you need them** — Paddle Retain free is genuinely sufficient for the first 12-18 months for most indie SaaS. The third is **expecting these tools to fix data hygiene** — they reflect what's in Stripe; clean Stripe metadata before blaming the dashboard.

## See Also

- [Subscription Billing Providers](./subscription-billing-providers.md) — Stripe Billing, Chargebee, Recurly comparison
- [Stripe Usage-Based Billing](./stripe-usage-based-billing.md) — usage metering for AI / API SaaS
- [Stripe](./stripe.md) — Stripe overview
- [CPQ Quote-to-Cash Tools](./cpq-quote-to-cash-tools.md) — for B2B custom contracts
- [Tax Compliance Tools](./tax-compliance-tools.md) — Stripe Tax, Avalara, Anrok
- [Accounting & Bookkeeping Software](./accounting-bookkeeping-software.md) — QuickBooks, Xero
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — Mixpanel, Amplitude, PostHog
- [BI / Analytics Tools](../devops-and-tools/bi-analytics-tools.md) — Looker, Metabase, Hex
- [Embedded Analytics Platforms](../devops-and-tools/embedded-analytics-platforms.md)
- [Customer Data Platforms](../marketing-and-seo/customer-data-platforms.md) — Segment, RudderStack
