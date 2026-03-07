# Agentic Coding

Agentic coding is a development paradigm where AI agents autonomously write, test, debug, and iterate on code with minimal human intervention. Instead of acting as a suggestion engine, the AI operates as an independent developer — planning tasks, executing multi-step workflows, reading files, running commands, and course-correcting based on errors.

## Key Characteristics

- **Autonomous Execution**: The agent decides what to do next rather than waiting for line-by-line instructions
- **Tool Use**: Agents read files, write code, run tests, search codebases, and execute shell commands
- **Planning & Reasoning**: The agent breaks complex tasks into subtasks and works through them sequentially
- **Error Recovery**: When tests fail or code breaks, the agent diagnoses and fixes issues on its own
- **Context Awareness**: Agents understand project structure, conventions, and dependencies

## How It Differs from Autocomplete

| Aspect | Autocomplete (Copilot-style) | Agentic Coding |
|--------|------------------------------|----------------|
| Scope | Single line or function | Entire features or bug fixes |
| Control | Human drives, AI suggests | AI drives, human reviews |
| Context | Current file | Entire codebase |
| Iteration | None — one suggestion | Multiple cycles of write-test-fix |
| Tool access | Editor only | Terminal, file system, browser, APIs |

## Leading Tools

- **Claude Code**: Anthropic's CLI agent for autonomous coding tasks
- **Cursor Agent Mode**: IDE-integrated agentic coding with background execution
- **Windsurf (Codeium)**: AI-native IDE with autonomous agent capabilities
- **Devin**: Fully autonomous software engineering agent
- **OpenAI Codex CLI**: Terminal-based agentic coding from OpenAI
- **Amazon Q Developer**: AWS-integrated autonomous coding agent

## Typical Agentic Workflow

1. **Understand**: Agent reads relevant files, documentation, and issue descriptions
2. **Plan**: Agent creates a task breakdown and identifies files to modify
3. **Implement**: Agent writes code across multiple files
4. **Validate**: Agent runs tests, linters, and type checks
5. **Iterate**: Agent fixes any failures and re-validates
6. **Report**: Agent summarizes what was done and any remaining concerns

## Best Practices

- **Start with clear intent**: Describe what you want built, not how to build it — let the agent decide the implementation
- **Use test-driven workflows**: Agents perform best when they can validate their own work against tests
- **Set up coding harnesses**: Provide fast feedback loops (linters, type checkers, test suites) so agents can self-correct
- **Review outputs, not process**: Focus on the final result rather than micromanaging each step
- **Scope tasks appropriately**: Agents handle well-defined features better than vague "improve everything" requests

## When to Use Agentic Coding

- Building new features from a clear specification
- Fixing bugs with reproducible test cases
- Refactoring code with existing test coverage
- Migrating between frameworks or APIs
- Writing tests for existing code
- Implementing boilerplate-heavy features (CRUD, forms, API endpoints)

## Risks and Limitations

- **Drift**: Agents can go down wrong paths without proper guardrails
- **Overengineering**: May add unnecessary abstractions unless guided
- **Security**: Generated code needs review for vulnerabilities
- **Cost**: Long agentic sessions consume significant API tokens
- **Hallucination**: Agents may invent APIs or libraries that don't exist

## How It's Used in VibeReference

Agentic coding is the core methodology behind the 5-day SaaS build process. Rather than writing code manually, founders use AI agents to generate entire application scaffolds (Day 1), refine UX and design (Day 2), build authentication, payments, and dashboards (Day 3), create marketing content (Day 4), and deploy production applications (Day 5). The key skill shift is from writing code to directing agents — knowing what to ask for, how to validate outputs, and when to intervene.
