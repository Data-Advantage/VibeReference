# Official MCP Servers by Vendor

Model Context Protocol (MCP) lets AI coding tools connect directly to the services you build with. Instead of describing your Cloudflare setup in a CLAUDE.md file, you give Claude or Cursor a live MCP connection — it can query your Workers, list your R2 buckets, and take actions directly.

The major infrastructure vendors are shipping official MCP servers. This guide covers what each one does, where to find it, and how to connect it to your AI coding environment.

## Quick reference

| Vendor | MCP Server | What it does |
|--------|------------|--------------|
| Cloudflare | [mcp-server-cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) | Manage Workers, R2, D1, KV, and more |
| Vercel | [mcp-on-vercel](https://github.com/vercel/mcp-on-vercel) | Deploy MCP servers on Vercel infrastructure |
| Stripe | [agent-toolkit](https://github.com/stripe/agent-toolkit) | Create charges, manage customers, handle subscriptions |
| Anthropic | Reference servers | Official MCP protocol reference implementations |

## Cloudflare

**Official:** Yes
**Repository:** [https://github.com/cloudflare/mcp-server-cloudflare](https://github.com/cloudflare/mcp-server-cloudflare)

Cloudflare's MCP server connects your AI coding environment to the full Cloudflare platform. With it connected, Claude can list your Workers, query D1 databases, manage R2 buckets, inspect KV namespaces, and deploy code — all without leaving the conversation.

**What it covers:**
- Workers (list, view, deploy)
- R2 object storage (list buckets, upload, delete objects)
- D1 SQL databases (execute queries, view schema)
- KV namespaces (read, write, list keys)
- Pages deployments
- DNS and routing

**Installation:**

```bash
# Install globally
npm install -g @cloudflare/mcp-server-cloudflare
```

**Claude Desktop config (`.claude/mcp.json` or `~/.claude/mcp.json`):**
```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["@cloudflare/mcp-server-cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-api-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

Get your API token from the [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) with Workers, R2, D1, and KV permissions.

## Vercel

**Official:** Yes
**Repository:** [https://github.com/vercel/mcp-on-vercel](https://github.com/vercel/mcp-on-vercel)

Vercel's `mcp-on-vercel` is a template and runtime for deploying MCP servers on Vercel's infrastructure. Rather than a standalone MCP server you connect locally, it is a pattern for building and hosting MCP servers as Vercel serverless functions.

**What it enables:**
- Deploy any MCP server as a Vercel Function
- HTTP transport instead of stdio (connects from anywhere, not just local)
- OAuth authentication support for multi-user MCP servers
- Share MCP servers across teams without local setup

**Use case:** If you are building a product that exposes an MCP interface (for example, a SaaS that lets customers connect their AI tool to your platform), `mcp-on-vercel` is the deployment pattern.

**Quick deploy:**
```bash
# Clone the template
git clone https://github.com/vercel/mcp-on-vercel
cd mcp-on-vercel

# Install and deploy
npm install
vercel deploy
```

## Stripe

**Official:** Yes
**Repository:** [https://github.com/stripe/agent-toolkit](https://github.com/stripe/agent-toolkit)

Stripe's Agent Toolkit is a multi-framework library for building AI agents that interact with Stripe. It ships with MCP support, letting Claude or any MCP client create charges, manage customers, handle subscriptions, and query payment data.

**What it covers:**
- Customer management (create, retrieve, update)
- Payment intents and charges
- Subscription creation and cancellation
- Invoice management
- Refunds
- Product and price management

**Installation:**

```bash
npm install @stripe/agent-toolkit
```

**MCP server setup:**
```typescript
import Stripe from "stripe";
import { StripeMCPServer } from "@stripe/agent-toolkit/mcp";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const server = new StripeMCPServer({ stripe });
server.start();
```

**Claude Desktop config:**
```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["./stripe-mcp-server.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_key"
      }
    }
  }
}
```

Use your test mode key during development (`sk_test_...`). Never expose live keys in config files.

## Reference MCP servers (Anthropic / Model Context Protocol)

**Official:** Yes
**Repository:** [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

Anthropic maintains the Model Context Protocol specification and a set of reference server implementations. These are not product-specific integrations — they are general-purpose servers that cover common developer needs.

**Available reference servers:**

| Server | Package | What it does |
|--------|---------|--------------|
| Filesystem | `@modelcontextprotocol/server-filesystem` | Read and write local files |
| GitHub | `@modelcontextprotocol/server-github` | Repos, issues, PRs, code search |
| PostgreSQL | `@modelcontextprotocol/server-postgres` | Query and modify databases |
| Slack | `@modelcontextprotocol/server-slack` | Read and send messages |
| Brave Search | `@modelcontextprotocol/server-brave-search` | Web search |
| Memory | `@modelcontextprotocol/server-memory` | Persistent knowledge storage |
| Puppeteer | `@modelcontextprotocol/server-puppeteer` | Browser automation |
| Fetch | `@modelcontextprotocol/server-fetch` | HTTP requests |

**Installation (any reference server):**

```bash
# These are installed on-demand via npx — no global install needed
npx -y @modelcontextprotocol/server-filesystem /path/to/project
```

**Claude Desktop config example (filesystem + GitHub):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token"
      }
    }
  }
}
```

## What's coming

The MCP ecosystem is growing quickly. Vendors with strong developer platforms are natural candidates for official MCP servers. Watch for official releases from:

- **Supabase** — database, auth, storage, and edge functions
- **Convex** — real-time backend functions and data
- **Prisma** — schema management and database migrations
- **Linear** — issue tracking and project management
- **Resend** — transactional email

**Community servers:** Beyond official vendor releases, the community has published hundreds of MCP servers. Browse them at the [MCP server registry](https://github.com/modelcontextprotocol/servers) and [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers).

## Setting up MCP in Claude Code

Claude Code uses `.mcp.json` in your project directory for project-level MCP servers:

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["@cloudflare/mcp-server-cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "${CLOUDFLARE_API_TOKEN}"
      }
    }
  }
}
```

Environment variable references (`${VAR_NAME}`) are resolved from your shell environment — keep secrets out of the config file itself.

## Keep reading

- [MCP (Model Context Protocol)](/ai-development/mcp-model-context-protocol) — How the protocol works and why it matters
- [Official Skills for Your Stack](/ai-development/vendor-claude-code-skills) — Claude Code skills and Cursor rules from major vendors
- [Official CLI Tools for Your Stack](/devops-and-tools/official-cli-tools) — Vercel CLI, Wrangler, Stripe CLI, and more
- [Claude Code Browser Access](/ai-development/claude-code-browser-access) — Browser automation with Claude Code
