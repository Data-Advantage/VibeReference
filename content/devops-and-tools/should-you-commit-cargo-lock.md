---
title: "Should You Commit Cargo.lock to Your Git Repository?"
description: "Commit Cargo.lock for binaries and, since the 2023 Cargo guidance update, recommended for libraries too. Here's what it contains and how to use it."
---

# Should You Commit Cargo.lock?

Yes for binaries. Probably yes for libraries. The old Rust rule — commit `Cargo.lock` for binaries, ignore it for libraries — was retired by the Cargo team in 2023. The current recommendation is to commit it by default and only opt out when your project has a specific reason not to.

If you've started a new Rust project with `cargo new` and you're looking at `Cargo.lock` wondering whether it belongs in version control, this article gives you the definitive answer plus the reasoning behind the rule change.

## The short answer

| Project type | Commit `Cargo.lock`? | Why |
|---|---|---|
| Binary application (`src/main.rs`) | **Yes** | Reproducible builds across developers, CI, and release pipelines. |
| Library crate published to crates.io (`src/lib.rs`) | **Recommended** | Stable contributor experience and reproducible CI; downstream consumers ignore it anyway. |
| Mixed workspace (libs + binaries) | **Yes** | One lockfile at the workspace root covers everything. |
| Standalone example crate inside a repo | Follow the parent project's rule | Don't create a second lockfile at a nested level. |

The TL;DR is "commit it" in almost every modern Rust project. The library exception only matters if you specifically want CI to test against the latest compatible version of every dependency on every run.

## What Cargo.lock actually contains

Your `Cargo.toml` declares dependency *intent* using semver ranges:

```toml
[package]
name = "my-service"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
axum = "0.7"
```

When you run `cargo build`, `cargo test`, or `cargo update`, Cargo resolves every requirement and writes the result to `Cargo.lock`. That file records:

- **Pinned versions for every crate** in the dependency graph, including transitive ones. If `axum` pulls in `tower`, both are locked.
- **Cryptographic checksums** (SHA-256) for every crate tarball, verified at build time against the registry.
- **Source identifiers** — `registry+https://github.com/rust-lang/crates.io-index`, a Git revision, or a local path for each crate.
- **Resolver metadata** including which Cargo resolver version produced the file (v2 is the default; v3 is opt-in on newer Rust editions).
- **Workspace topology** for multi-crate workspaces, recorded once at the workspace root.

The file is generated, not hand-written. Cargo updates it any time the resolution changes, and Cargo will refuse to build if `Cargo.lock` references a crate version that no longer exists in the registry.

For the broader pattern across every package manager, see [Lock Files: Commit or Ignore?](./lock-files-commit-or-ignore).

## Why commit it: reproducible builds

Every lockfile exists for the same reason. Without one in version control, every clone, every CI run, and every Docker build re-resolves dependencies against whatever the registry serves at that moment.

Concretely: you depend on `tokio = "1"`. On Monday that resolves to `1.40.0`. On Thursday a teammate clones the repo after `1.41.0` ships. Their integration test fails because a transitive dependency changed an internal trait bound between point releases. With `Cargo.lock` committed, both machines build against the exact same crate graph.

The same logic applies to:

- **CI pipelines** — your build should not depend on the registry's clock.
- **Docker images** — the lockfile baked into the layer is what got tested.
- **Production releases** — checking out a release tag should reproduce the build that shipped, not a fresh resolution.

### Enforcing the lockfile in CI

Cargo honors `Cargo.lock` by default, but for CI you want to be explicit so a forgotten `cargo add` does not silently rewrite the lockfile mid-build. Use `--locked`:

```yaml
# GitHub Actions
- uses: dtolnay/rust-toolchain@stable
- name: Build
  run: cargo build --locked --release
- name: Test
  run: cargo test --locked
```

`--locked` does two things: it refuses to mutate `Cargo.lock`, and it fails the build if `Cargo.toml` has drifted from the lockfile (someone changed a version requirement without re-running `cargo update`). This is the right default for any non-developer environment.

