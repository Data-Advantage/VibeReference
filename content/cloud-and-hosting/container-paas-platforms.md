# Container & PaaS Platforms: Render, Railway, Fly.io, Northflank, Heroku, GKE, EKS, AKS, Coolify

[⬅️ Cloud & Hosting Overview](../cloud-and-hosting/)

If you're shipping a B2B SaaS in 2026 and your stack doesn't fit Vercel's serverless model — long-running services (workers, websockets, video transcoding), heavy backends (Django / Rails / Spring), GPU workloads, or just want full container control — you need a container PaaS or managed Kubernetes. The naive approach: spin up bare EC2; manage everything yourself. The structured approach: pick a developer-friendly PaaS (Render / Railway / Fly.io / Northflank) for most apps, or managed K8s (GKE / EKS / AKS) when scale + customization demands. The right pick depends on developer experience preferences, cost-sensitivity, and ops capacity. (See `vercel.md` for serverless / Next.js-focused; this is for everything else.)

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Render | PaaS (Heroku-like) | Free static | $7-$$ | High | Heroku replacement default |
| Railway | Modern PaaS | Trial / starter | $5+/mo + usage | Very high | Modern indie default |
| Fly.io | Edge container | Free tier | $5+/mo + usage | Very high | Edge / global multi-region |
| Heroku | Original PaaS (Salesforce) | None | $5-$$ | Medium | Legacy / migrating away |
| Northflank | Modern PaaS | Trial | $$ | High | Mid-market alternative |
| Coolify | OSS self-hosted PaaS | Free | Self-host | Very high | OSS / self-host |
| Dokku | OSS PaaS | Free | Self-host | High | OSS / Heroku-like |
| Google Kubernetes Engine (GKE) | Managed K8s | Free cluster | Cluster fee + nodes | Medium | GCP-native enterprise |
| Amazon EKS | Managed K8s | None | Cluster fee + nodes | Medium | AWS-native enterprise |
| Azure AKS | Managed K8s | Free cluster | Nodes | Medium | Azure-native enterprise |
| DigitalOcean Kubernetes | Managed K8s | None | Reasonable | High | Cost-conscious mid-market |
| Linode Kubernetes | Managed K8s | None | Reasonable | High | Cost-conscious alternative |
| Civo | Modern simple K8s | None | Reasonable | High | Modern K8s minus AWS overhead |
| Porter | K8s on AWS / GCP | Trial | $$ | Medium | K8s without complexity |
| Cloud Run (GCP) | Serverless containers | Free tier | Per-invocation | High | Serverless containers |
| Fargate (AWS) | Serverless containers | None | Per-task | Medium | AWS-native serverless containers |
| Azure Container Apps | Serverless containers | Free tier | Per-invocation | Medium | Azure-native |

The first decision is **PaaS vs Kubernetes**: PaaS (Render / Railway / Fly.io) for simplicity; managed K8s (GKE / EKS / AKS) for scale + customization. The second decision is **developer experience priority** vs **enterprise features**: indie/SMB favors PaaS UX; enterprise needs K8s flexibility.

## Decide What You Need First

### Heroku replacement — simple PaaS (the 40% case)
You have Rails / Django / Node app; want push-to-deploy; don't want infrastructure overhead.

Right tools:
- **Render** — leading Heroku replacement
- **Railway** — modern alternative
- **Fly.io** — edge-deployed
- **Heroku** itself (still works; pricier)

### Modern multi-region (the 20% case)
You need global distribution; latency matters; users worldwide.

Right tools:
- **Fly.io** — best for edge/global
- **Cloud Run** (Google) — serverless containers
- **Railway** with multi-region

### Managed Kubernetes (the 20% case)
You need K8s features; complex orchestration; multi-cluster.

Right tools:
- **GKE** — best K8s experience
- **EKS** — AWS-aligned
- **AKS** — Azure-aligned
- **DigitalOcean Kubernetes** — cost-effective
- **Civo** — modern simple

### Serverless containers (the 10% case)
You want containers without managing servers; pay-per-use.

Right tools:
- **Cloud Run** (Google) — leader
- **AWS Fargate** — AWS-native
- **Azure Container Apps**

### OSS / self-hosted (the 5% case)
Privacy / cost / control.

Right tools:
- **Coolify** — modern OSS PaaS
- **Dokku** — Docker-based PaaS
- **Self-managed K8s** — full control

### Specialty (the 5% case)
GPU workloads, edge, specific needs.

Right tools:
- **RunPod / Modal** — GPU-focused
- **Cloudflare Workers** — edge JS
- **Specific cloud services** for specific needs

## Provider Deep-Dives

### Render — Heroku replacement leader
Founded 2018. Modern PaaS; many migrated from Heroku.

Pricing in 2026: free static sites; $7+/mo for web services; $$$ for high-traffic.

Features: web services, static sites, Postgres, Redis, cron jobs, background workers, Docker support, autoscaling, env vars, deploy from Git, preview environments.

Why Render wins: best Heroku migration path; modern UX; reasonable pricing; supports many languages.

