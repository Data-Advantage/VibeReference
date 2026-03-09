# Amazon Bedrock

Amazon Bedrock is AWS's fully managed service for building AI applications with foundation models. It provides API access to models from Anthropic (Claude), Meta (Llama), Mistral, Cohere, and Amazon (Titan) through a unified interface, with enterprise features like VPC networking, IAM access control, and model fine-tuning.

## Why Amazon Bedrock?

- **Multi-provider access**: Use Claude, Llama, Mistral, and other models from a single API
- **Enterprise security**: VPC endpoints, IAM roles, and AWS PrivateLink
- **No infrastructure management**: Serverless, pay-per-use pricing
- **Fine-tuning**: Customize foundation models with your own data
- **Guardrails**: Built-in content filtering and safety controls
- **Knowledge bases**: RAG (Retrieval-Augmented Generation) with your documents

## Getting Started

### Prerequisites

1. An AWS account with Bedrock access enabled
2. IAM credentials with Bedrock permissions

### Install and Configure

```bash
npm install @ai-sdk/amazon-bedrock
```

Set your AWS credentials:

```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

### Use with AI SDK

```typescript
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

const { text } = await generateText({
  model: bedrock('anthropic.claude-3-sonnet-20240229-v1:0'),
  prompt: 'Explain the benefits of serverless architecture.',
});
```

## Available Models

| Provider | Model IDs |
|----------|-----------|
| Anthropic | `anthropic.claude-3-sonnet`, `anthropic.claude-3-haiku` |
| Meta | `meta.llama3-1-70b-instruct`, `meta.llama3-1-8b-instruct` |
| Mistral | `mistral.mistral-large`, `mistral.mistral-small` |
| Amazon | `amazon.titan-text-express`, `amazon.titan-embed-text` |

## When to Use Bedrock

- Your organization is already on AWS and needs AI within the AWS ecosystem
- You require VPC-isolated AI inference for compliance
- You want to use multiple model providers through a single billing relationship
- You need to fine-tune models with proprietary data

## Resources

- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AI SDK Amazon Bedrock Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/amazon-bedrock)
- [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
