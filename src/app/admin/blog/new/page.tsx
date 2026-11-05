import type { Metadata } from "next";

import AdminShell from "../../AdminShell";
import BlogForm from "../BlogForm";

export const metadata: Metadata = {
  title: "New post",
};

export default function NewBlogPage() {
  return (
    <AdminShell title="New post" backHref="/admin/blog" backLabel="Blog">
      <BlogForm mode="create" />
    </AdminShell>
  );
}
