# Internal Developer Platforms (IDPs): Backstage, Port, Cortex, OpsLevel, Roadie, Humanitec, Mia-Platform

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're a B2B SaaS at $20M+ ARR with 30+ engineers, you've started feeling the pain — services proliferate, ownership is unclear, deploy paths fragment, new engineers take weeks to ship their first PR. The naive answer: more docs in Notion. The structured answer: an Internal Developer Platform (IDP) — Backstage, Port, Cortex, OpsLevel — that catalogs services + ownership, scaffolds new ones, embeds standards, surfaces dashboards, runs self-serve actions. IDPs scale engineering productivity at the layer where Slack-and-docs stops working. The right pick depends on whether you want OSS (Backstage) vs managed (Port / Cortex / OpsLevel) and what depth of platform you need.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Backstage (Spotify OSS) | OSS IDP | Free (self-host) | OSS | Very high | OSS / engineering-heavy |
| Roadie | Hosted Backstage | Trial | $$ ($800-3K/mo) | High | Backstage without self-host pain |
| Port | Modern managed IDP | Free tier | $$ ($1-10K+/mo) | High | Modern SaaS-led IDP |
| Cortex | Service catalog + scorecards | Custom | $$$ | Medium | Mid-market enterprise |
| OpsLevel | Service catalog + maturity | Custom | $$$ | Medium | Enterprise alternative |
| Humanitec | Platform engineering | Custom | $$$$ | Medium | Heavy platform engineering |
| Mia-Platform | DevOps platform | Custom | $$$ | Medium | EU enterprise |
| Coder | Cloud dev environments | Free | $35-100/user/mo | High | CDE-focused |
| GitHub / Gitpod CDE | Cloud dev environments | Free tier | $$ | High | CDE specifically |
| Backstage Spotify (managed) | Managed Backstage | Custom | $$ | Medium | Spotify-managed |
| Internal Backstage (DIY) | Self-hosted IDP | Free | Engineering time | Very high | Engineering-led custom |
| Atlassian Compass | Atlassian-native IDP | Trial | $$ | Medium | Atlassian users |

The first decision is **OSS vs managed**: Backstage is OSS but requires significant engineering investment; managed IDPs (Port / Cortex / OpsLevel) trade $$ for time-to-value. The second decision is **platform depth**: service catalog + scorecards (Cortex / OpsLevel) vs full platform (Backstage / Port / Humanitec).

## Decide What You Need First

### Service catalog + ownership (the 50% case)
Engineers can't find which team owns what; oncall pages wrong people; new hires lost.

Right tools:
- **Backstage** — OSS catalog
- **Port** — managed
- **Cortex** OR **OpsLevel** — catalog + scorecards
- **Roadie** — hosted Backstage

### Self-serve scaffolding (the 25% case)
Engineers need to create new services / repos / pipelines without DevOps tickets.

Right tools:
- **Backstage** with templates
- **Port** with self-service actions
- **Humanitec** for deployment self-service

### Service maturity / production-readiness (the 15% case)
Define standards (testing, monitoring, on-call); track which services meet them.

Right tools:
- **Cortex** — scorecard leader
- **OpsLevel** — alternative
- **Backstage scaffolding plugin**

### Cloud dev environments (the 10% case)
Engineers run dev locally with hour-long setup; CDEs solve.

Right tools:
- **Gitpod** — CDE leader
- **GitHub Codespaces** — GitHub-native
- **Coder** — self-hosted CDE
- (Distinct from IDPs; can complement)

## Provider Deep-Dives

### Backstage — OSS leader
Open-sourced by Spotify 2020. Massive ecosystem.

Pricing: free (self-host); ~3-12 months engineering investment to build internal version.

Features: software catalog, software templates (scaffolding), TechDocs (Markdown docs as code), Kubernetes plugin, Search, ~150+ plugins (CI/CD / cloud / observability / cost / security).

Why Backstage: most-flexible; OSS; large community; no vendor lock-in.

Trade-offs: significant initial investment (engineer 6-12 months); ongoing maintenance; complex; "you'll spend more on engineering time than you'd pay for managed."

Pick if: 50+ engineers; dedicated platform team; OSS-aligned. Don't pick if: smaller team or want fast time-to-value.

### Port — modern managed IDP
Founded 2022. Modern managed alternative to Backstage.

