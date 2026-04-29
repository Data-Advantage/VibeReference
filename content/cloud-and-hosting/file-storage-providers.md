# File Storage and CDN Providers: Vercel Blob, Cloudflare R2, AWS S3, Backblaze B2, Bunny CDN, Cloudinary, Uploadcare

[⬅️ Cloud & Hosting Overview](../cloud-and-hosting/)

If you're building a SaaS in 2026 and trying to pick where user uploads, marketing assets, and AI-generated files live, this is the consolidated comparison. Get the egress fee math wrong and your "cheap" object storage costs $400/month. Pick wrong on the upload pipeline and your customers wait 6 seconds for a thumbnail to render.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Egress | Storage / GB | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Vercel Blob | Object storage | Vercel-native, public + private | Free → tiered | $0.023/GB | High | Vercel-native projects |
| Cloudflare R2 | Object storage | Zero egress fees | Free | $0.015/GB | Very high | Apps with high egress |
| AWS S3 | Object storage | Maturity, ecosystem | $0.09/GB out | $0.023/GB | Low | Enterprise-deep AWS teams |
| Backblaze B2 | Object storage | Cheap storage, low egress with Cloudflare partnership | $0.01/GB out (free via Cloudflare CDN) | $0.006/GB | Very high | Cost-conscious, Cloudflare-paired |
| Cloudflare Images | Image-specific | Built-in transforms + delivery | Bundled | $5 / 100K images stored | Very high | Image-heavy products |
| Cloudinary | Image / video pipeline | Transforms, optimization, AI features | Bundled | $99+/mo | Medium | Marketing-heavy media workflows |
| Uploadcare | Upload + delivery + CDN | Upload UX, file pipeline | Bundled | $0 → $39/mo+ | High | User-uploaded media flows |
| Bunny CDN | CDN + storage | Cheap CDN delivery | $0.01-$0.04/GB | $0.01/GB | Very high | Video / asset delivery |
| Mux | Video specific | Video upload + transcode + delivery | Per minute | Per asset | Medium | Video-heavy products |
| ImgIX / Imgix | Image transform CDN | On-the-fly image transforms in front of your bucket | Bundled with origin | Per image processed | Medium | Existing S3/R2 + transform layer |
| BunnyOptimizer | Image optimizer in front of CDN | Cheap image transforms | $0.005/optimization | $0.01/GB storage | High | Bunny-stack apps wanting transforms |
| GCS / Azure Blob | Cloud-provider object storage | GCP / Azure integration | Tiered | ~$0.02/GB | Low | GCP / Azure-deep teams |

The first decision is **what kind of files**. User uploads (avatars, documents, files), marketing assets (images, video), AI-generated content (images, video, audio), or static site assets. Each shape has a best-in-class tool; one-size-fits-all answers usually overspend.

## Categorize the Files First

### User uploads (avatars, documents, files)
Customer signs up, uploads a profile photo or attaches a file to a record. Typical volumes: small files, low to moderate volume per customer.

Right tools:
- **[Vercel Blob](vercel-blob.md)** — easiest if on Vercel, public + private, no extra vendor relationship
- **Cloudflare R2** — cheap, S3-compatible, zero egress
- **Uploadcare** — best DX for upload widget if you want a hosted picker
- **AWS S3** — if you're on AWS and need maturity

For most indie SaaS in 2026 on Vercel: Vercel Blob. For Cloudflare-stack apps: R2.

### Marketing assets (homepage images, hero images, og-images)
Site assets you serve to lots of visitors. High-egress, image-optimization-friendly.

Right tools:
- **Vercel Blob** + Next.js `<Image>` (auto-optimization included on Vercel)
- **Cloudflare Images** — bundled transforms + global CDN
- **Cloudinary** — most polished, expensive at scale
- **Bunny CDN + Bunny Optimizer** — cheap and fast

### AI-generated content (images, video, audio)
The product generates output via Replicate / OpenAI / Anthropic / fal / Hugging Face / etc. and stores it. Output volumes can scale fast; some has long-term value, some is ephemeral.

