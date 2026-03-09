# OpenAI GPT Models

GPT (Generative Pre-trained Transformer) models are OpenAI's family of large language models that power applications from chatbots to code generation. They are the most widely used AI models for text generation, available through both the OpenAI API and the AI SDK.

## Available GPT Models

| Model | Strengths | Best For |
|-------|-----------|----------|
| GPT-4o | Fast, multimodal (text + images) | General-purpose, production apps |
| GPT-4o Mini | Cost-effective, fast | High-volume tasks, simple queries |
| GPT-4 Turbo | Powerful reasoning, 128K context | Complex analysis, long documents |
| GPT-3.5 Turbo | Very fast, low cost | Simple tasks, legacy applications |

## Getting Started

### Using the OpenAI SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain REST APIs in simple terms.' },
  ],
});

console.log(response.choices[0].message.content);
```

### Using the AI SDK (Recommended for Next.js)

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Explain REST APIs in simple terms.',
});
```

## Key Capabilities

- **Text generation**: Write, summarize, translate, and transform text
- **Code generation**: Write, explain, and debug code in any language
- **Conversation**: Multi-turn dialogue with context awareness
- **Analysis**: Process and analyze documents, data, and images
- **Function calling**: Invoke external tools and APIs based on natural language
- **Vision**: Analyze images when using multimodal models (GPT-4o, GPT-4 Turbo)

## Important Parameters

| Parameter | Effect |
|-----------|--------|
| `temperature` | 0 = deterministic, 1 = creative (default 1) |
| `max_tokens` | Maximum response length |
| `top_p` | Nucleus sampling for diversity |
| `frequency_penalty` | Reduce repetition |
| `presence_penalty` | Encourage topic diversity |

## Choosing the Right Model

- **GPT-4o**: Best default choice — fast, capable, and supports images
- **GPT-4o Mini**: Use when cost matters and the task is straightforward
- **GPT-4 Turbo**: Use for complex reasoning or when you need 128K context

## Resources

- [OpenAI Models Documentation](https://platform.openai.com/docs/models)
- [Chat Completions Guide](https://platform.openai.com/docs/guides/text-generation)
- [AI SDK OpenAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
