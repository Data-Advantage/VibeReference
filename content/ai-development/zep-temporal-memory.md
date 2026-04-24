---
title: "Temporal Memory with Zep — When Your App Needs to Track Change"
description: "Zep and the open-source Graphiti engine give your AI app bi-temporal memory: track when facts became true and when they stopped. Deep dive on architecture, pricing, code, and when to choose Zep over Mem0 or pgvector."
---

# Temporal Memory with Zep — When Your App Needs to Track Change

Most AI apps treat memory as a snapshot: store a fact, retrieve it later. That works fine when facts stay stable. It breaks down when facts change — when your user's goals shift, their preferences evolve, or their circumstances are different than they were three months ago.

Temporal memory is the ability to track not just *what* is true, but *when* it became true and *when* it stopped being true. Zep is the production platform built around this idea. Its open-source engine, [Graphiti](https://github.com/getzep/graphiti), gives you the same temporal knowledge graph without a cloud dependency.

This is Article 5 of the "Make Your AI App Remember" series. [Article 2](./ai-memory-architecture-decision-framework) covers when to use each memory architecture. [Article 3](./mem0-memory-integration) covers Mem0 for simpler persistent memory. [Article 4](./diy-ai-memory-pgvector-convex) covers the DIY path with pgvector or Convex.

## The Problem: Facts That Change

Vector stores and key-value caches have no concept of time. When you update a fact, the old one is gone. When a user's goal changes from "run 10km a week" to "just stay active," the prior goal disappears. You cannot ask "what did they want three months ago?"

This is fine for most apps. For apps where the *trajectory of change* matters — coaching, companion apps, therapy-adjacent products, long-term personalization — losing the history loses the point.

Zep solves this with a bi-temporal data model.

## Bi-Temporal Memory in 60 Seconds

Bi-temporal means every fact is tagged with two independent time dimensions:

- **Valid time** — when the fact is actually true in the world. "The user wants to run 10km/week" was valid from January through March 2025.
- **Transaction time** — when the system learned the fact. The app recorded that goal in February 2025 based on a conversation.

These are different. A user might mention in April 2025 that they *used to* live in Austin before moving to Denver in 2023. Valid time: Austin residency ended 2023. Transaction time: the app just learned this in April 2025.

When a new fact contradicts an old one, Zep doesn't overwrite — it sets an `invalid_at` timestamp on the old edge and creates a new one. The full history is preserved. You can ask "what did this user's running goal look like on March 1st?" and get the right answer, even if the goal changed in April.

The January 2025 Zep research paper ([arXiv 2501.13956](https://arxiv.org/abs/2501.13956)) documents the architecture and benchmarks: **94.8% accuracy on Deep Memory Retrieval** (vs 93.4% for the prior state-of-the-art), **+18.5% improvement on LongMemEval**, and **90% latency reduction** versus full-context retrieval baselines.

## How Graphiti Works

Graphiti is the open-source engine underneath Zep Cloud. It builds a temporal knowledge graph from conversation episodes.

**Three memory layers:**

1. **Episodic** — raw conversation turns ingested as time-stamped episodes. These are the inputs; not directly queryable.
2. **Semantic** — entities (people, goals, preferences) and facts (time-bound relationships) extracted from episodes via LLM. Entities are deduplicated across sessions; facts carry `valid_at` and `invalid_at` timestamps.
3. **Community** — higher-level cluster summaries grouping related entities. Enables macro-level inference across large histories.

**Episode → Graph:**
When you call `add_raw_episode()` or `client.memory.add()`, Graphiti sends the text to an LLM, extracts entities and relationships, deduplicates against existing nodes, and updates the graph. It is not instant — each episode ingestion involves LLM extraction — but retrieval is fast (sub-200ms for context assembly according to the official repo).

**Fact invalidation vs. deletion:**
If a user says "I used to want to run 10km but now I just want to stay active," Graphiti:
1. Finds the existing `WANTS_TO → run 10km/week` edge
2. Sets `invalid_at` on that edge
3. Creates a new `WANTS_TO → stay active` edge

Nothing is deleted. You have a complete audit trail.

## Integration: Coaching App in TypeScript

Install the SDKs:

```bash
npm install @getzep/zep-cloud ai @ai-sdk/openai
```

A complete Next.js App Router route that queries the temporal graph, streams a response, and stores both turns in Zep once the stream completes:

```typescript
import { ZepClient } from "@getzep/zep-cloud";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const client = new ZepClient({ apiKey: process.env.ZEP_API_KEY! });

export async function POST(req: Request) {
  const { userId, sessionId, message } = await req.json();

  // Query the temporal graph for goal and preference history
  const edges = await client.graph.searchEdges({
    userId,
    query: "user goals and preferences",
    limit: 10,
  });

  // Reconstruct the timeline from bi-temporal edges
  const timeline =
    edges.edges
      ?.sort((a, b) => new Date(a.validAt).getTime() - new Date(b.validAt).getTime())
      .map(
        (e) =>
          `${e.fact} (valid: ${e.validAt}${e.invalidAt ? ` → ${e.invalidAt}` : ", current"})`
      )
      .join("\n") ?? "No history yet.";

  // Stream the response with temporal context in the system prompt
  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are a personal coach. Here is this user's goal history:\n${timeline}\n\nAcknowledge how their goals have evolved when relevant.`,
    messages: [{ role: "user", content: message }],
    onFinish: async ({ text }) => {
      // Store both turns once streaming completes — this triggers graph extraction
      await client.memory.add(sessionId, {
        messages: [
          { role: "user", roleType: "user", content: message },
          { role: "assistant", roleType: "assistant", content: text },
        ],
      });
    },
  });

  return result.toDataStreamResponse();
}
```

The `onFinish` callback is key: it stores both the user message and the assistant's reply together after the stream completes, which gives Graphiti the full exchange to extract entities and time-bound facts from. Storing mid-stream would produce incomplete graph data.

**Python equivalent (with Graphiti self-hosted):**

```python
from graphiti_core import Graphiti
from graphiti_core.utils.bulk_utils import RawEpisode
from datetime import datetime, timezone

