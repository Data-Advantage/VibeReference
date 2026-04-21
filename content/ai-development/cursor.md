# Cursor

Cursor is an AI-first code editor built as a fork of VS Code — it looks and works like VS Code (same extensions, themes, keybindings) but rebuilds the editing experience around AI. Instead of bolting AI onto an existing editor through plugins, Cursor wires a swappable model, a curated tool set, and an indexed codebase context window into the editor itself: autocomplete that predicts across files, a composer that edits multiple files from natural language, and an Agent mode that drives autonomous multi-file tasks.

Built by Anysphere, Cursor has become the most widely adopted AI code editor, with over 80% developer awareness and 33% active usage as of 2025 surveys. It's the primary alternative to Claude Code for developers who prefer a visual editor over a terminal-first workflow.

> **Where Cursor sits in the [5-concept stack](./agents-vs-harnesses).** Cursor is a **Harness**: it wires a selectable **Model** (Claude, GPT, Gemini), a built-in tool set (file edits, terminal, codebase index, MCP), and a managed **Context** window (indexed codebase, open files, chat history) into an editor-native autonomous loop. "Cursor Agent" and "Background Agents" are configured Cursor sessions pointed at specific tasks — i.e., **Agents** in the canonical sense. The IDE is the harness; each session you run is an agent.

## Why Developers Use Cursor

- **AI-native editing** — autocomplete, chat, and multi-file editing all powered by AI with full codebase context, not just the current file
- **Zero switching cost from VS Code** — imports your settings, extensions, themes, and keybindings automatically
- **Multi-model support** — use Claude, GPT, Gemini, or other models depending on the task
- **Codebase indexing** — automatically indexes your project's functions, types, patterns, and dependencies for context-aware suggestions
- **Agent mode** — autonomous multi-file editing with terminal access, package installation, and iterative error fixing
- **Background agents** — long-running tasks that work asynchronously while you continue coding

## Core Features

### Tab Completion

Cursor's Tab model goes beyond single-line autocomplete. It predicts your next action — whether that's completing a function, adding an import, fixing a type, or restructuring a block — based on the context of your entire codebase, not just the current file. The predictions feel uncanny because the model has indexed your project's patterns and understands what you're likely to do next.

Tab completion is where most developers feel the immediate productivity boost: 30-40% faster coding from intelligent, multi-line predictions that understand your project's conventions.

### Chat

The chat panel answers questions about your codebase with full context. Unlike generic AI chat, Cursor's chat knows your project structure, file relationships, and code patterns because it indexes everything locally. You can:

- Ask questions about how a feature works
- Request explanations of complex functions
- Get suggestions for refactoring approaches
- Reference specific files or symbols with `@` mentions

Chat responses reference your actual code, not generic examples from training data.

### Composer (Agent Mode)

Composer is Cursor's multi-file editing interface. Describe what you want in natural language, and Composer:

1. Plans the changes across your codebase
2. Creates, edits, and deletes files as needed
3. Runs terminal commands (install packages, run tests)
4. Reads error output and iterates on fixes
5. Presents a diff for your review before applying

In **Agent mode**, Composer operates autonomously — it can run up to 8 parallel agents working on different parts of a task simultaneously. For example, one agent might refactor the API layer while another updates the corresponding tests and a third adjusts the frontend components.

### Background Agents

Background agents handle long-running tasks asynchronously. You can assign a task — like a complex refactor, test suite expansion, or dependency migration — and continue working on other code while the agent works. Background agents:

- Monitor their own progress and wait for long shell commands to complete
- Use browser automation for tasks that require visual verification
- Self-correct when they encounter errors
- Report results when finished

This is useful for tasks that take many iterations: the agent works in the background and surfaces results when ready, rather than blocking your workflow.

### MCP Support

Cursor supports the Model Context Protocol (MCP) — the same standard used by Claude Code. This means you can connect external tools and services to Cursor:

- Database clients for querying data directly from the editor
- Browser automation tools for testing web applications
- API integrations for third-party services
- Custom tools built as MCP servers

Configure MCP servers in Cursor's settings to extend its capabilities beyond code editing.

## Codebase Indexing

When you open a project in Cursor, it indexes your entire codebase — functions, types, imports, patterns, dependencies, and file relationships. This index powers every AI feature:

- Tab completion knows your naming conventions
- Chat can answer questions about any file in the project
- Composer understands cross-file dependencies when making changes
- Agents navigate the codebase intelligently when working on tasks

The index updates automatically as you edit. This is Cursor's primary advantage over plugin-based AI: the AI always has full project context.

## Pricing

