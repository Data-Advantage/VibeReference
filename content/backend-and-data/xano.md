# Xano

[Xano](https://www.xano.com/) is a no-code backend platform that lets you build a scalable API, database, and business logic layer entirely through a visual interface — no server code required. It's a common choice in vibe-coding stacks where the frontend is built in a no-code tool like WeWeb, FlutterFlow, or Bubble, and the backend needs to be equally code-free.

## What Is Xano?

Xano provides a complete backend stack without writing backend code:

- **Visual database** — PostgreSQL under the hood, managed through a spreadsheet-like UI
- **API builder** — Create REST endpoints with drag-and-drop function stacks
- **Business logic** — Conditionals, loops, transformations, and external API calls, all visual
- **File storage** — Upload, store, and serve files directly from your backend
- **Background tasks** — Scheduled jobs and async processing without a separate job runner
- **Real-time** — WebSocket channels for live data

Production example: [Xano's customer showcase](https://www.xano.com/customers/) lists production apps across SaaS, marketplaces, and mobile — many paired with WeWeb or FlutterFlow frontends.

## Key Features

### Visual API Builder

Each API endpoint in Xano is built as a function stack — a sequence of steps that run in order. Steps include database queries, conditionals, loops, variable assignments, and calls to external APIs.

```
POST /api/create-order
  1. Get input (user_id, items[])
  2. Query: get user by user_id
  3. Conditional: if user.subscription == 'free' AND items.length > 5 → return error
  4. Loop: for each item → query inventory table
  5. Database: insert order record
  6. Database: insert order_items records (batch)
  7. External API: POST to Stripe to capture payment
  8. Return: { order_id, status: "created" }
```

No code — each step is a visual block with configuration fields.

### Database

Xano's database is PostgreSQL with a visual schema editor. You define tables, field types, and relationships (one-to-many, many-to-many) through the UI. Xano auto-generates the underlying SQL and provides querying tools built into the function stack.

Supported field types include text, integer, decimal, boolean, timestamp, JSON, file reference, and geo coordinates.

### External API Integration

Function stacks can call any external REST or GraphQL API. This is the primary way to integrate third-party services (Stripe, SendGrid, OpenAI, etc.) without writing backend code.

### Authentication

Xano has a built-in auth system with:
- Email/password sign-up and sign-in endpoints (auto-generated)
- JWT token issuance and validation
- Magic links
- OAuth support (Google, GitHub, etc.) via add-ons

You can use Xano's own auth or bring your own (e.g. Clerk), sending tokens to Xano for verification in secured endpoints.

### File Storage

File upload endpoints are generated automatically. Files are stored in Xano's managed storage and served via CDN. You get a public URL for each file and can attach metadata.

### Realtime (Channels)

Xano supports WebSocket channels for live data:
- Publish messages to a named channel from within a function stack
- Clients subscribe to channels from the frontend
- Useful for chat, live feeds, and collaborative features

## Setting Up Xano

### 1. Create Your Backend

Sign up at [xano.com](https://www.xano.com/) and create a workspace. Each workspace is a separate backend environment.

### 2. Define Your Database

Use the Table Editor to create tables and fields. Xano generates the REST API for standard CRUD operations automatically — you can customize or extend these endpoints as needed.

### 3. Build Custom Endpoints

In the API Builder, create a new endpoint. Select the HTTP method and path, then drag steps into the function stack. Use "Add Input" to define request parameters and "Add Response" to shape the output.

### 4. Connect to Your Frontend

Each Xano instance has a base API URL:

```
https://{your-instance}.xano.io/api:group-name
```

Call it from any frontend using standard `fetch` or an HTTP client:

```typescript
// Calling a Xano endpoint from Next.js
const response = await fetch(
  `${process.env.NEXT_PUBLIC_XANO_BASE_URL}/api:main/users`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const users = await response.json();
```

### 5. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_XANO_BASE_URL=https://your-instance.xano.io
```

Xano also supports staging and production environment branches so you can test changes before promoting to production.

## When to Use Xano

**Good fit:**
- Non-technical founders or designers who need a real backend, not Firebase
- No-code frontends (WeWeb, FlutterFlow, Bubble, Wized) that need a proper REST API
- Vibe-coded apps where you want to keep the whole stack visual
- Apps with moderate complexity: CRUD, auth, payments, file uploads, third-party integrations
- Teams that want to avoid server maintenance and DevOps

**Not a great fit:**
- Apps with heavy custom backend logic that genuinely needs code (complex algorithms, ML inference pipelines)
- Teams already comfortable with TypeScript backends who would rather use Convex, Supabase, or Next.js API routes
- Apps requiring sub-100ms latency for every request (Xano adds visual-layer overhead)
- Open-source or self-hosted requirements

## Pricing

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0/month | 10,000 API calls/month, 250 MB storage, 1 workspace |
| Launch | $29/month | 300,000 API calls/month, 10 GB storage, 1 workspace |
| Scale | $99/month | 1M API calls/month, 25 GB storage, 2 workspaces |
| Business | $249/month | 5M API calls/month, 100 GB storage, custom workspaces |
| Enterprise | Custom | Dedicated infrastructure, SLAs, private cloud |

See current pricing at [xano.com/pricing](https://www.xano.com/pricing).

## Xano in the Vibe-Coding Stack

| Layer | Tool |
|-------|------|
| Auth | **Xano Auth** or Clerk |
| Database + API | **Xano** |
| File Storage | **Xano Storage** or Cloudflare R2 |
| AI Integration | Xano function stack → OpenAI / Anthropic |
| Frontend | WeWeb / FlutterFlow / Next.js App Router |
| Hosting | Xano-managed (backend) + Vercel (Next.js frontend) |

Xano replaces the need for a separate database, ORM, API server, and job runner. For teams building on no-code frontends, it's often the only backend tool needed.

## Resources

- [Xano Documentation](https://docs.xano.com/)
- [Xano Academy](https://www.xano.com/academy/) — structured video courses
- [Xano Marketplace](https://www.xano.com/marketplace/) — pre-built templates and add-ons
- [Xano + WeWeb integration](https://docs.xano.com/weweb-xano-integration)
- [Xano Community Forum](https://community.xano.com/)
- [Xano YouTube channel](https://www.youtube.com/@xano_co)
