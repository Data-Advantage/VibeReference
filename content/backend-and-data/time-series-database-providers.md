# Time-Series Database Providers: InfluxDB, TimescaleDB, ClickHouse, QuestDB, Prometheus, Druid, Timestream, ScyllaDB

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're storing metrics, IoT data, financial ticks, log aggregations, observability data, or any append-heavy time-stamped data in 2026, you need a time-series database (TSDB). Postgres works fine until you hit ~100M rows; then queries slow, indexes bloat, and aggregation queries take seconds. Most indie SaaS starts with Postgres + extensions (TimescaleDB extension keeps you on Postgres), grows into ClickHouse for analytics-heavy use cases, or jumps to a managed service (InfluxDB Cloud / Timestream) when ops capacity is short. The right pick depends on whether you're storing app metrics (Prometheus), business analytics (ClickHouse), IoT (InfluxDB), or staying-on-Postgres (TimescaleDB) — they're overlapping but distinct workflows.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| TimescaleDB | Postgres extension | Free OSS | $25/mo+ Cloud | Very high | Postgres-aligned SaaS |
| InfluxDB | Purpose-built TSDB | Free OSS / Cloud free | $0-50/mo+ | High | IoT / DevOps metrics |
| ClickHouse | Columnar OLAP | Free OSS / Cloud free | $200/mo+ | High | Analytics / event data |
| QuestDB | Modern SQL TSDB | Free OSS | $$$ Cloud | High | High-throughput trading / IoT |
| Prometheus | Pull-based metrics | Free OSS | $0 + ops | Very high | Self-hosted observability |
| Druid | Real-time analytics | Free OSS | $$$ Imply Cloud | Medium | Real-time dashboards at scale |
| AWS Timestream | Managed TSDB | Pay-per-use | Usage-based | Medium | AWS-native; serverless |
| Datadog Metrics | Observability backend | Bundled | $$$ | Low | Datadog-locked stacks |
| Mimir / Cortex | Prometheus-at-scale | Free OSS | $0 + ops | High | Multi-tenant Prometheus |
| VictoriaMetrics | High-perf Prometheus alt | Free OSS | $0-300/mo Cloud | Very high | Cost-conscious metrics |
| ScyllaDB | Cassandra-compatible | Free OSS / Cloud | $$$ | Medium | Massive-scale time-series |
| Apache IoTDB | OSS IoT TSDB | Free OSS | $0 | Medium | IoT-focused OSS |
| ksqlDB / Kafka Streams | Stream processing + storage | Free OSS | $$$ Confluent Cloud | Medium | Stream-first |

The first decision is **what kind of time-series problem you have**. Application metrics (Prometheus / Mimir), business analytics events (ClickHouse / Druid / TimescaleDB), IoT sensor data (InfluxDB / TimescaleDB / QuestDB), or financial ticks (QuestDB / ClickHouse) are different problems with overlapping vendors.

## Decide What You Need First

Tools are not interchangeable. Pick by data shape + scale.

### Application metrics / DevOps observability (the 30% case)
You collect CPU/memory/request-rate/latency from services. Query: "p95 latency by endpoint last hour."

Right tools:
- **Prometheus** — de facto standard; pull-based; OSS
- **VictoriaMetrics** — drop-in replacement; faster; cheaper
- **Mimir / Cortex** — multi-tenant Prometheus at scale
- **Datadog / New Relic** — managed end-to-end (with their own TSDB)

### Business analytics / event data (the 30% case)
You collect product events ("user X clicked Y at time Z"). Query: "DAU by week last quarter; conversion funnel by cohort."

Right tools:
- **ClickHouse** — modern OLAP standard; OSS + cloud
- **Druid** — older; real-time-heavy
- **TimescaleDB** — Postgres-aligned; smaller scale
- **BigQuery / Snowflake** — warehouse-first (not strictly TSDB)

### IoT / sensor data (the 20% case)
Heavy ingest from devices. Query: "average temp by sensor over last 30 days; alerts when out of range."

Right tools:
- **InfluxDB** — IoT-DNA tool
- **TimescaleDB** — relational sensor data
- **QuestDB** — high-throughput modern
- **AWS Timestream** — AWS-IoT-aligned

