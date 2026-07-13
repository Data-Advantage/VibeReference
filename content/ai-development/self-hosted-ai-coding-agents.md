---
title: "Self-Hosted AI Coding Agents"
description: "Self-hosted AI coding agents give you cloud-agent control on your own infrastructure. Use them when SaaS agents are too opaque."
---

# Self-Hosted AI Coding Agents

Self-hosted AI coding agents sit between local terminal tools and vendor-managed cloud agents. Choose this lane when you want cloud-like delegation, persistent workspaces, and team governance, but you cannot give every repository, credential, or execution trace to a third-party coding-agent SaaS.

## What Self-Hosted Means

A self-hosted coding agent is not just a local CLI running on your laptop. It is a controlled agent workspace you operate: a browser or API surface, one or more sandboxed development environments, model routing, repository access, logs, secrets handling, and a review path back into Git.

That puts it in the middle of the AI coding workflow taxonomy:

| Workflow | Where work runs | Best fit | Main constraint |
|---|---|---|---|
| [Local AI coding agent](./local-ai-coding-agents) | Your laptop or workstation | Supervised edits, private local setup | Limited parallelism |
| Self-hosted AI coding agent | Your VM, cluster, or private cloud | Controlled delegation with team governance | You operate the platform |
| [Cloud coding agent](./cloud-coding-agents) | Vendor-managed sandbox | Async PRs and easy scale | Vendor controls the runtime |
| [AI app builder](./ai-app-builders) | Vendor app workspace | Fast prototypes and non-engineer builders | Less control over the stack |

The important distinction is ownership of the execution environment. With a cloud agent, the vendor gives you the workspace. With a local agent, your machine is the workspace. With a self-hosted agent, you create a repeatable workspace layer that agents can use without turning your daily laptop into production infrastructure.

## When Self-Hosting Is the Right Lane

Self-hosting makes sense when control is worth operational overhead. If you are a solo founder working on a simple marketing site, it is usually too much. If you are building a regulated SaaS, an internal platform, or an agent company that needs repeatable execution, it can become the most practical architecture.

Use self-hosted agents when repository access is sensitive. A vendor cloud agent may be fine for public websites and low-risk bugs. It is a harder sell for infrastructure code, customer-specific data access, unreleased product strategy, or repositories with broad production permissions. Self-hosting lets you keep the shell, filesystem, package installs, and logs inside an environment you control.

Use them when local execution has become the bottleneck. One laptop works for one supervised session. It breaks down when you want multiple agents working on separate branches, long-running test suites, browser automation, or issue queues. A self-hosted setup can create separate sandboxes without sending the entire workflow to a SaaS agent.

Use them when you need governance. A team agent needs policy: which repos are allowed, which secrets can be mounted, which commands require approval, where logs live, how branches are named, and who reviews changes. Local tools rarely give you enough shared control. Vendor cloud agents give you control through their product model. Self-hosting lets you define the control plane yourself.

## The Main Self-Hosted Patterns

The self-hosted category splits into three practical patterns. They can overlap, but the buying decision is different for each one.

