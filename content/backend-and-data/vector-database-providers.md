# Vector Database Providers

Picking a vector database for a production AI app in 2026 is a different decision than it was in 2023. The "use Pinecone because it exists" default has been displaced by a fragmented market: pgvector inside Postgres has matured, Convex and Supabase ship vector primitives in their main DB, dedicated providers (Pinecone, Qdrant, Weaviate) compete on speed and operational characteristics, and Chroma occupies the "embedded / Python-first" niche.

This is the comparison: when each makes sense, what each costs, and how to pick.

For the conceptual primer on how vector search works (embeddings, distance metrics, index types), see the existing [Vector Databases](/backend-and-data/vector-databases) reference. This page is the provider-by-provider buyer's guide.

## Why this category fragmented

Three trends converged through 2025–2026:

- **Postgres got serious.** `pgvector` matured to the point where it handles 10M+ vectors at production latency. For most apps, a vector DB is now "another column in your existing Postgres."
- **All-in-one backends shipped vector primitives.** Convex and Supabase added vector search natively, removing the need for a separate dependency.
- **Dedicated providers diversified.** Pinecone optimized for managed simplicity; Qdrant for self-host performance; Weaviate for hybrid search; Chroma for embedded / dev-friendly.

Picking is now a real architecture decision rather than a default. The framework you pick shapes what your RAG pipeline can do — query latency, hybrid search, metadata filtering, scale ceiling, ops burden — and where it lives.

## The seven serious options

### pgvector (Postgres)

**What it is**: a Postgres extension that adds vector data types, distance operators (`<->`, `<=>`, `<#>`), and HNSW / IVFFlat index support. Your vectors live in your existing Postgres alongside the rest of your application data.

**Strengths**:
- Zero new infrastructure; if you have Postgres, you have a vector DB
- ACID transactions across vectors and other tables — write a vector + its metadata in a single transaction
- Mature ecosystem (Neon, Supabase, RDS, Crunchy Data all ship pgvector by default)
- Joins between vector queries and SQL — "find the 10 most similar docs by user X with status='published'" is one query
- Free if you already pay for Postgres

**Weaknesses**:
- Performance ceiling: ~10M vectors at acceptable latency on standard hardware; past that, dedicated providers pull ahead
- HNSW parameter tuning is your job
- Backup / restore of large vector tables is slow and storage-heavy

**Best for**: most apps. The 2026 default for any team already on Postgres. Especially good when vectors are tightly coupled to relational data (per-user vectors, multi-tenant filtering, etc.).

### Convex (with Vector Search)

**What it is**: Convex's reactive backend includes native vector search alongside the document database, real-time subscriptions, and serverless functions.

**Strengths**:
- One backend; no separate vector DB to operate
- Real-time queries — when you write a new vector, subscribed clients see updated results
- Type-safe end-to-end (TypeScript schemas across the stack)
- Generous free tier; cost-effective at small-medium scale

**Weaknesses**:
- Convex-specific lock-in — moving off requires re-architecting
- Smaller ecosystem than Postgres
- Performance ceiling lower than dedicated vector DBs at very large scale

**Best for**: TypeScript-first teams already on Convex (or considering it). The reactive subscription model pairs well with chat / live AI products.

See the [Convex AI Memory Tutorial](/backend-and-data/convex-ai-memory-tutorial) and [DIY AI Memory: pgvector + Convex](/ai-development/diy-ai-memory-pgvector-convex) for hands-on patterns.

### Supabase (pgvector under the hood)

**What it is**: Supabase ships pgvector pre-installed, plus a vector-specific dashboard, Edge Functions for embeddings, and helper SDKs.

**Strengths**:
- Same as pgvector, plus Supabase's auth, storage, and Edge Functions
- Best dev experience for "I want to ship fast" — fewer config decisions than raw Postgres
- Integrated with the rest of Supabase's stack

**Weaknesses**:
- Same scale ceiling as pgvector
- Locked to Supabase's pricing and operational decisions
- Edge Functions are great for short embedding calls, less great for batch embedding pipelines

**Best for**: indie SaaS that want a complete backend (auth + DB + storage + vectors) without ops work. Default if you're already on Supabase.

### Pinecone

**What it is**: the original managed vector database. Closed-source, fully hosted, billed per pod / serverless usage.

**Strengths**:
- Best-in-class scale: tested at 10B+ vectors in production
- Lowest-ops experience — you create an index, you query, you don't think about infrastructure
- Mature client SDKs across Python, TypeScript, Go
- Strong filtering and metadata support
- Serverless option (post-2023 launch) makes it cost-effective at small scale, not just enterprise

