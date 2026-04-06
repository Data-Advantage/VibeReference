# Should You Commit node_modules to Git?

No. Never commit `node_modules/` to your Git repository.

This is one of the most common mistakes JavaScript developers make, especially solo founders and vibe coders shipping their first project. You install your dependencies, run `git add .`, push to GitHub, and suddenly your repository is 500MB. Your pushes take forever. Your diffs are unreadable. Your CI is slow. And none of it was necessary, because `node_modules/` is entirely reproducible from two files you already have: `package.json` and your lock file.

If you've already committed it, this guide covers how to fix that too.

## Why node_modules should never be in Git

There are three reasons, and each one is sufficient on its own.

### It's enormous

The `node_modules/` directory is far larger than most developers expect. Here are typical sizes for real-world projects:

| Project type | Approximate node_modules size |
|---|---|
| Simple static site (Vite + React) | 150-250 MB |
| Next.js app with a few libraries | 300-500 MB |
| Full-stack app with ORM, testing, linting | 500-800 MB |
| Monorepo or enterprise project | 1 GB+ |

For comparison, your actual source code is probably 1-10 MB. Committing `node_modules/` means your repository is 99% dependency code that no one on your team wrote, no one reviews, and no one reads. Git stores the full history of every file, so even after you delete `node_modules/` from the working tree, it lives in your `.git/` folder forever unless you rewrite history.

GitHub has a hard limit of 100 MB per file and a soft recommendation of keeping repositories under 1 GB total. A single `node_modules/` commit can blow past both.

### It's completely reproducible

Your `package.json` declares which packages your project needs. Your lock file (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) records the exact versions, download URLs, and cryptographic hashes of every resolved dependency.

Together, these two files are a complete recipe for rebuilding `node_modules/` from scratch. Running `npm ci` or `pnpm install --frozen-lockfile` reads the lock file and installs the exact same dependency tree every time — same versions, same structure, byte-for-byte identical. No resolution, no network negotiation, no ambiguity.

Committing `node_modules/` is like committing compiled binaries alongside your source code. The source (package.json + lock file) already contains everything needed to produce the output. For a deeper look at why lock files matter, see [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore).

### It contains platform-specific binaries

This is the reason most people don't know about. Many npm packages include native binaries compiled for your specific operating system and CPU architecture. Packages like `esbuild`, `swc`, `sharp`, `better-sqlite3`, and `fsevents` ship different compiled code for macOS ARM, macOS Intel, Linux x64, Linux ARM, and Windows.

When you run `npm install` on your Mac, `node_modules/` gets binaries built for macOS. If you commit that and someone clones your repo on Linux — or your CI server runs Ubuntu — those binaries won't work. The project breaks with confusing errors about invalid ELF headers or missing dynamic libraries.

This isn't an edge case. It affects some of the most popular tools in the JavaScript ecosystem. Your `node_modules/` is not portable between machines, even if those machines run the same Node.js version.

## What to do instead

Commit `package.json` and your lock file. Add `node_modules/` to `.gitignore`. Install dependencies as a build step.

### Your .gitignore

Every JavaScript project should have this line in `.gitignore`:

```
node_modules/
```

If you're starting a new project, most scaffolding tools (Create React App, `create-next-app`, Vite's `create` command) already include this. If yours doesn't, add it now.

### Installing dependencies in CI and on new machines

Instead of relying on a committed `node_modules/`, run the install command that reads your lock file exactly:

```bash
# npm — use ci, not install
npm ci

# pnpm
pnpm install --frozen-lockfile

# yarn classic (v1)
yarn install --frozen-lockfile

# yarn berry (v2+)
yarn install --immutable
```

The `--frozen-lockfile` and `--immutable` flags ensure the install fails if the lock file is out of date or missing, rather than silently modifying it. This is exactly what you want in CI: deterministic installs with no surprises. For more on choosing between npm and pnpm, see [npm vs pnpm](/devops-and-tools/npm-vs-pnpm).

These commands are fast. On a modern CI server, `npm ci` typically completes in 15-30 seconds for a medium-sized project. With caching enabled (most CI providers support caching `node_modules/` or the package manager's global cache between runs), subsequent installs are even faster.

## If you already committed node_modules

If `node_modules/` is already in your Git history, here's how to fix it.

### Step 1: Add it to .gitignore

```bash
echo "node_modules/" >> .gitignore
```

### Step 2: Remove it from Git tracking (but keep the files locally)

```bash
git rm -r --cached node_modules/
```

The `--cached` flag is critical. It removes the files from Git's index without deleting them from your filesystem. Your local `node_modules/` stays intact, so your project keeps working.

### Step 3: Commit the removal

```bash
git add .gitignore
git commit -m "Remove node_modules from version control"
```

### Step 4 (optional): Remove it from Git history entirely

The steps above stop tracking `node_modules/` going forward, but the old commits still contain it. Your repository's `.git/` folder remains bloated. If you need to shrink the repository, you'll need to rewrite history using a tool like [git-filter-repo](https://github.com/newren/git-filter-repo):

```bash
# Install git-filter-repo first (pip install git-filter-repo)
git filter-repo --path node_modules/ --invert-paths
```

**Warning**: this rewrites commit hashes. Every collaborator will need to re-clone the repository. Only do this if the repository size is genuinely causing problems.

## The offline builds argument

Some teams argue they need `node_modules/` committed for offline or hermetic builds — environments where network access is restricted or the npm registry might be unavailable. This is a real concern, but committing `node_modules/` is still the wrong solution because of the platform-specific binary problem.

Better alternatives exist:

**npm pack / tarballs.** You can vendor dependencies as compressed tarballs and install from a local directory. This is portable across platforms because the package manager handles binary selection at install time.

**Yarn Berry zero-install.** Yarn v2+ supports a "zero-install" workflow where you commit `.yarn/cache/` — a directory of compressed dependency archives — instead of `node_modules/`. The cache is platform-independent (binaries are resolved at install time), much smaller than an unpacked `node_modules/`, and works offline. If your project uses Yarn Berry, this is the sanctioned approach.

**Private registry mirror.** For enterprise environments, tools like Verdaccio or Artifactory can mirror the npm registry on your internal network. Your CI installs from the mirror, never touching the public internet.

All of these approaches are smaller, more portable, and more reliable than committing a raw `node_modules/` directory.

## Quick reference

| Do this | Not this |
|---|---|
| Commit `package.json` | Commit `node_modules/` |
| Commit your lock file ([which one?](/devops-and-tools/should-you-commit-package-lock-json)) | Rely on `npm install` resolving ranges fresh |
| Add `node_modules/` to `.gitignore` | Forget `.gitignore` and run `git add .` |
| Run `npm ci` in CI | Copy `node_modules/` between machines |
| Use Yarn Berry zero-install for offline needs | Commit `node_modules/` for offline builds |

## Summary

Your Git repository should contain the code you write, the configuration that defines your project, and the lock files that pin your dependencies. It should not contain the output of running `npm install`. That output is large, platform-specific, and completely reproducible from files you're already committing.

Add `node_modules/` to your `.gitignore`. Run `npm ci` or `pnpm install --frozen-lockfile` whenever you need a fresh install. That's it. For a broader look at what belongs in your repository and what doesn't, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
