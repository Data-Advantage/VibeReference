# Next.js API Routes

Next.js API routes let you build backend API endpoints within your Next.js application. They run server-side and are ideal for handling form submissions, database queries, authentication, and AI model calls without needing a separate backend server.

## App Router API Routes

In Next.js 13+ with the App Router, API routes use the `route.ts` convention:

```typescript
// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello, world!' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

## Supported HTTP Methods

Export functions named after HTTP methods:

- `GET` — Read data
- `POST` — Create data
- `PUT` — Update data (full replacement)
- `PATCH` — Update data (partial)
- `DELETE` — Remove data

## Dynamic Routes

Use folder-based parameters:

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Fetch user by id
  return NextResponse.json({ userId: id });
}
```

## Common Patterns

### AI Chat Endpoint

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Protected Route with Auth Check

```typescript
// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ data: 'Secret data' });
}
```

## Configuration

### Max Duration

Set the maximum execution time for serverless functions:

```typescript
export const maxDuration = 30; // 30 seconds (default is 10 on Vercel)
```

### Runtime Selection

```typescript
export const runtime = 'edge'; // Use Edge Runtime for lower latency
// or
export const runtime = 'nodejs'; // Default Node.js runtime
```

## Best Practices

- Keep API routes focused on a single responsibility
- Validate request bodies with Zod or similar libraries
- Return appropriate HTTP status codes (200, 201, 400, 401, 404, 500)
- Use `maxDuration` for AI and long-running operations
- Never expose secrets — API routes run server-side, so environment variables are safe

## Resources

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/route)