Pricing in 2026: free tier (limited); Pro $1-10K/mo depending on size.

Features: service catalog, self-service actions, scorecards, integrations (90+), Kubernetes / cloud / DevOps tools, Git-as-code (catalog defined in YAML in repos).

Why Port: faster than Backstage to deploy; modern UX; "infrastructure as code" approach; growing fast.

Pick if: want managed without massive engineering investment; modern team. Don't pick if: 100% OSS-aligned.

### Cortex — service catalog + scorecards
Founded 2018. Catalog + maturity scorecards.

Pricing: $$ enterprise.

Features: service catalog, scorecards, on-call integration, deployment tracking, eng metrics dashboard.

Why Cortex: best-in-class for "is service production-ready?" scorecards.

Pick if: focus on standards / production-readiness; enterprise / mid-market. Don't pick if: full-platform features needed.

### OpsLevel — Cortex alternative
Similar to Cortex.

Pricing: $$ enterprise.

Features: catalog + scorecards + dashboards.

Pick if: alternative to Cortex; enterprise procurement preference.

### Roadie — hosted Backstage
Hosted Backstage without infra burden.

Pricing in 2026: $800-3K/mo + per-user.

Features: full Backstage; hosted; Roadie manages upgrades + plugins.

Why Roadie: get Backstage benefits without maintenance.

Pick if: want Backstage but don't want to host. Don't pick if: cost-sensitive (DIY Backstage cheaper if you have time).

### Humanitec — platform engineering deep
Platform engineering focus.

Pricing: enterprise.

Features: deployment self-service, environment management, secrets, RBAC, deep K8s.

Pick if: heavy platform engineering; deep K8s.

### Mia-Platform — EU
Italian DevOps platform.

Pick if: EU base; Italian / European procurement.

### Atlassian Compass
Atlassian-native (Jira / Confluence integration).

Pick if: heavily Atlassian-aligned.

### Cloud Dev Environments (CDEs):

Gitpod / GitHub Codespaces / Coder

Pricing: $35-100/user/mo typical.

Features: instant dev environment in browser or local IDE; pre-configured.

Why CDEs: hour-long setup → 30 seconds; consistent environments.

Pick if: dev onboarding is painful; complex setup. Distinct from IDP but complementary.

## What IDPs Won't Do

Buying an IDP doesn't:

1. **Solve cultural problems.** Engineers ignoring standards isn't fixed by tool; needs leadership.
2. **Replace platform team.** Need 1-3 dedicated FTEs to run IDP at scale.
3. **Make engineers self-sufficient.** Self-serve actions still require thoughtful design.
4. **Scale infinitely.** Backstage at 1000+ services starts struggling.
5. **Replace docs entirely.** TechDocs is great; Notion / Confluence still useful.

The honest framing: IDP is force multiplier on platform team. Without dedicated owner, it becomes another shelfware.

## When Are You Ready for IDP?

```text
Decide IDP readiness.

Right time signals:
- 30+ engineers
- 50+ services / repositories
- Multiple teams (3+) with their own services
- Onboarding pain (new engineers can't find anything)
- Outages caused by ownership confusion
- Standardization desired (testing / on-call / monitoring)
- Dedicated platform engineer / team

Wrong time signals:
- <20 engineers (manual works)
- <20 services
- One team / one repo
- Fast-changing architecture (IDP investment goes stale)
- No platform engineering owner

Investment levels:

Light (start small):
- Spreadsheet of services + owners
- Confluence / Notion docs
- Cost: $0; time-bound

Mid:
- Roadie ($800-3K/mo) for hosted Backstage
- 0.5-1 platform engineer
- 3-6 month rollout

Heavy:
- Backstage self-hosted
- 2-5 platform engineers
- 6-12 month rollout
- Custom plugins

For [COMPANY], output:
1. Readiness assessment
2. Right investment level
3. Time-to-value estimate
4. Team requirements
5. ROI threshold (when worth it)
```

The 30-engineer threshold: below that, manual works. Above 50, you're losing productivity without IDP.

## Pragmatic Stack Patterns

### Pattern 1: <30 engineers ($0-100/mo)
- Spreadsheet + Notion / Confluence
- Manual ownership tracking
- No IDP yet

