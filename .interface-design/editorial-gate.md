# VibeReference Editorial & Design Review Gate

Owner: CDO. Reviewer-of-last-resort: CEO.

This gate is intentionally narrow. VibeReference ships content faster than design can hand-inspect every article, and the article template is already standardized in `components/MarkdownContent.tsx` (typography, code blocks, tables, blockquotes, link styling). Routine article work should not bottleneck on the CDO.

The gate exists to catch the small set of changes that actually affect layout, navigation, accessibility, or the visual contract of the site.

---

## TL;DR for article authors

If you are writing a new article inside an existing category, with no new components, no new front-matter fields, no new page route, and length under ~3,500 words: **you do not need CDO review.** Run the article authoring skill's self-review checklist, ship it through the Phase 2 CI validator, and merge.

If any of the triggers in §1 fire: **request CDO review** before merge using the snippet in §4.

---

## 1. Triggers — when CDO review is REQUIRED

CDO review is required when **any** of the following are true:

1. **New page type or template.** A new article layout (e.g., a comparison matrix page, an interactive picker, a hub/cluster index, a workflow walkthrough with embedded diagrams) that does not render through the existing `MarkdownContent` component.
2. **New category page.** Adding or substantially reorganizing a top-level category in `lib/directory.ts` (a new `CATEGORIES` entry, a renamed slug, or a category intro rewrite that changes the editorial framing).
3. **Layout, navigation, or component changes.** Edits to `app/layout.tsx`, `app/page.tsx`, `app/[category]/*`, the header/footer, search bar, category cards, topic cards, the markdown component class list, or any new component under `components/`.
4. **Unusually long articles.** Single articles longer than **~3,500 words** or with more than ~15 H2 sections. At that length, reading layout, in-page navigation, and section pacing start to matter, and CDO needs to confirm the article doesn't need a different page type.
5. **New embedded UI inside an article.** Tables wider than 4 columns, custom HTML/JSX embedded in markdown, decision trees, image-heavy galleries, comparison cards, callout boxes, or any visual element not already covered by the prose styles.
6. **Accessibility risk.** New interactive controls (filters, toggles, accordions, tabs), images without obvious alt-text strategy, color used to convey meaning, or anything that touches keyboard navigation, focus order, or color contrast.
7. **Brand-adjacent surfaces.** OG image template changes, favicon/icon changes, homepage hero copy, the site name/tagline, or anything that ships as a marketing surface rather than reference content.
8. **Design system file change.** Any edit to `.interface-design/system.md` or this gate doc.

If **none** of these fire, the change does not need CDO review. Don't ask.

---

## 2. Triggers — when CDO review is NOT required

To remove ambiguity, the following are **explicitly outside the gate**:

- Adding a new article markdown file under an existing category (within length limits).
- Editing an existing article's prose, examples, or code snippets.
- Adding internal cross-links between articles.
- Adding a new entry to an existing article's table or list.
- Updating front-matter (title, description, updatedAt) on an existing article.
- Routine factual corrections, typo fixes, dead-link repairs, and version bumps.
- Adding an item to an existing category's topic list in `lib/directory.ts` (the topic itself is a new article, not a new template).

These should ship through normal review with the CTO/engineer and the Phase 2 content validator. The CDO is not in the loop.

---

## 3. Screenshot evidence required before close

When the gate triggers, the engineer/PM **must attach screenshots to the issue before the CDO marks it done.** This is the single piece of evidence that converts "I built it" into "design has actually seen the rendered result."

Required:

- **Desktop (≥1280px wide):** the affected page or component.
- **Mobile (≤390px wide):** the same view.
- **Dark mode** is not currently supported, so don't attach a dark-mode shot. If a future change adds dark mode, this gate adds a third screenshot.

For new page types or layout changes, also attach:

- A screenshot of an **existing well-designed reference page** (see §6) for visual comparison.
- A screenshot showing the page at a long-content edge case (e.g., the longest article in the category or a topic with many cross-links), so we can see how it behaves under load.

For accessibility-affecting changes, also attach:

- Screenshot of keyboard focus state on any new interactive control.
- Output from `/baseline-ui review` or `/fixing-accessibility` on the changed route.

Screenshots can be captured with the `screenshot--b35eb87b86` skill or any standard browser tool. Upload to the Paperclip issue as comments or work products.

---

## 4. Issue template — request CDO design review

Paste this block into the engineering issue when a triggered change is ready for review. This becomes the design-review subtask.

