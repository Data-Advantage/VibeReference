---
title: "AI Coding Agent Taxonomy"
description: "Use this AI coding agent taxonomy to choose between CLI, IDE, cloud, self-hosted, and app-builder workflows before picking a vendor."
---

# AI Coding Agent Taxonomy

AI coding agents split into workflow categories before they split into vendors. Choose the surface, hosting model, ownership boundary, and job shape first; then compare Claude Code, Codex, Cursor, OpenHands, Replit, Lovable, Bolt, v0, or any other tool inside the lane that matches your work.

## What the Taxonomy Is

An AI coding agent taxonomy is a map of the places where agentic coding work happens. It answers a practical question: when you say "AI coding agent," do you mean a terminal tool, an editor assistant, a cloud task runner, a self-hosted workspace, or an app builder that owns the whole project surface?

That distinction matters because the same vendor name can appear in more than one lane. [Claude Code](https://code.claude.com/docs/en/quickstart) has terminal, IDE, web, desktop, Slack, and CI surfaces. [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) runs in a local repository, while OpenAI also offers hosted Codex surfaces. [Cursor Cloud Agents](https://cursor.com/docs/cloud-agent) run away from your local machine, while Cursor the editor remains an IDE workflow.

The taxonomy is not a leaderboard. A local terminal agent can be the right answer for a regulated repository and the wrong answer for ten parallel chores. An app builder can be perfect for a prototype and painful once you need deep control over architecture. The useful question is: where should the agent loop run, and how much of the product surface should it own?

## What It Is Not

This taxonomy is not the same as a model comparison. Claude, GPT, Gemini, and open model families matter, but model quality is only one layer. The tool still has to gather context, edit files, run commands, handle secrets, manage diffs, and get changes back into Git or production.

It is also not a clean split between "agent" and "not agent." Many products market themselves as agents while actually serving as [coding harnesses](./coding-harnesses): they wire a model, tools, context, permissions, and a loop around a coding task. For the founder choosing a workflow, that distinction is less important than the operating boundary.

Use this simpler lens:

| Layer | Question it answers | Example decision |
|---|---|---|
| Surface | Where do you interact with it? | Terminal, IDE, browser, API, mobile |
| Hosting | Where does code execution happen? | Local machine, vendor cloud, private cloud |
| Ownership | Who controls repo access, commands, logs, and secrets? | You, your team, or the vendor |
| Job shape | What kind of work is it best at? | Pairing, async PRs, prototypes, platform automation |
| Handoff | How does work become reviewable? | Diff, commit, PR, hosted deploy, exported code |

If a product cannot answer those five questions clearly, it is not ready to own important code.

## The Five Main Categories

Most AI coding products fit into five categories. Some tools cross boundaries, but the categories still explain the buying decision.

| Category | Primary surface | Where work runs | Best fit | Main trade-off |
|---|---|---|---|---|
| CLI agents | Terminal | Local or controlled machine | Developers who want Git-native edits and shell control | Less visual, more operator responsibility |
| IDE agents | Editor | Local machine or vendor-assisted session | Supervised implementation inside active coding flow | Can become noisy or approval-heavy |
| Cloud agents | Browser, issue queue, PR workflow | Vendor-managed workspace | Async tasks, parallel work, clean disposable branches | Vendor owns much of the runtime |
| Self-hosted agents | Browser/API/control plane | Your infrastructure | Governed delegation for sensitive or repeatable work | You operate the platform |
| App builders | Prompt-to-app workspace | Vendor app environment | Fast prototypes, non-engineer builders, early MVPs | Less architectural and infrastructure control |

The mistake is choosing a vendor before choosing a category. A founder asking "Claude Code or Cursor?" may really be asking "local supervised pairing or cloud task delegation?" A founder asking "Lovable or v0?" may really be asking "opinionated full-stack app builder or Vercel-native web app surface?"

### CLI Agents

CLI agents live in the terminal and work against a checked-out repository. They are closest to the way experienced developers already ship: inspect files, edit, run tests, review diffs, commit, and repeat.

Use a CLI agent when you want tight control over files, commands, environment variables, and Git history. This is the right lane for refactors, bug fixes, repo cleanup, test writing, migration prep, and codebase exploration. It is also the lane where local constraints are easiest to understand because the agent can only run what your machine or controlled server can run.

Good examples include [Codex CLI](https://learn.chatgpt.com/docs/codex/cli), [Claude Code](https://claude.com/product/claude-code), Aider, and other terminal-first tools. The common pattern is not the brand; it is the operator posture. You steer the loop, watch commands, and treat Git as the review surface.

The weakness is throughput. A terminal agent is excellent for one active task. It is weaker when you want many tasks running in parallel while you are away. You can run multiple sessions, but your local machine, ports, branches, and attention become the bottleneck.

Read next: [CLI AI Coding Agents](./cli-ai-coding-agents) and [Local AI Coding Agents](./local-ai-coding-agents).

### IDE Agents

IDE agents live inside the editor. They are best when the work is visual, incremental, and context-heavy: editing components, navigating a large codebase, generating tests beside the implementation, or asking for changes while you inspect the result.

Use an IDE agent when supervision matters more than autonomy. You want to see file changes as they happen, approve tool calls, nudge the agent toward a nearby file, and keep your hands close to the code. This lane is strong for active implementation, especially when you are still learning the shape of the repo.

Examples include Cursor, Cline, Continue-style assistants, Windsurf, JetBrains-integrated agents, and the IDE surfaces for broader tools. Their value comes from proximity. The agent sees the same file tree you see, and you can interrupt before it runs too far.

The weakness is that IDE agents can feel like very capable assistants rather than true delegation systems. If every meaningful step needs approval, the tool improves your coding speed but does not create independent shipping capacity.

Read next: [IDE AI Coding Agents](./ide-ai-coding-agents) and [AI Pair Programming](./ai-pair-programming).

### Cloud Agents

Cloud agents run coding tasks in a vendor-managed environment. You assign work from a browser, chat surface, issue, or pull-request flow. The agent clones the repo, edits files, runs commands, and returns a branch, diff, PR, or reviewable handoff.

Use a cloud agent when parallelism and isolation are the point. You want five separate tasks running without fighting over one working tree. You want disposable environments for dependency installs and test runs. You want work to continue while your laptop is closed.

Examples include [Cursor Cloud Agents](https://cursor.com/cloud), hosted Codex workflows, GitHub Copilot coding agent workflows, Jules, Devin, and hosted Claude Code surfaces. The market keeps changing, but the category is stable: a vendor gives the agent its own computer and a path back to your repo.

The weakness is trust. You need to understand how the vendor handles repo access, logs, secrets, network access, sandbox lifetime, and model data controls. Cloud is not automatically unsafe, but it moves the operating boundary away from you. That trade-off is worth it for async throughput and weaker for sensitive infrastructure code.

Read next: [Cloud Coding Agents](./cloud-coding-agents) and [Browser AI Coding Agents](./browser-ai-coding-agents).

### Self-Hosted Agents

Self-hosted agents give you cloud-agent mechanics on infrastructure you control. Instead of using only a local terminal or only a vendor sandbox, you operate a repeatable workspace layer: containers, VMs, private cloud-development environments, model routing, repo access, logs, and review policy.

Use this lane when you need governed delegation. The common triggers are private code, regulated environments, internal networks, special credentials, long-running test suites, or a team that needs shared agent policy. You want the agent to run away from your laptop, but you do not want every command and log to live inside a vendor's generic sandbox.

Examples include [OpenHands](https://www.openhands.dev/), private cloud-agent deployments, controlled sandbox infrastructure, and internal agent control planes. The important feature is not "open source" by itself. It is whether you can define where workspaces run, what they can access, how they are torn down, and how outputs become reviewable.

The weakness is operations. You now own isolation, upgrades, logs, credentials, evaluation, and failure recovery. Self-hosting is a serious answer when control is valuable. It is wasteful when you only need a helper to edit a marketing page.

Read next: [Self-Hosted AI Coding Agents](./self-hosted-ai-coding-agents), [Open Source AI Coding Agents](./open-source-ai-coding-agents), and [Code Execution Sandbox Providers](./code-execution-sandbox-providers).

### App Builders

App builders are the prompt-to-product lane. They do not only assist with code; they own a large part of the product workspace: design, file generation, preview, deployment, integrations, and sometimes database or auth setup.

Use an app builder when the goal is a working prototype or early MVP, not long-term control from the first commit. This is the lane for founders who need to test an idea, show a clickable product, create a first internal tool, or get a front end running before hiring engineering capacity.

Examples include [Replit Agent](https://docs.replit.com/features/agent/overview), [Lovable](https://docs.lovable.dev/introduction/welcome), [Bolt](https://support.bolt.new/get-started/intro-bolt), and [v0](https://v0.app/docs). They differ in stack, deployment posture, editing surface, and how much real code you can take with you. The common pattern is that the builder wraps the agent inside a product workspace instead of dropping it into your existing repo.

The weakness is exit cost. The faster the builder creates the first version, the more carefully you need to inspect the generated architecture, dependency choices, data model, auth flow, and deployment path. App builders are useful for speed. They are not a substitute for ownership once the product starts earning trust from real users.

Read next: [AI App Builders](./ai-app-builders), [Prompt Driven Development](./prompt-driven-development), and [Vibe Coding](./vibe-coding).

## How to Choose the Right Lane

Start with the work, not the brand.

| Your situation | Choose this lane | Why |
|---|---|---|
| You are editing a real repo and want full diff control | CLI agent | Terminal plus Git keeps the review loop clean |
| You are actively building UI or navigating unfamiliar code | IDE agent | Editor proximity beats background autonomy |
| You need several independent tasks moving at once | Cloud agent | Separate workspaces create real parallelism |
| You need cloud-like delegation but cannot use a generic SaaS sandbox | Self-hosted agent | You control workspace policy and execution boundaries |
| You need a clickable MVP faster than you need architecture control | App builder | The workspace owns design, preview, and deployment |
| You are building an agent company or internal developer platform | Self-hosted agent or harness stack | The control plane matters more than a single assistant |

The second question is reversibility. If a workflow creates normal commits, branches, and pull requests, switching later is easier. If the workflow traps critical state in a vendor workspace, you need a stronger reason to accept the speed.

The third question is review cost. A tool that creates more code than you can review is not leverage. Match autonomy to your ability to inspect the output.

## See Also

- [Local AI Coding Agents](./local-ai-coding-agents) - When local execution beats cloud delegation.
- [Cloud Coding Agents](./cloud-coding-agents) - How hosted coding agents compare for async work.
- [Self-Hosted AI Coding Agents](./self-hosted-ai-coding-agents) - When to operate the agent workspace yourself.
- [Open Source AI Coding Agents](./open-source-ai-coding-agents) - How open source changes the control and maintenance trade-off.
- [AI App Builders](./ai-app-builders) - When prompt-to-product platforms are the better starting point.
- [Code Execution Sandbox Providers](./code-execution-sandbox-providers) - Runtime options for teams building agent infrastructure.
