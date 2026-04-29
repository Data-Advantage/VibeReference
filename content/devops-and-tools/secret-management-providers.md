# Secret Management Providers: Doppler, Infisical, 1Password, Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, Bitwarden, Pulumi ESC

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a SaaS in 2026 and trying to pick a secret manager, this is the consolidated comparison. Secrets are the line item that looks like a $0 problem until a `.env` file leaks to a public repo, an ex-employee still has prod credentials three months later, or a breach turns into a sleepless week of rotation. Most indie SaaS over-invest in DIY (env files in 1Password vault, copy-paste workflows) until something goes wrong, then rush a deployment to Vault and regret the operational complexity. Pick the right shape and secret management is invisible; pick wrong and it's a constant tax on every deploy.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Doppler | SaaS-first | Free (5 users / 3 projects) | $4/user/mo | No | Very high | Default for indie SaaS in 2026 |
| Infisical | OSS + SaaS | Free (5 users) | $8/user/mo | Yes (MIT) | Very high | OSS-leaning teams that want self-host option |
| 1Password Secrets Automation | Vault-extended | None | $7.99/user/mo (developer add-on) | No | High | Teams already on 1Password |
| Bitwarden Secrets Manager | OSS + SaaS | Free (individuals) | $6/user/mo | Yes (GPL) | High | Budget OSS teams already on Bitwarden |
| HashiCorp Vault | Enterprise | Free (OSS Community) | Custom (Enterprise) | Yes (BUSL) | Low | Mid-market+ that needs dynamic secrets |
| AWS Secrets Manager | Cloud-native | None | $0.40/secret/mo + $0.05/10K calls | No | Medium | Teams fully on AWS |
| GCP Secret Manager | Cloud-native | 6 versions / 10K access free | $0.06/secret/mo + $0.03/10K calls | No | Medium | Teams fully on GCP |
| Azure Key Vault | Cloud-native | None | $0.03/10K ops + cert/key fees | No | Low | Teams fully on Azure |
| Akeyless | Vaultless / SaaS | Free (3 clients) | Custom | No | Medium | Multi-cloud teams that don't want Vault ops |
| Pulumi ESC | Config + secrets | Free (Individual) | Bundled with Pulumi Team | Partial | High | Teams already using Pulumi for IaC |
| Vercel env + OIDC | Platform-native | Free with Vercel | Bundled with Vercel plan | N/A | Very high | Vercel-only stacks; pair with Doppler for sync |
| GitHub Actions Secrets | CI-only | Free with GitHub | Bundled | N/A | Medium | Single-CI use case only — not a full secret manager |
| .env files in git | Don't | "Free" | High after the breach | N/A | Catastrophic | Skip — this is how secrets leak |

The first decision is **what shape of secret management you actually need**. A solo founder with five secrets and one deployment target needs something different from a 10-person team running multi-cloud with rotating database credentials. Most indie SaaS need exactly one tool; some need two (e.g., Doppler for app secrets + Vercel env for the platform layer).

## Decide What You Need First

Secret managers are not interchangeable. Get this part wrong and you'll either underpay for a tool you outgrow in 6 months or overpay for capacity that no one in your company can operate.

### App-secrets-as-a-service (the 70% case for indie SaaS)
You want a tool that holds env vars, syncs them to your local dev / CI / production environments, supports multiple environments (dev / staging / prod), and lets you rotate without redeploying. No dynamic secrets, no PKI, no certificate authority.

Right tools:
- **Doppler** — simplest, cleanest indie experience
- **Infisical** — same shape, OSS option
- **1Password Secrets Automation** — if you already use 1Password
- **Bitwarden Secrets Manager** — if you already use Bitwarden

### Dynamic secrets (when "rotation" must mean "issued per request")
You want secrets that don't exist until the moment a service requests them — short-lived database credentials, on-demand IAM roles, ephemeral SSH keys. This is enterprise territory; setup overhead is significant.

Right tools:
- **HashiCorp Vault** (Enterprise) — the canonical choice
- **Akeyless** — vaultless alternative; less ops overhead
- **AWS Secrets Manager** with rotation Lambdas — for AWS-only stacks

### Cloud-native, single-cloud (when you're 100% on one hyperscaler)
You're fully on AWS, GCP, or Azure and want secret management that integrates natively with your IAM, your services, and your billing. The tradeoff is lock-in and per-secret pricing.

Right tools:
- **AWS Secrets Manager** for AWS shops
- **GCP Secret Manager** for GCP shops
- **Azure Key Vault** for Azure shops

### Platform-bundled (when your platform handles it)
You're on Vercel, Cloudflare, Fly, or Railway. The platform's environment variable system is the floor; you can stop there for v1 if your secret count is small.

