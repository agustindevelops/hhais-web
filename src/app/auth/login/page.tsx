import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "../LoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Login() {
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-default-950/40 p-10 backdrop-blur-2xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Admin login</h1>
      <p className="mb-8 text-default-300">Sign in with your username and password.</p>
      <Suspense fallback={<p className="text-default-300">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
