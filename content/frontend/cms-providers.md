# Headless CMS Providers: Sanity, Contentful, Payload, Strapi, Hygraph, Storyblok, Notion, Markdown-in-Repo

[⬅️ Frontend Overview](../frontend/)

If you're building a SaaS marketing site or content-heavy product in 2026 and trying to pick where the content lives, this is the consolidated comparison. The CMS choice has long-tail consequences — content models calcify, editor habits set in, and migrating off a CMS in year 2 is real engineering work. Pick deliberately at week 1.

## TL;DR Decision Matrix

| CMS | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Sanity | Headless cloud, real-time | Customizable studio, GraphQL/GROQ, real-time editing | Free → $99/mo | Very high | Content-heavy SaaS marketing sites |
| Contentful | Headless cloud, mature | Enterprise reliability, broad ecosystem | Free → $300/mo | Medium | Mid-market with editorial teams |
| Payload | Open-source, self-hosted | TypeScript-native, code-first schemas, runs in your Next.js | Free / OSS | Very high | Devs who want CMS-as-a-library, not a vendor |
| Strapi | Open-source, self-hosted | Mature OSS, broad community | Free / OSS, $99+/mo Cloud | High | Teams wanting full control, polyglot stacks |
| Hygraph | Headless cloud, GraphQL-first | Federation, content APIs at scale | Free → $299+/mo | High | Multi-source content federation |
| Storyblok | Headless visual editor | Editor experience, visual page-building | Free → $189/mo | Medium | Marketing teams who want WYSIWYG |
| Markdown-in-repo | Static, git-tracked | Zero vendor, full git history, dev-friendly | Free | Very high | Dev-led products, doc-heavy sites |
| Notion | Notion-as-CMS | Repurposing existing docs as content | Free → $10/mo per user | Very high | Non-technical content teams |
| Webflow CMS | Visual page builder + CMS | Marketing-team-led full-site UX | $23/mo+ | Medium | Marketing teams wanting design control |
| WordPress (headless) | Mature CMS as a backend | Vast ecosystem, plugins, editor familiarity | Free / hosting | Low | Editorial teams already in WordPress |
| Astro Content Collections | Static, framework-native | Type-safe markdown in Astro projects | Free | Very high | Astro-built content sites |
| Decap CMS (Netlify CMS) | Git-based, free | Editor on top of git markdown | Free | High | Static sites with non-dev editors |

The first decision is **who edits the content**. Developers? Marketers? Mixed? Each has a best-in-class shape; pretending they're interchangeable produces friction for both sides.

## Decide the Editor Profile First

### Developer-only editing
Engineers write the content; non-technical people don't touch it. Marketing site copy, docs, blog posts written by founders.

Right tools:
- **Markdown-in-repo** — content lives in `.md` files committed to git, rendered by your framework
- **Astro Content Collections** — type-safe markdown with frontmatter validation
- **Payload (self-hosted)** — code-first schemas, but with an editor UI when needed
- **Decap CMS** — markdown + a light UI

For most indie SaaS in 2026 with a single founder doing all content, this is the right answer. Skip the vendor relationship until the team genuinely needs editor UX.

### Mixed (devs + occasional non-tech editors)
A founder writes most content, but a contractor or co-founder occasionally edits. Or a marketing site where the founder owns most of it but a freelancer adds blog posts.

Right tools:
- **Sanity** — devs design the schema, editors get a customizable studio
- **Payload (self-hosted)** — same shape, OSS
- **Notion-as-CMS** — repurposes existing docs as content via API
- **Decap CMS** — light UI on git markdown

Sanity and Payload are the two strongest defaults. Pick Sanity if you want zero hosting; pick Payload if you want OSS and self-host.

### Marketing-team-led editing
A dedicated content / marketing person owns the site day-to-day. They expect WYSIWYG, drag-and-drop, page templating, and not to wait for engineering.

