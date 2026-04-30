# ML Inference & GPU Hosting Platforms: Modal, Replicate, RunPod, Beam, Together AI, Fireworks, Anyscale, Baseten, Lambda Labs

[⬅️ Cloud & Hosting Overview](../cloud-and-hosting/)

If you're a SaaS in 2026 building AI features that go beyond "call OpenAI/Anthropic" — fine-tuned models, custom embeddings, open-source LLMs (Llama, Qwen, DeepSeek), Stable Diffusion / Flux for images, Whisper for transcription, custom-trained classifiers, vector search at scale, or GPU-heavy data processing — this is the consolidated comparison of GPU/ML inference hosting platforms. The naive shape: "We'll use Vercel + OpenAI." Works for v0; falls over when you need (a) custom models, (b) cheaper inference at scale, (c) lower latency than third-party APIs, or (d) on-prem-like control over data.

This is distinct from [AI Models](../ai-models/) (the foundation models themselves — Claude, GPT, Gemini, Llama). It's also distinct from [Vercel AI Gateway](../ai-development/) (a gateway over hosted model APIs). This is the layer below: where YOU host model weights, batched inference, fine-tunes, custom models. Pick the right shape (serverless GPU / managed inference / dedicated GPU rental / fine-tune-and-host platform) and you get state-of-the-art AI at 1/10th the cost of frontier APIs. Pick wrong and you're either paying frontier prices for boilerplate workloads or operating Kubernetes GPU clusters that nobody understands.

## TL;DR Decision Matrix

| Provider | Type | Pricing Model | Free Tier | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Modal | Serverless GPU / Python-first | Per-second compute | $30/mo free credits | No | Very high | Python teams; serverless burst workloads |
| Replicate | Pre-built model hosting + custom | Per-inference | Free trial | Yes (Cog OSS) | Very high | Pre-built models (Flux, Stable Diffusion, Whisper); fast-ship |
| RunPod | GPU rental + serverless | Per-hour or per-second | Free trial | No | Very high | Cheapest GPU; flexible (spot + on-demand) |
| Beam | Serverless GPU + custom Python | Per-second compute | Free tier | No | Very high | Modal alternative; Python-first |
| Together AI | OSS LLM hosting + fine-tuning | Per-token | Free trial | No | High | Open-source LLM inference at scale |
| Fireworks AI | OSS LLM + fine-tune hosting | Per-token + per-second | Free trial | No | High | Llama / Qwen / DeepSeek inference at SOTA latency |
| Anyscale (Ray) | Ray-based ML platform | Custom (enterprise) | Trial | Yes (Ray OSS) | Medium | Enterprise / training-heavy workloads |
| Baseten | Model deployment platform | Per-second compute | $30 credits | No | High | Production model deployment with monitoring |
| Lambda Labs | GPU compute / dedicated | Per-hour | None | No | Medium | Bare GPU rental; training |
| CoreWeave | GPU compute (enterprise) | Custom | None | No | Low | Enterprise GPU at scale |
| Banana | Serverless GPU (legacy; check status) | Per-second | — | No | Medium | Older option; verify still operating |
| Cerebrium | Serverless ML | Per-second | $30 credits | No | High | Modal alternative |
| RunwayML | Creative AI / video | Per-credit | Trial | No | Medium | Video / creative workflows |
| Hugging Face Inference Endpoints | HF model hosting | Per-hour-of-instance | Free | No | High | HF-ecosystem; quick deploy of open models |
| AWS SageMaker | AWS ML platform | Per-instance + invocations | Trial | No | Medium | AWS-shop ML workloads |
| Google Vertex AI | GCP ML platform | Per-instance + per-prediction | Free trial | No | Medium | GCP-shop ML workloads |
| Databricks ML | Lakehouse-integrated ML | Bundled with Databricks | Trial | No | Low | Data-platform ML; Databricks shops |
| Azure ML | Azure ML platform | Per-instance | Trial | No | Low | Microsoft-shop ML workloads |
| Vercel AI Gateway | Hosted model gateway (NOT inference) | Per-token to providers | Bundled | No | High | NOT inference hosting; routing to model APIs |

