# Workflow Automation & iPaaS Providers: Zapier, Make, n8n, Pipedream, Workato, Tray.io, Inngest, Trigger.dev

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a SaaS in 2026 and trying to pick a workflow automation tool, this is the consolidated comparison. Workflow automation is the line item that looks like a "we'll just use Zapier" decision until you discover that Zapier costs $100s/mo at moderate scale, your engineers hate the no-code UI, and what you actually wanted was code-based workflow orchestration with retry / observability built in. Most indie SaaS over-rely on Zapier early ("connect Stripe to email" is one Zap, fine) and never re-evaluate when complexity grows. Pick the right shape and automation runs invisibly; pick wrong and you're paying $500/mo for 4 broken Zaps that nobody trusts.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Zapier | No-code iPaaS | Free (100 tasks/mo) | $19.99/mo | No | High | Non-technical "connect tools" use cases |
| Make (formerly Integromat) | Visual workflow builder | Free (1K ops/mo) | $9/mo | No | High | Visual flows; cheaper than Zapier |
| n8n | OSS workflow engine | Free OSS / Cloud free trial | $20/mo (Cloud Starter) | Yes (Sustainable Use) | Very high | OSS-leaning teams; self-host capable |
| Pipedream | Code-first automation | Free (100 invocations/day) | $19/mo | Partial | Very high | Devs who want code over no-code |
| Workato | Enterprise iPaaS | Custom | Sales-led | No | Very low | Mid-market+ with deep integrations |
| Tray.io | Enterprise iPaaS | Custom | Sales-led | No | Very low | Enterprise with complex orchestration |
| Inngest | Code-first event engine (in-app) | Free (50K events/mo) | $20/mo | Yes (in-app SDK) | Very high | Devs building durable workflows in-product |
| Trigger.dev | Code-first job runner (in-app) | Free (10K runs/mo) | $20/mo | Yes (OSS) | Very high | Devs building background jobs in-product |
| Vercel Workflow (WDK) | Vercel-native durable workflows | Bundled with Vercel | Bundled | No | Very high | Vercel teams building durable in-app flows |
| AWS Step Functions | DIY enterprise | Per-execution pricing | Variable | No | Low | AWS-native teams with platform-eng capacity |
| GitHub Actions | CI also for cron | Free for public; minutes for private | Bundled with GitHub | No | High | Simple cron jobs; not real workflow |

The first decision is **what shape of automation you actually need**. "Connect Stripe to Slack when a customer signs up" (no-code iPaaS), "run this complex multi-step business logic with retries" (in-app durable workflow), and "kick off a background job nightly" (cron) are three different problems with three different tools. Most indie SaaS need at least the first two — different tools — not one mega-platform.

## Decide What You Need First

Workflow tools are not interchangeable. Get the shape wrong and you'll either pay for capabilities you don't use or hit a wall when "we need to retry on failure" comes up.

### No-code "connect tools" automation (the 60% case for indie SaaS)
You want to connect SaaS tools without writing code: "When new Stripe customer → add to HubSpot → send Slack notification." Non-technical team members should be able to author and edit.

Right tools:
- **Zapier** — most-supported integrations
- **Make** — cheaper, more visual flows
- **n8n** — OSS option

### In-app durable workflows (when business logic is multi-step)
You're building product features that are inherently multi-step: "User uploads a CSV → process rows → send email when done" or "Subscribe to webhook → enrich data → store → notify." Code-first; runs inside your application.

Right tools:
- **Inngest** — event-driven, in-app
- **Trigger.dev** — code-first background jobs
- **Vercel Workflow (WDK)** — bundled with Vercel
- **AWS Step Functions** — for AWS-native

### Code-first developer automation (between iPaaS and in-app)
You want serverless functions that run on schedule or on event, written in code, with the operational simplicity of a hosted platform.

Right tools:
- **Pipedream** — code-first, hosted
- **n8n** — code nodes within workflows
- **GitHub Actions** — for simple cron / event-triggered code

### Enterprise / mid-market iPaaS (when scale demands it)
You have hundreds of integrations, complex routing, deep enterprise systems (Salesforce, NetSuite, SAP), and a platform team to run it.

Right tools:
- **Workato** — enterprise iPaaS leader
- **Tray.io** — alternative
- **Boomi** — legacy enterprise

For most indie SaaS in 2026: **Zapier or Make for "connect tools"; Inngest or Trigger.dev for in-app durable workflows; skip enterprise iPaaS until scale demands**.

## Provider Deep-Dives

### Zapier — The No-Code Default
Zapier has been the iPaaS leader for over a decade. Most-supported integrations (7,000+ apps), well-known by non-technical users, mature.

Strengths:
- Most-supported integrations of any tool in this list
- Mature; well-documented
- Strong indie / SMB community
- Templates for common flows
- Multi-step Zaps with paths and conditions
- AI features (Zapier AI, integrated copilot)

Weaknesses:
- Pricing scales fast (per-task model)
- Engineering teams find the UX limiting
- Vendor lock-in (Zaps don''t export)
- Some integrations are thin (just basic CRUD)

