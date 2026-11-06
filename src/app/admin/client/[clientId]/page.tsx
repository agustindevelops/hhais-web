import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientFrame } from "./ClientTabs";
import InformationPanel from "./InformationPanel";
import { loadAdminClient } from "./load-client";

type ClientPageProps = {
  params: Promise<{ clientId: string }>;
};

export async function generateMetadata({
  params,
}: ClientPageProps): Promise<Metadata> {
  const { clientId } = await params;
  const client = await loadAdminClient(clientId);

  return {
    title: client?.name || "Client",
  };
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { clientId } = await params;
  const client = await loadAdminClient(clientId);

  if (!client) {
    notFound();
  }

  return (
    <ClientFrame clientId={client.id} clientName={client.name} active="information">
      <InformationPanel client={client} />
    </ClientFrame>
  );
}
