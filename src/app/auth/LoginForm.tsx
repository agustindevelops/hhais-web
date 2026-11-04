"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import IconifyIcon from "@/components/wrappers/IconifyIcon";

const inputClassName =
  "block w-full rounded border-white/20 bg-white px-3 py-1.5 text-black placeholder:text-black/50 focus:border-primary focus:ring-transparent";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function revealPassword(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setShowPassword(true);
  }

  function hidePassword() {
    setShowPassword(false);
  }

  function holdWithKeyboard(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    setShowPassword(event.type === "keydown");
  }

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
        <div className="relative">
          <input
            className={`${inputClassName} pe-10`}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 end-0 flex items-center px-3 text-black/60 hover:text-black"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onPointerDown={revealPassword}
            onPointerUp={hidePassword}
            onPointerCancel={hidePassword}
            onLostPointerCapture={hidePassword}
            onKeyDown={holdWithKeyboard}
            onKeyUp={holdWithKeyboard}
            onBlur={hidePassword}
          >
            <IconifyIcon
              icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
              className="h-4 w-4"
            />
          </button>
        </div>
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
