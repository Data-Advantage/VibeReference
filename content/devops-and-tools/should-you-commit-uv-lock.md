# Should You Commit uv.lock?

Yes. If your project uses `uv`, commit `uv.lock`. For applications it is non-negotiable. For libraries it is still the recommended default, even though downstream consumers never see it.

`uv` is Astral's Rust-built Python package and project manager. By 2026 it has displaced `pip-tools`, `Pipenv`, and a large share of `Poetry` workflows for new Python projects — it resolves dependencies in seconds, manages virtual environments, runs scripts, and pins Python interpreter versions. The artifact it produces, `uv.lock`, is a universal lockfile that captures the full resolved dependency tree across platforms.

If you've added `uv` to a project and you're staring at `git status` wondering whether `uv.lock` belongs in version control or `.gitignore`, this is the definitive answer.

## What uv.lock actually contains

Your `pyproject.toml` declares what the project depends on at the constraint level:

```toml
[project]
name = "my-app"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "sqlalchemy>=2.0",
    "pydantic>=2.0",
]
```

When you run `uv lock` (or any project command that needs an up-to-date lockfile, like `uv sync` or `uv run`), uv resolves every constraint and writes the result to `uv.lock` in TOML format. That file records:

- **Pinned versions for every package** in the dependency tree, including transitive dependencies. If `fastapi` pulls in `starlette`, which pulls in `anyio`, all three are locked.
- **Content hashes** (typically SHA-256) for every wheel and source distribution. Hashes are verified at install time, which detects tampering with mirrored or cached artifacts.
- **Source metadata** — the index URL, registry, Git revision, or local path each package came from. uv records exactly where the artifact was fetched, so the resolution can be reproduced byte-for-byte.
- **Per-environment markers.** uv's lockfile is *cross-platform*. A single `uv.lock` records which packages apply to which Python versions, operating systems, and CPU architectures. Resolving on macOS still produces a lockfile that installs correctly on Linux x86_64 and Linux aarch64 without re-resolving.
- **Resolution metadata** — the `requires-python` range, dependency groups, optional extras, and a fork tree describing how conflicting constraints were resolved across environments.

A typical `uv.lock` for a small FastAPI project is a few thousand lines of TOML. That is normal — it is the full dependency graph encoded for every supported platform, not just the packages you typed.

## Why commit it: reproducible installs

Every modern package manager's lockfile exists for the same reason, and `uv.lock` is no exception. Without a committed lockfile, dependency resolution runs fresh on every machine and every CI job, and the results drift.

You declare `sqlalchemy>=2.0`. On Monday that resolves to `2.0.36`. A teammate clones the repo on Thursday after `2.0.37` is released, and now their environment is one patch ahead of yours. Patch releases are usually safe, but every Python developer has eventually been bitten by a transitive dependency updating mid-sprint and breaking a test that has nothing to do with the change they were making.

With `uv.lock` committed, every contributor running `uv sync` gets the exact same dependency tree on every platform. The same goes for production builds — Docker images resolve from the lockfile, not from PyPI's current state.

### Enforcing the lockfile in CI

uv's default behavior already respects `uv.lock` — but for CI and release workflows you should be explicit. Two flags control how strictly the lockfile is treated:

- **`--locked`**: assert that the lockfile is already up to date with `pyproject.toml`. uv refuses to mutate the lockfile and errors out if `pyproject.toml` has drifted from it. This is the strict mode you want in CI.
- **`--frozen`**: skip lockfile resolution entirely and install only what is already pinned in `uv.lock`. uv does not even check whether `pyproject.toml` has changed.

For most CI pipelines, `--locked` is the right choice — it both pins the install *and* catches the "someone changed pyproject.toml without re-locking" mistake:

```yaml
# GitHub Actions example
- uses: astral-sh/setup-uv@v3
- name: Install dependencies
  run: uv sync --locked --no-dev
- name: Run tests
  run: uv run --locked pytest
```

You can also verify the lockfile in a standalone step:

```bash
uv lock --check
```

This is equivalent to `--locked` for the lock command: uv exits non-zero if the lockfile would need to be rewritten. Use it as a pre-commit hook or a dedicated CI step to fail fast on stale lockfiles.

For deployments where you want the maximum guarantee that no resolution happens at all — for example, building a production Docker image where you've already verified the lockfile in a previous CI stage — use `--frozen`:

```dockerfile
RUN uv sync --frozen --no-dev
```

## The library exception (and why you should commit anyway)

The traditional Python rule of thumb is "commit lockfiles for applications, optional for libraries." The reasoning is sound: when someone installs your library with `pip install your-library` or adds it as a dependency in their own `pyproject.toml`, your `uv.lock` is never consulted. Their package manager resolves dependencies fresh against your declared constraints.

So for libraries, the lockfile only affects *your own* development environment, not downstream consumers.

That said, the modern recommendation — including from Astral — is to commit `uv.lock` for libraries too. Three reasons:

1. **Reproducible development environments.** Contributors to your library benefit from the same reproducibility guarantee as anyone working on an application. A failing test should be your code, not a dependency that updated overnight.
2. **Reproducible CI runs.** Your library's CI runs against a specific set of versions. Without a lockfile, intermittent failures from transitive dependency updates become impossible to attribute.
3. **No downside.** Downstream consumers never see `uv.lock`. Committing it costs nothing and helps your team.