There is also `--frozen`, which adds an offline guarantee — Cargo will fail rather than reach out to the registry at all. Use `--frozen` when you want the build to fail loudly if the lockfile is incomplete or out of date.

For Dockerfiles, the same flag applies:

```dockerfile
FROM rust:1 AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --locked --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/my-service /usr/local/bin/
CMD ["my-service"]
```

Copy `Cargo.toml` and `Cargo.lock` *before* the rest of the source so Docker can cache the dependency-fetch layer until either file changes. The cargo-chef pattern extends this further by isolating dependency builds in their own layer.

## The library question and why the rule changed

For most of Rust's history, the official recommendation was: commit `Cargo.lock` for binaries, but add it to `.gitignore` for library crates published to crates.io. The reasoning was that downstream consumers never see a published library's lockfile — Cargo strips `Cargo.lock` from the package tarball — so the file only serves the library's own contributors.

That changed in 2023. The Cargo team [updated the guidance](https://blog.rust-lang.org/2023/08/29/committing-lockfiles/) to: do what is best for your project, with committing as a reasonable default for both libraries and binaries. The reasons:

- **Contributor experience.** A committed lockfile means a new contributor cloning your library gets the same crate versions as everyone else. CI failures attribute cleanly to code changes, not to a transitive dependency updating overnight.
- **CI determinism.** Without a lockfile, scheduled CI runs randomly fail when a dependency releases a patch with an unexpected behavior change.
- **Security incident response.** When `RUSTSEC-XXXX` lands, a committed lockfile tells you exactly which versions you were exposed to in every prior release.
- **No downstream cost.** crates.io publishing strips `Cargo.lock` from the tarball. Library consumers never see it.

The library scenario where you might still skip the lockfile is when you specifically want CI to test against the latest compatible version of every dependency on every run — rare enough that you'll know when you need it. A common compromise is to commit `Cargo.lock` and run a separate scheduled CI job that deletes it and rebuilds, surfacing breakage from new transitive releases without affecting the default branch's reproducibility.

## Merge conflict handling

Like other text lockfiles, `Cargo.lock` can produce merge conflicts when two branches both add or update dependencies. Resolve them by regenerating, not hand-editing:

1. Resolve any conflicts in `Cargo.toml` first — choose the union of dependencies the merged branch should have.
2. Delete the conflicted `Cargo.lock`.
3. Run `cargo build` (or `cargo update -p <crate>` to regenerate without changing other versions).
4. Stage the regenerated `Cargo.lock` and commit.

Don't hand-edit the lockfile. The checksums, source identifiers, and resolver metadata encode decisions a manual edit will get wrong in subtle ways. If two branches added the same crate at slightly different versions, let Cargo pick.

For repositories with frequent dependency churn, [cargo-edit's](https://github.com/killercup/cargo-edit) merge driver and tools like `cargo update --workspace` can reduce noise, but the underlying rule is the same: regenerate, never hand-edit.

## .gitignore: keep Cargo.lock out of the ignore list

A reasonable `.gitignore` for a Rust project looks like:

```gitignore
# Build artifacts
target/

# Editor and OS
.vscode/
.idea/
.DS_Store

# Coverage and profiling
*.profraw
tarpaulin-report.html

# DO NOT add Cargo.lock here
```

A few common mistakes worth calling out:

- **Catch-all patterns that swallow the lockfile.** `*.lock` will ignore `Cargo.lock`, `package-lock.json`, and any other lockfile in your tree. Prefer explicit entries.
- **Copying an older library template that excludes `Cargo.lock`.** Templates from before the 2023 guidance update still tell library authors to ignore the lockfile. Remove that line and commit it.
- **Ignoring `Cargo.lock` in a workspace.** A workspace has a single root lockfile. Ignoring it breaks reproducibility for every crate in the workspace, libraries included.

For the broader picture of which generated files belong in version control, see [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide).

## Workspaces and multi-crate repositories

Cargo workspaces produce a single `Cargo.lock` at the workspace root that covers every member crate. Commit the root lockfile. Individual workspace members do not have their own lockfile.

A typical workspace layout:

```text
my-project/
├── Cargo.toml          # workspace manifest
├── Cargo.lock          # ← commit this
├── crates/
│   ├── my-cli/         # binary
│   │   └── Cargo.toml
│   ├── my-core/        # library
│   │   └── Cargo.toml
│   └── my-server/      # binary
│       └── Cargo.toml
└── target/             # gitignored
```

The root lockfile resolves dependencies across the whole workspace, so `my-core` and `my-server` will agree on the version of any shared crate. This is one of the practical reasons even library-only workspaces benefit from committing the lockfile — it forces consistency across internal crates.

For the closest cross-language comparisons, see [Should You Commit go.sum?](./should-you-commit-go-sum) and [Should You Commit Gemfile.lock?](./should-you-commit-gemfile-lock).

## Interop with cargo install and published crates

When a user runs `cargo install my-cli`, Cargo by default re-resolves dependencies from `Cargo.toml` because `Cargo.lock` is not included in the package tarball. This means a binary you publish can install with slightly different transitive versions than the ones you tested with.

You have two options if this concerns you:

1. **`cargo install --locked my-cli`** — instructs Cargo to use the lockfile from the source distribution. As of Rust 1.74, crate authors can include `Cargo.lock` in the published package by setting `package.include` or `package.publish-lockfile` appropriately, and `--locked` is the right install flag when reproducibility matters.
2. **Distribute pre-built binaries** instead of relying on `cargo install` for end users — typically via GitHub Releases, Homebrew, or `cargo-binstall`.

Most CLIs that prioritize a clean install experience document `cargo install --locked` in their README.

## Common questions

**Should I commit `Cargo.lock` for a `cargo new --lib` project?**

Yes, by default. The 2023 Cargo guidance update reversed the old "ignore for libraries" rule. Skip only if you have a specific reason — usually wanting CI to test against the latest compatible transitive versions on every run.

**Does `cargo build` rewrite `Cargo.lock` on every run?**

No. Cargo only rewrites the lockfile when resolution actually changes — typically because `Cargo.toml` was edited, or you ran `cargo update`. Routine builds leave the lockfile alone.

**What's the difference between `--locked` and `--frozen`?**

`--locked` refuses to mutate `Cargo.lock` and fails if the lockfile is out of sync with `Cargo.toml`. `--frozen` adds an additional offline guarantee — Cargo will not contact the registry at all. Use `--locked` for normal CI, `--frozen` for hermetic builds.

**What about `Cargo.lock` for a workspace with binaries and libraries?**

Commit it. The lockfile at the workspace root resolves the whole graph and is the only one Cargo creates. Workspace member crates do not produce their own lockfiles.

**Can I have multiple `Cargo.lock` files in one repo?**

Yes, if you have multiple independent Cargo projects in subdirectories (each with its own `Cargo.toml` at the project root, not as workspace members). Each independent project owns its own `Cargo.lock`. A workspace, by contrast, has exactly one at the workspace root.

## Summary

Commit `Cargo.lock`. For binaries it has been the rule since Cargo shipped, and for libraries the Rust team's 2023 guidance update made it the recommended default as well. The benefits — reproducible builds, deterministic CI, attributable failures, clean security incident response — apply to both.

Treat it as a generated artifact: regenerate via `cargo build` or `cargo update`, never hand-edit, and enforce it in CI with `cargo build --locked`. The only Rust projects that should still skip the lockfile are libraries that specifically want CI to track the latest compatible transitive versions on every run, and even those teams often commit it anyway with a separate scheduled job that exercises the unlocked resolution path.

## See Also

- [Lock Files: Commit or Ignore?](./lock-files-commit-or-ignore) — the cross-ecosystem decision frame
- [Should You Commit go.sum?](./should-you-commit-go-sum) — Go's checksum file
- [Should You Commit Gemfile.lock?](./should-you-commit-gemfile-lock) — Ruby's lockfile
- [Should You Commit uv.lock?](./should-you-commit-uv-lock) — Python's modern lockfile
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — full reference for committed-vs-ignored files
