# Claude Agent SDK

The Claude Agent SDK is Anthropic's official library for building AI agents with the same capabilities that power [Claude Code](/ai-development/claude-code) — file editing, shell execution, codebase navigation, multi-turn tool use, and subagent orchestration. It is the productized form of the agent harness Anthropic ships in Claude Code, exposed as a programmatic SDK so you can embed it in your own apps, scripts, CI pipelines, or custom developer tools.

## What it is

If you have used Claude Code, you have used the Claude Agent SDK indirectly. Claude Code is the CLI; the SDK is the same engine, exported as a library you can call from your own code. Anthropic released it in late 2025 (originally as the Claude Code SDK, renamed to Claude Agent SDK shortly after) to let teams build autonomous agents that go beyond what a single Messages API call can do.

The clearest way to think about the layers in the Anthropic ecosystem:

| Layer | What it is |
|-------|------------|
| **Claude API** (`@anthropic-ai/sdk`, `anthropic`) | One-shot model calls. You send messages, you get a response. You handle tool use, retries, and orchestration yourself. |
| **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`, `claude-agent-sdk`) | Full agent loop. Built-in file tools, bash, subagent spawning, session management, permissions, MCP integration. |
| **Claude Code** | The interactive CLI built on the Agent SDK. End-user product. |

The Agent SDK is the right choice when you need an agent that *does things*: reads and writes files, runs commands, calls external APIs, chains multiple tool uses across many turns. The plain Claude API is the right choice when you just need a model response.

## Availability

Two officially supported language SDKs:

| Language | Package | Repo |
|----------|---------|------|
| TypeScript / Node.js | `@anthropic-ai/claude-agent-sdk` | [github.com/anthropics/claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript) |
| Python (3.10+) | `claude-agent-sdk` | [github.com/anthropics/claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python) |

Both wrap the same underlying agent runtime and stay version-aligned with Claude Code releases — when Claude Code v2.1.x ships, the SDKs publish a matching release.

A community Rust binding (`claude-agent-sdk` on crates.io) exists but is not maintained by Anthropic.

## Installation

TypeScript:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

Python:

```bash
pip install claude-agent-sdk
```

Both require an Anthropic API key in the `ANTHROPIC_API_KEY` environment variable, or `ANTHROPIC_AUTH_TOKEN` if you are routing through a proxy. The SDKs also respect `ANTHROPIC_BASE_URL` for self-hosted relays or gateways like Vercel AI Gateway.

## Hello world (TypeScript)

The core export is `query()` — an async generator that streams messages from the agent as it runs.

```ts
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "List the files in the current directory and summarise what this project does.",
  options: {
    systemPrompt: "You are a helpful coding assistant.",
    cwd: process.cwd(),
    model: "claude-sonnet-4-5",
  },
})) {
  if (message.type === "assistant") {
    console.log(message.message.content);
  }
}
```

The agent boots, reads the working directory, calls the Read and Glob tools as needed, and streams its reasoning and final answer back as `SDKMessage` events. There is no manual tool dispatch loop — the SDK runs that for you.

## Hello world (Python)

```python
import asyncio
from claude_agent_sdk import ClaudeAgentOptions, ClaudeSDKClient

async def main():
    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        max_turns=20,
        system_prompt="You are a helpful assistant.",
    )
    async with ClaudeSDKClient(options=options) as client:
        await client.query("List the files in the current directory.")
        async for msg in client.receive_response():
            if hasattr(msg, "content"):
                for block in msg.content:
                    if hasattr(block, "text"):
                        print(block.text)

