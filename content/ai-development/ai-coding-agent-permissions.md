---
title: "AI Coding Agent Permissions"
description: "AI coding agent permissions decide which files, commands, tools, and networks an agent can use before you grant broader autonomy."
---

# AI Coding Agent Permissions

AI coding agent permissions are the rules that decide what an agent can do before it has to stop, ask, or fail closed. Start with a supervised, workspace-scoped mode; expand autonomy only after the task, repo, secrets, network, and review path are narrow enough to make the extra speed worth the risk.

## What Permissions Control

Permissions sit between your prompt and the agent's tools. They do not make the model smarter, and they do not prove that the agent understood your intent. They decide whether a proposed action is allowed, blocked, or routed through a review prompt.

For a coding agent, the permission surface usually covers five things:

| Surface | Typical action | Risk if over-broad |
|---|---|---|
| File reads | Inspect source, configs, logs | Sensitive files become model context |
| File writes | Edit source, create files, update docs | Agent changes unrelated code or generated state |
| Shell commands | Run tests, install packages, call CLIs | Package scripts, deletes, deploys, or data mutations run too freely |
| Network access | Fetch docs, call APIs, install packages | Secrets or private data leave the intended boundary |
| External tools | GitHub, MCP servers, browsers, cloud APIs | The agent acts outside the repo before you review the plan |

The practical question is not "do you trust AI?" It is "what can this agent touch if it is wrong for five minutes?" A low-risk docs cleanup and a billing migration should not run under the same permission profile.

This is why [AI coding agent security](./ai-coding-agent-security-checklist) starts with scoping. Permissions are one layer in that workflow, beside repo access, secrets, sandboxing, logs, and human review.

## Permission Models Compared

Most modern coding agents expose the same basic pattern even when the labels differ: manual approval, auto-approval for low-risk actions, deny-by-default mode, and full bypass mode.

| Permission model | What it means | Use it for | Avoid it when |
|---|---|---|---|
| Read-only or plan mode | Agent can inspect, search, and reason before editing | Codebase exploration, audits, scoping a risky change | You need a full implementation in one run |
| Manual approval | Agent asks before writes, commands, web fetches, or sensitive tools | First run in a repo, production-adjacent code, unfamiliar tasks | You are doing many tiny known-safe edits |
| Auto-approve eligible actions | Routine edits and safe-looking commands continue without you | Trusted repo, narrow task, clean worktree, short validation loop | The task can mutate data, deploy, delete, or touch secrets |
| Deny-by-default | Anything not pre-approved is rejected | Locked-down enterprise workflows, restricted MCP/tool access | You have not built the allowlist yet |
| Full bypass | Agent skips most prompts and acts freely | Disposable sandbox with no valuable credentials | Your laptop, production repo, real cloud account, or unclear task |

