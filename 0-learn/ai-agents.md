# AI Agents

An AI agent is a system where a language model operates in a loop — perceiving its environment, making decisions, taking actions, and observing results — to accomplish goals autonomously. Unlike a simple chatbot that responds to one message at a time, an agent persists across multiple steps, uses tools, and adapts its strategy based on feedback.

## What Makes an Agent

An AI agent has four core capabilities:

1. **Perception**: Reading files, browsing the web, querying databases, observing tool outputs
2. **Reasoning**: Planning what to do, breaking down complex tasks, deciding between approaches
3. **Action**: Writing files, running commands, calling APIs, sending messages
4. **Memory**: Maintaining context across steps, learning from errors, tracking progress

A basic LLM call is: Input → Output. An agent is: Goal → (Perceive → Reason → Act → Observe)* → Result.

## Agent Architectures

### ReAct (Reason + Act)
The most common pattern. The agent alternates between reasoning about what to do and taking actions:
```
Thought: I need to find the authentication middleware
Action: Search codebase for "auth middleware"
Observation: Found in src/middleware/auth.ts
Thought: Now I need to understand how it validates tokens
Action: Read src/middleware/auth.ts
Observation: It uses JWT validation with...
```

### Plan-Then-Execute
The agent creates a complete plan before taking any actions, then executes each step:
```
Plan:
1. Read the current test file
2. Identify untested edge cases
3. Write tests for each edge case
4. Run tests to verify they pass

Executing step 1...
```

### Reflexion
The agent reviews its own work and critiques it, then improves:
```
Draft: [generated code]
Reflection: This doesn't handle the empty array case, and the variable
naming is inconsistent with the rest of the codebase.
Revised: [improved code]
```

## Types of AI Agents

### Coding Agents
Build software autonomously. Read codebases, write features, fix bugs, run tests.
- Claude Code, Cursor Agent, Devin, OpenAI Codex CLI

### Research Agents
Gather and synthesize information. Search the web, read documents, compile findings.
- Perplexity, ChatGPT Deep Research, Claude with web search

### Workflow Agents
Automate business processes. Handle emails, manage tickets, update spreadsheets.
- n8n AI agents, Zapier AI, custom LangGraph workflows

### Multi-Agent Systems
Multiple specialized agents collaborate on complex tasks:
```
Coordinator Agent
├── Research Agent (gathers requirements)
├── Coding Agent (implements features)
├── Testing Agent (writes and runs tests)
└── Review Agent (checks quality)
```

## Building Agents

### With the Anthropic Agent SDK
```typescript
import { Agent, tool } from "claude-agent-sdk";

const agent = new Agent({
  model: "claude-sonnet-4-6",
  tools: [
    tool("readFile", { path: z.string() }, async ({ path }) => {
      return fs.readFileSync(path, "utf-8");
    }),
    tool("writeFile", { path: z.string(), content: z.string() }, async ({ path, content }) => {
      fs.writeFileSync(path, content);
      return "File written successfully";
    }),
  ],
  instructions: "You are a coding agent. Read files, make changes, and verify your work.",
});

const result = await agent.run("Add input validation to the signup form");
```

### With LangGraph
```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)
graph.add_node("reason", reason_step)
graph.add_node("act", action_step)
graph.add_node("observe", observation_step)
graph.add_edge("reason", "act")
graph.add_edge("act", "observe")
graph.add_conditional_edges("observe", should_continue)
```

## Agent Evaluation

Measuring agent performance:

| Metric | What It Measures |
|--------|-----------------|
| **Task completion rate** | % of tasks completed successfully |
| **Iterations to solution** | How many loops before convergence |
| **Token efficiency** | Tokens consumed per successful task |
| **Error recovery rate** | % of errors the agent self-corrects |
| **Human intervention rate** | How often humans need to step in |

## Limitations

- **Context window**: Agents lose coherence on very long tasks as context fills up
- **Compounding errors**: Small mistakes early can cascade into large problems
- **Cost**: Long-running agents consume significant API tokens
- **Reliability**: Non-deterministic — same task may succeed or fail on different runs
- **Security**: Agents with tool access can cause real damage if not properly sandboxed

## How It's Used in VibeReference

AI agents are the workforce behind the VibeReference methodology. Rather than writing code manually, founders direct agents to build their SaaS products. Day 1 uses agents to generate prototypes from product requirements. Day 3 uses agents to implement authentication, payments, and core features. The framework's emphasis on agency and taste reflects the skills needed to work effectively with AI agents — knowing what to ask for (agency) and knowing whether the output is good (taste).
