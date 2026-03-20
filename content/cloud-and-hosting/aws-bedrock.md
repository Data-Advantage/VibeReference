# AWS Bedrock as an AI Gateway

AWS Bedrock functions as a managed AI gateway within the AWS ecosystem, giving you unified API access to foundation models from Anthropic, Meta, Mistral, Cohere, AI21 Labs, Stability AI, and Amazon itself — all under a single AWS account, IAM policy, and billing relationship.

Unlike dedicated AI gateways (Vercel, Cloudflare, OpenRouter), Bedrock is deeply integrated with the AWS platform. It trades portability for security, compliance, and AWS-native tooling: VPC isolation, CloudWatch logging, AWS PrivateLink, and S3-backed knowledge bases.

## Overview

| Property | Details |
|----------|---------|
| Type | Managed AI gateway (AWS-native) |
| Hosting | AWS cloud (fully managed) |
| Self-hosted option | No |
| Pricing model | Pay-per-token (input + output) |
| Free tier | No (pay-per-use from the start) |
| Best for | AWS-first organizations, compliance-heavy workloads |

## Key Features

### Multi-Model Access

Bedrock provides a single API endpoint and SDK for all supported models. You switch models by changing a model ID string — no API key rotation, no new SDK dependency.

```typescript
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

// Switch between providers by changing the model ID
const claudeResult = await generateText({
  model: bedrock('anthropic.claude-3-5-sonnet-20241022-v2:0'),
  prompt: 'Summarize this document.',
});

const llamaResult = await generateText({
  model: bedrock('meta.llama3-1-70b-instruct-v1:0'),
  prompt: 'Summarize this document.',
});
```

### Supported Providers and Models

| Provider | Models Available |
|----------|-----------------|
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku, Claude 3.5 Haiku |
| **Meta** | Llama 3.1 (8B, 70B, 405B), Llama 3.2 (1B, 3B, 11B, 90B) |
| **Mistral** | Mistral Large, Mistral Small, Mixtral 8x7B |
| **Cohere** | Command R, Command R+, Command Light, Embed |
| **AI21 Labs** | Jamba-Instruct |
| **Amazon** | Titan Text (Express, Lite, Premier), Titan Embeddings |
| **Stability AI** | Stable Diffusion (image generation) |

Model availability varies by AWS region. Some models require explicit access requests through the Bedrock console.

### IAM Integration

Every Bedrock request is authenticated via AWS IAM — no separate API keys to manage. Your existing IAM roles, policies, and permission boundaries apply directly.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
      ]
    }
  ]
}
```

You can scope IAM policies to specific models, regions, or accounts — giving you fine-grained access control that dedicated gateways don't offer out of the box.

### Guardrails

Bedrock Guardrails lets you add content filtering, PII detection, and topic blocking to any model — including models that don't have native safety filters.

Configure guardrails through the AWS console, then reference them in API calls:

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

const response = await client.send(new InvokeModelCommand({
  modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
  guardrailIdentifier: 'my-guardrail-id',
  guardrailVersion: '1',
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 1000,
    anthropic_version: 'bedrock-2023-05-31',
  }),
}));
```

Guardrail capabilities:
- **Content filters**: Block hate speech, violence, sexual content, insults, and prompt injection
- **Denied topics**: Block specific subject areas (e.g., competitors, legal advice)
- **Word filters**: Block or mask specific phrases
- **PII detection**: Detect and redact personal data (SSN, credit card, email, etc.)
- **Grounding checks**: Detect hallucinations by comparing responses to source documents

### Knowledge Bases

Bedrock Knowledge Bases adds retrieval-augmented generation (RAG) to any model. You point Bedrock at an S3 bucket, it chunks and embeds your documents, stores them in a vector store (Amazon OpenSearch, Pinecone, or Aurora PostgreSQL), and automatically retrieves relevant context at inference time.

```typescript
import { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } from '@aws-sdk/client-bedrock-agent-runtime';

const client = new BedrockAgentRuntimeClient({ region: 'us-east-1' });

const response = await client.send(new RetrieveAndGenerateCommand({
  input: { text: 'What is our refund policy?' },
  retrieveAndGenerateConfiguration: {
    type: 'KNOWLEDGE_BASE',
    knowledgeBaseConfiguration: {
      knowledgeBaseId: 'your-kb-id',
      modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
    },
  },
}));
```

### Fine-Tuning

Bedrock supports supervised fine-tuning and continued pre-training for select models (Amazon Titan, Meta Llama, Cohere). Upload training data to S3, run a fine-tuning job, and deploy the resulting model — all without managing GPU infrastructure.

Fine-tuning is billed separately (training compute hours + storage), and fine-tuned models can be deployed with provisioned throughput for guaranteed performance.

## Pricing Model

Bedrock uses on-demand token pricing with an optional provisioned throughput model:

**On-demand** (pay-per-token):
- Input and output tokens billed separately
- No minimum commitment
- Prices vary by model (Claude 3.5 Sonnet is more expensive than Claude 3 Haiku)

**Provisioned throughput**:
- Reserve model units (MUs) on a 1-month or 6-month commitment
- Guarantees throughput at high volume
- Required for fine-tuned model deployment

Example on-demand prices (as of early 2025, check AWS for current):

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Claude 3.5 Sonnet | $3.00 | $15.00 |
| Claude 3 Haiku | $0.25 | $1.25 |
| Llama 3.1 70B | $0.72 | $0.72 |
| Mistral Large | $4.00 | $12.00 |

No markup over provider prices — you pay AWS list rates.

## VPC and Network Security

Bedrock supports AWS PrivateLink and VPC endpoints, letting you invoke models without traffic leaving your VPC:

```bash
# Create a VPC endpoint for Bedrock
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-xxxx \
  --service-name com.amazonaws.us-east-1.bedrock-runtime \
  --vpc-endpoint-type Interface \
  --subnet-ids subnet-xxxx \
  --security-group-ids sg-xxxx
```

This is a major differentiator from cloud-based gateways — your inference traffic never traverses the public internet.

## Setting Up Bedrock

```bash
# Install AWS SDK packages
npm install @ai-sdk/amazon-bedrock @aws-sdk/client-bedrock-runtime

# Configure credentials
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
```

Enable model access in the AWS console (Bedrock → Model access → Enable specific models). Not all models are enabled by default — some require requesting access and waiting for approval.

## When to Choose AWS Bedrock

**Bedrock is the right choice when:**
- Your organization is already heavily invested in AWS (IAM, VPC, CloudWatch, S3)
- You need VPC-isolated AI inference for compliance or regulatory reasons (HIPAA, FedRAMP, SOC 2)
- You want fine-tuning without managing GPU infrastructure
- You need a RAG pipeline that stays within the AWS ecosystem
- Your team already manages IAM and prefers no additional credential systems

**Consider alternatives when:**
- You're not on AWS and don't want to be
- You need to route across cloud providers (e.g., use Azure OpenAI alongside Anthropic)
- You want semantic caching to reduce costs (Bedrock doesn't offer this)
- You need detailed observability beyond what CloudWatch provides
- You're a startup without existing AWS infrastructure

## Related Resources

- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
- [AI SDK Amazon Bedrock Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/amazon-bedrock)
- [Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)
- [Comparing AI Gateways](./comparing-ai-gateways)
- [Amazon Bedrock Overview](./amazon-bedrock)
