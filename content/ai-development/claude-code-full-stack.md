# Building Full-Stack Apps with Claude Code

Claude Code can build complete applications — frontend, backend, database, and deployment — through iterative natural language conversation in your terminal. Instead of switching between documentation tabs, Stack Overflow answers, and boilerplate generators, you describe what you want and Claude writes the code, runs the commands, and debugs the errors across your entire stack.

## Why Full-Stack Development with Claude Code Works

Traditional AI code assistants generate snippets in isolation. Claude Code operates differently: it has full context of your project, can read any file, run any command, and make changes across multiple files in a single turn. This means it can wire up a React component to an API endpoint to a database query in one conversation, keeping the types, imports, and data shapes consistent across layers.

## Starting a New Project

### Scaffolding from Scratch

Claude Code can bootstrap a project with your preferred stack. Be specific about your technology choices:

```
> Create a new Next.js 16 app with TypeScript, Tailwind CSS v4, and Prisma
  connected to a PostgreSQL database. Use the App Router. Set up the project
  structure with separate directories for components, lib, and API routes.
```

Claude runs the necessary `create-next-app` commands, installs dependencies, configures TypeScript and Tailwind, initializes Prisma, and sets up the directory structure.

### Working with an Existing Codebase

For existing projects, start by letting Claude understand what's already built:

```
> Read through this project and explain the architecture. What frameworks
  are we using, how is the code organized, and where are the main entry points?
```

This gives Claude the context it needs to make changes that fit your existing patterns rather than introducing inconsistencies.

## Building the Backend

### Database Schema and Migrations

Define your data model in conversation and let Claude write the schema:

```
> Add a Prisma schema for a SaaS app with users, organizations, and
  memberships. Users belong to organizations through memberships, which
  have a role field (admin, member, viewer). Add created/updated timestamps.
```

Claude writes the Prisma schema, then you can ask it to run the migration:

```
> Generate and run the Prisma migration for these schema changes
```

### API Endpoints

Build REST or tRPC endpoints by describing the behavior you need:

```
> Create an API route at /api/organizations that supports:
  - GET: list organizations the current user belongs to
  - POST: create a new organization (creator becomes admin)
  Include proper error handling, input validation with Zod, and
  authentication checks.
```

Claude writes the route handler, validation schemas, database queries, and error responses — all wired together.

### Authentication

Authentication is a common source of boilerplate. Let Claude handle the setup:

```
> Set up NextAuth.js with Google OAuth and email/password credentials.
  Store sessions in the database using the Prisma adapter. Create a
  middleware that protects all /api routes except /api/auth.
```

## Building the Frontend

### Components and Pages

Describe UI components by their behavior and appearance:

```
> Create a dashboard page at /dashboard that shows:
  - A header with the org name and a user avatar dropdown
  - A sidebar with navigation links
  - A main content area with a table of recent activity
  Use server components where possible, client components only for
  interactive parts.
```

### Forms and Client Interaction

For interactive features, Claude handles the client/server boundary:

```
> Build an organization settings form that lets admins update the org
  name and invite new members by email. Use React Hook Form with Zod
  validation. Show loading states and error messages. Submit via a
  server action.
```

### Connecting Frontend to Backend

Claude keeps data shapes consistent across the stack. When you build an API endpoint and then a component that consumes it, Claude ensures the TypeScript types match, the fetch calls use the correct URL, and the response handling covers error states.

```
> Create a members list component that fetches from /api/organizations/[id]/members
  and displays each member with their name, email, role, and a dropdown to
  change their role. Only show the role dropdown if the current user is an admin.
```

## Iterative Development Workflow

The most effective way to build with Claude Code is iteratively — build a small piece, test it, then build the next piece.

### The Build-Test-Fix Loop

1. **Describe the feature** — tell Claude what to build
2. **Review the plan** — use `/plan` for complex features
3. **Let Claude implement** — it writes code and runs commands
4. **Test it** — ask Claude to run tests or test manually
5. **Fix issues** — paste errors back to Claude for debugging

```
> Run the dev server and test the login flow. If anything breaks,
  fix it.
```

Claude starts the server, and if you report errors, it reads the logs, traces the issue, and applies fixes.

### Debugging Across the Stack

When something breaks, Claude can trace the issue from frontend to backend to database:

```
> The members list shows "undefined" for user names. Debug this — check
  the API response, the Prisma query, and the component rendering.
```

Claude reads the component code, checks the API route, inspects the Prisma query's `select` or `include` clauses, identifies the missing field, and fixes it.

## Deployment

Claude can help with deployment configuration for platforms like Vercel, Railway, or Fly.io:

```
> Set up this project for deployment on Vercel. Create the necessary
  configuration, set up environment variables for the database URL and
  auth secrets, and make sure the Prisma client is generated during build.
```

## Best Practices

**Use Plan Mode for multi-file features.** Before building anything that spans more than two or three files, enter `/plan` to align on the approach. This prevents Claude from making architectural decisions you'd want to override.

**Keep your CLAUDE.md updated.** As your project grows, add conventions to CLAUDE.md: "Use server actions instead of API routes for mutations", "All database queries go through the service layer in /lib/services", etc.

**Build vertically, not horizontally.** Instead of building all API endpoints first and then all components, build one complete feature at a time — endpoint, component, tests — so you catch integration issues early.

**Commit frequently.** After each working feature, ask Claude to commit. This gives you rollback points if a later change breaks something.

**Be explicit about error handling.** Claude defaults to reasonable error handling, but production apps need specific patterns. Tell Claude: "Return 422 for validation errors with field-level messages", "Show a toast notification on mutation errors", etc.

## Related Resources

- [Claude Code: Complete Getting Started Guide](../guides/claude-code-getting-started) — installation and basics
- [Claude API Integration Guide](./claude-api-integration) — working with the Claude API directly
- [Prompt Engineering for Claude](./claude-prompt-engineering) — writing better prompts for code generation
