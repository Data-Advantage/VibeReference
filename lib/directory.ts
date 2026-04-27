import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");

/* ------------------------------------------------------------------ */
/*  Category definitions                                               */
/* ------------------------------------------------------------------ */

export interface Category {
  slug: string;
  label: string;
  description: string;
  /** Long-form prose intro (120–200 words) rendered on the category page. */
  intro: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "ai-models",
    label: "AI Models",
    description:
      "Large language models, providers, and hosted AI services for building intelligent applications.",
    intro:
      "Every AI-powered app starts with a choice: which model will actually do the thinking? This section is the shelf — a side-by-side look at the foundation models and hosted inference providers you can build on today. You'll find detailed reference pages on frontier labs like Claude, OpenAI GPT, and Google Gemini, open-weight families like Meta Llama and Mistral, and high-throughput hosts like Groq, Fireworks, and Together that serve those open models at production speeds. If you're deciding whether to go hosted-only, mix closed and open, or route across a gateway to hedge on cost and latency, the pages here give you the specs, strengths, pricing posture, and typical use cases without the marketing noise. Built for developers picking the model layer of a serious stack — not for casual benchmark shopping.",
  },
  {
    slug: "ai-development",
    label: "AI Development",
    description:
      "SDKs, agentic workflows, prompt engineering, and tools for building AI-powered software.",
    intro:
      "AI coding is a real engineering discipline now, not a demo. This section covers the tools, patterns, and mental models for building software with AI in the loop — whether you're pair programming, running long-horizon agents, or shipping agentic features inside your own product. You'll find deep references on coding harnesses like Claude Code and Cursor, agent SDKs including the Vercel AI SDK, and the practice-oriented topics that make any of this actually work: context engineering, agent memory systems, agentic coding workflows, and budget control for agents running unattended. It's for developers who have moved past \"ask ChatGPT for a snippet\" and are now designing feedback loops, harness hooks, orchestration strategies, and prompts that stay useful across a full codebase. Pair this section with AI Models when choosing the underlying LLM, and with Backend & Data when wiring an agent into persistent systems.",
  },
  {
    slug: "image-generation",
    label: "Image Generation",
    description:
      "AI-powered image creation tools, models, and APIs for generating visual content.",
    intro:
      "Image models have crossed the usefulness line. Generating marketing assets, in-app illustrations, reference material, and stylized UI elements is now a normal step in shipping a product, not a side quest. This section covers the leading image-generation systems developers actually reach for — DALL·E from OpenAI, Stable Diffusion and its ecosystem, Black Forest Labs' Flux family, Recraft for design-aware output, Ideogram for legible in-image text, and Luma's Photon for photorealistic work. You'll also find Fal, a popular inference host for running these open models at speed via API. If you're deciding which model to call from your backend, which to self-host, or which handles your specific use case (text-in-image, product photography, brand-consistent illustration) without constant rerolling, this is the shelf. It's aimed at developers integrating image generation as a feature, not casual prompters playing with free tiers.",
  },
  {
    slug: "frontend",
    label: "Frontend",
    description:
      "React, Next.js, TypeScript, CSS frameworks, and UI component libraries.",
    intro:
      "The frontend layer is where your users actually meet the AI you wired up in the backend — which means it has to load fast, feel modern, and be accessible enough that nobody bounces. This section is the reference set for building production UIs in the vibe-coding stack. You'll find deep pages on React, Next.js, and TypeScript as the core trio; Tailwind and shadcn/ui for styling and components; plus Radix and Lucide for accessible primitives and icons. There's also v0 for AI-generated UI scaffolding, responsive-design fundamentals, dark mode, and typography via Google Fonts. If you're the kind of developer who'd rather copy a battle-tested pattern than reinvent a modal from scratch, this section is for you. It pairs naturally with Product & Design when you need to think about what you're building, and Backend & Data when you need to wire the UI to real state.",
  },
  {
    slug: "backend-and-data",
    label: "Backend & Data",
    description:
      "Databases, APIs, server-side frameworks, and data management tools.",
    intro:
      "Backend work used to be the boring half. With AI apps, it's where the interesting problems live: persisting conversations, retrieving embeddings, orchestrating webhooks, and making sure your agent can remember what happened yesterday. This section covers the data and server layer that sits behind a modern vibe-coded app. You'll find detailed references on Supabase and Convex as full-stack backends, Postgres and SQL as the durable foundation, vector databases for retrieval, plus webhook patterns, API design, and n8n for workflow automation. There are also dedicated pages on AI memory systems — both the comparison landscape and a Convex-specific tutorial — because long-lived agent memory is quickly becoming a first-class backend concern. This section is aimed at developers who need something sturdier than a local JSON file and want to pick a backend that will survive their first 1,000 users without a rewrite.",
  },
  {
    slug: "cloud-and-hosting",
    label: "Cloud & Hosting",
    description:
      "Cloud providers, hosting platforms, CDNs, and deployment infrastructure.",
    intro:
      "Where does the code actually run, and what does the request path look like when it does? This section is the reference shelf for cloud platforms, deployment targets, and the network-level plumbing that sits between your users and your app. You'll find detailed pages on Vercel for Next.js hosting, Cloudflare for edge, CDN, and Workers, plus the major clouds — AWS, Google Cloud, and Azure — with practical notes for the AI-adjacent services (Bedrock, Vertex AI, Azure OpenAI) that matter right now. A growing subsection covers AI gateways, including Vercel AI Gateway, Cloudflare AI Gateway, OpenRouter, and Portkey, for teams who want one endpoint that can fail over across providers. Plus foundational DNS, domain, and SSL references because nothing else matters if the domain isn't pointed correctly. Read this when you're picking where to deploy, comparing gateway costs, or debugging why your TLS cert is throwing errors in production.",
  },
  {
    slug: "auth-and-payments",
    label: "Auth & Payments",
    description:
      "Authentication, authorization, billing, payment processing, and security.",
    intro:
      "Most AI projects die somewhere between \"it works on my machine\" and \"someone paid me for it.\" This section is the reference for the two features that close that gap: knowing who the user is, and taking their money without losing their trust. You'll find focused pages on Stripe (including the customer portal integration) and Polar for subscription billing, Clerk for managed auth and billing in one, Supabase Auth for the self-hosted-friendly path, and Login with Google for the single most-requested social provider. Deeper pages on authentication, authorization, and general application security cover the patterns you need when rolling your own — or reviewing something an AI built for you and flagged as \"probably fine.\" It's aimed at developers who are about to put a paywall on their AI-powered product and do not want to explain a data leak to their first ten customers.",
  },
  {
    slug: "marketing-and-seo",
    label: "Marketing & SEO",
    description:
      "Search engine optimization, content marketing, email campaigns, and growth strategies.",
    intro:
      "Building the product is the easy half now. Getting humans — and, increasingly, AI answer engines — to find and recommend it is where most AI projects stall. This section covers the distribution side of shipping: traditional SEO fundamentals, plus the newer disciplines of answer engine optimization (AEO) and generative engine optimization (GEO) for surfacing inside ChatGPT, Perplexity, and Gemini answers. You'll find detailed pages on Google Search Console, Google Analytics, llms.txt for agent-readable documentation, and the landing-page, positioning, and ICP work that has to exist before any of the tactics work. There are also strategic references on StoryBrand, the Value Proposition Canvas, and Strategyzer for sharpening messaging, and channel-specific pages on email, social, Discord, and HubSpot. Use this section when your product works and you've realized you now need a second skillset to get it in front of anyone who cares.",
  },
  {
    slug: "devops-and-tools",
    label: "DevOps & Tools",
    description:
      "Build tools, testing, version control, configuration, and developer workflow.",
    intro:
      "Software engineering has always been half craft, half hygiene. This section covers the hygiene: the tools, configs, and conventions that keep a codebase buildable, deployable, and reviewable — especially when parts of it are being written by AI agents. You'll find reference pages on Git and GitHub, Node.js, npm vs pnpm, ESLint, markdown, and a large cluster of \"should you commit X\" guides covering Dockerfiles, editor configs, lockfiles, coverage directories, and AI-tool dotfiles. Detailed pages on env files, config files, and project structure cover the boundaries where secrets, formatting, and team conventions collide. It's aimed at developers who want to avoid the specific class of production incidents that start with \"someone committed a file they shouldn't have\" or \"my AI agent overwrote my lockfile.\" Pair this with Cloud & Hosting when you're setting up CI/CD, and with AI Development when harnessing coding agents safely.",
  },
  {
    slug: "product-and-design",
    label: "Product & Design",
    description:
      "UX design, accessibility, product strategy, user research, and visual design.",
    intro:
      "AI can write your code. It still cannot tell you what to build or who should care. This section covers the product and design fundamentals that decide whether an AI-powered tool actually gets used — from MVP scoping and product-requirement writing to visual design, UX patterns, and accessibility work. You'll find reference pages on product strategy for AI-built products, iteration loops, structured user-feedback gathering, and integration-details thinking for when your product has to plug into other tools. The visual-design and UX-design pages cover the craft that turns an ugly demo into something people recommend, and the accessibility page exists because \"works for everyone\" is both a legal requirement and a quality standard. It's aimed at developers who want to spend their saved hours on real product decisions — not on guessing what the user meant. Pair with Frontend when building and Marketing & SEO when positioning the result.",
  },
  {
    slug: "guides",
    label: "Guides",
    description:
      "Practical how-to guides for vibe coding, from choosing your stack to launching and growing your SaaS.",
    intro:
      "This is the how-to shelf. If the rest of VibeReference is the dictionary, Guides is the cookbook — end-to-end walkthroughs for the workflows that cross category boundaries. You'll find playbooks like Getting Started with Vibe Coding, Choosing Your Tech Stack, and Shipping a Next.js Site in a Weekend for the first-ship journey, plus deeper tracks on AI memory architecture, building AI-powered features, integrating payments with Stripe, and the full post-launch growth playbook for what to do once the code is live. Guides on Claude Code automation, running Paperclip on EC2 with Tailscale, and building a content pipeline with AI cover the autonomous-development workflows the rest of the site references but rarely walks through end-to-end. It's aimed at developers who already know what React and Postgres are and now want the opinionated sequence for actually shipping — minus the enterprise boilerplate most tutorials drag along.",
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
  author?: { name: string; url?: string };
}

