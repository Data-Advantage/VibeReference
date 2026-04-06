# Should You Commit tsconfig.json?

Yes. Always commit `tsconfig.json` to version control.

`tsconfig.json` is the foundation of every TypeScript project. It tells the TypeScript compiler how to check your code, what JavaScript version to target, how to resolve imports, and dozens of other settings that affect every file in your codebase. If two developers have different `tsconfig.json` settings, they are effectively working on different projects. The file belongs in git.

This article explains what is inside it, why it matters, and how to handle the related files that show up alongside it. For the broader picture of what belongs in your repository, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).

## Yes, commit it

The short version: `tsconfig.json` defines how TypeScript compiles and type-checks your code. Without it checked into version control, every developer on the project (and every CI run) could be using different compiler settings. One person might have strict mode on while another has it off. One machine might target ES2015 while another targets ES2022. Path aliases that work on your laptop would break on a teammate's machine.

This is not a preference file like your editor theme. It is a project configuration file that directly affects the compiled output and the errors TypeScript reports. It sits in the same category as `package.json` — it defines what your project is.

## What tsconfig.json contains

A `tsconfig.json` file has two main sections: `compilerOptions` and project-level settings like `include` and `exclude`. Here are the key settings you will encounter.

### Compiler options

**strict** — Enables a family of strict type-checking flags all at once. When `strict` is `true`, TypeScript enforces null checks, strict function types, and several other rules that catch bugs early. Most modern projects turn this on. If one developer has it on and another has it off, they will see completely different errors.

**target** — The JavaScript version TypeScript compiles down to. Common values are `ES2017`, `ES2020`, `ES2022`, and `ESNext`. This affects which language features TypeScript leaves in the output versus what it polyfills or transforms. If your target does not match across the team, you could ship code that works on one machine but fails in production.

**module and moduleResolution** — These control how TypeScript handles imports and exports. `module` sets the output format (`commonjs`, `esnext`, `nodenext`), and `moduleResolution` tells TypeScript how to find the files behind your import statements. Getting these wrong is one of the most common causes of mysterious "Cannot find module" errors.

**jsx** — Tells TypeScript how to handle JSX syntax. React projects typically set this to `preserve` (letting the bundler handle JSX) or `react-jsx` (using the modern JSX transform). Without this setting committed, a teammate cloning the project would see errors on every JSX file.

**paths** — Lets you define import aliases. Instead of writing `../../../components/Button`, you write `@/components/Button`. The `paths` setting maps `@/*` to the right directory. If this mapping is not in version control, the aliases break for anyone who clones the repo.

**baseUrl** — Often used alongside `paths`, this sets the root directory for non-relative imports. Typically set to `"."` so that path aliases resolve from the project root.

**outDir** — Where compiled JavaScript files go. Common values are `dist` or `build`. This directory is what you deploy, and it should be in your `.gitignore` — but the setting that points to it should not.

**lib** — Specifies which built-in type definitions TypeScript includes. A project targeting modern browsers might use `["dom", "dom.iterable", "esnext"]`. A Node.js backend might omit `dom` entirely. This affects which global APIs TypeScript recognizes.

### Project scope

**include** — An array of file patterns TypeScript should compile. Typically `["src"]` or `["src/**/*"]`.

**exclude** — Patterns to skip. Usually `["node_modules", "dist"]`.

These scope settings ensure TypeScript only processes the files it should. Without them, you might accidentally type-check your build output or test fixtures.

## Why it matters for teams

Even if you are a solo developer today, committing `tsconfig.json` protects you in three ways.

**Consistent type checking.** Strict mode catches null reference errors, missing return types, and implicit `any` usage. If strict mode is not committed as part of the project, you lose that safety net every time you clone the repo fresh or set up a new machine.

**Same compilation target.** Your CI pipeline, your local dev server, and your production build all need to agree on what JavaScript version they are producing. The `target` setting in `tsconfig.json` is the single source of truth for that.

**Path aliases work for everyone.** Modern frameworks like Next.js configure path aliases in `tsconfig.json` by default. If a new team member clones the project and the `paths` configuration is missing, every `@/` import in the codebase shows as an error. The project will not compile until they manually recreate the settings.

## Practical example: a typical Next.js tsconfig.json

Most solo founders building with AI coding tools are working in Next.js. Here is what a standard Next.js `tsconfig.json` looks like:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Every setting here affects how your project compiles and how TypeScript checks your code. The `paths` alias, the `strict` flag, the `jsx` mode, the `module` resolution strategy — all of it needs to be shared. If you scaffolded your project with `create-next-app` or an AI coding tool, this file was generated for you. Do not add it to `.gitignore`.

## Multiple tsconfig files: commit all of them

Modern projects often have more than one TypeScript configuration file. This is normal, and every one of them should be committed.

**tsconfig.json** — The root configuration. Usually the one your editor reads.

**tsconfig.app.json** — Used in some frameworks (like Vite-based projects) to configure the application code separately from other parts of the project. It typically extends the root `tsconfig.json` and narrows the `include` to just the `src` directory.

**tsconfig.node.json** — Configures TypeScript for Node.js-specific files like `vite.config.ts` or build scripts. These files often need different module resolution settings than the browser-facing application code.

These files use the `extends` keyword to inherit from the root config and override only what they need. They are all intentional project configuration, and they all belong in version control.

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext"
  },
  "include": ["vite.config.ts"]
}
```

If you delete or ignore any of these, the build breaks.

## tsconfig.tsbuildinfo: the one file you ignore

There is one TypeScript-generated file that does not belong in version control: `tsconfig.tsbuildinfo`.

This file is created when you enable `incremental` compilation in your `tsconfig.json` (Next.js does this by default). It stores information about the last build so TypeScript can skip recompiling files that have not changed. It is a cache file, not a configuration file. It is specific to your machine and your current build state.

The file is often large, changes on every build, and provides no value to other developers or CI pipelines. It should always be ignored.

## .gitignore setup

Here is what your `.gitignore` should look like for TypeScript configuration files:

```gitignore
# TypeScript build cache — auto-generated, ignore it
*.tsbuildinfo

# Do NOT ignore these — they are project configuration
# tsconfig.json
# tsconfig.app.json
# tsconfig.node.json
```

The rule is simple: if a file's name starts with `tsconfig` and ends with `.json`, commit it. If it ends with `.tsbuildinfo`, ignore it.

## The bottom line

`tsconfig.json` is not optional configuration. It is the contract that defines how TypeScript understands your project. Every compiler option, every path alias, every strict mode flag needs to be shared across your team, your CI pipeline, and every machine that touches the code. Commit it, commit its variants, and ignore only the build cache.

For more on which configuration files belong in your repository, see [Should You Commit .prettierrc?](/devops-and-tools/should-you-commit-prettierrc) and [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
