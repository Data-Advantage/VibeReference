# Search Providers: Algolia, Typesense, Meilisearch, Elasticsearch, OpenSearch, Postgres FTS, Pinecone-for-Search

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and your product needs search — full-text search across docs, search across customer-uploaded data, in-app search across user records — this is the consolidated comparison. Get the search-provider decision wrong and your fastest customer query takes 3 seconds, your typo handling breaks, and your team rolls their own Elasticsearch cluster nobody on the team knows how to operate.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Postgres Full-Text Search | DB-native | Free, simple, good enough for most | Free (already have Postgres) | Very high | Indie SaaS where search is secondary |
| pg_trgm + Postgres | DB-native fuzzy | Cheap fuzzy + typo handling | Free | Very high | Indie SaaS wanting typo tolerance without dedicated service |
| Typesense Cloud | Hosted SaaS | Cheap, fast, modern | $19/mo+ | Very high | Indie SaaS with serious search needs |
| Typesense self-host | OSS | Same as cloud, you operate | Free / OSS | High | Teams comfortable self-hosting |
| Meilisearch Cloud | Hosted SaaS | Modern UX, good DX | $30/mo+ | High | Smaller-scale apps wanting polish |
| Meilisearch self-host | OSS | Lightweight self-host | Free / OSS | High | Teams comfortable self-hosting |
| Algolia | Hosted SaaS | Best-in-class DX, enterprise | Free → $1+/1K records | Medium | Mid-market wanting perfection |
| Elasticsearch / OpenSearch | OSS / hosted | Maturity, scale, complex queries | Self-host or $95+/mo | Low | Teams with serious search/log/analytics needs |
| Orama | OSS / hosted | Edge-runnable, on-device | Free / $19/mo | High | Edge / Workers apps needing search |
| Cloudflare Workers Search | Hosted | Cloudflare-native, edge-distributed | $5/mo+ | Medium | Cloudflare-stack apps |
| Vector + Hybrid (Pinecone, etc.) | Vector DB | Semantic search, AI-augmented | $70+/mo | Medium | AI-native search experiences |
| Mongo Atlas Search | DB-native | Already on MongoDB | Bundled with Atlas | Medium | Atlas customers |
| ParadeDB / pg_search | DB-native | Postgres + serious FTS via Tantivy | Free | High | Postgres-loyal teams wanting Algolia-like search |

