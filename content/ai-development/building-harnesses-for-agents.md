# Building Harnesses for AI Coding Agents

A harness is not a test suite. It's not a linter. It's the entire system that wraps around the model and makes it behave like a reliable agent — tools, context management, the execution loop, validation, memory, guardrails, and workflow automation. Building a good harness is the highest-leverage thing you can do to improve your agent's output quality. It matters more than picking the right model.

This guide covers all seven components of a harness and how to build each one for a solo founder using AI coding tools like Claude Code or Cursor on a TypeScript/Next.js project.

## Why the Harness Determines Output Quality

When an AI agent writes code, it enters an orchestration loop: observe the current state, plan the next action, act, verify the result, repeat. The harness runs this loop. Its quality determines:

- Whether the agent can find the right files and understand the codebase (context management)
- Whether it can actually make changes and run code (tools)
- Whether it catches its own mistakes before they become bugs (validation)
- Whether it remembers decisions across a multi-hour task (memory)
- Whether it stays within scope instead of refactoring things you didn't ask about (guardrails)

A great model with a weak harness produces inconsistent, drift-prone output. A capable model with a well-designed harness ships reliable features. The harness is the multiplier.

## Component 1: Tools

Tools are what let the agent act in the world. Without them, the model is generating text with no way to verify it. The minimum viable tool set for a coding agent:

- **File read/write** — read any file, create new files, edit existing ones
- **Shell execution** — run arbitrary commands (npm, git, node, tsc)
- **Directory traversal** — list files, find patterns, understand project structure
- **Git operations** — commit, diff, status, branch

Expanded tool sets include web search, external API calls, browser automation, and database access. Each additional tool expands what the agent can accomplish, but also expands the surface area for mistakes — which is why guardrails matter.

**In practice:** Claude Code and Cursor both provide a standard tool set. If you're building a custom agent, the tool configuration is the first thing to define. Use `CLAUDE.md` to tell Claude Code exactly what tools and commands it's allowed to use on your project:

```markdown
# CLAUDE.md

## Available commands
- `npm run build` — builds and type-checks
- `npm run test` — runs vitest
- `git add <files> && git commit -m "..."` — commit specific files only
- Do NOT use `git push` without confirmation
```

## Component 2: Context Management

Context management is how the harness feeds the right information to the model without exhausting its context window. This is the component that most determines whether an agent can work on a real codebase.

Problems without good context management:
- Agent writes code that duplicates existing functionality it didn't know about
- Agent forgets decisions made three steps ago
- Agent makes changes in the wrong place because it doesn't understand project structure
- Context window fills with irrelevant files, leaving no room for the actual task

**For Claude Code:** CLAUDE.md is your primary context management tool. Use it to orient the agent quickly:

```markdown
# CLAUDE.md

## Project structure
- `src/app/` — Next.js App Router pages and layouts
- `src/lib/` — shared utilities and business logic
- `src/components/` — UI components (shadcn/ui + Tailwind)
- `convex/` — Convex schema and server functions

## Key conventions
- All database access goes through Convex functions in `convex/`
- Authentication uses Clerk — never roll custom auth
- API routes go in `src/app/api/`, not a separate server

## Common patterns
- Use `useQuery` and `useMutation` from `convex/react` for data fetching
- Error handling: throw `ConvexError` for user-facing errors
```

This reduces the context the agent needs to orient itself from reading dozens of files to reading one.

**For large codebases:** Consider semantic search tools that let the agent query the codebase by concept rather than by filename. Tools like Cursor have this built in; for custom agents, embeddings over your codebase enable the same pattern.

## Component 3: Orchestration / The Agent Loop

The agent loop is the observe → plan → act → verify → repeat cycle that drives the agent forward. This is the harness's core orchestration component — it decides when the agent should act, when it should check its work, and when it should stop.

The loop lives inside the harness. It is not a bridge between the harness and something external. The harness owns the loop.

A minimal explicit loop in `CLAUDE.md`:

