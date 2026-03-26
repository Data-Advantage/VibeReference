# Google Gemini

Gemini is Google's multimodal AI model with the largest context window available — 1M+ tokens for processing entire codebases in a single request.

## Why Vibe Coders Use It

- **Massive context window** — 1M+ tokens means you can paste entire projects for analysis
- **Multimodal** — understand code, images, audio, and video in one request
- **Integrated with Google ecosystem** — works with Drive, Gmail, YouTube, Search
- **Fast and efficient** — competitive speed with strong reasoning capabilities
- **Grounding with Google Search** — get real-time web information in responses

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Codebase analysis, document processing, multimodal tasks |
| Context window | 1,000,000+ tokens (Gemini 2.5 Pro) |
| Tool use / function calling | Native, works well |
| Agentic capability | Good — suitable for multi-step workflows |
| API availability | Google AI Studio (free), Google Cloud Vertex AI |
| Pricing tier | Free tier available; pay-as-you-go ($1.25-$10 per 1M tokens) |

## Getting Started

### 1. Get a Free API Key

Visit [Google AI Studio](https://aistudio.google.com/apikey) to create a free API key (no credit card required).

### 2. Set Your Environment Variable

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
```

### 3. Install the AI SDK Provider

```bash
npm install @ai-sdk/google
```

### 4. Analyze an Entire Codebase

```typescript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Example: paste an entire Next.js project file structure
const codebaseContext = `
// app/page.tsx
export default function Home() {
  return <div>Hello World</div>
}

// app/api/route.ts
export async function GET(request: Request) {
  return Response.json({ data: [] })
}

// package.json
{
  "name": "my-app",
  "dependencies": { "next": "^15" }
}
`;

const { text } = await generateText({
  model: google('gemini-2.5-pro'),
  prompt: `Review this codebase structure and suggest architectural improvements:\n${codebaseContext}`,
});

console.log(text);
```

### 5. Streaming Chat Example

```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 6. Image Analysis Example

```typescript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const { text } = await generateText({
  model: google('gemini-2.5-pro-vision'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          image: new URL('https://example.com/screenshot.png'),
        },
        {
          type: 'text',
          text: 'What UI improvements would you suggest for this design?',
        },
      ],
    },
  ],
});

console.log(text);
```

## When to Use This vs. Alternatives

**Use Gemini** when you need to analyze large amounts of code or documents in a single request (thanks to the 1M token context). Use **Claude** if you need the best reasoning. Use **GPT-4o** for general-purpose speed and reliability.

## Available Models

- **Gemini 2.5 Pro** — Most capable, ideal for complex analysis
- **Gemini 2.5 Flash** — Fast and efficient, best for most tasks
- **Gemini 2.5 Flash Lite** — Optimized for speed and cost

## Resources

- [Google AI Studio](https://aistudio.google.com) (free tier, no credit card)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [AI SDK Google Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
- [Gemini Pricing](https://ai.google.dev/pricing)
- **See the full Gemini profile on [LLMReference](https://www.llmreference.com/providers/google) →**
