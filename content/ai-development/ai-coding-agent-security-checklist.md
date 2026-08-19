---
title: "AI Coding Agent Security Checklist"
description: "Use this AI coding agent security checklist to scope repo access, secrets, sandboxes, approvals, logs, and review before agents touch code."
---

# AI Coding Agent Security Checklist

AI coding agent security is not one setting. It is a workflow: which repository the agent can read, which commands it can run, which secrets it can see, where execution happens, what gets logged, and who reviews the output before merge.

Use this checklist before you let Claude Code, Codex, Cursor, Copilot, OpenHands, Cline, Aider, Devin, Jules, or any other coding agent touch an important repository. The names change quickly. The security questions do not.

## The Short Version

The safe default is narrow repo access, no production secrets, sandboxed execution for risky commands, explicit approvals for sensitive actions, and human review before merge.

| Check | Safe default | Higher-risk default |
|---|---|---|
| Repository access | One repo or one worktree | Broad org-wide access |
| Filesystem access | Project directory only | Home directory or multiple repos |
| Secrets | Staging, read-only, short-lived | Production, write-capable, long-lived |
| Network | Deny by default or allowlist | Open internet plus internal services |
| Commands | Approval for installs, migrations, deletes | Unattended shell autonomy |
| Logs | Redacted and task-scoped | Full command output with sensitive values |
| Review | Diff, tests, and reviewer before merge | Agent can merge or deploy directly |

If you cannot answer one row, pause before expanding the agent's permissions.

## 1. Classify the Work Before Picking the Agent

Start with the task's blast radius.

A typo fix in docs can run in almost any coding assistant. An auth migration, billing change, customer-data workflow, infrastructure script, or database migration needs a stricter setup. The right agent is the one whose operating boundary matches the risk of the work.

Use this routing rule:

| Task type | Preferred lane | Why |
|---|---|---|
| Docs, tests, small UI fixes | Local, IDE, or cloud agent | Low data risk and easy review |
| Auth, billing, permissions | Local or self-hosted agent | Review control and credential scope matter |
| Dependency upgrades | Sandbox, cloud agent, or disposable worktree | Package scripts can execute arbitrary code |
| Internal network debugging | Self-hosted or controlled local agent | The network boundary matters |
| Parallel backlog chores | Cloud or self-hosted agent | Separate workspaces reduce cross-task state |
| Agent product development | Sandbox infrastructure | You need a runtime boundary under user code |

This is why VibeReference separates [local AI coding agents](./local-ai-coding-agents), [cloud coding agents](./cloud-coding-agents), and [self-hosted AI coding agents](./self-hosted-ai-coding-agents). The security decision starts with where the agent loop runs.

## 2. Scope Repository Access

Do not give a coding agent access to every repository because it might need context. Give it the smallest repository, branch, folder, or worktree that can complete the task.

For local agents, start in a clean working tree. Commit or stash unrelated work, then let the agent make a narrow diff. If you need parallel local sessions, use [Git worktrees for AI coding agents](./git-worktrees-ai-coding-agents) so each task has its own directory and branch.

For cloud agents, connect only the repos needed for the task category. A vendor-managed workspace may be ephemeral, but repo authorization can still be broad. Review whether the product can read private repositories by default, create branches, open pull requests, or access org-level metadata.

For self-hosted agents, define repo policy in the platform layer. The important controls are which repos can be cloned, which branches can be targeted, whether forks are allowed, and how output gets back into Git. A self-hosted platform without repo policy is just a powerful shell with a nicer UI.

## 3. Keep Secrets Out of the Agent's Reach

The most common security mistake is assuming "local" means "private." A local coding agent may run commands on your machine, but the model provider can still receive prompts, selected files, stack traces, logs, diffs, and command output. A cloud agent may run in a sandbox, but it can still read whatever credentials you mount into that sandbox.

Use these rules:

| Secret type | Agent default |
|---|---|
| Production API keys | Do not mount |
| Database write credentials | Avoid unless the task is explicitly about database writes |
| Staging credentials | Prefer scoped, revocable, task-specific values |
| Read-only tokens | Acceptable for tasks that need live API inspection |
| Environment variable names | OK to document without values |
| Secret values in logs | Treat as exposure and rotate |

Store setup expectations in repo instructions, but never store secret values there. A good instruction says `STRIPE_SECRET_KEY must be set in the deployment environment`. A bad instruction pastes the key.

Pair agent work with the same repo hygiene covered in [Should You Commit Your .env File to Git?](/devops-and-tools/should-you-commit-env-file) and [AI Coding Tool Configs Git Guide](/devops-and-tools/ai-coding-tool-configs-git-guide).

## 4. Separate Permissions From Sandboxing

Permissions and sandboxing solve different problems.

Permissions decide when the agent must ask before an action. Sandboxing decides what the command can reach even if the action runs. OpenAI's Codex sandboxing docs make this distinction explicit: approvals govern pauses, while the sandbox governs file and network access. Claude Code's permission docs describe fine-grained rules and managed policies for controlling what the tool can do. GitHub documents Copilot's cloud agent as running in an ephemeral, firewalled environment, with separate controls for internet access.

You need both layers.

| Control | What it prevents | What it does not prevent |
|---|---|---|
| Approval prompts | Surprise commands and edits | Bad approvals under pressure |
| Filesystem sandbox | Writes outside the project | Sensitive data already inside the project |
| Network firewall | Unwanted external calls | Abuse of allowed domains |
| Disposable workspace | Persistent compromise | Bad code merged after review |
| Human review | Unwanted product behavior | Secret exposure in earlier logs |

The practical rule: use approvals for intent and sandboxing for containment. Do not treat either as enough by itself.

## 5. Control Network Access

Network access is where coding agents cross from code editing into systems access.

