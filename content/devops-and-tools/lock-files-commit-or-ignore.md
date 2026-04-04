# Lock Files: package-lock.json, yarn.lock, pnpm-lock.yaml — Commit or Ignore?

The debate is over. **Commit your lock files.**

If you've been Googling "should I commit package-lock.json" and finding contradicting advice, that's because the JavaScript ecosystem had a genuine disagreement about this from 2016 to 2018. npm itself even added `package-lock.json` to `.gitignore` by default in early versions, then reversed course. The confusion persists in outdated blog posts, but the consensus in 2025-2026 is clear: lock files belong in version control.

This guide explains why, covers every major package manager's lock file, and handles the edge cases where the answer is more nuanced.

## What lock files actually do

Your `package.json` (or `Gemfile`, `pyproject.toml`, `Cargo.toml`, `go.mod`) specifies what your project *wants* — packages and version ranges:

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0"
  }
}
```

The `^` means "this version or any compatible newer version." When you run `npm install`, npm resolves those ranges to specific versions, downloads them, and records the result in `package-lock.json`:

```json
{
  "packages": {
    "node_modules/react": {
      "version": "19.0.2",
      "resolved": "https://registry.npmjs.org/react/-/react-19.0.2.tgz",
      "integrity": "sha512-abc123..."
    }
  }
}
```

This lock file captures the *exact* resolution: version number, download URL, and cryptographic hash. When another developer (or your CI server) runs `npm ci`, it installs precisely these versions — no resolution, no range interpretation, no surprises.

Without the lock file, `npm install` resolves ranges fresh every time. Developer A installs on Monday and gets `react@19.0.2`. Developer B installs on Thursday and gets `react@19.0.3` because a patch was released Tuesday. Usually this is fine. Occasionally it breaks everything, and neither developer understands why their environments behave differently.

## The case for committing: reproducibility

Lock files solve the "works on my machine" problem at the dependency level. Here's what you get by committing them:

**Identical environments.** Every developer, every CI run, every deployment installs the exact same dependency tree. Not "compatible versions" — the *same* versions, from the same URLs, verified by the same hashes.

**Faster CI installs.** `npm ci` (and `pnpm install --frozen-lockfile`) reads the lock file and installs directly without resolving ranges. This is significantly faster than `npm install`, which must check the registry for the latest compatible versions.

**Security verification.** Lock files include integrity hashes. If a package is tampered with on the registry, the hash mismatch is caught during install. This is a real security layer, not theoretical — supply chain attacks against npm packages have happened.

**Predictable updates.** When you update a package, the lock file diff shows you exactly what changed. You can review whether a dependency update pulls in new sub-dependencies, changes versions of shared packages, or makes other unexpected changes.

## Lock files across package managers

### npm: `package-lock.json`

npm's lock file. Generated automatically when you run `npm install`. Contains the full dependency tree with exact versions and integrity hashes.

```bash
# Install from lock file exactly (CI-friendly)
npm ci

# Update lock file after changing package.json
npm install
```

**Key behavior:** `npm ci` deletes `node_modules/` entirely and installs fresh from the lock file. It fails if the lock file is out of sync with `package.json`. This is the correct command for CI pipelines — it's faster and more predictable than `npm install`.

### Yarn: `yarn.lock`

Yarn's lock file uses a human-readable format (not JSON). It records the same information — exact versions, resolved URLs, and integrity hashes.

```bash
# Install from lock file exactly
yarn install --frozen-lockfile

# Yarn Berry (v2+)
yarn install --immutable
```

**Key behavior:** `--frozen-lockfile` prevents Yarn from modifying the lock file during install. If `package.json` has changed but the lock file hasn't been updated, Yarn errors out instead of silently resolving new versions.

### pnpm: `pnpm-lock.yaml`

pnpm's lock file is YAML-based. It records the same dependency resolution data as npm and Yarn, but also tracks pnpm's stricter dependency structure.

```bash
# Install from lock file exactly
pnpm install --frozen-lockfile
```

**Key behavior:** pnpm has a built-in advantage for lock file management — it handles merge conflicts more gracefully than npm or Yarn. After a conflicted merge, running `pnpm install` automatically regenerates a clean `pnpm-lock.yaml` from the merged `package.json`. No manual conflict resolution needed in most cases.

### Ruby: `Gemfile.lock`

Bundler's lock file. Same principle as JavaScript lock files — pins exact gem versions.

```bash
# Install from lock file
bundle install

# Update lock file
bundle update
```

The Ruby community settled the "commit or ignore" question early. Bundler's documentation has always recommended committing `Gemfile.lock`. It's one of the few ecosystems where this was never controversial.

### Python: `poetry.lock`

Poetry's lock file pins exact versions of Python packages.

```bash
# Install from lock file
poetry install

