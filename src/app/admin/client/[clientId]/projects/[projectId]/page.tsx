import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  PROJECT_PRIORITY_LABELS,
  isProjectPriority,
} from "@/lib/intake/types";
import {
  contractStatus,
  projectProgress,
  projectTitle,
} from "@/app/admin/contract-status";

import { formatDate } from "../../../../format";
import { ClientFrame } from "../../ClientTabs";
import { loadAdminClient, loadClientProject } from "../../load-client";
import { DarkMarkdown, EmptyNote, Facts, Panel, formatFee, text } from "../../ui";

type ProjectPageProps = {
  params: Promise<{ clientId: string; projectId: string }>;
};

function priorityLabel(value: string, index: number) {
  const label = isProjectPriority(value)
    ? PROJECT_PRIORITY_LABELS[value]
    : value;
  return `${index + 1}. ${label}`;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { clientId, projectId } = await params;
  const project = await loadClientProject(clientId, projectId);

  return {
    title: project ? projectTitle(project.name) : "Project",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { clientId, projectId } = await params;
  const [client, project] = await Promise.all([
    loadAdminClient(clientId),
    loadClientProject(clientId, projectId),
  ]);

  if (!client || !project) {
    notFound();
  }

  const contracts = project.contracts.map((link) => link.contract);
  const progress = projectProgress({
    submittedAt: project.submittedAt,
    contracts,
  });

  return (
    <ClientFrame clientId={client.id} clientName={client.name} active="projects">
      <div className="space-y-4">
        <Panel title={projectTitle(project.name)}>
          <Facts
            items={[
              { label: "Progress", value: progress },
              { label: "Fee", value: formatFee(project.fee) },
              { label: "Payment plan", value: text(project.paymentPlan?.name) },
              {
                label: "Priorities",
                value:
                  project.priorities.length > 0
                    ? project.priorities
                        .map((priority, index) => priorityLabel(priority, index))
                        .join(", ")
                    : "—",
              },
              {
                label: "Submitted",
                value: project.submittedAt
                  ? formatDate(project.submittedAt)
                  : "Not submitted",
              },
              { label: "Updated", value: formatDate(project.updatedAt) },
              { label: "Features", value: String(project.features.length) },
              {
                label: "Integrations",
                value: String(project.integrations.length),
              },
              {
                label: "Attachments",
                value: String(project.attachments.length),
              },
            ]}
          />
          {project.paymentPlan?.description ? (
            <p className="mt-4 text-sm text-default-300">
              {project.paymentPlan.description}
            </p>
          ) : null}
          <div className="mt-4">
            <DarkMarkdown markdown={project.descriptionMarkdown} />
          </div>
          {project.additionalNotesMarkdown?.trim() ? (
            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-default-400">
                Notes
              </h3>
              <DarkMarkdown markdown={project.additionalNotesMarkdown} />
            </div>
          ) : null}
          {project.features.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-default-400">
                Features
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-white">
                {project.features.map((feature) => (
                  <li key={feature.id}>{text(feature.name)}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </Panel>

        <Panel title="Contracts">
          {contracts.length > 0 ? (
            <ul className="space-y-3">
              {contracts.map((contract) => (
                <li key={contract.id}>
                  <Link
                    href={`/admin/client/${client.id}/contract/${contract.id}`}
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                  >
                    Open contract · {contractStatus(contract)} ·{" "}
                    {formatDate(contract.updatedAt)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>No contracts are linked to this project.</EmptyNote>
          )}
        </Panel>
      </div>
    </ClientFrame>
  );
}
