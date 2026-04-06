# Should You Commit the dist/ Folder to Git?

No. Add `dist/` to your `.gitignore` and let your build pipeline generate it fresh every time.

The `dist/` directory — short for "distributable" — is build output. It contains compiled, bundled, minified, and optimized files that your toolchain generates from your source code. You didn't write those files. Your bundler did. They're reproducible artifacts, and they don't belong in version control.

The same rule applies to `build/`, `out/`, `.output/`, and every other directory your framework uses to store compiled output. If a tool generates it from your source code, Git shouldn't track it.

## What dist/ actually contains

When you run `npm run build` or your framework's build command, the output typically lands in `dist/` (or an equivalent directory). Here's what's inside:

- **Compiled JavaScript** — TypeScript transpiled to JavaScript, JSX converted to `React.createElement` calls, modern syntax downleveled for browser compatibility
- **Bundled files** — hundreds of source modules combined into a few optimized chunks with hashed filenames like `index-3a8f2c.js`
- **Minified code** — whitespace stripped, variable names shortened, dead code eliminated. Completely unreadable by humans
- **Processed CSS** — Tailwind utilities purged and compiled, Sass/Less converted to CSS, vendor prefixes added, everything minified
- **Optimized assets** — images compressed, SVGs inlined, fonts subset, static files copied with content hashes for cache busting
- **Source maps** — `.map` files that connect minified output back to original source for debugging

None of this is authored code. Every file in `dist/` is a deterministic transformation of your source files, your configuration, and your dependencies. Given the same inputs, the build produces the same outputs.

## Why committing build output causes problems

### Repository bloat

Build output is large relative to source code. A project with 5 MB of source files might produce 20-50 MB of build output. Every time you change a single line of source code and rebuild, the hashed filenames change, so Git sees the old files as deleted and the new files as added. Your repository grows with every commit, and that history is permanent.

Over weeks of active development, committed build output can easily add hundreds of megabytes to your Git history. Clones get slower. Pulls take longer. GitHub's repository size warnings start appearing.

### Merge conflicts on generated files

This is where committed build output goes from annoying to actively destructive. Two developers work on different features. Both run a build. Both commit their `dist/` directories. When they try to merge, Git reports conflicts in minified JavaScript files containing thousands of characters on a single line.

You cannot meaningfully resolve a merge conflict in `index-3a8f2c.js`. The file is machine-generated gibberish to human eyes. The only resolution is to rebuild — which means the committed version was pointless in the first place.

Even if you're a solo developer, rebasing branches that include build output creates the same problem. You'll spend time resolving conflicts in files that should never have been tracked.

### Stale artifacts

If someone changes source code but forgets to rebuild before committing, the `dist/` directory is now out of sync with the source. The repository contains build output that doesn't match the current code. Anyone who deploys from that commit ships stale, incorrect files.

This is a silent failure. There's no warning. The mismatch only shows up when users encounter bugs that exist in the deployed build but not in the source code you're reading. Debugging this is miserable.

When your CI/CD pipeline builds fresh on every deploy, this entire category of bug is impossible.

## How CI/CD handles it

Every modern deployment platform builds your project from source. That's the whole point.

**Vercel** clones your repository, runs `npm install` (or `pnpm install`), then runs your build command. It serves the resulting output. It never looks for a pre-built `dist/` directory in your repo.

**Netlify** does the same. Clone, install, build, deploy. Your build command is configured in `netlify.toml` or the Netlify dashboard.

**GitHub Pages with GitHub Actions** runs your build in a workflow, then deploys the output to the Pages environment.

**AWS Amplify, Railway, Render, Fly.io** — they all follow the same pattern. Source code goes in, build happens in CI, output gets deployed.

The build step takes seconds to minutes depending on your project size. That's a small price for eliminating an entire class of bugs and keeping your repository clean.

If you're deploying manually by copying files to a server, you still shouldn't commit `dist/`. Build locally, deploy the output, but keep it out of Git. Better yet, set up a basic CI pipeline so you stop deploying manually.

## The npm package exception

There's one scenario where `dist/` matters for distribution: publishing npm packages.

When you publish an npm package, the published tarball needs to include the compiled output because your consumers install the package and import from it directly. They shouldn't need to build your package themselves.

But even here, you don't commit `dist/` to Git. Instead, you use the `files` field in `package.json` to control what gets included in the published package:

```json
{
  "name": "your-package",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ]
}
```

The `files` array tells npm which files and directories to include in the tarball when you run `npm publish`. It's completely independent of what Git tracks.

Your workflow becomes: build locally (or in CI), then publish. The `dist/` directory is in `.gitignore` but included in the npm package. Git never sees it. npm always includes it. Both tools are happy.

Most modern npm package tooling — [tsup](https://github.com/egoist/tsup), unbuild, pkgroll — is designed around exactly this workflow: source in Git, compiled output in the published package, nothing committed that doesn't need to be.

## Build output directories to ignore

Different frameworks use different output directories. Here are the common ones:

| Framework / Tool | Output directory |
|---|---|
| Vite | `dist/` |
| Webpack | `dist/` or `build/` |
| Create React App | `build/` |
| Next.js | `.next/` |
| Nuxt | `.nuxt/`, `.output/` |
| Astro | `dist/` |
| SvelteKit | `.svelte-kit/`, `build/` |
| Remix | `build/`, `.cache/` |
| Vercel CLI | `.vercel/` |
| TypeScript compiler | `dist/`, `lib/`, `out/` |

All of these should be in your `.gitignore`.

## .gitignore setup

Add these lines to your `.gitignore` to cover the most common build output directories:

```gitignore
# Build output
dist/
build/
out/
.output/

# Framework-specific build directories
.next/
.nuxt/
.svelte-kit/
.vercel/
.cache/

# TypeScript build info
*.tsbuildinfo
```

For a broader view of which framework-specific directories to ignore, see [Should You Commit the .next/ Directory?](/devops-and-tools/should-you-commit-next-directory) and [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).

## If you already committed dist/

If `dist/` is already tracked in your repository, adding it to `.gitignore` alone won't remove it. Git continues tracking files it already knows about, even if they match a `.gitignore` pattern.

Here's how to fix it:

**Step 1: Add `dist/` to `.gitignore`**

```
dist/
```

**Step 2: Remove `dist/` from Git's tracking without deleting your local files**

```bash
git rm -r --cached dist/
```

The `--cached` flag is critical. It removes the files from Git's index (so they stop being tracked) but leaves them on your filesystem. Without `--cached`, Git deletes them from disk.

**Step 3: Commit the removal**

```bash
git add .gitignore
git commit -m "Remove dist/ from version control"
```

**Step 4: Verify**

```bash
git status
```

You should see `dist/` listed under "Untracked files" or not shown at all (because `.gitignore` is now hiding it). It should not appear under "Changes to be committed" or "Changes not staged for commit."

This same process works for `build/`, `out/`, or any other build output directory you need to untrack. If you've done something similar with `node_modules/`, the steps are identical — see [Should You Commit node_modules?](/devops-and-tools/should-you-commit-node-modules) for the full walkthrough.

Note that the old `dist/` files remain in your Git history. For most projects, that's fine. If the committed build output was truly massive and you need to reclaim space, you'd need to rewrite history with `git filter-branch` or BFG Repo-Cleaner — but that's a heavy operation you usually don't need.

## The short version

Source code goes in Git. Build output doesn't. Your toolchain generates `dist/` from your source — let it regenerate on every deploy. Your repository stays small, your merges stay clean, and your deployed code always matches your source.
