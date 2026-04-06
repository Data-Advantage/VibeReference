# Should You Commit package-lock.json?

"Should I commit package-lock.json" is one of the most Googled questions in JavaScript development. It comes up every time a new developer sees a 20,000-line auto-generated file appear in their git diff and instinctively reaches for `.gitignore`. Stack Overflow threads from 2017 still rank high and give conflicting advice. Outdated `.gitignore` templates on GitHub still exclude it. And so the confusion persists, years after the answer became clear.

**Yes. Always commit `package-lock.json`.** This is not a matter of opinion or project preference. npm's own documentation explicitly states it should be committed. The JavaScript ecosystem consensus solidified around 2019, and nothing has changed since. You commit it because it is the only mechanism that guarantees every developer, every CI runner, and every deployment environment installs the exact same dependency tree. Without it, you are leaving reproducibility to chance.

## What package-lock.json actually does

Your `package.json` describes what your project wants in terms of dependencies, using version ranges:

```json
{
  "dependencies": {
    "next": "^15.2.0",
    "react": "^19.0.0",
    "zod": "^3.24.0"
  }
}
```

The `^` (caret) is the default range operator npm uses when you run `npm install some-package`. It means "this version or any newer version that doesn't change the leftmost non-zero digit." So `^19.0.0` allows `19.0.0`, `19.0.1`, `19.1.0`, `19.9.99` — but not `20.0.0`.

When you run `npm install`, npm resolves those ranges against the registry, picks specific versions, downloads them, and writes the results to `package-lock.json`. That file records three critical pieces of information for every package in your tree:

1. **Exact version** — not a range, but the precise version installed (e.g., `19.0.2`)
2. **Resolved URL** — the exact tarball URL the package was downloaded from
3. **Integrity hash** — a cryptographic checksum (SHA-512) that verifies the downloaded package has not been tampered with

```json
{
  "packages": {
    "node_modules/react": {
      "version": "19.0.2",
      "resolved": "https://registry.npmjs.org/react/-/react-19.0.2.tgz",
      "integrity": "sha512-Kx5aRFhUm..."
    }
  }
}
```

This applies to your direct dependencies and every transitive dependency — the full tree. A typical Next.js project has 30-50 direct dependencies and 800-1,200 packages in total. The lock file pins every single one.

## What happens without it

Without `package-lock.json` in your repository, every `npm install` resolves version ranges fresh against the npm registry. This means:

**Version drift between developers.** You install on Monday and get `zod@3.24.1`. Your collaborator installs on Wednesday after a patch release and gets `zod@3.24.2`. Usually patch releases are backward-compatible. Sometimes they are not. You now have a "works on my machine" bug that neither of you can explain, because you are running different code without knowing it.

**Version drift between local and CI.** You test locally, everything passes, you push, and CI fails. Or worse — CI passes and production breaks. The dependency versions in CI were resolved at build time, not pinned to what you tested locally.

**Version drift over time.** You clone a six-month-old project, run `npm install`, and get a completely different set of dependency versions than the original author had. If something breaks, you cannot tell whether it is your code or a dependency change.

**Supply chain risk.** Without integrity hashes, npm cannot verify that the package it downloads today is the same package that was downloaded when the project was set up. The lock file's `integrity` field provides a cryptographic guarantee against registry tampering and package substitution attacks.

All of these problems disappear when you commit the lock file.

## npm install vs npm ci

This is the distinction most developers miss, and it is the reason the lock file matters for CI pipelines specifically.

**`npm install`** reads `package.json`, resolves version ranges, downloads packages, and updates `package-lock.json` if anything changed. It is designed for development — you use it when adding, removing, or updating dependencies.

**`npm ci`** reads `package-lock.json` directly, installs exactly those versions, and fails if `package-lock.json` is missing or out of sync with `package.json`. It deletes `node_modules` and does a clean install every time. It is faster than `npm install` for clean installs because it skips the resolution step entirely.

Your CI pipeline, your Docker builds, and your deployment scripts should always use `npm ci`. This is the whole point of the lock file — it makes `npm ci` possible. Without a committed lock file, `npm ci` literally cannot run.

```yaml
# GitHub Actions example
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 22
      cache: 'npm'
  - run: npm ci
  - run: npm run build
  - run: npm test
```

## Common objections (and why they are wrong)

### "It creates huge merge conflicts"

This is the most common complaint, and it is valid — lock file merge conflicts are ugly. A single dependency change can touch hundreds of lines. But "this file sometimes has merge conflicts" is not a reason to stop tracking it. Source code has merge conflicts too.

