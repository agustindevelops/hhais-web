import IconifyIcon from "@/components/wrappers/IconifyIcon";

import SignOutButton from "./SignOutButton";
import { auth } from "@/auth";

const tools = [
  { label: "Clients", icon: "lucide:users" },
  { label: "Contracts", icon: "lucide:file-text" },
  { label: "Blogs", icon: "lucide:newspaper" },
];

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="container py-28">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Admin</h1>
          <p className="mt-2 text-default-300">
            {session?.user?.username
              ? `Signed in as ${session.user.username}`
              : "Signed in"}
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.label}
            className="rounded-2xl bg-default-950/40 p-6 text-center backdrop-blur-2xl"
          >
            <IconifyIcon
              icon={tool.icon}
              className="mx-auto mb-3 h-10 w-10 text-primary"
            />
            <p className="text-lg font-semibold text-white">{tool.label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
