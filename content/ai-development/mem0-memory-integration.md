---
title: "Add Persistent Memory to Any AI App with Mem0"
description: "Mem0 is the fastest way to give your AI app persistent, personalized memory. Here's how it works, how to integrate it in Next.js and Python, and when to use it."
---

# Add Persistent Memory to Any AI App with Mem0

Most AI apps are amnesiac by design. The LLM API is stateless — every session starts from a blank slate. Mem0 is a memory layer that sits between your app and your LLM, extracting facts from conversations and retrieving them when they're relevant. The user tells your app they prefer TypeScript. The next session, your app knows this without being told again.

This is Article 3 of the "Make Your AI App Remember" series. [Article 1](./ai-app-memory-problem) explains why LLM apps forget and the four architectural approaches for fixing it. [Article 2](./ai-memory-architecture-decision-framework) is the decision framework for choosing between them. [Article 4](./diy-ai-memory-pgvector-convex) covers the DIY path with pgvector. [Article 5](./zep-temporal-memory) covers Zep for apps that need to track how facts change over time.

## What Mem0 Actually Does

Mem0 is not a vector database. It is an extraction-and-retrieval layer that happens to use vector storage internally.

When you call `memory.add()` with a conversation turn, Mem0 sends that text through an LLM-based extraction pipeline. The LLM reads the exchange, identifies the facts worth storing — dietary preferences, technology choices, stated goals, anything durable — and writes them as structured memories scoped to a user, agent, or session. When you call `memory.search()`, Mem0 runs a hybrid retrieval across vector embeddings, keyword indexes, and graph relationships to return the most relevant facts.

The key insight: **you don't have to decide what to store.** The extraction pipeline makes that call. You pass the full message exchange and get back relevant memories on demand.

The tradeoff is that extraction is a guess. The LLM decides at write time what will matter at read time. For most apps this is fine. For apps where you need to know *exactly* what gets stored and why, DIY pgvector gives you more control at the cost of building the extraction logic yourself.

## Core Primitives

Mem0 has five scoping primitives that compose:

| Primitive | What it represents |
|---|---|
| **User** | A unique end user — preferences persist across all sessions |
| **Agent** | A specific AI assistant or persona in your app |
| **Session** | A single conversation thread |
| **Memory** | An extracted fact, stored as a structured object with `memory` text, `id`, and optional metadata |
| **Run** | A single invocation of `add()` or `search()` |

Scopes nest: a user contains multiple agents and sessions. A session belongs to one user. When you call `memory.search()`, you filter by one or more scopes — for example, retrieve only User-level preferences, or User + Agent facts for a specific assistant persona.

For most indie apps, you only need `user_id`. Agent and session scoping become relevant when you have multiple LLM personas in the same app, or when you want short-term session context separated from long-term user preferences.

## The Integration Pattern

The standard Mem0 loop is three steps per turn:

1. **Before the LLM call**: `memory.search(user_query, { user_id })` → retrieve relevant memories → inject into the system prompt
2. **Make the LLM call** with the enriched system prompt
3. **After the LLM call completes**: `memory.add([userMessage, assistantMessage], { user_id })` → extraction runs

A few gotchas that bite people:

**Pass both sides of the exchange to `add()`.** Not just the user message — include the assistant's reply too. The extraction LLM uses the full context to understand what was decided, confirmed, or learned, not just what the user said.

**Add after the turn, not during.** Call `memory.add()` in an `onFinish` callback or a background queue, after the response has been fully streamed. Adding mid-stream produces incomplete exchanges.

**Deduplication is handled for you.** When a new memory contradicts an existing one ("I used to live in Austin" after "lives in Austin"), Mem0's extraction LLM resolves the conflict — it can update, merge, or invalidate the prior memory. You don't manage this. The tradeoff is reduced transparency: you cannot easily audit why a specific memory was overwritten.

## Complete Next.js Integration

Install the dependencies:

```bash
npm install mem0ai ai @ai-sdk/openai
```

A full Next.js App Router route that retrieves memories, streams a response, and stores the exchange after the stream completes:

```typescript
// app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import MemoryClient from "mem0ai";
import { NextRequest, NextResponse } from "next/server";

const mem0 = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });

export const runtime = "nodejs";
export const maxDuration = 60;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const { messages, userId }: { messages: Message[]; userId: string } =
    await req.json();

  if (!userId || messages.length === 0) {
    return NextResponse.json(
      { error: "userId and messages are required" },
      { status: 400 }
    );
  }

  const lastUserMessage = messages[messages.length - 1].content;

  // Step 1: Retrieve relevant memories before the LLM call
  let memoryContext = "";
  try {
    const results = await mem0.search(lastUserMessage, {
      filters: { user_id: userId },
      limit: 5,
    });
    if (results.length > 0) {
      memoryContext =
        "\n\nContext from past conversations:\n" +
        results.map((m: { memory: string }) => `- ${m.memory}`).join("\n");
    }
  } catch (err) {
    // Degrade gracefully — proceed without memory rather than failing the request
    console.error("[mem0 search error]", err);
  }

  // Step 2: Stream the response with memory injected into the system prompt
  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful assistant. Use the context below to personalize your responses without explicitly mentioning that you're using stored memory.${memoryContext}`,
    messages,
    onFinish: async ({ text }) => {
      // Step 3: Store the full exchange after streaming completes
      try {
        await mem0.add(
          [...messages, { role: "assistant", content: text }],
          { user_id: userId }
        );
      } catch (err) {
        console.error("[mem0 add error]", err);
        // Non-blocking — don't fail the request if storage fails
      }
    },
  });

  return result.toDataStreamResponse();
}
```

Client component using `useChat` from the Vercel AI SDK:

```typescript
// app/components/ChatInterface.tsx
"use client";

