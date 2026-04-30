# Cloud Development Environments: GitHub Codespaces, Gitpod, Daytona, Coder, JetBrains Space, CodeSandbox, StackBlitz, Replit

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you run engineering at a SaaS in 2026 and you're tired of new hires spending two days getting "the dev environment working," missing dependencies, "works on my machine" Slack threads, and engineers context-switching across 4 client projects with conflicting Node/Python/Ruby versions — this is the consolidated comparison of cloud development environments (CDEs). The naive default is "we use Docker Compose locally; everyone runs it themselves." That works at 5 engineers. By 30 engineers, the per-engineer time wasted on environment setup + drift can exceed the cost of a CDE. By 100 engineers, going without one is a real productivity tax (and a security risk: production credentials on engineer laptops).

CDEs replace local laptop development with browser-or-thin-client access to a remote, ephemeral, repository-defined dev environment. Press a button → 60 seconds later you have a fully-configured workspace with deps installed, services running, code editor connected. Push code as normal. Done. CDEs also unlock benefits unavailable locally: GPU-class machines for ML workloads, ephemeral preview environments per PR, security boundaries (code never leaves the cloud), AI agents running directly inside dev environments without sandboxing concerns, and consistent setup for distributed teams.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| GitHub Codespaces | GitHub-native CDE | 60-120 hrs/mo (Free / Pro) | $0.18/core-hour beyond | No | High | Teams already on GitHub; default for most |
| Gitpod | OSS + cloud CDE | Free (50 hrs/mo) | $25-39/user/mo | Yes (Gitpod Classic OSS) | Very high | Modern teams; OSS-leaning; multi-cloud |
| Daytona | OSS self-hosted CDE platform | Free (OSS) | Custom (cloud) | Yes (Apache 2.0) | Very high | Self-host CDE; AI-agent dev environments |
| Coder | OSS enterprise CDE | Free (OSS) | $40/user/mo+ | Yes (AGPL) | High | Enterprise CDE; airgapped / regulated |
| JetBrains Space (deprecated 2024) | JetBrains CDE | — | — | No | Low | DON'T pick; deprecated |
| JetBrains Toolbox + Gateway | JetBrains remote dev | Free (Gateway client) | Bundled w/ JetBrains | No | High | JetBrains IDE users; CDE backend |
| CodeSandbox | Web-first prototyping CDE | Free | $9-22+/mo | No | Very high | Frontend prototypes; demos; sharing |
| StackBlitz | Browser-native CDE (WebContainers) | Free | $9-39/mo | No | Very high | Frontend / Node demos; instant-load |
| Replit | Browser CDE + AI agent | Free | $25-40/mo (Replit Core / Teams) | No | Very high | Indie devs; AI-native development |
| Cloudflare Workers Playground | Inline CF Workers IDE | Free | Bundled with Workers | No | High | Cloudflare-stack development |
| Vercel Sandbox | Sandboxed code execution | Bundled w/ Vercel | Bundled | No | High | Sandboxed code (NOT dev env per se; agent code execution) |
| AWS Cloud9 (sunset) | AWS CDE | — | — | No | Low | AWS deprecated; do not adopt |
| Lightning (PyTorch) Studios | ML-focused CDE | Free tier | Per-GPU-hour | No | High | ML dev with GPU |
| Modal | Python-first cloud functions + dev shell | Free tier | Pay-per-use | No | Very high | ML/AI Python dev with GPU |
| Replicate Cog | ML-model-package + inference dev | Free tier | Pay-per-inference | Yes (Cog OSS) | High | ML model development |
| GitHub Dev (web editor) | Read-only / lightweight web editing | Free | Free | No | High | Quick edits without full env |

The first decision is **what shape of CDE you actually need**: full-power CDE for daily engineering (Codespaces / Gitpod / Coder), instant-load web-first prototyping (StackBlitz / CodeSandbox / Replit), self-hosted enterprise (Daytona / Coder), or specialized (ML / GPU; Modal / Lightning). Each has a clearly best tool. Picking the wrong shape is the most common mistake — usually defaulting to Codespaces for a frontend prototype where StackBlitz would have shipped in 5 seconds.

## Decide What You Need First

CDEs are not interchangeable. Get the shape wrong and you'll either pay for capability you don't use or hit performance / DX limits.

### Daily-driver engineering CDE (the 50% case for engineering orgs)

You want to replace local laptop dev for your full team. Code lives in repos; PR workflow normal; CDE spins up per workspace.

