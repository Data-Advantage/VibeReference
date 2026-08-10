---
title: "Should You Commit .env.example to Git?"
description: "Yes — commit .env.example as a safe template for required environment variables. Keep placeholders in it, never real secrets or production values."
---

# Should You Commit .env.example to Git?

Yes. A `.env.example` file belongs in Git because it documents the environment variables your project needs without exposing the actual values. It is the safe counterpart to `.env`: the committed file shows the shape of configuration, while the ignored file holds each developer's real local secrets.

That distinction matters more in AI-built projects than it used to. A solo founder may generate a working SaaS in an afternoon, but the next debugging session, deployment agent, CI runner, or human collaborator still needs to know which variables are required. If the only complete copy lives in one laptop's `.env`, setup becomes tribal knowledge. If the real `.env` is committed, setup becomes a security incident. `.env.example` is the middle path: enough structure to make the app reproducible, no credentials for Git history to leak.

## The short answer

| Question | Answer |
|---|---|
| Commit `.env.example`? | **Yes** — it is shared project documentation. |
| Put real API keys in it? | **No** — placeholders only. |
| Put production URLs in it? | Usually **no** — prefer local or obviously fake defaults unless the value is public and stable. |
| Keep it updated? | **Yes** — every required env var should appear there. |
| Commit `.env` too? | **No** — real local values stay ignored. |
| The rule to remember? | **Commit the contract, ignore the credentials.** |

## What .env.example is for

`.env.example` is not an environment file your app normally loads. It is a template for humans, agents, and CI maintainers. It answers three setup questions quickly:

- What variables does this project expect?
- Which values are secrets versus public configuration?
- Which values are optional, and what happens when they are missing?

A useful `.env.example` looks like this:

```bash
# Copy this file to .env.local for local development.

# Database connection string for local development.
DATABASE_URL=postgres://user:password@localhost:5432/app

# Server-side secret. Set a real value in your local .env.local and hosting provider.
STRIPE_SECRET_KEY=

# Browser-exposed public base URL.
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional analytics write key. Leave blank in local development.
NEXT_PUBLIC_ANALYTICS_KEY=
```

The file names the keys and explains intent. It does not contain the working Stripe key, production database password, private webhook secret, OAuth client secret, or anything else that would create damage if the repository became public.

The best `.env.example` files are boring. They do not try to be clever. They give a new contributor enough information to copy the file, fill in values, and run the app without opening a chat thread titled "what env vars am I missing?"

## Why it belongs in version control

Environment variables are part of the application contract. If `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` are required for the app to boot, that requirement should travel with the code. A committed template gives every clone the same setup map.

Without it, environment setup drifts in predictable ways:

- One developer adds `RESEND_API_KEY` locally and forgets to tell anyone.
- A deploy fails because CI has `STRIPE_SECRET_KEY` but not `STRIPE_WEBHOOK_SECRET`.
- An AI coding agent adds a new provider integration and only updates the local `.env`.
- The README says "set your environment variables" but does not list them.

Those failures are expensive because the code can be correct while the runtime is incomplete. `.env.example` turns invisible runtime assumptions into visible repository state. It also gives reviewers a clean diff when a feature adds configuration: if a pull request adds Stripe webhooks, reviewers should see both the webhook code and the new `STRIPE_WEBHOOK_SECRET=` placeholder.

## What should go in .env.example

Use `.env.example` for required variable names, safe defaults, and short comments that reduce setup confusion.

Good entries include:

- Empty placeholders for secrets: `OPENAI_API_KEY=`
- Local development defaults: `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Fake but format-correct examples: `DATABASE_URL=postgres://user:password@localhost:5432/app`
- Optional variables with comments: `SENTRY_DSN=`
- Public client-side variables that are safe to expose: `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`

The goal is to show the expected format without giving away a working credential. For a token, blank is usually best. For a URL, a local default is often helpful. For a structured value like a Postgres URL, a fake value with the right shape teaches more than an empty string.

