# AI Fine-Tuning & Custom Model Training Platforms: OpenAI, Anthropic, Together AI, Fireworks, OpenPipe, Modal, Baseten, Replicate, Predibase, Cohere, Lamini, AWS SageMaker, Vertex AI, Databricks Mosaic, Hugging Face AutoTrain

[⬅️ AI Development Overview](../ai-development/)

If your prompt engineering is tapped out, your evals are still missing the bar, and you've already added retrieval (RAG) and good context management — fine-tuning is the lever that's left. Done well, fine-tuning produces dramatic per-call cost reductions (small models matching frontier-model quality on your specific task), latency improvements (smaller models = faster inference), better task adherence (less verbose, fewer hallucinations on your domain), and structured-output reliability that's hard to coax from a base model. Done badly, you spend $50K on training infra to make a model that's worse than the base model with a better prompt — because your training data was junk, your eval was self-graded, you fine-tuned a model that didn't need it, or you're still paying frontier-model prices to host the result.

The fine-tuning market is now four distinct things conflated under one name: **provider-hosted fine-tuning** (OpenAI / Anthropic / Cohere fine-tune their own models for you), **open-model fine-tuning + hosting platforms** (Together / Fireworks / OpenPipe / Predibase fine-tune Llama / Mistral / Qwen / Gemma and serve them), **training-as-a-service platforms** (Modal / Baseten / Replicate / Anyscale provide GPUs and tooling), and **enterprise ML platforms** (Databricks Mosaic / SageMaker / Vertex AI for organizations training models from scratch or with very specific compliance needs). Each tier has different economics, complexity, and lock-in. Pick wrong and you'll either over-spend by 5-10x or end up with a model you can't deploy where you need it.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| **Provider-hosted (proprietary models)** | | | | | |
| OpenAI Fine-Tuning | Fine-tune GPT-4o-mini / GPT-4o / o-series | Easy ramp; reliable infra | Usage-based; training fee + inference fee | Medium | Existing OpenAI customers wanting better task adherence + cost reduction |
| Anthropic Fine-Tuning (Claude Haiku) | Fine-tune Claude Haiku for specific tasks | Long context + Claude quality on small model | Custom; tier-based | Low | Existing Anthropic customers; long-context tasks |
| Cohere Fine-Tuning | Command + Embed model fine-tuning | Strong embeddings fine-tuning especially | Usage-based | Medium | RAG embeddings + classifier fine-tuning |
| Mistral Fine-Tuning (La Plateforme) | Fine-tune Mistral models on Mistral platform | EU data residency; Mistral models | Usage-based | Medium | EU-residency-required workloads |
| Google Vertex AI Tuning | Tune Gemini + open models on GCP | GCP-native tooling | Pay-per-use | Medium | GCP-aligned shops |
| Azure OpenAI Fine-Tuning | Azure-hosted GPT fine-tuning | Enterprise compliance + Azure regions | Enterprise pricing | Low | Azure-locked enterprises |
| **Open-model fine-tune + serve** | | | | | |
| Together AI | OSS model training + serverless inference | Most open-model coverage; serverless inference; LoRA | Usage-based; cheap inference | High | Indie / mid-market wanting open models without GPU ops |
| Fireworks AI | OSS model training + speculative decoding | Fast inference; FireFunction; FireOptimizer | Usage-based | Medium | Latency-sensitive open-model workloads |
| OpenPipe | Specialized LLM fine-tuning + replacement | Replace OpenAI calls with fine-tuned cheaper models | Usage-based | High | Founders looking to drop OpenAI bills 5-10x |
| Predibase | OSS model fine-tuning at scale | LoRAX serving (multi-tenant LoRAs) | Custom; usage | Medium | Teams running many fine-tunes per customer/use case |
| Lamini | Memory-tuning + LLM fine-tuning | Hallucination-reduction-focused tuning | Custom | Low | Enterprise wanting hallucination-resistance for facts |
| Anyscale (Ray) | Ray-based ML training + serving | Ray ecosystem | Custom | Low | Teams already on Ray |
| **GPU + training infra (you build the pipeline)** | | | | | |
| Modal | Serverless GPU + Python-native training | Pythonic; on-demand GPUs; great DX | Pay-per-second; free tier | Very high | Founders comfortable with Python wanting full control |
| Baseten | Truss-based model deploy + training | Mature serving; Chains for compound systems | Pay-per-use | Medium | Teams shipping multiple custom models |
| Replicate | OSS model serving + Cog packaging | Community-led model marketplace | Pay-per-use | High | Indie one-off custom models or image/video |
| RunPod | GPU rental (interactive + serverless) | Cheap GPU access | Pay-per-second | High | DIY training where cost matters most |
| Lambda Labs | Cloud GPUs (H100, A100) | Direct GPU rental; ML-focused | Pay-per-hour | Medium | Multi-GPU training jobs |
| CoreWeave | Specialized GPU cloud | Massive H100/H200 fleets | Custom | Low | Large-scale training (foundation-model scale) |
| Crusoe Cloud | Sustainable GPU cloud | Climate-aligned + competitive pricing | Custom | Medium | Mid-large training + inference |
| **Hugging Face ecosystem** | | | | | |
| Hugging Face AutoTrain | No-code fine-tuning UI | Easiest UX for non-engineers | Pay-per-use; free tier | Very high | Quick experiments + entry-level |
| Hugging Face Inference Endpoints | Serve fine-tuned models | Tight HF integration | Pay-per-use | High | HF-ecosystem teams |
| **Enterprise platforms** | | | | | |
| Databricks Mosaic AI | End-to-end MLOps + custom-model training | Lakehouse integration; from-scratch training | Enterprise | Low | Enterprises building proprietary models |
| AWS SageMaker | Full MLOps platform | Enterprise AWS ecosystem | Enterprise | Low | AWS-heavy enterprises |
| Google Vertex AI | Full MLOps + Gemini access | GCP-aligned ML | Enterprise | Low | GCP enterprises |
| Azure ML | Full MLOps in Azure | Azure ecosystem | Enterprise | Low | Azure enterprises |
| **Specialized** | | | | | |
| Unsloth | OSS library for fast LoRA fine-tuning | 2-5x training speedup | Free OSS | Very high | Self-hosted training; pair with RunPod / Modal |
| Axolotl | OSS training framework | Recipe-based fine-tuning | Free OSS | High | Reproducible training pipelines |

