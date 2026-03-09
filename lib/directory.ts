import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");

/* ------------------------------------------------------------------ */
/*  Category definitions                                               */
/* ------------------------------------------------------------------ */

export interface Category {
  slug: string;
  label: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "ai-models",
    label: "AI Models",
    description:
      "Large language models, providers, and hosted AI services for building intelligent applications.",
  },
  {
    slug: "ai-development",
    label: "AI Development",
    description:
      "SDKs, agentic workflows, prompt engineering, and tools for building AI-powered software.",
  },
  {
    slug: "image-generation",
    label: "Image Generation",
    description:
      "AI-powered image creation tools, models, and APIs for generating visual content.",
  },
  {
    slug: "frontend",
    label: "Frontend",
    description:
      "React, Next.js, TypeScript, CSS frameworks, and UI component libraries.",
  },
  {
    slug: "backend-and-data",
    label: "Backend & Data",
    description:
      "Databases, APIs, server-side frameworks, and data management tools.",
  },
  {
    slug: "cloud-and-hosting",
    label: "Cloud & Hosting",
    description:
      "Cloud providers, hosting platforms, CDNs, and deployment infrastructure.",
  },
  {
    slug: "auth-and-payments",
    label: "Auth & Payments",
    description:
      "Authentication, authorization, billing, payment processing, and security.",
  },
  {
    slug: "marketing-and-seo",
    label: "Marketing & SEO",
    description:
      "Search engine optimization, content marketing, email campaigns, and growth strategies.",
  },
  {
    slug: "devops-and-tools",
    label: "DevOps & Tools",
    description:
      "Build tools, testing, version control, configuration, and developer workflow.",
  },
  {
    slug: "product-and-design",
    label: "Product & Design",
    description:
      "UX design, accessibility, product strategy, user research, and visual design.",
  },
  {
    slug: "guides",
    label: "Guides",
    description:
      "Step-by-step workflow guides for building and launching SaaS products.",
  },
];

/* ------------------------------------------------------------------ */
/*  Topic type                                                         */
/* ------------------------------------------------------------------ */

export interface Topic {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** Filesystem source: { dir, file } */
  source: { dir: string; file: string };
}

/* ------------------------------------------------------------------ */
/*  Markdown helpers                                                   */
/* ------------------------------------------------------------------ */

async function mdToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return result.toString();
}

function extractTitle(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function extractDescription(content: string): string {
  // Take the first non-heading, non-empty paragraph line
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*") &&
      !trimmed.startsWith("|") &&
      !trimmed.startsWith("```") &&
      !trimmed.startsWith("[") &&
      !trimmed.startsWith("Docs:") &&
      !trimmed.startsWith("##")
    ) {
      // Truncate to ~160 chars for SEO meta descriptions
      return trimmed.length > 160
        ? trimmed.slice(0, 157) + "..."
        : trimmed;
    }
  }
  return "";
}

function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ------------------------------------------------------------------ */
/*  Build the full topic list (cached at module level)                 */
/* ------------------------------------------------------------------ */

let _topicsCache: Topic[] | null = null;

export function getAllTopics(): Topic[] {
  if (_topicsCache) return _topicsCache;

  const topics: Topic[] = [];

  // Scan each category folder inside content/
  for (const cat of CATEGORIES) {
    const catDir = path.join(CONTENT_DIR, cat.slug);
    if (!fs.existsSync(catDir)) continue;

    const files = fs
      .readdirSync(catDir)
      .filter((f) => f.endsWith(".md") && f !== "README.md");

    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(catDir, file), "utf8");
      const { content } = matter(raw);
      const title = extractTitle(content, slugToLabel(slug));
      const description = extractDescription(content);
      topics.push({
        slug,
        title,
        description,
        category: cat.slug,
        source: { dir: `content/${cat.slug}`, file },
      });
    }
  }

  _topicsCache = topics;
  return topics;
}

/* ------------------------------------------------------------------ */
/*  Query helpers                                                      */
/* ------------------------------------------------------------------ */

export function getTopicsByCategory(categorySlug: string): Topic[] {
  return getAllTopics()
    .filter((t) => t.category === categorySlug)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getCategoryWithCount(): (Category & { count: number })[] {
  const topics = getAllTopics();
  return CATEGORIES.map((cat) => ({
    ...cat,
    count: topics.filter((t) => t.category === cat.slug).length,
  })).filter((cat) => cat.count > 0);
}

export function getTopic(categorySlug: string, topicSlug: string): Topic | undefined {
  return getAllTopics().find(
    (t) => t.category === categorySlug && t.slug === topicSlug
  );
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export async function getTopicContent(topic: Topic): Promise<string> {
  const filePath = path.join(ROOT, topic.source.dir, topic.source.file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);
  return mdToHtml(content);
}

export function getRelatedTopics(topic: Topic, limit = 6): Topic[] {
  return getAllTopics()
    .filter((t) => t.category === topic.category && t.slug !== topic.slug)
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function searchTopics(query: string): Topic[] {
  const q = query.toLowerCase();
  return getAllTopics().filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.slug.includes(q) ||
      t.description.toLowerCase().includes(q)
  );
}
