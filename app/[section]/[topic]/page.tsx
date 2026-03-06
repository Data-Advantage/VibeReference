import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTopicPage,
  getSectionTopics,
  SECTIONS,
} from "@/lib/markdown";
import MarkdownContent from "@/components/MarkdownContent";

export function generateStaticParams() {
  const params: { section: string; topic: string }[] = [];
  for (const section of SECTIONS) {
    const topics = getSectionTopics(section.slug);
    for (const topic of topics) {
      params.push({ section: section.slug, topic });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; topic: string }>;
}) {
  const { section, topic } = await params;
  const data = await getTopicPage(section, topic);
  return { title: data ? `${data.title} — VibeReference` : "VibeReference" };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ section: string; topic: string }>;
}) {
  const { section, topic } = await params;
  const data = await getTopicPage(section, topic);
  if (!data) notFound();

  const sectionMeta = SECTIONS.find((s) => s.slug === section);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${section}`}
          className="hover:text-gray-600 transition-colors"
        >
          {sectionMeta?.label}
        </Link>
        <span>/</span>
        <span className="text-gray-600">{data.title}</span>
      </div>

      <MarkdownContent html={data.contentHtml} />
    </div>
  );
}