## Decide What You Need First

Six honest questions before you spend a dollar on training infra.

### 1. Have you exhausted prompt engineering and RAG?
- If a better system prompt + retrieval gets you to your eval bar, do that. Fine-tuning is more expensive, more brittle, and adds infrastructure burden.
- Specifically: have you tried structured outputs (JSON schema), few-shot examples in the prompt, chain-of-thought, model upgrades (e.g., GPT-4o → GPT-4o + reasoning, or Claude Sonnet → Claude Opus)?
- If yes-and-still-failing OR if cost/latency at frontier-model prices is your constraint: continue.

### 2. Do you have an eval set?
- Without an eval set, you cannot tell whether fine-tuning helped, hurt, or made no difference.
- Minimum: 50-100 hand-curated test cases with known-good outputs. Ideally: 200-500 with adversarial cases.
- See [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md). If you don't have an eval, BUILD ONE before you fine-tune.

### 3. Do you have training data?
- For supervised fine-tuning (most common case): 100-1000+ high-quality input/output pairs minimum, typically.
- "High quality" means: outputs that EXACTLY represent what you want — not "good enough"; not user-rated "5 stars"; outputs you'd ship to a paying customer.
- More data ≠ better. 200 carefully-curated pairs beat 10,000 noisy ones.
- Sources: customer interactions you've reviewed and corrected, expert-annotated examples, synthetic data from a frontier model curated by humans.

