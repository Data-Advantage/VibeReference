#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DIRECTORY_FILE = path.join(ROOT_DIR, "lib", "directory.ts");
const BASELINE_FILE = path.join(ROOT_DIR, "scripts", "content-validation-baseline.json");

const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 160;
const FRONTMATTER_KEYS = new Set([
  "title",
  "description",
  "author",
  "lastReviewed",
]);

const LEGACY_MODEL_TERMS = [
  { label: "text-davinci-003", pattern: /\btext-davinci-003\b/i },
  { label: "code-davinci-002", pattern: /\bcode-davinci-002\b/i },
  { label: "gpt-4-32k", pattern: /\bgpt-4-32k\b/i },
  { label: "gpt-3.5-turbo snapshot", pattern: /\bgpt-3\.5-turbo-(0301|0613|1106|0125)\b/i },
  { label: "DALL-E 2", pattern: /\bDALL(?:-| |\u00b7)?E\s*2\b/i },
  { label: "PaLM 2", pattern: /\bPaLM\s*2\b/i },
  { label: "Bard", pattern: /\bBard\b/i },
  { label: "Claude 2", pattern: /\bClaude\s*2(?:\.\d+)?\b/i },
  { label: "Gemini 1.0", pattern: /\bGemini\s*1\.0\b/i },
  { label: "text-embedding-ada-002", pattern: /\btext-embedding-ada-002\b/i },
];

const args = new Set(process.argv.slice(2));
const updateBaseline = args.has("--update-baseline");
const noBaseline = args.has("--no-baseline");
const jsonOutput = args.has("--json");

function toRepoPath(filePath) {
  return path.relative(ROOT_DIR, filePath).split(path.sep).join("/");
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function gitTrackedContentFiles() {
  try {
    const output = execFileSync("git", ["ls-files", "content/**/*.md"], {
      cwd: ROOT_DIR,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output
      .split("\n")
      .filter(Boolean)
      .map((file) => path.join(ROOT_DIR, file));
  } catch {
    return walkFiles(CONTENT_DIR).filter((file) => file.endsWith(".md"));
  }
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(entryPath));
    } else if (entry.isFile()) {
      results.push(entryPath);
    }
  }
  return results;
}

function categorySlugs() {
  const source = readText(DIRECTORY_FILE);
  return new Set(
    [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]),
  );
}

function routeForContentFile(filePath) {
  const relative = toRepoPath(filePath);
  const parts = relative.split("/");
  if (parts.length !== 3 || parts[0] !== "content" || !parts[2].endsWith(".md")) {
    return null;
  }

  const category = parts[1];
  const slug = parts[2].replace(/\.md$/, "");
  return `/${category}/${slug}`;
}

function normalizeRoute(routePath) {
  if (!routePath || routePath === "/") return "/";
  const normalized = path.posix.normalize(routePath);
  return normalized.replace(/\/+$/, "") || "/";
}

function buildRouteSet(files, categories) {
  const routes = new Set(["/"]);

  for (const category of categories) {
    routes.add(`/${category}`);
  }

  for (const file of files) {
    const route = routeForContentFile(file);
    if (route) routes.add(route);
  }

  if (fs.existsSync(PUBLIC_DIR)) {
    for (const file of walkFiles(PUBLIC_DIR)) {
      routes.add(`/${toRepoPath(file).replace(/^public\//, "")}`);
    }
  }

  routes.add("/robots.txt");
  routes.add("/sitemap.xml");

  return routes;
}

