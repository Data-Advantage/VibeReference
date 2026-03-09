# OpenAI o-Series (Reasoning Models)

OpenAI's o-series models (o1, o3, o4-mini) are reasoning models that think step-by-step before answering. Unlike standard GPT models that generate responses token-by-token, o-series models use internal chain-of-thought reasoning to work through complex problems, making them significantly better at math, science, coding challenges, and multi-step logic.

## Available Models

| Model | Strengths | Best For |
|-------|-----------|----------|
| o3 | Strongest reasoning, broadest capabilities | Complex analysis, research, hard problems |
| o4-mini | Fast reasoning, cost-effective | Math, coding, logic at lower cost |
| o1 | Original reasoning model | Complex problems requiring deep thought |

## How Reasoning Models Differ

Standard GPT models generate responses immediately. Reasoning models:

1. **Think first**: Spend time reasoning internally before responding
2. **Show reasoning**: Can expose their chain-of-thought (with extended thinking)
3. **Better at hard tasks**: Significantly outperform GPT on math, coding competitions, and logic puzzles
4. **Higher latency**: Responses take longer due to the thinking phase
5. **Variable cost**: Reasoning tokens add to the total token usage

## Getting Started

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: openai('o3'),
  prompt: 'Solve this step by step: If a train leaves at 3pm going 60mph...',
});
```

## When to Use o-Series vs GPT

**Use o-series when:**
- The task requires multi-step reasoning or problem-solving
- Accuracy matters more than speed (math, science, legal analysis)
- You need the model to plan or strategize
- Standard GPT gives incorrect or shallow answers

**Use GPT when:**
- You need fast responses (chat, autocomplete)
- The task is straightforward (summarization, translation)
- Cost is a primary concern
- You need streaming token-by-token output

## Best Practices

- Set higher `maxDuration` on API routes since reasoning takes longer
- Use o4-mini for cost-effective reasoning on routine problems
- Reserve o3 for the most challenging tasks where accuracy is critical
- Don't use reasoning models for simple tasks — they add cost and latency without benefit

## Resources

- [OpenAI Reasoning Models Guide](https://platform.openai.com/docs/guides/reasoning)
- [o1 Research Blog Post](https://openai.com/index/learning-to-reason-with-llms/)
- [AI SDK OpenAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