### 4. What is fine-tuning supposed to fix?
Different goals → different platforms.
- **Cost reduction at scale**: fine-tune a small open model (Llama 3.1 8B, Qwen 7B, Mistral Small) on Together / Fireworks / OpenPipe; replace expensive API calls
- **Task-specific accuracy**: fine-tune a small model to do ONE thing very well (classification, extraction, reformatting)
- **Tone / format / style**: fine-tune for output style (Anthropic Claude Haiku fine-tuning is great for this)
- **Reduced hallucinations on facts**: tougher problem; consider Lamini's memory tuning OR strong RAG + grounding instead of fine-tuning
- **Latency**: smaller models = faster inference; fine-tuned 7B model often beats 70B base model on a narrow task

### 5. What's your deployment requirement?
- **Need to keep using OpenAI's models**: OpenAI Fine-Tuning is your only option; they don't release the weights
- **Need to keep Claude**: Anthropic Fine-Tuning (Haiku is the available SKU)
- **OK with Llama / Mistral / Qwen and self-host or hosted-OSS**: Together / Fireworks / OpenPipe / Predibase / Modal / Baseten
- **Need on-prem / air-gapped / regulated**: download weights from open-model fine-tune; serve in your VPC (Modal, Baseten, or your own infra)
- **Need EU data residency**: Mistral La Plateforme, Together's EU regions, Azure with EU regions, AWS with EU regions

### 6. What's your budget?
- Provider-hosted fine-tuning (OpenAI / Anthropic): $200-$5K to train + ongoing inference at premium-ish prices
- Open-model fine-tune (Together / Fireworks / OpenPipe): $50-$2K to train; inference at 1/5 to 1/20 the cost of frontier APIs
- Self-hosted training (Modal / RunPod / Lambda): $20-$2K of GPU time + your engineering time; cheapest at scale but most ops burden
- Enterprise platforms (Databricks / SageMaker): tens-to-hundreds of thousands annually + your team to operate

## Provider Deep-Dives

### OpenAI Fine-Tuning
**What**: Fine-tune GPT-4o-mini, GPT-4o, and o-series models on your data via OpenAI's API. Distillation also supported.
**Strengths**: easiest path if you're already on OpenAI. Familiar tooling. Reliable infra. Good docs.
**Weaknesses**: weights stay with OpenAI (no portability). Inference is at OpenAI's per-token prices (more expensive than self-hosted open-model). Vendor lock-in.
**Pricing**: training fee per token + slightly elevated inference price for fine-tuned models. Check current rates.
**Use when**: you need OpenAI quality + don't want to operate infra. The fine-tuning is justified by task adherence + cost reduction relative to GPT-4o base.

### Anthropic Fine-Tuning (Claude Haiku)
**What**: Fine-tune Claude Haiku via Anthropic's API. Targeted at task-specific quality + speed.
**Strengths**: Claude quality at Haiku speed/cost. Long context inherited.
**Weaknesses**: smaller catalog of fine-tunable models than OpenAI. Limited availability / waitlist at times.
**Use when**: you're on Claude, your task is well-defined, and you want Haiku-class economics with better-than-Haiku quality.

### Cohere Fine-Tuning
**What**: Command (chat/instruct) and Embed model fine-tuning on Cohere's platform.
**Strengths**: best-in-class embedding fine-tuning for retrieval / classification. Command tuning for chatbots.
**Use when**: RAG retrieval quality is bottlenecked on generic embeddings; fine-tune Cohere Embed on your domain pairs.

### Together AI
**What**: Hosted open-model fine-tuning + serverless inference for 100+ open-source models (Llama, Mistral, Qwen, Gemma, Mixtral, etc.).
**Strengths**: broadest model catalog; LoRA + full fine-tuning; serverless inference (no infra ops); generous pricing; well-regarded engineering team.
**Weaknesses**: support tier varies; less hand-holding than OpenAI / Anthropic.
**Pricing**: training charged by token / GPU-hour; inference pay-per-token at fractions of frontier prices.
**Use when**: you want open-model economics without operating GPUs. Default first choice for cost-driven fine-tuning.

