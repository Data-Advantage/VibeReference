# Reverse ETL Providers: Hightouch, Census, Polytomic, Grouparoo, RudderStack, Workato

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're shipping a SaaS in 2026 with a data warehouse (Snowflake / BigQuery / Databricks / Redshift) and you need that data in operational tools (Salesforce / HubSpot / Marketo / Intercom / Mixpanel), you need reverse ETL. The category emerged 2020-2022; matured 2023-2024; is now standard for any mid-market+ data-stack. Most indie SaaS skips reverse ETL and instead writes ad-hoc sync scripts, then watches them drift, fail silently, and create bad data in the CRM. The fix is one of a handful of vendors that turn warehouse-as-source-of-truth into operational-tool-as-customer-facing — without bespoke pipelines.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Hightouch | Modern reverse-ETL leader | Free (5 syncs) | $350/mo+ | High | Mid-market default |
| Census | Established alternative | Free (10 syncs / 5 destinations) | $700/mo+ | High | Mid-market alt to Hightouch |
| Polytomic | Modern; bidirectional | Free trial | $500/mo+ | High | Bidirectional sync needs |
| Grouparoo (OSS) | Open-source reverse ETL | Free OSS | $0 + ops | Very high | OSS-friendly; self-host |
| RudderStack | CDP + reverse ETL | Free OSS / Cloud | $750/mo+ | High | Bundled CDP + reverse-ETL |
| Workato | Workflow + integration | Custom | $$$ | Low | Enterprise iPaaS |
| Tray.io | Workflow platform | Custom | $$$ | Medium | iPaaS with reverse-ETL |
| Stitch + custom | DIY ETL plus Sync | Tiered | $$$ | Medium | Existing Stitch users |
| Fivetran | ETL-first; some reverse | Custom | $$$$ | Medium | Existing Fivetran customers |
| Streamkap | Real-time CDC | Free trial | $$ | High | Real-time / streaming |

The first decision is **what you're syncing**. Customer attributes to CRM (Hightouch / Census), event-based triggers (Hightouch + RudderStack), bidirectional updates (Polytomic), or workflow-orchestrated (Workato / Tray) are different jobs.

## Decide What You Need First

Tools are not interchangeable. Pick by use case + scale.

### Customer attributes → CRM / marketing tools (the 50% case)
You compute LTV / health-score / segments in warehouse; sync to Salesforce / HubSpot / Intercom / Marketo for use in workflows.

Right tools:
- **Hightouch** — modern leader; clean DX
- **Census** — established alternative
- **Polytomic** — bidirectional option

### CDP-style bundling (the 20% case)
You want event tracking (CDP) AND warehouse syncs in one tool.

Right tools:
- **RudderStack** — bundled CDP + reverse-ETL
- **Segment + Hightouch** — two-tool stack

### Bidirectional sync (the 15% case)
You need writes to flow back: Salesforce update → warehouse → operational tools.

Right tools:
- **Polytomic** — built for this
- **Hightouch** — bidirectional adding 2024+
- **Workato** — workflow-based bidirectional

### Workflow-orchestrated (the 10% case)
Multi-step business processes; reverse-ETL is one piece.

Right tools:
- **Workato** — enterprise iPaaS
- **Tray.io** — workflow platform
- **n8n** — OSS workflow

### OSS / self-hosted (the 5% case)
Cost / privacy / control concerns.

Right tools:
- **Grouparoo** — OSS reverse-ETL
- **RudderStack** — OSS option
- **DIY** with Airflow / Prefect

## Provider Deep-Dives

### Hightouch — modern leader
Founded 2018. The category-defining vendor. Cloud-only.

Pricing in 2026: Free (5 syncs, 1M rows/mo), Starter $350/mo, Pro $1,200/mo+, Enterprise custom.

Features: 200+ destinations (CRM, marketing, support, ads, etc.), SQL or visual model builder, audience builder, observability, identity resolution, AI-assisted modeling, audience activation across web / push / email / ads, dbt integration.

