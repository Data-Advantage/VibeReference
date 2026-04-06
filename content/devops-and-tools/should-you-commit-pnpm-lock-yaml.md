# Should You Commit pnpm-lock.yaml?

Yes. Always commit `pnpm-lock.yaml` to version control.

pnpm adoption is accelerating. It is now the default package manager for major frameworks like Vue, Nuxt, and SvelteKit, and many AI coding tools generate projects that use it out of the box. If you have switched to pnpm or an AI tool set it up for you, you have a `pnpm-lock.yaml` file in your project root. That file belongs in git.

This article explains what is inside it, why it matters, and how to handle the common situations that come up around it. For the full reasoning on why lock files should be committed across all package managers, see [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore).

## Yes, commit it

The short version: `pnpm-lock.yaml` records the exact dependency tree your project uses. Without it, every `pnpm install` resolves version ranges fresh from the registry. That means two developers (or two CI runs) can end up with different versions of the same packages. Committing the lock file eliminates that inconsistency.

This is the same principle behind committing `package-lock.json` with npm or `yarn.lock` with Yarn. The lock file is not optional metadata — it is the single source of truth for what your project actually installed.

If you are coming from npm and want to understand how pnpm compares, see [npm vs pnpm](/devops-and-tools/npm-vs-pnpm).

## What pnpm-lock.yaml contains

Unlike npm's JSON-based `package-lock.json`, pnpm uses YAML. The file records three things for every package in your dependency tree:

1. **Exact versions.** Not the `^19.0.0` range from your `package.json` — the resolved `19.0.2` that was actually installed.
2. **Integrity hashes.** A cryptographic hash (SHA-512) of each package tarball. If a package is tampered with on the registry, the hash mismatch is caught during install.
3. **Dependency relationships.** Which packages depend on which other packages, and the exact versions of those transitive dependencies.

Here is a simplified snippet of what a `pnpm-lock.yaml` entry looks like:

```yaml
packages:
  react@19.0.2:
    resolution:
      integrity: sha512-Xk2a...
    engines:
      node: '>=16'

  react-dom@19.0.2:
    resolution:
      integrity: sha512-9bQ3...
    dependencies:
      react: 19.0.2
      scheduler: 0.25.0
```

The YAML format is more readable than npm's JSON lock file, which makes reviewing diffs during dependency updates easier. You can scan a `pnpm-lock.yaml` diff and quickly see which packages changed and what new transitive dependencies were pulled in.

## The content-addressable store advantage

One concern people have about lock files is that they tie you to specific versions. With pnpm, updating is straightforward, and the underlying storage model makes it painless.

pnpm stores every package version once in a global content-addressable store on your machine (typically at `~/.local/share/pnpm/store`). When you install packages in a project, pnpm creates hard links from `node_modules` into that store rather than copying files. The result:

- **Disk space savings.** Ten projects using React 19.0.2 share a single copy on disk. With npm, you would have ten copies.
- **Faster installs.** Hard-linking a file is nearly instant compared to downloading and writing a fresh copy.
- **Lock file stays relevant.** Because the store is content-addressed (each package is identified by its integrity hash), the hashes in `pnpm-lock.yaml` directly correspond to what is on disk. The lock file and the store work together.

This storage model is one of the main reasons teams switch to pnpm, and the lock file is what connects your project to the right entries in the store.

## Using --frozen-lockfile in CI

In local development, `pnpm install` reads the lock file and installs from it, updating the lock file only if `package.json` has changed. That is fine for daily work. In CI, you want stricter behavior.

```bash
pnpm install --frozen-lockfile
```

This flag tells pnpm: install exactly what the lock file says, and fail if there is any mismatch between `package.json` and `pnpm-lock.yaml`. If someone forgot to run `pnpm install` after changing `package.json` and committed an out-of-date lock file, the CI build fails instead of silently resolving different versions.

This is equivalent to `npm ci` in the npm world. Use it in every CI pipeline — GitHub Actions, Vercel, Netlify, or whatever you deploy with.

A typical GitHub Actions step:

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

If you are using Vercel or Netlify, they detect pnpm automatically when they see `pnpm-lock.yaml` in your repo. Another reason it needs to be committed.

## Handling merge conflicts

Lock file merge conflicts are the number one reason people consider not committing lock files. With pnpm, this is a non-issue.

When two branches modify dependencies and you merge them, git will flag conflicts in `pnpm-lock.yaml`. The fix is simple:

```bash
# Accept either side (it does not matter which)
git checkout --theirs pnpm-lock.yaml

# Then regenerate the lock file from the merged package.json
pnpm install

# Stage and continue
git add pnpm-lock.yaml
git commit
```

Running `pnpm install` after a merge cleanly regenerates the lock file based on the current `package.json`. You do not need to manually resolve YAML conflicts line by line. The lock file is a generated artifact — let pnpm regenerate it.

This is one area where pnpm handles things more gracefully than npm. The `pnpm install` command reliably produces a correct lock file from whatever state `package.json` is in after the merge.

## pnpm workspaces and monorepos

If you are using pnpm workspaces (a monorepo with multiple packages), pnpm generates a single `pnpm-lock.yaml` at the root of the workspace. This is by design — one lock file tracks every package in the monorepo.

```
my-monorepo/
  pnpm-lock.yaml        # One lock file for everything
  pnpm-workspace.yaml   # Defines which directories are packages
  packages/
    app/
      package.json
    shared-lib/
      package.json
```

Commit the root `pnpm-lock.yaml`. Do not try to create separate lock files per package — pnpm does not work that way, and attempting it will cause problems.

The single lock file approach means that dependency updates in one package are visible in the same diff as changes to other packages. This makes it easier to review what a dependency bump affects across your entire monorepo.

## Your .gitignore

Make sure your `.gitignore` includes `node_modules/` but does not include `pnpm-lock.yaml`:

```gitignore
# Dependencies — never commit
node_modules/

# pnpm store metadata — never commit
.pnpm-store/

# Do NOT add pnpm-lock.yaml here
```

If you inherited a project where `pnpm-lock.yaml` is in `.gitignore`, remove that line and commit the lock file. Every collaborator and every CI run should use the same lock file going forward.

Also commit `pnpm-workspace.yaml` if you have one. That file defines your monorepo structure and pnpm needs it to resolve the dependency graph correctly.

## The bottom line

Commit `pnpm-lock.yaml`. It gives you reproducible installs, faster CI, supply chain security through integrity hashes, and predictable dependency updates. Merge conflicts are trivially resolved by running `pnpm install`. There is no downside.

For the full breakdown of lock file strategies across npm, Yarn, and pnpm, see [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore). If you are deciding between npm and pnpm for your project, [npm vs pnpm](/devops-and-tools/npm-vs-pnpm) covers the tradeoffs. And if you are also working with npm, see [Should You Commit package-lock.json?](/devops-and-tools/should-you-commit-package-lock-json).
