# OpenAI Developer Platform

The OpenAI Developer Platform provides API access to GPT, DALL-E, Whisper, and other AI models. It is the primary way developers integrate OpenAI's models into their applications, offering endpoints for chat completions, image generation, text-to-speech, moderation, and more.

## Getting Started

### 1. Create an Account

Sign up at [platform.openai.com](https://platform.openai.com) and generate an API key.

### 2. Set Your Environment Variable

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Install the SDK

```bash
npm install openai
```

### 4. Make an API Call

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is TypeScript?' },
  ],
});

console.log(completion.choices[0].message.content);
```

## Key APIs

| API | Purpose |
|-----|---------|
| Chat Completions | Conversational AI, text generation |
| Responses | Latest API with built-in tool use and web search |
| Assistants | Persistent threads with file search and code execution |
| Images (DALL-E) | Image generation and editing |
| Audio (Whisper/TTS) | Speech-to-text and text-to-speech |
| Embeddings | Convert text to vector representations |
| Moderation | Content safety classification |

## Using with AI SDK (Recommended)

For Next.js applications, use the AI SDK provider for simpler integration:

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const result = streamText({
  model: openai('gpt-4-turbo'),
  messages,
});

return result.toDataStreamResponse();
```

## Responses API

The Responses API is OpenAI's latest endpoint, combining chat completions with built-in tools:

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: openai.responses('gpt-4o'),
  prompt: 'What happened in tech news today?',
});
```

## Best Practices

- Store API keys in environment variables, never in code
- Set `max_tokens` to control response length and costs
- Use `gpt-4o-mini` for simpler tasks to reduce costs
- Implement rate limiting to stay within API quotas
- Monitor usage in the OpenAI dashboard

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Cookbook](https://cookbook.openai.com)
- [AI SDK OpenAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
- [OpenAI Pricing](https://openai.com/pricing)
