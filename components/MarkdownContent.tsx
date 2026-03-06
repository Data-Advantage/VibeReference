export default function MarkdownContent({ html }: { html: string }) {
  return (
    <article
      className="prose prose-gray max-w-none
        prose-headings:font-semibold
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-gray-900 prose-pre:text-gray-100
        prose-table:text-sm
        prose-th:bg-gray-50"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