```markdown
## Development loop

For every task:
1. Read the relevant files before making any changes
2. Make the minimal change that accomplishes the goal
3. Run `npm run harness:fast` (tsc + lint, ~10s)
4. Fix any failures, run again
5. When fast checks pass, run `npm run harness` (full: tsc + lint + test + build)
6. Mark complete only when full harness passes
```

Claude Code follows these instructions when given explicitly. Cursor Agent implements the loop internally, automatically running your configured checks after each action. GitHub Copilot Workspace runs the loop against your CI pipeline.

The practical implication: you control the loop's behavior through configuration, not code. `CLAUDE.md` for Claude Code, task descriptions for Cursor Agent, CI/CD configuration for Copilot Workspace.

## Component 4: Validation and Feedback

Validation is what most people mean when they say "harness." It's the most visible component, but it's one of seven. Validation checks are the signals the loop uses to determine whether an action succeeded.

For TypeScript/Next.js, build validation in layers:

### Layer 1: Type checking (~5s)
```bash
npx tsc --noEmit
```
Highest signal-to-noise ratio of any harness component. Catches type errors, missing imports, wrong function signatures. Should run first — if types fail, nothing else matters.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Layer 2: Linting (~10s)
```bash
npx next lint
```
Catches issues TypeScript misses: unused imports, accessibility problems, React anti-patterns, style violations. Valuable specifically for agent output — agents write technically correct but sometimes stylistically wrong code.

### Layer 3: Unit tests (~30s)
```bash
npx vitest run
```
Validates business logic. The code compiles and types check, but does it actually do the right thing? Keep tests fast by mocking I/O and network calls.

### Layer 4: Build verification (~60s)
```bash
npm run build
```
Catches issues none of the faster checks surface: missing pages, broken static generation, misconfigured environment variables, bundle size regressions. Run before commit, not on every change.

### Composing the harness
```json
{
  "scripts": {
    "harness:fast": "tsc --noEmit && next lint",
    "harness": "tsc --noEmit && next lint && vitest run && next build"
  }
}
```

