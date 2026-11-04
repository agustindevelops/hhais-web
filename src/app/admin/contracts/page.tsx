import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";

import AdminShell from "../AdminShell";
import DataTable from "../DataTable";
import { formatDate } from "../format";

export const metadata: Metadata = {
  title: "Contracts",
};

function contractStatus(contract: {
  clientSignedAt: Date | null;
  hhaisSignedAt: Date | null;
  lockedAt: Date | null;
}) {
  if (contract.lockedAt) {
    return "Locked";
  }
  if (contract.clientSignedAt && contract.hhaisSignedAt) {
    return "Signed";
  }
  if (contract.clientSignedAt) {
    return "Client signed";
  }
  if (contract.hhaisSignedAt) {
    return "HHAIS signed";
  }
  return "Draft";
}

export default async function ContractsPage() {
  const contracts = await prisma.contract.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      clientSignedAt: true,
      hhaisSignedAt: true,
      lockedAt: true,
      updatedAt: true,
      project: {
        select: {
          name: true,
          business: {
            select: {
              name: true,
              client: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return (
    <AdminShell title="Contracts" backHref="/admin">
      <DataTable
        columns={["Project", "Client", "Business", "Status", "Updated"]}
        empty="No contracts yet."
        rows={contracts.map((contract) => ({
          id: contract.id,
          cells: [
            contract.project.name || "Untitled project",
            contract.project.business.client.name,
            contract.project.business.name,
            contractStatus(contract),
            formatDate(contract.updatedAt),
          ],
        }))}
      />
    </AdminShell>
  );
}
