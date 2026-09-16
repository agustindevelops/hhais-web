import {
  getMilestoneCardSide,
  type LifeMilestone,
} from "../data";
import CardConnector from "./CardConnector";
import MilestoneCard from "./MilestoneCard";
import MilestoneVisual from "./MilestoneVisual";

type LifeTimelineProps = {
  milestones: LifeMilestone[];
};

/**
 * Masonry-style 2-column timeline:
 * - Even rows:  [Card] [Image]
 * - Odd rows:   [Image] [Card]
 * - SVG connects cards: col-1 right side ↔ col-2 left side
 */
export default function LifeTimeline({ milestones }: LifeTimelineProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6">
      {milestones.map((milestone, index) => {
        const side = getMilestoneCardSide(index);
        const isLast = index === milestones.length - 1;
        const cardOnLeft = side === "left";

        const card = (
          <MilestoneCard
            index={index}
            era={milestone.era}
            title={milestone.title}
            summary={milestone.summary}
            story={milestone.story}
            bullets={milestone.bullets}
            skills={milestone.skills}
            cta={milestone.cta}
            side={side}
            showOutbound={!isLast}
          />
        );

        const visual = (
          <MilestoneVisual
            visual={milestone.visual}
            side={cardOnLeft ? "right" : "left"}
            priority={index === 0}
          />
        );

        return (
          <div key={milestone.id} className="flex flex-col">
            {/* Content column wider; image/collage column narrower */}
            <div
              className={`grid grid-cols-1 items-stretch gap-6 md:gap-8 lg:gap-10 ${
                cardOnLeft
                  ? "md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]"
                  : "md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]"
              }`}
            >
              {cardOnLeft ? (
                <>
                  {card}
                  {visual}
                </>
              ) : (
                <>
                  {visual}
                  {card}
                </>
              )}
            </div>

            {!isLast ? <CardConnector from={side} /> : null}
          </div>
        );
      })}
    </div>
  );
}
