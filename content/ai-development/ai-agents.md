# AI Agents

An **AI agent** is a harness empowered with a role, a mission, and a scope — then pointed at work. The harness supplies the runtime (model invocation, tool execution, context management, loop orchestration); the role/mission/scope supplies the purpose. Together they make a worker that can operate autonomously toward a goal.

This definition sits inside the canonical 5-concept stack introduced in [AI Agents vs Harnesses](./agents-vs-harnesses):

1. **Model** — LLM weights doing inference (Claude, GPT, Gemini)
2. **Tools** — discrete capabilities the model can invoke (bash, file I/O, web search, [MCP](./mcp-model-context-protocol) servers)
3. **Context** — everything in the model's context window on a given turn
4. **Harness** — the runtime that wires Model + Tools + Context into a loop (Claude Code, Cursor, Windsurf, Devin)
5. **Agent** — a harness empowered with role + mission + scope, then pointed at work

Most industry writing conflates layers 4 and 5 — calling Claude Code an "agent," calling Cursor an "agent." This article uses the strict definition: an agent is the *configured* instance of a harness, not the harness binary itself.

## What Configuration Makes an Agent

Five things, stacked on top of a harness:

### Role

Who this agent is. "CMO," "senior backend engineer," "documentation specialist," "security reviewer." The role shapes the agent's voice, priorities, and default approach. A CMO agent reviewing a codebase notices marketing copy and accessibility; a backend engineer notices query plans and transaction boundaries.

### Mission

What the agent is trying to accomplish across its lifetime. "Grow inbound traffic to Data Advantage properties." "Keep the VibeReference build green." "Respond to customer support tickets." Missions persist across individual tasks.

### Scope

What's in bounds and what isn't. Which repos the agent may touch, which commands it may run, which resources it may spend, which tasks it may accept. A well-scoped agent declines work outside its mandate instead of heroically doing it badly.

### Memory

What the agent remembers across invocations. Past decisions, ongoing projects, user preferences, lessons learned. Without memory, every task starts from zero — with it, the agent can pick up where it left off and get better over time. See [AI Agent Memory Systems](./ai-agent-memory-systems) for patterns.

### Skills / tools

The subset of the harness's full toolset that this agent is allowed to use. A research agent might have web search and file read; a code agent adds edit, bash, and test execution. Restricting tools by agent role is a form of scope enforcement.

The practical artifact that encodes this configuration is usually an **AGENTS.md** (or CLAUDE.md) file in the project. See [Designing Agent Instructions](./designing-agent-instructions) for the mechanics.

## The Agent Loop

Once configured, an agent runs the harness loop against its mission. At each turn:

1. **Observe.** Read the current task, look at relevant files, check recent tool results.
2. **Plan.** Decide what to do next based on the mission and scope.
3. **Act.** Call a tool — edit a file, run a command, query an API, post a comment.
4. **Verify.** Check the result. Did the test pass? Did the file land where expected?
5. **Repeat** until the mission segment is complete or a handoff is needed.

This is the harness's observe → plan → act → verify cycle, now steered by the agent's role/mission/scope. See [The Harness Orchestration Loop](./agent-harness-feedback-loop) for the loop mechanics in depth.

## Common Agent Patterns

These are patterns *inside* the harness loop, not alternatives to it.

### ReAct (Reason + Act)

The agent alternates between short reasoning steps and tool calls:

```
Thought: I need to find the authentication middleware.
Action: grep("auth middleware", src/)
Observation: Found in src/middleware/auth.ts
Thought: Now I need to understand how it validates tokens.
Action: read_file("src/middleware/auth.ts")
Observation: Uses JWT validation with...
```

Most modern harnesses implement ReAct by default.

### Plan-Then-Execute

The agent drafts a full plan first, then executes each step. Useful for tasks where the shape of the work is clear upfront (a structured refactor, a multi-file feature). Less useful when the agent needs to discover the shape of the problem as it goes.

### Reflexion

The agent critiques its own output before submitting it. "I wrote this function, but it doesn't handle the empty-array case and the naming is inconsistent." Often implemented as a self-review pass at the end of a task, sometimes as a dedicated reviewer sub-agent.

These patterns aren't agent types — they're execution strategies an agent can use within a harness loop.

## Types of Agents by Mission

### Coding agents

Mission: build or modify software. Scope: one or more repos. Typical harnesses: Claude Code, Cursor, Windsurf, Devin, Aider. See [Agentic Coding](./agentic-coding) for the workflow.

### Research agents

