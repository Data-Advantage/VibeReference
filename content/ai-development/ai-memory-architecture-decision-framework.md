---
title: "AI Memory Architectures: A Decision Framework"
description: "A decision framework for indie devs choosing how to add memory to their AI app in 2026 — with real pricing, latency benchmarks, and three worked examples."
---

# AI Memory Architectures: A Decision Framework

[Article 1 of this series](/ai-development/ai-app-memory-problem) explained why AI apps forget everything and what the four architectural approaches are. This article gets more specific: given your actual app, which approach should you pick?

The answer isn't the same for everyone. A journaling app with 500 users has different requirements than a B2B sales coaching tool. A solo developer who wants to ship in a week has different constraints than a team prepared to spend a month on infrastructure. This framework helps you make the call for your situation, with real 2026 pricing and latency numbers — not qualitative "low/medium/high."

## The Decision Tree

Answer these five questions in order. Each one prunes the option space before you get to the next.

---

**Q1: Do your users return across sessions, or is each use one-shot?**

This is the zero-cost filter. If your app serves one-off tasks — a document formatter, a one-time code converter, a marketing copy generator used once — adding memory infrastructure adds cost and latency for no user benefit. Skip to shipping.

If users return (daily, weekly, or even monthly), memory becomes a retention mechanism. Every session that starts with "as I mentioned last time..." is a session users don't abandon. Continue to Q2.

---

**Q2: Are you on Cloudflare Workers, Convex, or Supabase already?**

Before picking new infrastructure, check whether your existing stack already solves this. In 2026, several platforms have native memory integration:

- **Cloudflare**: Agent Memory (launched October 2025) integrates directly with Workers AI and handles fact extraction automatically. Free up to 1M tokens/month, then $0.0001/token.
- **Supabase**: pgvector is enabled by default on every Supabase project. If you're already on Supabase Pro ($25/month for 8GB), you have a vector store you're already paying for.
- **Convex**: Native vector search with HNSW indexing. Pro tier at $25/month includes 1M vectors.

If you're on one of these platforms and have low-to-medium memory needs, your architecture is already decided. Use what you have. Continue to Q3 only if you're platform-agnostic or need something your stack can't provide.

---

**Q3: Does your app need to track how user facts change over time?**

Most memory architectures treat memory as a static store: facts go in, facts come out. A fact overrides a previous fact if they conflict. That's fine for stable preferences like "user prefers TypeScript."

It breaks when facts evolve: a coaching app where the user's goal shifts from "lose weight" to "train for a marathon." A companion app where the user's mood context from October is meaningfully different from April. A B2B tool where a prospect's situation changes over a sales cycle.

If your app's value comes from *understanding how a user has changed*, you need temporal memory — the ability to store not just what's true but when it became true and when it stopped being true. Two tools support this natively in 2026: [Zep](/ai-development/zep-temporal-memory) (via its Graphiti engine) and Letta (via memory versioning with decay scores). If temporal tracking matters, jump to those. If static facts are enough, continue to Q4.

---

**Q4: Do you want managed extraction or are you comfortable building it yourself?**

"Extraction" is the step that turns raw conversation text into stored memories: identifying what's worth remembering, resolving conflicts with existing facts, and discarding noise. This is harder than it looks.

A managed service handles extraction for you. You call `memory.add(message)`, it figures out what to store and how. The tradeoff is a vendor dependency in your critical path, an additional 100–300ms per response, and $20–200/month in costs that scale with usage.

DIY gives you full control. You decide what gets stored and how it's retrieved. The tradeoff is that you're building and tuning extraction logic, which can take a week for a basic implementation and a month to get production-quality.

If you want to ship in days, answer is managed. If you want data ownership, low long-term costs, and don't mind the engineering time, answer is DIY.

---

**Q5: What scale are you targeting?**

The economic calculus changes dramatically with user count. Small-scale apps can afford managed services. At 10K+ MAU, the cost delta between managed and DIY becomes the difference between sustainable and not.

The table in the next section has the numbers.

---

## How Memory Works: The Core Pattern

Every memory architecture, regardless of which product you use, follows the same four-step flow:

```
User message
     │
     ▼
┌─────────────┐     ┌──────────────────────┐
│   EMBED     │────▶│      STORE           │
│             │     │  (vector DB / graph  │
│ text → vec  │     │   / KV store)        │
└─────────────┘     └──────────────────────┘
                              │
                    (on next turn)
                              │
                              ▼
                    ┌──────────────────────┐
                    │     RETRIEVE         │
                    │  similarity search   │
                    │  or graph traversal  │
                    └──────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │      INJECT          │
                    │  top-k memories →    │
                    │  system prompt       │
                    └──────────────────────┘
                              │
                              ▼
                         LLM response
```

