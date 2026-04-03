# AI Agent Memory Systems for Long-Running Projects

AI agents forget everything between sessions. Each time an agent wakes up, it starts with its instructions and the current task — nothing about yesterday's debugging session, last week's architecture decision, or the user's preferences it learned three conversations ago.

For short tasks, this does not matter. For long-running projects where agents work over days, weeks, and months, the absence of memory creates real problems: repeated mistakes, lost context, duplicated research, and decisions that contradict earlier choices.

This guide covers practical approaches to giving agents persistent memory — what works, what does not, and how to implement memory systems that actually improve agent performance.

## Why Agents Need Memory

Without persistent memory, agents exhibit predictable failure modes:

- **Re-research**: An agent spends 15 minutes researching something it already researched last week. The research exists in a previous session that is no longer accessible.
- **Contradictory decisions**: An agent makes an architecture choice that contradicts a decision made in a previous session. Without memory of the earlier decision, it has no way to know.
- **Lost user context**: An agent that learned the user prefers concise responses, or that the codebase has a specific testing convention, forgets all of it in the next session.
- **Repeated mistakes**: An agent makes the same error it was corrected for in a previous session. The correction exists in old conversation history that is no longer loaded.

Each of these wastes time and compute. Across hundreds of agent sessions, the cost of forgetting is substantial.

## Memory Approaches Compared

### 1. Conversation History

The simplest form of memory: include previous conversation turns in the context window.

**How it works**: Keep a rolling buffer of recent messages. Each new session loads the last N messages from previous sessions.

**Pros**: Easy to implement. No separate storage needed. Agents naturally reference recent context.

**Cons**: Expensive — every historical message consumes tokens. Limited window — older history falls off. No selectivity — irrelevant conversations consume as much space as relevant ones.

**Best for**: Short-term tasks spanning two to three sessions where full context matters.

### 2. Conversation Summaries

Compress previous conversations into summaries, loading the summary instead of raw history.

**How it works**: After each session, generate a summary of key decisions, learnings, and outcomes. Load summaries instead of full transcripts.

**Pros**: Much cheaper than full history. Covers longer timeframes. Forces prioritization of important information.

**Cons**: Summaries lose detail. Important nuances get compressed away. The summarization itself costs tokens.

**Best for**: Medium-term projects where broad context is more important than exact phrasing.

### 3. Vector Store (RAG)

Store memories as embeddings in a vector database. Retrieve relevant memories based on semantic similarity to the current task.

**How it works**: After each session, embed key facts and decisions. Before each new session, query the vector store with the current task to retrieve relevant context.

**Pros**: Scales to thousands of memories. Retrieval is selective — only relevant memories are loaded. Good for large knowledge bases.

**Cons**: Retrieval is probabilistic — important memories might not surface. Requires embedding infrastructure. Semantic similarity does not always match task relevance. Setup complexity is high.

**Best for**: Large projects with extensive documentation or knowledge bases where agents need to find specific facts.

### 4. File-Based Memory (Structured Files)

Store memories as structured files on disk — markdown, YAML, or JSON — that agents read and write explicitly.

**How it works**: Agents write facts, decisions, and learnings to organized files. Before each session, agents read relevant memory files. A memory index tracks what is stored and where.

```
memory/
├── MEMORY.md          # Index of all memories
├── user_preferences.md
├── project_decisions.md
├── feedback_testing.md
└── reference_external.md
```

**Pros**: Fully transparent — humans can read and edit memories. No probabilistic retrieval — agents read exactly what is stored. No embedding infrastructure needed. Works with any model.

**Cons**: Agents must be explicitly instructed to read and write memories. File organization requires design. Memory files can grow large without pruning.

**Best for**: Agent teams where transparency, human editability, and reliability matter more than automated retrieval.

## Implementing File-Based Memory

File-based memory is the most practical approach for most agent setups. Here is how to implement it.

### Memory Types

Organize memories by type, each serving a different purpose:

**User memories**: Who the user is, their role, preferences, and expertise level.
```yaml
---
name: user_role
description: User is a senior backend engineer, new to React
type: user
---
Deep Go expertise, 10 years. First time working with React
frontend. Frame frontend explanations in terms of backend
analogues.
```

**Feedback memories**: Corrections and confirmations — what the user wants done differently or the same.
```yaml
---
name: feedback_no_mocking
description: Integration tests must hit real database, not mocks
type: feedback
---
Do not mock the database in integration tests.

**Why:** Prior incident where mocked tests passed but production
migration failed — mock/prod divergence masked the bug.

**How to apply:** All database-touching tests run against a real
test database, never mocked interfaces.
```

**Project memories**: Facts about ongoing work, decisions, and context that is not in the code.
```yaml
---
name: project_merge_freeze
description: Merge freeze for mobile release starting March 5
type: project
---
Non-critical merges frozen starting 2026-03-05 for mobile
release branch cut.

**Why:** Mobile team is cutting a release branch and needs
a stable base.

**How to apply:** Flag any non-critical PR work scheduled
after that date. Critical fixes still allowed with CTO approval.
```

