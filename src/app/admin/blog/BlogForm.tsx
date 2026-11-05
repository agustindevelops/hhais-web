"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import MarkdownEditor from "@/app/intake/components/MarkdownEditor";
import { slugify } from "@/lib/blog/slug";

const fieldClass =
  "block w-full rounded-lg border border-white/10 bg-default-950/60 px-3 py-2 text-sm text-white outline-none transition placeholder:text-default-500 focus:border-primary focus:ring-2 focus:ring-primary/30";

const labelClass = "text-sm font-medium text-white";

export type BlogFormValues = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  status: string;
};

type BlogFormProps = {
  mode: "create" | "edit";
  blog?: BlogFormValues;
};

export default function BlogForm({ mode, blog }: BlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(blog?.title ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [contentMarkdown, setContentMarkdown] = useState(
    blog?.contentMarkdown ?? "",
  );
  const [status, setStatus] = useState(
    blog?.status === "published" ? "published" : "draft",
  );
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const save = async () => {
    setBusy("save");
    setError(null);
    setStatusMessage(null);

    const payload = {
      title,
      slug: slugify(slug || title),
      excerpt,
      content_markdown: contentMarkdown,
      status,
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/blog" : `/api/blog/${blog?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const body = (await response.json().catch(() => null)) as
        | { id?: string; message?: string; slug?: string }
        | null;

      if (!response.ok || !body?.id) {
        setError(body?.message || "Could not save this post.");
        return;
      }

      if (mode === "create") {
        router.push(`/admin/blog/${body.id}`);
        router.refresh();
        return;
      }

      setSlug(body.slug || payload.slug);
      setStatusMessage("Saved.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this post.");
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!blog?.id) {
      return;
    }
    if (!window.confirm("Delete this post? This cannot be undone.")) {
      return;
    }

    setBusy("delete");
    setError(null);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/blog/${blog.id}`, { method: "DELETE" });
      const body = (await response.json().catch(() => null)) as
        | { deleted?: boolean; message?: string }
        | null;

      if (!response.ok || !body?.deleted) {
        setError(body?.message || "Could not delete this post.");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete this post.",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <form
      className="max-w-3xl space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!busy) {
          void save();
        }
      }}
    >
      <div className="space-y-2">
        <label htmlFor="blog-title" className={labelClass}>
          Title
        </label>
        <input
          id="blog-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          required
          maxLength={160}
          className={fieldClass}
          placeholder="Post title"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="blog-slug" className={labelClass}>
          Slug
        </label>
        <input
          id="blog-slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          onBlur={() => setSlug((current) => slugify(current))}
          required
          maxLength={80}
          className={fieldClass}
          placeholder="post-title"
        />
        <p className="text-xs text-default-400">
          Unique among your posts. Letters, numbers, and hyphens.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="blog-excerpt" className={labelClass}>
          Excerpt
        </label>
        <textarea
          id="blog-excerpt"
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          maxLength={300}
          rows={3}
          className={fieldClass}
          placeholder="Short summary"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="blog-content" className={labelClass}>
          Content
        </label>
        <MarkdownEditor
          id="blog-content"
          value={contentMarkdown}
          onChange={setContentMarkdown}
          placeholder="Write the post"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="blog-status" className={labelClass}>
          Status
        </label>
        <select
          id="blog-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={fieldClass}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {statusMessage ? (
        <p className="text-sm text-default-300">{statusMessage}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        {mode === "edit" ? (
          <button
            type="button"
            onClick={() => void remove()}
            disabled={busy !== null}
            className="rounded-lg border border-red-400/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            {busy === "delete" ? "Deleting…" : "Delete"}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={busy !== null}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {busy === "save"
            ? "Saving…"
            : mode === "create"
              ? "Create post"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