# Update lock file
poetry update
```

The Python ecosystem historically used `requirements.txt` with pinned versions (e.g., `requests==2.31.0`), which served as both manifest and lock file. Poetry separates these concerns: `pyproject.toml` is the manifest, `poetry.lock` is the lock file. Commit both.

### Go: `go.sum`

Go modules use `go.sum` as a checksum database — it records cryptographic hashes for every module version your project has ever downloaded.

```bash
# Tidy up go.sum
go mod tidy
```

`go.sum` is different from other lock files: it's append-only and can contain entries for module versions you no longer use. Run `go mod tidy` periodically to clean it up. Always commit both `go.mod` (manifest) and `go.sum` (checksums).

### Rust: `Cargo.lock`

Cargo's lock file. This is the one ecosystem with a meaningful exception.

```bash
# Build (generates/uses Cargo.lock)
cargo build
```

**For applications:** Commit `Cargo.lock`. You want reproducible builds.

**For libraries:** Don't commit `Cargo.lock`. When someone depends on your library, they generate their own lock file that pins the entire dependency tree. Your library's `Cargo.lock` is irrelevant to consumers and creates unnecessary merge conflicts during development.

This is an explicit recommendation from the Rust team, not just community convention.

## Handling merge conflicts in lock files

Lock file merge conflicts look terrifying. A `package-lock.json` conflict might span thousands of lines of JSON. Don't try to resolve it manually.

**The fix for every package manager:**

1. Accept either side of the conflict (or just pick one, it doesn't matter).
2. Run the package manager's install command.
3. The lock file regenerates correctly from the merged `package.json`.

```bash
# After resolving conflicts in package.json:

# npm
git checkout --theirs package-lock.json
npm install

# Yarn
git checkout --theirs yarn.lock
yarn install

# pnpm (often just this)
pnpm install
```

pnpm handles this most gracefully — in many cases, `pnpm install` resolves the conflict without you needing to pick a side first.

**For Gemfile.lock:**
```bash
git checkout --theirs Gemfile.lock
bundle install
```

The generated lock file will be correct because it is derived from the merged manifest file.

## The library exception

For most projects, the answer is "always commit." But there's one recurring exception: **libraries published to a package registry.**

When you publish an npm package, `package-lock.json` is not included in the published tarball. Consumers of your library generate their own lock file that pins the entire tree. Your lock file is only relevant to *your* development workflow.

Some library maintainers still commit the lock file (for reproducible CI builds of the library itself). Others gitignore it to reduce merge conflict noise. Both approaches are valid. If your team finds lock file conflicts annoying during frequent dependency bumps, ignoring it for libraries is reasonable.

**The rule:** If someone installs your code as a dependency, your lock file doesn't affect them. If someone clones your code to run it, your lock file ensures they get the same environment you tested against.

## Should I commit multiple lock files?

No. **Pick one package manager per project.** If your repo has both `package-lock.json` and `pnpm-lock.yaml`, something went wrong.

Having multiple lock files means different developers might be using different package managers, getting different dependency resolutions, and creating hard-to-diagnose bugs.

```bash
# Check what your project uses
ls package-lock.json 2>/dev/null && echo "npm"
ls yarn.lock 2>/dev/null && echo "yarn"
ls pnpm-lock.yaml 2>/dev/null && echo "pnpm"
```

If you find multiple lock files, delete the ones from package managers your team isn't using, add them to `.gitignore`, and document the chosen package manager in your README.

Some tools enforce this. pnpm can be configured to fail if it detects `package-lock.json`. Corepack (built into Node.js) can enforce a specific package manager version for the project.

## What about `.npmrc` and other PM config files?

Package manager config files (`.npmrc`, `.yarnrc.yml`, `.pnpmrc`) are separate from lock files, but they affect how dependencies are resolved. **Commit them** if they contain project-specific settings (registry URLs, workspace config, strictness options).

```bash
# .npmrc — commit project-specific settings
engine-strict=true
save-exact=true

# But NEVER commit auth tokens
# //registry.npmjs.org/:_authToken=your-secret-token  ← NEVER
```

If `.npmrc` contains registry auth tokens, add it to `.gitignore` and use environment variables instead.

## Quick decision tree

```
Is this a lock file? (package-lock.json, yarn.lock, pnpm-lock.yaml, etc.)
├── Is this a published library?
│   ├── Yes → Committing is optional (but still recommended for CI reproducibility)
│   └── No → COMMIT IT
└── Is there more than one lock file in the project?
    ├── Yes → Pick one package manager, delete the others
    └── No → Good. Commit the one you have.
```

## Summary

| Lock File | Ecosystem | Commit? |
|---|---|---|
| `package-lock.json` | npm (JavaScript) | Yes |
| `yarn.lock` | Yarn (JavaScript) | Yes |
| `pnpm-lock.yaml` | pnpm (JavaScript) | Yes |
| `Gemfile.lock` | Bundler (Ruby) | Yes |
| `poetry.lock` | Poetry (Python) | Yes |
| `go.sum` | Go Modules | Yes |
| `Cargo.lock` | Cargo (Rust) | Apps: yes. Libraries: no. |

The answer hasn't changed in years, and it won't change. Lock files are how you guarantee reproducible builds. Commit them.

## Keep reading

- [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide) — the full reference for every file type
- [.env Files: The Complete Guide to Environment Variables in Git](/devops-and-tools/env-files-git-guide) — the other file developers most often get wrong
- [npm vs pnpm](/devops-and-tools/npm-vs-pnpm) — choosing between the two most popular JavaScript package managers
