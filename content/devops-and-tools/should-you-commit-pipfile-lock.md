---
title: "Should You Commit Pipfile.lock to Your Git Repository?"
description: "Yes for applications, no for libraries. Here's what Pipfile.lock contains, why pipenv generates it, and the deploy and sync flags that make CI deterministic."
---

# Should You Commit Pipfile.lock?

Yes for applications. No for libraries published to PyPI. Pipenv's lockfile is the deterministic install record for your Python project, and the rule for whether it belongs in version control follows the same pattern as every other modern ecosystem: applications own their resolution and must reproduce it; libraries leave resolution to whoever installs them.

If you've just run `pipenv install` for the first time and you're staring at a 1,200-line JSON file wondering whether to add it to `.gitignore`, this article gives you the answer plus the deploy flags, the CI layout, and the reasoning that matters.

## The short answer

| Project type | Commit `Pipfile.lock`? | Why |
|---|---|---|
| Web application, API, CLI tool | **Yes** | Deployments must install the same versions you tested against. |
| Internal automation, scripts, ETL job | **Yes** | Same reasoning — anything you run is an application. |
| Library published to PyPI | **No** | Downstream consumers resolve their own dependencies; your lockfile is dead weight. |
| Tutorial or sandbox repo | **Yes** | Readers should reproduce your exact environment. |

This article focuses on the application case, where the answer is non-negotiable. The library exception is at the end.

## What Pipfile.lock contains

Your `Pipfile` declares what your project wants — packages and version constraints in TOML:

```toml
[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
requests = "*"
flask = ">=3.0"
sqlalchemy = "~=2.0"

[dev-packages]
pytest = "*"
ruff = "*"

[requires]
python_version = "3.12"
```

When you run `pipenv install` or `pipenv lock`, pipenv resolves every constraint across your full dependency tree and writes the result to `Pipfile.lock` — a JSON file (not TOML) with four important pieces:

1. **Exact versions** for every package, including transitive dependencies. If `flask` depends on `werkzeug`, which depends on `markupsafe`, all three are pinned to specific versions.
2. **SHA-256 hashes** for every distribution. Pipenv records hashes for both wheels and source distributions, so a tampered package fails install instead of executing.
3. **Source metadata** — which index each package came from, so you can use private mirrors alongside PyPI without ambiguity.
4. **A `_meta.hash` field** at the top of the file. This is a hash of your `Pipfile` itself. Pipenv uses it to detect when the lockfile is out of sync with the declared dependencies.

A typical `Pipfile.lock` for a small Flask project runs 800–1,500 lines. That's the full dependency graph being recorded, not just your direct dependencies.

## Why commit it: reproducible installs

The argument is identical to every other lockfile. Without `Pipfile.lock` in version control, dependency resolution runs fresh on every machine and can produce different results.

You declare `flask = ">=3.0"`. Today that resolves to `3.0.3`. Next month, `3.1.0` ships. Without the lockfile committed, your teammate runs `pipenv install` and gets 3.1.0 while you're still on 3.0.3. Most minor releases are fine. Occasionally one introduces a regression, and now you're debugging environment drift instead of shipping the feature you actually opened the editor to write.

With `Pipfile.lock` committed, `pipenv install` reads the lockfile and installs exactly those versions. Every developer, every CI runner, every deployment box installs the same dependency tree from the same hashes.

## `pipenv install` vs `pipenv sync` vs `pipenv install --deploy`

This is the distinction most pipenv users miss, and it's the reason the lockfile matters in CI specifically.

**`pipenv install`** reads `Pipfile`, resolves constraints, installs packages, and updates `Pipfile.lock` if anything changed. Use it during development when you're adding or updating dependencies.

**`pipenv sync`** reads `Pipfile.lock` directly and installs exactly those versions. It does not touch `Pipfile`. If the lockfile is missing or empty, `pipenv sync` fails. This is pipenv's equivalent of `npm ci`.

**`pipenv install --deploy`** is the CI-safe variant. It installs from `Pipfile.lock` and refuses to run if the lockfile is out of sync with `Pipfile`. If someone changed `Pipfile` without regenerating the lockfile, `--deploy` fails the build immediately instead of silently resolving new versions.

Your CI pipeline, Docker builds, and deployment scripts should always use one of the deterministic forms — never bare `pipenv install` without `--deploy`.

```yaml
# GitHub Actions example
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-python@v5
    with:
      python-version: '3.12'
  - run: pip install pipenv
  - run: pipenv install --deploy --dev
  - run: pipenv run pytest
```

`--deploy` is the gate. `--dev` includes packages from the `[dev-packages]` section, which you need for running tests and linters but not for shipping the application itself.

## Docker and production

For Docker images, the cleanest pattern is to install into the system Python and skip the virtual environment entirely, because the container is already an isolated environment:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir pipenv

COPY Pipfile Pipfile.lock ./

RUN pipenv install --deploy --system

COPY . .

