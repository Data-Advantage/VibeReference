# Data Pipeline & ETL Platforms: Fivetran, Airbyte, Stitch, Estuary, Meltano, Matillion, dlt, Portable

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a data stack in 2026 and need to move data from operational systems (Postgres, MongoDB, Salesforce, HubSpot, Stripe, Shopify, etc.) into a warehouse (Snowflake, BigQuery, Databricks, Redshift, ClickHouse) for analytics, this is the consolidated comparison. Forward-ETL/ELT is the unglamorous foundation — without it your BI dashboards are blank, your cohort analyses are vibes, and your "data team" is people manually exporting CSVs from 14 admin panels every Friday. Most indie SaaS over-engineer with Fivetran (great product, painful pricing at scale) when Airbyte or dlt would have served them through Series B; mid-market keeps Fivetran and complains about the bill; enterprise is on Fivetran + Matillion or has built bespoke pipelines that everyone wishes they hadn't.

This is forward-ETL (operational sources → warehouse). For the inverse motion (warehouse → SaaS tools, e.g. Snowflake → Salesforce), see [Reverse ETL Providers](./reverse-etl-providers).

## TL;DR Decision Matrix

| Provider | Type | Pricing Model | Free Tier | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Fivetran | Managed ELT, market leader | MAR (Monthly Active Rows) | Free (500K MAR) | No | Medium | Mid-market+, mature data teams, broad connector needs |
| Airbyte | OSS/cloud ELT | Free OSS / Cloud usage-based | Free (OSS), Cloud trial | Yes (ELv2) | Very high | Indie/startup, OSS-friendly, custom connectors |
| Stitch | Singer-tap-based ELT (Talend) | Per-row pricing | Free (5M rows) | Yes (Singer OSS) | High | Budget alternative, Singer-tap users |
| Estuary Flow | Real-time CDC ELT | Per-data-volume | Free (10GB/mo) | No | High | Real-time / streaming use cases |
| Meltano | OSS Singer-tap orchestration | Free (OSS) / Cloud beta | Free | Yes (MIT) | Very high | DIY-leaning teams; data-engineer-led shops |
| Matillion | Cloud-native ETL/ELT for warehouses | Custom (enterprise) | Trial | No | Low | Snowflake/Databricks-heavy enterprise |
| dlt (data load tool) | Python-based OSS ELT library | Free (lib) / Cloud beta | Free (lib) | Yes (Apache 2.0) | Very high | Engineering teams writing pipelines as code |
| Portable | Long-tail SaaS connectors | Per-flow | Free (limited) | No | Medium | Niche SaaS sources Fivetran lacks |
| Hevo | All-in-one ELT (mid-market) | Tiered | Trial | No | Medium | Mid-market alternative to Fivetran |
| Rivery | ELT + workflow orchestration | Tiered | Trial | No | Medium | Teams wanting orchestration + ELT bundled |
| Stitch (legacy) | Legacy Talend product | Per-row | Trial | No | Low | Existing Stitch customers (consider migration) |
| AWS Glue | AWS-native ETL | Pay-per-DPU-hour | Free (1M reqs/mo) | No (proprietary) | Medium | AWS-deeply-bound; technical teams |
| Azure Data Factory | Azure-native ETL | Per-pipeline-run | Free trial | No | Low | Microsoft-shop enterprises |
| Google Dataflow | GCP-native streaming ETL | Per-vCPU-hour | Free trial | No (proprietary) | Medium | Streaming-heavy on GCP |
| Singer (OSS taps) | Open-source tap/target framework | Free | Free | Yes (Apache 2.0) | High | DIY framework; powers Stitch + Meltano |

The first decision is **what shape of pipeline you actually need**: managed-everything (Fivetran), self-host-and-extend (Airbyte/Meltano), pipelines-as-code (dlt), real-time streaming (Estuary, Dataflow), or warehouse-native ETL (Matillion). Each shape has a clearly best tool. Picking the wrong shape is the most common mistake — usually defaulting to Fivetran when you don't yet have the volume to justify the bill, or picking OSS when you don't have data engineers to maintain it.

## Decide What You Need First

Forward-ETL tools are not interchangeable. Get the shape wrong and you'll either pay $30K/mo for capability you don't use, or burn 6 engineer-months maintaining pipelines you should have bought.

### Managed-everything ELT (the 60% mid-market case)

