import { marked } from "marked";

type MarkdownBodyProps = {
  markdown: string;
  className?: string;
};

function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

export function markdownToHtml(markdown: string) {
  const html = marked.parse(markdown || "", { async: false }) as string;

  return sanitizeHtml(html);
}

export default function MarkdownBody({ markdown, className }: MarkdownBodyProps) {
  const html = markdownToHtml(markdown);
  if (!html.trim()) {
    return null;
  }

  return (
    <div
      className={
        className ??
        "text-sm leading-relaxed text-default-700 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-default-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-default-900 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-default-900 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-default-900 [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:text-default-900 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 print:leading-snug print:[&_h1]:mt-1 print:[&_h1]:text-[10.5pt] print:[&_h2]:mt-1 print:[&_h2]:text-[10.5pt] print:[&_h3]:mt-1 print:[&_h3]:text-[10pt] print:[&_ol]:my-0.5 print:[&_p]:my-0.5 print:[&_ul]:my-0.5"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
