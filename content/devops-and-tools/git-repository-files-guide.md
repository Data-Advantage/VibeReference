# The Developer's Guide to What Belongs in Your Git Repository

You just initialized a new project. You run `git status` and see a wall of files — lock files, environment configs, build output, IDE settings, Docker files, CI workflows. Some obviously belong in version control. Others? Not so obvious.

Every developer hits this moment. You Google "should I commit package-lock.json" and find three contradicting blog posts from 2018. You wonder whether `.env` files are safe to push. You watch your clone time skyrocket because someone committed `node_modules/` three years ago and nobody fixed it.

This guide gives you a clear answer for every file type developers commonly debate. Not just "commit" or "ignore" — the reasoning behind each decision, so you can apply the same logic to files we haven't covered.

## The decision framework

Before looking at specific files, here is a four-question test you can apply to anything:

1. **Is it auto-generated from other committed files?** If yes, ignore it. The lockfile + source is enough to reproduce it.
2. **Does it contain secrets?** If yes, ignore it. No exceptions. Ever.
3. **Is it needed for every developer (or CI) to build and run the project?** If yes, commit it.
4. **Is it specific to one person's machine or editor?** If yes, ignore it (or add it to a global gitignore).

When the answers conflict — say, a file is needed by every developer but also auto-generated — lean toward ignoring it if the generation step is fast and reliable.

## Quick reference table

Here is every category at a glance. Scroll down for the reasoning behind each decision.

| File / Category | Verdict | Why |
|---|---|---|
| `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` | **Commit** | Reproducible installs across machines and CI |
| `Gemfile.lock` / `poetry.lock` / `go.sum` | **Commit** | Same principle, different ecosystems |
| `Cargo.lock` (Rust) | **Depends** | Commit for apps, ignore for libraries |
| `.env` / `.env.local` / `.env.production` | **Ignore** | Contains real secrets — never commit |
| `.env.example` / `.env.sample` | **Commit** | Template showing structure, no real values |
| `node_modules/` | **Ignore** | Massive, reproducible from lockfile |
| `dist/` / `build/` / `.next/` / `out/` | **Ignore** | Build artifacts, regenerated from source |
| `__pycache__/` / `.pyc` | **Ignore** | Python compiled files, auto-generated |
| `.vscode/settings.json` | **Depends** | Shared project settings: maybe. Personal prefs: no |
| `.idea/` | **Ignore** | JetBrains internal state, not project config |
| `.editorconfig` | **Commit** | Cross-editor formatting standard |
| `tsconfig.json` / `eslint.config.js` / `.prettierrc` | **Commit** | Team code standards |
| `Dockerfile` / `docker-compose.yml` / `.dockerignore` | **Commit** | Infrastructure definitions, not artifacts |
| `.github/workflows/` / `.gitlab-ci.yml` | **Commit** | CI/CD pipeline definitions |
| Migration files (`migrations/`, `db/migrate/`) | **Commit** | Schema version control |
| Seed files / fixtures | **Depends** | Dev seeds: often yes. Production data: never |
| `*.sqlite` / `*.db` | **Ignore** | Database instances are data, not code |
| Generated types (GraphQL codegen, Prisma Client) | **Ignore** | Reproducible from schema |
| `turbo.json` / `nx.json` / `lerna.json` | **Commit** | Monorepo workspace config |
| `.DS_Store` / `Thumbs.db` | **Ignore** | OS metadata, use global gitignore |

Now let's walk through each category.

## Lock files: commit them

**Files:** `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Gemfile.lock`, `poetry.lock`, `go.sum`, `Cargo.lock`

The debate over lock files ended years ago. **Commit them.**

A lock file records the exact version of every dependency your project uses. Without it, two developers running `npm install` on the same `package.json` can get different package versions — because `package.json` specifies version *ranges* (`^1.2.0`), not exact versions. The lock file pins every package to a specific version, hash, and resolved URL.

This matters for:
- **Reproducible builds.** Your CI server installs the exact same packages as your laptop.
- **Team consistency.** No more "works on my machine" because someone got a newer patch release.
- **Security audits.** You can verify exactly which versions are deployed.

The reasoning applies across every language ecosystem:

