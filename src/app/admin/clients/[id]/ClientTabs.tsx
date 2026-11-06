import Link from "next/link";

export type ClientTab = "information" | "contract";

export default function ClientTabs({
  clientId,
  active,
}: {
  clientId: string;
  active: ClientTab;
}) {
  const tabs: { id: ClientTab; label: string; href: string }[] = [
    {
      id: "information",
      label: "Information",
      href: `/admin/clients/${clientId}`,
    },
    {
      id: "contract",
      label: "Contract",
      href: `/admin/clients/${clientId}?tab=contract`,
    },
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
