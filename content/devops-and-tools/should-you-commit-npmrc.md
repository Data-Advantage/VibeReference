---
title: "Should You Commit .npmrc to Git?"
description: "Yes — commit a project .npmrc for shared config like registry and scope rules. Never commit auth tokens. Here's how to split the two cleanly with env vars."
---

# Should You Commit .npmrc?

It depends on what's in it. A project-level `.npmrc` is where you pin team-wide npm behavior — your registry, scoped package routing, `save-exact`, `engine-strict` — and that config belongs in Git so every install behaves the same. But the same file is also where npm reads authentication tokens, and a committed `_authToken` is a leaked credential that anyone with repo access (or a public mirror) can use to publish or pull private packages.

So the answer isn't yes or no. It's: **commit the configuration, never commit the secret.** The right move is to keep both in `.npmrc` but reference tokens through environment variables, so the file is safe to track. This guide covers what `.npmrc` controls, the three places npm looks for it, and exactly how to split shareable config from credentials.

## The short answer

| Question | Answer |
|---|---|
| Commit a project `.npmrc`? | **Yes** — registry, scope, and install config should be shared. |
| Commit auth tokens in it? | **No** — never. Use `${ENV_VAR}` interpolation instead. |
| Commit your home `~/.npmrc`? | **No** — it's machine-specific and usually holds your tokens. |
| Does pnpm / yarn read it? | **Yes** — `.npmrc` is the shared config format for all three. |
| The one rule to remember? | **Config in Git, credentials in env vars.** |

This is the same principle that governs an [`.env` file](./env-files-git-guide): the non-secret structure is worth sharing, the secret values are not. `.npmrc` just happens to mix both concerns in one file, which is why people get it wrong.

## What .npmrc actually controls

`.npmrc` is npm's configuration file. Each line is a `key=value` pair that overrides a default, and the settings fall into two very different buckets.

**Shareable project config** — settings that should be identical for everyone on the team:

```ini
# Where to install packages from
registry=https://registry.npmjs.org/

# Route a scoped org's packages to a private registry
@acme:registry=https://npm.pkg.github.com/

# Pin exact versions instead of caret ranges on install
save-exact=true

# Refuse to install if the active Node version violates "engines"
engine-strict=true

# pnpm: hoist nothing implicitly; surface peer deps
auto-install-peers=true
```

Every one of those lines describes *how this project should be built*, not who is building it. If a teammate clones the repo without them, they get a different registry, looser version ranges, or a silently mismatched Node version. That's exactly the drift a committed `.npmrc` prevents.

**Credentials** — settings that authenticate *you*:

```ini
# A registry auth token — this is a secret
//registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxxxxxxxxxx
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxx
```

Those `_authToken` lines are bearer credentials. Anyone holding one can install your private packages and, depending on the token's scope, publish new versions under your name. They must never reach a commit.

## Why a committed token is worse than it looks

It's tempting to think a private repo makes a committed token safe. It doesn't, for three reasons.

First, **Git history is forever.** Once a token lands in any commit, it lives in the repo's history even after you delete the line. Cloning the repo clones the secret. Removing it for real means rewriting history — a disruptive operation covered below.

Second, **repo access is wider than you think.** CI runners, contractors, forks, backup mirrors, and anyone you later add to the project all inherit every secret in history. A token committed "just for now" outlives the reason it was added.

Third, **automated scanners are watching.** Bots continuously scrape public and newly-public repositories for credential patterns, and `_authToken=` is one of the most reliable signatures there is. A token pushed to a public repo can be abused within minutes — often before you've finished the push.

The fix isn't to move tokens out of `.npmrc` entirely. It's to keep the *reference* in the committed file and the *value* in the environment.

## How to commit config and keep tokens out

npm expands environment variables written as `${VAR_NAME}` when it reads `.npmrc`. That one feature lets a single committed file stay safe:

```ini
# .npmrc — safe to commit
registry=https://registry.npmjs.org/
@acme:registry=https://npm.pkg.github.com/
save-exact=true

# The token is read from the environment at install time
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

The committed file names the variable; it never contains the value. At install time, npm substitutes whatever `GITHUB_PACKAGES_TOKEN` holds in the current shell.

Provide that value differently per environment:

- **Locally**, export it from your shell profile or a git-ignored `.env` you source manually — never the committed `.npmrc`.
- **In CI**, set it as an encrypted secret in the pipeline (GitHub Actions secrets, etc.) so the runner injects it at build time.

```bash
# Local shell (e.g. in ~/.zshrc, not in the repo)
export GITHUB_PACKAGES_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

