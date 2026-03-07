import Link from "next/link";

interface CategoryCardProps {
  href: string;
  label: string;
  description: string;
  count: number;
}

export default function CategoryCard({ href, label, description, count }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group block border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all bg-white"
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
          {label}
        </h2>
        <span className="text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2.5 py-1 ml-2 shrink-0">
          {count}
        </span>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