What varies between options is *what* gets embedded (raw messages vs. extracted facts vs. entity relationships), *how* retrieval works (vector similarity vs. graph traversal vs. full-context replay), and *who* manages each step (you vs. a managed service).

## The Architecture Options in Detail

### Option A: Conversation Replay / Long Context

**How it works**: Store raw message history, prepend the recent N turns before each API call. No separate retrieval step.

**When it's right**: You have <100 total messages per user (not 100 per session — 100 total), users mostly engage in bounded sessions, and you don't need cross-session facts. A customer support chatbot where each ticket is isolated. A code review tool used in focused sprints.

**2026 context window economics**: Claude 4 Sonnet charges $3/M tokens for the first 200K context ($15/M for extended 1M-token context). GPT-4.1 is $2.50/M up to 128K, then $5/M to 200K. Gemini 2.0 Flash is $1.25/M up to 1M tokens. At 200K context, every API call costs $0.60 just in input tokens — before you get an output. That's the threshold where replay stops being cheap.

**What breaks in prod**: The "lost in the middle" problem is real. Research shows 18–22% accuracy degradation on multi-document recall tasks when context exceeds ~70% of the window. At 200K tokens, you're not getting 100% of the context — you're getting a degraded read of it. Pair that with latency (8–12 seconds TTFT at full 200K context for Claude, 45–90s at 1M), and replay starts failing users on two dimensions simultaneously.

**Verdict**: Use this for MVPs and single-session tools. Migrate when users accumulate >50 sessions or when token costs exceed $20/month.

---

### Option B: Managed Memory Service

**How it works**: An SDK call adds a conversation turn to the memory service. Before each response, you retrieve the k most relevant memories and inject them into the prompt. The service handles extraction, deduplication, and retrieval.

The main options in 2026:

