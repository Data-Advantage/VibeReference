# Google Fonts

Google Fonts is a free library of over 1,500 font families that you can use in web applications. Next.js provides built-in support for Google Fonts through the `next/font/google` module, which automatically optimizes font loading by self-hosting font files and eliminating layout shift.

## Why Use next/font/google?

- **Zero layout shift**: Fonts are loaded with the CSS `size-adjust` property to prevent content jumping
- **Self-hosted**: Font files are served from your own domain, no external requests to Google
- **Automatic optimization**: Fonts are subset and preloaded for best performance
- **Privacy friendly**: No data sent to Google at runtime

## Basic Usage

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Using Multiple Fonts

```typescript
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

Then in your Tailwind config:

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
    },
  },
};
```

## Font Options

| Option | Description |
|--------|-------------|
| `subsets` | Character subsets to include (e.g., `['latin']`) |
| `weight` | Specific weights (e.g., `['400', '700']`) or `'variable'` |
| `style` | Font style: `'normal'`, `'italic'`, or both |
| `display` | CSS font-display value (default: `'swap'`) |
| `variable` | CSS variable name for use with Tailwind |

## Resources

- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Google Fonts Catalog](https://fonts.google.com)
