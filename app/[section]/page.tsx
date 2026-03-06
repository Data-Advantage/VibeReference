import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getSectionPage,
  getSectionTopics,
  SECTIONS,
} from "@/lib/markdown";
import MarkdownContent from "@/components/MarkdownContent";

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const s = SECTIONS.find((x) => x.slug === section);
  return { title: s ? `${s.label} — VibeReference` : "VibeReference" };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const data = await getSectionPage(section);
  if (!data) notFound();

  const topics = getSectionTopics(section);
  const sectionMeta = SECTIONS.find((s) => s.slug === section);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Home
        </Link>
      </div>

      {topics.length > 0 && (
        <div className="mb-10 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            {sectionMeta?.label} Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.sort().map((t) => (
              <Link
                key={t}
                href={`/${section}/${t}`}
                className="text-sm px-3 py-1 bg-white border border-gray-200 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-700"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      )}

      <MarkdownContent html={data.contentHtml} />
    </div>
  );
}
