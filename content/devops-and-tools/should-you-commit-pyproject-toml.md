---
title: "Should You Commit pyproject.toml?"
description: "Yes, commit pyproject.toml. It defines Python build metadata, dependencies, and tool config that every contributor and CI run needs."
---

# Should You Commit pyproject.toml?

Yes. Commit `pyproject.toml` to your Git repository. In a modern Python project, it is shared project configuration: build-system requirements, package metadata, dependencies, and tool settings that developers, CI, packaging tools, and AI coding agents all need to read from the same source.

Do not treat it like a lock file or a local environment file. `pyproject.toml` is usually hand-authored and reviewable. The disposable files are virtual environments, caches, build output, and local secret files around it.

## What pyproject.toml is

`pyproject.toml` is the standard configuration file for Python packaging-related tools. The Python Packaging User Guide describes it as the place where Python projects define build-system information, project metadata, dependencies, optional dependencies, and tool-specific configuration.

The file usually has three kinds of content:

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "example-app"
version = "0.1.0"
dependencies = ["fastapi", "uvicorn"]

[tool.ruff]
line-length = 100
```

The `[build-system]` table comes from [PEP 518](https://peps.python.org/pep-0518/) and tells build frontends such as pip what build backend and build-time dependencies are needed before the project can be built. The `[project]` table comes from [PEP 621](https://peps.python.org/pep-0621/) and gives packaging tools a standard place to read core metadata. The `[tool.*]` tables are namespaces for tools such as Ruff, Black, pytest, mypy, Hatch, Poetry, or uv.

That makes `pyproject.toml` closer to `package.json`, `tsconfig.json`, or `mise.toml` than to a generated artifact.

## Commit or ignore: the decision matrix

Use this matrix when deciding what belongs in Git.

| File or directory | Commit it? | Why |
|---|---|---|
| `pyproject.toml` | Yes | Shared build, metadata, dependency, and tool configuration |
| `uv.lock`, `poetry.lock`, `Pipfile.lock` | Usually yes | Reproducible dependency resolution for the chosen package manager |
| `.venv/`, `venv/` | No | Local virtual environments are rebuilt from project files |
| `dist/`, `build/`, `*.egg-info/` | Usually no | Generated package output, not source |
| `.pytest_cache/`, `.ruff_cache/`, `.mypy_cache/` | No | Local tool caches |
| `.env` with secrets | No | Credentials do not belong in Git |

The important distinction is source of truth versus local output. `pyproject.toml` is source of truth. A virtual environment is output. A lock file is generated, but it is generated source of truth for dependency resolution, so most application repos commit it too.

## Why committing pyproject.toml matters

Committing `pyproject.toml` makes the Python project installable and buildable by anyone who clones it. Without it, contributors have to guess which backend to use, which dependencies exist, which Python versions are supported, and which lint or test settings are authoritative.

It also protects CI. Pip's build-system interface reads the file to determine build requirements before building a source distribution or wheel. If CI does not have the file, it cannot reliably reproduce the same install path you used locally.

Package metadata belongs there too. If your project can be distributed, the `[project]` table defines fields such as name, version, description, dependencies, entry points, and optional dependency groups. Even if the app is private and never goes to PyPI, that metadata often drives local installs, test environments, editable installs, and deployment packaging.

Tool configuration is the third reason. Python projects used to scatter settings across `setup.cfg`, `tox.ini`, `.flake8`, `pytest.ini`, and tool-specific files. Many teams still use those files, but `pyproject.toml` is now the common home for shared tool config. If your repository expects `ruff check`, `pytest`, or `mypy` to behave a certain way, that behavior should be versioned with the code it checks.

AI coding agents benefit from the same clarity. A committed `pyproject.toml` tells a local or cloud coding agent which package manager, test commands, lint rules, and Python constraints are real. Pair it with durable repo instructions such as [Should You Commit AGENTS.md?](./should-you-commit-agents-md) when you want agents to stop rediscovering the project on every task.

## What belongs in pyproject.toml

Put shared project behavior in `pyproject.toml`.

For a package, that usually includes:

- Build backend and build requirements.
- Project name, version, description, authors, license, and supported Python version.
- Runtime dependencies.
- Optional dependency groups for extras such as `dev`, `test`, or `docs`.
- Console scripts or entry points.
- Tool configuration that should be identical for every contributor.

For an application, it may include less packaging metadata and more tool configuration, but the commit answer stays the same. A private FastAPI app might not need a PyPI-ready description, but it still needs dependency metadata, Python-version constraints, formatter settings, and test config.

Keep the file boring. A strong `pyproject.toml` makes setup predictable; it does not hide deployment secrets, machine-specific paths, or one developer's experimental flags.

## What to keep out of pyproject.toml

Do not put secrets in `pyproject.toml`. A package index token, database URL, cloud credential, private API key, or production webhook secret belongs in a secret manager, deployment environment, or ignored local env file. Naming an environment variable is fine; committing its value is not.

Avoid machine-specific paths too:

```toml
[tool.example]
cache_dir = "/Users/alex/tmp/my-project-cache"
```

That value will break for everyone else. If a tool needs a cache, prefer a relative path under an ignored cache directory, or let the tool use its default.

Be cautious with deployment-only config. Some build metadata is safe to commit because it describes the package. Runtime credentials, private endpoints, and environment-specific toggles usually belong outside the repository. The same boundary applies as in [Should You Commit Your .env File to Git?](./should-you-commit-env-file): commit names, templates, and safe defaults; keep values private.

## pyproject.toml vs lock files

`pyproject.toml` and lock files solve different problems.

`pyproject.toml` describes intent: package metadata, dependency ranges, supported Python versions, and tool settings. A lock file records one resolved dependency graph from that intent. For example, `pyproject.toml` might say your app depends on `fastapi>=0.115`; `uv.lock` or `poetry.lock` records the exact FastAPI release and all transitive packages used in a particular install.

That means you usually commit both:

| Project type | Commit `pyproject.toml`? | Commit lock file? |
|---|---:|---:|
| Python application | Yes | Yes |
| Internal service | Yes | Yes |
| Reusable library | Yes | Usually yes for development reproducibility |
| Single-file script with no packaging | Only if tools use it | No lock file unless dependencies are managed |
| Tool-only config repo | Yes if tools read it | Only if dependencies are resolved there |

If you use uv, read [Should You Commit uv.lock?](./should-you-commit-uv-lock). If you use Poetry, read [Should You Commit poetry.lock?](./should-you-commit-poetry-lock). If the project still uses Pipenv, read [Should You Commit Pipfile.lock?](./should-you-commit-pipfile-lock).

The wrong pattern is committing `pyproject.toml` but ignoring the lock file for an application that depends on deterministic installs. The opposite pattern is worse: a lock file without the project file leaves future maintainers with generated output but no clear source intent.

## How to handle updates and conflicts

Treat `pyproject.toml` as a reviewed configuration file. When it changes, the diff should explain a real project change: a dependency was added, the Python version moved, the build backend changed, a CLI entry point appeared, or lint rules changed.

Do not let automated tools rewrite unrelated sections casually. Some package managers and formatters will reorder tables or normalize fields. That can be fine, but avoid mixing a mechanical rewrite with a dependency or build-backend change. Reviewers need to see the behavioral change.

Merge conflicts are usually manageable because TOML is human-readable. Use these rules:

1. Keep both unrelated additions, such as one branch adding a dependency and another branch adding a Ruff setting.
2. If two branches changed the same dependency range, choose the range that matches the code being merged and rerun the install.
3. If a build backend or Python version changed, run the smallest build and test path that proves the repository still works.
4. Regenerate the lock file after resolving dependency-related conflicts.

For a broader map of repository hygiene, use [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide). For Python environment output specifically, [Should You Commit .venv?](./should-you-commit-venv) covers why the virtual environment stays ignored even when `pyproject.toml` is committed.

## The bottom line

Commit `pyproject.toml`. It is the shared contract for how your Python project builds, installs, packages, and validates itself. Review it like source code, keep secrets and local paths out of it, and pair it with the appropriate lock file for reproducible installs.

## See Also

- [Should You Commit uv.lock?](./should-you-commit-uv-lock) - the modern Python lockfile decision for uv projects.
- [Should You Commit poetry.lock?](./should-you-commit-poetry-lock) - how Poetry projects should handle resolved dependencies.
- [Should You Commit .venv?](./should-you-commit-venv) - why local Python environments stay out of Git.
- [Should You Commit AGENTS.md?](./should-you-commit-agents-md) - repo-level instructions for AI coding agents.
- [Local AI Coding Agents](/ai-development/local-ai-coding-agents) - why local agents need clear project setup and validation commands.
