export default function MarkdownContent({ html }: { html: string }) {
  return (
    <article
      className="prose prose-gray max-w-none
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h1:text-3xl prose-h1:mb-4
        prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2
        prose-h3:text-lg prose-h3:mt-8
        prose-p:leading-7 prose-p:text-gray-600
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg
        prose-table:text-sm prose-table:border prose-table:border-gray-200
        prose-th:bg-gray-50 prose-th:font-semibold
        prose-td:border prose-td:border-gray-200 prose-td:px-3 prose-td:py-2
        prose-th:border prose-th:border-gray-200 prose-th:px-3 prose-th:py-2
        prose-li:text-gray-600
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
