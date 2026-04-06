# Should You Commit .editorconfig to Git?

Tabs or spaces? Two-space indent or four? LF or CRLF? These arguments have been going on since the dawn of programming, and they will never end — unless you settle them at the project level. That is exactly what `.editorconfig` does. It tells every editor on every machine how to format files in your repo, and it does it without any plugins, build tools, or formatter configurations.

**Should you commit it? Yes. Always.**

An `.editorconfig` file is project configuration, not personal preference. It belongs in version control right next to your `package.json` and your `.gitignore`.

## What .editorconfig is

EditorConfig is a cross-editor configuration standard. It is a simple INI-format file that lives in your project root and tells code editors how to handle basic formatting — indentation, line endings, character encoding, whitespace trimming.

The key feature: almost every major editor supports it, either natively or through a first-party plugin.

- **VS Code** — supported via the [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) extension (one of the most installed extensions on the marketplace)
- **JetBrains IDEs** (IntelliJ, WebStorm, PyCharm, etc.) — built-in, no plugin needed
- **Vim / Neovim** — supported via the [editorconfig-vim](https://github.com/editorconfig/editorconfig-vim) plugin
- **Sublime Text** — supported via plugin
- **GitHub** — respects `.editorconfig` when rendering files in the web UI

When a developer opens a file in your project, their editor reads `.editorconfig` and automatically adjusts its behavior. No manual setup. No "hey, can you change your tab width" messages in Slack.

## What it controls

EditorConfig handles a small, focused set of formatting properties. It does not try to do everything — it handles the basics that every editor understands:

| Property | What it does | Example values |
|---|---|---|
| `indent_style` | Tabs or spaces | `tab`, `space` |
| `indent_size` | Number of columns per indent level | `2`, `4` |
| `tab_width` | Width of a tab character (defaults to `indent_size`) | `4` |
| `end_of_line` | Line ending style | `lf`, `crlf`, `cr` |
| `charset` | Character encoding | `utf-8`, `utf-8-bom`, `latin1` |
| `trim_trailing_whitespace` | Remove whitespace at end of lines on save | `true`, `false` |
| `insert_final_newline` | Ensure file ends with a newline on save | `true`, `false` |

That is the entire property list. EditorConfig is intentionally minimal. It handles the things that cause noisy diffs and merge conflicts — inconsistent indentation, mixed line endings, trailing whitespace — and leaves everything else to more powerful tools.

## A practical example

Here is a typical `.editorconfig` for a web project (Next.js, React, Node.js — any JavaScript/TypeScript stack):

```ini
# EditorConfig: https://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

A few things to notice:

- **`[*]` applies to all files.** This is your baseline. Two-space indentation, LF line endings, UTF-8 encoding, clean whitespace.
- **`[*.md]` overrides for Markdown.** Trailing whitespace is meaningful in Markdown (two trailing spaces create a line break), so you disable trimming for `.md` files.
- **`[Makefile]` overrides for Make.** Makefiles require tabs — this is not a preference, it is a syntax requirement. The override ensures your editor does not convert them to spaces.

You can add as many section overrides as you need. Use glob patterns like `[*.{js,ts}]` or `[lib/**.py]` to target specific file types or directories.

## root = true — what it means and why to set it

EditorConfig files cascade. If you open a file at `/projects/my-app/src/utils/helpers.ts`, your editor searches upward through every parent directory looking for `.editorconfig` files. It merges them together, with closer files taking priority.

This is useful in monorepos where sub-packages might need different settings. But it also means that if someone has a personal `.editorconfig` in their home directory, it could bleed into your project.

Setting `root = true` at the top of your file tells the editor: "Stop searching here. Do not look in parent directories." This makes your project's formatting self-contained and predictable. Always set it.

## How .editorconfig differs from Prettier

If you use Prettier (or a similar code formatter), you might wonder: why do I need `.editorconfig` too? They seem to do the same thing.

They don't. They operate at different layers:

**EditorConfig controls editor behavior.** When you type, your editor uses `.editorconfig` to determine how to indent, what line endings to insert, and whether to trim whitespace. It affects the editing experience in real time.

**Prettier controls code formatting.** Prettier is a build-time tool that reformats your code according to opinionated rules — things like where to break long lines, whether to use single or double quotes, and how to format JSX. It runs as a CLI command or on-save hook.

Here is where they overlap and where they don't:

| Concern | EditorConfig | Prettier |
|---|---|---|
| Indent style (tabs/spaces) | Yes | Yes |
| Indent size | Yes | Yes |
| Line endings | Yes | Yes |
| Trailing whitespace | Yes | Yes (implicitly) |
| Max line length | No | Yes |
| Quote style | No | Yes |
| Semicolons | No | Yes |
| JSX formatting | No | Yes |
| Charset / encoding | Yes | No |

The overlap is intentional. Prettier actually reads your `.editorconfig` file and uses its settings as defaults. If your `.editorconfig` says `indent_size = 2`, Prettier respects that (unless you override it in `.prettierrc`). This means the two tools work together, not against each other.

**Use both.** EditorConfig ensures that every editor — including ones that don't run Prettier — produces clean, consistent files. Prettier handles the deeper code formatting that EditorConfig cannot. They are complementary.

For more on committing Prettier's configuration, see [Should You Commit .prettierrc?](/devops-and-tools/should-you-commit-prettierrc).

## Why you should commit it

The whole point of `.editorconfig` is consistency across machines and editors. If it is not in your repo, every developer has to manually configure their editor to match — and they won't. You will end up with commits that change indentation across entire files, mixed line endings that create phantom diffs, and trailing whitespace that clutters pull requests.

Committing `.editorconfig` eliminates all of that. It is a zero-cost way to prevent formatting noise in your git history.

Even if you are a solo developer, commit it. You work across machines. You might use VS Code today and a JetBrains IDE tomorrow. Future collaborators will thank you. And AI coding tools that generate code inside your editor will inherit the settings automatically.

## .gitignore: nothing to ignore

There is nothing to add to `.gitignore` for EditorConfig. The `.editorconfig` file is a single, small, plain-text file. It contains no secrets, no machine-specific paths, no generated output. Commit the whole thing.

## The bottom line

`.editorconfig` is one of the simplest files you can add to a project, and one of the most effective at preventing unnecessary noise in your codebase. It takes five minutes to set up, it works across nearly every editor, and it costs nothing to maintain.

Add it. Commit it. Move on to the problems that actually matter.

For a broader look at what belongs in version control, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
