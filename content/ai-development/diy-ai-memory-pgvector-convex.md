---
title: "Build AI Memory with Your Existing Database"
description: "Skip the dedicated vector database. Build production AI memory with pgvector on Supabase, Convex vector search, or self-hosted Postgres — with working code for all three stacks."
---

# Build AI Memory with Your Existing Database

You don't need Pinecone to give your AI app memory. If you're already on Postgres, Supabase, or Convex, you have everything required to build a working memory layer today — no new vendor, no new pricing tier, no new category to learn.

This is the DIY path: semantic search over a `memories` table you own and control. It won't replace a dedicated memory service for complex cases (temporal knowledge graphs, entity deduplication, multi-hop reasoning). But for the most common use case — remembering what users told you and surfacing the relevant context at the start of each session — it works, it's fast, and it costs almost nothing.

## The 4-Step Pattern

Every AI memory system, DIY or managed, reduces to four steps:

1. **Embed** — convert a piece of text (a user message, an extracted fact) into a vector using an embedding model
2. **Store** — write the vector + original text + `user_id` to your database
3. **Retrieve** — at the start of each new session, embed the incoming query and find the k nearest stored vectors for that user
4. **Inject** — prepend the retrieved memories to the system prompt before calling the LLM

That's it. The implementation differs by database, but the pattern is identical across all three stacks below.

## Choosing an Embedding Model

Before picking a stack, pick your embedding model. It determines your vector dimensions, which you set once and can't change without re-embedding everything.

| Model | Dims | Cost / 1M tokens | MTEB Score | Best for |
|---|---|---|---|---|
| `text-embedding-3-small` | 1536 | $0.02 | 62.3 | Most indie apps |
| `text-embedding-3-large` | 3072 | $0.13 | 64.6 | When quality matters more than cost |
| Cohere `embed-v4` | 1024 | $0.01 | 63.1 | Multilingual apps, tight budget |
| Voyage `voyage-4` | 1024 | $0.06 | 65.1 | Code and domain-specific retrieval |

For most apps, **`text-embedding-3-small` at 1536 dims** is the right default. It delivers 96% of the quality of the large model at 15% of the cost, and 1536 dimensions fits comfortably in any vector index ([OpenAI embedding announcement](https://openai.com/index/new-embedding-models-and-api-updates/)).

---

## Stack 1: Convex Vector Search

Convex ships vector search as a first-class feature — no extension to install, no index tuning, just a TypeScript schema declaration and a query in an action.

### Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  memories: defineTable({
    userId: v.string(),
    content: v.string(),
    embedding: v.array(v.float64()),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["userId"],
  }),
});
```

Convex supports dimensions from 2 to 4096, up to 4 vector indexes per table, and up to 256 results per query ([Convex limits docs](https://docs.convex.dev/production/state/limits)).

### Store a memory

```typescript
// convex/memories.ts
import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { internal } from "./_generated/api";

const openai = new OpenAI();

