# npm Essentials for AI-Powered Projects

`npm` is still the default package manager for many AI projects, and it works well with Next.js, Vercel, and most model SDKs. Where teams usually get into trouble is not installation itself, but reproducibility: lockfile drift, peer dependency conflicts, and scripts that only work on one machine. This guide covers the practical setup you need to keep an AI codebase stable while moving fast.

## 1) Install core AI dependencies cleanly

Start by adding only what you need for your first feature. For example, a typical Next.js AI stack might include an API SDK, schema validation, and markdown tooling:

```bash
npm install openai zod
npm install -D eslint prettier typescript
```

If you are using embeddings or vector search later, add those libs when you actually need them. Keeping initial dependency count low reduces breakage when transitive packages update.

## 2) Lockfile discipline for predictable builds

Always commit `package-lock.json` with `package.json`. In AI projects, tiny SDK updates can change defaults and output behavior, so deterministic installs matter even more than usual.

Recommended workflow:

```bash
# install exactly from lockfile in CI
npm ci

# local update flow
npm install
npm run build
git add package.json package-lock.json
```

Use `npm ci` in CI/CD because it fails fast when the lockfile is out of sync, which catches accidental local-only changes before deploy.

## 3) Resolve Next.js peer dependency conflicts

Conflicts usually appear when a plugin expects a different React or Next version. First, inspect the mismatch:

```bash
npm ls react next
npm explain <package-name>
```

Then apply fixes in this order:
- Prefer upgrading the conflicting package to a compatible version
- If blocked, pin the package to a known-good version
- Only use `--legacy-peer-deps` as a temporary local unblock, not as a permanent team policy

If your app works locally but fails on Vercel, check Node version mismatch and lockfile age first. Add an engines block when needed:

```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

## 4) Add scripts that help AI development

Useful scripts for AI-heavy repos are ones that validate prompts/contracts and keep local iteration fast:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "check": "npm run lint && npm run typecheck && npm run build",
    "deps:outdated": "npm outdated",
    "deps:audit": "npm audit --audit-level=high"
  }
}
```

Run `npm run check` before every commit so broken type contracts or build issues do not leak into preview deployments.

## 5) Keep AI SDK upgrades safe

When upgrading packages like `openai`, do it intentionally:

```bash
npm install openai@latest
npm run check
```

Then test a real endpoint path (not just unit tests), because model SDK upgrades can change request/response shapes, retry behavior, or error objects.

## 6) Production tips

- Use exact or carefully bounded versions for critical AI SDKs
- Avoid postinstall scripts that mutate generated code unpredictably
- Track token-cost-sensitive dependencies and remove unused ones quickly
- Cache npm artifacts in CI to speed up frequent builds

With these basics in place, npm becomes a reliable foundation instead of a source of random build failures, and your AI feature work stays focused on product outcomes.