You have 5-30 data sources (Salesforce, HubSpot, Stripe, Postgres, Shopify, Mixpanel, etc.), you want them landing in your warehouse with zero engineering effort, and you'll pay for the convenience. Connectors must "just work" — including schema drift, API throttling, edge cases.

Right tools:
- **Fivetran** — the default for serious data teams; broadest connector catalog; expensive but works
- **Hevo** — mid-market alternative to Fivetran; cheaper at smaller scale
- **Stitch** — budget alternative; smaller catalog but reliable

### Pipelines-as-code (engineering-led)

You have data engineers. You want pipelines version-controlled in Git, reviewable in PRs, runnable locally. You're willing to write Python for connectors not in the catalog — and you treat data movement as software.

Right tools:
- **dlt (data load tool)** — modern Python-first ELT library; the rising default
- **Meltano** — Singer-tap-based with orchestration; OSS-leaning teams
- **Airbyte (with Connector Builder)** — when you want managed + custom

### Self-host / OSS-first

You can't justify Fivetran's bill (or compliance forbids data leaving your perimeter), and you have engineering capacity to run open-source software. You want a connector catalog without paying per-row.

Right tools:
- **Airbyte (self-hosted)** — best-in-class OSS catalog
- **Meltano** — Singer-tap-based; lighter footprint
- **dlt** — pipelines-as-code; minimal infrastructure

### Real-time / streaming CDC

You need updates flowing to the warehouse in seconds, not hours. Change Data Capture (CDC) from operational databases. Use cases: real-time dashboards, ML feature pipelines, event-driven analytics.

Right tools:
- **Estuary Flow** — real-time CDC purpose-built
- **Debezium** (DIY) — OSS CDC framework on Kafka
- **Google Dataflow** — streaming ETL on GCP
- **Confluent Cloud** + connectors — Kafka-native streaming

### Warehouse-native ETL (transformations close to the data)

You're Snowflake- or Databricks-heavy and want pushdown ETL — running transformations IN the warehouse rather than in a separate pipeline tool.

Right tools:
- **Matillion** — Snowflake/Databricks/BigQuery/Redshift-native ETL UI
- **dbt** + Fivetran/Airbyte for ingestion (modern data stack default)
- **Coalesce** — newer Snowflake-native challenger to Matillion

### Long-tail / niche SaaS connectors

Your dominant tool isn't a category leader. You need connectors for `Acme Vertical SaaS Inc.` that Fivetran/Airbyte don't have.

Right tools:
- **Portable** — purpose-built for long-tail connectors
- **Airbyte Connector Builder** — write your own in 30 minutes
- **dlt** — write a Python connector
- **Singer + Meltano** — write a tap

## Provider Deep-Dives

### Fivetran

The market leader. Fivetran is to ELT what AWS is to cloud — the default, the safe pick, the one with the most connectors and the worst pricing surprises. If you're a serious B2B SaaS or mid-market data team in 2026, you've evaluated Fivetran or you're already on it.

**Strengths:**
- Largest connector catalog (700+ pre-built sources, including obscure SaaS).
- "Set it and forget it" reliability — schema drift handled, API rate limits handled, retries automatic.
- HVR Real-Time CDC for database sources (industry-leading).
- Modern data stack ecosystem positioning (deeply integrated with dbt, Snowflake, Databricks).
- Strong support for enterprise (SOC 2, HIPAA, FedRAMP, hybrid deployment).
- Logging, monitoring, alerting all mature.
- Hybrid deployment (their data plane runs in your VPC; control plane theirs) — increasingly important for compliance.
- Recent (2024-2025) AI features for connector creation + pipeline observability.

**Weaknesses:**
- Pricing model (Monthly Active Rows / MAR) is opaque and expensive at scale. A $50K/mo bill for one Salesforce + Postgres + HubSpot setup is plausible.
- Customers regularly cite "bill shock" as the #1 complaint.
- Custom connectors are limited (Cloud Function Connectors exist but are crude).
- For real-time use cases (sub-minute), HVR is the answer but adds cost.
- Less open / extensible than Airbyte.

**Pricing:** Free tier (500K MAR/mo). Paid plans scale by MAR; expect $1-50K+/mo depending on volume. Enterprise custom.

**Best for:** Serious mid-market and enterprise data teams who want connectors that "just work" and will pay for it. Default if you have $10M+ ARR and 5+ data sources.

