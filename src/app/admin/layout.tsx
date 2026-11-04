import type { Metadata } from "next";

import type { ChildrenType } from "@/types/other";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: ChildrenType) {
  return children;
}
