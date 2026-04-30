# Reranking Providers & Models: Cohere Rerank, Voyage Rerank, Jina Rerank, BGE Rerank, Mixedbread, Pinecone Rerank, ColBERT, RankGPT

[⬅️ AI Development Overview](../ai-development/)

If your RAG-powered product is returning the right answers most of the time but missing on the harder queries — the long question, the multi-concept question, the question whose key term doesn't exactly appear in the relevant doc — your retrieval is bottlenecked on the embedding step. Pure embedding similarity (cosine / dot-product) is great at "find docs vaguely related to this query" and bad at "rank docs by which one most directly answers this exact question." The fix: a reranker. A reranker takes the top N results from your initial retrieval (embeddings, BM25, or hybrid) and re-orders them using a more sophisticated relevance model — typically a cross-encoder that processes the query AND each candidate document jointly rather than encoding them separately. The trade-off: rerankers are slower and more expensive than embeddings, but for the top-K-shown step the latency hit is usually worth the relevance improvement (often 10-40% on standard benchmarks; sometimes more on hard queries).

This is the missing layer in 80% of production RAG setups. Many teams ship embedding-only retrieval, hit a quality ceiling, and start blaming the LLM instead of fixing retrieval. Adding a reranker is usually 1-2 days of work for a 15-30% jump in answer quality with no model fine-tuning required.

This is distinct from [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md), [LLM Observability Providers](./llm-observability-providers.md), [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md), and [Vector Database Providers](../backend-and-data/vector-database-providers.md). Rerankers operate AFTER retrieval and BEFORE generation — they sit between the vector DB and the LLM in your RAG pipeline.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| **Hosted reranker APIs (commercial)** | | | | | |
| Cohere Rerank | Hosted API; Rerank 3.5 + multilingual model | Highest-recall English + multilingual; long context | Free tier; pay-per-call | Medium | Most production RAG defaults; multilingual support |
| Voyage Rerank | Hosted API; rerank-2 + rerank-2-lite | Strong English performance; competitive pricing | Pay-per-token | High | Production RAG with cost-conscious pricing |
| Jina Rerank | Hosted API; multilingual + multimodal options | Multilingual + multimodal (image rerank) | Pay-per-call | High | Multilingual / multimodal use cases |
| Mixedbread (mxbai) | Hosted API; OSS models also | Open-weight rerank models with hosted option | Pay-per-call; OSS free | Very high | Want self-host option in case of need |
| Pinecone Rerank | Bundled with Pinecone Inference | Bundled rerank if you're on Pinecone | Bundled in Pinecone usage | High | Already on Pinecone Serverless |
| Together AI Rerank | Bundled with Together's RAG stack | Cheap; pairs with Together's hosted models | Pay-per-call | High | Already on Together for inference |
| Hugging Face Inference Endpoints | Host any reranker model | Any model from HF | Pay-per-use | High | Self-managed deployment of OSS rerankers |
| Vespa Rank Profile | Search engine native ranking | Hybrid ranking + rerank as one pipeline | Self-host or Vespa Cloud | Medium | Search-engine-as-stack philosophy |
| **Open-source reranker models** | | | | | |
| BGE Reranker (BAAI) | OSS cross-encoder series | Strong open-source baseline; many sizes | Free OSS | Very high | Self-host; cost-sensitive; OSS-first |
| BGE-M3 Reranker | OSS multilingual reranker | Multilingual + multimodal | Free OSS | Very high | Self-host multilingual |
| Mixedbread mxbai-rerank-v2 | OSS reranker | Strong open weights with permissive license | Free OSS | Very high | Self-host with commercial-friendly license |
| Jina Reranker (open) | OSS variant of Jina's reranker | Open-weight option from Jina | Free OSS | High | Want Jina pattern but self-hosted |
| ColBERT / ColBERTv2 / PLAID | Late-interaction retrieval (not just rerank) | Highest quality retrieval-as-reranking | Free OSS | High | Research-heavy teams; high-stakes RAG |
| Cross-encoder (sentence-transformers) | Classic OSS cross-encoders | Lightweight; many MS-MARCO-trained variants | Free OSS | Very high | Self-host on CPU possible at low scale |
| **LLM-as-reranker** | | | | | |
| RankGPT / GPT-as-judge / Claude-as-judge | Use a general LLM to rerank | Highest quality on novel domains; expensive | Per-LLM-call | Medium | Evaluation; small high-stakes use cases |
| Llama Index reranker (LLM rerank) | LangChain / LlamaIndex utility | Wraps any LLM as a reranker | Per-LLM-call | High | Existing LLM stack; experimental |
| Patronus Lynx Rerank | Eval-focused | Rerank tied to grounding eval | Custom | Low | Hallucination-sensitive RAG |
| **Specialized** | | | | | |
| ZeroEntropy | Newer entrant; commercial reranker | New / experimental; check current state | Pay-per-call | Medium | Worth evaluating in 2026 |
| Aleph Alpha Luminous Rerank | EU-based reranker | EU data residency option | Custom | Low | EU-residency-required workloads |
| Boomerang (rerank.ai) | Specialized reranker hosting | Multiple model options through one API | Pay-per-call | Medium | Want abstraction over multiple rerankers |

