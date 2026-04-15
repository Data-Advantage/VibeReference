# Mistral

Mistral provides efficient, open-source models optimized for production — specialized for code generation with the Codestral model and strong general-purpose reasoning.

## Why Vibe Coders Use It

- **Codestral** — dedicated code generation model, highly specialized for programming
- **Efficient architecture** — smaller models deliver impressive performance
- **Open-source foundation** — full control with Apache 2.0 licensed models
- **Available everywhere** — cloud API (La Plateforme), Azure, AWS Bedrock, self-hosted
- **Cost-effective** — competitive pricing with strong quality

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Code generation (Codestral), efficient open models, production deployments |
| Context window | 128K tokens (Large model) |
| Tool use / function calling | Supported in instruction-tuned versions |
| Agentic capability | Good — suitable for multi-step workflows |
| API availability | La Plateforme cloud API, Azure, AWS Bedrock, HuggingFace, self-hosted |
| Pricing tier | Free (open-source); cloud API $0.27-$0.81 per 1M tokens |

## Getting Started

### Option 1: Via Mistral Cloud (La Plateforme)

```bash
npm install @ai-sdk/mistral
```

```typescript
import { mistral } from '@ai-sdk/mistral';
import { generateText } from 'ai';

const { text } = await generateText({
  model: mistral('mistral-large-latest'),
  prompt: 'Write a React component that manages form state with validation',
});

console.log(text);
```

### Option 2: Using Codestral (Code Specialist)

```typescript
import { mistral } from '@ai-sdk/mistral';
import { generateText } from 'ai';

// Use Codestral for specialized code generation
const { text } = await generateText({
  model: mistral('codestral-latest'),
  prompt: 'Generate SQL to find the top 10 users by activity',
});

console.log(text);
```

### Option 3: Via Azure

```bash
npm install @ai-sdk/mistral
```

```typescript
import { mistral } from '@ai-sdk/mistral';
import { generateText } from 'ai';

const { text } = await generateText({
  model: mistral('mistral-7b-instruct'),
  prompt: 'Explain how JavaScript closures work',
});
```

### Option 4: Self-Hosted with Ollama

```bash
ollama run mistral

# Or for Codestral
ollama run codestral
```

```typescript
// Query your local server
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'codestral',
    prompt: 'Write a function to calculate Fibonacci numbers',
  }),
});
```

## Streaming Chat Example

```typescript
import { mistral } from '@ai-sdk/mistral';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: mistral('mistral-large-latest'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## When to Use Mistral vs. Alternatives

**Use Mistral** (especially Codestral) when you want open-source code generation. Use **Claude** for the strongest reasoning. Use **GPT** for general-purpose reliability and speed.

## Available Models

- **Codestral** — Specialized for code generation, highly optimized
- **Mistral Large** — General-purpose, powerful reasoning
- **Mistral 7B** — Lightweight, efficient
- **Mixtral 8x7B** — Mixture of Experts architecture

## Resources

- [Mistral AI Official](https://mistral.ai)
- [La Plateforme Console](https://console.mistral.ai)
- [Mistral Documentation](https://docs.mistral.ai)
- [Ollama Mistral Models](https://ollama.ai)
- [AI SDK Mistral Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/mistral)
- **See the full Mistral profile on [LLMReference](https://www.llmreference.com/providers/mistral) →**
