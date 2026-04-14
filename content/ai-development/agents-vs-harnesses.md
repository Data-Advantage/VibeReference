# AI Agents vs Coding Harnesses: What is the Difference?

Agents write code. Harnesses check code. These two things sound similar — both involve automation, both are central to modern AI-powered development — but they serve opposite roles. Confusing them leads to gaps in your workflow that cause subtle, hard-to-catch failures.

## What is an AI Agent?

An [AI agent](./ai-agents.md) is a system that operates autonomously in a loop: it perceives its environment, reasons about what to do, takes action, and observes the results. In coding, this means the agent reads your codebase, writes or edits files, runs commands, and iterates until the task is done — without you holding its hand through each step.

Agents are **generative**. Their job is to produce things: code, files, PRs, feature implementations.

Examples: Claude Code, Cursor Agent, GitHub Copilot Workspace, Devin.

## What is a Coding Harness?

A [coding harness](./coding-harnesses.md) is a set of automated checks that validate your codebase. Type checkers, linters, test suites, and build scripts — anything that takes code as input and returns a pass/fail signal. The harness doesn't write anything. It only judges what's already there.

Harnesses are **evaluative**. Their job is to validate things: type correctness, logic correctness, style conformance, build integrity.

Examples: TypeScript compiler (`tsc`), ESLint, Vitest, `npm run build`.

## The Core Distinction

| | AI Agent | Coding Harness |
|---|---|---|
| **Primary role** | Creates code | Validates code |
| **Output** | Files, diffs, commits | Pass/fail signals, error messages |
| **Decision-making** | Yes — chooses what to build | No — runs fixed checks |
| **Iterates** | Yes — learns from feedback | No — runs once per invocation |
| **Cost** | API tokens, latency | CPU time, CI minutes |

Agents need harnesses. Without a harness, an agent has no way to verify its own output — it's working on vibes. With a harness, the agent can close the feedback loop itself:

```
Agent writes code → Harness runs → Errors surface → Agent reads errors → Agent fixes → Harness runs again → Pass
```

This loop is what makes modern [agentic coding](./agentic-coding.md) work. Neither piece alone is sufficient.

## Common Misconceptions

### "Claude Code is just a harness"

Claude Code is an agent. It writes, edits, and deletes files autonomously. The harness is `npm run build` or `tsc --noEmit` — the checks Claude Code runs to verify its own work. Conflating the two makes you think you have validation when you don't.

### "My test suite is an agent"

Your test suite is a harness. It runs fixed assertions and reports results. It doesn't decide what to build or generate code in response to failures — that's the agent's job. A test suite that automatically fixes failing tests would be an agent; one that reports them is a harness.

### "Agents are smarter harnesses"

This misframes the relationship. A harness being "smarter" means it catches more classes of errors with better signal. An agent being "smarter" means it accomplishes more complex goals with less guidance. Optimizing agents and optimizing harnesses require completely different approaches.

### "If I have a good agent, I don't need a harness"

Even the best agent makes mistakes. Harnesses catch the mistakes agents can't catch themselves — subtle type errors, behavior regressions, integration failures. The harness is your safety net, not a crutch for a weak agent.

## How They Work Together

The relationship is symbiotic:

**The agent drives, the harness navigates.** The agent decides what code to write and how to structure a solution. The harness reports whether the result is actually correct. The agent uses that signal to iterate.

**The harness quality determines the agent's ceiling.** An agent can only be as good as its feedback loop. Slow harnesses slow the agent. Flaky harnesses confuse the agent. Uninformative error messages leave the agent guessing. See [Building Effective Harnesses for AI Agents](./building-harnesses-for-agents.md) for how to get this right.

**Agents can improve harnesses.** You can direct an agent to add tests, improve linting rules, or update the build configuration. The agent generates the harness improvements; the harness validates them.

## When the Boundary Blurs: Self-Extending Agents

The agent/harness distinction is clear in most systems — the agent generates, the harness validates. But emerging tools like [Pi](https://github.com/badlogic/pi-mono) blur this line. Pi lets the agent write and hot-reload its own TypeScript extensions mid-session, including custom validation checks. The agent can observe that a class of errors keeps recurring, generate a new harness check to catch it, and load that check into its own loop — all without human intervention.

In self-extending systems, the agent is both the generator and the author of its own evaluator. The core distinction still holds conceptually (generating code vs. validating code are different functions), but the same system performs both roles. This is worth watching as a pattern — it suggests that agent/harness co-evolution may become the norm rather than the exception.

## When You Need One vs the Other vs Both

**You need an agent** when you have a goal that requires making decisions, writing code, or taking multi-step actions. Building a feature, fixing a bug, refactoring a module — these are agent tasks.

**You need a harness** when you need consistent, repeatable validation of code quality. Code review gates, CI checks, pre-commit validation — these are harness tasks.

**You need both** when you're doing any serious agentic coding. An agent without a harness is a liability. A harness without an agent is wasted potential.

The practical minimum: an agent (Claude Code or Cursor) plus a harness that runs type checking and builds in under 60 seconds. From there, add tests, linting, and custom checks as your project matures.

## Practical Setup

For a TypeScript/Next.js project — the default stack for solo founders using VibeReference — the minimal agent + harness setup looks like this:

```bash
# Claude Code as the agent
# CLAUDE.md defines what it can do

# Harness: run this after every agent task
npm run build        # Type checks + compiles + validates output
```

Upgrade to:

```json
{
  "scripts": {
    "harness": "tsc --noEmit && next lint && next build && vitest run"
  }
}
```

Then tell your agent to run `npm run harness` after every change. The feedback loop becomes automatic.

## See Also

- [AI Agents](./ai-agents.md) — what agents are and how they work
- [Coding Harnesses](./coding-harnesses.md) — how to build effective harnesses
- [The Agent-Harness Feedback Loop](./agent-harness-feedback-loop.md) — how to measure and optimize the loop
- [Agentic Coding](./agentic-coding.md) — the broader agentic coding workflow
