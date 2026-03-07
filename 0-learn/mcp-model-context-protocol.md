# MCP (Model Context Protocol)

Model Context Protocol (MCP) is an open standard created by Anthropic that enables AI models to securely connect to external data sources and tools. It provides a standardized way for AI agents to access files, databases, APIs, and other systems — turning language models from isolated text generators into connected agents that can interact with the real world.

## Why MCP Exists

Before MCP, every AI tool integration was custom-built. If you wanted Claude to access your database, you wrote custom code. If you wanted it to read GitHub issues, you wrote different custom code. MCP standardizes this with a common protocol, similar to how USB standardized hardware connections.

```
Before MCP:          After MCP:
AI ←→ Custom API 1   AI ←→ MCP ←→ Any MCP Server
AI ←→ Custom API 2         ├── Database
AI ←→ Custom API 3         ├── GitHub
AI ←→ Custom API 4         ├── Slack
                           ├── File System
                           └── Any tool
```

## Core Concepts

### MCP Servers
Programs that expose data and functionality through the MCP protocol. Each server provides:
- **Resources**: Data the AI can read (files, database records, API responses)
- **Tools**: Actions the AI can perform (create file, run query, send message)
- **Prompts**: Reusable prompt templates for common tasks

### MCP Clients
Applications that connect to MCP servers on behalf of the AI. Examples:
- Claude Desktop
- Claude Code
- Cursor
- Any application implementing the MCP client spec

### Transport
MCP supports multiple transport mechanisms:
- **stdio**: Local communication via standard input/output (most common)
- **HTTP with SSE**: Remote communication over HTTP with Server-Sent Events

## Popular MCP Servers

| Server | What It Does |
|--------|-------------|
| **Filesystem** | Read and write local files |
| **GitHub** | Manage repos, issues, PRs |
| **PostgreSQL** | Query and modify databases |
| **Slack** | Read and send messages |
| **Brave Search** | Web search capabilities |
| **Puppeteer** | Browser automation |
| **Memory** | Persistent knowledge storage |

## Setting Up MCP

### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

### Claude Code
Claude Code has built-in MCP support. Add servers in your project's `.mcp.json`:
```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```

## Building a Custom MCP Server

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "my-custom-server",
  version: "1.0.0",
});

// Add a tool
server.tool("get-weather", { city: z.string() }, async ({ city }) => {
  const weather = await fetchWeather(city);
  return { content: [{ type: "text", text: JSON.stringify(weather) }] };
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## MCP for SaaS Development

MCP is especially useful when building SaaS applications with AI agents:

- **Database access**: Let agents query your Supabase or Convex database directly
- **Deployment**: Give agents access to Vercel or Cloudflare deployment tools
- **Monitoring**: Let agents read error logs and performance metrics
- **Content management**: Allow agents to create and edit CMS content
- **Customer data**: Enable agents to look up user information for support workflows

## Security Considerations

- MCP servers run with the permissions of the user who started them
- Scope file system access to specific directories
- Use read-only database connections when possible
- Audit which tools are available to which agents
- Use environment variables for secrets — never hardcode tokens

## How It's Used in VibeReference

MCP enables the connected AI workflows that power the VibeReference approach. When building SaaS applications, founders can configure MCP servers to give AI agents direct access to their database, deployment platform, and monitoring tools. This eliminates manual copy-pasting of data between tools and lets agents work autonomously — reading from the database to understand data models, deploying changes to Vercel, and checking error logs when something breaks. MCP is the infrastructure layer that makes agentic coding practical for real-world applications.
