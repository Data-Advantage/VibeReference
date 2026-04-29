# Vercel Agent

Vercel Agent is an AI-powered assistant built into the Vercel platform that automates pull-request code review, root-causes production anomalies, and installs analytics SDKs end-to-end. Launched in October 2025 and currently in public beta, it is Vercel's "Agent-as-a-Service" — an AI teammate that lives in your repo and your observability dashboard rather than a separate tool you have to wire up.

If you have used CodeRabbit, Greptile, or GitHub's Copilot Code Review, you have used something in this category. Vercel Agent's distinguishing move is that every suggestion is validated inside a [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox) — your tests run, your linters run, your formatters run — before the comment is posted on the PR. Patches that fail your own checks never reach you.

## Three capabilities

### Code Review

The default capability. On every PR push, Vercel Agent analyzes the diff in the full context of your repo (source, tests, configs, documentation), runs multi-step reasoning to identify security issues, logic errors, performance regressions, and missing test coverage, generates candidate patches, and validates them inside a Vercel Sandbox running your project's actual build, tests, and linters. Only validated suggestions reach the PR.

Comment shapes you will see:

- **Inline review suggestions** — GitHub's standard "suggestion" syntax that you can apply with a one-click "Commit suggestion" button.
- **Full patch proposals** — for changes that span multiple lines or files, the agent produces a complete patch with a "Apply patch" affordance.
- **Threaded explanations** — for issues that need context (security implications, architectural concerns), the agent explains the reasoning rather than just suggesting a fix.

You can also trigger reviews manually by mentioning **`@vercel`** in any PR comment. Useful for "hey, take another look at the latest commit" or focused asks like "@vercel, audit the new auth code for OWASP top-10 issues."

### Investigation

Triggers on anomaly alerts from Vercel Observability — error-rate spikes, latency regressions, dramatic traffic changes, failed deployments. The agent queries logs and metrics around the alert window, looks for patterns, correlates with recent deployments and config changes, and posts a root-cause hypothesis with the supporting evidence.

This is the capability that turns "the dashboard says something is wrong, now I have to figure out what" into "the agent already looked, here is what changed and where to look first." Available to teams on **Vercel Observability Plus**; not part of the base agent.

### Installation

The least-glamorous capability and arguably the highest-leverage for new projects. The agent analyzes your repo, figures out the right place to add Vercel's Web Analytics and Speed Insights SDKs, writes the integration code, runs your build to confirm it works, and opens a PR you can review and merge. Free — no credit cost.

The pattern generalizes: agent-driven SDK installation removes the "small thing I keep meaning to do" friction from the start of a project. More installable integrations are likely to follow.

## How to enable it

Vercel Agent is configured at the project level: open the Vercel dashboard, go to your project, navigate to the **Agent** tab in the sidebar, and click **Enable Vercel Agent**. From there, three sub-settings:

- **Repositories** — which connected GitHub repos get auto-review on PRs (you can scope per-repo).
- **Investigations** — toggle on if you have Observability Plus. Choose which anomaly types trigger investigations.
- **Installation** — fire one-shot from the UI when you want to add an SDK to a project.

The GitHub App for Vercel must already be installed on your repos. No npm package, no configuration files in the repo, no CI changes — it is a platform-level service that hooks into GitHub via the existing Vercel integration.

## What it costs

Pricing in 2026:

- **Code Review**: $0.30 per PR review, plus underlying model token costs. Pro teams receive a $100 promotional credit at sign-up.
- **Investigation**: $0.30 per investigation, plus model tokens. Includes 10 free investigations on Observability Plus before billing kicks in.
- **Installation**: free.

The economics are straightforward for indie and small-team projects: a $0.30 review on a non-trivial PR generally beats the cost of the bug it catches. Teams shipping multiple PRs per day should budget around $50–$200/month for review usage on a typical project.

## What models power it

Vercel Agent runs on Vercel AI Cloud with model routing — the same infrastructure underneath [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway). The exact model choice per capability is not always disclosed, but reviews use frontier reasoning models from the Claude or GPT families depending on routing, and the sandbox-validation step ensures that whichever model wrote the patch, the patch had to compile and pass tests before reaching you.

