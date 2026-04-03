# Coordinating Deploys Across Multiple Vibe-Coded Projects

When you vibe-code one project, deploys are simple — push to main, Vercel builds, site is live. When you have six projects — a reference site, an image generator, a content platform, a presentation tool, an LLM directory, and a recipe app — deploys become a coordination problem.

Each project drifts at its own pace. One is on Next.js 15, another on 16. Dependencies update at different times. A shared pattern works in one repo but breaks in another. A deploy failure in project C blocks the engineer who was about to start on project D.

This guide covers the operational reality of managing deploys across a portfolio of vibe-coded projects, based on running 6+ Vercel-deployed Next.js sites simultaneously.

## The Drift Problem

Vibe-coded projects drift apart faster than traditionally developed ones. Here is why:

**Different AI sessions produce different solutions.** When Claude scaffolds a project in January and you scaffold another in March, the codebases will use different patterns, different library versions, and different project structures — even if you gave similar prompts.

**No shared codebase.** Unlike a monorepo where a single upgrade touches everything, polyrepo projects share nothing. Upgrading Next.js in one project does not upgrade it in the others.

**AI tools generate what works now, not what is consistent.** If you ask an AI to fix a bug, it uses the latest version of whatever library solves the problem. Six months later, that library has moved on and the fix approach has changed.

The result: after a few months, your projects look like they were built by different teams — because in a sense, they were. Each AI session is a different "developer" with no memory of the other projects.

## Deploy Architecture

### One Vercel Project Per Site

The simplest and most common setup for vibe-coded projects:

```
GitHub Repos          Vercel Projects         Domains
─────────────         ───────────────         ───────
pixola           →    pixola-prod        →    pixola.ai
llmreference     →    llmreference-prod  →    llmreference.com
vibereference    →    vibereference-prod →    vibereference.com
fastwrite        →    fastwrite-prod     →    fastwrite.ai
deckchat         →    deckchat-prod      →    deckchat.ai
dannysdrinks     →    dannysdrinks-prod  →    dannysdrinks.ai
```

Each repo has its own Vercel project with its own build settings, environment variables, and domain configuration. Push to main triggers a deploy for that specific project.

**Real fleet inventory (as of early 2026):**

| Project | Next.js Version | Type | Notes |
|---------|----------------|------|-------|
| Pixola | 16.2.1 | SaaS | Convex + Clerk |
| ArtTV | 16.2.1 | SaaS | Convex + Clerk |
| FastWrite | 16.2.1 | SaaS | Convex + Clerk |
| LLMReference | 16.2.1 | Content | Static export |
| DeckChat | 16.2.1 | Tool | Convex + Clerk |
| PPTX.dev | 16.2.1 | Tool | Convex + Clerk |
| VibeReference | 15.5.14 | Content | Static export |
| VibeWeek | 16.1.6 | Content | Static |
| LaunchWeek | latest | Content | Static |

Notice the version drift: VibeReference is still on Next.js 15 while the rest of the fleet is on 16. This is an intentional decision — it is a static content site with no reason to upgrade yet — but without tracking it, you would not know whether the drift is intentional or an oversight.

**Advantages:**
- Complete isolation — a bad deploy in one project does not affect others
- Independent deploy cadence — ship each project when it is ready
- Simple rollback — Vercel's instant rollback works per-project

**Disadvantages:**
- No shared build configuration — changes to build settings must be applied to each project individually
- Environment variable sprawl — API keys and configuration duplicated across projects
- No cross-project deploy coordination — you cannot deploy all projects atomically

### Monorepo Alternative

Some teams consolidate vibe-coded projects into a monorepo to reduce drift:

```
workspace/
├── apps/
│   ├── pixola/
│   ├── llmreference/
│   └── vibereference/
├── packages/
│   └── shared-ui/
├── package.json
└── turbo.json
```

**When to use a monorepo:**
- Projects share significant code (component library, utility functions)
- You want a single upgrade path for shared dependencies
- You have engineering capacity to maintain the monorepo infrastructure

**When to stay polyrepo:**
- Projects are architecturally independent
- Different projects use different frameworks or major versions
- You do not have dedicated DevOps capacity

For most vibe-coded portfolios, polyrepo is the pragmatic choice. The overhead of monorepo tooling (Turborepo, Nx, workspace configuration) often exceeds the benefit when projects are architecturally independent.

## Batch Upgrades

The highest-risk operational task is upgrading a shared dependency (like Next.js) across all projects.

### The Staggered Approach

Do not upgrade everything at once. Stagger upgrades across projects:

1. **Pick the lowest-risk project** — the one with the least traffic, fewest features, and simplest architecture
2. **Upgrade and deploy** that project. Monitor for 24-48 hours.
3. **If stable, upgrade the next project.** Repeat until all projects are current.
4. **If issues appear, fix them in the first project** before proceeding. The fix usually applies to all subsequent upgrades.

```
Day 1: Upgrade dannysdrinks (lowest traffic, simplest)
Day 2: Monitor. Fix any issues.
Day 3: Upgrade llmreference (low traffic, static content)
Day 4: Upgrade vibereference (moderate traffic, static)
Day 5: Upgrade fastwrite (higher complexity)
Day 6: Upgrade pixola (highest traffic, most complex)
```

The stagger catches breaking changes in low-stakes environments before they hit your highest-traffic sites.

### Creating Upgrade Tasks

