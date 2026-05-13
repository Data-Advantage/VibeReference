# Embedding Model Providers: OpenAI, Cohere, Voyage, Google, Mistral, Jina, Nomic, BGE, Mixedbread, NVIDIA, Snowflake Arctic

[⬅️ AI Development Overview](../ai-development/)

Every retrieval-augmented generation (RAG) stack, every semantic search feature, every "find similar" UI, and most agent memory systems share one upstream dependency: an embedding model. The model turns a chunk of text (or an image, or a code snippet) into a fixed-length vector so a vector database can index it and so cosine similarity can rank it. Pick the wrong embedding model and every downstream component — vector DB, reranker, LLM — fights an unwinnable battle against bad representations. Pick the right one and the rest of the pipeline mostly works.

The market in 2026 looks very different from 2023. OpenAI no longer wins by default. Voyage AI took meaningful share among RAG-serious teams. Google's Gemini embedding family is suddenly competitive. Cohere stayed strong on multilingual. The open-weight world (BGE, Mixedbread, Nomic, Stella, Arctic) closed most of the quality gap with hosted APIs and now wins outright on dollars-per-million-tokens for self-hosters. And a handful of specialty models — code embeddings (Voyage-code-3), legal (Voyage-law-2), finance (Voyage-finance-2), multimodal (Cohere Embed v4 multimodal, Jina-CLIP) — exist for the cases where general models leave quality on the table.

This page is distinct from [Vector Database Providers](../backend-and-data/vector-database-providers.md), [Reranking Providers](./reranking-providers.md), [Vector Databases](../backend-and-data/vector-databases.md), and [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md). Embedding models are the *input* to a vector DB — the step that turns text into a vector before storage. Rerankers act *after* retrieval. Most RAG stacks need all three: embedding model, vector DB, reranker.

## TL;DR Decision Matrix

