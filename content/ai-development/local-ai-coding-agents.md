---
title: "Local AI Coding Agents"
description: "Local AI coding agents run on your own machine for privacy, control, and fast review. Use them when cloud delegation is too risky or heavy."
---

# Local AI Coding Agents

Local AI coding agents are coding harnesses that run against a repository on your own machine instead of a vendor-managed cloud sandbox. Choose a local agent when code privacy, review control, repo-specific tooling, or tight edit-test loops matter more than parallel background execution.

## What a Local Coding Agent Is

A local coding agent is not just an autocomplete plugin. It is a [coding harness](./coding-harnesses) with file access, shell access, model access, and a loop that can plan, edit, run commands, read failures, and try again. The difference is where the loop executes.

With a local agent, the harness runs on your laptop, workstation, or a machine you control. It reads the checked-out repo, edits files in that working tree, and runs the same test commands you run. The model call may still go to a hosted provider unless you connect a local model, but the filesystem and command execution stay local.

That puts local agents between two adjacent categories:

| Category | Where code executes | Best fit |
|---|---|---|
| Local coding agent | Your machine or controlled server | Sensitive repos, fast review, custom tooling |
| Cloud coding agent | Vendor sandbox | Parallel async tasks, PR generation, clean disposable environments |
| App builder | Vendor app workspace | Non-engineers shipping prototypes or simple SaaS apps |

This article covers the first row. For the hosted version, see [Cloud Coding Agents](./cloud-coding-agents).

## The Local Agent Landscape

The local category splits into terminal-first, editor-first, and self-hosted control-plane tools.

