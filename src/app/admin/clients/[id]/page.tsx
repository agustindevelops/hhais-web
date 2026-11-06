import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AdminShell from "../../AdminShell";
import ClientTabs, { type ClientTab } from "./ClientTabs";
import ContractPanel from "./ContractPanel";
import InformationPanel from "./InformationPanel";
import { loadAdminClient } from "./load-client";

type ClientPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

function selectedTab(tab: string | undefined): ClientTab {
  return tab === "contract" ? "contract" : "information";
}

export async function generateMetadata({
  params,
}: ClientPageProps): Promise<Metadata> {
  const { id } = await params;
  const client = await loadAdminClient(id);

  return {
    title: client?.name || "Client",
  };
}

export default async function ClientPage({
  params,
  searchParams,
}: ClientPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const client = await loadAdminClient(id);

  if (!client) {
    notFound();
  }

  const active = selectedTab(tab);

  return (
    <AdminShell title={client.name} backHref="/admin/clients" backLabel="Clients">
      <ClientTabs clientId={client.id} active={active} />
      {active === "contract" ? (
        <ContractPanel client={client} />
      ) : (
        <InformationPanel client={client} />
      )}
    </AdminShell>
  );
}
