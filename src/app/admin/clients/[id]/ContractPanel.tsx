import ContractDocument from "@/app/contract/ContractDocument";
import SignatureForm from "@/app/contract/SignatureForm";
import { loadAdminContractPage } from "@/lib/contract/persist";

import { formatDate } from "../../format";

import { activeAccessToken, type AdminClient } from "./load-client";
import { EmptyNote, Facts, Panel, formatFee, text } from "./ui";

function contractStatus(project: {
  submittedAt: Date | null;
  contract: {
    clientSignedAt: Date | null;
    hhaisSignedAt: Date | null;
    lockedAt: Date | null;
  } | null;
}) {
  if (!project.contract) {
    return project.submittedAt ? "Not started" : "Not submitted";
  }
  if (project.contract.lockedAt) {
    return "Locked";
  }
  if (project.contract.clientSignedAt && project.contract.hhaisSignedAt) {
    return "Signed";
  }
  if (project.contract.clientSignedAt) {
    return "Client signed";
  }
  if (project.contract.hhaisSignedAt) {
    return "HHAIS signed";
  }
  return "Draft";
}

function signedLine(name: string | null, signedAt: Date | null) {
  if (!signedAt) {
    return "Not signed";
  }
  const when = formatDate(signedAt);
  const signer = name?.trim();
  return signer ? `${signer} · ${when}` : when;
}

function ProjectContract({
  project,
  current,
}: {
  project: NonNullable<AdminClient["business"]>["projects"][number];
  current: boolean;
}) {
  const contract = project.contract;

  return (
    <Panel title={project.name.trim() || "Untitled project"}>
      <Facts
        items={[
          { label: "Status", value: contractStatus(project) },
          { label: "Fee", value: formatFee(project.fee) },
          { label: "Payment plan", value: text(project.paymentPlan?.name) },
          {
            label: "Client signature",
            value: signedLine(
              contract?.clientSignerName ?? null,
              contract?.clientSignedAt ?? null,
            ),
          },
          {
            label: "HHAIS signature",
            value: signedLine(
              contract?.hhaisSignerName ?? null,
              contract?.hhaisSignedAt ?? null,
            ),
          },
          {
            label: "Locked",
            value: contract?.lockedAt
              ? formatDate(contract.lockedAt)
              : "Not locked",
          },
          {
            label: "Updated",
            value: contract
              ? formatDate(contract.updatedAt)
              : formatDate(project.updatedAt),
          },
          { label: "Current agreement", value: current ? "Yes" : "No" },
        ]}
      />
    </Panel>
  );
}

export default async function ContractPanel({ client }: { client: AdminClient }) {
  const projects = client.business?.projects ?? [];
  const access = activeAccessToken(client);
  const page = await loadAdminContractPage(client.id);

  if (projects.length === 0) {
    return (
      <Panel title="Contract">
        <EmptyNote>This client does not have a project or a contract yet.</EmptyNote>
      </Panel>
    );
  }

  if (!page) {
    return (
      <div className="space-y-4">
        <EmptyNote>
          This client does not have a business, contact, and project yet, so
          there is no agreement to show.
        </EmptyNote>
        {projects.map((project, index) => (
          <ProjectContract key={project.id} project={project} current={index === 0} />
        ))}
      </div>
    );
  }

  const olderProjects = projects.slice(1);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-zinc-100 p-4 text-zinc-900 sm:p-6">
        <ContractDocument
          snapshot={page.snapshot}
          exhibits={page.exhibits}
          contract={page.contract}
          token={page.snapshot.token}
          signatureActions={
            access ? <SignatureForm page={page} /> : undefined
          }
        />
      </div>
      {olderProjects.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-default-400">
            The agreement above follows the latest project. Earlier projects are
            listed below.
          </p>
          {olderProjects.map((project) => (
            <ProjectContract key={project.id} project={project} current={false} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
