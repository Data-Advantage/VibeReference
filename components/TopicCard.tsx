import Link from "next/link";

interface TopicCardProps {
  href: string;
  title: string;
  description: string;
  category?: string;
}

export default function TopicCard({ href, title, description, category }: TopicCardProps) {
  return (
    <Link
      href={href}
      className="group block border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white"
    >
      {category && (
        <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
          {category}
        </span>
      )}
      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 text-base leading-snug">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </Link>
  );
}
