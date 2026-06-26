---
title: "Should You Commit .gitattributes to Git?"
description: "Yes — commit .gitattributes so line endings and binary handling are identical for every clone. Here's what goes in it and the renormalize step people miss."
---

# Should You Commit .gitattributes?

Yes. `.gitattributes` is one of the few files whose entire job depends on being committed. It tells Git how to treat specific paths — which files get line-ending normalization, which are binary and must never be touched, which go through Git LFS, how diffs and merges should behave. None of that does any good sitting on one developer's laptop. The whole point is to override each contributor's local Git config so the repository behaves the same way no matter who clones it or what operating system they're on.

That's the difference between `.gitattributes` and your local `core.autocrlf` setting. A local setting protects exactly one machine. A committed `.gitattributes` makes the rule a property of the repo: the Windows developer, the macOS developer, the Linux CI runner, and you-in-six-months all get identical behavior. So the question is never *whether* to commit it — it's *what* belongs in it and what the one step is that almost everyone forgets after they add it.

## The short answer

| Question | Answer |
|---|---|
| Commit `.gitattributes`? | **Yes** — always, in the repo root. It only works when shared. |
| Where does it live? | Root of the repo (subfolders can have their own). |
| Does it override local Git settings? | **Yes** — it beats each contributor's `core.autocrlf`. |
| Does every repo need one? | **No** — but any repo with mixed-OS contributors or binary assets benefits. |
| The step people forget? | **`git add --renormalize .`** after editing it. |

## What .gitattributes actually does

`.gitattributes` is a plain-text file that assigns *attributes* to file patterns. Each line is a glob followed by one or more attributes, and Git consults it whenever it has to decide how to handle a path — at checkout, at commit, when diffing, when merging, when archiving. A representative file looks like this:

```gitattributes
# Normalize line endings on text files; let Git detect what's text
* text=auto

# Force LF on shell scripts no matter the OS
*.sh text eol=lf

# Force CRLF on Windows batch files
*.bat text eol=crlf

# Never touch these — they're binary
*.png binary
*.pdf binary
*.woff2 binary
```

The left column matches files; the right column says what to do with them. Unlike `.gitignore`, which decides *whether* Git tracks a path, `.gitattributes` decides *how* Git handles a path it already tracks. That distinction is why the two files coexist: one controls membership, the other controls behavior.

Most projects reach for `.gitattributes` to solve exactly one problem first — line endings — and then discover the rest of what it can do.

## The main job: line-ending normalization

The classic bug `.gitattributes` exists to kill is the cross-platform line-ending mess. Windows writes lines ending in CRLF (`\r\n`); macOS and Linux use LF (`\n`). Without a shared rule, a Windows contributor commits a file full of CRLF, a Mac contributor saves it back as LF, and now every line shows as changed in the diff — even though nobody edited the content. Git blame becomes useless and merges conflict over invisible characters.

`* text=auto` fixes this by telling Git to detect text files and store them with LF in the repository, converting to the platform's native ending on checkout. Because the rule lives in a committed file, it overrides whatever `core.autocrlf` value each developer happens to have set locally. The behavior stops depending on personal config.

You can be more explicit when it matters. The `eol` attribute forces a specific ending regardless of OS, which you want for files that are sensitive to it:

| Pattern | Effect |
|---|---|
| `* text=auto` | Git detects text files, normalizes them to LF in the repo. Good default. |
| `*.sh text eol=lf` | Always LF — shell scripts break with CRLF. |
| `*.bat text eol=crlf` | Always CRLF — some Windows tools require it. |
| `*.png binary` | Never normalize, never diff — leave the bytes untouched. |

GitHub's own guidance leans toward being explicit: keep `* text=auto` as a sane default, but declare the files you care about by hand rather than trusting auto-detection for everything. If you do use `* text=auto`, put it on the first line so later, more specific rules can override it.

## The step almost everyone forgets

Committing `.gitattributes` does **not** retroactively fix files already in history. The attributes apply going forward, so a repo that already has CRLF baked into its tracked files stays inconsistent until you force a re-pass. The command that does it:

```bash
# Apply the new attributes to every already-tracked file
git add --renormalize .
git commit -m "Normalize line endings via .gitattributes"
```

`--renormalize` walks every tracked file, applies the rules in `.gitattributes`, and stages anything that changed. Skip this step and you'll swear the file isn't working — because it isn't, on the files that predate it. New files get the right treatment; old ones need the one-time renormalize. This is the single most common reason people think `.gitattributes` is broken.

