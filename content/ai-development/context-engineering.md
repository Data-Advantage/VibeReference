# Context Engineering

Context engineering is the practice of designing and managing the full information environment provided to an AI model — not just the prompt, but everything the model sees: system instructions, retrieved documents, tool definitions, memory, examples, and conversation history. It's the discipline of getting the right information to the model at the right time, in the right format, within the constraints of its context window.

If prompt engineering is about asking the right question, context engineering is about building the right room for the conversation to happen in.

> **Where this fits in the [5-concept stack](./agents-vs-harnesses).** Context is one of the **three primitives** in the canonical stack (alongside **Model** and **Tools**). The **Harness** assembles, prunes, and refreshes Context every turn; the **Agent** layer (role, mission, scope) gets baked into Context too. This article is the deep dive on the Context primitive — what it contains, how harnesses manage it, and how to engineer it well.

## Context Engineering vs Prompt Engineering

| Aspect | Prompt Engineering | Context Engineering |
|--------|-------------------|---------------------|
| **Scope** | Crafting the input query | Managing all tokens the model sees |
| **Focus** | How to ask effectively | What supporting information to provide |
| **Analogy** | Writing a good exam question | Giving the student the right textbook, calculator, and notes |
| **Outcome** | Better single responses | Reliable, repeatable AI behavior across sessions |

Prompt engineering is a subset of context engineering. You still need good prompts — but a perfect prompt with bad context produces bad results. A decent prompt with great context consistently outperforms.

## Why Context Engineering Matters

### The Context Window Is Finite
Every model has a maximum context window — 200K tokens for Claude, 128K for GPT, 1M+ for Gemini. But bigger isn't always better. Transformers pay quadratic attention costs, and models exhibit the "lost in the middle" problem: they attend most strongly to tokens at the beginning and end of context, with weaker attention to the middle.

### Agents Need It Most
A chatbot handles one exchange. An agent runs for hours — reading files, calling APIs, making decisions, fixing errors. Without context engineering, agents lose track of what they're doing, repeat work, or contradict earlier decisions. Context engineering gives agents the memory and structure they need for long-horizon tasks.

### Cost and Speed
More tokens = more cost and latency. Sending 200K tokens when 20K would suffice wastes money and slows responses. Context engineering is about signal density — maximizing useful information per token.

## Core Techniques

### 1. Persistent Instructions (Project Memory)

The most impactful context engineering technique is giving your AI coding tool persistent, project-specific instructions that load automatically.

**CLAUDE.md (Claude Code)**
```markdown
# CLAUDE.md

## Project Overview
This is a Next.js 15 SaaS app using Supabase, Stripe, and Tailwind.

## Code Conventions
- Use server components by default, client components only when needed
- All database queries go through src/lib/db/ — never query Supabase directly in components
- Use Zod for all input validation
- Error messages must be user-friendly, never expose internal details

## Testing
- Run `npm test` before committing
- Integration tests use a real database, not mocks
- Test files live next to the code they test: `foo.ts` → `foo.test.ts`

## Architecture Decisions
- We chose Supabase over Convex for SQL flexibility
- Auth uses Clerk, not Supabase Auth
- Payments use Stripe Checkout, not custom forms
```

Claude Code reads CLAUDE.md files automatically at the start of every session. They're the single most effective way to improve AI output quality on a project — they persist across conversations and encode decisions that would otherwise be lost.

**.cursorrules / .cursor/rules (Cursor)**
```markdown
You are an expert Next.js developer. Follow these rules:

1. Always use TypeScript with strict mode
2. Prefer server actions over API routes
3. Use the existing component library in src/components/ui/
4. Never install new packages without asking first
```

**GitHub Copilot Instructions**
```markdown
# .github/copilot-instructions.md
Use conventional commits. Prefer functional React components.
Always handle loading and error states in data fetching.
```

Each tool has its own format, but the principle is the same: encode your project's conventions, architecture, and constraints once, and every AI interaction inherits that context.

