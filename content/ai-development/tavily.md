# Tavily

Tavily is a search API built specifically for AI applications and RAG (Retrieval-Augmented Generation) pipelines. It returns clean, structured search results optimized for feeding into LLMs, eliminating the need to scrape and parse web pages yourself.

## Why Tavily?

- **AI-optimized results**: Returns clean, summarized content ready for LLM consumption
- **Fast**: Low-latency search designed for real-time AI applications
- **Structured output**: JSON responses with titles, URLs, content, and relevance scores
- **Research depth**: Supports both quick searches and deep research modes
- **MCP compatible**: Works with Model Context Protocol for AI agent tool use

## Getting Started

### 1. Get an API Key

Sign up at [tavily.com](https://tavily.com) and get your API key.

### 2. Install the SDK

```bash
npm install @tavily/core
```

### 3. Search

```typescript
import { tavily } from '@tavily/core';

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const results = await client.search('latest Next.js features', {
  maxResults: 5,
});

for (const result of results.results) {
  console.log(result.title, result.url);
  console.log(result.content);
}
```

## Use Cases

- **RAG pipelines**: Provide real-time context to LLM prompts
- **AI agents**: Give agents the ability to search the web for information
- **Research tools**: Build tools that gather and synthesize web information
- **Fact-checking**: Verify AI-generated claims against current web sources
- **Content enrichment**: Augment your content with related web information

## Integration with AI Models

```typescript
import { tavily } from '@tavily/core';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

// Search for context
const search = await tavilyClient.search('React Server Components best practices');
const context = search.results.map(r => r.content).join('\n\n');

// Generate AI response with context
const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: `Based on this research, provide a summary:\n\n${context}`,
});
```

## Resources

- [Tavily Documentation](https://docs.tavily.com)
- [Tavily API Reference](https://docs.tavily.com/api-reference)
