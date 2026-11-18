import type { Metadata } from "next";

import Scheduler from "./Scheduler";

export const metadata: Metadata = {
  title: "Free consultation",
  description: "Book a free consultation on an open time.",
};

export default function ConsultationPage() {
  return (
    <section className="container py-28">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-white">Free consultation</h1>
        <p className="mt-3 text-default-300">
          Pick an open time. Hours already booked on the calendar stay closed.
        </p>
        <div className="mt-8">
          <Scheduler />
        </div>
      </div>
    </section>
  );
}
