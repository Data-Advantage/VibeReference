---
title: "Build AI Memory with Convex — No New Vendors"
description: "A step-by-step tutorial for adding persistent AI memory to your Convex app using vector search, Actions, and OpenAI embeddings — no Mem0, Zep, or extra infrastructure required."
---

# Build AI Memory with Convex — No New Vendors

You have read [why your AI app needs memory](/guides/ai-app-memory-explained), [how to think about memory architecture](/guides/ai-memory-architecture-guide), and [which memory systems are worth adopting](/backend-and-data/ai-memory-systems-comparison). Now you want to ship.

If you are already using [Convex](/backend-and-data/convex) as your backend, you do not need a second vendor for memory. You have everything you need: a reactive database, a vector index, server-side Actions for calling OpenAI, and a scheduler for background jobs. This tutorial walks through building a complete memory layer — extraction, storage, and retrieval — entirely inside your existing Convex deployment.

By the end, you will have a chatbot that remembers users between sessions with about 150 lines of TypeScript and zero new accounts.

## Why Build Your Own

Managed memory platforms like [Mem0](https://mem0.ai) and [Zep](https://getzep.com) are excellent and worth every dollar for teams that need production-grade personalization on day one. But for a solo founder on Convex, rolling your own has real advantages:

- **Zero new vendors.** No API key to rotate, no dashboard to monitor, no billing page to check. Your memory lives in the same project as your users, messages, and app state.
- **Full control over extraction.** You decide what counts as a memory and how it is stored. No black-box heuristics.
- **Single query surface.** Memories are regular Convex documents. You can join them against users, filter by workspace, or expose them through reactive queries for a memory-management UI.
- **Free at the scale most apps ever reach.** Convex's free tier plus OpenAI's `text-embedding-3-small` model at $0.02 per million tokens keeps this setup under $5/month for thousands of daily active users.

When should you stop rolling your own? If you need multi-hop graph reasoning, automatic decay policies with RL-based pruning, or a managed SDK for five different LLM frameworks, graduate to [Mem0](https://mem0.ai). Until then, the setup below is enough.

## Architecture Overview

The memory loop has four moving parts:

1. **Extraction** — after each conversation turn, call an LLM to pull discrete facts out of the user's message (preferences, decisions, personal details).
2. **Embedding** — convert each extracted fact into a vector using OpenAI's embedding API.
3. **Storage** — insert the fact + its vector into a `userMemories` table that has a Convex vector index.
4. **Retrieval** — at the start of each new turn, embed the incoming message, run a vector search, and inject the top-k memories into the system prompt.

All four steps run inside Convex — extraction and embedding live in an Action (because they make external HTTP calls), storage is a mutation, and retrieval is an action that calls a query. The chat loop in your Next.js app never talks directly to OpenAI for memory operations.

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js chat page                                          │
│    └─ useAction(api.chat.sendMessage)                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Convex Action: chat.sendMessage                            │
│    1. retrieveMemories(userId, userMessage)                 │
│    2. call OpenAI chat with system prompt + memories        │
│    3. extractAndStoreMemories(userId, userMessage, reply)   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  userMemories table                                         │
│    • userId, text, embedding (1536), metadata, createdAt    │
│    • vectorIndex("by_embedding", dimensions: 1536)          │
└─────────────────────────────────────────────────────────────┘
```

## Step 1: Define the Schema

Add a `userMemories` table to `convex/schema.ts`. The vector index is declared alongside regular indexes.

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  userMemories: defineTable({
    userId: v.id("users"),
    text: v.string(),
    embedding: v.array(v.float64()),
    category: v.union(
      v.literal("preference"),
      v.literal("fact"),
      v.literal("goal"),
      v.literal("context"),
    ),
    sourceMessageAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId", "category"],
    }),
});
```

Two things worth calling out:

- **Dimensions match the embedding model.** `text-embedding-3-small` returns 1,536-dim vectors. If you switch to `text-embedding-3-large`, change this to 3,072.
- **`filterFields` must include `userId`.** Vector search runs across the whole index, so you need a filter to scope results to a single user. Without this, a new user would see another user's memories.

Deploy the schema with `npx convex dev`. Convex will start indexing immediately.

## Step 2: Wire Up the OpenAI Embedding Helper

Embeddings need an external HTTP call, so they live in a Convex Action. Create `convex/embeddings.ts`:

```typescript
// convex/embeddings.ts
"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const embed = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input: args.text,
        model: "text-embedding-3-small",
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI embedding failed: ${response.statusText}`);
    }

    const json = (await response.json()) as {
      data: Array<{ embedding: number[] }>;
    };
    return json.data[0].embedding;
  },
});
```

Set the API key from your terminal:

```bash
npx convex env set OPENAI_API_KEY sk-proj-...
```

Convex stores this securely and injects it as `process.env.OPENAI_API_KEY` inside Actions.

## Step 3: Write the Extraction Action

Extraction takes a conversation turn and asks an LLM to pull out discrete facts worth remembering. This runs after each assistant reply.

```typescript
// convex/memories.ts
"use node";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const EXTRACTION_PROMPT = `You extract durable memories from a chat turn.
Return a JSON array. Each item: { "text": string, "category": "preference" | "fact" | "goal" | "context" }.
Only include facts that would be useful in a future session. Skip pleasantries and one-off questions.
Return [] if nothing is worth remembering.`;