Right tools:
- **Vercel env + Vercel OIDC** for Vercel deployments
- **Cloudflare Workers Secrets** for Cloudflare
- **Fly.io secrets** for Fly
- Plus a sync tool (Doppler / Infisical) when env count grows past ~30

For most indie SaaS in 2026: **Doppler if you want SaaS, Infisical if you want OSS-with-self-host-option**. Skip Vault until you have a real reason. Skip plain `.env` files in git entirely.

## Provider Deep-Dives

### Doppler — The Indie Default
Doppler is the cleanest secret manager for indie SaaS in 2026. Generous free tier, sane pricing, fast UX, broad integrations. The product is opinionated in the right places.

Strengths:
- Free tier covers most early-stage indie use cases (5 users, 3 projects)
- Excellent CLI and dashboard UX
- Strong integrations: Vercel, Cloudflare, Fly.io, Railway, AWS, GCP, GitHub Actions, Vercel
- Per-environment branching (dev / staging / prod with promotion flow)
- Personal config layer for developer-specific overrides
- Activity logs and access controls
- Service tokens with explicit scopes

Weaknesses:
- Cloud-only; no self-host
- No dynamic secret generation
- $4/user/mo adds up at 20+ engineers
- Audit log retention is shorter on lower tiers

Pick when: you want SaaS-first secret management without operational overhead and your secret count grows past what's reasonable to manage in platform env vars.

### Infisical — OSS-First, SaaS-Available
Infisical is the open-source counterpart to Doppler. MIT-licensed, fully self-hostable, with a hosted SaaS for teams that don't want to run their own. Has matured rapidly through 2025–2026.

Strengths:
- MIT license — no AGPL or proprietary lock-in
- Truly self-hostable (Postgres + Redis + Docker)
- Free hosted tier (5 users)
- Auto secret rotation supported (Postgres credentials, AWS IAM keys)
- PKI / certificate management bundled
- Active development; growing community
- Strong CLI and SDKs

Weaknesses:
- Smaller integration ecosystem than Doppler (still solid, but newer)
- Self-host setup requires DevOps capacity
- UX is competent but slightly behind Doppler's polish
- Per-user pricing on hosted ($8/user/mo) gets expensive

Pick when: you want OSS for license / sovereignty reasons OR you want the option to self-host without committing to it day one.

### 1Password Secrets Automation — Vault Extended
1Password's developer offering extends the team password vault into a server-side secrets API. Best fit for teams that already use 1Password for human passwords and want one tool, not two.

Strengths:
- Single bill alongside 1Password Teams / Business
- Native CLI (`op`) is excellent for local development
- Strong audit logging through the existing 1Password audit pipeline
- Service accounts for CI/CD
- Vercel, GitHub Actions, Kubernetes integrations
- Most developer-friendly password manager already

Weaknesses:
- No free tier
- Per-user pricing scales the same way Doppler / Infisical do
- Less purpose-built for application secrets than Doppler — feels bolted on
- No dynamic secrets

Pick when: your team already uses 1Password for human credentials and you want to consolidate.

### Bitwarden Secrets Manager — Budget OSS
Bitwarden launched Secrets Manager in 2023 as a developer counterpart to its password manager. GPL-licensed, fully self-hostable, cheaper than 1Password, gaining traction.

Strengths:
- GPL OSS; self-hostable
- Cheaper than 1Password ($6/user/mo vs $7.99)
- Multi-language SDKs (TypeScript, Python, Go, .NET, Java, Ruby, PHP, Rust)
- Inherits Bitwarden's security architecture (zero-knowledge encryption)
- Strong fit for cost-conscious teams already on Bitwarden

Weaknesses:
- Younger product than Doppler / 1Password
- No dynamic secrets
- Smaller ecosystem of integrations
- UX less polished than Doppler

Pick when: you want OSS, you already use Bitwarden for human passwords, and price is a primary factor.

### HashiCorp Vault — The Enterprise Option
Vault is the canonical enterprise secret manager. Powerful, complex, expensive to operate. The license changed to BUSL in 2023 (no longer pure OSS); the free Community Edition still exists but enterprise features are paid.

Strengths:
- Most powerful secret manager in this list
- Dynamic secrets (DB credentials issued on demand, expiring automatically)
- PKI / certificate authority built in
- Transit encryption-as-a-service
- Mature; battle-tested at scale
- Broad integration ecosystem
- Strong RBAC, namespaces, audit

Weaknesses:
- Operationally heavy — running it well is a full-time job
- BUSL license confuses some legal teams (forks like OpenBao address this)
- Enterprise pricing is opaque and high
- Overkill for indie SaaS
- Cloud version (HCP Vault Secrets) is friendlier but pricier than Doppler