Why Hightouch wins: best DX; biggest destination ecosystem; modern UX; growing fast. Default pick for new data teams.

Trade-offs: pricing climbs at scale; some advanced features only at higher tiers; cloud-only.

Pick if: mid-market data team; want polished default; modern stack. Don't pick if: zero-budget / OSS-only.

### Census — established alternative
Founded 2018; same era as Hightouch. Slightly more enterprise-flavored.

Pricing in 2026: Free (10 syncs, 5 destinations), Standard $700/mo, Pro $2K/mo+, Enterprise custom.

Features: 200+ destinations, SQL-first; live syncs (faster than Hightouch on some destinations); audience builder; CDP features.

Trade-offs: pricing slightly higher than Hightouch at low end; UX feels more enterprise.

Pick if: mid-market+ data team; existing Census infra. Don't pick if: starting fresh — Hightouch and Census are similar; pick by team preference.

### Polytomic — bidirectional + modern
Newer. Bidirectional sync is the differentiator.

Pricing in 2026: Free trial; Standard $500/mo+.

Features: bidirectional (warehouse ↔ Salesforce; updates flow both ways), CDC-based, observability, ergonomic SQL modeling.

Pick if: bidirectional sync is required; mid-market scale. Don't pick if: one-way reverse-ETL is enough — Hightouch / Census are more battle-tested.

### Grouparoo — OSS reverse ETL
Acquired by Airbyte 2022; spun back out. OSS reverse-ETL alternative.

Pricing in 2026: OSS free; commercial via Airbyte Open Source.

Features: SQL or schema-defined, multiple destinations, file-based config, OSS-friendly.

Trade-offs: smaller ecosystem than Hightouch / Census; ops burden.

Pick if: OSS-committed; have ops capacity; cost-conscious. Don't pick if: prefer SaaS DX.

### RudderStack — CDP + reverse ETL
Started as OSS Segment alternative; expanded into reverse-ETL.

Pricing in 2026: OSS free; Cloud Free (1M events); paid tiers from $750/mo.

Features: event tracking (CDP), warehouse syncs (reverse ETL), 200+ integrations, OSS option, real-time + batch.

Why RudderStack: bundled CDP + reverse-ETL in one tool. One vendor instead of two.

Pick if: need both CDP and reverse-ETL; OSS preference. Don't pick if: pure reverse-ETL — dedicated tools win.

### Workato / Tray.io
Enterprise iPaaS. Reverse-ETL is one capability among many.

Pricing in 2026: custom; typically $$ to $$$.

Features: visual workflow builder, hundreds of connectors, workflow orchestration beyond reverse-ETL.

Pick if: enterprise iPaaS need + reverse-ETL one slice. Don't pick if: pure reverse-ETL — overkill.

### Streamkap — real-time CDC
Real-time CDC focus. Streams DB changes to destinations.

Pick if: real-time / streaming use case. Don't pick if: batch is fine.

### Fivetran (some reverse-ETL features)
Fivetran is ETL-first (sources → warehouse). Limited reverse functionality.

Pick if: existing Fivetran customer with light reverse needs. For full reverse-ETL: dedicated tools.

## What Reverse ETL Won't Do

Buying reverse-ETL doesn't:

1. **Replace your data model.** Garbage in warehouse = garbage in destinations. Model carefully in dbt before activating.
2. **Solve identity resolution alone.** Matching same-user-across-tools is a problem layered on top of reverse-ETL. Some tools include; some don't.
3. **Handle complex orchestration.** Reverse-ETL is sync-data; workflows (do X, then if Y, then Z) need iPaaS.
4. **Make slow warehouses fast.** If your warehouse query takes 10 min, reverse-ETL inherits that.
5. **Replace your CRM.** Reverse-ETL syncs INTO CRM; doesn't replace CRM logic.

