# AI Agent Evaluation

**AI agent evaluation** is the practice of measuring whether an [AI agent](./ai-agents) actually does the job you built it for — consistently, correctly, and at a reasonable cost. It's the difference between "it worked on the demo" and "it works in production without surprising us."

Evaluating agents is harder than evaluating single-turn LLM outputs. An agent chains reasoning, tool calls, and intermediate decisions across many steps. A good final answer can hide a broken trajectory — wrong tool, wasted spend, or a loop that happened to terminate successfully. A bad final answer can come from a perfectly reasonable trajectory that hit a missing dependency. Agent eval has to look at both the path and the destination.

## Why Single-Turn LLM Evals Aren't Enough

Classic LLM evaluation asks: given this input, was the output correct, coherent, and safe? That's a one-shot question.

Agent evaluation asks a sequence of questions:

- Did the agent understand the task?
- Did it plan reasonable steps?
- Did it pick the right tools?
- Did it pass correct arguments to those tools?
- Did it handle errors and partial results?
- Did it stop when done (and not before)?
- Did the whole trajectory stay within budget and latency constraints?
- Was the final output correct?

Every one of those can fail independently. A single-turn eval collapses them into "good answer / bad answer" and loses the signal. Agent eval preserves it.

## The Five Dimensions of Agent Quality

In practice, most teams end up measuring the same five things:

| Dimension | What You're Measuring | How to Catch It |
|-----------|----------------------|-----------------|
| **Task success** | Did the agent achieve the user's goal? | End-to-end pass rate on a golden task set |
| **Trajectory quality** | Was the path efficient? Did it loop, backtrack, or meander? | Step count, plan adherence, redundancy detection |
| **Tool-use correctness** | Right tool? Right arguments? | Trace inspection, tool-call assertion tests |
| **Cost** | Tokens in, tokens out, total run cost | Token counters on traces; see [AI agent budgets](./ai-agent-budgets-cost-control) |
| **Latency** | Wall-clock time; turns taken | Time-to-first-tool-call, total turns, p95 duration |

A good eval rig reports all five. Teams that only track task success end up with agents that pass but burn through their budget; teams that only track cost end up shipping agents that are cheap and wrong.

## Core Evaluation Techniques

There isn't one "right" way to evaluate agents. You compose techniques based on what you're testing.

### Golden Task Sets

A curated collection of representative tasks with known-good outcomes. You run the agent against all of them and measure pass rate.

Two flavors are useful:

- **Regression set** — tasks the agent should reliably pass (near-100%). Used to catch backsliding when you change the model, prompt, or tools.
- **Capability set** — tasks at the edge of what the agent can do. Pass rate starts low and climbs as you improve the agent. Used to track progress.

Keep them separate. Mixing them hides regressions behind capability noise.

### Trace-Based Evaluation

Every agent run produces a trace: the sequence of model outputs, tool calls, tool results, and intermediate decisions. Trace-based eval writes assertions against the trace:

- Did the agent call the `search_docs` tool before attempting to answer?
- Did the `write_file` tool get called more than twice? (Sign of a loop.)
- Was every argument to `execute_sql` parameterized?

These catch structural bugs that final-output eval misses. If an agent returns a good answer but got there by guessing instead of searching, the trace tells you.

### LLM-as-Judge

Use a model to score outputs against a rubric. Works well for open-ended tasks where there's no single correct answer — summarization quality, code review depth, tone of voice.

LLM-as-judge is scalable and cheap compared to human review, but it has real failure modes:

- **Prompt sensitivity** — small rubric changes swing scores
- **Bias** — models favor outputs that look like their own
- **Non-determinism** — same input can score differently run to run

Mitigation: keep a small human-calibration set where the judge's scores are checked against human scores, and track judge-human correlation as a metric in its own right.

### Human Evaluation

The ground truth. Expensive and slow, so reserve it for:

- Calibrating your LLM-as-judge
- Scoring the final ship/no-ship evaluation before a launch
- Random audit samples of production traces

The pattern most teams converge on: human eval on a small, rotating sample; automated eval on everything else.

### Offline vs. Online Eval

Offline eval runs against a static dataset, in a CI pipeline or ad-hoc harness. Fast feedback loop. Good for experimentation.

Online eval runs against live production traffic — shadow evaluations that score real user interactions without blocking them. Catches drift offline eval misses (prompt injection attempts, distribution shifts, weird edge cases).

