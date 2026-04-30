# Data Warehouse & Lakehouse Providers: Snowflake, BigQuery, Redshift, Databricks, DuckDB, ClickHouse, Motherduck, Tinybird

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and your analytics queries are starting to slow down the production database, this is the consolidated comparison. Data warehouses are the line item founders skip until BI dashboards take 30 seconds to load, then panic-buy Snowflake (overkill at $30K/yr), or build elaborate ETL pipelines into Postgres replicas (works until 100M rows). Most indie SaaS over-spend on enterprise warehouses when DuckDB / Motherduck / BigQuery free tier would have served them through $10M ARR.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Snowflake | Cloud data warehouse | $400 trial credit | Compute-based ($2-4/credit) | Low | Mid-market+ with budget |
| Google BigQuery | GCP cloud warehouse | 1TB queries/mo free | $6.25/TB queried | High | GCP shops; analytics-heavy |
| Amazon Redshift | AWS cloud warehouse | 2-month trial | $0.25/hr (2x dc2.large) | Medium | AWS-heavy stacks |
| Databricks | Lakehouse + ML | $400 free | $0.15+/DBU | Low | ML / data-engineering teams |
| DuckDB | Embedded analytics DB | Free OSS | Self-host | Very high | Single-machine analytics; cheap |
| Motherduck | DuckDB-as-a-service | Free (10GB) | $25/mo+ | Very high | Indie analytics in 2026 |
| ClickHouse | OLAP DB (OSS + cloud) | Free OSS | ClickHouse Cloud $66+/mo | High | Real-time analytics; events |
| Tinybird | Real-time analytics API | Free (1GB) | $99/mo+ | High | API-driven analytics features |
| Materialize | Streaming SQL DB | Free trial | $250+/mo | Medium | Real-time / streaming use cases |
| Apache Pinot | OSS real-time OLAP | Free | Self-host | Medium | Real-time analytics at scale |
| Postgres + analytics ext | Cheap / simple | Free | Hosting | Very high | <50M rows; same DB as transactional |
| Apache Iceberg + S3 | Open lakehouse | Free / S3 cost | S3 + compute | Medium | Modern open-format lakehouse |
| Pinot / Druid / etc. | Specialty OLAP | Various | Various | Various | Very specific real-time needs |

The first decision is **what shape of data problem you have**. Cloud-warehouse-for-BI (Snowflake / BigQuery / Redshift), embedded-analytics-DB (DuckDB / ClickHouse), real-time analytics API (Tinybird / Materialize), and lakehouse with ML (Databricks) are four different problems with overlapping tools.

## Decide What You Need First

Warehouse tools are not interchangeable. Pick by use case + scale.

### BI / dashboarding (the 50% case)
You need to run analytics SQL queries for internal dashboards (per [bi-analytics-tools](../devops-and-tools/bi-analytics-tools.md)). Customers don''t see this directly.

Right tools:
- **BigQuery** — generous free tier; great DX
- **DuckDB / Motherduck** — modern indie alternative
- **Snowflake** — when budget supports
- **Postgres replica** — when small (<50M rows)

### Customer-facing analytics features (the 25% case)
You expose analytics in your product (dashboards customers see; usage data shown back).

Right tools:
- **Tinybird** — API-first
- **ClickHouse** — high throughput
- **Postgres** with materialized views (small scale)
- **Cube** + warehouse (semantic layer)

### Real-time / streaming analytics (the 15% case)
You need sub-second updates: live dashboards, real-time alerts, streaming aggregations.

Right tools:
- **Materialize** — streaming SQL
- **ClickHouse** — high-velocity events
- **Tinybird** — real-time API
- **Apache Pinot** — at scale

### ML / data engineering (the 10% case)
You have data scientists running ML training, complex transformations, multi-source data integration.

Right tools:
- **Databricks** — lakehouse + ML
- **Snowflake** + dbt
- **BigQuery** + Vertex AI

For most indie SaaS in 2026: **BigQuery for cloud-warehouse BI; DuckDB / Motherduck for cheap analytics; ClickHouse for product-embedded analytics; skip Snowflake until $5M+ ARR**.

## Provider Deep-Dives

### BigQuery — GCP Cloud Warehouse
BigQuery is Google''s serverless cloud warehouse. Pay-per-query; massive scale; generous free tier.

Strengths:
- 1TB queries / month free (genuinely useful)
- Serverless (no provisioning)
- $6.25/TB queried
- Strong ML integration (Vertex AI)
- BigQuery ML for in-warehouse training
- Petabyte-scale automatically

Weaknesses:
- GCP-only
- Pricing surprises (large query = $$$)
- Slower than Snowflake on some workloads

Pick when: GCP-heavy; analytics-volume modest; cost-sensitive at small scale.

### Snowflake — Multi-Cloud Warehouse Default
Snowflake is the modern enterprise data warehouse. Multi-cloud (AWS / Azure / GCP); compute-storage separation.