The honest framing: reverse-ETL is the bridge from "data lives in warehouse" to "data lives in operational tools." Without good warehouse data, the bridge sends bad data faster.

## Pragmatic Stack Patterns

### Pattern 1: Indie data team ($0-350/mo)
- **Hightouch Free** for first 5 syncs
- Warehouse: BigQuery / Snowflake / ClickHouse
- Destinations: HubSpot / Customer.io
- Total: $0-350/mo

### Pattern 2: Mid-market data stack ($500-2K/mo)
- **Hightouch Pro** OR **Census Standard**
- 10-30 syncs to operational tools
- dbt for modeling

### Pattern 3: CDP-bundled ($750-2K/mo)
- **RudderStack** — events + warehouse syncs in one
- Saves a vendor vs Segment + Hightouch
- OSS option to reduce cost

### Pattern 4: Bidirectional needs ($500-1.5K/mo)
- **Polytomic** for two-way Salesforce ↔ warehouse
- Pair with Hightouch for one-way to other tools

### Pattern 5: Enterprise iPaaS ($$$)
- **Workato** OR **Tray.io**
- Reverse-ETL as one capability among many
- Workflow orchestration heavy

### Pattern 6: OSS / self-hosted ($0 + ops)
- **Grouparoo** OR **RudderStack OSS**
- Self-host; control fully
- Ops burden

## Decision Framework: Three Questions

1. **What are you syncing?**
   - Customer attributes → operational tools → Hightouch / Census
   - Events + attributes → RudderStack
   - Bidirectional → Polytomic
   - Workflow-orchestrated → Workato / Tray

2. **What's your scale?**
   - <5 syncs → Hightouch Free
   - 5-30 syncs → Hightouch Pro / Census
   - 30+ syncs → enterprise tier or in-house option

3. **Cloud or self-host?**
   - Cloud preference → Hightouch / Census / Polytomic
   - OSS / self-host → Grouparoo / RudderStack

## Verdict

For 60% of mid-market+ SaaS in 2026: **Hightouch**. Modern; biggest ecosystem; best DX. The pragmatic default.

For 20%: **Census**. Mid-market alternative; pick by team preference (similar capability).

For 10%: **RudderStack**. When CDP + reverse-ETL bundled saves vendors.

For 5%: **Polytomic**. When bidirectional sync is required.

For 5%: **Grouparoo** OR **Workato** for OSS / iPaaS edge cases.

The mistake to avoid: **building reverse-ETL pipelines yourself**. The "let's just write a script that runs nightly" approach drifts; fails silently; pollutes destinations; consumes engineer time. Vendors solve observability + retries + identity + change-tracking. Pay; don't build.

The second mistake: **using reverse-ETL without dbt or equivalent modeling**. Models in warehouse should be clean before activation. Otherwise you're sending bad data to Salesforce, polluting at scale.

## See Also

- [Database Providers](./database-providers.md) — warehouse foundation
- [Data Warehouse Providers](./data-warehouse-providers.md) — Snowflake / BigQuery / Databricks / Redshift
- [Customer Data Platforms](../marketing-and-seo/customer-data-platforms.md) — CDP companion / overlap
- [Time-Series Database Providers](./time-series-database-providers.md) — adjacent specialized DB
- [BI Analytics Tools](../devops-and-tools/bi-analytics-tools.md) — companion query layer
- [Background Jobs Providers](./background-jobs-providers.md) — adjacent infra
- [Workflow Automation Providers](../devops-and-tools/workflow-automation-providers.md) — broader iPaaS context
- [Webhook Delivery Services](./webhook-delivery-services.md) — webhook-based syncs alternative
- [CRM Providers](../marketing-and-seo/crm-providers.md) — common destination
- [Email Marketing Providers](../marketing-and-seo/email-marketing-providers.md) — common destination
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — events fed back to warehouse
- [VibeWeek: Customer Analytics Dashboards](https://vibeweek.dev/6-grow/customer-analytics-dashboards-chat) — companion implementation