Right tools:
- **Webflow CMS** — best-in-class for marketing teams
- **Storyblok** — visual editor with structured content
- **WordPress (headless)** — familiar editor UX
- **Contentful** — enterprise-grade, less editor-friendly than Storyblok

For most B2B SaaS in 2026 with a dedicated marketing person: Webflow or Storyblok. The friction reduction is real.

### Editorial / publication teams
Multiple writers, editors, schedules, multi-locale, complex workflows. You're running something more like a media business inside the SaaS site.

Right tools:
- **Contentful** — mature workflows, multi-locale, scale
- **Sanity** — also handles editorial teams well
- **Hygraph** — for federated multi-source content
- **WordPress (headless)** — if the team is already in WordPress

This category is rare for indie SaaS. Most don't need editorial-grade workflow.

## Provider Deep-Dives

### Sanity — Customizable Studio for Modern Teams
Sanity has become the indie B2B SaaS favorite for content-heavy marketing sites. The "studio" is a customizable React app you ship to your editors; the data lives in Sanity's hosted real-time database.

Strengths:
- Real-time collaborative editing (Figma-style for content)
- Highly customizable schema and editor UI
- GROQ query language is powerful (GraphQL also supported)
- Image transformation pipeline built in
- Free tier real (3 users, 10K documents)
- Strong Next.js / Astro / SvelteKit integrations

Weaknesses:
- Pricing scales with documents and bandwidth (can be expensive at scale)
- Studio customization requires React knowledge
- GROQ is unfamiliar to most devs initially

Default for: indie B2B SaaS marketing sites with custom content models.

### Contentful — Enterprise Headless
Contentful is the original headless CMS, mature and broad. Targets mid-market and enterprise editorial teams.

Strengths:
- Strongest workflow / multi-locale / approval features
- Mature ecosystem of integrations
- Reliable at scale
- Strong RBAC and team management

Weaknesses:
- Pricing starts steep ($300/mo for the Premium tier; the "Free" tier is genuinely tiny)
- Editor UI is dense, less friendly than Sanity/Storyblok
- Customization is constrained vs Sanity

Pick Contentful when: enterprise contracts demand it, or you're already on it.

### Payload — TypeScript-Native OSS
Payload (acquired by Figma in 2024) is the open-source TypeScript-native CMS. You install it as a package in your Next.js project; it runs in the same Node process. Schemas are TypeScript code, not click-through configs.

Strengths:
- TypeScript-native — schemas are types, validation is automatic
- OSS (MIT) — self-host with zero vendor cost
- Runs in your Next.js app — no separate service
- Excellent admin UI
- Strong with file uploads / media via [Vercel Blob](../cloud-and-hosting/vercel-blob.md) or S3-compatible
- Free Cloud tier available (acquired-and-still-OSS situation since the Figma acquisition)

Weaknesses:
- Self-hosting means you operate the database, the admin route, the file storage
- Smaller ecosystem than Sanity/Contentful
- Newer; schema migrations require care

Pick Payload when: TypeScript team, want OSS + self-host, value code-first schemas.

### Strapi — Mature OSS
Strapi has been the go-to OSS headless CMS for ~7 years. Battle-tested, broad community, mature plugin ecosystem.

Strengths:
- Mature, large community
- Plugins for almost everything
- Self-hostable; Strapi Cloud option exists
- REST + GraphQL out of the box
- Polyglot — works with any stack, not just Node

Weaknesses:
- Admin UI feels older than Sanity / Payload
- Some breaking changes between v3 → v4 → v5 burned community goodwill
- Self-hosting operational burden

Pick Strapi when: polyglot stack, want OSS, comfortable with the operational responsibility.

### Hygraph — GraphQL-First Federation
Hygraph (formerly GraphCMS) bets on GraphQL federation — combining content from multiple sources into a single content API.

Strengths:
- GraphQL-native
- Content federation (combine content from multiple Hygraph projects + external APIs)
- Good for multi-brand or multi-region setups
- Generous free tier