### Airbyte

The OSS challenger. Airbyte (founded 2020) became the open-source ELT default by 2024-2025 — modern UI, large connector catalog, self-hostable, with a managed cloud option for those who don't want to operate it.

**Strengths:**
- OSS license (ELv2, mostly Apache-friendly for self-host) — connectors are MIT.
- 350+ connectors, growing rapidly.
- Connector Builder lets you create custom connectors in a visual UI in 30 min.
- Self-hosted (Kubernetes) for compliance/cost-sensitive teams.
- Cloud option (managed) at typically 30-50% of Fivetran's bill at comparable volumes.
- Active community + frequent releases.
- dbt integration.
- Recent (2025) generative AI connector-creation tooling.

**Weaknesses:**
- Connector catalog less polished than Fivetran's at the long tail; some connectors are community-maintained and brittle.
- Self-hosting takes engineering effort (Kubernetes ops, scaling, monitoring).
- Some sources have known reliability issues that Fivetran's HVR handles better.
- ELv2 license has copyleft-style provisions that some enterprises avoid (read the license).
- Cloud product newer; some features lag self-hosted.

**Pricing:** OSS free. Cloud: usage-based (per GB synced); typically 30-60% cheaper than Fivetran at comparable volume.

**Best for:** Indie + startup teams who can't justify Fivetran. Engineering-led teams who want to extend connectors. Compliance-strict customers needing self-hosted.

### Stitch (by Talend)

The Singer-tap-based budget alternative. Stitch was an early ELT pioneer, acquired by Talend in 2018. The product is mature but the connector catalog has stagnated relative to Fivetran/Airbyte.

**Strengths:**
- Cheapest major managed ELT for low volume.
- Built on Singer (open-source tap framework) — connectors are portable.
- Reliable for the connectors it has.
- Simple pricing model (per-row).
- Decent free tier (5M rows/mo).

**Weaknesses:**
- Connector catalog smaller than Fivetran/Airbyte; not growing fast.
- Talend ownership means uncertain roadmap.
- Less polish than Fivetran/Airbyte UI.
- Singer ecosystem itself is showing age vs newer alternatives.
- No serious CDC story.

**Pricing:** Free (5M rows/mo). Paid: $100-1K+/mo per row volume.

**Best for:** Budget-constrained teams with simple needs. Existing Stitch customers (no urgent reason to migrate). Singer-tap-aligned teams.

### Estuary Flow

The real-time CDC specialist. Estuary's pitch: sub-second CDC from operational sources to warehouse, plus traditional ELT in the same product.

**Strengths:**
- Sub-second CDC latency for database sources.
- Materializations to warehouses (BigQuery, Snowflake, Databricks) at real-time.
- Decoupled architecture: capture once, materialize many times.
- Developer-friendly API + UI.
- Serverless infra; doesn't require Kafka.
- Free tier is real (10GB/mo).
- Growing connector catalog.

**Weaknesses:**
- Smaller connector catalog than Fivetran/Airbyte.
- Newer; smaller community.
- Pricing model can get complex at scale.
- Less brand recognition.

**Pricing:** Free 10GB/mo. Paid: per-GB, typically competitive.

**Best for:** Teams with real-time requirements. ML feature pipelines. Real-time analytics dashboards. Teams who'd otherwise build Debezium + Kafka and want the managed alternative.

### Meltano

The OSS Singer-tap orchestrator. Meltano (originated at GitLab; spun out 2021) packages Singer taps with orchestration, dbt, and CLI-driven workflows.

**Strengths:**
- Open-source (MIT).
- CLI + YAML config-driven; pipelines-as-code.
- Singer ecosystem (1000+ taps).
- dbt integration.
- Managed cloud option (Meltano Cloud).
- Lightweight; low infrastructure footprint.
- Strong with data-engineer-led teams who want OSS + control.

**Weaknesses:**
- CLI/YAML not as approachable as Fivetran/Airbyte UI.
- Some Singer taps are unmaintained / brittle.
- Smaller community than Airbyte.
- Less polish for non-engineering users.

**Pricing:** OSS free. Cloud: usage-based.

**Best for:** Engineering teams that want OSS + pipelines-as-code. Teams where data engineers are first-class.

### Matillion

The warehouse-native ETL leader. Matillion runs ETL transformations IN your warehouse (Snowflake, Databricks, BigQuery, Redshift) using their pushdown engine.

