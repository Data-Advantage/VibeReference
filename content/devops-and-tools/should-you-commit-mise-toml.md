---
title: "Should You Commit mise.toml?"
description: "Yes, commit mise.toml when it defines shared tools, tasks, or safe environment defaults. Keep secrets and local overrides out of git."
---

# Should You Commit mise.toml?

Yes. Commit `mise.toml` when it defines the tool versions, development tasks, or safe environment defaults your project expects. It is shared project configuration, not a personal preference file, and it helps developers, CI, and AI coding agents run the same commands with the same assumptions.

Do not commit `mise.local.toml`, secret values, or machine-specific overrides. The useful rule is simple: if the file tells another contributor how the project works, commit it. If it only tells your laptop how you like to work, keep it local.

## What mise.toml is

`mise.toml` is the project configuration file for [mise](https://mise.jdx.dev/configuration.html), a development-environment tool that can manage runtimes, environment variables, and tasks from one file. A typical project file looks like this:

```toml
[tools]
node = "24"
python = "3.13"

[env]
NODE_ENV = "development"

[tasks.test]
description = "Run the test suite"
run = "npm test"
```

That one file can pin the runtime used by the project, provide non-secret environment defaults, and define commands such as build, lint, test, seed, or deploy. The mise docs describe `mise.toml` as the config file for mise, with local and environment-specific variants available when you need overrides.

This makes `mise.toml` broader than `.nvmrc` or `.tool-versions`. `.nvmrc` only pins Node. `.tool-versions` mainly pins runtime versions for asdf-compatible tools. `mise.toml` can do those jobs and also carry tasks and environment behavior. That extra power is why the commit-or-ignore decision needs a sharper boundary.

## Commit or ignore: the decision matrix

Use this matrix before adding mise files to `.gitignore`.

| File or content | Commit it? | Why |
|---|---|---|
| `mise.toml` with shared runtime versions | Yes | Contributors and CI need the same toolchain |
| `mise.toml` with shared tasks | Yes | Build, lint, test, and deploy commands are project behavior |
| `mise.toml` with safe non-secret defaults | Yes | Defaults reduce setup friction without exposing credentials |
| `mise.local.toml` | No | mise documents it as local config that should not be committed |
| Environment-specific files with production secrets | No | Secrets and deployment credentials do not belong in git |
| Machine-specific paths, aliases, or experiments | No | Personal workflow should not become the project contract |

For most application repositories, commit the main `mise.toml`. Ignore local overrides and any file that contains private credentials.

## Why committing it helps

Committing `mise.toml` makes local setup reviewable. Runtime versions stop living in README prose, shell history, or someone else's dotfiles. A contributor enters the repo and mise knows which tools the project expects.

It also makes task names stable. If every contributor can run `mise run test`, `mise run lint`, and `mise run build`, you get a small project command surface that works across package managers, languages, and subprojects. The [mise task docs](https://mise.jdx.dev/tasks/) explicitly support tasks defined inside `mise.toml`, which makes the file a natural place for shared developer commands.

AI coding agents benefit from the same contract. Agents are worse when every repo hides validation in tribal knowledge. A committed `mise.toml` gives them obvious commands to run and a toolchain to install. Pair it with [Should You Commit AGENTS.md?](./should-you-commit-agents-md) when you want both the command surface and the agent-specific operating rules checked into the repo.

CI can use it too. You may still duplicate some setup in GitHub Actions or another CI provider, but the project file gives reviewers a canonical source of truth. A runtime upgrade becomes a visible diff instead of a silent change in someone's workstation.

## What belongs in mise.toml

Keep shared config in the committed file. That usually means tools, tasks, and safe defaults.

Use `[tools]` for versions the project actually needs:

```toml
[tools]
node = "24"
terraform = "1.10"
python = "3.13"
```

Use `[tasks]` for commands that another contributor or agent should run the same way:

```toml
[tasks.lint]
run = "npm run lint"

[tasks.build]
run = "npm run build"
```

Use `[env]` carefully. The [mise environment docs](https://mise.jdx.dev/environments/) show project-specific environment variables in `mise.toml`; that is useful for safe defaults like `NODE_ENV`, feature flags for local development, or paths inside the repo. It is not a license to commit API keys.

Good committed environment values are boring:

```toml
[env]
NODE_ENV = "development"
APP_ENV = "local"
```

Bad committed environment values expose secrets or machine state:

```toml
[env]
DATABASE_URL = "postgres://user:password@localhost/app"
OPENAI_API_KEY = "sk-..."
LOCAL_CACHE = "/Users/alex/tmp/cache"
```

The second example belongs in an ignored local file, a secret manager, or your deployment platform.

## What to keep out of git

Ignore local config first. The official configuration docs list `mise.local.toml` as local config and say it should not be committed. That is the right place for personal overrides, experimental tool versions, private paths, and values you need on one machine but not in the project.

A practical `.gitignore` block looks like this:

```gitignore
# mise shared project config belongs in git
# mise.toml
# .mise.toml

# local overrides stay private
mise.local.toml
.mise.local.toml
mise.*.local.toml
.mise.*.local.toml
```

Also keep secrets out of committed environment config. If a value would be dangerous in `.env`, it is dangerous in `mise.toml` too. Use [Should You Commit Your .env File to Git?](./should-you-commit-env-file) for the secret boundary and commit only templates or documented variable names when the team needs setup guidance.

Be careful with environment-specific config. A file like `mise.development.toml` may be fine if it contains safe local defaults. A file like `mise.production.toml` is usually risky because production config tends to drift toward credentials, regions, private endpoints, or deployment-only behavior. Commit environment files only when their contents are safe and useful to every contributor.

## mise.toml vs .tool-versions, .nvmrc, and Makefile

You do not need every project-command file. Pick the one that matches the workflow you want contributors to use.

| File | Best fit | Commit it? |
|---|---|---|
| `mise.toml` | Tools, env defaults, and tasks in one mise-native file | Yes, when it is project config |
| `.tool-versions` | Multi-language runtime pins for asdf-compatible workflows | Yes |
| `.nvmrc` or `.node-version` | Node-only runtime pinning | Yes |
| `Makefile` | Portable command aliases for teams that already use make | Yes, when commands are shared |
| `mise.local.toml` | Personal overrides and local-only values | No |

If your repo already uses mise as the main developer entrypoint, prefer `mise.toml` and avoid duplicating the same tool pins in multiple files. If your team still has asdf users, `.tool-versions` can coexist with mise, but decide which file is authoritative before version bumps start splitting across both.

For Node-only projects, `.nvmrc` may be enough. For polyglot SaaS repos with Node, Python, Terraform, and repeatable validation tasks, `mise.toml` usually carries more of the real setup.

## How to handle updates and conflicts

Treat `mise.toml` as hand-authored configuration. Do not let a tool or agent change it as a side effect without review.

When you upgrade a runtime, change the relevant `[tools]` entry and run the smallest check that proves the repo still works. A Node bump belongs near lockfile validation such as [Should You Commit package-lock.json?](./should-you-commit-package-lock-json), [Should You Commit pnpm-lock.yaml?](./should-you-commit-pnpm-lock-yaml), or [Should You Commit bun.lock?](./should-you-commit-bun-lock). A Terraform bump belongs near infrastructure validation.

When you change a task, verify the task name still does what contributors expect. If `mise run test` changes from unit tests to a full integration suite, that is not a neutral refactor. It changes the project workflow.

Merge conflicts are usually readable because TOML is short. Keep both unrelated tool or task additions. If two branches changed the same runtime version, choose the version that matches the branch you are shipping and rerun validation. If two branches changed the same task name, preserve the meaning documented in the README, `AGENTS.md`, CI, or onboarding docs.

## See Also

- [Should You Commit .tool-versions?](./should-you-commit-tool-versions) - the asdf-compatible runtime pinning guide.
- [Should You Commit .nvmrc and .node-version?](./should-you-commit-nvmrc) - the Node-specific version-file guide.
- [Should You Commit package-lock.json?](./should-you-commit-package-lock-json) - why reproducible Node installs belong in git.
- [Should You Commit Your .env File to Git?](./should-you-commit-env-file) - the boundary between safe defaults and secrets.
- [Should You Commit AGENTS.md?](./should-you-commit-agents-md) - repo-level instructions for AI coding agents.
- [TypeScript](/frontend/typescript) - how runtime and compiler configuration fit together in frontend projects.
