# Schema Markup

**Schema markup** is structured data you embed on a page to describe what the page is about in a way search engines and AI models can read directly. It's the difference between "Google reads your HTML and guesses" and "Google reads a machine-structured fact sheet you handed it."

For a SaaS site in 2026, schema markup is not a nice-to-have. Pages with valid schema are substantially more likely to surface in Google's AI Overviews, featured snippets, and the AI-powered answers that increasingly sit above the classic ten blue links. If you're investing in [SEO](./seo) or [answer engine optimization](./answer-engine-optimization), schema is table stakes.

## What Schema.org Actually Is

[Schema.org](https://schema.org) is a shared vocabulary — a big library of types (`Product`, `Article`, `FAQPage`, `Organization`) and properties (`name`, `price`, `author`, `datePublished`) — maintained jointly by Google, Microsoft, Yahoo, and Yandex. As of 2024, over 45 million web domains use Schema.org markup across more than 450 billion objects.

You don't use all of Schema.org. You pick the types that describe your pages and fill in the properties that are true.

The vocabulary is the *what*. Structured data formats (JSON-LD, Microdata, RDFa) are the *how* — three different syntaxes for embedding that vocabulary into an HTML page.

## Why Schema Matters More in 2026

Three shifts have made schema a first-tier SEO lever:

1. **AI search surfaces.** Google AI Overviews, ChatGPT Search, Perplexity, and Gemini all cite sources. They cite pages they understand. Clean schema is a strong signal for understanding.
2. **Entity-based ranking.** Google has moved from string matching to entity matching. Schema is how you tell Google "this page is about *this specific* product/person/company" with an unambiguous identifier.
3. **Rich result real estate.** Star ratings, FAQ expandables, HowTo steps, sitelinks — they all require schema to appear. Without it, your listing is plain text while competitors show up with stars and dropdowns.

Teams that treat schema as "we'll add it later" lose share slowly, then fast.

## The High-Value Schema Types for SaaS

Not all schema types are worth your time. For a SaaS marketing site, these are the ones that return signal:

| Schema Type | Use On | Why It Matters |
|-------------|--------|----------------|
| **Organization** | Homepage, about page | Defines your entity. Links logo, socialMedia, sameAs — the core of how AI models learn who you are. |
| **SoftwareApplication** (or **Product**) | Product pages, pricing page | Describes the software itself. Enables price, offers, aggregateRating in results. |
| **WebSite** | Every page (in `@graph`) | Enables sitelinks search box and connects pages into a coherent entity graph. |
| **BreadcrumbList** | Any deep page | Replaces the URL in search results with a breadcrumb trail — higher click-through. |
| **FAQPage** | Landing pages, docs, pricing page | Powers the expandable Q&A snippet. Still visible on Google for non-YMYL sites. |
| **HowTo** | Tutorials, guides | Powers step-by-step rich results and gets cited verbatim by AI answer engines. |
| **Article** / **BlogPosting** | Blog content | Enables top-stories carousel, author carousel; links content to entity. |
| **Review** / **AggregateRating** | Pages with genuine user reviews | Star ratings in results. Must reflect actually-visible reviews on the page. |
| **VideoObject** | Pages with embedded video | Video snippet thumbnails; supplies transcript and duration to crawlers. |
| **Person** | Author bios | Links content to identifiable authors — a growing E-E-A-T signal. |

Pick the 3-4 types that apply to your pages and implement them well. A focused, correct schema stack beats a sprawling, messy one.

## JSON-LD vs. Microdata vs. RDFa

There are three formats for embedding schema. In 2026 the answer is uncomplicated: **use JSON-LD**.

| Format | How It Looks | Verdict |
|--------|--------------|---------|
| **JSON-LD** | Separate `<script type="application/ld+json">` block in the `<head>` | Google's explicit recommendation. Cleanest to maintain. Easy to generate server-side or inject via tag manager. **Use this.** |
| **Microdata** | Inline `itemprop`/`itemtype` attributes on HTML elements | Legacy. Works but ties your schema to your DOM. Hard to maintain. |
| **RDFa** | Inline `property`/`typeof` attributes using RDFa syntax | Rare. Alternative to Microdata with similar drawbacks. |

JSON-LD wins because the schema lives independent of your HTML. You can regenerate it, update it, lint it, and test it without touching page templates. Every modern CMS, static site generator, and React/Next.js/Astro framework emits JSON-LD natively.

## A Working Homepage Example

Here's a clean `@graph` pattern for a SaaS homepage. It defines three connected entities — the organization, the website, and the current webpage — and links them with `@id` references so Google can stitch the full picture together.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://acme.com/#organization",
      "name": "Acme SaaS",
      "url": "https://acme.com",
      "logo": "https://acme.com/logo.png",
      "sameAs": [
        "https://www.linkedin.com/company/acme",
        "https://twitter.com/acmesaas",
        "https://github.com/acme"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://acme.com/#website",
      "url": "https://acme.com",
      "name": "Acme SaaS",
      "publisher": { "@id": "https://acme.com/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://acme.com/#webpage",
      "url": "https://acme.com",
      "name": "Acme SaaS — Ship faster",
      "isPartOf": { "@id": "https://acme.com/#website" },
      "about": { "@id": "https://acme.com/#organization" }
    }
  ]
}
</script>
```

The `@graph` container keeps everything in one JSON-LD block. The `@id` references do the work — Google reads this as "one entity, the company, that owns one website, that contains this webpage." Each property you add (offers, aggregateRating, FAQ) slots into the same graph.

## Schema and the AI Search Layer

The AEO and GEO ([generative engine optimization](./generative-engine-optimization)) angle has changed how teams think about schema:

- **AI citations are easier to earn with schema.** When an AI model summarizes an answer, it pulls from pages it can parse unambiguously. Clean schema reduces ambiguity.
- **Entity linking matters.** Use `sameAs` to point to your Wikidata ID, LinkedIn, GitHub, Crunchbase — authoritative knowledge bases. AI models use these links to resolve "Acme" as *your* Acme, not a different company by the same name.
- **`mentions` and `about` properties** are underused. They tell AI models which entities a page discusses. On a blog post, `about` names the primary topic; `mentions` lists secondary entities. Both help AI models cite you for the right queries.

The short version: schema was originally about rich snippets. Now it's also about being the source an AI model picks when answering a user's question.

## Validation: Don't Ship Blind

Three tools cover the full validation surface:

- **[Google Rich Results Test](https://search.google.com/test/rich-results)** — tells you whether a page qualifies for specific rich result features (FAQ, HowTo, Product, etc.).
- **[Schema Markup Validator](https://validator.schema.org)** — the generic validator from Schema.org. Catches invalid types and properties that Rich Results Test ignores because they don't map to rich results.
- **Google Search Console → Enhancements** — the production view. Shows which schema features Google actually detects on your live site and flags errors at scale.

Ship nothing without running the Rich Results Test on a representative page first. Add the Schema Markup Validator to your CI pipeline if schema correctness is business-critical.

## Common Mistakes

- **Content parity violations.** If your schema lists a rating, price, or FAQ item that isn't visibly on the page, Google flags it as "spammy structured data." Every schema property must map to something a user can actually see on the rendered page. This is the #1 cause of manual penalties on structured data.
- **Stale schema.** A `Product` schema with yesterday's price, or an `Offer` with an expired `validUntil` date, silently stops qualifying for rich results. Generate schema from your source of truth (database, CMS, pricing API), not from hand-written templates.
- **Using Microdata or RDFa on new builds.** You're opting into a harder-to-maintain format for no benefit. JSON-LD.
- **Broken `@graph`.** Disconnected nodes (Organization without a matching `@id` referenced by WebSite) break entity stitching. Google sees three separate things instead of one linked entity.
- **Schema on non-indexable pages.** Schema on a noindexed page is wasted effort. Prioritize schema on pages you actually want ranking.
- **Overstuffing.** Marking up every element as `Thing` with vague properties. Schema works when it's specific. Prefer 3 well-implemented types over 10 poorly-implemented ones.

## Implementing Schema in Your Stack

Most modern stacks have first-class schema support:

- **Next.js / React** — Generate JSON-LD in `layout.tsx` or per-page metadata; render inside a `<Script>` tag with `type="application/ld+json"`. Several libraries (`schema-dts`, `next-seo`) give you TypeScript types.
- **Astro / Eleventy / Hugo** — Write JSON-LD templates alongside your content templates; populate from frontmatter.
- **WordPress** — Yoast, Rank Math, and Schema Pro all emit JSON-LD automatically based on page type and your site settings.
- **Webflow / Framer / Squarespace** — Custom code embed in the page `<head>`; regenerate on content changes.

The pattern that scales: schema generated from data (product database, CMS, pricing source), not hand-written. Hand-written schema rots.

## Related Reading

- [SEO Fundamentals](./seo) — Where schema fits in the broader stack
- [Answer Engine Optimization](./answer-engine-optimization) — Why schema matters for AI-driven search
- [Generative Engine Optimization](./generative-engine-optimization) — Optimizing for LLM-powered search results
- [How AI Answer Engines Work](./how-ai-answer-engines-work) — The pipeline schema feeds into
- [Sitemap](./sitemap) — The other structured signal crawlers rely on
