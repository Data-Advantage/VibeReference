# AI SDK (Vercel)

The AI SDK is Vercel's open-source toolkit for building AI-powered applications in JavaScript and TypeScript. It provides a unified API for working with large language models from any provider, along with React hooks for building streaming chat UIs and tools for structured data generation.

## Overview

The AI SDK has three main layers:

- **AI SDK Core**: Server-side functions (`generateText`, `streamText`, `generateObject`) for interacting with LLMs
- **AI SDK UI**: React hooks (`useChat`, `useCompletion`, `useAssistant`) for building chat interfaces
- **AI SDK Providers**: Adapters for OpenAI, Anthropic, Google, Mistral, and many more

## Installation

```bash
npm install ai zod
```

Then install the provider package for the model you want to use:

```bash
npm install @ai-sdk/openai      # OpenAI / GPT models
npm install @ai-sdk/anthropic   # Anthropic / Claude models
npm install @ai-sdk/google      # Google / Gemini models
```

## Quick Start

### Server-Side: Generate Text

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'What is the capital of France?',
});
```

### Server-Side: Stream a Response

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Client-Side: Chat Interface

```tsx
'use client';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## Structured Data with Zod

Generate typed JSON objects instead of free-form text:

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
  }),
  prompt: 'Summarize this article about climate change...',
});
// object.title, object.summary, object.tags are fully typed
```

## Provider Flexibility

The AI SDK's biggest advantage is that switching providers requires changing just one line:

```typescript
// Switch from OpenAI to Anthropic:
import { anthropic } from '@ai-sdk/anthropic';

const result = await generateText({
  model: anthropic('claude-sonnet-4-20250514'), // was: openai('gpt-4-turbo')
  prompt: 'Hello!',
});
```

## Environment Variables

Set the API key for your chosen provider:

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## When to Use the AI SDK

- **Building chat UIs** with streaming responses
- **Generating structured data** (summaries, classifications, extractions)
- **Multi-provider apps** where you want to compare or switch models easily
- **Next.js apps** that need AI features with minimal setup

## Resources

- [AI SDK Documentation](https://sdk.vercel.ai/)
- [AI SDK GitHub Repository](https://github.com/vercel/ai)
- [AI SDK Examples](https://sdk.vercel.ai/docs/getting-started)
- [Supported Providers](https://sdk.vercel.ai/providers)
