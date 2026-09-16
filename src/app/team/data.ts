import type { StaticImageData } from "next/image";

import { SOCIAL_LINKS } from "@/utils/links";

import heroAtmosphere from "@/assets/images/ai/img-3.jpg";

/** Single media item in a scattered collage (public/ paths) */
export type MilestoneCollageImage = {
  src: string;
  alt: string;
  /** image (default) or video */
  type?: "image" | "video";
  /** Preserve original framing, e.g. "16 / 9" or "3 / 4" */
  aspectRatio?: string;
  /** Optional poster frame for videos */
  poster?: string;
};

/**
 * Repeatable visual shape for the opposite column:
 * - `collage` → scattered multi-image evidence
 * - otherwise single `src` image
 */
export type MilestoneVisual = {
  caption?: string;
  src?: StaticImageData | string;
  alt?: string;
  fit?: "cover" | "contain";
  collage?: MilestoneCollageImage[];
};

/**
 * Repeatable milestone shape:
 * - Card content rendered as MilestoneCard
 * - Companion visual in the opposite column
 * - Layout side derived from index (even → card left, odd → card right)
 */
export type LifeMilestone = {
  id: string;
  era: string;
  title: string;
  summary: string;
  /** Opening / closing paragraphs */
  story: string[];
  /** Optional bullet evidence under the story */
  bullets?: string[];
  skills: string[];
  /** Optional outbound CTA (e.g. live project link) */
  cta?: { label: string; href: string };
  visual: MilestoneVisual;
};

export type TeamMember = {
  name: string;
  role: string;
  tagline: string;
  /** Public path or imported static image */
  avatar: StaticImageData | string;
  heroBackground: StaticImageData;
  intro: string;
  milestones: LifeMilestone[];
  closing: string;
  links: { label: string; href: string }[];
};

/** Even index → card in column 1; odd index → card in column 2 */
export function getMilestoneCardSide(index: number): "left" | "right" {
  return index % 2 === 0 ? "left" : "right";
}

const factoryCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/01-factory-bay.jpg",
    alt: "Looking out from the Tubular Services shop bay toward stacks of industrial pipe in the yard",
    aspectRatio: "16 / 9",
  },
  {
    src: "/img/team/agustin/01-hardhat-shift.jpg",
    alt: "Agustin on the factory floor at Tubular Services wearing a yellow hard hat",
    aspectRatio: "3 / 4",
  },
  {
    src: "/img/team/agustin/01-tubular-pipes.jpg",
    alt: "Industrial tubular pipes marked for quality control on the factory floor",
    aspectRatio: "9 / 16",
  },
  {
    src: "/img/team/agustin/01-floor-break.jpg",
    alt: "Taking a break on the concrete factory floor after a long shift",
    aspectRatio: "3 / 4",
  },
  {
    src: "/img/team/agustin/01-shift-4am.jpg",
    alt: "End of a night shift at 4:12 AM — Day 15 at work",
    aspectRatio: "9 / 16",
  },
];

const engineeringCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/02-ti-launchpad.jpg",
    alt: "Texas Instruments CC3200 LaunchPad from a TI-sponsored engineering course",
    aspectRatio: "3 / 4",
  },
  {
    src: "/img/team/agustin/02-rc-car-build.jpg",
    alt: "Custom RC car build with microcontroller, motor driver, and wiring",
    aspectRatio: "16 / 9",
  },
  {
    src: "/img/team/agustin/02-mindstorms-demo.mp4",
    alt: "Programmable Mindstorms robot project — hardware, sensors, and code in action",
    type: "video",
    aspectRatio: "16 / 9",
    poster: "/img/team/agustin/02-mindstorms-robot.jpg",
  },
  {
    src: "/img/team/agustin/02-civil-coursework.jpg",
    alt: "Civil engineering coursework including Engineering Math, Statics, and Design",
    aspectRatio: "4 / 3",
  },
  {
    src: "/img/team/agustin/02-diff-eq-notes.jpg",
    alt: "Handwritten differential equations notes — integrating factor method",
    aspectRatio: "4 / 3",
  },
  {
    src: "/img/team/agustin/02-gis-lidar.jpg",
    alt: "GIS LiDAR availability layer in civil mapping software",
    aspectRatio: "3 / 4",
  },
];

const pressureCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/03-ims-vest.jpg",
    alt: "Agustin in a Texas A&M Instructional Media Services vest",
    aspectRatio: "3 / 4",
  },
  {
    src: "/img/team/agustin/03-lecture-hall.jpg",
    alt: "Empty lecture hall from the front — classroom AV support environment",
    aspectRatio: "3 / 4",
  },
];

const internshipCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/04-rchi-internship.jpg",
    alt: "Working from a hybrid home office during the RCHI software development internship",
    aspectRatio: "4 / 3",
  },
];

const mePicnicsCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/05-mepicnics-site.jpg",
    alt: "M.E. Picnics customer website on mobile — Book the Picnic of Your Dreams",
    aspectRatio: "9 / 16",
  },
  {
    src: "/img/team/agustin/05-picnic-valentine.jpg",
    alt: "Indoor Valentine’s picnic setup with rose-gold chargers, gifts, and string lights",
    aspectRatio: "4 / 3",
  },
  {
    src: "/img/team/agustin/05-picnic-setup.jpg",
    alt: "Styled outdoor picnic with emerald pillows, copper chargers, and a picnic basket",
    aspectRatio: "3 / 4",
  },
  {
    src: "/img/team/agustin/05-picnic-demo.mp4",
    alt: "M.E. Picnics one-year anniversary setup with teepee and letter board",
    type: "video",
    aspectRatio: "3 / 4",
    poster: "/img/team/agustin/05-picnic-demo-poster.jpg",
  },
];

const marketingForChangeCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/06-behavioral-framework.jpg",
    alt: "The Behavioral Determinants Framework interactive graphic — Fun, Easy, and Popular",
    aspectRatio: "1 / 1",
  },
];

const bidftaCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/07-bidfta-architecture.jpg",
    alt: "BIDFTA system architecture — categorization, auth, AI, and auction flow",
    aspectRatio: "16 / 10",
  },
  {
    src: "/img/team/agustin/07-bidfta-team-testing.jpg",
    alt: "Team in the BIDFTA.com Testing Area holding a product box on the warehouse floor",
    aspectRatio: "4 / 3",
  },
  {
    src: "/img/team/agustin/07-bidfta-warehouse-selfie.jpg",
    alt: "On the BIDFTA warehouse floor among pallets, boxes, and packing stations",
    aspectRatio: "3 / 4",
  },
  {
    src: "/img/team/agustin/07-bidfta-lotting-tablet.jpg",
    alt: "Warehouse lotting tablet app — scanning lots and entering product titles",
    aspectRatio: "3 / 4",
  },
  {
    src: "/img/team/agustin/07-bidfta-warehouse-floor.jpg",
    alt: "Shrink-wrapped pallets stacked on the BIDFTA warehouse floor",
    aspectRatio: "4 / 3",
  },
  {
    src: "/img/team/agustin/07-bidfta-home.jpg",
    alt: "BIDFTA online auctions homepage with promotional hero and category shopping",
    aspectRatio: "16 / 10",
  },
  {
    src: "/img/team/agustin/07-bidfta-home-mobile.jpg",
    alt: "BIDFTA mobile homepage — location pickup, search, and back-to-school campaign",
    aspectRatio: "9 / 16",
  },
  {
    src: "/img/team/agustin/07-bidfta-auctions.jpg",
    alt: "BIDFTA marketplace item grid with live countdowns, bids, and filters",
    aspectRatio: "16 / 10",
  },
  {
    src: "/img/team/agustin/07-bidfta-locations.jpg",
    alt: "BIDFTA locations page — zip search, warehouse list, and nationwide map",
    aspectRatio: "2 / 1",
  },
];

const aniahCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/08-ase-home.jpg",
    alt: "Aniah Social Events homepage — thoughtfully designed events, seamlessly executed",
    aspectRatio: "16 / 10",
  },
  {
    src: "/img/team/agustin/08-ase-tablescape.jpg",
    alt: "Styled wedding tablescape with florals, candles, and gold place settings",
    aspectRatio: "3 / 2",
  },
  {
    src: "/img/team/agustin/08-ase-pedicab.jpg",
    alt: "Decorated wedding pedicab with The Ruizs monogram projected on a brick wall",
    aspectRatio: "3 / 2",
  },
  {
    src: "/img/team/agustin/08-ase-home-mobile.jpg",
    alt: "Aniah Social Events mobile homepage with Book Now and Services CTAs",
    aspectRatio: "9 / 16",
  },
  {
    src: "/img/team/agustin/08-ase-gallery.jpg",
    alt: "Wedding and event gallery grid managed through Contentful",
    aspectRatio: "16 / 10",
  },
  {
    src: "/img/team/agustin/08-ase-services.jpg",
    alt: "Aniah Social Events services page with packages and pricing",
    aspectRatio: "16 / 10",
  },
];

const laizCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/09-laiz-home.jpg",
    alt: "LAIZ home — calorie and water rings, AI scan, voice input, and streak",
    aspectRatio: "9 / 19",
  },
  {
    src: "/img/team/agustin/09-laiz-chat.jpg",
    alt: "LAIZ AI meal logging chat with photo of a rice bowl and activity notes",
    aspectRatio: "9 / 19",
  },
  {
    src: "/img/team/agustin/09-laiz-food-log.jpg",
    alt: "LAIZ food log with daily calorie summary and meal entries",
    aspectRatio: "9 / 19",
  },
  {
    src: "/img/team/agustin/09-laiz-metrics.jpg",
    alt: "LAIZ metrics — AI insight, weekly trends, and macro averages",
    aspectRatio: "9 / 19",
  },
  {
    src: "/img/team/agustin/09-laiz-login.jpg",
    alt: "LAIZ login screen — Simple tracking. No stress.",
    aspectRatio: "9 / 20",
  },
];

const jobHunterCollage: MilestoneCollageImage[] = [
  {
    src: "/img/team/agustin/10-jobhunter-home.jpg",
    alt: "Job Hunter landing page — create a reusable profile stored locally in the browser",
    aspectRatio: "16 / 10",
  },
  {
    src: "/img/team/agustin/10-jobhunter-fit.jpg",
    alt: "Job Hunter application tracker with AI fit score breakdown for qualification, preference, and compensation",
    aspectRatio: "7 / 3",
  },
  {
    src: "/img/team/agustin/10-jobhunter-cover-letter.jpg",
    alt: "Job Hunter cover letter editor with live PDF preview and writing guidance",
    aspectRatio: "7 / 3",
  },
  {
    src: "/img/team/agustin/10-jobhunter-experience.jpg",
    alt: "Job Hunter experience editor with reusable work history for applications",
    aspectRatio: "2 / 1",
  },
  {
    src: "/img/team/agustin/10-jobhunter-profile.jpg",
    alt: "Job Hunter master profile editor with contact info and AI API key controls",
    aspectRatio: "16 / 10",
  },
  {
    src: "/img/team/agustin/10-jobhunter-home-mobile.jpg",
    alt: "Job Hunter mobile landing page",
    aspectRatio: "9 / 16",
  },
];

