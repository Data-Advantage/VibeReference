# OpenAI Responses API

The Responses API is OpenAI's latest API for building AI applications. It combines the capabilities of the Chat Completions API with built-in tools like web search, file search, and computer use. It is designed to be the primary API going forward, replacing older endpoints for new development.

## Responses API vs Chat Completions

| Feature | Responses API | Chat Completions |
|---------|--------------|-----------------|
| Built-in web search | Yes | No |
| Built-in file search | Yes | No |
| Function calling | Yes | Yes |
| Streaming | Yes | Yes |
| Stateless | Yes (default) | Yes |
| Recommended for | New projects | Existing projects |

## Getting Started

### Using the AI SDK

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: openai.responses('gpt-4o'),
  prompt: 'What are the latest developments in AI?',
});
```

### Using the OpenAI SDK Directly

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const response = await openai.responses.create({
  model: 'gpt-4o',
  input: 'Explain the concept of quantum computing.',
});

console.log(response.output_text);
```

## Built-in Tools

### Web Search

The Responses API can search the web as part of generating a response:

```typescript
const response = await openai.responses.create({
  model: 'gpt-4o',
  tools: [{ type: 'web_search_preview' }],
  input: 'What is the current weather in San Francisco?',
});
```

### File Search

Search through uploaded files:

```typescript
const response = await openai.responses.create({
  model: 'gpt-4o',
  tools: [{
    type: 'file_search',
    vector_store_ids: ['vs_abc123'],
  }],
  input: 'Find information about pricing in the uploaded documents.',
});
```

## Structured Output

Generate typed JSON with the Responses API:

```typescript
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai.responses('gpt-4o'),
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a recipe for pasta carbonara.',
});
```

## Best Practices

- Use `openai.responses()` instead of `openai()` in the AI SDK to use the Responses API
- Take advantage of built-in web search for questions that need current information
- Use file search when you have documents the model should reference
- The Responses API supports all GPT-4o and o-series models

## Resources

- [Responses API Documentation](https://platform.openai.com/docs/api-reference/responses)
- [Responses API Guide](https://platform.openai.com/docs/guides/responses)
- [AI SDK OpenAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
