# Vector Databases

A vector database stores, indexes, and queries high-dimensional vectors — numerical representations of text, images, audio, or any unstructured data. They power the retrieval layer behind RAG (Retrieval-Augmented Generation), semantic search, recommendation systems, and any AI application that needs to find "similar" content rather than exact matches.

Traditional databases find rows where `status = 'active'`. Vector databases find rows where the meaning is closest to your query. That difference is why every serious AI application needs one.

## How Vector Search Works

The core operation is similarity search: given a query vector, find the nearest vectors in the database. Here is the typical flow:

1. **Generate embeddings** — pass text (or images) through an embedding model to get a fixed-length vector of floating-point numbers
2. **Store vectors** — insert those vectors into the database alongside metadata (source text, URLs, timestamps)
3. **Query** — convert your search query into a vector using the same model, then find the closest stored vectors
4. **Return results** — the database returns the most similar items ranked by distance

### Distance Metrics

Vector databases support different ways to measure "closeness":

| Metric | What It Measures | Best For |
|--------|-----------------|----------|
| **Cosine similarity** | Angle between vectors (ignores magnitude) | Text embeddings, most NLP tasks |
| **Euclidean (L2)** | Straight-line distance | Image features, spatial data |
| **Dot product** | Combined magnitude and direction | Normalized embeddings, ranking |

Cosine similarity is the default choice for text-based applications. If your embeddings come from OpenAI, Claude, or similar models, start with cosine.

### Indexing Algorithms

Brute-force comparison against every vector is accurate but slow. Vector databases use approximate nearest neighbor (ANN) algorithms to trade a small amount of accuracy for massive speed gains:

- **HNSW (Hierarchical Navigable Small World)** — the most popular algorithm. Builds a layered graph for fast traversal. High recall, good for most workloads. Used by Qdrant, Weaviate, pgvector, and Pinecone.
- **IVFFlat (Inverted File with Flat compression)** — partitions vectors into clusters, then searches only relevant clusters. Faster to build than HNSW, lower recall. Supported by pgvector.
- **ScaNN / DiskANN** — Google and Microsoft research algorithms optimized for billion-scale datasets. Used internally by managed services.

For datasets under 10 million vectors, HNSW with default parameters works well. Tune `ef_construction` and `m` parameters only when you hit performance ceilings.

## Choosing a Vector Database

The right choice depends on your scale, infrastructure, and whether you want managed or self-hosted.

### Comparison Table

| Database | Type | Hosting | Best For | Embedding Dimensions |
|----------|------|---------|----------|---------------------|
| **pgvector** | Postgres extension | Self-hosted / Supabase | Teams already on Postgres, < 10M vectors | Any |
| **Pinecone** | Managed service | Fully managed (serverless) | Zero-ops, fast time-to-market | Up to 20,000 |
| **Qdrant** | Purpose-built | Self-hosted or managed cloud | High performance, advanced filtering | Any |
| **Weaviate** | Purpose-built | Self-hosted or managed | Hybrid search (BM25 + vector) | Any |
| **Chroma** | Embedded / managed | Local or Chroma Cloud | Prototyping, small datasets, Python-native | Any |
| **Milvus / Zilliz** | Purpose-built | Self-hosted or Zilliz Cloud | Enterprise scale, billions of vectors | Any |

### Decision Guide

**Use pgvector if** you already run Postgres (or Supabase) and your dataset is under 10 million vectors. No new infrastructure, no new vendor. Your data stays in one place.

**Use Pinecone if** you want zero operational overhead and your team is focused on shipping features, not managing databases. Serverless pricing scales from prototype to production without capacity planning.

**Use Qdrant if** you need fast filtered search — querying vectors while filtering by metadata fields like `category`, `date`, or `user_id`. Rust-based, efficient on resources, strong free tier.

**Use Weaviate if** you need hybrid search that combines keyword matching (BM25) with vector similarity in a single query. Useful when exact keyword matches matter alongside semantic relevance.

**Use Chroma if** you are prototyping locally or building a Python-heavy LLM pipeline. Embedded mode means zero setup — just `pip install chromadb`.

**Use Milvus if** you are operating at enterprise scale with billions of vectors, need GPU acceleration, or require distributed high-availability deployments.

## Generating Embeddings

Before you can store vectors, you need an embedding model to convert text into numbers. Here are the most common options:

