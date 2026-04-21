# Claude Code

Claude Code is Anthropic's agentic coding **harness** — a command-line runtime that wires a Claude model, a curated tool set, and a managed context window into an autonomous loop. It reads your codebase, edits files, runs commands, manages git, and iterates on errors without you switching between tabs or terminals.

It ships as a CLI, a VS Code extension, a JetBrains plugin, a desktop app (Claude Code with CoWork), and a web interface at claude.ai/code. All share the same underlying harness — same loop, same tools, different surfaces.

> **Where Claude Code sits in the [5-concept stack](./agents-vs-harnesses).** Claude Code is the **Harness**: the runtime that wires Claude (the **Model**) and a fixed tool set (Read, Write, Edit, Bash, Glob, Grep, Agent, MCP) with a managed **Context** window (CLAUDE.md, conversation history, file reads, tool results). When you point a Claude Code session at a specific repo with a specific `CLAUDE.md` and role instructions, you've configured an **Agent**. The binary is the harness; each configured session is an agent. This article is about the harness.

## Why Developers Use Claude Code

- **Agentic, not just advisory** — Claude Code doesn't suggest edits. It makes them, runs your tests, sees the failures, and fixes them in a loop until the code works.
- **Full codebase context** — it reads your project structure, CLAUDE.md files, and relevant source code to understand how your project is built before making changes.
- **Direct tool access** — it runs shell commands, reads and writes files, searches code with grep and glob, and manages git — all through dedicated tools optimized for each action.
- **Multi-model flexibility** — switch between Opus 4.6 (deepest reasoning), Sonnet 4.6 (fast and capable), and Haiku 4.5 (lightweight tasks) depending on the complexity of your work.
- **Works where you work** — terminal, VS Code, JetBrains, desktop app, or web. Same agent, same capabilities, different interfaces.

## Supported Platforms

| Platform | How to Access | Best For |
|----------|--------------|----------|
| **CLI** | `npm install -g @anthropic-ai/claude-code` then run `claude` | Terminal-native developers, CI/CD pipelines, automation |
| **VS Code** | Install the Claude Code extension from the marketplace | Developers who prefer a visual editor with inline AI |
| **JetBrains** | Install the Claude Code plugin from the JetBrains marketplace | IntelliJ, WebStorm, PyCharm, and other JetBrains IDE users |
| **Desktop App** | Download Claude for Desktop (macOS, Windows) | CoWork mode — file management, documents, non-coding tasks |
| **Web App** | Visit claude.ai/code | Browser-based access, no local install needed |

All platforms connect to the same Claude models and share the same tool capabilities. The CLI is the most powerful for automation and scripting. The IDE extensions integrate Claude Code into your existing editor workflow.

## Core Capabilities

### Reading and Understanding Code

Claude Code starts every session by reading your project's CLAUDE.md files — persistent instructions that encode your project's conventions, architecture decisions, and team standards. It then uses dedicated tools to explore your codebase:

- **Read** — view any file with line numbers
- **Glob** — find files by pattern (e.g., `src/**/*.tsx`)
- **Grep** — search file contents with regex
- **Bash** — run any shell command

This means Claude Code doesn't guess about your project structure. It reads the actual files, checks the actual imports, and understands the actual patterns you use.

### Editing Code

Claude Code uses an **Edit** tool that performs precise string replacements — not whole-file rewrites. It identifies the exact lines to change and replaces them, preserving everything else. For new files, it uses a **Write** tool. This approach is safer than diff-based patching and more precise than regenerating entire files.

### Running Commands

Through the **Bash** tool, Claude Code can:

- Run your test suite (`npm test`, `pytest`, `go test`)
- Execute builds (`npm run build`, `cargo build`)
- Manage git (`git status`, `git commit`, `git push`)
- Install dependencies (`npm install`, `pip install`)
- Run linters and formatters (`eslint`, `prettier`, `black`)
- Execute any shell command your project needs

Commands run in your actual development environment with your actual dependencies and configuration.

### Autonomous Error Correction

When Claude Code runs a command and it fails, it reads the error output, diagnoses the issue, makes a fix, and retries. This loop — write code, run tests, read errors, fix, repeat — is what makes it agentic rather than conversational. A typical interaction might involve Claude Code:

