# AI SDK UI

The AI SDK UI library (`@ai-sdk/react`) provides React hooks for building interactive AI chat interfaces, assistants, and completion UIs. It handles the complexity of streaming responses, managing conversation state, and connecting to AI-powered API routes, so you can focus on building great user experiences.

## Why Use AI SDK UI?

Building a chat interface from scratch requires managing streaming connections, message state, loading indicators, error handling, and form submissions. AI SDK UI abstracts all of this into simple React hooks:

- **useChat**: For building conversational chat interfaces with streaming
- **useCompletion**: For single-prompt completion UIs
- **useAssistant**: For integrating with OpenAI's Assistants API
- **useObject**: For generating structured data objects with streaming

## Installation

```bash
npm install ai @ai-sdk/react @ai-sdk/openai
```

## Key Concepts

### Streaming Responses

AI SDK UI streams responses token-by-token from the server, giving users immediate feedback instead of waiting for the full response. This is handled automatically by the hooks.

### Message Management

Each hook manages an array of messages with roles (`user`, `assistant`, `system`, `data`) and provides methods to append, update, or reset the conversation.

### Server Integration

The hooks connect to Next.js API routes that use AI SDK Core functions like `streamText` or `generateText` on the backend.

## Building a Chatbot with useChat

The most common pattern is a streaming chat interface. Here's the frontend component:

```tsx
'use client';

import { useChat } from '@ai-sdk/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4 mb-4">
        {messages.map(message => (
          <div key={message.id} className={message.role === 'user' ? 'text-right' : ''}>
            <span className="font-bold">{message.role === 'user' ? 'You' : 'AI'}:</span>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
```

And the corresponding API route on the server:

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

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

## Using the OpenAI Assistants API

If you want to use OpenAI Assistants (with features like file search, code interpreter, and function calling), use the `useAssistant` hook:

```tsx
'use client';

import { Message, useAssistant } from '@ai-sdk/react';

export default function AssistantChat() {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: '/api/assistant' });

  return (
    <div className="max-w-2xl mx-auto p-4">
      {messages.map((m: Message) => (
        <div key={m.id} className="mb-2">
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}

      {status === 'in_progress' && <p className="text-gray-500">Thinking...</p>}

      <form onSubmit={submitMessage}>
        <input
          disabled={status !== 'awaiting_message'}
          value={input}
          placeholder="Ask a question..."
          onChange={handleInputChange}
          className="border rounded px-3 py-2 w-full"
        />
      </form>
    </div>
  );
}
```

## Useful Hook Options

The `useChat` hook accepts several configuration options:

- **api**: Custom API endpoint (default: `/api/chat`)
- **initialMessages**: Pre-populate the conversation
- **onFinish**: Callback when a response completes
- **onError**: Handle errors gracefully
- **body**: Extra data to send with every request (e.g., user ID, settings)
- **headers**: Custom headers for the API request

```typescript
const { messages, input, handleSubmit, handleInputChange } = useChat({
  api: '/api/custom-chat',
  initialMessages: [
    { id: '1', role: 'assistant', content: 'Hello! How can I help you today?' }
  ],
  body: { userId: 'user-123' },
  onFinish: (message) => {
    console.log('Response complete:', message.content);
  },
  onError: (error) => {
    console.error('Chat error:', error);
  },
});
```

## Best Practices

- **Set maxDuration on API routes** to allow longer streaming responses (default is 10 seconds on Vercel)
- **Add loading states** using `isLoading` from `useChat` to disable inputs during generation
- **Handle errors** with `onError` and display user-friendly messages
- **Use system prompts** on the server side to control the AI's behavior and personality
- **Implement rate limiting** on your API routes to prevent abuse

## Resources

- [AI SDK UI Documentation](https://sdk.vercel.ai/docs/ai-sdk-ui/overview)
- [useChat Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat)
- [useAssistant Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-assistant)
- [AI SDK GitHub Repository](https://github.com/vercel/ai)
