# Together AI

Together AI is a cloud platform for running open-source AI models at scale. It provides fast inference, fine-tuning, and training capabilities for models like Llama, DeepSeek, FLUX, and Stable Diffusion, making enterprise-grade open-source AI accessible through a simple API.

## Why Together AI?

- **Wide model selection**: Hundreds of open-source language and image models
- **Fast inference**: Optimized infrastructure for low-latency responses
- **Fine-tuning**: Customize open-source models with your own data
- **Image generation**: Access to FLUX, Stable Diffusion, and other image models
- **Cost-effective**: Competitive pricing for open-source model inference
- **AI SDK integration**: Works with Vercel's AI SDK out of the box

## Getting Started

### 1. Get an API Key

Sign up at [together.ai](https://together.ai) and generate an API key.

### 2. Install and Use

```bash
npm install @ai-sdk/togetherai
```

```typescript
import { togetherai } from '@ai-sdk/togetherai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: togetherai('meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo'),
  prompt: 'What are microservices and when should you use them?',
});
```

## Popular Models

### Language Models

- `meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo` — Fast Llama 3.3
- `deepseek-ai/DeepSeek-V3` — DeepSeek V3
- `Qwen/Qwen2.5-72B-Instruct-Turbo` — Qwen 2.5

### Image Generation

```typescript
import { togetherai } from '@ai-sdk/togetherai';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: togetherai.image('black-forest-labs/FLUX.1.1-pro'),
  prompt: 'A minimalist logo design for a tech startup',
});
```

## Resources

- [Together AI Documentation](https://docs.together.ai)
- [Together AI Model Library](https://api.together.ai/models)
- [AI SDK Together Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/togetherai)
