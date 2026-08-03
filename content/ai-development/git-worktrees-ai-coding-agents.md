---
title: "Git Worktrees for AI Coding Agents"
description: "Use Git worktrees for AI coding agents when one repo needs parallel local sessions, clean diffs, and safer review without cloud sandboxes."
---

# Git Worktrees for AI Coding Agents

Git worktrees give local AI coding agents separate directories for separate branches, so one repository can support multiple agent sessions without one dirty working tree. Use worktrees when you want cloud-agent style parallelism but still need local control, local credentials, and reviewable Git history.

## What a Git Worktree Is

A Git worktree is an additional checkout attached to the same repository history. Instead of cloning the repo five times, you keep one shared Git object database and create separate working directories for separate branches. Git documents this under [`git worktree`](https://git-scm.com/docs/git-worktree): each linked worktree has its own checked-out files, branch, index, and local edit state.

For AI coding agents, that distinction matters because most local agents assume the current directory is theirs. A [CLI AI coding agent](./cli-ai-coding-agents) reads files, edits code, runs commands, and inspects failures inside one working tree. If you start three agents in that same directory, they compete over files, generated artifacts, dev servers, package caches, and Git status.

A worktree turns "one repo, one session" into "one repo, several isolated sessions." The sessions still share the same remote, commit history, and repository identity, but their file changes do not collide until you merge or rebase.

It is not a full sandbox. A worktree does not isolate environment variables, processes, databases, network access, package installs outside the project directory, or running ports. It isolates Git working directories. That is enough for many supervised agent tasks, but it is not the same as a [code execution sandbox](/ai-development/code-execution-sandbox-providers) or a self-hosted agent platform.

## When Worktrees Beat One Local Checkout

Worktrees are useful when the bottleneck is branch and diff isolation, not compute isolation.

| Situation | Use worktrees? | Why |
|---|---|---|
| One agent fixes a bug while another writes tests | Yes | Each task gets a separate branch and diff |
| You want to compare two refactor approaches | Yes | Keep both implementations available at once |
| You need one dev server per agent | Maybe | It works only if ports and local services are separated |
| You need untrusted code execution | No | Use a sandbox or cloud agent instead |
| You need five agents running long test suites | Maybe | Worktrees help Git state, but local CPU and ports still bottleneck |
| You need private repo work without SaaS execution | Yes | Keep shell access local while separating task state |

The best use case is narrow parallelism: two or three local agents working on different branches while you review each output. That gives you more throughput than one local checkout without jumping all the way to [cloud coding agents](./cloud-coding-agents).

Worktrees also help with human review. If an agent makes a messy change, you can leave that worktree alone, open the main checkout, inspect the branch, and decide whether to keep, amend, or delete it. You are not forced to clean your primary workspace before doing anything else.

## How the Agent Workflow Changes

With a single checkout, the workflow usually looks like this:

1. Make sure the repo is clean.
2. Start an agent in the repo.
3. Let it edit files.
4. Review the diff.
5. Commit, revert, or keep iterating.

With worktrees, you add a lightweight routing layer before the agent starts:

```bash
git fetch origin
git worktree add ../my-app-agent-seo -b agent/seo-page origin/main
cd ../my-app-agent-seo
```

Now the agent works in `../my-app-agent-seo`, not your primary checkout. If it writes a new page, changes dependencies, or runs validation, its Git state stays in that directory. Your primary checkout remains clean.

A practical naming pattern is:

| Worktree name | Branch name | Best for |
|---|---|---|
| `../app-agent-bug-login` | `agent/bug-login` | Scoped bug fix |
| `../app-agent-pricing-copy` | `agent/pricing-copy` | Marketing or content edit |
| `../app-agent-refactor-api` | `agent/refactor-api` | Riskier code movement |
| `../app-spike-auth-v2` | `spike/auth-v2` | Disposable experiment |

Use names that encode the task, not the tool. You may switch from Claude Code to Codex CLI to Aider in the same directory. The worktree belongs to the branch and task.

## What Worktrees Do Not Protect

Worktrees create Git isolation, not security isolation. Treat that boundary honestly.

They do not protect secrets. If the agent can read your shell environment, `.env` files, logs, or local credentials, a separate worktree does not change that. Pair worktrees with the same rules you use for [local AI coding agents](./local-ai-coding-agents): keep secrets out of prompt context, use narrow credentials, and avoid commands that print private values.

They do not protect shared local services. If two worktrees both run `npm run dev` on port 3000, one fails. If both connect to the same local database, they can still interfere through migrations, seed data, background jobs, or queues. Each agent may have separate files but shared runtime dependencies.

They do not protect package caches. Many tools write to global caches under your home directory. A broken package install, malicious postinstall script, or global tool update can affect the machine outside the worktree. Use containerized development environments when that risk matters.

They do not solve branch conflict. Worktrees make parallel work possible; they do not make parallel edits compatible. If two agents touch the same migration, schema file, route, or shared component, you still need a human merge decision.

## Worktrees vs Cloud Agents vs Self-Hosted Agents

Worktrees are one lane in the broader [AI coding agent taxonomy](./ai-coding-agent-taxonomy). They are not a replacement for every parallel execution model.

| Model | What isolates work | Best fit | Main trade-off |
|---|---|---|---|
| Single local checkout | Human discipline | One supervised task | No real parallelism |
| Git worktrees | Separate directories and branches | Local parallel review | Shared machine, ports, and secrets |
| Cloud coding agents | Vendor-managed sandboxes | Async PRs and disposable environments | Vendor controls runtime and logs |
| Self-hosted agents | Your controlled workspaces | Sensitive parallel delegation | You operate the platform |

Use worktrees when local context is valuable. That includes private package access, local-only APIs, hardware-specific tests, Tailscale-only services, or a repo setup that would be annoying to recreate in a vendor sandbox.

Use cloud agents when isolation and scale matter more than local context. If the task is independent, the setup is documented, and you want background pull requests, a cloud agent is usually cleaner than running several local sessions on one machine.

Use [self-hosted AI coding agents](./self-hosted-ai-coding-agents) when worktrees become operational infrastructure. Once you need task queues, policy, workspace cleanup, secret scoping, logs, and team-level review rules, a folder naming convention is no longer enough.

## Operating Rules for Agent Worktrees

Keep the primary checkout boring. Your main repo directory should be the clean reference state where you pull, inspect, and recover. Do not use it as an agent scratchpad if you are running multiple sessions.

Create one branch per task. Do not run unrelated agents on the same branch just because worktrees make it easy. The unit of review is still the branch or patch.

Give each worktree its own ports. If the app defaults to port 3000, assign ports deliberately: 3001 for one worktree, 3002 for another, and so on. Store that in the task brief or command line, not in committed config unless the repo already supports it.

Run validation inside the worktree that changed. If the agent edited `../app-agent-pricing-copy`, run lint, tests, and build from that directory. Validation from the primary checkout proves the wrong state.

Delete worktrees aggressively. A stale worktree looks like an active task and hides old branches. After merge or rejection:

```bash
git worktree remove ../my-app-agent-seo
git branch -d agent/seo-page
```

Use `git branch -D` only when you intentionally discard unmerged work. If the branch has useful commits, merge it, cherry-pick it, or keep it visible.

## When to Avoid Worktrees

Avoid worktrees when the agent needs a stronger boundary than Git can provide.

If a task runs unknown code, installs untrusted dependencies, touches production-like credentials, or executes browser automation against private systems, use a sandboxed environment. A worktree will not save your laptop from a bad shell command.

Avoid worktrees when the repo is not branch-friendly. Some projects depend on generated files, local SQLite databases, checked-in build outputs, or global config in ways that make separate directories brittle. Fix the project hygiene first, then add agent parallelism.

Avoid worktrees when you cannot review the output. Parallel agents can create more diffs than you can inspect. The right ceiling is not how many worktrees Git supports. It is how many changes you can validate without losing track of product intent.

Worktrees are a practical bridge: more parallel than one local checkout, more controlled than sending everything to a vendor sandbox, and lighter than operating your own agent platform. Use them for reviewable local parallelism. Reach for cloud or self-hosted workspaces when the runtime boundary matters more than the Git boundary.

## See Also

- [Local AI Coding Agents](./local-ai-coding-agents) - where worktrees fit inside supervised local development.
- [CLI AI Coding Agents](./cli-ai-coding-agents) - the terminal-first tools most likely to use worktrees directly.
- [Cloud Coding Agents](./cloud-coding-agents) - when vendor-managed sandboxes are cleaner than local folders.
- [Self-Hosted AI Coding Agents](./self-hosted-ai-coding-agents) - when local worktree conventions need to become team infrastructure.
- [Should You Commit AGENTS.md?](/devops-and-tools/should-you-commit-agents-md) - how to store repository instructions that agents can read across worktrees.
