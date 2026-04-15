# AI Agents vs Harnesses: Understanding the Formula

Every AI coding agent you've heard of — Claude Code, Cursor, Devin — is made of two things: a model and a harness. The model provides intelligence. The harness provides everything else: the tools, the loop, the memory, the guardrails, the context engine. Without a harness, a model is just a chatbot that can write code. With a good harness, it becomes an autonomous agent that ships working software.

The formula: **Agent = Model + Harness**

## What is the Model?

The model is the LLM at the center of the agent — GPT, Claude, Gemini. It reasons about what to do, generates code and plans, interprets errors, and decides next steps. The model is the horse.

Models are powerful but unreliable in isolation. They hallucinate, lose context, can't persist state, and have no way to verify that their own output is correct. Left alone, a model will confidently produce code that doesn't work.

## What is the Harness?

The harness is everything that turns the raw model into a reliable agent. It is the reins, the saddle, and the stable system. A harness has seven components:

**1. Tools** — file system access, terminal commands, git operations, web search, test runners. Tools are how the agent interacts with the world. Without tools, the model can only generate text; with tools, it can act.

**2. Context management** — how code, documentation, conversation history, and task state are fed to the model without overwhelming its context window. This includes file chunking, semantic search over the codebase, and smart context pruning. Poor context management is the primary cause of agent drift and hallucination on large codebases.

**3. Orchestration / agent loop** — the observe → plan → act → verify → repeat cycle that drives the agent forward. The orchestrator decides when to call tools, when to check work, when to ask for clarification, and when to escalate. This loop is inside the harness — not a bridge between the harness and something else.

**4. Validation and feedback** — type checkers, linters, test suites, build checks, and custom scripts that tell the agent whether its output is correct. This is the component most people associate with "the harness," but it's only one of seven. A test suite alone is not a harness.

**5. State persistence and memory** — storing decisions, completed steps, and learned context across iterations and sessions. Without memory, the agent starts fresh on every invocation. With it, the agent can resume complex tasks, remember project conventions, and avoid repeating mistakes.

**6. Guardrails, prompts, and constraints** — system prompts, allowed/denied tool lists, scope limits, and safety checks that prevent the agent from making changes outside its mandate. Guardrails are what prevent an agent from "helpfully" refactoring things you didn't ask it to touch.

**7. Workflow automation** — breaking large tasks into steps, retry logic, logging, parallelism, and handoffs between agents. Complex features require multi-step plans; the harness manages that execution.

## The Comparison

| Aspect | Model | Harness |
|--------|-------|---------|
| **What it provides** | Intelligence, reasoning, code generation | Tools, context, orchestration, validation, memory, guardrails |
| **Is it the agent?** | No — one component | No — the other component |
| **What breaks without it** | Nothing happens | Everything happens wrong |
| **Can you swap it?** | Yes — models are interchangeable | Yes — but it's harder; harnesses encode product decisions |
| **Examples** | Claude, GPT, Gemini | Claude Code, Cursor, Devin, custom agent frameworks |

| Aspect | AI Coding Agent (full) | Harness (alone) |
|--------|------------------------|-----------------|
| **Core role** | The intelligent worker that writes and edits code | The system that makes the worker reliable and productive |
| **What it is** | Model + Harness combined (e.g., Claude Code, Cursor) | The scaffolding: tools, loops, validation, context engine |
| **Strengths** | Creative reasoning, code synthesis, task completion | Consistency, error correction, scalability, safety |
| **Weaknesses (if alone)** | Without harness: hallucinates, loses context | Without model: not "smart" on its own |

## Common Misconceptions

### "Claude Code is just a harness"

Claude Code is an agent — model plus harness bundled together. Anthropic built the harness (file tools, bash execution, context management, memory, the agent loop), and the Claude model supplies the intelligence. When you run Claude Code, you're running both.

### "My test suite is the harness"

Your test suite is the validation component of the harness. The full harness also includes the tools that run those tests, the orchestrator that decides when to run them, the context manager that feeds failures back to the model, and the loop that continues until everything passes. The test suite is one seventh of the picture.

### "Better model = better agent"

Swapping to a more capable model helps, but has diminishing returns if the harness is weak. An agent with a slow, noisy validation loop will iterate poorly regardless of model quality. A great harness running a capable-but-not-top model often outperforms a weak harness running the best model. The harness is the multiplier.

### "Harnesses are just DevOps tooling"

Harnesses are product decisions. The tools you give an agent, the constraints you impose, the context strategy you choose — these determine what the agent can and can't do, how reliably it performs, and how far it can be trusted to work autonomously. Harness design is software architecture.

## Why Harnesses Matter More Than Ever

Raw LLMs are non-deterministic and stateless. Early AI coding tools were mostly autocomplete assistants (GitHub Copilot's first iteration). Modern coding agents became dramatically more capable not primarily because models got smarter — though they did — but because harnesses got better.

Better tool use meant agents could actually read and write files. Better context management meant agents could work on real codebases instead of toy examples. Better orchestration loops meant agents could recover from errors instead of giving up. Companies like Stripe, Shopify, and Airbnb have reportedly invested heavily in custom internal harnesses, treating harness engineering as a core capability.

The model is a commodity that improves automatically as providers release new versions. The harness is the moat.

## Harness Quality in Practice

When evaluating an AI coding tool, the questions that matter are harness questions:

- **What tools does it have?** Can it read arbitrary files? Run shell commands? Search the web? Call external APIs?
- **How does it manage context?** Does it understand large codebases, or does it get confused past 10 files?
- **How does it orchestrate?** Does it make plans and follow them, or does it jump around?
- **How does it validate?** Does it run your test suite automatically, or does it just hope its output is correct?
- **Does it have memory?** Can it resume tasks, or does every session start from zero?
- **What are its guardrails?** What can it NOT do? Are those limits appropriate for your use case?

## Pi: A Study in Harness Engineering

[Pi](https://github.com/badlogic/pi-mono) (badlogic/pi-mono) is an example of explicit harness engineering. Pi's defining feature is that the agent can modify its own harness at runtime: it writes TypeScript extensions and hot-reloads them into the running session. If the agent encounters a recurring class of error, it can create a new validation check and immediately add it to its own loop.

This is the frontier of harness design — not just a fixed set of tools and rules, but a harness that evolves alongside the task. The core formula still holds (Agent = Model + Harness), but Pi demonstrates that the harness itself can be a dynamic, agent-authored artifact.

## See Also

- [AI Agents](./ai-agents) — how agents work end-to-end
- [Coding Harnesses](./coding-harnesses) — validation components of a harness
- [Building Harnesses for AI Agents](./building-harnesses-for-agents) — how to design and build all seven harness components
- [The Harness Orchestration Loop](./agent-harness-feedback-loop) — the observe-plan-act-verify cycle inside the harness
- [Agentic Coding](./agentic-coding) — the broader agentic coding workflow
- [Claude Code](./claude-code) — a full agent (model + harness) in practice
- [Cursor](./cursor) — another full agent with a different harness approach