Trade-offs: not edge-distributed (single region per service); pricing climbs at scale.

Pick if: Heroku migrant; standard backend; SMB-mid scale. Don't pick if: need edge / global low-latency.

### Railway — modern indie default
Founded 2020. Modern PaaS; loved by indie devs.

Pricing in 2026: $5/mo + usage-based; pay-as-you-go.

Features: deploy from Git, Postgres / Redis / MongoDB managed, services + workers, custom domains, Docker support, modern UX.

Why Railway: best UX in PaaS category; usage-based pricing fair for small projects; modern.

Trade-offs: less enterprise-procurement-friendly; smaller scale.

Pick if: indie / startup; modern UX matters; cost-effective. Don't pick if: enterprise procurement requires brand.

### Fly.io — edge container
Founded 2017. Multi-region edge platform.

Pricing in 2026: free tier; $5+/mo + usage.

Features: deploy containers globally (35+ regions), single-binary push, Postgres, Volumes, machines (containers), Litestream replication.

Why Fly.io: best for global apps; minimal ops; modern.

Trade-offs: smaller free tier than Vercel; learning curve.

Pick if: global / multi-region needs; performance-sensitive. Don't pick if: single region works.

### Heroku — legacy original
Original PaaS. Acquired by Salesforce 2010.

Pricing in 2026: $5-15/dyno + add-ons. (Free tier eliminated 2022).

Why Heroku: established; trusted; deep ecosystem.

Trade-offs: pricier than alternatives; fewer modern features; aging product; Salesforce roadmap uncertain.

Pick if: existing Heroku app; staying for now. Don't pick if: starting fresh (Render / Railway better).

### Northflank — modern alternative
Founded 2018. Mid-market modern PaaS.

Pricing: $$ ($30+/mo).

Features: services, jobs, builds, Kubernetes-native under hood, modern UX.

Pick if: mid-market alternative to Render / Railway. Don't pick if: SMB indie (cheaper options).

### Coolify — OSS self-hosted
OSS PaaS.

Pricing: free; you host.

Features: deploy apps from Git, similar to Render/Railway, runs on your servers.

Pick if: OSS / self-host preference; cost-conscious. Don't pick if: want managed.

### Dokku — OSS classic
Long-running OSS PaaS.

Pricing: free; self-host.

Features: Docker-based; Heroku-like CLI.

Pick if: tech-comfortable; self-host; Heroku CLI familiar.

### GKE / EKS / AKS — managed Kubernetes
Cloud-native managed K8s.

Pricing in 2026:
- GKE: free cluster (Standard tier); $0.10/cluster/hour Autopilot; nodes extra
- EKS: $0.10/cluster/hour; nodes extra
- AKS: free cluster; nodes extra

Features: managed K8s control plane; automatic upgrades; integrations with cloud-native services.

Why managed K8s: scale; flexibility; portable; cloud-agnostic potential.

Trade-offs: complexity; ops burden; YAML hell; learning curve.

Pick if: enterprise scale; K8s ecosystem requirements. Don't pick if: simple app + small team (PaaS sufficient).

### DigitalOcean / Linode / Civo Kubernetes
Cost-effective managed K8s.

Pricing: $25-100/mo/cluster + nodes.

Features: managed K8s; less integrated than big-3 cloud.

Pick if: cost-priority; not on AWS/GCP/Azure. Don't pick if: need cloud-native services tightly integrated.

### Cloud Run / Fargate / Azure Container Apps
Serverless containers.

Pricing: per-invocation.

Features: deploy container; auto-scale to zero; pay only for invocations.

Why serverless containers: zero-ops; pay only when used; modern.

Trade-offs: cold starts; vendor lock-in; per-request pricing math at scale.

Pick if: bursty workloads; minimize ops; small-medium scale. Don't pick if: constant high traffic (servers cheaper).

### Porter — K8s simplicity
Manages K8s on AWS / GCP for you.

Pricing: $$ ($300-3K/mo).

Features: K8s without YAML hell; visual deployment.

Pick if: want K8s benefits without complexity. Don't pick if: have ops team for raw K8s.

## What Container Platforms Won't Do

Buying a platform doesn't:

1. **Replace good architecture.** Bad app on great platform = still bad.
2. **Eliminate ops entirely.** Even PaaS requires monitoring + decisions.
3. **Fix scaling issues.** Code doesn't scale → platform amplifies.
4. **Reduce learning curve to zero.** All platforms have quirks.
5. **Replace cloud-native services entirely.** S3 / managed DB still needed often.

The honest framing: containers + PaaS reduce ops burden; don't eliminate it. Pick the right level of abstraction for your team's capacity.

## Vercel vs Container PaaS — When to Pick Which

