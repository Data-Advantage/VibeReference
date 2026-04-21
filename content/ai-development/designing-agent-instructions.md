# Designing Agent Instructions That Actually Work

Writing instructions for AI coding agents is deceptively hard. A vague system prompt produces an agent that wanders. An overly rigid one breaks when anything unexpected happens. The difference between an agent that ships and one that spins its wheels usually comes down to how its instructions are structured.

This guide covers practical patterns for writing agent instructions — the kind that survive contact with real tasks. These patterns come from running 10+ AI agents (CEO, CTO, engineers, researchers, marketers, designers) as a fully autonomous company, where every employee is a Claude or Codex agent coordinated through a task management system.

> **Where this fits in the [5-concept stack](./agents-vs-harnesses).** Instructions are what turn a bare **Harness** (Claude Code, Cursor, Codex) into a specific **Agent**. They encode the role, mission, scope, and operating norms that distinguish one agent from another — everything else (Model, Tools, the harness loop) is shared infrastructure. Writing good instructions is the primary lever for configuring agents; this guide is a working reference.

## Why Agent Instructions Matter More Than You Think

When a human joins a company, they absorb context through hallway conversations, code reviews, and watching how others work. AI agents have none of that ambient learning. Their instructions file is their entire understanding of who they are, what they should do, and how they should behave.

Bad instructions create agents that:
- Do work outside their role (an engineer who starts making product decisions)
- Escalate everything instead of making judgment calls
- Miss critical quality gates
- Produce output that needs constant human correction

Good instructions create agents that operate autonomously for hours, make reasonable decisions when ambiguity arises, and produce work that needs minimal review.

## The Anatomy of an Agent Instructions File

After iterating on dozens of instruction files, a consistent structure emerges. Every effective agent instructions file has these layers:

### 1. Identity and Role

Start with who the agent is and what they own. Keep it concrete.

**Weak:**
```
You are a helpful AI assistant that writes code.
```

**Strong:**
```
You are the Founding Engineer. You report to the CTO.
Your job is to ship — write code, fix bugs, build features,
and keep the codebase healthy.
```

The strong version establishes a specific identity, a reporting relationship, and a clear scope. The agent knows it writes code (not marketing copy), it knows who to escalate to, and it knows its job is to ship — not to plan, not to research, not to design.

### 2. Responsibilities (What You Own)

List the agent's responsibilities explicitly. This is both an authorization ("you may do these things") and a boundary ("you should not do other things").

```markdown
## Responsibilities

- Implement features and fix bugs as assigned via tasks.
- Keep code quality high: write clean, simple, correct code.
- Review and validate your own work before marking tasks done.
- Escalate blockers to the CTO promptly — do not sit on blocked tasks.
```

Notice what this does not include: product strategy, hiring decisions, architecture choices, customer communication. Boundaries are defined by omission. If it is not listed, the agent should not do it.

### 3. Workflow (How You Work)

This is where most instructions fail. They describe what the agent should do but not how to do it in sequence. Agents need a step-by-step procedure for their main loop.

```markdown
## Workflow

1. Check assignments each heartbeat.
2. Checkout before working on any task.
3. Read the issue and context to understand *why*, not just *what*.
4. If the task is large (multi-file changes, full page builds):
   break it into subtasks first.
5. Do the work. Test it if possible.
6. At ~60 turns, checkpoint: post a progress comment so work
   is recoverable if the session is cancelled.
7. Comment with a clear summary of what changed and why.
8. Mark done, or blocked with explicit blocker context.
```

The checkpoint at step 6 is a real lesson learned. Long-running agent sessions can be interrupted. Without checkpointing, hours of context and partial work are lost. This single instruction prevents the most common failure mode of agentic coding.

### 4. Standards and Guardrails

Every agent needs explicit rules about quality, safety, and when to stop.

```markdown
## Code Standards

- Prefer editing existing files over creating new ones.
- No unnecessary abstractions, helpers, or future-proofing.
- No docstrings or comments on code you didn't change.
- Validate at system boundaries only (user input, external APIs).
- Security first: no command injection, XSS, SQL injection.
```

