# Building Effective Harnesses for AI Agents

The single biggest lever on your agent output quality isn't the model you're using — it's the harness you've built around it. A mediocre agent with a fast, clear, comprehensive harness outperforms a great agent fumbling with slow builds and cryptic error messages. Your harness is the floor your agent builds on.

## Why Harness Quality Drives Agent Quality

When an AI agent writes code, it enters a feedback loop: write, check, fix, check, pass. The harness is the "check" step. Its quality determines how useful that feedback is.

**Fast harness → tight loop.** An agent running 50 iterations with a 5-second harness finishes in 4 minutes. The same agent with a 60-second harness takes 50 minutes — and by then, context has decayed and the agent is making mistakes it wouldn't have made earlier.

**Clear errors → fewer iterations.** When a type error says `Property 'userId' does not exist on type 'Request'`, the agent knows exactly what to fix. When a build fails with `exit code 1`, the agent has to guess. Clear harness output means fewer wasted iterations.

**Deterministic results → agent trust.** Flaky tests that randomly fail break the agent's ability to distinguish "my code is wrong" from "the harness is unreliable." When harnesses are flaky, agents start ignoring failures — and that's when bugs get through.

## The Ideal Harness Stack

For TypeScript/Next.js projects (the default stack for solo founders), build your harness in layers:

### Layer 1: Type Checking (run every change, ~5s)
```bash
npx tsc --noEmit
```
TypeScript's type checker is the highest-signal, fastest harness component available. It catches:
- Missing properties and wrong types
- Incorrect function call signatures
- Missing imports and exports
- Null/undefined access errors

A strict TypeScript config amplifies this further:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Layer 2: Linting (run every change, ~10s)
```bash
npx next lint
# or: npx eslint . --ext .ts,.tsx
```
Linting catches issues the type checker misses: unused imports, accessibility problems, common React mistakes, and style violations that make code harder to read. For agent output specifically, linting is valuable because agents sometimes produce technically correct but stylistically wrong code.

### Layer 3: Unit Tests (run per feature, ~30s)
```bash
npx vitest run
# or: npx jest --runInBand
```
Tests validate business logic. They're slower than type checks but catch semantic errors — the code compiles and types check, but it doesn't do the right thing. Keep unit tests fast by avoiding I/O and network calls. Mock external dependencies.

### Layer 4: Build Verification (run before commit, ~60s)
```bash
npm run build
```
For Next.js, the full build catches issues none of the faster checks surface: missing pages, broken static generation, misconfigured environment variables, bundle size regressions. Run this before every commit, not on every file change.

### Layer 5: End-to-End Tests (run before deploy, ~5min)
```bash
npx playwright test
```
E2E tests validate complete user workflows. They're expensive to run and maintain, so use them for critical paths only: signup, login, checkout, core feature flows. Don't use them as a substitute for unit tests.

## Putting It Together

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "test": "vitest run",
    "build": "next build",
    "harness": "tsc --noEmit && next lint && vitest run && next build",
    "harness:fast": "tsc --noEmit && next lint"
  }
}
```

Tell your agent to run `npm run harness:fast` after each change and `npm run harness` before marking a task complete. This gives the agent tight feedback during iteration and comprehensive validation before finishing.

## Harness Design Principles

### Fast feedback first
Order your harness from fastest to slowest. Type checking should always run before builds. If the type check fails, there's no point running a 60-second build. The agent should see failures as early as possible.

### Clear, actionable error messages
Good harness error:
```
src/lib/auth.ts:42:5 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```
Bad harness error:
```
Build failed with errors.
```
The first tells the agent exactly what to fix. The second requires the agent to run additional investigation steps. Whenever possible, configure your tools for maximum verbosity.

### Deterministic results
Any test that sometimes passes and sometimes fails is worse than no test. It trains the agent to retry instead of fix. Root out flakiness ruthlessly:
- Use fixed seeds for random data
- Mock timers and dates
- Avoid depending on external services in unit tests
- Set explicit timeouts on async operations

### Incremental where possible
Full harness runs slow things down. For agents working on a specific module, configure them to run targeted checks:
```bash
# Just check the file that changed
npx tsc --noEmit --incremental

# Just lint the changed directory
npx eslint src/lib/

# Just run tests matching the changed module
npx vitest run --reporter=verbose auth
```

[Claude Code hooks](./claude-code-hooks.md) let you automate this — run targeted checks on every file save and the full harness on every commit.

## Making Harness Output Agent-Readable

Standard tool output is designed for human readers. Agent-readable output has different requirements:

**Include file paths and line numbers.** Agents need to know exactly where to look. `src/components/Button.tsx:15` is actionable. `Button component` is not.

**One error per line.** Agents parse output sequentially. Dense, multi-line error blocks are hard to process. Configure tools to produce compact, structured output when possible.

**Exit codes matter.** Your harness should exit with a non-zero code on any failure. Agents check exit codes to determine pass/fail. A harness that prints errors but exits 0 is invisible to agents.

**Separate signal from noise.** Build warnings that don't need fixing are noise. Configure your tools to suppress known-ignorable warnings or route them separately from errors.

## Anti-Patterns to Avoid

**Slow builds as the only check.** If your only harness step is `npm run build` and it takes 3 minutes, your agent's feedback loop is 3 minutes per iteration. Add a fast type check as a first step.

**Tests that hit real databases.** Any test that makes a real network call is flaky by definition — networks fail, rate limits trigger, data drifts. Mock at the boundary.

**Global state between tests.** Tests that depend on execution order fail randomly when parallelized. Each test should set up and tear down its own state.

**Suppressions and ignores.** `// @ts-ignore`, `/* eslint-disable */`, and similar suppressions hide real errors from your agent. Agents see the harness pass and assume correctness. Fix the underlying issue instead.

**Missing error messages in custom checks.** If you write a custom validation script, make sure it prints what failed and why. An exit code alone doesn't tell the agent what to fix.

## Example: Full Harness Setup for Next.js

```bash
# package.json scripts
{
  "scripts": {
    "harness": "npm run typecheck && npm run lint && npm run test && npm run build",
    "harness:fast": "npm run typecheck && npm run lint",
    "typecheck": "tsc --noEmit",
    "lint": "next lint --max-warnings 0",
    "test": "vitest run",
    "build": "next build"
  }
}
```

```bash
# .husky/pre-commit (runs on every commit)
npm run harness:fast
```

```bash
# CLAUDE.md (tells the agent what to run)
After making changes, run: npm run harness:fast
Before marking a task complete, run: npm run harness
```

This gives you:
- Sub-15-second feedback during iteration (typecheck + lint)
- Comprehensive validation before finishing (all four layers)
- Automatic gate on every commit via the pre-commit hook

## See Also

- [Coding Harnesses](./coding-harnesses.md) — harness fundamentals
- [AI Agents vs Coding Harnesses](./agents-vs-harnesses.md) — understanding the relationship
- [The Agent-Harness Feedback Loop](./agent-harness-feedback-loop.md) — measuring loop quality
- [Claude Code Hooks](./claude-code-hooks.md) — automating harness runs in Claude Code
- [Agentic Coding](./agentic-coding.md) — the broader workflow