```text
Decision: Vercel vs container PaaS.

Pick Vercel:
- Next.js / React frontend primary
- Frontend-heavy with serverless API routes
- Bursty traffic
- Want zero ops
- Edge-first
- Frontend team's choice

Pick container PaaS (Render / Railway / Fly.io):
- Long-running backend (Rails / Django / Spring)
- WebSockets / real-time
- Background workers
- GPU workloads
- Scheduled jobs (cron)
- Need full Linux container

Pick managed K8s (GKE / EKS / AKS):
- Multi-cluster
- Custom networking
- Complex orchestration
- Microservices
- Enterprise scale

Pick serverless containers (Cloud Run / Fargate):
- Bursty container workloads
- Want pay-per-use
- Simpler than K8s

Combinations:

Frontend on Vercel + backend on Render:
- Common pattern
- Best UX for both

Frontend on Vercel + microservices on K8s:
- Enterprise; complex backend

Everything on Render:
- Simple; one platform
- For SMB

Output:
1. Architecture matrix
2. Stack alignment
3. Cost comparison
4. Migration paths
5. Long-term considerations
```

The 2026 typical SaaS stack: Next.js on Vercel + backend services on Render (or Railway) + managed Postgres. Three providers; minimal ops.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS ($0-50/mo)
- Render Free / Railway Hobby
- Managed Postgres included
- Simple; one platform

### Pattern 2: SMB B2B ($50-500/mo)
- **Render Pro** OR **Railway Pro** OR **Fly.io**
- Backend services + workers
- Managed databases

### Pattern 3: Edge / global ($50-500/mo)
- **Fly.io** for backend
- Vercel for frontend
- Multi-region

### Pattern 4: Enterprise mid-market ($1-10K/mo)
- **Northflank** OR **GKE / EKS Standard**
- Multi-service architecture
- Managed K8s for flex

### Pattern 5: Enterprise scale ($10-100K+/mo)
- **GKE / EKS** managed K8s
- Multi-cluster; multi-region
- Cloud-native services tightly integrated

### Pattern 6: Serverless-first ($cheap-burst)
- **Cloud Run** or **Fargate**
- Pay-per-use
- For bursty / unpredictable traffic

### Pattern 7: OSS / self-host ($hosting only)
- **Coolify** on Hetzner / DigitalOcean
- Self-managed; lower cost
- Engineering investment

### Pattern 8: Mixed (most common)
- **Vercel** for Next.js
- **Render / Railway / Fly.io** for backend services
- **Managed Postgres** (Neon / Supabase / RDS)
- 3-5 providers; minimal ops

## Decision Framework: Three Questions

1. **What's your app type?**
   - Next.js frontend + light API → Vercel
   - Long-running backend → Render / Railway
   - Multi-region edge → Fly.io
   - Enterprise multi-service → K8s

2. **What's your scale + budget?**
   - <$10/mo → free tiers
   - $10-500/mo → Render / Railway / Fly.io
   - $500-5K → multiple PaaS or starter K8s
   - $5K+ → managed K8s

3. **What's your ops capacity?**
   - 0-1 engineers → PaaS
   - Small ops team → cloud-native services
   - Dedicated ops / DevOps → K8s

## Verdict

For 30% of B2B SaaS in 2026 needing container platform: **Render** for Heroku replacement.

For 20%: **Railway** for modern indie default.

For 15%: **Fly.io** for edge / global.

For 15%: **GKE / EKS / AKS** for enterprise K8s.

For 10%: **Cloud Run / Fargate** for serverless containers.

For 5%: **Northflank** for mid-market modern.

For 5%: **Coolify / Dokku** for OSS self-host.

The mistake to avoid: **K8s when PaaS would do**. Massive ops burden; small team drowns. Stay PaaS until you can't.

The second mistake: **Heroku at scale**. Pricier than alternatives; aging product. Migrate.

The third mistake: **mixing too many platforms**. 5+ providers = integration nightmare. Consolidate where possible.

## See Also

- [Vercel](./vercel.md) — Next.js-focused (companion)
- [Vercel Functions](./vercel-functions.md) — Vercel serverless
- [Vercel Sandbox](./vercel-sandbox.md) — Vercel sandboxed code
- [AWS](./aws.md) — AWS overview
- [Google Cloud](./google-cloud.md) — GCP
- [Azure](./azure.md) — Azure
- [Cloudflare](./cloudflare.md) — edge platform
- [Cloudflare Workers vs Vercel Edge](./cloudflare-workers-vs-vercel-edge.md) — comparison
- [Fly.io](./fly-io.md) — Fly.io deep-dive
- [Database Providers](../backend-and-data/database-providers.md) — managed databases
- [Container Registry Providers](../devops-and-tools/container-registry-providers.md) — registries
- [CI/CD Providers](../devops-and-tools/cicd-providers.md) — CI/CD
- [Internal Developer Platforms](../devops-and-tools/internal-developer-platforms.md) — Backstage / Port
- [VibeWeek: Multi-Region Deployment](https://vibeweek.dev/6-grow/multi-region-deployment-chat) — multi-region
- [VibeWeek: Graceful Shutdown Deployments](https://vibeweek.dev/6-grow/graceful-shutdown-deployments-chat) — deploy patterns
- [VibeWeek: Preview Environments](https://vibeweek.dev/6-grow/preview-environments-chat) — preview deploys
- [VibeWeek: Performance Optimization](https://vibeweek.dev/6-grow/performance-optimization-chat) — perf
