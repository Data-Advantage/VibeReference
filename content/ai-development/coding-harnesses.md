# Coding Harnesses

A coding harness is the runtime scaffolding that wires a model, a set of tools, and a managed context window into an autonomous loop that can write, edit, and ship code. Claude Code, Cursor, Windsurf, Cline, Aider, Devin, GitHub Copilot Workspace, and OpenAI Codex CLI are all coding harnesses. They differ in model support, shipped tools, context strategy, and UX surface, but they solve the same problem: turning a stateless LLM into a workflow that can actually build software.

## Harness vs. Agent vs. Validation Scripts

"Harness" has been used three different ways in the industry. It's worth naming each and pointing to the canonical one.

- **Harness (this article, canonical)** — the runtime that wires Model + Tools + Context into an agentic loop. Claude Code is a harness.
- **Agent** — a harness configured with a role, mission, and scope. Claude Code pointed at a specific repo with a specific AGENTS.md is an agent. See [AI Agents vs Harnesses](./agents-vs-harnesses) for the full 5-concept stack.
- **"Harness" as validation scripts** — earlier industry writing sometimes used "coding harness" to mean the linters, type checkers, and test runners that the agent runs after each change. Those are **tools the harness invokes**, not the harness itself. We call this layer the **validation loop** and cover it in [The Harness Orchestration Loop](./agent-harness-feedback-loop).

This article is about the canonical harness — the runtime. Wherever you hear "coding harness," translate to "the runtime that wraps model, tools, and context."

## What a Harness Does

A harness is responsible for five things on every turn:

### 1. Build the context window

Gather the system prompt, agent instructions (AGENTS.md / CLAUDE.md), relevant files, recent tool results, memory snippets, and user input. Decide what stays, what gets summarized, and what gets dropped. This is one of the hardest parts — done badly, the model either lacks information it needs or drowns in irrelevant tokens.

### 2. Invoke the model

Pass the context to the model and get a response back. Different harnesses support different models: Claude Code is Claude-native, Cursor lets you pick from a menu of models, Aider supports nearly everything via LiteLLM. The model is a primitive the harness orchestrates — see [AI Agents vs Harnesses](./agents-vs-harnesses) for why they're separate layers.

### 3. Parse tool calls

The model's response may include tool calls: `read_file`, `bash`, `edit`, `web_search`, [MCP](./mcp-model-context-protocol) calls, and so on. The harness parses these, validates their arguments, and dispatches them.

### 4. Execute tools and capture results

Actually run the tool (read the file, execute the bash command, fetch the web page) and capture its output. Inject that output back into context for the next turn.

### 5. Loop until done

Keep cycling context → model → tool call → result → context until the model signals completion, a user interrupts, or a guardrail fires. See [The Harness Orchestration Loop](./agent-harness-feedback-loop) for the observe → plan → act → verify structure inside that loop.

## What's Inside a Harness

All harnesses ship with the same conceptual pieces, though implementations vary.

- **Model client** — HTTP layer to one or more LLM providers. Handles retries, streaming, token accounting.
- **Tool registry** — the set of tools the model can invoke. File I/O, bash, search, web fetch, plus user-extensible ones (MCP servers, custom skills).
- **Context manager** — builds the context window each turn. Decides file chunking, history truncation, summarization, and priority.
- **Loop orchestrator** — the observe → plan → act → verify cycle. Sequences model calls and tool calls, handles errors and retries.
- **Permissions / guardrails** — what the agent may and may not do. Which tools are always allowed, which require approval, which are banned. Path-level permissions. Cost caps.
- **Memory** — persistence across turns and across sessions. Files, scratchpads, dedicated memory stores.
- **Configuration surface** — how users shape the harness into an agent. AGENTS.md, CLAUDE.md, skills, hooks, MCP servers.

These aren't seven separate harnesses — they're the parts a single harness is built from.

## Popular Coding Harnesses

