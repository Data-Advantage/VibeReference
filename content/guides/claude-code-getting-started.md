# Claude Code: Complete Getting Started Guide

Claude Code is Anthropic's AI coding agent that lives in your terminal. It connects directly to your codebase, understands your project structure, and writes real code on your machine through natural language conversation. Unlike browser-based AI assistants, Claude Code operates where developers already work — in the command line — with full access to your files, git history, and development tools.

## What Claude Code Can Do

Claude Code goes beyond code completion. It reads and writes files across your entire project, runs shell commands, manages git workflows, searches and navigates large codebases, debugs errors by reading logs and stack traces, and answers architectural questions about unfamiliar code. It operates as a peer that understands context, not a glorified autocomplete.

## Prerequisites

Before installing Claude Code, you need:

- **Node.js 18 or higher** — Claude Code runs as a Node.js package
- **An Anthropic account** — Pro, Max, Teams, or Enterprise plan (or an API key with credits)
- **A terminal** — macOS Terminal, iTerm2, Windows Terminal, or any Linux terminal emulator
- **Git** — required on all platforms (Windows users need Git for Windows installed first)

## Installation

Install Claude Code globally:

```bash
npm install -g @anthropic-ai/claude-code
```

Verify the installation:

```bash
claude --version
```

On first run, Claude Code prompts you to authenticate with your Anthropic account through a browser-based OAuth flow.

## Starting Your First Session

Navigate to any project directory and run:

```bash
cd your-project
claude
```

Claude Code scans your project structure and loads context about your codebase. Start with an exploratory prompt to orient yourself:

```
> What does this project do? Walk me through the main architecture.
```

Claude reads your files, examines the directory structure, and provides a grounded summary based on what it actually finds in the code — not guesses.

## The CLAUDE.md File

`CLAUDE.md` is a markdown file at your project root that serves as onboarding documentation for Claude Code. It tells Claude how your project works — build commands, testing procedures, code style rules, and architectural decisions.

Generate a starter version:

```
> /init
```

Then customize it with project-specific details:

```markdown
# CLAUDE.md

## Build & Test
- `npm run build` to compile
- `npm test` to run the test suite
- `npm run lint` to check code style

## Architecture
- Express backend in /src/server
- React frontend in /src/client
- PostgreSQL database with Prisma ORM

## Code Style
- Use TypeScript strict mode
- Prefer named exports over default exports
- Write tests for all new API endpoints
```

Claude reads this file at the start of every session, giving it persistent context about your project's conventions.

## Essential Commands

Claude Code has built-in slash commands that modify its behavior:

| Command | Purpose |
|---------|---------|
| `/init` | Generate a starter CLAUDE.md |
| `/plan` | Enter Plan Mode — Claude analyzes before acting |
| `/compact` | Compress conversation context to free up token space |
| `/clear` | Reset the conversation |
| `/help` | Show available commands |
| `/chrome` | Connect to a Chrome browser for web automation |

## Plan Mode

Plan Mode is one of Claude Code's most valuable features for non-trivial changes. When you enter Plan Mode with `/plan`, Claude shifts its behavior:

1. **Analyzes the problem** — reads relevant files, traces dependencies, identifies affected areas
2. **Outlines a step-by-step plan** — what it will change, in what order, and why
3. **Shows its reasoning** — you see how Claude thinks through the problem
4. **Waits for your approval** — nothing is executed until you confirm

Use Plan Mode for refactors, new features, or any change that touches multiple files. It prevents Claude from charging ahead with an approach you might disagree with.

```
> /plan Add user authentication with JWT tokens and a login endpoint
```

## Working with Files

Claude Code reads and writes files directly on your filesystem. You can ask it to create new files, modify existing ones, or refactor across multiple files in a single conversation:

```
> Create a new API endpoint at /api/users that returns a paginated list of users from the database

> Refactor the error handling in src/middleware to use a centralized error handler

> Find everywhere we're using the old config format and migrate to the new one
```

Claude shows you diffs before applying changes, and you can approve or reject each modification.

## Running Commands

Claude Code can execute shell commands on your behalf — running tests, installing packages, starting dev servers, or debugging build failures:

```
> Run the test suite and fix any failing tests

> Install the latest version of prisma and run the migration
```

You control which commands Claude can run through permission settings. By default, it asks for confirmation before executing potentially destructive commands.

## Git Integration

Claude Code understands git natively. It can stage changes, write commit messages, create branches, and manage your workflow:

```
> Commit the changes we just made with a descriptive message

> Create a new branch called feature/user-auth and commit our work there

> Show me what changed in the last 3 commits
```

## Tips for Effective Use

**Be specific about what you want.** "Fix the bug" is vague. "The /api/orders endpoint returns a 500 error when the cart is empty — fix it" gives Claude enough context to work efficiently.

**Start broad, then narrow.** When working in an unfamiliar codebase, begin with "What does this project do?" before diving into specific changes.

**Use CLAUDE.md for recurring context.** If you find yourself repeating the same instructions ("always use Prisma for database queries", "run tests with pytest"), add them to CLAUDE.md so Claude remembers across sessions.

**Leverage Plan Mode for complex changes.** Any change touching more than two or three files benefits from planning first.

**Review diffs carefully.** Claude is capable but not infallible. Read the changes it proposes, especially for security-sensitive code, database migrations, or public API changes.

## What's Next

Once you're comfortable with the basics, explore these capabilities:

- [Browser Access](../ai-development/claude-code-browser-access) — give Claude control of a Chrome window for web automation
- [Building Full-Stack Apps with Claude Code](../ai-development/claude-code-full-stack) — end-to-end application development workflows
- [Claude Code Scheduler](./claude-code-scheduler-automation) — automate recurring tasks on a schedule
- [Prompt Engineering for Claude](../ai-development/claude-prompt-engineering) — get better results with advanced prompting techniques
