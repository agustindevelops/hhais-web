import Link from "next/link";

import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { cn } from "@/helpers/cn";

const tools = [
  {
    label: "Clients",
    href: "/admin/clients",
    icon: "lucide:users",
    disabled: false,
  },
  {
    label: "Contracts",
    href: "/admin/contracts",
    icon: "lucide:file-text",
    disabled: false,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: "lucide:newspaper",
    disabled: false,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: "lucide:folder-kanban",
    disabled: true,
  },
  {
    label: "Forms",
    href: "/admin/forms",
    icon: "lucide:clipboard-list",
    disabled: true,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: "lucide:wallet",
    disabled: true,
  },
] as const;

const idle =
  "border-white/10 bg-default-950/40 text-default-300";
const hovered =
  "hover:-translate-y-1 hover:border-primary hover:bg-primary/15 hover:text-white";
const clicked =
  "active:translate-y-0 active:scale-95 active:border-primary-hover active:bg-primary active:text-white";

export default function DashboardIcons() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {tools.map((tool) => {
        const className = cn(
          "group flex flex-col items-center gap-4 rounded-2xl border px-4 py-8 backdrop-blur-2xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          tool.disabled
            ? "cursor-not-allowed border-white/5 bg-default-950/20 text-default-500 opacity-40"
            : cn(idle, hovered, clicked),
        );
        const icon = (
          <span
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-150",
              tool.disabled
                ? "bg-white/5 text-default-500"
                : "bg-white/5 text-primary group-hover:bg-primary/20 group-active:bg-white/20 group-active:text-white",
            )}
          >
            <IconifyIcon icon={tool.icon} className="h-8 w-8" />
          </span>
        );
        const label = <span className="text-base font-semibold">{tool.label}</span>;

        if (tool.disabled) {
          return (
            <div
              key={tool.label}
              className={className}
              aria-disabled="true"
              title={`${tool.label} is not available yet`}
            >
              {icon}
              {label}
            </div>
          );
        }

        return (
          <Link key={tool.href} href={tool.href} className={className}>
            {icon}
            {label}
          </Link>
        );
      })}
    </div>
  );
}