export const insertMemory = internalMutation({
  args: {
    userId: v.string(),
    content: v.string(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, { userId, content, embedding }) => {
    return await ctx.db.insert("memories", { userId, content, embedding });
  },
});

export const getMemory = internalQuery({
  args: { id: v.id("memories") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const storeMemory = action({
  args: { userId: v.string(), content: v.string() },
  handler: async (ctx, { userId, content }) => {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });
    const embedding = response.data[0].embedding;

    await ctx.runMutation(internal.memories.insertMemory, {
      userId,
      content,
      embedding,
    });
  },
});
```

### Retrieve relevant memories

```typescript
export const retrieveMemories = action({
  args: { userId: v.string(), query: v.string() },
  handler: async (ctx, { userId, query }) => {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const queryEmbedding = response.data[0].embedding;

    const results = await ctx.vectorSearch("memories", "by_embedding", {
      vector: queryEmbedding,
      limit: 5,
      filter: (q) => q.eq("userId", userId),
    });

    // Fetch full documents for the top matches
    const memories = await Promise.all(
      results.map(({ _id }) => ctx.runQuery(internal.memories.getMemory, { id: _id }))
    );

    return memories.filter(Boolean);
  },
});
```

The `filter` on `userId` is handled by the index — no full table scan. Convex vector search returns `_id` and `_score` (cosine similarity from -1 to 1) ([Convex vector search docs](https://docs.convex.dev/search/vector-search)).

---

## Stack 2: Supabase pgvector

Supabase ships pgvector by default. The pattern is SQL for schema, a Postgres function for the similarity query, and an Edge Function for embedding generation.

### Schema

```sql
-- Enable pgvector (already available in Supabase)
create extension if not exists vector with schema extensions;

-- Memories table
create table memories (
  id bigserial primary key,
  user_id uuid references auth.users(id) not null,
  content text not null,
  embedding extensions.halfvec(1536) not null,
  created_at timestamptz default now()
);

-- HNSW index for fast ANN search
create index on memories
  using hnsw (embedding extensions.halfvec_cosine_ops)
  with (m = 16, ef_construction = 64);
```

`halfvec` stores each dimension as 2 bytes instead of 4, halving storage cost with negligible quality loss. `m = 16` and `ef_construction = 64` are the pgvector defaults — they achieve >95% recall at most scales below 5M vectors ([AWS pgvector indexing deep dive](https://aws.amazon.com/blogs/database/optimize-generative-ai-applications-with-pgvector-indexing-a-deep-dive-into-ivfflat-and-hnsw-techniques/)).

### Similarity search function

```sql
create or replace function match_memories(
  query_embedding extensions.halfvec(1536),
  match_user_id uuid,
  match_count int default 5
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from memories
  where user_id = match_user_id
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

### Store and retrieve from a Next.js route

```typescript
// app/api/memory/route.ts
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI();

async function embed(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// POST /api/memory — store a new memory
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();
  if (typeof content !== "string" || content.trim().length === 0) {
    return Response.json({ error: "Content is required" }, { status: 400 });
  }

  const embedding = await embed(content);

  await supabase.from("memories").insert({
    user_id: user.id,
    content,
    embedding: JSON.stringify(embedding),
  });

  return Response.json({ ok: true });
}

// GET /api/memory?q=... — retrieve relevant memories
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q") ?? "";

  const queryEmbedding = await embed(q);

  const { data: memories } = await supabase.rpc("match_memories", {
    query_embedding: JSON.stringify(queryEmbedding),
    match_user_id: user.id,
    match_count: 5,
  });

  return Response.json({ memories });
}
```

For high-write workloads, Supabase's [automatic embeddings guide](https://supabase.com/docs/guides/ai/automatic-embeddings) shows a queue-based pattern using `pgmq` + `pg_cron` + an Edge Function — decoupling the embedding API call from the database write.

---

## Stack 3: Self-Hosted Postgres with Drizzle

If you're running Postgres yourself on [Fly.io](https://fly.io/docs/mpg/) or Railway, you can use Drizzle's native pgvector support.

### Schema

```typescript
// db/schema.ts
import { index, pgTable, bigserial, uuid, text, vector, timestamp } from "drizzle-orm/pg-core";

export const memories = pgTable(
  "memories",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: uuid("user_id").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("memories_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);
```

### Similarity search

```typescript
// lib/memory.ts
import { db } from "@/db";
import { memories } from "@/db/schema";
import { cosineDistance, desc, gt, sql, and, eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI();

async function embed(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function storeMemory(userId: string, content: string) {
  const embedding = await embed(content);
  await db.insert(memories).values({ userId, content, embedding });
}

export async function retrieveMemories(userId: string, query: string, k = 5) {
  const queryEmbedding = await embed(query);
  const similarity = sql<number>`1 - (${cosineDistance(memories.embedding, queryEmbedding)})`;

  return db
    .select({ content: memories.content, similarity })
    .from(memories)
    .where(and(eq(memories.userId, userId), gt(similarity, 0.5)))
    .orderBy(desc(similarity))
    .limit(k);
}
```

Drizzle's `cosineDistance` compiles to pgvector's `<=>` operator ([Drizzle vector guide](https://orm.drizzle.team/docs/guides/vector-similarity-search)).

---

## Fact Extraction: What to Actually Store

The biggest mistake with DIY memory: storing raw conversation turns verbatim. A user message like "can you help me fix this TypeScript error?" has near-zero memory value — it tells you nothing durable about the user.

What you want to store are **extracted facts**: durable, first-person statements about the user.

Here's a fact-extraction prompt you can ship:

```
You are a memory extraction assistant. Given a conversation turn, extract 0-3 durable facts about the user.

Rules:
- Only extract facts that will still be relevant in future sessions (preferences, goals, constraints, background)
- Ignore questions, commands, and task-specific details that won't generalize
- Write each fact as a first-person statement: "I prefer...", "I am...", "I use..."
- If there are no durable facts, return an empty array

Conversation turn:
<turn>
{{message}}
</turn>

Return JSON: { "facts": ["fact 1", "fact 2"] }
```

This pattern — LLM-driven fact extraction into atomic statements — is how Mem0 works at its core ([Mem0 LangChain integration](https://docs.mem0.ai/integrations/langchain)). The open-source library is worth reading even if you're not using the managed service: it shows how to handle deduplication, contradiction resolution, and fact eviction.

Call this extraction function after each user message, then store any returned facts as individual `memories` rows. Retrieve on the next session's first message.

---

## Retrieval Injection: Building the System Prompt

Once you have retrieved memories, inject them at the top of the system prompt:

```typescript
async function buildSystemPrompt(userId: string, userMessage: string): Promise<string> {
  const memories = await retrieveMemories(userId, userMessage, 5);

  const memoryBlock = memories.length > 0
    ? `## What I know about you\n${memories.map(m => `- ${m.content}`).join("\n")}`
    : "";

  // Cap memory context at ~500 tokens to protect context window
  const cappedMemory = memoryBlock.slice(0, 2000);

  return [
    "You are a helpful assistant with memory of past conversations.",
    cappedMemory,
    "\nUse the above context to personalize your response. If you reference something from memory, do it naturally — don't announce it."
  ].filter(Boolean).join("\n\n");
}
```

Keep retrieved memory under ~500 tokens. At 5 memories × 100 tokens each, you're at 500 tokens — safe at any context window size. If you retrieve more (for richer personalization), summarize them before injection.

---

## Cost Math

Embedding cost at the rates above (`text-embedding-3-small`, $0.02/M tokens):
- 1 message ≈ 100 tokens → $0.000002 per message
- 10 messages/session, 2 sessions/month → 20 messages → $0.00004/user/month
- At 1,000 MAU → **$0.04/month in embedding costs**

Infrastructure cost dominates, not embedding API cost:

| Stack | 1K MAU | 10K MAU | 100K MAU |
|---|---|---|---|
| Supabase pgvector (Pro) | ~$35/mo | ~$60/mo | ~$150/mo |
| Convex vector search (Pro) | ~$25/mo | ~$50/mo + usage | ~$200/mo + usage |
| Fly.io Managed Postgres | ~$38/mo (1 node) | ~$82/mo (3-node) | ~$164/mo + compute |
| Mem0 managed (for reference) | $19/mo (50K memories) | $249/mo (Pro) | custom |
| Zep Flex (for reference) | $25/mo | $25/mo + credits | custom |

At 1K–10K MAU, DIY beats managed services by 5–10x on cost. The gap narrows above 100K MAU when Postgres infrastructure costs start scaling. Self-hosted Postgres on Fly.io is cheapest; Supabase and Convex add managed-service convenience ([Supabase pricing](https://supabase.com/pricing), [Convex pricing](https://www.convex.dev/pricing)).

---

## When DIY Breaks Down

pgvector works until it doesn't. Watch for these signals:

**Above 5–10M vectors:** HNSW index builds take hours and consume significant RAM. One production incident report describes queries degrading from sub-100ms to multi-second timeouts as the index stopped fitting in memory ([The Case Against pgvector](https://alex-jacobs.com/posts/the-case-against-pgvector/)). Plan your index parameters or consider partitioning by user.

**High write volume:** Every vector insertion updates the HNSW graph under lock. If you're ingesting thousands of memories per minute, contention becomes a problem. The Supabase async queue pattern (pgmq + pg_cron) exists precisely to decouple write volume from index updates.

**Filtered search at scale:** Postgres's query planner wasn't built for "filter by user, then rank by vector." At small scale (thousands of users, each with hundreds of memories), the user filter is selective enough that this works fine. At millions of users or millions of memories per user, pre-filtering becomes expensive and post-filtering misses results. Dedicated vector databases handle this natively.

**Multi-hop reasoning and temporal graphs:** If you need to answer "has the user's goal changed over the last 6 months?" or "which entities are related to this topic the user mentioned in March?", you've outgrown a flat vector store. That's what [Zep's temporal knowledge graph](/ai-development/zep-temporal-memory) and Graphiti are built for.

The rule of thumb: DIY pgvector is the right choice up to ~1M total vectors per deployment, or roughly 10K users with 100 memories each. Beyond that, start benchmarking.

---

## Summary

All three stacks implement the same 4-step pattern — embed, store, retrieve, inject — with different tradeoffs:

- **Convex**: TypeScript-native, zero config, production-ready out of the box. Best if you're already on Convex.
- **Supabase pgvector**: Full Postgres power, HNSW tuning, halfvec compression. Best for data-control and hybrid (vector + relational) queries.
- **Self-hosted Drizzle + pgvector**: Cheapest at scale, maximum flexibility. Best if you're already managing Postgres on Fly or Railway.

Start with whichever matches your existing stack. The extraction prompt and injection pattern are identical across all three.

---

**Article 4 of 5 in the "Make Your AI App Remember" series.**

- **Article 1**: [Why Your AI App Forgets Everything](/ai-development/ai-app-memory-problem)
- **Article 2**: [AI Memory Architectures: A Decision Framework](/ai-development/ai-memory-architecture-decision-framework)
- **Article 3**: [Add Persistent Memory to Any AI App with Mem0](/ai-development/mem0-memory-integration)
- **Article 5**: [Temporal Memory with Zep](/ai-development/zep-temporal-memory)

Related: [Vector Databases](/backend-and-data/vector-databases) · [Supabase AI Docs](https://supabase.com/docs/guides/ai) · [Convex Vector Search](https://docs.convex.dev/search/vector-search)