### Financial / trading (the 10% case)
Very high write throughput; complex queries; nanosecond timestamps.

Right tools:
- **QuestDB** — designed for this
- **ClickHouse** — also excels
- **kdb+** — proprietary; trading industry standard

### Postgres-aligned (the 10% case)
You're already on Postgres; want time-series support without leaving.

Right tools:
- **TimescaleDB** — extension; same Postgres
- **pgvector + Postgres partitioning** — DIY for low scale

## Provider Deep-Dives

### TimescaleDB — Postgres-aligned default
Postgres extension (open-core). Adds hypertables, continuous aggregates, compression. Acquired (rebranded as Timescale) — new features behind cloud-only.

Pricing in 2026: OSS free (Apache 2.0 community edition + TSL-licensed advanced features), Cloud Lab free trial, Production from $25/mo+.

Features: hypertables (auto-partitioned by time), columnar compression (90%+ compression on time-series), continuous aggregates (auto-refreshed materialized views for rollups), retention policies (auto-drop old), vector search (since 2024).

Why TimescaleDB wins: you keep Postgres. Same connection, same SQL, same tools (Prisma, Drizzle, raw SQL). For most SaaS storing time-stamped data alongside user/account data, this is the path of least resistance.

Trade-offs: not as fast as ClickHouse or QuestDB at extreme scale (>10B rows). Some advanced features TSL-licensed (Cloud-only). Postgres scaling characteristics still apply (vertical-first; read replicas for horizontal).

Pick if: SaaS storing time-series alongside relational data; under 10B rows; want Postgres ecosystem. Don't pick if: pure analytics workload; >100B rows.

### InfluxDB — IoT-flavored TSDB
The OG purpose-built TSDB. Founded 2013. v1 (storage), v2 (storage + Flux query), v3 (rebuilt on Apache Arrow, faster, breaking changes).

Pricing in 2026: OSS free (v1, v2), Cloud Serverless usage-based, Cloud Dedicated $200/mo+.

Features: Line Protocol ingestion (very efficient), schema-on-write, retention policies, downsampling, Flux query language (or InfluxQL / SQL in v3), Telegraf agents.

Why InfluxDB: IoT / DevOps DNA. Telegraf integration ecosystem is huge. Ingest performance excellent.

Trade-offs: query language complexity (Flux divergent from SQL; v3 brings SQL but breaks v1/v2). Schema model is opinionated (tags vs fields); learning curve. v1 → v2 → v3 migration breakage real.

Pick if: IoT-style write-heavy + dashboarding; metric-flavored data; Grafana-aligned. Don't pick if: relational queries dominant; want SQL-only.

### ClickHouse — analytics powerhouse
Russian-origin OLAP database (Yandex, 2016). Now a major OSS project. Used by Cloudflare, Uber, Yandex. Cloud option (ClickHouse Cloud) since 2022.

Pricing in 2026: OSS free, ClickHouse Cloud $200/mo+ (smallest tier), production usage-based.

Features: columnar storage (massive compression + analytics speed), distributed queries, native SQL, materialized views, dictionaries (in-memory lookups), TTL on tables, replication, sharding.

Why ClickHouse wins: 10-100x faster than Postgres for analytics queries on >100M rows. Storage costs 5-10x lower than Postgres for time-series due to columnar compression. SQL-native.

Trade-offs: single-row updates / deletes are weak (use Postgres for transactional). Schema changes can be expensive at scale. Different mental model than Postgres for engineers.

Pick if: product analytics; large event volume (>100M rows); analytics queries dominant; tolerance for non-Postgres ops. Don't pick if: low scale; transactional workload.

### QuestDB — modern fast TSDB
Newer (2014; open-source 2017). Built in Java; SQL-native; nanosecond timestamps.

Pricing in 2026: OSS free, QuestDB Cloud $200/mo+.

Features: nanosecond timestamps, INSERT via Postgres wire protocol or InfluxDB Line Protocol, SQL, time-series-specific extensions (LATEST BY, SAMPLE BY).

Why QuestDB: fastest open-source TSDB at high write throughput; familiar SQL; dual-protocol ingest.

Pick if: high-throughput writes (>100K events/sec); SQL-native preference; financial / trading or IoT. Don't pick if: low scale (overkill).

