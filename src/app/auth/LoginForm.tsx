"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { PasswordField, TextField } from "@/components/fields";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      redirectTo: callbackUrl,
    });

    setPending(false);

    if (!result || result.error) {
      setError("Invalid username or password.");
      return;
    }

    window.location.assign(result.url || callbackUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-start">
      <TextField
        id="username"
        name="username"
        label="Username"
        type="text"
        required
        autoComplete="username"
        placeholder="Enter your username"
      />
      <PasswordField
        id="password"
        name="password"
        label="Password"
        required
        autoComplete="current-password"
        placeholder="Enter your password"
        reveal="hold"
      />
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="hover:bg-primary-600 group mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary-600/90 px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
