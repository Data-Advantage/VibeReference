# BI & Analytics Tools: Metabase, Hex, Mode, Looker, Sigma, Preset, Lightdash, Tableau, Power BI, Evidence

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a SaaS in 2026 and trying to pick a BI / analytics tool, this is the consolidated comparison. BI is the line item that looks like "we'll just use spreadsheets" until you have 12 stakeholders asking the same questions in different formats, finance needs revenue dashboards, customer success needs churn dashboards, and the founder spends 4 hours a week running ad-hoc SQL. Most indie SaaS over-rely on spreadsheets too long, then jump to Looker or Tableau (overkill, expensive) when Metabase or Hex would have served them years longer. Pick the right shape and "what's our MRR by tier?" takes 10 seconds; pick wrong and every business question is a one-off SQL exercise.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Metabase | Self-host friendly OSS | Free OSS / Cloud free trial | $85/mo (Cloud Starter) | Yes (AGPL) | Very high | Indie SaaS default in 2026 |
| Hex | Modern collaborative notebook + dashboards | Free (3 users) | $24/user/mo | No | High | Data teams that want notebooks + dashboards |
| Mode | SQL + Python notebook BI | 14-day trial | $300/mo | No | Medium | Mid-market data teams |
| Sigma | Spreadsheet-style on warehouse | 14-day trial | Custom | No | Medium | Finance-heavy / spreadsheet-comfortable users |
| Preset (Apache Superset hosted) | OSS-hosted Superset | Free trial | $20/user/mo | Yes (OSS Superset) | High | Teams wanting Superset without ops |
| Lightdash | OSS dbt-native BI | Free OSS | $440/mo (Cloud) | Yes (MIT) | High | dbt-using teams |
| Looker (Google) | Enterprise BI + LookML | None | Custom (typically $50K+/yr) | No | Very low | Enterprise / Google Cloud shops |
| Tableau | Enterprise BI | 14-day trial | $75/user/mo (Creator) | No | Low | Enterprises with existing Tableau investment |
| Power BI | Microsoft enterprise BI | Free Desktop | $14/user/mo | No | Medium | Microsoft / Office 365 shops |
| Evidence | Code-first reports | Free OSS | $2K/mo Cloud | Yes (MIT) | High | Code-first teams; static reports |
| PostHog (web/product analytics) | Bundled with PostHog | Free | Bundled | Yes (AGPL) | Very high | Already on PostHog; product-data focus |

The first decision is **what shape of BI you actually need**. Self-serve dashboards for the team, ad-hoc analysis for data-curious folks, customer-facing embedded dashboards (white-labeled), and finance/ops reporting are four different problems with overlapping tools. Most indie SaaS need the first two; some need the third; the fourth comes later.

## Decide What You Need First

BI tools are not interchangeable. Get the shape wrong and you'll either pay for capabilities you ignore or hit a wall when "we need to share this with the customer" comes up.

### Internal team dashboards (the 70% case for indie SaaS)
You want: a few dashboards (revenue, growth, churn, support) updated daily, accessible to the team, no SQL skills required to view.

Right tools:
- **Metabase** — modern OSS default
- **Preset** — Superset hosted
- **Hex** — if you want notebooks too

### Ad-hoc analysis / data exploration
You want: a SQL editor, charting, can pull from anywhere, save queries, share results.

Right tools:
- **Hex** — best collaborative notebook
- **Mode** — SQL + Python notebooks
- **Metabase** with SQL editor

### Customer-facing embedded dashboards
You want: dashboards inside your product that customers see; white-labeled; per-tenant data isolation.

Right tools:
- **Metabase** with embedding ($240+/mo Pro)
- **Sigma** with embedding
- **Custom** built on a charting library (Recharts, ECharts, Tremor)

### Finance / ops reporting
You want: spreadsheet-like exploration of warehouse data; finance team can self-serve.

Right tools:
- **Sigma** — spreadsheet on warehouse
- **Hex** — collaborative notebooks
- **Looker** — enterprise default

For most indie SaaS in 2026: **Metabase if you want one tool for dashboards + ad-hoc; Hex if you have a data person who wants notebooks; PostHog if your data is already there**. Skip Looker / Tableau until you have a data team and budget.

## Provider Deep-Dives

### Metabase — The OSS Default
Metabase has been the OSS BI default since 2015. AGPL; self-hostable; Cloud option; modern UX with both visual and SQL query builders. Most indie SaaS should start here.

Strengths:
- AGPL OSS; self-hostable
- Cloud option starts at $85/mo (Starter, 5 users)
- Visual query builder (no SQL required for many use cases)
- SQL editor for power users
- Dashboards, alerts, scheduled reports
- Native integrations to most databases
- Embedded analytics (premium tier)
- Active community, frequent releases

