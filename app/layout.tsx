import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SECTIONS } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "VibeReference",
  description:
    "Build your SaaS business in just one week — no coding required. A reference for solo founders navigating the AI-powered tech stack.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
            <Link
              href="/"
              className="font-semibold text-gray-900 hover:text-gray-600 transition-colors"
            >
              VibeReference
            </Link>
            <nav className="flex items-center gap-1 overflow-x-auto">
              {SECTIONS.map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="text-sm text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {s.day ? `Day ${s.day}` : s.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-gray-100 mt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-gray-400">
            Built by{" "}
            <a
              href="https://www.buildadataadvantage.com"
              className="hover:text-gray-600 transition-colors"
            >
              Data Advantage
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
