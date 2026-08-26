---
title: "AI Code Review Workflow for AI Coding Agents"
description: "Build an AI code review workflow that checks intent, diffs, tests, security, and release risk before agent-written code merges."
---

# AI Code Review Workflow for AI Coding Agents

An AI code review workflow is the operating loop you use after a coding agent returns a diff. The right workflow does not ask "does this look impressive?" It asks whether the change matches the task, keeps the blast radius small, passes the right checks, and leaves enough evidence for a human or automated reviewer to merge it with confidence.

## What the Workflow Is

An AI code review workflow is not the same thing as an [AI code review tool](./ai-code-review-tools). A tool comments on a pull request. A workflow decides what an agent is allowed to change, what evidence it must produce, who reviews the output, and what happens when the result is partly right.

That distinction matters because coding agents can create large, plausible diffs quickly. The failure mode is rarely "the agent wrote obviously broken code." The common failure mode is subtler: it fixed the visible bug while changing an adjacent behavior, skipped a migration edge case, added a dependency for a simple helper, or passed tests that did not cover the real risk.

Use the workflow whenever an agent edits a real repository:

| Review layer | Question | Evidence |
|---|---|---|
| Intent | Did the change solve the requested problem? | Issue, acceptance criteria, before/after behavior |
| Scope | Did the diff stay inside the expected area? | File list, dependency changes, generated files |
| Correctness | Does the implementation work? | Tests, typecheck, manual reproduction, edge cases |
| Security | Did permissions, data access, or secrets change? | Auth paths, environment access, logs, config |
| Maintainability | Can the next developer understand it? | Naming, structure, instructions, comments |
| Release risk | Can this ship and roll back cleanly? | Migration plan, feature flag, deployment notes |

The goal is not to slow agents down. The goal is to keep speed from hiding risk.

## Start With a Review Contract

Before the agent starts, define the review contract in the task. A weak task says "fix checkout." A reviewable task says "fix the checkout total mismatch in `app/checkout`, do not change pricing rules, run `npm test -- checkout`, and explain any payment-flow files touched."

The contract needs five parts:

1. The user-visible behavior or developer outcome.
2. The allowed file area or module boundary.
3. The non-goals the agent should not touch.
4. The validation command or manual check.
5. The handoff format the reviewer expects.

For local work, store the contract in the prompt and keep the working tree clean. For cloud work, put it in the issue or pull request description because the reviewer may never see the original chat. For self-hosted systems, encode the default version in platform policy and let task-specific instructions narrow it.

This is where [local AI coding agents](./local-ai-coding-agents), [cloud coding agents](./cloud-coding-agents), and [self-hosted AI coding agents](./self-hosted-ai-coding-agents) differ. Local agents give you a tight feedback loop. Cloud agents give you a branch or pull request. Self-hosted agents give you policy control. The review contract should match the lane.

## Review the Diff Before the Explanation

Agent summaries are useful, but the diff is the artifact. Read the changed files before trusting the explanation. A confident handoff can omit the riskiest line simply because the model did not recognize it as risky.

Start with the file list:

| Diff signal | What it usually means | Review action |
|---|---|---|
| One or two expected files | Healthy narrow task | Review normally |
| Config or dependency changes | Scope expanded | Ask why the change was necessary |
| Auth, billing, or data-access files | Higher blast radius | Require deeper review |
| Generated files or lockfiles | Tooling side effect | Confirm they belong in Git |
| Deleted tests | Regression risk | Treat as suspicious until justified |
| Large unrelated formatting churn | Review noise | Request a smaller diff |

Then read for behavioral intent. Look for places where the code now accepts broader input, skips validation, catches errors without surfacing them, changes default values, or moves logic across client/server boundaries. These changes may not fail tests immediately, but they change the product.

Do not review only the happy path. AI-written code often mirrors the example in the prompt and misses the edge that caused the bug in production. Check empty input, permission denial, slow network, duplicate submission, missing environment variables, and stale cached data.

## Run the Checks That Match the Risk

The review workflow should not run every command for every change. Match validation to blast radius.

| Change type | Minimum check | Stronger check |
|---|---|---|
| Copy or docs | Link check or content validation | Build if routing changed |
| UI component | Lint, typecheck, screenshot or manual preview | Interaction test |
| API route | Unit/integration test | Auth and rate-limit test |
| Database query | Test with empty and populated data | Migration rehearsal |
| Auth or billing | Existing suite plus manual path check | Dedicated reviewer |
| Dependency update | Install, lockfile review, test suite | Sandbox run |

Use deterministic tools first. Linters, type checkers, test runners, schema validators, and build commands catch exact failures faster than a model can reason about them. AI review is additive. It is strongest at "what seems inconsistent?" and weakest when asked to replace executable checks.