## Why Reranking Helps (and the Failure It Fixes)

Embeddings are bi-encoders: they encode query and documents independently into vectors, then compare via cosine / dot-product. This is fast and scales to millions of documents — but the comparison loses information that matters for ranking.

Rerankers are typically cross-encoders: they take (query, document) pairs and process them together through an attention-based model that can attend to query tokens AND document tokens simultaneously. This is dramatically more accurate at "is this document a direct answer to this query?" — but slower, since you can't pre-compute embeddings; every query × candidate pair runs through the model.

The standard pipeline:
1. **Initial retrieval** (cheap, fast): embedding ANN search OR BM25 keyword OR hybrid → top 50-200 candidates
2. **Rerank** (expensive, slower): cross-encoder ranks the top 50-200 → top 5-20
3. **Generation** (most expensive): LLM uses top 5-20 reranked docs to answer

Without reranking, you're forced to choose between:
- **Top-K too small**: miss the right doc because embedding similarity didn't surface it
- **Top-K too large**: stuff too much into the LLM context, increasing cost + latency + hallucination
With reranking, you can retrieve 100-200 candidates cheaply (high recall) and prune to 5-20 high-precision results (high precision). Both retrieval recall AND post-rerank precision improve.

Common quality wins from adding a reranker:
- **+10-25% nDCG@10** on standard retrieval benchmarks (BEIR, MS MARCO)
- Subjective answer quality improves on hard / multi-concept queries
- Less context-window pressure on the LLM (can pass top-5 instead of top-20)
- Lower hallucination rate (fewer irrelevant docs in context = less misleading info)
- Better citation accuracy (the cited doc is actually the relevant one)

## Decide Before You Pick

Six honest questions.

### 1. Have you exhausted embedding tuning?
- Are you using a domain-appropriate embedding model? (`text-embedding-3-large` for OpenAI; Cohere Embed v3; Voyage embed-3; BGE)
- Have you tried hybrid retrieval (semantic + BM25 keyword)?
- Have you sized your chunks correctly?
- If yes: reranking is the next lever.
- If no: tune embeddings + chunking first; sometimes you don't even need a reranker.

### 2. What's your latency budget?
- <100ms additional retrieval latency: smaller / faster reranker (Cohere `rerank-3.5-lite`, Voyage `rerank-2-lite`, BGE-base self-hosted on CPU) or rerank only top-25
- 100-500ms: standard hosted reranker on top 50-100
- >500ms acceptable: full reranker pipeline; LLM-as-reranker possible for high-stakes

### 3. What languages are your queries / documents?
- English only: any reranker works; pick on quality + price
- Major-language multilingual: Cohere Rerank multilingual; Jina; BGE-M3
- Long-tail languages: BGE-M3 has the broadest coverage among OSS

### 4. What's your cost ceiling?
- Hobby / very low volume: free OSS self-hosted (BGE on a CPU container) or free tier on hosted (Cohere)
- Mid-volume production: hosted commercial — Cohere or Voyage typically wins on quality/price
- High-volume: self-host (BGE / Mixedbread) on GPU or use Together / Hugging Face Inference Endpoints
- Enterprise / regulated: self-host or contracted enterprise tier

### 5. Are you on a vector DB with bundled rerank?
- Pinecone Inference Reranker exists — convenient if you're on Pinecone
- Vespa has built-in rank profiles for hybrid + rerank
- Otherwise: separate reranker service is the norm

### 6. What's your domain shift?
- Generic / open-domain: any standard reranker works
- Highly domain-specific (legal, medical, financial, very technical): consider domain-tuned rerankers (BGE has specific medical/legal variants; Cohere has finance-tuned options) OR fine-tune your own
- See [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md) for embedding/reranker fine-tuning paths

