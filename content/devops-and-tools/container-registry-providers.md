# Container Registry Providers: Docker Hub, GitHub Container Registry, AWS ECR, Google Artifact Registry, Harbor, Quay, JFrog

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you ship containerized apps in 2026 — Docker images for your services, Kubernetes deployments, CI/CD pipelines that build images — you need a container registry. Most indie SaaS defaults to Docker Hub (free; rate-limited and not great for private images), upgrades to GitHub Container Registry (free for public; bundled with GitHub) when image volume grows, or jumps to AWS ECR / Google Artifact Registry when running serious cloud infra. The right pick depends on whether your CI/CD lives on GitHub (GHCR), you're AWS-locked (ECR), you want self-hosted control (Harbor), or you need enterprise features like vulnerability scanning + signing (Quay / JFrog).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Docker Hub | Public + free private | Free (1 private repo) | $9/mo+ | Medium | Public-image distribution; legacy |
| GitHub Container Registry (GHCR) | GitHub-bundled | Free public; free private with caveats | Bundled | Very high | GitHub-CI workflows |
| AWS ECR | AWS-native | $0.10/GB stored + egress | Pay-per-use | Medium | AWS-locked; ECS / EKS |
| Google Artifact Registry | GCP-native | $0.10/GB | Pay-per-use | Medium | GCP-locked; GKE |
| Azure Container Registry | Azure-native | Free (basic SKU) | $5/mo Basic | Medium | Azure-locked; AKS |
| GitLab Container Registry | GitLab-bundled | Free with GitLab | Bundled | High | GitLab-CI workflows |
| Harbor | OSS self-hosted | Free OSS | $0 + ops | Very high | OSS purists; on-prem |
| Quay (Red Hat) | OSS + cloud | Free public | $30/mo+ | Medium | Enterprise OSS Red Hat / OpenShift |
| JFrog Artifactory | Universal binary mgmt | Free trial | $98/mo+ | Low | Enterprise multi-package |
| Cloudsmith | Modern multi-package | Free (low) | $79/mo+ | High | Mid-market; multi-package |
| Treescale | Modern dev-focused | Free | $9/mo+ | High | Indie; multi-cloud |
| Linode Container Registry | Linode-native | Bundled | Bundled | Medium | Linode-hosted |
| DigitalOcean Container Registry | DO-native | Free Basic (500MB) | $5/mo+ | High | DigitalOcean-hosted |
| ttl.sh | Anonymous ephemeral | Free | $0 | Very high | Disposable/dev images |

The first decision is **where your CI/CD and runtime live**. GitHub Actions → GHCR; AWS → ECR; GCP → Artifact Registry; self-hosted → Harbor. Cross-cloud stacks may benefit from independent registry (Cloudsmith / JFrog).

## Decide What You Need First

Tools are not interchangeable. Pick by stack alignment.

### GitHub-aligned (the 30% case for indie SaaS)
You use GitHub for code + Actions for CI. Want the registry in the same place.

Right tools:
- **GHCR (GitHub Container Registry)** — bundled; free for public; private bundled
- **Docker Hub** — popular but rate-limited; legacy

### AWS-aligned (the 25% case)
You run on AWS (ECS / EKS / Fargate / Lambda containers). Want IAM-integrated registry.

Right tools:
- **AWS ECR (Elastic Container Registry)** — native; integrates with ECS / EKS pull
- **AWS ECR Public** — for public images you publish

### GCP / Azure (the 15% case)
GCP → Artifact Registry; Azure → ACR.

Both are stack-native; pick by cloud.

### Self-hosted (the 10% case)
On-prem; air-gapped; principled OSS.

Right tools:
- **Harbor** (CNCF graduated) — most popular OSS choice
- **Distribution / registry:2** — minimal Docker reference impl

### Enterprise / multi-package (the 10% case)
Beyond containers: npm, PyPI, Maven, Helm, Terraform — all in one place.