| Provider / Model | Type | Dimensions | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| **Hosted commercial** | | | | | | |
| OpenAI `text-embedding-3-large` | Hosted API | 3072 (configurable down) | General English; broad ecosystem | $0.13 / M tokens | High | Default for most teams; everywhere SDKs |
| OpenAI `text-embedding-3-small` | Hosted API | 1536 (configurable down) | Cheap general English | $0.02 / M tokens | High | Cost-sensitive prototypes; high volume |
| Cohere Embed v4 (English) | Hosted API | 1536 / 384 (Matryoshka) | Long context (128K) + truncated dims | Pay-per-token | High | Long-document RAG; need short dim budget |
| Cohere Embed v4 (Multilingual) | Hosted API | 1536 / 384 | 100+ languages; long context | Pay-per-token | High | Multilingual RAG |
| Cohere Embed v4 Multimodal | Hosted API | 1024 | Image + text joint embedding | Pay-per-token | Medium | Multimodal retrieval (docs with figures) |
| Voyage `voyage-3-large` | Hosted API | 1024 (Matryoshka) | Highest benchmark on MTEB+BEIR English | Pay-per-token | High | Quality-first English RAG |
| Voyage `voyage-3` | Hosted API | 1024 | Strong general English | Pay-per-token | High | Production RAG default vs Cohere/OpenAI |
| Voyage `voyage-3-lite` | Hosted API | 512 | Cheap; competitive accuracy | Pay-per-token | High | Cost-sensitive; high volume |
| Voyage `voyage-code-3` | Hosted API | 1024 | Code retrieval | Pay-per-token | Very high | Code search; AI coding agents |
| Voyage `voyage-law-2` / `voyage-finance-2` | Hosted API | 1024 | Domain-tuned legal / finance | Pay-per-token | Medium | Legal / finance RAG |
| Voyage `voyage-multilingual-2` | Hosted API | 1024 | Multilingual | Pay-per-token | High | Multilingual; alternative to Cohere |
| Google `gemini-embedding-001` | Hosted API (Vertex AI) | 3072 (Matryoshka) | Multilingual; top MTEB scores | Pay-per-token | High | Google Cloud stack; multilingual |
| Google `text-embedding-005` | Hosted API (Vertex AI) | 768 | English Gecko-derived | Pay-per-token | Medium | English-only on Vertex |
| Mistral `mistral-embed` | Hosted API | 1024 | EU residency option; multilingual | Pay-per-token | High | EU / European AI stack |
| Jina `jina-embeddings-v3` | Hosted API + open weights | 1024 (Matryoshka) | Long context (8K); multilingual | Pay-per-token + free tier | Very high | Long context; multilingual; flexible |
| AWS Titan Embed v2 | Hosted (Bedrock) | 1024 / 512 / 256 | Bedrock-native | Bedrock pricing | Medium | Already on Bedrock |
| Azure OpenAI embeddings | Hosted (Azure) | same as OpenAI | OpenAI models w/ Azure compliance | Azure pricing | Medium | Azure / enterprise compliance |
| **Open-weight (self-host or via Hugging Face / Together)** | | | | | | |
| BGE-M3 (BAAI) | OSS multilingual + multi-functionality | 1024 | Dense + sparse + ColBERT-style in one model | Free OSS | Very high | Self-host multilingual; hybrid retrieval |
| BGE-large-en-v1.5 | OSS English | 1024 | Strong open baseline | Free OSS | Very high | Self-host English |
| BGE-en-icl | OSS in-context English | 4096 | Few-shot-style domain adaptation | Free OSS | High | In-context embedding tuning without fine-tune |
| Mixedbread `mxbai-embed-large-v1` | OSS | 1024 (Matryoshka) | Strong English; permissive license | Free OSS | Very high | Self-host with commercial license |
| Mixedbread `mxbai-embed-2d-large-v1` | OSS | 1024 (Matryoshka, 2D) | Truncate dims AND sequence length | Free OSS | Very high | Cost-aggressive self-host |
| Nomic `nomic-embed-text-v1.5` | OSS | 768 (Matryoshka) | Long context (8K); transparent training | Free OSS | Very high | Open data, open weights, open training |
| Nomic `nomic-embed-vision-v1.5` | OSS multimodal | 768 | Image + text shared space with nomic-embed-text | Free OSS | Very high | Open multimodal |
| Stella `stella_en_1.5B_v5` | OSS English | 8192 / 1024 / 512 | Top open-weight English MTEB; Matryoshka | Free OSS | Very high | Quality-max self-host |
| NVIDIA `NV-Embed-v2` | OSS English | 4096 | Strong English MTEB | Free OSS | Medium | Self-host on NVIDIA infra |
| Snowflake `arctic-embed-l-v2.0` | OSS multilingual | 1024 (Matryoshka) | Multilingual quality from Snowflake | Free OSS | High | Self-host multilingual |
| Sentence-Transformers `all-MiniLM-L6-v2` | OSS | 384 | Tiny; very fast on CPU | Free OSS | Very high | Prototypes; CPU-only; embedded use |
| **Multimodal / specialty** | | | | | | |
| OpenAI CLIP / OpenCLIP | OSS image-text | 512 / 768 | Generic image-text retrieval | Free OSS | High | Image search baselines |
| Jina-CLIP v2 | Hosted + OSS | 1024 | Multilingual image-text | Pay-per-token + free tier | High | Multilingual multimodal |
| ColBERT / ColBERTv2 / PLAID | OSS late-interaction | per-token | Highest-quality retrieval at index cost | Free OSS | High | Research-grade RAG; willing to pay storage |
| **Hosting-only paths** | | | | | | |
| Hugging Face Inference Endpoints | Managed inference for any OSS model | varies | Any OSS embedding model | Pay-per-use | High | Managed hosting of any OSS model |
| Together AI Embeddings | Hosted OSS models | varies | BGE, Mixedbread, etc., via API | Pay-per-token | High | One API for many OSS models |
| Fireworks AI Embeddings | Hosted OSS models | varies | Similar to Together | Pay-per-token | High | Alternative to Together |
| Replicate / Modal | Managed inference per model | varies | Any model; ad-hoc | Pay-per-second | High | Experimentation; small scale |

## What Embeddings Actually Do (and What They Don't)

An embedding is a fixed-length vector that captures semantic meaning. Documents that mean similar things land near each other in the vector space; documents that mean different things land far apart. Cosine similarity (or dot-product) measures the distance. That's the whole abstraction.

Embeddings are good at:
- **Semantic retrieval**: "find docs about cancellation policy" matches a doc titled "How to end your subscription" even with zero keyword overlap.
- **Topic clustering**: groups of related docs cluster together in the vector space; useful for content discovery, deduplication, and analytics.
- **Multilingual matching** (with a multilingual model): an English query matches a German document about the same topic.
- **Generalization to unseen queries**: BM25 needs the query word in the doc; embeddings don't.

