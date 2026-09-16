import Image from "next/image";
import Link from "next/link";

import ButtonCTA from "@/components/ButtonCTA";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

import LifeTimeline from "./components/LifeTimeline";
import { teamMembers } from "./data";

export const metadata = {
  title: "Team",
  description:
    "Agustin Manriquez Cruz’s life in milestones — from Tubular Services night shifts after graduation, through engineering and AI, to building Helping Hand AI Solutions.",
};

export default function TeamPage() {
  const member = teamMembers[0];

  return (
    <main className="pb-24 pt-24 text-white">
      <section className="relative overflow-hidden" data-aos="zoom-out" data-aos-duration={1000}>
        <div className="absolute inset-0">
          <Image
            src={member.heroBackground}
            alt=""
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-default-950/70 via-default-950/80 to-default-950" />
        </div>

        <div className="container relative z-10 py-16 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="relative mb-8 h-36 w-36 overflow-hidden rounded-full border-2 border-primary/60 shadow-2xl sm:h-44 sm:w-44">
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                sizes="176px"
                className="object-cover"
                priority
              />
            </div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              {member.role}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {member.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-default-200 md:text-xl">
              {member.tagline}
            </p>
            <p className="mt-4 max-w-xl text-base text-default-300">{member.intro}</p>
            <div className="mt-8 flex items-center gap-2 text-sm text-default-400">
              <IconifyIcon icon="lucide:arrow-down" className="h-4 w-4 animate-bounce" />
              Checkout my journey
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-6 md:mt-10">
        <LifeTimeline milestones={member.milestones} />
      </section>

      <section
        className="container mt-20"
        data-aos="fade-up"
        data-aos-easing="ease"
        data-aos-duration={1000}
      >
        <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm sm:p-12">
          <h2 className="text-2xl font-semibold md:text-3xl">What&apos;s next</h2>
          <p className="text-lg leading-relaxed text-default-200">{member.closing}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {member.links.map((link) =>
              link.href === "/consultation" ? (
                <ButtonCTA key={link.href} href={link.href} label={link.label} />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-2 text-white transition-all duration-300 hover:border-primary hover:bg-primary"
                >
                  <IconifyIcon icon="lucide:linkedin" className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