The first decision is **what shape of hosting you actually need**: serverless burst (Modal, Beam, Cerebrium), per-inference pre-built models (Replicate, HF Endpoints), per-token hosted LLMs (Together, Fireworks), GPU rental for training (RunPod, Lambda Labs), or full ML platform with MLOps (SageMaker, Vertex, Databricks). Each shape has a clearly best tool. Picking wrong is the most common mistake — usually defaulting to SageMaker when Modal would have shipped 5x faster.

## Decide What You Need First

ML infra platforms are not interchangeable. Get the shape wrong and you'll either pay too much, hit operational complexity, or fail to ship.

### Custom Python code on GPU (the 60% case for indie ML)

You have Python code (model.predict, batch processing, fine-tune loop) and want to run it on GPU without managing infrastructure.

Right tools:
- **Modal** — Python-decorator API; serverless GPU
- **Beam** — Python-first alternative
- **Cerebrium** — modern alternative

### Pre-built model hosting (Stable Diffusion, Whisper, etc.)

You want to call common open-source models without writing your own inference code.

Right tools:
- **Replicate** — pay-per-inference; massive model catalog
- **Hugging Face Inference Endpoints** — HF ecosystem
- **Modal** — if you want the model in your account/code path

### LLM inference at scale (Llama, Qwen, DeepSeek)

You want to call open-source LLMs at price competitive with OpenAI/Anthropic.

Right tools:
- **Together AI** — broad OSS LLM catalog; per-token
- **Fireworks AI** — best latency for OSS LLMs
- **Modal / Replicate** — if you have specific custom needs
- **Vercel AI Gateway** routing to Together/Fireworks (often the right pattern)

### Fine-tuning + hosting your fine-tune

You have data; you want to fine-tune an open model and serve it.

Right tools:
- **Together AI** — fine-tune + host in one platform
- **Fireworks** — same
- **Modal + your own training code** — DIY route; full control
- **Replicate** — fine-tune via their API; deploy

### GPU rental for training

You're training models; need raw GPU time.

Right tools:
- **RunPod** — flexible, cheap, spot pricing
- **Lambda Labs** — bare-metal GPU rental
- **CoreWeave** — enterprise scale
- **Modal** — if your training fits serverless model

### Production model deployment + monitoring

You have models in production; need observability, A/B testing, version management.

Right tools:
- **Baseten** — model deployment platform with monitoring
- **AWS SageMaker** — full enterprise platform
- **Modal** + your own monitoring layer
- **Anyscale** — Ray-based; large-scale workloads

### Enterprise / data-warehouse-integrated ML

You're already on Databricks / Snowflake; want ML-on-data.

Right tools:
- **Databricks ML** — native Lakehouse ML
- **Snowflake Cortex** — native Snowflake ML
- **AWS SageMaker** — if AWS-aligned

## Provider Deep-Dives

### Modal

The Python-first serverless GPU platform. Modal (founded 2021) gave Python developers a one-decorator way to run code on GPUs without provisioning infrastructure. Default for indie + startup ML in 2026.

**Strengths:**
- @modal.function decorator → run on any GPU you want.
- Per-second pricing; no idle cost.
- Massive GPU pool (T4, A10, A100, H100, H200).
- Excellent DX; deploy in minutes.
- Webhooks → triggers serverless function (great for inference APIs).
- Cron jobs, dependency mgmt, secrets, custom Docker — all clean.
- Strong community; active development.
- Volumes for persistent storage between runs.
- Good observability built-in.
- Free tier real ($30/mo credits).

**Weaknesses:**
- Python-only (no Node, Go, Rust SDKs as first-class).
- Cold starts can be 10-30s for large models (mitigated by keep-warm).
- Vendor lock-in: code is decorator-syntax-tied.
- At very high scale, dedicated GPU may be cheaper.

**Pricing:** $30/mo credits; per-second compute beyond. Typical SaaS spend: $50-2000/mo.

