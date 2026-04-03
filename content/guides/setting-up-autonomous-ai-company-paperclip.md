# Setting Up an Autonomous AI Company with Paperclip

An autonomous AI company is one where AI agents handle the day-to-day operational work — coding, marketing, research, product management — while humans serve as the board of directors, setting strategy and approving major decisions. This is not theoretical. Companies are running this way today, with fleets of Claude and Codex agents coordinated through task management systems.

This guide covers the practical setup: how to structure agent roles, define a chain of command, establish governance, and get your first agents producing real work. Based on running a company with 14 AI agents across engineering, marketing, product, research, design, legal, and operations — processing over 1,000 tasks through a structured delegation system.

## What an Autonomous AI Company Looks Like

The operating model borrows from traditional corporate structure but adapts it for agents:

```
Board of Directors (Humans)
  └── CEO Agent
       ├── CTO Agent
       │    ├── Founding Engineer Agent
       │    ├── Engineer 2 Agent
       │    ├── Cursor Developer Agent
       │    └── DevOps Agent
       ├── CMO Agent
       ├── CPO Agent
       ├── CDO Agent (Design)
       ├── CLO Agent (Legal)
       ├── Ops Assistant Agent
       └── Researcher Agent
```

Humans sit at the board level. They set strategy, approve plans, allocate budgets, and make decisions that require judgment calls about the business direction. Everything below the board is AI agents.

The CEO agent is the key translation layer. It takes board-level strategy ("grow our content site's organic traffic") and turns it into actionable work for the team ("CTO: implement technical SEO improvements; CMO: develop an inbound content plan; Researcher: do keyword gap analysis").

## Step 1: Choose Your Coordination Layer

Agents need a system to receive work, track progress, and hand off to each other. You have three options:

| Approach | Best For | Limitation |
|----------|----------|------------|
| **Task management system** (Paperclip, Linear + custom scripts) | Companies with 5+ agents | Requires setup and maintenance |
| **Git-based coordination** (issues, PRs, and CODEOWNERS) | Engineering-only teams | Does not scale beyond code tasks |
| **Shared context files** (markdown files agents read/write) | Prototypes and experiments | No concurrency control or status tracking |

A dedicated task management system is worth the setup cost as soon as you have more than two or three agents. Without it, agents lose track of what they are working on, duplicate effort, and cannot escalate blockers.

### The Heartbeat Model

Most agent coordination systems use a heartbeat model: agents wake up periodically, check for assigned work, execute tasks, and go back to sleep. Each wake cycle is a "heartbeat" — a short execution window where the agent checks assignments, picks a task, does the work, and reports results.

The heartbeat procedure:

1. **Identity**: Agent confirms who it is and what it can do
2. **Check assignments**: Get list of tasks assigned to this agent
3. **Pick work**: Prioritize `in_progress` over `todo`, skip `blocked` unless new context exists
4. **Checkout**: Lock the task to prevent other agents from working on it simultaneously
5. **Understand context**: Read the task, its parent chain, and recent comments
6. **Do the work**: Use tools and capabilities to complete the task
7. **Update status**: Mark done, blocked (with explanation), or in-progress (with checkpoint)
8. **Delegate if needed**: Create subtasks for other agents

This loop runs every time an agent wakes up. The consistency is important — agents that follow the same procedure every heartbeat produce predictable, trackable results.

## Step 2: Define Your Agent Roles

Start with the minimum viable team, then add roles as needed. Here is a sensible progression:

### Phase 1: Two Agents

- **CEO Agent**: Receives tasks from the board, breaks them down, assigns to the engineer
- **Engineer Agent**: Writes code, fixes bugs, ships features

This is enough to start shipping. The CEO handles prioritization and the engineer handles execution.

### Phase 2: Four Agents

Add when the CEO is spending too much time on non-strategic work:

- **CTO Agent**: Takes over engineering management, code review, and architecture decisions
- **Researcher Agent**: Handles all web research, market analysis, and data collection

The CTO frees the CEO from code review. The Researcher prevents the CEO from spending its budget on web searches instead of strategic work.

### Phase 3: Full Team

Add as workload demands:

- **CMO Agent**: Marketing strategy, content creation, SEO
- **CPO Agent**: Product strategy, roadmaps, requirements
- **DevOps Agent**: Infrastructure, deployment, monitoring
- **Designer Agent**: UI/UX review, design system governance

Each addition should be justified by a specific bottleneck. Do not hire agents you do not need — they cost compute and add coordination overhead.

## Step 3: Write Agent Instructions

Every agent needs an instructions file that defines its identity, responsibilities, workflow, and boundaries. This is the most important document in the system — it determines how well the agent performs.

The instructions file (typically `AGENTS.md`) should include:

### Identity and Reporting

```markdown
You are the CTO. You report to the CEO.
You manage the engineering team (Founding Engineer, Engineer 2).
```

### Responsibilities

```markdown
## Responsibilities
- Define and maintain technical architecture
- Assign and prioritize engineering tasks
- Review all engineering work before it ships
- Make technology choices with documented rationale
```

### Workflow

```markdown
## Workflow
1. Check assignments each heartbeat
2. Checkout before working
3. Read task context to understand why, not just what
4. Do the work
5. Comment with what changed and why
6. Mark done or blocked
```

### Decision Authority

```markdown
## Fix-First Heuristic

Auto-fix without asking:
- Lint errors, unused imports, formatting issues
- Missing imports required by your changes

Escalate to CEO:
- Security-related changes
- Architecture or design pattern changes
- Database schema changes
```

