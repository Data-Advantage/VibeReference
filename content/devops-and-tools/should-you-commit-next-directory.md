# Should You Commit the .next/ Directory to Git?

No. Always add `.next/` to your `.gitignore`.

If you're building with Next.js — and most vibe coders are — you've seen the `.next/` directory appear the moment you run `next dev` or `next build`. It's large, it's noisy, and it changes every time you build. Committing it to Git bloats your repository, pollutes your diffs, and provides zero value because every deployment platform regenerates it from scratch anyway.

This is one of the easiest decisions in your Git workflow: `.next/` is build output. Build output doesn't belong in version control.

## What's inside .next/

The `.next/` directory is Next.js's build cache and compiled output. It contains everything the framework needs to serve your application, generated entirely from your source code and configuration. Here's what you'll find in there:

### Compiled pages

Every page in your `app/` or `pages/` directory gets compiled into optimized JavaScript. Server components, client components, route handlers — Next.js processes all of them and writes the results to `.next/server/` and `.next/static/`. These compiled files include the framework's runtime code, your imports resolved and bundled, and any transformations from your Babel or SWC configuration.

### Webpack / Turbopack cache

Next.js stores its bundler cache in `.next/cache/`. This is the largest subdirectory — often hundreds of megabytes — and it exists purely to speed up subsequent builds on your local machine. It has no value to anyone else, and it's entirely machine-specific.

### Server bundles

Server-side rendering and API routes get compiled into Node.js bundles stored in `.next/server/`. These bundles are tied to the Node.js version and the operating system they were built on. A server bundle compiled on your Mac won't necessarily work on your Linux CI server.

### Static assets

Optimized images, fonts, and other static files that Next.js processes end up in `.next/static/`. These include content-hashed filenames that change every build, meaning every build generates a different set of file names even if the source hasn't changed.

### Build manifest

Files like `build-manifest.json`, `react-loadable-manifest.json`, and various route manifests tell the Next.js runtime which chunks to load for each page. These are generated fresh on every build and are tightly coupled to the specific compilation output.

All of this is **derived content**. It's produced deterministically from your source code, your dependencies, and your `next.config.js`. There's no reason to store derived content in version control when you can regenerate it in seconds.

## Why .next/ should be ignored

Three reasons, each sufficient on its own.

### It's regenerated on every build

Running `next build` produces the entire `.next/` directory from scratch. Running `next dev` produces it incrementally as you work. Either way, the contents are fully determined by your source files. Committing it is redundant — like checking in a PDF that's generated from a LaTeX file you're already tracking.

### It's platform-specific

The compiled output in `.next/` can differ between operating systems, Node.js versions, and CPU architectures. The SWC compiler that Next.js uses produces platform-specific binaries. The webpack cache includes machine-specific paths. Committing `.next/` from your macOS laptop and then pulling it on a Linux server creates potential for subtle, hard-to-debug mismatches.

### It's huge and noisy

A typical Next.js project's `.next/` directory ranges from 50 MB to 500 MB depending on the number of pages and the size of your dependency tree. The cache directory alone can be hundreds of megabytes. Every build changes thousands of files. If you committed `.next/`, every deployment would generate massive diffs full of minified JavaScript that no human can review. Your Git history would balloon, your clones would slow down, and `git status` would become unusable during development.

## How Vercel and Netlify handle it

If you deploy to Vercel or Netlify — the two most common platforms for Next.js apps — neither expects `.next/` to exist in your repository. Their build process is straightforward:

1. Clone your repository
2. Run `npm ci` (or `pnpm install --frozen-lockfile`) to install dependencies
3. Run `next build` to generate `.next/`
4. Deploy the output

The `.next/` directory is created fresh on the deployment server, compiled for the target environment, with the correct Node.js version and platform binaries. This is exactly how it should work. Your repository provides the source; the platform produces the build.

The same applies to Railway, Render, Fly.io, AWS Amplify, and any other platform that supports Next.js. They all run `next build` during deployment. None of them need or want a pre-built `.next/` directory in your repo.

## next.config.js — commit this one

Don't confuse build output with build configuration. Your `next.config.js` (or `next.config.mjs`, or `next.config.ts`) is source code. It defines how Next.js behaves: image optimization settings, redirects, rewrites, environment variables, experimental features, and output mode.

This file absolutely belongs in your repository. Without it, `next build` won't produce the correct output. It's small, human-readable, and rarely changes. Commit it, review changes to it carefully, and treat it like any other configuration file in your project.

Other Next.js configuration files to commit:

- `next-env.d.ts` — TypeScript declarations, auto-generated but should be committed per Next.js docs
- `middleware.ts` — your middleware source code
- `postcss.config.js` — PostCSS configuration if you use Tailwind CSS
- `tailwind.config.ts` — Tailwind CSS configuration

## Static exports and the out/ directory

If you're using Next.js with `output: 'export'` in your `next.config.js`, the build process creates an `out/` directory instead of (or in addition to) `.next/`. This `out/` directory contains a fully static site — HTML, CSS, JavaScript, and images — ready to be uploaded to any static hosting provider.

The `out/` directory is also build output. Ignore it for the same reasons you ignore `.next/`:

```
# .gitignore
.next/
out/
```

Your deployment platform (Vercel, Netlify, Cloudflare Pages, GitHub Pages) will run `next build` and generate `out/` on its own. If you're deploying manually by uploading files, the build step happens on your machine — but you still don't commit the output.

## Your .gitignore for Next.js projects

At minimum, your `.gitignore` should include:

```
# Next.js build output
.next/
out/

# Dependencies
node_modules/

# Environment variables
.env*.local
```

The `create-next-app` scaffolding tool generates a `.gitignore` with these entries already included. If you started your project differently, add them now.

## If you already committed .next/

If `.next/` is already tracked in your Git repository, here's how to fix it.

### Step 1: Add it to .gitignore

Make sure your `.gitignore` contains:

```
.next/
```

### Step 2: Remove it from Git tracking

```bash
git rm -r --cached .next/
```

The `--cached` flag removes the files from Git's index without deleting them from your filesystem. Your local `.next/` stays intact, so `next dev` keeps working without a rebuild.

### Step 3: Commit the change

```bash
git add .gitignore
git commit -m "Stop tracking .next/ build output"
```

### Step 4 (optional): Clean up history

If the committed `.next/` directory significantly bloated your repository, you can rewrite history to remove it:

```bash
# Install git-filter-repo (pip install git-filter-repo)
git filter-repo --path .next/ --invert-paths
```

**Warning**: this rewrites all commit hashes. Every collaborator will need to re-clone. Only do this if the repository size is causing real problems — slow clones, hitting GitHub's size limits, or wasting CI time.

## Quick reference

| Commit | Ignore |
|---|---|
| `next.config.js` | `.next/` |
| `next-env.d.ts` | `out/` |
| `middleware.ts` | `.next/cache/` |
| `postcss.config.js` | Build manifests |
| `tailwind.config.ts` | Compiled server bundles |
| Source files in `app/` and `pages/` | Webpack/Turbopack cache |

## Summary

The `.next/` directory is build output — large, platform-specific, and fully reproducible from your source code. Every deployment platform generates it fresh by running `next build`. There is no scenario where committing it helps and many where it hurts.

Add `.next/` and `out/` to your `.gitignore`. Commit your source code, your configuration files, and your lock file. Let the build process handle the rest. This is the same principle behind [not committing node_modules](/devops-and-tools/should-you-commit-node-modules) or [dist/ folders](/devops-and-tools/should-you-commit-dist-folder) — your repository stores source, not output. For a complete guide to what belongs in version control, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
