# Luma Photon

Luma Photon is an AI image generation model from Luma AI, known for producing high-quality, photorealistic images. Available through the AI SDK and platforms like Replicate, Photon is designed for generating images that look natural and detailed, making it well-suited for product photography, marketing visuals, and creative content.

## Available Models

- **Photon 1**: Full-quality model optimized for photorealism and detail
- **Photon Flash 1**: Faster variant that trades some quality for speed

## Getting Started

### Using with AI SDK via Luma Provider

```bash
npm install @ai-sdk/luma
```

```typescript
import { luma } from '@ai-sdk/luma';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: luma.image('photon-1'),
  prompt: 'A professional product photo of a leather notebook on a wooden desk',
});
```

### Using via Replicate

```bash
npm install @ai-sdk/replicate
```

```typescript
import { replicate } from '@ai-sdk/replicate';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: replicate.image('luma/photon'),
  prompt: 'A cozy coffee shop interior with warm lighting',
});
```

## When to Use Photon

- **Product photography**: Generate realistic product images for e-commerce
- **Marketing materials**: Create visuals for social media and advertising
- **Photorealistic scenes**: When you need images that look like real photographs
- **Rapid prototyping**: Quickly generate visual concepts before professional shoots

## Photon vs Other Models

| Model | Strength |
|-------|----------|
| Photon | Photorealism, natural lighting |
| FLUX | Versatile, high quality across styles |
| Stable Diffusion | Customizable, fine-tunable |
| DALL-E | Text understanding, creative concepts |
| Ideogram | Text rendering within images |

## Resources

- [Luma AI](https://lumalabs.ai)
- [AI SDK Luma Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/luma)
