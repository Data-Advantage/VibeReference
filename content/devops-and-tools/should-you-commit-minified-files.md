# Should You Commit Minified JavaScript and CSS Files?

No. Minified files — `*.min.js` and `*.min.css` — are build artifacts generated from your source code. They don't belong in your Git repository.

If you see minified files in your project, they were produced by a tool that compressed your source JavaScript and CSS for production delivery. They're output, not source. Treat them the same way you'd treat a `dist/` folder: ignore them in Git and regenerate them at build time.

## What minified files actually are

Minification is the process of reducing file size for faster downloads. A minifier takes your readable source code and produces a compressed version by:

- **Removing whitespace, comments, and line breaks.** Your carefully formatted code becomes a single dense line.
- **Shortening variable and function names.** `userAccountBalance` becomes `a`. `calculateMonthlyPayment` becomes `b`.
- **Optimizing expressions.** Dead code gets removed. Constants get folded. Conditional branches that can never execute get stripped.

The result is a file that's 50-80% smaller than the original — great for browser download speed, completely useless for human reading or code review.

Here's a simplified example. Your source CSS:

```css
/* Primary button styles */
.btn-primary {
  background-color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
}
```

Becomes this after minification:

```css
.btn-primary{background-color:#3b82f6;padding:.5rem 1rem;border-radius:.375rem;font-weight:600}
```

That minified version is what ends up in `styles.min.css`. It's generated output. You wouldn't commit the result of compiling TypeScript to JavaScript and then also commit the TypeScript — same principle applies here.

## Why minified files don't belong in Git

Three reasons, all serious.

### Diffs are meaningless

When a minified file changes, `git diff` shows you a wall of unreadable text. A one-line change in your source CSS produces a completely different single-line blob in the `.min.css` file. You can't review it. You can't understand what changed. The diff is noise that obscures the actual work happening in your commits.

### Merge conflicts are impossible to resolve

If two developers change different source files that feed into the same minified bundle, the regenerated `.min.js` file will conflict. You can't manually merge minified code — the content is machine-generated and position-dependent. You'd need to regenerate it from source anyway, which means the committed version was pointless.

### They're completely reproducible

Minified files are deterministic output of your source code plus your build configuration. Given the same source and the same minifier settings, you get the same `.min.js` every time. There's no reason to store the output when you already have the input.

This is the same logic behind ignoring `dist/`, `build/`, or `node_modules/` — if a file can be reliably generated from other files in the repository, it shouldn't be committed. See [Should You Commit the dist/ Folder?](/devops-and-tools/should-you-commit-dist-folder) for more on this principle.

## The old jQuery pattern

If you started building websites before 2018 or so, you probably committed `jquery.min.js` directly into your project. Maybe `bootstrap.min.css` too. You'd download the file from a CDN or the project's website, drop it into a `vendor/` or `lib/` folder, and reference it with a `<script>` tag.

That was the standard workflow. There were no bundlers. There was no `npm install`. If you wanted jQuery, you literally downloaded the file and put it in your repo.

That era is over.

The reason it worked — barely — was that those vendor files never changed. You downloaded jQuery 3.6.0 once and it sat there for months. There were no diffs to review because the file never updated. But even then, it bloated your repository with large binary-like blobs that Git couldn't efficiently delta-compress.

If you're maintaining a legacy project that still has `jquery.min.js` committed in a `vendor/` folder, it's not an emergency. But for any new work, there's a better way.

## The modern approach: bundlers handle this

Modern JavaScript tooling generates minified output as part of the build process. You don't download minified files — your build tool creates them.

**Webpack, Vite, esbuild, Rollup, Parcel** — all of these bundlers can minify JavaScript and CSS at build time. You write readable source code, and the bundler produces optimized output for production. That output goes into a `dist/` or `build/` directory, which is already in your `.gitignore`.

For libraries you used to download manually, use npm packages instead:

```bash
# Instead of downloading jquery.min.js
npm install jquery

# Instead of downloading bootstrap.min.css
npm install bootstrap
```

Your bundler imports these from `node_modules/` and includes them in the final build output — already minified, already optimized. No vendor files to commit. See [Should You Commit node_modules?](/devops-and-tools/should-you-commit-node-modules) for why that directory stays out of Git too.

## What to put in .gitignore

If your project has a build step that generates minified files, add these patterns:

```gitignore
# Minified build output
*.min.js
*.min.css
```

**One caveat**: if you're serving static vendor files without any build step — a simple HTML page that loads a `<script src="vendor/alpine.min.js">` — then you may genuinely need that file committed. This is the legacy pattern described above. It still works, and if your project has no bundler and no build process, a committed vendor `.min.js` file might be the pragmatic choice. Just know you're opting into a pattern the ecosystem has moved past.

## Source maps: also ignore them

Minified files often come paired with source map files — `*.map`, `*.js.map`, `*.css.map`. These are debugging aids that map the minified output back to your original source code. They're generated alongside the minified files and should be ignored for the same reasons:

```gitignore
# Source maps
*.map
*.js.map
*.css.map
```

Source maps can also be large — sometimes larger than the minified files themselves — and they're trivially regenerated from the same build step that produces the minified output.

## Quick reference

| Do this | Not this |
|---|---|
| Let your bundler generate `.min.js` at build time | Commit minified files alongside source |
| Install libraries via npm | Download `jquery.min.js` into a vendor folder |
| Add `*.min.js` and `*.min.css` to `.gitignore` | Track generated output in Git |
| Generate source maps in CI/CD | Commit `.map` files to the repository |

## Summary

Minified files are build output. They're generated from your source code, unreadable in diffs, and impossible to merge. Modern bundlers produce them automatically at build time, and npm packages replace the old pattern of downloading vendor `.min.js` files.

Add `*.min.js`, `*.min.css`, and `*.map` to your `.gitignore`. Let your build process handle minification. Your repository should contain the source — everything else is derived. For a complete picture of what belongs in version control, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
