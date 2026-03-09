# Cerebras

Cerebras is an AI hardware and inference company known for the world's fastest AI inference speeds. Their cloud platform provides API access to open-source models like Llama running on Cerebras hardware, delivering responses significantly faster than traditional GPU-based infrastructure.

## Why Cerebras?

- **Fastest inference**: Dramatically lower latency compared to standard GPU infrastructure
- **Open-source models**: Access to Llama 3.1 and 3.3 models
- **Simple API**: Compatible with the AI SDK for easy integration
- **Speed-sensitive applications**: Ideal when response time is critical

## Getting Started

### 1. Get an API Key

Sign up at [cerebras.ai](https://cerebras.ai) and generate an API key.

### 2. Set Your Environment Variable

```bash
CEREBRAS_API_KEY=your-api-key-here
```

### 3. Install and Use

```bash
npm install @ai-sdk/cerebras
```

```typescript
import { cerebras } from '@ai-sdk/cerebras';
import { generateText } from 'ai';

const { text } = await generateText({
  model: cerebras('llama3.3-70b'),
  prompt: 'What are the benefits of edge computing?',
});
```

## Available Models

- `llama3.3-70b` — Meta Llama 3.3 70B (best quality)
- `llama3.1-70b` — Meta Llama 3.1 70B
- `llama3.1-8b` — Meta Llama 3.1 8B (fastest)

## When to Use Cerebras

- Real-time conversational AI where latency matters
- Interactive coding assistants that need instant feedback
- High-throughput applications processing many requests
- Prototyping and development where fast iteration is important

## Resources

- [Cerebras Cloud Documentation](https://docs.cerebras.ai)
- [AI SDK Cerebras Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/cerebras)