asyncio.run(main())
```

Python also exposes a one-shot `query()` helper for non-streaming use, but the `ClaudeSDKClient` form is the right pattern for any agent that needs more than a single turn.

## Core primitives

The SDK organises around five primitives, all configurable through `ClaudeAgentOptions`:

- **The agent loop.** The SDK runs the model, dispatches tool calls, returns results to the model, and continues until the model stops requesting tools. You never write the dispatch loop yourself.
- **Built-in tools.** `Read`, `Write`, `Edit`, `Glob`, `Grep`, `Bash`, and a handful of others, gated by `allowedTools` / `permissionMode`. Same toolset Claude Code uses.
- **Custom tools.** Define your own with the `tool()` helper and Zod (TS) or pydantic-style (Python) schemas. The agent treats them identically to built-ins.
- **MCP servers.** Mount any [Model Context Protocol](/ai-development/mcp-model-context-protocol) server to give the agent access to external systems — Slack, Linear, your database, internal APIs.
- **Subagents.** Define named subagents in `options.agents`; the lead agent can spawn them for parallel or specialized work.

## Defining custom tools (TypeScript)

```ts
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const lookupOrder = tool(
  "lookup_order",
  "Look up an order by ID and return its status.",
  { orderId: z.string() },
  async ({ orderId }) => {
    const order = await db.orders.findUnique({ where: { id: orderId } });
    return {
      content: [{ type: "text", text: JSON.stringify(order) }],
    };
  },
);

const orderTools = createSdkMcpServer({
  name: "orders",
  version: "1.0.0",
  tools: [lookupOrder],
});

for await (const message of query({
  prompt: "What is the status of order ORD-1234?",
  options: {
    mcpServers: { orders: orderTools },
    allowedTools: ["mcp__orders__lookup_order"],
    model: "claude-sonnet-4-5",
  },
})) {
  if (message.type === "assistant") {
    console.log(message.message.content);
  }
}
```

The `mcp__<server>__<tool>` naming convention is how the agent addresses MCP-served tools. Permissions are explicit — only tools listed in `allowedTools` can be called.

## Subagents

Subagents are isolated agent instances the lead agent can delegate to. They get their own system prompt, their own toolset, and optionally their own model. The pattern is most useful when a task naturally splits into specialized roles.

```ts
for await (const message of query({
  prompt: "Review the last commit on this branch.",
  options: {
    cwd: process.cwd(),
    agents: {
      "code-reviewer": {
        description: "Reads diffs and reports issues without writing code.",
        tools: ["Read", "Grep", "Bash"],
        model: "claude-opus-4-7",
        systemPrompt: "You are a senior reviewer. Find bugs, do not propose rewrites.",
      },
      "test-runner": {
        description: "Runs tests and reports results.",
        tools: ["Bash"],
        model: "claude-haiku-4-5",
      },
    },
  },
})) {
  // ...
}
```

The lead agent decides when to call each subagent. Subagents return a synthesised result rather than a raw transcript, which keeps the lead agent's context clean.

This is the same pattern Claude Code uses internally for the `Task` and `Agent` tools.

## Permissions and sandboxing

The SDK has explicit permission controls because the default toolset includes Bash and file writes — capabilities that need to be governed in any production deployment.

| Mode | Behaviour |
|------|-----------|
| `default` | Agent can use any tool not on a deny-list. |
| `acceptEdits` | File edits proceed without confirmation; other tools follow normal rules. |
| `plan` | Agent reasons but cannot execute side-effectful tools — useful for dry runs. |
| `bypassPermissions` | All gates removed. Use only inside isolated environments. |

Combined with `allowedTools` (an explicit allow-list), `cwd` (working directory bound to a single path), and a sandboxed filesystem like [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox), you can run AI-generated agent sessions on real workloads without giving them access to anything they should not touch.

## Sessions

The SDK persists conversations as session files on disk so you can resume long-running agents without holding state in memory.

```ts
import { listSessions, getSessionMessages } from "@anthropic-ai/claude-agent-sdk";