import { useChat } from "ai/react";

export default function ChatInterface({ userId }: { userId: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: { userId },
    });

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <div className="flex flex-col gap-3 min-h-64 max-h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-3 py-2 rounded-lg text-sm max-w-prose ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-100 text-gray-900 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-400 text-sm italic self-start">
            Thinking...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

The `onFinish` pattern is critical for streaming apps: it gives you the complete assistant response as a string after the stream ends, which is what you want to pass to `memory.add()`.

## Python Equivalent (FastAPI)

```python
# main.py
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from mem0 import MemoryClient
from openai import AsyncOpenAI
import os
import json

app = FastAPI()
mem0 = MemoryClient(api_key=os.environ["MEM0_API_KEY"])
oai = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])


class ChatRequest(BaseModel):
    messages: list[dict]
    user_id: str


@app.post("/api/chat")
async def chat(req: ChatRequest):
    user_query = req.messages[-1]["content"]

    # Retrieve memories before the LLM call
    memory_context = ""
    try:
        results = mem0.search(
            user_query, filters={"user_id": req.user_id}, limit=5
        )
        if results:
            lines = "\n".join(f"- {m['memory']}" for m in results)
            memory_context = f"\n\nContext from past conversations:\n{lines}"
    except Exception as e:
        print(f"[mem0 search error] {e}")

    system = (
        "You are a helpful assistant. Use the context below to personalize "
        "your responses without mentioning stored memory."
        + memory_context
    )

    async def stream_and_store():
        full_response = []
        async with oai.chat.completions.stream(
            model="gpt-4o",
            messages=[{"role": "system", "content": system}] + req.messages,
        ) as stream:
            async for chunk in stream:
                delta = chunk.choices[0].delta.content or ""
                if delta:
                    full_response.append(delta)
                    yield delta

        # Store the full exchange after streaming
        try:
            mem0.add(
                req.messages + [{"role": "assistant", "content": "".join(full_response)}],
                user_id=req.user_id,
            )
        except Exception as e:
            print(f"[mem0 add error] {e}")

    return StreamingResponse(stream_and_store(), media_type="text/plain")
```

## Self-Hosting

Mem0 is Apache 2.0. The OSS package ships with a local memory implementation that's good for development and low-volume production. For a self-hosted production setup, you'll configure a persistent vector store.

Install the OSS package:

```bash
pip install mem0ai  # Python
npm install mem0ai  # Node — import from 'mem0ai/oss'
```

Configure with a persistent vector store (pgvector example):

```python
from mem0 import Memory

config = {
    "version": "v1.1",
    "embedder": {
        "provider": "openai",
        "config": {"model": "text-embedding-3-small"},
    },
    "vector_store": {
        "provider": "pgvector",
        "config": {
            "dbname": "mem0",
            "collection_name": "memories",
            "host": "localhost",
            "port": 5432,
            "user": "postgres",
            "password": "your-password",
        },
    },
    "llm": {
        "provider": "openai",
        "config": {"model": "gpt-4o-mini"},
    },
}

memory = Memory.from_config(config)
```

Supported vector stores include Qdrant (the default), pgvector, Chroma, Weaviate, Pinecone, and Milvus. For most indie apps already on Postgres, pgvector is the obvious choice — no new infrastructure.

The Node.js OSS client supports OpenAI, Anthropic, and Groq as the extraction LLM. For other providers in Node.js, use the managed platform API instead.

## 2026 Pricing

Mem0's managed platform uses a request-based model with no per-user or per-memory charges.

| Plan | Price | Add requests/mo | Retrieval requests/mo |
|---|---|---|---|
| **Hobby** | Free | 10,000 | 1,000 |
| **Starter** | $19/mo | 50,000 | 5,000 |
| **Pro** | $249/mo | 500,000 | 50,000 |
| **Enterprise** | Custom | Unlimited | Unlimited |

All plans support unlimited end users. The Pro plan also adds multiple project support and a private Slack channel. Startup program: three months of free Pro for companies under $5M in funding.

**Cost modeling:** At 1,000 MAU with ~10 add requests per user per month, you're at 10,000 add requests — comfortably inside the Hobby tier. At 10,000 MAU you hit ~100,000 adds — Starter at $19/mo. At 100,000 MAU, Pro at $249/mo. Usage-based overages are available if you exceed tier limits. Self-hosting is $0 for the OSS layer but adds LLM extraction costs (~$0.01/add call against OpenAI) and infrastructure ops.

