# Black Forest Labs FLUX

FLUX is a family of AI image generation models created by Black Forest Labs, the team behind Stable Diffusion. FLUX models are known for their high image quality, prompt adherence, and versatility across artistic styles. They are available through platforms like Replicate, fal.ai, Together.ai, and Fireworks.

## Available Models

- **FLUX 1.1 Pro Ultra**: Highest quality, best for professional use
- **FLUX 1.1 Pro**: High quality with good speed
- **FLUX Pro**: Original professional model
- **FLUX Dev**: Development and experimentation model
- **FLUX Schnell**: Fastest model, optimized for speed over quality

## Getting Started

### Using via Replicate

```bash
npm install @ai-sdk/replicate
```

```typescript
import { replicate } from '@ai-sdk/replicate';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: replicate.image('black-forest-labs/flux-1.1-pro-ultra'),
  prompt: 'A vibrant abstract painting with bold geometric shapes',
});
```

### Using via fal.ai

```typescript
import { fal } from '@ai-sdk/fal';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: fal.image('fal-ai/flux-pro/v1.1-ultra'),
  prompt: 'A serene Japanese garden in autumn',
});
```

## FLUX vs Other Image Models

| Feature | FLUX | DALL-E 3 | Stable Diffusion |
|---------|------|----------|------------------|
| Image quality | Excellent | Excellent | Good to excellent |
| Prompt following | Very high | High | Moderate |
| Speed | Fast (Schnell) | Moderate | Varies |
| Customization | LoRA support | Limited | Extensive |
| Text in images | Moderate | Good | Poor |
| Open weights | Dev/Schnell | No | Yes |

## Best Practices

- Use FLUX Pro Ultra for final, client-facing images
- Use FLUX Schnell during development for fast iteration
- FLUX Dev is open-weight and available for local experimentation
- Provide detailed, descriptive prompts for best results

## Resources

- [Black Forest Labs](https://blackforestlabs.ai)
- [FLUX on Replicate](https://replicate.com/black-forest-labs)
- [AI SDK Replicate Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/replicate)