const sessions = await listSessions({ dir: "./sessions", limit: 10 });
for (const s of sessions) {
  const messages = await getSessionMessages({ sessionId: s.id });
  // ... resume, audit, fork, etc.
}
```

This is what makes the SDK practical for agents that run for hours or that need to be inspected after the fact for debugging or compliance.

## Model selection and cost

The Agent SDK uses your Anthropic API tokens directly — there is no separate billing. You select the model per query (or per subagent) via `options.model`, and you pay the standard per-token rate for that model family.

Practical defaults in 2026:

- **Claude Haiku 4.5** for cheap, fast subagents that handle narrow tasks (running tests, summarizing files, classifying inputs).
- **Claude Sonnet 4.5 / 4.6** for the lead agent in most workflows. Good balance of cost and capability for multi-step tool use.
- **Claude Opus 4.7** when the agent needs deep reasoning — code review, architecture decisions, complex debugging.

The `max_turns` (Python) / `maxTurns` (TS) option caps how long an agent can loop before it has to stop. Setting this is the single most important thing you can do for cost predictability — without a cap, a confused agent can chew through a meaningful amount of tokens before you notice.

## Hooks

Hooks let you intercept the agent's tool calls before or after they run — for logging, validation, modification, or hard blocks.

```ts
options: {
  hooks: {
    PreToolUse: [{
      matcher: { tool_name: "Bash" },
      hook: async (event) => {
        if (event.tool_input.command.includes("rm -rf")) {
          return { decision: "block", reason: "rm -rf is not allowed." };
        }
      },
    }],
  },
}
```

This is how Claude Code implements the rm-rf guardrail you have probably seen — a `PreToolUse` hook that pattern-matches against destructive commands and refuses them. You can plug your own hooks in for compliance, audit, or domain-specific safety.

## How it compares

| | Claude Agent SDK | `@anthropic-ai/sdk` (Claude API) | Vercel AI SDK | LangChain |
|---|------------------|----------------------------------|---------------|-----------|
| **Built-in tools** | Read, Write, Edit, Glob, Grep, Bash, more | None | None — you wire tools in app code | Many; varies by integration |
| **Tool dispatch loop** | Built in | You write it | You write it (`maxSteps` helper) | Built in (varies by chain) |
| **Subagents** | First-class | No | Via `tools` calling sub-flows | Yes, via agents/teams |
| **MCP support** | First-class | None | Via `experimental_createMCPClient` | Community plugins |
| **Sessions / persistence** | First-class | None | None | Memory primitives |
| **Provider lock-in** | Anthropic-only | Anthropic-only | Multi-provider | Multi-provider |
| **Best for** | Code-touching agents, dev tools, automations that read/write files | Single-shot Claude calls, custom orchestration | Streaming chat UIs, multi-provider apps | Heavy chain composition, RAG-first apps |

The Agent SDK's distinctive shape is "agent harness as a library." If your work resembles what Claude Code does — read a codebase, edit files, run tests, iterate — the SDK is built for that exact loop and you will fight it less than any general-purpose agent framework.

If you need provider-agnostic streaming chat, the [Vercel AI SDK](/ai-development/ai-sdk) is the better fit. If you just need to call Claude with messages and tools, the [Claude API integration](/ai-development/claude-api-integration) reference covers that path.

## When to reach for it

- You are building developer tooling that reads or writes code: review bots, refactoring agents, test generators, migration helpers.
- You need an autonomous agent that runs for many turns, calls many tools, and survives across sessions.
- You want the Claude Code feature set (subagents, hooks, permission gating, MCP) without rebuilding it.
- You are comfortable being Claude-only — the SDK does not abstract away the model.

## When to skip it

- You only need a single Claude response (use `@anthropic-ai/sdk`).
- You need to swap providers (use Vercel AI SDK or call through Vercel AI Gateway).
- You need a chat UI on the web with streaming — wire that up with the AI SDK and call the Agent SDK only for the agent portions where its built-ins help.

## Further reading

- [Claude Code overview](https://code.claude.com/docs/en/overview) (Anthropic's official docs hub for Claude Code and the Agent SDK)
- [TypeScript repo](https://github.com/anthropics/claude-agent-sdk-typescript)
- [Python repo](https://github.com/anthropics/claude-agent-sdk-python)
- [@anthropic-ai/claude-agent-sdk on npm](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)
- [claude-agent-sdk on PyPI](https://pypi.org/project/claude-agent-sdk/)

Related references on this site: [Claude Code](/ai-development/claude-code), [Claude API Integration](/ai-development/claude-api-integration), [Claude Managed Agents](/ai-development/claude-managed-agents), [Claude Prompt Engineering](/ai-development/claude-prompt-engineering), [Building Harnesses for Agents](/ai-development/building-harnesses-for-agents), [MCP — Model Context Protocol](/ai-development/mcp-model-context-protocol).
