# CDN Providers: Cloudflare, Fastly, AWS CloudFront, Bunny, Akamai, KeyCDN, Vercel

[⬅️ Cloud & Hosting Overview](../cloud-and-hosting/)

If you're building a SaaS in 2026 and trying to pick a CDN, this is the consolidated comparison. CDNs are the line item founders skip until their app loads slowly in Sydney, then panic-add Cloudflare in front of everything (correct), or pay AWS CloudFront prices for a side project (wasteful), or stack three CDNs trying to optimize each step (overengineered). Pick the right shape and CDN concerns become invisible plumbing; pick wrong and your site is either slow for half the world or paying $500/mo for a workload that should cost $20.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Cloudflare | Full platform CDN + WAF + Workers | Generous free | $20/mo (Pro) | Very high | Indie SaaS default in 2026 |
| Vercel | Bundled with Vercel deployments | Free tier | Bundled in plan | Very high | Already on Vercel |
| Bunny.net | Indie-friendly CDN | $0.005/GB pay-as-you-go | Pay-as-you-go | Very high | Cost-sensitive with high egress |
| AWS CloudFront | AWS-native CDN | 1TB/mo free first 12 mo | Pay-per-request | Medium | AWS-heavy stacks |
| Fastly | Edge-compute-focused CDN | $50 trial credit | $50/mo minimum | Medium | High-traffic with edge logic |
| Akamai | Enterprise legacy CDN | Custom | Custom | Very low | Enterprise with global presence |
| KeyCDN | Pay-as-you-go CDN | $0.04/GB | Pay-as-you-go | High | Simple use case; no commitment |
| Google Cloud CDN | GCP-native | Pay-per-request | Pay-as-you-go | Medium | GCP-heavy stacks |
| Azure Front Door | Azure-native | Custom | Pay-as-you-go | Low | Azure-heavy stacks |
| BunnyCDN Edge Storage | Combined CDN + storage | $0.01/GB storage | Combined billing | Very high | Static-site + asset hosting |
| Cloudflare R2 + CDN | Object storage with free egress | Free (limits) | $15/TB storage | Very high | High-egress with R2 |
| GitHub Pages / Netlify / Cloudflare Pages | Bundled with static hosting | Free | Bundled | Very high | Static sites only |

The first decision is **what shape of CDN need you have**. Static-asset acceleration (the 70% case), edge-compute (Fastly / Cloudflare Workers / Vercel), object-storage-with-CDN (R2 / Bunny), and enterprise-grade legacy (Akamai) are different problems with overlapping tools.

## Decide What You Need First

CDN tools are not interchangeable. Pick by traffic shape and platform fit.

### Static-asset acceleration (the 70% case for indie SaaS)
You serve mostly cacheable static assets — JS, CSS, images, fonts. You want global edge caching, DDoS protection, basic security headers.

Right tools:
- **Cloudflare** — most generous free tier; default for indie SaaS
- **Vercel** — if your app is on Vercel
- **Cloudflare Pages / Netlify** — for static-site frameworks
- **Bunny** — when egress is dominant cost

### Edge-compute + CDN (the 20% case)
You need request manipulation, A/B testing, personalization, geo-routing, or full request handling at edge.

Right tools:
- **Cloudflare Workers + CDN** — modern default
- **Vercel Functions + Routing Middleware** (per [vercel-routing-middleware](vercel-routing-middleware.md)) — bundled
- **Fastly Compute@Edge** — for VCL/WASM-heavy workloads

### Object-storage with built-in CDN (the 5% case)
You serve large user-uploaded assets — videos, big images, downloads. Egress cost dominates.

Right tools:
- **Cloudflare R2 + Cloudflare CDN** — zero egress fees (huge)
- **Bunny Edge Storage** — cheap pay-as-you-go
- **AWS S3 + CloudFront** — if AWS-heavy
- **Backblaze B2 + Cloudflare CDN** — cheap object storage with free egress

