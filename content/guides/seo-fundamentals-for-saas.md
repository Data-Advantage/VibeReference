---
title: "SEO Fundamentals for SaaS"
---

# SEO Fundamentals for SaaS

Technical SEO, meta tags, sitemaps, structured data, content strategy, and Google Search Console setup for your SaaS app.

## Why SEO Matters for SaaS

SEO is one of the few growth channels that compounds over time. A blog post you write today can drive traffic for years. For indie SaaS, organic search is often the most cost-effective acquisition channel.

## Technical SEO Basics

### Meta Tags in Next.js

Use the Metadata API in Next.js App Router:

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'MyApp — Tagline here',
    template: '%s | MyApp',
  },
  description: 'A one-sentence description of your product.',
  openGraph: {
    title: 'MyApp — Tagline here',
    description: 'A one-sentence description of your product.',
    url: 'https://myapp.com',
    siteName: 'MyApp',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyApp — Tagline here',
    description: 'A one-sentence description of your product.',
    images: ['/og-image.png'],
  },
}
```

For individual pages:

```typescript
// app/pricing/page.tsx
export const metadata: Metadata = {
  title: 'Pricing', // Renders as "Pricing | MyApp"
  description: 'Simple, transparent pricing. Start free, upgrade when ready.',
}
```

### Sitemap

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://myapp.com'

  const staticPages = [
    '', '/pricing', '/about', '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Add dynamic pages (blog posts, etc.)
  // const posts = await getBlogPosts()
  // const blogPages = posts.map(...)

  return [...staticPages]
}
```

### Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/settings/'],
    },
    sitemap: 'https://myapp.com/sitemap.xml',
  }
}
```

### Canonical URLs

Prevent duplicate content issues:

```typescript
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://myapp.com/pricing',
  },
}
```

## Structured Data

Help search engines understand your content with JSON-LD:

```typescript
// app/page.tsx
export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyApp',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Your product description.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page content */}
    </>
  )
}
```

Common schemas for SaaS:
- `SoftwareApplication` — for your product pages
- `FAQPage` — for FAQ sections (often shown as rich results)
- `Article` — for blog posts
- `Organization` — for your about page

## Content Strategy

### Pages Every SaaS Needs

| Page | SEO Purpose |
|------|-------------|
| Homepage | Brand keywords, product description |
| Features | Feature-specific keywords |
| Pricing | "product pricing" searches |
| Blog | Long-tail keywords, topical authority |
| Docs/Guides | Technical keywords, how-to queries |
| Use Cases | Industry/role-specific keywords |
| Alternatives | "competitor alternative" searches |
| Changelog | Freshness signals, product updates |

### Blog Content That Ranks

Focus on content types that attract your target audience:

1. **How-to guides** — "How to [solve problem your product addresses]"
2. **Comparison posts** — "Tool A vs Tool B for [use case]"
3. **List posts** — "Best [category] tools for [audience]"
4. **Problem-solution posts** — "[Common pain point] and how to fix it"

### Keyword Research (Free)

1. **Google Autocomplete** — Type your topic and see suggestions
2. **Google Search Console** — See what queries already bring impressions
3. **Also Asked** — Find related questions people search for
4. **Reddit/forums** — See how your audience describes their problems

## Google Search Console

### Setup

1. Go to search.google.com/search-console
2. Add your property (use the URL prefix method)
3. Verify ownership via DNS record or HTML file
4. Submit your sitemap URL

### Key Reports

- **Performance** — Which queries drive clicks, impressions, and your average position
- **Coverage** — Which pages are indexed and which have errors
- **Core Web Vitals** — Performance issues affecting rankings
- **Links** — External sites linking to you

### Actions After Setup

1. Submit your sitemap
2. Request indexing for your most important pages
3. Check for crawl errors weekly
4. Monitor Core Web Vitals monthly

## Performance & Core Web Vitals

Google uses page speed as a ranking signal. The three Core Web Vitals:

| Metric | What It Measures | Good Score |
|--------|-----------------|------------|
| **LCP** (Largest Contentful Paint) | Loading speed | < 2.5s |
| **FID** (First Input Delay) | Interactivity | < 100ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | < 0.1 |

Quick wins for Next.js:
- Use `next/image` for all images (automatic optimization)
- Use `next/font` for fonts (no layout shift)
- Minimize client-side JavaScript (prefer Server Components)
- Add `loading="lazy"` to below-fold images
- Avoid layout shifts from dynamic content

## Common SEO Mistakes

1. **No meta descriptions** — Every page needs a unique, compelling description (150-160 chars)
2. **Blocking pages with robots.txt** — Don't accidentally block your public pages
3. **Missing alt text on images** — Accessibility and SEO both benefit
4. **Duplicate content** — Use canonical URLs and avoid identical pages
5. **Ignoring mobile** — Google uses mobile-first indexing; test on small screens
6. **Slow pages** — Optimize images, minimize JavaScript, use CDN caching
