# npm vs pnpm

You are building your first project with an AI coding tool. You paste a prompt, the AI generates code, and somewhere in the instructions it says "run `npm install`." Then you look at a different tutorial and it says "run `pnpm install`." Same idea, different command. What gives?

This guide explains what npm and pnpm actually are, why both exist, and which one you should use. No prior knowledge required.

## What problem do package managers solve?

Modern web projects depend on thousands of small libraries written by other developers. A React app, for example, pulls in React itself, a bundler, a router, utility functions, and dozens of their own dependencies. Installing and tracking all of that by hand would be impossible.

A package manager automates this. You describe what your project needs in a file called [package.json](/devops-and-tools/package.json), and the package manager downloads everything, puts it in the right place, and keeps track of exact versions so your project works the same way on every machine.

## npm: the default

npm stands for Node Package Manager. It ships with Node.js, so if you have Node installed, you already have npm. It connects to the npm registry, the largest collection of JavaScript packages in the world.

```bash
# Check if you have npm
npm --version
```

npm has been around since 2010. Almost every JavaScript tutorial, AI coding tool, and starter template assumes npm. When someone says "install this package," they usually mean with npm.

## pnpm: the faster alternative

pnpm stands for "performant npm." It is a drop-in replacement that does the same job — installing packages from the same registry — but with a different approach under the hood.

```bash
# Install pnpm (once, globally)
npm install -g pnpm

# Then use it instead of npm
pnpm install
```

pnpm was created in 2017 to fix real pain points with npm: slow installs, wasted disk space, and loose dependency resolution that could hide bugs. It has grown steadily and is now the default for many modern frameworks and teams.

## Key differences

| Feature | npm | pnpm |
|---------|-----|------|
| Ships with Node.js | Yes | No (separate install) |
| Install speed | Moderate | Fast — often 2-3x faster |
| Disk usage | Each project gets its own copy of every package | Packages are stored once globally and linked |
| Lockfile | `package-lock.json` | `pnpm-lock.yaml` |
| Strictness | Lets you import packages you did not declare | Only allows access to packages you explicitly listed |
| Monorepo support | Built-in workspaces | Built-in workspaces (more mature) |
| Tutorial coverage | Almost universal | Growing but less common |

### Speed and disk space

npm downloads every package into a `node_modules` folder inside your project. If you have ten projects that all use React 19, npm stores ten separate copies.

pnpm stores each package version once in a global content-addressable store (usually in `~/.local/share/pnpm/store`), then creates hard links from your project's `node_modules` into that store. The result: faster installs and dramatically less disk space.

On a machine with several projects, the difference adds up. A project that takes 45 seconds to install with npm might take 15 seconds with pnpm.

### Strictness

This is the difference that matters most for correctness.

npm uses a flat `node_modules` structure. If package A depends on package B, and package B depends on package C, npm hoists package C to the top level. Your code can then import package C directly — even though you never declared it as a dependency. This works until the day the version changes or the hoisting order shifts, and your build breaks for no obvious reason.

pnpm uses a nested structure with symlinks. Your code can only import packages you explicitly listed in `package.json`. If you try to import something you did not declare, you get a clear error immediately instead of a mystery failure six months later.

For vibe coders, this strictness is actually helpful. When an AI tool generates code that imports a package, pnpm forces you to add it to your dependencies explicitly. That keeps your project honest.

## Can they coexist on the same machine?

Yes. npm and pnpm can both be installed at the same time without conflict. They share the same npm registry and understand the same `package.json` format.

The only rule: **pick one per project**. Do not mix `npm install` and `pnpm install` in the same project directory. Each tool generates its own lockfile (`package-lock.json` vs `pnpm-lock.yaml`), and having both creates confusion and potential version mismatches.

```bash
# Check which one a project uses
ls package-lock.json 2>/dev/null && echo "This project uses npm"
ls pnpm-lock.yaml 2>/dev/null && echo "This project uses pnpm"
```

## Should you just pick one?

**For new projects: pnpm is the better default.** It is faster, uses less disk space, and catches dependency errors that npm silently ignores. Many modern frameworks (Nuxt, SvelteKit, Turborepo) recommend or default to pnpm.

**npm is completely fine too.** If a tutorial uses npm, follow along with npm. If your AI coding tool generates npm commands, using npm is simpler than translating every command. The packages are the same either way — the registry does not care which tool downloads from it.

The worst choice is spending hours agonizing over this. Pick one, start building.

## Switching mid-project

Already started a project with npm and want to switch to pnpm? Here is the process:

```bash
# 1. Delete the npm-specific files
rm -rf node_modules
rm package-lock.json

# 2. Install everything fresh with pnpm
pnpm install

# 3. Verify it works
pnpm run dev
```

Going the other direction (pnpm to npm):

```bash
rm -rf node_modules
rm pnpm-lock.yaml

npm install

npm run dev
```

That is it. Both tools read the same `package.json`, so switching is just deleting the old lockfile and node_modules, then reinstalling. Commit the new lockfile afterward.

One thing to watch: if the project relied on npm's loose hoisting (importing undeclared packages), switching to pnpm will surface those issues as errors. That is pnpm being strict, not broken. Add the missing packages to your `package.json` and the errors go away.

## Starting fresh on a new computer

If you are setting up a brand new development machine, here is the install order:

```bash
# 1. Install Node.js (this also installs npm)
#    Download from https://nodejs.org or use a version manager like nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install --lts

# 2. Verify both are working
node --version
npm --version

# 3. Install pnpm globally (if you want to use it)
npm install -g pnpm
pnpm --version
```

After that, you have both tools available. Use whichever one your project calls for.

### Alternative: corepack

Node.js 16+ ships with a tool called corepack that can manage pnpm for you without a global install:

```bash
# Enable corepack (one time)
corepack enable

# Now pnpm is available — corepack downloads the right version automatically
pnpm --version
```

Corepack also reads a `packageManager` field in `package.json`, so if a project specifies which package manager and version it expects, corepack enforces it:

```json
{
  "packageManager": "pnpm@9.15.0"
}
```

This is especially useful on teams or when cloning open-source projects — you automatically get the right tool at the right version.

## Common gotchas for vibe coders

These are the issues that come up most often when building with AI tools.

### AI generates npm commands when you use pnpm

This is the most common friction point. You ask Claude or Cursor to add a package, and it generates `npm install some-package`. If your project uses pnpm, run the pnpm equivalent instead:

| npm command | pnpm equivalent |
|-------------|-----------------|
| `npm install` | `pnpm install` |
| `npm install package-name` | `pnpm add package-name` |
| `npm install -D package-name` | `pnpm add -D package-name` |
| `npm run dev` | `pnpm dev` |
| `npm run build` | `pnpm build` |
| `npx create-next-app` | `pnpm create next-app` |
| `npm uninstall package-name` | `pnpm remove package-name` |

Most commands are similar. The main difference: pnpm uses `add` and `remove` instead of `install` and `uninstall` for individual packages. Running `pnpm install` (with no package name) still works — it installs everything from `package.json`.

### Lockfile conflicts

If you accidentally run `npm install` in a pnpm project (or vice versa), you will end up with two lockfiles. Delete the one you do not want and the `node_modules` folder, then reinstall with your chosen tool.

### "Module not found" errors after switching to pnpm

This usually means your code imports a package that is not in your `package.json`. npm allowed it silently; pnpm does not. Fix it by adding the missing dependency:

```bash
pnpm add the-missing-package
```

### Deployment platforms

Most hosting platforms (Vercel, Netlify, Railway) detect which package manager you use by looking for the lockfile. If they see `pnpm-lock.yaml`, they use pnpm. If they see `package-lock.json`, they use npm.

Make sure you commit your lockfile and do not have both. If a deploy fails with dependency errors, check that the platform is using the right package manager.

## Command cheat sheet

A quick reference for the most common operations:

| What you want to do | npm | pnpm |
|---------------------|-----|------|
| Install all dependencies | `npm install` | `pnpm install` |
| Add a package | `npm install pkg` | `pnpm add pkg` |
| Add a dev dependency | `npm install -D pkg` | `pnpm add -D pkg` |
| Remove a package | `npm uninstall pkg` | `pnpm remove pkg` |
| Run a script | `npm run scriptname` | `pnpm scriptname` |
| Run a one-off command | `npx command` | `pnpm dlx command` |
| Update all packages | `npm update` | `pnpm update` |
| Check for outdated packages | `npm outdated` | `pnpm outdated` |
| Clean install (CI) | `npm ci` | `pnpm install --frozen-lockfile` |

## The bottom line

npm and pnpm do the same job. npm is the default that comes with Node.js and works everywhere. pnpm is faster, leaner, and stricter. You cannot make a wrong choice here — both install the same packages from the same registry.

If you are starting a new project today, try pnpm. If you are following a tutorial that uses npm, use npm. If your AI tool generates the wrong command, translate it using the cheat sheet above. And if you ever need to switch, it takes about thirty seconds.

The package manager is a tool, not a commitment. Spend your energy on the thing you are building.