### Fireworks AI
**What**: Open-model fine-tuning + serving with focus on inference speed (speculative decoding, FireOptimizer) and function-calling-tuned models (FireFunction).
**Strengths**: fast inference (often the fastest open-model serving); great function-calling support; mature serving.
**Use when**: latency matters more than the absolute cheapest cost.

### OpenPipe
**What**: Drop-in replacement for OpenAI calls — they capture your prompts, fine-tune a smaller model, and proxy your traffic to it transparently.
**Strengths**: cost-reduction-focused; well-suited to "I'm spending $5K/mo on OpenAI and want to cut it"; convenient prompt-replay tooling.
**Use when**: existing high-volume OpenAI bill + clear repetitive prompts that can be tuned away.

### Predibase
**What**: Fine-tune + serve open models with multi-tenant LoRA serving (LoRAX) — efficient when you have many fine-tunes per use case or per customer.
**Strengths**: LoRAX architecture serves dozens of fine-tunes from one base model efficiently. Good for per-customer fine-tunes.
**Use when**: you need many fine-tunes (B2B SaaS shipping per-tenant tunes; multi-task workloads).

### Lamini
**What**: Memory-tuning + traditional LLM fine-tuning, focused on factual accuracy / hallucination reduction.
**Strengths**: targeted at memorization of facts (e.g., embed your knowledge into the model so it answers from the model itself, not from RAG).
**Weaknesses**: niche claim; benchmark independently before committing.
**Use when**: you've validated that RAG + prompt grounding cannot reach your accuracy bar and you want to try memory-tuning.

### Modal
**What**: Serverless GPU compute — you write Python; Modal runs it on GPUs (H100s, A100s) on demand. Use for training, inference, batch.
**Strengths**: best DX in the space; Pythonic; no Docker / Kubernetes to manage; great for indie devs.
**Weaknesses**: more DIY than hosted fine-tuning platforms; you build the training script.
**Pricing**: pay per second of GPU time; free tier covers experimentation.
**Use when**: you want full control, you can write Python, you don't want to operate infra. Pair with Unsloth / Axolotl recipes.

### Baseten
**What**: Truss-based model deploy + training with Chains for compound AI systems.
**Strengths**: mature serving; multi-step / multi-model workflows; production-ready.
**Use when**: you'll ship multiple custom models in production and want a single platform.

### Replicate
**What**: Cog-packaged model serving with a marketplace of community models. Custom training via training APIs.
**Strengths**: simplest one-off serving; huge community catalog (especially image/video); pay-as-you-go.
**Use when**: indie / one-off custom model; image/video generation fine-tunes.

### RunPod, Lambda Labs, CoreWeave, Crusoe
**What**: GPU rental clouds. You operate the training stack; they provide GPUs.
**Strengths**: lowest cost for compute at scale.
**Weaknesses**: full ops burden — Docker, drivers, training framework, checkpoints, distributed training.
**Use when**: you have ML engineers + cost is the binding constraint OR you're doing large-scale (multi-node) training.

### Hugging Face AutoTrain
**What**: No-code fine-tuning UI on Hugging Face. Upload data; pick a model; train.
**Strengths**: lowest barrier to entry; great for experiments; integrates with HF Inference Endpoints for serving.
**Use when**: prototype / experiment / non-engineering team member needs to try fine-tuning.

### Databricks Mosaic AI / AWS SageMaker / GCP Vertex AI / Azure ML
**What**: enterprise MLOps platforms. Full-stack training, deployment, monitoring, governance.
**Strengths**: enterprise-grade; integrates with the cloud's data warehouse + IAM; required for some regulated workloads.
**Weaknesses**: high TCO; learning curve; over-engineered for most B2B SaaS use cases.
**Use when**: you're an enterprise; data-residency / compliance / governance requirements rule out hosted-OSS options; or you're training models from scratch.