**Strengths:**
- Native pushdown to warehouses (transformations run in-warehouse).
- Visual ETL UI (drag-drop transformations).
- Strong with enterprise Snowflake/Databricks customers.
- Production-grade orchestration + monitoring.
- Custom Python/SQL transforms supported.
- Recent Maia (AI assistant) for pipeline creation.

**Weaknesses:**
- Pricing is enterprise-tier (often $50K-500K+/year).
- Visual UI is a love-it-or-hate-it choice; engineering-led teams often prefer dbt.
- Lock-in to warehouse-specific features.
- Connector catalog smaller than Fivetran for ingestion.
- Often used alongside Fivetran (Fivetran for ingestion, Matillion for transformation).

**Pricing:** Custom; typically $50K-500K+/year.

**Best for:** Snowflake/Databricks-heavy enterprises with budget. Teams that want visual ETL not dbt. Less appealing to indie/startup.

### dlt (data load tool)

The Python-first OSS library. dlt (Apache 2.0, by dlthub) is a Python ELT library — write your pipeline in Python, run it anywhere, schema management is automatic.

**Strengths:**
- Pipelines-as-code, native Python.
- Auto-schema-detection + schema evolution.
- 50+ pre-built sources (with `pip install`).
- Run anywhere: local, Airflow, Dagster, GitHub Actions, Vercel Cron.
- No infrastructure required; the library does the work.
- LLM-friendly — generate connectors with AI.
- Strong with engineering teams.
- Active development; rising star in 2025-2026.
- dlt+ Cloud product for orchestration (beta).

**Weaknesses:**
- Less polished UI for non-engineers.
- Newer; smaller community than Airbyte.
- Connector catalog smaller than Fivetran/Airbyte.
- Custom connectors require Python skills.

**Pricing:** OSS free. Cloud (beta): usage-based.

**Best for:** Engineering teams writing pipelines as code. Modern teams treating data as software. Pre-data-team SaaS where engineers own the data stack.

### Portable

The long-tail SaaS connector specialist. Portable's pitch: 1300+ connectors for the SaaS tools Fivetran doesn't cover.

**Strengths:**
- Massive long-tail connector catalog (industry-specific tools, vertical SaaS).
- Serverless; managed.
- Fast to add new connectors on request.
- Pairs well with Fivetran (Fivetran for big sources, Portable for long-tail).

**Weaknesses:**
- Connectors for major sources less polished than Fivetran.
- Smaller team.
- Pricing per-flow can add up.
- Less brand recognition.

**Pricing:** Free tier; paid per-flow.

**Best for:** Teams with niche SaaS sources Fivetran/Airbyte don't have. Augments primary ELT tool.

### Cloud-native (AWS Glue / Azure Data Factory / Google Dataflow)

The cloud providers each have a native ETL offering. Use them when you're deeply bound to one cloud and want to avoid third-party tools.

**AWS Glue:** Spark-based serverless ETL. Strong if AWS-bound + technical team. Free tier (1M requests/mo). Pricing per DPU-hour can add up.

**Azure Data Factory:** Microsoft-shop ETL. Strong with Azure Synapse / Fabric. Familiar to enterprise IT.

**Google Dataflow:** Streaming + batch ETL on Apache Beam. Strong for streaming use cases on GCP.

**Common weakness:** all three lack the connector catalog of dedicated ELT tools. They're better suited for bespoke / streaming / complex transformations than for "pull HubSpot to warehouse" use cases.

**When to pick:** when cloud-native compliance matters, when ETL is custom enough that catalog connectors don't help, or when your team's expertise is already in that cloud's ecosystem.

## What ELT Won't Do

Useful to be clear-eyed about ELT tool limits:

- **They won't replace dbt.** ELT moves data; dbt transforms it. You still need both. The "modern data stack" pattern is: ELT (Fivetran/Airbyte/dlt) → warehouse → dbt → BI. Don't try to do transformation IN the ELT tool unless you're using Matillion.
- **They won't fix bad source data.** Garbage in, garbage out — but in your warehouse now, with metadata and a SLA.
- **They won't replace data observability.** ELT tools alert on pipeline failure; data observability tools (Monte Carlo, Bigeye, Anomalo) alert on stale data, broken contracts, distribution shifts. Different layer.
- **They won't make your data team happy if you skip schema management.** Schema drift WILL happen; pick a tool that handles it well (Fivetran > Airbyte > rest).
- **They won't replace reverse-ETL.** Forward-ETL: sources → warehouse. Reverse-ETL: warehouse → SaaS. Different pipeline; different tools (Hightouch, Census).
- **They won't run real-time without explicit real-time products.** Standard Fivetran/Airbyte run on 5-15 min sync intervals. Real-time = Estuary, Debezium, Confluent, or HVR.
- **They won't solve compliance for you.** SOC 2 / HIPAA / GDPR posture matters. Read each vendor's compliance page; verify hybrid-deployment options if data sovereignty matters.

## Pragmatic Stack Patterns

The right ELT stack depends on stage. Common patterns in 2026:

### Indie / pre-PMF SaaS (no data team)

```
Postgres → BigQuery (or Postgres replication to read replica)
+ Stripe data exports (their built-in)
+ HubSpot/CRM exports manually until volume justifies
+ dbt for transformations
+ Looker Studio / Metabase for dashboards
```

Rationale: don't pay for ELT until volumes + sources justify. You can fake it for a long time.

### Early-stage (1-2 engineers, $500K-2M ARR)

```
dlt (data load tool) → Snowflake/BigQuery (~free per source)
+ dbt Cloud or dbt Core for transformations
+ Metabase or Hex for analytics
+ Cost: <$500/mo
```

Rationale: pipelines-as-code, engineer-owned, scales to $5M ARR before you need anything fancier.

### Growth-stage ($2M-20M ARR, hiring data analyst)

```
Airbyte Cloud or Fivetran (for managed ELT, 5-15 sources) → Snowflake/BigQuery
+ dbt Cloud
+ Looker / Hex / Mode
+ Reverse-ETL: Hightouch (warehouse → SaaS)
+ Data observability: Anomalo (lighter) or Bigeye
```

Rationale: at $5M+ ARR, the engineer-time saved by managed ELT is worth $1-5K/mo.

### Mid-market ($20M-100M ARR, real data team)

```
Fivetran (managed ELT, 20-50 sources) → Snowflake / Databricks / BigQuery
+ dbt Cloud + dbt mesh
+ Looker / Tableau / ThoughtSpot
+ Reverse-ETL: Hightouch
+ Data observability: Monte Carlo
+ Custom data work: dlt + Dagster/Airflow
+ Real-time pipelines (if needed): Estuary or Debezium+Kafka
+ ML pipelines: dbt + Snowflake ML (or Databricks ML)
```

Rationale: pay for the managed ELT, invest engineering in unique transformations + ML.

### Enterprise ($100M+ ARR, mature data org)

```
Fivetran (with HVR for real-time CDC) → Snowflake/Databricks
+ Matillion (warehouse-native ETL for orchestration-heavy transforms)
+ dbt Cloud Enterprise
+ Data Mesh architecture (multiple data products)
+ ML platform: Databricks or custom
+ Reverse-ETL: Hightouch or Census
+ Data observability: Monte Carlo
+ Data catalog: Atlan or Collibra
+ Compliance hybrid-deployment of Fivetran
```

Rationale: enterprise pays for reliability, governance, compliance. Bills are large; they're proportional to ROI.

### Engineering-heavy / OSS-first

```
Airbyte self-hosted (Kubernetes) → ClickHouse or Postgres (warehouse)
+ dbt Core
+ Dagster or Airflow for orchestration
+ Metabase / Lightdash
+ Custom Python pipelines via dlt
+ Compliance: data never leaves your cluster
```

Rationale: OSS-leaning, infra-confident teams; trades managed convenience for control + lower bill.

### Real-time / streaming

```
Debezium → Kafka → ClickHouse / Materialize / RisingWave
+ Or Estuary Flow (managed)
+ dbt for batch transforms on top
+ Real-time dashboards via [Metabase / Grafana]
```

Rationale: real-time is its own discipline; pick streaming-native tools.

## Decision Framework

Use this five-question framework:

### 1. What's your data volume?

- **<10M rows/mo:** Stitch free tier, Airbyte free, or dlt — don't pay for managed.
- **10M-500M rows/mo:** Airbyte Cloud, Hevo, or Fivetran starter.
- **500M-5B rows/mo:** Fivetran or Airbyte Cloud at scale.
- **>5B rows/mo:** Negotiated Fivetran enterprise; or self-hosted Airbyte; or custom dlt+Dagster.

