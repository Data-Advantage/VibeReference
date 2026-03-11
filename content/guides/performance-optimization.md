---
title: "Performance Optimization"
---

# Performance Optimization

Core Web Vitals, image optimization, lazy loading, caching strategies, and database query tuning for your SaaS app.

## Measuring Performance

Before optimizing, measure. Use these tools to identify real bottlenecks:

- **Vercel Analytics** — Real user metrics (Web Vitals) from production
- **Lighthouse** — Chrome DevTools > Lighthouse tab for lab metrics
- **PageSpeed Insights** — Google's tool combining lab and field data
- **Next.js Bundle Analyzer** — Visualize your JavaScript bundle size

### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | 2.5–4.0s | > 4.0s |
| FID / INP | < 100ms / 200ms | 100–300ms / 200-500ms | > 300ms / 500ms |
| CLS | < 0.1 | 0.1–0.25 | > 0.25 |

## Frontend Optimization

### Images

Images are usually the biggest performance bottleneck. Use `next/image`:

```tsx
import Image from 'next/image'

<Image
  src="/hero.png"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Only for above-the-fold images
/>
```

What `next/image` does for you:
- Serves modern formats (WebP/AVIF)
- Resizes to the correct dimensions
- Lazy loads by default
- Prevents Cumulative Layout Shift

For background images or CSS images, use the `<picture>` element with srcset or convert to `next/image`.

### Fonts

Use `next/font` to eliminate font loading layout shift:

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### JavaScript Bundle Size

Reduce the JavaScript you ship to browsers:

1. **Use Server Components** (default in Next.js App Router) — they send zero JS to the browser
2. **Dynamic imports** for heavy components:
   ```typescript
   import dynamic from 'next/dynamic'
   const Chart = dynamic(() => import('@/components/Chart'), { ssr: false })
   ```
3. **Analyze your bundle**:
   ```bash
   npm install @next/bundle-analyzer
   ANALYZE=true next build
   ```
4. **Avoid large dependencies** — Check bundlephobia.com before adding packages

### Minimizing Layout Shift

- Set explicit `width` and `height` on images and videos
- Use `next/font` instead of loading fonts from Google Fonts CDN
- Reserve space for dynamic content with min-height or aspect-ratio
- Avoid inserting content above existing content (like banners)

## Server & API Optimization

### Caching with Next.js

Next.js App Router has built-in caching layers:

**Static pages** (default for server components with no dynamic data):
```typescript
// This page is statically generated at build time
export default async function AboutPage() {
  return <div>About us</div>
}
```

**Revalidating pages** (fresh data at intervals):
```typescript
// Revalidate every 60 seconds
export const revalidate = 60

export default async function BlogPage() {
  const posts = await fetchPosts()
  return <PostList posts={posts} />
}
```

**Dynamic pages** (fresh data on every request):
```typescript
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const data = await fetchUserData()
  return <Dashboard data={data} />
}
```

### API Route Optimization

```typescript
// Set cache headers on API responses
export async function GET() {
  const data = await fetchData()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
```

## Database Optimization

### Query Performance

**Select only what you need:**
```typescript
// Bad — fetches all columns
const { data } = await supabase.from('posts').select('*')

// Good — fetches only needed columns
const { data } = await supabase.from('posts').select('id, title, created_at')
```

**Paginate all lists:**
```typescript
const { data } = await supabase
  .from('posts')
  .select('id, title')
  .order('created_at', { ascending: false })
  .range(0, 19) // First 20 items
```

**Use indexes** for frequently queried columns:
```sql
create index idx_posts_user_id on posts(user_id);
create index idx_posts_created_at on posts(created_at desc);
```

### Connection Pooling

For serverless environments (Vercel), use Supabase's connection pooler. In your Supabase project settings, use the "Session mode" connection string for standard queries and "Transaction mode" for serverless functions.

### N+1 Query Prevention

```typescript
// Bad — N+1: one query per post for the author
const posts = await getPosts()
for (const post of posts) {
  post.author = await getAuthor(post.author_id) // N additional queries
}

// Good — join in a single query
const { data } = await supabase
  .from('posts')
  .select('id, title, author:profiles(full_name, avatar_url)')
```

## Loading States & Perceived Performance

Even if your backend is fast, the UI should feel fast:

### Streaming with Suspense

```tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <AnalyticsChart />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}
```

The page shell renders immediately. Slow data loads stream in as it becomes ready.

### Skeleton Screens

Always show skeletons instead of spinners — they reduce perceived wait time:

```tsx
function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  )
}
```

## Performance Checklist

- [ ] All images use `next/image`
- [ ] Fonts use `next/font`
- [ ] Above-fold images have `priority` prop
- [ ] Heavy components use dynamic imports
- [ ] Server Components are used where possible
- [ ] Database queries select specific columns
- [ ] Lists are paginated
- [ ] Frequently queried columns are indexed
- [ ] API responses have appropriate cache headers
- [ ] Lighthouse score is 90+ on key pages
- [ ] Bundle size is monitored (no surprise large dependencies)
