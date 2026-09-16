import type { Metadata } from "next";

import IntakeForm from "@/app/intake/IntakeForm";
import { loadIntakeSnapshot } from "@/lib/intake/persist";

type IntakePageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Intake",
  description: "Client intake information.",
};

const INVALID_MESSAGE = "This intake link is invalid or has expired.";

export default async function IntakePage({ searchParams }: IntakePageProps) {
  const { token } = await searchParams;
  const snapshot = await loadIntakeSnapshot(token);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6">
      <article className="space-y-6">
        <header className="rounded-xl border border-default-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Intake
          </h1>
          <p className="mt-2 text-sm text-default-600">
            Share your business, project, features, and integrations. Save as you
            go, then submit when you are ready for HHAIS review.
          </p>
        </header>
        {snapshot ? (
          <IntakeForm snapshot={snapshot} />
        ) : (
          <p className="rounded-xl border border-default-200 bg-white p-6 text-default-700 shadow-sm">
            {INVALID_MESSAGE}
          </p>
        )}
      </article>
    </main>
  );
}
