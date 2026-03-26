# Groq

Groq is the speed champion for AI inference — custom-built Language Processing Units (LPUs) deliver ultra-fast responses, critical for real-time coding assistants and interactive agentic loops.

## Why Vibe Coders Use It

- **Fastest inference available** — 10-50x faster than GPU-based alternatives
- **Real-time responsiveness** — critical for interactive coding assistants and user-facing AI
- **Runs popular open models** — Llama, Mixtral, Gemma, Claude, and others
- **Predictable latency** — consistent response times regardless of prompt length
- **Cost-effective** — pay for throughput, not compute time

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Real-time chat, interactive features, agentic loops needing speed |
| Supported models | Llama 3, Mixtral, Gemma, Falcon, and more |
| Inference latency | 10-100ms (vs 200-500ms on standard GPUs) |
| Tool use / function calling | Depends on underlying model (supported) |
| Agentic capability | Excellent — fast enough for real-time autonomous agents |
| API availability | Groq Cloud API, LangChain integration, OpenAI-compatible interface |
| Pricing tier | Pay-as-you-go (~$0.05 per 1M tokens, varying by model) |

## Getting Started

### 1. Sign Up for Groq Cloud

Visit [groq.com](https://groq.com) and create an account.

### 2. Generate an API Key

Create an API key from the Groq Cloud Console.

### 3. Install the SDK

```bash
npm install groq-sdk
# or for Vercel's AI SDK:
npm install @ai-sdk/groq
```

### 4. Run a Fast Inference Example

```typescript
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const message = await groq.chat.completions.create({
  messages: [
    {
      role: 'user',
      content: 'Explain React hooks in 50 words or less',
    },
  ],
  model: 'mixtral-8x7b-32768', // Fast, capable model
});

console.log(message.choices[0].message.content);
```

### 5. Streaming Example (For User-Facing Chat)

```typescript
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq('mixtral-8x7b-32768'),
    messages,
    // Groq will stream tokens ultra-fast
  });

  return result.toDataStreamResponse();
}
```

### 6. Real-Time Agentic Loop Example

```typescript
// Groq is ideal for agents that call tools frequently
// because the speed makes the loop feel responsive

async function agent(userTask: string) {
  let messages = [{ role: 'user' as const, content: userTask }];

  for (let i = 0; i < 5; i++) {
    // Get response from Groq (ultra-fast)
    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: messages as any,
      tools: [...], // define tools
    });

    // If tool is needed, execute it and continue immediately
    // Thanks to Groq's speed, the loop feels real-time
    if (response.choices[0].message.tool_calls) {
      // execute tools, update messages, continue loop...
    } else {
      return response.choices[0].message.content;
    }
  }
}
```

## When to Use Groq vs. Alternatives

**Use Groq** when latency matters — real-time chat, interactive features, and agentic loops. Use **Claude** or **GPT-4o** when you need the strongest reasoning or broader model choice.

## Supported Models

- **Mixtral 8x7B** — Strong general-purpose model, 32K context
- **Llama 3 70B** — Powerful, good reasoning
- **Gemma 7B** — Lightweight, fast

## Resources

- [Groq Official](https://groq.com)
- [Groq API Documentation](https://console.groq.com/docs)
- [Groq Python SDK](https://github.com/groq/groq-python)
- [Groq JavaScript SDK](https://github.com/groq/groq-typescript)
- [AI SDK Groq Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/groq)
- **See the full Groq profile on [LLMReference](https://www.llmreference.com/providers/groq) →**
