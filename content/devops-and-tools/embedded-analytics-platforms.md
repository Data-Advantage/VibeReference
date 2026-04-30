# Embedded Analytics Platforms: Cube, Sigma, Looker Embedded, Mode Embedded, Metabase Embedded, Explo, Sigma Embedded, Reveal, Domo Everywhere

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're a B2B SaaS in 2026 and customers are asking for "an analytics dashboard" inside your product, this is the consolidated comparison. **Embedded analytics is NOT the same as BI** ([BI / Analytics Tools](./bi-analytics-tools)). BI tools are for YOUR team to analyze YOUR data internally; embedded analytics are for YOUR CUSTOMERS to analyze THEIR data inside YOUR product. Different problem, different vendors, different pricing model. Skipping this distinction is the most common mistake — teams try to use Looker (a BI tool) as their customer-facing analytics, hit licensing + multi-tenancy issues, and migrate six months later.

The naive shape: build dashboards in-house with Recharts/Chart.js + a query layer. Works for v0; falls over when you need pivots, drill-downs, scheduled exports, white-labeling, role-based access, and customer self-serve dashboards. Embedded analytics platforms solve those problems but with serious tradeoffs in price, lock-in, and developer experience. Pick the right shape (headless query layer vs full embedded SDK vs OEM-style white-label) and embedded analytics adds 20-50% per-seat ARR for the right customer segment. Pick wrong and you spend $100K/year on a platform your customers barely use.

## TL;DR Decision Matrix

| Provider | Type | Pricing Model | Free Tier | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Cube | Headless API/semantic layer | Free OSS / Cloud usage-based | Free (OSS), Cloud trial | Yes (Apache 2.0) | Very high | Engineering-led teams; bring your own UI |
| Sigma | Spreadsheet-style cloud BI + embed | Custom | Trial | No | Medium | Analytics-heavy customers wanting Sheets feel |
| Looker (Google) Embedded | Enterprise BI with embed | Custom (high) | Trial | No | Low | Enterprise SaaS with budget + LookML expertise |
| Mode Embedded | SQL-first analytics + embed | Custom | Free Mode trial | No | Medium | Data-team-led SaaS with SQL fluency |
| Metabase Embedded | OSS BI + paid embed tier | Free OSS / Pro $85+/mo | Free OSS | Yes (AGPL) | Very high | Indie/startup SaaS; OSS-friendly |
| Explo | Modern embedded-only analytics | Per-end-user usage | Trial | No | High | Modern SaaS; customer-facing dashboards |
| Sigma Embedded | Sigma white-label | Custom | Trial | No | Medium | Sigma-aligned data-heavy customers |
| Reveal (Infragistics) | White-label embedded | Per-app or per-user | Trial | No | Medium | Microsoft-stack customers |
| Domo Everywhere | Domo-as-embedded | Custom (enterprise) | Trial | No | Low | Domo-aligned enterprises |
| Tableau Embedded | Tableau-as-embedded | Per-user license | Trial | No | Low | Existing Tableau customers extending |
| Embeddable | Modern dev-friendly embed | Per-user/usage | Trial | No | High | Engineering-led teams; component library approach |
| Tinybird | Real-time analytics on ClickHouse | Per-volume | Free tier | No | Very high | Real-time / high-throughput dashboards |
| Plotly Dash Embedded | Python dashboard framework | OSS + Enterprise | Free OSS | Yes (MIT) | High | Python-heavy / data-science teams |
| Apache Superset Embedded | OSS BI with embed | Free OSS | Free | Yes (Apache 2.0) | High | OSS-leaning teams; self-host |
| ThoughtSpot Embedded | Search-first analytics | Custom | Trial | No | Low | Enterprise; AI-led search |
| Holistics | Modern BI with embed | Tier + per user | Trial | No | High | Asia-Pacific-strong; modeling-first |