### Enterprise / regulated (the 5% case)
You have specific compliance, custom contracts, dedicated support, or specialized verticals (streaming, gaming).

Right tools:
- **Akamai** — enterprise default
- **Fastly** — modern alternative
- **CloudFront** — for AWS-mandated stacks
- Custom: Limelight, EdgeCast, etc.

For most indie SaaS in 2026: **Cloudflare for almost everything; Vercel if you're already deploying there; Bunny for cost-sensitive static / video workloads**. Skip Akamai until enterprise scale.

## Provider Deep-Dives

### Cloudflare — The Default for Indie SaaS in 2026
Cloudflare has become the indie SaaS default for good reason: generous free tier, DDoS protection, modern edge platform (Workers / R2 / Durable Objects / Queues), and global presence.

Strengths:
- Free tier is genuinely production-grade
- $20/mo Pro adds image optimization, longer cache, more features
- Workers (per [cloudflare](cloudflare.md)) for edge compute
- R2 with zero egress fees (game-changer for media)
- DDoS protection bundled
- Strong WAF
- 320+ PoPs globally
- DNS, registrar, SSL bundled

Weaknesses:
- Some enterprise features require Pro / Business / Enterprise
- Workers pricing climbs at scale
- Cloudflare-specific lock-in for some features
- Image-resizing add-on costs extra (vs Cloudinary direct)

Pick when: you''re indie SaaS / SMB and want a single platform for CDN + DNS + DDoS + edge + storage.

### Vercel — Bundled CDN for Vercel Apps
Vercel''s edge network is bundled with hosting. Zero-config CDN for Next.js / SvelteKit / Nuxt / Astro / etc.

Strengths:
- Zero-config (deploy = global CDN)
- Smart caching for ISR / Cache Components
- Global edge presence
- Bundled with Vercel pricing
- Tight integration with Vercel Functions

Weaknesses:
- Tied to Vercel-deployed apps
- Less granular control than dedicated CDN
- Egress costs roll up in Vercel pricing (can climb)

Pick when: your app is on Vercel — the CDN is already there. Add Cloudflare in front only for specific cases (custom WAF, R2 storage, etc.).

### Bunny.net — Indie-Friendly Pay-as-You-Go
Bunny.net (formerly BunnyCDN) is the indie-developer''s favorite cheap CDN. Pay-as-you-go pricing; no monthly minimum; good performance.

Strengths:
- Pay-as-you-go ($0.005-0.06/GB depending on region)
- No monthly minimum
- Bunny Stream for video
- Bunny Edge Storage (combined CDN + storage)
- Good UX
- 119+ PoPs

Weaknesses:
- Smaller community than Cloudflare
- Less feature breadth (no Workers-equivalent)
- Some PoPs less performant than Cloudflare

Pick when: you''re cost-sensitive, want pay-as-you-go billing, and don''t need edge compute.

### AWS CloudFront — AWS-Native
CloudFront is the obvious pick if your stack is on AWS. Tight integration with S3, Lambda@Edge, ACM (SSL).

Strengths:
- Native AWS integration
- Lambda@Edge for compute
- Strong CloudWatch monitoring
- 600+ PoPs
- Free tier first 12 months (1TB transfer)

Weaknesses:
- AWS-only IAM
- Pricing complexity (regional rates differ)
- Configuration via CloudFormation / Terraform — heavy DX
- Cold-start on Lambda@Edge

Pick when: AWS is your primary cloud and you want zero-config integration.

### Fastly — Edge-Compute Focused
Fastly differentiates on programmable edge. Strong VCL (Varnish Configuration Language) and Compute@Edge (WASM-based).

Strengths:
- Best-in-class for edge logic / VCL
- Real-time logging
- Strong performance
- Compute@Edge for WASM workloads
- Trusted by media / news (NYT, Stripe, GitHub historically)

