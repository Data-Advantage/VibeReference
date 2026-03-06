import { getHomePage, SECTIONS } from "@/lib/markdown";
import MarkdownContent from "@/components/MarkdownContent";
import Link from "next/link";

export default async function HomePage() {
  const { contentHtml } = await getHomePage();

  return (
    <div>
      <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
        {SECTIONS.map((s) => (
          <Link
            key={s.slug}
            href={`/${s.slug}`}
            className="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:bg-gray-50 transition-all group"
          >
            {s.day && (
              <div className="text-xs text-gray-400 mb-1 font-medium">Day {s.day}</div>
            )}
            <div className="font-medium text-gray-900 group-hover:text-gray-700">
              {s.label.replace(/^Day \d+: /, "")}
            </div>
          </Link>
        ))}
      </nav>
      <MarkdownContent html={contentHtml} />
    </div>
  );
}
