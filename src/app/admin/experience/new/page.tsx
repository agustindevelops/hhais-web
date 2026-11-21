import type { Metadata } from "next";

import AdminShell from "../../AdminShell";
import ExperienceForm from "../ExperienceForm";

export const metadata: Metadata = {
  title: "New experience",
};

export default function NewExperiencePage() {
  return (
    <AdminShell
      title="New experience"
      backHref="/admin/experience"
      backLabel="Experience"
    >
      <ExperienceForm mode="create" />
    </AdminShell>
  );
}