Right tools:
- **GitHub Codespaces** — default if you're on GitHub
- **Gitpod** — alternative; multi-cloud / multi-Git-provider
- **Coder** — self-hosted; enterprise / airgapped
- **Daytona** — modern OSS self-hosted

### Self-hosted / enterprise / regulated

You can't send code or data to external clouds. Air-gapped, BYOC, or strict compliance.

Right tools:
- **Daytona** — modern OSS, lighter weight
- **Coder** — enterprise-grade, AGPL OSS
- **DevPod** (Loft Labs) — adjacent OSS

### Browser-first / instant-load / demos

You want "click a link, code is running" — for demos, tutorials, prototypes, customer support reproductions.

Right tools:
- **StackBlitz** — WebContainers; no server side; instant
- **CodeSandbox** — broader stack support; cloud + browser hybrid
- **Replit** — full IDE in browser; great for indie

### AI-agent development environments

You're running AI coding agents (Devin, Claude Code agents, Cursor agents) and need the agent to have a real dev environment with shell access, not just a sandbox.

Right tools:
- **Daytona** — built explicitly for AI agent environments (post-2024 pivot)
- **GitHub Codespaces with Copilot agent**
- **Replit Agent**
- **E2B** — sandboxed code execution for agents (different layer)

### ML / GPU development

You're training or fine-tuning models; need GPU; iterative development.

Right tools:
- **Modal** — Python-first, GPU on-demand
- **Lightning Studios** — ML-focused, by PyTorch Lightning team
- **AWS SageMaker Studio**
- **Vertex AI Workbench** (GCP)
- **Databricks** notebooks

### JetBrains-IDE users

Your team uses JetBrains (IntelliJ / PyCharm / GoLand / WebStorm). You want the JetBrains experience in a remote env.

Right tools:
- **JetBrains Gateway + Toolbox** — connects to remote backends (Codespaces, Gitpod, custom)
- **JetBrains Space** was JetBrains' own CDE — deprecated 2024; do not adopt
- **Codespaces with JetBrains Gateway** — common pattern

## Provider Deep-Dives

### GitHub Codespaces

The default. GitHub Codespaces (GA 2021; free for public repos since 2022) provides per-repository CDEs with VS Code in browser or via your local VS Code as remote. If you're on GitHub, this is the path of least resistance.

**Strengths:**
- GitHub-native: zero new tool to onboard.
- Pre-built devcontainer.json spec; portable across CDE providers.
- Free tier real (60 hours/mo Free; 90 hours/mo Pro; up to 180 hours/mo for some accounts).
- VS Code in browser OR local VS Code attached.
- JetBrains Gateway support.
- GitHub-Copilot integrated.
- Good range of machine sizes (2-core to 32-core; up to 64GB RAM).
- Prebuilds (cache full env image; fast startup for warm starts).
- Fits naturally into PR workflow.
- Org policies for CDE governance.

**Weaknesses:**
- Tied to GitHub; not for GitLab / Bitbucket users.
- Cost can balloon at scale (32-core machines = $1.92/hr; full-time team = $200-1000+/dev/mo).
- Less customizable than Coder for enterprise needs.
- No GPU support.
- No sub-second cold-start magic of StackBlitz; ~30-60s spin up.
- Some flaky behavior on long-lived sessions.

**Pricing:** Free 60-180 hrs/mo. Beyond: $0.18/core-hour for 2-core; up to $1.92/hr for 32-core; storage $0.07/GB-month.

**Best for:** Default for GitHub-using engineering teams. The right starting point for most.

### Gitpod

The OSS CDE pioneer. Gitpod (founded 2018; OSS Classic edition; multiple cloud-hosted offerings) was the original modern CDE and still leads on flexibility + multi-Git-provider support.

**Strengths:**
- Works with GitHub, GitLab, Bitbucket, Azure DevOps.
- Devcontainer + Gitpod-yaml support.
- Open-source Classic (self-host).
- Modern UI; good DX.
- Snapshot + share workspaces (great for collaboration).
- Good range of machine sizes.
- Local + remote dev supported.
- Strong developer community.
- Recent (2025) Gitpod Flex offers improved enterprise tier.

**Weaknesses:**
- Smaller market share than Codespaces.
- Pricing higher than Codespaces at low usage.
- Self-hosted Classic operationally non-trivial.
- Less polished than Codespaces for pure GitHub workflows.

**Pricing:** Free (50 hrs/mo). Pro $25-39/user/mo. Enterprise custom.

**Best for:** Multi-Git-provider teams; OSS-leaning shops; teams wanting alternative to GitHub lock-in.

### Daytona