export const teamMembers: TeamMember[] = [
  {
    name: "Agustin Manriquez Cruz",
    role: "Founder",
    tagline: "From the factory floor to shipping AI products — this is my story so far.",
    avatar: "/img/team/agustin/agustin-portrait.jpg",
    heroBackground: heroAtmosphere,
    intro:
      "At every stage, I have learned to make the most of what I had, keep moving when the path was uncertain, and create opportunities where none seemed to exist.",
    milestones: [
      {
        id: "factory",
        era: "01 — The beginning",
        title: "From Graduation to the Factory Floor",
        summary:
          "I graduated from high school on a Saturday. The following Monday night, I began my first 7:00 p.m. to 7:00 a.m. shift at Tubular Services in Channelview, Texas.",
        story: [
          "Each summer, school ended and I returned to the factory floor. The experience taught me discipline, endurance, and how to remain dependable in demanding environments. It also reinforced a habit that would later shape my technical career: using every opportunity available to learn, take on greater responsibility, and improve.",
        ],
        bullets: [
          "Performed physically demanding manual labor and worked primarily as a machine operator.",
          "Used downtime at work to learn additional processes and responsibilities, eventually becoming a quench operator responsible for monitoring water pressure, operating temperatures, and quality control.",
          "Despite ranking in the **top 1% of my graduating class**, scoring in the **99th percentile overall on the SAT**, and serving as a teaching assistant for students learning English, my undocumented status limited my access to scholarships and financial aid. For three consecutive summers, I relied on an intense schedule of 12-hour shifts, seven days a week, to fund my education.",
        ],
        skills: ["Discipline", "Endurance", "Ownership", "Learning on the job"],
        visual: {
          caption: "Tubular Services — Channelview, TX",
          collage: factoryCollage,
        },
      },
      {
        id: "engineering-hardware",
        era: "02 — Engineering",
        title: "Engineering Through Hardware, Code, and Data",
        summary:
          "I studied Civil Engineering with a specialization in Transportation, where I began using programming and data to solve practical engineering problems.",
        story: [
          "Engineering taught me to look beyond whether something simply worked. I learned to understand how individual components connected, test possible solutions, interpret real-world data, and troubleshoot the system when the expected result did not happen. Those experiences helped move my interests from traditional engineering toward software development.",
        ],
        bullets: [
          "In a Texas Instruments-sponsored engineering course, I learned about microprocessors, H-bridges, electrical power, Arduino, and Raspberry Pi. I applied those concepts by wiring and programming an RC car that I could control from my phone.",
          "Used MATLAB to solve mathematical and engineering problems through code, showing me how programming could simplify complex calculations and create repeatable solutions.",
          "Analyzed land-surveying data as part of my civil engineering coursework, using measurements and datasets to support real-world engineering decisions.",
        ],
        skills: [
          "Arduino & Raspberry Pi",
          "MATLAB",
          "Systems thinking",
          "Data analysis",
          "Hardware prototyping",
        ],
        visual: {
          caption: "TI LaunchPad, RC builds, math notes & GIS coursework",
          collage: engineeringCollage,
        },
      },
      {
        id: "under-pressure",
        era: "03 — People & tech",
        title: "Merging Technical Skills with People Skills",
        summary:
          "While attending school, I worked for Instructional Media Services, supporting professors, classrooms, and university technology projects.",
        story: [
          "Although the role strengthened my technical skills, my greatest growth was personal. Working through social anxiety, I learned to communicate clearly with professors, stay composed under pressure, and give others confidence while resolving problems. That experience taught me to pair technical problem-solving with empathy, communication, and calm decision-making.",
        ],
        bullets: [
          "Helped professors troubleshoot computers, presentation systems, and classroom projectors.",
          "Assisted with installations involving network connections, fiber-optic cables, and audiovisual equipment across university classrooms.",
          "Responded to technical failures during live lectures, sometimes while hundreds of students waited for me to restore a professor’s slides or reconnect the classroom equipment.",
        ],
        skills: [
          "Live troubleshooting",
          "Classroom AV",
          "Empathy",
          "Clear communication",
          "Composure under pressure",
        ],
        visual: {
          caption: "Texas A&M — Instructional Media Services",
          collage: pressureCollage,
        },
      },
      {
        id: "first-internship",
        era: "04 — My First Internship",
        title: "First Software Development Internship",
        summary:
          "During the COVID-19 pandemic, I joined the **Texas A&M Rural and Community Health Institute** as a software development intern. It was my first professional software role and my first experience working in a hybrid environment.",
        story: [
          "This role showed me that I could use software to solve meaningful problems and contribute to systems that affected people’s lives, whether I was working from home or alongside my team. I loved being paid to investigate problems, build solutions, and continually learn. It confirmed that software development was not simply an interest—it was the career I wanted to pursue.",
        ],
        bullets: [
          "Helped build secure full-stack applications for hospitals and healthcare organizations using React, Express, Redux, Sequelize, relational databases, and FusionAuth.",
          "Developed clinical incident workflows and reporting tools that allowed healthcare professionals to securely review information, generate reports, and visualize data while protecting sensitive health information.",
          "Took on development responsibilities comparable to those of a full-time team member despite being hired as an intern.",
          "Taught and trained other interns on our systems, tools, and development processes.",
          "Supported additional internal needs, including printer troubleshooting, IT support, and technology inventory management.",
        ],
        skills: [
          "React & Express",
          "Healthcare software",
          "Full-stack development",
          "Mentoring",
          "Hybrid teamwork",
        ],
        visual: {
          caption: "Texas A&M Rural and Community Health Institute",
          collage: internshipCollage,
        },
      },
      {
        id: "me-picnics",
        era: "05 — A labor of love",
        title: "Building My First End-to-End Customer Experience",
        summary:
          "During the COVID-19 pandemic, my wife started M.E. Picnics after she recognized an opportunity to create fully prepared picnic experiences that customers could simply arrive and enjoy. I took responsibility for building the digital system that supported the business from discovery through booking.",
        story: [
          "This was my first experience owning an entire digital customer journey rather than contributing to one part of an existing application. Watching my wife manage the business showed me the real value of technology—every feature I built removed one more task from her workload. The project became a labor of love and ultimately confirmed that my future was in software, not civil engineering.",
        ],
        bullets: [
          "Built and deployed a customer-facing website with Next.js where customers could explore picnic packages, select services, and begin the reservation process.",
          "Configured packages as Stripe products and integrated Stripe Checkout to securely accept customer payments.",
          "Connected the booking workflow to Google Calendar so confirmed reservations could be organized alongside the business’s availability and event schedule.",
          "Created search-focused pages for San Antonio picnic services, implemented Google Analytics, and maintained the production website on Netlify.",
        ],
        skills: [
          "Next.js",
          "Stripe Checkout",
          "Google Calendar",
          "SEO & Analytics",
          "End-to-end ownership",
        ],
        cta: {
          label: "Visit mepicnics.com",
          href: "https://mepicnics.com",
        },
        visual: {
          caption: "M.E. Picnics — discovery through booking",
          collage: mePicnicsCollage,
        },
      },
      {
        id: "marketing-for-change",
        era: "06 — Adaptation",
        title: "Learning to Adapt Beyond a Familiar Stack",
        summary:
          "While continuing my work at the Rural and Community Health Institute, I also joined **Marketing for Change**, an agency specializing in digital marketing and SEO. Although I had become proficient within my existing development environment, this role showed me that I was not yet equally skilled at adapting to unfamiliar platforms and established codebases.",
        story: [
          "My time there was brief, and I struggled to adjust as quickly as the environment required. However, the experience exposed an important gap: I understood how to work within the tools I already knew, but I needed a stronger understanding of the web underneath them. It taught me to value fundamentals, approach unfamiliar systems with humility, and become a more adaptable developer.",
        ],
        bullets: [
          "Worked with foundational web technologies, including HTML, CSS, JavaScript, PHP/Laravel, and Webflow.",
          "Learned how carefully chosen words, focused page structure, lightweight code, and fast-loading assets contributed to strong SEO and a better user experience.",
          "Helped upgrade a legacy application from Laravel 5 to Laravel 8 while resolving framework, dependency, and compatibility issues.",
          "Implemented visual and frontend updates, including a graphic that remains live on the company’s website today.",
        ],
        skills: [
          "HTML / CSS / JS",
          "PHP & Laravel",
          "Webflow",
          "SEO fundamentals",
          "Legacy upgrades",
        ],
        cta: {
          label: "Visit marketingforchange.com",
          href: "https://marketingforchange.com",
        },
        visual: {
          caption: "Marketing for Change — Behavioral Determinants Framework",
          collage: marketingForChangeCollage,
        },
      },
      {
        id: "bidfta",
        era: "07 — Ownership",
        title: "Growing into Technical Ownership",
        summary:
          "I joined **BIDFTA** to support the third-party agency responsible for replacing its legacy auction website with a modern React application. I quickly became the platform’s primary developer, ultimately replacing the agency and taking ownership of the rebuild.",
        story: [
          "BIDFTA was where I grew from a developer completing assigned features into a technical owner responsible for entire systems at scale. I learned to navigate ambiguity, make long-term architectural decisions, collaborate directly with stakeholders, and deliver software that supported both customer experiences and daily business operations.",
          "I ultimately left after delays in my DACA renewal created a gap in my work authorization. Although the circumstances were outside my control, the role established the level of ownership, adaptability, and technical leadership I bring to my work today.",
        ],
        bullets: [
          "Rebuilt and maintained the customer-facing auction marketplace with Next.js and React, supporting real-time bidding, payments, and more than 1.2 million registered users.",
          "Expanded my ownership beyond the website to include warehouse operations, content infrastructure, authentication, applied AI, and mobile development.",
          "Led projects end to end—from gathering requirements and making architectural decisions to development, deployment, monitoring, and continued improvement.",
          "Built tools for both customers and internal teams, including inventory and auditing systems, self-service content management, AI-assisted product categorization, and a zero-downtime customer authentication migration.",
        ],
        skills: [
          "Next.js & React",
          "Real-time systems",
          "Technical ownership",
          "Applied AI",
          "Auth & platform ops",
        ],
        cta: {
          label: "Visit bidfta.com",
          href: "https://www.bidfta.com",
        },
        visual: {
          caption: "BIDFTA — auction marketplace at scale",
          collage: bidftaCollage,
        },
      },
      {
        id: "aniah-social-events",
        era: "08 — Alongside the business",
        title: "Building Alongside the Business",
        summary:
          "As my wife expanded into wedding and event planning through **Aniah Social Events**, I continued supporting her vision both digitally and on-site. I built a platform that could showcase her services and past work, generate consultations, and give her control over the content as the business evolved.",
        story: [
          "Working alongside her at real events gave me a clearer understanding of the people and operations behind the software I built. It strengthened my ability to connect digital solutions with the real work they are meant to support.",
        ],
        bullets: [
          "Built a responsive Next.js website from designer mockups, using reusable components and Framer Motion to create polished galleries, testimonials, and page transitions.",
          "Integrated Contentful so she could independently manage services, galleries, blog posts, FAQs, and website copy without relying on me for every update.",
          "Added Calendly calls to action that allowed prospective clients to move directly from exploring her work to scheduling a consultation.",
          "Supported weddings as her assistant, helping with setup, coordination, logistics, and hands-on execution while seeing firsthand what the business required beyond the screen.",
        ],
        skills: [
          "Next.js",
          "Framer Motion",
          "Contentful CMS",
          "Calendly",
          "On-site operations",
        ],
        cta: {
          label: "Visit aniahsocialevents.com",
          href: "https://www.aniahsocialevents.com",
        },
        visual: {
          caption: "Aniah Social Events — digital + on-site support",
          collage: aniahCollage,
        },
      },
      {
        id: "laiz",
        era: "09 — Proof",
        title: "Building the Proof Myself",
        summary:
          "As I became more ambitious as a developer, I attempted to launch an AI consulting agency. Without an established AI product to demonstrate what I could deliver, potential clients were hesitant to take a chance on me. Rather than wait for someone to give me the opportunity, I decided to build something ambitious enough to serve as the proof: **LAIZ**.",
        story: [
          "LAIZ remains a work in progress, but it brings together mobile development, backend architecture, cloud infrastructure, secure media handling, and conversational AI within one product. It reflects a lesson that has followed me throughout my career: when I do not yet have the proof of what I can build, I create it.",
        ],
        bullets: [
          "Began developing a cross-platform mobile application with React Native for both iOS and Android.",
          "Built a FastAPI backend to manage application data, user workflows, and communication with AI services.",
          "Developed a conversational AI system that allows users to log, review, and better understand their nutrition through natural interactions.",
          "Implemented secure image storage and delivery through Cloudflare, using signed access to protect user images and prevent unauthorized retrieval.",
          "Designed the application and infrastructure with future growth, privacy, and scalability in mind.",
        ],
        skills: [
          "React Native",
          "FastAPI",
          "Conversational AI",
          "Cloudflare",
          "Secure media",
        ],
        cta: {
          label: "Explore LAIZ",
          href: "/projects/laiz",
        },
        visual: {
          caption: "LAIZ — health tracking with practical AI",
          collage: laizCollage,
        },
      },
      {
        id: "job-hunter",
        era: "10 — Job search",
        title: "Trying to Get a Job",
        summary:
          "After becoming a lawful permanent resident, I turned my attention to a more immediate challenge: navigating unemployment and finding my next opportunity. Instead of relying on a scattered collection of documents, job boards, and repeated application forms, I began building **Job Hunter**—a tool designed around the way I actually search and apply for work.",
        story: [
          "Job Hunter is still evolving because I am actively using it throughout my own search. Some features are already proving useful, while others continue to change as I identify friction and better understand what applicants need. Because I am developing it in public, the version you see may be minimal, significantly expanded, or somewhere in between—but it remains one of the projects I am most proud of.",
          "It represents how I hope to be hired: not only for the technologies I know, but for my ability to recognize a real problem, build a practical solution, test it through lived experience, and continuously improve it.",
        ],
        bullets: [
          "Built a structured master-profile system that allows career information to be reused across applications without entering the same details repeatedly.",
          "Designed the application to store personal career data locally using Dexie and IndexedDB rather than requiring a centralized database.",
          "Integrated bring-your-own-key AI workflows for generating tailored résumés and cover letters while allowing users to control their own API access.",
          "Added résumé PDF generation and application tracking within the same Next.js, React, and TypeScript application.",
          "Made the project open source and deployed a free demo so others could explore it, learn from it, and potentially benefit from the same tools I was building for myself.",
        ],
        skills: [
          "Next.js & TypeScript",
          "Dexie / IndexedDB",
          "BYOK AI",
          "PDF generation",
          "Open source",
        ],
        cta: {
          label: "Try Job Hunter",
          href: "https://job-hunter-mu-inky.vercel.app/",
        },
        visual: {
          caption: "Job Hunter — built in public for my own search",
          collage: jobHunterCollage,
        },
      },
    ],
    closing:
      "I’m still learning every day — and that’s the point. Progress over perfection. If you’re building something ambitious and want a partner or employee who moves fast with you, I’d love to talk.",
    links: [
      { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
      { label: "Book a free consultation", href: "/consultation" },
    ],
  },
];
