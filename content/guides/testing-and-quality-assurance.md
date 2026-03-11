---
title: "Testing & Quality Assurance"
---

# Testing & Quality Assurance

Testing strategies for vibe-coded apps — manual testing, automated tests, cross-browser testing, and accessibility.

## The Vibe Coding Testing Mindset

AI-generated code needs *more* testing, not less. You didn't write every line, so you need to verify behavior carefully. The good news: AI tools can also help you write tests.

## Manual Testing Checklist

Before deploying, walk through these flows yourself:

### Critical Path Testing
- [ ] Sign up with email → verify email → complete onboarding
- [ ] Log in → use core feature → log out
- [ ] Upgrade to paid plan → verify access to premium features
- [ ] Cancel subscription → verify downgrade to free features
- [ ] Reset password → log in with new password

### Edge Cases
- [ ] Submit empty forms → see validation errors
- [ ] Submit forms with very long input → no overflow or crashes
- [ ] Navigate with browser back/forward buttons → correct state
- [ ] Open app in two tabs → no conflicting state
- [ ] Lose network connection → graceful error handling

### Mobile Testing
- [ ] All pages are usable at 375px width (iPhone SE)
- [ ] Navigation menu works on mobile
- [ ] Forms are usable with on-screen keyboard
- [ ] Touch targets are at least 44x44px
- [ ] No horizontal scroll on any page

## Automated Testing

### Unit Tests with Vitest

Vitest is the recommended test runner for Next.js projects:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

### Writing Tests

**Test utility functions:**
```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice, slugify } from './utils'

describe('formatPrice', () => {
  it('formats cents to dollars', () => {
    expect(formatPrice(999)).toBe('$9.99')
    expect(formatPrice(0)).toBe('$0.00')
    expect(formatPrice(10000)).toBe('$100.00')
  })
})

describe('slugify', () => {
  it('converts text to URL-safe slugs', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('  Extra   Spaces  ')).toBe('extra-spaces')
  })
})
```

**Test React components:**
```typescript
// components/PricingCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PricingCard } from './PricingCard'

describe('PricingCard', () => {
  it('renders plan name and price', () => {
    render(<PricingCard name="Pro" price={29} features={['Feature 1']} />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('$29/mo')).toBeInTheDocument()
  })

  it('renders all features', () => {
    const features = ['Unlimited projects', 'Priority support', 'API access']
    render(<PricingCard name="Pro" price={29} features={features} />)
    features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument()
    })
  })
})
```

### End-to-End Tests with Playwright

For testing complete user flows:

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign up and access dashboard', async ({ page }) => {
  await page.goto('/signup')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'secure-password-123')
  await page.click('button[type="submit"]')

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toContainText('Dashboard')
})

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
})
```

### What to Test (and What to Skip)

**Always test:**
- Authentication flows
- Payment/subscription logic
- Data validation and sanitization
- Authorization (can users access only their data?)
- Core business logic

**Skip testing:**
- Third-party library internals
- Purely presentational components with no logic
- Generated boilerplate
- One-off admin scripts

## Using AI to Write Tests

AI tools are great at generating tests. Use this prompt pattern:

```
Write Vitest tests for this function:

[paste function]

Test these scenarios:
- Normal input
- Edge cases (empty, null, very large)
- Error cases
- Return value types
```

Then **review the generated tests** — AI sometimes writes tests that pass trivially or don't actually test the right behavior.

## Cross-Browser Testing

### Quick manual checks
Test in these browsers at minimum:
1. Chrome (desktop + mobile)
2. Safari (desktop + iOS)
3. Firefox (desktop)

### Common cross-browser issues
- **Safari date handling** — `new Date('2024-01-15')` works in Chrome but may fail in Safari. Use `new Date('2024-01-15T00:00:00')` instead.
- **CSS gaps** — `gap` in Flexbox isn't supported in older Safari. Check caniuse.com.
- **Backdrop filter** — `backdrop-blur` needs `-webkit-backdrop-filter` for Safari.

## Accessibility Testing

### Automated checks

Use the `axe` accessibility scanner:

```bash
npm install -D @axe-core/playwright
```

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

### Manual accessibility checks
- [ ] All images have meaningful `alt` text
- [ ] Page can be navigated with keyboard only (Tab, Enter, Escape)
- [ ] Color contrast ratios meet WCAG AA (4.5:1 for text)
- [ ] Form inputs have visible labels
- [ ] Error messages are announced to screen readers
- [ ] Focus is visible on interactive elements

## Pre-Deploy Testing Workflow

1. Run unit tests: `npm test`
2. Run E2E tests: `npx playwright test`
3. Check accessibility: `npx playwright test e2e/accessibility.spec.ts`
4. Manual smoke test of critical paths
5. Check mobile responsiveness in browser dev tools
6. Review Lighthouse scores for performance regressions