| Pattern | What you operate | Example tools | Choose it when |
|---|---|---|---|
| Agent platform | Agent UI, backend, workspaces, model routing | [OpenHands](https://docs.openhands.dev/overview/introduction) | You want a full coding-agent surface you can run yourself |
| Sandbox infrastructure | Isolated computers for agents to use | [Daytona](https://www.daytona.io/), [E2B](https://e2b.dev/docs) | You are building your own agent workflow or control plane |
| Private cloud-development environments | Repeatable dev workspaces with access controls | Coder, Daytona, internal Kubernetes | You want agents and humans sharing governed dev environments |

An agent platform is the closest replacement for a managed coding-agent product. OpenHands, for example, describes Agent Canvas as a browser-based UI and backend server for running agents and automations, with local self-hosting or cloud connection options. That is the right shape when you want a product-like agent surface rather than building your own orchestration layer.

Sandbox infrastructure is lower level. E2B describes isolated sandboxes for agents to execute code and run tools. Daytona positions itself around secure, stateful infrastructure for AI agents with file, Git, language-server, and command execution APIs. These are not complete editorial coding products by themselves; they are the runtime layer under a product you control.

Private CDEs are adjacent rather than identical. A cloud-development environment gives a human developer a repeatable workspace. For agents, the same primitive becomes useful when you need isolated branches, dependency installs, browser sessions, and controlled secrets. The difference is that an agent needs API-driven lifecycle control, not just a nice remote IDE.

## What You Gain

Self-hosting gives you three advantages that are hard to bolt onto a vendor cloud agent after the fact.

**Execution ownership.** You decide where code runs, which networks are reachable, how long workspaces persist, and what gets logged. That matters when an agent needs access to private package registries, internal APIs, staging databases, or customer-specific fixtures. You can keep those integrations inside your own boundary instead of recreating them in a vendor sandbox.

**Repeatable parallelism.** Local tools are excellent for one tight feedback loop. Self-hosted workspaces let you run separate agents on separate branches with separate filesystem state. That is the difference between pairing with an agent and operating a small queue of agents.

**Policy control.** You can enforce allowlists, approval steps, branch rules, workspace timeouts, and secret-scoping rules before an agent starts work. This is the same reason teams invest in [code execution sandbox providers](./code-execution-sandbox-providers): agent autonomy is easier to trust when the runtime is constrained by design.

These benefits only matter if the work justifies the platform. If your agent only edits docs or small frontend components, a managed cloud agent or local CLI usually ships faster.

## What You Pay

The cost is not just hosting. It is operations.

You own upgrades. Coding-agent platforms move quickly. Model APIs change, repository permissions change, browser automation breaks, and package caches grow. A self-hosted agent platform needs maintenance the same way a CI system, observability stack, or internal tool platform needs maintenance.

You own isolation. Running untrusted commands is risky even when the code is yours. Agents install packages, execute scripts, call CLIs, start servers, and inspect logs. If your isolation model is weak, a self-hosted agent can damage the same infrastructure you were trying to protect. Use disposable sandboxes, narrow credentials, network restrictions, and short-lived workspaces by default.

You own evaluation. Vendor cloud agents usually ship with product-level defaults for review, diffs, branch creation, and pull-request flow. In a self-hosted system, you need to decide what "done" means. At minimum, agents should produce a branch, a diff, validation output, and a human-readable handoff. For the loop design, see [The Harness Orchestration Loop](./agent-harness-feedback-loop).

You own the security story. Self-hosting does not automatically make model calls private. If the agent sends repository context to a hosted model, that provider still receives selected code, prompts, logs, and failure output. Self-hosting controls execution. Model privacy depends on the model provider, gateway, and data-retention settings you choose.

## How to Choose

Start with the reason you are considering self-hosting. If you cannot name the control problem, do not self-host yet.

| Your situation | Recommended path | Why |
|---|---|---|
| You are one founder supervising edits | Use a local agent | Lower setup, faster feedback, enough control |
| You need async PRs with minimal ops | Use a managed cloud agent | The vendor handles workspace lifecycle |
| You need private workspaces plus team policy | Self-host an agent platform | You need a control plane, not just a CLI |
| You are building your own agent product | Use sandbox infrastructure | You need runtime APIs under your own UX |
| You have strict data residency or air-gap needs | Self-host runtime and review model routing | Execution control alone is not enough |

For most founders, the progression is simple. Start with a local agent. Add a managed cloud agent when you need background PRs. Move to self-hosting only after you hit a real control limit: private dependencies, compliance review, persistent workspace needs, or agent throughput that your laptop cannot support.

If you do move, choose the narrowest layer that solves the problem. Do not run a full agent platform when all you need is disposable code execution. Do not assemble low-level sandbox APIs when an open-source agent surface already fits your workflow. The goal is more shipped work under better control, not infrastructure as a hobby.

## Operating Rules for Self-Hosted Agents

Treat a self-hosted coding agent like a junior engineer with shell access and unusual speed.

Run agents in disposable workspaces. Every task should start from a known repository state and end with a branch, patch, or pull request. Long-lived mutable workspaces create confusing bugs and hide state that reviewers cannot reproduce.

Scope credentials per task. Do not mount broad production secrets into generic agent workspaces. Prefer read-only tokens, staging credentials, short-lived keys, and allowlisted APIs. If a task needs write access, make that exception visible in the task brief and logs.

Make validation boring. Each repository should expose canonical commands for lint, typecheck, test, build, and preview. Store them in durable agent instructions such as [AGENTS.md](./designing-agent-instructions) or the platform's repo config. The agent should not rediscover the validation path on every run.

Keep humans in the merge path. Self-hosting gives you control, not immunity. Require diffs, validation output, and review before production changes merge. If you want unattended deployment later, prove the agent can produce reliable branches first.

## See Also

- [Local AI Coding Agents](./local-ai-coding-agents) - the supervised local lane this category grows out of.
- [Cloud Coding Agents](./cloud-coding-agents) - the managed SaaS lane to compare against self-hosting.
- [Coding Harnesses](./coding-harnesses) - the runtime concept behind local, cloud, and self-hosted coding agents.
- [Code Execution Sandbox Providers](./code-execution-sandbox-providers) - isolation primitives for agent workspaces.
- [Designing Agent Instructions](./designing-agent-instructions) - how to make repository-level agent behavior repeatable.