### 2. How many sources do you have, and how niche are they?

- **<5 mainstream sources:** dlt, Airbyte, Stitch — DIY-friendly.
- **5-30 sources, mainstream SaaS:** Fivetran, Airbyte Cloud — managed ELT.
- **Long-tail / niche SaaS sources:** Fivetran + Portable, or Airbyte + custom connectors.
- **30+ sources:** Fivetran + custom connector strategy.

### 3. Is real-time required?

- **No (5-15 min sync OK):** Fivetran, Airbyte, anything.
- **Yes (sub-minute):** Estuary, Debezium+Kafka, Fivetran HVR, Google Dataflow.
- **Yes (sub-second):** Estuary, Materialize, custom Kafka.

### 4. What's your team profile?

- **No data engineer; engineering-led:** dlt (pipelines-as-code).
- **Data engineer-led, OSS-friendly:** Airbyte self-hosted, Meltano, dlt.
- **Data analyst / non-engineer-led:** Fivetran, Hevo, Stitch (managed UI).
- **Enterprise data team:** Fivetran + Matillion + dbt Cloud.

### 5. Compliance / data residency?

- **No special requirements:** any cloud-managed ELT.
- **EU data residency:** Fivetran EU region, Airbyte self-hosted, or self-hosted alternatives.
- **HIPAA / SOC 2 strict:** Fivetran, Airbyte enterprise, or self-hosted with your own controls.
- **Air-gapped / no SaaS:** self-hosted Airbyte, Meltano, dlt.

## Verdict

For 2026 forward-ETL/ELT:

- **Default for serious data teams ($10M+ ARR):** **Fivetran**. Boring, expensive, works.
- **Indie / startup default:** **dlt** (pipelines-as-code) or **Airbyte Cloud**.
- **OSS / self-hosted:** **Airbyte** (best catalog) or **Meltano** (Singer ecosystem).
- **Engineering-led / pipelines-as-code:** **dlt**.
- **Real-time CDC:** **Estuary Flow** or DIY Debezium+Kafka.
- **Warehouse-native ETL (post-ingestion transforms):** **Matillion** OR **dbt** (the modern alternative; usually wins).
- **Long-tail SaaS connectors:** **Portable** alongside Fivetran/Airbyte.
- **Cloud-native heavy:** AWS Glue / Azure Data Factory / Google Dataflow per cloud.

The most common mistake in 2026: indie teams signing 12-month Fivetran contracts before they have the data volume to justify it. Walk before you run. Start with dlt or Airbyte. Upgrade when bill complexity > pipeline complexity.

The second mistake: treating ELT as "set and forget." It IS more reliable than custom code, but schema drift, source API changes, and warehouse cost spikes happen. Budget 5-10% of a data engineer's time for pipeline ops at any scale.

The third mistake: skipping dbt. ELT moves the data; dbt transforms it. The two together are the modern data stack. Don't try to transform inside the ELT tool unless you're on Matillion.

## See Also

- [Reverse ETL Providers](./reverse-etl-providers) — sister discipline; warehouse → SaaS direction
- [Data Warehouse Providers](./data-warehouse-providers) — destinations for ELT
- [Data Observability Platforms](./data-observability-platforms) — pairs with ELT for reliability
- [Database Providers](./database-providers) — sources for forward-ETL
- [Database Migration Tools](./database-migration-tools) — adjacent (operational schema migrations, not analytics ELT)
- [Background Jobs Providers](./background-jobs-providers) — adjacent orchestration layer
- [BI / Analytics Tools](../devops-and-tools/bi-analytics-tools) — consumers of the warehouse data
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers) — alternative to building your own product-analytics ELT
- [Customer Data Platforms](../marketing-and-seo/customer-data-platforms) — alternative for marketing-data unification
- [Time-Series Database Providers](./time-series-database-providers) — adjacent for metrics/observability
- [Vector Database Providers](./vector-database-providers) — adjacent for embeddings
- [Time-Tracking & Timesheet Tools](../devops-and-tools/time-tracking-timesheet-tools) — sources you may want in warehouse
- [Inventory & Order Management Systems](./inventory-order-management-systems) — sources for ecommerce ELT
- [Webhook Delivery Services](./webhook-delivery-services) — adjacent event-streaming pattern