| Plan | Price | What You Get |
|------|-------|-------------|
| **Free** | $0/month | Limited AI completions, basic chat |
| **Pro** | $20/month | Unlimited tab completions, 500 premium requests, Agent mode |
| **Business** | $40/user/month | Team features, admin controls, centralized billing |
| **Enterprise** | Custom | SSO, audit logs, custom security policies |

The Pro plan is the sweet spot for solo developers and small teams. At $20/month, you get the full AI experience including Agent mode and multi-model support.

## Models

Cursor supports multiple AI models, giving you flexibility based on the task:

| Model | Strengths | When to Use |
|-------|-----------|-------------|
| **Claude Opus 4.6** | Deepest reasoning | Complex architecture decisions, large refactors |
| **Claude Sonnet 4.6** | Fast and capable | Daily coding, feature development |
| **GPT-4o** | Strong general coding | Alternative perspective, specific framework knowledge |
| **Gemini 2.5 Pro** | Massive context window | Analyzing large codebases, long documents |

Switch models per-request in the chat or composer to use the best model for each task.

## Cursor vs VS Code with Copilot

| Aspect | Cursor | VS Code + Copilot |
|--------|--------|-------------------|
| **AI integration** | Native — built into every feature | Plugin — added on top of the editor |
| **Context awareness** | Full codebase indexing | Primarily current file and open tabs |
| **Multi-file editing** | Agent mode with parallel agents | Limited to suggestions in single files |
| **Model choice** | Multiple models (Claude, GPT, Gemini) | Primarily GPT-based (Copilot models) |
| **Switching cost** | Zero — imports all VS Code settings | Already using VS Code |
| **Autonomous agents** | Yes — up to 8 parallel background agents | Copilot Workspace (separate product) |
| **Pricing** | $20/month Pro | $10/month Copilot Individual |

Copilot is cheaper and great for inline autocomplete. Cursor is more capable for autonomous, multi-file tasks and provides deeper codebase context.

## Cursor vs Claude Code

| Aspect | Cursor | Claude Code |
|--------|--------|-------------|
| **Interface** | Visual editor (VS Code fork) | Terminal CLI, IDE extensions, web app |
| **Best for** | Developers who prefer visual editing | Developers who prefer terminal workflows |
| **Autocomplete** | Excellent inline tab predictions | No inline autocomplete (uses dedicated Edit tool) |
| **Agent capability** | Agent mode + background agents | Sub-agents with isolated worktrees |
| **Model lock-in** | Multi-model (Claude, GPT, Gemini) | Claude models only |
| **Customization** | Settings UI, rules for AI | CLAUDE.md, hooks, MCP, permissions |
| **Automation** | Background agents | Headless mode, GitHub Actions, SDK |
| **Pricing** | $20/month Pro | $20/month Claude Pro (or API pay-per-token) |

Many developers use both: Cursor for visual editing and autocomplete during active development, Claude Code for complex refactoring, automation, and CI/CD integration.

## Getting Started

### 1. Download Cursor

Download from [cursor.com](https://cursor.com) for macOS, Windows, or Linux.

### 2. Import VS Code Settings

On first launch, Cursor offers to import your VS Code configuration — extensions, themes, keybindings, and settings. Accept this to start with your familiar environment.

### 3. Index Your Project

Open your project folder. Cursor automatically indexes the codebase. For large projects, the initial index takes a few minutes.

### 4. Start Using AI

- **Tab** — accept AI autocomplete suggestions as you type
- **Cmd/Ctrl + K** — open inline edit for quick changes
- **Cmd/Ctrl + L** — open chat to ask questions about your code
- **Cmd/Ctrl + I** — open Composer for multi-file editing

### 5. Try Agent Mode

In Composer, switch to Agent mode for autonomous multi-file tasks. Describe what you want ("add authentication to this app" or "write tests for the payment module") and let the agent work.

## When to Use Cursor

| Scenario | Recommendation |
|----------|---------------|
| Day-to-day coding with visual editor | Cursor with Sonnet 4.6 |
| Complex multi-file refactoring | Cursor Agent mode or Claude Code |
| Quick inline edits and autocomplete | Cursor Tab |
| CI/CD automation and headless tasks | Claude Code |
| Non-coding work (documents, research) | Claude CoWork |
| Team code reviews | Cursor's built-in review features |

Cursor is the best choice when you want AI deeply integrated into a visual editor. For terminal-first workflows and automation, Claude Code complements it well.

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the canonical 5-concept stack
- [Claude Code](./claude-code) — terminal-first harness alternative
- [Claude Code vs Cursor](./claude-code-vs-cursor) — comparing two harnesses
- [Cursor Cloud Agents](./cursor-cloud-agents) — Cursor's cloud harness for delegated tasks
- [Designing Agent Instructions](./designing-agent-instructions) — configuring Cursor into a specific agent
