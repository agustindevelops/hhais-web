import type { Metadata } from "next";
import Link from "next/link";

import { getSessionUserId } from "@/lib/auth/require-user";
import { listOwnedBlogs } from "@/lib/blog/service";

import AdminShell from "../AdminShell";
import DataTable from "../DataTable";
import { formatDate } from "../format";

export const metadata: Metadata = {
  title: "Blog",
};

function statusLabel(status: string) {
  if (!status) {
    return "Draft";
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function BlogPage() {
  const userId = await getSessionUserId();
  const blogs = userId ? await listOwnedBlogs(userId) : [];

  return (
    <AdminShell title="Blog" backHref="/admin">
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          New post
        </Link>
      </div>
      <DataTable
        columns={["Title", "Status", "Updated"]}
        empty="No posts yet."
        rows={blogs.map((blog) => ({
          id: blog.id,
          href: `/admin/blog/${blog.id}`,
          cells: [blog.title, statusLabel(blog.status), formatDate(blog.updatedAt)],
        }))}
      />
    </AdminShell>
  );
}
