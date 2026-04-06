# Should You Commit the coverage/ Directory?

No. The `coverage/` directory is generated output. It should never be committed to your Git repository.

When you run your test suite with coverage reporting enabled, your testing framework creates a `coverage/` folder full of HTML reports, JSON summaries, and raw instrumentation data. This output is different every time you run tests, specific to the files you tested, and trivially regenerated from your source code. There is no reason to track it in version control, and several good reasons not to.

## Why coverage/ should be ignored

The `coverage/` directory fails every test for what belongs in a Git repository. It's generated, it's large, it changes constantly, and it's developer-specific. For the full framework on deciding what to commit, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).

### It's regenerated on every test run

Every time you run `jest --coverage`, `vitest --coverage`, or `nyc mocha`, the tool deletes the old `coverage/` directory and writes a fresh one. The output is a deterministic function of your source code and test files. If you have the source, you have the coverage report. Committing it is redundant.

### The output is large and noisy

Istanbul and NYC — the most common coverage engines in the JavaScript ecosystem — produce a full HTML website inside `coverage/`. A typical project generates 50-200 HTML files, each with inline CSS and JavaScript for interactive source views. The `lcov-report/` subfolder alone can run 5-20 MB depending on your codebase size.

Committing these files pollutes your diffs with thousands of lines of generated HTML that no human reads in a code review. Your pull requests become unusable. Your repository history bloats with files that carry zero informational value.

### It varies between developers

Coverage output depends on which tests you ran, which files were instrumented, and your local tool configuration. One developer runs the full suite. Another runs tests for a single module. A third has a different version of the coverage tool installed. Each produces a different `coverage/` directory.

Even running the same tests twice can produce different timestamps in the output files, which means Git sees changes even when nothing meaningful changed. This creates phantom diffs and noisy commit histories.

## What coverage/ actually contains

When you enable coverage reporting, your testing framework generates several types of output inside `coverage/`:

```
coverage/
├── lcov-report/        # Full HTML website with per-file source views
│   ├── index.html      # Summary dashboard
│   ├── src/
│   │   ├── app.js.html
│   │   ├── utils.js.html
│   │   └── ...
│   ├── base.css
│   └── prettify.js
├── lcov.info           # LCOV format — used by Codecov, Coveralls, etc.
├── coverage-summary.json   # JSON summary of percentages
├── coverage-final.json     # Detailed per-file coverage map
└── clover.xml          # Clover XML format (used by some CI tools)
```

The HTML reports are useful for local debugging — you open `coverage/lcov-report/index.html` in your browser to see which lines your tests missed. Each source file gets its own HTML page with line-by-line highlighting showing covered lines in green and uncovered lines in red. It's a convenient way to find gaps in your test suite. But these reports are meant to be viewed locally and thrown away. The machine-readable formats like `lcov.info` are meant to be uploaded to external services during CI, not stored in Git.

## How to handle coverage in CI

The right place for coverage tracking is your CI pipeline, not your repository. The pattern is straightforward:

1. Run tests with coverage enabled in your CI job
2. Upload the coverage report to a dedicated service
3. Let the service track trends, enforce thresholds, and comment on pull requests

Here's what that looks like in a GitHub Actions workflow:

```yaml
- name: Run tests with coverage
  run: npm test -- --coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    file: ./coverage/lcov.info
```

Popular coverage services include [Codecov](https://codecov.io) and [Coveralls](https://coveralls.io). Both accept `lcov.info` files, track coverage percentages over time, and can block pull requests that drop below a threshold. They give you everything the HTML reports give you, but stored properly outside your repository and with historical trends your team can actually use. Most have free tiers for open-source projects and reasonable pricing for private repositories.

The coverage data is generated fresh in the pipeline, uploaded, and discarded. Nothing touches Git.

## Your .gitignore

Add these lines to your `.gitignore`:

```
coverage/
.nyc_output/
```

The `coverage/` line catches the standard output directory used by Jest, Vitest, and Istanbul. The `.nyc_output/` line catches the intermediate instrumentation data that NYC (Istanbul's CLI) stores before generating final reports. Both are generated, both are disposable.

If you're using a custom `coverageDirectory` in your Jest or Vitest config, make sure that path is ignored too.

## Other test artifacts to ignore

While you're updating your `.gitignore`, check for these related directories that also don't belong in version control:

```
.jest-cache/
test-results/
playwright-report/
```

`.jest-cache/` stores transformed file caches that speed up repeated test runs locally. `test-results/` and `playwright-report/` are output directories from Playwright and other end-to-end testing frameworks. Same principle applies: generated output, developer-specific, regenerated on demand.

## If you already committed coverage/

If `coverage/` is already in your repository, remove it:

```bash
echo "coverage/" >> .gitignore
echo ".nyc_output/" >> .gitignore
git rm -r --cached coverage/
git rm -r --cached .nyc_output/   # if it exists
git commit -m "Remove coverage output from tracking"
```

The `--cached` flag removes the files from Git's index without deleting them from your local filesystem. Your coverage reports stay on disk for local use, but Git stops tracking them. Future test runs won't show up as uncommitted changes.

This follows the same pattern used for any generated directory that was accidentally committed. For a similar walkthrough with build output, see [Should You Commit the dist/ Folder?](/devops-and-tools/should-you-commit-dist-folder).

## Summary

The `coverage/` directory is generated output — large, noisy, developer-specific, and trivially reproducible. Ignore it in `.gitignore`, generate it in CI when you need it, and upload it to a service that's built for tracking coverage over time. Your repository should contain the source code and configuration needed to produce coverage reports, not the reports themselves.
