# xAI Grok

Grok is xAI's large language model, created by Elon Musk's AI company. Grok models are known for their conversational abilities, real-time knowledge (via X/Twitter integration), and image generation capabilities. They are available through the xAI API and compatible with the AI SDK.

## Available Models

- **Grok 2**: Latest text generation model with strong reasoning capabilities
- **Grok 2 Image**: Image generation model

## Getting Started

### 1. Get an API Key

Sign up at the [xAI Console](https://console.x.ai) and generate an API key.

### 2. Set Your Environment Variable

```bash
XAI_API_KEY=your-api-key-here
```

### 3. Install and Use

```bash
npm install @ai-sdk/xai
```

```typescript
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: xai('grok-2'),
  prompt: 'Explain the difference between TCP and UDP.',
});
```

## Image Generation

Grok 2 supports image generation:

```typescript
import { xai } from '@ai-sdk/xai';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: xai.image('grok-2-image'),
  prompt: 'A futuristic space station orbiting Earth',
});
```

## Key Features

- **Real-time knowledge**: Grok has access to current information through X/Twitter
- **Conversational**: Designed for natural, engaging dialogue
- **Image generation**: Built-in image creation capabilities
- **API compatible**: Works with standard chat completion formats

## Resources

- [xAI API Documentation](https://docs.x.ai)
- [xAI Console](https://console.x.ai)
- [AI SDK xAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/xai)
