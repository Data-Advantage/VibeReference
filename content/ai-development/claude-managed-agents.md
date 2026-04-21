# Claude Managed Agents

Claude Managed Agents is Anthropic's system for orchestrating multiple AI agents from a parent agent — letting a single Claude instance spawn, direct, and synthesize work from specialized sub-agents. Instead of one agent doing everything sequentially, you define a team of agents with different expertise, and a parent agent delegates work to them in parallel.

This is what makes complex AI workflows actually tractable for solo founders. One agent handles security review while another analyzes test coverage. A research agent gathers requirements while an implementation agent starts scaffolding. Tasks that would take hours in a single-agent loop finish in minutes with managed agents.

> *In the 5-concept stack, "Managed Agents" is Anthropic's API-level term for sub-agents spawned by a parent agent. Each sub-agent is a configured **Harness** invocation with its own role and scope — which matches the canonical **Agent** definition used across VibeReference. See [AI Agents vs Harnesses](./agents-vs-harnesses) for the full stack.*

## What Are Claude Managed Agents

A managed agent system has two layers:

**Parent agent (orchestrator)**: Breaks down the goal, delegates tasks to sub-agents using the `Task` tool, and synthesizes results. Has broad context and strategic responsibility.

**Sub-agents (workers)**: Specialized agents with specific tools, instructions, and models. They receive a focused task, execute it, and return results to the parent.

```
Parent Agent (Claude Opus)
├── Delegates to: security-reviewer (Claude Sonnet)
├── Delegates to: test-analyzer (Claude Haiku)
└── Synthesizes results → Final report
```

The parent agent decides when to delegate and to whom. Sub-agents have no awareness of the broader goal — they just receive a task and execute it.

## How It Works: The Agent SDK

The Anthropic Agent SDK (`@anthropic-ai/claude-agent-sdk` for TypeScript, `claude_agent_sdk` for Python) wraps the Claude Code runtime to provide:

- The `query()` function for running agent loops
- Built-in tools: `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebFetch`, `Task`
- `AgentDefinition` type for defining sub-agents
- The `Task` tool — what enables the parent to spawn and delegate to sub-agents

The `Task` tool is the key primitive. When you include it in `allowedTools`, the parent agent can spawn any of your defined sub-agents by name, passing a task description and receiving back their output.

## Installation and Setup

```bash
npm install @anthropic-ai/claude-agent-sdk
```

Set your API key:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

A basic single-agent setup to verify things work:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Read package.json and summarize the project dependencies",
  options: {
    model: "sonnet",
    allowedTools: ["Read", "Glob"],
  },
})) {
  if (message.type === "assistant") {
    console.log(message.content);
  }
}
```

## Building a Multi-Agent System

Here is a complete example: a code review pipeline that runs a security analysis and test coverage analysis in parallel.

```typescript
import { query, AgentDefinition } from "@anthropic-ai/claude-agent-sdk";

async function codeReview(directory: string) {
  for await (const message of query({
    prompt: `Review the code in ${directory}. 
      Use the security-reviewer agent for security vulnerabilities 
      and the test-analyzer agent for test coverage gaps.
      Produce a combined report with priority-ordered findings.`,
    options: {
      model: "opus",
      allowedTools: ["Read", "Glob", "Grep", "Task"],
      maxTurns: 100,
      agents: {
        "security-reviewer": {
          description: "Security specialist for vulnerability detection",
          prompt: `You are a security expert. Analyze code for:
            - SQL injection, XSS, CSRF vulnerabilities
            - Authentication and authorization gaps
            - Insecure dependencies
            - Hardcoded secrets or credentials
            Return findings as structured markdown with severity levels.`,
          tools: ["Read", "Grep", "Glob"],
          model: "sonnet",
        } as AgentDefinition,

        "test-analyzer": {
          description: "Test coverage and quality analyzer",
          prompt: `You are a testing expert. Analyze:
            - Which code paths have no test coverage
            - Tests that only test happy paths
            - Missing edge cases
            - Integration test gaps
            Return a coverage map with recommended test additions.`,
          tools: ["Read", "Grep", "Glob"],
          model: "haiku",
        } as AgentDefinition,
      },
    },
  })) {
    if (message.type === "assistant") {
      console.log(message.content);
    }
  }
}