Strengths:
- Best-in-class performance for SQL warehouse
- Multi-cloud
- Strong partner ecosystem (Snowflake Marketplace)
- Compute-storage separation (scale independently)
- Mature SQL features (snapshots, time-travel, etc.)

Weaknesses:
- Expensive at scale ($10K-1M+/yr)
- Custom pricing
- Heavy implementation
- Overkill for indie

Pick when: mid-market+; budget supports; need compute scale.

### Amazon Redshift — AWS Native
Redshift is AWS''s warehouse. Tight AWS integration.

Strengths:
- Native AWS (S3, Glue, Athena integration)
- Redshift Serverless option
- Strong for AWS-heavy stacks

Weaknesses:
- Cluster-based (provisioned) historically
- Less polished than Snowflake
- AWS lock-in

Pick when: AWS-heavy; want native warehouse.

### Databricks — Lakehouse + ML
Databricks pioneered lakehouse architecture. Combines warehouse + data lake + ML.

Strengths:
- Best-in-class for data engineering / ML
- Apache Spark + Delta Lake
- MLflow for ML lifecycle
- Multi-cloud
- Open formats (Delta, Iceberg)

Weaknesses:
- Custom pricing (typically $30K-300K+/yr)
- Heavy product surface
- Not for pure BI / dashboards
- Enterprise-focused

Pick when: ML / data engineering team; need lakehouse architecture.

### DuckDB — Embedded Analytics
DuckDB is the modern Postgres-equivalent for analytics. In-process; SQLite-like; OSS.

Strengths:
- Free / OSS
- Fast on single machine (multi-GB queries in seconds)
- Embedded (no server)
- SQL features (Postgres-like)
- Pandas / Arrow integration
- Great for ad-hoc analytics

Weaknesses:
- Single-machine (no cluster)
- Limited concurrency
- Not for many users / real-time

Pick when: analyst running queries on laptop; embedded in app for analytics; <100GB data.

### Motherduck — DuckDB-as-a-Service
Motherduck wraps DuckDB into a hybrid local + cloud service.

Strengths:
- DuckDB''s simplicity + cloud scale
- Free tier (10GB)
- $25/mo paid
- Notebook-style queries
- Modern indie-friendly

Weaknesses:
- Newer; smaller community
- Single-vendor

Pick when: indie SaaS analytics in 2026; modern DX preferred.

### ClickHouse — High-Performance OLAP
ClickHouse is the OSS column-store for high-velocity events. Real-time analytics; high throughput.

Strengths:
- Open source
- Extremely fast on column-oriented analytics
- Compresses well (10-100x)
- ClickHouse Cloud option
- Used by Cloudflare, Tesla, Uber for analytics

Weaknesses:
- Self-host overhead (or Cloud cost)
- SQL dialect quirks
- Not a relational warehouse (different model)

Pick when: high-velocity events; product-embedded analytics; cost-sensitive at scale.

### Tinybird — Real-Time Analytics API
Tinybird is real-time analytics-as-an-API, built on ClickHouse.

Strengths:
- API-first (publish queries as endpoints)
- Real-time ingest + query
- $99/mo+ paid; free tier
- Modern DX

Weaknesses:
- ClickHouse-on-rails (some flexibility lost)
- Vendor lock-in

Pick when: building analytics features into your product (customer-facing dashboards).

### Materialize — Streaming SQL
Materialize maintains views as data changes (incremental updates).

Strengths:
- Real-time view updates
- SQL-native
- Streaming-first

Weaknesses:
- Newer; smaller community
- $250+/mo

Pick when: real-time materialized views; streaming use case.

### Apache Pinot / Druid — OSS Real-Time
Pinot (used by LinkedIn, Uber) and Druid (used by Netflix) are OSS real-time OLAP.

Strengths:
- Open source
- Real-time + historical
- Massive scale

Weaknesses:
- Heavy operational burden
- Specialized

Pick when: massive scale; team can operate.

### Postgres + Analytics Extensions
For small-scale analytics, Postgres with extensions can suffice:

- **TimescaleDB**: time-series
- **Citus**: distributed Postgres
- **pg_partman**: partitioning
- **Materialized views**: pre-aggregated data

Strengths: same DB; cheap; familiar
Weaknesses: doesn''t scale to TB; same DB as production (lock contention)

Pick when: <50M rows; small team; want simplicity.

### Apache Iceberg + S3 — Open Lakehouse
Open table format on object storage. Compute-engine agnostic (Snowflake, Databricks, Trino, etc. all read).

Strengths:
- Open format (no lock-in)
- Cheap storage (S3)
- Multiple engines can query

Weaknesses:
- Self-host overhead
- Newer pattern

Pick when: data-engineering-mature team; multi-engine future.

## What Data Warehouses Won''t Do