Weaknesses:
- Self-host requires infra (Postgres + worker)
- Embedding requires paid tier ($240+/mo)
- Less powerful than Looker for complex semantic models
- AGPL license has implications for some legal teams

Pick when: you want OSS BI with the option to self-host. Most indie SaaS in 2026 should default here.

### Hex — Modern Collaborative Notebook + Dashboards
Hex launched in 2020. Notebooks (SQL + Python) + dashboards in one tool. Strong for data-savvy teams.

Strengths:
- Best-in-class collaborative notebooks
- SQL + Python in one tool
- Multi-user real-time editing
- Strong dashboard layer
- Free tier (3 users)
- $24/user/mo Pro
- Modern UX

Weaknesses:
- Not OSS
- Less suitable for non-data-savvy users (notebook complexity)
- Pricing per-user adds up

Pick when: you have a data analyst / data engineer who wants notebooks alongside dashboards.

### Mode — SQL + Python Notebooks
Mode is the longstanding SQL + Python notebook BI. Acquired by ThoughtSpot in 2023; product continues.

Strengths:
- Mature SQL + Python workflow
- Strong notebook collaboration
- Helix in-memory engine for fast queries
- Python-heavy analyses

Weaknesses:
- $300/mo Starter is mid-market
- Less polished than Hex (newer competitor)
- Acquisition raises roadmap questions

Pick when: you have an existing Mode investment or specifically need Helix in-memory.

### Sigma — Spreadsheet-Style on Warehouse
Sigma offers a spreadsheet-like UI on top of your warehouse. Finance teams love it.

Strengths:
- Spreadsheet-like UX (Excel users productive immediately)
- Direct on warehouse (no ETL)
- Embedded analytics support
- Strong for finance / ops use cases

Weaknesses:
- Custom pricing (sales-led)
- Less developer-friendly than Hex
- Smaller community than Metabase / Looker

Pick when: finance team is the primary audience and they live in spreadsheets.

### Preset — OSS Apache Superset Hosted
Preset is the company behind Apache Superset. Offers hosted Superset and OSS support.

Strengths:
- Apache Superset is mature OSS
- Hosted option ($20/user/mo) eliminates ops
- Strong dashboards + SQL Lab
- Custom visualization plugins

Weaknesses:
- Superset UX feels older than Metabase
- Less polish than Hex / Sigma
- Smaller community than Metabase for indie scale

Pick when: you specifically want Superset and don''t want to self-host.

### Lightdash — OSS dbt-Native BI
Lightdash is an OSS BI built around dbt. If you use dbt for data modeling, Lightdash speaks the same language.

Strengths:
- Native dbt integration (semantic layer)
- MIT OSS
- Self-hostable
- Cloud option ($440/mo)
- Modern UX

Weaknesses:
- Best fit only if you use dbt
- Smaller community than Metabase
- Hosted pricing higher than Metabase

Pick when: you''re a dbt shop and want a BI layer that integrates natively.

### Looker (Google) — Enterprise BI Leader
Looker (now part of Google) is the enterprise BI leader. LookML is a powerful semantic-modeling language. Pricing is enterprise-only.

Strengths:
- Most mature semantic layer (LookML)
- Strong data governance
- Enterprise-grade scale
- Tight Google Cloud integration

Weaknesses:
- $50K+/yr typical; sales-led
- LookML has a learning curve
- Overkill for indie scale

Pick when: you''re mid-market+ on Google Cloud with a data team.

### Tableau — Enterprise BI Default
Tableau is the long-standing enterprise BI default. Powerful visualizations; deep customization; expensive.

Strengths:
- Best-in-class visualizations
- Mature; widely-supported
- Strong for ad-hoc visual exploration
- Power users build complex dashboards

Weaknesses:
- $75/user/mo (Creator); scales fast
- Heavy desktop client
- Less collaborative than newer tools
- Owned by Salesforce; some product-direction concerns

Pick when: you have existing Tableau investment or visualization quality is paramount.

### Power BI (Microsoft) — Microsoft Default
Power BI is the Microsoft enterprise BI tool. Bundled with Office 365 in many cases; cheap; deep Microsoft integration.

Strengths:
- Cheap ($14/user/mo)
- Free Desktop tier
- Tight Microsoft integration (Excel, SharePoint, Teams)
- Solid feature set

Weaknesses:
- Less polished than Tableau / modern tools
- Microsoft-ecosystem heavy
- DAX language has a learning curve

Pick when: you''re a Microsoft / Office 365 shop.

