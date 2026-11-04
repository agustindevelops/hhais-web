import type { Metadata } from "next";

import { currentYear } from "@/common/constants";
import Background2 from "@/components/Background2";
import type { ChildrenType } from "@/types/other";

import AuthBodyClass from "./AuthBodyClass";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: ChildrenType) {
  return (
    <>
      <AuthBodyClass />
      <Background2 />
      <section className="flex w-full items-center px-0 py-6 lg:h-screen lg:p-10">
        <div className="container">{children}</div>
      </section>
      <footer className="bottom-0 start-0 end-0 py-3 2xl:fixed">
        <div className="container">
          <p className="text-center text-base font-medium text-default-200">
            {currentYear} © Helping Hand AI Solutions
          </p>
        </div>
      </footer>
    </>
  );
}