**Weaknesses**:
- Closed-source; you cannot run it in air-gapped environments
- Pricing is opaque past a certain point — the per-pod model can produce surprises
- Lock-in is real — Pinecone-specific query syntax doesn't move to other tools

**Best for**: teams that need scale (10M+ vectors) and want to outsource ops entirely. The 2026 default for AI products at $1M+ ARR with high vector volume.

### Qdrant

**What it is**: open-source vector database in Rust, with a managed cloud option (Qdrant Cloud) and excellent self-hosted story.

**Strengths**:
- Best self-hosted performance per dollar — Rust + custom indexes give it strong query latency
- Full-text + vector hybrid search via payload filtering
- Open-source — you can run it anywhere
- Active development, good documentation, mature ecosystem

**Weaknesses**:
- Smaller ecosystem than Pinecone (fewer one-click integrations)
- Self-hosting requires real ops (more than pgvector, less than running your own Postgres cluster)
- Cloud pricing is fair but less polished than Pinecone's

**Best for**: teams with self-hosting requirements (data residency, compliance, cost at scale), Rust shops, or anyone who wants to escape Pinecone's lock-in without giving up performance.

### Weaviate

**What it is**: open-source vector DB with native hybrid search (BM25 + vector) and built-in support for multiple embedding models.

**Strengths**:
- Hybrid search is first-class — BM25 keyword + vector similarity in a single query, with tunable weighting
- Multi-tenancy built in — strong for SaaS products needing per-customer isolation
- Open-source + managed cloud option
- Good GraphQL API for complex filtering

**Weaknesses**:
- More complex than Pinecone or pgvector — the feature surface takes time to learn
- Cloud pricing can be opaque
- Smaller ecosystem of language SDKs than Pinecone

**Best for**: teams that need hybrid search as a core feature (search-engine-like products, document QA, e-commerce), SaaS platforms with multi-tenant isolation requirements.

### Chroma

**What it is**: embedded / open-source vector DB with a Python-first API. Designed for "drop into a Python script and start querying" rather than for distributed production use.

**Strengths**:
- Easiest local development experience — `pip install chromadb` and you're querying
- Deep Python ecosystem integration (LangChain, LlamaIndex, etc.)
- Open-source, embeddable
- Simple API; minimal cognitive load

**Weaknesses**:
- Less mature for production scale than the alternatives
- Distributed mode (Chroma Cloud / clustered Chroma) is newer and less battle-tested
- TypeScript SDK exists but Python is clearly the primary

**Best for**: prototypes, Python-first agents, RAG experiments, single-node deployments. Less appropriate for production multi-tenant SaaS at scale.

### Vercel + Neon Postgres (pgvector)

**What it is**: Neon Postgres deployed via [Vercel Marketplace](/cloud-and-hosting/vercel) integration, with pgvector enabled by default.

**Strengths**:
- One-click setup from Vercel dashboard; auto-provisioned env vars
- Serverless Postgres scales to zero between queries — cost-effective at small scale
- Branching for dev/staging environments — clone DB state for testing prompts and pipelines
- All the pgvector benefits plus Vercel's developer ergonomics

**Weaknesses**:
- Same scale ceiling as pgvector
- Vendor stack lock-in (Vercel + Neon); switching has friction
- Cold starts on first query after idle (sub-second but observable)

**Best for**: Vercel-deployed Next.js apps that want pgvector with zero ops. Default when the rest of your stack is on Vercel.

---

## Side-by-side

| | pgvector | Convex | Supabase | Pinecone | Qdrant | Weaviate | Chroma | Neon (Vercel) |
|---|----------|--------|----------|----------|--------|----------|--------|---------------|
| **Type** | Extension | Backend | Backend | Managed | Self-host + cloud | Self-host + cloud | Embedded | Managed |
| **Open source** | Yes | No | Yes | No | Yes | Yes | Yes | Yes |
| **Realistic scale** | 10M | 5M | 10M | 10B+ | 1B+ | 1B+ | 1M | 10M |
| **Hybrid search** | Manual | Manual | Manual | Limited | Yes | Best | Limited | Manual |
| **Multi-tenant** | Manual | Yes | Manual | Yes | Yes | Best | No | Manual |
| **Ops burden** | Low | None | None | None | Medium | Medium | Low | None |
| **TS support** | Native | Best | Yes | Yes | Yes | Yes | Limited | Yes |
| **Python support** | Yes | Limited | Yes | Yes | Yes | Yes | Best | Yes |
| **Cost at small scale** | Free | Free tier | Free tier | $0-50/mo serverless | $0-50/mo cloud | Cloud has tier | Free | Free tier |
| **Best for** | Most apps already on Postgres | Convex teams | Supabase teams | Scale + low-ops | Self-host + perf | Hybrid search | Prototypes | Vercel teams |

