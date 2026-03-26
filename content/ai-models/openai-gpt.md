# OpenAI Models

OpenAI's GPT and reasoning models power GitHub Copilot and countless production applications — fast, reliable, and excellent at code generation and reasoning.

## Why Vibe Coders Use It

- **Powers GitHub Copilot** — the industry-standard IDE coding assistant
- **Strong at code generation** — GPT-4o is excellent for writing, debugging, and explaining code
- **Reasoning models (o3, o4-mini)** — step-by-step thinking for complex logic, math, and architecture decisions
- **Multimodal (GPT-4o)** — analyze code screenshots, UX designs, error traces
- **Mature, widely-used** — extensive documentation, examples, and integrations everywhere

## Key Specs (GPT-4o vs Reasoning Models)

| Dimension | GPT-4o | o3 / o4-mini |
|-----------|--------|--------------|
| **Best for** | General coding, fast chat, content generation | Complex reasoning, hard problems, multi-step logic |
| **Context window** | 128K tokens | Limited (varies by model) |
| **Tool use / function calling** | Native, reliable | Limited to reasoning output |
| **Agentic capability** | Good — multi-turn, function calling | Not recommended (no native tool use) |
| **API availability** | Direct + via Azure, AWS Bedrock | Direct OpenAI API only |
| **Latency** | ~200-500ms | ~10-60 seconds (due to reasoning) |
| **Pricing tier** | Cheap ($2.50-$10 per 1M tokens) | Expensive ($15-$120 per 1M tokens) |

## Getting Started

### Choose Your Model

- **GPT-4o** — default choice for speed and capability
- **o3 / o4-mini** — when you need step-by-step reasoning or the task is very hard
- **GPT-4o Mini** — when cost matters and the task is straightforward

### 1. Create an Account & API Key

Sign up at [platform.openai.com](https://platform.openai.com) and generate an API key.

### 2. Set Your Environment Variable

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Install the SDK

```bash
npm install openai
```

### 4. Quick Chat Example (GPT-4o)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful coding assistant.' },
    { role: 'user', content: 'Refactor this function to use async/await' },
  ],
});

console.log(response.choices[0].message.content);
```

### 5. Using with AI SDK (Next.js, Recommended)

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 6. Reasoning Model Example (o3 for Hard Problems)

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Use o3 when standard models struggle
const { text } = await generateText({
  model: openai('o3'),
  prompt:
    'Design a distributed cache invalidation strategy for a multi-region system. Consider consistency guarantees and failure modes.',
  system: 'You are an expert systems architect.',
});

console.log(text);
```

## Tool Use & Function Calling

GPT-4o is excellent at calling external tools. Here's a practical example:

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'search_documentation',
      description: 'Search the project documentation',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
        },
        required: ['query'],
      },
    },
  },
];

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'How do I configure authentication?' }],
  tools,
});

// Handle tool calls in the response
if (response.choices[0].message.tool_calls) {
  for (const toolCall of response.choices[0].message.tool_calls) {
    // Execute tool and continue conversation
  }
}
```

## When to Use Each Model

**Use GPT-4o** for everyday coding tasks, chat, content generation, and anything where speed matters.

**Use o3 or o4-mini** only when the task is genuinely hard (complex architecture, deep reasoning, math, logic puzzles). Reasoning models are slower and more expensive.

**Use GPT-4o Mini** for high-volume, simple tasks (classification, tagging, basic content gen) to reduce cost.

## Comparison: GPT-4o vs Claude vs Gemini

| Task | Best Model | Why |
|------|-----------|-----|
| GitHub Copilot | GPT-4o | Native integration, proven at code completion |
| Complex reasoning | Claude or o3 | Better step-by-step thinking |
| Entire codebase analysis | Gemini 2.5 (1M context) | Larger context window |
| Cost-conscious | GPT-4o Mini | Cheapest capable model |
| Real-time agentic loops | Claude | Best tool use + reasoning combo |

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Chat Completions Guide](https://platform.openai.com/docs/guides/text-generation)
- [Reasoning Models Guide](https://platform.openai.com/docs/guides/reasoning)
- [AI SDK OpenAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
- [OpenAI Pricing](https://openai.com/pricing)
- **See the full GPT profiles on [LLMReference](https://www.llmreference.com/providers/openai) →**
