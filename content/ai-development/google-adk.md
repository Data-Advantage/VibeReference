# Google ADK (Agent Development Kit)

Google ADK is an open-source framework for building, deploying, and orchestrating AI agents. It's designed to make agent development feel like traditional software engineering — with typed tools, modular architectures, workflow primitives, and built-in deployment to Google Cloud. While optimized for Gemini models and Vertex AI, it's model-agnostic and can run anywhere.

## Why ADK Exists

Every major AI company now offers an agent framework: Anthropic has the Agent SDK, OpenAI has the Agents SDK, and LangChain has LangGraph. Google ADK is Google's answer — but with a distinctive focus on enterprise deployment, multi-agent orchestration, and cross-framework interoperability through the A2A protocol.

```
Google ADK sits between:
  "Write an agent script" (too simple)
  "Build a custom agent platform" (too complex)
```

It gives you production-grade primitives — sequential workflows, parallel execution, hierarchical routing, observability, and managed deployment — without requiring you to build the infrastructure yourself.

## Core Concepts

### Agents
The fundamental unit. An agent has a name, a model, instructions, and tools:

```python
from google.adk import Agent
from google.adk.tools import google_search

agent = Agent(
    name="researcher",
    model="gemini-flash-latest",
    instruction="You help users research topics thoroughly. Use search to find current information.",
    tools=[google_search]
)

response = agent.run("What are the latest trends in AI agent frameworks?")
```

ADK supports three agent types:
- **LLM Agents**: Powered by a language model that reasons and calls tools
- **Workflow Agents**: Deterministic orchestration (Sequential, Parallel, Loop)
- **Custom Agents**: Subclass `BaseAgent` for fully custom logic

### Tools
Functions that agents can call. ADK provides built-in tools and supports custom tools via a decorator:

```python
from google.adk import Agent, tool

@tool
def get_weather(city: str, country: str = "US") -> dict:
    """Get current weather for a city."""
    # Call weather API
    return {"temp": 72, "condition": "sunny", "city": city}

agent = Agent(
    name="weather_agent",
    model="gemini-flash-latest",
    instruction="Help users check the weather.",
    tools=[get_weather]
)
```

Built-in tools include Google Search, code execution, and Vertex AI integrations. You can also wrap any MCP server as a tool source.

### Workflow Agents

For deterministic, multi-step processes where you don't want the LLM deciding the order:

```python
from google.adk import Agent, SequentialWorkflow, ParallelWorkflow

# Sequential: research → analyze → summarize
researcher = Agent(name="researcher", model="gemini-flash-latest",
    instruction="Research the topic using search.", tools=[google_search])

analyzer = Agent(name="analyzer", model="gemini-flash-latest",
    instruction="Analyze the research findings for key patterns.")

summarizer = Agent(name="summarizer", model="gemini-flash-latest",
    instruction="Write a concise summary of the analysis.")

pipeline = SequentialWorkflow(agents=[researcher, analyzer, summarizer])
result = pipeline.run("AI agent adoption in enterprise")
```

Workflow types:
- **SequentialWorkflow**: Run agents one after another, passing output forward
- **ParallelWorkflow**: Run agents simultaneously, combine results
- **LoopWorkflow**: Repeat until a condition is met

## A2A Protocol

Agent-to-Agent (A2A) is Google's protocol for cross-framework agent communication. It lets ADK agents talk to agents built with LangGraph, CrewAI, or any other framework that implements A2A.

```
ADK Agent ←→ A2A Protocol ←→ LangGraph Agent
                            ←→ CrewAI Agent
                            ←→ Custom Agent
```

This matters because real systems don't use a single framework. Your research agent might use ADK with Gemini, your coding agent might use Claude, and your data pipeline agent might use LangGraph. A2A lets them collaborate without custom integration code.

A2A communicates over gRPC and defines standard message formats for:
- Task delegation between agents
- Status updates and progress reporting
- Result sharing and handoffs

## Hierarchical Agents

ADK supports multi-agent hierarchies where a coordinator delegates to specialized sub-agents:

```python
from google.adk import Agent

# Specialized agents
frontend_dev = Agent(
    name="frontend",
    model="gemini-flash-latest",
    instruction="You write React components with TypeScript and Tailwind.",
    tools=[file_write, npm_run]
)

backend_dev = Agent(
    name="backend",
    model="gemini-flash-latest",
    instruction="You write Node.js API routes with Express.",
    tools=[file_write, db_query]
)

# Coordinator that routes to specialists
lead = Agent(
    name="tech_lead",
    model="gemini-pro-latest",
    instruction="You are a tech lead. Route frontend work to the frontend agent and backend work to the backend agent.",
    sub_agents=[frontend_dev, backend_dev]
)

result = lead.run("Build a user profile page with an API endpoint")
```

The coordinator uses the LLM to decide which sub-agent handles each part of the task. Sub-agents can themselves have sub-agents, creating deep hierarchies for complex systems.

## Vertex AI Integration

ADK is tightly integrated with Google's Vertex AI platform:

```bash
# Deploy an agent to Vertex AI Agent Engine
adk deploy --project my-project --region us-central1
```

Vertex AI Agent Engine provides:
- **Managed runtime**: Auto-scaling, monitoring, and logging
- **Model Garden**: Access to 200+ models (Gemini, Llama, Mistral, etc.)
- **Evaluation**: Built-in tools for testing agent quality
- **Security**: IAM integration, VPC controls, audit logging

For local development, ADK includes a CLI and web UI:
```bash
# Run locally
adk run my_agent

# Launch visual builder
adk ui
```

## Getting Started

### Installation
```bash
pip install google-adk
```

### Authentication
```bash
gcloud auth application-default login
```

### Project Structure
```
my-agent/
├── agent.py          # Agent definition
├── tools.py          # Custom tools
├── config.yaml       # Configuration (optional)
└── tests/
    └── test_agent.py # Agent tests
```

### Minimal Agent
```python
from google.adk import Agent

agent = Agent(
    name="helper",
    model="gemini-flash-latest",
    instruction="You are a helpful assistant."
)

response = agent.run("Hello!")
print(response)
```

### YAML-Based Authoring
For simpler agents, define them in YAML without writing Python:
```yaml
name: customer_support
model: gemini-flash-latest
instruction: |
  You help customers with account questions.
  Always be polite and check account status before answering.
tools:
  - lookup_account
  - check_order_status
```

## ADK vs Other Frameworks

| Feature | Google ADK | LangGraph | CrewAI | Anthropic Agent SDK |
|---------|-----------|-----------|--------|-------------------|
| **Primary model** | Gemini (model-agnostic) | Any (LangChain ecosystem) | Any | Claude (model-agnostic) |
| **Orchestration** | Sequential, Parallel, Loop, Hierarchical | Graph-based state machines | Role-based crews | Handoffs between agents |
| **Deployment** | Vertex AI Agent Engine, Cloud Run, anywhere | LangSmith, self-hosted | Self-hosted | Self-hosted |
| **Cross-framework** | A2A protocol | LangChain integrations | Limited | MCP for tools |
| **Visual builder** | Yes (`adk ui`) | LangGraph Studio | No | No |
| **Best for** | Enterprise/Google Cloud teams | Complex stateful workflows | Quick multi-agent prototypes | Claude-first applications |

### When to Choose ADK
- You're already on Google Cloud or using Gemini models
- You need managed deployment with enterprise security
- You want cross-framework agent communication (A2A)
- You prefer workflow primitives over graph-based orchestration

### When to Choose Something Else
- **LangGraph**: You need complex state machines with conditional branching
- **CrewAI**: You want the fastest path to a working multi-agent prototype
- **Anthropic Agent SDK**: You're building primarily with Claude and want minimal abstraction

## Observability

ADK includes built-in observability through OpenTelemetry:

```python
# Traces are collected automatically
# View them in the ADK Web UI or export to any OpenTelemetry backend

from google.adk import Agent

agent = Agent(
    name="traced_agent",
    model="gemini-flash-latest",
    instruction="...",
    trace_enabled=True  # Enabled by default
)
```

Traces capture:
- Every LLM call (input, output, latency, tokens)
- Tool invocations (parameters, results, errors)
- Agent routing decisions in hierarchies
- Workflow step transitions

## How It's Used in VibeReference

Google ADK is relevant for founders building AI-powered SaaS applications that need multi-agent orchestration, especially those already using Google Cloud infrastructure. Its workflow primitives (Sequential, Parallel, Loop) map directly to common SaaS patterns like data processing pipelines, customer support triage, and content generation workflows. The A2A protocol is particularly valuable when your system uses agents from multiple frameworks — letting your Gemini research agent collaborate with your Claude coding agent without custom glue code.
