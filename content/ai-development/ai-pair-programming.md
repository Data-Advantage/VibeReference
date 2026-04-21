# AI Pair Programming

AI pair programming is a development practice where a human developer works alongside an AI assistant in real-time, combining human creativity and judgment with AI speed and breadth of knowledge. Unlike traditional pair programming with two humans, AI pair programming offers an always-available partner that can generate code, explain concepts, spot bugs, and suggest alternatives instantly.

> *In the 5-concept stack, pair-programming tools like GitHub Copilot, Cursor, and Claude Code are **Harnesses** — they wire a Model, Tools, and Context into an interactive loop alongside the developer. See [AI Agents vs Harnesses](./agents-vs-harnesses) for the full stack.*

## How It Works

The human and AI take complementary roles:

- **Human**: Sets direction, makes architectural decisions, provides domain knowledge, reviews quality
- **AI**: Generates implementations, suggests alternatives, catches bugs, explains unfamiliar code, handles boilerplate

## Modes of AI Pair Programming

### Inline Completion (Ghost Text)
The AI suggests the next few lines as you type. You accept with Tab or keep typing to override.
- **Best for**: Boilerplate, repetitive patterns, completing obvious logic
- **Tools**: GitHub Copilot, Codeium, Supermaven

### Chat-Based (Side Panel)
You describe what you need in a chat window and the AI generates code snippets or explanations.
- **Best for**: Understanding unfamiliar code, exploring approaches, generating complex logic
- **Tools**: Cursor Chat, Copilot Chat, Cody

### Agent-Based (Autonomous)
You describe a task and the AI executes it across multiple files, running commands and tests.
- **Best for**: Feature implementation, refactoring, migrations, test writing
- **Tools**: Claude Code, Cursor Agent, Windsurf

### Edit-in-Place (Inline)
You select code and describe how to change it. The AI modifies the selection directly.
- **Best for**: Refactoring, fixing bugs, adding types, improving readability
- **Tools**: Cursor Cmd+K, Copilot inline edit

## Effective Pair Programming Patterns

### The Scaffolder
Ask the AI to generate the structure, then fill in the details yourself:
```
"Create a React component with props for title, description, and an action
button. Include TypeScript types and basic Tailwind styling."
```

### The Rubber Duck
Explain your problem to the AI — often just articulating it reveals the solution:
```
"I'm trying to figure out why this useEffect runs twice. The dependency array
includes 'data' which is an object that gets recreated on each render..."
```

### The Reviewer
Have the AI review your code for issues:
```
"Review this function for edge cases, potential bugs, and performance issues."
```

### The Translator
Use the AI to convert between technologies:
```
"Convert this Express.js middleware to a Next.js API route handler."
```

### The Teacher
Learn while building by asking the AI to explain its suggestions:
```
"Why did you use useMemo here instead of useCallback? What's the difference
in this context?"
```

## AI Pair Programming vs Solo AI Coding

| Aspect | AI Pair Programming | Solo AI (Agentic) |
|--------|--------------------|--------------------|
| Human involvement | Continuous | Minimal (review at end) |
| Control | Human drives | AI drives |
| Learning | High — you see how AI thinks | Lower — you see results |
| Speed | Moderate | Fast |
| Quality assurance | Real-time | After the fact |
| Best for | Learning, complex decisions | Well-defined tasks |

## Tips for Effective AI Pairing

- **Be specific about context**: Tell the AI about your tech stack, conventions, and constraints
- **Iterate quickly**: Don't spend time perfecting prompts — try something, see the result, adjust
- **Stay engaged**: Read and understand the generated code — don't just accept blindly
- **Use it for learning**: Ask "why" when the AI does something you don't understand
- **Know when to take over**: If the AI is struggling, write the code yourself and use AI for the next piece

## How It's Used in VibeReference

AI pair programming is the primary development mode throughout the VibeReference workflow. During Day 1 (Create), founders pair with AI to generate initial prototypes. During Day 2 (Refine), they pair to improve UX and visual design. Day 3 (Build) involves intensive pairing for authentication, payments, and feature development. The framework teaches founders to be effective AI pair programmers — knowing when to direct, when to let the AI lead, and when to intervene.