**Reference memories**: Pointers to where information lives in external systems.
```yaml
---
name: reference_bug_tracker
description: Pipeline bugs tracked in Linear project INGEST
type: reference
---
Pipeline bugs are tracked in Linear project "INGEST."
Check there for context on pipeline-related tickets.
```

### The Memory Index

The memory index (`MEMORY.md`) is loaded into every conversation. It is a table of contents, not a memory store — each entry is a one-line pointer to a memory file:

```markdown
# Memory Index

- [User role](user_role.md) — Senior backend eng, new to React
- [No mocking](feedback_no_mocking.md) — Integration tests hit real DB
- [Merge freeze](project_merge_freeze.md) — Frozen from March 5 for mobile release
- [Bug tracker](reference_bug_tracker.md) — Pipeline bugs in Linear INGEST
```

Keep the index under 200 lines. If it grows beyond that, consolidate or archive old entries.

### What to Store vs. What to Skip

**Store:**
- User preferences and corrections that should persist
- Non-obvious project decisions and their reasoning
- External system references (where to find things)
- Patterns the agent should follow or avoid

**Do not store:**
- Code patterns or conventions (derivable from the codebase)
- Git history (use `git log`)
- Debugging solutions (the fix is in the code, the commit message has context)
- Anything already documented in project files
- Temporary task details relevant only to the current session

The principle: memory stores what cannot be derived from the current state of the project. If an agent can figure it out by reading the code or running `git log`, it should not be in memory.

### Memory Staleness

Memories decay. A project decision from three months ago might have been reversed. A user preference might have changed. A merge freeze might have ended.

Handle staleness with two rules:

1. **Verify before acting**: If a memory names a specific file, function, or flag — check that it still exists before recommending it. "The memory says X exists" is not the same as "X exists now."

2. **Update or delete stale entries**: When a memory conflicts with current reality, trust what you observe now. Update the memory to reflect current state, or delete it if it is no longer relevant.

Memories that include a date are easier to evaluate for staleness. "Merge freeze from March 5" can be checked against the current date. "Use approach X" with no timestamp is harder to evaluate.

## Memory and Agent Teams

When multiple agents share a project, memory becomes a coordination tool:

### Shared vs. Agent-Specific Memory

Some memories apply to all agents (project decisions, architecture constraints). Others are agent-specific (the CMO's marketing strategy insights, the CTO's code review preferences).

Organize accordingly:

```
project-root/
├── memory/              # Shared project memories
│   ├── MEMORY.md
│   └── ...
└── agents/
    ├── ceo/memory/      # CEO-specific memories
    ├── cto/memory/      # CTO-specific memories
    └── engineer/memory/ # Engineer-specific memories
```

### Memory as Handoff Context

When one agent hands off work to another, memory fills the context gap. Instead of writing a long handoff comment with every relevant detail, the receiving agent can read shared memory files to understand project context, decisions, and constraints.

This is especially valuable for agents that work in different heartbeats and cannot directly communicate. The CTO makes an architecture decision in heartbeat 1, writes it to shared memory. The engineer reads it in heartbeat 2 and implements accordingly — without the CTO needing to repeat the decision in a task comment.

## Common Mistakes

### Mistake: Storing Everything

Agents that write a memory for every interaction create bloated, noisy memory files that consume tokens without adding value. The memory index grows past 200 lines, and agents spend more time reading irrelevant memories than doing work.

Rule: if you are not sure a fact will be useful in a future session, do not store it. Err toward fewer, higher-quality memories.

### Mistake: Never Pruning

Memories that are never deleted accumulate contradictions. The agent has a memory saying "use PostgreSQL" and another saying "migrate to Supabase." Without pruning, the agent does not know which is current.

Review memory files monthly. Delete entries that are no longer true, consolidate entries that have been updated multiple times, and archive entries that are historical but no longer actionable.

### Mistake: Treating Memory as Documentation

Memory is not a wiki. It stores non-obvious facts and decisions — things the agent cannot derive from reading the current codebase. Architecture documentation, API references, and coding conventions belong in project documentation files, not in agent memory.

### Mistake: No Verification

An agent that blindly trusts memory will act on stale information. A memory says "the API key is in .env.local" — but the project moved to a secrets manager two weeks ago. The agent wastes a session looking for a file that no longer exists.

Always verify memory claims against current state before acting on them, especially for file paths, function names, and configuration details.

## Key Takeaways

- **File-based memory is the most practical approach** for most agent setups. Transparent, human-editable, and requires no infrastructure.
- **Organize by type**: user preferences, feedback/corrections, project decisions, external references.
- **Store what cannot be derived** from the codebase or git history. Skip everything else.
- **Keep the index under 200 lines.** Every entry in the index costs tokens on every session.
- **Verify before acting.** Memories can go stale. Check that files, functions, and decisions still exist before recommending them.
- **Prune monthly.** Delete stale entries, consolidate duplicates, archive historical-but-inactive memories.
- **Shared memory coordinates agent teams.** Project decisions in shared files prevent contradictory work across agents.
