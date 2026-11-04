import type { ReactNode } from "react";
import Link from "next/link";

import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { auth } from "@/auth";

import SignOutButton from "./SignOutButton";

export default async function AdminShell({
  title,
  backHref,
  children,
}: {
  title: string;
  backHref?: string;
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <main className="container py-28">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          {backHref ? (
            <Link
              href={backHref}
              className="mb-3 inline-flex items-center gap-2 text-sm text-default-300 transition-colors hover:text-white"
            >
              <IconifyIcon icon="lucide:arrow-left" className="h-4 w-4" />
              Dashboard
            </Link>
          ) : null}
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-default-300">
            {session?.user?.username
              ? `Signed in as ${session.user.username}`
              : "Signed in"}
          </p>
        </div>
        <SignOutButton />
      </div>
      {children}
    </main>
  );
}