The first decision is **what shape of embedded analytics you actually need**: headless API/semantic layer (Cube), full embedded SDK with iframe or component (Explo, Metabase Embedded, Sigma Embedded), white-label OEM-style (Looker Embedded, Domo Everywhere), or DIY (build with charts + Cube). Each shape has a clearly best tool. Picking the wrong shape is the most common mistake — usually defaulting to "embed Looker" when Cube + your own UI would have shipped 4× faster.

## Decide What You Need First

Embedded analytics tools are not interchangeable. Get the shape wrong and you'll either lock in to vendor pricing you can't escape, or under-deliver on customer expectations.

### Headless / Semantic Layer (the engineering-led case)

You have engineers. You want to keep design control over the analytics UI (it should look like YOUR product, not a Looker iframe). You need a query layer that handles caching, multi-tenancy, governance — but YOU build the visualizations.

Right tools:
- **Cube** — the modern default; OSS + Cloud
- **dbt Semantic Layer** — adjacent; pairs with dbt models (newer; less mature)
- **MetricFlow** — Transform-then-Cube competitor (acquired into dbt)
- **Embeddable** — modern dev-friendly take

### Full Embedded SDK (the fastest-to-ship case)

You want pre-built dashboards your customers can interact with — pivots, filters, drill-downs, scheduled exports — without building the UI yourself. Tradeoff: less design control.

Right tools:
- **Explo** — modern, customer-facing-first
- **Metabase Embedded** — OSS-friendly; paid embed
- **Sigma Embedded** — spreadsheet-style; data-heavy customers
- **Looker Embedded** — enterprise; LookML governance

### White-label OEM (the brand-control case)

You want analytics that LOOK LIKE your product (custom domain, your branding, your CSS). Often paired with reseller deals where your customer can't tell it's a third-party tool.

Right tools:
- **Looker Embedded** (with theming)
- **Sigma Embedded** (white-label tier)
- **Domo Everywhere**
- **Reveal**

### Real-time / streaming dashboards

You need sub-second updates: live game stats, IoT telemetry, real-time business metrics, financial tickers.

Right tools:
- **Tinybird** — ClickHouse-backed real-time
- **Materialize** + custom UI
- **Cube** + ClickHouse + WebSocket layer
- **Apache Superset** + Druid for self-hosted

### Indie / startup budget

You need analytics for customers but can't justify $50K+/yr platform contracts.

Right tools:
- **Metabase OSS** + paid embed tier ($85/mo)
- **Cube OSS** + your own UI
- **Apache Superset** self-hosted
- **Plotly Dash** OSS for Python teams

### AI-first / search-led analytics

You want customers to ask questions in natural language and get answers / charts back.

Right tools:
- **ThoughtSpot Embedded** — search-first; mature
- **Sigma + AI** (newer)
- **Cube AI** (newer; pair with LLM)
- **Hex Embedded** (notebook-style with AI)

## Provider Deep-Dives

### Cube

The headless analytics API. Cube (founded 2019; IPO trajectory by 2026) provides a semantic layer + caching + multi-tenancy + REST/GraphQL/SQL APIs over your data warehouse. You bring your own UI (React + Recharts, Vega, D3, anything).

**Strengths:**
- Open-source (Apache 2.0); self-hostable.
- Clean separation: data model in Cube, UI in your app.
- Multi-tenancy native (per-tenant filters baked into queries).
- Pre-aggregations + caching — fast even on big warehouses.
- Multiple APIs: REST, GraphQL, SQL (drop-in for Postgres-compatible BI).
- Works with every major warehouse (Snowflake, BigQuery, Databricks, Redshift, ClickHouse, Postgres).
- Cube Cloud option for managed.
- Cube AI for natural language → SQL.
- Strong indie + engineering-led community.

**Weaknesses:**
- You build the UI; that's a real cost (especially if you want pivots, drill-downs, exports — non-trivial to build well).
- Requires data engineering thinking (modeling in Cube schema files).
- Cube schema can become its own project to maintain.
- Cloud pricing scales fast at high query volumes.
- Less out-of-the-box than full embedded SDKs for non-engineering audiences.

**Pricing:** Free OSS (self-host all you want). Cube Cloud: usage-based; typically $1-10K/mo at SaaS scale.

