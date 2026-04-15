"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Category = { slug: string; label: string };

export default function MoreDropdown({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative group">
      <button
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="More categories"
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap"
      >
        More
      </button>
      <div
        className={`absolute right-0 top-full pt-1 ${open ? "block" : "hidden group-hover:block"}`}
      >
        <ul className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px] list-none m-0 p-0">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