The first decision is **how core is search to your product**. Search-as-a-feature (you have a search bar, customers occasionally use it) is solved by Postgres FTS. Search-as-the-product (you're building a search-first product, or the search box is the primary UX) needs a dedicated provider.

## Decide What Kind of Search

### Search-as-secondary-feature (most indie SaaS)
Customers occasionally search. The search bar is in the corner. Acceptable latency: 200-500ms. Acceptable quality: "finds the obvious matches."

Right tools:
- **Postgres Full-Text Search (FTS)** — built in, free, good enough
- **pg_trgm** — fuzzy / typo-tolerant on top of Postgres
- **ParadeDB / pg_search** — Postgres extension using Tantivy (the engine behind Meilisearch); brings Algolia-like quality to Postgres

For most indie SaaS in 2026, this is the right answer. Don't over-engineer.

### Search-as-core-feature (search-led products)
Search IS the product UX. Latency under 50ms. Typo tolerance, faceted filtering, weighted ranking, search-as-you-type expected.

Right tools:
- **Typesense** — modern, cheap, Algolia-API-compatible
- **Meilisearch** — modern, good DX, slightly different model
- **Algolia** — premium, best DX, expensive at scale

### Search at large scale (millions of records, complex queries)
Aggregations, faceted analytics, log search, time-series. Not just "find a document."

Right tools:
- **Elasticsearch / OpenSearch** — most mature, most powerful, most operational
- **Algolia** at the high tiers
- **ClickHouse + custom search** — for log/analytics-heavy use cases

### Semantic / AI-augmented search
Beyond keyword matching. Customer types "looks like a chair but for sitting outside" → results include "patio bench."

Right tools:
- **Vector embeddings + vector DB** (Pinecone, Weaviate, Qdrant, pgvector) per [Vector Database Providers](vector-database-providers.md)
- **Hybrid search**: lexical (keyword) + vector, combined via reranking
- **Algolia + AI reranking** — premium hybrid option
- **Typesense + vector search** — built-in hybrid

### Edge-distributed search
Search must run close to the user globally. Read-heavy, geographically distributed audiences.

Right tools:
- **Orama** — runs in Workers, edge-distributed
- **Cloudflare Workers Search** — Cloudflare-native
- **Algolia** — global edge by default

### In-app document search (Notion-like)
Within a single user's workspace, search documents and content quickly. Different shape than catalog search.

Right tools:
- **Postgres FTS** — usually sufficient
- **Typesense / Meilisearch** — if multi-tenant search-quality matters
- **Orama** — if doing on-device search

## Provider Deep-Dives

### Postgres Full-Text Search (FTS)
Postgres has built-in full-text search via `tsvector` + `tsquery`. Not as polished as Algolia but free and good enough for most indie SaaS.

Strengths:
- Already in your stack (no new vendor)
- Reasonable performance up to a few million records
- Stemming, stop words, multiple languages
- Combines with regular SQL — search + filter + sort in one query
- Free

Weaknesses:
- Typo tolerance requires pg_trgm extension; not as smart as Algolia
- No native faceting (you build it via SQL aggregates)
- No native search-as-you-type (build it client-side)
- Tuning for performance gets complex past ~5M rows

Default for: indie SaaS where search is a feature but not the core experience.

### pg_trgm
Postgres extension for fuzzy / similarity matching. Pairs with FTS for typo tolerance.

```sql
CREATE EXTENSION pg_trgm;
SELECT * FROM products WHERE name % 'lapotop'; -- matches 'laptop'
```

Strengths:
- Free, in-database
- Adds typo tolerance to Postgres FTS
- Indexable via GIN

Weaknesses:
- Not as sophisticated as dedicated typo-tolerance engines
- Performance tuning needed at scale

Pick when: Postgres FTS isn't quite handling typos, but you don't want a dedicated service yet.

### ParadeDB / pg_search
Postgres extension using Tantivy (the same engine that powers Meilisearch). Brings dedicated-search quality into Postgres.

Strengths:
- Lives in your Postgres database (no new service)
- Algolia-quality search ranking
- Full BM25 scoring
- Type-aware indexing

Weaknesses:
- Newer; smaller community than dedicated services
- Self-host complexity (or use ParadeDB Cloud)
- Not as polished as Algolia / Typesense client SDKs

Pick when: you love Postgres and want dedicated-search quality without leaving the database.

### Typesense
Modern, fast, open-source search engine. Cloud version + self-host option. API-compatible with Algolia (drop-in for many use cases).

Strengths:
- Algolia-API-compatible — easy migration from Algolia, easy migration to Algolia later
- Fast (sub-50ms typical)
- Cheap ($19/mo for 1GB cloud tier; self-host free)
- Generous free tier
- Built-in typo tolerance, synonyms, faceting, search-as-you-type
- Hybrid search (vector + lexical) supported in 2024+ versions
- Active community

Weaknesses:
- Fewer enterprise features than Algolia (analytics, A/B testing, AI-rerank)
- Self-host is real ops work
- Memory-resident (your dataset has to fit in RAM)

Pick Typesense when: serious search needs, indie budget, OSS lean. Default for indie B2B SaaS in 2026 with real search requirements.

### Meilisearch
Similar shape to Typesense — modern, fast, OSS. Different API and indexing model. The two are often the final-pair decision.

Strengths:
- Excellent DX
- Fast (sub-50ms typical)
- Built-in typo tolerance, faceting, sorting
- Strong indie reputation
- Active development

Weaknesses:
- Memory-resident
- Newer than Algolia / Elasticsearch
- Slightly less battle-tested than Typesense at scale

Pick Meilisearch when: you tested Typesense and prefer the API/DX. Reasonable alternative.

### Algolia
The premium incumbent. Best-in-class developer experience and dashboard.

Strengths:
- Best DX in the category
- Best dashboard for non-technical users
- Mature analytics, A/B testing, AI reranking
- Global edge by default (search latency near-zero in any region)
- Strong AI features (semantic search, query understanding)

Weaknesses:
- Pricing scales aggressively (per record + per search)
- Easy to spend $1K+/mo at smaller indie scale
- Vendor lock-in for some features

Pick Algolia when: budget supports it and you want best-in-class DX without operating anything.

### Elasticsearch / OpenSearch
The mature, enterprise-grade incumbent. Most powerful, most complex.

Strengths:
- Most mature, most battle-tested
- Powerful query DSL
- Aggregations, geo-search, time-series, log search all supported
- Scales to billions of documents
- Self-host or hosted (Elastic Cloud, AWS OpenSearch Service, Bonsai)

Weaknesses:
- Complex to operate
- Expensive at scale
- Steeper learning curve than modern alternatives
- License changes have fragmented community (Elasticsearch → OpenSearch fork)

Pick Elasticsearch / OpenSearch when: very large scale, complex queries, log/analytics workloads, dedicated ops team.

### Orama
Newer entrant. Runs at the edge / in the browser. JavaScript-native.

Strengths:
- Runs in Cloudflare Workers, Vercel Functions, browser
- Edge-distributed by default
- TypeScript-first DX
- Hybrid search (vector + lexical)
- Reasonable cloud pricing

Weaknesses:
- Smaller community
- Memory-resident; dataset size limited
- Less mature than alternatives

Pick Orama when: edge-runtime apps, small-to-medium dataset, want JavaScript-native.

### Cloudflare Workers Search (Vectorize + KV combinations)
Not a single product — a pattern. Build search on top of Cloudflare Workers + Vectorize + KV.

Pick when: deeply on Cloudflare stack, willing to assemble the pieces.

### Mongo Atlas Search
Atlas's bundled search. Good if you're already on MongoDB.

Pick when: MongoDB customer, want bundled search without new vendor.

### Vector + Hybrid (per [Vector Database Providers](vector-database-providers.md))
For semantic search use cases. Often combined with lexical search for hybrid.

Pick for: AI-native search experiences where keyword matching alone misses intent.

## What None of Them Solve

- **Search relevance.** Tools rank by frequency / position / boost. The "right answer" depends on your domain. Tune relevance via boosting, synonyms, custom scoring — every tool gives you knobs.
- **Search analytics.** What do users search for? What returns zero results? Most tools have analytics; few founders use them. The zero-result queries are gold for product roadmap.
- **Multilingual search.** Different stemming, different tokenization, different stopwords per language. Most tools support this; you have to configure correctly.
- **Synonyms.** "TV" vs "television" vs "telly". Domain-specific. Build the synonym list once; maintain forever.
- **Boosting and recency.** Newest content first? Most-used content first? You decide; the tool implements.
- **Search bar UX.** Search-as-you-type, autocomplete, query suggestions, recent searches — these are frontend UX problems the search backend doesn't solve.

## Pragmatic Stack Patterns

**Indie SaaS with search-as-feature**:
- Postgres FTS + pg_trgm
- Total: $0 (already in stack)

**Indie SaaS with serious search needs**:
- Typesense Cloud ($19-99/mo)
- Or self-host Typesense / Meilisearch
- Total: $0-$99/mo

**Indie SaaS on Postgres wanting Algolia-like quality**:
- ParadeDB / pg_search
- Stays in your existing database
- Total: free + DB cost

**Mid-market with budget**:
- Algolia ($100-$2000+/mo depending on volume)
- Best DX + global edge + analytics

**AI-native semantic search**:
- pgvector (in Postgres) + your existing search → hybrid
- Or Pinecone + Typesense for fully separated services
- Per [Vector Database Providers](vector-database-providers.md) for the vector layer

**Massive scale, complex queries**:
- Elasticsearch / OpenSearch
- Self-host or use Bonsai / Elastic Cloud
- Pair with dedicated ops time

**Cloudflare-native app**:
- Orama or Workers + Vectorize
- Edge-distributed by default

## Decision Framework: Three Questions

1. **Is search core to your product?** → No: Postgres FTS. Yes: dedicated service.
2. **Do you need typo tolerance + faceting + sub-50ms latency?** → Yes: Typesense / Meilisearch / Algolia. No: Postgres FTS works.
3. **Do you need semantic / AI-augmented search?** → Yes: vector DB + hybrid (pgvector / Pinecone / Weaviate). No: lexical alone.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Postgres FTS** for search-as-feature, **Typesense** for serious search, **Algolia** if you can afford best-in-class DX.

## Verdict

For most readers building a SaaS in 2026:
- **Search is a feature, not the product**: Postgres FTS + pg_trgm. Default. Free.
- **Postgres-loyal but want better quality**: ParadeDB / pg_search.
- **Search is core, indie budget**: Typesense (cloud or self-host).
- **Search is core, want best-in-class DX**: Algolia.
- **Edge-distributed app**: Orama.
- **Massive scale / complex queries / log search**: Elasticsearch / OpenSearch.
- **AI-native / semantic**: pgvector + hybrid OR dedicated vector DB.

The hidden cost in search is **relevance tuning**, not infrastructure. The first month with a good provider configured poorly produces worse results than Postgres FTS configured well. Spend time on synonyms, boosts, and zero-result analytics; the infrastructure is the cheap part.

## See Also

- [Postgres](postgres.md) — for FTS + pg_trgm details
- [Database Providers](database-providers.md) — companion comparison for the database layer
- [Vector Database Providers](vector-database-providers.md) — semantic search companion
- [Drizzle vs Prisma](drizzle-vs-prisma.md) — ORM choice impacts how you query Postgres FTS
- [Supabase](supabase.md) — bundles Postgres + FTS + pgvector
- [Convex](convex.md) — built-in search primitives if you're on Convex
- [AI Agent Frameworks](../ai-development/ai-agent-frameworks.md) — for AI-augmented search agents
- [AEO/GEO](https://www.launchweek.ai/content/aeo-geo) — search at the AI-engine layer

---

[⬅️ Backend & Data Overview](../backend-and-data/)
