---
title: "Should You Commit .dockerignore to Git?"
description: "Yes — always commit .dockerignore. It shapes the Docker build context, keeps secrets and .git out of your image, and makes builds smaller and reproducible."
---

# Should You Commit .dockerignore?

Yes. If a repository has a `Dockerfile`, it should almost always have a committed `.dockerignore` right beside it. Unlike lockfiles or editor configs, where reasonable people disagree, this one is close to unanimous: a `.dockerignore` changes what goes *into* your image, and you want every build — yours, your teammate's, and CI's — to start from the same excluded set. Leaving it uncommitted, or skipping it entirely, is how `node_modules`, `.git`, and stray `.env` files end up baked into a production image.

The reason it belongs in Git isn't just consistency. A `.dockerignore` is a security and performance control, and both only work if the file travels with the code. This guide covers what it actually does, why it's always committed, why it is *not* a copy of your `.gitignore`, and the one scenario people mistake for an exception.

## The short answer

| Question | Answer |
|---|---|
| Commit `.dockerignore`? | **Yes** — always, whenever a `Dockerfile` exists. |
| Is it ever gitignored? | **No.** There is effectively no case for keeping it out of the repo. |
| Same contents as `.gitignore`? | **No** — overlapping goals, different rules. Don't symlink or copy one to the other. |
| Where does it live? | Repo root by default (next to the file you pass as build context). |
| What if there's no `Dockerfile`? | You don't need one — it only affects Docker builds. |

## What .dockerignore actually does

When you run `docker build`, the CLI first bundles up the *build context* — by default, the entire directory you point it at — and ships that bundle to the Docker daemon before a single instruction runs. Every `COPY` and `ADD` in your `Dockerfile` pulls from that bundle. A `.dockerignore` file is a list of patterns that get excluded from the context before it's sent.

That timing is the whole point. The exclusion happens on the *client* side, before transfer, so anything matched never reaches the daemon and can never be copied into a layer. Without a `.dockerignore`, a line as ordinary as `COPY . .` will faithfully copy your local `node_modules`, your `.git` directory, build output, logs, and any `.env` sitting in the folder straight into the image.

```dockerfile
# With no .dockerignore, this copies EVERYTHING in the context —
# node_modules, .git, .env, coverage/, dist/ — into the image.
COPY . .
```

A `.dockerignore` fixes this at the source:

```dockerignore
# .dockerignore — committed at repo root
.git
node_modules
npm-debug.log
.env
.env.*
!.env.example
dist
build
coverage
*.md
Dockerfile
.dockerignore
```

The syntax resembles `.gitignore` — one pattern per line, `#` for comments, `!` to negate — but it's parsed by Docker's own matching rules, not Git's, and the two diverge in ways that matter (more below).

## Why it's always committed

Three concrete payoffs, all of which evaporate if the file is missing on someone else's machine or in CI.

### It keeps secrets and junk out of the image

This is the security case, and it's the reason `.dockerignore` sits next to `.env` in importance. If a `.env` with real credentials is in your build context and you `COPY . .`, that secret is now in an image layer — readable by anyone who can `docker history` or unpack the image, even if a later step deletes the file, because each layer is preserved independently. Excluding `.git` matters for the same reason: your entire commit history, including any secret ever committed and later removed, would otherwise ride along inside the image. The `.dockerignore` is what stops both. See [Should You Commit Your .env File to Git?](./should-you-commit-env-file) for the companion rule on the file itself.

### It makes builds smaller and faster

The context bundle is transferred and hashed on every build. A `node_modules` directory can be hundreds of megabytes; a `.git` directory on a mature repo is often larger than the source itself. Excluding them shrinks the context from gigabytes to megabytes, which speeds up the transfer and — because you rebuild dependencies inside the image anyway — removes redundant copies you never wanted.

### It protects the build cache

Docker invalidates a `COPY` layer's cache when any file in the copied set changes. If your context includes `.git`, `coverage/`, or editor scratch files, then unrelated activity — a new commit, a test run, a saved file — busts the cache and forces a full rebuild of everything downstream. A tight `.dockerignore` keeps the copied set limited to files that actually affect the build, so the cache survives longer and builds stay fast.

All three depend on the file being present at build time. Since builds run on teammates' laptops and in CI, the only way to guarantee presence is to commit it. An uncommitted `.dockerignore` protects exactly one machine — yours — and silently fails everywhere else.

