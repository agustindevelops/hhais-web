type CardConnectorProps = {
  /**
   * Which column the *current* card is in.
   * - left  → path leaves column-1 card (right side) → column-2 card (left side)
   * - right → path leaves column-2 card (left side) → column-1 card (right side)
   */
  from: "left" | "right";
};

/**
 * SVG behind the flow connecting cards only (not images).
 * Desktop: curved horizontal from col-1 right edge ↔ col-2 left edge
 * Mobile: vertical curve between stacked cards
 */
export default function CardConnector({ from }: CardConnectorProps) {
  const stroke = "currentColor";

  return (
    <div
      className="relative z-0 flex h-28 w-full items-stretch justify-center text-primary/70 md:h-32"
      aria-hidden
    >
      {/* Mobile — vertical */}
      <svg
        className="h-full w-12 shrink-0 md:hidden"
        viewBox="0 0 48 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M24 0 C 24 32, 8 48, 24 64 C 40 80, 24 96, 24 128"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M16 114 L24 128 L32 114"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Desktop — card side to card side across columns */}
      <svg
        className="hidden h-full w-full md:block"
        viewBox="0 0 1000 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {from === "left" ? (
          // Col 1 card (right side) → Col 2 card (left side)
          <>
            <path
              d="M 460 0 C 460 52, 540 52, 540 128"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 524 112 L 540 128 L 556 112"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="460" cy="0" r="5" fill={stroke} />
          </>
        ) : (
          // Col 2 card (left side) → Col 1 card (right side)
          <>
            <path
              d="M 540 0 C 540 52, 460 52, 460 128"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 444 112 L 460 128 L 476 112"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="540" cy="0" r="5" fill={stroke} />
          </>
        )}
      </svg>
    </div>
  );
}