The fix is simple. When you hit a merge conflict in `package-lock.json`, do not try to resolve it manually. Instead:

1. Accept either side of the conflict (it does not matter which)
2. Run `npm install`
3. npm regenerates a correct `package-lock.json` from the merged `package.json`
4. Stage and commit

That is it. Thirty seconds, and you have a correct lock file. Section below covers this in more detail.

### "It's auto-generated, so it doesn't belong in git"

This argument sounds logical until you look at how every other ecosystem handles it. Go commits `go.sum`. Rust commits `Cargo.lock`. Python commits `requirements.txt` (or `poetry.lock`, or `uv.lock`). Ruby commits `Gemfile.lock`. The file being auto-generated is irrelevant — what matters is that it captures state that must be shared across environments. That is exactly what version control is for.

### "My .gitignore template already ignores it"

Some older `.gitignore` templates — including old versions of GitHub's own Node template — included `package-lock.json` in the ignore list. This was a mistake from the early days of lock files (2017-2018) when npm itself was inconsistent about whether to commit it. Those templates are outdated. If yours ignores `package-lock.json`, remove that line.

Check right now:

```bash
grep "package-lock" .gitignore
```

If you see `package-lock.json` in there, delete that line.

### "The file is too big and clutters diffs"

A lock file for a mid-size project is 10,000-30,000 lines. That sounds large, but git handles it without issue. If you find lock file diffs noisy in pull requests, configure your `.gitattributes` to collapse them:

```
# .gitattributes
package-lock.json diff=lockfile
```

Or on GitHub, lock file diffs are collapsed by default in pull requests. The file is committed and tracked, but it stays out of your way during code review.

## Handling merge conflicts in package-lock.json

This comes up often enough to warrant a step-by-step process.

**Scenario:** You are merging a branch and git reports a conflict in `package-lock.json`.

**Step 1: Resolve `package.json` first.** If both branches changed `package.json`, resolve that conflict manually — it is small and human-readable. Make sure the merged `package.json` contains all the dependencies both branches intended.

**Step 2: Accept either version of `package-lock.json`.** It does not matter which:

```bash
git checkout --theirs package-lock.json
```

**Step 3: Regenerate the lock file.**

```bash
npm install
```

This reads the now-correct `package.json`, resolves all dependencies, and writes a fresh, valid `package-lock.json`.

**Step 4: Stage and continue.**

```bash
git add package.json package-lock.json
git merge --continue
```

The entire process takes under a minute. Do not attempt to manually edit `package-lock.json` — it is a machine-generated file and should be treated as one.

If you use npm v7 or later (which you should — npm v10+ ships with Node 22), npm can also handle lock file conflicts automatically during install. Running `npm install` when the lock file has conflict markers will often resolve them without any manual steps.

## The correct .gitignore

Your `.gitignore` should include `node_modules/` and should NOT include `package-lock.json`:

```gitignore
# Dependencies — never commit the installed packages
node_modules/

# Do NOT add package-lock.json here
# It must be committed for reproducible builds
```

If you are using other package managers alongside or instead of npm, the same rule applies to their lock files:

- `yarn.lock` — commit it
- `pnpm-lock.yaml` — commit it
- `bun.lockb` — commit it

Only commit the lock file for the package manager your project actually uses. If you use pnpm, commit `pnpm-lock.yaml` and ignore or delete any `package-lock.json` that appears. See [npm vs pnpm](/devops-and-tools/npm-vs-pnpm) for help choosing a package manager.

## When you might legitimately not commit it

There is one narrow exception that applied historically: npm packages published as libraries. Before npm v7 (released 2020), library authors were sometimes advised to omit `package-lock.json` because npm would publish it alongside the package, and consumers' lock files should determine the resolved versions, not the library author's.

This advice is obsolete. npm no longer includes `package-lock.json` in published packages as of v7. The lock file in a library's repository now serves exactly the same purpose as in an application — it pins development and CI dependencies for contributors to that library.

As of 2025, there is no mainstream scenario where omitting `package-lock.json` from version control is the right call.

## The bottom line

Commit `package-lock.json`. Use `npm ci` in CI. Resolve merge conflicts by running `npm install` after merging `package.json`. Ignore anyone who tells you to add it to `.gitignore` — that advice expired years ago.

For the broader picture on which generated files belong in your repository (and which do not), see [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore) and [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