If you also work across a team, it's worth setting `merge.renormalize=true` so Git accounts for line-ending differences during merges instead of flagging them as conflicts.

## Marking binary files (this prevents real corruption)

Line endings are the famous use case, but the more dangerous one is binary files. Git tries to guess whether a file is text. When it guesses wrong on a binary — a PNG, a font, a compiled asset — and applies line-ending "normalization," it can rewrite bytes inside the file and silently corrupt it. The image won't render; the font won't load; nobody knows why.

Marking the file `binary` shuts that off:

```gitattributes
*.png binary
*.jpg binary
*.pdf binary
*.zip binary
*.woff2 binary
```

`binary` is a built-in macro that expands to `-text -diff`: don't normalize line endings, and don't try to produce a text diff. It's the safe default for any non-text asset. If a repo carries images, fonts, or other binaries and you've ever seen one mysteriously break after a commit, an explicit `binary` rule is the fix.

## The power-user attributes

Beyond line endings and binary safety, `.gitattributes` is where several otherwise-hidden behaviors get configured. You don't need these on day one, but knowing they exist tells you when to reach for the file:

- **Git LFS** — Large File Storage hooks in entirely through attributes. When you run `git lfs track "*.psd"`, it writes a line like `*.psd filter=lfs diff=lfs merge=lfs -text` into `.gitattributes`. That file *is* how every clone knows to pull those assets from LFS instead of fetching multi-hundred-megabyte blobs from history. If `.gitattributes` isn't committed, LFS doesn't work for anyone else.
- **GitHub language stats** — `linguist-generated` and `linguist-vendored` tell GitHub's Linguist to exclude paths from the repository's language breakdown. Marking `*.min.js linguist-generated` or `vendor/* linguist-vendored` stops bundled and third-party code from making your project look 80% JavaScript when it's a Python app.
- **Cleaner diffs and merges** — `*.lock -diff` hides noisy lockfile diffs in pull requests. `CHANGELOG.md merge=union` keeps both sides of a merge instead of conflicting on every appended line. Custom diff drivers can even teach Git to diff binary-ish formats meaningfully.
- **`export-ignore`** — excludes paths from `git archive` exports. Marking `tests/ export-ignore` or `.github/ export-ignore` keeps those out of release tarballs while leaving them in the repo.

Every one of these is a rule that has to be the same for everyone, which is exactly why they live in a committed file and not in anyone's local config.

## Why it has to be committed — the whole point

It's worth being blunt about the mechanism, because it's what separates `.gitattributes` from most config files. Git reads attributes from the committed `.gitattributes` in the working tree, and those attributes **override** each contributor's local settings like `core.autocrlf`. That's the design: the repository gets to dictate behavior so it doesn't vary by machine.

Leave the file uncommitted and you've defeated its only reason to exist. The Windows contributor falls back to their CRLF default, the LFS pointers never resolve, the binaries are back at the mercy of auto-detection. A `.gitattributes` that lives on one laptop normalizes exactly one laptop — the same trap as an uncommitted `.gitignore`, and for the same reason. Commit it early, ideally in the first commit, so the rules are in force before there's anything to normalize.

There is no per-developer or generated variant to keep out of the repo, either. Unlike editor configs or environment files, `.gitattributes` has no personal half. It's pure shared project policy. Commit the whole thing.

## The bottom line

Commit `.gitattributes`, always, in the repo root — it's shared policy that only functions when every clone reads the same copy. Start with `* text=auto` to kill cross-platform line-ending churn, mark your binaries `binary` so Git can't corrupt them, and add LFS, Linguist, or merge rules as the project grows into them. Then run `git add --renormalize .` once so the rules apply to files that already exist, not just new ones. That last command is the difference between a `.gitattributes` that works and one you'll wrongly accuse of being broken.

## See Also

- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — the full committed-vs-ignored reference this series builds on
- [Should You Commit .gitignore?](./should-you-commit-gitignore) — its companion file: one controls *whether* Git tracks a path, the other controls *how*
- [Should You Commit .editorconfig?](./should-you-commit-editorconfig) — the other shared config that normalizes formatting across every contributor
- [Environment Variables and .env Files: What to Commit](./env-files-git-guide) — the related "shared structure, never the secrets" pattern
- [Git Repository Configuration Files](./config-files) — how the dotfiles in your repo root fit together