## .dockerignore is not .gitignore

The most common mistake is treating the two files as interchangeable and copying one into the other. They share a goal — exclude noise — but they answer different questions and follow different rules.

| | `.gitignore` | `.dockerignore` |
|---|---|---|
| Controls | What Git tracks | What enters the Docker build context |
| Read by | Git | The Docker CLI (client side) |
| Leading `/` | Anchors to the `.gitignore`'s directory | Anchors to the context root |
| `**` matching | Supported | Supported, but with different edge cases |
| Negation (`!`) | Re-includes an ignored path | Re-includes, but re-exclusion after a negation behaves differently |
| Typical contents | `node_modules`, `.env`, `dist` | Those **plus** `.git`, `Dockerfile`, `*.md`, tests, CI config |

Two differences drive the divergence. First, `.gitignore` never lists `.git` because Git manages that directory itself — but `.dockerignore` almost always should, because you don't want history in your image. Second, a `.dockerignore` often excludes things you *do* commit to Git: your `README.md`, your test suite, your CI config, even the `Dockerfile` itself. None of those belong in a runtime image, but all of them belong in the repo. Because the include/exclude lists genuinely differ, maintain the two files separately rather than symlinking one to the other. See [Should You Commit .gitignore?](./should-you-commit-gitignore) for why the Git side is likewise always committed.

## The one thing people mistake for an exception

Multi-stage builds sometimes make people think they can skip `.dockerignore` — "the final stage only copies the built artifact, so who cares what's in the context?" The reasoning is half-right and still lands you in trouble.

Even in a multi-stage build, the *entire* context is still transferred to the daemon before any stage runs, so you keep paying the size and cache costs. More importantly, your `builder` stage usually does `COPY . .` to get the source in — which means `node_modules`, `.env`, and `.git` land in the build layers of that intermediate stage. Those layers aren't in the final image, but they existed, they were cached, and on shared build infrastructure they can be inspected. A `.dockerignore` still earns its place. The correct pattern is a tight ignore file *plus* multi-stage builds, not one instead of the other. See [Should You Commit node_modules to Git?](./should-you-commit-node-modules) for the related habit of never shipping installed dependencies around.

## What to put in it

A workable baseline for a typical Node or Python service, adjust to your stack:

```dockerignore
# Version control and Docker meta
.git
.gitignore
.dockerignore
Dockerfile*
docker-compose*.yml

# Dependencies (reinstalled inside the image)
node_modules
.venv
__pycache__

# Secrets and local config — keep the template
.env
.env.*
!.env.example

# Build output and reports
dist
build
coverage
*.log

# Docs and dev-only files
README.md
docs
.github
```

The guiding question for each line: *does the image's build actually need this file?* If the answer is no, exclude it. When you're unsure, err toward excluding — a missing dev file breaks nothing at runtime, while an extra `.env` in a layer is a leaked credential. Keep an explicit `!.env.example` if you rely on the template inside the build for any reason, using the same negation pattern the `.env` guide describes.

## The bottom line

Commit `.dockerignore` every time you have a `Dockerfile`. It's a client-side control over what Docker copies into your image, and it only does its two most important jobs — keeping secrets and `.git` out of layers, and keeping the build context small and cache-friendly — when it's present on every machine that builds. Write it separately from `.gitignore` rather than copying one across, always exclude `.git` and secret-bearing files, and don't let multi-stage builds talk you out of it. There's no version of this decision where leaving it uncommitted is the right call.

## See Also

- [Should You Commit Your .env File to Git?](./should-you-commit-env-file) — the secret-bearing file `.dockerignore` exists to keep out of your image layers
- [Should You Commit a Dockerfile?](./should-you-commit-dockerfile) — the instruction file `.dockerignore` sits beside, and why it's always tracked
- [Should You Commit docker-compose.yml?](./should-you-commit-docker-compose) — the third file in the Docker trio, with its own commit-vs-override nuance
- [Should You Commit .gitignore?](./should-you-commit-gitignore) — the sibling exclude file, why it's committed, and how its rules differ from Docker's
- [Should You Commit node_modules to Git?](./should-you-commit-node-modules) — the classic "reproducible artifact" mistake `.dockerignore` also guards against
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — the full committed-vs-ignored reference this series builds on