These standards prevent the most common AI coding failure: over-engineering. Without explicit instructions to keep things simple, agents will add abstraction layers, create helper utilities for one-time operations, and add error handling for scenarios that cannot happen.

### 5. Decision Authority (Fix vs. Escalate)

One of the hardest problems in agent design is calibrating autonomy. Too much autonomy and the agent makes bad decisions. Too little and it escalates everything, defeating the purpose of automation.

The solution is an explicit fix-vs-escalate matrix:

```markdown
## Fix-First Heuristic

You may auto-fix these issues without asking:
- Dead code, stale comments, unused imports
- Missing imports required by your changes
- Lint errors and formatting issues
- Obvious typos in strings or variable names

You MUST escalate these (do not auto-fix):
- Security-related changes (auth, permissions, encryption)
- Removing user-facing functionality
- Architecture or design pattern changes
- Database schema changes beyond what the task requires
- Changes to third-party API contracts

When in doubt, escalate. A round-trip to the CTO is cheaper
than a bad autonomous fix.
```

The last line is critical. Agents tend toward action — they want to solve problems. Explicitly telling them that escalation is cheaper than a mistake calibrates their judgment toward safety.

## Patterns That Work

### Pattern: Role-Specific Context Loading

Different agents need different context before they start work. A product manager needs to read the product strategy document. An engineer needs to read the codebase. A marketer needs to check analytics.

Build context-loading into the instructions:

```markdown
## Product Strategy Context

Every project repo contains a PRODUCT.md with product strategy:
vision, target user, positioning, current priorities, and key
decisions. Before starting work on any project, read PRODUCT.md
to understand the product direction.
```

This ensures agents do not operate in a vacuum. Without it, engineers build features that contradict the product vision and marketers write copy that does not match the positioning.

### Pattern: Delegation Rules

In multi-agent systems, clear delegation rules prevent circular task assignments and role confusion.

```markdown
## Research Delegation (Non-Negotiable)

The CEO NEVER performs research directly — no web searches,
no fact-checking, no data audits. ALL research is delegated
to the Researcher agent. When a task requires research, create
a subtask with a fully actionable prompt.
```

Without this rule, the CEO agent would spend its entire budget on web searches instead of strategic work. The "non-negotiable" label signals to the model that this is not a suggestion.

### Pattern: Review Gates

Quality gates prevent agents from shipping broken or substandard work:

```markdown
## Code Review (Gate) — Two-Pass Protocol

Pass 1 — Critical (must fix before merge):
- Security issues: secrets in code, injection risks
- Data loss or corruption risks
- Race conditions or concurrency bugs
- Broken functionality
- Build failures

Pass 2 — Informational (nice to fix, not blocking):
- Style and naming improvements
- Performance optimizations
- Code organization suggestions

If Pass 1 has issues, send it back with critical items only.
Do not mix Pass 2 feedback into a blocking review.
```

The two-pass structure prevents a common failure: mixing critical feedback with nice-to-haves, which causes agents to lose track of what actually needs fixing.

### Pattern: Communication Standards

Agents need explicit instructions about how to communicate, not just what to do:

```markdown
## Comment Style (Required)

When posting comments, use concise markdown with:
- A short status line
- Bullets for what changed or what is blocked
- Links to related entities when available

Ticket references are links: if you mention another ticket
like PAP-224, wrap it in a markdown link.
```

Without communication standards, agents either write walls of text that nobody reads or terse one-liners that lack context for the next agent picking up the work.

## Common Mistakes

### Mistake: Instructions That Are Too Abstract

```markdown
# Bad
Ensure high-quality code output that follows best practices.

# Good
Prefer editing existing files over creating new ones.
No unnecessary abstractions or future-proofing.
Validate at system boundaries only.
```

Abstract instructions give agents room to interpret, and they will interpret differently every session. Concrete rules produce consistent behavior.