### 2. Retrieval-Augmented Generation (RAG)

Instead of stuffing everything into the context window, store knowledge externally and retrieve only what's relevant at query time.

```
User asks about authentication
    → RAG retrieves: auth middleware code, Clerk config, auth tests
    → Model sees only relevant files, not the entire codebase
```

AI coding tools do this automatically. When you ask Claude Code to fix a bug, it searches your codebase for relevant files rather than loading everything. Cursor indexes your repo and retrieves contextually relevant code. The quality of this retrieval directly affects output quality.

**How to optimize RAG for your project:**
- Keep files focused and well-named — `auth-middleware.ts` is more retrievable than `utils.ts`
- Write descriptive function and variable names — they're search targets
- Add brief comments at the top of complex files explaining their purpose
- Structure your project with clear directory organization

### 3. Context Window Management

For long-running agent sessions, you need strategies to stay within the window while preserving important information.

**Summarization Cycling**
When context gets long, summarize completed work and reset:
```
1. Agent works on tasks 1-5 (context fills up)
2. Agent summarizes: "Completed auth migration. Key decisions: ..."
3. Summary gets written to a file or memory system
4. Context resets with summary loaded
5. Agent continues from where it left off
```

Claude Code does this automatically — it compresses earlier conversation turns as context grows, preserving the most important information.

**File-Based Memory**
Write important context to files that persist across sessions:
```bash
# Agent writes progress to a scratchpad
echo "## Migration Progress
- [x] User table migrated
- [x] Auth tokens migrated
- [ ] Permissions table — blocked on schema decision
- Decision: Using RBAC, not ABAC" > PROGRESS.md
```

**Token Budget Awareness**
Structure your context with the most important information at the top and bottom (where attention is strongest), with less critical details in the middle:
```
[System instructions — highest priority]
[Current task description]
[Retrieved code context]
[Conversation history — middle, lower attention]
[User's latest message — end, high attention]
```

### 4. Tool Definitions

Tools are context. When you define tools for an agent, each tool's name, description, and parameter schema teaches the model what actions are available and when to use them. Well-designed tool definitions are a form of context engineering.

```typescript
// Bad: vague tool definition
const tool = {
  name: "search",
  description: "Search for things"
};

// Good: precise, instructive definition
const tool = {
  name: "search_codebase",
  description: "Search the project codebase for files matching a pattern or containing specific text. Use this when you need to find where something is defined or used. Prefer this over reading entire directories.",
  parameters: {
    query: "The search term — can be a function name, class name, error message, or concept",
    filePattern: "Optional glob pattern to narrow search (e.g., '**/*.ts', 'src/api/**')"
  }
};
```

The better your tool definitions, the better the model chooses when and how to use them.

### 5. Structured Context Injection

Instead of dumping raw data into context, structure it for the model:

**Bad:**
```
Here's the error log: [500 lines of unformatted logs]
```

**Good:**
```markdown
## Error Summary
- **Error**: TypeError: Cannot read property 'id' of undefined
- **Location**: src/api/users.ts:47
- **Frequency**: 23 occurrences in the last hour
- **First seen**: 2024-03-15 14:22:00 UTC
- **Stack trace** (relevant frames only):
  - users.ts:47 — getUserById()
  - router.ts:12 — handleRequest()
```

Pre-processing and structuring information before it enters context dramatically improves model performance.

### 6. Few-Shot Examples in Context

When you need the model to follow a specific pattern, include examples in context rather than describing the pattern abstractly:

```markdown
## How We Write API Routes

Follow this exact pattern for new API routes:

### Example: GET /api/users/:id
```typescript
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await db.users.findById(params.id);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json(user);
}
```

Now create a similar route for...
```

One concrete example is worth a page of abstract instructions.

## Context Engineering for AI Coding Agents

### The CLAUDE.md Hierarchy