graphiti = Graphiti("bolt://localhost:7687", "neo4j", "password")
await graphiti.build_indices_and_constraints()

# Add conversation episode
await graphiti.add_episode(
    name="coaching_session",
    episode_body="User: I used to want to run 10km/week. Now I just want to stay active.",
    reference_time=datetime.now(timezone.utc),
    group_id="user_jane_smith",
)

# Query temporal facts
results = await graphiti.search(
    query="running goals",
    group_ids=["user_jane_smith"],
    num_results=10,
)

for edge in results:
    print(f"{edge.fact} | valid: {edge.valid_at} → {edge.invalid_at or 'now'}")
```

Sessions in Zep Cloud are user-scoped. `memory.add` stores to a session; `graph.searchEdges` queries the user-level graph across all sessions. The cross-session integration is powerful for long-term tracking but means there is no hard isolation between sessions for the same user.

## Self-Hosting with Graphiti

Graphiti is Apache 2.0. You can run it entirely on your own infrastructure.

**Requirements:** Docker, Docker Compose, and a graph database — either Neo4j (primary, recommended) or FalkorDB (added in 2025, lighter weight and Redis-based).

```bash
# Clone and start
git clone https://github.com/getzep/graphiti
cd graphiti
docker compose up -d
```

The [Docker Compose file](https://github.com/getzep/graphiti/blob/main/docker-compose.yml) spins up the Graphiti server and a Neo4j instance. The [server README](https://github.com/getzep/graphiti/blob/main/server/README.md) covers configuration.

FalkorDB is a good choice if you want a lighter footprint or already run Redis. It was added as a supported backend alongside the 14,000-star milestone announcement in mid-2025.

**Is Graphiti production-ready standalone?** The repo has 14K+ stars, 35+ contributors, 25,000+ weekly PyPI downloads, and an active commit cadence as of April 2026. The arXiv paper gives it a rigorous theoretical foundation. Teams are using it in production. It is not a toy — but self-hosting a graph database adds ops burden that Zep Cloud avoids.

## Zep vs Mem0 vs Letta

| | Zep / Graphiti | Mem0 | Letta |
|---|---|---|---|
| **Core model** | Temporal knowledge graph | Hybrid vector + graph + KV | In-context memory blocks |
| **Temporal tracking** | Native (bi-temporal, fact invalidation) | Basic | Snapshot archival |
| **Updates** | Incremental episodes, non-destructive | Batch extractions, overwrites | Background "sleeptime" agent |
| **Mental model** | Graph entities + time-bound edges | Unified user memory layer | Self-modifying agent state |
| **Best for** | Goal evolution, CRM agents, coaching | Drop-in personalization | Fully stateful agents |
| **Complexity** | Medium — graph concepts required | Low — drop-in | High — agent architecture |

**Pick Zep when:** You need to track how user facts change over time. Coaching apps, companion apps, therapy-adjacent products, sales agents tracking prospect history, any scenario where the *trajectory* matters as much as the current state.

**Pick Mem0 when:** You need persistent user personalization without temporal complexity. User profiles, preferences, and context that don't need a full time-series history. Mem0 has a better free tier and is easier to integrate.

**Pick Letta when:** You need agents that reason about and modify their own state between sessions. Letta's memory block architecture is different from either Zep or Mem0 — it's about agent self-modification, not user memory storage.

See the [AI Memory Architecture Decision Framework](./ai-memory-architecture-decision-framework) for the full decision tree.

## 2026 Pricing

Knowledge graph features require a paid Zep Cloud plan.

| Plan | Price | Credits | Rate Limit |
|---|---|---|---|
| **Flex** | $125/mo | 50,000 credits | 600 RPM |
| **Flex Plus** | $375/mo | 200,000 credits | 1,000 RPM |
| **Enterprise** | Custom | Custom | SLA-guaranteed |

All plans include unlimited memories, unlimited retrieval, and unlimited users. The Flex tier includes auto top-up at 20% remaining and 30-day credit rollover. Flex Plus adds custom extraction instructions, webhooks, analytics, and 7-day API log retention.

Enterprise adds SOC 2 Type II certification, HIPAA BAA, audit logs, and deployment flexibility: managed, BYOK (bring your own key), BYOM (bring your own model), or BYOC (bring your own cloud). If your app handles health data or requires data residency guarantees, Enterprise is the path.

Credits cover graph construction (which involves LLM extraction per episode), not just storage. Factor in that every `memory.add` call triggers entity extraction — at scale this compounds.

## When NOT to Use Zep

Zep adds real complexity. Skip it when:

- **Facts don't change.** If your user's preferences are stable across sessions, a simpler approach — Mem0, a key-value store, even file-based memory — is cheaper and easier.
- **Sessions are isolated.** Zep's user-level graph integrates across all sessions. If you need strict session isolation (multi-tenant, privacy-sensitive contexts), that cross-session blending is a liability.
- **Budget is tight (under $125/mo).** Zep Cloud's knowledge graph requires a paid plan. The graph construction also incurs LLM API costs per episode. Self-hosting Graphiti is free but adds infrastructure. For early-stage apps, the [DIY path with pgvector](./diy-ai-memory-pgvector-convex) is more cost-effective.
- **You need simple retrieval.** If you're storing facts and retrieving them by semantic similarity, a vector store is simpler and has no graph overhead.

The bi-temporal model is genuinely powerful. It's also genuinely more complex than a vector store. The right question is whether your app actually needs to answer "what was true then" — if it does, Zep is purpose-built for it.

## Key Takeaways

- **Bi-temporal = two time dimensions per fact.** Valid time (when it's true in the world) and transaction time (when the system learned it). Facts are invalidated, not deleted — you keep the full history.
- **Graphiti is the open-source engine.** Apache 2.0, ~14K GitHub stars, Neo4j or FalkorDB backends, Docker-composable. Production-ready for teams willing to manage the graph infrastructure.
- **Zep Cloud abstracts the infrastructure.** Flex plan starts at $125/mo. Enterprise adds HIPAA BAA and data residency (BYOK/BYOC).
- **Use it when trajectory matters.** Coaching, companion apps, long-term personalization, sales agents, therapy-adjacent products. Skip it when facts are stable or budgets are tight.
- **Benchmark-backed.** The January 2025 arXiv paper (2501.13956) shows 94.8% DMR accuracy and +18.5% on LongMemEval over prior state-of-the-art.

---

*Sources: [Zep arXiv paper](https://arxiv.org/abs/2501.13956) · [Graphiti GitHub](https://github.com/getzep/graphiti) · [Zep pricing](https://www.getzep.com/pricing/) · [Graphiti architecture blog](https://blog.getzep.com/graphiti-knowledge-graphs-for-agents/) · [FalkorDB support announcement](https://blog.getzep.com/graphiti-knowledge-graphs-falkordb-support/) · [Graphiti Docker Compose](https://github.com/getzep/graphiti/blob/main/docker-compose.yml) · [Zep open-source page](https://www.getzep.com/product/open-source/) · [Mem0 vs Zep comparison](https://dev.to/anajuliabit/mem0-vs-zep-vs-langmem-vs-memoclaw-ai-agent-memory-comparison-2026-1l1k) · [Zep vs Mem0 alternative page](https://www.getzep.com/mem0-alternative/) · [Graphiti server README](https://github.com/getzep/graphiti/blob/main/server/README.md)*
