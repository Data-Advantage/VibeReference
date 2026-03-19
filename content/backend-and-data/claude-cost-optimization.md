# Cost Optimization: Batch Processing and Prompt Caching with Claude

Running Claude at scale gets expensive fast if you're not deliberate about how you use the API. The good news: Anthropic provides two built-in mechanisms — the Batch API and prompt caching — that can cut your costs by 50-90% depending on your workload. This guide covers when and how to use each, with concrete cost calculations and implementation patterns.

## Understanding Claude API Pricing

Claude pricing is based on tokens — both input (what you send) and output (what Claude generates). As of March 2026:

| Model | Input (per MTok) | Output (per MTok) |
|-------|-----------------|-------------------|
| Opus 4.6 | $15 | $75 |
| Sonnet 4.6 | $3 | $15 |
| Haiku 4.5 | $0.80 | $4 |

A "MTok" is one million tokens. Most English text runs roughly 750 words per 1,000 tokens, so processing a 10-page document as input costs fractions of a cent with Haiku and a few cents with Opus.

The cost multipliers that matter:
- **Batch API**: 50% off both input and output
- **Prompt caching (read)**: 90% off input tokens
- **Prompt caching (write, 5-min)**: 25% premium on cached input
- **Prompt caching (write, 1-hour)**: 100% premium on cached input

These stack, so you can combine batch processing with prompt caching for maximum savings.

## The Batch API

### When to Use It

The Batch API processes requests asynchronously — you submit a batch, and results are available within 24 hours. Use it for any workload where you don't need real-time responses:

- Processing a backlog of documents
- Running analysis across a dataset
- Generating content in bulk
- Nightly batch jobs (report generation, data enrichment)
- Evaluating prompt variations across test cases

### The Math

The Batch API gives you a flat 50% discount on both input and output tokens. There's no minimum volume — even a single request saves 50%.

**Example:** Processing 1,000 customer support tickets with Sonnet:
- Standard: 1,000 requests × ~2,000 input tokens × $3/MTok + ~500 output tokens × $15/MTok = $13.50
- Batch: Same workload at 50% off = **$6.75**

At scale, this adds up. A workload costing $10,000/month drops to $5,000 with zero code changes beyond switching to the batch endpoint.

### Implementation

```python
import anthropic

client = anthropic.Anthropic()

# Create a batch with multiple requests
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": f"ticket-{i}",
            "params": {
                "model": "claude-sonnet-4-6-20260319",
                "max_tokens": 512,
                "messages": [
                    {
                        "role": "user",
                        "content": f"Classify this support ticket and suggest a response: {ticket['text']}"
                    }
                ],
            },
        }
        for i, ticket in enumerate(tickets)
    ]
)

# Check batch status
status = client.messages.batches.retrieve(batch.id)
print(f"Status: {status.processing_status}")

# Retrieve results when complete
if status.processing_status == "ended":
    for result in client.messages.batches.results(batch.id):
        print(f"{result.custom_id}: {result.result.message.content[0].text}")
```

### Batch API Limits

- Batch requests have their own rate limits, separate from standard API limits
- You can include thousands of requests per batch
- Results are guaranteed within 24 hours, but often complete much faster
- Each request in the batch counts toward the batch processing queue limit

## Prompt Caching

### When to Use It

Prompt caching saves money when you send the same context repeatedly. Common patterns:

- **System prompts** — a long system prompt used across many requests
- **Document analysis** — asking multiple questions about the same document
- **Few-shot examples** — a large set of examples prepended to each request
- **RAG context** — retrieved documents that many users query

### How It Works

Mark static content blocks with `cache_control` to tell Claude to cache them:

```python
message = client.messages.create(
    model="claude-sonnet-4-6-20260319",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": LARGE_SYSTEM_PROMPT,  # 5,000+ tokens of instructions
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "What are the key risks in section 4?"}
    ],
)
```

The first request writes the cache (slightly more expensive). Subsequent requests that match the cached prefix get a 90% discount on those input tokens.

### Cache Duration and Pricing

| Duration | Write Cost | Read Cost | Break-Even |
|----------|-----------|-----------|------------|
| 5 minutes | 1.25x base input | 0.1x base input | 1 cache read |
| 1 hour | 2x base input | 0.1x base input | 2 cache reads |