**Best for:** Python ML teams; serverless GPU workloads; ML startups; rapid prototyping; the default for indie ML in 2026.

### Replicate

Pre-built model hosting at scale. Replicate (founded 2019) is "pay-per-inference for popular open-source models" — Stable Diffusion, Flux, Whisper, Llama, Mistral, hundreds more.

**Strengths:**
- Largest catalog of pre-built models (1000+).
- Per-inference pricing (no idle cost).
- Cog (their OSS framework) lets you ship custom models too.
- Webhooks for async inference (don't wait for image generation).
- API is dead-simple: HTTP POST → result.
- Strong community of model creators.
- Quick experiments with cutting-edge models (Flux 1.x, etc., available within hours of release).

**Weaknesses:**
- Per-inference pricing can be expensive at scale.
- Cold starts visible (5-30s for warm; 30-120s for cold).
- Less custom-deployment-friendly than Modal/Baseten.
- Quality of community models varies.

**Pricing:** Per-inference; e.g. $0.0023/image for SD3.5 on A40; $0.005/video-second; varies wildly per model.

**Best for:** Quick integration of popular AI models; non-LLM AI (image, video, audio); experimentation; Cog packaging.

### RunPod

The cheapest GPU rental + serverless. RunPod (founded 2022) provides bare GPU rental + serverless inference, often at 30-50% lower cost than competitors.

**Strengths:**
- Cheapest GPU on the market (often 30-50% below competitors).
- Spot pricing for further savings.
- Wide GPU availability (4090s, 5090s, A100s, H100s).
- Both serverless (auto-scale) and dedicated rental (fixed billing).
- Templates for common use cases.
- Modal-like serverless API.

**Weaknesses:**
- DX rougher than Modal.
- Fewer integrations.
- Smaller community.
- Reliability has had hiccups (improving).
- Less polished docs.

**Pricing:** Per-hour rental from $0.20/hr (4090s); per-second serverless. Often 30-50% cheaper than Modal at scale.

**Best for:** Cost-sensitive teams; high-volume inference; flexibility; teams comfortable trading DX for cost.

### Beam

Modal alternative. Beam (founded 2022) is similar in shape — serverless Python on GPU — but with some different design choices.

**Strengths:**
- Python-decorator API.
- Per-second pricing.
- Good DX.
- Pre-built templates.
- Volume / shared-storage support.
- Smaller team, but well-loved by users.

**Weaknesses:**
- Smaller catalog of features than Modal.
- Smaller community.
- Less brand recognition.

**Pricing:** Per-second; comparable to Modal at low volume.

**Best for:** Modal alternative; teams who prefer Beam's design; sometimes 10-20% cheaper.

### Together AI

OSS LLM inference at scale. Together AI specializes in hosting open-source LLMs (Llama, Qwen, DeepSeek, Mixtral, etc.) at SOTA latency + competitive pricing.

**Strengths:**
- Wide catalog of OSS LLMs (50+).
- Per-token pricing competitive with OpenAI.
- Fine-tuning service available.
- OpenAI-compatible API (drop-in replacement for OSS models).
- Production-grade SLA.
- Pairs with Vercel AI Gateway natively.

**Weaknesses:**
- LLMs only (not for SD / Whisper / etc.).
- Less customizable than Modal / Baseten.
- Vendor risk (smaller than AWS / Google).

**Pricing:** Per-token; e.g. $0.20-0.90 per million input tokens for Llama variants.

**Best for:** OSS LLM inference at production scale; replacing OpenAI/Anthropic for cost-sensitive use cases; fine-tuning + hosting.

### Fireworks AI

Best-latency OSS LLM hosting. Fireworks (founded 2022) competes with Together AI on OSS LLM hosting; differentiates on latency optimization and fine-tune-host pipelines.

**Strengths:**
- Industry-leading latency for OSS LLMs (often 2-5x faster than Together).
- Speculative decoding + custom kernels.
- Fine-tune + host workflow integrated.
- OpenAI-compatible API.
- Production-grade SLAs.
- Excellent docs.

**Weaknesses:**
- Smaller catalog than Together.
- Fewer non-LLM options.
- Vendor risk.

**Pricing:** Per-token; competitive with Together; sometimes higher for premium latency.

**Best for:** Latency-critical LLM applications (chat UIs, real-time agents); fine-tuned-model hosting.

### Baseten

Production model deployment + monitoring. Baseten focuses on the production-deployment shape — your model, deployed with monitoring, autoscaling, A/B testing.

**Strengths:**
- Production-ready: monitoring, alerting, autoscaling.
- Truss (their model packaging format) is clean.
- Fine-tune + deploy pipeline.
- Integrates with major model registries.
- Per-second compute.
- Good for teams shipping multiple models.

**Weaknesses:**
- Smaller community than Modal.
- Pricing can be high at scale.
- Fewer pre-built models than Replicate.
- Less rapid-prototype-friendly than Modal.

**Pricing:** Per-second compute; $30 credits to start.

**Best for:** Production model deployment with serious monitoring needs; ML platform teams managing 5+ models.

### Anyscale (Ray)

Enterprise ML platform built on Ray. Anyscale productizes Ray (the OSS distributed compute framework from UC Berkeley); positions for enterprise ML training + serving.

**Strengths:**
- Ray-native (best-in-class for distributed ML).
- Strong for training-heavy workloads.
- Multi-cloud deployment.
- Enterprise governance + multi-tenancy.

**Weaknesses:**
- Steep learning curve (Ray itself is a substantial framework).
- Pricing is enterprise.
- Less indie-friendly than Modal.

**Pricing:** Custom enterprise; expect $5K-100K+/mo.

**Best for:** Enterprise ML teams; large-scale distributed training; Ray-aligned shops.

### Lambda Labs

Bare-metal GPU rental. Lambda Labs is hardware-first — rent A100s / H100s by the hour for training.

**Strengths:**
- Cheaper than AWS/GCP/Azure for raw GPU.
- Reliable hardware availability.
- 1-Click clusters (multi-GPU training).

**Weaknesses:**
- DIY orchestration; not serverless.
- No auto-scale.
- Operate your own model deployment.

**Pricing:** $1.10-2.49/hr per H100 typical; A100 cheaper.

**Best for:** Long-running training jobs where dedicated GPU > serverless. Not for inference.

### Hugging Face Inference Endpoints

Quick deploy of HF-hosted models. Inference Endpoints lets you 1-click deploy any HF model on AWS / GCP / Azure.

**Strengths:**
- Massive HF model ecosystem.
- 1-click deploy.
- Pay-per-instance-hour.
- Multi-cloud.

**Weaknesses:**
- More expensive than serverless (per-hour billing).
- Less flexible for custom code.
- Per-hour billing punishes idle time.

**Pricing:** Per-instance-hour; e.g., $0.50-4.00/hr for various GPU sizes.

**Best for:** Quick POC of HF models; teams already using HF heavily.

### AWS SageMaker

AWS's ML platform. Comprehensive: training, inference, MLOps, AutoML, experiment tracking.

**Strengths:**
- Comprehensive (everything in one place).
- AWS-deep integration.
- Enterprise governance.
- Studio (Jupyter-style notebooks).
- AutoML offerings.

**Weaknesses:**
- Pricing complex; expensive at low volume.
- Steep learning curve.
- Slower iteration vs. Modal.
- Lock-in to AWS.

**Pricing:** Per-instance; varies wildly by feature; expect $200-50K+/mo.

**Best for:** AWS-bound enterprise; comprehensive ML platform needs.

### Google Vertex AI

GCP's ML platform. Comparable to SageMaker for GCP-bound teams.

**Strengths:**
- Strong AutoML.
- Vertex AI Agent Builder for AI applications.
- Gemini integration.
- BigQuery ML integration.

**Weaknesses:**
- Lock-in to GCP.
- Fewer model types than SageMaker.
- Pricing complex.

**Best for:** GCP-bound teams; Gemini-heavy workloads.

### Databricks ML

Lakehouse-integrated ML. Strong for data-platform-driven ML.

**Strengths:**
- Native Lakehouse integration (data + ML in one).
- MLflow integrated.
- Spark + GPU at scale.
- Enterprise governance.

**Weaknesses:**
- Tied to Databricks.
- Pricing enterprise.

**Best for:** Databricks-shop teams; data-engineering-led ML.

## What These Platforms Won't Do

Useful to be clear-eyed:

- **They won't replace foundation-model APIs for general use.** OpenAI, Anthropic, Google for general-purpose tasks remain dominant. Self-hosted OSS LLMs win when (a) cost matters, (b) custom fine-tune matters, or (c) data sovereignty matters.
- **They won't fix bad models.** Garbage in, garbage out. The platform doesn't make a poorly-trained model good.
- **They won't replace MLOps discipline.** Versioning, monitoring, evaluation — these are practices, not features.
- **They won't give you frontier-model quality on smaller/older OSS.** Llama 3 70B is great; not as good as Claude Sonnet 4.6 for many tasks. Test before assuming.
- **They won't scale to zero cost.** Even serverless has a non-zero baseline (cold starts, persistent volumes). Manage idle.
- **They won't solve the eval problem.** You still need to evaluate model quality continuously. (See [LLM Observability Providers](../ai-development/llm-observability-providers.md).)
- **They won't handle compliance for you.** SOC 2 / HIPAA / EU residency is YOUR responsibility (with vendor support).

## Pragmatic Stack Patterns

Common 2026 patterns:

### Indie / pre-PMF AI feature

```
Vercel AI Gateway → Anthropic / OpenAI / Gemini (frontier APIs)
+ Replicate for one-off image/audio
+ NO custom hosting yet
```

Rationale: don't pay for hosting until traffic justifies. Frontier APIs are good enough.

### Early-stage with first AI features

```
Vercel AI Gateway → frontier APIs (chat, summarization, etc.)
+ Modal for any custom Python (e.g. embeddings batch jobs)
+ Replicate for image generation (if applicable)
+ NO fine-tuning yet
```

Rationale: stay agile; low ops cost.

### Growth-stage AI-heavy SaaS

```
Vercel AI Gateway → mix of frontier APIs + Together/Fireworks for OSS
+ Modal for custom inference logic (RAG retrievers, embeddings, classifiers)
+ Together AI fine-tunes for specific domain tasks (cost down 5-10x)
+ Replicate for image/audio
+ Baseten for production-deployed custom models
```

Rationale: cost optimization through OSS routing where quality is good enough; custom models for repetitive domain tasks.

### ML-first product (image gen, voice, transcription as core feature)

```
Modal (custom inference + fine-tuning)
+ Replicate (rapid integration of new models)
+ RunPod for high-volume / cost-critical inference
+ Custom fine-tunes hosted via Modal or Baseten
+ Vercel AI Gateway for any frontier-API touchpoints
```

Rationale: ML is the product; control matters.

### Enterprise ML team

```
SageMaker (or Vertex AI / Databricks ML) for governance + experimentation
+ Anyscale or DIY Ray for distributed training
+ Custom inference via Baseten or in-house deployment
+ Fireworks for LLM inference where third-party acceptable
```

Rationale: enterprise governance; existing cloud commitments.

### Cost-sensitive / high-volume inference

```
Together AI / Fireworks for LLM inference (per-token)
+ RunPod for non-LLM GPU workloads (per-second/hour)
+ Modal only for custom logic that needs serverless
+ Aggressive caching upstream
```

Rationale: optimize $/inference; volume justifies optimization.

### AI agent / multi-step workflows

```
Frontier APIs (Claude/GPT) for reasoning steps
+ Modal for custom tools the agent calls
+ Together/Fireworks for fast OSS LLM steps
+ Vercel AI Gateway for routing + observability
+ Vercel Sandbox for code-execution steps
```

Rationale: agent shape mixes frontier reasoning + custom tool execution.

## Decision Framework

### 1. What's the workload?

- **Frontier-quality LLM:** Frontier APIs (Anthropic / OpenAI / Google) via Vercel AI Gateway.
- **OSS LLM at production scale:** Together AI or Fireworks.
- **Image / video / audio:** Replicate.
- **Custom Python on GPU:** Modal, Beam, RunPod.
- **Long training jobs:** Lambda Labs, RunPod dedicated, Anyscale.

### 2. Scale?

- **<$200/mo inference:** Frontier APIs; Replicate; Modal free tier.
- **$200-2K/mo:** Modal, Together, Replicate, Vercel AI Gateway.
- **$2K-20K/mo:** Modal at scale, Together/Fireworks, Baseten.
- **$20K+/mo:** Mix; consider RunPod for cost; SageMaker for enterprise.

### 3. Compliance / data residency?

- **Standard:** any.
- **EU-strict:** Together / Fireworks have EU regions; Modal has region selection.
- **HIPAA / FedRAMP:** AWS SageMaker, Azure ML, dedicated tenancy.

### 4. Team profile?

- **Python ML team:** Modal, Beam.
- **Data team:** Databricks ML, Vertex AI.
- **Enterprise:** SageMaker, Anyscale.
- **Indie / startup:** Modal + Replicate + Vercel AI Gateway.

### 5. Iteration speed needs?

- **Daily experiments:** Modal, Replicate.
- **Production stability:** Baseten, SageMaker.
- **Both:** Modal for dev, Baseten for prod.

## Verdict

For 2026 ML inference + GPU hosting:

- **Default for Python ML teams:** **Modal**. Boring, works, fits Python workflows.
- **Pre-built OSS models:** **Replicate**. Click and go.
- **OSS LLM inference:** **Together AI** (broad catalog) or **Fireworks** (latency).
- **Cheapest GPU:** **RunPod**. Cost-sensitive workloads.
- **Production deployment + monitoring:** **Baseten**.
- **Bare GPU rental:** **Lambda Labs** or **CoreWeave**.
- **Enterprise platform:** **SageMaker**, **Vertex AI**, or **Anyscale**.
- **Vercel-native AI:** **Vercel AI Gateway** + Modal for custom.

The most common mistake in 2026: hosting OSS LLMs yourself when Together/Fireworks would be 10x simpler at competitive prices. Self-host only when (a) you've outgrown them on cost, (b) data residency requires it, or (c) you have a custom model not on those platforms.

The second most common mistake: defaulting to AWS SageMaker for everything because the team is already on AWS. SageMaker is comprehensive but slow to iterate. Modal + Vercel AI Gateway ships 5x faster for most use cases.

The third mistake: ignoring caching. Inference is expensive; caching is free. Cache aggressively at every layer (response cache, prompt cache, embedding cache, RAG cache).

## See Also

- [AI Models](../ai-models/) — foundation models hosted by these platforms
- [AI SDK](../ai-development/ai-sdk) — pairs for application-side AI
- [LLM Observability Providers](../ai-development/llm-observability-providers) — pairs for monitoring
- [LLM Cost Optimization (VibeWeek)](../../VibeWeek/6-grow/llm-cost-optimization-chat.md) — implementation discipline
- [Voice AI Providers](../ai-development/voice-ai-providers) — adjacent (specific to voice)
- [Vector Database Providers](../backend-and-data/vector-database-providers) — adjacent (vector storage)
- [Vector Databases](../backend-and-data/vector-databases) — adjacent
- [Cloud Development Environments](../devops-and-tools/cloud-development-environments) — sister category (dev not inference)
- [Vercel Sandbox](./vercel-sandbox) — adjacent for code-execution sandboxes
- [Cloud-and-Hosting Providers](./) — broader hosting context
- [Replicate](../image-generation/replicate) — provider-specific deeper guide
- [Modal in CDE article](../devops-and-tools/cloud-development-environments) — Modal also covered there for ML CDE use case