For web apps, pair code checks with at least one behavior check. If the change touches a page, open the page. If it touches a form, submit the form. If it touches a background job, inspect the job trigger and failure path. A passing typecheck only proves the code can compile.

This is also where repo instructions pay for themselves. Put canonical commands in `AGENTS.md`, `CLAUDE.md`, or project documentation so each agent knows which check proves which class of work. See [Designing Agent Instructions](./designing-agent-instructions) for the broader pattern.

## Add a Security Pass for Agent-Written Code

Every meaningful agent diff gets a short security pass. Most changes do not need a formal security review, but they do need someone to ask whether the agent accidentally widened access.

Check these areas:

| Area | What to inspect |
|---|---|
| Secrets | New env vars, logs, error messages, client-side exposure |
| Authorization | Server checks, role checks, tenant boundaries, ownership filters |
| Input handling | Validation, escaping, upload limits, prompt-injection surfaces |
| Data writes | Idempotency, duplicate actions, destructive operations |
| Network calls | New domains, webhooks, internal service access |
| Dependencies | New packages, package scripts, license and maintenance posture |

This pass matters even for local agents. A local harness may run beside your repository, but prompts, stack traces, selected files, and command output can still move through a model provider. Treat broad logs and config dumps as data movement, not harmless debugging.

For a fuller pre-run boundary, use the [AI coding agent security checklist](./ai-coding-agent-security-checklist). The review workflow here assumes the agent already had a reasonable task boundary. If it did not, stop and shrink the task before reviewing a sprawling diff.

## Decide What to Do With Partial Success

Agent output is often useful but not mergeable. Do not collapse review into yes/no. Use four outcomes.

| Outcome | Use when | Next action |
|---|---|---|
| Merge | The diff matches intent, passes checks, and risk is understood | Merge or queue release |
| Amend | The core approach is right but needs small fixes | Human or agent applies targeted edits |
| Request changes | The agent missed intent or expanded scope | Return with concrete failures |
| Discard | The diff is noisy, unsafe, or built on the wrong approach | Close without salvaging |

Partial success is where teams lose time. If a diff needs three rounds of broad correction, discard it and restate the task. Agents are cheap compared with reviewer attention. A messy patch that takes an hour to rehabilitate is usually more expensive than a clean rerun with sharper constraints.

When you request changes, name the evidence. "Try again" is weak. "Keep the query in `server/orders.ts`, preserve tenant filtering, add a duplicate-submit test, and do not touch `package-lock.json`" is reviewable.

## Keep the Handoff Boring

The best AI code review workflow ends with a plain engineering handoff. It should not require replaying the chat transcript.

Require this handoff for any agent-created branch or pull request:

- What changed, in one paragraph.
- Why the approach matches the issue.
- Validation commands run, with pass/fail status.
- Files that need special reviewer attention.
- Any dependency, config, migration, auth, billing, or data-access changes.
- Anything not done.

For teams, turn that handoff into a pull-request template. For solo founders, keep the same structure in the final agent message before you commit. The habit matters because agent work moves quickly enough that memory becomes unreliable.

Use a second AI reviewer only after the deterministic checks pass. An AI reviewer can compare the diff against the task, scan for missing edge cases, and flag surprising changes. It should not be asked to bless code that has not compiled, tested, or rendered.

## A Practical Review Sequence

Use this sequence as the default review loop:

1. Re-read the task and acceptance criteria.
2. Scan the file list before reading the agent summary.
3. Reject obvious scope creep before detailed review.
4. Run the minimum validation command for the change type.
5. Inspect changed logic against the user-visible behavior.
6. Check auth, data access, secrets, dependencies, and logs.
7. Preview or reproduce behavior when the change touches runtime behavior.
8. Decide merge, amend, request changes, or discard.
9. Record the final evidence in the pull request or issue.

This sequence works because it separates proof from narration. You are not trying to decide whether the agent sounded competent. You are deciding whether the repository is better after the diff.

## See Also

- [AI Code Review Tools](./ai-code-review-tools) - compare hosted, open-source, and platform-native AI PR reviewers.
- [AI Coding Agent Security Checklist](./ai-coding-agent-security-checklist) - scope repo access, secrets, sandboxes, approvals, and logs before agent work starts.
- [Local vs Cloud AI Coding Agents](./local-vs-cloud-ai-coding-agents) - choose the execution lane that fits privacy, throughput, and review control.
- [Git Worktrees for AI Coding Agents](./git-worktrees-ai-coding-agents) - isolate local agent diffs before they reach pull-request review.
- [Testing Frameworks](/devops-and-tools/testing-frameworks) - choose the deterministic checks that make agent output easier to trust.
