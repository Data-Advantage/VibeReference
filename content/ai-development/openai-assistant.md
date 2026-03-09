# OpenAI Assistants API

The OpenAI Assistants API lets you build AI assistants that can use tools like code interpreter, file search, and custom functions. Unlike the Chat Completions API, Assistants maintain persistent conversation threads, can process uploaded files, and execute multi-step tasks autonomously.

## Why Use the Assistants API?

The Assistants API is ideal when your AI features need more than simple chat:

- **Persistent Threads**: Conversations are stored by OpenAI, so users can return to previous sessions
- **File Search**: Upload documents and let the assistant search through them to answer questions
- **Code Interpreter**: The assistant can write and run Python code to analyze data, create charts, or process files
- **Function Calling**: Define custom tools that the assistant can invoke to interact with your application

## Setup

### 1. Create an OpenAI Project

Sign up at the [OpenAI Platform](https://platform.openai.com), create a project, and generate an API key. Store it as the `OPENAI_API_KEY` environment variable.

### 2. Create an Assistant

You can create assistants through the OpenAI Dashboard or via the API:

```bash
# Via the OpenAI Dashboard:
# 1. Go to platform.openai.com > Assistants
# 2. Click "Create Assistant"
# 3. Configure name, instructions, model, and tools
# 4. Copy the Assistant ID
```

Store the assistant ID as the `ASSISTANT_ID` environment variable.

### 3. Install Dependencies

```bash
npm install ai @ai-sdk/react openai
```

## Building the Server Route

Create an API route that communicates with the OpenAI Assistants API using Vercel's AI SDK:

```typescript
// app/api/assistant/route.ts
import { AssistantResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();

  // Create a thread if needed, or continue an existing one
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add the user's message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: input.message,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      // Run the assistant and stream the response
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id: process.env.ASSISTANT_ID!,
      });

      let runResult = await forwardStream(runStream);

      // Handle tool calls if the assistant needs to use functions
      while (
        runResult?.status === 'requires_action' &&
        runResult.required_action?.type === 'submit_tool_outputs'
      ) {
        const tool_outputs =
          runResult.required_action.submit_tool_outputs.tool_calls.map(
            (toolCall: any) => {
              const parameters = JSON.parse(toolCall.function.arguments);

              switch (toolCall.function.name) {
                // Add your custom function handlers here
                default:
                  throw new Error(
                    `Unknown tool call: ${toolCall.function.name}`,
                  );
              }
            },
          );

        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runResult.id,
            { tool_outputs },
          ),
        );
      }
    },
  );
}
```

## Building the Chat Interface

Use the `useAssistant` hook from AI SDK to create the frontend:

```tsx
'use client';

import { Message, useAssistant } from '@ai-sdk/react';

export default function AssistantChat() {
  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    threadId,
    setThreadId,
    error,
    stop,
  } = useAssistant({
    api: '/api/assistant',
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      {threadId && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <span>Thread: {threadId.substring(0, 8)}...</span>
          <button onClick={() => setThreadId(undefined)}>
            New Conversation
          </button>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {messages.map((m: Message) => (
          <div key={m.id} className="p-3 rounded-lg border">
            <strong>{m.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <p>{m.content}</p>
          </div>
        ))}
      </div>

      {status === 'in_progress' && <p>Assistant is thinking...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      <form onSubmit={submitMessage} className="flex gap-2">
        <input
          disabled={status !== 'awaiting_message'}
          value={input}
          placeholder="Ask something..."
          onChange={handleInputChange}
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" disabled={status !== 'awaiting_message'}>
          Send
        </button>
      </form>
    </div>
  );
}
```

## Key Differences from useChat

| Feature | useChat | useAssistant |
|---------|---------|-------------|
| Backend | Your own AI logic | OpenAI Assistants API |
| Threads | Managed by you | Managed by OpenAI |
| File search | Not built-in | Built-in tool |
| Code execution | Not built-in | Built-in tool |
| Status states | `isLoading` boolean | `status` string (awaiting_message, in_progress) |

## Best Practices

- **Use thread IDs** to let users continue previous conversations
- **Set maxDuration** on your API route for longer assistant runs (complex tool use can take time)
- **Handle all tool calls** in your switch statement to avoid runtime errors
- **Store thread IDs** in your database if you want users to return to conversations later
- **Monitor usage** in the OpenAI dashboard since Assistants API calls include storage costs for threads and files

## Resources

- [OpenAI Assistants API Documentation](https://platform.openai.com/docs/assistants/overview)
- [AI SDK useAssistant Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-assistant)
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