The modern OSS self-hosted + AI-agent-friendly CDE. Daytona (founded 2023; Apache 2.0 since 2024) pivoted hard toward AI agent dev environments in 2025-2026 — purpose-built for "give the agent a real dev workspace, not a sandbox."

**Strengths:**
- Apache 2.0 (clean OSS license).
- Self-hostable on any cloud / Kubernetes.
- AI-agent-first design (Daytona ships with agent integration).
- Fast workspace startup (<10 seconds for warm starts).
- Devcontainer-spec compatible.
- Modern Go-based core; lightweight.
- Active dev community.
- Cloud-hosted offering for managed.
- Strong on the "ephemeral environment per agent task" use case.

**Weaknesses:**
- Newer; less battle-tested at >100-user scale.
- Smaller catalog of pre-built environments than Codespaces/Gitpod.
- Operating self-hosted Daytona requires DevOps effort.

**Pricing:** Free OSS. Cloud custom.

**Best for:** Self-hosted CDE; AI-agent-driven development workflows; teams that need the "agent has a real shell" capability without sandboxing constraints.

### Coder

The enterprise CDE. Coder (founded 2017; AGPL OSS; commercial enterprise tier) is the most mature option for "enterprise CDE on our infrastructure with full compliance."

**Strengths:**
- AGPL OSS core; transparent.
- Self-host on any cloud (AWS, GCP, Azure, on-prem, airgapped).
- Highly customizable templates (workspace defs in Terraform).
- Strong RBAC, SSO, audit, compliance.
- Battle-tested at enterprise scale.
- Multi-cluster / multi-cloud workspaces.
- Idle timeouts, cost controls.

**Weaknesses:**
- AGPL license needs review for commercial use.
- Enterprise pricing.
- Heavier setup than Daytona for small teams.
- UX feels more enterprise than indie-friendly.

**Pricing:** Free OSS. Enterprise: $40/user/mo+.

**Best for:** Regulated enterprise (financial services, healthcare, government); airgapped / classified environments; teams that need full compliance on dev infrastructure.

### CodeSandbox

The browser CDE for prototyping + sharing. CodeSandbox runs full stack environments in browser-rendered VMs — great for demos, tutorials, customer reproductions.

**Strengths:**
- Click-and-go browser experience.
- Strong frontend ecosystem (React, Vue, Svelte, etc.).
- Multi-file editing; live preview.
- Sandbox sharing (great for tutorials, reports, GitHub-issue reproductions).
- Devcontainer support for full stacks.
- Recent: CodeSandbox CDEs (full daily-driver mode).

**Weaknesses:**
- Less common as primary daily CDE vs Codespaces.
- Some advanced workflows feel awkward.
- Pricing model (per-credit) less predictable than per-hour CDE.

**Pricing:** Free tier; paid from $9/mo.

**Best for:** Frontend prototyping, demos, customer-issue reproductions, tutorials. Not the daily driver for backend-heavy teams.

### StackBlitz

The instant-load browser CDE. StackBlitz uses WebContainers — Node.js running entirely in your browser via WASM — for sub-second cold starts.

**Strengths:**
- Instant load (cold start measured in milliseconds).
- No server costs to StackBlitz at runtime; you do all the compute locally.
- Great for tutorials, demos, embedded code samples.
- Strong frontend + Node ecosystem.
- StackBlitz Codeflow / Bolt integration.
- Free for solo developers.

**Weaknesses:**
- WebContainers limited to Node.js + browser-compatible runtimes (no Python, Ruby, Go server-side).
- Not a daily driver for full-stack work.
- Database support limited (in-memory via WebContainers).
- Some npm packages incompatible with browser WASM.

**Pricing:** Free; Personal $9/mo; Teams $39/mo.

**Best for:** Frontend / Node tutorials, demos, instant-load prototypes. NOT daily backend dev.

### Replit

The all-in-one indie + AI-agent CDE. Replit (founded 2016; pivoted heavily toward AI in 2024-2025) is browser-first IDE + hosting + AI agent in one.

**Strengths:**
- Indie-friendly UX.
- Built-in AI Agent (Replit Agent; one of the better cloud-IDE-native agents).
- Hosting bundled (deploy directly from Replit).
- Strong for solo / small teams; education.
- Supports many languages (Python, Node, Go, Rust, Ruby, etc.).
- Real-time collaboration.

**Weaknesses:**
- Less polished for serious enterprise / large team usage.
- Pricing scales fast at higher resource needs.
- Lock-in: Replit-hosted vs. portable.
- Less battle-tested at $1M ARR enterprise scale.

