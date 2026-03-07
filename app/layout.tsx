import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { CATEGORIES } from "@/lib/directory";

export const metadata: Metadata = {
  title: {
    default: "VibeReference — The AI Development Directory",
    template: "%s — VibeReference",
  },
  description:
    "A curated directory of AI tools, frameworks, and techniques for building software with AI. Browse 150+ topics across AI models, development tools, cloud platforms, and more.",
  openGraph: {
    title: "VibeReference — The AI Development Directory",
    description:
      "A curated directory of AI tools, frameworks, and techniques for building software with AI.",
    type: "website",
    siteName: "VibeReference",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeReference — The AI Development Directory",
    description:
      "A curated directory of AI tools, frameworks, and techniques for building software with AI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <Link
                href="/"
                className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors tracking-tight"
              >
                VibeReference
              </Link>
              <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
                {CATEGORIES.slice(0, 6).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="text-sm text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    {c.label}
                  </Link>
                ))}
                <div className="relative group">
                  <button className="text-sm text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap">
                    More
                  </button>
                  <div className="absolute right-0 top-full pt-1 hidden group-hover:block">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px]">
                      {CATEGORIES.slice(6).map((c) => (
                        <Link
                          key={c.slug}
                          href={`/${c.slug}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-gray-200 bg-white mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              {CATEGORIES.map((c) => (
                <div key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {c.label}
                  </Link>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                Built by{" "}
                <a
                  href="https://www.buildadataadvantage.com"
                  className="hover:text-gray-600 transition-colors"
                >
                  Data Advantage
                </a>
              </p>
              <p className="text-sm text-gray-400">
                The AI development directory
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
