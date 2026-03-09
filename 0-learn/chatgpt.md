# ChatGPT

ChatGPT is OpenAI's conversational AI product built on GPT models. While ChatGPT is the consumer-facing chat application, developers interact with the same underlying models through the OpenAI API. Understanding ChatGPT helps contextualize what GPT models can do and how to build similar experiences in your own applications.

## ChatGPT vs the OpenAI API

| Aspect | ChatGPT | OpenAI API |
|--------|---------|------------|
| Audience | End users | Developers |
| Interface | Web/mobile chat app | REST API / SDK |
| Customization | Limited (custom GPTs) | Full control over prompts, tools, and behavior |
| Pricing | Subscription ($20/month for Plus) | Pay per token |
| Data | May be used for training | Not used for training (API) |

## Building a ChatGPT-like Experience

You can build your own ChatGPT-style interface using the OpenAI API and AI SDK:

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}
```

```tsx
// app/page.tsx
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

## GPT Models Available via API

- **GPT-4 Turbo**: Most capable model with vision support
- **GPT-4o**: Optimized version with faster response times
- **GPT-4o Mini**: Cost-effective for simpler tasks
- **o1 / o3**: Reasoning models that think step-by-step before answering

## Key Capabilities

- **Conversation**: Multi-turn dialogue with context retention
- **Code generation**: Write, explain, and debug code
- **Analysis**: Process and analyze text, data, and documents
- **Tool use**: Call external functions and APIs
- **Vision**: Analyze images when using vision-capable models

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [ChatGPT](https://chat.openai.com)
- [AI SDK OpenAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
