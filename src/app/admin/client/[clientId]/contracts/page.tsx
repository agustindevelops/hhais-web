import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { contractStatus, projectTitle } from "@/app/admin/contract-status";

import DataTable from "../../../DataTable";
import { formatDate } from "../../../format";
import { ClientFrame } from "../ClientTabs";
import { loadAdminClient, loadClientContracts } from "../load-client";

type ContractsPageProps = {
  params: Promise<{ clientId: string }>;
};

export const metadata: Metadata = {
  title: "Contracts",
};

export default async function ClientContractsPage({ params }: ContractsPageProps) {
  const { clientId } = await params;
  const client = await loadAdminClient(clientId);

  if (!client) {
    notFound();
  }

  const contracts = await loadClientContracts(clientId);

  return (
    <ClientFrame clientId={client.id} clientName={client.name} active="contracts">
      <DataTable
        columns={["Projects", "Status", "Updated"]}
        empty="No contracts yet."
        rows={contracts.map((contract) => {
          const names = contract.projects.map((link) =>
            projectTitle(link.project.name),
          );

          return {
            id: contract.id,
            href: `/admin/client/${client.id}/contract/${contract.id}`,
            cells: [
              names.length > 0 ? names.join(", ") : "No projects",
              contractStatus(contract),
              formatDate(contract.updatedAt),
            ],
          };
        })}
      />
    </ClientFrame>
  );
}