Pick when: you have dynamic-secrets requirements, you have a platform team, or you're at the scale where Vault's expressiveness outweighs its operational cost.

### AWS Secrets Manager — Cloud-Native AWS
AWS Secrets Manager is the AWS-native option. Tight integration with IAM, Lambda, RDS, and ECS. Per-secret pricing makes it expensive at scale; free tier is nonexistent.

Strengths:
- First-class AWS IAM integration
- Native rotation Lambdas (DB credentials, OAuth tokens)
- Audit via CloudTrail
- KMS-encrypted by default
- No additional infra to run

Weaknesses:
- $0.40 per secret per month adds up fast (1,000 secrets = $400/mo)
- AWS-only; not a fit for multi-cloud
- API call costs add up at high read volume
- Less developer-friendly UX than Doppler
- No personal/dev-environment workflows

Pick when: you're 100% on AWS, you have moderate secret count (under 100), and you want everything in one IAM model.

### GCP Secret Manager — Cloud-Native GCP
GCP Secret Manager is GCP's native option. Cheaper than AWS at small scale, with a real free tier (6 versions, 10K access operations).

Strengths:
- Real free tier
- Cheaper than AWS Secrets Manager at small scale ($0.06/secret/mo vs $0.40)
- Native integration with GCP IAM, Cloud Run, GKE, Cloud Functions
- Versioning is first-class
- Audit via Cloud Audit Logs

Weaknesses:
- GCP-only
- No native rotation (you build it with Cloud Functions)
- Smaller ecosystem of third-party integrations
- Less feature-rich than AWS Secrets Manager (no built-in rotation)

Pick when: you're on GCP and want the cheapest reasonable cloud-native option.

### Azure Key Vault — Cloud-Native Azure
Azure Key Vault is Azure's native option. Strong on certificate management; weaker on developer ergonomics for application secrets.

Strengths:
- Native Azure AD integration
- Strong PKI / certificate management
- HSM-backed key storage
- Compliance certifications (SOC, ISO, FedRAMP)

Weaknesses:
- Azure-only
- Pricing model is more complex (operations + key fees + cert fees)
- Developer UX lags AWS / GCP
- Less integration with the indie SaaS ecosystem

Pick when: you're on Azure (often required by enterprise customers' procurement) and need certificate management alongside secrets.

### Akeyless — Vaultless Without Vault Ops
Akeyless markets itself as "Vault without the operational overhead." Hosted multi-cloud secret manager with dynamic secrets, certificate management, and just-in-time access.

Strengths:
- Multi-cloud first-class
- Dynamic secrets without running Vault
- Strong RBAC and zero-trust model
- Good for hybrid-cloud / regulated environments

Weaknesses:
- Pricing opaque (custom for anything serious)
- Smaller community than Doppler / Vault
- Less indie-focused
- Sales-led for non-trial use

Pick when: you need Vault-level capability, you're multi-cloud, and you don't want to run Vault yourself.

### Pulumi ESC — Config + Secrets for IaC Teams
Pulumi Environments, Secrets, and Configurations (ESC) is Pulumi's secret management product. Tightly integrated with Pulumi infrastructure-as-code; useful even outside of Pulumi.

Strengths:
- First-class IaC integration if you use Pulumi
- Dynamic credential issuance via OIDC to AWS, GCP, Azure
- Free tier for individuals
- Composable environments (inheritance and overrides)
- Works as a generic secret store outside Pulumi too

Weaknesses:
- Best fit if you're already using Pulumi
- Smaller ecosystem of third-party integrations
- Less mature standalone-secret-manager UX than Doppler

Pick when: you use Pulumi for IaC and want secrets in the same control plane.

### Vercel env + Vercel OIDC — Platform-Native
Vercel ships environment variable management as part of the platform. With OIDC tokens (introduced 2024), Vercel functions can request short-lived AWS / GCP / Azure credentials without storing static keys.

Strengths:
- Bundled with Vercel — no extra bill
- Per-environment, per-branch overrides
- OIDC issuance to cloud providers — no static cloud credentials needed
- First-class with Next.js, Vite, SvelteKit, Astro
- Encrypted at rest, decrypted only at deploy time

Weaknesses:
- Vercel-only — not a multi-platform tool
- No dynamic non-cloud secrets (no DB credential rotation)
- UI optimized for tens of secrets, not hundreds
- No personal-developer overrides (everyone shares dev env vars)

Pick when: you're Vercel-only and your secret count is small. Pair with Doppler / Infisical when env count grows past ~30 or you want a dev-time workflow.

### GitHub Actions Secrets — CI-Only
GitHub Actions Secrets are NOT a full secret manager. They're scoped to CI workflows and have no story for runtime secret access.