### Prometheus — de facto observability metric store
The default metric backend in cloud-native (CNCF graduated). Pull-based (Prometheus scrapes targets).

Pricing in 2026: OSS free (Apache 2.0), self-hosted; managed via Grafana Cloud / Datadog / New Relic.

Features: pull-based scraping, PromQL query language, alerting (Alertmanager), federation, recording rules, exporters for everything.

Why Prometheus: industry standard for app/infra metrics. Massive integration ecosystem.

Trade-offs: storage limited single-node (~weeks of data); high-cardinality data (tons of unique label combos) blows up memory; for long-term / multi-tenant, need Mimir / Cortex / VictoriaMetrics.

Pick if: app/infra metrics; cloud-native stack; want OSS. Don't pick if: business analytics or IoT (different data model).

### Mimir / Cortex / VictoriaMetrics — Prometheus-at-scale
Layers on top of (or replacing) Prometheus for long retention + multi-tenancy.

- **Grafana Mimir** — successor to Cortex; horizontally-scalable Prometheus storage
- **Cortex** — pre-Mimir; mostly migrated to Mimir
- **VictoriaMetrics** — Prometheus-compatible; faster + cheaper; Russian origin

Pick when single-node Prometheus hits storage / cardinality limits.

### Druid — real-time OLAP
Founded at Metamarkets (2012); donated to Apache. Real-time ingestion + sub-second queries.

Pricing in 2026: OSS free, Imply Cloud $$$.

Features: real-time ingestion, sub-second queries, time-series + OLAP hybrid.

Pick if: real-time dashboards at >10K events/sec; mature ops team. Don't pick if: simpler use case; ClickHouse or TimescaleDB easier.

### AWS Timestream — managed TSDB
Amazon's managed TSDB. Two flavors: Timestream for InfluxDB (managed Influx) and Timestream for LiveAnalytics (purpose-built).

Pricing in 2026: usage-based; pricing complex (memory + magnetic + queries).

Features: serverless scaling; AWS-IAM integration; tight CloudWatch / IoT-Core integration.

Pick if: AWS-locked; IoT use case; want managed without vendor lock-in to non-AWS. Don't pick if: not AWS-locked.

### Datadog Metrics / New Relic / Honeycomb / Grafana Cloud
Bundled with observability suites. The TSDB is implementation detail; you pay for the dashboards / alerting / agents.

Pick when observability is the use case and you want managed end-to-end.

### ScyllaDB / Cassandra
Wide-column DBs adapted for time-series at extreme scale. Used by Discord, Comcast.

Pick if: ultra-high write scale (>100K writes/sec sustained) + cassandra expertise. Otherwise overkill.

### Apache IoTDB / Snowflake / BigQuery
- **IoTDB** — Apache OSS focused on IoT
- **Snowflake / BigQuery** — warehouses; not strictly TSDB but can serve

Pick by ecosystem alignment.

## What Time-Series DBs Won't Do

Buying a TSDB doesn't:

1. **Replace your transactional database.** TSDBs are append-heavy; bad at OLTP (single-row updates, joins, transactions). Keep Postgres / MySQL for app data.
2. **Make slow queries fast magically.** Schema design matters. Wrong partitioning / wrong index = slow even on TSDB.
3. **Solve cardinality explosions.** Storing `user_id` as a Prometheus label = trouble at 1M users. Plan cardinality.
4. **Replace ETL.** Ingestion still needs pipelines (Kafka / Vector / Telegraf / Fluent Bit / custom).
5. **Solve dashboarding.** TSDB stores data; dashboards (Grafana / Metabase / your own UI) live on top.

The honest framing: a TSDB is leverage for time-stamped append-heavy workloads. Without disciplined schema + ingest + retention, the tool just stores broken data faster.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS with metrics on Postgres ($0-50/mo)
- **Postgres** with TimescaleDB extension (or just Postgres + partitioning)
- Continuous aggregates for rollups
- Store metrics + app data in same DB
- Total: $0-50/mo

### Pattern 2: Indie SaaS with growing event volume ($50-500/mo)
- **TimescaleDB Cloud** or **Postgres + TimescaleDB extension on managed Postgres**
- Compression policies enabled
- Retention policies (drop > 90 days old)
- Total: $50-500/mo