**Pricing:** Free tier; Replit Core $25/mo; Teams $40/mo+.

**Best for:** Indie devs, education, AI-agent-heavy workflows, fast prototyping with deployment included.

### Modal / Lightning Studios

The ML / GPU CDEs. Different shape — these are Python + GPU + dev shell + serverless functions in one.

**Modal:**
- Python-first; serverless functions with GPU
- Dev shell for iterative development with GPU
- Scales from prototype to production
- Pay-per-second compute
- Generous free tier

**Lightning Studios:**
- ML-focused workspaces (PyTorch Lightning ecosystem)
- GPU on demand
- Pre-configured for ML stacks

**Best for:** ML/AI engineering. NOT for general SaaS dev.

### Vercel Sandbox

Note: Vercel Sandbox (GA Jan 2026) is **not a developer CDE** — it's a sandboxed execution environment for running untrusted code (AI-agent-generated code, customer-uploaded scripts). Mentioned here for clarity; don't confuse with Codespaces/Gitpod tier products.

## What CDEs Won't Do

Useful to be clear-eyed about CDE limits:

- **They won't fix your devcontainer.json.** A bad/missing devcontainer config produces inconsistent envs across CDE providers. Invest in the spec.
- **They won't replace local IDE forever.** Some workflows (heavy IDE customization, offline work, GPU-rendering frontend like Three.js with profiling, mobile dev with simulators) still benefit from local. Plan for hybrid.
- **They won't be cheaper than laptops at small scale.** For 5 engineers, laptops + Docker Compose may cost less. CDEs win at 30+ engineers + complexity.
- **They won't replace observability of your dev workflow.** You still need to track build times, hot-reload speed, test latency. CDEs add a network hop.
- **They won't substitute for a real CI / preview-deploy pipeline.** "I can run it in the CDE" ≠ "it'll pass in CI." Keep CI honest.
- **They won't make AI agents safe by themselves.** Daytona environments are real envs with real shells; agent permissions still matter. Use scoped tokens, scoped repos, scoped accounts.
- **They won't solve "dev environment drift" if you don't enforce.** Without policy that ALL devs use the CDE, you're back to "works on my machine."

## Pragmatic Stack Patterns

Common 2026 patterns based on team profile:

### Indie / solo founder

```
Local laptop + Docker Compose
+ optional: Replit for prototypes
+ optional: StackBlitz for embedded demos
```

Rationale: don't pay for a CDE alone; use free tiers as needed.

### Small startup (5-30 engineers)

```
GitHub Codespaces (Pro tier; ~120 hrs/mo free)
+ devcontainer.json in every repo
+ JetBrains Gateway for IntelliJ users
+ StackBlitz / CodeSandbox for demos + tutorials
```

Rationale: GitHub-native; minimal new tooling; fits PR workflow.

### Growing engineering org (30-100 engineers)

```
Codespaces or Gitpod Cloud (paid tier)
+ rigorous devcontainer specs in all repos
+ prebuilds enabled (warm-start saves 30-60s per session)
+ JetBrains Gateway for that subset of devs
+ Replit / StackBlitz for demos + prototyping
+ Modal / Lightning for ML team
```

Rationale: at 30+ engineers, CDE pays for itself. Codespaces simpler; Gitpod for multi-Git.

### Large engineering org (100-1000 engineers)

```
Coder self-hosted (or Codespaces enterprise)
+ devcontainer + workspace templates
+ SSO + RBAC + audit
+ JetBrains Gateway integration
+ ML-specific: Modal or Databricks
+ AI agent dev: Daytona or Codespaces
+ governance + cost controls
```

Rationale: at this scale, governance + compliance matter; cost optimization matters.

### Enterprise / regulated (financial services, healthcare, government)

```
Coder (self-hosted) OR Daytona (self-hosted) on private cloud / on-prem
+ airgapped where required
+ audit logging
+ SSO + RBAC enforced
+ devcontainer registry hosted internally
+ strict cost controls + idle timeout policies
```

Rationale: data sovereignty; compliance audits.

### AI-agent-heavy engineering

```
Daytona (purpose-built for agents)
OR Codespaces with Copilot Agent
+ scoped GitHub tokens per agent task
+ ephemeral workspaces destroyed post-task
+ audit log of agent actions
+ E2B for "execute untrusted code" cases (different layer)
```

Rationale: agents need real dev envs but with strong perms.

### ML / data science team

```
Modal (Python + GPU; serverless)
OR Lightning Studios
+ optional: SageMaker Studio (if AWS-bound)
+ general-dev CDE separately for non-ML engineers
```