Keep comments short. `.env.example` is a setup checklist, not a configuration essay. If a variable needs a long explanation, link to the relevant section in the README or docs.

## What should stay out

Never put real secrets in `.env.example`. The filename does not make a credential safe. If the value authenticates, signs, decrypts, pays, deploys, reads private data, or sends email, it should not appear in any committed file.

Keep these out:

- API keys and bearer tokens
- Database passwords and full production connection strings
- OAuth client secrets
- Webhook signing secrets
- JWT, session, encryption, or cookie secrets
- Private registry tokens
- Production admin emails or customer-specific identifiers unless they are intentionally public

Also be careful with "public" framework prefixes such as `NEXT_PUBLIC_` or `VITE_`. Those variables are exposed to the browser by design, so they are not secret. But that does not automatically mean production values belong in a template. Use local defaults or placeholders unless the production value is stable, harmless, and useful for every environment.

## The .gitignore pattern

Most teams should ignore real environment files and explicitly keep the example tracked:

```gitignore
# Real local environment values
.env
.env.local
.env*.local

# Keep the shared template
!.env.example
```

If your `.gitignore` uses a broad `.env*` rule, the negation line matters:

```gitignore
.env*
!.env.example
```

Order matters. The `!.env.example` line must come after the broader ignore pattern or Git will still ignore the template. See [Should You Commit .gitignore?](./should-you-commit-gitignore) for the broader project-ignore rules.

Some frameworks allow committed `.env.development` or `.env.production` files for non-secret defaults. That can work on mature teams, but the safer default for small AI-built products is simpler: commit `.env.example`, ignore real environment files, and store deployed values in the hosting provider's secret settings.

## How to keep it from going stale

An outdated `.env.example` is worse than no template because it creates false confidence. The app looks documented, but the first run still fails.

Use a small maintenance rule: whenever code starts reading a new environment variable, update `.env.example` in the same change. That applies whether the variable is introduced by a human, an AI coding agent, or a deployment fix.

For larger teams, add a lightweight check that compares required variables to the template. The check can be as simple as a script that scans for `process.env.NAME` references and warns when `NAME=` is missing from `.env.example`. It will not catch every dynamic access pattern, but it catches the common drift that breaks fresh clones.

If you use TypeScript, a central env module also helps:

```ts
const requiredEnv = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "STRIPE_SECRET_KEY",
] as const;
```

Now reviewers have one obvious place to inspect the runtime contract, and the `.env.example` file can mirror that list.

## If you accidentally committed real values

Treat a real secret in `.env.example` the same way you would treat a committed `.env`: compromised. Do not just replace it with a blank placeholder and move on. The old value remains in Git history.

The cleanup sequence is:

1. Revoke or rotate the exposed credential at the source.
2. Replace the committed value with a placeholder.
3. If the repository is shared or public, scrub the old value from history.
4. Make sure `.env.example` explains the variable without revealing the new value.

Rotation is the important step. History cleanup hides the secret from future browsing, but rotation is what makes the leaked value useless. See [Should You Commit Your .env File to Git?](./should-you-commit-env-file) for the full secret-leak response.

## The bottom line

Commit `.env.example`. It is shared setup documentation, and it belongs beside the code that depends on those variables. Keep it accurate, keep it boring, and update it whenever the runtime contract changes.

Do not commit real environment values. The safe pattern is `.env.example` in Git, `.env` or `.env.local` ignored locally, and production secrets stored in your deployment platform or secret manager. That split gives new developers and AI agents a reliable setup map without turning Git history into a credential archive.

## See Also

- [Should You Commit Your .env File to Git?](./should-you-commit-env-file) — the secret-handling rule that makes `.env.example` necessary
- [Environment Variables and .env Files: What to Commit](./env-files-git-guide) — the broader environment-file guide
- [Should You Commit .gitignore?](./should-you-commit-gitignore) — how to keep real environment files out of the repository
- [Should You Commit .npmrc?](./should-you-commit-npmrc) — the same config-vs-secret split for package registries
- [Secret Management Providers](./secret-management-providers) — where production credentials should live instead
