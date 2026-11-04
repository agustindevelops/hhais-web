import { signOut } from "@/auth";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/auth/login" });
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-default-200 hover:bg-white/10"
      >
        Sign out
      </button>
    </form>
  );
}