Mission: gather and synthesize information. Scope: web, documents, internal wikis. Typical tools: web search, document fetch, summarization. Example: our own Researcher agent at Data Advantage runs on Claude Code but is scoped away from code edits and toward external data gathering.

### Workflow agents

Mission: automate business processes. Scope: a set of SaaS tools (email, tickets, spreadsheets, CRM). Typical tools: API integrations via [MCP](./mcp-model-context-protocol) servers or dedicated connectors.

### Multi-agent systems

A coordinator agent delegates sub-tasks to specialized agents, each with its own role, mission, and scope. See [AI Agent Orchestration](./ai-agent-orchestration) and [Multi-Agent Task Delegation](./multi-agent-task-delegation) for coordination patterns.

The Data Advantage agent roster (CEO, CTO, CMO, CPO, researcher) is a multi-agent system. All agents run on the same harness (Claude Code) but each has a distinct role, mission, scope, memory, and task queue.

## Building an Agent

The steps, in order:

1. **Pick a harness.** Claude Code, Cursor, Windsurf, Aider, Devin. See [Coding Harnesses](./coding-harnesses).
2. **Pick a model.** Usually constrained by the harness. Prefer the best model for the agent's role — high-judgment work on frontier models, high-volume execution on faster tiers.
3. **Define tools.** Start with the harness defaults, then add [MCP](./mcp-model-context-protocol) servers, skills, or custom commands for the agent's specific needs.
4. **Design context.** What belongs in the default system prompt? What lives in AGENTS.md? What gets loaded on demand? See [Context Engineering](./context-engineering).
5. **Write the AGENTS.md.** Role, mission, scope, operating norms, escalation rules. See [Designing Agent Instructions](./designing-agent-instructions).
6. **Set permissions and budgets.** What can the agent do autonomously, what requires approval, how much can it spend. See [Managing AI Agent Budgets](./ai-agent-budgets-cost-control).
7. **Hand it work.** Tasks, tickets, a queue — whatever maps onto the mission.

The first five steps are the configuration that turns a harness into an agent. The last two make the agent productive.

## Evaluating Agents

| Metric | What it measures |
|--------|-----------------|
| Task completion rate | % of tasks completed to the agent's own "done" bar |
| Iterations to completion | How many harness loop cycles per task |
| Token efficiency | Tokens consumed per successful task |
| Error recovery rate | % of errors the agent self-corrects without human input |
| Human intervention rate | How often humans step in to unblock |
| Scope adherence | % of tasks the agent correctly accepts vs. declines |

Scope adherence is often overlooked but critical — an agent that does work outside its mandate creates more downstream mess than one that politely declines.

## Limitations

- **Context decay.** Long tasks fill the context window and the model degrades. Tight loops and good summarization mitigate, but don't eliminate, this.
- **Compounding errors.** A small mistake early can cascade. Verification steps (tests, lint, review sub-agents) are how harnesses catch this.
- **Non-determinism.** The same task may succeed or fail on different runs. Structured workflows and explicit acceptance criteria reduce variance.
- **Cost.** Long-running agents consume significant tokens. Budgets and scope limits prevent runaways.
- **Security.** Tool access is real access. Sandboxing, permission approval, and least-privilege scopes matter.

## How VibeReference Uses Agents

The agents running Data Advantage (CMO, CTO, CEO, researcher, and others) are configured harnesses pointed at specific missions. Each runs on Claude Code as its harness. Each has a distinct AGENTS.md encoding its role and scope, a persistent memory store, and its own queue of tasks on Paperclip.

The framework's emphasis on agency and taste reflects the skills needed to work effectively with agents. Agency is knowing what to ask for — writing a clear mission and scope. Taste is knowing whether the agent's output is good. Both are user-facing skills; neither is replaced by better models.

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the canonical 5-concept stack
- [Coding Harnesses](./coding-harnesses) — the harness layer
- [The Harness Orchestration Loop](./agent-harness-feedback-loop) — the loop inside a harness
- [Designing Agent Instructions](./designing-agent-instructions) — writing AGENTS.md
- [AI Agent Orchestration](./ai-agent-orchestration) — coordinating multiple agents
- [Multi-Agent Task Delegation](./multi-agent-task-delegation) — delegation patterns
- [AI Agent Memory Systems](./ai-agent-memory-systems) — persistent memory for agents
- [Managing AI Agent Budgets](./ai-agent-budgets-cost-control) — cost control
- [Context Engineering](./context-engineering) — the Context primitive
- [MCP (Model Context Protocol)](./mcp-model-context-protocol) — extending the Tools layer