### Mistake: No Failure Modes

Instructions that only describe the happy path leave agents stranded when things go wrong:

```markdown
# Bad
Complete the task and mark it done.

# Good
Mark done, or blocked with explicit blocker context.
If blocked: (1) update status, (2) comment explaining
the blocker, (3) mention whoever can unblock.
Never exit with in_progress and no comment.
```

### Mistake: Mixing Identity with Procedure

Agent instructions should separate who the agent is (identity, role, responsibilities) from how it works (procedures, workflows, standards). Mixing them creates confusion:

```markdown
# Bad
You are an engineer who checks out tasks from the task
queue and writes TypeScript code following our ESLint
config and submits PRs that...

# Good
## Role
You are the Founding Engineer. You ship features and fix bugs.

## Workflow
1. Check assignments each heartbeat.
2. Checkout before working.
3. Do the work.
4. Mark done or blocked.

## Code Standards
- TypeScript only. Follow the project ESLint config.
```

### Mistake: No Budget Awareness

Agents without budget awareness will work on low-priority tasks when resources are scarce:

```markdown
## Budget

Auto-paused at 100% monthly budget. Above 80%, focus on
critical tasks only. Below 80%, work through all priorities.
```

## Scaling to a Team of Agents

When you have multiple agents, their instructions must interlock. Each agent needs to know:

1. **Who they report to** — for escalation
2. **Who reports to them** — for delegation
3. **Who their peers are** — for cross-functional coordination
4. **The agent roster** — IDs and roles of all agents they might interact with

```markdown
## Agent Roster

| Agent | Role | ID | Notes |
|-------|------|----|-------|
| CTO | Technical lead | abc-123 | Escalate technical blockers |
| Engineer | IC developer | def-456 | Assign implementation tasks |
| Researcher | Research analyst | ghi-789 | Delegate all research |
```

Without a roster, agents cannot create tasks for each other, cannot escalate properly, and cannot coordinate on cross-cutting work.

## Testing Your Instructions

Before deploying an agent with new instructions, test them against these scenarios:

1. **Ambiguous task**: Give the agent a task with unclear requirements. Does it ask for clarification or guess?
2. **Out-of-scope request**: Ask the agent to do something outside its role. Does it refuse and redirect?
3. **Blocked path**: Create a scenario where the agent cannot complete the task. Does it escalate properly?
4. **Long-running work**: Give the agent a task that takes many turns. Does it checkpoint?
5. **Quality gate**: Introduce a deliberate error. Does the review process catch it?

If the agent fails any of these, the instructions need another iteration.

## The Instructions Are Never Done

Agent instructions are living documents. Every time an agent makes a mistake, the fix is usually an instruction update — not a code change. Track these iterations:

- When an agent does work outside its role, add a boundary
- When an agent escalates something it should have handled, expand its fix-first list
- When an agent misses a quality check, add it to the review gate
- When an agent produces poor communication, add a comment template

The best agent instructions are the ones that have been refined through dozens of real failures. They read like a codebase — not because they are code, but because they have been debugged with the same rigor.

## Key Takeaways

- **Identity first**: Start with who the agent is and what it owns. Be specific.
- **Workflow second**: Step-by-step procedures beat abstract guidelines.
- **Explicit boundaries**: Define what the agent should not do, not just what it should.
- **Fix vs. escalate**: Calibrate autonomy with a concrete decision matrix.
- **Communication standards**: Agents need to know how to hand off work, not just how to do it.
- **Iterate from failures**: Every agent mistake is an instruction bug. Fix the instructions, not just the output.

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the canonical 5-concept stack
- [Claude Code](./claude-code) — the harness most agents in this guide run on
- [Multi-Agent Task Delegation](./multi-agent-task-delegation) — coordinating a team of configured agents
- [AI Agent Orchestration](./ai-agent-orchestration) — orchestration patterns above the agent layer
- [Context Engineering](./context-engineering) — how instructions reach the model via the Context primitive
