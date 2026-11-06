import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ContractDocument from "@/app/contract/ContractDocument";
import SignatureForm from "@/app/contract/SignatureForm";
import { projectTitle } from "@/app/admin/contract-status";
import { validateAccessToken } from "@/lib/client-access";
import { loadAdminContractDocument } from "@/lib/contract/persist";
import { prisma } from "@/lib/prisma";

import { ClientFrame } from "../../ClientTabs";
import { loadAdminClient } from "../../load-client";

type ContractPageProps = {
  params: Promise<{ clientId: string; contractId: string }>;
};

export async function generateMetadata({
  params,
}: ContractPageProps): Promise<Metadata> {
  const { clientId } = await params;
  const client = await loadAdminClient(clientId);

  return {
    title: client ? `${client.name} contract` : "Contract",
  };
}

export default async function ClientContractPage({ params }: ContractPageProps) {
  const { clientId, contractId } = await params;
  const [client, document] = await Promise.all([
    loadAdminClient(clientId),
    loadAdminContractDocument({ clientId, contractId }),
  ]);

  if (!client || !document) {
    notFound();
  }

  const latestToken = await prisma.clientAccessToken.findFirst({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    select: { token: true },
  });
  const access = await validateAccessToken(latestToken?.token);
  const showSignature = Boolean(access) && document.canSign;

  return (
    <ClientFrame clientId={client.id} clientName={client.name} active="contracts">
      <div className="space-y-4">
        <section className="rounded-2xl border border-white/10 bg-default-950/40 p-5 backdrop-blur-2xl">
          <h2 className="text-sm font-medium uppercase tracking-wide text-default-400">
            Linked projects
          </h2>
          {document.projects.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {document.projects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/admin/client/${project.clientId}/projects/${project.id}`}
                    className="inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-primary hover:text-primary"
                  >
                    {projectTitle(project.name)}
                    {project.clientId === client.id ? "" : ` · ${project.clientName}`}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
        <div className="rounded-2xl bg-zinc-100 p-4 text-zinc-900 sm:p-6">
          <ContractDocument
            snapshot={document.page.snapshot}
            exhibits={document.page.exhibits}
            contract={document.page.contract}
            token={document.page.snapshot.token}
            signatureActions={
              showSignature ? <SignatureForm page={document.page} /> : undefined
            }
          />
        </div>
      </div>
    </ClientFrame>
  );
}
