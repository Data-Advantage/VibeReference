# The Harness Orchestration Loop

The harness doesn't just validate code. It runs a loop: observe the current state, plan the next action, act, verify the result, and repeat. This observe → plan → act → verify cycle is the core of what the harness orchestrates — it's how a model becomes an agent that can complete multi-step tasks autonomously.

The loop is not a bridge between the agent and the harness. It lives inside the harness. The harness is what runs it.

> **Where this fits in the stack.** VibeReference uses a [5-concept stack](./agents-vs-harnesses): **Model**, **Tools**, **Context** (the three primitives), **Harness** (the runtime that wires them into a loop), and **Agent** (a harness configured with role, mission, and scope). This article is about the **Harness** layer — specifically, the loop that the harness runs every turn. When you watch Claude Code or Cursor work, you're watching their harness execute this loop.

## The Cycle

```
Observe: Read files, understand current state, read error output
     ↓
Plan: Decide what action to take next
     ↓
Act: Write code, edit files, run commands
     ↓
Verify: Run validation checks (type checker, linter, tests, build)
     ↓
Pass? ──YES──→ Task complete (or next sub-task)
     ↓ NO
[back to Observe with new error context]
```

When you watch Claude Code or Cursor work, you're watching this cycle execute in real time. The harness reads a file, the model writes a function, the harness runs `tsc --noEmit`, the model reads the type error, adjusts the code, runs again. Three cycles, four cycles, ten cycles — until the validation passes.

This is the loop. The harness runs it. You configure it.

## Why the Loop Quality Matters More Than the Model

Most people evaluate agents on model choice: which LLM, which version. Model quality matters, but it's not the primary determinant of agent output quality. Loop quality is.

**Cycle speed compounds.** Each iteration takes time. An agent solving a moderately complex problem might need 20 cycles. With a 5-second validation check, that's 100 seconds. With a 60-second build, that's 20 minutes — and by then, context has decayed and the model is making mistakes it wouldn't have made in a tight loop.

**Error clarity drives fix accuracy.** When the validation step says `Property 'userId' does not exist on type 'Request'` at line 47, the model fixes line 47. When it says `TypeScript compilation failed`, the model has to hunt. Each hunting step is an extra cycle, and extra cycles consume context.

**Cycle count reveals real difficulty.** A task that converges in 3 cycles is genuinely simple. A task that takes 30 cycles either has unclear requirements, a validation component giving bad signal, or real complexity that needs task decomposition. Cycle count is a diagnostic, not a failure metric.

## How Different Tools Implement the Loop

### Claude Code

Claude Code runs the loop explicitly through configuration. You define the validation steps in `CLAUDE.md`:

```markdown
## Development loop

After every change: `npm run harness:fast`
Before marking complete: `npm run harness`

If the same check fails more than 3 times in a row, stop and explain what you've tried.
```

Claude Code reads these instructions, runs the specified commands after each action, reads the output, and continues iterating. [Claude Code hooks](./claude-code-hooks) automate the loop further — hooks fire validation on every file save without needing explicit instructions each cycle.

### Cursor Agent

Cursor implements the loop internally. When you run a Cursor Agent task, it automatically runs your configured lint and test commands after each action and incorporates the output into its next step. Cursor's IDE integration also provides a sub-loop: the agent sees inline errors as it types, before even running the explicit validation step.

### GitHub Copilot Workspace

Copilot Workspace runs the loop against your CI/CD pipeline. It generates code, creates a PR, and waits for CI to pass before declaring the cycle complete. Each cycle takes minutes (CI runtime vs. seconds for local checks), but the validation is your full production pipeline — catching integration failures that local checks miss.

### Pi: The Self-Modifying Loop

