# The Agent-Harness Feedback Loop

Write. Check. Fix. Check. Pass. This five-step cycle is the atomic unit of agentic coding. Every feature an AI agent builds, every bug it fixes, every refactor it completes — all of it runs through this loop, sometimes dozens of times per task. Understanding the loop is understanding how agentic coding actually works.

## The Core Pattern

```
Agent writes code
     ↓
Harness runs (type check, lint, tests, build)
     ↓
Harness passes? ──YES──→ Task complete
     ↓ NO
Agent reads error output
     ↓
Agent writes fix
     ↓
[back to top]
```

This isn't metaphorical. When you watch [Claude Code](./claude-code.md) or [Cursor](./cursor.md) work, you're watching this loop execute in real time. The agent writes a function, runs `tsc --noEmit`, reads the type error, adjusts the code, and runs again. Three loops, four loops, ten loops — until the harness passes.

## Why the Loop is the Unit That Matters

Most people evaluate agents on model quality: which LLM, which version, which prompt. These matter — but they're not the primary determinant of agent output quality.

The loop is.

A great model stuck in a slow, noisy loop produces mediocre work. A capable model in a fast, clear loop produces excellent work. Here's why:

**Loop speed compounds.** Each iteration takes time. An agent solving a moderately complex problem might need 20 iterations. With a 5-second harness, that's 100 seconds. With a 60-second harness, that's 20 minutes. But the real cost is more than clock time — longer loops mean more context consumed before convergence, which degrades later iterations.

**Error clarity drives fix accuracy.** When the harness says `Property 'id' does not exist on type 'User'` at line 47, the agent fixes line 47. When it says `TypeScript compilation failed`, the agent has to hunt. Each hunting step is an extra loop iteration, and extra loop iterations are degraded context.

**Loop count reveals real difficulty.** A task that converges in 3 loops is genuinely simple. A task that takes 30 loops either has unclear requirements, a weak harness, or real complexity that needs a different approach. Loop count is a diagnostic.

## How Different Agents Implement It

### Claude Code

Claude Code runs the loop explicitly. You configure the harness in `CLAUDE.md`:
```markdown
After making changes: npm run harness:fast
Before marking complete: npm run harness
```

Claude Code reads this file, executes the specified commands after each change, reads the output, and continues iterating. With [Claude Code hooks](./claude-code-hooks.md), you can make the loop fully automatic — hooks fire harness checks on every file save without needing explicit model instructions.

### Cursor Agent

[Cursor](./cursor.md) implements the loop inside its agentic task execution. When you run a Cursor Agent task, it automatically runs your configured lint/test commands and incorporates the output into its next action. Cursor's tight IDE integration means it can also see inline errors as the agent types, creating a sub-loop that runs even faster than explicit harness commands.

### GitHub Copilot

Copilot Workspace runs the loop against your CI/CD pipeline. It generates code, creates a PR, and waits for CI to pass before declaring success. The loop iterations are longer (minutes per CI run vs seconds per local check), but the harness is your full production pipeline — catching more classes of errors.

### Pi (Self-Extending Loop)

