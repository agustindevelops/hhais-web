import Image from "next/image";
import type { StaticImageData } from "next/image";

import type { MilestoneVisual as MilestoneVisualType } from "../data";
import ScatteredCollage from "./ScatteredCollage";

type MilestoneVisualProps = {
  visual: MilestoneVisualType;
  /** Match aos direction opposite the card for balance */
  side: "left" | "right";
  priority?: boolean;
};

function isStaticImage(src: StaticImageData | string): src is StaticImageData {
  return typeof src !== "string";
}

/** Companion visual column — stretches to match the milestone card height */
export default function MilestoneVisual({
  visual,
  side,
  priority = false,
}: MilestoneVisualProps) {
  const hasCollage = Boolean(visual.collage?.length);
  const contain = visual.fit === "contain";

  return (
    <figure
      className={`relative z-10 flex h-full min-h-full flex-col rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 ${
        hasCollage ? "overflow-visible" : "overflow-hidden"
      }`}
      data-aos={side === "left" ? "fade-right" : "fade-left"}
      data-aos-easing="ease"
      data-aos-duration={900}
    >
      {hasCollage ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-visible p-2 sm:p-3">
          <ScatteredCollage images={visual.collage!} priority={priority} />
        </div>
      ) : visual.src ? (
        <div
          className={
            contain
              ? "flex min-h-[16rem] flex-1 items-center justify-center bg-default-950/80 p-10 sm:min-h-[22rem] sm:p-14"
              : "relative min-h-[16rem] flex-1 sm:min-h-[22rem]"
          }
        >
          {contain ? (
            <Image
              src={visual.src}
              alt={visual.alt ?? ""}
              className="h-auto w-full max-w-[14rem] object-contain"
              priority={priority}
            />
          ) : isStaticImage(visual.src) ? (
            <Image
              src={visual.src}
              alt={visual.alt ?? ""}
              className="h-full w-full object-cover"
              priority={priority}
            />
          ) : (
            <Image
              src={visual.src}
              alt={visual.alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={priority}
            />
          )}
        </div>
      ) : null}

      {visual.caption ? (
        <figcaption className="mt-auto border-t border-white/10 px-4 py-3 text-sm text-default-300">
          {visual.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
