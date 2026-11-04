import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";

import AdminShell from "../AdminShell";
import DataTable from "../DataTable";
import { formatDate } from "../format";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      business: { select: { name: true } },
    },
  });

  return (
    <AdminShell title="Clients" backHref="/admin">
      <DataTable
        columns={["Name", "Email", "Business", "Created"]}
        empty="No clients yet."
        rows={clients.map((client) => ({
          id: client.id,
          cells: [
            client.name,
            client.email,
            client.business?.name || "—",
            formatDate(client.createdAt),
          ],
        }))}
      />
    </AdminShell>
  );
}