For teams worried about model-provider data handling, the privacy posture is: Vercel runs the inference on your behalf via routed providers under their data-handling agreements; the agent does not retain training rights on your code through Vercel's pipeline. For full guarantees, check Vercel's data-processing addendum and your selected model providers' policies. If you need explicit zero-retention guarantees, request the enterprise terms.

## How it compares

| | Vercel Agent | CodeRabbit | GitHub Copilot Code Review | Greptile |
|---|--------------|------------|-----------------------------|----------|
| **Sandbox validation** | Yes (built on [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox)) | No — relies on AI heuristics | No | No |
| **Investigations on production anomalies** | Yes (Observability Plus) | No | No | No |
| **SDK installation** | Yes | No | No | No |
| **Where it runs** | Vercel platform | Standalone, GitHub App | GitHub native | Standalone |
| **Pricing** | $0.30 per review + tokens | $24+/dev/month | Per Copilot license | Tiered |
| **Best for** | Teams already on Vercel; Next.js / SvelteKit / Astro projects | Teams who are not on Vercel | Teams who already pay for Copilot | Codebase Q&A more than PR review |

The differentiator is tight integration with the rest of Vercel: the same sandbox that validates patches is the one your team can use directly, the investigations connect to the same observability data your dashboards show, and the agent has access to deployment history and runtime telemetry that standalone code-review tools cannot see.

If you are not on Vercel, the agent does not run. If you are, it is the highest-leverage AI development tool the platform offers in 2026.

## What it does well

- Catches the obvious-but-easy-to-miss bugs that reviewers also catch but later — security misconfigs, missing null checks, regression risks.
- Pre-validates suggestions through your real build/tests, eliminating the "AI suggested something that does not compile" failure mode common in standalone tools.
- Investigations move root-cause analysis from "scroll through logs for 20 minutes" to "read a paragraph with the supporting evidence."
- The `@vercel` mention pattern fits how teams already work — review comments on PRs is the natural surface.
- Installation removes a meaningful chunk of "small chore" friction from new projects.

## What it does not do

- It does not replace a senior reviewer. The agent is good at the first pass and at catching what a tired reviewer would miss; it is not at the level of a principal engineer reading the same diff.
- It does not write features. The agent reviews and patches what is already written; it is not [Cursor](/ai-development/cursor) or [Claude Code](/ai-development/claude-code) for greenfield work.
- It does not work outside Vercel. Self-hosted apps, Cloudflare-only deployments, and AWS-direct projects do not get reviews — the GitHub App can run, but the sandbox validation depends on the Vercel build pipeline.
- It does not do design reviews — UX, accessibility, architecture-level decisions. Those still need human judgment.
- It does not auto-create investigation PRs (yet — likely in the roadmap).

## When to reach for it

- Any team on Vercel that pushes more than a few PRs per week.
- Teams running production traffic where anomaly investigation matters and Observability Plus is already in place.
- New projects where the analytics SDK installation chore has been deferred.

## When you might not need it

- Solo projects where the founder is the only reviewer and reads every PR end-to-end already.
- Apps not deployed on Vercel — you cannot get sandbox-validated reviews without the platform.
- Codebases dominated by very high-context decisions (legacy migrations, novel architectural patterns) where AI review tends to be noise.

## Further reading

- [Vercel Agent docs](https://vercel.com/docs/agent)
- [Code Review docs](https://vercel.com/docs/agent/pr-review)
- [Investigation docs](https://vercel.com/docs/agent/investigation)
- [Installation docs](https://vercel.com/docs/agent/installation)
- [Introducing Vercel Agent](https://vercel.com/blog/introducing-vercel-agent) — launch blog post

For other Vercel and AI-development references on this site, see [Vercel](/cloud-and-hosting/vercel), [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox), [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway), [Claude Agent SDK](/ai-development/claude-agent-sdk), [Claude Code](/ai-development/claude-code), and [Cursor](/ai-development/cursor).