**Bottom line:** if there is any non-trivial dependency tree in your `pyproject.toml`, commit `uv.lock`. The historical "libraries don't need lockfiles" advice predates the era when lockfiles were essentially free to maintain.

## uv.lock vs requirements.txt

If your past Python workflow involved `pip freeze > requirements.txt`, `uv.lock` solves the same problem more completely:

| | `requirements.txt` (pip freeze) | `uv.lock` |
|---|---|---|
| **Source of truth** | Whatever happens to be installed right now | Resolution against `pyproject.toml` constraints |
| **Integrity hashes** | Only when manually used with `--require-hashes` | Always included |
| **Platforms** | Single environment (what you froze on) | All supported platforms resolved together |
| **Drift detection** | None — can silently get out of sync | Hash of `pyproject.toml` plus `uv lock --check` |
| **Dependency groups** | Manual splitting into multiple files | Native dev / extras / groups support |
| **Editable installs** | Lost in `pip freeze` output | Recorded faithfully |

If you still need a `requirements.txt` for environments without `uv` — older Lambda runtimes, AWS Glue jobs, a Dockerfile that pre-dates the uv migration — export one from the lockfile:

```bash
uv export --format requirements.txt --output-file requirements.txt
```

The exported file is a derived artifact. The source of truth remains `uv.lock`, which you regenerate via `uv lock` and verify via `uv lock --check`.

## .gitignore: keep uv.lock out of the ignore list

A reasonable `.gitignore` for a uv-managed Python project looks something like this:

```gitignore
# Virtual environments
.venv/

# uv cache
.uv/

# Python build artifacts
__pycache__/
*.pyc
*.pyo
build/
dist/
*.egg-info/

# Do NOT add uv.lock here
```

Two specific files to be deliberate about:

- **`uv.lock`** — commit it. Never `.gitignore` it.
- **`.python-version`** — usually commit it. uv reads this file (and `pyproject.toml`'s `requires-python`) to install the right interpreter via `uv python install`. Committing pins the interpreter for the whole team.

If you find `uv.lock` already in `.gitignore` — probably copied from an older `pip-tools`-era template — remove it, commit the existing `uv.lock`, and add `uv lock --check` to CI to keep it honest going forward.

## Migrating from poetry.lock, Pipfile.lock, or pip-tools

A common path to uv is migrating from Poetry, Pipenv, or `pip-compile` (`pip-tools`). The migration story for the lockfile is straightforward: there is no compatible format, so uv generates a fresh `uv.lock` from your `pyproject.toml` constraints (or imports requirements with `uv add -r requirements.txt`).

Practical steps for an existing project:

1. Run `uv init` if needed, or ensure your `pyproject.toml` declares dependencies under `[project]`.
2. Delete the old lockfile (`poetry.lock`, `Pipfile.lock`, `requirements.lock`) after capturing the previous resolution if you need a reference.
3. Run `uv lock` to generate `uv.lock` from `pyproject.toml`.
4. Verify with `uv sync` and your test suite.
5. Commit `uv.lock` and update CI to call `uv sync --locked` instead of the previous tool.

A common surprise: the first `uv.lock` may resolve to slightly different versions than the previous tool produced, because uv applies its own (PubGrub-style) resolver and may pick newer compatible versions. Treat this as a one-time dependency update — run your tests, address any breakage, then commit.

## Common questions

**Should multiple developers' `uv.lock` files conflict in git?**

If two contributors add dependencies on the same branch, `uv.lock` will conflict. The resolution is to accept one side, then re-run `uv lock` to regenerate a consistent file. Don't hand-edit the lockfile.

**Does uv re-lock on every `uv sync`?**

By default `uv sync` will re-resolve if `pyproject.toml` has changed since the lockfile was written. Use `--locked` to forbid that behavior in CI. Use `--frozen` to skip the check entirely.

**Should you commit `uv.lock` for ephemeral scripts?**

For single-file scripts using `uv run` with PEP 723 inline metadata, there is no `uv.lock` to commit — the script's dependencies are embedded in the file itself. For project-style scripts living in a real `pyproject.toml`, the same answer applies as for applications: commit it.

**What about monorepos and uv workspaces?**

uv workspaces produce a single `uv.lock` at the workspace root that covers every member package. Commit the root lockfile. Individual workspace members do not have their own lockfile.

## Summary

Commit `uv.lock`. Always for applications, default-on for libraries, and especially in any project running on more than one machine or in CI. The file gives you:

- Identical dependency trees across every developer and every deploy
- Hash-verified installs that catch tampered artifacts
- Cross-platform resolution from a single file
- Drift detection via `uv lock --check`
- Fast, deterministic CI installs via `uv sync --locked`

The historical "library lockfiles are optional" carve-out still technically applies, but in 2026 the practical recommendation is the same for both: keep it under version control, treat it as a generated artifact (regenerate, don't edit), and let `uv lock --check` catch drift before it reaches production.

For the broader picture across every ecosystem's lockfiles, see [Lock Files: Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore). For the closest Python-ecosystem comparison, see [Should You Commit poetry.lock?](/devops-and-tools/should-you-commit-poetry-lock). For a full guide to what belongs in version control, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
