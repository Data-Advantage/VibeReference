---
title: "Figma"
description: "Figma is the design tool the developer half of a vibe-coding team will actually touch — Dev Mode, Code Connect, and the MCP server let AI agents read designs and ship matching code. Here's the developer-focused reference."
---

# Figma

Figma is the browser-based design tool the developer half of a vibe-coding team will actually touch — not because they're designing, but because everything from the spec through the implementation now flows through it. Dev Mode turns a design file into an inspectable production artifact, Code Connect maps Figma components to the real components in your repo, and the **Figma MCP server** lets AI coding agents like Claude Code, Cursor, and Windsurf read your designs and generate code that matches.

This page is the developer-focused reference. If you're a developer integrating Figma into an AI-assisted build pipeline, this is the shelf.

## When You'll Reach for Figma

- A designer hands you a design, and you want **the actual production code** for it — not a generic Tailwind dump.
- You're letting an AI agent (Claude Code, Cursor) generate the UI, and you want it grounded in the design file rather than improvising.
- You want to keep design tokens, component variants, and copy in sync between design and code without a second source of truth.
- You want a published prototype or static site without spinning up a separate frontend.

## The Developer Surface

Figma exposes five capabilities developers actually use:

| Capability | What it does |
|---|---|
| **Dev Mode** | A developer-focused inspection interface. Click any element, get production-ready CSS, Tailwind, React, SwiftUI, Compose, or XML. |
| **Code Connect** | Maps Figma components to real components in your repo. AI agents and Dev Mode return *your* component code, not a generic snippet. |
| **MCP server** | The Figma Dev Mode MCP server lets Claude Code, Cursor, and Windsurf pull design context directly into agentic coding sessions. |
| **VS Code extension** | Side-by-side inspection — Figma in the IDE, no tab-switching. |
| **Figma Make / Sites** | AI prototyping (Make) and publish-from-Figma static hosting (Sites) for cases where the design *is* the deliverable. |

For an AI-built app shipped by a small team, Dev Mode + Code Connect + MCP is the integration that actually moves work. The other features are situational.

## Dev Mode

Dev Mode is the inspection panel for any Figma file. With a Dev seat, you can:

- Click any layer and read its CSS box-model, typography, and color tokens.
- Switch the code panel between **CSS, Tailwind CSS, React, SwiftUI, UIKit, Jetpack Compose, and Android XML**.
- See design variables (color, spacing, typography) rendered with their corresponding code syntax — so a `--space-4` design token shows as `space-4` in Tailwind, not as `16px`.
- Compare two states (default vs hover) and get the diff.
- Mark frames as "Ready for development" so engineering knows what's done.
- Use **picture-in-picture** to keep the design pinned over your editor window.

In 2026 the auto-generated code is meaningfully better at structure — Flex and Grid layouts come out closer to production-shaped than they did in early Dev Mode releases. It's still an *assistive* output, not the final commit. The big upgrade is Code Connect, which replaces the generic output entirely.

## Code Connect

Code Connect is the bridge between your codebase and a Figma file. When configured, Dev Mode returns the actual import statement and JSX for your repo's component instead of a generic React snippet.

**Without Code Connect:**
```tsx
<button className="bg-blue-600 text-white rounded-md px-4 py-2">
  Click me
</button>
```

**With Code Connect:**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="primary" size="md">Click me</Button>
```

That second snippet is what an AI agent sees, too. Setup runs locally in your repo via the `@figma/code-connect` CLI:

```bash
npm install -D @figma/code-connect
npx figma connect create
```

A minimal Code Connect file (`Button.figma.tsx`):

```tsx
import { figma } from "@figma/code-connect";
import { Button } from "./Button";

