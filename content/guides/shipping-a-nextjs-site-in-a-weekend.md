# Shipping a Next.js Site in a Weekend with Vibe Coding

You can go from zero to a live, deployed Next.js site in a single weekend using AI coding tools. Not a toy — a real site with content, SEO, and a domain. This guide walks through the actual workflow used to build and ship multiple production sites, including content reference sites, SaaS dashboards, and AI-powered tools.

The honest version: AI handles about 80% of the work. The other 20% — architecture decisions, content strategy, domain setup, and deployment configuration — still needs a human with product sense. Here is what that looks like in practice.

### What has actually shipped this way

| Product | Type | Commits | Stack | Status |
|---------|------|---------|-------|--------|
| Pixola | SaaS (AI image generation) | 514 | Next.js 16, Convex, Clerk | Live, 6.5K visitors/mo |
| VibeReference | Content reference site | 363 | Next.js 15, static export | Live |
| LLMReference | LLM model directory | 186 | Next.js 16, static JSON | Live |
| VibeWeek | Content site | 15 | Next.js 16, static | Live |
| LaunchWeek | Content site | 24 | Next.js, static | Live |
| Flixola | SaaS (AI video) | ~50 | Next.js 16 (forked from Pixola) | In development |

The content sites (VibeReference, VibeWeek, LaunchWeek) each shipped in under a weekend. The SaaS products (Pixola, Flixola) took longer but used the same vibe coding workflow — the additional time went to authentication, database modeling, and credit systems, not the core UI and content.

## Before You Start

### What You Need

- **An AI coding tool**: Claude Code (CLI), Cursor (IDE), or GitHub Copilot. Claude Code is the most effective for full-project scaffolding because it reads your entire codebase and makes multi-file edits.
- **Node.js 18+** installed locally
- **A Vercel account** (free tier works fine for launch)
- **A domain name** (optional for day one, but you will want it)
- **A clear idea of what you are building**: Not a vague "something with AI" — a specific product with a specific user. Write it down in one sentence before you open your terminal.

### What Works Well for Weekend Projects

AI coding tools excel at certain types of projects:

| Works Great | Works OK | Still Hard |
|-------------|----------|------------|
| Content sites and reference directories | CRUD apps with auth | Real-time collaborative features |
| Landing pages and marketing sites | API integrations | Complex state management |
| Static generators with dynamic data | Form-heavy workflows | Payment flows with edge cases |
| Portfolio and showcase sites | Dashboard layouts | Multi-tenant architecture |

If your weekend project falls in the "Works Great" column, you can realistically ship by Sunday night.

## Saturday Morning: Scaffold and Structure

### Step 1: Initialize the Project

Start with the Next.js scaffolding prompt. Be specific about your stack choices upfront — changing frameworks mid-project wastes hours.

```
Create a new Next.js 15 project with App Router, TypeScript,
and Tailwind CSS. Use the src/ directory structure. Set up
the following pages:
- Home page with hero section and feature grid
- /about page
- /[category]/[topic] dynamic route for content pages

Use static generation where possible. No database needed yet.
```

AI tools generate a working scaffold in under a minute. The key is specifying App Router explicitly — some tools default to Pages Router, which creates migration headaches later.

### Step 2: Build the Layout

The global layout is the most leveraged piece of code in a Next.js site. Get it right early.

```
Create a responsive layout with:
- Header with logo text and navigation links
- Main content area with max-width container
- Footer with copyright and links
- Mobile hamburger menu

Use Tailwind CSS. No component library — keep it simple.
The design should be clean and minimal, similar to
documentation sites like MDN or Stripe Docs.
```

Reference an existing design you admire. "Similar to Stripe Docs" gives the AI a concrete target. "Make it look good" does not.

### Step 3: Set Up Content Infrastructure

For content sites, markdown files are the fastest path to launch. No CMS, no database, no API — just files in a directory that get rendered at build time.

```
Set up a content system:
- Markdown files in /content/ directory, organized by category
  subdirectories (e.g., /content/guides/, /content/tools/)
- Parse frontmatter with gray-matter
- Convert markdown to HTML with remark and remark-html
- Create a lib/content.ts that exports getAllTopics(),
  getTopicsByCategory(), and getTopicContent() functions
- Generate static pages at build time using generateStaticParams
```

This architecture scales to hundreds of pages with zero performance cost because everything is statically generated.

## Saturday Afternoon: Content and Components

### Step 4: Write Your First Content Pages

This is where the weekend project either becomes real or stays a scaffold. Write at least three to five content pages before touching any more code. Content drives every other decision — layout, navigation, SEO, and design.

Use AI to help draft content, but bring your own expertise. The best content for AI-assisted writing is:

- **Comparison tables**: AI can structure data you provide into clean comparison formats
- **How-to guides**: You outline the steps, AI fills in the detail and code examples
- **Reference pages**: AI excels at comprehensive feature lists with consistent formatting

The worst content for AI-assisted writing is opinion pieces, personal stories, and anything requiring original research. Use AI for structure, not for substance.

### Step 5: Build Page Components

With real content in place, you can now build the components that display it:

