"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const inputClassName =
  "block w-full rounded border-white/20 bg-white px-3 py-1.5 text-black placeholder:text-black/50 focus:border-primary focus:ring-transparent";

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
    <form onSubmit={handleSubmit} className="text-start">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="mb-2 block text-base/normal font-semibold text-default-200"
        >
          Username
        </label>
        <input
          className={inputClassName}
          type="text"
          id="username"
          name="username"
          required
          autoComplete="username"
          placeholder="Enter your username"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="mb-2 block text-base/normal font-semibold text-default-200"
        >
          Password
        </label>
        <input
          className={inputClassName}
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </div>
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
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