Embeddings are bad at:
- **Exact-match retrieval**: looking up a SKU, an order ID, an email address. BM25 or exact lookup beats embeddings here.
- **Long-tail rare entities** the model didn't see often in training. Names, jargon, very niche acronyms can land in nearly random spots.
- **Numerical reasoning**: "find docs about Q3 2024 revenue above $500K" — embeddings don't reason about numbers.
- **Ranking nuanced precision**: bi-encoder embeddings (which is what almost everyone uses) can find roughly relevant docs but struggle to rank the top 5 precisely. That's the rerank step. See [Reranking Providers](./reranking-providers.md).

The honest expectation: an embedding model gets you to the right *neighborhood* of documents quickly. A reranker (or LLM) sharpens within that neighborhood.

## Decide Before You Pick

Seven questions before you compare vendors.

### 1. Hosted API or self-hosted?

- **Hosted API** (OpenAI, Cohere, Voyage, Google, Mistral, Jina hosted): you call an HTTP endpoint, they return a vector. Zero ops. Pay per token. Right for almost every team under ~50M embeddings/month.
- **Self-hosted OSS** (BGE, Mixedbread, Nomic, Stella, Arctic): you run inference on GPU (or CPU for smaller models). Right when volume makes hosted prohibitive, when data can't leave your network, or when you want to fine-tune the model for your domain.
- **Managed inference** (Hugging Face Inference Endpoints, Together AI, Fireworks, Modal, Replicate): a middle path — OSS model, managed infra. Right when you want a specific OSS model but don't want to run GPUs.

The rough breakpoint: at high volume (~100M+ tokens/month), self-hosting BGE / Mixedbread / Stella on your own GPUs typically wins on cost vs hosted APIs. Below that, hosted is cheaper than the engineering time to run it.

### 2. What languages are in your corpus?

- **English only**: any model works. Voyage `voyage-3-large`, OpenAI `text-embedding-3-large`, Stella, BGE-large-en, Mixedbread mxbai are top picks.
- **Major-language multilingual** (Spanish, French, German, Portuguese, Mandarin, Japanese, etc.): Cohere Embed v4 Multilingual, Voyage `voyage-multilingual-2`, Google `gemini-embedding-001`, BGE-M3, Snowflake Arctic Embed v2, Jina v3.
- **Long-tail languages**: BGE-M3 has the broadest open-weight coverage. Cohere covers 100+ languages. Test on your actual queries.
- **Cross-lingual** (English query → German doc): all multilingual models above handle this; quality varies. Cohere and BGE-M3 are reference points.

### 3. What's your context window need?

- **Short chunks (<512 tokens)**: any model works; sentence-transformers all-MiniLM is fine.
- **Medium chunks (512–2K tokens)**: most modern models (OpenAI text-embedding-3, Voyage v3, BGE) handle this.
- **Long chunks (2K–8K tokens)**: Jina v3 (8K), Voyage v3 (32K), Cohere v4 (128K), Nomic v1.5 (8K), Stella v5 (8K). Match the model's training context to your chunks; don't expect a 512-token-trained model to give meaningful long-doc embeddings.
- **Whole-document embedding** (8K+): Cohere Embed v4 with 128K context is the outlier. Most teams still chunk and embed chunks rather than embed whole documents.

Chunk size and embedding context are coupled. Don't pick a long-context model and then chunk to 256 tokens — the model is wasted. Don't pick a 512-token model and embed 4K-token chunks — the tail of each chunk is effectively dropped.

### 4. Dimensions, storage, and Matryoshka.

