# VibeReference Design System

> **Editorial & design review gate:** see [`editorial-gate.md`](./editorial-gate.md) for when CDO review is required on content and layout changes. Routine article authoring does **not** trigger the gate.

## Direction: Warmth & Approachability

**Feel:** A well-organized library for AI developers at any level. Warm, clear, and encouraging — like a knowledgeable friend's curated bookshelf. The interface should make 150+ guides feel navigable rather than overwhelming, with clear pathways from beginner to advanced.

**Signature:** The guide card with category color coding — each topic area (models, frameworks, tools, deployment) has a subtle color identity, creating a visual wayfinding system across the reference library.

---

## Color Palette

### Brand
- **Primary:** `#6366F1` (indigo-500) — knowledge and depth
- **Primary Light:** `#EEF2FF` (indigo-50)

### Category Colors (Subtle Tints)
- **Models:** `#DBEAFE` bg / `#2563EB` text (blue)
- **Frameworks:** `#D1FAE5` bg / `#059669` text (green)
- **Tools:** `#FEF3C7` bg / `#D97706` text (amber)
- **Deployment:** `#EDE9FE` bg / `#7C3AED` text (violet)

### Surfaces
- **Background:** `#FFFFFF`
- **Surface Elevated:** `#F9FAFB`
- **Surface Muted:** `#F3F4F6`

### Text
- **Primary:** `#111827` (gray-900)
- **Secondary:** `#6B7280` (gray-500)
- **Muted:** `#9CA3AF` (gray-400)

### Borders
- **Default:** `#E5E7EB`
- **Subtle:** `#F3F4F6`
- **Focus Ring:** `#6366F1`

### Semantic
- **Success:** `#10B981`
- **Warning:** `#F59E0B`
- **Error:** `#EF4444`

---

## Typography

### Font Stack
- **Sans:** Geist Sans (`--font-geist-sans`)
- **Mono:** Geist Mono (`--font-geist-mono`) — for code snippets in guides

### Scale
| Level | Size | Weight | Tracking | Use |
|-------|------|--------|----------|-----|
| Display | 36px | 700 | -0.02em | Homepage hero |
| H1 | 30px | 700 | -0.015em | Guide titles |
| H2 | 24px | 600 | -0.01em | Section headings |
| H3 | 20px | 600 | normal | Subsections |
| H4 | 16px | 600 | normal | In-article headings |
| Body | 16px | 400 | normal | Article text (generous) |
| Body Small | 14px | 400 | normal | Card descriptions |
| Caption | 12px | 500 | 0.02em | Category labels, metadata |
| Code | 14px mono | 400 | normal | Inline and block code |

### Article Typography
- Line height: 1.75 for body text (comfortable reading)
- Max width: 720px for article content
- Paragraph spacing: 24px

---

## Spacing

### Base Unit: 4px

| Token | Value | Use |
|-------|-------|-----|
| `space-1` | 4px | Micro gaps |
| `space-2` | 8px | Inline spacing |
| `space-3` | 12px | Compact padding |
| `space-4` | 16px | Standard padding |
| `space-6` | 24px | Card padding, paragraph gaps |
| `space-8` | 32px | Section gaps |
| `space-12` | 48px | Major separation |
| `space-16` | 64px | Page sections |

---

## Border Radius

| Element | Radius | Rationale |
|---------|--------|-----------|
| Buttons | 8px | Friendly, approachable |
| Cards | 10px | Soft but structured |
| Inputs | 8px | Consistent |
| Code Blocks | 8px | Soft container |
| Category Pills | 9999px | Fully rounded navigation |
| Modals | 16px | Soft overlay |

---

## Depth Strategy: Subtle Shadows

Light, airy feel that makes cards float gently. Educational content should feel relaxed, not clinical.

| Level | Shadow | Use |
|-------|--------|-----|
| Level 0 | none | Base canvas |
| Level 1 | `0 1px 3px rgba(0,0,0,0.05)` | Guide cards |
| Level 2 | `0 4px 12px rgba(0,0,0,0.08)` | Search dropdown, filters |
| Level 3 | `0 8px 24px rgba(0,0,0,0.12)` | Modals |

---

## Button Specifications

### Primary
- Height: 40px
- Padding: 10px 20px
- Background: `#6366F1`
- Text: `#FFFFFF`, 14px, 500 weight
- Radius: 8px
- Hover: `#4F46E5`

### Secondary
- Height: 40px
- Padding: 10px 20px
- Background: `#FFFFFF`
- Text: `#374151`, 14px, 500 weight
- Border: 1px solid `#E5E7EB`
- Radius: 8px
- Hover: `#F9FAFB`

### Category Filter Pill
- Height: 32px
- Padding: 6px 14px
- Background: white (inactive), category color (active)
- Text: 13px, 500 weight
- Radius: 9999px
- Border: 1px solid `#E5E7EB` (inactive)

---

## Component Patterns

### Guide Card
- White background, Level 1 shadow
- Category color bar at top (4px height)
- Category pill badge
- Title in 18px/600
- Description in 14px/400, gray-500, 2-line clamp
- Read time and difficulty badge at bottom

### Search Bar
- Height: 44px
- Full width with search icon
- Subtle shadow on focus
- Results dropdown with categorized suggestions

### Table of Contents (Article Sidebar)
- Sticky right sidebar on desktop
- Current section highlighted with indigo-50 background
- Nested indentation for sub-headings
- Smooth scroll on click

### Code Block
- `#F8FAFC` background (light gray)
- 8px border radius
- 16px padding
- Syntax highlighting with muted color scheme
- Copy button in top-right