## Provider Deep-Dives

### Cohere Rerank
**What**: hosted API; current model `rerank-3.5` + multilingual variants. Most teams' default rerank choice as of 2026.
**Strengths**: best general-purpose accuracy in many independent benchmarks; multilingual coverage (100+ languages); long context per document; fast inference; high availability.
**Weaknesses**: hosted-only; per-call cost adds up at high volume; lock-in to Cohere's pipeline.
**Pricing**: free dev tier; pay-per-call for production. Per-search-unit pricing (a unit = query + N documents up to a limit).
**Use when**: production RAG default. If you're starting and don't know which to pick, Cohere is the safest first choice.

### Voyage Rerank
**What**: hosted API; `rerank-2` + `rerank-2-lite`. Strong English performance.
**Strengths**: competitive pricing; strong English benchmarks; tight integration with Voyage embeddings (which are also strong).
**Weaknesses**: less multilingual coverage than Cohere; smaller team / smaller community.
**Use when**: cost-sensitive English RAG; especially if you're already on Voyage embeddings.

### Jina Rerank
**What**: hosted API + open-weight variants. Multilingual + multimodal (image-text rerank).
**Strengths**: only meaningful multimodal reranker (rerank docs that include images); broad language coverage.
**Use when**: multilingual or multimodal RAG.

### Mixedbread (mxbai)
**What**: hosted API + open-weight cross-encoder rerank models with permissive licenses.
**Strengths**: dual-mode: hosted now, self-host later (or vice versa); open weights with strong benchmarks; commercial-friendly Apache-2.0 license on most models.
**Use when**: want flexibility between hosted and self-host without changing the model family.

### Pinecone Rerank (Inference)
**What**: rerank as a feature within Pinecone's hosted service. Pinecone Inference Reranker offers `bge-reranker-v2-m3` and other models.
**Strengths**: zero new vendor if you're on Pinecone; tight integration with the vector store.
**Weaknesses**: less flexibility on model choice; locks more of your stack into Pinecone.
**Use when**: Pinecone Serverless customer; want to consolidate vendors.

### Together AI Rerank
**What**: rerank service within Together's broader RAG / inference stack.
**Use when**: already on Together for LLM inference + embeddings.

### Hugging Face Inference Endpoints
**What**: deploy any HF reranker model on managed inference endpoints.
**Strengths**: full control of model choice; OSS model catalog; auto-scaling; pay-per-use.
**Use when**: want a specific OSS reranker (BGE, Jina-open, mxbai) without operating your own GPU infra.

### Vespa
**What**: search engine with native ranking + reranking via "rank profiles." Pipeline reranking built in.
**Strengths**: highly performant; complex ranking pipelines (BM25 → embedding → rerank → optional LLM) in one engine.
**Weaknesses**: heavier infrastructure than hosted APIs; learning curve.
**Use when**: search engine is core to your product; you want hybrid retrieval + rerank as one stack.

### BGE Reranker (BAAI / FlagEmbedding)
**What**: open-source cross-encoder rerank models from BAAI. Multiple sizes (`bge-reranker-base` / `large` / `v2-m3` for multilingual).
**Strengths**: best open-source reranker family for English + multilingual; permissive license; many size options for latency/quality trade-offs.
**Weaknesses**: you operate inference (CPU at low scale; GPU at production scale).
**Use when**: self-host preferred; cost-conscious; OSS-first stack.

### BGE-M3 Reranker
**What**: multilingual variant of BGE family.
**Strengths**: broad language coverage; multimodal options.
**Use when**: self-hosted multilingual rerank.

### Mixedbread mxbai-rerank-v2
**What**: open-weight reranker with permissive Apache-2.0 license.
**Strengths**: strong English benchmarks; commercial-friendly license; backed by an active company (which may matter for support).
**Use when**: OSS-first with strong benchmarks; want long-term commercial use without licensing risk.

### Cross-encoder (sentence-transformers)
**What**: classic OSS cross-encoders trained on MS-MARCO. The original lightweight rerankers.
**Strengths**: very small models; can run on CPU; battle-tested.
**Weaknesses**: lower quality ceiling than newer rerankers; English-focused.
**Use when**: very low-scale self-host; CPU-only infra; experimentation.

