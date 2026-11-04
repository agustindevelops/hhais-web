"use client";

import { useEffect } from "react";

export default function AuthBodyClass() {
  useEffect(() => {
    document.body.classList.add("bg-slate-900", "relative", "h-full");
    return () => {
      document.body.classList.remove("bg-slate-900", "relative", "h-full");
    };
  }, []);

  return null;
}
