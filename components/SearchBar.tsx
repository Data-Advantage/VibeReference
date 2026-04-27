"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchItem {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
}

export default function SearchBar({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = query.length >= 2
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.slug.includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const navigate = useCallback((item: SearchItem) => {
    setOpen(false);
    setQuery("");
    router.push(`/${item.category}/${item.slug}`);
  }, [router]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search topics..."
        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all placeholder:text-gray-400"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((item, i) => (
            <button
              key={`${item.category}/${item.slug}`}
              onClick={() => navigate(item)}
              className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                i === selected
                  ? "bg-blue-50 text-blue-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">{item.title}</span>
              <span className="text-xs text-gray-400 ml-2 shrink-0">
                {item.categoryLabel}
              </span>
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-sm text-gray-500 text-center">
          No topics found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
