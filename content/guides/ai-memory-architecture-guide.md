---
title: "How to Think About Memory for Your AI App"
description: "A decision framework for choosing the right memory architecture for your AI app — from chat history to knowledge graphs, with practical guidance for solo founders and vibe coders."
---

# How to Think About Memory for Your AI App

You know your AI app [needs memory](/guides/ai-app-memory-explained). The question is: what kind?

A chatbot that helps users debug code needs different memory than a fitness coach that tracks workouts over months. A customer support agent needs different memory than a creative writing companion. The wrong architecture means either burning money on unnecessary infrastructure or shipping a product that forgets the things users care about most.

This guide gives you a decision framework. By the end, you'll know which memory approach fits your app, where to store it, how to retrieve it, and when to let your app forget.

## Start With Your App, Not the Technology

Before you pick a memory system, answer one question: **what does your app need to remember, and for how long?**

Different app categories have fundamentally different memory needs:

| App Type | What to Remember | How Long | Example |
|----------|-----------------|----------|---------|
| **Chat assistant** | Conversation history + user facts | Session + months | Customer support bot, coding assistant |
| **Productivity tool** | User preferences + workflow state | Months to years | AI writing assistant, project manager |
| **Companion / coach** | Long-term user profile + temporal changes | Years | Fitness coach, therapy bot, study buddy |
| **Knowledge worker** | Documents + past research + decisions | Months to years | Research assistant, legal AI |
| **Creative tool** | Style preferences + project context | Per-project | AI art generator, music composer |

A chat assistant can get away with conversation history plus a handful of user facts. A companion app needs to track how a user's goals, preferences, and circumstances change over time — that's a fundamentally harder problem.

**The mistake most builders make:** they pick the most sophisticated memory system they can find and bolt it onto a simple chat app. Start with the simplest approach that solves your actual problem. You can always upgrade later.

## The Four Decisions of Memory Architecture

Every memory system, from a simple database table to a full knowledge graph, answers four questions:

### 1. Extraction: How Do Memories Get Created?

Something has to decide which parts of a conversation are worth remembering. You have two options:

**Manual extraction** — your code explicitly defines what to save. For example, saving every user message to a database, or using a structured form to capture preferences. Simple, predictable, but misses implicit signals.

**Automatic extraction (LLM-powered)** — you pass the conversation to an LLM and ask it to extract meaningful facts. This catches things like "the user mentioned they're a vegetarian" without you writing rules for every possible preference.

```typescript
// Manual: you decide what's a "memory"
await db.insert("preferences", {
  userId: user.id,
  key: "theme",
  value: "dark",
});

// Automatic: the LLM decides what's worth remembering
const extraction = await llm.complete({
  prompt: `Extract key facts about the user from this conversation.
Return as JSON array of {fact, category, confidence}.
Conversation: ${transcript}`,
});
```

**Which to choose:**
- **Manual** if your memory needs are well-defined (user settings, explicit preferences, form data). Lower cost, fully predictable.
- **Automatic** if users share context naturally through conversation and you want to capture it without friction. Higher cost per message, but catches things rules-based extraction misses.