## Benchmarks

Mem0 publishes benchmarks across three datasets: LOCOMO, LongMemEval, and BEAM. The headline claim — "26% better than OpenAI Memory" — comes from the LOCOMO evaluation in the [April 2025 arXiv paper](https://arxiv.org/abs/2504.19413). The paper reports that Mem0's extraction-based approach achieves competitive accuracy while using under 7,000 tokens per retrieval call, which is a meaningful efficiency win compared to full-context replay approaches.

The evaluation methodology uses LLM judges to score response quality on long-form conversational histories. Independent verification is limited — Mem0 runs the evals themselves. The 2026 [State of AI Agent Memory](https://mem0.ai/blog/state-of-ai-agent-memory-2026) post covers updated benchmark data across 10 approaches if you want a broader comparison.

For practical purposes: Mem0 performs well on preference retrieval and user fact retention. It is not designed for temporal reasoning (tracking how facts change over time) — that is Zep's strength.

## Mem0 vs. Alternatives

| | Mem0 | Zep / Graphiti | DIY pgvector |
|---|---|---|---|
| **Core model** | Extraction + hybrid retrieval | Temporal knowledge graph | Vector similarity search |
| **Temporal tracking** | Basic (latest wins) | Native bi-temporal | None (you build it) |
| **Integration effort** | Low — drop-in SDK | Medium — graph concepts | Medium-high — build extraction logic |
| **Pricing** | Free → $249/mo | $125/mo (Flex) → Enterprise | Cost of infra + embedding calls |
| **Data control** | Shared (Mem0 Cloud) | Shared (Zep Cloud) | Full (your database) |
| **Best for** | Drop-in personalization | Goal/preference evolution | Data-sensitive apps, Postgres shops |

**Pick Mem0 when** you need persistent user context with minimal setup and your facts don't need a time dimension. User profiles, stated preferences, recurring topics — Mem0 handles this well and the free tier covers most early-stage apps.

**Pick Zep when** your app needs to track how user facts *change* over time — coaching apps, companion apps, sales agents tracking prospect history. The bi-temporal model is purpose-built for this. See [Article 5](./zep-temporal-memory) for the full Zep walkthrough.

**Pick DIY when** you need full data ownership, have compliance requirements that prevent third-party storage, or already have Postgres/Supabase and want to stay on the same infrastructure. You'll need to build the extraction logic — Mem0's open-source package gives you patterns to start from even if you don't use the service.

## Operational Concerns

**Deletion.** Call `client.delete(memory_id)` for a specific memory, or `client.delete_all(user_id=userId)` to purge all memories for a user. That's your GDPR/right-to-be-forgotten path.

**Retention.** The platform documentation does not specify a default TTL. Clarify with Mem0's team if your app has regulatory data retention requirements.

**Observability.** The platform dashboard lets you browse stored memories per user — useful when users report that the app is responding strangely. Check for stale or incorrect memories first. For self-hosted setups, query your vector store directly by `user_id`.

**Latency.** `memory.search()` adds 50–200ms to your response path. Acceptable for chat interfaces; profile it if you're building something latency-sensitive like voice.

## Key Takeaways

- **The loop is: search before, add after.** Inject memories into the system prompt before the LLM call. Store the full exchange (both turns) after streaming completes.
- **You don't manage extraction.** Mem0's LLM-based pipeline decides what to store and handles deduplication. This saves engineering time but reduces auditability.
- **The free tier is genuinely useful.** 10,000 add requests and 1,000 search requests per month covers most early-stage products with room to breathe.
- **Self-hosting is an option.** Apache 2.0 license, pgvector and Qdrant backends, Docker-composable. Node.js OSS client is currently limited to OpenAI, Anthropic, and Groq.
- **For temporal memory, use Zep.** Mem0 is excellent at "what does this user prefer." Zep is the right tool for "what *did* this user prefer, and when did that change."

---

*Sources: [Mem0 GitHub](https://github.com/mem0ai/mem0) · [Mem0 platform docs](https://docs.mem0.ai/platform/quickstart) · [Add operation docs](https://docs.mem0.ai/core-concepts/memory-operations/add) · [LLM providers overview](https://docs.mem0.ai/components/llms/overview) · [Mem0 pricing](https://mem0.ai/pricing) · [LOCOMO benchmark paper (arXiv 2504.19413)](https://arxiv.org/abs/2504.19413) · [State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) · [Azure AI + Mem0 integration guide](https://devblogs.microsoft.com/foundry/azure-ai-mem0-integration/) · [Mem0 production integration (DEV Community)](https://dev.to/abdibrokhim/give-your-ai-agents-persistent-memory-with-mem0-3eff) · [AI Memory Systems 2026 comparison](https://blog.devgenius.io/ai-agent-memory-systems-in-2026-mem0-zep-hindsight-memvid-and-everything-in-between-compared-96e35b818da8) · [Best AI Agent Memory Systems (Vectorize)](https://vectorize.io/articles/best-ai-agent-memory-systems) · [Vercel AI SDK streamText docs](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text)*