### Pattern 2: 30-100 engineers ($1-10K/mo)
- **Port** OR **Roadie** (hosted Backstage)
- 0.5-1 platform engineer
- 3-6 month rollout

### Pattern 3: 100-500 engineers ($5-30K/mo)
- **Backstage self-hosted** (DIY)
- 2-5 platform engineers
- Custom plugins
- 6-12 month rollout

### Pattern 4: Standards-focused ($10-30K/mo)
- **Cortex** OR **OpsLevel** for scorecards
- Tracks production-readiness
- Pairs with catalog (Backstage / Port)

### Pattern 5: Heavy platform engineering ($enterprise)
- **Humanitec** for deployment self-service
- **Backstage** for catalog
- Multi-platform team

### Pattern 6: CDE focus ($35-100/user/mo)
- **Gitpod** OR **GitHub Codespaces**
- Instant dev environments
- Often complements IDP (not replaces)

## Decision Framework: Three Questions

1. **Engineering team size?**
   - <30 → not ready
   - 30-100 → managed IDP (Port / Roadie)
   - 100-500 → self-host Backstage or managed enterprise (Cortex / OpsLevel)
   - 500+ → DIY Backstage with platform team

2. **Primary need?**
   - Catalog + ownership → Backstage / Port
   - Standards + scorecards → Cortex / OpsLevel
   - Full platform → Backstage / Humanitec
   - Dev environments → Gitpod / Codespaces (different)

3. **OSS vs managed?**
   - OSS-priority + engineering capacity → Backstage
   - Speed + simpler ops → Port / Roadie / Cortex
   - Enterprise procurement → OpsLevel / Cortex / Backstage Spotify managed

## Verdict

For 30% of B2B SaaS in 2026 reaching IDP threshold: **Port** for managed modern.

For 25%: **Backstage** for OSS / engineering-heavy.

For 15%: **Roadie** for Backstage-without-hosting.

For 10%: **Cortex** OR **OpsLevel** for scorecard-led.

For 10%: **Humanitec** for heavy platform engineering.

For 10%: **CDE-only** (Gitpod / Codespaces) without IDP yet.

The mistake to avoid: **buying IDP at <30 engineers**. Tool needs scale; below threshold, doc + spreadsheet works.

The second mistake: **Backstage without dedicated platform team**. Massive engineering sink; abandoned in 18 months.

The third mistake: **conflate IDP with CDE**. Different problems; sometimes complementary.

## See Also

- [Project Management Tools](./project-management-tools.md) — Linear / Jira / Asana
- [Code Quality Platforms](./code-quality-platforms.md) — adjacent quality
- [Observability Providers](./observability-providers.md) — APM
- [Error Monitoring Providers](./error-monitoring-providers.md) — error tracking
- [Internal Tool Builders](./internal-tool-builders.md) — Retool / Tooljet (different)
- [Workflow Automation Providers](./workflow-automation-providers.md) — Zapier / n8n
- [CI/CD Providers](./cicd-providers.md) — CI/CD tooling
- [Container Registry Providers](./container-registry-providers.md) — adjacent
- [Application Security Tools](./application-security-tools.md) — adjacent
- [GitHub](./github.md) — Git host
- [Workspace Knowledge Base Tools](../product-and-design/workspace-knowledge-base-tools.md) — adjacent docs
- [VibeWeek: Internal Admin Tools](https://vibeweek.dev/6-grow/internal-admin-tools-chat) — adjacent internal
- [VibeWeek: Audit Logs](https://vibeweek.dev/6-grow/audit-logs-chat) — service audit
- [VibeWeek: Logging Strategy & Structured Logs](https://vibeweek.dev/6-grow/logging-strategy-structured-logs-chat) — adjacent
- [VibeWeek: Metrics & OpenTelemetry Instrumentation](https://vibeweek.dev/6-grow/metrics-opentelemetry-instrumentation-chat) — adjacent
- [LaunchWeek: Internal Tools Strategy](https://launchweek.dev/4-convert/internal-tools-strategy) — when to build vs buy
- [LaunchWeek: Founder Hiring Playbook](https://launchweek.dev/4-convert/founder-hiring-playbook) — engineering hires
- [LaunchWeek: Interview Loop Design](https://launchweek.dev/4-convert/interview-loop-design) — engineering interviews