Weaknesses:
- $50/mo minimum
- Steeper learning curve
- Less indie-friendly pricing
- Smaller PoP count than Cloudflare

Pick when: you have heavy edge-logic needs (personalization, A/B testing, complex caching rules) and are OK with the price floor.

### Akamai — Enterprise Legacy
Akamai is the longest-standing enterprise CDN. Massive global presence; enterprise sales-led.

Strengths:
- Largest global PoP count
- Enterprise compliance
- Strong streaming / media features
- Deep customization options

Weaknesses:
- Enterprise-priced (custom; expensive)
- Sales-led implementation (months)
- Heavy product surface
- Overkill for indie SaaS

Pick when: you''re Fortune 500, regulated industry, or have specific Akamai relationships.

### KeyCDN — Simple Pay-as-You-Go
KeyCDN is similar in shape to Bunny — simple pay-as-you-go CDN.

Strengths:
- $0.04/GB pay-as-you-go
- No monthly minimum
- Simple UX
- Strong for image / video

Weaknesses:
- Smaller PoP count
- Less feature surface than Cloudflare / Bunny

Pick when: you want a simple alternative; pricing is similar to Bunny; pick on UX preference.

### Google Cloud CDN — GCP-Native
GCP''s CDN. Tight integration with Cloud Storage, Cloud Run, GKE.

Strengths:
- Native GCP integration
- Pay-as-you-go
- Cloud Armor for security
- Premium tier routes via Google''s backbone

Weaknesses:
- GCP-only
- Smaller PoP count than Cloudflare / Akamai
- Less polished UX

Pick when: GCP is your primary cloud.

### Azure Front Door — Azure-Native
Azure''s CDN + WAF + global load-balancer combo.

Strengths:
- Native Azure integration
- WAF + DDoS bundled
- Global load-balancing

Weaknesses:
- Azure-only
- Pricing complexity
- Less mature than Cloudflare / Akamai

Pick when: Azure is your primary cloud (per [azure](azure.md)).

### Cloudflare R2 + CDN (Egress-Free Pattern)
Cloudflare R2 is S3-compatible object storage with **zero egress fees** when served via Cloudflare CDN. This is a game-changer for media-heavy SaaS.

Strengths:
- Zero egress fees (vs $0.09/GB on S3)
- Native CDN integration
- $15/TB storage
- S3-compatible API

Weaknesses:
- Cloudflare-only ecosystem
- Less feature breadth than full S3
- Some operations slower than S3

Pick when: you serve media / large files / videos at scale and want to escape S3 egress costs.

### Cloudflare Pages / Netlify / Vercel — Static Site CDNs
Bundled CDN with static-site hosting. Zero-config for static frameworks.

Strengths:
- Zero-config
- Free tiers generous
- Tight framework integration
- CI/CD bundled

Weaknesses:
- Limited to static / SSR via their platform
- Less granular CDN control
- Egress climbs at scale

Pick when: marketing site, docs site, blog — anything fully static.

## What CDNs Won''t Do

- **Replace your origin server.** CDN caches static; dynamic responses still hit origin. Architecture matters.
- **Be free at high egress.** Egress is real cost; pick CDN with zero-egress storage (R2) if media-heavy.
- **Replace WAF entirely.** Most CDNs include basic WAF; sophisticated rules need dedicated tools (per [bot-detection-providers](../devops-and-tools/bot-detection-providers.md)).
- **Be invisible to caching bugs.** Stale cache is real; have purge / cache-tag strategy.
- **Serve dynamic content fast without thought.** Cache-Control headers, ETag, edge-rules — design for dynamic content.
- **Replace observability.** Origin requests still need monitoring (per [error-monitoring-providers](../devops-and-tools/error-monitoring-providers.md)).

## Pragmatic Stack Patterns

**Indie SaaS, mostly static + dynamic API**:
- Cloudflare in front of origin
- Total: Free tier or $20/mo Pro