### ColBERT / ColBERTv2 / PLAID
**What**: late-interaction retrieval — not strictly a reranker, but a different paradigm where you store per-token embeddings and do MaxSim during retrieval. Often produces rerank-quality results in a single retrieval step.
**Strengths**: highest retrieval quality on hard benchmarks; one-stop retrieval+rerank in some setups.
**Weaknesses**: index size much larger (per-token embeddings); operational complexity higher; fewer hosted options.
**Use when**: research-heavy team; high-stakes RAG where retrieval quality is the moat.

### LLM-as-reranker (RankGPT, Claude-rerank, etc.)
**What**: use a general-purpose LLM to score / rank candidates.
**Strengths**: highest possible quality on novel domains; can incorporate reasoning; usable when no domain-tuned reranker exists.
**Weaknesses**: 10-100x more expensive than dedicated rerankers; latency much higher; reproducibility lower.
**Use when**: high-stakes / low-volume queries (e.g., legal research, medical decision support); evaluation of dedicated rerankers; novel domain where no tuned model exists.

### Patronus Lynx Rerank
**What**: rerank tied to grounding / hallucination evaluation.
**Use when**: hallucination-sensitive RAG where rerank scoring needs to align with grounding.

## What Reranking Won't Fix

- **Bad retrieval upstream.** If your top-200 candidates don't include the right doc, rerank can't surface it. Fix retrieval first (embeddings, BM25, hybrid, chunking).
- **Bad chunks.** If a relevant fact is split across two chunks, no reranker reunites them. Fix chunking.
- **Wrong question / right answer.** If the LLM is asking the right question of the wrong corpus, rerank doesn't fix that.
- **Hallucination from the LLM.** Reranking improves what the LLM SEES. It doesn't fix the LLM ignoring what it sees.
- **Domain shift the reranker hasn't been trained on.** Generic rerankers do generic well; for highly specialized domains, fine-tune.

## Pragmatic Stack Patterns

### Pattern 1: Indie / startup RAG, English-only
- Embeddings: OpenAI `text-embedding-3-small` or Cohere `embed-english-v3`
- Vector store: pgvector / Pinecone / Qdrant
- Initial retrieval: top 50 by embedding similarity (hybrid with BM25 if available)
- Rerank: Cohere Rerank `rerank-3.5-lite` (free tier) on top 50 → top 5
- Generate: LLM with top 5 docs in context
- Cost: <$0.01 per query at low volume

### Pattern 2: Mid-market RAG, multilingual
- Embeddings: Cohere `embed-multilingual-v3` or OpenAI `text-embedding-3-large`
- Initial retrieval: hybrid (embedding + BM25) top 100
- Rerank: Cohere Rerank multilingual on top 100 → top 10
- Generate: LLM
- Cost: ~$0.01-0.05 per query

### Pattern 3: Self-hosted, cost-driven
- Embeddings: BGE `bge-large-en-v1.5` or self-hosted Mixtral embeddings
- Vector store: pgvector or Qdrant self-hosted
- Initial retrieval: top 100
- Rerank: BGE `bge-reranker-large` self-hosted on a small GPU
- Generate: self-hosted Llama / Qwen via vLLM
- Cost: amortized GPU time; lowest at scale

### Pattern 4: High-stakes legal / medical / financial RAG
- Embeddings: domain-fine-tuned (Cohere Embed fine-tuned, or OpenAI fine-tuned)
- Initial retrieval: hybrid; top 200
- Rerank: domain-tuned reranker OR LLM-as-reranker (Claude / GPT) on top 50
- Generate: frontier LLM with citation + grounding requirements
- Eval: high; per-query cost less important than accuracy
- Cost: $0.10-$1+ per query; volume is low

### Pattern 5: Latency-critical chat product
- Embeddings: cached when possible
- Initial retrieval: top 25 (smaller candidate pool)
- Rerank: smaller / faster reranker (Cohere `rerank-3.5-lite` or self-hosted BGE-base)
- Generate: streaming response
- Total latency budget: <800ms for first token

### Pattern 6: Multimodal RAG (text + images)
- Embeddings: multimodal (CLIP, Jina-CLIP, Cohere multimodal)
- Initial retrieval: top 50 across modalities
- Rerank: Jina Rerank multimodal on top 50
- Generate: vision-capable LLM (GPT-4o, Claude Sonnet, Gemini)

## Decision Framework

Pick by answering:

**1. Are you on a vector DB with bundled rerank?**
- Pinecone: try Pinecone Inference Reranker first; switch to standalone if quality is insufficient
- Vespa: use rank profiles
- Otherwise: continue