For local agents, the agent inherits the network available to your machine unless the harness restricts it. That can include private package registries, local databases, VPN resources, Tailscale services, staging dashboards, and internal APIs. Do not run broad autonomous commands in that environment unless the task really needs it.

For cloud agents, inspect the vendor's network model. Can the workspace reach the public internet? Can it reach private networks? Does it support a firewall, domain allowlist, or disabled internet mode? GitHub's Copilot coding agent firewall docs are a good example of the kind of control surface to look for.

For self-hosted agents, build network policy before scaling usage. Allow package registries and task-required APIs. Deny metadata services, production databases, admin consoles, and broad internal subnets unless the task explicitly needs them.

## 6. Treat Package Scripts as Code Execution

An agent that runs `npm install`, `pnpm install`, `pip install`, `bundle install`, or a project test suite may execute package scripts. That is fine in a trusted repo with known dependencies. It is not fine in a random repo, fork, user-submitted project, or dependency-upgrade branch without isolation.

Use a disposable workspace when:

- The repo is unfamiliar.
- The task upgrades dependencies.
- The agent will run generated code.
- The project has install scripts you have not reviewed.
- The command needs browser automation against private systems.
- The task starts servers that bind ports or call webhooks.

For higher-risk runs, compare [code execution sandbox providers](./code-execution-sandbox-providers). A worktree isolates Git state. A sandbox isolates process and filesystem state. They are not the same control.

## 7. Require a Reviewable Handoff

The output should be boring to review.

At minimum, every agent task should produce:

- A clear diff.
- A short summary of what changed.
- The validation commands that ran.
- Any commands that failed.
- Any permissions that were expanded.
- Any secrets or live systems the task touched.

Cloud agents often return a branch or pull request. Local agents can leave the diff in your working tree. Self-hosted platforms should standardize the handoff format so reviewers are not reverse-engineering each run.

Do not let an agent merge directly into the main branch until the team has proved that the review loop is reliable. The first production-quality goal is not "agent ships alone." It is "agent makes review faster without hiding risk."

## 8. Redact Logs and Command Output

Logs become model context, vendor telemetry, issue comments, pull-request summaries, and debugging artifacts. Treat them as data movement.

Avoid commands that dump broad environment state, print complete config files, or show raw customer records. If a command may print sensitive values, run a narrower command or redact before handing output back to the agent. If a secret value appears in an agent transcript, rotate it. Do not debate whether it was "really used."

For team workflows, decide log retention before the first incident. Who can read agent transcripts? Are logs stored by the vendor? Are they included in issue comments? Can admins export them? Cursor's privacy docs, Claude Code's security docs, Codex's sandboxing docs, and GitHub Copilot's responsible-use docs all expose different parts of this governance story. Read the docs for the exact product you deploy, not just the model family behind it.

## 9. Write Repository-Level Agent Instructions

Good instructions reduce risky improvisation.

Store durable guidance in `AGENTS.md`, `CLAUDE.md`, tool config, or another file your team actually maintains. Include:

- Approved validation commands.
- Commands the agent must not run.
- Sensitive directories and files.
- Expected branch naming.
- Test data rules.
- Deployment boundaries.
- Required review notes.
- Environment variable names without values.

Keep the file short enough that the agent will use it. A giant policy document is less useful than a page of commands and boundaries. For the broader pattern, see [Designing Agent Instructions](./designing-agent-instructions).

## 10. Decide When to Move From Local to Cloud to Self-Hosted

Most teams should not start with a custom self-hosted platform. Start with the narrowest lane that solves the current risk.

| You need | Use |
|---|---|
| Supervised code edits with tight review | Local or IDE agent |
| Background PRs on low-risk work | Cloud coding agent |
| Parallel tasks with private runtime policy | Self-hosted coding agent |
| User-submitted code execution | Dedicated sandbox provider |
| Enterprise policy across many repos | Managed enterprise controls or self-hosted platform |

The upgrade trigger is specific pain. "We want privacy" is vague. "Agents need private package access, per-task staging credentials, network allowlists, isolated browser sessions, and audit logs inside our cloud account" is specific enough to justify self-hosting or a controlled sandbox layer.

## A Practical Pre-Run Checklist

Use this before starting any important agent task.

| Question | Pass condition |
|---|---|
| Is the repo state clean? | Unrelated changes are committed, stashed, or isolated |
| Is the task scoped? | The agent has a concrete deliverable and acceptance checks |
| Are secrets scoped? | No production secrets are mounted by default |
| Is execution contained? | Local, cloud, self-hosted, or sandboxed lane matches task risk |
| Are approvals configured? | Sensitive commands require human confirmation |
| Is network access intentional? | Required domains are allowed; broad access is avoided |
| Are validation commands known? | Lint, test, typecheck, build, or preview commands are documented |
| Is the handoff reviewable? | Diff, summary, validation, and risk notes will be available |

If the answer is "not sure," do not expand the permissions. Narrow the task, change the execution lane, or ask a human reviewer to define the boundary.

## See Also

- [AI Coding Agent Taxonomy](./ai-coding-agent-taxonomy) - the workflow map behind local, IDE, cloud, self-hosted, and app-builder agents.
- [Local vs Cloud AI Coding Agents](./local-vs-cloud-ai-coding-agents) - when privacy and review control beat async throughput.
- [Self-Hosted AI Coding Agents](./self-hosted-ai-coding-agents) - when team governance justifies operating the agent workspace yourself.
- [Code Execution Sandbox Providers](./code-execution-sandbox-providers) - runtime isolation options for agent code execution.
- [Git Worktrees for AI Coding Agents](./git-worktrees-ai-coding-agents) - a lightweight way to isolate local Git state across parallel agent sessions.
