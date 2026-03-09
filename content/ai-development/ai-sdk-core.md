# AI SDK Core

AI SDK Core is the server-side foundation of Vercel's AI SDK. It provides model-agnostic functions for text generation, structured data output, tool calling, and embeddings. You write your AI logic once, and can switch between OpenAI, Anthropic, Google, and other providers by changing a single line.

## Why Use AI SDK Core?

- **Provider agnostic**: Switch between GPT-4, Claude, Gemini, or any supported model without rewriting your code
- **Streaming built-in**: Stream responses token-by-token with a single function call
- **Structured output**: Generate typed JSON objects using Zod schemas
- **Tool calling**: Let AI models invoke functions you define
- **Lightweight**: Works in any JavaScript/TypeScript environment (Node.js, Edge, serverless)

## Installation

```bash
npm install ai @ai-sdk/openai zod
```

Install additional provider packages as needed:

```bash
npm install @ai-sdk/anthropic   # For Claude models
npm install @ai-sdk/google      # For Gemini models
```

## Core Functions

### generateText — Simple Text Generation

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Explain quantum computing in simple terms.',
});
```

### streamText — Streaming Text Generation

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a robot.',
});

// In a Next.js API route:
return result.toDataStreamResponse();
```

### generateObject — Structured Data Generation

Generate typed JSON that conforms to a Zod schema:

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({
        name: z.string(),
        amount: z.string(),
      })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a recipe for chocolate chip cookies.',
});

// object is fully typed: object.recipe.name, object.recipe.ingredients, etc.
```

### streamObject — Streaming Structured Data

Stream structured data as it's generated, useful for showing partial results:

```typescript
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const result = streamObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    summary: z.string(),
    tags: z.array(z.string()),
  }),
  prompt: 'Summarize and tag this article...',
});
```

## Switching Providers

The key advantage of AI SDK Core is provider portability:

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

// Same function, different models:
const result1 = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Hello',
});

const result2 = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: 'Hello',
});

const result3 = await generateText({
  model: google('gemini-pro'),
  prompt: 'Hello',
});
```

## Tool Calling

Define tools that the AI model can invoke:

```typescript
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  tools: {
    getWeather: tool({
      description: 'Get the current weather for a location',
      parameters: z.object({
        city: z.string().describe('The city name'),
      }),
      execute: async ({ city }) => {
        // Call your weather API here
        return { temperature: 72, condition: 'sunny' };
      },
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Best Practices

- **Use generateObject** instead of parsing JSON from text responses — it's more reliable and type-safe
- **Set system prompts** to control the model's behavior and output format
- **Handle token limits** by keeping prompts concise and setting `maxTokens`
- **Use streaming** for user-facing features to provide immediate feedback
- **Cache responses** for identical prompts to reduce costs and latency

## Resources

- [AI SDK Core Documentation](https://sdk.vercel.ai/docs/ai-sdk-core/overview)
- [AI SDK Providers List](https://sdk.vercel.ai/docs/ai-sdk-core/providers-and-models)
- [generateText Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-text)
- [generateObject Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object)