Most production apps use a hybrid: manual extraction for structured data (name, email, plan tier) and automatic extraction for conversational context (preferences, goals, project details). [Mem0](https://mem0.ai) and [Zep](https://www.getzep.com) both automate the extraction loop so you don't have to build it from scratch.

### 2. Storage: Where Do Memories Live?

Where you store memories determines what you can do with them later. Each storage option has different strengths:

| Storage Type | Best For | Query Style | Example Tools |
|-------------|----------|-------------|---------------|
| **Relational database** | Structured facts, preferences | Exact lookups (`WHERE userId = ...`) | PostgreSQL, Supabase, Convex |
| **Vector database** | Finding similar past conversations | Semantic search ("what did we discuss about auth?") | pgvector, Pinecone, Qdrant, Chroma |
| **Knowledge graph** | Relationships between entities | Graph traversal ("who works with whom?") | Neo4j, Zep/Graphiti, Cognee |
| **Key-value store** | Simple preferences, flags | Direct key lookup | Redis, Cloudflare KV |
| **Files** | Audit trail, manual inspection | Full-text search, grep | Markdown files, JSON |

For a deeper dive on the vector option, see [vector databases](/backend-and-data/vector-databases).

**The practical answer for most solo founders:** start with whatever database you already have. If you're on Supabase, store memories in a Postgres table. If you're on Convex, use a Convex table. Add vector search when (and only when) you need semantic retrieval — not on day one.

Knowledge graphs are the most powerful option but also the most complex. They shine when relationships between entities matter — "the user's company uses React, their team lead prefers Vue, and they're migrating from Angular." If your app doesn't need multi-hop reasoning like that, a simpler storage layer will serve you well.

### 3. Retrieval: How Do You Find the Right Memories?

Having memories is useless if you can't find the right ones at the right time. The retrieval method determines how smart your app feels.

**Exact lookup** — query by user ID, session ID, or specific keys. Fast and simple. Works when you know exactly what you need ("get this user's preferred language").

```typescript
const prefs = await db.query("preferences")
  .filter(q => q.eq(q.field("userId"), user.id))
  .collect();
```

**Keyword search** — find memories containing specific terms. Works for explicit mentions but misses semantic connections ("auth" won't match "login" or "sign-in").

**Semantic similarity** — convert the current query into a vector and find the closest past memories by meaning. This is how you answer "what did we discuss about deployment?" even if the word "deployment" was never used — maybe the user talked about "shipping to production" or "going live."

```typescript
const queryVector = await embed(userMessage);
const relevant = await vectorDb.search({
  vector: queryVector,
  topK: 5,
  filter: { userId: user.id },
});
```

**Graph traversal** — follow relationships between entities. "What does this user's team use for CI/CD?" requires walking from user → team → tools → CI/CD. Only possible with a knowledge graph backend.

**Which to choose:**
- Start with **exact lookup** for user preferences and settings.
- Add **semantic similarity** when users ask questions that relate to past conversations and you need to surface relevant context.
- Use **graph traversal** only if your app models complex relationships between entities. Most apps don't need this.

### 4. Scope: Who Remembers What?

Memory scope determines the boundaries of what each memory applies to. Get this wrong and you'll either leak context between users or lose context within a user's sessions.

| Scope | What It Means | Example |
|-------|--------------|---------|
| **Per-session** | Memories exist only during one conversation | Basic chatbot, no persistence |
| **Per-user** | Memories persist across all of one user's sessions | Personal assistant, companion app |
| **Per-agent** | Memories belong to a specific AI agent, shared across users | Customer support bot personality |
| **Per-app** | Global knowledge available to all users and agents | Product documentation, FAQ |

Most apps need **per-user** scope as the baseline — each user has their own memory space, isolated from others. Layer per-session on top for conversation continuity within a session, and per-app for shared knowledge.

**The privacy implication:** per-user scope means you're storing personal data. This triggers GDPR, CCPA, and similar regulations. Make sure users can view and delete their memories. This isn't just a legal requirement — it builds trust.

## The Memory You Need to Build: Forgetting

This is the part most builders skip. Without forgetting, your memory system degrades over time.

A user told your app they use React in January. In March, they switched to Vue. If your app still injects "user prefers React" into every prompt, it's actively harmful — worse than having no memory at all.

**Why decay matters:**

- **Stale facts are wrong facts.** User preferences change. Jobs change. Projects end. Memory without decay accumulates lies.
- **Context windows are finite.** If you inject every memory you've ever saved, you'll crowd out the actual conversation. The LLM performs worse with irrelevant context.
- **Cost scales with context.** Every token of injected memory costs money. Old, irrelevant memories waste budget on every single API call.

**How to implement forgetting:**

1. **Timestamp-based decay** — weight recent memories higher. Simple to implement: multiply a memory's relevance score by a recency factor.

```typescript
const recencyWeight = Math.exp(
  -0.01 * daysSince(memory.createdAt)
);
const score = semanticSimilarity * recencyWeight;
```

2. **Conflict resolution** — when a new fact contradicts an old one, replace or archive the old fact. "User prefers Vue" should supersede "User prefers React." Mem0 handles this automatically with version-controlled memories.

3. **Relevance pruning** — periodically review stored memories and remove ones that haven't been retrieved in months. If a memory is never useful, it's noise.

4. **Usage tracking** — count how often each memory is actually retrieved and used. Low-use memories are candidates for archiving or deletion.

The right approach depends on your app. A simple preference store might only need conflict resolution. A long-term companion app needs all four mechanisms to stay coherent over years of use.

## Decision Tree: Which Memory Approach Fits Your App?

Use this flowchart to find your starting point:

**Does your app need to remember anything between sessions?**
- No → Use conversation history only (stateless). Done.
- Yes ↓

**Is the memory structured and well-defined (settings, preferences, profile fields)?**
- Yes → Use a relational database with exact lookups. Done.
- Not entirely ↓

**Do users share context naturally through conversation?**
- Yes → Add LLM-powered extraction (Mem0 or build your own) + a database for storage.
- No → Use manual extraction with explicit save actions.

**Do you need to find relevant past context by meaning (not just exact keys)?**
- No → Relational database is enough. Done.
- Yes → Add a [vector database](/backend-and-data/vector-databases) for semantic retrieval.

**Do you need to track how facts change over time or model relationships between entities?**
- No → Vector + relational is your stack. Done.
- Yes → Add a knowledge graph layer (Zep/Graphiti or Cognee).

Most apps land on relational database + optional vector search. Knowledge graphs are powerful but only earn their complexity when temporal or relational reasoning is a core feature.

## Putting It Together: Three Example Architectures

### Simple: AI Writing Assistant

- **Extraction:** Manual — save user's tone preferences and writing style via settings UI
- **Storage:** Postgres table (or Convex document)
- **Retrieval:** Exact lookup by user ID
- **Scope:** Per-user
- **Forgetting:** Conflict resolution only (new preference replaces old)

### Medium: AI Coding Assistant

- **Extraction:** Hybrid — manual for project settings, LLM-powered for conversational context
- **Storage:** Postgres for preferences + pgvector for past conversation chunks
- **Retrieval:** Exact lookup for settings, semantic search for relevant past discussions
- **Scope:** Per-user + per-project
- **Forgetting:** Timestamp decay + relevance pruning (old project context fades)

### Advanced: AI Personal Coach

- **Extraction:** Fully automatic (LLM-powered via Mem0 or Zep)
- **Storage:** Knowledge graph (Zep/Graphiti) for user facts and their evolution over time
- **Retrieval:** Graph traversal + semantic similarity
- **Scope:** Per-user with temporal awareness
- **Forgetting:** All four mechanisms — timestamps, conflict resolution, pruning, and usage tracking

## What's Next

This article gave you the decision framework. The next articles in this series get hands-on:

- **[The Best AI Memory Systems for Solo Founders (2026 Comparison)](/backend-and-data/ai-memory-systems-comparison)** — Head-to-head on Mem0, Zep, Cloudflare, LangGraph, and Letta with real pricing
- **[Build AI Memory with Convex — No New Vendors](/backend-and-data/convex-ai-memory-tutorial)** — A hands-on tutorial for adding memory inside your existing Convex deployment
- **[Memory Patterns That Make AI Apps Feel Magical](/guides/ai-memory-ux-patterns)** — The six UX patterns that separate demo-quality AI apps from the ones users pay for

Start simple. Use your existing database. Add complexity only when your users need it — not because the technology is cool. The best memory architecture is the one that makes your users feel understood without making your infrastructure unmanageable.

If you haven't read it yet, start with [Why Your AI App Forgets Everything (And How to Fix It)](/guides/ai-app-memory-explained) for the foundational concepts behind AI app memory.
