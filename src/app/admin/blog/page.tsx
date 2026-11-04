import type { Metadata } from "next";

import AdminShell from "../AdminShell";
import DataTable from "../DataTable";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <AdminShell title="Blog" backHref="/admin">
      <DataTable
        columns={["Title", "Status", "Updated"]}
        rows={[]}
        empty="No posts yet."
      />
    </AdminShell>
  );
}
