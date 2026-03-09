# Google Gemini

Google Gemini is Google's family of multimodal AI models capable of understanding and generating text, code, images, audio, and video. Gemini models are available through Google AI Studio and the Google Cloud Vertex AI platform, making them accessible for both prototyping and production use.

## Available Models

- **Gemini 2.0 Pro**: Most capable model for complex reasoning and generation tasks
- **Gemini 2.0 Flash**: Fast, efficient model balancing performance with speed
- **Gemini 2.0 Flash Lite**: Lightweight model optimized for high-volume, low-latency tasks

## Getting Started

### 1. Get an API Key

Visit [Google AI Studio](https://aistudio.google.com/apikey) to create a free API key.

### 2. Set Your Environment Variable

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
```

### 3. Install the AI SDK Provider

```bash
npm install @ai-sdk/google
```

### 4. Use Gemini in Your Application

```typescript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const { text } = await generateText({
  model: google('gemini-2.0-flash'),
  prompt: 'Explain how photosynthesis works.',
});
```

## Key Features

- **Multimodal input**: Process text, images, audio, and video in a single request
- **Long context window**: Support for up to 1 million tokens of context
- **Grounding with Google Search**: Connect responses to real-time web information
- **Code execution**: Run code as part of the generation process
- **Structured output**: Generate JSON conforming to defined schemas

## Streaming Chat with Gemini

```typescript
// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## Best Practices

- Use Gemini Flash for most tasks — it offers the best speed-to-quality ratio
- Take advantage of the long context window for document analysis tasks
- Use Google AI Studio to prototype and test prompts before integrating into code
- Set up billing alerts in Google Cloud Console to monitor usage costs

## Resources

- [Google AI Studio](https://aistudio.google.com)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [AI SDK Google Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