If a teammate clones the repo and the variable isn't set, the install fails loudly with an auth error — which is the correct behavior. A missing credential should stop the build, not silently fall back to an anonymous registry.

## Project vs. user vs. global .npmrc

npm reads up to four `.npmrc` files and merges them, with the most specific winning. Knowing which is which tells you instantly what to commit.

| Location | Path | Scope | Commit it? |
|---|---|---|---|
| Project | `./.npmrc` (repo root) | This project, all collaborators | **Yes** — config only, tokens via env vars |
| User | `~/.npmrc` | You, across all your projects | **No** — your personal tokens live here |
| Global | `$PREFIX/etc/npmrc` | The whole machine | **No** — not part of any repo |
| Built-in | npm's own `npmrc` | npm internals | N/A — you don't touch it |

Only the **project** file sits inside your repository, so it's the only one Git ever sees. Settings in it apply to everyone who clones the repo, which is exactly why team-wide config belongs there and personal credentials don't. Your `~/.npmrc` is where `npm login` writes your real tokens — that file should never be copied into a project or a commit.

A practical rule: if a setting should be true for *the project no matter who's building it*, it goes in the committed `./.npmrc`. If it identifies or authenticates *you*, it stays in `~/.npmrc` or an env var.

## pnpm and yarn read it too

`.npmrc` isn't npm-only. pnpm uses it as its primary config file, and Yarn (Berry) reads npm-style registry and auth settings from it for compatibility. That makes a committed project `.npmrc` the single place to set registry and scope rules regardless of which client your team uses — and a few keys are pnpm-specific but worth committing:

```ini
# pnpm-specific, safe and useful to commit
auto-install-peers=true
strict-peer-dependencies=false
public-hoist-pattern[]=*eslint*
```

These shape how pnpm resolves and hoists dependencies, and like the npm keys, they should be identical for everyone — so they belong in version control. The token rule is unchanged: pnpm and yarn read `${ENV_VAR}` interpolation the same way npm does, so authentication still goes through environment variables, never literal strings.

## If you already committed a token

A committed token is a live credential, so treat it as compromised the moment you notice it. Order matters here.

**First, revoke and reissue.** Removing the line from Git does nothing to invalidate a token that's already been pushed — assume it's been scraped. Go to the registry (npmjs.com, GitHub, your private registry) and revoke that token, then generate a new one and put it in an environment variable as shown above.

**Then, scrub it from the file and history.** Replace the literal token with a `${VAR}` reference and commit that:

```bash
# Edit .npmrc to use ${GITHUB_PACKAGES_TOKEN}, then:
git add .npmrc
git commit -m "Move npm auth token to environment variable"
```

If the token was committed to a shared or public repo, removing it from the current file isn't enough — it's still in history. Rewrite history to purge it with [git-filter-repo](https://github.com/newren/git-filter-repo):

```bash
git filter-repo --replace-text <(echo 'npm_xxxxxxxxxxxxxxxxxxxx==>${GITHUB_PACKAGES_TOKEN}')
```

This rewrites commit hashes, so every collaborator must re-clone afterward. But history rewriting is damage control, not the fix — the revoked token is what actually protects you. A scrubbed-but-unrevoked token is still a working key in any clone made before the rewrite.

## The bottom line

Commit your project `.npmrc`. The registry, scoped-package routing, version-pinning, and pnpm resolution settings inside it are exactly the kind of shared configuration that keeps every `install` consistent across your team and CI — leaving them out invites silent drift.

Just keep credentials out of the committed copy. Reference auth tokens through `${ENV_VAR}` interpolation and supply the real values from your shell locally and from encrypted secrets in CI. Your home `~/.npmrc` keeps your personal tokens and never enters a repo. Config in Git, credentials in the environment — get that split right and `.npmrc` is one of the safest, highest-leverage files you can commit.

## See Also

- [Environment Variables and .env Files: What to Commit](./env-files-git-guide) — the same config-vs-secret split for application environment variables
- [Should You Commit package-lock.json to Git?](./should-you-commit-package-lock-json) — the npm file you should always commit
- [npm vs pnpm: Which Package Manager Should You Use?](./npm-vs-pnpm) — how the two clients differ and why both read `.npmrc`
- [Should You Commit package.json?](./package.json) — the manifest that pairs with your lock file and `.npmrc`
- [Secret Management Providers](./secret-management-providers) — where tokens belong once you outgrow plain env vars
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — the full committed-vs-ignored reference
