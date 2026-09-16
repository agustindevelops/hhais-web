import type { Metadata } from "next";
import Link from "next/link";
import { notFound, unauthorized } from "next/navigation";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import FormWrapper, { FormFieldValue } from "@/components/Form";
import { prisma } from "@/lib/prisma";

import { getEventBySlug } from "../data";


type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    passcode?: string;
  }>;
};

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const eventPage = getEventBySlug(slug);

  if (!eventPage) {
    return {
      title: "Event Not Found",
      description: "The event you requested does not exist.",
    };
  }

  return {
    title: eventPage.title,
    description: eventPage.shortDescription,
  };
}

export default async function EventPage({ params, searchParams }: EventPageProps) {
  const { slug } = await params;
  const { passcode } = await searchParams;
  const eventPage = getEventBySlug(slug);

  if (!eventPage) {
    notFound();
  }

  console.log(eventPage.requiredPasscode, passcode);
  if (eventPage.requiredPasscode && passcode !== eventPage.requiredPasscode) {
    unauthorized();
  }

  const currentEvent = eventPage;
  const { date, location } = currentEvent;
  const formName = currentEvent.survey.name ?? `${currentEvent.title} RSVP`;

  async function submitSurvey(values: Record<string, FormFieldValue>) {
    "use server";

    try {
      await prisma.form.create({
        data: {
          name: formName,
          questions: {
            create: currentEvent.survey.fields.map((field, index) => ({
              label: field.label,
              options: field.options ?? undefined,
              values: Array.isArray(values[field.name]) ? values[field.name] : undefined,
              type: field.type,
              answer: values[field.name],
              position: index,
            })),
          },
        },
      });

      return { ok: true };
    } catch (error) {
      console.error("Failed to submit survey", error);
      return { ok: false, error: "We could not save your response right now." };
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6">
      <Link
        href="/events"
        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        <IconifyIcon icon="lucide:arrow-left" className="h-4 w-4" /> Back to events
      </Link>

      <article className="mt-6 rounded-xl border border-default-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {eventPage.title}
        </h1>
        <p className="mt-4 text-default-700">{eventPage.longDescription}</p>
        <Details label="Date" value={[date]} />
        <Details label="Location" value={[
          location.name,
          location.address,
          `${location.city}, ${location.state} ${location.zip}`,
          location.country,
        ]} />
         <Details
          label="What to expect?"
          value={[
            <p className="mx-auto max-w-3xl mb-2">A structured startup-building experience with team planning, focused coding sessions,
                and a final launch/presentation moment</p>,
            <ul className="list-disc space-y-2 max-w-xl mx-auto text-lg" key="what-to-expect text-left">
              <li className="text-left">Food buffet and alcohol available throughout the day</li>
              <li className="text-left">Three beds and a couch available for resting</li>
              <li className="text-left">BYOB welcome</li>
              <li className="text-left">
                A structured startup-building experience with team planning, focused coding sessions,
                and a final launch/presentation moment
              </li>
            </ul>,
          ]}
        />

        <Details label="Or Join via Discord" value={[
          <Link href="https://discord.gg/CrpHkSJ8" target="_blank" className="text-primary hover:underline">Discord</Link>,
        ]} />
        <Details label="Itenary" value={[
          <h1 className="text-2xl font-semibold">Coming Soon</h1>,
          <span className="text-sm text-default-700">We'll be updating the itenary as we get closer to the event.</span>
        ]} />
        <div className="mt-8">
          <FormWrapper
            title="RSVP Form"
            submitLabel="RSVP"
            fields={currentEvent.survey.fields}
            submitAction={submitSurvey}
          />
        </div>

      </article>
    </main>
  );
}

const Details = ({label, value}: {label: string, value: string[] | React.ReactNode[]}) => {
  return (
    <section className="text-center text-2xl my-4">
      <dt className="text-base font-extrabold text-blue-950">{label}</dt>
      <div className="mb-1 font-semibold">
        {value.map((v, index) => (
          <div key={index}>{v}</div>
        ))}
      </div>
    </section>
  );
};
