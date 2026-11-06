import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { projectProgress, projectTitle } from "@/app/admin/contract-status";

import DataTable from "../../../DataTable";
import { formatDate } from "../../../format";
import { ClientFrame } from "../ClientTabs";
import { loadAdminClient, loadClientProjects } from "../load-client";
import { formatFee } from "../ui";

type ProjectsPageProps = {
  params: Promise<{ clientId: string }>;
};

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ClientProjectsPage({ params }: ProjectsPageProps) {
  const { clientId } = await params;
  const client = await loadAdminClient(clientId);

  if (!client) {
    notFound();
  }

  const projects = await loadClientProjects(clientId);

  return (
    <ClientFrame clientId={client.id} clientName={client.name} active="projects">
      <DataTable
        columns={["Project", "Progress", "Contracts", "Fee", "Updated"]}
        empty="No projects yet."
        rows={projects.map((project) => ({
          id: project.id,
          href: `/admin/client/${client.id}/projects/${project.id}`,
          cells: [
            projectTitle(project.name),
            projectProgress({
              submittedAt: project.submittedAt,
              contracts: project.contracts.map((link) => link.contract),
            }),
            project.contracts.length > 0
              ? String(project.contracts.length)
              : "None",
            formatFee(project.fee),
            formatDate(project.updatedAt),
          ],
        }))}
      />
    </ClientFrame>
  );
}