| Model | Provider | Dimensions | Cost |
|-------|----------|-----------|------|
| `text-embedding-3-small` | OpenAI | 1,536 | $0.02 / 1M tokens |
| `text-embedding-3-large` | OpenAI | 3,072 | $0.13 / 1M tokens |
| `voyage-3` | Voyage AI | 1,024 | $0.06 / 1M tokens |
| Built-in models | Ollama (local) | Varies | Free (self-hosted) |

### OpenAI Embeddings

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });
  return response.data.map(item => item.embedding);
}

// Single text
const [vector] = await embed(['How do vector databases work?']);
// vector is a number[] with 1,536 dimensions

// Batch (more efficient)
const vectors = await embed([
  'Introduction to RAG',
  'Building semantic search',
  'AI-powered recommendations',
]);
```

Always use the same embedding model for indexing and querying. Mixing models produces incompatible vector spaces and garbage results.

## pgvector with Supabase

If you already use Supabase, pgvector is the fastest path to vector search. No new services, no new billing — just enable the extension.

### Setup

Enable pgvector in the Supabase dashboard under Database > Extensions, or run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Create a Table with Vector Column

```sql
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536)
);

-- HNSW index for fast cosine similarity search
CREATE INDEX ON documents
  USING hnsw (embedding vector_cosine_ops);
```

The `VECTOR(1536)` type stores a 1,536-dimensional vector. Match this to your embedding model's output dimensions.

### Insert Documents

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function insertDocument(content: string, embedding: number[]) {
  const { error } = await supabase.from('documents').insert({
    content,
    metadata: { source: 'blog', indexed_at: new Date().toISOString() },
    embedding,
  });
  if (error) throw error;
}
```

### Similarity Search with RPC

Create a Postgres function for similarity search:

```sql
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.78,
  match_count INT DEFAULT 10
) RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
) LANGUAGE SQL STABLE AS $$
  SELECT
    id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

Call it from your application:

```typescript
async function search(query: string) {
  const [queryVector] = await embed([query]);

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryVector,
    match_threshold: 0.75,
    match_count: 5,
  });

  if (error) throw error;
  return data; // [{ id, content, metadata, similarity }]
}

const results = await search('How do I deploy a Next.js app?');
```

The `<=>` operator computes cosine distance. The function converts it to similarity (1 - distance) so higher scores mean better matches.

## Pinecone

Pinecone is a fully managed vector database. No infrastructure to provision, no indexes to tune. You create an index, push vectors, and query.

### Setup

```bash
npm install @pinecone-database/pinecone
```

### Create an Index and Query

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Create a serverless index (one-time)
await pc.createIndex({
  name: 'articles',
  dimension: 1536,
  metric: 'cosine',
  spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
});

const index = pc.Index('articles');

// Upsert vectors
await index.upsert([
  {
    id: 'article-1',
    values: embedding, // number[1536]
    metadata: { title: 'Getting Started with RAG', category: 'ai' },
  },
  {
    id: 'article-2',
    values: embedding2,
    metadata: { title: 'Semantic Search Patterns', category: 'search' },
  },
]);

// Query with metadata filtering
const results = await index.query({
  vector: queryEmbedding,
  topK: 5,
  includeMetadata: true,
  filter: { category: { $eq: 'ai' } },
});

// results.matches = [{ id, score, metadata }]
```

Pinecone handles sharding, replication, and scaling automatically. The serverless tier charges per read/write unit — good for variable workloads.

## Qdrant

Qdrant is a Rust-based vector database built for speed and advanced filtering. It supports payload-based filtering (query by metadata fields) directly during vector search, which avoids the post-filter performance penalty found in some alternatives.

### Setup

```bash
# Run locally with Docker
docker run -p 6333:6333 qdrant/qdrant

# Or install the JS client
npm install @qdrant/js-client-rest
```

### Create Collection and Search

```typescript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({ url: 'http://localhost:6333' });

// Create collection
await client.createCollection('articles', {
  vectors: { size: 1536, distance: 'Cosine' },
});

// Upsert points
await client.upsert('articles', {
  points: [
    {
      id: 1,
      vector: embedding,
      payload: { title: 'Vector Search Guide', category: 'tutorial', published: true },
    },
  ],
});

// Search with payload filtering
const results = await client.search('articles', {
  vector: queryEmbedding,
  limit: 5,
  filter: {
    must: [
      { key: 'category', match: { value: 'tutorial' } },
      { key: 'published', match: { value: true } },
    ],
  },
});

// results = [{ id, version, score, payload }]
```

Qdrant's filtering happens during the search, not after. This means filtered queries stay fast even when the filter eliminates most of the dataset.

## Building a RAG Pipeline