export const extractAndStore = action({
  args: {
    userId: v.id("users"),
    userMessage: v.string(),
    assistantReply: v.string(),
  },
  handler: async (ctx, args) => {
    const extractionResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: EXTRACTION_PROMPT },
            {
              role: "user",
              content: `User said: ${args.userMessage}\n\nAssistant replied: ${args.assistantReply}\n\nReturn {"memories": [...]}`,
            },
          ],
        }),
      },
    );

    const json = (await extractionResponse.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const parsed = JSON.parse(json.choices[0].message.content) as {
      memories: Array<{ text: string; category: string }>;
    };

    for (const memory of parsed.memories) {
      const embedding = await ctx.runAction(internal.embeddings.embed, {
        text: memory.text,
      });
      await ctx.runMutation(internal.memories.insert, {
        userId: args.userId,
        text: memory.text,
        category: memory.category as
          | "preference"
          | "fact"
          | "goal"
          | "context",
        embedding,
        sourceMessageAt: Date.now(),
      });
    }
  },
});

export const insert = internalMutation({
  args: {
    userId: v.id("users"),
    text: v.string(),
    category: v.union(
      v.literal("preference"),
      v.literal("fact"),
      v.literal("goal"),
      v.literal("context"),
    ),
    embedding: v.array(v.float64()),
    sourceMessageAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userMemories", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
```

Mark `embeddings.embed` as `internal` by re-exporting it in `convex/embeddings.ts` via `internalAction` if you want to prevent client calls. The pattern above calls it through `internal` for the same effect.

Two design notes:

- **`gpt-4o-mini` is enough.** Extraction is a structured classification task. A bigger model is wasted spend.
- **Filter aggressively.** The prompt tells the model to return `[]` when nothing is memorable. Most conversation turns produce zero memories — that is correct behavior. Noisy extraction is worse than no extraction.

## Step 4: Write the Retrieval Action

Retrieval takes the current user message, embeds it, runs a vector search scoped to this user, and returns the top-k memories as plain text.

```typescript
// convex/memories.ts  (append)
import { internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const retrieve = action({
  args: {
    userId: v.id("users"),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<string[]> => {
    const embedding = await ctx.runAction(internal.embeddings.embed, {
      text: args.query,
    });

    const results = await ctx.vectorSearch("userMemories", "by_embedding", {
      vector: embedding,
      limit: args.limit ?? 8,
      filter: (q) => q.eq("userId", args.userId),
    });

    const ids = results
      .filter((r) => r._score > 0.72)
      .map((r) => r._id as Id<"userMemories">);

    if (ids.length === 0) return [];

    const memories = await ctx.runQuery(internal.memories.loadByIds, { ids });
    return memories.map((m) => m.text);
  },
});

export const loadByIds = internalQuery({
  args: { ids: v.array(v.id("userMemories")) },
  handler: async (ctx, args) => {
    const docs = await Promise.all(args.ids.map((id) => ctx.db.get(id)));
    return docs.filter((d): d is NonNullable<typeof d> => d !== null);
  },
});
```

The `_score > 0.72` threshold filters out weak matches. Tune it based on your own data — start at 0.7 and adjust after reviewing the retrieved memories for a few real sessions. Too low and you will inject irrelevant facts; too high and you will drop useful ones.

Note the two-step retrieval: `ctx.vectorSearch` returns only `_id` and `_score`, so you load the full documents through a separate internal query. This is documented behavior, not a workaround.

## Step 5: Wire It Into Your Chat Loop

The final piece is a `sendMessage` action that retrieves memories, calls the chat model, and kicks off extraction for the next turn.

```typescript
// convex/chat.ts
"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const sendMessage = action({
  args: {
    userId: v.id("users"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const memories = await ctx.runAction(internal.memories.retrieve, {
      userId: args.userId,
      query: args.message,
      limit: 8,
    });

    const systemPrompt = [
      "You are a helpful assistant.",
      memories.length > 0
        ? `What you know about this user:\n${memories.map((m) => `- ${m}`).join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: args.message },
          ],
        }),
      },
    );

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const reply = json.choices[0].message.content;

    // Schedule extraction so the user gets the reply immediately.
    await ctx.scheduler.runAfter(0, internal.memories.extractAndStore, {
      userId: args.userId,
      userMessage: args.message,
      assistantReply: reply,
    });

    return reply;
  },
});
```

The `ctx.scheduler.runAfter(0, ...)` call is the trick that keeps chat latency low. Extraction adds 500-1500ms because of the secondary LLM call and embedding; scheduling it fires the work on the next tick so the user sees their reply first. The memory is available on the next turn, not the current one — which is what you want anyway.

Call it from a React client the same way you call any Convex action:

```typescript
// app/chat/page.tsx
"use client";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ChatPage() {
  const sendMessage = useAction(api.chat.sendMessage);
  // ... your UI, calls sendMessage({ userId, message }) on submit
}
```

## What This Gives You

You now have a chatbot with a persistent memory layer running inside your existing Convex deployment. Users who come back tomorrow get a system prompt that includes what they told you today. Total new infrastructure: zero. Total new vendors: zero (assuming you were already using OpenAI for the chat itself).

A few things this setup does _not_ do that paid platforms do:

- **No automatic decay.** Memories live forever unless you delete them. For most apps this is fine. If it becomes a problem, add a Convex cron job that deletes memories older than 90 days or that have not been retrieved in N sessions.
- **No deduplication.** If a user tells you twice that they prefer TypeScript, you store two memories. The impact is small — duplicates just appear twice in the top-k results — but a weekly cleanup mutation can dedupe by embedding distance.
- **No graph reasoning.** Vector search finds semantically similar memories; it cannot answer "who has the same preferences as Sarah?" If you need that, layer [Mem0](https://mem0.ai) on top — its hybrid graph + vector model handles relational queries while your Convex layer continues to own the raw memories.

For a first version, none of these matter. Ship it, watch real users, and come back to add whichever piece starts to bite.

## When to Upgrade

Stay with this setup until one of these is true:

- You are running more than 100,000 active users and vector search latency starts creeping above 200ms — time to look at a dedicated vector DB like [Pinecone or Qdrant](/backend-and-data/vector-databases).
- You need multi-agent memory sharing, personalization across apps, or pre-built decay policies — [Mem0](https://mem0.ai) handles this with less code than you would write yourself.
- You move off Convex. At that point the memory layer moves with the backend.

Until then, Convex plus 150 lines of TypeScript is the simplest path to an AI app that actually remembers its users.

## Related Articles

- [Why Your AI App Forgets Everything (And How to Fix It)](/guides/ai-app-memory-explained) — the mental model for memory in LLM apps
- [How to Think About Memory for Your AI App](/guides/ai-memory-architecture-guide) — the decision framework behind this implementation
- [The Best AI Memory Systems for Solo Founders (2026 Comparison)](/backend-and-data/ai-memory-systems-comparison) — when a managed platform wins
- [Convex](/backend-and-data/convex) — the underlying platform this tutorial builds on
- [Vector Databases](/backend-and-data/vector-databases) — when you outgrow Convex's built-in vector index

## Resources

- [Convex Vector Search Documentation](https://docs.convex.dev/vector-search)
- [Convex Actions](https://docs.convex.dev/functions/actions)
- [Convex Scheduled Functions](https://docs.convex.dev/scheduling/scheduled-functions)
- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)
