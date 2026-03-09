# OpenAI Moderation API

The OpenAI Moderation API is a free tool that checks whether text content violates OpenAI's usage policies. It classifies content across categories like hate speech, self-harm, sexual content, and violence. Use it to filter user-generated content in your applications before displaying it or sending it to AI models.

## Why Use the Moderation API?

- **Free to use**: No cost per request, included with your OpenAI API key
- **Fast**: Low-latency content classification
- **Multi-category**: Detects multiple types of harmful content simultaneously
- **Confidence scores**: Returns probability scores for each category, not just pass/fail

## Getting Started

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const moderation = await openai.moderations.create({
  input: 'Some user-submitted text to check',
});

const result = moderation.results[0];

if (result.flagged) {
  console.log('Content was flagged');
  console.log('Categories:', result.categories);
} else {
  console.log('Content is safe');
}
```

## Categories Detected

| Category | Description |
|----------|-------------|
| `hate` | Content expressing hatred toward a group |
| `harassment` | Content that harasses or threatens |
| `self-harm` | Content promoting or depicting self-harm |
| `sexual` | Sexually explicit content |
| `violence` | Content depicting violence |

Each category also has a `/threatening` sub-category for more severe content.

## Integration Pattern

Check user input before processing:

```typescript
// app/api/chat/route.ts
import OpenAI from 'openai';
import { openai as aiSdkOpenai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // Check moderation before processing
  const moderation = await openai.moderations.create({ input: lastMessage });

  if (moderation.results[0].flagged) {
    return new Response(
      JSON.stringify({ error: 'Content violates usage policy' }),
      { status: 400 }
    );
  }

  const result = streamText({
    model: aiSdkOpenai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## Best Practices

- Check user input before sending it to AI models
- Check AI output before displaying it to users in sensitive applications
- Use the category scores to set custom thresholds for your use case
- Log flagged content for review and policy improvement
- Combine with your own content policies for comprehensive moderation

## Resources

- [OpenAI Moderation Guide](https://platform.openai.com/docs/guides/moderation)
- [Moderation API Reference](https://platform.openai.com/docs/api-reference/moderations)
