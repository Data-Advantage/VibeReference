# Claude

Claude is Anthropic's most capable AI for complex reasoning, coding, and tool use — the top choice for developers building agentic systems.

## Why Vibe Coders Use It

- **Powers Claude Code and Cursor** — the industry-leading AI coding assistants
- **Best-in-class tool use** — call external APIs and functions reliably with extended thinking
- **Excellent at agentic loops** — multi-turn reasoning for autonomous workflows
- **200K context window** — process entire codebases and long documents
- **Multimodal** — understands images for UI design and architecture reviews

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Complex reasoning, code generation, agentic workflows |
| Context window | 200,000 tokens (Opus 4) |
| Tool use / function calling | Excellent — native tool use with extended thinking |
| Agentic capability | Highest-tier — strong at planning and multi-step reasoning |
| API availability | Native API, AWS Bedrock, Google Vertex AI |
| Pricing tier | Enterprise; pay-as-you-go ($15/$75 per 1M tokens for Sonnet 4) |

## Getting Started

### 1. Create an Account & API Key

Sign up at [console.anthropic.com](https://console.anthropic.com) and generate an API key.

### 2. Set Your Environment Variable

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Install the SDK

```bash
npm install @anthropic-ai/sdk
```

### 4. Build an Agentic Workflow

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const tools = [
  {
    name: 'search_docs',
    description: 'Search your codebase for a function or file',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'What to search for' },
      },
      required: ['query'],
    },
  },
];

async function runAgent(userMessage: string) {
  let messages = [{ role: 'user' as const, content: userMessage }];

  while (true) {
    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 4096,
      tools,
      messages,
    });

    // If model wants to use a tool, simulate the result
    if (response.stop_reason === 'tool_use') {
      const toolBlocks = response.content.filter(
        (block: any) => block.type === 'tool_use'
      );
      const toolResults = toolBlocks.map((block: any) => ({
        type: 'tool_result' as const,
        tool_use_id: block.id,
        content: `Simulated result for: ${block.input.query}`,
      }));

      messages = [
        ...messages,
        { role: 'assistant' as const, content: response.content },
        { role: 'user' as const, content: toolResults },
      ];
    } else {
      // Model finished reasoning
      return response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');
    }
  }
}

await runAgent('Review the authentication module and suggest improvements');
```

### Using with AI SDK (Next.js)

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-opus-4-20250514'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## When to Use This vs. Alternatives

**Use Claude** when you need the strongest reasoning, tool use, and agentic capabilities — ideal for multi-step workflows and complex problem-solving. Use **GPT** if you prioritize speed and cost for general-purpose tasks. Use **Gemini** if you need a very long context (1M tokens) for entire codebases.

## Models

- **Claude Opus 4** — Most capable; best for complex reasoning and agentic loops
- **Claude Sonnet 4** — Best balance of performance and cost
- **Claude Haiku 3.5** — Fastest and cheapest for high-volume tasks

## Resources

- [Anthropic Official Documentation](https://docs.anthropic.com)
- [Claude API Console](https://console.anthropic.com)
- [Claude Model Cards](https://www.anthropic.com/claude-3-model-cards)
- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- **See the full Claude profile on [LLMReference](https://www.llmreference.com/models/claude-opus-4) →**