Vector storage cost = (# vectors) × (dim) × (bytes per dim). At a billion vectors, the difference between 384 dims (1.5GB) and 3072 dims (12GB) per copy matters. Most modern models now offer **Matryoshka representation learning** — you can truncate the vector to a smaller dimension and keep most of the quality.

- OpenAI text-embedding-3-large: native 3072; Matryoshka to 1024 / 512 / 256 with documented quality drop.
- Voyage v3-large: native 1024 with Matryoshka variants.
- Nomic, Mixedbread, Stella, Snowflake Arctic v2: all support Matryoshka.
- Google gemini-embedding: Matryoshka-trained.

Practical pattern: train your retrieval pipeline at full dimensions, then truncate to 512 or 256 for storage if storage cost dominates. Most teams keep 1024 dims as a default sweet spot.

Quantization is the other axis: float32 → int8 → binary. Binary quantization (1 bit per dim) cuts storage 32x with surprisingly modest quality loss when paired with rerank. See vector DB docs for support.

### 5. Domain shift.

- **Generic / open domain** (general web, support docs, product content): any general-purpose model works.
- **Code**: Voyage `voyage-code-3` is the leader; BGE-code, Jina v2-code are alternatives. Generic models are 10-20% worse on code retrieval benchmarks. If you're building an [AI Pair Programming](./ai-pair-programming.md) tool or [AI Code Review](./ai-code-review-tools.md) feature, use a code embedding model.
- **Legal**: Voyage `voyage-law-2`, fine-tuned BGE, or fine-tune your own. Generic models miss legal-specific terminology relationships.
- **Finance**: Voyage `voyage-finance-2`. Similar story.
- **Medical / biomed**: BioBERT, PubMedBERT, or fine-tune; specific medical embeddings beat generic ones substantially.
- **Multimodal (image + text)**: Cohere Embed v4 multimodal, Jina-CLIP v2, OpenCLIP, Nomic vision. See [Browser Automation & Scraping Tools](./browser-automation-scraping-tools.md) for image-bearing pipelines that need this.

If your domain has its own vocabulary (legal, medical, deeply technical), test domain-tuned variants before defaulting to general models. See [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md) if you need to fine-tune embeddings on your corpus.

### 6. What's your latency budget?

- Bulk re-indexing: latency doesn't matter; throughput does. Hosted APIs are typically fine; batch endpoints help.
- Online query embedding: typical hosted endpoint adds 50–200ms. Edge-hosted or in-region inference cuts that.
- Sub-50ms per-query: self-host on GPU close to your app, or use a small model (MiniLM, BGE-small) on CPU close to your app.

Query embedding latency is usually a small slice of total RAG latency (vector search + rerank + LLM generation dominate). Don't over-optimize this until you know it's a bottleneck.

### 7. Asymmetric vs symmetric retrieval.

- **Asymmetric**: short query embedded with one prompt, long doc embedded with another. The standard pattern for RAG. Most modern models (Voyage, Cohere v3+, BGE-M3, Nomic v1.5) explicitly support this — pass a task type or prefix at embed time (`query:` / `passage:` / `search_query:` / `search_document:`).
- **Symmetric**: query and doc embedded identically. Right for similarity tasks (find-similar, dedup, clustering).

Using the wrong mode silently drops 5–15% of retrieval quality. Read the model docs and use the right embedding prompt / task type.

## Provider Deep-Dives

### OpenAI Embeddings (`text-embedding-3-small` / `text-embedding-3-large`)

**What**: hosted API; the default for most teams since 2024.
**Strengths**: ubiquitous SDK; everywhere documented; reliable; Matryoshka dimensions; consistent quality across general English.
**Weaknesses**: no domain-tuned variants; multilingual quality lags behind Cohere / Voyage / Google; no recent model refresh in over a year as of 2026, while competitors shipped multiple generations.
**Pricing**: `text-embedding-3-small` $0.02/M tokens; `text-embedding-3-large` $0.13/M tokens.
**Use when**: starting a project and want the safest, best-documented option; already on OpenAI.

### Cohere Embed v4

**What**: hosted API; English + multilingual + multimodal variants. Long context (up to 128K tokens), Matryoshka dimensions (1536 / 384), strong multilingual coverage.
**Strengths**: long context is unmatched among hosted APIs; multilingual covers 100+ languages with high quality; multimodal variant embeds images and text into the same space; tight integration with [Cohere Rerank](./reranking-providers.md).
**Weaknesses**: less common than OpenAI in agent / RAG tutorials (less ecosystem momentum despite better tech).
**Use when**: long-document RAG; multilingual RAG; pairing with Cohere Rerank.

### Voyage AI (`voyage-3-large`, `voyage-3`, `voyage-3-lite`, `voyage-code-3`, `voyage-law-2`, `voyage-finance-2`, `voyage-multilingual-2`)

**What**: hosted API focused on highest-quality embeddings; the most aggressive ship cadence in the category.
**Strengths**: tops MTEB and BEIR benchmarks for English in 2026; domain-tuned variants (code, law, finance) are the only mainstream domain-tuned hosted embeddings; competitive pricing; pairs with Voyage Rerank.
**Weaknesses**: smaller team / smaller ecosystem; SDK less universal than OpenAI.
**Use when**: quality-first English RAG; any code retrieval workload; legal / finance RAG; willing to use a less famous vendor for measurable quality wins.

### Google Vertex AI Embeddings (`gemini-embedding-001`, `text-embedding-005`, `text-multilingual-embedding-002`)

**What**: hosted on Vertex AI; gemini-embedding-001 is the current flagship — Matryoshka dimensions (3072 native), strong multilingual, top MTEB results.
**Strengths**: enterprise-grade Google Cloud integration; strong multilingual; competitive accuracy; IAM and VPC-SC support; pairs with Gemini LLMs for end-to-end Google stack.
**Weaknesses**: Vertex SDK ergonomics are heavier than OpenAI / Voyage; pricing structure can surprise teams new to GCP.
**Use when**: already on Google Cloud; need multilingual quality with enterprise compliance.

### Mistral Embed

**What**: hosted API; EU-based with EU data residency option.
**Strengths**: EU residency story; reasonable quality for European languages; predictable pricing.
**Weaknesses**: not the top of any benchmark; less ecosystem than OpenAI / Voyage / Cohere.
**Use when**: EU residency required; already on Mistral for inference; European data-sovereignty needs.

### Jina Embeddings v3

**What**: hosted API with open-weight versions; multilingual, long context (8K), Matryoshka, task-specific prefixes (search, classification, clustering, etc.).
**Strengths**: open weights available; long context; multimodal sibling (Jina-CLIP); multiple task types in one model; generous free tier.
**Weaknesses**: smaller team; quality is strong but not always at the top of the leaderboard.
**Use when**: want hosted now with the option to self-host later; multilingual + long context combo.

### AWS Bedrock — Titan Embeddings v2

**What**: AWS-hosted embedding model in Amazon Bedrock with Matryoshka (1024 / 512 / 256).
**Strengths**: Bedrock-native; IAM-integrated; no separate vendor.
**Weaknesses**: not benchmark-leading; AWS-only.
**Use when**: already standardized on Bedrock for LLMs; want to keep one vendor.

### Azure OpenAI Embeddings

**What**: OpenAI's `text-embedding-3` models hosted on Azure with enterprise compliance, region pinning, private endpoints.
**Strengths**: OpenAI quality with Azure governance.
**Weaknesses**: requires Azure quota; lags OpenAI direct on rollout of new models.
**Use when**: enterprise Azure shop; data-handling rules require Microsoft compliance posture.

### BGE / BGE-M3 (BAAI FlagEmbedding)

**What**: open-source embedding family from BAAI. `bge-large-en-v1.5` for English; `bge-m3` for multilingual + multi-functionality (dense + sparse + ColBERT-style in one model); `bge-en-icl` for in-context tuning.
**Strengths**: best OSS family for self-host; strong benchmarks; permissive license; many sizes for latency/quality trade-offs; BGE-M3's multi-vector output enables hybrid retrieval from a single model.
**Weaknesses**: you operate inference; CPU possible at low scale, GPU at production.
**Use when**: self-host preferred; cost-conscious; OSS-first stack; want hybrid retrieval in one model (BGE-M3).

### Mixedbread (`mxbai-embed-large-v1`, `mxbai-embed-2d-large-v1`)

**What**: open-weight embedding models with permissive Apache-2.0 license; hosted API also available.
**Strengths**: strong English benchmarks; commercial-friendly license; backed by an active company with hosted option; 2D Matryoshka variant lets you truncate both dimensions and sequence length.
**Weaknesses**: smaller ecosystem.
**Use when**: OSS-first with strong benchmarks; want commercial-license flexibility; want a path to managed hosting from the same vendor.

### Nomic (`nomic-embed-text-v1.5`, `nomic-embed-vision-v1.5`)

**What**: open-weight embedding family with fully open training data and methodology. Text and vision models share a vector space.
**Strengths**: full transparency on training; long context (8K); Matryoshka; vision sibling for multimodal; Apache-2.0 license.
**Weaknesses**: not always at the top of MTEB; smaller commercial backing than Cohere / Voyage.
**Use when**: regulatory or research need for open training data; multimodal where text-vision must share a space; open-source-first stack.

### Stella (`stella_en_1.5B_v5` and smaller)

**What**: open-weight English embedding model series; consistently near the top of MTEB English in 2026.
**Strengths**: best open-weight English MTEB; Matryoshka (8192 / 1024 / 512); permissive license.
**Weaknesses**: 1.5B model needs real GPU; English-only.
**Use when**: quality-max self-host for English RAG; willing to run GPU inference.

### NVIDIA NV-Embed-v2

**What**: open-weight English embedding model from NVIDIA, strong MTEB scores.
**Strengths**: high quality; NVIDIA tooling for inference.
**Weaknesses**: large model; ecosystem narrower than BGE / Mixedbread.
**Use when**: on NVIDIA inference stack; want enterprise NVIDIA support.

### Snowflake Arctic Embed (`arctic-embed-l-v2.0`)

**What**: open-weight multilingual embedding from Snowflake; Matryoshka.
**Strengths**: strong multilingual quality; Apache-2.0 license; Snowflake-friendly if your data lives there.
**Weaknesses**: less popular outside the Snowflake ecosystem.
**Use when**: data warehouse is on Snowflake; want multilingual OSS embeddings.

### Sentence-Transformers (`all-MiniLM-L6-v2`, `all-mpnet-base-v2`, etc.)

**What**: classic OSS embedding models; the original lightweight sentence embeddings.
**Strengths**: tiny (`MiniLM` is 22M params); CPU-friendly; battle-tested; massive community.
**Weaknesses**: lower quality ceiling vs 2025–2026 models; English-focused; short context (512).
**Use when**: prototypes; CPU-only or embedded use; on-device retrieval; very low scale where modern models are overkill.

### CLIP / OpenCLIP / Jina-CLIP v2

**What**: image-text joint embedding models. OpenCLIP is the OSS lineage; Jina-CLIP v2 adds multilingual support.
**Strengths**: image-text retrieval in a shared vector space; widely tooled.
**Weaknesses**: text quality is worse than text-only embeddings; pure-text retrieval should use a text model.
**Use when**: multimodal corpora (docs with figures, product catalogs with images).

### ColBERT / ColBERTv2 / PLAID

**What**: late-interaction retrieval. Stores per-token embeddings; query-doc similarity uses MaxSim across tokens rather than a single vector dot-product.
**Strengths**: quality often exceeds bi-encoder + reranker setups; can act as retrieval + rerank in one step.
**Weaknesses**: storage is 5–20x larger; tooling is heavier; fewer hosted options.
**Use when**: research-heavy team; retrieval quality is the moat; storage cost is acceptable.

### Hugging Face Inference Endpoints

**What**: managed inference for any embedding model on the HF Hub.
**Strengths**: any OSS model with one click; auto-scaling; pay-per-use; private endpoints.
**Use when**: you want a specific OSS model (BGE, Mixedbread, Stella) without operating your own GPU infra.

### Together AI / Fireworks Embeddings

**What**: hosted OSS embedding models behind a unified API. Together hosts BGE, Mixedbread, m2-bert and others; Fireworks similar.
**Strengths**: one vendor for inference + embeddings + sometimes rerank; aggressive pricing on OSS models; latency is competitive.
**Use when**: already on Together or Fireworks for LLM inference; want consolidated billing.

### Replicate / Modal (per-model deployment)

**What**: per-model serverless inference. Pay per second of GPU time.
**Strengths**: experimentation; ad-hoc; cold start tolerable.
**Weaknesses**: not built for high-QPS production embedding workloads (cold starts hurt query path).
**Use when**: prototyping; bulk re-indexing rather than online query embedding.

## What Embedding Models Won't Fix

- **Bad chunking.** If you embed 4K-token chunks of mixed topics, no model untangles them. Chunk by semantic unit (paragraph, section, conversation turn) — not by arbitrary character count when you can help it.
- **Bad source data.** OCR garbage in, vector garbage out. Clean the input. See [Document Parsing / OCR Services](../backend-and-data/document-parsing-ocr-services.md).
- **Exact-match needs.** A SKU lookup wants a database, not a vector. Use the right tool.
- **Long-tail entities.** Names, jargon, niche acronyms get treated similarly by general embeddings. BM25 hybrid retrieval rescues this. See [Search Providers](../backend-and-data/search-providers.md).
- **Cross-domain shift.** A general model on a hyper-specialized corpus loses 10–20% accuracy. Domain-tune via Voyage's domain models, fine-tune via [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md), or add a reranker.
- **Numerical / temporal reasoning.** Embeddings don't compute. Filter structured metadata in the vector DB with explicit fields.

## Pragmatic Stack Patterns

### Pattern 1: Indie / startup RAG, English-only

- Embeddings: OpenAI `text-embedding-3-small` (cheap, ubiquitous) or Voyage `voyage-3-lite` (better quality at similar price)
- Vector store: pgvector / Pinecone / Qdrant
- Rerank: optional at first — add Cohere `rerank-3.5-lite` when quality plateaus
- LLM: GPT, Claude, or Gemini
- Cost: pennies per thousand queries at low volume

### Pattern 2: Production RAG, English, quality-first

- Embeddings: Voyage `voyage-3-large` or `voyage-3` for the quality / cost trade-off
- Vector store: Pinecone / Qdrant / Weaviate / pgvector at scale
- Rerank: Cohere Rerank or Voyage Rerank
- LLM: frontier model
- Cost: a few cents per query

### Pattern 3: Multilingual RAG

- Embeddings: Cohere Embed v4 Multilingual or Google `gemini-embedding-001` or BGE-M3 self-hosted
- Vector store: any
- Rerank: Cohere Rerank Multilingual or BGE-M3's own rerank head
- LLM: frontier multilingual model
- Cost: dependent on volume

### Pattern 4: Self-hosted / cost-driven at scale

- Embeddings: BGE-large-en, Mixedbread mxbai-embed-large, or Stella v5 on your own GPU pods (vLLM / TEI / TensorRT-LLM)
- Vector store: pgvector or Qdrant self-hosted
- Rerank: BGE Reranker self-hosted on the same GPU pool
- LLM: self-hosted Llama / Qwen via vLLM
- Cost: amortized GPU; lowest at >100M tokens/month

### Pattern 5: Code RAG (AI coding agent, code search)

- Embeddings: Voyage `voyage-code-3` or BGE-code or Jina v2-code
- Vector store: pgvector / Qdrant
- Rerank: Cohere Rerank or LLM-as-reranker for tricky queries
- LLM: code-strong frontier model
- See [Code Search & Intelligence Tools](./code-search-intelligence-tools.md) for the broader pattern

### Pattern 6: Multimodal RAG (text + image)

- Embeddings: Cohere Embed v4 Multimodal or Jina-CLIP v2 or Nomic vision + text pair
- Vector store: any vector DB supporting multi-modal embeddings (or store image and text vectors separately in the same DB)
- Rerank: Jina Rerank multimodal
- LLM: vision-capable frontier model

### Pattern 7: Long-document RAG (legal contracts, research papers, regulatory)

- Embeddings: Cohere Embed v4 (128K context) — embed whole sections or even whole short documents
- Vector store: any
- Rerank: domain-tuned (Voyage law / finance) where applicable, or Cohere Rerank
- LLM: long-context frontier model
- Pattern: hybrid — embed at multiple granularities (paragraph + section + whole doc); retrieve from each layer

### Pattern 8: EU residency / regulated workloads

- Embeddings: Mistral Embed (EU residency) or self-hosted BGE / Mixedbread in EU region
- Vector store: in-region (Qdrant, pgvector in EU)
- Rerank: self-host or Cohere with EU region
- LLM: Mistral or self-hosted

## Decision Framework

Pick by answering:

**1. Is your corpus English-only or multilingual?**
- English-only → Voyage v3-large, OpenAI text-embedding-3-large, BGE-large-en, Stella, Mixedbread mxbai
- Multilingual → Cohere Embed v4 Multilingual, Voyage multilingual-2, Google gemini-embedding-001, BGE-M3, Snowflake Arctic Embed v2

**2. Is your corpus domain-specialized (code, legal, finance, medical)?**
- Code → Voyage code-3 (top), BGE-code, Jina v2-code
- Legal → Voyage law-2 (top hosted), or fine-tune
- Finance → Voyage finance-2, or fine-tune
- Medical → BioBERT / PubMedBERT lineage, or fine-tune
- General → any model above

**3. What's your monthly token volume?**
- <10M / month → hosted; OpenAI / Voyage / Cohere on a free or low tier
- 10M–100M / month → hosted commercial; Voyage and OpenAI compete on cost; Cohere wins on long-context or multilingual
- >100M / month → consider self-host on BGE / Mixedbread / Stella; calculate TCO including GPU + ops

**4. Compliance and data residency?**
- Standard SaaS → any commercial vendor with a DPA
- EU residency required → Mistral; Cohere with EU regions; self-host
- Air-gapped → self-host BGE / Mixedbread / Stella
- Microsoft enterprise compliance → Azure OpenAI embeddings
- AWS shop → Bedrock Titan Embeddings or hosted models via Bedrock Marketplace

**5. Do you need image / multimodal embeddings?**
- Yes → Cohere Embed v4 Multimodal, Jina-CLIP v2, Nomic vision + text pair, or OpenCLIP self-hosted
- No → skip multimodal models; text-only is cheaper and higher quality

**6. What's your context window need?**
- Short chunks → any model
- 8K-token chunks → Jina v3, Voyage v3, Nomic v1.5, Stella v5
- 32K+ → Voyage v3 (32K) or Cohere v4 (128K)

**7. Is storage / dimensions a concern?**
- Yes → use a Matryoshka-trained model and truncate (Voyage, OpenAI, Cohere v4, Nomic, Mixedbread, Stella, Arctic, Google gemini-embedding)
- No → use native dimensions

## Verdict

**For most B2B SaaS founders adding RAG**:
- **Default first choice**: **Voyage `voyage-3` or `voyage-3-large`**. Best benchmarks among hosted English embeddings in 2026; competitive pricing; pairs with Voyage Rerank.
- **Established / OpenAI-stack default**: **OpenAI `text-embedding-3-large`**. Safer if your team already uses the OpenAI SDK everywhere.
- **Multilingual / long context**: **Cohere Embed v4 Multilingual**. The clearest leader for cross-lingual RAG and long-context embedding.
- **Self-host preference**: **BGE-large-en-v1.5** for English, **BGE-M3** for multilingual + hybrid retrieval, **Stella v5** for quality-max English, **Mixedbread mxbai** for commercial-license clarity.
- **Code retrieval**: **Voyage `voyage-code-3`**. Beats general models meaningfully on code benchmarks.
- **Domain (legal / finance)**: **Voyage `voyage-law-2` / `voyage-finance-2`**. The only mainstream domain-tuned hosted embeddings.
- **EU residency**: **Mistral Embed** or self-host BGE / Mixedbread in EU.
- **Google Cloud shop**: **`gemini-embedding-001`** on Vertex AI.
- **AWS shop**: **Bedrock Titan v2** if integration trumps benchmark; otherwise route to hosted Voyage / Cohere / OpenAI from Bedrock.

**Skip the embedding-model bake-off if**:
- You're at the prototype stage. Ship with OpenAI `text-embedding-3-small` or Voyage `voyage-3-lite`, measure retrieval on your eval set, swap later if needed.
- Your corpus is <10K documents and almost any model gets you to acceptable quality.
- You don't have an eval set. Build one first. Embedding choice without an eval set is vibes.

**The real win**: most teams ship a default OpenAI embedding from 2023, hit a quality ceiling, and start blaming the LLM. In 2026, swapping to Voyage `voyage-3-large` (English) or Cohere Embed v4 (multilingual) is a one-day code change for a measurable retrieval lift. Re-embedding the corpus is a one-time cost. The compounding return on better retrieval is permanent.

**Don't over-engineer the start, but do measure**: build a small eval set (50–200 query → relevant-doc pairs from your real users or your own labeling), then compare 2–3 models on that eval. The benchmark that matters is yours, not MTEB.

## See Also

- [Reranking Providers](./reranking-providers.md) — the next layer in the RAG pipeline
- [Vector Database Providers](../backend-and-data/vector-database-providers.md) — where embeddings are stored and searched
- [Vector Databases](../backend-and-data/vector-databases.md) — concept overview
- [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md) — fine-tune embeddings on your corpus
- [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md) — measure retrieval quality
- [LLM Observability Providers](./llm-observability-providers.md) — trace embedding + retrieval in production
- [AI Memory Systems Comparison](../backend-and-data/ai-memory-systems-comparison.md) — embeddings inside agent memory
- [AI Agent Memory Systems](./ai-agent-memory-systems.md) — memory architectures
- [DIY AI Memory with pgvector + Convex](./diy-ai-memory-pgvector-convex.md) — concrete memory build
- [Mem0 Memory Integration](./mem0-memory-integration.md) — managed memory provider
- [Search Providers](../backend-and-data/search-providers.md) — hybrid search context
- [Document Parsing / OCR Services](../backend-and-data/document-parsing-ocr-services.md) — input layer for RAG
- [Unstructured](./unstructured.md) — document chunking before embedding
- [Code Search & Intelligence Tools](./code-search-intelligence-tools.md) — code retrieval patterns
- [Tavily](./tavily.md) / [Exa](./exa.md) — web search retrieval (alternative input)
- VibeWeek: [RAG Implementation](https://www.vibeweek.com/6-grow/rag-implementation-chat) — end-to-end RAG pattern
- VibeWeek: [In-Product AI Search & Q&A](https://www.vibeweek.com/6-grow/in-product-ai-search-qa-chat) — product-side RAG
- VibeWeek: [LLM Quality Monitoring](https://www.vibeweek.com/6-grow/llm-quality-monitoring-chat) — measure retrieval in production