**Example with Opus 4.6:**
- Base input: $15/MTok
- 5-min cache write: $18.75/MTok (one-time)
- Cache read: $1.50/MTok (90% savings on each subsequent request)

If you make 10 requests against the same cached context of 10,000 tokens:
- Without caching: 10 × 10,000 × $15/MTok = $1.50
- With caching: 1 × 10,000 × $18.75/MTok + 9 × 10,000 × $1.50/MTok = $0.32

That's a **79% reduction**.

### Cache Best Practices

**Put cacheable content first.** The cache matches from the beginning of the prompt. Your system prompt and static context should come before variable content.

**Minimum cache size.** Prompt caching has a minimum token threshold (typically 1,024+ tokens for the cached block). Short system prompts may not be eligible.

**Workspace isolation.** As of February 2026, caches are isolated per workspace, not per organization. Different workspaces in the same organization don't share caches.

**Cache invalidation.** Any change to the cached prefix — even a single character — invalidates the cache and requires a new write. Keep cached content truly static.

## Model Routing

The third cost lever is choosing the right model for each task. Not every request needs your most expensive model.

### Routing Strategy

```python
def select_model(task: dict) -> str:
    """Route tasks to the cheapest model that handles them well."""

    if task["type"] in ("classify", "extract_fields", "yes_no", "route"):
        return "claude-haiku-4-5-20251001"  # $0.80/MTok in, $4/MTok out

    if task["type"] in ("summarize", "write", "code", "analyze"):
        return "claude-sonnet-4-6-20260319"  # $3/MTok in, $15/MTok out

    if task["type"] in ("complex_reasoning", "long_analysis", "architecture"):
        return "claude-opus-4-6-20260319"    # $15/MTok in, $75/MTok out

    return "claude-sonnet-4-6-20260319"  # Default to Sonnet
```

### Cost Impact

A typical application might process:
- 70% classification/extraction tasks → Haiku at $0.80/MTok
- 25% analysis/writing tasks → Sonnet at $3/MTok
- 5% complex reasoning → Opus at $15/MTok

Weighted average: ~$1.56/MTok vs. $15/MTok if everything ran on Opus — a **90% reduction**.

## Token Optimization

### Reducing Input Tokens

- **Trim context.** Don't send entire documents when Claude only needs a section. Extract the relevant portion first.
- **Compress examples.** In few-shot prompts, use concise examples that demonstrate the pattern without excess text.
- **Remove redundancy.** If your system prompt and user message repeat context, eliminate the duplication.

### Reducing Output Tokens

- **Set `max_tokens` appropriately.** If you need a one-sentence classification, don't allow 4,096 tokens of output.
- **Request concise formats.** "Return only the JSON object" prevents verbose explanations around structured output.
- **Use stop sequences.** If you know the output should end at a specific token, set it as a stop sequence to prevent over-generation.

## Combining Everything

The maximum savings come from combining all strategies:

| Strategy | Savings | Cumulative |
|----------|---------|------------|
| Model routing (Haiku where possible) | ~60-80% | 60-80% |
| Prompt caching (repeated context) | ~50-90% on input | 80-95% |
| Batch API (async workloads) | 50% on everything | 90-97% |
| Token optimization (trim context) | 10-30% | 92-98% |

A workload that costs $10,000/month on Opus with no optimization could cost $200-800/month with aggressive optimization.

## Monitoring Costs

Track your spending with the Anthropic Console dashboard and by logging token usage from API responses:

```python
message = client.messages.create(...)

print(f"Input tokens: {message.usage.input_tokens}")
print(f"Output tokens: {message.usage.output_tokens}")
print(f"Cache read tokens: {message.usage.cache_read_input_tokens}")
print(f"Cache write tokens: {message.usage.cache_creation_input_tokens}")
```

Build dashboards that track cost per request, cost per user, and cost per feature to identify optimization opportunities.

## Related Resources

- [Claude API Integration Guide](../ai-development/claude-api-integration) — API setup and authentication
- [Data Processing and Analysis with Claude](./claude-data-analysis) — applying these patterns to data workloads
- [Prompt Engineering for Claude](../ai-development/claude-prompt-engineering) — writing efficient prompts