| Package Manager | Lock File | Commit? |
|---|---|---|
| npm | `package-lock.json` | Yes |
| Yarn | `yarn.lock` | Yes |
| pnpm | `pnpm-lock.yaml` | Yes |
| Bundler (Ruby) | `Gemfile.lock` | Yes |
| Poetry (Python) | `poetry.lock` | Yes |
| Go Modules | `go.sum` | Yes |
| Cargo (Rust) | `Cargo.lock` | Yes for apps, no for libraries |

**The one exception:** Rust libraries. `Cargo.lock` is ignored when someone depends on your library — they generate their own lock file. So Rust library authors typically gitignore it. This is Rust-specific; in most ecosystems, always commit.

**Handling merge conflicts:** Lock file conflicts look scary but are almost always safe to resolve by running the package manager again. pnpm handles this automatically — run `pnpm install` after a conflicted merge and it regenerates cleanly.

For a deeper dive, read our [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore) guide.

## Environment and secrets files: never commit real secrets

**Files:** `.env`, `.env.local`, `.env.production`, `.env.example`

This is the most important rule in this guide: **never commit files containing real API keys, database passwords, or authentication tokens.**

It doesn't matter if the repository is private. It doesn't matter if "only the team has access." Secrets in git are searchable, cloneable, and persistent — even after you delete the file, it lives in git history forever. Stories of leaked AWS keys racking up thousands of dollars in charges are not rare. They are routine.

The pattern every project should follow:

```bash
# .gitignore
.env
.env.local
.env.production
.env*.local
```

