# Google Gemma 4

Google Gemma 4 is Google's most capable open-weight model family — built for on-device and cloud deployment with frontier-level reasoning, 140+ language support, and Apache 2.0 licensing.

## Why Vibe Coders Use It

- **True open-weight models** — Apache 2.0 license means no restrictions on commercial use, fine-tuning, or redistribution
- **On-device to cloud** — E2B and E4B run on phones and Raspberry Pi; 26B and 31B handle cloud workloads
- **Frontier-class reasoning** — 31B ranks #3 on Arena AI text leaderboard, outperforming models 20x its size
- **Massive context window** — 256K tokens on larger variants for processing entire codebases
- **140+ languages** — build multilingual apps without separate translation pipelines
- **Vision and audio** — native multimodal input for building richer applications

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | On-device AI, agentic workflows, cost-sensitive deployments |
| Context window | 256K tokens (26B, 31B variants) |
| Tool use / function calling | Supported in instruction-tuned versions |
| Agentic capability | Strong — purpose-built for multi-step planning and complex logic |
| API availability | Google AI Studio, Vertex AI, Vercel AI Gateway, Ollama |
| Pricing tier | Free (open-weight); API pricing varies by provider |

## Model Variants

| Model | Parameters | Best For |
|-------|-----------|----------|
| **Gemma 4 E2B** | 2B effective | Mobile apps, edge devices, offline-first features |
| **Gemma 4 E4B** | 4B effective | On-device with stronger reasoning, phones and tablets |
| **Gemma 4 26B MoE** | 26B (Mixture of Experts) | Cloud APIs, server workloads, cost-efficient inference |
| **Gemma 4 31B Dense** | 31B | Maximum quality, complex reasoning, agentic tasks |

The E2B and E4B models activate a small parameter footprint during inference to preserve RAM and battery life. They run completely offline on phones, Raspberry Pi, and NVIDIA Jetson Orin Nano.

## Getting Started

### Option 1: Via Google AI Studio (Recommended)

Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey) — no credit card required.

```bash
npm install ai @ai-sdk/google
```

```typescript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const { text } = await generateText({
  model: google('gemma-4-31b-it'),
  prompt: 'Build a REST API endpoint for user authentication in Express',
});

console.log(text);
```

Set your environment variable:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
```

### Option 2: Via Vercel AI Gateway

No API key needed — Vercel hosts Gemma 4 models directly.

```typescript
import { streamText } from 'ai';

const result = await streamText({
  model: 'google/gemma-4-31b-it',
  prompt: 'Refactor this React component to use server actions',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

### Option 3: Local with Ollama

```bash
# Download and run locally — no API key, no cloud costs
ollama run gemma4

# Use with the AI SDK
npm install ai ollama-ai-provider
```

```typescript
import { ollama } from 'ollama-ai-provider';
import { generateText } from 'ai';

const { text } = await generateText({
  model: ollama('gemma4'),
  prompt: 'How do I set up database migrations with Drizzle ORM?',
});
```

### Option 4: On Google Cloud (Vertex AI)

For production workloads, deploy via Vertex AI Model Garden with managed infrastructure and autoscaling.

```bash
npm install ai @ai-sdk/google-vertex
```

```typescript
import { vertex } from '@ai-sdk/google-vertex';
import { generateText } from 'ai';

const { text } = await generateText({
  model: vertex('gemma-4-31b-it'),
  prompt: 'Design a database schema for a multi-tenant SaaS application',
});
```

## When to Use Gemma 4 vs. Alternatives

**Use Gemma 4** when you need open-weight models you can self-host, fine-tune, or run on-device without API costs. The E2B/E4B variants are unmatched for mobile and edge deployment. Use **Gemini** when you want Google's strongest proprietary model with 1M+ context. Use **Llama** for the largest open-source ecosystem and community. Use **Claude** for the strongest proprietary reasoning and coding.

## Why Solo Founders Should Care

Gemma 4 changes the economics of AI features for indie products:

- **Zero marginal cost** — run E2B/E4B on-device with no API bills
- **No vendor lock-in** — Apache 2.0 means you own your AI stack
- **Privacy by default** — on-device inference means user data never leaves the phone
- **Ship faster** — 256K context handles entire codebases in agentic workflows
- **Global from day one** — 140+ languages without separate localization infrastructure

## Resources

- [Google AI Studio](https://aistudio.google.com) — free API access
- [Gemma on Hugging Face](https://huggingface.co/google/gemma-4-31b-it)
- [Vertex AI Model Garden](https://cloud.google.com/model-garden)
- [Ollama (Local Deployment)](https://ollama.ai)
- [AI SDK Google Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
- **See the full Gemma profile on [LLMReference](https://www.llmreference.com/providers/google) →**