### Evidence — Code-First Reports
Evidence is the code-first BI alternative. Markdown + SQL; produces static reports / sites; OSS.

Strengths:
- MIT OSS
- Markdown + SQL = version-controlled reports
- Static deployment (Netlify / Vercel)
- Cheap ($2K/mo Cloud) or free OSS
- Developer-friendly

Weaknesses:
- Not real-time interactive
- No "ad-hoc query" UX
- Smaller community

Pick when: you want code-first, version-controlled, static reports.

### PostHog (Bundled) — Already-On-PostHog Tool
If you''re on PostHog for product analytics, it includes dashboard / SQL capabilities. Use what you have.

Pick when: data already in PostHog; basic BI needs; don''t need a separate tool.

## What BI Tools Won''t Do

- **Replace your data warehouse.** BI queries data; the warehouse stores it. See [database providers](../backend-and-data/database-providers.md).
- **Replace your ETL.** Tools like dbt, Fivetran, Airbyte transform / load data; BI consumes it.
- **Be free of operational overhead.** Even hosted BI requires schema management, query optimization, dashboard maintenance.
- **Solve "we don''t know our metrics."** Tools query data; teams decide what to query.
- **Replace product analytics.** PostHog / Amplitude track in-product behavior; BI is for warehouse-data analysis.

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / Postgres**:
- Metabase (Cloud Starter $85/mo or self-hosted)
- PostHog for product analytics
- Total: $85/mo + PostHog cost

**Data-savvy team**:
- Hex (Pro $24/user/mo)
- Or Metabase + occasional notebook in DataLab
- Total: $50-200/mo

**OSS / self-host**:
- Metabase self-hosted
- Or Preset / Lightdash
- Total: infrastructure cost only

**Customer-facing embedded analytics**:
- Metabase Pro with embedding ($240+/mo)
- Or Sigma embed
- Or custom build with Tremor / Recharts

**Already on dbt**:
- Lightdash (dbt-native)
- Or Metabase with manual model management
- Total: $440/mo Cloud or self-host

**Microsoft shop**:
- Power BI ($14/user/mo)
- Total: $14-28/user/mo

**Code-first reports**:
- Evidence (OSS or Cloud)
- Total: $0-2K/mo

**Already on PostHog**:
- PostHog Dashboards (bundled)
- Total: bundled

## Decision Framework: Three Questions

1. **Where is your data?** → Postgres / MySQL: Metabase. Snowflake / BigQuery: any (Hex / Looker shine). dbt: Lightdash.
2. **Who''s building dashboards?** → Engineers / analysts: Hex / Evidence. Business team: Metabase / Sigma. Microsoft team: Power BI.
3. **What''s your scale?** → Indie: Metabase / Hex Free. Mid-market: Metabase / Hex Pro. Enterprise: Looker / Tableau.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Metabase if you want one tool; Hex if you have an analyst; PostHog if data is already there**. Skip enterprise BI until budget and team justify.

## Verdict

For most readers building a SaaS in 2026:
- **Default**: Metabase (Cloud or self-hosted).
- **Notebook-leaning**: Hex.
- **dbt-native**: Lightdash.
- **Spreadsheet-style on warehouse**: Sigma.
- **Microsoft shop**: Power BI.
- **Code-first / static**: Evidence.
- **Enterprise / Google Cloud**: Looker.
- **Already on PostHog**: PostHog Dashboards.
- **Customer-facing embedding**: Metabase Pro or custom.

The hidden cost in BI isn''t the seat fee — it''s **dashboards that nobody opens**. A team with 50 dashboards built by various people, none kept current, none agreed-upon as canonical, is paying for a graveyard. Pick the simple tool; build the few dashboards that matter; check them weekly; the discipline of looking matters more than the depth of the tool.

## See Also

- [Product Analytics Providers](product-analytics-providers.md) — different category; in-product
- [Web Analytics Providers](../marketing-and-seo/web-analytics-providers.md) — marketing-site
- [Database Providers](../backend-and-data/database-providers.md) — where data lives
- [Convex](../backend-and-data/convex.md) — for real-time data
- [Postgres](../backend-and-data/postgres.md) — most-common BI source
- [Search Providers](../backend-and-data/search-providers.md) — separate category
- [Vercel Analytics](../cloud-and-hosting/vercel-analytics.md) — Vercel-specific
- [Posthog Setup](https://www.vibeweek.com/6-grow/posthog-setup-chat) — bundled BI option
- [Customer Analytics Dashboards](https://www.vibeweek.com/6-grow/customer-analytics-dashboards-chat) — for embedded customer-facing
- [Audit Logs](https://www.vibeweek.com/6-grow/audit-logs-chat) — auditable data flows

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