Right tools:
- **Cloudflare R2** — cheapest at scale, zero egress
- **Vercel Blob** — easiest if on Vercel
- **Backblaze B2** + Cloudflare CDN — cheapest combo
- **Mux** for AI-generated video specifically

### Video uploads + delivery
Customer uploads video; you store, transcode, deliver.

Right tools:
- **Mux** — purpose-built for video, includes transcode + adaptive streaming
- **Cloudflare Stream** — Cloudflare-native, simpler pricing
- **Bunny Stream** — cheap, decent quality
- **Vimeo OTT / api.video** — alternatives

### Static site assets (CSS, JS, fonts)
Your framework (Next.js, Astro, etc.) handles this; the deployment platform's CDN serves it. Don't overthink.

Right tools:
- Whatever your framework / deployment platform provides (Vercel, Netlify, Cloudflare Pages, etc.)
- Skip dedicated CDN unless you have very specific needs

## Provider Deep-Dives

### Vercel Blob — Vercel-Native Object Storage
[Vercel Blob](vercel-blob.md) is Vercel's object storage. Public AND private storage as of 2025+ updates. S3-compatible API. Bundled with Vercel deployments.

Strengths:
- Zero auth setup if you're on Vercel
- Public + private storage in one product
- Integrates with Next.js `<Image>` for auto-optimization on public assets
- Predictable pricing tied to Vercel platform usage
- Works seamlessly with [Vercel Functions](vercel-functions.md) and [Vercel Workflow](vercel-workflow.md)

Weaknesses:
- Vercel-stack lock-in
- Egress charged per Vercel pricing tier
- Less expressive than R2/S3 for advanced use cases (lifecycle policies, multi-region)

Pick Vercel Blob when: Vercel-native, want one less vendor relationship, simple file storage needs.

### Cloudflare R2 — Zero-Egress Object Storage
R2 is Cloudflare's S3-compatible object storage. The killer feature: zero egress fees. You're charged only for storage and operations.

