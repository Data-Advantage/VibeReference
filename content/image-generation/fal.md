# fal.ai

fal.ai is a serverless inference platform specialized in running generative AI models, particularly for image and video generation. It offers fast, scalable access to models like Stable Diffusion, FLUX, and other creative AI tools through a simple API.

## Why fal.ai?

- **Image-focused**: Purpose-built for image and video generation workloads
- **Fast inference**: Optimized GPU infrastructure for low-latency image generation
- **Model variety**: Access to FLUX, Stable Diffusion, Ideogram, Recraft, and more
- **Serverless**: No infrastructure to manage, pay only for what you use
- **AI SDK integration**: Works directly with Vercel's AI SDK for image generation

## Getting Started

### 1. Get an API Key

Sign up at [fal.ai](https://fal.ai) and create an API key from the dashboard.

### 2. Set Your Environment Variable

```bash
FAL_API_KEY=your-api-key-here
```

### 3. Install and Use

```bash
npm install @ai-sdk/fal
```

```typescript
import { fal } from '@ai-sdk/fal';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: fal.image('fal-ai/flux-pro/v1.1-ultra'),
  prompt: 'A serene mountain landscape at golden hour',
});
```

## Available Models

| Model | Best For |
|-------|----------|
| `fal-ai/flux-pro/v1.1-ultra` | High-quality professional images |
| `fal-ai/flux-lora` | Custom style images with LoRA adapters |
| `fal-ai/fast-sdxl` | Fast Stable Diffusion XL generation |
| `fal-ai/ideogram/v2` | Text-in-image generation |
| `fal-ai/recraft-v3` | Design and illustration |
| `fal-ai/stable-diffusion-3.5-large` | Stable Diffusion 3.5 |

## Best Practices

- Use FLUX models for the highest quality image generation
- Choose faster models (fast-sdxl, hyper-sdxl) when speed matters more than quality
- Use Ideogram when you need readable text rendered in images
- Implement proper error handling for generation timeouts on complex prompts

## Resources

- [fal.ai Documentation](https://fal.ai/docs)
- [fal.ai Model Gallery](https://fal.ai/models)
- [AI SDK fal Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/fal)
