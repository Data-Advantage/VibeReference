---
title: "Should You Commit .python-version?"
description: "Yes, commit .python-version when one Python runtime should be shared by the team. Here is when to use it, ignore it, or prefer pyproject.toml."
---

# Should You Commit .python-version?

Usually yes. If your Python project expects one default interpreter version, commit `.python-version` so every developer, CI job, and AI coding agent starts from the same runtime. Do not commit it when it only names one developer's temporary experiment or when your project intentionally supports a broad Python range without a single default.

## What .python-version is

`.python-version` is a small text file at the root of a Python project. It usually contains one Python version:

```text
3.13
```

Version managers read that file when you enter the directory. [pyenv](https://github.com/pyenv/pyenv) popularized the convention with `pyenv local`. [uv's project guide](https://docs.astral.sh/uv/guides/projects/#python-version) also treats `.python-version` as the project's default Python version for creating the virtual environment. [mise](https://mise.jdx.dev/lang/python.html#python-version-support) can read `.python-version` and `.python-versions` as idiomatic version files when that behavior is enabled.

The file is not a dependency lock file. It does not record packages, hashes, transitive dependencies, or resolver output. It answers a narrower question: which Python interpreter should this repository use by default?

That makes `.python-version` closer to `.nvmrc`, `.tool-versions`, or the Python setting inside `mise.toml` than to `uv.lock` or `poetry.lock`.

## Commit or ignore: the decision matrix

Use this matrix instead of treating every `.python-version` file the same way.

| Situation | Commit `.python-version`? | Why |
|---|---:|---|
| Python application or internal service | Yes | One runtime makes local setup, CI, and deployment consistent |
| uv-managed project | Yes | uv uses it as the project's default interpreter when creating `.venv` |
| pyenv-managed team repo | Yes | Contributors get the same local Python version automatically |
| Library supporting a broad Python range | Usually | Commit a default dev/test version, but keep the supported range in `pyproject.toml` |
| Scratch script or personal experiment | No | A private local choice does not need to leak into the repo |
| Repo already standardizes on `mise.toml` or `.tool-versions` | Maybe | Avoid two conflicting runtime declarations |
| Docker-only runtime with no local Python workflow | Maybe | Commit it only if developers run Python commands outside the container |

The short rule: commit it when the version is part of the project contract. Ignore it when the version is only local state.

## Why committing it helps

Python minor versions matter more than they look. A project tested on Python 3.13 can fail on 3.11 because of standard-library behavior, syntax, dependency wheels, or package metadata. Even patch versions can matter when a dependency only publishes wheels for certain builds.

Committing `.python-version` gives the repo a visible default. A new contributor can clone the project, run `uv sync`, `pyenv install`, or `mise install`, and land on the intended interpreter without reading a long setup guide first.

It also helps AI coding agents. Local and cloud agents often infer commands from the files in the repository. When `.python-version`, `pyproject.toml`, and the lock file agree, an agent has fewer ways to choose the wrong runtime, create an incompatible virtual environment, or rewrite dependency files from a different Python version.

That matters most in repos where Python is not the only stack. A Next.js app might have a Python worker, a data-import script, or a model-evaluation notebook sitting beside TypeScript code. Without a committed runtime hint, the Python side of the repo becomes tribal knowledge. With one, the first setup pass is mechanical.

CI gets the same benefit. Even if your workflow file explicitly names the Python version, a committed `.python-version` gives reviewers a second visible check. If GitHub Actions says `3.12` but `.python-version` says `3.13`, the mismatch is easy to spot in review.

## .python-version vs pyproject.toml

Do not use `.python-version` as the only place you describe Python compatibility.

`pyproject.toml` is the source of truth for package metadata, dependencies, build-system requirements, and supported Python ranges. A typical project should still define `requires-python`:

```toml
[project]
name = "example-app"
requires-python = ">=3.12,<3.14"
dependencies = ["fastapi>=0.115"]
```

`.python-version` chooses the default interpreter for development:

```text
3.13
```

Those two files answer different questions.

| File | Question it answers | Commit it? |
|---|---|---:|
| `pyproject.toml` | What Python range and dependencies does the project support? | Yes |
| `.python-version` | Which interpreter should local tools use by default? | Usually |
| `uv.lock` / `poetry.lock` | Which dependency versions were resolved? | Usually |
| `.venv/` | What local environment was created on this machine? | No |

For applications, the usual pattern is to commit all three project files: `pyproject.toml`, the lock file, and `.python-version`. For libraries, commit `pyproject.toml` with the broad compatibility range and use `.python-version` as the team's default development interpreter, not as the public compatibility promise.

If you need the full project-file boundary, read [Should You Commit pyproject.toml?](./should-you-commit-pyproject-toml), [Should You Commit uv.lock?](./should-you-commit-uv-lock), and [Should You Commit .venv?](./should-you-commit-venv).

## When not to commit it

There are real exceptions.

**Do not commit a temporary downgrade.** If you are debugging a package that fails on Python 3.13 and you locally pin `3.12.11` for a day, that change does not belong in the repo unless the team is actually moving the project default.

**Do not commit conflicting version files.** If the repo already has `mise.toml` with `python = "3.13"` and `.python-version` says `3.12`, tool behavior becomes harder to reason about. Pick one default source and keep the others aligned or absent. For multi-language projects, `mise.toml` or `.tool-versions` can be cleaner because Node, Python, Go, and other runtimes live in one place.

**Do not use it to claim support.** A library can support `>=3.10` while using `3.13` for local development. That is fine, but the support range belongs in `pyproject.toml` and your CI matrix. `.python-version` is a convenience default, not a compatibility matrix.

**Do not commit virtualenv names.** pyenv can store virtualenv names in `.python-version`, not only raw interpreter versions. A value like `my-project-3.13` may work on your laptop and fail everywhere else. Prefer the plain interpreter version in shared repos.

## How to handle updates

Treat `.python-version` like a small but real platform change. A diff from `3.12` to `3.13` should come with matching updates elsewhere:

```bash
3.13
```

Check these files in the same review:

- `pyproject.toml` - does `requires-python` allow the new version?
- `uv.lock`, `poetry.lock`, or `Pipfile.lock` - did the resolver output change?
- CI workflow files - do test jobs use the same runtime or an intentional version matrix?
- Dockerfile or deployment config - does production run the same interpreter?
- README setup instructions - do they still mention the old version?

If the project uses uv, `uv python pin 3.13` writes `.python-version`, and `uv sync` recreates the environment using that interpreter. If the project uses pyenv, `pyenv local 3.13` writes the same file. If it uses mise, decide whether `.python-version` is the canonical Python file or whether `mise.toml` owns runtime selection.

The most common mistake is changing `.python-version` alone. That makes local shells use the new interpreter while CI, Docker, and dependency metadata still assume the old one.

## What your .gitignore should do

Your `.gitignore` should ignore local environments and caches, not shared version files:

```gitignore
# Python environments and caches
.venv/
venv/
__pycache__/
.pytest_cache/
.ruff_cache/

# Do not add .python-version here if it is the project default.
```

If `.python-version` is already ignored, remove the ignore rule before committing the file:

```bash
git rm --cached .python-version 2>/dev/null || true
git add .gitignore .python-version
```

Only keep it ignored in repositories where every developer is expected to choose their own local interpreter and the project does not provide a default local runtime. That is less common for applications and internal services than old `.gitignore` templates imply.

## See Also

- [Should You Commit pyproject.toml?](./should-you-commit-pyproject-toml) - the shared Python project metadata file that should always be versioned.
- [Should You Commit uv.lock?](./should-you-commit-uv-lock) - how uv projects should handle resolved dependencies.
- [Should You Commit .venv?](./should-you-commit-venv) - why local Python environments stay out of Git.
- [Should You Commit mise.toml?](./should-you-commit-mise-toml) - when a multi-language runtime file is better than a Python-only version file.
- [Local AI Coding Agents](/ai-development/local-ai-coding-agents) - why local agents need deterministic runtime signals in the repo.
