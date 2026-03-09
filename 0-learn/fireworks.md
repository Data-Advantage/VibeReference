# Fireworks AI

Fireworks AI is an inference platform optimized for running open-source and fine-tuned AI models at high speed and low cost. It provides API access to models like Llama, DeepSeek, Mixtral, and Stable Diffusion, with performance that often rivals running models on your own infrastructure.

## Why Fireworks?

- **Fast inference**: Optimized infrastructure delivers low-latency responses
- **Open-source models**: Access to Llama, DeepSeek, Mixtral, and many other open models
- **Image generation**: Run Stable Diffusion and other image models via API
- **Cost effective**: Competitive pricing compared to proprietary model providers
- **Fine-tuning**: Upload and serve your own fine-tuned models

## Getting Started

### 1. Get an API Key

Sign up at [fireworks.ai](https://fireworks.ai) and generate an API key.

### 2. Set Your Environment Variable

```bash
FIREWORKS_API_KEY=your-api-key-here
```

### 3. Install and Use

```bash
npm install @ai-sdk/fireworks
```

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { generateText } from 'ai';

const { text } = await generateText({
  model: fireworks('accounts/fireworks/models/llama-v3p3-70b-instruct'),
  prompt: 'Explain the difference between REST and GraphQL.',
});
```

## Available Models

### Language Models

- `llama-v3p3-70b-instruct` — Meta Llama 3.3 70B
- `llama-v3p1-405b-instruct` — Meta Llama 3.1 405B
- `deepseek-r1` — DeepSeek R1 reasoning model
- `deepseek-v3` — DeepSeek V3

### Image Generation

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: fireworks.image('accounts/fireworks/models/stable-diffusion-xl-1024-v1-0'),
  prompt: 'A futuristic cityscape at sunset',
});
```

## Resources

- [Fireworks AI Documentation](https://docs.fireworks.ai)
- [Fireworks AI Model Library](https://fireworks.ai/models)
- [AI SDK Fireworks Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/fireworks)
