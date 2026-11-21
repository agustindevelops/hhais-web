import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSessionUserId } from "@/lib/auth/require-user";
import {
  ExperienceServiceError,
  getOwnedExperience,
} from "@/lib/experience/service";

import AdminShell from "../../AdminShell";
import ExperienceForm from "../ExperienceForm";

export const metadata: Metadata = {
  title: "Edit experience",
};

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await getSessionUserId();
  const { id } = await params;

  if (!userId || !id) {
    notFound();
  }

  try {
    const experience = await getOwnedExperience({ userId, id });

    return (
      <AdminShell
        title="Edit experience"
        backHref="/admin/experience"
        backLabel="Experience"
      >
        <ExperienceForm
          mode="edit"
          experience={{
            id: experience.id,
            role: experience.role,
            company: experience.company,
            url: experience.url,
            location: experience.location,
            dates: experience.dates,
            highlights: experience.highlights.join("\n"),
            sortOrder: String(experience.sortOrder),
          }}
        />
      </AdminShell>
    );
  } catch (error) {
    if (error instanceof ExperienceServiceError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
