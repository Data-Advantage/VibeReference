import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTopic,
  getTopicContent,
  getRelatedTopics,
  getCategory,
  getAllTopics,
  CATEGORIES,
} from "@/lib/directory";
import MarkdownContent from "@/components/MarkdownContent";
import type { Metadata } from "next";

export function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((t) => ({
    category: t.category,
    topic: t.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; topic: string }>;
}): Promise<Metadata> {
  const { category, topic: topicSlug } = await params;
  const topic = getTopic(category, topicSlug);
  if (!topic) return {};
  const cat = getCategory(category);
  return {
    title: topic.title,
    description: topic.description || `Learn about ${topic.title} in the VibeReference directory.`,
    openGraph: {
      title: `${topic.title} — VibeReference`,
      description: topic.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.title} — VibeReference`,
      description: topic.description,
    },
    alternates: {
      canonical: `/${category}/${topicSlug}`,
    },
    other: {
      "article:section": cat?.label || category,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ category: string; topic: string }>;
}) {
  const { category, topic: topicSlug } = await params;
  const topic = getTopic(category, topicSlug);
  if (!topic) notFound();

  const cat = getCategory(category);
  const contentHtml = await getTopicContent(topic);
  const related = getRelatedTopics(topic);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: topic.title,
    description: topic.description,
    url: `https://www.vibereference.com/${category}/${topicSlug}`,
    articleSection: cat?.label,
    ...(topic.author && {
      author: {
        "@type": "Person",
        name: topic.author.name,
        ...(topic.author.url && { url: topic.author.url }),
      },
    }),
    isPartOf: {
      "@type": "WebSite",
      name: "VibeReference",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb + header — matches site max-w-7xl */}
      <section className="bg-white border-b border-gray-200 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-400">
            <ol className="flex items-center gap-2 list-none m-0 p-0">
              <li>
                <Link href="/" className="hover:text-gray-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/${category}`}
                  className="hover:text-gray-600 transition-colors"
                >
                  {cat?.label}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-gray-600">{topic.title}</li>
            </ol>
          </nav>
          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
            {cat?.label}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="text-gray-500 text-lg mt-3 max-w-2xl">
              {topic.description}
            </p>
          )}
          {topic.author && (
            <p className="text-sm text-gray-400 mt-3">
              Written by{" "}
              {topic.author.url ? (
                <a
                  href={topic.author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {topic.author.name}
                </a>
              ) : (
                <span className="text-gray-600">{topic.author.name}</span>
              )}
            </p>
          )}
        </div>
      </section>

      {/* Content + Sidebar — two-column on desktop, fills max-w-7xl */}
      <section className="px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main article content */}
          <div className="lg:col-span-2">
            <MarkdownContent html={contentHtml} />

            {/* Cross-promotion CTA */}
            <div className="mt-10 bg-blue-50 border border-blue-100 rounded-lg p-6">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Ready to build?
              </p>
              <p className="text-sm text-blue-700 mb-3">
                Go from idea to launched product in a week with AI-assisted development.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.vibeweek.ai"
                  className="inline-block text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                >
                  Start with VibeWeek.ai
                </a>
                <a
                  href="https://www.launchweek.ai"
                  className="inline-block text-sm font-medium text-blue-600 bg-white border border-blue-200 hover:border-blue-300 px-4 py-2 rounded-md transition-colors"
                >
                  Launch with LaunchWeek.ai
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar: related topics + other categories (desktop only) */}
          <aside className="hidden lg:block">
            {related.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Related Topics
                </h2>
                <div className="flex flex-col gap-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/${category}/${r.slug}`}
                      className="block border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all bg-white"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {r.title}
                      </p>
                      {r.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {r.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Other Categories
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.filter((c) => c.slug !== category).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all text-gray-600"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile: related topics below article */}
        {related.length > 0 && (
          <div className="lg:hidden mt-10 border-t border-gray-200 pt-8 pb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Related Topics in {cat?.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${category}/${r.slug}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all bg-white"
                >
                  <p className="font-medium text-gray-900 text-sm">
                    {r.title}
                  </p>
                  {r.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {r.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