codeReview("./src");
```

When the parent agent runs, it reads the directory structure, then calls the `Task` tool twice — once with `security-reviewer` and once with `test-analyzer`. Each sub-agent runs its analysis independently. The parent waits for both, then synthesizes a combined report.

## Key Capabilities

### Tool Specialization

Each sub-agent gets only the tools it needs. A research agent might get `WebFetch` and `WebSearch`. A code agent gets `Read`, `Write`, and `Bash`. A reviewer gets `Read` and `Grep` only.

Restricting tools prevents accidents. A review agent with no `Write` tool cannot accidentally modify files while analyzing them.

### Model Selection Per Agent

Use expensive models (Opus) for the orchestrator's high-level reasoning. Use cheaper, faster models (Haiku) for narrow, well-defined sub-tasks.

```typescript
agents: {
  "orchestrator": { model: "opus" },      // $15/M tokens — complex reasoning
  "code-writer": { model: "sonnet" },     // $3/M tokens — implementation
  "formatter": { model: "haiku" },        // $0.25/M tokens — simple transforms
}
```

This gives you the capability of Opus at a fraction of the cost for most of the work.

### Parallel Execution

The parent agent can call `Task` multiple times before waiting for results. Sub-agents execute in parallel, so a three-agent pipeline can run 3x faster than running all tasks sequentially in one agent.

### Error Containment

Sub-agent failures are isolated. If the test-analyzer crashes or produces garbage output, the security-reviewer's work is unaffected. The parent agent can detect the failed result and either retry or continue with partial information.

## When to Use Managed Agents

**Use managed agents when:**

- Tasks can be parallelized — research + implementation, frontend + backend, analysis + writing
- Different tasks need different expertise or tool access
- You want to use cheaper models for well-defined sub-tasks
- A single-agent context window is filling up on long tasks

**Keep single-agent when:**

- Tasks are sequential and each step depends on the previous
- The problem fits comfortably in one context window
- Coordination overhead would exceed the parallelism benefit
- You are still prototyping and do not know the right decomposition yet

### Use Cases for Solo Founders

**Automated PR review**: Parent agent receives a diff, delegates security review, performance analysis, and documentation check to three sub-agents simultaneously. Results come back in the time it would take one agent to finish the first review.

**Research + implementation pipeline**: A research agent browses documentation and produces a technical spec. An implementation agent receives the spec and writes the code. They run in sequence but each is focused — no context contamination between research and implementation.

**Content pipeline**: A research agent gathers information, a writing agent drafts the article, a fact-check agent verifies claims. Each agent is better at its narrow job than one agent trying to do all three.

**Codebase analysis**: Scan a large codebase by having multiple agents each analyze a different module in parallel, then synthesize findings. Avoids filling the context window with one giant sequential scan.

## Agent Teams in Claude Code

Claude Code has a separate but related feature: **Agent Teams**. Where the SDK lets you orchestrate sub-agents programmatically, Agent Teams let you run multiple Claude Code sessions where one acts as the lead.

```
/agents  — launch Agent Teams mode in Claude Code
```

In Agent Teams mode:
- The lead assigns tasks to teammate sessions
- Teammates work independently in their own context windows
- The lead approves plans and synthesizes results
- All teammates share a task list for coordination

Agent Teams is better for ad-hoc collaboration on large codebases. The SDK is better for automating repeatable pipelines.

## Managed Agents vs Other Frameworks

| | Claude Agent SDK | CrewAI | AutoGen | LangGraph |
|---|---|---|---|---|
| **Language** | TypeScript + Python | Python | Python | Python |
| **Orchestration** | Parent → Task tool | Role-based crew | Conversation-based | State graph |
| **Model support** | Claude only | Any LLM | Any LLM | Any LLM |
| **Setup complexity** | Low | Medium | Medium | High |
| **Production maturity** | High (same runtime as Claude Code) | Medium | Medium | High |
| **Best for** | Claude-native pipelines | Role-based workflows | Research/conversation | Complex state machines |

**Choose Claude Agent SDK when**: You are already using Claude, want the simplest setup, and need proven production reliability (it runs Claude Code internally).

**Choose LangGraph when**: You need complex branching logic, state machines, or want model flexibility across providers.

**Choose CrewAI when**: Your problem maps naturally to a team of roles (researcher, writer, reviewer) and you want a high-level abstraction.

**Choose AutoGen when**: Your workflow is conversation-based and agents need to negotiate or debate solutions.

## Best Practices

**Keep sub-agent prompts narrow.** The parent has broad context. Sub-agents should have laser focus. A sub-agent that tries to understand the full project goal will fill its context window with irrelevant information.

**Use `maxTurns` to limit runaway agents.** Set a reasonable ceiling on each agent's iterations. A test analyzer that cannot find tests in 20 turns probably will not find them in 200.

```typescript
options: {
  maxTurns: 50,  // Parent agent
  agents: {
    "analyzer": {
      // Sub-agents inherit maxTurns from parent unless overridden
    }
  }
}
```

**Match tools to tasks strictly.** Do not give sub-agents tools they do not need. `Bash` access means code execution, which means potential for side effects. Only grant it when the task explicitly requires running commands.

**Structure sub-agent output formats.** Tell sub-agents how to format their output so the parent agent can parse results reliably:

```
Return findings as JSON with structure:
{ "severity": "high|medium|low", "file": "path/to/file", "issue": "description", "line": number }
```

**Test sub-agents independently before integrating.** Run each sub-agent definition in isolation first. Verify it produces sensible output on your codebase before wiring it into the parent.

**Log delegation events.** The SDK emits `assistant` messages when the parent delegates — capture these for debugging and cost tracking.

```typescript
if (message.type === "assistant") {
  // Log delegation events like: "🤖 Delegating to: security-reviewer"
  console.log(JSON.stringify(message));
}
```

## Cost Management

Multi-agent systems multiply token costs. A pipeline with three sub-agents costs roughly 3x what a single agent costs for the same work, plus the parent agent's orchestration cost.

Strategies to keep costs manageable:

- **Haiku for narrow tasks**: Formatting, simple extraction, regex-like pattern matching
- **Sonnet for implementation**: Writing code, generating content, moderate reasoning
- **Opus only for orchestration**: High-level planning, complex synthesis, architecture decisions
- **Set `maxTurns` per agent**: Prevent cost runaway from loops
- **Cache research results**: If multiple agents need the same data, have one fetch it and pass it to others via the parent

A well-tuned three-agent pipeline often costs less than a single poorly-constrained Opus agent solving the same problem with unlimited turns.

## Getting Started Checklist

1. Install the SDK: `npm install @anthropic-ai/claude-agent-sdk`
2. Set `ANTHROPIC_API_KEY` in your environment
3. Write a single-agent loop first — verify it solves part of your problem
4. Identify the natural decomposition: what two or three focused sub-tasks could run in parallel?
5. Define each sub-agent with a narrow prompt and minimal tool set
6. Add `Task` to the parent's `allowedTools`
7. Test each sub-agent in isolation before wiring up the parent
8. Add logging to capture delegation events and sub-agent outputs
9. Run the full pipeline and measure: cost, latency, output quality vs. single-agent baseline
