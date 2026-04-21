# Multi-Agent Task Delegation: Patterns and Anti-Patterns

When you have multiple AI agents working together — a CEO agent, a CTO, engineers, a researcher, a marketer — the hardest problem is not getting any single agent to do good work. It is getting them to coordinate. Task delegation is where multi-agent systems succeed or fail.

This guide covers delegation patterns that work in production, drawn from running a fully autonomous company where a CEO agent delegates to managers, who delegate to individual contributors, all coordinated through a task management system.

> **Where this fits in the [5-concept stack](./agents-vs-harnesses).** Every box in the delegation chain below is an **Agent** in the canonical sense — a configured **Harness** (usually Claude Code or Codex) with its own role, mission, scope, and memory store. Delegation is the protocol by which agents create tasks for each other; the handoff is an issue/task, not a raw prompt. The Data Advantage setup (CEO/CTO/CMO/CPO/Researcher running on Paperclip) is a direct example of this architecture.

## The Delegation Chain

A healthy delegation chain looks like this:

```
Board (Human)
  └── CEO Agent
       ├── CTO Agent
       │    ├── Engineer 1
       │    └── Engineer 2
       ├── CMO Agent
       ├── CPO Agent
       └── Researcher Agent
```

Each level has a clear purpose:

- **Board**: Sets strategy, approves plans, makes budget decisions
- **CEO**: Translates strategy into actionable tasks, delegates to managers
- **Managers (CTO, CMO, CPO)**: Own a domain, break tasks into subtasks, assign to ICs
- **Individual Contributors**: Do the work — write code, produce research, create content

The critical insight is that delegation is not just "pass the task down." Each level transforms the task — adding context, breaking it into smaller pieces, setting quality gates, and defining success criteria.

## Pattern: Parent-Child Task Hierarchy

Every delegated task should be a subtask of its parent. This creates a traceable chain from strategic goal to individual work item.

```
Goal: Improve site SEO performance
  └── Task (CEO → CTO): Implement technical SEO improvements
       ├── Subtask (CTO → Engineer): Add JSON-LD structured data
       ├── Subtask (CTO → Engineer): Generate sitemap.xml dynamically
       └── Subtask (CTO → Engineer): Fix meta description generation
```

Rules for parent-child relationships:

1. **Always set `parentId`** when creating subtasks. Orphaned tasks lose their context.
2. **Inherit `goalId`** from the parent so work rolls up to strategic objectives.
3. **Keep subtasks atomic** — each one should be completable in a single agent session.
4. **One assignee per task.** Shared ownership means nobody owns it.

### What Goes Wrong Without Hierarchy

Without parent-child relationships, you get:

- **Context loss**: An engineer gets a task "Add JSON-LD structured data" with no connection to the SEO goal. They implement it for blog posts but miss product pages because they did not know the broader objective.
- **Duplicate work**: Two agents independently decide the site needs a sitemap. Neither knows the other is working on it.
- **Progress blindness**: The CEO cannot tell whether the SEO project is 20% done or 80% done because the subtasks are not linked.

## Pattern: The Checkout Model

In multi-agent systems, race conditions are real. Two agents can try to work on the same task simultaneously, producing conflicting changes.

The checkout model prevents this:

```
1. Agent requests checkout: POST /tasks/{id}/checkout
2. System locks the task to that agent
3. Agent does the work
4. Agent marks task done or blocked
5. Lock is released
```

If another agent tries to check out an already-locked task, they get a conflict response and must pick different work. This is non-negotiable — never retry a conflict. The task belongs to someone else.

### When Checkout Fails

The most common checkout failure is when a manager creates a subtask, assigns it to an engineer, and then immediately tries to check it out themselves "to add more context." The task is already assigned — the manager should add context via a comment, not by checking it out.

## Pattern: Escalation Protocol

Every agent needs a clear escalation path. When an agent is blocked, it should:

1. Update the task status to `blocked`
2. Comment explaining what is blocked and why
3. Mention (or reassign to) whoever can unblock it
4. Move on to the next available task

```markdown
## Blocked — Need API credentials

Cannot complete the Stripe integration. The test API keys
are not in the environment variables and I do not have
access to the Stripe dashboard.

Reassigning to @CEO for board escalation — this requires
human action to provision credentials.
```

### The Blocked-Task Dedup Rule

A common failure mode: an agent wakes up, sees a blocked task, posts another "still blocked" comment, and exits. Next session, it does the same thing. The task accumulates dozens of identical comments.

The fix: before engaging with a blocked task, check the comment thread. If your most recent comment was a blocked-status update and no new comments from others have appeared, skip the task. Only re-engage when new context exists.

## Pattern: Research Delegation

Research is the most commonly mis-delegated task type. The failure mode: a CEO or CTO agent receives a task that requires web research, spends its entire compute budget on searches, and produces mediocre results because research is not its core capability.

The rule: **never perform research directly if you have a research agent.** Create a subtask with a fully actionable prompt.

```markdown
# Bad delegation
Task: "Research competitors"

# Good delegation
Task: "Research top 5 AI image generation tools by monthly
traffic. For each, capture: pricing tiers, key features,
target audience, and primary acquisition channel. Deliver
as a markdown table with sources."
```

The difference between good and bad research delegation:

| Bad | Good |
|-----|------|
| Vague objective | Specific deliverable format |
| No scope boundaries | Explicit number of items |
| No output format | Markdown table with columns defined |
| Researcher must guess intent | Researcher can execute immediately |

## Pattern: Cross-Functional Coordination

Some tasks span multiple domains. A "launch new product page" task might need:

- An engineer to build the page
- A designer to review the layout
- A marketer to write the copy
- A product manager to approve the messaging

Handle this with a coordinator pattern:

1. **One owner** creates the parent task and owns the outcome
2. **Subtasks** are created for each domain with the right assignee
3. **The owner tracks** subtask completion and unblocks dependencies
4. **Quality gates** ensure each piece meets standards before the whole ships

```
Task (CMO owns): Launch product landing page
  ├── Subtask → CPO: Write positioning and messaging brief
  ├── Subtask → Engineer: Build page from approved copy (blocked by CPO subtask)
  ├── Subtask → Designer: Review layout and visual QA
  └── Subtask → CMO: Write launch announcement copy
```

### Cross-Team Billing

When a task crosses team boundaries — a marketing agent creating work for an engineering agent — tag it with a billing code so resource usage is tracked correctly:

```json
{
  "title": "Add FAQ section to landing page",
  "assigneeAgentId": "engineer-1",
  "parentId": "marketing-campaign-task",
  "billingCode": "marketing-q2-launch"
}
```

### Never Cancel Cross-Team Tasks

If you created a task for another team and it turns out to be unnecessary, do not cancel it yourself. Reassign it to your manager with a comment explaining why it should be cancelled. The other team may have already started work or have dependencies on it.

## Anti-Pattern: The Circular Delegation Loop

Agent A creates a task for Agent B. Agent B does not know how to do it, so it creates a subtask for Agent A. Agent A sees the subtask, does not recognize it as circular, and creates another subtask for Agent B.

This happens when:
- Agent roles are not clearly defined
- Agents do not check the task ancestry before delegating
- There is no "this is my job, not yours" boundary in the instructions

Prevention: every agent's instructions should list what it owns and what it delegates. The boundary should be explicit enough that no agent creates work for its own manager.

## Anti-Pattern: The Delegation Flood

A manager agent receives a complex task and immediately creates 15 subtasks for engineers. The engineers cannot work on all of them simultaneously, so most sit in the backlog. Meanwhile, the context that made those subtasks coherent fades as the codebase changes under them.

Better approach: create subtasks in priority order, three to five at a time. Wait for the first batch to complete before creating the next. This keeps context fresh and lets you adjust the plan based on what you learn from early subtasks.

## Anti-Pattern: Delegating Without Context

```markdown
# Bad
Task: "Fix the search bug"

# Good
Task: "Fix search returning zero results for queries with
special characters. Repro: search for 'c++' on the topics
page — returns empty. Expected: should return C++ related
topics. The search function is in lib/directory.ts,
searchTopics(). Likely needs input sanitization before
the regex match."
```

The good version includes:
- What is broken (zero results)
- How to reproduce it (search for "c++")
- What should happen instead (return C++ topics)
- Where to look (lib/directory.ts)
- A hypothesis (regex input sanitization)

An engineer agent with this context can fix the bug in one session. Without it, they spend half their session figuring out what "the search bug" means.

## Anti-Pattern: Status Update Theater

Agents that post long status updates without making progress:

```markdown
# Bad (wastes a session)
"I reviewed the task requirements and understand that we
need to implement search functionality. I have identified
the relevant files and will begin implementation in my
next session. The approach will involve..."

# Good (ships in one session)
"Added client-side search to the header. Filters topics
by title and description with 200ms debounce. Tested with
edge cases (empty query, special characters, no results).
Marking done."
```

The fix is in the agent's instructions: "Comment with what you did, not what you plan to do. If you plan to do it, just do it."

## Measuring Delegation Health

Track these metrics to evaluate whether your delegation system is working:

- **Task completion rate**: What percentage of created tasks reach "done" vs. "cancelled" or "stuck in backlog"? Below 70% suggests over-delegation.
- **Blocked task duration**: How long do tasks stay blocked? Long blocks usually mean the escalation path is broken.
- **Delegation depth**: How many levels deep do subtasks go? More than three levels usually means tasks are not atomic enough at the top.
- **Context round-trips**: How often does an assignee ask the delegator for clarification? Frequent round-trips mean delegation context is too thin.

## Key Takeaways

- **Every subtask needs a parent.** Orphaned tasks lose context and create duplicate work.
- **Checkout prevents conflicts.** Never retry a conflict — pick different work.
- **Blocked means escalate, not wait.** Update status, comment the blocker, mention who can fix it, move on.
- **Delegate research with a prompt, not a topic.** Specific deliverables beat vague directions.
- **Sequence subtasks, do not flood.** Three to five at a time, in priority order.
- **Include reproduction steps and file paths.** Context is the difference between a one-session fix and a multi-session investigation.

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the canonical 5-concept stack
- [Designing Agent Instructions](./designing-agent-instructions) — defining each agent's role/scope so delegation lines up
- [AI Agent Orchestration](./ai-agent-orchestration) — orchestration patterns above the delegation layer
- [Autonomous Companies](./autonomous-companies) — what a fully agent-run org looks like in practice
- [Claude Code](./claude-code) — the harness most agents in this delegation chain run on
