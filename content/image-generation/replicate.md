---
title: "Replicate"
description: "Replicate is a hosted inference platform for running AI image, video, and language models via a single API. Now part of Cloudflare. Here's the developer-focused reference: pricing, SDK, model catalog, custom Cog deploys, and how it compares to fal.ai."
---

# Replicate

Replicate is a hosted inference platform for running open-source AI models — image, video, audio, and language — through a single REST API. It abstracts the GPU, the container, the autoscaling, and the queueing so you can call any model the same way: an HTTP POST with a JSON `input` payload and a token. For most teams shipping AI features, that's the actual job.

Founded in 2019 by Ben Firshman and Andreas Jansson, Replicate spent years building both a marketplace (50,000+ models, including FLUX, Stable Diffusion, Ideogram, Recraft, Kling, Veo, and Hunyuan video) and the open-source containerization tool — **Cog** — that powers it. **In November 2025, Cloudflare acquired Replicate.** Replicate continues to operate as a distinct brand, but the platform is being moved to Cloudflare's network and integrated with Workers AI and AI Gateway. The API surface and pricing structure haven't changed for existing users.

If you're picking an inference host for image generation, video generation, or running fine-tuned open models in production, this is the reference page.

## When to reach for Replicate

- You want **one API for many models** (image, video, audio, language) instead of a separate SDK per provider.
- You want to **fine-tune or self-package models** with Cog and serve them on someone else's GPUs.
- You need access to the **long tail** of open-source models — researcher releases, community fine-tunes, niche checkpoints — without standing up your own GPU pool.
- You want **Cloudflare-adjacent infrastructure** (AI Gateway, Workers AI) for global edge access and caching.

## The Model Catalog

Replicate's catalog is the largest in hosted open-source AI. The most heavily-used categories:

| Category | Representative models |
|---|---|
| Image generation | FLUX (1.1 Pro, Pro Ultra, Dev, Schnell), Stable Diffusion, Ideogram, Recraft, Photon |
| Video generation | Kling, Veo, Hunyuan, Wan |
| Image editing | Inpainting, upscaling, background removal, ControlNet variants |
| Speech | Whisper, transcription, voice cloning, TTS |
| Language | Llama family, Mistral, fine-tuned open-weight LLMs |

For most production image-gen work, FLUX 1.1 Pro and FLUX Schnell are the defaults: Pro for quality, Schnell for speed and cost. For text-in-image, Ideogram is the standard pick. For video, Kling and Veo dominate post-2025.

## Pricing Model

Replicate uses **pure usage-based pricing** with no subscription, no commitments, and no per-seat fee. Two ways billing works depending on the model:

- **Per-second GPU pricing** — for community models and most fine-tuned deploys, you pay for GPU-seconds at the model's listed hardware tier (A40, A100, H100). A run that takes 4.2 seconds on an A100 bills at the A100 per-second rate × 4.2.
- **Per-prediction pricing** — for many official images and video models (FLUX 1.1 Pro, Ideogram, Recraft, Kling), Replicate publishes a flat per-image or per-second-of-video rate. Predictable and easier to budget.

A small free tier exists for evaluation, but production use is paid. There is no "credits expire" model — you pay for what you run.

### Cold start vs warm

Models that haven't been called recently incur a **cold start** — the GPU has to load the weights, which can add several seconds to the first request. Subsequent calls within the warm window run at normal speed. For latency-sensitive applications (chat-attached image gen, real-time editing), this is the single biggest gotcha. Three mitigations:

1. **Use official, always-warm models** when possible (FLUX 1.1 Pro and similar high-traffic models stay warm).
2. **Deploy your own model** on a dedicated instance with `replicate.deployments` — guaranteed warm at the cost of paying for idle time.
3. **Pre-warm with a cheap predict** on session start if your UX can tolerate a one-time hit.

## Node.js SDK

Install the official client:

```bash
npm install replicate
```

Set `REPLICATE_API_TOKEN` from `replicate.com/account/api-tokens` and run a model:

```typescript
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const output = await replicate.run(
  "black-forest-labs/flux-1.1-pro",
  {
    input: {
      prompt: "A leather notebook on a wooden desk, soft window light",
      aspect_ratio: "3:2",
      output_format: "jpg",
    },
  }
);

console.log(output); // URL to the generated image
```

For long-running predictions (video, large batches), use the async pattern:

```typescript
const prediction = await replicate.predictions.create({
  model: "kling-ai/kling-v2",
  input: { prompt: "cat walking through a forest in autumn", duration: 5 },
});

const finished = await replicate.wait(prediction);
console.log(finished.output);
```

You can also stream LLM output with `replicate.stream()` for any text-generation model.

## Using Replicate via the AI SDK

If you're already on Vercel's AI SDK, the Replicate provider gives you a typed image-generation surface:

```bash
npm install @ai-sdk/replicate
```