Weaknesses:
- Niche — federation is overkill for single-site SaaS
- Smaller community than Sanity/Contentful
- Learning curve for GraphQL-skeptical teams

Pick Hygraph when: multi-source content federation is genuinely the problem.

### Storyblok — Visual Editor for Marketers
Storyblok pairs structured content with a visual page builder. Editors see the page; click an element; edit in place.

Strengths:
- Best-in-class editor experience for non-technical editors
- Visual page-building with structured-content discipline (avoids "content soup")
- Strong Nuxt / Next / SvelteKit integrations
- Generous free tier

Weaknesses:
- Editor UI requires preview rendering; the dev setup is non-trivial
- Pricing past free scales with users

Pick Storyblok when: marketing-team-led, value editor UX, willing to invest in the visual-preview integration.

### Markdown-in-Repo
The simplest option. Content is `.md` files committed to git. Rendered at build time (SSG) or runtime by your framework.

Strengths:
- Zero vendor dependency
- Full git history (every content change is auditable, revertable)
- Dev-friendly (PRs for content changes, just like code)
- Works with every static framework
- Free forever
- Survives any future CMS migration trivially (migration TO another CMS is a script, migration AWAY is just keeping the files)

Weaknesses:
- Non-tech editors can't easily contribute (PRs are the only path; many won't)
- No structured content beyond what frontmatter provides
- No collaborative real-time editing
- Image management is manual (or via [Vercel Blob](../cloud-and-hosting/vercel-blob.md))

Pick Markdown-in-Repo when: dev-led product, founder-written content, value zero-vendor approach.

### Notion-as-CMS
Use Notion as the content database. Pull pages via the Notion API; render in your site.

Strengths:
- Editors already know Notion
- Zero learning curve for content team
- Free tier covers most indie needs
- Notion API + libraries (react-notion-x, notion-blocks) make rendering reasonable

Weaknesses:
- Notion's data model is loose (not strongly typed)
- API performance is mediocre; cache aggressively
- Notion can change the API shape, breaking your site
- Image / asset handling is awkward (Notion-hosted images expire)

Pick Notion-as-CMS when: content team is already deep in Notion, content is editorial (blog posts, docs), willing to live with the trade-offs.

### Webflow CMS — Marketing-Team Site Builder
Webflow includes a CMS as part of its visual site builder. Marketing teams build the entire site in Webflow without engineering.

Strengths:
- Marketing team owns the site end-to-end
- Strong design control
- Good for marketing-led organizations
- Decent SEO defaults

Weaknesses:
- Webflow as the entire site (not just CMS); harder to integrate into a Next.js app
- Custom code is constrained
- Pricing scales fast at higher tiers

Pick Webflow when: marketing-led organization, value design control, comfortable with Webflow as the framework.

### WordPress (Headless)
WordPress as the backend (admin), with a separate frontend (Next.js, Astro). The mature option for editor-heavy organizations.

Strengths:
- Familiar editor UX
- Vast plugin ecosystem
- Mature in every way

Weaknesses:
- Brings WordPress operational complexity (PHP, MySQL, plugins, security patches)
- Performance can be poor without careful caching
- Modern dev teams find the developer experience dated

Pick WordPress when: editorial team is already in WordPress, or specific plugins necessitate it.

### Astro Content Collections
For Astro-built content sites, Astro 4+'s Content Collections give you type-safe markdown with frontmatter validation built into the framework. Not a CMS in the vendor sense — a content management *primitive* in your code.

Pick when: building with Astro, content fits in markdown, value zero vendor.

### Decap CMS (formerly Netlify CMS)
Free, OSS, git-based CMS. Editors get a UI; commits land in your git repo as markdown.

Pick when: static site, want a light editor UI on top of git markdown, willing to operate the open-source tool.

## What None of Them Solve