RAG (Retrieval-Augmented Generation) combines vector search with LLM generation. Instead of asking the LLM to answer from memory alone, you retrieve relevant documents first and include them in the prompt. This grounds the response in your actual data and reduces hallucination.

### Architecture

```
User question
  → Generate query embedding
  → Search vector database for relevant documents
  → Build prompt with retrieved context
  → Send to LLM for answer generation
  → Return grounded response
```

### Implementation

```typescript
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function askWithRAG(question: string): Promise<string> {
  // 1. Embed the question
  const { data: embeddingData } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });
  const queryVector = embeddingData[0].embedding;

  // 2. Retrieve relevant documents
  const { data: docs } = await supabase.rpc('match_documents', {
    query_embedding: queryVector,
    match_threshold: 0.7,
    match_count: 5,
  });

  // 3. Build context from retrieved documents
  const context = docs
    .map((doc: any) => doc.content)
    .join('\n\n---\n\n');

  // 4. Generate answer with context
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Answer the user's question based on the following context. If the context doesn't contain relevant information, say so.\n\nContext:\n${context}`,
      },
      { role: 'user', content: question },
    ],
  });

  return response.choices[0].message.content ?? 'No answer generated.';
}
```

This pattern works with any vector database — swap the retrieval step for Pinecone, Qdrant, or whichever database you use.

## Performance and Scaling

### Indexing Best Practices

- **Batch inserts** — upsert vectors in batches of 100-500 instead of one at a time. Every database performs better with batch operations.
- **Choose the right index** — HNSW for most workloads. IVFFlat for pgvector when you need faster index builds and can tolerate slightly lower recall.
- **Dimension reduction** — OpenAI's `text-embedding-3-small` outputs 1,536 dimensions, but you can reduce to 512 or 256 with the `dimensions` parameter. Smaller vectors = faster search and less storage.
- **Quantization** — Qdrant and Milvus support scalar and binary quantization to compress vectors in memory. This trades marginal accuracy for significant memory savings at scale.

### When to Move Beyond pgvector

pgvector handles most applications well under 5-10 million vectors. Consider a purpose-built vector database when:

- You need sub-10ms latency at scale
- Your dataset exceeds 10 million vectors
- You need advanced filtering during search (not post-search)
- You want built-in replication and high availability
- Your query volume exceeds what a single Postgres instance can handle

## Common Patterns

### Chunking Documents

Large documents should be split into smaller chunks before embedding. Each chunk becomes its own vector entry:

```typescript
function chunkText(text: string, maxChars = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    chunks.push(text.slice(start, end));
    start += maxChars - overlap;
  }

  return chunks;
}

// Store each chunk with a reference to the parent document
const chunks = chunkText(articleContent);
for (const [i, chunk] of chunks.entries()) {
  const [vector] = await embed([chunk]);
  await insertDocument(chunk, vector, {
    parent_id: articleId,
    chunk_index: i,
  });
}
```

Chunk sizes of 500-1,500 characters work well for most text content. Overlap ensures context is not lost at chunk boundaries.

### Hybrid Search

Combine keyword matching with vector similarity for better results. Weaviate supports this natively. With pgvector, you can build it manually:

```sql
-- Hybrid search: keyword + vector similarity
SELECT
  id,
  content,
  ts_rank(to_tsvector('english', content), plainto_tsquery('english', 'deployment')) AS keyword_score,
  1 - (embedding <=> query_embedding) AS vector_score,
  (0.3 * ts_rank(to_tsvector('english', content), plainto_tsquery('english', 'deployment')))
    + (0.7 * (1 - (embedding <=> query_embedding))) AS combined_score
FROM documents
WHERE to_tsvector('english', content) @@ plainto_tsquery('english', 'deployment')
   OR 1 - (embedding <=> query_embedding) > 0.7
ORDER BY combined_score DESC
LIMIT 10;
```

### Metadata Filtering

Always store useful metadata alongside vectors. Filter during search to narrow results without scanning the entire index:

```typescript
// Pinecone: filter by category and date
const results = await index.query({
  vector: queryEmbedding,
  topK: 10,
  filter: {
    category: { $eq: 'tutorial' },
    published_at: { $gte: '2025-01-01' },
  },
  includeMetadata: true,
});
```

## See Also

- Supabase — managed Postgres with built-in pgvector support
- PostgreSQL — the relational database that pgvector extends
- Claude API Integration — using Claude to generate and process text for embedding
- AI Agents — building autonomous agents that use vector search for memory
- AI Agent Memory Systems — how agents persist and retrieve knowledge