- **Replace OLTP database.** Warehouses are for analytics; transactions go to Postgres / MySQL.
- **Be free at scale.** Pay-per-query (BigQuery) or compute time (Snowflake) climbs at high volume.
- **Replace data engineering.** Warehouses store; you transform (per [drizzle-vs-prisma](drizzle-vs-prisma.md) for OLTP; dbt / similar for warehouse).
- **Be invisible to performance.** Bad queries kill warehouse cost; SQL discipline matters.
- **Replace BI tools.** Warehouse stores data; BI tool queries it (per [bi-analytics-tools](../devops-and-tools/bi-analytics-tools.md)).
- **Handle real-time without specific tools.** Most warehouses are batch-oriented (minutes-hours latency).

## Pragmatic Stack Patterns

**Indie SaaS, basic analytics**:
- Postgres replica + materialized views
- Or: BigQuery free tier
- Total: $0-50/mo

**Indie SaaS with BI dashboards**:
- BigQuery (warehouse)
- dbt (transformations)
- Metabase / Superset (BI)
- Total: $0-200/mo

**Modern indie analytics in 2026**:
- Motherduck (warehouse)
- dbt (transforms)
- Hex / Mode / Metabase (BI)
- Total: $25-300/mo

**Customer-facing analytics in product**:
- Tinybird (API) OR ClickHouse Cloud
- Total: $99-500/mo

**Mid-market with growing analytics**:
- Snowflake or BigQuery (warehouse)
- dbt + Fivetran (ETL)
- Looker / Tableau / Hex (BI)
- Total: $5K-50K/yr

**Enterprise / ML-heavy**:
- Databricks
- dbt + Fivetran + Airflow
- Multiple BI tools
- Total: $100K-1M+/yr

**Real-time analytics**:
- ClickHouse Cloud or Tinybird
- Plus stream ingestion (Kafka / Materialize)
- Total: $500-5K/mo

## Decision Framework: Three Questions

1. **What''s the use case?** → Internal BI: BigQuery / DuckDB. Customer-facing: Tinybird / ClickHouse. Streaming: Materialize. ML: Databricks.
2. **What''s your scale?** → < 100GB: Postgres / DuckDB. 100GB - 10TB: Motherduck / BigQuery. 10TB+: Snowflake / Databricks.
3. **What''s your cloud?** → GCP: BigQuery. AWS: Redshift / Athena. Multi-cloud: Snowflake / Databricks. Indie: Motherduck / DuckDB.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **BigQuery for free-tier; DuckDB / Motherduck for cheap; ClickHouse / Tinybird for product-embedded; skip Snowflake until $5M+ ARR**.

## Verdict

For most readers building a SaaS in 2026:
- **Default for indie BI**: BigQuery free tier OR Motherduck.
- **Default for cheap analytics**: DuckDB.
- **Customer-facing analytics**: Tinybird or ClickHouse Cloud.
- **High-velocity events**: ClickHouse.
- **Streaming SQL**: Materialize.
- **Mid-market warehouse**: Snowflake.
- **AWS-native**: Redshift.
- **GCP-native**: BigQuery.
- **ML / lakehouse**: Databricks.
- **Open lakehouse**: Iceberg + S3 + Trino/Spark.

The hidden cost in data warehouses isn''t the seat fee — it''s **compute waste from unoptimized queries.** A poorly-written SQL query in BigQuery can cost $50 in a single run. Snowflake auto-scales compute and bills accordingly. The discipline of: query review; partition / cluster correctly; materialize hot queries — matters more than which warehouse. A senior data engineer pays for themselves in compute savings.

## See Also

- [Database Providers](database-providers.md) — OLTP layer (different)
- [Postgres](postgres.md) — Postgres for both OLTP + small-scale analytics
- [SQL](sql.md) — query layer
- [Background Jobs Providers](background-jobs-providers.md) — ETL pipelines
- [BI Analytics Tools](../devops-and-tools/bi-analytics-tools.md) — query / dashboard layer
- [Customer Data Platforms](../marketing-and-seo/customer-data-platforms.md) — events to warehouse
- [Web Analytics Providers](../marketing-and-seo/web-analytics-providers.md) — adjacent
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — adjacent
- [Vector Database Providers](vector-database-providers.md) — different problem
- [VibeWeek: Customer Analytics Dashboards](https://www.vibeweek.com/6-grow/customer-analytics-dashboards-chat) — uses warehouse data
- [VibeWeek: Database Sharding & Partitioning](https://www.vibeweek.com/6-grow/database-sharding-partitioning-chat) — adjacent OLTP scaling
- [VibeWeek: Database Indexing Strategy](https://www.vibeweek.com/6-grow/database-indexing-strategy-chat) — OLTP indexing (different)
- [VibeWeek: Caching Strategies](https://www.vibeweek.com/6-grow/caching-strategies-chat) — adjacent

---

[⬅️ Backend & Data Overview](../backend-and-data/)