**Best for:** Engineering-led teams building customer-facing analytics where UI ownership matters. Best v1 for serious B2B SaaS investing in analytics as a real product surface.

### Sigma

Spreadsheet-style cloud BI that doubles as embedded. Sigma's pitch: spreadsheet UX (formulas, pivot tables, what-if) on warehouse data, embeddable into your product.

**Strengths:**
- Familiar spreadsheet UX customers already understand.
- Direct query against warehouse (no extract; live data).
- Powerful for analytics-heavy customer personas (finance, operations).
- Strong governance, multi-tenancy.
- Sigma + AI for natural language analysis.
- Custom domain + theming for embed.

**Weaknesses:**
- Pricing is enterprise (typically $50K-500K/yr).
- Spreadsheet feel may not match modern SaaS UX.
- Heavier than indie tools.
- Steeper learning curve for end users vs. simpler chart-only embeds.

**Pricing:** Custom; expect $25K+/yr at low end.

**Best for:** B2B SaaS whose customers ARE analysts (finance tools, operations platforms). Where spreadsheet-style analysis is the expected pattern.

### Looker (Google) Embedded

The enterprise BI heavyweight. Looker (acquired by Google 2019, deeply integrated into Google Cloud) offers embedded analytics via iframes or Looker Components.

**Strengths:**
- LookML semantic layer (powerful + governed).
- Embedded SDK + Components (React widgets).
- Robust enterprise features (SSO, RBAC, theming, scheduling).
- Google Cloud-deep integration.
- Looker Studio Pro for free-er tier (limited).
- Solid analytics depth (pivots, drill-downs, alerts, scheduled).
- Looker AI for natural language.

**Weaknesses:**
- Enterprise-tier pricing ($75K-500K+/yr typical).
- LookML is a learning curve (most teams need a Looker-experienced engineer).
- Iframe-heavy embed model often feels less native than competitors.
- Slow to evolve since Google acquisition (some teams have noticed).
- Not for indie / startup budgets.

**Pricing:** Custom; expect $75K+/yr.

**Best for:** Enterprise SaaS with budget, LookML expertise, and existing Google Cloud commitment. Not for indie.

### Mode Embedded

The SQL-first analytics platform. Mode (acquired by ThoughtSpot 2023) is a notebook-style platform combining SQL, Python/R, and interactive dashboards — embeddable.

**Strengths:**
- SQL-first; analyst-friendly.
- Python + R notebooks alongside SQL.
- White-label embed; customizable theming.
- Strong for data-team-led SaaS where the analytics ARE the product.
- ThoughtSpot acquisition adds AI capabilities.

**Weaknesses:**
- Less polished customer-facing UX vs. Sigma / Explo.
- Pricing similar to Looker tier.
- Reduced product velocity post-acquisition (some teams report).
- Embedding model less plug-and-play.

**Pricing:** Custom; expect $50K+/yr.

**Best for:** Data-team-led SaaS where deep analytical capability matters; teams that already use Mode internally.

### Metabase Embedded

The OSS-friendly embed. Metabase (open-source BI) added paid embed tiers, becoming the default for indie + budget-conscious SaaS adding embedded analytics.

**Strengths:**
- Open-source core (AGPL).
- Cheap relative to peers ($85-455/mo for embed tiers).
- Self-host or Metabase Cloud.
- Decent UX (improving fast in 2025-2026).
- Wide community; lots of plugins.
- Supports static + interactive embed flavors.
- AGPL allows commercial use with caveats.

**Weaknesses:**
- AGPL license requires consideration (talk to your lawyer if redistributing).
- Less polished than Sigma / Explo for analytics-heavy customers.
- Embed feels a bit Metabase-branded by default; theming requires effort.
- Operating self-hosted Metabase has real cost (DB, scaling).

**Pricing:** Free OSS. Pro: $85-455/mo. Cloud: per-user.

**Best for:** Indie / startup SaaS adding analytics; budget-conscious teams; OSS-leaning shops.

### Explo

The modern embed-only platform. Explo (founded 2020) was purpose-built for embedded — no internal-BI mode, only customer-facing.