```markdown
## Design review request (CDO gate)

**Why the gate fires:** [pick one or more from §1 of editorial-gate.md — e.g., "new page type: comparison matrix"]

**What changed:**
- Files: [list]
- Routes affected: [list]
- New components: [list, or "none"]

**Reference page used as visual anchor:**
[link to existing VibeReference page being matched in look/feel]

**Screenshots attached:**
- [ ] Desktop ≥1280px
- [ ] Mobile ≤390px
- [ ] Long-content edge case (if layout change)
- [ ] Keyboard focus state (if new interactive control)
- [ ] `/baseline-ui review` output (if accessibility-affecting)

**Self-checks completed before requesting review:**
- [ ] Typography matches `.interface-design/system.md` scale
- [ ] Spacing uses the 4px grid
- [ ] Colors are from the documented palette
- [ ] Hover/focus/active states exist on all interactive elements
- [ ] Responsive at 390px, 768px, 1280px
- [ ] No new color used to convey meaning without a text label
- [ ] All images have meaningful alt text or are decorative

**Specific feedback wanted:** [one or two sentences — e.g., "Is the 5-column comparison table the right pattern, or should this be cards?"]
```

The CDO responds with **approve**, **approve with notes** (specific deltas, ship after applying), or **request changes** (specific fixes, re-review).

---

## 5. Design-review checklist (used by the CDO)

Applied to every triggered change. Fail = request changes.

### Visual

- [ ] Typography hierarchy is clear and matches `.interface-design/system.md`.
- [ ] Spacing follows the 4px grid tokens (no arbitrary `mt-[27px]`).
- [ ] Color palette is the documented one; category colors used only on category surfaces.
- [ ] Border radius matches system (cards 10px, buttons 8px, pills full).
- [ ] Shadows used sparingly per the depth strategy (Level 0–3 only).

### Layout

- [ ] Reading content width is constrained to ~720px for prose; full-width is only used for navigation, comparison tables, and visual elements.
- [ ] Mobile (≤390px) reflows without horizontal scroll.
- [ ] No layout shift on initial paint.
- [ ] In-article tables either fit at 720px or have a sensible mobile pattern (scroll container, card stack, or vertical collapse).

### Accessibility

- [ ] Tab order is logical; visible focus ring on every interactive element.
- [ ] Color contrast meets WCAG 2.2 AA (4.5:1 body, 3:1 large text/UI).
- [ ] Images have meaningful alt text or are flagged decorative.
- [ ] Interactive controls have accessible labels and a keyboard-only path.
- [ ] No information conveyed by color alone.

### Editorial

- [ ] Page type matches existing canonical types (taxonomy, family, variant, comparison, workflow guide). If new, the new type is documented in this gate doc.
- [ ] Headings descend without skipping levels (H1 → H2 → H3).
- [ ] Cross-links to siblings and parent category exist.
- [ ] Article opens with a clear answer to the search intent in the first 2 paragraphs.

### Performance & motion

- [ ] No animation longer than 300ms on UI feedback; no autoplaying motion.
- [ ] Images sized appropriately; no >1MB unoptimized assets shipped.

If the change is editorial-only (e.g., an unusually long article), the layout and accessibility sections still apply but are usually a quick pass.

---

## 6. Reference pages to anchor against

When designing or reviewing a new page type, compare against these existing pages. They represent the current bar.

- **Homepage:** [vibereference.com/](https://www.vibereference.com/) — hero, category grid, search, and topic list. The canonical pattern for hub/landing surfaces.
- **Category page (`ai-development`):** [vibereference.com/ai-development](https://www.vibereference.com/ai-development) — category intro, topic grid. The canonical pattern for cluster landings.
- **Taxonomy/explainer article:** [vibereference.com/ai-development/agents-vs-harnesses](https://www.vibereference.com/ai-development/agents-vs-harnesses) — long-form conceptual content with clear H2/H3 hierarchy.
- **Product reference article:** [vibereference.com/ai-models/claude](https://www.vibereference.com/ai-models/claude) — vendor/family page with model tables, pricing posture, and use cases.
- **Workflow/decision article:** [vibereference.com/devops-and-tools](https://www.vibereference.com/devops-and-tools) "should you commit" cluster — short, opinionated answers to a single question.

New page types must either match one of these patterns or earn their distinct treatment in the design review.

---

## 7. Escalation and exceptions

- **CEO override:** any change can be escalated to the CEO if the CDO is unavailable or if speed matters more than the gate (rare; document the reason in the issue).
- **Emergency fixes:** broken layout in production, accessibility regression, or critical content correction can ship without the gate. File a follow-up design-review issue within 24 hours.
- **Series rollouts:** when a Phase 1 series plan introduces a new repeatable template, the CDO reviews the **first** article and the **template**. Subsequent articles in the same series do not retrigger the gate as long as they use the approved template without modification.

---

## Why this gate exists

VibeReference's value is consistency and reading quality. The site ships dozens of articles a month and a single inconsistent page type or accessibility regression undermines the whole library. At the same time, a heavyweight design review on every article would kill velocity and isn't necessary — the markdown component already enforces 90% of the visual contract.

This gate trades CDO involvement for ~5% of changes (the ones that change the contract) in return for not blocking the other 95%.
