# Prompt Engineering for Claude: Advanced Techniques

Prompt engineering for Claude is about structuring your inputs to consistently get the outputs you need. Claude's architecture responds well to specific patterns — clear instructions, structured context, explicit constraints, and example-driven formatting. This guide covers the techniques that produce measurably better results with Claude, from system prompts to chain-of-thought reasoning to few-shot patterns.

## System Prompts: Setting the Foundation

The system prompt defines Claude's role, constraints, and behavior for an entire conversation. It's the most important lever for controlling output quality.

### Effective System Prompt Structure

```
You are a senior backend engineer reviewing pull requests for a
fintech company. Your reviews should:

- Focus on security vulnerabilities, especially around payment processing
- Flag any SQL that doesn't use parameterized queries
- Check error handling around external API calls
- Be direct and specific — cite line numbers, suggest fixes
- Skip style nits unless they affect readability

When you find an issue, rate it: critical (blocks merge), warning
(should fix before merge), or note (nice to have).
```

**Why this works:** It establishes role (senior backend engineer), domain (fintech), priorities (security over style), format (severity ratings), and tone (direct, specific). Claude adapts its behavior to match all of these.

### Anti-Patterns in System Prompts

```
# Too vague
You are a helpful assistant.

# Too restrictive
You must always respond in exactly 3 bullet points with no more
than 10 words each.

# Contradictory
Be thorough and comprehensive. Keep responses under 100 words.
```

## Chain-of-Thought Prompting

Claude produces more accurate answers when you ask it to reason through problems step by step. This is especially effective for math, logic, code debugging, and multi-step analysis.

### Explicit Chain-of-Thought

```
Analyze this database query for performance issues. Think through
each part step by step:

1. What tables are being joined and how?
2. What are the WHERE clause conditions?
3. Are there any missing indexes?
4. What is the expected row count at each stage?
5. Where are the bottlenecks?

Then provide your optimization recommendations.
```

### Let Claude Show Its Work

For complex reasoning, ask Claude to explain its thought process:

```
Determine whether this function has any race conditions. Walk through
your reasoning before giving your conclusion. Consider:
- What shared state is being accessed?
- What operations are non-atomic?
- What interleaving of threads could cause incorrect behavior?
```

Claude's reasoning quality improves when it writes out intermediate steps rather than jumping to conclusions.

## Few-Shot Prompting

Providing examples is the most reliable way to control Claude's output format and style. Claude picks up on patterns from 2-3 examples better than from pages of instructions.

### Format Matching

```
Convert these product descriptions to structured data. Follow this format:

Input: "Nike Air Max 90, men's running shoe, white/black colorway, sizes 8-13, $120"
Output: {"brand": "Nike", "model": "Air Max 90", "category": "running", "gender": "mens", "colors": ["white", "black"], "sizes": "8-13", "price": 120}

Input: "Adidas Ultraboost 22, unisex running shoe, core black, sizes 5-14, $190"
Output: {"brand": "Adidas", "model": "Ultraboost 22", "category": "running", "gender": "unisex", "colors": ["core black"], "sizes": "5-14", "price": 190}

Now convert this:
Input: "New Balance 990v6, men's lifestyle shoe, grey/white, sizes 7-15, $200"
```

### Style Matching

```
Write release notes in this style:

Example:
"**Faster dashboard loading** — The analytics dashboard now loads 3x
faster by lazy-loading chart widgets. Heavy charts render on scroll
instead of on page load. Users with 50+ widgets will see the biggest
improvement."

Now write a release note for: We added real-time search to the admin
user list. Previously it required a page reload after each search.
Uses debounced API calls with 300ms delay.
```

## XML Tags for Structure

Claude responds particularly well to XML-style tags for separating different parts of a prompt. This is useful when you're passing multiple pieces of context:

```
<context>
You are reviewing a microservices architecture with 12 services
communicating over gRPC and Kafka.
</context>

<code>
[paste the code here]
</code>

<task>
Identify any potential failure modes in the inter-service communication
shown in this code. For each failure mode, describe: the trigger
condition, the impact, and a mitigation strategy.
</task>
```

Tags prevent Claude from confusing instructions with context, especially in long prompts with mixed content types.

## Constraining Output Format

### JSON Output

When you need structured data, be explicit about the schema:

```
Analyze this error log and return a JSON object with this exact structure:
{
  "error_count": number,
  "unique_errors": [
    {
      "message": string,
      "count": number,
      "first_seen": ISO 8601 timestamp,
      "severity": "critical" | "warning" | "info",
      "likely_cause": string
    }
  ],
  "recommendation": string
}

Return only the JSON object, no additional text.
```

### Markdown Tables

```
Compare these three database options for our use case. Present your
analysis as a markdown table with columns: Feature, PostgreSQL,
MongoDB, DynamoDB. Include rows for: query flexibility, scaling model,
cost at our volume (10M rows), operational complexity, and your
recommendation.
```

## Prompting for Code Generation

### Specification-Driven Prompts

The more precise your specification, the better Claude's code output:

```
Write a TypeScript function called `retryWithBackoff` that:
- Takes an async function and optional config {maxRetries: number, baseDelay: number, maxDelay: number}
- Retries on failure with exponential backoff plus jitter
- Defaults: maxRetries=3, baseDelay=1000ms, maxDelay=30000ms
- Returns the successful result or throws the last error
- Logs each retry attempt with the attempt number and delay
- Generic return type matching the input function

Do not use any external libraries.
```

### Refactoring Prompts

```
Refactor this function to be more testable. Requirements:
- Extract the HTTP client as a dependency (dependency injection)
- Separate the data transformation from the API call
- Keep the public API the same — callers shouldn't need to change
- Add TypeScript types for all parameters and return values

Show me the refactored code and explain each change.
```

## Temperature and Model Selection

### When to Adjust Temperature

Claude's default temperature works well for most tasks. Lower temperature (closer to 0) for:
- Code generation where correctness matters
- Data extraction from documents
- Following strict output formats

Higher temperature for:
- Creative writing and brainstorming
- Generating diverse options
- Exploratory analysis where multiple perspectives help

### Model Selection by Task

| Task | Recommended Model | Why |
|------|------------------|-----|
| Complex reasoning, architecture decisions | Opus | Deepest reasoning capability |
| General coding, writing, analysis | Sonnet | Best balance of quality and speed |
| Classification, simple extraction, routing | Haiku | Fastest, cheapest, sufficient for simple tasks |

## Common Mistakes

**Overloading a single prompt.** If you're asking Claude to analyze, summarize, recommend, and format in one prompt, break it into steps. Each step builds on the last and produces better results than trying to do everything at once.

**Not providing examples.** Instructions describe what you want. Examples show what you want. Examples almost always produce more consistent results.

**Being vague about format.** "Give me a summary" could mean one sentence or five paragraphs. "Give me a 3-sentence summary focusing on business impact" removes ambiguity.

**Ignoring context window limits.** If you're sending a massive document plus detailed instructions, the instructions may get less attention. Put your most important instructions at the beginning and end of the prompt — Claude attends to these positions most reliably.

**Not iterating.** Prompt engineering is empirical. If your first prompt doesn't produce the right output, adjust one thing at a time: add an example, tighten a constraint, reorder sections. Small changes often have large effects.

## Related Resources

- [Claude Code: Complete Getting Started Guide](../guides/claude-code-getting-started) — using these techniques in Claude Code
- [Claude API Integration Guide](./claude-api-integration) — API setup for programmatic prompting
- [Building Full-Stack Apps with Claude Code](./claude-code-full-stack) — prompting for application development
