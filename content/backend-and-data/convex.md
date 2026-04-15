# Convex

[Convex](https://convex.dev/) is a full-stack backend platform that combines a reactive database, serverless functions, and real-time sync into a single TypeScript-native service. It replaces the need for a separate database, ORM, and API layer in most vibe-coded apps.

## What Is Convex?

Convex gives you a backend where:

- **Data is stored in a document database** with strong consistency and ACID transactions
- **Functions run as serverless queries and mutations** — TypeScript code that runs on Convex's infrastructure
- **Clients stay in sync automatically** — queries re-run reactively when data changes, no polling required
- **Auth, file storage, and scheduled jobs** are built in

Production example: [Pixola](https://pixola.ai) uses Convex for all user data, image metadata, and workflow state.

## Key Features

### Reactive Queries

Convex queries re-run automatically when the underlying data changes. Any component subscribing to a query gets a live update without WebSocket boilerplate.

```typescript
// convex/tasks.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
```

```typescript
// app/tasks/page.tsx
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TasksPage() {
  const tasks = useQuery(api.tasks.list, { userId: currentUserId });

  if (tasks === undefined) return <div>Loading...</div>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

### Mutations and Transactions

Mutations are ACID-transactional. You read and write in the same function with full consistency guarantees.

```typescript
// convex/tasks.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      userId: args.userId,
      status: "todo",
      createdAt: Date.now(),
    });
    return taskId;
  },
});
```

### Schema

Define your data model in `convex/schema.ts`. Convex validates documents against the schema at write time.

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    status: v.union(v.literal("todo"), v.literal("done")),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
});
```

### File Storage

Convex has built-in file storage. Generate upload URLs server-side, upload from the client, then store the storage ID in your document.

```typescript
// convex/files.ts
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveFile = mutation({
  args: { storageId: v.id("_storage"), userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.insert("files", {
      storageId: args.storageId,
      userId: args.userId,
      uploadedAt: Date.now(),
    });
  },
});
```

### Scheduled Functions

Run background jobs or cron tasks with Convex's built-in scheduler.

```typescript
// convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "cleanup expired sessions",
  { hourUTC: 2, minuteUTC: 0 },
  internal.sessions.cleanupExpired
);

export default crons;
```

## Auth with Clerk

Convex integrates with Clerk out of the box. Configure the JWT issuer in Convex and use `ctx.auth.getUserIdentity()` in any function to get the authenticated user.

```typescript
// convex/users.ts
import { mutation } from "./_generated/server";

export const upsertUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      name: identity.name,
    });
  },
});
```

## Setting Up Convex in Next.js

### 1. Install and Initialize

```bash
npm install convex
npx convex dev
```

This creates your `convex/` directory and connects to a new Convex project.

### 2. Provider Setup

```typescript
// app/providers.tsx
"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

```typescript
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

For production on Vercel, set the build command to:
```
npx convex deploy --cmd 'npm run build'
```

This deploys Convex functions and the Next.js app together.

## When to Use Convex

**Good fit:**
- Apps that need real-time updates (collaborative tools, live dashboards, social feeds)
- Full-stack TypeScript apps where you want one language end-to-end
- Vibe-coded apps where you want to skip writing API routes and ORMs
- Apps with complex background job requirements

**Not a great fit:**
- Apps already deeply invested in PostgreSQL and SQL queries
- Apps that need complex relational joins across many tables (Convex is document-oriented)
- Projects requiring self-hosted infrastructure

## Pricing

Convex uses a usage-based model:

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0/month | 1M function calls/month, 1 GB storage, 1 GB bandwidth |
| Pro | $25/month | 25M function calls, 50 GB storage, unlimited projects |
| Enterprise | Custom | Dedicated infrastructure, SLAs |

Most early-stage vibe-coded apps run comfortably on the free tier. Pro is suitable for production apps with active users.

See current pricing at [convex.dev/pricing](https://www.convex.dev/pricing).

## Convex in the Vibe-Coding Stack

| Layer | Tool |
|-------|------|
| Auth | Clerk |
| Database + API | **Convex** |
| File Storage | **Convex Storage** or Cloudflare R2 |
| AI Functions | Convex Actions → OpenAI / Anthropic |
| Frontend | Next.js App Router |
| Hosting | Vercel |

Convex replaces Supabase, Prisma, tRPC, and a custom API layer. For most vibe-coded apps, it's the fastest path from zero to a working backend.

## Related Articles

- [Convex Setup Workflow](./convex-setup-workflow) — step-by-step CLI setup for connecting v0 projects
- [Convex Diagnostics](./convex-diagnostics) — debugging connection and schema issues

## Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex + Next.js Quickstart](https://docs.convex.dev/quickstart/nextjs)
- [Convex + Clerk Integration](https://docs.convex.dev/auth/clerk)
- [Convex Schema Reference](https://docs.convex.dev/database/schemas)
- [Convex Discord Community](https://convex.dev/community)
