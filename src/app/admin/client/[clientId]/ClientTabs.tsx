import type { ReactNode } from "react";
import Link from "next/link";

import AdminShell from "../../AdminShell";

export type ClientTab = "information" | "projects" | "contracts";

export default function ClientTabs({
  clientId,
  active,
}: {
  clientId: string;
  active: ClientTab;
}) {
  const base = `/admin/client/${clientId}`;
  const tabs: { id: ClientTab; label: string; href: string }[] = [
    { id: "information", label: "Information", href: base },
    { id: "projects", label: "Projects", href: `${base}/projects` },
    { id: "contracts", label: "Contracts", href: `${base}/contracts` },
  ];

  return (
    <div className="mb-6 flex gap-1 border-b border-white/10">
      {tabs.map((tab) => {
        const selected = tab.id === active;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={selected ? "page" : undefined}
            className={
              selected
                ? "-mb-px border-b-2 border-primary px-4 py-3 text-sm font-medium text-white"
                : "-mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium text-default-400 transition-colors hover:text-white"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

export function ClientFrame({
  clientId,
  clientName,
  active,
  children,
}: {
  clientId: string;
  clientName: string;
  active: ClientTab;
  children: ReactNode;
}) {
  return (
    <AdminShell title={clientName} backHref="/admin/clients" backLabel="Clients">
      <ClientTabs clientId={clientId} active={active} />
      {children}
    </AdminShell>
  );
}