- **Content strategy.** No CMS tells you what to write or for whom. Audience-aware content planning is upstream of CMS choice.
- **Image and asset workflow.** Most CMSs handle assets badly. Pair with [Vercel Blob](../cloud-and-hosting/vercel-blob.md) or Cloudinary for serious image management.
- **Performance.** A bad rendering pipeline (no caching, runtime API calls) destroys site performance regardless of CMS. Pre-render where possible.
- **SEO setup.** CMSs render content; SEO is a separate discipline (per [SEO Strategy](https://www.launchweek.ai/content/seo-strategy)). Don't expect the CMS to do SEO for you.
- **Migration.** Migrating between CMSs is real engineering work — schema mapping, content rewriting, URL preservation. Pick once, well.
- **Localization at scale.** Most CMSs support locales; multi-locale workflows are still manual at indie scale. Plan for 1-2 hours per locale per page.

## Pragmatic Stack Patterns

**Indie SaaS, dev-led, founder writes content**:
- Markdown in repo (free)
- Or Astro Content Collections if on Astro
- Image management: [Vercel Blob](../cloud-and-hosting/vercel-blob.md)
- Total: $0/mo

**Indie SaaS, mixed editors, content-heavy marketing site**:
- Sanity (free → $99/mo)
- Or Payload self-hosted (free)
- Image management: Sanity's pipeline OR Vercel Blob

**B2B SaaS with marketing-led site**:
- Webflow ($23-$49/mo)
- Or Storyblok with custom Next.js frontend ($0-$189/mo)

**Enterprise editorial team**:
- Contentful ($300+/mo)
- Or Sanity Enterprise

**Existing Notion-deep team**:
- Notion-as-CMS for blog / docs
- Markdown-in-repo for stable content

**Ship-everything-fast solo founder**:
- Markdown-in-repo (zero ceremony)
- Defer CMS decision until you have a contributor who needs UI access

## Decision Framework: Three Questions

1. **Who edits the content?** → Devs only: markdown-in-repo. Mixed: Sanity / Payload. Marketers: Webflow / Storyblok / WordPress. Editorial team: Contentful / Sanity.
2. **Are you OSS-first or willing to pay for hosted?** → OSS-first: Payload, Strapi, Markdown, Decap. Hosted: Sanity, Contentful, Hygraph, Storyblok.
3. **Is content shape simple (blog posts) or complex (custom modules, components, page-building)?** → Simple: any markdown solution. Complex: structured CMS like Sanity, Storyblok, Contentful.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **markdown-in-repo for the founder-written stage, then Sanity or Payload when a non-dev contributor joins.** Don't over-invest in CMS until the editor profile demands it.

## Verdict

For most readers building a SaaS in 2026:
- **Solo founder, dev-led**: Markdown-in-repo. Default. Free, fast, future-proof.
- **Indie SaaS with mixed editors**: Sanity (hosted) or Payload (self-hosted).
- **Marketing-led site**: Webflow or Storyblok.
- **Existing Notion team**: Notion-as-CMS for blog / docs.
- **Enterprise editorial team**: Contentful.
- **Astro project**: Content Collections for content; Sanity if you outgrow.

The hidden cost in CMS decisions is *content modeling* — the time spent designing schemas before any content lands. A well-modeled CMS pays back for years; a hacked-together one creates friction every week. Spend the day to model carefully.

## See Also

- [Web Frameworks](web-frameworks.md) — companion comparison for the rendering layer
- [Next.js](nextjs.md) — most-paired framework for headless CMS in 2026
- [React](react.md) — base layer for most CMS frontends
- [Markdown](../devops-and-tools/markdown.md) — for the markdown-in-repo path
- [Vercel Blob](../cloud-and-hosting/vercel-blob.md) — image and asset storage to pair
- [SEO Strategy](https://www.launchweek.ai/content/seo-strategy) — companion content strategy
- [Brand Voice](https://www.launchweek.ai/position/brand-voice) — what gets written into the CMS
- [Database Providers](../backend-and-data/database-providers.md) — application database (separate from CMS)

---

[⬅️ Frontend Overview](../frontend/)