```bash
# .env.example (committed — shows structure, no real values)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Commit `.env.example`.** It documents what environment variables the project needs without exposing real values. New developers clone the repo, copy `.env.example` to `.env`, fill in their own values, and they're running.

**Gitignore everything else.** `.env`, `.env.local`, `.env.production` — all of them. Production secrets should live in your hosting provider's secrets management (Vercel environment variables, GitHub Actions secrets, AWS Secrets Manager) and never touch a git repository.

**What if you already committed a `.env` file?** Removing it from the repo is not enough. The secrets are still in git history. You need to rotate every key in that file immediately, then remove the file from history using `git filter-repo` or the BFG Repo-Cleaner.

For the full playbook, read our [.env Files: The Complete Guide](/devops-and-tools/env-files-git-guide).

## Build artifacts: always ignore

**Files:** `node_modules/`, `dist/`, `build/`, `.next/`, `out/`, `__pycache__/`, `.pyc`

Git tracks source code — what humans write. Build artifacts are what machines generate from that source code. They do not belong in version control.

**`node_modules/`** is the most common offender. A typical React project's `node_modules/` folder contains 200MB or more across thousands of files. Committing it means:
- Clone times measured in minutes instead of seconds
- Every dependency update creates a massive diff
- Merge conflicts in files nobody wrote
- Your git history bloats permanently (even deleting `node_modules/` later, the data stays in history)

Your lockfile already records exactly which packages to install. `npm ci` (or `pnpm install --frozen-lockfile`) reproduces the exact `node_modules/` from the lockfile. That is what CI/CD pipelines do on every build.

The same logic applies to `dist/`, `build/`, and `.next/`:

```bash
# .gitignore
node_modules/
dist/
build/
.next/
out/
__pycache__/
*.pyc
```

**How to undo the mistake:** If `node_modules/` was committed, removing it from the working tree is easy (`git rm -r --cached node_modules/`), but the blobs live in history. For a serious cleanup, use `git filter-repo` to rewrite history. For most teams, just removing it going forward and accepting the slightly bloated history is the pragmatic choice.

## IDE and editor config: commit standards, ignore personal state

**Files:** `.vscode/`, `.idea/`, `.editorconfig`

This category is where developer opinions diverge the most. Here's a practical framework:

**`.editorconfig` — always commit.** This is a cross-editor standard (supported by VS Code, JetBrains, Vim, Sublime, and more). It defines basics like indent style, indent size, and line endings. No editor lock-in, no personal preferences — just portable formatting rules.

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

**`.vscode/settings.json` — depends on your team.** Some teams commit shared VS Code settings so everyone gets the same formatter-on-save behavior, the same file associations, the same TypeScript settings. If you do this, be selective — commit project-relevant settings, not personal preferences like font size or theme.

```bash
# .gitignore — if you share some VS Code settings
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
```

**`.idea/` — always ignore.** JetBrains IDEs (WebStorm, IntelliJ, PyCharm) store internal state in `.idea/`. This is not portable project config — it is IDE state. Always gitignore it.

The principle: **config that defines project standards → commit. Config that reflects personal preferences → ignore.**

## Configuration files: commit all of them

**Files:** `tsconfig.json`, `eslint.config.js`, `.eslintrc.*`, `.prettierrc`, `prettier.config.js`, `.browserslistrc`

This category is straightforward. Every config file that defines your project's code standards should be committed.

- **`tsconfig.json`** — TypeScript compiler options. Defines what features are available, how strict the type checking is, and where output goes. Every developer needs the same config.
- **`eslint.config.js` / `.eslintrc.*`** — Linting rules. Catches bugs, enforces patterns, and prevents common mistakes. Team-wide consistency requires a committed config.
- **`.prettierrc` / `prettier.config.js`** — Code formatting rules. Eliminates formatting debates entirely. Commit the config, run Prettier on save, and never argue about semicolons again.
- **`.browserslistrc`** — Browser compatibility targets. Tells build tools which browsers to support. Affects CSS prefixing and JavaScript transpilation.

These files work together. Husky and lint-staged use them in pre-commit hooks. CI pipelines lint against them. If they are not committed, every developer configures their own rules — and your codebase becomes inconsistent.

```bash
# Never gitignore these
tsconfig.json
eslint.config.js
.prettierrc
.browserslistrc
```

## Docker files: commit them all

**Files:** `Dockerfile`, `docker-compose.yml`, `.dockerignore`

Docker configuration files are project source definitions. They describe how your application is built and run. Commit all of them.

- **`Dockerfile`** — Defines the container image. What base image, what packages to install, what commands to run. This is infrastructure as code.
- **`docker-compose.yml`** — Defines multi-service orchestration. Database, cache, app server — all described declaratively.
- **`.dockerignore`** — Like `.gitignore` but for Docker build context. Tells Docker which files to exclude from the image (`.git`, `node_modules`, `.env`). Speeds up builds and keeps images small.

```bash
# .dockerignore (commit this)
.git
node_modules
.env
.env.local
dist
.next
```

## CI/CD files: commit them

**Files:** `.github/workflows/*.yml`, `.gitlab-ci.yml`, `.circleci/config.yml`

CI/CD configuration is infrastructure as code. Your build, test, and deploy pipelines are defined in YAML files that live alongside your source code. Always commit them.

GitHub Actions workflows live in `.github/workflows/`. GitLab CI uses `.gitlab-ci.yml` at the project root. Both should always be committed and reviewed like any other code change.

One useful trick: add `[skip ci]` to a commit message when you are making documentation-only changes. Most CI systems recognize this and skip the pipeline run.

**Secrets in CI/CD:** Never hardcode secrets in workflow files. Use your platform's secrets management — GitHub Actions secrets, GitLab CI/CD variables, or environment-specific configs. These are injected at runtime, never stored in the repository.

## Database migrations: always commit

**Files:** `migrations/`, `db/migrate/`, `schema/`, migration files from Django, Rails, Sequelize, Prisma, Liquibase

Database migrations are version-controlled schema changes. They record every structural change to your database — new tables, column modifications, index additions — as sequential, ordered files. **Always commit them.**

Migrations give you:
- **Reproducibility.** Any developer can run migrations to get an identical database schema.
- **Audit trail.** You can see exactly when and why every schema change was made.
- **Team synchronization.** When you pull changes, running migrations catches your local database up to the current schema.
- **Rollback capability.** Well-written migrations include down/rollback functions.

**Seed files** are more nuanced:
- **Development seeds** (test users, sample data) — commit them if they help developers get started quickly.
- **Production data** — never commit. Production data is operational, not source code.

**Database files** (`*.sqlite`, `*.db`) — always ignore. These are data, not code. They are generated from your schema and migrations.

```bash
# .gitignore
*.sqlite
*.sqlite3
*.db
```

## Generated code: usually ignore

**Files:** GraphQL codegen output, Prisma Client, auto-generated API clients, TypeScript type definitions from schemas

If a file can be regenerated from a committed source file (a schema, a config, a specification), you generally should not commit the generated output. Commit the source, ignore the output.

The pattern:
- **Commit:** `schema.prisma`, `schema.graphql`, OpenAPI specs
- **Ignore:** Generated TypeScript types, generated client code, `@prisma/client` output

Modern toolchains run generation during build time. Your CI pipeline runs `prisma generate` or `graphql-codegen` as part of the build step, producing fresh output every time.

There are exceptions — some teams commit generated code to avoid requiring the generation toolchain for simple changes. If your team does this, document it clearly. But the default recommendation is: source in, artifacts out.

## Monorepo configuration: commit it

**Files:** `turbo.json`, `nx.json`, `workspace.json`, `lerna.json`, `pnpm-workspace.yaml`

Monorepo tool configs define your workspace structure, task pipelines, and dependency graphs. They are core project architecture. Always commit them.

These files tell the build system which packages exist, how they depend on each other, and how to build them efficiently. Without them committed, nobody can build the project.

## OS and system files: ignore globally

**Files:** `.DS_Store`, `Thumbs.db`, `Desktop.ini`

macOS creates `.DS_Store` in every directory you open in Finder. Windows creates `Thumbs.db` for thumbnail caching. Neither belongs in any repository, ever.

The best approach is a **global gitignore** that applies to all your projects:

```bash
# Set up global gitignore (run once)
git config --global core.excludesFile ~/.gitignore_global
```

```bash
# ~/.gitignore_global
.DS_Store
Thumbs.db
Desktop.ini
*.swp
*.swo
*~
```

This keeps OS-specific noise out of every repository without needing to add these to each project's `.gitignore`.

## A starter `.gitignore` for modern web projects

Here is a practical `.gitignore` that covers most of the files discussed in this guide:

```bash
# Dependencies
node_modules/

# Build output
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.production
.env*.local

# IDE state (keep .editorconfig and optionally .vscode/settings.json)
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Python
__pycache__/
*.pyc
*.pyo

# Database files
*.sqlite
*.sqlite3
*.db

# Generated code (uncomment if applicable)
# generated/
# @prisma/client
```

## Common mistakes (and how to fix them)

**"We committed `node_modules/` and now cloning takes forever."**
Remove it from tracking with `git rm -r --cached node_modules/`, add it to `.gitignore`, and commit. The history stays bloated, but new clones can use `--depth 1` for shallow clones. For a full cleanup, use `git filter-repo`.

**"Someone pushed a `.env` file with production database credentials."**
Rotate every credential in that file immediately. Then remove the file from history using `git filter-repo` or BFG Repo-Cleaner. Just deleting the file and committing is not enough — the secrets persist in git history.

**"We ignored our migration files and now our databases are out of sync."**
Migrations should always be committed. If you have already diverged, you'll need to manually reconcile the schemas or create a fresh migration that captures the current state.

**"Two developers use different lock files because one used npm and the other used pnpm."**
Pick one package manager per project. Remove the other lock file, add it to `.gitignore`, and document the choice in your README or contributing guide.

## FAQ

**What if I already committed a file that should be ignored?**
Add it to `.gitignore`, then remove it from tracking:
```bash
git rm --cached path/to/file
git commit -m "Stop tracking file that should be ignored"
```
The file stays on your disk but stops being tracked by git.

**Should I commit `.gitignore` itself?**
Yes, always. `.gitignore` defines what the project tracks. Every developer needs the same ignore rules.

**My AI coding tool generated a file I'm not sure about. How do I decide?**
Run it through the four-question framework at the top of this guide. If it is generated from other committed files and can be reproduced reliably, ignore it. If it contains configuration the team needs, commit it.

**What about large files like images, fonts, or videos?**
Git is designed for text. For large binary files, use [Git LFS](https://git-lfs.github.com/) (Large File Storage). It replaces large files in your repo with lightweight pointers while storing the actual data on a separate server.

## Keep reading

This guide gives you the overview. For deep dives into specific file types:

- [Lock Files: package-lock.json, yarn.lock, pnpm-lock.yaml — Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore)
- [.env Files: The Complete Guide to Environment Variables in Git](/devops-and-tools/env-files-git-guide)
- [npm vs pnpm](/devops-and-tools/npm-vs-pnpm)