| Tool | Surface | Model posture | Strongest fit | Main trade-off |
|---|---|---|---|---|
| [Claude Code](https://www.anthropic.com/product/claude-code) | Terminal, IDE, web surfaces | Claude-native | Deep repo work with strong reasoning | Provider-specific model stack |
| [OpenAI Codex CLI](https://developers.openai.com/codex/cli) | Terminal | GPT-family | Local terminal work with open-source CLI | Best experience tied to OpenAI account access |
| [Cline](https://docs.cline.bot/cline-overview) | Editor and terminal | Flexible model access | Approval-gated local work in VS Code-style workflows | More manual review per action |
| [Aider](https://aider.chat/) | Terminal | Broad LLM support | Git-native pair programming and small refactors | Requires comfort with explicit file selection and Git |
| [Continue](https://docs.continue.dev/) | CLI, VS Code, JetBrains | Flexible model access | Open-source assistant patterns and IDE workflows | As of 2026-07, docs say the repo is read-only |
| [OpenHands](https://docs.openhands.dev/overview/introduction) | Local/self-hosted/cloud platform | Vendor-agnostic | Self-hosted agent workspaces and team control | Heavier setup than a single CLI |

The useful split is not "which one is smartest?" It is "which control surface matches the work?" Terminal agents fit developers who already live in Git, shell commands, and diffs. Editor agents fit active implementation where you want to watch file changes land beside the code. Self-hosted platforms fit teams that want cloud-like agent sessions without giving the entire workflow to a SaaS sandbox.

## When Local Beats Cloud

Local agents win when the repo and review loop are the hard part.

**Use local for private or regulated code.** If the repository contains customer-specific logic, unreleased product strategy, security-sensitive infrastructure, or data-access code, local execution gives you fewer places where code can move. You may still send snippets to a model provider, but the shell, filesystem, environment variables, and test output stay under your control. That is not a complete security boundary, but it is a smaller operating surface than a third-party cloud workspace.

**Use local when setup is weird.** Many solo-founder repos have development rituals that are not cleanly captured in a README: an old database dump, a Tailscale-only API, a local Docker service, a private npm package, or a fragile test command. A local agent can run inside the same environment you already use. A cloud agent first has to recreate it.

**Use local for fast supervised iteration.** If you want to review every edit, interrupt the agent, add one more file to context, or run the app yourself after each change, local feels better. Cline's docs emphasize explicit approval for actions. Aider's docs emphasize Git-backed edits and reviewable commits. Those design choices slow down unattended work, but they improve supervised work.

**Use local when Git history matters.** Aider's Git integration automatically commits changes after edits, which makes undo and review natural for developers who think in diffs. Claude Code and Codex CLI can also work inside normal Git workflows. If your main fear is "the agent will make a mess and I will not know what changed," local Git discipline is a strong answer.

## When Cloud Is Better

Cloud agents win when throughput and isolation are the hard part.

If you need five unrelated tasks running at once, a local agent is the wrong default. Your laptop has one working tree, one set of ports, one browser session, and limited CPU. Cloud agents can clone separate workspaces, run in parallel, and come back with separate pull requests. That is the core reason [cloud coding agents](./cloud-coding-agents) exist.

Cloud is also better for disposable environments. If a task requires installing unknown dependencies, running migrations, crawling a website, or executing untrusted code, a vendor sandbox can be safer than your daily development machine. Local permission prompts help, but they do not make a random repo trustworthy.

The final cloud advantage is handoff. A cloud task can be assigned, left alone, and reviewed later. A local agent is usually more interactive. That is productive when you are pairing. It is limiting when you are trying to sleep while agents work.

## The Privacy Trade-Off Is Not Binary

"Local" does not always mean "private." The local harness may run on your machine while the model provider still receives code context, prompts, command output, stack traces, and diffs. If you use a hosted model through Claude, GPT, Gemini, or another provider, you need to review that provider's data controls just as carefully as you review the agent.

There are three levels of control:

| Setup | Execution control | Model control | Typical fit |
|---|---|---|---|
| Local harness + hosted model | Files and commands local | Provider sees selected context | Most solo developers |
| Local harness + local model | Files, commands, and inference local | You operate the model | Sensitive code, lower-quality tolerance |
| Self-hosted agent platform | Team-controlled workspaces | Hosted or local model | Teams needing shared governance |

For most solo founders, the first row is the practical default. You get local command execution and review control without running your own inference stack. Move to local models only when the privacy requirement is real enough to justify lower model quality, hardware cost, and operations work.

## How to Choose a Local Agent

Start with your workflow, not the vendor name.

| Your situation | Choose | Why |
|---|---|---|
| You live in the terminal and want strong autonomous edits | Claude Code or Codex CLI | Both run locally from the shell and can modify real files |
| You want open-source, approval-heavy editor control | Cline | It keeps action approval central and supports flexible model access |
| You want Git-native pair programming | Aider | It is built around local repositories, diffs, and commits |
| You want an open-source IDE assistant pattern | Continue | Useful if its extension and config model match your workflow |
| You want a self-hosted agent workspace | OpenHands | It is closer to an agent platform than a simple pair-programming CLI |
| You need unattended parallel PRs | Use cloud instead | Local execution becomes the bottleneck |

If you are unsure, pick one terminal agent and one editor agent. Do not install five. The productivity gain comes from learning the review loop, not from collecting harnesses.

For a terminal-first stack, start with Claude Code or Codex CLI, then add Aider if you want a Git-centered workflow with broad model selection. For an editor-first stack, start with Cline if approval and openness matter, or Cursor/Windsurf if you prefer a full AI-native IDE. For a self-hosted team stack, evaluate OpenHands only after a simpler local tool proves the workflow is worth standardizing.

## Operating Rules for Local Agents

Local agents are powerful because they can touch real files and run real commands. Treat that as production-adjacent access, even on a personal laptop.

Use a clean Git state before serious work. Commit or stash your own changes, then let the agent work in a narrow diff. The fastest way to lose trust in an agent is to mix its edits with unrelated human edits.

Keep secrets out of agent-readable context. A local agent can read files you add to context, run shell commands that print environment variables, and inspect logs. The fact that execution is local does not make accidental prompt exposure harmless. Pair local agents with repo hygiene from [Should You Commit Your .env File to Git?](/devops-and-tools/should-you-commit-env-file) and related Git guides.

Make validation commands explicit. Agents improve when the failure loop is short. Put test, lint, typecheck, and dev-server commands in `AGENTS.md`, `CLAUDE.md`, or the tool-specific config your harness reads. See [Designing Agent Instructions](./designing-agent-instructions) for the broader pattern.

Do not grant broad shell autonomy on unfamiliar repos. A malicious package script, README instruction, or generated command can still harm your machine. Approval prompts are a guardrail, not a replacement for judgment.

## See Also

- [Coding Harnesses](./coding-harnesses) - the runtime layer that local agents belong to.
- [AI Agents vs Harnesses](./agents-vs-harnesses) - how models, tools, context, harnesses, and agents fit together.
- [Cloud Coding Agents](./cloud-coding-agents) - when remote sandboxes and async pull requests beat local control.
- [The Harness Orchestration Loop](./agent-harness-feedback-loop) - how agent loops observe, plan, act, and verify.
- [Code Execution Sandbox Providers](./code-execution-sandbox-providers) - runtime isolation options under coding agents.
- [Should You Commit AGENTS.md?](/devops-and-tools/should-you-commit-agents-md) - how to store durable agent instructions in a repository.
