# AI SDK Providers

AI SDK providers are adapter packages that connect Vercel's AI SDK to specific AI model services. Each provider translates the AI SDK's unified API into the format required by a particular service, letting you switch between models by changing a single import and model name.

## How Providers Work

All providers follow the same pattern:

```typescript
import { providerName } from '@ai-sdk/provider-name';
import { generateText } from 'ai';

const { text } = await generateText({
  model: providerName('model-id'),
  prompt: 'Hello!',
});
```

## Language Model Providers

### OpenAI (`@ai-sdk/openai`)
```typescript
import { openai } from '@ai-sdk/openai';
// openai('gpt-4o'), openai('gpt-4o-mini'), openai.responses('gpt-4o')
```

### Anthropic (`@ai-sdk/anthropic`)
```typescript
import { anthropic } from '@ai-sdk/anthropic';
// anthropic('claude-sonnet-4-20250514'), anthropic('claude-haiku-4-5-20251001')
```

### Google Generative AI (`@ai-sdk/google`)
```typescript
import { google } from '@ai-sdk/google';
// google('gemini-2.0-flash'), google('gemini-2.0-pro')
```

### Mistral (`@ai-sdk/mistral`)
```typescript
import { mistral } from '@ai-sdk/mistral';
// mistral('mistral-large-latest'), mistral('mistral-small-latest')
```

### xAI Grok (`@ai-sdk/xai`)
```typescript
import { xai } from '@ai-sdk/xai';
// xai('grok-2')
```

### DeepSeek (`@ai-sdk/deepseek`)
```typescript
import { deepseek } from '@ai-sdk/deepseek';
// deepseek('deepseek-chat'), deepseek('deepseek-reasoner')
```

### Groq (`@ai-sdk/groq`)
```typescript
import { groq } from '@ai-sdk/groq';
// groq('llama-3.3-70b-versatile'), groq('llama-3.1-8b-instant')
```

### Cerebras (`@ai-sdk/cerebras`)
```typescript
import { cerebras } from '@ai-sdk/cerebras';
// cerebras('llama3.3-70b'), cerebras('llama3.1-8b')
```

### Perplexity (`@ai-sdk/perplexity`)
```typescript
import { perplexity } from '@ai-sdk/perplexity';
// perplexity('sonar-pro'), perplexity('sonar')
```

### Cohere (`@ai-sdk/cohere`)
```typescript
import { cohere } from '@ai-sdk/cohere';
// cohere('command-a-03-2025'), cohere('command-r-plus')
```

### Fireworks (`@ai-sdk/fireworks`)
```typescript
import { fireworks } from '@ai-sdk/fireworks';
// fireworks('accounts/fireworks/models/llama-v3p3-70b-instruct')
```

### Together.ai (`@ai-sdk/togetherai`)
```typescript
import { togetherai } from '@ai-sdk/togetherai';
// togetherai('meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo')
```

## Image Generation Providers

Image generation uses `experimental_generateImage`:

```typescript
import { experimental_generateImage as generateImage } from 'ai';
```

| Provider | Models |
|----------|--------|
| OpenAI | `openai.image('dall-e-3')` |
| Replicate | `replicate.image('black-forest-labs/flux-1.1-pro-ultra')` |
| fal.ai | `fal.image('fal-ai/flux-pro/v1.1-ultra')` |
| Fireworks | `fireworks.image('accounts/fireworks/models/stable-diffusion-xl-1024-v1-0')` |
| Google Vertex | `vertex.image('imagen-3.0-generate-001')` |
| Together.ai | `togetherai.image('black-forest-labs/FLUX.1.1-pro')` |
| Luma | `luma.image('photon-1')` |
| xAI | `xai.image('grok-2-image')` |

## Choosing a Provider

- **Best general-purpose**: OpenAI (GPT-4o) or Anthropic (Claude Sonnet)
- **Fastest inference**: Groq or Cerebras
- **Best open-source models**: Fireworks, Together.ai, or Groq
- **Search-augmented**: Perplexity
- **Best image generation**: Replicate (FLUX) or OpenAI (DALL-E)
- **Enterprise/compliance**: Google Vertex AI or Azure OpenAI

## Resources

- [AI SDK Providers Documentation](https://sdk.vercel.ai/providers)
- [Provider Comparison Guide](https://sdk.vercel.ai/docs/ai-sdk-core/providers-and-models)