/* ------------------------------------------------------------------ */
/*  Markdown helpers                                                   */
/* ------------------------------------------------------------------ */

async function mdToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  // Wrap <table> elements in a scrollable container for mobile
  return result
    .toString()
    .replace(/<table>/g, '<div class="table-scroll-wrapper"><table>')
    .replace(/<\/table>/g, '</table></div>')
    // Strip .md extensions from relative links (foo.md → foo, ./foo.md → ./foo, ../bar/baz.md → ../bar/baz)
    .replace(/href="((?:\.{1,2}\/)?[^"]*?)\.md"/g, 'href="$1"');
}

function extractTitle(
  content: string,
  fallback: string,
  frontmatterTitle?: string,
): string {
  if (frontmatterTitle) return frontmatterTitle;
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
      const { data, content } = matter(raw);
      const title = extractTitle(content, slugToLabel(slug), data.title);
      const description = data.description || extractDescription(content);
      const author = data.author
        ? typeof data.author === "string"
          ? { name: data.author }
          : { name: data.author.name, url: data.author.url }
        : undefined;
      topics.push({
        slug,
        title,
        description,
        category: cat.slug,
        source: { dir: `content/${cat.slug}`, file },
        author,
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
  const filePath = path.join(CONTENT_DIR, topic.category, topic.source.file);
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
