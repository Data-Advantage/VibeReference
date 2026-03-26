import type { Metadata } from "next";
import Link from "next/link";
import { getTopicsByCategory } from "@/lib/directory";
import TopicCard from "@/components/TopicCard";

export const metadata: Metadata = {
  title: "AI Models for Vibe Coders",
  description:
    "The curated AI model guide for vibe coders and agentic developers. Daily drivers, power tools, and inference platforms — what to use and when.",
  alternates: { canonical: "/ai-models" },
  openGraph: {
    title: "AI Models for Vibe Coders — VibeReference",
    description:
      "The curated AI model guide for vibe coders and agentic developers. Daily drivers, power tools, and inference platforms.",
    type: "website",
    url: "https://www.vibereference.com/ai-models",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Models for Vibe Coders — VibeReference",
    description:
      "The curated AI model guide for vibe coders and agentic developers.",
  },
};

const SECTIONS = [
  {
    label: "Daily Drivers",
    description:
      "The models you'll reach for every day — best-in-class coding, reasoning, and tool use.",
    slugs: ["claude", "openai-gpt", "google-gemini"],
  },
  {
    label: "Power Tools",
    description:
      "Open-source and specialized models for when you need more control, lower cost, or fine-tuning.",
    slugs: ["deepseek", "meta-llama", "mistral"],
  },
  {
    label: "Inference Platforms",
    description:
      "Hosted runtimes for running open-source models at production speed and scale.",
    slugs: ["groq", "fireworks", "together"],
  },
  {
    label: "Watch List",
    description: "Emerging models worth tracking as they mature.",
    slugs: ["xai-grok"],
  },
];

export default function AiModelsPage() {
  const allTopics = getTopicsByCategory("ai-models");
  const topicBySlug = new Map(allTopics.map((t) => [t.slug, t]));

  const sections = SECTIONS.map((s) => ({
    ...s,
    topics: s.slugs.flatMap((slug) => {
      const t = topicBySlug.get(slug);
      return t ? [t] : [];
    }),
  })).filter((s) => s.topics.length > 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-600">AI Models</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3">
            AI Models for Vibe Coders
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mb-6">
            A curated, opinionated guide to the models that matter for coding,
            agentic workflows, and tool use. Skip the noise — here&apos;s what
            to actually use.
          </p>
          <a
            href="https://www.llmreference.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Full model database at LLMReference.com →
          </a>
        </div>
      </section>

      {/* Tiered sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-14">
        {sections.map((section) => (
          <section key={section.label}>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {section.label}
              </h2>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.topics.map((topic) => (
                <TopicCard
                  key={topic.slug}
                  href={`/ai-models/${topic.slug}`}
                  title={topic.title}
                  description={topic.description}
                />
              ))}
            </div>
          </section>
        ))}

        {/* CTAs */}
        <section className="border-t border-gray-200 pt-10">
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://www.llmreference.com/models"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white group"
            >
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  Full Model Database →
                </p>
                <p className="text-sm text-gray-500">
                  Browse 1,000+ AI models with specs, pricing, and comparisons
                  at LLMReference.com.
                </p>
              </div>
            </a>
            <a
              href="https://www.llmreference.com/compare"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white group"
            >
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  Compare Models →
                </p>
                <p className="text-sm text-gray-500">
                  Side-by-side specs and pricing for GPT-4o, Claude, Gemini,
                  DeepSeek, and more.
                </p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
