---
title: "Should You Commit bun.lock to Your Git Repository?"
description: "Yes, commit bun.lock for applications and libraries alike. Here's what it contains, how it replaced bun.lockb, and how to handle merge conflicts."
---

# Should You Commit bun.lock?

Yes. If your project uses Bun, commit `bun.lock`. The text-format lockfile that Bun 1.2 made the default is the same kind of artifact as `package-lock.json` or `pnpm-lock.yaml` — a generated file that pins your full dependency graph, and one that belongs in version control for every project that more than one person installs.

The short version: applications must commit it, libraries should commit it, and the legacy `bun.lockb` binary lockfile is the only file in this conversation you might reasonably delete.

If you've recently switched a project to Bun, scaffolded one with `bun create`, or had an AI coding agent reach for Bun by default, this article explains exactly what to keep in git and why.

## bun.lock vs bun.lockb at a glance

Bun has shipped two lockfile formats. Knowing which one your repo has determines what to commit.

| | `bun.lockb` (legacy) | `bun.lock` (current) |
|---|---|---|
| **Format** | Binary | Text (JSON-like) |
| **Introduced** | Bun 0.x — original format | Bun 1.1.x — text option |
| **Default since** | — | Bun 1.2 |
| **Human-readable** | No | Yes |
| **Diffable in PRs** | Only with a Git `textconv` shim | Yes, natively |
| **Merge conflicts** | Effectively unresolvable | Standard text resolution |
| **Future Bun features** | Frozen — no new feature support | Where all new work lands |
| **Commit to git?** | Yes, until your team has migrated | Yes |

If you are on **Bun 1.2 or newer**, the canonical lockfile is `bun.lock`. If you are on an older version and still have `bun.lockb`, commit it for now and plan to migrate — upgrading Bun and running `bun install` will produce `bun.lock` and let you delete the binary file in the same commit.

For the broader pattern across every package manager, see [Lock Files: Commit or Ignore?](./lock-files-commit-or-ignore).

## What bun.lock actually contains

Your `package.json` declares dependency *intent* using version ranges:

```json
{
  "name": "my-app",
  "dependencies": {
    "hono": "^4.6.0",
    "drizzle-orm": "^0.36.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.6.0"
  }
}
```

When you run `bun install` (or any command that mutates dependencies — `bun add`, `bun remove`, `bun update`), Bun resolves every range and writes the result to `bun.lock`. That file records:

- **Pinned versions for every package in the tree,** including transitive dependencies. If `hono` pulls in `@hono/node-server`, both versions are recorded.
- **Integrity hashes** for each resolved tarball, verified at install time so a tampered or swapped registry artifact fails fast.
- **Resolution metadata** — registry URL, Git revision, or workspace path each package came from.
- **Workspace topology** for monorepos using `"workspaces"` in `package.json`.
- **The package manager's own resolution decisions** for any constraint that has more than one valid solution.

The result is the full graph encoded as text. Bun's text lockfile is designed to be readable enough to scan in a PR diff — you can see at a glance when a transitive dependency was bumped, even if your `package.json` didn't change.

## Why commit it: reproducible installs

Lockfiles all exist for the same reason. Without one committed to the repo, every clone, every CI run, and every Docker build re-resolves your dependencies against whatever the registry serves at that moment. That drift is silent until it isn't.

Concretely: you depend on `drizzle-orm ^0.36.0`. On Monday that resolves to `0.36.4`. On Thursday a teammate clones your repo after `0.36.5` ships with a subtle behavior change in a transitive helper. Their tests fail, yours pass, and the bisect points at a file nobody touched. With `bun.lock` committed, both machines install the exact same versions.

The same logic applies to:

- **CI pipelines** — your build matrix should not depend on the registry's clock.
- **Docker images** — the lockfile baked into the layer is what got tested.
- **Production deploys** — rollback to a prior commit reproduces that commit's dependency tree, not a fresh resolution.

### Enforcing the lockfile in CI

Bun honors `bun.lock` by default, but for CI you want to be explicit so a forgotten `bun add` does not silently rewrite the lockfile mid-build. Use `--frozen-lockfile`:

```yaml
# GitHub Actions
- uses: oven-sh/setup-bun@v2
- name: Install dependencies
  run: bun install --frozen-lockfile
- name: Run tests
  run: bun test
```

`--frozen-lockfile` does two things: it refuses to mutate `bun.lock`, and it fails the install if `package.json` has drifted from the lockfile (i.e. someone changed a version range without re-running `bun install` locally). This is the right default for any non-developer environment.

