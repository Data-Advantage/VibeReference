import { getCategoryWithCount, getAllTopics, CATEGORIES } from "@/lib/directory";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const categories = getCategoryWithCount();
  const topics = getAllTopics();
  const totalCount = topics.length;

  const searchItems = topics.map((t) => ({
    slug: t.slug,
    title: t.title,
    category: t.category,
    categoryLabel: CATEGORIES.find((c) => c.slug === t.category)?.label || t.category,
  }));

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Learn AI Development
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mb-8">
            {totalCount}+ educational articles on AI models, development
            tools, frameworks, and techniques for building software with AI.
          </p>
          <SearchBar items={searchItems} />
        </div>
      </section>

      {/* Categories grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              href={`/${cat.slug}`}
              label={cat.label}
              description={cat.description}
              count={cat.count}
            />
          ))}
        </div>
      </section>

      {/* All topics by category */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
          All Topics
        </h2>
        {categories.map((cat) => {
          const catTopics = topics
            .filter((t) => t.category === cat.slug)
            .sort((a, b) => a.title.localeCompare(b.title));
          return (
            <div key={cat.slug} className="mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <a href={`/${cat.slug}`} className="hover:text-blue-600 transition-colors">
                  {cat.label}
                </a>
                <span className="text-sm font-normal text-gray-400 ml-2">
                  {catTopics.length}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {catTopics.map((t) => (
                  <a
                    key={t.slug}
                    href={`/${cat.slug}/${t.slug}`}
                    className="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all text-gray-700"
                  >
                    {t.title}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