Pick when: non-technical users own automation and your scale fits the pricing tiers.

### Make (formerly Integromat) — Visual Builder
Make rebranded from Integromat in 2022. Strong visual flow builder; cheaper than Zapier; more powerful for complex flows.

Strengths:
- More-powerful flow builder than Zapier (loops, error handlers, parallel paths)
- Cheaper per-operation than Zapier
- Free tier (1K ops/mo) is genuinely usable
- Visual representation makes complex flows clearer
- Strong for data transformation use cases

Weaknesses:
- Smaller integration count than Zapier (still substantial — 1,500+)
- Steeper learning curve
- Less-known brand than Zapier
- Operations counter can be surprising at first

Pick when: you want Zapier-style automation but with more power, or budget is the constraint.

### n8n — OSS Workflow Engine
n8n is the OSS leader. Self-hostable; cloud option available; visual builder + code nodes. Strong for OSS-leaning teams.

Strengths:
- Sustainable Use license OSS (free for internal use)
- Self-hostable with Docker
- Visual builder + code nodes (run JS / Python inline)
- 400+ integrations
- Active community
- Cloud Starter at $20/mo

Weaknesses:
- License has restrictions (not for SaaS-resale-as-product)
- Self-host operational overhead
- Smaller integration ecosystem than Zapier
- Cloud pricing scales by execution count

Pick when: you want OSS, you''re comfortable self-hosting, or you want to embed automation in your own product.

### Pipedream — Code-First Hosted
Pipedream is the developer-focused alternative. Code-first (write JS / Python / Go); hosted serverless; integrated with thousands of APIs.

Strengths:
- Code-first (devs feel at home)
- Free tier (100 invocations/day)
- $19/mo Starter
- 2,000+ integrations
- Custom code, source control via GitHub
- Strong for "write a function, expose as webhook" patterns

Weaknesses:
- Less polished than Zapier for non-technical users
- Smaller community than Zapier / Make
- Pricing scales with invocations

Pick when: your team is dev-leaning and prefers writing code over visual flows.

### Workato — Enterprise iPaaS Leader
Workato is the canonical mid-market+ iPaaS. Deep enterprise integrations (Salesforce, NetSuite, Workday); strong governance; team-collaboration features.

Strengths:
- Best-in-class enterprise integrations
- Strong governance (approvals, environments, version control)
- Powerful "recipes" with conditional logic
- Team-collaboration features
- Real-time event-driven flows

Weaknesses:
- Custom pricing (typically $10K+/year minimum)
- Sales-led
- Overkill for indie scale
- Requires platform team to operate

Pick when: you''re mid-market+ with deep enterprise integrations and a platform team.

### Tray.io — Workato Competitor
Tray.io is similar in shape to Workato. Enterprise iPaaS; strong API-first orientation; AI agent features added recently.

Pick when: you''re evaluating Workato and want a comparable alternative.

### Inngest — Code-First Event Engine for In-App Use
Inngest is the modern event-driven workflow platform for code-first teams. Define events; functions react; durable; observable. Best for "in-product" workflows.

Strengths:
- Code-first (TypeScript / Python SDK)
- Durable workflows (resume on failure)
- Free tier (50K events/mo)
- $20/mo Starter
- Strong observability built in
- Step functions / parallel execution
- Real-time UIs for in-product flows

Weaknesses:
- Hosted-only (some self-host options)
- Less suited for "connect SaaS tools" — better for in-app logic
- Smaller community than Zapier

Pick when: you''re building product features that need durable multi-step workflows (CSV imports, video processing, multi-step API orchestrations).

### Trigger.dev — Code-First Background Jobs
Trigger.dev is similar to Inngest — code-first background jobs / workflows. Strong on durable execution; OSS roots.

Strengths:
- OSS (some components)
- Code-first SDK (TypeScript-first)
- Durable workflows with retry
- $20/mo Starter
- Free tier (10K runs/mo)
- Strong for replacing in-house cron / queue setups

Weaknesses:
- Younger than Inngest
- Smaller integration ecosystem
- Less of a "connect tools" tool; more "run code reliably"

Pick when: you''re replacing a cron / queue setup with a managed alternative, OSS / self-host matters.

### Vercel Workflow (WDK) — Vercel-Native Durable Workflows
Vercel Workflow Devkit (WDK) is the Vercel-native option for durable workflows. Bundled with Vercel; integrates with Vercel Functions; modern API.

Strengths:
- Bundled with Vercel
- Native integration with Vercel Functions
- Modern TypeScript-first API
- Durable execution
- Pause / resume / retry built in
- Step-based execution

Weaknesses:
- Tied to Vercel
- Newer; ecosystem still developing
- Less "iPaaS" — more "in-app durable workflows"

Pick when: you''re on Vercel and want native durable workflows. See [Vercel Workflow](../cloud-and-hosting/vercel-workflow.md).

### AWS Step Functions — DIY Enterprise
Step Functions is AWS''s native workflow engine. Powerful, complex, AWS-only.

Strengths:
- AWS-native
- Pay-per-execution pricing
- Visual workflow builder
- Strong for AWS-heavy stacks