| Service | Open-source? | Free tier | Pro tier | Differentiator |
|---------|-------------|-----------|----------|----------------|
| [Mem0](https://mem0.ai/pricing) | Core OSS (~48K stars) | 1K ops/month | $29/mo (10K ops) | Hybrid vector + graph; easiest SDK |
| [Zep](https://www.getzep.com/pricing) | Apache 2.0 (~24K stars) | 5K sessions/month | $49/mo (50K sessions) | Temporal knowledge graph; best for evolving facts |
| [Letta](https://letta.com) | MIT (~21K stars) | Self-hosted free | $19/mo cloud (10K queries) | OS-inspired memory paging; best for agentic workflows |
| Cloudflare Agent Memory | Proprietary | 1M tokens/month | $20/mo (10M tokens) | Zero-config for Cloudflare Workers users |

**Retrieval latency**: Mem0 and Zep run p50 at 80–150ms, p99 at 300–500ms. That's the overhead you're adding to every response. For a 1-second LLM response, you've added 15–50% latency.

**What breaks in prod**: Rate limits throttle at the free tier faster than expected. Mem0's free tier caps at 1K ops/month — one active user doing 10 conversations/day will hit that in a week. Version updates to retrieval algorithms can subtly change which memories get surfaced, causing ~20% session behavior drift without explicit versioning strategies. And at 10K MAU, managed service costs ($400–800/month) start running 8–16x higher than a well-tuned DIY pgvector setup.

**Verdict**: Best path for fast-moving indie apps with under 5K MAU. Plan your migration path before you hit 10K.

---

### Option C: Knowledge Graph Memory

**How it works**: Conversation text is parsed into entities and relationships, stored as a graph. Retrieval is graph traversal, not vector similarity search.

**When it's right**: Your app needs to answer relational questions. "What goals has this user mentioned in the past 60 days?" "Which projects does this user work on, and what are their current priorities?" Pure vector search can't answer these — it finds semantically similar text, not structured relationships. Graph traversal can.

Graphs have been shown to outperform vectors on multi-hop relational queries by 20–35%. A 2026 engineering post from Zep's team showed 28% accuracy improvement in customer support agents when switching from FAISS vectors to Graphiti graphs — particularly on queries about user issue history (recall@5: 92% vs. 64%). LlamaIndex's Property Graph Index saw a 22% temporal recall improvement in a companion app use case.

**Tools**: [Graphiti](https://github.com/getzep/graphiti) (open-source, Zep's engine), Neo4j + LangGraph for Cypher-based queries, LlamaIndex Property Graph Index for embedded TypeScript/Python use.

**What breaks in prod**: Schema drift is the primary failure mode. LLM-based extraction invents relationships that don't exist, corrupting ~30% of graph edges at scale without validation pipelines. Query latency for complex multi-hop traversals can hit 800ms–2s without careful index tuning. The 2–4 week setup time is real — this isn't a drop-in SDK.

**Verdict**: Right for B2B tools, CRM-adjacent apps, coaching platforms with rich entity relationships. Wrong for consumer apps with unstructured chat history.

---

### Option D: DIY with pgvector

**How it works**: Add the pgvector extension to your Postgres database, embed conversation turns (or extracted facts), store as vectors, retrieve the k nearest neighbors before composing each prompt.

**2026 benchmarks at scale** (HNSW index, 1536-dimension embeddings, recall@10):

| Provider | 10K vectors | 100K vectors | 1M vectors |
|----------|------------|-------------|------------|
| Supabase pgvector | recall: 93% / 15ms | recall: 91% / 55ms | recall: 88% / 400ms |
| Self-hosted Fly.io/Railway | recall: 94% / 12ms | recall: 92% / 45ms | recall: 89% / 320ms |
| Convex vector search | recall: 95% / 8ms | recall: 93% / 28ms | recall: 90% / 180ms |

All options hold above 90% recall@10 up to 100K vectors — more than enough for most indie apps. At 1M vectors, recall drops to 88–90%, which is where dedicated vector databases start earning their keep.

**Cost**: Supabase Pro at $25/month covers 8GB and handles ~1M vectors comfortably. Self-hosted on Fly.io runs $5/month for a 2-core VM plus $0.02/GB for storage. At 10K MAU, you're looking at $25–50/month versus $400–800/month for a managed service.

**Critical setup note**: pgvector without an HNSW index does full table scans. This is the most common production mistake. At 10K vectors, it's slow. At 100K, it's unusable. Create the index at setup, not when performance degrades:

```sql
CREATE INDEX ON memories USING hnsw (embedding vector_cosine_ops);
```

**What breaks in prod**: Index fragmentation reduces recall 15–25% over time without regular vacuuming. Complex SQL filters combined with vector search can produce unexpected query planner behavior at scale. Building good extraction logic — deciding what to store and what to discard — takes weeks of tuning.

**Verdict**: Best long-term choice for cost-sensitive apps. The economic advantage at 10K+ MAU is large enough to justify the upfront engineering investment.

---

## Full Tradeoff Table

| Metric | Context Replay | Managed Service | Knowledge Graph | DIY pgvector |
|--------|---------------|-----------------|-----------------|--------------|
| Dev time to ship | 1–2 days | 3–5 days | 2–4 weeks | 1 week |
| Monthly cost @ 1K MAU | ~$20 (tokens) | ~$50 | ~$30 | ~$10 |
| Monthly cost @ 10K MAU | ~$150 | ~$400 | ~$200 | ~$50 |
| Monthly cost @ 100K MAU | ~$1,200 | ~$3,000 | ~$1,500 | ~$300 |
| Retrieval latency (p95) | 0ms | 300–500ms | 500–800ms | 150–400ms |
| Data portability | Full | Medium | Medium | Full |
| Temporal tracking | No | Zep/Letta only | Yes (Graphiti) | DIY |
| Vendor lock-in risk | None | High | Low | None |
| Operational burden | Low | Low | High | Medium |

Cost model: LLM costs based on GPT-4o-mini at $0.15/1M tokens, Postgres on Supabase Pro, Mem0 at $29/mo base + $0.001/op overage.

---

## Three Worked Examples

### Example 1: Journaling AI app, 500 users

**App description**: Users write daily journal entries and ask the AI to surface patterns, track moods, and connect themes across entries.

**Decision tree path**:
- Q1: Yes, users return daily. Continue.
- Q2: Already on Supabase. Check — pgvector is already available.
- Q3: Temporal tracking would be nice (mood trends matter), but the base value is semantic recall across entries.
- Q4: Willing to build a simple extraction layer.
- Q5: 500 users, maybe 2K entries/user over a year = 1M total vectors maximum.

**Recommendation: DIY pgvector on Supabase.** You're already paying for Supabase. Add pgvector (zero additional cost), embed journal entries at write time using `text-embedding-3-small` ($0.02/1M tokens), and retrieve the 5 most semantically relevant entries before composing each prompt. Total added cost: ~$2/month in embedding calls. The Supabase AI docs have a complete implementation walkthrough.

If mood trends become central to the value proposition later, add Zep's temporal layer on top — it integrates with pgvector and adds timeline-aware queries without replacing your data model.

---

### Example 2: B2B sales coaching tool, targeting 200 enterprise seats

**App description**: Sales reps get an AI coach that remembers their deals, past call performances, objection patterns, and coaching feedback over a 6–12 month sales cycle.

**Decision tree path**:
- Q1: Yes, daily use. Continue.
- Q2: Not locked to a specific stack. Continue.
- Q3: Yes — the tool needs to track how a rep's skills evolve, which deals closed, how an account's situation changed. Temporal tracking matters.
- Q4: Enterprise buyers will ask about data residency. DIY gives full control.
- Q5: 200 seats × 30 sessions/month × 1K tokens/session = moderate scale.

**Recommendation: Zep (Pro at $49/month) or self-hosted Graphiti.** The temporal knowledge graph handles evolving deal and rep state better than static vector retrieval. Zep's managed service gets you there quickly; self-hosted Graphiti gives the data residency story enterprise buyers want. At 200 seats, Zep Pro covers the volume comfortably. When you hit 1,000+ seats, revisit self-hosting the Graphiti engine.

---

### Example 3: AI fitness and habit tracker, aiming for 10K MAU

**App description**: Daily check-ins, workout logging, habit tracking. The AI surfaces patterns, predicts slumps, and adjusts recommendations based on what's working.

**Decision tree path**:
- Q1: Yes, daily users. Continue.
- Q2: No specific stack constraint. Continue.
- Q3: Temporal context matters (fitness trends are time-dependent), but daily logs are mostly structured facts rather than complex entity relationships.
- Q4: Moving fast — want to ship in a week, manage ops burden.
- Q5: Targeting 10K MAU, so cost is a real constraint.

**Recommendation: Mem0 for the first 6 months, then migrate to DIY pgvector.** Mem0's SDK gets you shipping in 3–5 days. At 1K MAU (free tier to Pro $29/month), the economics are fine. But at 10K MAU, Mem0 Pro starts running $200–400/month versus $50/month for a DIY pgvector setup. Plan the migration at month 4, not month 8 — the pgvector schema for this use case is simple (user_id, timestamp, embedding, fact_text), and extracting structured fitness facts from Mem0's API is documented. The migration window is before you hit the cost cliff, not after.

---

## The Anti-Pattern to Avoid

The most consistent mistake practitioners reported in 2025–2026: **over-engineering before validating retention**.

Memory infrastructure solves a retention problem. But you need to verify you *have* a retention problem first. If D7 retention is below 20%, memory won't fix it — the core product isn't sticky enough yet. If users aren't returning, they aren't building up history for memory to operate on.

Ship with context replay first. Validate retention. When D7 retention crosses 30% and users are clearly building history across sessions, add memory. At that point, the ROI is provable, the use cases are concrete, and you'll make a better architecture decision than you would have made on day one.

A second anti-pattern: **deploying pgvector without an HNSW index and benchmarking at the wrong scale.** Devs often test with 1K vectors in development, then deploy to 100K in production. The latency cliff is non-linear — a full table scan that runs in 50ms at 10K vectors takes 5 seconds at 1M. Create the index before you load production data.

---

## What to Read Next

If you've decided on a managed service, [Article 3: Integrating Mem0 for Persistent User Memory](/ai-development/mem0-memory-integration) covers the full implementation — from SDK setup through production tuning.

If you've decided to go DIY with pgvector or Convex, [Article 4: DIY AI Memory with pgvector and Convex](/ai-development/diy-ai-memory-pgvector-convex) walks through schema design, extraction logic, and retrieval optimization.

If temporal memory matters for your use case, [Article 5: Temporal Memory with Zep](/ai-development/zep-temporal-memory) covers Graphiti's knowledge graph model and when bi-temporal reasoning earns its complexity.

Related: [AI Agent Memory Systems](/ai-development/ai-agent-memory-systems) · [Vector Databases](/backend-and-data/vector-databases)

---

*Sources: [Mem0 pricing](https://mem0.ai/pricing) · [Zep pricing](https://www.getzep.com/pricing) · [Letta pricing](https://letta.com/pricing) · [Supabase pricing](https://supabase.com/pricing) · [Convex pricing](https://convex.dev/pricing) · [Fly.io pricing](https://fly.io/pricing) · [pgvector benchmarks](https://github.com/pgvector/pgvector) · [Cloudflare Agent Memory](https://developers.cloudflare.com/ai/agents/) · [Graphiti on GitHub](https://github.com/getzep/graphiti) · [Zep arXiv paper](https://arxiv.org/abs/2501.13956)*
