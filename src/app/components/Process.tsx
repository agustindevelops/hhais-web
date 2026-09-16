import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ButtonCTA from "@/components/ButtonCTA";
import Image, { StaticImageData } from "next/image";
import step1Img from "@/assets/images/process/process-step-1.png";
import step2Img from "@/assets/images/process/process-step-2.png";
import step3Img from "@/assets/images/process/process-step-3.png";
import step4Img from "@/assets/images/process/process-step-4.png";
import step5Img from "@/assets/images/process/process-step-5.png";

export type ProcessType = {
  title: string;
  description: string;
  icon?: string;
  image: StaticImageData;
  imageLeft: boolean;
  badge: string;
  hasCTA?: boolean;
};

const processSteps: ProcessType[] = [
  {
    title: "Discover",
    description:
      "It starts with a free consultation where we learn your pain points and goals. With AI-driven audits and human expertise, we identify the most critical needs and opportunities—laying the foundation for a focused MVP or software solution that solves your problem.",
    icon: "lucide:search",
    image: step1Img,
    imageLeft: false,
    badge: "Step 1",
    hasCTA: true,
  },
  {
    title: "Define",
    description:
      "We translate discovery into a clear, actionable roadmap. Together, we set priorities, milestones, and success metrics—so you know exactly what will be built, when to expect it, and how we’ll measure progress toward your MVP or software solution.",
    icon: "lucide:list-checks",
    image: step2Img,
    imageLeft: true,
    badge: "Step 2",
  },
  {
    title: "Design",
    description:
      "We use AI-powered design tools to generate fast, smart prototypes—giving you more options, faster. Our team then refines every detail for usability, quality, and brand alignment, delivering designs that move fast without compromising on quality.",
    icon: "lucide:layout-dashboard",
    image: step3Img,
    imageLeft: false,
    badge: "Step 3",
  },
  {
    title: "Develop",
    description:
      "We combine AI-driven development with expert engineering to turn designs into secure, scalable software. Our approach blends the speed of AI tools with the precision of human expertise—delivering reliable solutions, faster.",
    icon: "lucide:cpu",
    image: step4Img,
    imageLeft: true,
    badge: "Step 4",
  },
  {
    title: "Deliver",
    description:
      "Launch with confidence. Our AI-assisted QA ensures a smooth, bug-free release, while ongoing expert support keeps your product evolving, optimized, and ready for whatever comes next.",
    icon: "lucide:rocket",
    image: step5Img,
    imageLeft: false,
    badge: "Step 5",
  },
];

const ProcessSection = () => {
  return (
    <section id="our-process" className="py-14 bg-default-950/80">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Our Process: <span className="text-primary">From Idea to Product</span>
        </h2>
        <div className="space-y-20">
          {processSteps.map((step) => (
            <ProcessCard {...step} key={step.title} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessCard = (step: ProcessType) => {
  return (
    <div
      className={`grid md:grid-cols-2 gap-8 items-center ${step.imageLeft ? "md:flex-row-reverse" : ""}`}
    >
      <div
        className={`${step.imageLeft ? "md:order-2" : ""} flex justify-center`}
        data-aos={step.imageLeft ? "fade-left" : "fade-right"}
        data-aos-easing="ease"
        data-aos-duration={1000}
      >
        <Image
          src={step.image}
          className="h-full w-full max-w-md rounded-xl shadow-lg"
          alt={`${step.title} illustration`}
        />
      </div>
      <div
        className={`${step.imageLeft ? "md:order-1" : ""}`}
        data-aos={step.imageLeft ? "fade-right" : "fade-left"}
        data-aos-easing="ease"
        data-aos-duration={1000}
      >
        <span className="inline-flex items-center gap-2 py-1 px-3 rounded-md text-sm font-medium uppercase tracking-wider text-primary bg-primary/20 mb-2">
          {step.icon && <IconifyIcon icon={step.icon} className="h-5 w-5" />}
          {step.badge}
        </span>
        <h3 className="text-2xl md:text-4xl font-semibold text-primary mt-2 mb-4 brightness-125">
          {step.title}
        </h3>
        <p className="text-base md:text-lg font-medium text-default-200 mb-6">
          {step.description}
        </p>
        {step.hasCTA ? (
          <div className="flex flex-wrap items-center gap-6 mt-10">
            <ButtonCTA/>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProcessSection;