[OpenAI's Codex sandboxing docs](https://learn.chatgpt.com/codex/sandboxing) describe sandbox modes and approval policies as separate settings: the sandbox defines the technical boundary, while approvals decide when the agent must pause before crossing it. [Anthropic's Claude Code permissions docs](https://code.claude.com/docs/en/permissions) use allow, ask, and deny rules plus named permission modes. [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) takes a different shape: the agent works in a GitHub Actions-powered ephemeral environment and returns branch or pull-request work for review.

Those product details change. The decision shape does not. Choose the least autonomous mode that can finish the work without turning every useful command into a meeting.

## Separate Permissions From Sandboxes

Permissions and sandboxes are often confused because both make agents feel safer. They solve different problems.

A permission rule is an intent gate. It asks: should this action run at all? A sandbox is a containment boundary. It asks: if this action runs, what can it reach?

You need both. A manual approval prompt can still approve the wrong command under pressure. A filesystem sandbox can still expose sensitive files inside the allowed workspace. A network block can still allow abuse of a permitted domain. A disposable workspace can still produce unsafe code that a human later merges.

Use this split:

| Control | Primary job | Failure mode |
|---|---|---|
| Approval prompt | Slow down risky intent | Human approves too casually |
| Allow rule | Remove friction for known-safe actions | Rule pattern is broader than intended |
| Deny rule | Block known-dangerous actions | Equivalent action uses another path |
| Filesystem sandbox | Contain reads and writes | Sensitive files are inside the boundary |
| Network policy | Contain external calls | Allowed hosts are still powerful |
| Worktree or branch | Isolate Git state | Runtime side effects still leak |
| Disposable VM/container | Isolate execution | Mounted credentials still matter |

A [local AI coding agent](./local-ai-coding-agents) can use manual prompts and still run on your real machine. A [cloud coding agent](./cloud-coding-agents) can run in an isolated workspace and still need repository and network controls. A [self-hosted AI coding agent](./self-hosted-ai-coding-agents) gives you more policy ownership, but it does not remove the need for explicit approvals.

## Set Defaults by Task Risk

Pick the default permission mode from the work, not from the tool's marketing page.

| Task | Recommended default | Why |
|---|---|---|
| Read a repo and explain architecture | Read-only or plan mode | Exploration should not mutate files |
| Update docs, examples, or comments | Manual approval or workspace auto-edits | Low risk, but still review the diff |
| Fix a small bug with tests | Workspace-scoped writes plus approval for shell/network escalation | The agent needs edit-test loops, not broad system access |
| Install or upgrade dependencies | Sandbox or cloud workspace with manual approval | Install scripts can execute code |
| Change auth, billing, permissions, or migrations | Manual approval, no production secrets, human review before merge | Business logic and data integrity are in scope |
| Run browser automation against a logged-in app | Dedicated profile or disposable environment | Browser state often contains private access |
| Deploy, push, email, bill, or mutate cloud resources | Explicit approval every time | The side effect leaves the repo |

The first run in any repo should be more conservative than the tenth. After you know the codebase, validation commands, and agent behavior, widen the boring path: allow `npm test`, allow the project's linter, allow safe file writes inside the workspace. Keep deploys, deletes, secret reads, and external mutations behind a prompt.

For parallel local work, pair permissions with [Git worktrees for AI coding agents](./git-worktrees-ai-coding-agents). A worktree will not sandbox the process, but it prevents one agent's file edits from mixing with another task's diff.

## What to Allow, Ask, and Deny

Good permission profiles are short. If a rule set needs a page of explanation, the agent will eventually find a path around your mental model.

Allow commands that are deterministic, local, and routine:

- `npm run lint`, `npm test`, `pnpm typecheck`, or the exact validation scripts your repo documents.
- Read-only Git inspection such as `git status`, `git diff`, and `git log`.
- File edits inside the active workspace for low-risk tasks.
- Fetches to official documentation domains when research is part of the task.

Ask before actions with meaningful side effects:

- Package installs and dependency upgrades.
- Database migrations, seed scripts, and data imports.
- Shell commands that touch `.git`, generated artifacts, caches, or deployment config.
- Network calls to live APIs.
- MCP tools that create issues, send messages, open pull requests, or change account state.

Deny actions that should not happen in an agent run:

- Reading `.env`, keychain exports, credential stores, or production secret files.
- `git push`, direct merges, force pushes, and deployment commands unless the task explicitly asks for them.
- Broad environment dumps, process listings with secrets, and commands that print full config.
- Destructive file operations outside the workspace.
- Cloud CLI calls against production accounts unless the workflow has a named approval gate.

Natural-language instructions are useful, but they are not enforcement. A line in `AGENTS.md` saying "do not deploy" helps the model behave. A deny rule, missing credential, protected branch, or deployment approval stops the action when the model behaves badly.

## Team Governance

Solo founders can keep permission choices informal for a while. Teams cannot. Once more than one person or agent works in the same repositories, permission policy becomes part of engineering operations.

At minimum, store these decisions somewhere the agent and reviewers both see:

| Decision | Durable place |
|---|---|
| Approved validation commands | `AGENTS.md`, `CLAUDE.md`, or repository docs |
| Commands that require approval | Agent config, managed settings, or repo policy |
| Files agents must not read | Deny rules plus secret hygiene |
| Network destinations agents can reach | Sandbox/network allowlist |
| Who reviews expanded permissions | Issue workflow or code-review policy |
| What must appear in the handoff | PR template, task checklist, or control plane |

Managed settings matter when individual convenience would otherwise override team policy. If a developer can switch every session into full bypass mode on a production repository, the team's permission story is theater. Use organization-level controls where the tool supports them, and use repository-level rules for the parts that travel with the codebase.

The review loop should capture permission changes explicitly. A good agent handoff says which commands ran, which commands failed, what external systems were touched, and whether any permission was expanded during the run. That turns permissions from hidden UI prompts into reviewable operational evidence.

## Common Failure Modes

Permission systems usually fail in boring ways.

**The allowlist grows until it means full access.** Every prompt feels annoying in the moment, so the developer keeps saving "do not ask again" rules. A month later, the agent can run package managers, cloud CLIs, Git operations, and web fetches without review. Prune rules the same way you prune stale CI secrets.

**Command patterns are treated as security boundaries.** A rule that blocks `rm *` may not block every way to remove files. A rule that allows `npm run *` may allow scripts you did not inspect. Pattern rules are convenience controls. Use sandboxes, credentials, branch protections, and network policy when enforcement matters.

**Secrets live inside the trusted workspace.** A workspace-scoped file sandbox does not help if `.env.production`, database dumps, and customer exports are sitting in that workspace. Fix secret placement before widening agent autonomy.

**Auto mode is used as a substitute for scoping.** Automatic approval can reduce friction on a known-safe task. It should not rescue an oversized task brief, a dirty worktree, or a repo with production credentials mounted.

**Review happens only at the end.** If the agent had broad write and network access for an hour, a clean final diff is not the full story. Logs, side effects, tool calls, and denied attempts are part of the review evidence.

The most useful default is still simple: narrow workspace, no production secrets, network off unless needed, explicit approval for side effects, and a reviewable diff before merge.

## See Also

- [AI Coding Agent Security Checklist](./ai-coding-agent-security-checklist) - the broader pre-run security checklist around permissions, secrets, sandboxing, logs, and review.
- [Local vs Cloud AI Coding Agents](./local-vs-cloud-ai-coding-agents) - how execution location changes the permission and sandbox decision.
- [Self-Hosted AI Coding Agents](./self-hosted-ai-coding-agents) - when team policy and private runtime control justify operating the agent workspace yourself.
- [Code Execution Sandbox Providers](./code-execution-sandbox-providers) - the runtime containment layer underneath risky agent work.
- [Git Worktrees for AI Coding Agents](./git-worktrees-ai-coding-agents) - a lightweight way to isolate local file edits across parallel agent sessions.
- [Should You Commit AGENTS.md?](/devops-and-tools/should-you-commit-agents-md) - how to keep durable agent instructions visible in the repository.