### Pattern 3: Mid-market product analytics ($200-2000/mo)
- **ClickHouse Cloud** for events
- **Postgres** for app data
- ETL via Vector / Fluent Bit / dbt
- Grafana / Metabase for queries
- Total: $200-2000/mo

### Pattern 4: DevOps observability ($0-500/mo)
- **Prometheus** (single-node) → **VictoriaMetrics** at scale
- **Grafana** for dashboards
- **Loki** for logs
- **Tempo** for traces
- Total: $0 + ops; or Grafana Cloud $50-500/mo

### Pattern 5: IoT at scale ($500-5K/mo)
- **InfluxDB Cloud** or **AWS Timestream**
- **Telegraf** for ingest
- **Grafana** for dashboards
- Total: usage-based

### Pattern 6: Massive analytics ($2K-50K/mo)
- **ClickHouse** self-hosted (cost-efficient at scale)
- **Druid** for real-time-heavy
- Stream-processing layer (Kafka + Flink / ksqlDB)

## Decision Framework: Three Questions

1. **What's your data shape?**
   - App metrics (CPU, latency) → Prometheus / VictoriaMetrics
   - Business events (click, purchase) → ClickHouse / TimescaleDB
   - IoT (sensors, devices) → InfluxDB / TimescaleDB / Timestream
   - Financial / trading → QuestDB / ClickHouse

2. **What's your scale?**
   - <100M rows → Postgres + TimescaleDB extension
   - 100M-10B rows → TimescaleDB Cloud / ClickHouse / InfluxDB
   - 10B-100B+ rows → ClickHouse / Druid / ScyllaDB

3. **Postgres-aligned or not?**
   - Yes (want Postgres) → TimescaleDB
   - No / open to alternatives → ClickHouse (analytics) / InfluxDB (metrics) / QuestDB (perf)

## Verdict

For 50% of SaaS in 2026: **TimescaleDB**. Postgres-aligned; SQL-native; covers business events, app metrics, IoT-lite at indie / mid-market scale. The pragmatic default until you outgrow at >10B rows.

For 25%: **ClickHouse**. Modern OLAP standard; necessary for product analytics at scale; cloud option removes ops burden.

For 15%: **Prometheus** (often + VictoriaMetrics for scale). The de facto for app / infra observability metrics. Default for cloud-native ops.

For 5%: **InfluxDB** for IoT-DNA use cases or Telegraf-integrated stacks.

For 5%: **QuestDB** / **AWS Timestream** / **Druid** in specific situations (financial / AWS-locked / real-time-heavy).

The mistake to avoid: **using Postgres for everything until you can't**, then panic-migrating to ClickHouse during an outage. Postgres + TimescaleDB extension lets you scale 10x further on the same DB; plan the migration to ClickHouse / specialized TSDB at year 2-3 when product-analytics workload starts to dominate.

The second mistake: **using a TSDB for transactional data**. ClickHouse / InfluxDB / QuestDB are append-optimized; single-row updates / deletes are slow or unsupported. Keep app data in Postgres; analytics in TSDB.

## See Also

- [Database Providers](./database-providers.md) — broader OLTP database landscape
- [Postgres](./postgres.md) — Postgres deep-dive (TimescaleDB foundation)
- [Vector Database Providers](./vector-database-providers.md) — adjacent specialized DB type
- [Data Warehouse Providers](./data-warehouse-providers.md) — Snowflake / BigQuery / Databricks
- [Search Providers](./search-providers.md) — adjacent specialized
- [Observability Providers](../devops-and-tools/observability-providers.md) — Datadog / New Relic / Honeycomb
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — PostHog / Mixpanel / Amplitude
- [BI Analytics Tools](../devops-and-tools/bi-analytics-tools.md) — query layer over TSDBs
- [VibeWeek: Database Indexing Strategy](https://vibeweek.dev/6-grow/database-indexing-strategy-chat) — indexing TSDB tables
- [VibeWeek: Database Sharding & Partitioning](https://vibeweek.dev/6-grow/database-sharding-partitioning-chat) — partitioning time-series data
- [VibeWeek: Customer Analytics Dashboards](https://vibeweek.dev/6-grow/customer-analytics-dashboards-chat) — TSDB feeds dashboards
