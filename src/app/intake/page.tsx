import type { Metadata } from "next";

import { validateAccessToken } from "@/lib/client-access";

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
  const access = await validateAccessToken(token);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6">
      <article className="rounded-xl border border-default-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Intake
        </h1>
        {access ? (
          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-sm font-medium text-default-600">Name</dt>
              <dd className="mt-1 text-lg text-default-900">{access.client.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-default-600">Email</dt>
              <dd className="mt-1 text-lg text-default-900">
                {access.client.email}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-default-700">{INVALID_MESSAGE}</p>
        )}
      </article>
    </main>
  );
}
