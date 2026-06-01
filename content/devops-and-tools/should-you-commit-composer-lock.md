---
title: "Should You Commit composer.lock to Your Git Repository?"
description: "Yes for applications, no for libraries. Here's what composer.lock contains, why Composer's rule differs from Cargo's, and how to use it in CI and Docker."
---

# Should You Commit composer.lock?

Yes for applications. No for libraries published to Packagist. The PHP/Composer rule is the inverse of Rust's modern guidance: an application owns the resolution and must reproduce it across environments, while a library's lockfile is dead weight to its consumers and a source of false signal in its own CI.

If you've run `composer install` for the first time and you're looking at the freshly generated `composer.lock` wondering whether it belongs in version control, this article gives you the answer plus the reasoning, the CI flags, and the Docker layout that matter.

## The short answer

| Project type | Commit `composer.lock`? | Why |
|---|---|---|
| Web application (Laravel, Symfony, custom) | **Yes** | Reproducible builds across developers, CI, and production deploys. |
| Internal service or API | **Yes** | Same reasoning — your runtime depends on the resolved graph, not the range. |
| Library published to Packagist | **No** | Downstream consumers ignore it; CI should test against the full semver range. |
| Private library used only inside one org | **Optional, lean commit** | Stable contributor experience; same trade-off as monorepo libs. |
| Composer plugin or dev tool | **No** | Behaves like a library; consumers re-resolve. |

The two-line decision: applications commit, public libraries don't. Everything else is a variation on those two cases.

## What composer.lock actually contains

Your `composer.json` declares dependency *intent* using semver-style ranges:

```json
{
  "name": "acme/storefront",
  "type": "project",
  "require": {
    "php": "^8.3",
    "laravel/framework": "^11.0",
    "guzzlehttp/guzzle": "^7.8",
    "doctrine/dbal": "^4.0"
  },
  "require-dev": {
    "phpunit/phpunit": "^11.0"
  }
}
```

When you run `composer install` for the first time, `composer update`, or `composer require`, Composer resolves every requirement and writes the result to `composer.lock`. That file records:

- **Pinned versions for every package** in the dependency graph, including transitive ones. If `laravel/framework` pulls in `symfony/console`, both are locked.
- **Source references** — a Git commit SHA or a registry archive URL for every package.
- **Cryptographic hashes** for downloaded dist archives, verified at install time.
- **`content-hash`** — a hash of the relevant portions of `composer.json`. If `composer.json` changes meaningfully, this hash changes and Composer warns.
- **Platform requirements** — the PHP version and extensions the resolution assumes.
- **Dev vs. non-dev split** — `packages` and `packages-dev` are tracked separately so production installs can skip dev dependencies cleanly.

The file is generated, not hand-written. Composer rewrites it any time resolution changes, and `composer install` will refuse to proceed if the lockfile references a package that is no longer reachable.

For the broader pattern across every package manager, see [Lock Files: Commit or Ignore?](./lock-files-commit-or-ignore).

## Why commit it for applications: reproducible builds

Every lockfile exists for the same reason. Without `composer.lock` in version control, every clone, every CI run, and every container build re-resolves dependencies against whatever Packagist serves at that moment.

Concretely: you depend on `guzzlehttp/guzzle: ^7.8`. On Monday that resolves to `7.8.1`. On Thursday a teammate clones the repo after `7.9.0` ships with a deprecation that breaks one of your middlewares. With `composer.lock` committed, both machines install the exact same version graph.

The same logic applies to:

- **CI pipelines** — your test suite should not depend on Packagist's clock.
- **Docker images** — the lockfile baked into the layer is what got tested.
- **Production deploys** — `composer install --no-dev` on the release server should reproduce the version graph that shipped, not a fresh resolution.

### Enforcing the lockfile in CI

For CI and production builds, always use `composer install`, never `composer update`. The two commands are different operations:

- `composer install` reads `composer.lock` and installs exactly what it says. If the lockfile is missing or stale, it falls back to resolution (which you don't want in CI).
- `composer update` re-resolves from `composer.json`, rewrites `composer.lock`, and installs the new graph.

To make CI loud about a stale lockfile rather than silently resolving, use:

```yaml
# GitHub Actions
- name: Validate composer files
  run: composer validate --strict --no-check-publish
- name: Install dependencies
  run: composer install --prefer-dist --no-progress --no-interaction
```

`composer validate --strict` fails the build if `composer.json` and `composer.lock` are out of sync — typically because someone edited a requirement without running `composer update`.

For production installs, add `--no-dev` and the autoloader flags:

```bash
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
```

`--optimize-autoloader` builds a class map so PHP doesn't pay PSR-4 resolution cost on every request.

## Why libraries should not commit it

For a package published to Packagist — a library others install via `composer require` — the recommendation flips. Don't commit `composer.lock`.

The reasoning:

- **Consumers ignore it.** When someone runs `composer require your/library`, Composer installs your library's `composer.json` requirements into their resolution graph. Your library's `composer.lock` is never read. It only exists for your own development.
- **CI should test the range.** Your library declares `^7.0`. If you commit a lockfile pinning `7.0.4`, your CI never exercises `7.5` or `7.9`. The first time a consumer hits the version you didn't test is in their production.
- **The maintenance signal is bad.** A committed library lockfile produces noisy PRs every time a transitive dependency releases a patch, with no corresponding consumer benefit.

The compromise some library maintainers use: don't commit `composer.lock`, but run scheduled CI against a matrix of dependency versions (oldest supported, latest, and "lowest acceptable" via `composer update --prefer-lowest`) to catch range bugs early.

```yaml
# GitHub Actions matrix for a library
strategy:
  matrix:
    dependencies: ["lowest", "highest"]
steps:
  - run: composer update --prefer-lowest --no-interaction
    if: matrix.dependencies == 'lowest'
  - run: composer update --no-interaction
    if: matrix.dependencies == 'highest'
  - run: vendor/bin/phpunit
```

The private-library exception: if your "library" only ships inside one organization and is consumed by exactly one or two applications, committing the lockfile is reasonable for contributor experience. It mirrors the Cargo 2023 guidance for libraries inside controlled environments.

## Merge conflict handling

`composer.lock` is JSON, so it conflicts cleanly enough to read but messily enough to never resolve by hand. The `content-hash` field alone will conflict on almost every dependency change.

Resolve by regenerating, not hand-editing:

1. Resolve any conflicts in `composer.json` first — pick the union of dependencies the merged branch should have.
2. Delete the conflicted `composer.lock`.
3. Run `composer update` to regenerate (or `composer update vendor/package` to refresh only the changed packages without touching everything else).
4. Stage the regenerated `composer.lock` and commit.

Never hand-edit the lockfile. The `content-hash`, dist URLs, and source references encode decisions a manual edit will get wrong silently. If two branches added the same package at slightly different versions, let Composer pick.

For repositories with frequent dependency churn, scoping updates with `composer update vendor/package-name` instead of a full re-resolution keeps lockfile diffs small and reviewable.

## .gitignore: vendor out, lockfile in

A reasonable `.gitignore` for a PHP application looks like:

```gitignore
# Composer-installed dependencies
/vendor/

# Local environment
.env
.env.local

# Build artifacts
/public/build/
/public/hot/
/storage/*.key

# Editor and OS
.idea/
.vscode/
.DS_Store

# DO NOT add composer.lock here for applications
```

A few common mistakes worth calling out:

- **Catch-all patterns that swallow the lockfile.** `*.lock` will ignore `composer.lock`, `package-lock.json`, and any other lockfile in your tree. Prefer explicit entries.
- **Copying a Composer library template into an application repo.** Library templates often `.gitignore` `composer.lock`. If you fork one to start an app, remove that line and commit the lockfile.
- **Forgetting `/vendor/`.** The `vendor` directory contains thousands of files from third-party packages; it should never be in git. Composer regenerates it from the lockfile.

For the broader picture of which generated files belong in version control, see [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide).

## Docker and production installs

Copy `composer.json` and `composer.lock` *before* the rest of the source so Docker can cache the dependency-install layer until either file changes:

```dockerfile
FROM composer:2 AS deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
      --no-dev \
      --no-scripts \
      --no-autoloader \
      --prefer-dist \
      --no-interaction

FROM php:8.3-fpm-alpine AS runtime
WORKDIR /var/www/html
COPY --from=deps /app/vendor ./vendor
COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative \
 && chown -R www-data:www-data storage bootstrap/cache
```

A few notes on the flags:

- `--no-scripts` skips package install scripts during the dependency-only layer; you run them after copying the app source.
- `--no-autoloader` defers the optimized autoloader to the runtime stage where the full app code is present.
- `--prefer-dist` pulls archived zips from Packagist's CDN instead of cloning from source — faster and smaller in CI.
- `--classmap-authoritative` tells the optimized autoloader to trust the class map and never fall back to PSR-4 scanning, which removes a stat call from every autoload miss in production.

This layout is what Laravel, Symfony, and most production PHP stacks use.

## Common questions

**Should I commit `composer.lock` for a Symfony or Laravel project?**

Yes. Both framework skeletons ship with a `composer.lock` that is intended to be committed. Symfony's documentation and Laravel's project template both treat the lockfile as part of the application.

**What about a PHP CLI tool I publish to Packagist?**

Don't commit the lockfile if the tool is installed via `composer global require` or `composer require`. Consumers resolve dependencies fresh. The exception is a CLI distributed as a [PHAR](https://www.php.net/manual/en/intro.phar.php) or a Docker image — in that case the build artifact already bakes the resolution, so committing the lockfile makes the bundled build reproducible.

**Does `composer install` ever rewrite the lockfile?**

Not when the lockfile is present and consistent. It rewrites only when the lockfile is missing, when `composer.json` has changed in a way that invalidates `content-hash` (and you accept the warning), or when you run `composer update` explicitly.

**What does the `content-hash` field do?**

It's a hash of the parts of `composer.json` that affect resolution. Composer compares it on every install and warns when `composer.json` has drifted without a corresponding `composer update`. In CI, `composer validate --strict` turns that warning into a failure.

**Can I have multiple `composer.lock` files in one repo?**

Yes, if your repo contains multiple independent PHP projects each with their own `composer.json`. Each project owns its own lockfile. Composer does not yet have a true workspace concept like Cargo or pnpm, so monorepos typically use one root project with path repositories pointing at internal packages.

## Summary

For applications, commit `composer.lock`. The benefits — reproducible builds, deterministic CI, attributable failures, clean production deploys — are the same as every other ecosystem's lockfile. Use `composer install` (never `composer update`) in CI, gate it with `composer validate --strict`, and run `--no-dev --optimize-autoloader` in production.

For libraries published to Packagist, ignore `composer.lock`. The lockfile is dead weight your consumers never see, and committing it actively hides range-compatibility bugs from your test suite. Test the full semver range in CI instead, with a `--prefer-lowest` matrix run to catch lower-bound drift.

The split is clean: lockfile follows the runtime. If your repo *is* the runtime, commit it. If your repo provides code for someone else's runtime, don't.

## See Also

- [Lock Files: Commit or Ignore?](./lock-files-commit-or-ignore) — the cross-ecosystem decision frame
- [Should You Commit Gemfile.lock?](./should-you-commit-gemfile-lock) — Ruby's closest analogue
- [Should You Commit package-lock.json?](./should-you-commit-package-lock-json) — Node's mainline lockfile
- [Should You Commit Cargo.lock?](./should-you-commit-cargo-lock) — Rust's inverted recommendation
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — full reference for committed-vs-ignored files