When upgrading across a fleet, create a parent task and subtasks:

```
Parent: Upgrade all sites to Next.js 16
  ├── Subtask: Upgrade dannysdrinks to Next.js 16
  ├── Subtask: Upgrade llmreference to Next.js 16
  ├── Subtask: Upgrade vibereference to Next.js 16
  ├── Subtask: Upgrade fastwrite to Next.js 16
  └── Subtask: Upgrade pixola to Next.js 16
```

Each subtask should include:
- Current version (from `package.json`)
- Target version
- Known breaking changes relevant to this project
- Build and test instructions

### Common Upgrade Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Build fails after upgrade | Breaking API changes | Check migration guide, update affected code |
| Styles broken in production | CSS module changes between versions | Compare local and production builds |
| Dynamic routes return 404 | Route config format changed | Update `generateStaticParams` or route handlers |
| Images not loading | `next/image` API changes | Update Image component props |
| Middleware not executing | Middleware config format changed | Update `middleware.ts` matcher config |

## Deploy Failure Recovery

### When a Deploy Breaks

Vercel makes rollback easy — click "Promote to Production" on the previous deployment. But you also need to:

1. **Identify what broke**: Check the Vercel build logs, then the runtime logs
2. **Decide: rollback or fix forward**: If the fix is obvious and small, fix forward. If not, rollback and investigate.
3. **Communicate**: If the site is customer-facing, update any status page or monitoring channel.

### When AI-Generated Code Breaks in Production

A common scenario with vibe-coded projects: the AI makes a change that works locally but fails in production. Common causes:

- **Environment variables missing in Vercel** but present locally
- **API keys with different permissions** in production vs. development
- **Server-side code that depends on local file paths** that do not exist in the Vercel build environment
- **Dynamic imports that fail at build time** because the build environment lacks runtime dependencies

Prevention:
- Test with `vercel build` locally before pushing to main
- Keep a checklist of environment variables that must be set in Vercel for each project
- Use Vercel preview deployments (automatic on PRs) to catch issues before production

## Dependency Management

### Auditing Dependencies Across Projects

Periodically audit what versions each project is running:

```bash
# Quick audit script
for repo in pixola llmreference vibereference fastwrite; do
  echo "=== $repo ==="
  cat "$repo/package.json" | grep -E '"next"|"react"|"typescript"'
  echo ""
done
```

This reveals drift:
```
=== pixola ===
"next": "^16.0.0",
"react": "^19.0.0",
"typescript": "^5.7.0",

=== llmreference ===
"next": "^16.0.0",
"react": "^19.0.0",
"typescript": "^5.6.0",

=== vibereference ===
"next": "^15.3.0",
"react": "^19.0.0",
"typescript": "^5.7.0",
```

vibereference is still on Next.js 15 while others are on 16. This is a conscious decision or an oversight — either way, it should be tracked.

### Handling Lock File Conflicts

Lock file conflicts (`package-lock.json`, `pnpm-lock.yaml`) are the most common merge conflict in vibe-coded projects. AI agents frequently run `npm install` which updates the lock file, and concurrent agents working on the same repo create conflicting lock file changes.

Best practice:
- **Always regenerate lock files** rather than manually merging them: delete and run `npm install`
- **Pin to exact versions** in `package.json` for critical dependencies to reduce lock file churn
- **Use `npm ci`** in CI/CD instead of `npm install` — it is faster and respects the lock file exactly

## Cross-Project Monitoring

### What to Track

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Build status | Vercel dashboard | Any failure |
| Deploy duration | Vercel build logs | 2x baseline |
| Runtime errors | Vercel runtime logs | Any new error pattern |
| Core Web Vitals | Google Search Console | Below "Good" threshold |
| SSL certificate expiry | Uptime monitor | Under 14 days |

### A Fleet Dashboard

For portfolios with 5+ sites, create a simple status page that checks each site:

```bash
#!/bin/bash
# check-all-sites.sh

SITES="pixola.ai llmreference.com vibereference.com fastwrite.ai"

for site in $SITES; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$site")
  if [ "$STATUS" != "200" ]; then
    echo "ALERT: $site returned HTTP $STATUS"
  else
    echo "OK: $site"
  fi
done
```

## Coordinating Agent Deploys

When AI agents make changes across multiple projects, coordination becomes critical:

### Sequential Deploy Rule

Never have agents deploying to multiple projects simultaneously. A deploy failure in one project needs attention before starting on the next. Establish a deploy queue:

1. Agent completes work on project A, pushes to main
2. Wait for Vercel build to succeed
3. Verify the deploy (spot-check the live site)
4. Only then start work on project B

### Deploy Freeze Periods

When cutting a release or running a marketing campaign, freeze deploys to avoid unexpected breakage:

- Communicate the freeze window to all agents (in their instructions or via task management)
- Only allow critical hotfixes during the freeze
- Resume normal deploys after the freeze period ends

## Key Takeaways

- **Drift is inevitable** in polyrepo vibe-coded projects. Accept it and manage it, do not fight it.
- **Stagger upgrades** across projects. Start with the lowest-risk site, monitor, then proceed.
- **Rollback first, investigate second** when a deploy breaks in production.
- **Audit dependency versions** monthly. Track which projects are behind and whether that is intentional.
- **Sequential deploys only** when agents are working across multiple projects. Never deploy to multiple sites simultaneously.
- **Test with `vercel build` locally** to catch production-only failures before they reach customers.