Right tools:
- **JFrog Artifactory** — universal binary manager
- **Cloudsmith** — modern alternative
- **Sonatype Nexus** — older universal manager

### Public distribution (the 10% case)
You publish open-source images for the world.

Right tools:
- **Docker Hub** — most-recognized; default user pull location
- **GHCR** — modern alternative; GitHub-aligned
- **AWS ECR Public** — AWS-aligned
- **Quay.io** — Red Hat / OpenShift community

## Provider Deep-Dives

### Docker Hub — the original
The default for years; weakened by rate limits + commercial drift after 2020.

Pricing in 2026: Personal free (1 private repo; 200 pulls/6h for anonymous); Pro $11/mo (unlimited repos); Team $14/seat/mo; Business $24/seat/mo+ (with admin / SSO).

Features: image registry, automated builds, vulnerability scanning (paid), webhooks, OCI artifact support, organizations.

Why Docker Hub is still relevant: where the world pulls public images. If you publish OSS images, Docker Hub is required — even if private images live elsewhere.

Trade-offs: anonymous rate limits hurt CI builds (you'll exhaust 200 pulls/6h on a busy team); private-image pricing not great vs alternatives; Docker Inc. has been monetizing aggressively.

Pick if: publishing public images (use it as mirror); existing Docker Hub user. Don't pick if: starting fresh for private images (GHCR / ECR are cheaper).

### GitHub Container Registry (GHCR)
GitHub's registry. Closely tied to GitHub Actions; free for many use cases.

Pricing in 2026: 
- Public images: free unlimited
- Private images: 500MB free; then $0.25/GB-month storage + bandwidth
- Bundled with GitHub Pro / Team / Enterprise

Features: tightly integrated with GitHub repos + Actions, OCI artifact support, signed images, vulnerability alerts via Dependabot, fine-grained access tokens.

Why GHCR wins: zero-friction for GitHub-CI workflows. Single auth (GITHUB_TOKEN). No separate vendor.

Trade-offs: tied to GitHub (lock-in if you switch source control). Vulnerability scanning weaker than Quay / Docker Scout.

Pick if: GitHub-native stack; want simplest setup. Don't pick if: GitLab user; or want sophisticated security scanning.

### AWS ECR
AWS-native. Two flavors: ECR (private) and ECR Public.

Pricing in 2026: $0.10/GB-month storage; bandwidth $0.09/GB egress (data-transfer-out, like all AWS). Public ECR free.

Features: IAM-integrated auth, lifecycle policies (auto-delete old images), cross-region replication, image scanning (basic free; enhanced via Amazon Inspector), pull-through cache (mirror Docker Hub), KMS encryption.

Why ECR wins: ECS / EKS / Fargate pulls are zero-egress within AWS. IAM auth is rigorous. Pull-through cache mirrors Docker Hub — solves the rate-limit problem.

Trade-offs: pricing complex (storage + egress both); UX dated relative to GHCR; multi-region setup is manual.

Pick if: AWS-locked; running on ECS / EKS / Fargate. Don't pick if: not AWS-aligned.

### Google Artifact Registry
GCP-native. Replaces older Container Registry (gcr.io); also handles npm, Maven, Python, Helm.

Pricing in 2026: $0.10/GB-month storage; egress per GCP standard.

Features: multi-format (containers + npm + Maven + Helm in one), VPC-SC support, IAM auth, GKE / Cloud Run integration, vulnerability scanning, CMEK encryption.

Why Artifact Registry: GCP-native; multi-package in one tool (better than separate Container Registry).

Pick if: GCP-aligned. Don't pick if: not GCP.

### Azure Container Registry (ACR)
Azure-native. Three SKUs (Basic / Standard / Premium).

Pricing in 2026: Basic $5/mo (10 GB included); Standard $20/mo (100 GB); Premium $50/mo (500 GB) + per-GB overage.

Features: AKS integration, geo-replication (Premium), content trust, vulnerability scanning, Helm support.

Pick if: Azure-aligned. Don't pick if: not Azure.

### GitLab Container Registry
GitLab's bundled registry.

Pricing in 2026: bundled with GitLab tiers (free for self-managed; included in SaaS Free / Premium / Ultimate).

Features: tied to GitLab projects; CI/CD integration; cleanup policies; vulnerability scanning (Premium).

Pick if: GitLab user. Don't pick if: GitHub user or stand-alone.

### Harbor — OSS self-hosted leader
CNCF-graduated; most popular OSS registry.

Pricing in 2026: OSS free; commercial offerings via VMware Tanzu / Red Hat / others.

Features: full registry features, vulnerability scanning (Trivy/Clair integration), image signing (Cosign), replication between Harbors, RBAC, robot accounts.

Why Harbor: principled OSS choice; full feature parity with cloud registries; air-gap-able.

Trade-offs: ops burden (storage + scanner + db + frontend); HA setup is non-trivial.

Pick if: on-prem / air-gapped / OSS-committed; have ops capacity. Don't pick if: prefer SaaS.

### Quay (Red Hat)
Red Hat's registry. Cloud (quay.io) + on-prem (Project Quay OSS).

Pricing in 2026: quay.io free for public; $30/mo+ for private; on-prem via Red Hat Quay subscription.

Features: vulnerability scanning (Clair), image signing (Cosign), geo-replication, time-machine (rollback), automated builds.

Pick if: Red Hat / OpenShift shop; want public-image option with strong security. Don't pick if: not Red Hat-aligned.

### JFrog Artifactory
Universal binary manager. Containers + npm + PyPI + Maven + RPM + DEB + Helm + Terraform + everything.

Pricing in 2026: Free trial; Pro $98/mo+; Enterprise custom (often $50K-500K+/yr).

Features: universal package management, deep enterprise features (HA, replication, audit, SSO), JFrog X-Ray for security scanning, cloud or self-hosted.

Pick if: enterprise multi-package management. Don't pick if: indie / mid-market — overkill.

### Cloudsmith
Modern multi-package alternative to JFrog. Popular indie / mid-market choice.

Pricing in 2026: Free (low), Starter $79/mo, Pro $499/mo+, Enterprise custom.

Features: containers + npm + PyPI + Maven + Cargo + Helm + Terraform + DEB + RPM + raw, geo-distributed, vulnerability scanning, fine-grained access.

Pick if: multi-package mid-market; cheaper than JFrog. Don't pick if: containers only (overkill).

### Treescale / DigitalOcean / Linode / ttl.sh
- **Treescale** — modern indie; affordable
- **DigitalOcean Container Registry** — DO-stack
- **Linode** — Linode-stack
- **ttl.sh** — anonymous ephemeral; for dev / testing throwaways

Niche picks.

## What Container Registries Won't Do

Buying a registry doesn't:

1. **Solve image security.** Registries store; they don't audit. Vulnerability scanning is separate (and most registries integrate with scanners).
2. **Replace artifact management for non-container artifacts.** npm packages, Python wheels, etc. need their own registries (or universal manager like JFrog / Cloudsmith).
3. **Make image pulls fast across clouds.** Each cloud's registry → its own runtime is fast; cross-cloud pulls are slow + expensive (egress).
4. **Solve image signing alone.** Sigstore / Cosign + your registry = signed images. Just-using-a-registry doesn't sign.
5. **Replace your CI/CD.** Registries store; CI/CD builds + pushes. Different layer.

The honest framing: a registry is leverage on a well-defined CI/CD pipeline. Without the pipeline, the registry just collects images.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS on GitHub + Vercel ($0/mo)
- **GHCR** for any private images
- Vercel handles its own runtime; rarely need to push images
- Total: $0/mo

### Pattern 2: Indie SaaS on AWS ($0-50/mo)
- **AWS ECR** for production images
- **GHCR** for CI mirror / build cache
- Pull-through cache from Docker Hub via ECR
- Total: $0-50/mo at growth

### Pattern 3: Mid-market multi-cloud ($100-500/mo)
- **GHCR** for build artifacts
- **Per-cloud registry** (ECR / GCR / ACR) for runtime pulls (avoid egress)
- Vulnerability scanning via Snyk / Trivy / Wiz
- Total: $100-500/mo

### Pattern 4: Self-hosted on-prem ($0 + ops)
- **Harbor** with HA setup
- Trivy / Clair for scanning
- Cosign for signing
- Total: $0 + significant ops

### Pattern 5: Enterprise multi-package ($500-5K/mo)
- **JFrog Artifactory** OR **Cloudsmith**
- Universal package manager
- X-Ray / built-in scanning
- Full audit / RBAC / SSO

### Pattern 6: Public OSS distribution
- **Docker Hub** primary (where users pull)
- **GHCR** mirror (CI source of truth)
- **AWS ECR Public** mirror (AWS-aligned users)

## Decision Framework: Three Questions

1. **Where does your CI/CD live?**
   - GitHub Actions → GHCR (zero-friction)
   - GitLab CI → GitLab Container Registry
   - CircleCI / Jenkins / standalone → cloud-native or Harbor

2. **Where do images get pulled?**
   - AWS ECS/EKS → ECR (zero-egress)
   - GKE → Artifact Registry
   - AKS → ACR
   - Multi-cloud → per-cloud mirror

3. **Public or private?**
   - Public OSS distribution → Docker Hub primary
   - Private → cloud-native or GHCR
   - Both → use multiple

## Verdict

For 40% of indie / mid-market SaaS in 2026: **GHCR**. Free for GitHub workflows; one less vendor; integrates seamlessly with GitHub Actions. The pragmatic default for GitHub-aligned teams.

For 25%: **AWS ECR**. When AWS-locked and pulling to ECS / EKS / Fargate. Native auth + zero-egress within AWS.

For 15%: **Google Artifact Registry** or **Azure Container Registry**. Cloud-native equivalents.

For 10%: **Harbor** for OSS / on-prem / principled-OSS shops with ops capacity.

For 5%: **JFrog** or **Cloudsmith** for multi-package enterprise needs.

For 5%: **Docker Hub** (often as a mirror) when publishing public images for community pulls.

The mistake to avoid: **using Docker Hub as production private registry**. Pricing isn't compelling vs cloud-native alternatives; rate limits hurt CI; and you're paying for distribution-level service you don't need. Switch to GHCR / ECR / your cloud's registry.

The second mistake: **cross-cloud egress charges from registry pulls**. Pulling 5 GB images from us-east-1 to GCP every deploy = $0.45 per pull × thousands of deploys = surprise $1K/mo bill. Mirror to your cloud's registry; pull from there.

## See Also

- [CI/CD Providers](./cicd-providers.md) — registries pair with CI/CD
- [Cloud and Hosting: AWS](../cloud-and-hosting/aws.md) — AWS ECR context
- [Cloud and Hosting: Google Cloud](../cloud-and-hosting/google-cloud.md) — Artifact Registry context
- [Cloud and Hosting: Azure](../cloud-and-hosting/azure.md) — ACR context
- [GitHub](./github.md) — GHCR is GitHub-bundled
- [Application Security Tools](./application-security-tools.md) — image vulnerability scanners
- [Code Quality Platforms](./code-quality-platforms.md) — scanning + signing chain
- [Database Migration Tools](../backend-and-data/database-migration-tools.md) — migrations also live in CI/CD
- [VibeWeek: Preview Environments](https://vibeweek.dev/6-grow/preview-environments-chat) — preview-env images need registry
- [VibeWeek: Multi-region Deployment](https://vibeweek.dev/6-grow/multi-region-deployment-chat) — registry replication strategies