```typescript
import { replicate } from "@ai-sdk/replicate";
import { experimental_generateImage as generateImage } from "ai";

const { image } = await generateImage({
  model: replicate.image("black-forest-labs/flux-1.1-pro-ultra"),
  prompt: "A vibrant abstract painting with bold geometric shapes",
});
```

This is the path of least resistance if your app is already calling other providers (OpenAI, Anthropic, fal) through the AI SDK — keep one interface across the whole image and language stack.

## Custom Models with Cog

Cog is Replicate's open-source tool for packaging a model — including its Python dependencies, weights, and predict function — into a container that runs anywhere. The same image runs locally, in CI, or on Replicate's GPUs.

```bash
pip install cog
```

A minimal `cog.yaml`:

```yaml
build:
  gpu: true
  python_version: "3.11"
  python_packages:
    - "torch==2.4.0"
    - "diffusers==0.30.0"
predict: "predict.py:Predictor"
```

A minimal `predict.py`:

```python
from cog import BasePredictor, Input, Path

class Predictor(BasePredictor):
    def setup(self):
        # Load weights here. Runs once on container start.
        self.model = load_my_model()

    def predict(self, prompt: str = Input(description="Prompt")) -> Path:
        image = self.model(prompt)
        out = Path("/tmp/out.png")
        image.save(out)
        return out
```

Build and push:

```bash
cog build
cog push r8.im/<your-username>/<model-name>
```

Once pushed, your model has a public Replicate URL, an API endpoint, autoscaling, and a generated web UI. You pay per GPU-second for runs.

## Replicate vs fal.ai vs Together.ai

The three platforms occupy overlapping but distinct positions.

| | **Replicate** | **fal.ai** | **Together.ai** |
|---|---|---|---|
| Best for | Breadth of models, custom Cog deploys | Lowest-latency image and video | Hosted open LLMs, fine-tuning |
| Catalog size | 50,000+ | Curated, smaller | LLM-focused |
| Cold starts | Common on long-tail models | Optimized — typically faster | Mostly warm |
| Custom deploys | Cog (container-based) | Yes, but less standardized | Limited |
| Pricing | Per-second GPU or per-prediction | Per-prediction, transparent | Per-token (LLM) |
| Edge integration | Cloudflare (post-acquisition) | None native | None native |

**Heuristic**: reach for fal.ai if the use case is real-time image generation in a production app and latency is the top constraint. Reach for Replicate if you need either an unusual model that isn't on fal.ai or a place to deploy a custom Cog container. Reach for Together.ai if your primary workload is open-weight LLM inference rather than image or video.

## Cloudflare integration (post-acquisition)

Since the November 2025 acquisition, the integration story is still developing, but the public direction is:

- **Workers AI catalog expansion** — Replicate's models become callable from Workers AI, letting you run any of them from a Cloudflare Worker without leaving the Cloudflare network.
- **AI Gateway** — Replicate calls can be routed through Cloudflare's [AI Gateway](/cloud-and-hosting/cloudflare-ai-gateway) for unified observability, caching, and rate-limiting across providers.
- **Edge-local inference** — over time, Replicate's infrastructure is being co-located with Cloudflare's network, which should reduce latency for global users without changes on your end.

If you're already a Cloudflare customer, this is a meaningful tailwind. If you're not, the existing Replicate API works exactly as it did before — same endpoints, same SDK, same billing.

## Limitations to Plan For

- **Cold starts on long-tail models** — the price you pay for the catalog. Use deployments or pre-warming for latency-sensitive flows.
- **Per-prediction pricing volatility** — model owners can re-version or re-price. Pin the version hash in production calls to avoid surprises.
- **No streaming for image generation** — you get a final URL when the prediction completes; partial frames aren't streamed back like LLM tokens are.
- **Webhooks for long jobs** — for video and other slow predictions, set `webhook` on the prediction so your service isn't holding open HTTP connections.

## Production Checklist

- Pin the **version hash** of every model in production calls (`black-forest-labs/flux-1.1-pro:<hash>`).
- Set a **webhook** for any prediction expected to take longer than ~10 seconds.
- For latency-sensitive flows, deploy via `replicate.deployments` to keep a warm instance.
- Route through **Cloudflare AI Gateway** if you want logging, caching, and per-team budget control without rolling your own.
- Watch the [pricing page](https://replicate.com/pricing) for per-model rate changes — community models occasionally re-tier.

## See Also

- [FLUX](/image-generation/black-forest-labs-flux) — the most-used image-gen family on Replicate.
- [fal.ai](/image-generation/fal) — closest competitor for hosted image and video inference.
- [Image Generation overview](/image-generation/image-generation) — how to choose between models for product use cases.
- [AI SDK Providers](/ai-development/ai-sdk-providers) — using Replicate through the Vercel AI SDK.
- [Cloudflare Workers vs Vercel Edge](/cloud-and-hosting/cloudflare-workers-vs-vercel-edge) — context for the post-acquisition Cloudflare angle.
