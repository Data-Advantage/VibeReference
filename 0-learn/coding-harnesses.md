# Coding Harnesses

A coding harness is the set of automated checks — linters, type checkers, test suites, and build scripts — that wrap around your codebase and provide instant feedback on whether code changes are correct. In agentic coding, harnesses are critical because they let AI agents self-correct: the agent writes code, runs the harness, sees failures, and fixes them automatically.

## Why Harnesses Matter for AI Development

Without a harness, an AI agent is coding blind. It generates code but has no way to verify correctness. With a harness, the agent enters a productive loop:

```
Write code → Run harness → See errors → Fix errors → Run harness → Pass → Done
```

This is the difference between an agent that produces plausible-looking code and one that produces working code.

## Components of a Good Coding Harness

### Type Checking
```bash
npx tsc --noEmit
```
Catches type errors, missing imports, incorrect function signatures. Fast, comprehensive, and the single most valuable harness component for TypeScript projects.

### Linting
```bash
npx next lint
# or
npx eslint .
```
Catches code style issues, unused variables, accessibility problems, and common mistakes.

### Unit Tests
```bash
npx vitest run
# or
npm test
```
Validates that individual functions and components behave correctly.

### Build Verification
```bash
npm run build
```
Ensures the full application compiles and generates output without errors.

### End-to-End Tests
```bash
npx playwright test
```
Validates complete user workflows in a real browser environment.

## Harness Design Principles

- **Fast**: The harness should run in seconds, not minutes. Agents iterate dozens of times — slow harnesses kill productivity.
- **Deterministic**: Same code should produce same results. Flaky tests confuse agents.
- **Informative**: Error messages should clearly indicate what's wrong and where. Stack traces and line numbers help agents fix issues.
- **Comprehensive**: Cover the critical paths. The more your harness catches, the less manual review you need.
- **Incremental**: Run only the checks relevant to changed files when possible.

## Setting Up a Minimal Harness

For a Next.js + TypeScript project (like VibeReference), a minimal effective harness:

```json
{
  "scripts": {
    "check": "tsc --noEmit && next lint && next build",
    "test": "vitest run",
    "harness": "npm run check && npm run test"
  }
}
```

## Harness Tiers

| Tier | Speed | What It Catches | When to Run |
|------|-------|-----------------|-------------|
| **Type check** | ~5s | Type errors, missing imports | Every change |
| **Lint** | ~10s | Style issues, common bugs | Every change |
| **Unit tests** | ~30s | Logic errors, regressions | Every feature |
| **Build** | ~60s | Compilation issues, config problems | Before commit |
| **E2E tests** | ~5min | Integration issues, UI bugs | Before deploy |

## Harnesses for AI Agents

When configuring tools like Claude Code or Cursor, you can specify harness commands that the agent runs automatically:

- **Pre-commit hooks**: Run type checks and linting before any commit
- **Test commands**: Tell the agent which test command to run after making changes
- **Build verification**: Have the agent verify the full build succeeds before declaring a task complete

The tighter the feedback loop, the better the agent performs. An agent with a 5-second type check harness will outperform one with only a 60-second build step.

## How It's Used in VibeReference

VibeReference uses TypeScript strict mode, Next.js built-in linting, and static export builds as its coding harness. When AI agents make changes to the codebase, running `npm run build` validates that all pages generate correctly, all types are sound, and all imports resolve. This harness enables confident iteration — agents can make changes and immediately verify correctness without human intervention.
