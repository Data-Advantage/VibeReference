---
title: "MCP vs A2A vs AG-UI: Which Agent Protocol Do You Need?"
description: "Choose the right agent protocol: MCP for tools, A2A for agent coordination, and AG-UI for interactive agent app interfaces."
---

# MCP vs A2A vs AG-UI: Which Agent Protocol Do You Need?

MCP, A2A, and AG-UI solve three different agent protocol problems. Use MCP when an agent needs tools and data, A2A when independent agents need to coordinate across boundaries, and AG-UI when a user-facing app needs a reliable real-time interface to an agent backend.

## The Short Decision

Most solo founders should start with MCP, not a full agent-protocol stack. MCP gives your agent access to GitHub, databases, file systems, search, billing systems, and internal APIs. Add AG-UI when the product experience depends on streaming status, approvals, shared state, or frontend actions. Add A2A only when you have more than one independent agent service and those agents need a public contract for discovery, delegation, and task state.

| Protocol | Boundary | Use it for | Avoid it when |
|---|---|---|---|
| MCP | Agent to tools and data | Letting a harness or app agent call external systems | You only need one custom backend endpoint |
| A2A | Agent to agent | Coordinating independent agents across runtimes, vendors, or teams | Your "agents" are just functions inside one process |
| AG-UI | Agent to user interface | Streaming agent state, interrupts, UI actions, and shared app state | A plain chat completion response is enough |

This is not a winner-take-all decision. The clean architecture is layered: AG-UI connects the user interface to your agent backend, MCP equips that backend with tools, and A2A lets that backend hand work to another independent agent.

## MCP: Tool and Data Access

