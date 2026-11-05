import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSessionUserId } from "@/lib/auth/require-user";
import { BlogServiceError, getOwnedBlog } from "@/lib/blog/service";

import AdminShell from "../../AdminShell";
import BlogForm from "../BlogForm";

export const metadata: Metadata = {
  title: "Edit post",
};

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await getSessionUserId();
  const { id } = await params;

  if (!userId || !id) {
    notFound();
  }

  try {
    const blog = await getOwnedBlog({ userId, id });

    return (
      <AdminShell title="Edit post" backHref="/admin/blog" backLabel="Blog">
        <BlogForm
          mode="edit"
          blog={{
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            contentMarkdown: blog.contentMarkdown,
            status: blog.status,
          }}
        />
      </AdminShell>
    );
  } catch (error) {
    if (error instanceof BlogServiceError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
