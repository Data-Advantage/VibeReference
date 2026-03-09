# Anthropic Developer Platform

The Anthropic Developer Platform provides access to Claude, Anthropic's family of AI assistants. Claude models excel at thoughtful, nuanced responses, code generation, analysis, and following complex instructions. The platform offers API access, usage dashboards, and tools for building AI-powered applications.

## Available Models

Anthropic offers several Claude models optimized for different use cases:

- **Claude Opus 4**: Most capable model for complex reasoning, coding, and analysis
- **Claude Sonnet 4**: Best balance of performance and speed for most production workloads
- **Claude Haiku 3.5**: Fastest and most cost-effective for high-volume, simpler tasks

## Getting Started

### 1. Create an Account

Sign up at the [Anthropic Console](https://console.anthropic.com) and create an API key.

### 2. Set Your API Key

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Install the SDK

```bash
npm install @anthropic-ai/sdk
```

### 4. Make Your First API Call

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const message = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'What is the capital of France?' }
  ],
});

console.log(message.content[0].text);
```

## Using with AI SDK

Claude integrates with Vercel's AI SDK for streaming chat UIs:

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

const result = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  messages,
});

return result.toDataStreamResponse();
```

## Key Features

- **Extended thinking**: Claude can show its reasoning process for complex problems
- **Tool use**: Define functions that Claude can call to interact with external systems
- **Vision**: Claude can analyze images passed as part of the conversation
- **Long context**: Support for up to 200K tokens of input context
- **System prompts**: Configure Claude's behavior and persona

## Best Practices

- Use system prompts to set clear expectations for Claude's behavior
- Choose the right model size for your task — Haiku for speed, Sonnet for balance, Opus for complexity
- Implement proper error handling for rate limits and API errors
- Monitor usage through the Anthropic Console dashboard

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com)
- [Anthropic Console](https://console.anthropic.com)
- [Claude Model Card](https://docs.anthropic.com/en/docs/about-claude/models)
- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
