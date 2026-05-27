# Article Authoring (VibeReference)

This file is the single entry point for anyone — agent or human — about to write an article for VibeReference.

The full playbook lives in [`skills/vibereference-article/`](./skills/vibereference-article/SKILL.md). This page is the short version: where to look for what, and the rules that get enforced.

## Where things live

```
ARTICLE-AUTHORING.md                                  ← you are here (the quick map)
skills/vibereference-article/
├── SKILL.md                                          ← canonical workflow, start here
├── templates/
│   ├── series-plan.md                                ← parent-issue plan doc
│   ├── article-spec.md                               ← single-article issue body
│   ├── deep-research-prompt.md                       ← parallel 4-tool research prompt
│   └── article-frontmatter.md                        ← required + optional frontmatter
└── references/
    ├── category-guide.md                             ← 11 categories, tone, audience, shape
    ├── style-guide.md                                ← voice, length, structure, tables, code
    └── self-review-checklist.md                      ← pre-merge gate, runs before in_review
```

## The five-stage workflow

1. **Plan** — fill in `templates/series-plan.md` on the parent issue (skip if it's a one-off in an existing cluster).
2. **Spec** — fill in `templates/article-spec.md` on the article issue. Title, URL, type, length, SEO targets, hook, takeaways, internal links.
3. **Research** — run the parallel 4-tool prompt from `templates/deep-research-prompt.md`. Paste raw outputs back as labeled comments.
4. **Draft** — write to `content/<category>/<slug>.md`. Frontmatter per `templates/article-frontmatter.md`. Structure and voice per `references/style-guide.md` and `references/category-guide.md`.
5. **Self-review** — walk `references/self-review-checklist.md` line by line before `in_review`.

## Non-negotiables

These are the rules that will be enforced by CI in Phase 2 ([DAT-4979](/DAT/issues/DAT-4979)) and by editorial review in Phase 3 ([DAT-4980](/DAT/issues/DAT-4980)). Hitting them in the draft is cheaper than fixing them in review.

- **Frontmatter:** `title` (quoted, matches H1) and `description` (120–160 chars, standalone SERP snippet) are required. Nothing else is required.
- **Structure:** one `# H1`, lead paragraph with no heading, 4–8 `## H2` sections, no `#### H4+`, `## See Also` at the end.
- **Internal links:** clean paths, no `.md` extension. Relative inside the same category, absolute across categories. Every target file must exist.
- **Evergreen language:** no retired model names inline. Date any pricing or version-specific claims.
- **Reference identity:** every article must include at least one comparison table, decision matrix, or trade-off list. We are a reference site, not a tutorial site and not an editorial.
- **Style:** second person, present tense, no "Let's dive in", no triple-bullet TL;DR, no closing summary that restates the body.

## Quick frontmatter example

```md
---
title: "Should You Commit uv.lock to Your Git Repository?"
description: "Yes for applications, recommended for libraries. Here's what uv.lock contains, when it changes, and how to handle merge conflicts cleanly."
---

# Should You Commit uv.lock?

Yes. If your project uses `uv`, commit `uv.lock`...
```

## Article types and length bands

| Type | Length | When to use |
|---|---|---|
| Concept explainer | 1,500–2,000 words | Defining a term, primitive, or pattern. |
| Comparison | 2,000–2,500 words | 2–N options inside one decision. Must include a comparison table. |
| Decision framework | 2,000–2,500 words | Multi-step decision walked in prose form. |
| Quickstart | 2,500–3,500 words | High-traffic integration; runnable code is the differentiator. |
| `should-you-commit-*` | 1,200–1,800 words | One-question answer + reasoning + exceptions. |

## See also (related issues)

- Parent process upgrade: [DAT-2362](/DAT/issues/DAT-2362)
- Phase 1 (this skill): [DAT-4978](/DAT/issues/DAT-4978)
- Phase 2 (CI validator): [DAT-4979](/DAT/issues/DAT-4979)
- Phase 3 (editorial/design gate): [DAT-4980](/DAT/issues/DAT-4980)
- Phase 4 (research briefs + freshness): [DAT-4981](/DAT/issues/DAT-4981)
- Phase 5 (SEO/content strategy): [DAT-4982](/DAT/issues/DAT-4982)