Ship both. Offline gives you a gate before merging. Online tells you if reality matches your test set.

## The Tooling Landscape

The ecosystem is young but converging. Pick one platform and commit; switching later is painful because traces and eval datasets rarely port cleanly.

| Tool | Strengths | Fit |
|------|-----------|-----|
| **LangSmith** | Deep LangChain integration; strong tracing UI; built-in eval datasets | Teams already on LangChain |
| **Braintrust** | Regression gates, flexible graders (code/model/human), good DX | Teams that want TypeScript/Python-native eval pipelines |
| **Langfuse** | Open source; self-hostable; solid OTEL support | Teams that need on-prem or want to own the stack |
| **Phoenix (Arize)** | Agent-specific templates for tool-call correctness and path convergence | Teams focused on trajectory metrics |
| **OpenAI Evals** | Standard framework; benchmark-style harnesses | Teams doing capability evals against OpenAI models |
| **Anthropic evaluation** | Code, model, and human graders wired into the Claude API | Teams building on Claude |
| **DeepEval / Galileo** | Metric libraries (tool quality, action advancement) | Teams composing custom metrics |

Most production setups use one tracing/observability platform (LangSmith, Langfuse, Phoenix, Braintrust) plus custom graders for domain-specific correctness.

## Designing a Practical Eval Rig

A workable starting point for an agent going to production:

1. **Define success per task type.** Don't write one global success metric — write one per task category. A research task succeeds differently from a code-writing task.
2. **Build a small regression set.** 20-50 tasks. The ones you'd be embarrassed to ship breaking.
3. **Instrument every run with a trace.** Token counts, tool calls, latency, full conversation. Store them.
4. **Wire trace assertions for known hazards.** "No more than N tool calls per task." "Never call the destructive tool without the user-confirm tool first." Failures block merges.
5. **Add LLM-as-judge for open-ended quality.** One rubric per task type. Calibrate against human scores on a small sample.
6. **Run the suite on every prompt/model change.** Eval is worth the CI time.
7. **Shadow-eval production.** Sample 1-5% of live runs through the same graders. Alert on pass-rate drops.

This is maybe a week of work for one engineer. The first time it catches a silent regression — a prompt tweak that halved your tool-call accuracy, say — it pays for itself.

## Common Pitfalls

- **Data leakage.** Your eval set should not overlap with any examples the agent has seen in its prompt, few-shot context, or training. Otherwise you're measuring memorization.
- **Stale eval sets.** Agents evolve; so should the eval. If your regression set is the same as it was six months ago, you're measuring a product that no longer exists.
- **Over-reliance on LLM-as-judge.** Judges are useful but biased. Track judge-human correlation as a first-class metric. When it drops, recalibrate or retire the judge.
- **Goodhart's Law.** When a metric becomes a target, agents find ways to game it. An agent optimized for "task success" on a narrow eval set will find shortcuts that don't generalize. Rotate tasks and keep a hidden holdout.
- **Only measuring the final output.** Traces are where most bugs live. If you're not grading trajectory, you're missing half the signal.
- **No cost or latency gates.** An agent that passes every correctness eval but takes 90 seconds and $0.50 per task isn't production-ready. Gate on all five dimensions.

## How Agent Evals Fit Into the Broader Dev Loop

Treat eval as a first-class part of [agent development](./agentic-coding), not a pre-launch checklist item.

Every significant change to the agent — new prompt, new tool, model upgrade, [skill](./vendor-claude-code-skills) added, [harness](./agents-vs-harnesses) tweak — should run through the eval rig before it lands. Merge when the regression set stays at 100% and the capability set either stays flat or improves.

When something regresses, don't chase the final output. Open the failing trace, look at where the trajectory diverged from known-good runs, and fix there. Final-output debugging is slow and often misleading.

And when a real production bug shows up that the eval set didn't catch, add that case to the regression set before you fix it. This is the main way your eval coverage grows over time: by turning every production incident into a test.

## Related Reading

- [AI Agents](./ai-agents) — What we're evaluating
- [Agent Harness Feedback Loop](./agent-harness-feedback-loop) — The build-eval-ship cycle
- [AI Agent Budgets & Cost Control](./ai-agent-budgets-cost-control) — Cost as an eval dimension
- [Multi-Agent Task Delegation](./multi-agent-task-delegation) — Evaluating delegation correctness
- [Testing & QA](../devops-and-tools/testing-qa) — Testing philosophy that overlaps with agent eval
