# Should You Commit yarn.lock?

**Yes. Always commit `yarn.lock` to version control.**

If you're here from a search engine and just need the answer, that's it. Commit it. The rest of this article explains why, covers the differences between Yarn Classic and Yarn Berry, and handles the practical questions you'll run into.

For the broader reasoning behind committing lock files across all package managers, see [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore).

## Why you commit yarn.lock

`yarn.lock` pins every dependency in your project to an exact version. Your `package.json` declares version ranges:

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0"
  }
}
```

Those `^` ranges mean "this version or any compatible newer version." Without a lock file, `yarn install` resolves those ranges fresh every time. You install on Monday and get `react@19.0.2`. Your CI server installs on Wednesday and gets `react@19.0.3` because a patch shipped Tuesday. Usually fine. Occasionally catastrophic.

`yarn.lock` records the exact resolution:

```
react@^19.0.0:
  version "19.0.2"
  resolved "https://registry.yarnpkg.com/react/-/react-19.0.2.tgz#abc123..."
  integrity sha512-abc123...
```

When `yarn.lock` is committed and present, `yarn install` respects those pinned versions instead of resolving fresh. Every developer, every CI run, every deployment gets the same dependency tree.

The benefits are the same as any lock file:

- **Reproducible builds.** Same code, same dependencies, same behavior everywhere.
- **Faster CI.** Yarn reads the lock file directly instead of querying the registry for latest compatible versions.
- **Security verification.** Integrity hashes catch tampered packages.
- **Visible dependency changes.** When you update a package, the lock file diff shows exactly what changed, including transitive dependencies.

## What yarn.lock actually contains

Unlike npm's `package-lock.json` (which is JSON), `yarn.lock` uses a custom human-readable format. Each entry maps a dependency specifier to an exact version, a resolved URL, an integrity hash, and its own sub-dependencies:

```
lodash@^4.17.21:
  version "4.17.21"
  resolved "https://registry.yarnpkg.com/lodash/-/lodash-4.17.21.tgz#679591c564c3bffaae8454cf0b3df370c3d6911c"
  integrity sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==

express@^4.18.2:
  version "4.18.2"
  resolved "https://registry.yarnpkg.com/express/-/express-4.18.2.tgz#..."
  integrity sha512-...
  dependencies:
    accepts "~1.3.8"
    body-parser "1.20.1"
    ...
```

This format is easier to read in diffs than npm's deeply nested JSON. You can scan a `yarn.lock` diff and quickly see which packages changed versions. You're not expected to edit this file by hand, but it's nice that you can actually read it when you need to.

## Yarn Classic vs Yarn Berry (v2+)

Yarn has two major versions that behave differently, and this matters for how you handle `yarn.lock` in your project.

### Yarn Classic (v1)

The original Yarn. Still widely used. It works similarly to npm: dependencies live in `node_modules/`, and `yarn.lock` records the resolution.

```bash
# Install from lock file exactly (CI command)
yarn install --frozen-lockfile

# Update lock file after changing package.json
yarn install
```

`--frozen-lockfile` is the critical flag for CI pipelines. It tells Yarn to fail if `yarn.lock` would need to be modified. This catches situations where someone updated `package.json` but forgot to run `yarn install` and commit the updated lock file.

### Yarn Berry (v2, v3, v4)

The modern rewrite. Berry changes several things that affect how you work with the lock file and Git:

```bash
# Install from lock file exactly (CI command)
yarn install --immutable

# Update lock file after changing package.json
yarn install
```

`--immutable` is Berry's equivalent of `--frozen-lockfile`. Same purpose, different flag name.

Berry also introduced **Plug'n'Play (PnP)** as the default install strategy, which eliminates `node_modules/` entirely. Dependencies are stored as compressed archives in `.yarn/cache/`. This creates additional files you need to think about for Git.

## .gitignore for Yarn Berry

If you're using Yarn Berry, your `.gitignore` needs attention beyond just `yarn.lock`. The right configuration depends on whether you're using zero-installs.

### Without zero-installs (most projects)

```gitignore
# Yarn Berry
.yarn/cache/
.yarn/install-state.gz
.pnp.*

# Keep these tracked
# .yarn/patches/
# .yarn/plugins/
# .yarn/releases/
# .yarn/sdks/
```

This is the common setup. You commit `yarn.lock` and the Yarn configuration files, but not the cache or install state. CI runs `yarn install --immutable` to populate the cache from the lock file.

### With zero-installs

Zero-installs means committing the `.yarn/cache/` directory so that `yarn install` doesn't need to download anything. In this case, you track `.yarn/cache/` but still ignore `.yarn/install-state.gz`. This makes `git clone` heavier but eliminates the install step entirely.

For most solo founders and small teams, skip zero-installs. The tradeoff isn't worth it until your dependency tree is stable and you're optimizing CI times at scale.

## CI configuration

Use the strict install command in every CI pipeline:

```yaml
# GitHub Actions example — Yarn Classic
steps:
  - uses: actions/checkout@v4
  - run: yarn install --frozen-lockfile
  - run: yarn build
  - run: yarn test

# GitHub Actions example — Yarn Berry
steps:
  - uses: actions/checkout@v4
  - run: yarn install --immutable
  - run: yarn build
  - run: yarn test
```

Both flags do the same thing: install exactly what the lock file says, and fail if the lock file is missing or out of sync. This prevents your CI from silently resolving different versions than what you tested locally.

## Handling merge conflicts in yarn.lock

Merge conflicts in `yarn.lock` look intimidating because the file is large and auto-generated. Don't try to resolve them by hand.

The fix is simple:

```bash
# Accept either side (doesn't matter which)
git checkout --theirs yarn.lock

# Regenerate from the merged package.json
yarn install

# Stage the regenerated lock file
git add yarn.lock

# Continue the merge
git merge --continue
```

Yarn resolves everything cleanly from the merged `package.json`. The only time this gets tricky is when both branches added conflicting version ranges to `package.json` itself, and that's a `package.json` conflict to resolve first.

## Don't mix lock files

If your project has both `yarn.lock` and `package-lock.json`, something went wrong. Pick one package manager and stick with it.

Both npm and Yarn will happily install your packages regardless of which lock file exists. But they resolve dependencies differently, so maintaining two lock files means they'll drift apart. You'll get different dependency trees depending on which tool someone happens to run.

If you're on Yarn, delete `package-lock.json` and add it to `.gitignore`. If you're on npm, delete `yarn.lock` and add it to `.gitignore`. For more on choosing between package managers, see [npm vs pnpm](/devops-and-tools/npm-vs-pnpm).

## Quick reference

| Scenario | What to do |
|---|---|
| New Yarn project | `yarn install`, commit `yarn.lock` |
| CI pipeline (Classic) | `yarn install --frozen-lockfile` |
| CI pipeline (Berry) | `yarn install --immutable` |
| Merge conflict in `yarn.lock` | `git checkout --theirs yarn.lock && yarn install` |
| Both `yarn.lock` and `package-lock.json` exist | Delete one, pick a single package manager |
| Yarn Berry `.gitignore` | Ignore `.yarn/cache/`, `.yarn/install-state.gz` |

## Further reading

- [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore) covers the shared reasoning across all package managers
- [Should You Commit package-lock.json?](/devops-and-tools/should-you-commit-package-lock-json) is the npm-specific companion to this article
- [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide) covers the broader question of what to track and what to ignore
