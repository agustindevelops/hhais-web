import type { ReactNode } from "react";

import MarkdownBody from "@/app/contract/MarkdownBody";

const markdownClassName =
  "text-sm leading-relaxed text-default-200 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_blockquote]:italic [&_h1]:mt-3 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-white [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-3 [&_h3]:font-semibold [&_h3]:text-white [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:text-white [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5";

export function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

export function formatFee(value: { toString(): string } | null) {
  if (!value) {
    return "—";
  }

  const amount = Number(value.toString());
  if (!Number.isFinite(amount)) {
    return value.toString();
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function websiteHref(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-default-950/40 p-5 backdrop-blur-2xl">
      <h2 className="text-sm font-medium uppercase tracking-wide text-default-400">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Facts({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs text-default-400">{item.label}</dt>
          <dd className="mt-1 text-sm break-words text-white">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="text-sm text-default-400">{children}</p>;
}

export function DarkMarkdown({ markdown }: { markdown: string }) {
  const trimmed = markdown.trim();
  if (!trimmed) {
    return null;
  }

  return <MarkdownBody markdown={trimmed} className={markdownClassName} />;
}