**Vercel-deployed Next.js app**:
- Vercel CDN bundled
- Optionally Cloudflare in front for WAF
- Total: Vercel plan + $0-20/mo Cloudflare

**Media-heavy SaaS (video, large images)**:
- Cloudflare R2 + Cloudflare CDN
- Or Bunny Edge Storage + Bunny CDN
- Total: $0.005-0.05/GB depending on volume

**AWS-heavy stack**:
- AWS CloudFront in front of S3 + ALB
- Total: pay-per-request, ~$0.085/GB first 10TB

**Edge-logic heavy**:
- Fastly + Compute@Edge
- Total: $50/mo+

**Enterprise**:
- Akamai or Fastly Enterprise
- Total: custom $$$

**Static marketing site**:
- Cloudflare Pages / Netlify / Vercel
- Total: free or bundled

## Decision Framework: Three Questions

1. **What''s your primary cloud / hosting?** → Vercel: Vercel CDN bundled. AWS: CloudFront. Else: Cloudflare.
2. **Is media / egress a major cost?** → Yes: Cloudflare R2 + CDN, or Bunny. No: Cloudflare standard.
3. **Do you need edge compute / VCL?** → Yes: Cloudflare Workers / Fastly. No: any CDN.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Cloudflare for almost everything; Vercel CDN if on Vercel; Bunny / R2 for media-heavy**. Skip Akamai until enterprise.

## Verdict

For most readers building a SaaS in 2026:
- **Default for indie SaaS / SMB**: Cloudflare.
- **Default for Vercel apps**: Vercel CDN bundled (+ Cloudflare for specific WAF needs).
- **Cost-sensitive / pay-as-you-go**: Bunny.net or KeyCDN.
- **AWS-native**: CloudFront.
- **GCP-native**: Google Cloud CDN.
- **Azure-native**: Azure Front Door.
- **Edge-logic heavy**: Cloudflare Workers or Fastly.
- **Media-heavy / video / large files**: Cloudflare R2 + CDN, or Bunny.
- **Enterprise / regulated**: Akamai.

The hidden cost in CDN choice isn''t the per-GB rate — it''s **egress lock-in**. AWS S3 egress at $0.09/GB compounds at scale; a successful media SaaS can spend $20K/mo on egress alone. Cloudflare R2''s zero-egress (when served via Cloudflare CDN) is a structural cost-saving. The discipline of designing storage + CDN as a unit matters more than any single-provider optimization.

## See Also

- [Cloudflare](cloudflare.md) — Cloudflare ecosystem deep-dive
- [Image CDN Providers](image-cdn-providers.md) — Cloudinary / Imgix / image-specific
- [File Storage Providers](file-storage-providers.md) — S3 / R2 / B2 storage layer
- [DNS Providers](dns-providers.md) — DNS sits with CDN
- [Vercel](vercel.md) — Vercel platform
- [Vercel Routing Middleware](vercel-routing-middleware.md) — gateway-lite
- [Vercel Blob](vercel-blob.md) — Vercel storage
- [AWS](aws.md) — AWS platform
- [Azure](azure.md) — Azure platform
- [Google Cloud](google-cloud.md) — GCP platform
- [API Gateway Providers](../backend-and-data/api-gateway-providers.md) — gateway layer
- [Bot Detection Providers](../devops-and-tools/bot-detection-providers.md) — WAF / bot defense
- [Error Monitoring Providers](../devops-and-tools/error-monitoring-providers.md) — observability
- [VibeWeek: Performance Optimization](https://www.vibeweek.com/6-grow/performance-optimization-chat) — implementation tactics
- [VibeWeek: Service Level Agreements](https://www.vibeweek.com/6-grow/service-level-agreements-chat) — SLA + uptime tied to CDN
- [LaunchWeek: SEO Strategy](https://www.launchweek.com/2-content/seo-strategy) — TTFB / Core Web Vitals depend on CDN

---

[⬅️ Cloud & Hosting Overview](../cloud-and-hosting/)
