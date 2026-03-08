import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ROOT = process.cwd();

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
/*  Topic → category mapping                                           */
/* ------------------------------------------------------------------ */

const TOPIC_CATEGORIES: Record<string, string> = {
  // AI Models
  "claude": "ai-models",
  "chatgpt": "ai-models",
  "openai-gpt": "ai-models",
  "google-gemini": "ai-models",
  "mistral": "ai-models",
  "deepseek": "ai-models",
  "meta-llama": "ai-models",
  "cohere": "ai-models",
  "cerebras": "ai-models",
  "groq": "ai-models",
  "xai-grok": "ai-models",
  "perplexity": "ai-models",
  "anthropic-developer": "ai-models",
  "openai-developer": "ai-models",
  "openai-o": "ai-models",
  "together": "ai-models",
  "fireworks": "ai-models",

  // AI Development
  "ai-sdk": "ai-development",
  "ai-sdk-core": "ai-development",
  "ai-sdk-ui": "ai-development",
  "ai-sdk-providers": "ai-development",
  "prompt-engineering": "ai-development",
  "object-generation": "ai-development",
  "openai-assistant": "ai-development",
  "openai-responses": "ai-development",
  "openai-moderation": "ai-development",
  "openai-tts": "ai-development",
  "agentic-coding": "ai-development",
  "ai-agents": "ai-development",
  "ai-pair-programming": "ai-development",
  "vibe-coding": "ai-development",
  "coding-harnesses": "ai-development",
  "ralph-loops": "ai-development",
  "prompt-driven-development": "ai-development",
  "human-in-the-loop": "ai-development",
  "mcp-model-context-protocol": "ai-development",
  "autonomous-companies": "ai-development",
  "playground": "ai-development",
  "google-generative-ai": "ai-development",
  "exa": "ai-development",
  "tavily": "ai-development",
  "unstructured": "ai-development",
  "upstage": "ai-development",

  // Image Generation
  "openai-dalle": "image-generation",
  "stable-diffusion": "image-generation",
  "image-generation": "image-generation",
  "black-forest-labs-flux": "image-generation",
  "fal": "image-generation",
  "ideogram": "image-generation",
  "luma-photon": "image-generation",
  "recraft": "image-generation",

  // Frontend
  "react": "frontend",
  "nextjs": "frontend",
  "typescript": "frontend",
  "typescript-patterns": "frontend",
  "css": "frontend",
  "html": "frontend",
  "tailwind": "frontend",
  "shadcn": "frontend",
  "radix": "frontend",
  "lucide": "frontend",
  "dark-mode": "frontend",
  "responsive-design": "frontend",
  "components": "frontend",
  "style-patterns": "frontend",
  "v0": "frontend",
  "tweakcn": "frontend",
  "zod": "frontend",
  "google-fonts": "frontend",
  "postcss": "frontend",
  "json": "frontend",

  // Backend & Data
  "supabase": "backend-and-data",
  "supabase-database-setup": "backend-and-data",
  "supabase-database-patterns": "backend-and-data",
  "supabase-migrations": "backend-and-data",
  "postgres": "backend-and-data",
  "sql": "backend-and-data",
  "sql-migration": "backend-and-data",
  "convex-setup-workflow": "backend-and-data",
  "convex-diagnostics": "backend-and-data",
  "nextjs-api": "backend-and-data",
  "api": "backend-and-data",
  "api-integration": "backend-and-data",
  "middleware": "backend-and-data",
  "openapi": "backend-and-data",
  "swagger": "backend-and-data",
  "webhook": "backend-and-data",
  "n8n": "backend-and-data",
  "resend": "backend-and-data",
  "aws-ses": "backend-and-data",

  // Cloud & Hosting
  "aws": "cloud-and-hosting",
  "azure": "cloud-and-hosting",
  "azure-openai": "cloud-and-hosting",
  "google-cloud": "cloud-and-hosting",
  "google-vertex-ai": "cloud-and-hosting",
  "amazon-bedrock": "cloud-and-hosting",
  "cloudflare": "cloud-and-hosting",
  "vercel": "cloud-and-hosting",
  "vercel-blob": "cloud-and-hosting",
  "vercel-domains": "cloud-and-hosting",
  "vercel-analytics": "cloud-and-hosting",
  "dns": "cloud-and-hosting",
  "domain": "cloud-and-hosting",
  "ssl": "cloud-and-hosting",

  // Auth & Payments
  "authentication": "auth-and-payments",
  "login-with-google": "auth-and-payments",
  "clerk-billing": "auth-and-payments",
  "stripe": "auth-and-payments",
  "stripe-customer-portal": "auth-and-payments",
  "payment-integration": "auth-and-payments",
  "polar": "auth-and-payments",
  "security": "auth-and-payments",

  // Marketing & SEO
  "seo": "marketing-and-seo",
  "content-marketing": "marketing-and-seo",
  "social-media-marketing": "marketing-and-seo",
  "email-marketing": "marketing-and-seo",
  "landing-pages": "marketing-and-seo",
  "google-analytics": "marketing-and-seo",
  "google-search-console": "marketing-and-seo",
  "hubspot": "marketing-and-seo",
  "product-launch": "marketing-and-seo",
  "positioning-statement": "marketing-and-seo",
  "storybrand": "marketing-and-seo",
  "strategyzer": "marketing-and-seo",
  "unique-selling-proposition": "marketing-and-seo",
  "value-proposition-canvas": "marketing-and-seo",
  "discord": "marketing-and-seo",
  "sitemap": "marketing-and-seo",
  "market-research": "marketing-and-seo",
  "competitor-analysis": "marketing-and-seo",
  "ideal-customer-profile": "marketing-and-seo",
  "demand-validation": "marketing-and-seo",
  "brand-voice": "marketing-and-seo",
  "pitch-deck": "marketing-and-seo",

  // DevOps & Tools
  "github": "devops-and-tools",
  "nodejs": "devops-and-tools",
  "npm": "devops-and-tools",
  "package.json": "devops-and-tools",
  "eslint": "devops-and-tools",
  "config-files": "devops-and-tools",
  "environment-variable": "devops-and-tools",
  "project-structure": "devops-and-tools",
  "markdown": "devops-and-tools",
  "development-plan": "devops-and-tools",
  "implementation-roadmap": "devops-and-tools",
  "testing-qa": "devops-and-tools",
  "performance-optimization": "devops-and-tools",
  "web-vitals": "devops-and-tools",
  "analytics": "devops-and-tools",
  "v0-project-instructions": "devops-and-tools",

  // Product & Design
  "ux-design": "product-and-design",
  "visual-design": "product-and-design",
  "accessibility": "product-and-design",
  "user-feedback": "product-and-design",
  "product-requirements": "product-and-design",
  "product-iteration": "product-and-design",
  "mvp": "product-and-design",
  "integration-details": "product-and-design",
};