Strengths:
- Zero egress fees (vs S3's $0.09/GB which dominates costs)
- S3-compatible API (existing tools work unchanged)
- Cheap storage ($0.015/GB)
- Pairs well with Cloudflare Workers
- Generous free tier (10 GB storage, 1M requests/mo)

Weaknesses:
- Cloudflare-only platform; multi-region routing different from S3
- Newer than S3; ecosystem still building
- Some advanced S3 features (Glacier-equivalent, Object Lock) are missing or different

Pick R2 when: high-egress workload (video, AI media, downloads), cost-sensitive, S3-compatible APIs important.

### AWS S3 — The Mature Default
S3 has been the object-storage incumbent for ~20 years. Mature, deep ecosystem, infinite features.

Strengths:
- Most complete feature set (lifecycle, versioning, replication, Glacier tiers, Object Lock, etc.)
- Vast ecosystem of integrations
- Mature SDKs in every language
- Reliable at any scale
- Strong IAM / security primitives

Weaknesses:
- Egress is expensive ($0.09/GB out — this is what kills many indie projects)
- Pricing complexity (request charges, storage class transitions, lifecycle ops)
- Brings AWS operational complexity

Pick S3 when: AWS-deep team, enterprise contracts, need specific S3 features (Glacier, Object Lock, etc.).

### Backblaze B2 — Cheapest Storage
Backblaze B2 is the cheapest object storage in the market. Pairs natively with Cloudflare via the "Bandwidth Alliance" — egress to Cloudflare is free.

Strengths:
- Cheapest storage ($0.006/GB; less than half of R2 / S3)
- Free egress to Cloudflare (so use Cloudflare as CDN in front; net cost is dominated by storage)
- S3-compatible API
- Generous free tier (10 GB storage, 1 GB/day egress)

Weaknesses:
- Smaller community / ecosystem than R2 / S3
- Direct egress to non-Cloudflare destinations is $0.01/GB
- Less feature-rich than S3

Pick B2 when: cost-conscious, willing to pair with Cloudflare CDN, basic storage needs.

### Cloudflare Images — Image-Specific
Cloudflare Images is purpose-built for image storage + delivery. Bundles upload + transforms + CDN delivery.

Strengths:
- Single product covers upload to delivery
- On-the-fly transforms (resize, crop, format conversion to WebP/AVIF)
- Cheap pricing ($5 / 100K images stored, plus delivery tiers)
- Global CDN included

Weaknesses:
- Images only (not generic objects, not video)
- Transform options less rich than Cloudinary
- Cloudflare-stack lock-in

Pick Cloudflare Images when: image-heavy product, want bundled storage + transforms + CDN, cheap.

### Cloudinary — Premium Image / Video Pipeline
Cloudinary is the most polished image + video pipeline. Transforms, optimization, AI tagging, watermarks, etc.

Strengths:
- Most feature-rich transforms
- AI features (background removal, auto-tagging, smart cropping)
- Mature, broad ecosystem
- Strong DX with SDKs everywhere
- Programmable transformations via URL

Weaknesses:
- Expensive ($99+/mo for the lowest "real" plan; usage-based above)
- Pricing scales fast at high volume
- Locks media metadata into their format

Pick Cloudinary when: marketing-heavy media workflows, need best-in-class transforms, willing to pay.

### Uploadcare — Upload Widget + Pipeline
Uploadcare ships an excellent upload widget plus storage + delivery + transforms. Strong DX for the upload UX specifically.

Strengths:
- Best-in-class upload widget (drag-drop, multi-file, progress, validation)
- Image transforms + adaptive delivery
- Generous free tier (3 GB/mo)
- Good for user-uploaded media specifically

Weaknesses:
- Smaller ecosystem than R2/S3/Vercel Blob
- Pricing scales with traffic
- Less suitable for high-volume programmatic storage

Pick Uploadcare when: user-uploaded media is core flow, value the polished upload UX, willing to pay for it.

### Bunny CDN + Bunny Storage — Cheap, Fast
Bunny CDN is the indie-friendly CDN. Cheap, fast, simple pricing. Bunny Storage is the paired object storage.

Strengths:
- Cheap CDN delivery ($0.01-$0.04/GB depending on region)
- Bunny Optimizer adds image transforms ($0.005/optimization)
- Bunny Stream adds video delivery
- Simple, transparent pricing
- Strong indie reputation

Weaknesses:
- Smaller than Cloudflare; PoPs vary by region
- Less feature-rich than Cloudfront / Cloudflare
- DX OK but not best-in-class

Pick Bunny when: cost-sensitive, indie scale, willing to manage a slightly less polished tooling.

### Mux — Video Specific
Mux is purpose-built for video. Upload, transcode, adaptive streaming, analytics, video-on-demand and live.

Strengths:
- Best-in-class video pipeline
- Adaptive bitrate streaming out of the box
- Mux Data for video analytics
- Strong DX (SDKs in every language)

Weaknesses:
- Pricing scales with delivery (per-minute viewing)
- Overkill for simple video needs
- Vendor lock-in for the video pipeline

Pick Mux when: video is core to the product, need adaptive streaming + analytics.

### ImgIX
ImgIX puts an image-transform CDN in front of your existing object storage (S3 / R2 / etc.). On-the-fly resize, crop, format conversion via URL parameters.

Pick when: existing object storage works fine, you just need transforms in front.

### GCS / Azure Blob
Google Cloud Storage and Azure Blob are GCP / Azure's S3 equivalents. Pick if your team is already on those clouds.

## What None of Them Solve

- **Image optimization strategy.** All providers offer transforms; you decide *which* transforms to apply and where. Default to AVIF where browser-supported, WebP elsewhere; cap dimensions; serve responsive sizes.
- **Cache invalidation.** Cache-control headers, edge caching, purge strategies. Misconfigured caches mean stale content; aggressive caches mean cache thrash. Read the docs.
- **Bandwidth budgeting.** Free tiers run out; egress can spike unexpectedly. Set monitoring alerts on egress per day.
- **Upload validation.** Client-side validation (file size, type, dimensions) is your job; the storage provider doesn't enforce business rules.
- **Virus / malware scanning.** Especially for user uploads. Integrate ClamAV, VirusTotal, or a dedicated service before files become public.
- **Compliance and data residency.** GDPR, HIPAA, FedRAMP — varies by provider and region. Check before committing.
- **CDN cache hit rates.** Tools report it; you tune it. A 60% cache-hit rate vs 95% has 5x cost difference at scale.

## Pragmatic Stack Patterns

**Vercel-native indie SaaS, simple file uploads**:
- [Vercel Blob](vercel-blob.md) (public + private)
- Next.js `<Image>` for auto-optimization
- Total: bundled with Vercel pricing

**Indie SaaS with high egress (downloads, AI media)**:
- Cloudflare R2 ($0.015/GB storage, free egress)
- Or Backblaze B2 + Cloudflare CDN (cheapest combo)
- Total: $5-50/mo at indie scale

**Image-heavy marketing site / B2C product**:
- Cloudflare Images (bundled storage + transforms + CDN)
- Or Cloudinary if you need AI features and budget allows
- Total: $5-99/mo

**User-uploaded media as core flow**:
- Uploadcare for upload widget UX
- Or Vercel Blob + custom upload UI

**Video-heavy product**:
- Mux (purpose-built)
- Or Cloudflare Stream (cheaper, simpler)
- Or Bunny Stream (cheapest, less polished)

**AWS-deep enterprise team**:
- S3 + CloudFront
- Pay the egress costs; benefit from ecosystem

**Cost-obsessed indie**:
- Backblaze B2 + Cloudflare CDN (free egress via Bandwidth Alliance)
- Manual transform pipeline (sharp / ImageMagick + your own worker)
- Total: <$10/mo at small scale

## Decision Framework: Three Questions

1. **What kind of files are you primarily storing?** → User uploads: Vercel Blob or R2. Image-heavy: Cloudflare Images or Cloudinary. Video: Mux. AI-generated: R2.
2. **What's your egress profile?** → Low egress: any provider works. High egress (video, downloads, AI media): R2 or Backblaze + Cloudflare.
3. **What stack are you on?** → Vercel: Vercel Blob default. Cloudflare: R2 + Cloudflare Images. AWS: S3. Anywhere: R2 or Backblaze.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Vercel Blob (if on Vercel)** or **R2 (if not)**. Spending more than a day deciding is a sign you're avoiding the harder work of designing the upload UX.

## Verdict

For most readers building a SaaS in 2026:
- **Vercel-native, simple needs**: [Vercel Blob](vercel-blob.md). Default.
- **High-egress workloads (video, AI media)**: Cloudflare R2.
- **Cost-obsessed indie**: Backblaze B2 + Cloudflare CDN.
- **Image-heavy with transforms**: Cloudflare Images or Cloudinary.
- **User-upload UX critical**: Uploadcare.
- **Video core to product**: Mux.
- **AWS-deep enterprise**: S3.

The hidden cost in file storage is **egress, not storage**. Storage prices are within 50% across providers; egress prices range from free (R2) to $0.09/GB (S3) — a 10x+ swing. For products with high-egress profiles (video, AI media, downloads), the egress decision dominates the storage decision.

## See Also

- [Vercel Blob](vercel-blob.md) — deep-dive on the Vercel-native default
- [Vercel Functions](vercel-functions.md) — runtime that handles uploads
- [Vercel Sandbox](vercel-sandbox.md) — for processing uploads in isolated execution
- [Cloudflare](cloudflare.md) — for R2 + Cloudflare Images / Stream / CDN
- [AWS](aws.md) — for S3 deep-dive
- [Database Providers](../backend-and-data/database-providers.md) — companion for application data (file metadata)
- [Image Generation](../image-generation/) — AI-generated images need a place to live (R2 or Vercel Blob default)
- [Vector Database Providers](../backend-and-data/vector-database-providers.md) — companion for AI workloads
- [Background Jobs Providers](../backend-and-data/background-jobs-providers.md) — file-processing jobs run here

---

[⬅️ Cloud & Hosting Overview](../cloud-and-hosting/)
