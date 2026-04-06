# Should You Commit .nvmrc and .node-version?

You clone a project, run `npm install`, and everything explodes. The error messages point to syntax issues, unsupported APIs, or cryptic engine compatibility failures. You spend an hour debugging before someone on the team mentions: "Oh, that project needs Node 20. You're probably on 22."

Node.js version mismatches cause some of the most frustrating bugs in JavaScript development. They are invisible — nothing in the error output says "wrong Node version" — and they waste time that should be spent building. Two small files exist specifically to prevent this: `.nvmrc` and `.node-version`.

**Yes, commit them.** They belong in your repository. They pin the Node.js version for every developer, every CI runner, and every deployment environment that touches your project. They cost nothing, cause no conflicts, and eliminate an entire category of "works on my machine" problems.

## What .nvmrc is

`.nvmrc` is a configuration file for [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager), the most widely used tool for managing multiple Node.js versions on a single machine. The file sits in the root of your project and contains a single line: the Node.js version your project requires.

```
20.18.0
```

That is the entire file. One line, one version number, no other syntax.

When a developer with nvm installed navigates to your project directory, they can run `nvm use` and nvm reads `.nvmrc`, switches to that version of Node.js (downloading it first if necessary), and confirms the active version. Some developers configure their shell to run `nvm use` automatically whenever they `cd` into a directory containing `.nvmrc`, so the switch happens without thinking about it.

nvm also accepts aliases in `.nvmrc`:

```
lts/juno
```

This pins the project to the latest release in the Node.js 22.x LTS line (codenamed "Juno"). Using an alias like this gives you automatic patch updates within a major LTS version, which is a reasonable trade-off for many projects. If you need exact reproducibility down to the patch level, use a full version number like `20.18.0`.

## What .node-version is

`.node-version` serves exactly the same purpose as `.nvmrc` but is recognized by a broader set of version managers:

- **fnm** (Fast Node Manager) — a popular, faster alternative to nvm written in Rust
- **nodenv** — another version manager modeled after rbenv
- **Volta** — a JavaScript tool manager that also handles npm and yarn versions
- **asdf** (via the Node.js plugin) — a universal version manager for multiple languages
- **mise** (formerly rtx) — a polyglot runtime manager

The file format is identical. A `.node-version` file contains a single version number:

```
20.18.0
```

Same content, different filename. The distinction is purely about which tools read which file.

## Same concept, different tools

Both files do the same thing: declare "this project expects Node.js version X." The only difference is tool compatibility. `.nvmrc` was first, because nvm was first. As alternative version managers appeared, many of them converged on `.node-version` as a shared standard, since it is tool-agnostic — the filename does not reference any specific manager.

Some tools read both. fnm, for example, checks for `.node-version` first, then falls back to `.nvmrc`. Volta reads `.node-version` natively. The ecosystem is converging, but it has not fully converged yet.

## Which one should you use?

If your team exclusively uses nvm, `.nvmrc` is the natural choice. nvm only reads `.nvmrc`, so that is the file that matters for your workflow.

If your team uses a mix of version managers — or if you are a solo developer and want maximum compatibility — `.node-version` is the safer bet. It is recognized by more tools and has become the de facto cross-tool standard.

Some projects commit both files with identical content. This is pragmatic, not redundant. It costs nothing (two tiny files, zero maintenance burden) and ensures that no contributor hits a version mismatch regardless of which tool they use. If you go this route, keep them in sync. A pre-commit hook or a simple CI check can verify that both files contain the same version.

```bash
# Quick check: do both files match?
diff .nvmrc .node-version
```

If you are starting a new project and have no legacy constraints, `.node-version` is the better default.

## How CI uses them

Most CI platforms can read these files automatically, eliminating the need to hardcode a Node.js version in your workflow configuration.

**GitHub Actions** with `actions/setup-node` reads `.nvmrc` or `.node-version` when you set `node-version-file`:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version-file: '.nvmrc'
      cache: 'npm'
  - run: npm ci
  - run: npm run build
```

You can also point it at `.node-version`:

```yaml
    with:
      node-version-file: '.node-version'
```

This approach is better than hardcoding `node-version: 20` in your workflow file. When you update the Node.js version, you change it in one place — the version file in your repo root — and both local development and CI pick it up automatically. No need to remember to update your GitHub Actions workflow separately.

**Vercel**, **Netlify**, and **Railway** all detect `.nvmrc` or `.node-version` and use the specified version for builds. This means committing the file is often the only configuration you need to control the Node.js version in production deployments.

## Relationship to the engines field in package.json

You might be wondering whether `.nvmrc` or `.node-version` replaces the `engines` field in `package.json`. It does not. They are complementary.

```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

The `engines` field declares a version range — "this project requires at least Node 20." It is a constraint, not a pin. npm can warn (or error, with `engine-strict`) when someone tries to install dependencies on an incompatible version. It is documentation and a guardrail.

`.nvmrc` and `.node-version` declare a specific version — "use this exact version for development." They are operational, not declarative. They actively switch the runtime.

Use both. The `engines` field in `package.json` defines the supported range. The version file pins the recommended development version within that range. A project might support Node 20+ (`engines`) while pinning `20.18.0` (`.nvmrc`) as the version the team actively develops and tests against.

## Nothing to .gitignore

These files should not appear in your `.gitignore`. They are small (a few bytes), deterministic (you control the content), and essential for reproducibility. There is no reason to exclude them.

Unlike `node_modules/` or build output, `.nvmrc` and `.node-version` are not generated files. You write them by hand, you update them deliberately when upgrading Node.js, and you commit the change with a clear message like "chore: upgrade Node.js to 22.12.0."

## Creating the files

Setting up either file takes seconds:

```bash
# Create .nvmrc with your current Node version
node -v > .nvmrc

# Or create .node-version
node -v | sed 's/^v//' > .node-version

# Or just write it directly
echo "20.18.0" > .node-version
```

Note that nvm expects the version with or without the `v` prefix (both `v20.18.0` and `20.18.0` work), while `.node-version` conventionally omits the `v` prefix. If you commit both files, use the format without the `v` for consistency.

## The bottom line

Commit `.nvmrc`, `.node-version`, or both. They are the simplest possible solution to Node.js version mismatches — a single file containing a single version number. They work locally, they work in CI, they work on deployment platforms, and they cost nothing to maintain.

If your project already has a [package-lock.json](/devops-and-tools/should-you-commit-package-lock-json) pinning exact dependency versions (as it should), pinning the Node.js runtime version is the natural next step. Dependencies and runtime together give you a reproducible environment. For the broader picture on what belongs in your repository, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
