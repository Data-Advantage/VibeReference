# Fireworks AI

Fireworks is an inference platform optimized for running open-source models (Llama, DeepSeek, Mistral) at production scale with competitive speed and cost.

## Why Vibe Coders Use It

- **Open models at scale** — fast, reliable access to Llama, DeepSeek, Mixtral
- **Image generation** — run Stable Diffusion, FLUX for image generation tasks
- **Fine-tuning** — upload and serve your own fine-tuned models
- **Production SLAs** — enterprise-grade reliability for customer-facing AI
- **Competitive pricing** — often cheaper than Claude or GPT for equivalent performance

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Open-source models at scale, image generation, fine-tuning |
| Supported models | Llama 3.3, DeepSeek, Mixtral, Codestral, and 200+ others |
| Latency | ~200-400ms (good performance) |
| Fine-tuning | Yes — upload datasets, customize for your domain |
| Image generation | Yes — Stable Diffusion, FLUX support |
| API availability | REST API, Fireworks SDK, Vercel AI SDK |
| Pricing tier | ~$0.50-$1.50 per 1M tokens (varies by model) |

## Getting Started

### 1. Sign Up for Fireworks

Visit [fireworks.ai](https://fireworks.ai) and create an account.

### 2. Get an API Key

Generate an API key from your Fireworks dashboard.

### 3. Install the AI SDK Provider

```bash
npm install @ai-sdk/fireworks
```

### 4. Quick Chat Example

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { generateText } from 'ai';

const { text } = await generateText({
  model: fireworks('accounts/fireworks/models/llama-v3p3-70b-instruct'),
  prompt: 'Build a validation function for email addresses in TypeScript',
});

console.log(text);
```

### 5. Using DeepSeek for Complex Reasoning

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { generateText } from 'ai';

const { text } = await generateText({
  model: fireworks('accounts/fireworks/models/deepseek-r1'),
  prompt: 'Design a distributed cache invalidation strategy for a multi-region system',
});
```

### 6. Image Generation Example

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: fireworks.image('accounts/fireworks/models/stable-diffusion-xl-1024-v1-0'),
  prompt: 'A modern, minimalist UI mockup for a task management app',
});

console.log(image.url);
```

### 7. Fine-Tuning Your Model

```typescript
// Upload training data
const finetuneResponse = await fetch(
  'https://api.fireworks.ai/inference/v1/fine_tune',
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${FIREWORKS_API_KEY}` },
    body: JSON.stringify({
      account_id: 'your-account',
      model: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
      training_data: [
        {
          messages: [
            {
              role: 'system',
              content: 'You are a technical documentation expert',
            },
            { role: 'user', content: '...' },
          ],
        },
      ],
    }),
  }
);

// Your fine-tuned model is ready to use
```

### 8. Streaming Chat

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: fireworks('accounts/fireworks/models/llama-v3p3-70b-instruct'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## When to Use Fireworks vs. Alternatives

**Use Fireworks** when you want reliable, scalable access to open models with fine-tuning support. Use **Claude** or **GPT** if you need the strongest proprietary reasoning.

## Popular Models

- **Llama 3.3 70B** — Strong general-purpose
- **DeepSeek-R1** — Excellent reasoning
- **Mixtral 8x7B** — Efficient, capable
- **Codestral** — Code generation specialist

## Resources

- [Fireworks AI Official](https://fireworks.ai)
- [Fireworks AI Documentation](https://docs.fireworks.ai)
- [Fireworks AI Model Library](https://fireworks.ai/models)
- [AI SDK Fireworks Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/fireworks)
- **See the full Fireworks profile on [LLMReference](https://www.llmreference.com/providers/fireworks) →**