figma.connect(Button, "https://www.figma.com/design/...?node-id=1-2", {
  props: {
    label: figma.string("Label"),
    variant: figma.enum("Variant", {
      Primary: "primary",
      Secondary: "secondary",
    }),
  },
  example: ({ label, variant }) => <Button variant={variant}>{label}</Button>,
});
```

Then `npx figma connect publish` pushes the mapping to Figma. Every developer (and every AI agent reading the file) now sees real implementation code for that component.

Code Connect supports React, Vue, SwiftUI, UIKit, Compose, and HTML/CSS. It requires a **Dev seat on an Organization or Enterprise plan** — this is the single biggest gating factor for adoption, because team-plan accounts can't use it.

## The Figma MCP Server (the big 2025–26 feature)

The Figma Dev Mode **Model Context Protocol** server is the integration that actually changed how AI agents work with Figma.

Once enabled, an MCP-compatible client — Claude Code, Cursor, Windsurf, or any other MCP host — can:

- Read the selected frame from your active Figma file.
- Pull design tokens, variables, and component metadata.
- Resolve Code Connect mappings, returning *your* component definitions, not auto-generated ones.
- Generate code grounded in the actual design rather than a screenshot interpretation.

The practical workflow:

1. Open a Figma file in Desktop. Enable Dev Mode → MCP server → Local server.
2. In Claude Code (or Cursor), add the Figma MCP server to your config.
3. Select a frame in Figma. Prompt the agent: "Build this in our app, using our existing Button and Card components."
4. The agent reads the frame via MCP, resolves your Code-Connected components, and writes code that compiles against your repo.

This is the difference between agents that improvise UI and agents that match a real design system. If you're using AI agents to build UI in 2026, the MCP server is the flag worth flipping.

## Figma Make and Figma Sites

Two newer additions worth a paragraph each:

**Figma Make** (released 2025) is AI-driven prototyping. Describe a flow in natural language; Figma generates an interactive prototype with real components from your library. Useful for the "show stakeholders a working flow before we touch code" step of a build cycle.

**Figma Sites** lets you publish a Figma file directly to a hosted URL with custom domain and auto-responsive behavior. For static marketing pages or one-off landing experiences, it removes the entire "convert design to code, deploy somewhere" overhead. For product UI, you'll still ship a real frontend.

Neither replaces the developer pipeline — they reduce the friction at the edges of it.

## Pricing — the Dev Seat Question

Figma now sells **per-seat tiers** with separate Designer and Dev seats. The Dev seat is what gives you Dev Mode, Code Connect, and the MCP server — and it's only available on Organization or Enterprise plans, not on the cheaper Professional team plan.

For a one-developer vibe-coding setup, a Professional plan with one designer-style seat is enough to view files and build manually. To unlock the AI-agent-grounded workflow, you need at least one Organization seat. Most indie teams that want the full agent integration end up on Organization — it's the price of admission for the MCP-grounded pipeline.

## Useful Figma Plugins for Developers

- **Tokens Studio** — manage design tokens (color, spacing, typography) across Figma and export to JSON, CSS variables, or Style Dictionary input.
- **Variables to Code** — export Figma Variables as Tailwind config, CSS custom properties, or a TypeScript theme object.
- **Storybook Connect** — link Figma frames to Storybook stories for design-implementation parity checks.
- **html.to.design** — paste a URL and get an editable Figma file. Useful for inspecting competitors or porting an existing site to a Figma-first workflow.

For most teams, Tokens Studio plus the built-in Variables feature covers 90% of the design-token needs. The token export is what lets your shadcn theme stay in sync with the Figma file.

## Figma vs the Alternatives

| Tool | Best for | Where it wins | Where it loses |
|---|---|---|---|
| **Figma** | Production design + dev handoff for product UI | Dev Mode, MCP, Code Connect, ecosystem | Pricing tier required for full dev features |
| **Penpot** | Open-source self-hosted alternative | Free, self-hostable, FOSS | No MCP, smaller plugin ecosystem |
| **Sketch** | Mac-native designers | Native macOS performance | No real-time collaboration, no MCP |
| **Framer** | Marketing sites + interactive prototypes | Publishes directly with code | Less suited to product UI handoff |
| **v0** | AI-generated UI from prompts | Goes straight to React + Tailwind code | No source-of-truth design file; not a substitute for design |

For a vibe-coding team building product UI in 2026, the answer is almost always Figma — the agent integration story is what tips it.

## Production Checklist

- Set up **Dev seats** for any developer who'll touch Code Connect or the MCP server.
- Run `figma connect publish` for at least the components in your design system before pointing AI agents at the file.
- Pin the **node-id** in commit messages or PR descriptions when implementing a frame, so future readers can navigate back to the source.
- Use Figma **Variables** (not raw hex codes) for color and spacing tokens — they map cleanly to Tailwind and CSS variables via Variables to Code.
- Mark frames as **"Ready for development"** to give engineering a clear signal of what's stable.
- Keep one **canonical Figma file per product**, not per feature — sprawling files are how design and code drift apart.

## See Also

- [shadcn/ui](/frontend/shadcn) — the most common component library that gets Code-Connected to Figma in vibe-coding stacks.
- [v0](/frontend/v0) — AI-generated UI from prompts, often used alongside Figma for greenfield UI.
- [Visual Design](/product-and-design/visual-design) — design fundamentals to apply *inside* Figma.
- [Cursor](/ai-development/cursor) and [Claude Code](/ai-development/claude-code) — both consume the Figma MCP server.
- [MCP overview](/ai-development/mcp-model-context-protocol) — how the protocol Figma uses works at the spec level.