[Pi](https://github.com/badlogic/pi-mono) (badlogic/pi-mono) demonstrates what happens when the loop itself becomes dynamic. Pi's architecture lets the agent write and hot-reload TypeScript extensions mid-session — including new validation checks. If the agent notices a recurring class of error during a task, it can:

1. Write a TypeScript tool that checks for that class of error
2. Hot-reload that tool into the running session
3. Include that check in subsequent validation cycles

The result is a loop that self-improves: later cycles catch more errors than earlier ones, because the validation component grows alongside the code. The observe → plan → act → verify structure stays constant, but the "verify" step gets richer as the session progresses.

This is the frontier of harness engineering — not just running a fixed set of checks, but a loop that authors its own validation logic.

## Measuring Loop Quality

Four metrics tell you whether your loop is working well:

| Metric | What it measures | Target |
|--------|-----------------|--------|
| **Cycles to completion** | Iterations before full validation passes | <10 for typical features |
| **Validation runtime** | Time per cycle (fast checks) | <30s during iteration |
| **False positive rate** | Validation failures unrelated to agent changes | <5% of cycles |
| **Fix accuracy** | How often the agent fixes an error on the first try | >80% |

You don't need formal tooling to measure these. Watching a few agent sessions gives you a feel for all four. The signs of a broken loop:

- Agent makes the same fix repeatedly without progress (unclear error messages or flaky validation)
- Long pauses between actions (slow validation)
- Agent asks clarifying questions mid-task (ambiguous harness output)
- Final output has obvious errors (validation isn't catching them)
- High cycle counts on tasks that should be simple (validation is noisy, not signal)

## Optimizing the Loop

### Speed: Cut validation time first

Order checks fastest-to-slowest and short-circuit on first failure:

```bash
# Fast during iteration
tsc --noEmit && next lint

# Full at task completion
tsc --noEmit && next lint && vitest run && next build
```

Short-circuiting matters: if the type check fails, there's no point running a 60-second build. The model sees the failure faster, spends fewer cycles hunting.

During iteration, run only fast checks (type + lint, ~15s). Run the full validation only before marking a task complete. A 15-second inner loop versus a 90-second inner loop is the difference between a tight, focused agent and one that loses context before converging.

### Clarity: Make errors actionable

Audit your validation output with this test: "If I saw this error for the first time with no context, could I fix it in 30 seconds?" If not, configure the tool for more verbosity:

```bash
# ESLint — include rule name and file
npx eslint . --format stylish --max-warnings 0

# TypeScript — pretty output with context
npx tsc --noEmit --pretty

# Vitest — verbose failure descriptions
npx vitest run --reporter=verbose
```

For custom scripts: always print the file path, line number, and a plain-English description. An exit code alone doesn't tell the agent what to fix.

Good error:
```
src/lib/auth.ts:42:5 - error TS2345: Argument of type 'string | undefined'
is not assignable to parameter of type 'string'.
```

Bad error:
```
Build failed with errors.
```

### Reliability: Eliminate flakiness

A flaky validation check is worse than no check. It trains the agent to retry instead of diagnose, which breaks the loop's feedback signal and wastes cycles.

```typescript
// Flaky: depends on real time
expect(result.timestamp).toBe(Date.now());

// Fixed: mock the clock
vi.setSystemTime(new Date('2024-01-01'));
expect(result.timestamp).toBe(new Date('2024-01-01').getTime());

// Flaky: shared global state between tests
let db: Database;
test('creates user', async () => {
  db = await Database.connect();
});

// Fixed: isolated setup per test
beforeEach(async () => {
  db = await Database.connect();
});
afterEach(async () => {
  await db.close();
});
```

Fix flaky tests immediately. They're more expensive than missing tests — a missing test means an uncaught bug; a flaky test means a broken loop.

### Coverage: Catch failures earlier

The earlier in the cycle a failure is caught, the fewer total cycles to fix it. Add checks for the error classes your agent commonly introduces:

- Custom ESLint rules for your codebase's patterns
- Strict TypeScript settings (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Import order linting (prevents circular dependency surprises at build time)
- Bundle size checks (catches accidental large imports before they reach production)

## Loop Patterns in Practice

### Simple task: 3 cycles
```
Cycle 1: Agent adds function → tsc fails: "Parameter 'userId' implicitly has 'any' type"
Cycle 2: Agent adds type annotation → tsc passes, lint fails: "Unused variable 'temp'"
Cycle 3: Agent removes temp variable → All checks pass → Done
```

### Complex refactor: 12 cycles
```
Cycles 1–3: Rename type, fix all usages in main path
Cycles 4–6: Discover secondary usages in utility files, fix them
Cycles 7–9: Update tests that relied on old type shape
Cycles 10–11: Fix edge case in test mocks
Cycle 12: Full validation pass → Done
```

### Broken loop: 40+ cycles
```
Cycles 1–5: Agent fixes TypeScript errors, build keeps failing for unrelated reason
Cycles 6–15: Agent tries different approaches, none work
...
[Investigation: build error is pre-existing, unrelated to agent changes]
```

When cycle count is high, investigate before continuing. Either the task is genuinely complex and needs decomposition, the validation is giving bad signal (pre-existing failures, flaky tests), or the model's context has degraded and needs a reset.

## Codifying the Loop

Once you've tuned the loop, make it explicit in `CLAUDE.md`:

````markdown
# CLAUDE.md

## Development loop

After every file change:
```bash
npm run harness:fast    # tsc + lint, ~15s
```

Before marking any task complete:
```bash
npm run harness         # tsc + lint + tests + build, ~90s
```

If the same check fails more than 3 times in a row without progress:
- Stop iterating
- Explain what you tried and what the error says
- Ask for guidance rather than continuing to guess
````

This instruction, combined with well-configured validation scripts, creates a loop with a defined structure, clear signals, and an escalation path when it breaks down.

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the canonical 5-concept stack
- [Building Harnesses for AI Agents](./building-harnesses-for-agents) — what the harness layer wires together
- [Coding Harnesses](./coding-harnesses) — validation fundamentals
- [AI Agents](./ai-agents) — how agents work
- [Claude Code](./claude-code) — loop configuration via CLAUDE.md
- [Cursor](./cursor) — Cursor's internal loop implementation
- [Agentic Coding](./agentic-coding) — the full agentic development workflow
