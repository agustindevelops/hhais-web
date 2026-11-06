import type { Metadata } from "next";

import { contractStatus, projectTitle } from "@/app/admin/contract-status";
import { prisma } from "@/lib/prisma";

import AdminShell from "../AdminShell";
import DataTable from "../DataTable";
import { formatDate } from "../format";

export const metadata: Metadata = {
  title: "Contracts",
};

export default async function ContractsPage() {
  const contracts = await prisma.contract.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      clientSignedAt: true,
      hhaisSignedAt: true,
      lockedAt: true,
      updatedAt: true,
      projects: {
        include: {
          project: {
            select: {
              name: true,
              business: {
                select: {
                  name: true,
                  clientId: true,
                  client: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <AdminShell title="Contracts" backHref="/admin">
      <DataTable
        columns={["Projects", "Client", "Business", "Status", "Updated"]}
        empty="No contracts yet."
        rows={contracts.map((contract) => {
          const projects = contract.projects.map((link) => link.project);
          const client = projects[0]?.business.client;
          const clientNames = [
            ...new Set(projects.map((project) => project.business.client.name)),
          ];
          const businessNames = [
            ...new Set(projects.map((project) => project.business.name)),
          ];

          return {
            id: contract.id,
            href: client
              ? `/admin/client/${client.id}/contract/${contract.id}`
              : undefined,
            cells: [
              projects.length > 0
                ? projects.map((project) => projectTitle(project.name)).join(", ")
                : "No projects",
              clientNames.length > 0 ? clientNames.join(", ") : "—",
              businessNames.length > 0 ? businessNames.join(", ") : "—",
              contractStatus(contract),
              formatDate(contract.updatedAt),
            ],
          };
        })}
      />
    </AdminShell>
  );
}