Use when: you have one or two CI-only secrets (NPM_TOKEN, DOCKER_PASSWORD).

Don't use when: you need runtime secrets, multi-environment management, or anything beyond CI variables.

### .env Files in Git — The Anti-Pattern
Don't. `.env` files in `.gitignore` are fine for local development. `.env` files committed to git are how breaches happen.

If you have secrets in git history right now: rotate everything, then use BFG Repo-Cleaner or `git filter-repo` to scrub history. Treat the leaked secrets as compromised, not "private repo so it's fine."

## What Secret Management Won't Do

- **Replace IAM.** Secret managers store credentials; they don't grant authorization. Use [auth providers](../auth-and-payments/auth-providers.md) for human auth and IAM for machine auth.
- **Rotate things automatically.** Most tools support rotation but you have to wire it up. Free DB credential rotation is a Vault / Akeyless thing, not a Doppler thing.
- **Detect leaked secrets.** That's what GitHub Secret Scanning, GitGuardian, and TruffleHog are for. Pair these with your secret manager.
- **Encrypt your application data.** Secrets are different from application data. Use [database providers](../backend-and-data/database-providers.md) with TDE / column-level encryption for that.
- **Survive a key compromise.** When a master key leaks, you rotate everything. The secret manager just makes that survivable.

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / SvelteKit / Astro on Vercel**:
- Vercel env + Vercel OIDC for runtime
- Doppler or Infisical for dev workflow + multi-environment management
- Total: $0–$8/user/mo

**Indie SaaS already on 1Password Teams**:
- 1Password Secrets Automation (one bill, one tool)
- Total: $7.99/user/mo (already paying)

**Multi-cloud / no platform lock-in**:
- Doppler or Infisical (cloud-agnostic by design)
- Cloud-native managers (AWS / GCP) only for cloud-IAM-bound secrets
- Total: $4-8/user/mo

**OSS-first / data sovereignty**:
- Infisical (self-hosted)
- Bitwarden Secrets Manager (self-hosted)
- Total: infrastructure cost only

**Enterprise / dynamic secrets**:
- HashiCorp Vault (Enterprise) or Akeyless
- Plan multi-month rollout; budget for the platform team
- Total: high four to low five figures per month

**100% on AWS**:
- AWS Secrets Manager + Parameter Store for non-secret config
- Doppler optionally as a dev-workflow layer
- Total: $0.40/secret/mo

## Decision Framework: Three Questions

1. **Are you 100% on one cloud and OK with lock-in?** → Yes: cloud-native (AWS / GCP / Azure). No: Doppler / Infisical.
2. **Do you need dynamic secrets (DB credentials issued on demand, expiring)?** → Yes: Vault or Akeyless. No: any standard SaaS.
3. **Do you want OSS / self-host?** → Yes: Infisical or Bitwarden. No: Doppler or 1Password.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Doppler if you don't care about OSS; Infisical if you do**. Don't run Vault until you've outgrown SaaS.

## Verdict

For most readers building a SaaS in 2026:
- **Default**: Doppler (free tier covers most indies; $4/user/mo as you grow).
- **OSS / self-host wanted**: Infisical (MIT-licensed; hosted or self).
- **Already on 1Password**: 1Password Secrets Automation.
- **Already on Vercel**: Vercel env + OIDC, then add Doppler when env count grows.
- **AWS-only**: AWS Secrets Manager.
- **GCP-only**: GCP Secret Manager.
- **Dynamic secrets / enterprise**: Vault Enterprise or Akeyless.
- **Pulumi shop**: Pulumi ESC.

The hidden cost in secret management isn't the tool — it's **secrets leaking to logs, repos, and Slack messages**. A perfect tool can't help if your team's culture is to paste env vars in a Slack channel during incidents. Pair the tool with secret-scanning (GitGuardian, GitHub Secret Scanning, TruffleHog), pre-commit hooks, and a quarterly "rotate everything that's been static for >12 months" discipline. The tool is the easy part.

## See Also

- [CI/CD Providers](cicd-providers.md) — secrets get injected into builds here
- [Observability Providers](observability-providers.md) — make sure logs aren't capturing secrets
- [Auth Providers](../auth-and-payments/auth-providers.md) — human auth (Clerk, Supabase, Better Auth) is a different problem
- [Vercel Functions](../cloud-and-hosting/vercel-functions.md) — Vercel env and OIDC integrate here
- [Database Providers](../backend-and-data/database-providers.md) — DB credentials are the most common secret to rotate
- [Error Monitoring Providers](error-monitoring-providers.md) — make sure your error tool isn't logging request bodies that contain secrets

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