[Model Context Protocol](https://modelcontextprotocol.io/specification/2026-07-28) is the connector layer for an LLM application. The current MCP specification describes a host, client, and server model using JSON-RPC messages. Servers expose resources, prompts, and tools; clients connect them to the host application that is running the model.

Use MCP when the agent needs capabilities outside its own prompt context:

- Read or write files in a scoped project directory.
- Query a Postgres, Supabase, Convex, or analytics database.
- Pull issues, pull requests, and deployment logs from SaaS tools.
- Expose internal admin actions to an agent with explicit permissions.
- Reuse the same tool server across Claude Code, Cursor, Codex-style harnesses, and your own app.

MCP fits the [coding harness](./coding-harnesses) layer especially well because tools are part of the context the model sees. A well-named MCP tool with a precise schema teaches the model what action is available and when to call it. That is why MCP belongs next to [context engineering](./context-engineering), not only next to API integration.

The main trade-off is trust. MCP tools can bridge into real systems, so a sloppy server becomes a broad permission leak. Scope each server narrowly, prefer read-only credentials for research and support workflows, and require approval before destructive writes. For production use, the security design matters as much as the protocol.

## A2A: Agent Coordination

[Agent2Agent](https://a2a-protocol.org/latest/) is the protocol for communication between independent agents. As of 2026-08, the A2A project describes MCP and A2A as complementary: MCP connects agents to tools and data, while A2A connects agents to other agents. The [A2A specification](https://a2a-protocol.org/latest/specification/) centers on concepts such as agent discovery, agent cards, messages, tasks, task status, artifacts, streaming updates, and security schemes.

Use A2A when the boundary is organizational or architectural:

- Your support agent needs to delegate a billing investigation to a finance agent owned by another team.
- Your product agent needs to request a deployment review from an engineering agent running in a separate system.
- Your customer's agent needs to call your agent without knowing your internal framework.
- You want agents built on different runtimes to exchange tasks without sharing internal memory or tool definitions.

A2A is overkill when all orchestration happens inside one codebase. If your "research agent" and "writer agent" are two functions in the same workflow, use your framework's native orchestration model. A2A starts paying for itself when the other agent is opaque: it has its own runtime, permissions, model choices, tool stack, and owner.

The founder mistake is treating A2A as a subagent abstraction. It is not the first thing you reach for when building a [multi-agent task delegation](./multi-agent-task-delegation) flow inside one app. It is the contract you reach for when agents need to discover each other, exchange work, and preserve task state across real service boundaries.

## AG-UI: User-Facing Agent Interfaces

[AG-UI](https://docs.ag-ui.com/introduction) is the protocol for the agent-to-user-interface boundary. Its docs describe an event-based connection between a user-facing application and an agentic backend. That distinction matters because agent products do not behave like normal request-response web apps. They stream work, pause for approvals, surface tool output, accept edits mid-run, and sometimes hand actions back to the frontend.

Use AG-UI when the interface is part of the agent system:

- A user watches a long-running agent plan, execute, and revise work.
- The product needs pause, approve, edit, retry, or escalate controls.
- Tool output should render as structured UI, not only text.
- Frontend actions need to be callable by the agent through a typed contract.
- The app maintains shared state between the agent backend and the browser.

AG-UI is not a replacement for MCP. A frontend can connect to an agent backend through AG-UI while that backend calls GitHub, Stripe, or a database through MCP. AG-UI is also not the same as A2A. A2A is for agent-to-agent coordination; AG-UI is for the human-facing product surface.

If your app only returns a final answer after a single request, skip AG-UI. Server-sent events, WebSockets, or your framework's streaming primitives are enough. Add AG-UI when the product must make agent state inspectable and controllable.

## How They Fit in One Product

A practical AI product can use all three protocols without making them compete.

Imagine a SaaS operations assistant:

1. The browser talks to the operations agent through AG-UI, so the user can see progress, approve risky steps, and inspect artifacts.
2. The operations agent uses MCP servers for GitHub, the database, observability, and billing tools.
3. When legal review is needed, the operations agent delegates a task to an external compliance agent through A2A.

That architecture keeps each boundary honest. The UI boundary handles user experience. The tool boundary handles capabilities and permissions. The agent boundary handles delegation and interoperability. When those concerns collapse into one custom API, the system becomes harder to debug because every integration invents its own shape for messages, state, permissions, and errors.

For a first product, you usually do not need the full stack. Start with the boundary causing real friction. If your agent is blind, add MCP. If your user interface feels like a black box, add AG-UI. If agents owned by different systems need to coordinate, add A2A.

## Decision Matrix for AI-First Founders

| Situation | Protocol choice | Why |
|---|---|---|
| You want Claude Code or a local agent to query project data | MCP | The agent needs tools and resources inside a harness |
| Your app has one agent backend and a chat UI | No protocol first | Your existing API or streaming route is simpler |
| The UI needs human approvals during agent runs | AG-UI | The frontend needs typed events, interrupts, and state |
| Your support agent needs to call a separate billing agent | A2A | The agents need a shared task and message contract |
| You want your agent to call Stripe, GitHub, and a database | MCP | These are tool and data integrations |
| You want third-party agents to discover and delegate work to your agent | A2A | Discovery and task interoperability are the point |
| Your agent returns custom charts, forms, or progress views to the browser | AG-UI | The product surface needs structured interaction events |

The sequence is usually: custom endpoint, then MCP, then AG-UI, then A2A. That sequence changes when the product is itself an interoperability platform. If your core value is "other agents can hire our agent," A2A becomes part of the first public API. If your core value is "users supervise long-running agents," AG-UI moves earlier.

## Common Mistakes

**Building A2A before you have a second real agent.** A single app with internal worker functions does not need agent interoperability. Keep the orchestration local until another runtime or owner enters the system.

**Using MCP as an authorization strategy.** MCP is a protocol boundary, not a complete policy engine. You still need scoped credentials, audit logs, consent flows, and separate read/write permissions.

**Treating AG-UI as decoration.** If the frontend only shows prettier chat bubbles, you do not need a protocol. AG-UI matters when interaction state, interrupts, frontend actions, or rendered tool output are product requirements.

**Exposing every internal tool at once.** Start with the smallest MCP surface that unblocks the workflow. A support agent may need read-only customer lookup before it needs refund permissions.

**Confusing protocol fit with vendor maturity.** The right question is not "which standard is hotter?" The right question is "which boundary is unstable in my product?" Tools, users, and other agents are three different boundaries.

## See Also

- [MCP (Model Context Protocol)](./mcp-model-context-protocol) — The dedicated reference for MCP concepts, clients, servers, and tool access.
- [Official MCP Servers](./official-mcp-servers) — Vendor-maintained MCP servers for connecting agents to real systems.
- [Coding Harnesses](./coding-harnesses) — How AI coding runtimes assemble tools, context, and model calls.
- [AI Agent Orchestration](./ai-agent-orchestration) — When to coordinate agents inside one framework instead of using an external protocol.
- [OpenAPI](/backend-and-data/openapi) — The traditional API contract layer that still matters underneath agent protocols.