```
Create a topic page component that renders:
- Article title as h1
- Estimated reading time
- Rendered markdown content with proper heading hierarchy
- Table of contents sidebar generated from h2/h3 headings
- Previous/Next navigation links

Style the markdown content with Tailwind Typography plugin
(@tailwindcss/typography). Use the prose class.
```

### Step 6: Add Search

Even a small site benefits from search. For static sites, client-side search is fast and free:

```
Add a search bar to the header that filters topics by title
and description. Use a simple client-side filter — no search
API needed. Show results in a dropdown as the user types.
Debounce the input by 200ms.
```

## Saturday Evening: SEO and Meta

SEO is not optional for content sites — it is the distribution strategy. Set it up before you forget.

### Step 7: Metadata and Open Graph

```
Add metadata to every page:
- Dynamic page titles: "[Topic] | [Site Name]"
- Meta descriptions extracted from the first paragraph
  of each content page
- Open Graph tags (og:title, og:description, og:image)
- Canonical URLs
- A robots.txt that allows all crawlers
- A sitemap.xml generated from all content pages

Use Next.js Metadata API (generateMetadata function),
not manual head tags.
```

### Step 8: Structured Data

Add JSON-LD structured data for articles. This helps search engines understand your content and can earn rich snippets:

```
Add JSON-LD structured data to each content page:
- @type: Article
- headline, description, datePublished
- author with name
- publisher with name and logo

Place it in a script tag with type="application/ld+json"
in the page component.
```

## Sunday Morning: Polish and Deploy

### Step 9: Responsive Design Pass

AI-generated layouts often look fine on desktop but break on mobile. Do a manual check:

1. Open the site in Chrome DevTools responsive mode
2. Check every page at 375px width (iPhone SE)
3. Check at 768px (iPad)
4. Fix any overflow, text truncation, or navigation issues

Common problems AI introduces:
- Tables that overflow on mobile (fix: wrap in a scrollable container)
- Navigation menus that do not collapse properly
- Hero sections with fixed heights that clip text on small screens
- Grid layouts that do not stack on narrow viewports

### Step 10: Performance Check

Run a Lighthouse audit before deploying. Next.js static sites should score 90+ on all metrics without effort. If your score is lower, the usual culprits are:

- Unoptimized images (use `next/image` with proper width/height)
- Render-blocking CSS from component libraries
- Client-side JavaScript that should be server-rendered
- Missing font display swap on custom fonts

### Step 11: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time sets up the project)
vercel

# Deploy to production
vercel --prod
```

Vercel auto-detects Next.js and configures the build. The first deploy takes about two minutes. Every subsequent push to your main branch triggers an automatic redeploy.

### Step 12: Connect Your Domain

In the Vercel dashboard:
1. Go to your project Settings → Domains
2. Add your custom domain
3. Update your DNS records (Vercel provides the exact records)
4. Wait for SSL certificate provisioning (usually under 10 minutes)

## Sunday Afternoon: Launch Checklist

Before you share the URL, walk through this checklist:

- [ ] Every page loads without errors
- [ ] Navigation works on mobile
- [ ] Search returns relevant results
- [ ] Meta titles and descriptions appear correctly (check with browser dev tools)
- [ ] Open Graph tags work (test with a social media link preview tool)
- [ ] Sitemap.xml is accessible at yourdomain.com/sitemap.xml
- [ ] robots.txt is accessible at yourdomain.com/robots.txt
- [ ] Favicon is set
- [ ] 404 page exists and looks intentional
- [ ] No placeholder text or Lorem Ipsum anywhere
- [ ] Console is free of errors and warnings

## What AI Handles Well vs. What Still Needs You

After shipping multiple sites this way, the pattern is clear:

**AI handles well:**
- Project scaffolding and file structure
- Component creation and Tailwind styling
- Markdown processing pipelines
- SEO metadata implementation
- Responsive layout adjustments
- Repetitive content formatting

**You still need to handle:**
- Deciding what to build and for whom
- Content strategy — what topics, what depth, what angle
- Design taste — knowing when something looks right
- Domain and deployment configuration
- Quality review — AI misses edge cases you would catch by using your own site
- The launch decision — when it is good enough to ship

## Common Weekend Project Pitfalls

**Starting with auth and databases.** Unless your product requires users to log in on day one, skip authentication. Ship a static site first. Add auth when you have users who need it.

**Perfectionism on design.** A clean, minimal design ships faster than a polished one. Use Tailwind defaults. Avoid component libraries with complex theming. You can always improve the design after launch — you cannot improve a site that never shipped.

**Spending Sunday on features instead of content.** The number-one predictor of a content site's success is whether it has good content, not whether it has a dark mode toggle. Write content before features.

**Not deploying until everything is perfect.** Deploy on Saturday night with three pages. You will find bugs faster on a real URL than in localhost. Vercel preview deployments are free — use them.

## After the Weekend

A shipped site is a starting point, not a finished product. The Monday after launch:

1. Submit your sitemap to Google Search Console
2. Set up Vercel Analytics (free tier) for basic traffic data
3. Write three more content pages — search engines reward fresh content
4. Share the URL in one community where your target users hang out
5. Check your Core Web Vitals in Search Console after a few days of real traffic

The weekend gets you from zero to live. Everything after that is iteration.
