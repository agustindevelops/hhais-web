import { FormFields, type FormProps } from "@/components/Form";
import { EVENT_ROUTES } from "@/utils/links";

export type Location = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type Survey = {
  question: string;
  answer: string;
};

export type EventPage = {
  slug: string;
  route: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  date: string;
  location: Location;
  cta: {
    label: string;
  };
  survey: FormProps;
  requiredPasscode: string;
};

const getSlugFromRoute = (route: string) => route.replace("/events/", "");



const tenDigitOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
];

const laizBirthdayLaunchPartyRsvpSchema: FormFields[] = [
  {
    name: "fullName",
    label: "Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "arrivalTime",
    label: "Arrival time",
    type: "radio",
    required: true,
    options: [
      { label: "Friday Evening", value: "Friday Evening" },
      { label: "Saturday Morning", value: "Saturday Morning" },
      { label: "Saturday Afternoon", value: "Saturday Afternoon" },
      { label: "Saturday Evening", value: "Saturday Evening" },
    ],
  },
  {
    name: "attendanceType",
    label: "Attendance type",
    type: "radio",
    required: true,
    options: [
      { label: "In person", value: "in-person" },
      { label: "Online", value: "online" },
    ],
  },
  {
    name: "pythonSkill",
    label: "Python skill level",
    type: "radio",
    required: true,
    options: tenDigitOptions,
  },
  {
    name: "typescriptSkill",
    label: "TypeScript skill level",
    type: "radio",
    required: true,
    options: tenDigitOptions,
  },
   {
    name: "mobileDevelopmentSkill",
    label: "Mobile development skill level",
    type: "radio",
    required: true,
    options: tenDigitOptions,
  },
  {
    name: "aiOrchestrationSkill",
    label: "AI orchestration skill level",
    type: "radio",
    required: true,
    options: tenDigitOptions,
  },
  {name: "interest", label:"Which of the following areas are you interested in?",
    type: "multiselect",
    required: true,
    options: [
      { label: "Mobile development", value: "mobile-development" },
      { label: "AI orchestration", value: "ai-orchestration" },
      { label: "DevOps", value: "devops" },
      { label: "Security", value: "security" },
      { label: "Scrub Master", value: "scrub-master" },
      { label: "QA & Testing", value: "qa-and-testing" },
      { label: "Product Management", value: "product-management" },
      { label: "UI/UX Design", value: "ui-ux-design" },
    ],
  },
  {
    name: "accommodations",
    label: "Any accommodations needed? (Dietary restrictions, accessibility, allergies, etc.)",
    type: "textarea",
    placeholder: "Let us know how we can help make your experience comfortable!",
    required: false,
  },
];

export const eventPages: EventPage[] = [
  {
    slug: getSlugFromRoute(EVENT_ROUTES.laizBirthdayLaunchParty),
    route: EVENT_ROUTES.laizBirthdayLaunchParty,
    title: "LAIZ Hackathon & Agustin's 27th Birthday",
    shortDescription:
      "Join us on my birthday for a fast-paced hackathon to help get the LAIZ health tracking app deployed!",
    longDescription:
      "It's my birthday – and instead of a regular party, I'm inviting friends, devs, and supporters for a hackathon to get the LAIZ health app shipped! Whether you're a developer, designer, tester, or just want to help out and learn, come lend a hand. We'll collaborate, fix bugs, deploy features, and celebrate progress together. Come for the code sprints, stay for the birthday vibes!",
    date: "May 23rd, 2026",

    location: {
      name: "Helping Hand AI Office",
      address: "1402 Limelight Ln",
      city: "Pflugerville",
      state: "TX",
      zip: "78660",
      country: "USA",
    },
    cta: {
      label: "RSVP!",
    },
    requiredPasscode: "q7fYtz4pBT1vknd9",
    survey: {
      name: "Agustin's 27th Birthday Launch Party",
      fields: laizBirthdayLaunchPartyRsvpSchema,
    }
  },
];

export const getEventBySlug = (slug: string) =>
  eventPages.find((eventPage) => eventPage.slug === slug);
