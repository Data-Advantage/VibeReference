# Object Generation

Object generation (also called structured output) is the process of using AI models to produce typed, structured data instead of free-form text. Rather than parsing text responses into JSON, you define a schema and the model generates data that conforms to it directly. This is essential for building reliable AI-powered features like data extraction, classification, and content generation.

## Why Object Generation?

Free-form text responses are unpredictable and hard to use programmatically. Object generation solves this by:

- **Guaranteeing structure**: Output always matches your defined schema
- **Type safety**: Works with TypeScript types through Zod schemas
- **No parsing needed**: No regex or string manipulation to extract data
- **Fewer errors**: The model is constrained to valid output formats

## Using generateObject with AI SDK

The AI SDK provides `generateObject` for structured output:

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1),
    summary: z.string(),
    topics: z.array(z.string()),
  }),
  prompt: 'Analyze the sentiment of: "I love this product!"',
});

// object.sentiment -> 'positive'
// object.confidence -> 0.95
```

## Streaming Object Generation

For larger objects, stream partial results as they are generated:

```typescript
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const result = streamObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    title: z.string(),
    chapters: z.array(z.object({
      heading: z.string(),
      summary: z.string(),
    })),
  }),
  prompt: 'Create an outline for a book about web development.',
});

for await (const partialObject of result.partialObjectStream) {
  console.log(partialObject);
}
```

## Common Use Cases

- **Data extraction**: Pull structured information from unstructured text
- **Content classification**: Categorize content with predefined labels
- **Form generation**: Create form fields from natural language descriptions
- **API response formatting**: Structure AI responses for frontend consumption

## Best Practices

- Keep schemas focused and small for more reliable results
- Use `z.describe()` to add hints that help the model understand field purposes
- Use `z.enum()` for fields with a fixed set of valid values
- Use `streamObject` for schemas with arrays or large nested structures

## Resources

- [AI SDK Object Generation Guide](https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data)
- [generateObject Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object)
- [Zod Documentation](https://zod.dev)
