"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import MarkdownEditor from "@/app/intake/components/MarkdownEditor";
import { Field, SelectField, TextAreaField, TextField } from "@/components/fields";
import { slugify } from "@/lib/blog/slug";

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
      <TextField
        id="blog-title"
        label="Title"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        required
        maxLength={160}
        placeholder="Post title"
      />

      <TextField
        id="blog-slug"
        label="Slug"
        value={slug}
        onChange={(event) => {
          setSlugTouched(true);
          setSlug(event.target.value);
        }}
        onBlur={() => setSlug((current) => slugify(current))}
        required
        maxLength={80}
        placeholder="post-title"
        hint="Use letters, numbers, and hyphens. Each post needs its own slug."
      />

      <TextAreaField
        id="blog-excerpt"
        label="Excerpt"
        value={excerpt}
        onChange={(event) => setExcerpt(event.target.value)}
        maxLength={300}
        rows={3}
        placeholder="Short summary"
      />

      <Field id="blog-content" label="Content">
        {({ id }) => (
          <MarkdownEditor
            id={id}
            value={contentMarkdown}
            onChange={setContentMarkdown}
            placeholder="Write the post"
          />
        )}
      </Field>

      <SelectField
        id="blog-status"
        label="Status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </SelectField>

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
