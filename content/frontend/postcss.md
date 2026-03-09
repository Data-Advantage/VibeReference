# PostCSS

PostCSS is a tool for transforming CSS with JavaScript plugins. It powers popular tools like Tailwind CSS, Autoprefixer, and CSS Modules. In a Next.js project, PostCSS runs automatically during the build process to process your stylesheets.

## Why PostCSS Matters

You may not interact with PostCSS directly, but it's the engine behind:

- **Tailwind CSS**: PostCSS processes Tailwind's utility classes and generates the final CSS
- **Autoprefixer**: Automatically adds vendor prefixes (`-webkit-`, `-moz-`) for browser compatibility
- **CSS Nesting**: Enables nested CSS syntax before browsers fully support it
- **CSS Minification**: Removes whitespace and optimizes CSS for production

## Configuration in Next.js

Next.js includes PostCSS with Tailwind CSS support out of the box. The configuration file:

```javascript
// postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

This tells PostCSS to:
1. Process Tailwind CSS directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
2. Add vendor prefixes with Autoprefixer

## Common Plugins

| Plugin | Purpose |
|--------|---------|
| `tailwindcss` | Process Tailwind utility classes |
| `autoprefixer` | Add vendor prefixes for browser compatibility |
| `postcss-import` | Inline `@import` statements |
| `postcss-nesting` | Enable CSS nesting syntax |
| `cssnano` | Minify CSS for production |

## When You Need to Edit PostCSS Config

Usually you don't need to touch the PostCSS config. Common reasons to modify it:

- Adding CSS nesting support
- Adding custom PostCSS plugins for specific CSS transformations
- Customizing Autoprefixer browser targets

## Resources

- [PostCSS Documentation](https://postcss.org)
- [PostCSS Plugin Directory](https://www.postcss.parts)
- [Next.js CSS Support](https://nextjs.org/docs/app/building-your-application/styling)
- [Tailwind CSS Installation](https://tailwindcss.com/docs/installation/using-postcss)