**Design principles for validation:**
- Order fastest-to-slowest and short-circuit on first failure (don't waste 60 seconds on a build if tsc already failed)
- Make error messages maximally specific: `Property 'userId' does not exist on type 'Request'` beats `TypeScript compilation failed`
- Fix flakiness immediately — flaky tests train the agent to retry instead of fix, which breaks the loop
- Exit with non-zero codes on failure — agents check exit codes, not output text

## Component 5: State Persistence and Memory

Memory is what lets an agent resume a complex task, remember project conventions, and avoid repeating mistakes across sessions. Without it, every session starts from scratch.

**Session memory:** Claude Code's context window serves as in-session memory — everything it has read and done in the current session is available. The limit is context length, which is why context management (component 2) matters.

**Cross-session memory:** For decisions that should persist across sessions, write them to `CLAUDE.md` or a project-specific notes file. After completing a complex task, prompt Claude Code to document the key decisions:

```
"Add a note to CLAUDE.md about how we handle authentication state — specifically the pattern we use to sync Clerk with Convex user records."
```

**Project state:** Harnesses for long-running agent tasks (like [Pi](https://github.com/badlogic/pi-mono)'s extended sessions) need explicit state files that track what's been done, what's pending, and what decisions were made. Pi stores tool extensions it has written mid-session so they persist across the session and can be reused.

## Component 6: Guardrails, Prompts, and Constraints

Guardrails are what prevent the agent from being helpful in the wrong direction. Without them, agents wander outside scope, touch files they shouldn't, and make "improvements" you didn't ask for.

**Scope constraints in CLAUDE.md:**
```markdown
## Constraints

- Only modify files in `src/` and `convex/` unless explicitly told otherwise
- Do not modify `package.json` or install packages without confirmation
- Do not commit to `main` directly — use feature branches
- Do not refactor code you weren't asked to change
- Do not add logging, comments, or error handling beyond what the task requires
```

**Prompt engineering:** The system prompt (or CLAUDE.md for Claude Code) sets the agent's operating frame. Clear, specific constraints produce better-scoped output than general instructions. "Work only on the authentication flow" is weaker than "Only modify files in `src/lib/auth/` and `src/app/(auth)/`."

**Denied operations:** Some harnesses allow you to disable specific tools for a session. If an agent doesn't need internet access for a given task, removing the web search tool prevents accidental external dependencies.

**Human-in-the-loop gates:** For high-risk operations (deleting files, modifying schema, deploying), require explicit confirmation before the agent proceeds. This is a guardrail at the tool level: the tool implementation requires approval rather than executing immediately.

## Component 7: Workflow Automation

Workflow automation handles the coordination layer: breaking large tasks into steps, managing retry logic, logging progress, and handing off between agents.

**Task decomposition:** Complex features require plans. Before writing any code, instruct the agent to outline the steps:

```
"Before starting: write out the steps you'll take to implement this feature, in order. List the files you'll modify and what each change will do."
```

This forces the agent to plan before acting, which reduces mid-task drift and produces better-organized output.

**Retry logic:** When a harness step fails, the loop retries with the error as context. For persistent failures (more than 5 iterations on the same error), the agent should stop and escalate rather than keep guessing. Add this to `CLAUDE.md`:

```markdown
If you've tried the same fix more than 3 times without progress, stop and explain what you've tried. Do not keep guessing.
```

**Multi-agent handoffs:** For teams using multiple agents (or [multi-agent delegation](./multi-agent-task-delegation)), workflow automation includes the handoff protocol: what state to pass between agents, how to signal completion, how to communicate blockers.

## Putting It Together: Minimal Production Harness

For a solo founder with a TypeScript/Next.js app:

```json
// package.json
{
  "scripts": {
    "harness:fast": "tsc --noEmit && next lint",
    "harness": "tsc --noEmit && next lint && vitest run && next build"
  }
}
```

```bash
# .husky/pre-commit
npm run harness:fast
```

```markdown
# CLAUDE.md

## What you can do
- Read and edit files in `src/` and `convex/`
- Run shell commands with Bash
- Use git to stage and commit (not push)

## Development loop
After every change: `npm run harness:fast`  
Before marking complete: `npm run harness`

## Constraints
- Only modify files you were asked to change
- No new packages without confirmation
- Do not modify `CLAUDE.md` itself

## Project conventions
[your project-specific context here]
```

This gives you: tools (built into Claude Code), context management (CLAUDE.md), orchestration (explicit loop instructions), validation (harness scripts), some state persistence (CLAUDE.md), guardrails (constraints section), and basic workflow automation (loop instructions + pre-commit hook).

## Emerging Pattern: Agent-Authored Harnesses

[Pi](https://github.com/badlogic/pi-mono) (badlogic/pi-mono) demonstrates a frontier pattern: the agent writes and hot-reloads its own harness extensions at runtime. If the agent encounters a recurring class of error during a session, it can write a TypeScript validation check and immediately load it into its own loop — without a human configuring it.

This doesn't replace a well-designed static harness. You still need your context management, guardrails, and base validation configured before the agent starts. But it shows that harness components — especially validation — can be dynamic artifacts that the agent authors and improves, not just fixed infrastructure you build once.

The formula stays constant: Agent = Model + Harness. What changes is who builds the harness — and Pi suggests the answer can sometimes be the agent itself.

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the model + harness formula explained
- [Coding Harnesses](./coding-harnesses) — validation component fundamentals
- [The Harness Orchestration Loop](./agent-harness-feedback-loop) — the observe-plan-act-verify cycle in depth
- [Agentic Coding](./agentic-coding) — the broader agentic development workflow
- [Claude Code](./claude-code) — harness configuration via CLAUDE.md
- [Cursor](./cursor) — Cursor's harness and agent loop
- [Multi-Agent Task Delegation](./multi-agent-task-delegation) — workflow automation across agents
