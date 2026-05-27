# Article self-review checklist

Walk this checklist line by line **before** marking the issue `in_review`. Phase 2 ([DAT-4979](/DAT/issues/DAT-4979)) wires many of these into CI; until then, the writer is the gate.

If you cannot tick a box, fix the article — do not waive the check. If you genuinely believe a check does not apply (e.g. no comparison table because the article is a 1-sentence answer in disguise), say so explicitly in the issue comment when you hand off for review.

---

## Frontmatter

- [ ] File starts with `---` on line 1 — no blank line, no BOM, no comment above.
- [ ] `title` is present, quoted, in title case, and matches the H1 in the body.
- [ ] `title` does **not** include `| VibeReference`.
- [ ] `description` is present, 120–160 characters, reads as a standalone SERP snippet.
- [ ] `description` does not start with "Learn how to…", "In this article…", or a rhetorical question.
- [ ] `description` includes the primary SEO query naturally.
- [ ] No `draft: true` left in.
- [ ] Optional fields (`lastReviewed`, `canonical`) used only when justified.

## Structure

- [ ] Exactly one `# H1`, matches the filename slug (kebab-case) and the frontmatter title.
- [ ] Lead paragraph immediately under the H1, no heading above it, 1–3 sentences.
- [ ] Lead paragraph names the question and the answer (or the stakes if the answer is "it depends").
- [ ] 4–8 `## H2` sections covering the body.
- [ ] No `#### H4` or deeper. If you reached for H4, restructure or use bold inline labels.
- [ ] `## See Also` section at the end with 3–6 cross-links, each with a one-line description.

## Links

- [ ] Every internal link uses a clean path with **no `.md` extension**.
- [ ] Same-category links use relative paths (`./other-article`).
- [ ] Cross-category links use absolute paths (`/category/other-article`).
- [ ] Every internal link target file exists in `content/`.
- [ ] No "click here" / "this link" anchor text — anchor describes the destination.
- [ ] External links point to canonical sources (vendor docs, RFCs, primary sources) — not competing aggregators.
- [ ] No affiliate links. No tracking parameters.

## Evergreen / freshness

- [ ] No retired model names inline (no GPT-3.5, GPT-4, Claude 2, Claude 3 / 3.5 / 3.7, Gemini 1.x, Llama 2/3). Use families (`Claude`, `GPT`, `Gemini`) and date specific-version claims.
- [ ] Pricing claims are dated: "(as of YYYY-MM, vendor X charges …)".
- [ ] Time-bound facts ("the latest release", "currently the only …") are either dated or linked to a vendor page that maintains the current state.
- [ ] No "in 2024" / "in 2025" framing for content that should read as evergreen.

## Reference identity

- [ ] The article answers a decision the reader is making, not a topic in the abstract.
- [ ] Includes at least one comparison table, decision matrix, or trade-off list.
- [ ] Each option / tool covered gets a balanced treatment (what it's best at + what it's worst at), not a vendor brochure.
- [ ] No screenshots, no click-by-click walkthroughs. (Code snippets are fine and encouraged.)
- [ ] No first-person plural ("we recommend …"). Second person and direct claims only.
- [ ] No closing summary that restates the body. End with `## See Also` or a short forward-looking paragraph and stop.

## Style and voice

- [ ] No "Let's dive in", "In conclusion", "In this article we'll", "Without further ado", or other AI-tell openers/closers.
- [ ] No triple-bullet TL;DR at the top — the lead paragraph does that job.
- [ ] Second person, present tense.
- [ ] Hedging only where it actually depends, with the conditions named.
- [ ] Code snippets are minimal, runnable in principle, and use real SDK symbols (not invented ones).
- [ ] Next.js code uses App Router + TypeScript by default; Python code uses 3.13 by default.

## Cross-linking

- [ ] At least 2 internal links to existing articles in the same category.
- [ ] At least 1 internal link to an adjacent category (see `references/category-guide.md` for typical patterns).
- [ ] For a series article: forward and back links to neighbors in the series.

## Length

- [ ] Within the band for the article type:
  - Concept explainer: 1,500–2,000 words.
  - Comparison: 2,000–2,500 words.
  - Decision framework: 2,000–2,500 words.
  - Quickstart: 2,500–3,500 words.
  - `should-you-commit-*` mini-articles: 1,200–1,800 words.
- [ ] If outside the band, you can name why in the issue.

## File and commit hygiene

- [ ] File saved at `content/<category>/<slug>.md` with the slug matching the URL.
- [ ] Filename is kebab-case, ASCII only, no trailing whitespace.
- [ ] No other files modified in the same commit (configs, lockfiles, etc.) unless required.
- [ ] Commit message: `feat: add <slug> article (DAT-NNNN)` for new, `fix:` or `refactor:` for edits.

## Hand-off

- [ ] Live URL posted as a comment on the issue once merged.
- [ ] Issue moved to `in_review` (or `done` after merge, per the team's review gate at the time).
- [ ] For new categories or articles > 2,000 words: tagged into the editorial gate ([DAT-4980](/DAT/issues/DAT-4980)) before requesting merge.
