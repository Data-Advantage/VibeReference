# GitHub Copilot

GitHub Copilot is Microsoft's AI coding assistant — the most widely adopted AI pair programmer, with 4.7 million paid subscribers and deployment at roughly 90% of Fortune 100 companies. It started as an inline autocomplete tool in 2022 and has evolved into a full development platform with chat, autonomous agents, code review, and workspace automation, all deeply integrated into GitHub's ecosystem.

Copilot works inside your existing editor (VS Code, JetBrains, Visual Studio) and connects directly to GitHub's pull request, issue, and actions workflows. For teams that center their development around GitHub, Copilot provides the tightest integration of any AI coding tool.

> *In the 5-concept stack, Copilot (autocomplete, Chat, Workspace, Cloud Agent) is a family of **Harnesses** — each wires a Model, Tools, and Context into a different kind of agentic loop. When a Copilot Cloud Agent is pointed at a specific issue with a scoped role, that configured instance is an **Agent**. See [AI Agents vs Harnesses](./agents-vs-harnesses) for the full stack.*

## Why Developers Use Copilot

- **Best-in-class autocomplete** — inline code completions that understand your project context and suggest multi-line blocks as you type
- **GitHub ecosystem integration** — pull request summaries, automated code review, issue-to-PR workflows, and GitHub Actions support built in
- **Multi-model support** — choose between GPT, Claude Sonnet, and Gemini models without switching tools
- **Lowest barrier to entry** — free tier with 2,000 completions/month, and the most generous free offering among AI coding tools
- **Works in your editor** — native extensions for VS Code, JetBrains, Visual Studio, and Neovim

## Core Features

### Code Completions

Copilot's inline completions are what most developers experience first. As you type, Copilot suggests the next line, block, or function based on the surrounding code context. Press Tab to accept, or keep typing to refine.

Completions work across every major programming language and understand:
- Your project's naming conventions and patterns
- The function signature you're implementing
- Import patterns and dependency usage
- Test structure when writing test files

The free tier includes 2,000 completions per month — enough for casual use and evaluation.

### Copilot Chat

Chat lets you ask questions about your code directly in the editor. Unlike generic AI chatbots, Copilot Chat has context about your current file, selection, and project. Use it to:

- Explain unfamiliar code ("what does this function do?")
- Get implementation suggestions ("how should I handle rate limiting here?")
- Debug errors ("why is this test failing?")
- Generate code from descriptions ("write a function that validates email addresses")

Chat is available in the editor sidebar and integrates with your current workspace context.

### Agent Mode

Agent mode turns Copilot from an assistant into an autonomous agent. Describe a task in natural language, and Copilot:

1. Plans the changes across multiple files
2. Edits, creates, and deletes files as needed
3. Runs terminal commands (builds, tests, installs)
4. Reads error output and iterates on fixes
5. Shows you a diff of all changes for review

Agent mode handles multi-file refactoring, feature implementation, and complex debugging loops autonomously, similar to Cursor's Composer and Claude Code's agentic workflow.

### Copilot Workspace

Workspace automates the issue-to-pull-request pipeline. Point it at a GitHub issue, and Workspace:

1. Reads the issue description and context
2. Proposes a plan for the implementation
3. Generates the code changes
4. Creates a pull request with the changes

This closes the loop between project management and code — issues become pull requests without manual coding for routine tasks.

### Code Review Agent

Copilot's code review agent automatically reviews pull requests for:

- Code quality and best practices
- Security vulnerabilities (via CodeQL integration)
- Secret scanning (detecting exposed API keys or credentials)
- Style consistency
- Potential bugs and edge cases

Reviews run automatically on PR creation and provide inline comments with suggestions. The validation pipeline runs security and quality checks in parallel, making reviews roughly 20% faster than sequential analysis.

### Copilot CLI

The Copilot CLI brings AI assistance to the terminal. It helps with:

- Explaining shell commands ("what does this find command do?")
- Generating commands from descriptions ("find all TypeScript files modified today")
- Debugging command output

Remote control capabilities let you monitor and steer CLI sessions from web and mobile interfaces.

## Supported Editors

| Editor | Support Level |
|--------|-------------|
| **VS Code** | Full — all features including Agent mode, Chat, Completions |
| **JetBrains** | Full — IntelliJ, WebStorm, PyCharm, and the full suite |
| **Visual Studio** | Full — with custom agent extensibility |
| **Neovim** | Completions and Chat |
| **GitHub.com** | Chat and code review in the browser |
| **GitHub Mobile** | Research and code workflows on mobile |

VS Code and JetBrains have the most complete feature sets. GitHub's web interface provides chat and review without any local setup.

## Models

Copilot supports multiple AI models — you choose which one powers your experience:

| Model | Strengths | When to Use |
|-------|-----------|-------------|
| **GPT-5.4** | Strong general coding, wide language support | Default for most tasks |
| **Claude Sonnet 4.6** | Excellent reasoning, strong at complex logic | Architectural decisions, nuanced refactoring |
| **Gemini 2.5 Pro** | Massive context window, multimodal | Large codebase analysis |
| **Auto mode** | Automatically selects the best model | When you don't want to choose manually |

Switch models per-request without switching tools. Auto mode picks the best model based on the task.

## Pricing

| Plan | Price | Completions | Key Features |
|------|-------|------------|--------------|
| **Free** | $0 | 2,000/month | Completions, limited Chat |
| **Pro** | $10/month | Unlimited | Full Chat, Agent mode, all features |
| **Pro+** | $39/month | Unlimited | Advanced models, higher limits |
| **Business** | $19/user/month | Unlimited | Team management, data excluded from training |
| **Enterprise** | $39/user/month | Unlimited | SSO, audit logs, custom policies, data excluded from training |

The free tier is the most generous in the AI coding market. Pro at $10/month is cheaper than both Cursor ($20/month) and Claude Code ($20/month for Claude Pro), making Copilot the most affordable full-featured option.

**Data policy note**: As of April 2026, Free, Pro, and Pro+ tier usage data may be used for model training by default. Business and Enterprise tiers are excluded. Users can opt out in settings.

## GitHub Copilot vs Cursor

| Aspect | GitHub Copilot | Cursor |
|--------|---------------|--------|
| **Interface** | Extension in your existing editor | Standalone editor (VS Code fork) |
| **Autocomplete** | Excellent inline completions | Excellent — with deeper codebase indexing |
| **Agent mode** | Multi-file autonomous editing | Up to 8 parallel agents |
| **GitHub integration** | Native — PR summaries, code review, issues, Actions | Basic — via git commands |
| **Model choice** | GPT, Claude, Gemini | Claude, GPT, Gemini |
| **Codebase context** | File-level + open tabs | Full project indexing |
| **Price** | $10/month Pro | $20/month Pro |

Choose Copilot if you live in the GitHub ecosystem and want the cheapest full AI experience. Choose Cursor if you want deeper codebase indexing and more powerful agent capabilities.

## GitHub Copilot vs Claude Code

| Aspect | GitHub Copilot | Claude Code |
|--------|---------------|-------------|
| **Interface** | Editor extension | Terminal CLI, IDE extensions, web app |
| **Best for** | Editor-native AI with GitHub integration | Terminal-first agentic coding and automation |
| **Autocomplete** | Excellent inline completions | No inline autocomplete |
| **Code review** | Built-in PR review agent | Via headless mode + GitHub Actions |
| **Automation** | Copilot Workspace, GitHub Actions | Headless mode, SDK, GitHub Actions |
| **Customization** | Repository instructions | CLAUDE.md, hooks, MCP, permissions |
| **Price** | $10/month Pro | $20/month Claude Pro (or API pay-per-token) |

Copilot and Claude Code complement each other well: Copilot for inline completions and GitHub workflow automation, Claude Code for deep agentic reasoning and complex multi-file refactoring.

## Getting Started

### 1. Sign Up

Visit [github.com/features/copilot](https://github.com/features/copilot) and choose a plan. The free tier requires only a GitHub account.

### 2. Install the Extension

- **VS Code**: Search "GitHub Copilot" in the Extensions marketplace
- **JetBrains**: Install from the JetBrains Marketplace
- **Visual Studio**: Built-in for VS 2022+

### 3. Authenticate

The extension prompts you to sign in with your GitHub account. Authorize the Copilot extension when prompted.

### 4. Start Coding

- **Autocomplete** — start typing and Copilot suggests completions. Tab to accept.
- **Chat** — open the Copilot Chat panel (Ctrl/Cmd + Shift + I) to ask questions
- **Agent mode** — type a task description in Chat and select Agent mode for autonomous multi-file editing

### 5. Configure for Your Team

For Business and Enterprise plans, administrators can:
- Set organization-wide policies
- Manage seat assignments
- Configure which repositories Copilot can access
- Review usage analytics and adoption metrics

## When to Use GitHub Copilot

| Scenario | Recommendation |
|----------|---------------|
| Inline autocomplete while typing | Copilot (best-in-class) |
| Quick code questions and explanations | Copilot Chat |
| PR reviews and security scanning | Copilot Code Review Agent |
| Issue-to-PR automation | Copilot Workspace |
| Complex multi-file refactoring | Claude Code or Cursor Agent mode |
| Terminal-first autonomous coding | Claude Code |
| CI/CD and headless automation | Claude Code |

Copilot excels at editor-native AI assistance and GitHub workflow integration. For deep agentic tasks, pair it with Claude Code or Cursor.
