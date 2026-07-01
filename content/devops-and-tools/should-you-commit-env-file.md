---
title: "Should You Commit Your .env File to Git?"
description: "No — a .env file with real secrets never belongs in Git. Here's the rule, the .env.example exception, the framework .local conventions, and how to rotate leaked keys."
---

# Should You Commit .env to Git?

No. A `.env` file that holds real secrets — API keys, database passwords, auth tokens, signing keys — must never be committed to Git. This is the one item in the "should you commit X" family where the wrong answer isn't just messy, it's a security incident. Once a secret lands in a Git commit, it lives in that repository's history forever, and if the repo is ever public — or becomes public later — automated scanners find exposed keys within minutes.

The rule sounds absolute, and for files with secrets it is. But `.env` is a naming convention, not a single file, and some `.env` variants are *designed* to be committed. The distinction that actually matters isn't the filename — it's whether the file contains a real secret. This guide gives you the rule, the safe exception, the per-framework conventions, and the one step almost everyone skips after they realize they leaked a key.

## The short answer

| Question | Answer |
|---|---|
| Commit a `.env` with real secrets? | **No** — never. Add it to `.gitignore` before your first commit. |
| Commit `.env.example`? | **Yes** — keys with placeholder values, no real secrets. |
| What about `.env.local`? | **No** — the `.local` suffix is the universal "never commit" convention. |
| What about `.env.development` / `.env.production`? | Only if they hold **non-secret defaults**. Never real secrets. |
| The `.gitignore` line? | `.env` and `.env*.local` (keep `!.env.example` if needed). |
| Already committed it? | Untrack it, purge history, and **rotate every exposed secret**. |

## Why a .env with secrets can never be committed

Committing a lockfile that's redundant is a hygiene problem. Committing secrets is a breach. The difference comes down to three things secrets do that build artifacts don't.

### The secret is exposed the instant it's pushed

The moment a `.env` with a live key reaches a remote — even a private one — the credential should be treated as compromised. Private repos get forked, cloned to laptops, backed up, granted to contractors, and occasionally flipped to public by accident. GitHub, GitLab, and independent bots continuously scrape public commits for anything shaped like an AWS key, a Stripe token, or an OpenAI key, and they act on hits in seconds. There are documented cases of cloud keys being used to spin up crypto-mining fleets minutes after a push. You don't get to decide how long the exposure window is.

### Git history is permanent by design

Deleting the file in a later commit does nothing. Git's whole purpose is to preserve history, so the secret stays fully readable in every earlier commit, in every clone, and in every fork. `git rm .env` followed by a commit removes it from the *current* tree while leaving it trivially recoverable with `git log -p` or `git show`. Removing a secret from history requires rewriting history — a heavier operation covered below — and even then, anyone who already cloned still has it.

### Secrets don't belong in source at all

A `.env` mixes two things that should live apart: the *shape* of your configuration (which variables exist) and the *values* of those variables (the actual secrets). The shape is worth sharing so teammates know what to set. The values belong in a secret manager or your host's environment-variable settings — Vercel, Netlify, Railway, Fly, AWS Secrets Manager, Doppler, 1Password — where they're access-controlled and auditable. Version control is neither.

## The safe exception: .env.example

You *do* want to share the list of variables a project needs. The convention is a committed template file — usually `.env.example`, sometimes `.env.sample` or `.env.template` — that contains the keys with placeholder or empty values and no real secrets.

