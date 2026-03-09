# Google Generative AI SDK

The Google Generative AI SDK (`@google/generative-ai`) is Google's official JavaScript/TypeScript library for interacting with Gemini models. It provides direct access to text generation, multimodal processing, embeddings, and structured output through Google AI Studio's API.

## When to Use This vs AI SDK

- **Google Generative AI SDK**: Use when you need Google-specific features like grounding, caching, or direct access to Gemini-only capabilities
- **AI SDK with Google Provider** (`@ai-sdk/google`): Use when you want provider portability and built-in streaming UI hooks

## Getting Started

```bash
npm install @google/generative-ai
```

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const result = await model.generateContent('Explain quantum computing simply.');
console.log(result.response.text());
```

## Multimodal Input

Send images along with text prompts:

```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const result = await model.generateContent([
  'Describe what you see in this image.',
  {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64ImageData,
    },
  },
]);
```

## Streaming Responses

```typescript
const result = await model.generateContentStream('Write a short story.');

for await (const chunk of result.stream) {
  process.stdout.write(chunk.text());
}
```

## Using with AI SDK (Recommended for Next.js)

For Next.js applications, the AI SDK provider is typically simpler:

```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const result = streamText({
  model: google('gemini-2.0-flash'),
  prompt: 'Hello!',
});
```

## Resources

- [Google AI for Developers](https://ai.google.dev)
- [Google Generative AI SDK on npm](https://www.npmjs.com/package/@google/generative-ai)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/node_quickstart)