/* ------------------------------------------------------------------ */
/*  Guide definitions (from day 1-5 + grow content)                    */
/* ------------------------------------------------------------------ */

interface GuideSource {
  dir: string;
  file: string;
  slug: string;
}

const GUIDE_SOURCES: GuideSource[] = [
  // Day 1: Create
  { dir: "1-create", file: "1.1-product-requirements.md", slug: "product-requirements-guide" },
  { dir: "1-create", file: "1.2-marketing-story.md", slug: "marketing-story-guide" },
  { dir: "1-create", file: "1.3-landing-page.md", slug: "landing-page-guide" },
  { dir: "1-create", file: "1.4-backend-setup.md", slug: "backend-setup-guide" },
  { dir: "1-create", file: "1.5-working-prototype.md", slug: "working-prototype-guide" },
  // Day 2: Refine
  { dir: "2-refine", file: "2.1-feedback-collection-chat.md", slug: "feedback-collection-guide" },
  { dir: "2-refine", file: "2.2-ux-improvement-chat.md", slug: "ux-improvement-guide" },
  { dir: "2-refine", file: "2.3-visual-design-chat.md", slug: "visual-design-guide" },
  { dir: "2-refine", file: "2.4-app-refinement-chat.md", slug: "app-refinement-guide" },
  { dir: "2-refine", file: "2.5-domain-name-chat.md", slug: "domain-name-guide" },
  // Day 3: Build
  { dir: "3-build", file: "3.1-authentication-system-chat.md", slug: "authentication-system-guide" },
  { dir: "3-build", file: "3.2-api-integration-chat.md", slug: "api-integration-guide" },
  { dir: "3-build", file: "3.3-payment-integration-chat.md", slug: "payment-integration-guide" },
  { dir: "3-build", file: "3.4-advanced-features-chat.md", slug: "advanced-features-guide" },
  { dir: "3-build", file: "3.5-dashboard-implementation-chat.md", slug: "dashboard-implementation-guide" },
  // Day 4: Position
  { dir: "4-position", file: "4.1-marketing-website-chat.md", slug: "marketing-website-guide" },
  { dir: "4-position", file: "4.2-seo-content-chat.md", slug: "seo-content-guide" },
  { dir: "4-position", file: "4.3-email-sequences-chat.md", slug: "email-sequences-guide" },
  { dir: "4-position", file: "4.4-social-channels-chat.md", slug: "social-channels-guide" },
  { dir: "4-position", file: "4.5-technical-documentation-chat.md", slug: "technical-documentation-guide" },
  // Day 5: Launch
  { dir: "5-launch", file: "5.1-analytics-integration-chat.md", slug: "analytics-integration-guide" },
  { dir: "5-launch", file: "5.2-final-testing-chat.md", slug: "final-testing-guide" },
  { dir: "5-launch", file: "5.3-final-deployment-chat.md", slug: "final-deployment-guide" },
  { dir: "5-launch", file: "5.4-launch-announcement-chat.md", slug: "launch-announcement-guide" },
  { dir: "5-launch", file: "5.5-user-invitation-chat.md", slug: "user-invitation-guide" },
  { dir: "5-launch", file: "5.6-feedback-capture-chat.md", slug: "feedback-capture-guide" },
  // Grow
  { dir: "6-grow", file: "performance-optimization-chat.md", slug: "growth-optimization-guide" },
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

  // 1. Process 0-learn directory
  const learnDir = path.join(ROOT, "0-learn");
  if (fs.existsSync(learnDir)) {
    const files = fs.readdirSync(learnDir).filter(
      (f) => f.endsWith(".md") && f !== "README.md"
    );
    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(learnDir, file), "utf8");
      const { content } = matter(raw);
      const title = extractTitle(content, slugToLabel(slug));
      const description = extractDescription(content);
      const category = TOPIC_CATEGORIES[slug] || "devops-and-tools";
      topics.push({
        slug,
        title,
        description,
        category,
        source: { dir: "0-learn", file },
      });
    }
  }

  // 2. Process guide sources (day 1-5 + grow)
  for (const guide of GUIDE_SOURCES) {
    const filePath = path.join(ROOT, guide.dir, guide.file);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, "utf8");
    const { content } = matter(raw);
    const title = extractTitle(content, slugToLabel(guide.slug));
    const description = extractDescription(content);
    topics.push({
      slug: guide.slug,
      title,
      description,
      category: "guides",
      source: { dir: guide.dir, file: guide.file },
    });
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
