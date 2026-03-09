# tweakcn

tweakcn is an open-source visual theme editor for shadcn/ui components. It provides a real-time interface for customizing colors, typography, border radius, and other design tokens in your shadcn/ui-based application without manually editing CSS variables.

## Why tweakcn?

- **Visual editing**: See changes in real-time as you adjust design tokens
- **shadcn/ui compatible**: Generates CSS variables that work directly with shadcn/ui
- **No lock-in**: Outputs standard CSS that you can paste into your project
- **Dark mode support**: Configure both light and dark theme variants
- **Pre-built themes**: Start from curated theme presets

## How to Use

1. Visit the tweakcn editor
2. Adjust colors, typography, spacing, and border radius
3. Copy the generated CSS variables
4. Paste into your `globals.css` or Tailwind config

## What You Can Customize

| Token | Description |
|-------|-------------|
| Primary color | Main brand color for buttons and links |
| Secondary color | Supporting color for secondary elements |
| Background | Page and card background colors |
| Foreground | Text colors |
| Border radius | Roundness of buttons, cards, and inputs |
| Muted/accent | Subtle background and highlight colors |

## Integration with shadcn/ui

shadcn/ui uses CSS custom properties (variables) for theming. tweakcn generates these variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --radius: 0.5rem;
  /* ... more variables */
}
```

## Resources

- [tweakcn GitHub Repository](https://github.com/tweakcn/tweakcn)
- [shadcn/ui Theming Guide](https://ui.shadcn.com/docs/theming)
