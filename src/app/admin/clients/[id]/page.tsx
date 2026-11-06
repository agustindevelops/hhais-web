import { redirect } from "next/navigation";

export default async function LegacyClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  if (tab === "contract") {
    redirect(`/admin/client/${id}/contracts`);
  }

  redirect(`/admin/client/${id}`);
}
