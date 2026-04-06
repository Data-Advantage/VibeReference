# Should You Commit poetry.lock?

Yes. If you're building a Python application, commit `poetry.lock`. If you're building a library, it's optional — but Poetry's own documentation recommends committing it regardless.

Poetry is Python's modern dependency manager. It handles virtual environments, dependency resolution, and packaging in a single tool. Its lock file, `poetry.lock`, serves the same purpose as `package-lock.json` in JavaScript or `Gemfile.lock` in Ruby: it pins every dependency to an exact version so your installs are reproducible.

If you've been going back and forth on whether to add `poetry.lock` to `.gitignore`, this guide gives you the definitive answer.

## What poetry.lock contains

Your `pyproject.toml` declares what your project needs — packages and version constraints:

```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.115.0"
sqlalchemy = "^2.0"
pydantic = "^2.0"
```

The `^` operator means "compatible with this version." When you run `poetry install` for the first time (or `poetry lock`), Poetry resolves every constraint across your entire dependency tree and writes the result to `poetry.lock`. That file contains:

- **Exact versions** for every package, including transitive dependencies. If `fastapi` depends on `starlette`, which depends on `anyio`, all three are pinned.
- **Content hashes** for every distribution file. Poetry records SHA-256 hashes for wheels and source distributions, so tampered packages are detected at install time.
- **Platform-specific resolutions.** Poetry resolves dependencies for all supported platforms simultaneously, so the lock file works on macOS, Linux, and Windows without re-resolving.
- **A content hash of pyproject.toml** stored at the top of the lock file. This lets Poetry detect when the lock file is out of sync with your declared dependencies.

A typical `poetry.lock` for even a small project can be thousands of lines. That's normal — it's recording the full dependency graph, not just your direct dependencies.

## Why commit it: reproducible installs

The core argument is the same as every other lock file: without it, dependency resolution runs fresh every time and can produce different results.

You declare `sqlalchemy = "^2.0"`. Today that resolves to `2.0.36`. Next week, `2.0.37` is released. Without `poetry.lock` in version control, your teammate runs `poetry install` and gets 2.0.37 while you're still on 2.0.36. Usually patch versions are fine. Occasionally they introduce regressions, and now you're debugging environment differences instead of shipping features.

With `poetry.lock` committed, `poetry install` reads the lock file and installs exactly those versions. Everyone gets the same dependency tree.

### Respecting the lock file in CI

Poetry uses the lock file by default. When you run `poetry install` in a CI pipeline, it installs from `poetry.lock` — no flag required. If `poetry.lock` is out of sync with `pyproject.toml`, the install fails with an error telling you to run `poetry lock` first.

For extra strictness, use the `--no-update` flag:

```bash
# Install exactly what's in poetry.lock, no resolution
poetry install --no-update
```

This is Poetry's equivalent of `npm ci` or `yarn install --frozen-lockfile`. It refuses to modify the lock file and installs only what's already resolved.

A typical CI setup looks like this:

```yaml
# GitHub Actions example
- name: Install dependencies
  run: |
    pip install poetry
    poetry install --no-update
```

If someone changes `pyproject.toml` and forgets to update `poetry.lock`, CI catches it immediately instead of silently resolving new versions.

## The library exception

For **applications** (web apps, APIs, CLI tools, scripts) — commit `poetry.lock`. Always.

For **libraries** (packages published to PyPI that others install as a dependency) — it's less critical. Here's why: when someone installs your library with `pip install your-library` or adds it to their own `pyproject.toml`, their package manager resolves dependencies fresh based on your declared constraints. Your `poetry.lock` is never consulted. Downstream consumers generate their own lock file with their own full dependency tree.

This is the same pattern as Ruby's `Gemfile.lock` — commit for apps, optional for gems.

That said, Poetry's official documentation recommends committing `poetry.lock` even for libraries. The reasoning is practical: your library's own CI and development environment still benefit from reproducible installs. If a test starts failing, you want to know whether it's your code or a dependency update. A committed lock file gives you that clarity.

**Bottom line for libraries:** committing `poetry.lock` doesn't hurt downstream consumers (they never see it) and it helps your own development workflow. When in doubt, commit it.

## poetry.lock vs requirements.txt

If you've worked with Python for a while, you've probably used `pip freeze > requirements.txt` to pin dependencies. That approach works, but `poetry.lock` is a significant upgrade:

| | `requirements.txt` (pip freeze) | `poetry.lock` |
|---|---|---|
| **Generated from** | Whatever is currently installed | Constraint resolution against pyproject.toml |
| **Integrity hashes** | Only if you use `--require-hashes` | Always included |
| **Platform support** | Single platform (what you froze on) | All platforms resolved simultaneously |
| **Sync detection** | None — can drift from actual dependencies | Hash of pyproject.toml detects drift |
| **Dependency groups** | Manual separation into multiple files | Built-in dev/test/docs groups |

Poetry can still export to `requirements.txt` when you need it (for Docker builds or environments without Poetry):

```bash
poetry export -f requirements.txt --output requirements.txt
```

But `poetry.lock` is the source of truth. The exported `requirements.txt` is a derived artifact.

## .gitignore: don't ignore poetry.lock

Your `.gitignore` for a Poetry project should look something like this:

```gitignore
# Virtual environment
.venv/

# Python
__pycache__/
*.pyc
*.pyo

# Distribution
dist/
*.egg-info/

# Do NOT add poetry.lock here
```

If you find `poetry.lock` in your `.gitignore`, remove it. Some project templates and older guides include it by mistake, carrying over from a time when the ecosystem hadn't settled on best practices. The consensus in 2026 is clear: `poetry.lock` belongs in version control.

## Summary

Commit `poetry.lock` for applications. It gives you reproducible installs, faster CI, and protection against supply chain tampering. For libraries, it's technically optional since downstream consumers resolve their own dependencies — but there's no downside to committing it, and Poetry's documentation recommends doing so.

The pattern is consistent across every modern package manager. Lock files record the exact resolution of your dependency tree. Commit them.

For the broader picture on lock files across all ecosystems, see [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore). For a complete guide to what belongs in version control, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
