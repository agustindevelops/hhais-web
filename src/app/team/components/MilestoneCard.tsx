import Link from "next/link";

import IconifyIcon from "@/components/wrappers/IconifyIcon";

import RichText from "./RichText";

type MilestoneCardProps = {
  index: number;
  era: string;
  title: string;
  summary: string;
  story: string[];
  bullets?: string[];
  skills: string[];
  cta?: { label: string; href: string };
  /** Which column the card sits in — drives side anchor + aos */
  side: "left" | "right";
  /** Show outbound connector anchor toward the next card */
  showOutbound?: boolean;
};

/**
 * Text milestone card (no embedded hero image).
 * Companion visuals live in the opposite column via MilestoneVisual.
 */
export default function MilestoneCard({
  index,
  era,
  title,
  summary,
  story,
  bullets,
  skills,
  cta,
  side,
  showOutbound = true,
}: MilestoneCardProps) {
  const isLeft = side === "left";
  const isExternalCta = Boolean(cta?.href && /^https?:\/\//i.test(cta.href));

  return (
    <article
      className="relative z-10 h-full"
      data-aos={isLeft ? "fade-right" : "fade-left"}
      data-aos-easing="ease"
      data-aos-duration={900}
    >
      {showOutbound ? (
        <div
          className={`pointer-events-none absolute top-1/2 z-20 hidden -translate-y-1/2 text-primary md:block ${
            isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
          }`}
          aria-hidden
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-default-950 shadow-[0_0_16px_rgba(22,163,74,0.45)]">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </span>
        </div>
      ) : null}

      {showOutbound ? (
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 translate-y-1/2 md:hidden"
          aria-hidden
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-default-950 text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </span>
        </div>
      ) : null}

      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-default-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/50 bg-primary/15 text-xs font-bold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="rounded-md bg-primary/20 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            {era}
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold text-white md:text-3xl">{title}</h3>
        <p className="mt-2 text-base font-medium text-primary/90">
          <RichText text={summary} />
        </p>

        {bullets?.length ? (
          <ul className="mt-5 space-y-3">
            {bullets.map((bullet, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm leading-relaxed text-default-200 sm:text-base"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>
                  <RichText text={bullet} />
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Reflection sits directly above skills (what those tags came from) */}
        {story.length ? (
          <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
            {story.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-default-200 sm:text-base">
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        ) : null}

        <ul className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-default-100 sm:text-sm"
            >
              {skill}
            </li>
          ))}
        </ul>

        {cta ? (
          <Link
            href={cta.href}
            {...(isExternalCta
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
          >
            <IconifyIcon
              icon={isExternalCta ? "lucide:external-link" : "lucide:arrow-right"}
              className="h-4 w-4"
            />
            {cta.label}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