```bash
# .env.example — committed
DATABASE_URL=postgres://user:password@localhost:5432/dbname
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
OPENAI_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

A teammate clones the repo, runs `cp .env.example .env`, and fills in the real values in their now-ignored `.env`. The template documents the contract; the secrets stay out of Git. Keep the example file honest — every time you add a variable to your local `.env`, add the placeholder to `.env.example` in the same commit, or new contributors get a broken setup with no clue what's missing.

## What "commit vs ignore" looks like across .env variants

The universal rule — never commit real secrets — plays out through a set of filename conventions that most tools share. The `.local` suffix is the key signal: across frameworks it always means "machine-specific, never committed."

| File | Commit? | What it's for |
|---|---|---|
| `.env` | **No** (if it has secrets) | Your working local values. Default: gitignore it. |
| `.env.example` / `.env.sample` | **Yes** | Template of keys with placeholder values. |
| `.env.local` | **No** | Local overrides and secrets. Always ignored. |
| `.env.*.local` | **No** | Per-environment local secrets. Always ignored. |
| `.env.development` / `.env.production` | Only if non-secret | Shared defaults for an environment, no secrets. |

Two popular frameworks encode this directly:

- **Next.js** — the docs state that `.env`, `.env.development`, and `.env.production` "should be included in your repository as they define defaults," while `.env*.local` "should be added to `.gitignore`." Secrets go in `.env.local`. In practice, the `create-next-app` template gitignores *all* `.env` files to be safe, so committing the non-secret defaults is an opt-in you make deliberately. (Verified against Next.js docs, mid-2025.)
- **Vite** — commits `.env` and `.env.[mode]` for shared defaults, and treats `.env.local` plus `.env.*.local` as always-ignored local files. Client-exposed variables must be prefixed (`VITE_`), which is a reminder that anything in a committed `.env` is effectively public.

The safe default if you're unsure: gitignore every `.env*` except an explicit `.env.example`. You only lose the minor convenience of shared non-secret defaults, and you eliminate the chance of a secret slipping through.

## The .gitignore setup

Ignore the secret-bearing files, but keep your template tracked with a negation rule:

```gitignore
# Environment files
.env
.env*.local

# Keep the template
!.env.example
```

The `!.env.example` line matters because a broad pattern like `.env*` would otherwise swallow the template too. Order counts — the negation must come after the ignore pattern. Put these lines in place *before* your first commit; that's the only way to guarantee a secret never enters history in the first place. See [Should You Commit .gitignore?](./should-you-commit-gitignore) for why the `.gitignore` file itself is always committed.

## If you already committed your .env

This is the case that trips people up, because the obvious fix is only half the job. Untracking the file stops future leaks but does nothing about the secret you already exposed.

```bash
# 1. Stop tracking it (keeps your local copy)
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Stop tracking .env"
```

That removes `.env` from the current tree, but the secret is still readable in every prior commit. To purge it from history, rewrite the repo with [git-filter-repo](https://github.com/newren/git-filter-repo):

```bash
git filter-repo --path .env --invert-paths
```

This rewrites every commit hash, so all collaborators must re-clone, and you'll need to force-push. Then — and this is the step almost everyone skips:

**Rotate every secret that was in the file.** Assume it's compromised, because you can't prove it isn't. Anyone who cloned or forked the repo before the rewrite still has the old history on disk, and if the repo was ever public, a scanner may already have grabbed the key. Regenerate the API keys, reset the database password, revoke the tokens, and issue new signing keys. History surgery hides the evidence; rotation is what actually closes the hole. If you only do one thing, do this one — a rotated key makes the leaked copy worthless, whether or not you ever finish the history rewrite.

## The bottom line

A `.env` file with real secrets is the one thing in this series that's a security risk, not just clutter — so it never goes in Git. Commit a `.env.example` template instead, keep real values in `.env` / `.env.local` (both gitignored), and store production secrets in your host's environment settings or a secret manager. If a secret already made it into a commit, the untrack-and-rewrite is only cleanup; the fix is to rotate every exposed credential and treat the leaked one as burned.

## See Also

- [Should You Commit .gitignore?](./should-you-commit-gitignore) — the file that keeps your `.env` out of Git in the first place, and why it's always committed
- [Should You Commit .npmrc?](./should-you-commit-npmrc) — the other config file that quietly hides auth tokens, with the same commit-the-template, ignore-the-secrets pattern
- [Should You Commit node_modules to Git?](./should-you-commit-node-modules) — the classic "reproducible artifact" mistake, the non-secret cousin of this one
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — the full committed-vs-ignored reference this series builds on