Rationale: ML has unique needs (GPU, large data); separate stack.

### Frontend-heavy team / agency

```
Codespaces or Gitpod for daily dev
+ StackBlitz heavily for client demos + prototypes
+ CodeSandbox for sharing reproductions
+ Vercel Preview Deploys for stakeholder review
```

Rationale: rapid iteration on frontend; embedded demos.

## Decision Framework

Use this five-question framework:

### 1. Are you on GitHub?

- **Yes:** Default to **GitHub Codespaces**. Re-evaluate at 100+ engineers.
- **No (GitLab/Bitbucket):** **Gitpod** is the natural choice.
- **Multi-source-of-truth or self-hosted Git:** **Gitpod** or **Coder** or **Daytona**.

### 2. What's your scale?

- **<5 engineers:** Skip CDE; use local laptops + Docker Compose.
- **5-30:** Codespaces / Gitpod free + paid.
- **30-100:** Codespaces / Gitpod paid; consider Daytona / Coder if compliance matters.
- **100+:** Coder / Daytona self-hosted OR Codespaces enterprise.

### 3. Compliance / data residency requirements?

- **Standard:** any cloud CDE.
- **Strict (regulated, airgapped):** Coder or Daytona self-hosted.
- **Government / classified:** Coder; possibly air-gapped Daytona.

### 4. Special workloads?

- **GPU / ML:** Modal, Lightning Studios, separately from main CDE.
- **AI agents:** Daytona, Codespaces with Agent, Replit.
- **Frontend prototyping / demos:** StackBlitz, CodeSandbox.
- **Education / solo:** Replit.

### 5. Team IDE preference?

- **VS Code primary:** Codespaces / Gitpod / Coder all integrate.
- **JetBrains primary:** JetBrains Gateway + (Codespaces / Gitpod / Coder backend).
- **Vim / terminal:** All CDEs support; Coder + Daytona especially flexible.
- **Multiple:** All major CDEs support multiple clients.

## Verdict

For 2026 cloud development environments:

- **Default for GitHub-using teams:** **GitHub Codespaces**. Boring, works, fits PR workflow.
- **Multi-Git or modern alternative:** **Gitpod**.
- **Self-hosted / regulated / enterprise:** **Coder** (mature) or **Daytona** (modern).
- **AI-agent dev environments:** **Daytona** or **Codespaces with Agent**.
- **Browser-instant prototyping:** **StackBlitz** (Node) or **CodeSandbox** (broader).
- **Indie devs / education / AI-native:** **Replit**.
- **ML / GPU dev:** **Modal** or **Lightning Studios**.
- **Don't pick:** JetBrains Space (deprecated), AWS Cloud9 (deprecated).

The most common mistake in 2026: defaulting to "we'll just use Codespaces" without investing in the devcontainer spec. The devcontainer file IS the value; without a good one, every CDE feels broken. Spend a week getting it right.

The second most common mistake: forcing CDE adoption before the devcontainer is rock-solid. Pilot with 3-5 senior engineers; iterate; then roll out broader.

The third mistake: ignoring cost. CDEs at scale can cost $200-1500/dev/mo depending on machine size + idle time. Set idle timeouts; track per-team usage; don't let CDE compute become the new "AWS bill" surprise.

## See Also

- [GitHub](./github) — the SCM platform Codespaces rides on
- [CI/CD Providers](./cicd-providers) — adjacent (CI runs separately from CDE)
- [Container Registry Providers](./container-registry-providers) — sister category for image hosting
- [Internal Developer Platforms](./internal-developer-platforms) — adjacent (Backstage, etc.)
- [Code Quality Platforms](./code-quality-platforms) — adjacent (Sonar, etc.)
- [Testing Frameworks](./testing-frameworks) — adjacent
- [API Testing Tools](./api-testing-tools) — adjacent
- [Application Security Tools](./application-security-tools) — adjacent (CDE security posture matters)
- [Vercel Sandbox](../cloud-and-hosting/vercel-sandbox) — DIFFERENT category (sandboxed execution, not dev env)
- [Cloud Coding Agents](../ai-development/cloud-coding-agents) — pairs with CDE-friendly agent envs
- [Claude Code](../ai-development/claude-code) — agent that runs IN dev environments
- [Cursor](../ai-development/cursor) — local IDE; different layer
- [Augment Code](../ai-development/augment-code) — adjacent IDE-layer agent
- [Devin AI](../ai-development/devin-ai) — example agent that needs dev env
- [Daytona at Daytona Self-Host (specific)](../cloud-and-hosting/) — operational guide if you self-host
