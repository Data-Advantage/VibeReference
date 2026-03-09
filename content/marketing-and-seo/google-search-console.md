# Google Search Console

Google Search Console (GSC) is a free tool from Google that helps you monitor, maintain, and troubleshoot your website's presence in Google Search results. It shows you which queries bring users to your site, how your pages are indexed, and alerts you to issues that might affect your search performance.

## Why Use Google Search Console?

- **Search performance data**: See which keywords drive traffic to your site
- **Indexing status**: Know which pages Google has indexed and which have problems
- **Mobile usability**: Identify pages with mobile-friendly issues
- **Core Web Vitals**: Monitor page speed and user experience metrics
- **Sitemap management**: Submit and track your XML sitemaps
- **Security alerts**: Get notified about malware or hacking issues

## Getting Started

### 1. Verify Your Domain

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership via DNS record, HTML file upload, or meta tag

### 2. Submit Your Sitemap

For Next.js applications, generate a sitemap and submit it:

```
https://yoursite.com/sitemap.xml
```

In Next.js, create a sitemap using the `app/sitemap.ts` convention:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://yoursite.com', lastModified: new Date() },
    { url: 'https://yoursite.com/about', lastModified: new Date() },
    // Add all your pages here
  ];
}
```

## Key Reports

| Report | What It Shows |
|--------|--------------|
| Performance | Search queries, clicks, impressions, CTR, and position |
| Coverage | Which pages are indexed and which have errors |
| Core Web Vitals | LCP, FID/INP, and CLS metrics for your pages |
| Mobile Usability | Pages with mobile rendering issues |
| Links | Internal and external links to your site |

## Best Practices

- Check the Performance report weekly to track keyword rankings
- Fix all Coverage errors to ensure your pages can be found
- Monitor Core Web Vitals and optimize pages that fail
- Use the URL Inspection tool to debug specific page issues
- Submit new sitemaps after adding significant content

## Resources

- [Google Search Console](https://search.google.com/search-console)
- [Search Console Help Center](https://support.google.com/webmasters)
- [Next.js SEO Guide](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
