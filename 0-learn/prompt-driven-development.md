# Prompt-Driven Development

Prompt-driven development (PDD) is a software methodology where natural language prompts replace manual coding as the primary means of building software. Instead of writing code directly, developers craft prompts that describe desired behavior, architecture, and constraints — then AI generates the implementation. The prompt becomes the source of truth, much like a specification document that can be executed.

## Core Principles

- **Prompts as specs**: Your prompt is your specification. A well-written prompt produces working software on the first try.
- **Iterative refinement**: Start broad, then narrow. Each prompt iteration adds specificity where the output fell short.
- **Composability**: Break complex systems into prompt-sized pieces that can be generated and tested independently.
- **Reproducibility**: The same prompt with the same model should produce functionally equivalent output.

## The PDD Workflow

```
1. Define requirements (natural language)
2. Write initial prompt
3. Generate code
4. Review output
5. Refine prompt (not code) if output is wrong
6. Repeat until correct
7. Lock in the implementation
```

The key discipline: when something is wrong, fix the prompt first, not the code. This builds a library of effective prompts and improves your ability to communicate with AI.

## Prompt Patterns for Development

### The Scaffold Prompt
Generate the initial structure of a feature:
```
Build a Next.js API route at /api/users that handles GET (list with pagination)
and POST (create with validation). Use Convex for the database. Include error
handling and TypeScript types.
```

### The Refactor Prompt
Improve existing code:
```
Refactor this component to extract the form validation into a custom hook.
Keep the same external API. Add proper TypeScript generics.
```

### The Test Prompt
Generate test coverage:
```
Write unit tests for the parseMarkdown function. Cover: empty input,
basic markdown, frontmatter extraction, GFM tables, and malformed input.
Use Vitest.
```

### The Debug Prompt
Fix issues:
```
This function returns undefined when the input array is empty.
It should return an empty array instead. Fix it and add a test
for the empty case.
```

## Prompt Quality Hierarchy

| Level | Example | Output Quality |
|-------|---------|---------------|
| **Vague** | "Make a dashboard" | Unpredictable |
| **Descriptive** | "Make a dashboard with user stats and a chart" | Reasonable |
| **Specific** | "Build a dashboard with 4 stat cards (users, revenue, MRR, churn) using shadcn Card components, and a line chart showing monthly revenue using Recharts" | Good |
| **Constrained** | Same as above + "Use server components, fetch data from Convex, follow the existing app/dashboard/ pattern, and match the color scheme in globals.css" | Excellent |

## When to Edit Code vs Edit Prompts

**Edit the prompt when:**
- The overall approach or architecture is wrong
- You're generating a new feature from scratch
- The output is fundamentally misaligned with your intent

**Edit the code when:**
- Small tweaks to otherwise correct output
- Bug fixes in specific logic
- Integration adjustments with existing code

## PDD and Version Control

Some teams version-control their prompts alongside code:
```
prompts/
  features/
    dashboard.prompt.md
    auth-flow.prompt.md
    payment-integration.prompt.md
  tests/
    unit-test-generation.prompt.md
```

This creates a reusable library of prompts that can be re-executed when models improve or requirements change.

## How It's Used in VibeReference

The entire VibeReference framework is structured as prompt-driven development. Each day's guide provides prompt templates and natural language descriptions that founders feed to AI tools. Day 1's product requirements document is essentially a master prompt. Day 3's build guides include specific prompt patterns for authentication, payments, and API integration. The framework teaches founders that the quality of their prompts directly determines the quality of their software — making prompt crafting the core skill of modern development.
