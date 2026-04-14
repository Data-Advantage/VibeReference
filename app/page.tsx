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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Curated AI Development Resources
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mb-4">
            AI dev tools, frameworks, and techniques change weekly — impossible to track.
            VibeReference curates what actually matters so you can build with confidence.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            {totalCount}+ articles across AI models, tools, frameworks, and techniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href="#categories"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-center"
            >
              Browse Articles
            </a>
            <a
              href="#all-topics"
              className="inline-block bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-200 transition-colors text-center"
            >
              See All Topics
            </a>
          </div>
          <SearchBar items={searchItems} />
        </div>
      </section>

      {/* Problem */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              You want to build with AI — but which tools actually matter?
            </h2>
            <p className="text-gray-500 mb-4">
              You hop between outdated tutorials and never build confidence in any one approach.
              New frameworks launch every week. Blog posts contradict each other. The landscape is chaos.
            </p>
            <blockquote className="border-l-4 border-blue-300 pl-4 text-gray-500 italic">
              &quot;Learning AI development should be curated, not chaotic.&quot;
            </blockquote>
          </div>
        </div>
      </section>

      {/* Plan */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-3">1</div>
              <h3 className="font-semibold text-gray-900 mb-1">Browse by category</h3>
              <p className="text-sm text-gray-500">Find topics organized by what you need — models, tools, frameworks, or techniques.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-3">2</div>
              <h3 className="font-semibold text-gray-900 mb-1">Read expert-written articles</h3>
              <p className="text-sm text-gray-500">Each article is researched, structured, and written to help you understand and apply the concept.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-3">3</div>
              <h3 className="font-semibold text-gray-900 mb-1">Apply what you learn</h3>
              <p className="text-sm text-gray-500">Take what you learned and use it in your next project. No fluff — just practical knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section id="categories" className="px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>

      {/* Failure vs Success */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white border border-red-100 rounded-lg p-6">
              <h3 className="font-semibold text-red-600 mb-3">Without a curated guide</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Hop between outdated tutorials</li>
                <li>Never build confidence in any approach</li>
                <li>Waste time on tools that don&apos;t matter</li>
                <li>Fall behind as the landscape shifts</li>
              </ul>
            </div>
            <div className="bg-white border border-blue-100 rounded-lg p-6">
              <h3 className="font-semibold text-blue-600 mb-3">With VibeReference</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Know which tools matter right now</li>
                <li>Understand how they work and when to use them</li>
                <li>Build with confidence, not guesswork</li>
                <li>Stay current without the noise</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* All topics by category */}
      <section id="all-topics" className="px-6 lg:px-8 py-8 pb-16">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Learn what actually matters in AI development
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            {totalCount}+ curated articles. No noise. Just the tools and techniques you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#categories"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse Articles
            </a>
            <a
              href="#all-topics"
              className="inline-block border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              See All Topics
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
