import type { Metadata } from "next";
import Link from "next/link";

import { getSessionUserId } from "@/lib/auth/require-user";
import { listOwnedExperiences } from "@/lib/experience/service";

import AdminShell from "../AdminShell";
import DataTable from "../DataTable";

export const metadata: Metadata = {
  title: "Experience",
};

export default async function ExperiencePage() {
  const userId = await getSessionUserId();
  const experiences = userId ? await listOwnedExperiences(userId) : [];

  return (
    <AdminShell title="Experience" backHref="/admin">
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/experience/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          New experience
        </Link>
      </div>
      <DataTable
        columns={["Role", "Company", "Dates"]}
        empty="No experience yet."
        rows={experiences.map((experience) => ({
          id: experience.id,
          href: `/admin/experience/${experience.id}`,
          cells: [experience.role, experience.company, experience.dates],
        }))}
      />
    </AdminShell>
  );
}
