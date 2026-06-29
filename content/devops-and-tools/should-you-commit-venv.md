---
title: "Should You Commit Your venv or .venv Folder to Git?"
description: "No — never commit a Python virtual environment. It's large, full of hardcoded absolute paths, and platform-specific. Here's the .gitignore line and the fix."
---

# Should You Commit venv to Git?

No. Never commit a Python virtual environment — whether it's named `venv`, `.venv`, `env`, or anything else — to your Git repository. A virtual environment is build output, not source. It's large, it's full of absolute paths that only make sense on the machine that created it, and it contains binaries compiled for one specific operating system and CPU. None of that belongs in version control, and all of it is reproducible from files you're already committing: `requirements.txt`, `pyproject.toml`, and your lock file.

This is the Python equivalent of committing `node_modules/`, and it's just as common a mistake for solo founders and people new to Python. The good news is the fix is one line in `.gitignore`. If you've already committed your environment, this guide covers how to untrack it without breaking your local setup.

## The short answer

| Question | Answer |
|---|---|
| Commit `venv` / `.venv`? | **No** — always ignore it. It's reproducible build output. |
| What do you commit instead? | `requirements.txt`, `pyproject.toml`, and your lock file (`poetry.lock`, `uv.lock`, `Pipfile.lock`). |
| Why not? | Large, hardcoded absolute paths, platform-specific binaries. |
| The `.gitignore` line? | `.venv/` and `venv/` (plus `env/` if you use that name). |
| Already committed it? | `git rm -r --cached .venv` then commit. |

## Why a virtual environment must never be committed

There are three independent reasons, and each one alone is enough.

### It's full of hardcoded absolute paths

This is the reason most people don't know about, and it's the most damaging. When you create a virtual environment, Python writes the absolute path to your interpreter directly into the environment's files. The `pyvenv.cfg` at the root records something like `home = /Users/you/projects/app/.venv/bin`, and every `activate` script (`activate`, `activate.fish`, `Activate.ps1`) hardcodes the full path to the environment directory.

Those paths exist only on your machine. When a collaborator clones the repo, or your CI runner checks it out, the paths point nowhere. The environment doesn't "mostly work" — it's broken on arrival. Worse, the `bin/` directory's console scripts (the `pip`, `black`, `pytest` shims) have your interpreter path baked into their shebang lines, so they fail with confusing "bad interpreter: no such file or directory" errors that look like a corrupted install.

### It contains platform-specific binaries

A virtual environment isn't portable across operating systems. The `bin/` directory (or `Scripts/` on Windows) contains compiled executables, and `site-packages` holds compiled extension modules — the `.so` files on Linux and macOS, `.pyd`/`.dll` files on Windows — for any package with a C component. Libraries like `numpy`, `pandas`, `pydantic`, `cryptography`, and `pillow` all ship architecture-specific compiled wheels.

An environment created on macOS ARM will not run on a Linux x86 CI server. The Python version is pinned too: a `.venv` built against Python 3.11 won't work if a teammate runs 3.12. Committing the environment doesn't share a working setup — it shares a setup that works on exactly one machine.

### It's large and completely reproducible

A virtual environment for a real data or web project routinely runs 100–500 MB or more once you've installed something like `torch`, `tensorflow`, or the scientific stack. Git stores the full history of every file, so even after you delete the environment, it lives in your `.git/` directory forever unless you rewrite history.

And it's redundant. Your dependency declaration files are a complete recipe for rebuilding the environment from scratch. There is no information in a committed `.venv` that isn't already captured — more reliably — by `requirements.txt`, `pyproject.toml`, and your lock file.

## What to commit instead

Commit the source of truth for your dependencies, and let each machine build its own environment.

- **`requirements.txt`** — the classic pinned dependency list for pip workflows.
- **`pyproject.toml`** — the modern project manifest used by Poetry, uv, Hatch, and pip itself.
- **Your lock file** — `poetry.lock`, `uv.lock`, or `Pipfile.lock`. These pin exact versions and hashes so installs are reproducible. (See [Should You Commit poetry.lock?](./should-you-commit-poetry-lock) and [Should You Commit uv.lock?](./should-you-commit-uv-lock) for the per-tool rules.)