---

## When to pick which

The pragmatic decision matrix:

| Job-to-be-done | Pick |
|----------------|------|
| **Already on Postgres** | **pgvector** — the 2026 default for most apps |
| **Already on Supabase** | **Supabase Vector** — pgvector with the dashboard polish |
| **Already on Convex** | **Convex Vector Search** — no new dependency |
| **Already on Vercel + need a DB** | **Neon (via Vercel Marketplace)** — pgvector with Neon's branching |
| **10M+ vectors and growing fast** | **Pinecone** — best-managed scale; pay for it |
| **Self-hosted required (compliance, data residency)** | **Qdrant** — best self-host performance per dollar |
| **Hybrid keyword + vector search is the product** | **Weaviate** — best-in-class hybrid |
| **Multi-tenant SaaS with per-customer isolation** | **Weaviate** or **Pinecone** with per-namespace |
| **Prototype / Python script** | **Chroma** — fastest to "querying vectors" |
| **AI agent memory layer** | **pgvector** if Postgres-shop, **Convex** if TS-shop |

If forced to pick a single default for new TypeScript work in 2026: **pgvector via Neon or Supabase**. For Python: **pgvector** (or Chroma for prototypes). For 10M+ vectors with no ops appetite: **Pinecone**.

---

## What changes the answer

Three factors shift the recommendation meaningfully:

- **Scale.** Under 1M vectors, pgvector wins almost every comparison on cost and ops. Past 100M, Pinecone or self-hosted Qdrant become the right answer.
- **Hybrid search needs.** If you genuinely need BM25 + vector with tunable weighting, Weaviate is the top of the list; everyone else requires application-side hybrid logic.
- **Operational risk tolerance.** A solo founder who cannot afford weekly DB tuning should not run self-hosted Qdrant or Weaviate. The managed options pay for themselves in saved time at small scale.

## Honest tradeoffs

- **pgvector is 80% of the wins for 20% of the ops complexity** — most "we need a real vector DB" arguments at small scale do not survive scrutiny.
- **Pinecone is the easy choice** — you stop thinking about it. The cost is real money at scale and the lock-in is permanent.
- **Self-hosted Qdrant or Weaviate is genuinely cheaper than Pinecone at 10M+ vectors** — but only if your team can sustain the ops load. Most cannot.
- **Convex / Supabase vector primitives are great for TypeScript indie hackers** — the integrated experience saves real time. Less great if vector search is your entire product.
- **Chroma is great for prototypes, less great for production** — when teams hit production traffic, they migrate off Chroma to one of the others.

## What none of these solve perfectly

- **Embeddings drift.** When you upgrade your embedding model, all your existing vectors are now in a different space. Re-embedding is your job; no provider handles this gracefully yet.
- **Cost at scale of complex hybrid queries.** Hybrid BM25 + vector is computationally expensive. At 100M+ documents with many filters, even Weaviate slows down meaningfully.
- **Cross-language consistency.** A vector DB used from both Python (for embedding pipelines) and TypeScript (for query API) requires duplicating types and validation logic. No provider has fully solved this.

## Cross-references

- **Conceptual primer**: [Vector Databases](/backend-and-data/vector-databases)
- **Hands-on RAG patterns**: [DIY AI Memory: pgvector + Convex](/ai-development/diy-ai-memory-pgvector-convex), [Convex AI Memory Tutorial](/backend-and-data/convex-ai-memory-tutorial)
- **Memory architecture decisions**: [AI Memory Architecture Decision Framework](/ai-development/ai-memory-architecture-decision-framework), [AI Agent Memory Systems](/ai-development/ai-agent-memory-systems)
- **Higher-level memory products**: [Mem0 Memory Integration](/ai-development/mem0-memory-integration), [Zep Temporal Memory](/ai-development/zep-temporal-memory), [AI App Memory Problem](/ai-development/ai-app-memory-problem)
- **Postgres**: [PostgreSQL](/backend-and-data/postgres), [Supabase](/backend-and-data/supabase), [Convex](/backend-and-data/convex)

## Further reading

- [pgvector on GitHub](https://github.com/pgvector/pgvector)
- [Pinecone](https://www.pinecone.io)
- [Qdrant](https://qdrant.tech)
- [Weaviate](https://weaviate.io)
- [Chroma](https://www.trychroma.com)
- [Convex Vector Search](https://docs.convex.dev/search/vector-search)
- [Supabase Vector](https://supabase.com/docs/guides/ai)
- [Neon (pgvector docs)](https://neon.tech/docs/extensions/pgvector)