**2. What's your scale?**
- <10K queries/day: hosted (Cohere / Voyage) free tier or low-tier
- 10K-1M/day: hosted commercial; volume-tier pricing
- >1M/day: self-host on GPU OR enterprise contract; calculate per-query cost vs. self-host TCO

**3. What's your language coverage?**
- English only: Voyage Rerank; Cohere Rerank; BGE
- Multilingual: Cohere Rerank multilingual; BGE-M3; Jina
- Multimodal: Jina

**4. Compliance / data residency?**
- Standard: any commercial vendor with DPA
- EU residency required: Aleph Alpha; Cohere with EU regions; self-host
- Air-gapped / regulated: self-host BGE / Mixedbread

**5. What's your latency budget?**
- <50ms additional: smaller/lite models; rerank smaller candidate pool
- 50-200ms: standard hosted
- >200ms OK: full pipeline + larger pool

**6. Domain shift?**
- Generic: standard rerankers
- Heavy domain shift: fine-tune (see [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md)) or LLM-as-reranker

## Verdict

**For most B2B SaaS founders adding rerank to their RAG**:
- **Default first choice**: **Cohere Rerank**. Easiest integration, best benchmarks, generous free tier. Most teams ship with this and never need to switch.
- **Cost-sensitive English**: **Voyage Rerank** as a strong alternative.
- **Self-host preference**: **BGE Reranker** (large or v2-m3) — best OSS family.
- **Already on Pinecone**: try **Pinecone Inference Rerank** to consolidate vendors.
- **Multilingual / multimodal**: **Jina Rerank** or **Cohere Multilingual**.
- **Highest-stakes / low-volume**: consider **LLM-as-reranker** (Claude / GPT) — expensive but quality bar is highest.

**Skip rerank entirely if**:
- You're at the prototype / first-month stage; ship retrieval + LLM first; add rerank when retrieval quality is the bottleneck
- Your retrieval already returns the right doc in top-3 reliably (rare; you probably haven't measured)
- Your domain is so narrow that exact-match BM25 or fine-tuned embeddings work alone
- Latency budget is so tight that you can't afford the ~50-200ms

**The real win**: most teams ship embedding-only retrieval, hit a quality wall, and start blaming the LLM. Reranking is the missing layer in 80% of those setups. 1-2 days of integration; 15-30% lift on standard quality benchmarks; usually a clear win.

**Don't over-engineer**. Cohere Rerank with a free trial → measure on your eval set → ship if quality jumps. Don't pre-pick a self-hosted BGE deployment for a 100-query-per-day product.

## See Also

- [Vector Database Providers](../backend-and-data/vector-database-providers.md) — store + retrieve embeddings
- [Vector Databases](../backend-and-data/vector-databases.md) — concept overview
- [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md) — eval rerank quality
- [LLM Observability Providers](./llm-observability-providers.md) — trace retrieval + rerank in production
- [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md) — fine-tune embeddings or rerankers for domain
- [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md) — runtime defense layer
- [Agent Reliability & Production Operations](./agent-reliability-production-operations.md) — production ops
- [Prompt Management Platforms](./prompt-management-platforms.md) — prompt-as-artifact discipline
- [AI Agent Memory Systems](./ai-agent-memory-systems.md) — memory often retrieved + reranked
- [Mem0 Memory Integration](./mem0-memory-integration.md) — memory provider
- [Search Providers](../backend-and-data/search-providers.md) — adjacent: full-text + hybrid search
- [Document Parsing / OCR Services](../backend-and-data/document-parsing-ocr-services.md) — input layer for RAG
- [Unstructured](./unstructured.md) — document chunking
- [Tavily](./tavily.md) / [Exa](./exa.md) — web search retrieval (alternative input)
- VibeWeek: [RAG Implementation](https://www.vibeweek.com/6-grow/rag-implementation-chat) — RAG end-to-end pattern
- VibeWeek: [In-Product AI Search & Q&A](https://www.vibeweek.com/6-grow/in-product-ai-search-qa-chat) — product-side RAG pattern
- VibeWeek: [LLM Quality Monitoring](https://www.vibeweek.com/6-grow/llm-quality-monitoring-chat) — measure rerank quality in production
- VibeWeek: [LLM Cost Optimization](https://www.vibeweek.com/6-grow/llm-cost-optimization-chat) — rerank cost is part of total