On a new machine or in CI, you rebuild the environment from those files:

```bash
# pip
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# uv (recreates .venv from the lock file)
uv sync

# Poetry
poetry install
```

These installs are fast and deterministic, and they produce an environment built for *that* machine's OS, architecture, and Python version — which is exactly the point.

## Where each tool puts the environment

Whether you even see a `venv` folder in your project depends on the tool. Some create it inside the project (where you must ignore it); others store it outside, in a cache directory, where Git never sees it.

| Tool | Default location | In your repo? | Default folder name |
|---|---|---|---|
| `python -m venv` (built-in) | Project root | Yes — ignore it | whatever you name it (`venv`, `.venv`) |
| `virtualenv` | Project root | Yes — ignore it | whatever you name it |
| `uv` | Project root | Yes — ignore it | `.venv` |
| Poetry (default) | Global cache (`~/.cache/pypoetry`) | No | n/a |
| Poetry (`virtualenvs.in-project = true`) | Project root | Yes — ignore it | `.venv` |
| Pipenv | Global cache (`~/.local/share/virtualenvs`) | No | n/a |

The practical takeaway: `venv`, `virtualenv`, and `uv` put the environment in your project by default, so they're the ones you have to guard against. Poetry and Pipenv keep it out of the way unless you opt into an in-project `.venv`.

## The .gitignore setup

Add the environment directory to `.gitignore` before your first commit. To cover the common names in one shot:

```gitignore
# Python virtual environments
.venv/
venv/
env/
ENV/
```

Recent versions of the built-in `venv` module (Python 3.13, released October 2024) write a `.gitignore` *inside* the new environment folder automatically, so the environment ignores its own contents. That's a helpful backstop, but you should still ignore the directory from your project root so the rule is explicit and survives older Python versions and other tools.

## If you already committed your virtual environment

If `.venv` is already tracked, untrack it without deleting your working copy.

```bash
# 1. Add it to .gitignore (if you haven't)
echo ".venv/" >> .gitignore

# 2. Remove it from Git's index but keep the files on disk
git rm -r --cached .venv

# 3. Commit the removal
git add .gitignore
git commit -m "Stop tracking .venv virtual environment"
```

The `--cached` flag is what keeps your local environment intact — it removes the files from Git's index only, not from your filesystem, so your project keeps working while you push the fix.

That stops tracking going forward, but the old commits still contain the environment and your `.git/` directory stays bloated. If the repo size is genuinely a problem, rewrite history with [git-filter-repo](https://github.com/newren/git-filter-repo):

```bash
git filter-repo --path .venv/ --invert-paths
```

This rewrites commit hashes, so every collaborator has to re-clone. Only reach for it when the bloat is actually causing pain.

## The bottom line

A virtual environment is the Python build output, not your source. It's hundreds of megabytes, hardcoded to one machine's paths, and compiled for one OS — so committing it shares something that works nowhere but the laptop it was born on. Add `.venv/` and `venv/` to `.gitignore`, commit your `requirements.txt` / `pyproject.toml` / lock file instead, and rebuild the environment per machine with `pip install`, `uv sync`, or `poetry install`. If it's already in your history, `git rm -r --cached .venv` untracks it without touching your local setup.

## See Also

- [Should You Commit node_modules to Git?](./should-you-commit-node-modules) — the JavaScript twin of this mistake, with the same reproducible-build-output logic
- [Should You Commit __pycache__?](./should-you-commit-pycache) — the other Python directory that's pure generated artifact and belongs in `.gitignore`
- [Should You Commit poetry.lock?](./should-you-commit-poetry-lock) — the lock file you *do* commit so environments rebuild identically
- [Should You Commit uv.lock?](./should-you-commit-uv-lock) — the uv equivalent, and why uv's `.venv` is disposable
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — the full committed-vs-ignored reference this series builds on