[Pi](https://github.com/badlogic/pi-mono) takes the feedback loop a step further: the agent can modify the harness itself at runtime. Pi's architecture lets the agent write and hot-reload TypeScript extensions mid-session — including custom validation tools. If the agent encounters a recurring class of error, it can create a new validation check, load it into the running session, and immediately start using it in subsequent loop iterations.

This makes Pi's loop self-improving. Rather than relying on a fixed harness configured upfront, the agent evaluates what checks are missing and builds them on the fly. The practical effect is that later loop iterations catch more errors than earlier ones, because the harness grows alongside the code.

## Measuring Loop Quality

Four metrics tell you whether your loop is working:

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Iterations to pass** | How many harness runs before success | <10 for typical features |
| **Time per iteration** | Harness runtime | <30s for fast checks |
| **False positive rate** | Harness failures unrelated to agent changes | <5% of runs |
| **Error clarity score** | How often agent fixes error on first try | >80% |

You don't need formal measurement infrastructure for these. Watching a few agent sessions gives you a feel for all four. The tell-tale signs of a broken loop:
- Agent re-runs the same fix repeatedly (unclear errors or flaky tests)
- Long silence between actions (slow harness)
- Agent asks clarifying questions mid-task (ambiguous harness output)
- Final output has obvious errors (harness isn't catching them)

## Optimizing the Loop

### Speed: Cut harness time first

Order checks fastest-to-slowest and short-circuit on first failure:
```bash
# This is better than running all checks in parallel
tsc --noEmit && next lint && vitest run && next build
# Short-circuits: if tsc fails, lint/tests/build don't run
```

Run your full harness only at task completion. During iteration, run only the fast checks (type + lint). A 5-second inner loop beats a 60-second inner loop every time.

### Clarity: Improve error messages

Audit your harness output by asking: "If I were seeing this error for the first time with no context, could I fix it in 30 seconds?" If not, configure the tool for more verbosity:

```bash
# ESLint with file and rule info
npx eslint . --format stylish --max-warnings 0

# TypeScript with full error details
npx tsc --noEmit --pretty

# Vitest with verbose failure output
npx vitest run --reporter=verbose
```

For custom scripts, print the file path, line number, and a plain-English description of the problem. Never print just "check failed."

### Reliability: Kill flakiness

Every flaky test adds noise to the loop. The agent learns to retry instead of fix, which trains bad behavior and wastes iterations. Fix flaky tests immediately — they're more expensive than missing tests.

Common flakiness sources and fixes:
```typescript
// Flaky: depends on real time
expect(result.timestamp).toBe(Date.now());

// Fixed: mock the clock
vi.setSystemTime(new Date('2024-01-01'));
expect(result.timestamp).toBe(new Date('2024-01-01').getTime());

// Flaky: depends on test order
let db: Database;
test('creates user', async () => {
  db = await Database.connect(); // global state
});

// Fixed: isolated setup
beforeEach(async () => {
  db = await Database.connect();
});
afterEach(async () => {
  await db.close();
});
```

### Coverage: Catch more errors earlier

The earlier the harness catches an error, the fewer iterations to fix it. Add checks for the error classes your agents commonly introduce:

- Custom ESLint rules for your codebase patterns
- Strict TypeScript settings (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Import order linting (prevents circular dependency surprises at build time)
- Bundle size checks (catches accidental large imports)

## Real Loop Examples

### Simple fix: 3 iterations

```
Iteration 1: Agent adds function → tsc fails: "Parameter 'userId' implicitly has an 'any' type"
Iteration 2: Agent adds type annotation → tsc passes, lint fails: "Unused variable 'temp'"
Iteration 3: Agent removes temp variable → All checks pass
```

### Complex refactor: 12 iterations

```
Iterations 1-3: Rename type, fix all usages in main path
Iterations 4-6: Discover secondary usages in utility files, fix them
Iterations 7-9: Update tests that depended on old type shape
Iterations 10-11: Fix edge case in test mocks
Iteration 12: Full harness pass, task complete
```

### Broken loop: 40+ iterations

```
Iterations 1-5: Agent fixes TypeScript errors but build keeps failing
Iterations 6-10: Agent tries different approaches to build issue
...
[Investigation reveals: build error is pre-existing, unrelated to agent changes]
```

When you see a high iteration count, investigate. Either the task is genuinely complex (break it down), the harness is giving bad signal (flaky tests, pre-existing failures), or the agent's context has degraded and it needs a reset.

## The Loop in Production

Once you've tuned your loop, codify it:

```markdown
# CLAUDE.md

## Development Loop

After every file change:
```bash
npm run harness:fast    # tsc + lint, ~10s
```

Before marking any task complete:
```bash
npm run harness         # full: tsc + lint + tests + build, ~90s
```

If harness fails, read the output carefully and fix before continuing.
Do not mark tasks complete with failing harness checks.
```

This instruction, combined with a well-tuned harness, creates a reliable agent that catches its own mistakes before they become your problems.

## See Also

- [AI Agents vs Coding Harnesses](./agents-vs-harnesses.md) — understanding the two components
- [Building Effective Harnesses for AI Agents](./building-harnesses-for-agents.md) — how to build a good harness
- [Coding Harnesses](./coding-harnesses.md) — harness fundamentals
- [AI Agents](./ai-agents.md) — how agents work
- [Claude Code](./claude-code.md) — Claude Code's loop implementation
- [Cursor](./cursor.md) — Cursor's loop implementation
- [Agentic Coding](./agentic-coding.md) — the full agentic development workflow
