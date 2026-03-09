# ESLint

ESLint is a static analysis tool for JavaScript and TypeScript that finds and fixes problems in your code. It enforces coding standards, catches common bugs, and helps maintain consistency across a team. Most modern JavaScript frameworks, including Next.js, ship with ESLint pre-configured.

## Why Use ESLint?

- **Catch bugs early**: Detect unused variables, unreachable code, and type errors before runtime
- **Enforce consistency**: Everyone on the team follows the same coding style
- **Auto-fix issues**: Many rules can automatically fix problems when you save a file
- **Framework-specific rules**: Plugins for React, Next.js, and TypeScript catch framework-specific mistakes

## Setup in a Next.js Project

Next.js comes with ESLint built in. Run it with:

```bash
npx next lint
```

### Manual Setup

```bash
npm install --save-dev eslint eslint-config-next
```

Create `.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals"
}
```

## Adding TypeScript and Prettier

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ]
}
```

Install the additional packages:

```bash
npm install --save-dev @typescript-eslint/eslint-plugin eslint-config-prettier
```

## Useful Rules

| Rule | Purpose |
|------|---------|
| `no-unused-vars` | Flag variables declared but never used |
| `no-console` | Warn about console.log statements left in code |
| `prefer-const` | Require const when variables are never reassigned |
| `react-hooks/exhaustive-deps` | Ensure useEffect dependencies are correct |

## Running ESLint

```bash
npx next lint           # Lint all files
npx eslint src/ --fix   # Auto-fix problems
```

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Next.js ESLint Guide](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [TypeScript ESLint](https://typescript-eslint.io/)
