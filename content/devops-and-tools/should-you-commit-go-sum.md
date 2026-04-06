# Should You Commit go.sum?

Go modules use two files to manage dependencies: `go.mod` and `go.sum`. If you are coming from JavaScript or Python, you might assume one is the dependency file and the other is the lock file. That mental model is close but not quite right, and the difference matters. Regardless of the distinction, the answer to the title question is simple.

**Yes. Always commit both `go.mod` and `go.sum`.** The Go team explicitly recommends this. The `go.sum` file should be checked into version control alongside `go.mod`. Together they ensure that every developer, every CI pipeline, and every deployment builds your project with the exact same dependency bytes.

## What go.mod does

The `go.mod` file is the manifest for your Go module. It declares three things:

1. **Module path** — the import path for your module (e.g., `github.com/yourname/yourproject`)
2. **Go version** — the minimum Go version your module requires
3. **Dependencies** — every direct dependency your module imports, pinned to a specific version

```
module github.com/yourname/yourproject

go 1.23

require (
    github.com/gin-gonic/gin v1.10.0
    github.com/jackc/pgx/v5 v5.7.2
    golang.org/x/crypto v0.31.0
)
```

Unlike `package.json` in JavaScript, `go.mod` does not use version ranges. Each dependency is pinned to an exact version. There is no `^` or `~` operator. When you run `go get github.com/gin-gonic/gin@v1.10.0`, that exact version is recorded.

Go does apply a minimum version selection (MVS) algorithm when multiple modules in your dependency graph require the same package at different versions. MVS picks the minimum version that satisfies all requirements. But the result is still deterministic and recorded in `go.mod`.

## What go.sum does

The `go.sum` file is a verification database. It contains cryptographic checksums (SHA-256 hashes) for every module version your project has ever downloaded — including both the module source code and the `go.mod` file of each dependency.

Each line in `go.sum` follows this format:

```
github.com/gin-gonic/gin v1.10.0 h1:AbCdEf123456...=
github.com/gin-gonic/gin v1.10.0/go.mod h1:XyZaBc789...=
```

That is two entries per dependency version: one hash for the module's source tree and one hash for its `go.mod` file. When the Go toolchain downloads a module, it computes the hash of what it received and compares it against the entry in `go.sum`. If they do not match, the build fails immediately.

This protects you from several threats:

- **Registry tampering** — if a module host serves different code than what you originally downloaded, the hash mismatch catches it.
- **Proxy substitution** — if you fetch through a module proxy (the default) and the proxy serves altered code, the mismatch catches it.
- **Dependency confusion** — any unexpected change in dependency content is flagged before it can affect your build.

## go.sum is NOT a lock file

This is where Go differs from the JavaScript ecosystem. In npm or yarn, the lock file (`package-lock.json`, `yarn.lock`) serves two roles: it pins exact versions and it verifies integrity. In Go, those roles are split:

- **`go.mod` pins versions.** Because Go uses exact versions (not ranges) and minimum version selection, `go.mod` itself determines which versions get used. There is no separate resolution step that needs to be "locked."
- **`go.sum` verifies integrity.** It does not influence which versions are selected. It only confirms that the bytes you download today match the bytes you downloaded before.

This means `go.sum` is more accurately described as a checksum database than a lock file. But the practical advice is the same: **commit it.** Without `go.sum` in your repository, the Go toolchain cannot verify that dependencies have not been tampered with. You lose the supply chain security that Go modules provide by design.

## The Go checksum database

Go has a second layer of verification beyond your local `go.sum` file. By default, the Go toolchain checks downloaded modules against the Go checksum database at `sum.golang.org`. This is a global, append-only, auditable log of checksums for publicly available modules.

When you download a new dependency, the Go toolchain:

1. Fetches the module from the module proxy (default: `proxy.golang.org`)
2. Computes the hash of the downloaded content
3. Checks that hash against `sum.golang.org`
4. Records the hash in your local `go.sum` file

If the checksum database has a different hash than what you downloaded, the build fails. This means even if an attacker compromises a module host, they cannot serve different code to different users without detection — the global database creates a single source of truth.

Your local `go.sum` file works in concert with this system. It provides offline verification (you do not need to contact `sum.golang.org` on every build) and it protects private modules that are not indexed by the public checksum database.

## go.sum grows over time

One thing that surprises developers new to Go modules: `go.sum` accumulates entries. If you upgrade a dependency from `v1.9.0` to `v1.10.0`, the checksums for `v1.9.0` stay in `go.sum`. If a transitive dependency was briefly pulled in and then removed, its checksums remain.

This is by design. The Go team's rationale is that keeping old checksums allows the toolchain to verify modules that might be needed during downgrades or when checking out older commits. It also means `go.sum` can only grow, never shrink, through normal operations.

In practice, this means `go.sum` gets longer than you might expect. A project with 20 direct dependencies might have hundreds of lines in `go.sum`. This is normal. The file is small in absolute terms and compresses well in git. Do not try to manually edit it.

## Cleaning up with go mod tidy

If the growing `go.sum` bothers you, or if you want to remove entries for dependencies you no longer use, run:

```bash
go mod tidy
```

This command does two things:

1. **Adds** any missing dependencies that your code imports but that are not yet in `go.mod`
2. **Removes** any dependencies from `go.mod` and `go.sum` that your code no longer uses

After running `go mod tidy`, your `go.sum` will contain only the checksums needed for your current dependency graph. It is good practice to run this periodically and before committing dependency changes. Many teams add it to their CI pipeline as a check — if `go mod tidy` produces a diff, the build fails, ensuring the committed `go.sum` is always clean.

```bash
# CI check: ensure go.sum is tidy
go mod tidy
git diff --exit-code go.mod go.sum
```

## What to put in .gitignore

For a Go project, your `.gitignore` should NOT include `go.mod` or `go.sum`. Both belong in version control, always.

If you use vendoring (`go mod vendor`), you have a choice. Some teams commit the `vendor/` directory for fully offline, hermetic builds. Others add `vendor/` to `.gitignore` and run `go mod vendor` in CI. Either approach works. If you are not vendoring, you will not have a `vendor/` directory and this does not apply.

A minimal `.gitignore` for a Go project:

```
# Compiled binary
/your-binary-name

# OS files
.DS_Store

# IDE
.idea/
.vscode/

# Vendor (if not committing)
# vendor/
```

Notice what is absent: `go.mod` and `go.sum` are not listed. They should never be ignored.

## Summary

| File | Commit? | Purpose |
|------|---------|---------|
| `go.mod` | Yes | Module path, Go version, dependency versions |
| `go.sum` | Yes | Cryptographic checksums for dependency verification |
| `vendor/` | Your choice | Vendored dependency source code |

Both `go.mod` and `go.sum` are essential parts of your project's source of truth. The first defines what you depend on. The second proves that what you download is what you expect. Commit both, run `go mod tidy` to keep them clean, and move on to building your project.

## Related articles

- [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore)
- [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide)