### Unsloth + Axolotl (OSS libraries)
**What**: open-source training libraries. Unsloth optimizes training speed (2-5x); Axolotl provides recipe-based config-driven training.
**Use when**: you're training on Modal / RunPod / Lambda and want fast, reproducible recipes.

## What Fine-Tuning Won't Fix

- **Bad data.** Garbage in → garbage model. Fine-tuning amplifies whatever's in your training set, including bias and errors.
- **Pure knowledge gaps.** If the model needs to know facts that change weekly (your customers' data, current events, latest pricing), fine-tuning is the wrong tool. Use RAG.
- **Multi-step reasoning.** Fine-tuning a small model on long reasoning chains rarely matches a frontier reasoning model. For multi-step tasks, prompt engineering + frontier models often beats fine-tuning + small models.
- **Hallucinations on stuff outside training data.** Fine-tuning teaches the model what "in distribution" looks like; it doesn't make the model honest about what it doesn't know.
- **Bad system design.** If your prompt isn't clear, your tools aren't well-defined, your RAG isn't retrieving the right docs — fine-tuning won't bail you out.
- **Test-time problems disguised as model problems.** If your eval is wrong, fine-tuning to optimize it produces worse real-world behavior. Validate the eval before you train against it.

## Pragmatic Stack Patterns

### Pattern 1: Cost-driven, replacing expensive API calls
- Capture 1000+ real (input → frontier-model-output) pairs from production
- Curate: have humans review and fix any wrong outputs (or filter to only ones eval'd as correct)
- Fine-tune Llama 3.1 8B or Qwen 7B on Together AI or OpenPipe
- Eval on a held-out 100-pair test set against the original frontier model
- Deploy via the same platform; route traffic to the fine-tune if eval passes
- Cost trajectory: 5-15x cheaper inference at acceptable quality

### Pattern 2: Task-specific structured output (classification / extraction)
- 200-500 input → JSON output pairs
- Fine-tune Mistral 7B or Llama 8B on Together / Fireworks
- Or use OpenAI fine-tuning if you must stay on OpenAI
- Eval: structured-output validity rate + per-field accuracy
- Deploy: serverless inference; latency typically 10-50ms
- Result: structured outputs reliably; reduced retries; lower cost

### Pattern 3: Domain-specific embeddings for RAG
- Skip generative fine-tuning; fine-tune embeddings instead
- Generate query/positive/negative triplets from your domain
- Fine-tune Cohere Embed or BGE on Together / Hugging Face
- Eval: retrieval recall@K against held-out queries
- Deploy: replace generic embeddings; improves RAG materially without touching the LLM

### Pattern 4: Multi-tenant per-customer fine-tunes
- B2B SaaS where each customer's data justifies their own LoRA
- Predibase LoRAX for efficient multi-LoRA serving
- Or OpenPipe if your customers are within OpenAI usage
- Per-customer training pipeline; recurring as their data grows

### Pattern 5: Enterprise / regulated
- Fine-tune via Databricks Mosaic, SageMaker, Vertex AI, or Azure ML
- Stay within your existing cloud; satisfy audit + governance requirements
- Higher TCO; budget the operations team
- Use when compliance rules out hosted-OSS providers

### Pattern 6: Indie experiment / one-off
- Hugging Face AutoTrain for the easiest entry
- OR Modal + Unsloth + a Llama 3.1 8B base — write 50 lines of Python and rent a GPU for an hour
- Cost: $5-50 for an experimental fine-tune
- Iterate quickly; ship the winner via Replicate / Modal / HF Inference

## Decision Framework

Pick by answering:

**1. Are you committed to a specific model provider?**
- Must stay on OpenAI: OpenAI Fine-Tuning
- Must stay on Anthropic: Anthropic Fine-Tuning (Claude Haiku)
- Must stay on Cohere: Cohere Fine-Tuning (especially for embeddings)
- Open to OSS models: continue

**2. What's your operational appetite?**
- "I want to upload data and get a fine-tuned API endpoint": Hosted OSS (Together, Fireworks, OpenPipe, Predibase) or HF AutoTrain
- "I want to write Python and rent GPUs": Modal + Unsloth/Axolotl
- "I want full enterprise MLOps": Databricks / SageMaker / Vertex / Azure ML

**3. Where is the compute economics best for you?**
- Inference-heavy workloads: Together / Fireworks (cheap inference)
- Train-once / serve-rarely: Modal (serverless GPU; pay only when training)
- Multi-tenant per-customer LoRAs: Predibase

**4. Where is the data?**
- Your data lake is in Databricks: Mosaic AI
- Your data lake is in AWS: SageMaker
- GCP: Vertex AI
- Cloud-agnostic / Postgres-only: hosted OSS providers

**5. What's the latency requirement?**
- <50ms inference: Fireworks (fastest open-model serving) or self-hosted with vLLM/TGI
- <500ms acceptable: any hosted serverless option
- Batch: any platform

**6. How many fine-tunes will you ship?**
- 1-3: any hosted option
- Dozens (per customer / per use case): Predibase LoRAX or your own multi-LoRA serving

## Verdict

**For most B2B SaaS founders deciding now**:
- **First**: have you exhausted prompt engineering + RAG + a frontier model? If not, do that. Fine-tuning is rarely the first lever.
- **Cost-reduction play (replacing GPT-4 calls)**: **Together AI** or **OpenPipe**. Lowest friction, dramatic cost wins, no GPU ops.
- **Task-specific quality + structured output**: **OpenAI Fine-Tuning** if you need to stay on OpenAI, otherwise **Together** with Llama 8B or Qwen 7B.
- **Embeddings for RAG**: **Cohere Embed Fine-Tuning** — most underused fine-tuning lever; biggest RAG quality wins.
- **Latency-critical**: **Fireworks AI** for fastest open-model inference.
- **Indie experiments / one-off**: **Modal** + **Unsloth** for full control and cheap iteration.
- **Enterprise / regulated**: **Databricks Mosaic** or your cloud's native ML platform; budget for operators.

**Skip fine-tuning entirely if**:
- You don't have 100+ high-quality training pairs
- You don't have an eval set
- Your problem is "the model doesn't know my customers' current data" (use RAG)
- Your problem is "multi-step reasoning" (use frontier reasoning models + good prompts)
- Your prompt + retrieval approach hasn't been seriously iterated yet

**The real cost is data quality and eval**. The training infra is increasingly commoditized. Where teams differentiate is curating the training set and building eval discipline. Spend more on those than on the platform choice.

## See Also

- [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md) — eval is precondition for fine-tuning
- [LLM Observability Providers](./llm-observability-providers.md) — capture production traces for training data
- [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md) — runtime defense; orthogonal to fine-tuning
- [Vector Database Providers](../backend-and-data/vector-database-providers.md) — RAG infra; complementary to fine-tuning
- [ML Inference & GPU Platforms](../cloud-and-hosting/ml-inference-gpu-platforms.md) — serving infra for self-hosted inference
- [AI Gateways](../cloud-and-hosting/ai-gateways.md) — route between fine-tuned and base models
- [Claude API Integration](./claude-api-integration.md) / [OpenAI Responses](./openai-responses.md) — base API patterns
- [Synthetic Data Generation Platforms](../backend-and-data/synthetic-data-generation-platforms.md) — augment training data
- [AI Data Annotation & Labeling Platforms](./ai-data-annotation-labeling-platforms.md) — produce training labels
- VibeWeek: [LLM Cost Optimization](https://www.vibeweek.com/6-grow/llm-cost-optimization-chat) — fine-tuning is one of several cost levers
- VibeWeek: [LLM Quality Monitoring](https://www.vibeweek.com/6-grow/llm-quality-monitoring-chat) — production monitoring of fine-tuned models
