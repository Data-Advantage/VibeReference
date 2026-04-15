# Article Authoring Guide

Quick reference for writing and formatting articles in the VibeReference content directory.

## See Also Links

Use clean paths — **no `.md` extension**:

```md
## See Also

- [AI Agents](./ai-agents) — what agents are and how they work
- [Coding Harnesses](./coding-harnesses) — how to build effective harnesses
```

**Not this:**
```md
- [AI Agents](./ai-agents.md)  ← broken URL on production
```

The remark pipeline (`lib/directory.ts`) automatically strips `.md` extensions as a safety net, but authors should use clean paths from the start to keep content readable and consistent.

## Inline Links

Same rule applies to inline links within paragraph text:

```md
An [AI agent](./ai-agents) is a system that operates autonomously in a loop.
```

## Required Frontmatter Fields

```md
---
title: "Article Title"
description: "SEO meta description (~155 chars)"
---
```

## Article Structure

1. `# H1 Title` — one per article, matches the filename slug
2. Lead paragraph — no heading, 1-2 sentences, answers the core question
3. `## H2 Sections` — main content sections
4. `## See Also` — cross-links at the bottom, use clean paths (no `.md`)
