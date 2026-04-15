# xAI Grok

Grok is xAI's reasoning model with real-time knowledge from X/Twitter — an emerging alternative for developers who want access to current information and strong conversational abilities.

## Why Vibe Coders Should Watch It

- **Real-time knowledge** — Grok has access to current information via X/Twitter integration
- **Strong conversational** — designed for natural, engaging dialogue (not just task completion)
- **Image generation** — built-in image creation without a separate API
- **Growing API availability** — early-stage but improving ecosystem
- **Emerging competition** — monitoring for future integration

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Chat applications needing real-time knowledge, image generation |
| Context window | ~8K tokens (varies by model) |
| Tool use / function calling | Limited support |
| Agentic capability | Not ideal — limited tool use and reasoning capabilities |
| API availability | xAI API only (no AWS/Azure/cloud partners yet) |
| Pricing tier | ~$3 per 1M input / $9 per 1M output tokens (higher than alternatives) |
| Maturity | Early-stage (watch for improvements) |

## Getting Started

### 1. Get an API Key

Sign up at [console.x.ai](https://console.x.ai) and generate an API key.

### 2. Set Your Environment Variable

```bash
XAI_API_KEY=your-api-key-here
```

### 3. Install the AI SDK Provider

```bash
npm install @ai-sdk/xai
```

### 4. Quick Example

```typescript
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

// Grok has access to real-time information from X
const { text } = await generateText({
  model: xai('grok-2'),
  prompt: 'What are the latest AI model releases this week? What matters for developers?',
});

console.log(text);
```

### 5. Image Generation

```typescript
import { xai } from '@ai-sdk/xai';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: xai.image('grok-2-image'),
  prompt: 'A sleek, modern tech startup logo with minimalist design',
});

console.log(image.url);
```

### 6. Streaming Chat

```typescript
import { xai } from '@ai-sdk/xai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: xai('grok-2'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## When to Use Grok vs. Alternatives

**Use Grok** if you specifically need real-time knowledge or are experimenting with new models. For production applications, **Claude** and **GPT** remain more reliable and better-supported. This is a "watch" entry — Grok is developing, but not yet a standard choice.

## Available Models

- **Grok 2** — Latest text generation model
- **Grok 2 Image** — Image generation

## Resources

- [xAI Official](https://x.ai)
- [xAI API Documentation](https://docs.x.ai)
- [xAI Console](https://console.x.ai)
- [AI SDK xAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/xai)
- **See the full Grok profile on [LLMReference](https://www.llmreference.com/providers/xai) →**
