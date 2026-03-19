import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 — Page Not Found</h1>
      <p className="text-gray-500 mb-8">
        This page doesn&apos;t exist. Browse our reference articles below.
      </p>
      <Link
        href="/"
        className="inline-block text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-md transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
