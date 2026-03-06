import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ROOT = path.join(process.cwd());

export const SECTIONS = [
  { slug: "learn", dir: "0-learn", label: "Learn", day: null },
  { slug: "create", dir: "1-create", label: "Day 1: Create", day: 1 },
  { slug: "refine", dir: "2-refine", label: "Day 2: Refine", day: 2 },
  { slug: "build", dir: "3-build", label: "Day 3: Build", day: 3 },
  { slug: "position", dir: "4-position", label: "Day 4: Position", day: 4 },
  { slug: "launch", dir: "5-launch", label: "Day 5: Launch", day: 5 },
  { slug: "grow", dir: "6-grow", label: "Grow", day: null },
];

export interface PageData {
  title: string;
  contentHtml: string;
}

async function mdToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return result.toString();
}

export async function getHomePage(): Promise<PageData> {
  const filePath = path.join(ROOT, "README.md");
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);
  const contentHtml = await mdToHtml(content);
  return { title: "VibeReference", contentHtml };
}

export async function getSectionPage(sectionSlug: string): Promise<PageData | null> {
  const section = SECTIONS.find((s) => s.slug === sectionSlug);
  if (!section) return null;
  const filePath = path.join(ROOT, section.dir, "README.md");
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);
  const contentHtml = await mdToHtml(content);
  return { title: section.label, contentHtml };
}

export async function getTopicPage(
  sectionSlug: string,
  topicSlug: string
): Promise<PageData | null> {
  const section = SECTIONS.find((s) => s.slug === sectionSlug);
  if (!section) return null;
  const filePath = path.join(ROOT, section.dir, `${topicSlug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);
  const contentHtml = await mdToHtml(content);
  // Try to extract a title from first h1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : topicSlug;
  return { title, contentHtml };
}

export function getSectionTopics(sectionSlug: string): string[] {
  const section = SECTIONS.find((s) => s.slug === sectionSlug);
  if (!section) return [];
  const dir = path.join(ROOT, section.dir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => f.replace(/\.md$/, ""));
}