| Harness | Interface | Model coverage | Distinctive choice |
|---|---|---|---|
| [Claude Code](./claude-code) | CLI, IDE extension | Claude only | Skills + hooks + AGENTS.md; bare-terminal by default |
| [Cursor](./cursor) | Dedicated IDE (VS Code fork) | Multi-provider | IDE-first; tight integration with editor state and diffs |
| [Windsurf](./windsurf) | Dedicated IDE | Multi-provider | Cascade flow; emphasis on codebase-aware actions |
| [Cline](./cursor) | VS Code extension | Multi-provider | Open source; minimal defaults |
| [Aider](./agentic-coding) | CLI | Very broad (via LiteLLM) | Git-native; each change is a commit |
| [Devin](./devin-ai) | Web / Slack | Proprietary internal model stack | Remote, session-based; targets autonomous work |
| [OpenAI Codex CLI](./openai-codex-cloud) | CLI + cloud | GPT family | CLI + managed cloud variant |
| [GitHub Copilot Workspace](./github-copilot-cloud-agent) | GitHub-native | GPT family | PR-driven; CI is the validation loop |

Each is a different point in harness design space. Terminal vs. IDE vs. cloud. Single-provider vs. multi-provider. Local execution vs. sandboxed remote VMs. Permissive defaults vs. approval-gated.

## How to Evaluate a Harness

The questions worth asking:

- **Context strategy.** How does it load files and prune history? How well does it handle large codebases?
- **Tool surface.** What tools ship? How extensible is the tool layer (MCP? skills? custom commands?)
- **Model flexibility.** Can you swap models without switching tools? Useful when providers ship new models.
- **Permissions model.** What can the agent do without asking? What requires approval? Can you add project-specific rules?
- **Configuration surface.** Is there a sensible way to encode project conventions (AGENTS.md, CLAUDE.md)? Can you layer user + project + session configuration?
- **Loop ergonomics.** When the agent's validation step fails, does it get a clear error back? How tight is the inner loop?
- **Cost control.** Can you set budgets, see token accounting, cap runaway sessions?
- **Memory.** Does the harness persist meaningful state across sessions?

The loud differentiators (which IDE, which brand) matter less than these. A well-configured Aider beats a poorly-configured Cursor on most tasks.

## Harnesses Are the Moat

Frontier models are a commodity — providers release new ones every few months, and most harnesses support swapping. What's hard is harness engineering: context management, tool design, loop orchestration, permissions, and configuration surface. Companies investing in AI-native coding (Stripe, Shopify, Airbnb, and a long list of startups) are pouring resources into custom harnesses more than custom models.

For individuals and teams who aren't building their own, the question is which off-the-shelf harness fits: terminal-first (Claude Code, Aider), IDE-first (Cursor, Windsurf), or cloud/remote (Devin, Codex Cloud, Copilot Workspace). The right answer depends on the workflow, not the logo.

## How VibeReference Uses Harnesses

The agents that write and publish VibeReference content run on Claude Code as their harness. Each agent (CMO, CTO, CEO, researcher) is Claude Code plus a specific AGENTS.md, a specific memory store, and a specific task queue on Paperclip. Swapping to a different harness would mean re-implementing the agent configuration on that platform, but the agents' roles and missions would remain the same. That separation is why clear vocabulary matters: the harness is infrastructure, the agents are the workers, and the Model/Tools/Context primitives are the raw materials.

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the 5-concept stack
- [The Harness Orchestration Loop](./agent-harness-feedback-loop) — the observe → plan → act → verify cycle inside a harness
- [AI Agents](./ai-agents) — the agent layer
- [Context Engineering](./context-engineering) — the Context primitive
- [MCP (Model Context Protocol)](./mcp-model-context-protocol) — a standard protocol for tool extension
- [Claude Code](./claude-code) — a terminal-first harness
- [Cursor](./cursor) — an IDE-first harness
- [Designing Agent Instructions](./designing-agent-instructions) — how to configure a harness into an agent
