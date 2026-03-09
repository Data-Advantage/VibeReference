# Exa

Exa is an AI-native search engine designed for developers. Unlike traditional search engines that return links, Exa returns clean, structured content from the web, making it ideal for building AI applications that need real-time information retrieval, research tools, and RAG (Retrieval-Augmented Generation) pipelines.

## Why Exa?

- **Clean content extraction**: Returns parsed content, not just URLs
- **Semantic search**: Understands meaning, not just keywords
- **Developer-first API**: Built for programmatic use in AI applications
- **Real-time data**: Access current web information for up-to-date AI responses
- **RAG-ready**: Perfect for feeding context into LLM prompts

## Getting Started

### 1. Get an API Key

Sign up at [exa.ai](https://exa.ai) and generate an API key.

### 2. Install the SDK

```bash
npm install exa-js
```

### 3. Search the Web

```typescript
import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

const results = await exa.searchAndContents('latest developments in AI', {
  numResults: 5,
  text: true,
});

for (const result of results.results) {
  console.log(result.title);
  console.log(result.text);
}
```

## Use Cases

- **RAG pipelines**: Fetch relevant context from the web to augment LLM responses
- **Research assistants**: Build tools that automatically gather and summarize information
- **Content aggregation**: Collect and process articles on specific topics
- **Competitive analysis**: Monitor what competitors are publishing
- **News monitoring**: Track developments in specific industries or technologies

## Combining Exa with AI

```typescript
import Exa from 'exa-js';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const exa = new Exa(process.env.EXA_API_KEY);

// 1. Search for relevant context
const search = await exa.searchAndContents('Next.js 15 new features', {
  numResults: 3,
  text: true,
});

const context = search.results.map(r => r.text).join('\n\n');

// 2. Use context in an AI prompt
const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: `Based on this context, summarize the new features:\n\n${context}`,
});
```

## Resources

- [Exa Documentation](https://docs.exa.ai)
- [Exa API Reference](https://docs.exa.ai/reference)
- [Exa Dashboard](https://dashboard.exa.ai)
