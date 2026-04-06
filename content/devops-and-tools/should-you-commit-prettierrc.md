# Should You Commit .prettierrc?

Yes. Commit your `.prettierrc` file to version control.

Prettier is the standard code formatter for JavaScript and TypeScript projects. It handles indentation, line length, quote style, semicolons, trailing commas, and dozens of other formatting decisions that would otherwise generate pointless arguments in code reviews. If you are using Prettier — and most modern web projects are — the configuration file belongs in your repository right alongside the code it formats.

This article covers what goes in a `.prettierrc` file, which file format to use, what else to commit alongside it, and how Prettier fits with ESLint and `.editorconfig`.

## Yes, commit it

The `.prettierrc` file defines how your code looks. Without it checked into version control, every developer on the project formats code according to whatever defaults their local Prettier installation happens to use. That means one person uses tabs, another uses two spaces, someone else uses four. One developer has semicolons everywhere, another has none. The result is diffs full of formatting noise that obscure the actual changes.

Committing `.prettierrc` eliminates this. Every developer, every CI pipeline, and every AI coding tool that touches the project reads the same formatting rules from the same file. The formatter output is deterministic. Two developers formatting the same file produce identical results.

This matters even if you are a solo developer. You work across machines. You reinstall tools. AI assistants generate code for you. A committed `.prettierrc` ensures consistency regardless of where the formatting happens.

## What .prettierrc contains

A `.prettierrc` file is small. Most projects only configure a handful of options. Here are the ones that matter:

- **tabWidth** — Number of spaces per indentation level. The most common value is `2` for JavaScript/TypeScript projects.
- **useTabs** — Whether to use tabs instead of spaces. Most JS projects use spaces, but this is a valid preference.
- **semi** — Whether to add semicolons at the end of statements. The community is split; both `true` and `false` are common.
- **singleQuote** — Whether to use single quotes instead of double quotes. Single quotes are more common in JavaScript; double quotes are standard in JSON (Prettier handles JSON separately regardless).
- **trailingComma** — Whether to add trailing commas in multi-line arrays, objects, and function parameters. The default is `"all"` as of Prettier 3, which is what most modern projects use.
- **printWidth** — The line length where Prettier wraps code. The default is `80`. Many teams set this to `100` or `120`.
- **bracketSpacing** — Whether to add spaces inside object braces: `{ foo }` vs `{foo}`. The default is `true`.
- **arrowParens** — Whether to add parentheses around a single arrow function parameter: `(x) => x` vs `x => x`. The default is `"always"`.

That is the full list for most projects. Prettier intentionally offers few options. The whole point is to stop debating formatting and let the tool decide.

## File format options

Prettier reads its configuration from several file formats. These all do the same thing:

- `.prettierrc` — JSON or YAML (no extension, autodetected)
- `.prettierrc.json` — Explicit JSON
- `.prettierrc.yaml` — Explicit YAML
- `.prettierrc.js` or `prettier.config.js` — JavaScript that exports a config object
- `.prettierrc.mjs` or `prettier.config.mjs` — ES module variant
- `.prettierrc.toml` — TOML format

For most projects, use `.prettierrc` with plain JSON. It is the most common convention, every tool and editor recognizes it, and it requires no runtime evaluation. Only use the JavaScript format if you need conditional logic (rare) or comments (switch to `.prettierrc.json5` or use the JS format).

## Practical example

Here is a `.prettierrc` for a typical modern web project — Next.js, React, TypeScript, Tailwind CSS:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

The `prettier-plugin-tailwindcss` plugin sorts Tailwind utility classes into a consistent order. If you use Tailwind, this plugin is worth adding. It is published by the Tailwind team and is the most commonly used Prettier plugin.

That entire file is seven options and one plugin. It takes thirty seconds to set up, and it eliminates formatting discussions for the life of the project.

## .prettierignore — also commit it

Prettier will attempt to format every file it supports in your project unless you tell it otherwise. The `.prettierignore` file tells Prettier which files and directories to skip. Commit this file alongside `.prettierrc`.

A typical `.prettierignore`:

```
# Build output
dist/
.next/
out/
build/

# Dependencies
node_modules/

# Lock files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Generated files
*.generated.ts
*.min.js
*.min.css

# Coverage
coverage/
```

The syntax is identical to `.gitignore`. Prettier also reads your `.gitignore` and skips those files automatically, so you only need to add entries for files that are tracked by git but should not be formatted — like lock files or generated code.

Without a `.prettierignore`, running `prettier --write .` across your project will attempt to format lock files, minified bundles, and build artifacts. That wastes time and can produce unexpected changes.

## Prettier and ESLint: how they work together

Prettier formats code. ESLint catches bugs and enforces code quality rules. They serve different purposes, but they can conflict when ESLint includes formatting rules that disagree with Prettier.

The modern approach is clean: let Prettier own all formatting and let ESLint own everything else.

If you are using ESLint 9 with flat config (which is now the default), the recommended setup is:

1. **Install `eslint-config-prettier`** — This disables all ESLint rules that conflict with Prettier. It does not add any rules; it only turns off the ones that would fight with Prettier.
2. **Do not use `eslint-plugin-prettier`** — This older plugin ran Prettier inside ESLint. It worked, but it was slow and produced confusing error messages. The current recommendation is to run Prettier and ESLint as separate tools.

In practice, your workflow is: Prettier formats on save (or via a pre-commit hook), and ESLint catches logic issues. They do not overlap.

If you are using an AI coding tool or a framework CLI that generated your ESLint config, check whether it already includes `eslint-config-prettier`. Most modern scaffolds do.

## Prettier vs .editorconfig — complementary, not competing

Prettier and `.editorconfig` both deal with formatting, but they operate at different levels.

`.editorconfig` tells your text editor how to behave while you type — indent style, indent size, end-of-line character, charset, trimming trailing whitespace. It works across every language and every editor that supports the EditorConfig spec.

Prettier is a code formatter that rewrites entire files according to its rules. It handles JavaScript, TypeScript, JSON, CSS, Markdown, HTML, and a few other languages. It is much more opinionated and much more powerful than `.editorconfig` for the languages it supports.

Where they overlap (indent style and size), Prettier wins. Prettier reads `.editorconfig` and uses its values as defaults if no `.prettierrc` is present. If both files exist and disagree, the `.prettierrc` values take precedence for files Prettier handles.

The best practice is to commit both:

- `.editorconfig` handles files Prettier does not touch — shell scripts, Dockerfiles, YAML configs, Makefiles, and anything outside Prettier's language support.
- `.prettierrc` handles JavaScript, TypeScript, CSS, JSON, HTML, and Markdown with full formatting control.

They complement each other. There is no conflict. For more on `.editorconfig`, see [Should You Commit .editorconfig?](/devops-and-tools/should-you-commit-editorconfig).

## .gitignore: nothing to ignore

Unlike some tools that generate local state or cache files, Prettier's configuration files are pure project config. There is nothing to add to `.gitignore` for Prettier. Commit `.prettierrc` and `.prettierignore` directly. Prettier does not create hidden directories, cache files, or machine-specific state.

If you are building a broader understanding of what belongs in your repository, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide). For another configuration file that follows the same commit-it pattern, see [Should You Commit tsconfig.json?](/devops-and-tools/should-you-commit-tsconfig-json).

## Summary

Commit `.prettierrc`. Commit `.prettierignore`. Run Prettier on save, in pre-commit hooks, and in CI. Let it own formatting so you and your team never discuss tabs versus spaces again. The configuration is small, the file format is simple, and the payoff — consistent, predictable code formatting across every environment — is immediate.
