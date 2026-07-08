---
title: "Should You Commit .tool-versions?"
description: "Yes, commit .tool-versions when it defines shared runtime versions. It keeps asdf, mise, CI, and AI coding agents on the same toolchain."
---

# Should You Commit .tool-versions?

Yes. Commit `.tool-versions` when it defines the runtime and CLI versions your project expects. It is shared project configuration, not a personal preference file, and it prevents a class of failures that look like broken code but are really mismatched Node, Python, Ruby, Go, Terraform, or other tool versions.

The only time you leave it out of git is when it contains your personal overrides for a machine-specific workflow. If the file tells another contributor how to run the project correctly, it belongs in the repository.

## What .tool-versions is

`.tool-versions` is the project version file used by [asdf](https://asdf-vm.com/manage/configuration.html), and it is also understood by tools in the asdf-compatible ecosystem, including [mise](https://mise.jdx.dev/configuration.html). The file lives in the project root and maps tool names to versions:

```text
nodejs 22.12.0
python 3.13.1
ruby 3.3.6
terraform 1.10.3
```

Each line says: when you are inside this project, use this version of this tool. asdf performs version lookup from the current directory upward, and `asdf set` writes entries to `.tool-versions` in the current directory when you pin a tool for a project. That makes the file the version-manager equivalent of `package-lock.json` or `tsconfig.json`: small, boring, and important.

The file matters most in polyglot projects. A Next.js app may only need `.node-version` or `.nvmrc`. A SaaS repo with a web app, background worker, Terraform infrastructure, Ruby scripts, and Python data jobs needs one place to pin the whole local toolchain. `.tool-versions` is that place.

## Commit or ignore: the decision matrix

Use this decision matrix before adding `.tool-versions` to `.gitignore`.

| Situation | Commit `.tool-versions`? | Why |
|---|---|---|
| It pins runtimes needed to build, test, or deploy the project | Yes | Contributors and CI need the same versions |
| It contains Node, Python, Ruby, Go, Terraform, or other shared tool versions | Yes | It is project configuration |
| Your team uses asdf, mise, or compatible tooling | Yes | The file is the contract those tools read |
| You are the only developer today, but the repo may run in CI or on another machine | Yes | Future you is still a different environment |
| It exists only in your home directory for personal defaults | No | User-level preferences do not belong in the project repo |
| It pins an experimental local version you do not want the project to require | No | Use a local override outside the repo instead |

For most application repositories, the answer is simple: commit it. For libraries, command-line tools, and infrastructure repos, commit it if contributors need those versions to run tests or reproduce releases.

## Why committing it helps

Runtime version drift is painful because the symptoms rarely name the real cause. A teammate runs `npm install` with a newer Node release and gets a native package failure. CI uses a different Terraform version and rewrites lock data. A Ruby script works locally but fails in a deployment job because Bundler runs under a different interpreter. An AI coding agent scaffolds code against whatever runtime happens to be on the host.

Committing `.tool-versions` gives every environment a shared starting point:

- **Developers get the same toolchain.** A new contributor can install asdf or mise, run the setup command, and land on the versions the project expects.
- **CI can read one source of truth.** Instead of hardcoding versions in workflow YAML, you can have setup steps read `.tool-versions` or keep CI values checked against it.
- **AI coding agents stop guessing.** Agents that run commands in your repo inherit the pinned runtime versions instead of whatever the worker image happens to provide.
- **Version upgrades become reviewable.** A Node or Terraform upgrade shows up as a small diff in a committed file, attached to the code changes that prove the upgrade works.

The last point is the real reason to commit it. Toolchain changes are product changes when they affect builds, tests, deploys, or generated output. They deserve code review.

## .tool-versions vs .nvmrc, .node-version, and mise.toml

You do not need every version file. Pick the file that matches the tools your project actually expects.

| File | Best fit | Commit it? |
|---|---|---|
| `.tool-versions` | Multi-language projects using asdf or compatible managers | Yes, when it defines the project toolchain |
| `.nvmrc` | Node projects whose team primarily uses nvm | Yes |
| `.node-version` | Node projects that want cross-tool compatibility | Yes |
| `mise.toml` | Projects using mise for tools, environment variables, and tasks | Yes, if it is project config |
| Personal shell config | User defaults and machine-specific behavior | No |

If your project already has `.nvmrc` and only needs Node, keep `.nvmrc` or pair it with `.node-version`. For that narrower case, see [Should You Commit .nvmrc and .node-version?](./should-you-commit-nvmrc).

If your project manages several tools, `.tool-versions` is cleaner than a pile of language-specific files. One file can pin Node, Python, Ruby, Terraform, and any other plugin-backed runtime. That is easier for contributors to scan and easier for CI to enforce.

`mise.toml` is different. It can pin tools, but it can also define tasks, environment variables, and other project behavior. If your repo uses mise as the main project harness, commit `mise.toml` as shared configuration. If you only need asdf-compatible tool pins, `.tool-versions` stays simple and portable.

## What belongs in the file

Keep `.tool-versions` focused on tools the project actually needs. A good file names the runtime versions required to build, test, lint, deploy, or run the application.

```text
nodejs 22.12.0
python 3.13.1
terraform 1.10.3
```

That is useful. It tells a contributor exactly which Node, Python, and Terraform versions the project is built around.

This is less useful:

```text
nodejs latest
python system
ruby 3.3.6
```

Floating aliases and `system` entries weaken the contract. They may be acceptable for personal defaults, but they are poor project pins because two machines can resolve them differently. Prefer explicit versions for application repos and deployment-sensitive infrastructure.

Also keep secrets out of the file. `.tool-versions` should contain version strings, not API keys, private registry tokens, local filesystem paths, or shell commands. If you need environment variables, use the project pattern for env files and make sure secrets stay ignored. For the broader boundary, see [Should You Commit .env Files?](./should-you-commit-env-file).

## How to handle updates and conflicts

Treat `.tool-versions` as hand-authored configuration. Do not regenerate it blindly during dependency updates, and do not let an agent bump it as a side effect of installing packages.

When you upgrade a tool version:

1. Change the relevant line in `.tool-versions`.
2. Install that version with your version manager.
3. Run the smallest build, lint, test, or deploy check that proves the project still works.
4. Commit the version file with the code or configuration changes required by the upgrade.

Merge conflicts are usually straightforward because the file is short. If two branches update different tools, keep both changes. If two branches update the same tool to different versions, choose the version that matches the branch you are actually shipping and rerun verification.

For infrastructure tools, be stricter. A Terraform version bump can change generated lockfiles or provider behavior, so keep the `.tool-versions` diff next to the Terraform validation output. For language runtimes, pair the change with the relevant lockfile or compiler check. A Node bump belongs near `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `bun.lock` changes if installs changed.

## What to put in .gitignore

Do not add `.tool-versions` to `.gitignore` when it is project configuration.

A healthy ignore file excludes generated directories and local state:

```gitignore
node_modules/
.next/
dist/
.env
.env.local

# Do not ignore shared runtime pins
# .tool-versions
```

The common mistake is a broad pattern that catches too much. For example, `.*` or `*.versions` style patterns can hide important dotfiles. Prefer explicit ignores for generated files, caches, and secrets.

If you need personal local overrides, put them somewhere your version manager supports outside the project repo, such as a home-directory config file or an untracked local file documented by your team. Do not make the shared `.tool-versions` file carry personal machine state.

## See Also

- [Should You Commit .nvmrc and .node-version?](./should-you-commit-nvmrc) - the Node-specific runtime pinning guide
- [Should You Commit tsconfig.json?](./should-you-commit-tsconfig-json) - TypeScript compiler configuration belongs in git too
- [Should You Commit .editorconfig to Git?](./should-you-commit-editorconfig) - project-wide editor behavior without formatter noise
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) - the broader commit-or-ignore decision framework
- [TypeScript](/frontend/typescript) - how compiler settings fit into the frontend stack
