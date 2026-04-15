# Together AI

Together is a cloud platform providing fast, cost-effective inference for 200+ open-source models plus fine-tuning and training capabilities.

## Why Vibe Coders Use It

- **Widest model selection** — 200+ open-source models (Llama, DeepSeek, Mixtral, FLUX, Stable Diffusion)
- **Competitive pricing** — among the cheapest for open-source model inference
- **Image generation** — FLUX, Stable Diffusion, and other image models
- **Fine-tuning** — customize open models with your data
- **Batch processing** — cost-effective for high-volume, non-real-time tasks

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Open-source model access, batch processing, cost-conscious deployments |
| Supported models | 200+ (Llama, DeepSeek, Mixtral, Qwen, FLUX, Stable Diffusion) |
| Latency | ~300-500ms (good for non-real-time) |
| Fine-tuning | Yes — train custom models |
| Image generation | Yes — FLUX, Stable Diffusion |
| Batch API | Yes — for cost-effective batch processing |
| Pricing tier | ~$0.30-$0.80 per 1M tokens (very competitive) |

## Getting Started

### 1. Sign Up for Together AI

Visit [together.ai](https://together.ai) and create an account.

### 2. Get an API Key

Generate an API key from your Together dashboard.

### 3. Install the AI SDK Provider

```bash
npm install @ai-sdk/togetherai
```

### 4. Quick Chat Example

```typescript
import { togetherai } from '@ai-sdk/togetherai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: togetherai('meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo'),
  prompt: 'Write a function to detect duplicate items in an array',
});

console.log(text);
```

### 5. Cost-Effective Batch Processing

```typescript
import { togetherai } from '@ai-sdk/togetherai';

// Process many prompts in batch for lower cost
const prompts = [
  'Explain closures in JavaScript',
  'What is React Server Components?',
  'How does SQL indexing work?',
];

const results = await Promise.all(
  prompts.map((prompt) =>
    togetherai.generateText({
      model: togetherai('meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo'),
      prompt,
    })
  )
);

console.log(results);
```

### 6. Image Generation with FLUX

```typescript
import { togetherai } from '@ai-sdk/togetherai';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: togetherai.image('black-forest-labs/FLUX.1-pro'),
  prompt: 'A modern dashboard UI with data visualization charts',
});

console.log(image.url);
```

### 7. Fine-Tuning a Model

```typescript
// Upload your training data
const finetuneJob = await fetch(
  'https://api.together.xyz/v1/fine-tune',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      training_file: 'file_id_from_upload',
      model: 'meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo',
      n_epochs: 3,
    }),
  }
).then((r) => r.json());

// Your fine-tuned model ready in hours
```

### 8. Streaming Chat

```typescript
import { togetherai } from '@ai-sdk/togetherai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: togetherai('meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## When to Use Together vs. Alternatives

**Use Together** when you need the cheapest access to open models or want to fine-tune at scale. Use **Groq** if latency is critical. Use **Claude** or **GPT** for the strongest proprietary reasoning.

## Popular Models

- **Llama 3.3 70B** — Strong general-purpose
- **DeepSeek-V3** — Excellent reasoning
- **Qwen 2.5 72B** — High-quality reasoning
- **FLUX 1.1 Pro** — Best open-source image generation

## Resources

- [Together AI Official](https://together.ai)
- [Together AI Documentation](https://docs.together.ai)
- [Together AI Model Library](https://api.together.ai/models)
- [AI SDK Together Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/togetherai)
- **See the full Together profile on [LLMReference](https://www.llmreference.com/providers/together) →**