function stripFencedCode(markdown) {
  const lines = markdown.split("\n");
  let fence = null;

  return lines
    .map((line) => {
      const match = line.match(/^\s*(```+|~~~+)/);
      if (match) {
        fence = fence ? null : match[1][0];
        return "";
      }
      return fence ? "" : line;
    })
    .join("\n");
}

function lineNumberAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

function markdownLinks(markdown) {
  const links = [];
  const withoutCode = stripFencedCode(markdown);
  const inlineLinkPattern = /(!)?\[[^\]\n]*\]\(([^)\n]+)\)/g;
  const referenceLinkPattern = /^\s{0,3}\[[^\]\n]+\]:\s*(\S+)/gm;
  const htmlHrefPattern = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;

  for (const match of withoutCode.matchAll(inlineLinkPattern)) {
    if (match[1]) continue;
    links.push({
      href: firstMarkdownDestination(match[2]),
      line: lineNumberAt(withoutCode, match.index),
    });
  }

  for (const match of withoutCode.matchAll(referenceLinkPattern)) {
    links.push({
      href: firstMarkdownDestination(match[1]),
      line: lineNumberAt(withoutCode, match.index),
    });
  }

  for (const match of withoutCode.matchAll(htmlHrefPattern)) {
    links.push({
      href: match[1].trim(),
      line: lineNumberAt(withoutCode, match.index),
    });
  }

  return links.filter((link) => link.href);
}

function firstMarkdownDestination(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("<")) {
    const closing = trimmed.indexOf(">");
    return closing === -1 ? trimmed.slice(1) : trimmed.slice(1, closing);
  }

  return trimmed.split(/\s+/)[0].replace(/^["']|["']$/g, "");
}

function isInternalHref(href) {
  return (
    href &&
    !href.startsWith("#") &&
    !/^[a-z][a-z0-9+.-]*:/i.test(href) &&
    !href.startsWith("//")
  );
}

function routeFromHref(href, sourceRoute) {
  const [withoutHash] = href.split("#");
  const [withoutQuery] = withoutHash.split("?");
  if (!withoutQuery) return null;

  let routePath;
  if (withoutQuery.startsWith("/")) {
    routePath = withoutQuery;
  } else {
    routePath = new URL(withoutQuery, `https://www.vibereference.com${sourceRoute}`).pathname;
  }

  return normalizeRoute(routePath.replace(/\.md$/, ""));
}

function addIssue(issues, file, rule, message, options = {}) {
  issues.push({
    file: toRepoPath(file),
    line: options.line ?? 1,
    rule,
    message,
    target: options.target ?? "",
  });
}

function validateFrontmatter(file, data, issues) {
  for (const key of Object.keys(data)) {
    if (!FRONTMATTER_KEYS.has(key)) {
      addIssue(issues, file, "frontmatter.unknownKey", `Unknown frontmatter key "${key}".`, {
        target: key,
      });
    }
  }

  if (typeof data.title !== "string" || !data.title.trim()) {
    addIssue(issues, file, "frontmatter.title.required", "Frontmatter title is required.", {
      target: "title",
    });
  }

  if (typeof data.description !== "string" || !data.description.trim()) {
    addIssue(
      issues,
      file,
      "frontmatter.description.required",
      "Frontmatter description is required.",
      { target: "description" },
    );
  } else {
    const length = data.description.trim().length;
    if (length < DESCRIPTION_MIN || length > DESCRIPTION_MAX) {
      addIssue(
        issues,
        file,
        "frontmatter.description.length",
        `Description must be ${DESCRIPTION_MIN}-${DESCRIPTION_MAX} characters; got ${length}.`,
        { target: "description" },
      );
    }
  }

  if (data.author !== undefined) {
    const validAuthor =
      typeof data.author === "string" ||
      (typeof data.author === "object" &&
        data.author !== null &&
        typeof data.author.name === "string" &&
        (data.author.url === undefined || typeof data.author.url === "string"));

    if (!validAuthor) {
      addIssue(
        issues,
        file,
        "frontmatter.author.schema",
        "Author must be a string or { name: string, url?: string }.",
        { target: "author" },
      );
    }
  }

  if (
    data.lastReviewed !== undefined &&
    !(typeof data.lastReviewed === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.lastReviewed))
  ) {
    addIssue(
      issues,
      file,
      "frontmatter.lastReviewed.schema",
      "lastReviewed must use YYYY-MM-DD format.",
      { target: "lastReviewed" },
    );
  }
}

function validateHeadings(file, markdown, issues) {
  const withoutCode = stripFencedCode(markdown);
  const h1s = [...withoutCode.matchAll(/^#\s+(.+)$/gm)].map((match) => ({
    title: match[1].trim(),
    line: lineNumberAt(withoutCode, match.index),
  }));

  if (h1s.length !== 1) {
    addIssue(issues, file, "markdown.h1.count", `Expected exactly one H1; got ${h1s.length}.`, {
      target: "h1",
    });
  }

  const seen = new Set();
  for (const h1 of h1s) {
    const normalized = h1.title.toLowerCase();
    if (seen.has(normalized)) {
      addIssue(issues, file, "markdown.h1.duplicate", `Duplicate H1 "${h1.title}".`, {
        line: h1.line,
        target: normalized,
      });
    }
    seen.add(normalized);
  }
}

function validateLinks(file, markdown, routes, issues) {
  const sourceRoute = routeForContentFile(file);
  if (!sourceRoute) return;

  for (const link of markdownLinks(markdown)) {
    if (!isInternalHref(link.href)) continue;

    const route = routeFromHref(link.href, sourceRoute);
    if (!route) continue;

    if (!routes.has(route)) {
      addIssue(
        issues,
        file,
        "internalLink.missingTarget",
        `Internal link "${link.href}" resolves to missing route "${route}".`,
        { line: link.line, target: `${link.href}->${route}` },
      );
    }
  }
}

function validateLegacyModelTerms(file, markdown, issues) {
  const withoutCode = stripFencedCode(markdown);

  for (const term of LEGACY_MODEL_TERMS) {
    const match = withoutCode.match(term.pattern);
    if (!match) continue;

    addIssue(
      issues,
      file,
      "retiredModel.mention",
      `Legacy or retired model reference "${term.label}" should be replaced or clearly framed as historical.`,
      { line: lineNumberAt(withoutCode, match.index ?? 0), target: term.label },
    );
  }
}

function validateFileStructure(file, categories, issues) {
  const relative = toRepoPath(file);
  const parts = relative.split("/");

  if (parts.length !== 3 || parts[0] !== "content" || !parts[2].endsWith(".md")) {
    addIssue(
      issues,
      file,
      "content.fileStructure",
      "Content articles must live at content/<category>/<slug>.md.",
      { target: relative },
    );
    return;
  }

  if (!categories.has(parts[1])) {
    addIssue(
      issues,
      file,
      "content.unknownCategory",
      `Category "${parts[1]}" is not registered in lib/directory.ts.`,
      { target: parts[1] },
    );
  }
}

function validate(files) {
  const categories = categorySlugs();
  const routes = buildRouteSet(files, categories);
  const issues = [];

  for (const file of files) {
    const raw = readText(file);
    const parsed = matter(raw);

    validateFileStructure(file, categories, issues);
    validateFrontmatter(file, parsed.data, issues);
    validateHeadings(file, parsed.content, issues);
    validateLinks(file, parsed.content, routes, issues);
    validateLegacyModelTerms(file, parsed.content, issues);
  }

  return issues.sort((a, b) => issueKey(a).localeCompare(issueKey(b)));
}

function issueKey(issue) {
  return `${issue.rule}|${issue.file}|${issue.target}`;
}

function loadBaseline() {
  if (noBaseline || !fs.existsSync(BASELINE_FILE)) {
    return new Set();
  }

  const baseline = JSON.parse(readText(BASELINE_FILE));
  return new Set(baseline.issues ?? []);
}

function writeBaseline(issues, files) {
  const payload = {
    generatedAt: new Date().toISOString(),
    description:
      "Known VibeReference content validation issues. The validator fails CI only when new issue fingerprints appear.",
    filesScanned: files.length,
    issueCount: issues.length,
    issues: [...new Set(issues.map(issueKey))].sort(),
  };

  fs.writeFileSync(BASELINE_FILE, `${JSON.stringify(payload, null, 2)}\n`);
}

function groupIssues(issues, limit = 80) {
  return issues.slice(0, limit).map((issue) => {
    const location = `${issue.file}:${issue.line}`;
    return `- ${location} ${issue.rule}: ${issue.message}`;
  });
}

function main() {
  const files = gitTrackedContentFiles().sort((a, b) => toRepoPath(a).localeCompare(toRepoPath(b)));
  const issues = validate(files);
  const issueKeys = new Set(issues.map(issueKey));

  if (updateBaseline) {
    writeBaseline(issues, files);
    if (!jsonOutput) {
      console.log(`Updated ${toRepoPath(BASELINE_FILE)} with ${issueKeys.size} issue fingerprints.`);
    }
    return;
  }

  const baseline = loadBaseline();
  const newIssues = issues.filter((issue) => !baseline.has(issueKey(issue)));
  const resolvedBaselineIssues = [...baseline].filter((key) => !issueKeys.has(key));

  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          filesScanned: files.length,
          issueCount: issues.length,
          baselinedIssueCount: issues.length - newIssues.length,
          newIssueCount: newIssues.length,
          resolvedBaselineIssueCount: resolvedBaselineIssues.length,
          newIssues,
          resolvedBaselineIssues,
        },
        null,
        2,
      ),
    );
  } else {
    console.log("VibeReference content validation");
    console.log(`Files scanned: ${files.length}`);
    console.log(`Known issues: ${issues.length - newIssues.length}`);
    console.log(`New issues: ${newIssues.length}`);
    if (resolvedBaselineIssues.length > 0) {
      console.log(`Resolved baseline entries: ${resolvedBaselineIssues.length}`);
    }
  }

  if (newIssues.length > 0) {
    console.error("\nNew content validation issues:");
    console.error(groupIssues(newIssues).join("\n"));
    if (newIssues.length > 80) {
      console.error(`...and ${newIssues.length - 80} more.`);
    }
    console.error("\nFix the content or run npm run validate:content:update after intentionally refreshing the baseline.");
    process.exit(1);
  }

  if (!jsonOutput) {
    console.log("No new content validation issues.");
  }
}

main();