**Strengths:**
- Modern dev experience; React-friendly embed.
- Per-end-user pricing (scales naturally with your customer base).
- Quick time-to-ship (days, not months).
- Strong on customer-self-serve dashboards.
- White-label theming.
- Active product velocity.

**Weaknesses:**
- Smaller team than incumbents.
- Less feature depth than Looker for very advanced cases.
- Pricing per-end-user can scale fast at large customer counts.
- Newer; less battle-tested in enterprise.

**Pricing:** Per-end-user; typically $10-30/mo per end user with volume discounts.

**Best for:** Modern SaaS with mid-market customers; teams wanting fast ship + clean UX without building UI from scratch.

### Sigma Embedded (specialized embed tier)

Sigma's dedicated embedded product (alongside the main Sigma product). Same engine, embed-optimized.

**Strengths:**
- Spreadsheet feel for analyst customers.
- Strong governance + theming.
- Sigma's data engine is mature.
- White-label.

**Weaknesses:**
- Same enterprise-tier pricing as Sigma main.
- Spreadsheet UX is a love-it-or-hate-it choice.

**Pricing:** Custom; enterprise.

**Best for:** When customer persona = analyst; existing Sigma users embedding for customers.

### Reveal (Infragistics)

The Microsoft-stack-aligned embed. Reveal (by Infragistics) targets enterprise customers using Microsoft / Azure stack.

**Strengths:**
- Strong .NET integration.
- Power BI-style UX.
- White-label.
- Per-app pricing favorable for unit economics.

**Weaknesses:**
- Less brand recognition outside Microsoft world.
- Smaller community.
- UX feels less modern than Explo / Sigma.

**Pricing:** Per-app or per-user.

**Best for:** Microsoft-stack SaaS; .NET-heavy teams.

### Apache Superset (OSS) + Embedded

The OSS BI tool used widely; embedded via SDK.

