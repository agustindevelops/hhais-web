import Link from "next/link";

import { eventPages } from "./data";

export const metadata = {
  title: "Events",
  description: "Browse upcoming events by Helping Hand AI.",
};

export default function EventsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 mt-8 ">
      <section className="space-y-5 text-white">
        <h1 className="text-4xl font-bold text-center tracking-tight">
          Upcoming Events
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-center">
          Discover what's happening at Helping Hand AI. Browse through our scheduled events below. Click on any event to learn more about the agenda, location, and how you can participate.
        </p>
      </section>


      <section className="mt-8 grid gap-4">
        {eventPages.map((eventPage) => (
          <article
            key={eventPage.slug}
            className="rounded-xl border border-default-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{eventPage.title}</h2>
            <p className="mt-2 text-default-600">{eventPage.shortDescription}</p>
            <div className="mt-4 text-center">
              <Link
                className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
                href={eventPage.route}
              >
                View event
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