Weaknesses:
- AWS-only
- Steep learning curve
- Heavy operational overhead
- Less developer-friendly than modern code-first tools

Pick when: you''re fully on AWS and have platform-eng capacity.

### GitHub Actions — Cron + Event-Triggered Code
GitHub Actions can run scheduled and event-triggered jobs. Not a real workflow tool, but works for simple cron / event use cases.

Strengths:
- Bundled with GitHub
- Free for public repos; included minutes for private
- Easy to set up
- Code-first (YAML + bash / scripts)

Weaknesses:
- Cold-start latency
- 6-hour max runtime
- Not built for high-volume workflows
- No durable retries / state

Pick when: you have simple cron / event-triggered jobs and you don''t want another vendor.

## What Workflow Automation Won''t Do

- **Replace your application code.** iPaaS is for connecting things; product logic should live in code.
- **Replace your database.** Workflow tools have state, but it''s ephemeral / per-run. Real data goes in a DB.
- **Be free of operational overhead.** Even managed tools require monitoring, retries, error handling.
- **Scale to high-throughput cheap.** Per-task pricing on Zapier / Make at 100K+ runs/month is expensive; in-house solutions cheaper at scale.
- **Handle real-time low-latency.** Most iPaaS adds 1-5s latency per step; not for sub-second use cases.

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / TypeScript on Vercel**:
- Vercel Workflow (WDK) for in-app durable workflows
- Zapier or Make for "connect external tools" use cases (CRM ↔ Slack ↔ etc.)
- Total: bundled (Vercel) + $20-50/mo (Zapier / Make)

**Code-first / dev-leaning**:
- Inngest or Trigger.dev for in-app
- Pipedream for code-as-iPaaS
- Skip Zapier
- Total: $20-50/mo

**OSS / self-host**:
- n8n self-hosted
- Or Trigger.dev OSS
- Total: infrastructure cost only

**Non-technical team owns automation**:
- Zapier (most-supported)
- Or Make (cheaper, more flexible)
- Total: $20-100/mo

**Already on Vercel + Inngest pattern**:
- Vercel Workflow (WDK) for native durable
- Inngest for if you want broader event-driven model
- Total: bundled / $20/mo

**Mid-market+ with enterprise integrations**:
- Workato or Tray.io
- Per-team or per-recipe licensing
- Total: $10K+/yr

**Just need cron / scheduled jobs**:
- GitHub Actions (simple cases)
- Vercel Cron (per [Vercel Functions](../cloud-and-hosting/vercel-functions.md))
- Total: bundled

## Decision Framework: Three Questions

1. **Are you connecting external SaaS tools, or running in-app workflows?** → External tools: Zapier / Make / n8n. In-app: Inngest / Trigger.dev / Vercel Workflow.
2. **Who owns the automation?** → Non-technical: Zapier / Make. Devs: Inngest / Trigger.dev / Pipedream / n8n.
3. **What''s your scale?** → Indie: Zapier / Inngest / Trigger.dev. Mid-market+: Workato or DIY.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Zapier or Make for connect-tools; Inngest or Trigger.dev for in-app workflows; Vercel Workflow if you''re on Vercel for in-app**.

## Verdict

For most readers building a SaaS in 2026:
- **Connect external tools (no-code)**: Zapier or Make.
- **In-app durable workflows (code)**: Inngest, Trigger.dev, or Vercel Workflow.
- **Code-first developer automation**: Pipedream or n8n.
- **OSS / self-host**: n8n or Trigger.dev OSS.
- **Enterprise iPaaS**: Workato or Tray.io.
- **Simple cron**: GitHub Actions or Vercel Cron.
- **AWS-native**: Step Functions.

The hidden cost in workflow automation isn''t the per-task fee — it''s **the day a critical Zap silently fails** and you discover three weeks later that customer onboarding broke. iPaaS tools are excellent at the happy path; failure visibility is often weak. Add monitoring on critical Zaps; don''t put load-bearing business logic on no-code tools without backup; treat workflow automation as code (versioned, tested, observed) once it matters.

## See Also

- [Background Jobs Providers](../backend-and-data/background-jobs-providers.md) — overlapping category for in-app jobs
- [Vercel Workflow](../cloud-and-hosting/vercel-workflow.md) — Vercel''s offering
- [Vercel Functions](../cloud-and-hosting/vercel-functions.md) — Vercel cron and functions
- [n8n](../backend-and-data/n8n.md) — n8n deep-dive
- [Notification Providers](../backend-and-data/notification-providers.md) — for alerting on failures
- [Observability Providers](observability-providers.md) — monitor workflow execution
- [CI/CD Providers](cicd-providers.md) — overlapping when automation = CI
- [Inbound Webhooks](https://www.vibeweek.com/6-grow/inbound-webhooks-chat) — common workflow trigger
- [Outbound Webhooks](https://www.vibeweek.com/6-grow/outbound-webhooks-chat) — common workflow output
- [CSV Import Flows](https://www.vibeweek.com/6-grow/csv-import-chat) — typical durable workflow use case

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
