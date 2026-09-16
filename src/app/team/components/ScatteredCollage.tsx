"use client";

import Image from "next/image";

import type { MilestoneCollageImage } from "../data";

type ScatteredCollageProps = {
  images: MilestoneCollageImage[];
  priority?: boolean;
};

type Placement = {
  className: string;
  /** Width as percent of collage area */
  widthPct: number;
};

/** 1 item: fill the column */
const placementsOne: Placement[] = [
  { className: "left-[2%] top-[8%] rotate-[-3deg]", widthPct: 96 },
];

/** 1–2 items: oversized + vertically stacked to fill the column */
const placementsFew: Placement[] = [
  { className: "left-[-2%] top-[0%] rotate-[-6deg]", widthPct: 92 },
  { className: "right-[-4%] bottom-[0%] rotate-[7deg]", widthPct: 94 },
];

/** 3 items: spread top / mid / bottom */
const placementsThree: Placement[] = [
  { className: "left-[-2%] top-[-2%] rotate-[-5deg]", widthPct: 78 },
  { className: "right-[-4%] top-[28%] rotate-[8deg]", widthPct: 82 },
  { className: "left-[-2%] bottom-[-2%] rotate-[-4deg]", widthPct: 80 },
];

/** 4+ items: dense clutter pack */
const placementsMany: Placement[] = [
  { className: "left-[8%] top-[-2%] rotate-[-4deg]", widthPct: 72 },
  { className: "left-[-4%] top-[18%] rotate-[-9deg]", widthPct: 52 },
  { className: "right-[-4%] top-[14%] rotate-[8deg]", widthPct: 56 },
  { className: "left-[-2%] bottom-[8%] rotate-[5deg]", widthPct: 54 },
  { className: "right-[-3%] bottom-[4%] rotate-[-7deg]", widthPct: 58 },
  { className: "left-[18%] bottom-[-2%] rotate-[3deg]", widthPct: 60 },
];

function placementsForCount(count: number): Placement[] {
  if (count <= 1) return placementsOne;
  if (count === 2) return placementsFew;
  if (count === 3) return placementsThree;
  return placementsMany;
}

function parseAspectRatio(value?: string): number {
  if (!value) return 1;
  const parts = value.split("/").map((part) => Number(part.trim()));
  if (parts.length !== 2 || !parts[0] || !parts[1]) return 1;
  return parts[0] / parts[1];
}

/** Smaller visual area → higher z-index so tiny frames sit on top */
function zIndexForSize(widthPct: number, aspectRatio?: string): number {
  const ratio = parseAspectRatio(aspectRatio);
  const relativeArea = (widthPct * widthPct) / ratio;
  const z = Math.round(52 - relativeArea / 120);
  return Math.min(40, Math.max(10, z));
}

function CollageMedia({
  item,
  priority,
}: {
  item: MilestoneCollageImage;
  priority?: boolean;
}) {
  if (item.type === "video") {
    return (
      <video
        className="h-full w-full object-contain"
        src={item.src}
        poster={item.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={item.alt}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      sizes="(max-width: 768px) 55vw, 360px"
      className="object-contain"
      priority={priority}
    />
  );
}

/**
 * Scattered evidence collage — videos autoplay; media keeps original aspect ratio.
 * Fewer images scale up and spread vertically to fill the column.
 */
export default function ScatteredCollage({
  images,
  priority = false,
}: ScatteredCollageProps) {
  const layout = placementsForCount(images.length);
  const shots = images.slice(0, layout.length);

  return (
    <div className="relative min-h-[30rem] w-full flex-1 overflow-visible sm:min-h-[40rem]">
      {shots.map((item, index) => {
        const placement = layout[index] ?? layout[0];
        const zIndex = zIndexForSize(placement.widthPct, item.aspectRatio);

        return (
          <div
            key={item.src}
            className={`absolute overflow-hidden rounded-xl border border-white/15 bg-default-950/90 shadow-xl shadow-black/50 transition-transform duration-500 hover:!z-50 hover:rotate-0 hover:scale-[1.03] ${placement.className}`}
            style={{
              aspectRatio: item.aspectRatio ?? "1 / 1",
              width: `${placement.widthPct}%`,
              zIndex,
            }}
          >
            <CollageMedia item={item} priority={priority && index < 2} />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        );
      })}
    </div>
  );
}