CMD ["gunicorn", "app:app"]
```

Two flags do the work:

- `--deploy` enforces lockfile consistency.
- `--system` installs into the container's system Python instead of creating a virtualenv inside the image. This avoids the double-layer of `/.venv/` inside `/app/`, which complicates path resolution and bloats the image.

Some teams prefer `pipenv requirements > requirements.txt` followed by `pip install -r requirements.txt --require-hashes`. That works too, and it's faster because it skips pipenv at install time. Either approach starts from the same committed `Pipfile.lock`.

## Common objections (and why they're wrong)

**"The file is huge and clutters my diffs."**

It is large — typically 800–1,500 lines. But it changes only when you add, remove, or update a dependency, which is usually a deliberate action. A `Pipfile.lock` diff in a PR is informative, not noise: it tells the reviewer exactly which transitive dependencies shifted.

**"My CI re-resolves anyway, so the lockfile doesn't matter."**

That means your CI is wrong. Bare `pipenv install` resolves fresh and is not deterministic. Switch to `pipenv install --deploy` (or `pipenv sync`) so CI installs exactly what's in the lockfile, and a stale lockfile becomes a build failure instead of a silent drift.

**"Pipenv is deprecated, why bother?"**

Pipenv isn't deprecated — it's no longer the default Python recommendation, but it's actively maintained and still ships in many production Python projects. If you're starting a new project in 2026, `uv` is the faster choice (see [Should You Commit uv.lock?](./should-you-commit-uv-lock)). If you're working in an existing pipenv project, follow pipenv's conventions: commit the lockfile.

**"Different platforms resolve differently, so the lockfile is wrong half the time."**

Pipenv resolves for a single platform at a time — the platform that ran `pipenv lock`. This is a real limitation compared to Poetry, which solves for all platforms simultaneously. If your developers run macOS and your CI runs Linux, regenerate the lockfile on the platform that matches production (Linux in most cases), and run `pipenv install --deploy` on the others. Most pure-Python dependencies resolve identically across platforms; the edge cases are wheels with platform-specific binaries.

## Merge conflicts in Pipfile.lock

Lockfile merge conflicts happen when two branches both update dependencies. The fix is mechanical, not manual:

```bash
git checkout main -- Pipfile.lock
pipenv lock
git add Pipfile.lock
git merge --continue
```

Do not hand-edit `Pipfile.lock` — it's a machine-generated file and pipenv's hash validation will reject manual edits anyway. Always regenerate it.

If both branches changed `Pipfile`, resolve the `Pipfile` conflict first, then regenerate the lockfile.

## The library exception

For **applications** — web apps, APIs, CLI tools, internal scripts — commit `Pipfile.lock`. Always.

For **libraries** published to PyPI — don't commit it, or commit it but understand it serves only your own development environment, not your downstream consumers.

When someone installs your library with `pip install your-library` or adds it to their own `Pipfile`, their package manager resolves dependencies fresh based on the constraints in your package metadata. Your `Pipfile.lock` is never consulted. Downstream consumers generate their own lockfile with their own full dependency tree.

This is the same pattern as Ruby's `Gemfile.lock`, PHP's `composer.lock`, and Rust's `Cargo.lock`: commit for applications, optional for libraries. The lockfile follows the runtime — if your repo is the thing that gets deployed and run, the lockfile belongs in it.

Most pipenv-using libraries do commit `Pipfile.lock` anyway. It costs nothing for consumers (they never see it) and it gives your own tests reproducibility. If you do commit it, supplement it with a CI matrix that tests against the minimum and maximum versions of your declared constraints, so you catch range-compatibility bugs the lockfile hides.

## The correct `.gitignore`

Your `.gitignore` for a pipenv project should look like this:

```gitignore
# Virtual environment (pipenv creates this outside the repo by default,
# but include it for safety)
.venv/

# Python
__pycache__/
*.pyc
*.pyo

# Distribution
dist/
build/
*.egg-info/

# Do NOT add Pipfile.lock here
# It must be committed for reproducible builds
```

If you find `Pipfile.lock` in your `.gitignore`, remove it. Some older project templates include it by mistake, and that advice has aged badly.

## The bottom line

For applications, commit `Pipfile.lock`. Use `pipenv install --deploy` (or `pipenv sync`) in CI. Resolve merge conflicts by regenerating the lockfile, never by hand-editing JSON. Treat the lockfile as a first-class part of your build manifest, not an artifact.

For libraries published to PyPI, the lockfile is optional. Commit it for your own development sanity; don't expect it to do anything for downstream consumers.

The split is the same as every other ecosystem with a modern lockfile: if your repo is the runtime, commit the lockfile. If your repo provides code for someone else's runtime, the lockfile is dead weight.

## See Also

- [Lock Files: Commit or Ignore?](./lock-files-commit-or-ignore) — the cross-ecosystem decision frame
- [Should You Commit poetry.lock?](./should-you-commit-poetry-lock) — Poetry's analogue, with multi-platform resolution
- [Should You Commit uv.lock?](./should-you-commit-uv-lock) — uv is the faster modern alternative to pipenv
- [Should You Commit Gemfile.lock?](./should-you-commit-gemfile-lock) — Ruby's same application-vs-library split
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — full reference for committed-vs-ignored files