**Strengths:**
- Apache 2.0; truly free.
- Powerful (Airbnb's roots).
- Massive contributor community.
- Embeds via JavaScript SDK (Embedded Superset).

**Weaknesses:**
- Operating Superset is non-trivial (Kubernetes / Python infra).
- Embed SDK newer; less polished than Metabase / Explo.
- UX requires training.
- DIY ops cost is real.

**Pricing:** Free; pay for hosting + people.

**Best for:** OSS-strict teams; high-volume use cases where commercial pricing breaks; teams with infra ops chops.

### Tinybird

Real-time analytics on ClickHouse. Tinybird turns CSV/JSON streams into ClickHouse-backed APIs for embeds.

**Strengths:**
- Real-time (sub-second on millions of events).
- API-first (you embed via your own UI).
- Generous free tier.
- Fast iteration cycle.
- ClickHouse power without operating ClickHouse.

**Weaknesses:**
- You build the UI (similar to Cube).
- ClickHouse SQL has a learning curve.
- Pricing scales with data volume.
- Not for "general BI" — focused on real-time time-series.

**Pricing:** Free tier; paid scale-up by volume.

**Best for:** Real-time / streaming analytics use cases; product analytics dashboards; high-throughput needs.

### Plotly Dash + Enterprise / Embedded

Python-based dashboarding. Dash is OSS Python; Dash Enterprise adds embedding + auth.

**Strengths:**
- Python-native; data-science-team-friendly.
- OSS core.
- Powerful for custom analytical UIs.
- Dash AI features.

**Weaknesses:**
- Python-heavy stack (your engineering team needs Python).
- Less polished than JavaScript-native peers for SaaS embeds.
- Enterprise pricing for hosting + auth.

**Pricing:** OSS free; Enterprise custom.

**Best for:** Data-science / Python-heavy SaaS. Custom analytical workflows.

## What Embedded Analytics Won't Do

Useful to be clear-eyed about embed platform limits:

- **They won't replace your data warehouse.** Embed analytics queries data; they don't store/transform it. You still need Snowflake / BigQuery / Postgres / ClickHouse upstream. (See [Data Warehouse Providers](../backend-and-data/data-warehouse-providers).)
- **They won't fix bad data models.** Garbage in, garbage out. Get dbt right first; then embed.
- **They won't replace product analytics.** [Product Analytics Providers](./product-analytics-providers) (PostHog, Mixpanel, Amplitude) are different — they track YOUR users in YOUR product. Embedded analytics show YOUR customers' data inside YOUR product.
- **They won't auto-handle multi-tenancy.** Cube does it well; others require careful engineering. Misconfigure → Customer A sees Customer B's data — career-ending.
- **They won't be invisible to customers.** Even with white-labeling, the embed feel often differs from your native UI. Plan UX carefully.
- **They won't substitute for clear analytical thinking.** A confusing dashboard with great pivot UX is still confusing. Design the answer first; pick a platform second.
- **They won't scale linearly with your customer count.** Per-end-user pricing models (Explo, Looker) scale fast. Track unit economics.

## Pragmatic Stack Patterns

Common 2026 patterns based on stage + scope:

### Indie / pre-PMF SaaS

```
Postgres direct + Recharts (you build UI from scratch)
+ optional: Metabase OSS for internal BI
+ skip embedded analytics until customers ASK
```

Rationale: don't build embed analytics until proven demand.

### Early-stage with first analytics demand ($500K-$3M ARR)

```
Cube OSS (or Cube Cloud Hobby) for query layer
+ Recharts or Tremor on the UI side
+ data warehouse: Postgres or BigQuery (whatever you have)
+ build dashboards customer-by-customer initially
```

Rationale: low cost; high control; engineering-led.

### Growth-stage, customer-facing dashboards needed ($3M-$30M ARR)

```
Option A (engineering-led):
  Cube Cloud + custom UI on your product framework
  + Metabase Embedded for the few internal/exec dashboards
  
Option B (faster ship):
  Explo or Metabase Embedded for customer dashboards
  + Cube as the query layer (or Metabase's native query)
```

Rationale: ship fast; keep cost reasonable; iterate on UX.

### Mid-market data-heavy customers ($30M+ ARR)

```
Sigma Embedded (analysts love spreadsheet feel)
+ Looker Embedded for white-label/enterprise tier
+ Cube as headless layer for non-Sigma surfaces
+ ThoughtSpot for search-led "ask anything" surface (optional)
+ data warehouse: Snowflake or Databricks
```

Rationale: customer persona = analyst; analytical depth matters.

### Enterprise SaaS

```
Looker Embedded (with LookML governance)
+ Cube for non-Looker surfaces
+ Sigma for analyst-customer interfaces
+ Tableau Embedded only if existing customer base demands
+ Snowflake / Databricks
```

Rationale: enterprise customers + procurement + compliance + LookML expertise on team.

### Real-time / streaming dashboards

```
Tinybird + your own UI
+ Cube for batch dashboards alongside
+ ClickHouse as primary store
+ WebSocket layer for sub-second updates
```

Rationale: real-time has its own discipline; specialized tools.

### Modern AI-led search

```
Cube (semantic layer)
+ LLM (OpenAI / Anthropic) for natural language → Cube query
+ Tremor / shadcn-ui on UI side
+ optional: ThoughtSpot Embedded if "ask anything" is core feature
```

Rationale: AI-native UX; custom-built; future-proof.

### OSS-strict teams

```
Apache Superset (self-host + embed SDK)
+ Cube OSS for query layer (or Superset native)
+ ClickHouse / Postgres
+ DIY operations
```

Rationale: license freedom; cost control; trades managed convenience for it.

## Decision Framework

Use this five-question framework:

### 1. Who builds the analytics UI?

- **Engineering team builds it:** Cube, Tinybird, Embeddable.
- **Want pre-built dashboards:** Explo, Metabase Embedded, Sigma Embedded, Looker Embedded.
- **Custom Python:** Plotly Dash.
- **Mixed (some custom, some pre-built):** Cube + Metabase combo.

### 2. What's your customer's analytical sophistication?

- **End-users (most B2B SaaS):** Explo, Metabase Embedded, Cube + simple charts.
- **Analysts (finance, operations tools):** Sigma Embedded, Mode Embedded.
- **Power users / data scientists:** Mode, Hex.

### 3. What's your budget?

- **<$2K/mo:** Metabase OSS / Cube OSS / Plotly Dash / Apache Superset.
- **$2K-15K/mo:** Cube Cloud, Metabase Pro, Explo (small customer base).
- **$15K-100K/mo:** Sigma Embedded, Explo at scale, Mode Embedded.
- **$100K+/mo:** Looker Embedded, ThoughtSpot, Domo Everywhere.

### 4. Real-time or batch?

- **Batch (most B2B SaaS dashboards):** any.
- **Real-time (live counters, streaming):** Tinybird, Cube + ClickHouse, Materialize.
- **Mixed:** Cube + Tinybird + ClickHouse.

### 5. Compliance / data residency?

- **Standard B2B SaaS:** any cloud platform.
- **EU residency:** self-host (Cube, Metabase, Superset) or Cloud with EU regions.
- **Air-gapped / regulated:** OSS self-host (Cube, Metabase, Superset).

## Verdict

For 2026 embedded analytics:

- **Default for engineering-led B2B SaaS:** **Cube** (semantic layer) + your own UI. Best balance of control + capability.
- **Fastest ship for non-engineering teams:** **Explo** or **Metabase Embedded**. Pre-built dashboards customers can use.
- **Indie / startup budget:** **Metabase OSS** + Pro embed tier. Cheapest credible path.
- **Analytics-heavy customer persona:** **Sigma Embedded**. Spreadsheet feel where analysts live.
- **Enterprise / governance-heavy:** **Looker Embedded** (Google Cloud integration + LookML).
- **Real-time:** **Tinybird** + your UI.
- **OSS-strict:** **Apache Superset** self-hosted.
- **Python-heavy:** **Plotly Dash** Enterprise.

The most common mistake in 2026: defaulting to "embed Looker" for the customer-facing dashboards. Looker is great for internal BI, painful for embed (iframe-heavy UX, expensive, LookML is a steep curve). Use Cube + your own UI, or Explo / Metabase Embedded.

The second most common mistake: building dashboards in-house with Recharts and a custom query layer when Cube would have shipped 4× faster with better caching + multi-tenancy. Don't NIH the analytics layer.

The third mistake: skipping the multi-tenancy review. Misconfigure tenant filters in any embed and one customer sees another's data. This kills trust permanently. Test multi-tenancy with adversarial cases before launch.

## See Also

- [BI / Analytics Tools](./bi-analytics-tools) — internal BI (Looker / Tableau / Mode), distinct from embed
- [Product Analytics Providers](./product-analytics-providers) — track YOUR users (PostHog / Amplitude / Mixpanel)
- [Data Warehouse Providers](../backend-and-data/data-warehouse-providers) — upstream of any analytics
- [Data Pipeline & ETL Platforms](../backend-and-data/data-pipeline-etl-platforms) — populate the warehouse
- [Data Observability Platforms](../backend-and-data/data-observability-platforms) — adjacent for data reliability
- [Reverse ETL Providers](../backend-and-data/reverse-etl-providers) — sister discipline (warehouse → SaaS)
- [Realtime & WebSocket Platforms](../backend-and-data/realtime-websocket-platforms) — pairs for real-time dashboards
- [Web Analytics Providers](../marketing-and-seo/web-analytics-providers) — different layer (web traffic vs. product analytics)
- [Customer Survey & NPS Providers](../product-and-design/survey-nps-providers) — adjacent customer-data source
- [Customer Data Platforms](../marketing-and-seo/customer-data-platforms) — adjacent customer-data unification
- [Spreadsheet Database Tools](./spreadsheet-database-tools) — adjacent (Airtable-style) for some use cases
- [Internal Tool Builders](./internal-tool-builders) — adjacent for non-customer-facing dashboards
- [Workflow Automation Providers](./workflow-automation-providers) — adjacent for triggers off analytics
