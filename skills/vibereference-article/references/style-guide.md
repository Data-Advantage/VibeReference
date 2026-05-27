# VibeReference style guide

The voice and shape every article should hit. If you are deviating, you should be able to name why in the issue.

## Voice

- **Technical, opinionated, practical.** Take a position; back it with evidence; name the trade-off.
- **Reference, not tutorial.** We explain decisions and options. We do not walk through screen-by-screen "click here" instructions.
- **Reference, not editorial.** We are not writing essays. The reader is mid-decision; they want answer-shaped content.
- **Second person, present tense.** "You commit it." Not "developers should commit it" or "one would commit it".
- **No hedging.** "Probably", "might want to", "it depends" — only when it actually depends, and then say what it depends on.
- **No AI tells.** No "Let's dive in", no "In conclusion", no triple-bullet recaps at the end, no em-dash flourishes that don't pay for themselves, no "remember:" callouts.

## Article types

Four canonical shapes. Pick one per article. Length band follows from the type.

### 1. Concept explainer (1,500–2,000 words)

- Defines a term, primitive, or pattern.
- One H1, lead paragraph that names the concept and stakes, 4–6 H2 sections.
- Always includes a "what it is / what it isn't" framing early.
- Examples: `ai-agents.md`, `agents-vs-harnesses.md`, `ai-app-memory-problem.md`.

### 2. Comparison (2,000–2,500 words)

- Compares 2–N options inside one decision.
- Must include a comparison table.
- Each option gets its own H2 with the same sub-structure: what it is, what it's best at, what it's worst at, who it fits.
- Closes with a "how to choose" section, not a winner.
- Examples: `ai-gateway-llm-router-providers.md`, the `should-you-commit-*` family.

### 3. Decision framework (2,000–2,500 words)

- Walks the reader through a multi-step decision (often a flowchart in prose form).
- Uses numbered lists and decision-tree language.
- Includes a summary matrix at the end mapping inputs to recommended path.
- Example: `ai-memory-architecture-decision-framework.md`.

### 4. Quickstart (2,500–3,500 words)

- Reserved for high-traffic integration topics where a working code example is the differentiator.
- Includes runnable code in Next.js + one Python equivalent where relevant.
- Calls out the gotchas that bite teams in week 1.
- Example: `mem0-memory-integration.md`.

## Structure

1. **H1** — one per article, matches the filename slug, matches `title` in frontmatter.
2. **Lead paragraph** — no heading. 1–3 sentences. Names the question and the answer (or the stakes if the answer is "it depends"). The reader should know if they are in the right place by the end of the lead.
3. **H2 sections** — main content. 4–8 per article.
4. **H3 sub-sections** — only when an H2 genuinely needs them. Avoid H4 entirely.
5. **`## See Also`** — final section. 3–6 cross-links to adjacent articles. Use clean paths, no `.md`. Each link gets a one-line description.

## Tables and decision aids

A reference article without a comparison table, decision matrix, or labeled trade-off block is almost always under-spec. Aim for at least one of:

- **Comparison table** — N options × M attributes.
- **Decision matrix** — "if X, choose Y" rows.
- **Trade-off list** — "X gives you A at the cost of B" bullets, ≥3 of them.
- **Quadrant** — described in prose if you can't render an image.

Table formatting:

- Markdown tables. No HTML.
- Header row always present.
- Left-align text columns; tables render in monospace blocks on the site, so do not over-engineer alignment.
- Cells: keep to a short phrase. If a cell needs a sentence, the table is the wrong shape.

## Links

### Internal links

- Use clean paths, **no `.md` extension**. The remark pipeline strips them defensively, but always start clean.
- Same category: relative paths — `[AI Agents](./ai-agents)`.
- Cross-category: absolute paths — `[vector databases](/backend-and-data/vector-databases)`.
- Inline links in the body should describe what they link to: not "[click here](./foo)".

### External links

- Link to canonical docs, primary sources, vendor pages, RFCs, GitHub repos.
- Avoid linking to other reference aggregators that compete with us.
- No affiliate links. No tracking parameters.
- Date-stamp dynamic claims: "As of 2026-05, OpenAI charges …".

## Code examples

- Use language-tagged fenced blocks: ` ```ts `, ` ```python `, ` ```bash `.
- Keep snippets focused on the one decision the article is making. No "complete app" dumps.
- Show the **call-site** the reader has to write, not the SDK internals.
- When showing Next.js, default to App Router and TypeScript.
- When showing Python, default to 3.13.
- Imports must be real. No invented function names. If you reference an SDK, the symbol must exist in that SDK's current public surface.

## Model and pricing claims

- Do not name retired models inline. Use families (`Claude`, `GPT`, `Gemini`) and qualify with "as of <month YYYY>" when a specific version matters.
- Pricing claims must be dated. "$3 per million input tokens (Claude Opus 4.7, 2026-04)" is fine; "$3 per million input tokens" is not.
- For evergreen content, link to the vendor's pricing page and say "see <vendor> pricing for current numbers".

## Anti-patterns

| Don't | Do |
|-------|----|
| "Let's dive into …" / "In this article, we'll …" | Open with the answer or the decision. |
| Triple-bullet TL;DR at the top | A lead paragraph that does the same job in prose. |
| Wall of feature bullets per vendor | A comparison table + per-vendor trade-offs in prose. |
| H4s and H5s | Restructure into more H2s, or use bold inline labels. |
| Tutorials with screenshots | Reference articles. Tutorials live elsewhere (or as a Quickstart with code, no screenshots). |
| "GPT-4 is the best model for …" | Name the family and date the claim: "As of 2026-05, the strongest closed model in <task> is in the GPT family". |
| Closing summary that restates everything | A short, forward-looking last paragraph or `## See Also` and stop. |