See our detailed guide on [designing agent instructions](/ai-development/designing-agent-instructions) for the full pattern.

## Step 4: Establish Governance

Governance prevents agents from making decisions they should not make. Without it, a well-intentioned engineer agent might merge breaking changes, or a marketing agent might publish content that misrepresents the product.

### The Approval Chain

```
Agent proposes → Manager reviews → CEO approves → Board approves (if needed)
```

Different actions need different approval levels:

| Action | Required Approval |
|--------|------------------|
| Bug fix in existing code | CTO review |
| New feature implementation | CTO review + CEO awareness |
| Marketing plan | CEO review + Board approval |
| New agent hire | CEO proposal + Board approval |
| Spending money (ads, services) | Board approval |
| Publishing content externally | Board launch gate |

### Budget Controls

Every agent should have a compute budget. Without limits, a single agent can burn through hundreds of dollars on a task that should have been escalated after the first failed attempt.

Set monthly budgets per agent and enforce them:

- **Auto-pause at 100%**: Agent stops receiving tasks when budget is exhausted
- **Critical-only mode at 80%**: Agent only works on high-priority tasks above this threshold
- **Budget visibility**: Agents should know their budget status and adjust behavior accordingly

### Quality Gates

Define explicit quality gates for each type of work:

- **Code**: CTO reviews every PR before merge. Two-pass review (critical issues first, style suggestions second).
- **Content**: CEO reviews articles before publishing. Check for accuracy, tone, and alignment with product positioning.
- **Strategy**: Plans go CEO → Board. No execution without approval.
- **Hiring**: Agent proposals go to CEO, who routes to the board. No agent creates another agent without governance.

## Step 5: Set Up Communication Patterns

Agents communicate through task comments, not chat. This creates an auditable, searchable record of every decision and handoff.

### Comment Standards

Every agent should follow the same comment format:

```markdown
## Status line

- What was done (or what is blocked)
- Links to related tasks or artifacts
- Next steps or who needs to act
```

### Handoff Protocol

When an agent finishes its part of a task but more work remains:

1. Comment explaining what was completed
2. Describe what needs to happen next
3. Reassign to the next agent
4. Include enough context that the next agent does not need to re-read the entire history

Bad handoff: "Done with my part. Assigning to CTO."

Good handoff: "Implemented the landing page layout per the wireframe. Three sections: hero, features, CTA. Used Tailwind, no component library. CTO: please review the responsive breakpoints — I am not confident about the tablet layout at 768px."

## Step 6: Run Your First Task

With agents configured and governance in place, run a real task end-to-end:

1. **Board creates a task**: "Add a new guide article about authentication options for solo founders"
2. **CEO receives the task**: Breaks it into subtasks — research (Researcher), writing (CMO or Engineer), and review (CEO)
3. **Researcher executes**: Compiles data on Clerk, Auth.js, Supabase Auth, Firebase Auth. Delivers a structured research brief.
4. **Writer executes**: Uses the research to draft the article. Commits to a feature branch.
5. **CEO reviews**: Reads the article. Sends back revision requests or approves.
6. **Engineer deploys**: Merges and deploys the article to production.

Track how long each step takes, where handoffs get stuck, and where quality issues appear. This first task reveals most of the coordination problems you will need to fix.

### Real Example: Research-to-Publishing Pipeline

Here is how a real task flowed through our system:

1. **Board created task**: "Propose 10 new articles useful for vibe coding or autonomous company setup"
2. **CEO processed**: Reviewed our 1,000+ issue history for real experiences, proposed 10 topics with outlines
3. **CEO delegated**: Created two subtasks — Research (assigned to Researcher agent) and Writing (assigned to CMO agent)
4. **Researcher delivered**: Produced a 45 KB research brief with data points, DAT issue references, and real examples for all 10 topics. Saved to `/handoffs/dat-840-research-brief.md`
5. **CMO wrote**: Produced all 10 articles grounded in the research brief and real agent configs
6. **CEO reviewed**: Quality-checked articles before publishing

Total pipeline: four agents involved, structured handoffs, each agent doing what it does best. The Researcher did not try to write articles. The CMO did not try to do research. Clear role boundaries made the pipeline efficient.

## What Works and What Does Not

After running this model for months, here is what we know:

**Works well:**
- Agents produce consistent, trackable output when instructions are clear
- The heartbeat model scales — agents work in parallel without coordination overhead
- Quality gates catch most issues before they ship
- Task hierarchy creates clear accountability

**Still hard:**
- Agents sometimes do work outside their role despite clear instructions
- Context loss between heartbeats means agents occasionally repeat work
- Budget management requires constant attention — some tasks use 10x more compute than expected
- Cross-functional tasks (marketing + engineering + design) require careful choreography

**Common early mistakes:**
- Creating too many agents before you have enough work to justify them
- Writing vague agent instructions and expecting good judgment
- Skipping the governance layer because it feels like overhead
- Not setting compute budgets and getting surprised by costs
- Treating agent coordination like project management instead of like systems engineering

## Key Takeaways

- **Start with two agents** (CEO + Engineer), add more when bottlenecks appear
- **The instructions file is everything.** Invest time in writing clear, specific agent instructions
- **Governance is not optional.** Approval chains, quality gates, and budget controls prevent expensive mistakes
- **Agents communicate through tasks, not chat.** Comments are the audit trail
- **Run a real task end-to-end** before scaling. Fix coordination problems at small scale
- **This is systems engineering**, not management. You are designing a system, not supervising employees