1. Writing a new React component
2. Running the TypeScript compiler and seeing a type error
3. Fixing the type definition
4. Running tests and seeing a failing assertion
5. Adjusting the logic to match expected behavior
6. Running tests again — all pass
7. Committing the change

All of this happens without you intervening at each step.

## The Agent Tool (Sub-Agents)

Claude Code can launch **sub-agents** — parallel sub-sessions of the harness, each with its own context and toolset, configured with a different role and pointed at a sub-task. They're agents in the canonical sense: configured harness instances pointed at specific work. The Agent tool spawns specialized agents for:

- **Exploration** — searching codebases for patterns, finding files, answering architectural questions
- **Planning** — designing implementation strategies before writing code
- **General-purpose** — researching complex questions, executing multi-step investigations

Sub-agents run concurrently when tasks are independent. For example, if Claude Code needs to research how authentication works in your app while also checking the test configuration, it launches two agents in parallel rather than doing one after the other.

Each sub-agent has its own context and toolset. When it finishes, it returns results to the parent agent, which synthesizes the findings and continues working.

```
# Example: Claude Code launching parallel research agents

Agent 1: "Explore how the auth middleware works in src/middleware/"
Agent 2: "Find all test files related to the payments module"

Both run simultaneously → results merged → Claude Code continues
```

Sub-agents can also run in **isolated worktrees** — temporary git branches where they make changes without affecting your working directory. This is useful for exploratory refactoring or testing alternative approaches.

## CLAUDE.md — Project Memory

CLAUDE.md files are the single most impactful way to improve Claude Code's output. They're markdown files that Claude Code reads automatically at the start of every session. Place them at:

- **Repository root** (`CLAUDE.md`) — project-wide conventions
- **Subdirectories** (`src/CLAUDE.md`) — module-specific instructions
- **User home** (`~/.claude/CLAUDE.md`) — personal preferences across all projects

A good CLAUDE.md includes:

```markdown
# CLAUDE.md

## Project Overview
Next.js 15 SaaS app using Supabase, Stripe, and Tailwind.

## Commands
- `npm run dev` — start development server
- `npm test` — run test suite
- `npm run build` — production build

## Code Conventions
- Server components by default, client components only when needed
- All database queries through src/lib/db/
- Zod for input validation
- Error messages must be user-friendly

## Architecture Decisions
- Supabase for database (not Convex) — SQL flexibility
- Clerk for auth (not Supabase Auth) — better React integration
- Stripe Checkout for payments — no custom forms
```

Claude Code treats CLAUDE.md as authoritative project context. Unlike conversation context that's lost between sessions, CLAUDE.md persists and ensures consistent behavior across every interaction.

## Hooks — Programmable Guardrails

Hooks are automated actions that fire at specific lifecycle events in Claude Code. Unlike CLAUDE.md (which is advisory), hooks are **mandatory** — they execute automatically and can block actions.

| Event | When It Fires | Example Use |
|-------|--------------|-------------|
| `PreToolUse` | Before any tool runs | Block edits to production configs |
| `PostToolUse` | After a tool completes | Run linter after every file write |
| `Notification` | When Claude Code sends a notification | Post to Slack when work finishes |
| `Stop` | When Claude Code finishes a response | Run final validation checks |

Hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "npm run lint --fix"
      }
    ]
  }
}
```

This makes Claude Code programmable beyond natural language — you can enforce team standards, trigger CI, notify external systems, and prevent risky operations automatically.

## MCP Integration (Model Context Protocol)

Claude Code supports MCP servers — external tools that extend its capabilities through a standardized protocol. MCP servers can provide:

- **Browser automation** — control Chrome tabs, click elements, read page content
- **Database access** — query databases directly from Claude Code
- **API integrations** — interact with Slack, GitHub, Jira, or any service
- **Custom tools** — anything you can build as an MCP server

Configure MCP servers in `.claude/settings.json`:

```json
{
  "mcpServers": {
    "my-database": {
      "command": "npx",
      "args": ["my-db-mcp-server", "--connection", "postgres://..."]
    }
  }
}
```

Once connected, Claude Code can use the MCP server's tools as naturally as its built-in tools. This turns Claude Code into a hub that orchestrates your entire development workflow.

## Headless Mode and Automation

Claude Code runs in **headless mode** for automation — no interactive terminal needed. This enables:

- **CI/CD integration** — run Claude Code in GitHub Actions, GitLab CI, or any pipeline
- **Automated code review** — trigger Claude Code on pull requests
- **Scheduled tasks** — run Claude Code on a cron schedule for maintenance
- **Scripted workflows** — chain Claude Code commands in shell scripts

```bash
# Run Claude Code headlessly with a specific prompt
claude --print "Review this PR for security issues and add comments"