Claude Code supports a hierarchy of instruction files that layer context:

```
~/.claude/CLAUDE.md           # Global preferences (all projects)
./CLAUDE.md                    # Project root (architecture, conventions)
./src/CLAUDE.md               # Directory-specific (component patterns)
./src/api/CLAUDE.md           # Subdirectory-specific (API conventions)
```

Each level adds context relevant to its scope. This is context engineering in action — the model gets different instructions depending on what part of the codebase it's working in.

### Agent Memory Systems

Long-running agents need memory beyond the context window:

**Short-term memory**: The conversation itself. What the agent has seen and done in this session.

**Working memory**: Scratchpads, todo lists, and progress files the agent reads and writes during a task.

**Long-term memory**: Persistent files (CLAUDE.md, project documentation) that survive across sessions. Patterns learned, decisions made, user preferences recorded.

```
Task arrives
    → Load long-term memory (CLAUDE.md, project docs)
    → Load working memory (current task state)
    → Use short-term memory (this conversation)
    → Do work
    → Update working memory (save progress)
    → Optionally update long-term memory (save learnings)
```

### Context Engineering Checklist

Use this checklist to evaluate your project's context setup:

- [ ] **CLAUDE.md / .cursorrules exists** with project conventions and architecture
- [ ] **Directory structure is clear** — files are named descriptively and organized logically
- [ ] **Key decisions are documented** — why you chose this database, this auth provider, this pattern
- [ ] **Examples exist** for common patterns (API routes, components, tests)
- [ ] **Constraints are explicit** — what the AI should never do (delete production data, install packages, etc.)
- [ ] **Testing commands are documented** — how to verify changes work
- [ ] **Error handling patterns are shown** — not just described

## Common Mistakes

### Overloading Context
Dumping entire codebases, full documentation sites, or complete error logs into context. More is not better — signal density matters.

### Under-specifying Conventions
Assuming the AI knows your project's conventions. It doesn't. If you always use `async/await` instead of `.then()`, say so. If you have a specific error handling pattern, show it.

### Ignoring the Middle
Placing critical instructions in the middle of long contexts where attention is weakest. Put the most important constraints at the top of your instruction files.

### Static Context for Dynamic Tasks
Using the same context setup for every task. A bug fix needs different context than a feature build. Retrieval should be task-aware.

### No Feedback Loop
Writing context instructions once and never updating them. Context engineering is iterative — when the AI makes a mistake, add a rule to prevent it next time.

## Measuring Context Quality

You can't improve what you don't measure. Track these signals:

- **First-attempt success rate**: How often does the AI produce correct output without corrections?
- **Correction frequency**: How often do you repeat the same correction? (Each repeat = missing context)
- **Token efficiency**: Are you using 100K tokens when 20K would produce the same quality?
- **Cross-session consistency**: Does the AI maintain consistent behavior across different sessions?

When the first-attempt success rate is high and corrections are rare, your context engineering is working.

## Resources

- [Anthropic: Claude Code Best Practices](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Anthropic: Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Cursor: Rules and Configuration](https://docs.cursor.com/context/rules)

## See Also

- [AI Agents vs Harnesses](./agents-vs-harnesses) — the canonical 5-concept stack (Context is one primitive)
- [Designing Agent Instructions](./designing-agent-instructions) — encoding role/mission/scope in Context
- [Building Harnesses for AI Agents](./building-harnesses-for-agents) — how the harness manages Context every turn
- [AI Agent Memory Systems](./ai-agent-memory-systems) — persistent memory beyond the context window
- [MCP (Model Context Protocol)](./mcp-model-context-protocol) — standardized tool exposure that ends up in Context

## How It's Used in VibeReference

Context engineering is the foundation of productive AI-assisted development. Every recommendation in VibeReference — from project structure to coding patterns to testing strategies — is designed to create better context for AI tools. When your project is well-organized, well-documented, and follows consistent patterns, every AI tool you use performs better automatically.
