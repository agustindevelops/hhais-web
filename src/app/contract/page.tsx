import type { Metadata } from "next";

import ContractDocument from "@/app/contract/ContractDocument";
import SignatureForm from "@/app/contract/SignatureForm";
import { loadContractPage } from "@/lib/contract/persist";

type ContractPageProps = {
  searchParams: Promise<{
    token?: string;
    admin?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Contract",
  description: "Project agreement based on client intake.",
};

const INVALID_MESSAGE = "This contract link is invalid or has expired.";

export default async function ContractPage({ searchParams }: ContractPageProps) {
  const { token, admin } = await searchParams;
  const isAdmin = admin === "true";
  const page = await loadContractPage(token, isAdmin);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <article className="space-y-6">
        {page ? (
          <ContractDocument
            snapshot={page.snapshot}
            exhibits={page.exhibits}
            contract={page.contract}
            token={page.snapshot.token}
            signatureActions={<SignatureForm page={page} />}
          />
        ) : (
          <>
            <header className="rounded-xl border border-default-200 bg-white p-6 shadow-sm">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Contract
              </h1>
            </header>
            <p className="rounded-xl border border-default-200 bg-white p-6 text-default-700 shadow-sm">
              {INVALID_MESSAGE}
            </p>
          </>
        )}
      </article>
    </main>
  );
}
