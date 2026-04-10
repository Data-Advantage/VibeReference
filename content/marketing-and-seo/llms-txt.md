# llms.txt

llms.txt is a Markdown file placed at the root of a website (e.g., `example.com/llms.txt`) that provides structured, machine-readable information about the site for large language models. It's the equivalent of robots.txt for AI — instead of telling search engine crawlers where they can go, it tells AI models what your site is about and where to find the most important content.

## Why llms.txt Exists

AI answer engines like Perplexity, ChatGPT, Google AI Overviews, and Claude don't read websites the way humans do. They parse HTML, strip out navigation and ads, and try to extract meaning. This is slow, lossy, and error-prone.

llms.txt gives AI models a clean, structured entry point:

```
Without llms.txt:
  AI crawler → Parse HTML → Strip navigation → Guess structure → Maybe find relevant content

With llms.txt:
  AI crawler → Read llms.txt → Understand site purpose → Follow links to key pages
```

The result: AI models understand your site faster, cite your content more accurately, and are less likely to hallucinate about your product.

## Specification

The llms.txt file follows a specific Markdown structure designed to be both human-readable and programmatically parseable:

### Required Elements
- **H1 heading**: Your site or project name
- **Blockquote**: A one-to-two sentence summary of what the site does

### Optional Elements
- **Body paragraphs**: Additional context about the site, usage guidelines, or key information
- **H2 sections**: Categorized lists of important URLs with descriptions

### Format Rules
- Plain Markdown (UTF-8 encoded)
- Keep it under 10KB — concise is better
- Links should point to clean Markdown versions of pages when available (`.md` extension)
- List links alphabetically or by logical priority within each section

## Example

```markdown
# Acme Developer Platform

> Acme provides APIs and SDKs for building payment processing into web and mobile applications.

We serve developers building e-commerce, SaaS, and marketplace applications. Our APIs handle payments, subscriptions, invoicing, and payouts in 135 currencies.

## Documentation
- [API Reference](https://acme.dev/docs/api.md): Complete REST API documentation with request/response examples
- [Getting Started Guide](https://acme.dev/docs/quickstart.md): Set up your first payment flow in 10 minutes
- [SDKs](https://acme.dev/docs/sdks.md): Official libraries for Node.js, Python, Ruby, Go, and Java
- [Webhooks](https://acme.dev/docs/webhooks.md): Event-driven integration for payment status updates

## Guides
- [Subscription Billing](https://acme.dev/guides/subscriptions.md): Recurring payments, trials, and plan changes
- [Marketplace Payouts](https://acme.dev/guides/payouts.md): Split payments and vendor disbursement
- [PCI Compliance](https://acme.dev/guides/pci.md): Security requirements and how Acme handles them

## Product
- [Pricing](https://acme.dev/pricing): Transaction fees and volume discounts
- [Changelog](https://acme.dev/changelog.md): Recent API changes and new features
- [Status](https://status.acme.dev): Current API uptime and incident history
```

## llms.txt vs llms-full.txt

The standard defines two files with different purposes:

| File | Purpose | Content | Size |
|------|---------|---------|------|
| **llms.txt** | Quick overview for AI models | Curated links to the most important pages | Under 10KB |
| **llms-full.txt** | Comprehensive index | Every page on the site, organized by section | Can be larger |

Use `llms.txt` as the entry point AI models read first. Use `llms-full.txt` as the exhaustive reference when the model needs to find a specific page.

Most sites should start with just `llms.txt`. Add `llms-full.txt` once you have enough content that the curated version can't cover everything.

## How AI Answer Engines Use It

When an AI model encounters a query about your product or domain:

1. **Discovery**: The model (or its crawler) checks `example.com/llms.txt`
2. **Context**: It reads the summary and section descriptions to understand what your site covers
3. **Retrieval**: It follows links to specific pages that are relevant to the user's query
4. **Citation**: It cites your content in its answer, linking back to the source page

Sites with llms.txt get cited more accurately because the AI model has a reliable map of your content. Without it, the model is guessing which page to cite — and it often guesses wrong.

## llms.txt and SEO/AEO/GEO

llms.txt sits at the intersection of three optimization disciplines:

### SEO (Search Engine Optimization)
Traditional search engines still index your HTML. llms.txt doesn't replace your sitemap.xml or meta tags — it supplements them for AI-powered search features like Google AI Overviews.

### AEO (Answer Engine Optimization)
AI answer engines (Perplexity, ChatGPT Search) use llms.txt to quickly understand what your site offers. Clear structure and specific descriptions make your content more likely to be selected as an answer source.

### GEO (Generative Engine Optimization)
When AI models generate responses that reference your domain, llms.txt helps them represent your product accurately. This reduces hallucinations and ensures the generated content reflects what you actually do.

**The combined strategy:**
```
sitemap.xml → Traditional search crawlers
robots.txt  → Crawler access rules
schema.org  → Structured data for rich results
llms.txt    → AI model content map
```

## Implementation

### Static Sites (Next.js, Astro, etc.)
Place `llms.txt` in your `public/` directory:
```
public/
├── llms.txt
├── llms-full.txt    (optional)
├── robots.txt
├── sitemap.xml
└── favicon.ico
```

### Dynamic Generation
For sites with frequently changing content, generate llms.txt from your content database or CMS:

```typescript
// app/llms.txt/route.ts (Next.js App Router)
import { getAllPages } from '@/lib/content';

export async function GET() {
  const pages = await getAllPages();
  
  const docs = pages
    .filter(p => p.category === 'docs')
    .map(p => `- [${p.title}](${p.url}): ${p.description}`)
    .join('\n');

  const guides = pages
    .filter(p => p.category === 'guides')
    .map(p => `- [${p.title}](${p.url}): ${p.description}`)
    .join('\n');

  const content = `# My Product

> One-sentence description of what your product does.

## Documentation
${docs}

## Guides
${guides}
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
```

### Documentation Platforms
Several documentation tools generate llms.txt automatically:
- **Mintlify**: Auto-generates from your docs structure
- **Docusaurus**: Available via plugins
- **ReadMe**: Built-in support

## Best Practices

### Do
- **Keep it focused**: Include only your most important pages, not every blog post
- **Write clear descriptions**: Each link should have a one-line description that tells the AI what it will find
- **Link to Markdown versions**: If you serve `.md` versions of pages, link to those — they're cleaner for AI to parse
- **Update regularly**: When you add or remove major content, update llms.txt
- **Test with AI**: Ask ChatGPT or Claude about your product and see if they cite the right pages

### Don't
- **Don't stuff keywords**: AI models aren't fooled by keyword stuffing. Write naturally.
- **Don't include every page**: That's what llms-full.txt is for
- **Don't include content the AI shouldn't reference**: If a page has outdated information, leave it out
- **Don't forget to link the Markdown versions**: HTML versions work but are noisier for AI parsing

## Measuring Impact

Track whether llms.txt is working:

1. **Check AI citations**: Ask AI models about your product periodically. Are they citing the right pages?
2. **Monitor crawler access**: Check your server logs for requests to `/llms.txt` — AI crawlers will hit it
3. **Track referral traffic**: Some AI answer engines link to sources. Monitor traffic from Perplexity, ChatGPT, etc.
4. **Compare accuracy**: Before and after adding llms.txt, ask AI models the same questions about your product. Accuracy should improve.

## How It's Used in VibeReference

llms.txt is part of the visibility strategy for any SaaS application built with the VibeReference approach. As AI answer engines become a primary way users discover products, having a clean, structured llms.txt ensures your product is represented accurately when AI models discuss your category. It's a small file with outsized impact on how AI understands and recommends your product.
