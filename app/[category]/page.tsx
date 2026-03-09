import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory, getTopicsByCategory, CATEGORIES } from "@/lib/directory";
import TopicCard from "@/components/TopicCard";
import type { Metadata } from "next";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.label,
    description: category.description,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: `${category.label} — VibeReference`,
      description: category.description,
      type: "website",
      url: `https://www.vibereference.com/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.label} — VibeReference`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const topics = getTopicsByCategory(slug);

  return (
    <div>
      {/* Category header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-600">{category.label}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3">
            {category.label}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            {category.description}
          </p>
          <p className="text-sm text-gray-400 mt-3">
            {topics.length} {topics.length === 1 ? "topic" : "topics"}
          </p>
        </div>
      </section>

      {/* Topic grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              href={`/${slug}/${topic.slug}`}
              title={topic.title}
              description={topic.description}
            />
          ))}
        </div>
      </section>

      {/* Other categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Other Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== slug).map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all text-gray-700"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