For Dockerfiles, the same flag applies:

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY . .
CMD ["bun", "run", "start"]
```

Copy `bun.lock` and `package.json` *before* the rest of the source so Docker can cache the install layer until either file changes.

## The library exception (and why it usually doesn't apply)

The traditional Node.js rule says "commit lockfiles for applications, optional for libraries" — because your lockfile never ships in the published tarball and never affects what a downstream consumer's `npm install` does.

That's still true, but the practical recommendation for Bun libraries in 2026 is the same as for applications: **commit it anyway.** A new contributor gets the same install determinism as everyone else, intermittent CI failures from transitive updates become attributable, and there is no downside since consumers never see the file. The only library scenario where you might skip the lockfile is when you specifically want CI to test against the latest compatible version of every dependency on every run — rare enough that you'll know when you need it.

## Merge conflict handling

The single biggest practical reason Bun moved away from `bun.lockb` was merge conflicts.

With **`bun.lock` (text):**

1. Resolve any conflicts in `package.json` first — choose the union of dependencies the merged branch should have.
2. Delete the conflicted `bun.lock`.
3. Run `bun install`.
4. Stage the regenerated `bun.lock` and commit.

Don't hand-edit `bun.lock` to resolve conflicts. The file's internal structure encodes resolution decisions that a manual edit will get wrong in subtle ways. Always regenerate.

With **`bun.lockb` (binary)** still in your repo, conflict resolution is essentially "accept one side, regenerate, commit," because there is no useful text diff to merge. If you're hitting this regularly, that's a strong signal to upgrade to Bun 1.2+ and migrate to `bun.lock`.

## .gitignore: keep bun.lock out of the ignore list

A reasonable `.gitignore` for a Bun project looks like:

```gitignore
# Bun runtime artifacts
node_modules/
.bun/

# Build output
dist/
build/

# Environment files
.env
.env.local

# DO NOT add bun.lock or bun.lockb here
```

A few common mistakes worth calling out:

- **Catch-all patterns that swallow the lockfile.** `*.lock` will ignore `bun.lock`, `package-lock.json`, and any other lockfile in your tree. Prefer explicit entries.
- **Copying an older template that excludes Bun lockfiles.** Some `.gitignore` boilerplates from the early Bun era (2023–2024) excluded `bun.lockb` on the assumption that binary files don't belong in git. Remove that line and commit the lockfile.
- **Ignoring `bun.lockb` on a Bun 1.1 project where it's still authoritative.** If you haven't upgraded yet, the binary lockfile is still your source of truth — keep it in git until you've migrated to `bun.lock`.

For the broader picture of which generated files belong in version control, see [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide).

## Migrating from bun.lockb to bun.lock

If your repo has `bun.lockb` and you're upgrading to Bun 1.2+:

1. **Upgrade Bun** on every developer machine and in CI.
2. **Run `bun install`.** Bun writes a new `bun.lock` next to the existing `bun.lockb`.
3. **Verify with your test suite.** Resolution should produce the same package versions — the text lockfile is a format change, not a resolver change.
4. **Delete `bun.lockb`** in the same commit, and commit the new `bun.lock`.
5. **Update CI** to use a Bun 1.2+ image and `--frozen-lockfile`.

If your `package.json` ranges allow newer compatible versions, the first install may resolve slightly differently. Treat that as a normal dependency update.

## Interop with npm, pnpm, and yarn lockfiles

A repo should have one lockfile, owned by one package manager. If `bun.lock` shows up alongside `package-lock.json` or `pnpm-lock.yaml`, something is wrong — usually a teammate ran `npm install` in a Bun project. Bun does not read other package managers' lockfiles; it resolves only from `package.json`. When migrating to Bun, delete the old lockfile in the same commit you adopt Bun. In a mixed-tool monorepo, keep each lockfile in its own workspace directory and never let two coexist at the same level.

For the closest JavaScript-ecosystem comparisons, see [Should You Commit pnpm-lock.yaml?](./should-you-commit-pnpm-lock-yaml) and [Should You Commit package-lock.json?](./should-you-commit-package-lock-json).

## Common questions

**Should I commit `bun.lock` for a single-file Bun script?**

If the script is genuinely standalone — no `package.json`, just a `bun run script.ts` — there is no lockfile to commit. If the script lives in a real project with a `package.json`, the same rule applies as for applications.

**Does `bun install` re-lock on every run?**

By default, `bun install` will update `bun.lock` if `package.json` has changed. Use `--frozen-lockfile` in CI to forbid that and surface the drift as an error instead.

**What about Bun workspaces in a monorepo?**

Bun produces a single `bun.lock` at the workspace root that covers every workspace package. Commit the root lockfile. Individual workspace members do not have their own lockfile.

**Can I keep `bun.lockb` for backward compatibility?**

If part of your team is on Bun < 1.2, keeping `bun.lockb` until everyone has upgraded is fine. Once you've standardized on 1.2+, delete it. Keeping both indefinitely just doubles the merge surface.

## Summary

Commit `bun.lock`. The text-format lockfile is the canonical source of truth for any Bun project on 1.2 or later. It gives you reproducible installs across developers, CI, and production, plus hash-verified integrity, readable diffs in pull requests, and merge conflicts you can actually resolve.

Treat it as a generated artifact: regenerate via `bun install`, never hand-edit, and enforce it in CI with `bun install --frozen-lockfile`. If you still have `bun.lockb` in the repo, plan the upgrade — every reason the binary format existed has been better served by the text format since Bun 1.2 shipped.

## See Also

- [Lock Files: Commit or Ignore?](./lock-files-commit-or-ignore) — the cross-ecosystem decision frame
- [Should You Commit package-lock.json?](./should-you-commit-package-lock-json) — npm's lockfile
- [Should You Commit pnpm-lock.yaml?](./should-you-commit-pnpm-lock-yaml) — pnpm's lockfile
- [Should You Commit yarn.lock?](./should-you-commit-yarn-lock) — Yarn's lockfile
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — full reference for committed-vs-ignored files
