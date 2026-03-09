# Perplexity AI

Perplexity AI is a conversational search engine that combines AI language models with real-time web search. Its API, powered by the Sonar models, provides developers with search-augmented AI responses that include citations and up-to-date information — making it ideal for building applications that need current, factual answers.

## Why Perplexity?

- **Search-augmented responses**: Answers are grounded in real-time web results
- **Built-in citations**: Responses include source URLs for verification
- **Current information**: Access to up-to-date web content, not just training data
- **Simple API**: Compatible with the AI SDK for easy integration

## Getting Started

### 1. Get an API Key

Sign up at [perplexity.ai](https://www.perplexity.ai) and generate an API key from the API settings.

### 2. Set Your Environment Variable

```bash
PERPLEXITY_API_KEY=your-api-key-here
```

### 3. Install and Use

```bash
npm install @ai-sdk/perplexity
```

```typescript
import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';

const { text } = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'What are the latest features in Next.js 15?',
});
```

## Available Models

- **sonar-pro**: Most capable search model, best for complex queries
- **sonar**: Standard search model, good balance of speed and quality

## Use Cases

- **Research assistants**: Answer questions with cited, current sources
- **News aggregation**: Summarize recent developments in any topic
- **Fact-checking**: Verify claims against current web information
- **Competitive intelligence**: Monitor industry trends and competitor activity
- **Customer support**: Answer questions using the latest documentation and knowledge

## Best Practices

- Use Perplexity when answers need to be factual and current
- Use standard LLMs (GPT, Claude) when you need creative generation or reasoning
- Always display citations to users so they can verify information
- Combine Perplexity for research with other models for synthesis and writing

## Resources

- [Perplexity API Documentation](https://docs.perplexity.ai)
- [AI SDK Perplexity Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/perplexity)