# Pipe input
echo "Fix the failing test in src/auth.test.ts" | claude --print
```

The `--print` flag runs Claude Code non-interactively — it processes the prompt, does the work, and outputs the result. Combined with the Claude Code SDK, this enables sophisticated automation pipelines.

## GitHub Actions Integration

Claude Code integrates directly with GitHub Actions for automated code review and PR management:

```yaml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

This triggers Claude Code on every pull request to review changes, suggest improvements, and catch issues before human review.

## Models and Pricing

Claude Code supports multiple Claude models. Switch models with the `/model` command during a session:

| Model | Strengths | Best For |
|-------|-----------|----------|
| **Opus 4.6** | Deepest reasoning, strongest agentic capability | Complex refactoring, architecture decisions, multi-file changes |
| **Sonnet 4.6** | Fast, highly capable, great balance | Day-to-day coding, feature development, bug fixes |
| **Haiku 4.5** | Lightweight, cheapest | Quick lookups, simple edits, code explanations |

**Pricing depends on your plan:**

- **Claude Pro** ($20/month) — includes Claude Code access with usage limits
- **Claude Max** — higher limits for heavy users
- **API** — pay-per-token for headless/automation use ($3/$15 per 1M tokens for Sonnet 4.6)

The `/cost` command shows your token usage for the current session.

## Key Commands

| Command | What It Does |
|---------|-------------|
| `claude` | Start an interactive session in the current directory |
| `claude "prompt"` | Start with an initial prompt |
| `claude --print "prompt"` | Headless mode — run and output result |
| `/model` | Switch between Opus, Sonnet, and Haiku |
| `/cost` | Show token usage for the current session |
| `/compact` | Compress conversation context to free up token space |
| `/clear` | Reset conversation context |
| `/help` | Show all available commands |

## Permission Model

Claude Code has a permission system that controls which tools run automatically and which require your approval:

- **Auto-allowed** — read-only operations (Read, Glob, Grep) run without asking
- **Prompt-required** — write operations (Edit, Write, Bash) ask for permission by default
- **Configurable** — you can allow specific commands globally or per-project in settings

This means Claude Code won't delete files, push code, or run destructive commands without your explicit approval — unless you've configured it to trust specific operations.

## Getting Started

### 1. Install

```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Authenticate

```bash
claude
# Follow the authentication prompt to connect your Anthropic account
```

### 3. Create a CLAUDE.md

Add a `CLAUDE.md` to your project root with your conventions, commands, and architecture decisions.

### 4. Start Coding

```bash
cd your-project
claude
```

Then describe what you want: "Add a dark mode toggle to the settings page" or "Fix the failing test in auth.test.ts" or "Refactor the payment module to use Stripe Checkout."

Claude Code reads your project, makes the changes, runs the tests, and iterates until the code works.

## When to Use Claude Code vs Other Tools

| Scenario | Best Tool |
|----------|-----------|
| Complex, multi-file refactoring | Claude Code (Opus 4.6) |
| Day-to-day feature development | Claude Code (Sonnet 4.6) |
| Quick code explanations or lookups | Claude Code (Haiku 4.5) |
| Visual UI prototyping | Cursor or v0 |
| Autocomplete while typing | GitHub Copilot or Cursor |
| Non-coding knowledge work | Claude CoWork (desktop app) |
| CI/CD automation | Claude Code headless + GitHub Actions |

Claude Code excels at tasks that require understanding your full codebase and taking autonomous action. For inline autocomplete or visual design tools, other options may complement it better.

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the canonical 5-concept stack
- [Cursor](./cursor) — IDE-embedded harness alternative to Claude Code
- [Claude Code vs Cursor](./claude-code-vs-cursor) — comparing two harnesses
- [Designing Agent Instructions](./designing-agent-instructions) — configuring Claude Code into a specific agent
- [Claude Code Hooks](./claude-code-hooks) — programmable harness guardrails
- [The Harness Orchestration Loop](./agent-harness-feedback-loop) — the loop the harness runs every turn
