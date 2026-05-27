# Article frontmatter template

Every article in `content/<category>/<slug>.md` MUST start with YAML frontmatter. The Next.js build (`lib/directory.ts`) parses it; missing or malformed frontmatter ships a broken page.

## Required fields

```md
---
title: "Article Title in Title Case"
description: "One-sentence SERP snippet that stands alone. 120–160 characters. No teaser language, no clickbait, no questions left dangling."
---
```

### `title`

- Title case. Match the H1 in the article body exactly.
- Quote it. YAML chokes on unescaped colons and apostrophes otherwise.
- No site name suffix (`| VibeReference` is added by the layout, do not bake it in).
- 50–65 characters is the SERP-safe range, but go longer if the topic genuinely needs it. Truncation in SERPs is a smaller penalty than a vague title.

### `description`

- 120–160 characters. Phase 2 CI ([DAT-4979](/DAT/issues/DAT-4979)) fails the build outside that range.
- Reads as a standalone snippet — the reader should understand what they will learn without seeing the title.
- Includes the primary SEO query naturally; do not stuff.
- No "Learn how to…" or "In this article we…" preambles. State the answer or the decision.

## Optional fields (use sparingly)

```md
---
title: "Article Title"
description: "SERP snippet."
lastReviewed: "2026-05-27"
canonical: "https://www.vibereference.com/ai-development/preferred-slug"
draft: false
---
```

### `lastReviewed` (Phase 4 — [DAT-4981](/DAT/issues/DAT-4981))

- `YYYY-MM-DD`. Set when the article is published and updated each time it is materially revised.
- Used by the freshness routine to surface stale articles for refresh.
- Do **not** set this until Phase 4 ships the freshness automation. Until then, leave it off.

### `canonical`

- Only if the article exists under two URLs and you want one to be authoritative. Almost never needed.
- Must be the absolute URL on `https://www.vibereference.com`.

### `draft`

- `draft: true` keeps the article out of the build. Use only for in-progress work that lives on a branch.
- Strip the field (or set `false`) before merging to `main`.

## Anti-patterns

| Don't | Do |
|-------|----|
| `description: "A guide to ..."` (preamble) | `description: "Direct answer to the question or decision."` |
| `description: "How do you choose ..."` (rhetorical) | `description: "Choose X when Y; choose Z when W."` |
| `title: Article Title` (unquoted) | `title: "Article Title"` |
| `title: "Article Title \| VibeReference"` | `title: "Article Title"` |
| Frontmatter as a comment | Frontmatter as the first lines of the file, no blank line above |

## Worked example

```md
---
title: "Should You Commit uv.lock to Your Git Repository?"
description: "Yes for applications, recommended for libraries. Here's what uv.lock contains, when it changes, and how to handle merge conflicts cleanly."
---

# Should You Commit uv.lock?

Yes. If your project uses `uv`, commit `uv.lock`. For applications it is non-negotiable...
```

Description above is 154 characters, includes the primary query ("commit uv.lock"), and reads as a standalone answer.
