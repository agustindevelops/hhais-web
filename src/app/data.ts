import type { FaqType, NavbarLinkProps } from "@/types/data";
import { PROJECT_ROUTES, TEAM_ROUTES } from "@/utils/links";
import type {BusinessModelType, FeatureType,PricingType,TestimonialType,ToolType,TopicType,} from './types';

import avatar1 from '@/assets/images/avatars/img-1.png';
import avatar2 from '@/assets/images/avatars/img-2.png';
import avatar3 from '@/assets/images/avatars/img-3.png';
import avatar4 from '@/assets/images/avatars/img-4.png';
import avatar5 from '@/assets/images/avatars/img-5.png';
import avatar6 from '@/assets/images/avatars/img-6.png';
import avatar7 from '@/assets/images/avatars/img-7.png';
import avatar8 from '@/assets/images/avatars/img-8.png';

export const businessModels: BusinessModelType[] = [
  {
    icon: 'lucide:hammer',
    title: 'Execution Only',
    description: [
      'Hourly rate, billed bi-weekly for straightforward delivery.',
      'Best for founders who want clear, fast execution with no equity involved.',
      'Pure cash, no strings — you control the scope, we deliver results.',
    ],
  },
  {
    icon: 'lucide:handshake',
    title: 'Shared Commitment',
    description: [
      'Get discounted milestone-based rates in exchange for equity.',
      'Ideal for early-stage startups looking to preserve runway while aligning incentives.',
      'We both invest — you conserve cash, and we share in your long-term success.',
    ],
  },
  {
    icon: 'lucide:rocket',
    title: 'Full Partnership',
    description: [
      'Our premium investment model with higher rates but tied directly to your outcomes.',
      'We don’t just build — we partner deeply, aligning profits and success metrics with your growth.',
      'Shared risk, shared upside: we only win when you do.',
    ],
  },
]


export const aiTools: ToolType[] = [
  {
    icon: 'lucide:dribbble',
    title: 'Latest AI technology',
    description:
      'Click on Chat Archive and search to Watch Ask Anything Chats from your favocite artists. Ask Them A Question.',
  },
  {
    icon: 'lucide:messages-square',
    title: 'Muiti-language',
    description:
      'Click on Chat Archive and search to Watch Ask Anything Chats from your favocite artists. Ask Them A Question.',
  },
  {
    icon: 'lucide:image',
    title: 'Edit text easily',
    description:
      'Click on Chat Archive and search to Watch Ask Anything Chats from your favocite artists. Ask Them A Question.',
  },
]

export const features: FeatureType[] = [
  {
    icon: 'lucide:send',
    name: 'Blog Post',
    description:
      'Generate blog posts on a variety of topics, from industry news and trends to product reviews and how-to guides.',
  },
  {
    icon: 'lucide:youtube',
    name: 'Social Media',
    description:
      'Generate blog posts on a variety of topics, from industry news and trends to product reviews and how-to guides.',
  },
  {
    icon: 'lucide:facebook',
    name: 'Blog Post',
    description:
      'Generate blog posts on a variety of topics, from industry news and trends to product reviews and how-to guides.',
  },
  {
    icon: 'lucide:mail',
    name: 'Email',
    description:
      'Generate blog posts on a variety of topics, from industry news and trends to product reviews and how-to guides.',
  },
  {
    icon: 'lucide:user',
    name: 'FAQ',
    description:
      'Generate blog posts on a variety of topics, from industry news and trends to product reviews and how-to guides.',
  },
  {
    icon: 'lucide:star',
    name: 'Testimonials',
    description:
      'Generate blog posts on a variety of topics, from industry news and trends to product reviews and how-to guides.',
  },
]

export const trendingTopics: TopicType[] = [
  {
    id: 1,
    title: 'Wax layer',
    description: 'Pressure clean, sponge art, string art, army',
    avatars: [
      avatar2,
      avatar1,
      avatar3,
    ],
  },
  {
    id: 2,
    title: 'Crowd Defence',
    description: 'attack other gang, big, army, Crowd evolution',
    avatars: [
      avatar4,
     avatar5,
    ],
  },
  {
    id: 3,
    title: 'Spinner blade',
    description: 'beyblade games, fidget spinner, spinner battle',
    avatars: [
      avatar6,
      avatar7,
      avatar8,
     avatar5,
    ],
  },
  {
    id: 4,
    title: 'Restaurant game',
    description: 'Cooking madness, cooking, cafe, new hotel',
    avatars: [
      avatar8,
      avatar4,
      avatar6,
    ],
  },
  {
    id: 5,
    title: 'entire marvel universe',
    description: 'Marvel, mutant ninja turtles, super heroes',
    avatars: [avatar1],
  },
  {
    id: 6,
    title: 'Draw bridge',
    description: 'road draw, draw rider, build bridge , build',
    avatars: [
      avatar2,
      avatar6,
      avatar3,
    ],
  },
]

export const userTestimonialData: TestimonialType[] = [
  {
    name: 'Ryan Delk',
    avatar: avatar1,
    description:
      "I've tried other AI writing tools before, but this one is by far the best. The language is sophisticated and engaging, and it's helped me take my content to the next level.",
  },
  {
    name: 'Marsel Fischer',
    avatar: avatar2,
    description:
      "As a content marketer, I'm always looking for ways to streamline my workflow and create high-quality content. I don't know how I ever managed without it.",
  },
  {
    name: 'John Tayes',
    avatar: avatar3,
    description:
      'The solutions offered by your AI chatbots are truly impressive! We are able to communicate with our customers faster and more interactively.',
  },
  {
    name: 'Ryan Jonas',
    avatar: avatar4,
    description:
      "I've tried other AI writing tools before, but this one is by far the best. The language is sophisticated and engaging, and it's helped me take my content to the next level.",
  },
  {
    name: 'Randy Hilarski',
    avatar:avatar5,
    description:
      'I was surprised by the ease and speed of the video editing service based on AI technology from this site. The results are amazing and very satisfying.',
  },
  {
    name: 'Jonathan Simcoe',
    avatar: avatar6,
    description:
      'The solutions offered by your AI chatbots are truly impressive! We are able to communicate with our customers faster and more interactively.',
  },
]

export const pricingPlans: PricingType[] = [
  {
    name: 'Free',
    price: 0,
    features: ['1 user', 'Plan features', 'Product support'],
  },
  {
    name: 'Startup',
    price: 39,
    features: ['2 users', 'Plan features', 'Product support'],
  },
  {
    name: 'Team',
    price: 89,
    features: ['5 users', 'Plan features', 'Product support'],
  },
  {
    name: 'Enterprise',
    price: 149,
    features: ['10 users', 'Plan features', 'Product support'],
  },
]

export const faqs: FaqType[] = [
  {
    id: 1,
    question: "What problems do you solve?",
    answer:
      "We streamline operations with AI: automations, data pipelines, and smart assistants. Typical wins: cut manual work 30–60%, speed up content/workflows, and improve data visibility for faster decisions.",
  },
  {
    id: 2,
    question: "What does a free consultation include?",
    answer:
      "A 20–30 minute call to understand your goals and systems, identify high-ROI opportunities, and propose a practical roadmap with clear next steps—no obligation.",
  },
  {
    id: 3,
    question: "Do you build full products or just prototypes?",
    answer:
      "Both. We can ship an MVP fast to validate value, then harden it into a production app with auth, monitoring, and CI/CD. We also integrate AI into your existing tools and workflows.",
  },
  {
    id: 4,
    question: "How long do projects take?",
    answer:
      "Small automations: 1–2 weeks. MVPs: 3–6 weeks. Larger platforms: phased delivery starting at 6–10 weeks. We work iteratively so you see value early and often.",
  },
  {
    id: 5,
    question: "What’s the typical cost?",
    answer:
      "We offer fixed-scope packages for common use cases and milestone-based pricing for custom builds. After the consult, you’ll get a clear proposal with scope, timeline, and price.",
  },
  {
    id: 6,
    question: "Can you work with sensitive data (HIPAA/PII)?",
    answer:
      "Yes. We design with privacy first, use least-privilege access, and can run models in controlled environments. We’ll align with your compliance requirements.",
  },
  {
    id: 7,
    question: "Who owns the IP?",
    answer:
      "You do. Upon payment, all custom code and deliverables are transferred to you. We can also help set up repos, environments, and handoff docs.",
  },
  {
    id: 8,
    question: "What stack do you use?",
    answer:
      "Modern web stacks (Next.js, TypeScript, Tailwind), Python/FastAPI for AI services, vector DBs where needed, and best-fit LLMs (open-source or commercial) based on privacy, cost, and performance.",
  },
];


export const navLinks: NavbarLinkProps[] = [
  {
    label: 'Features',
    link: '/#features',
  },
  {
    label: 'Our Process',
    link: '/#our-process',
  },
  {
    label: 'Projects',
    link: '/#projects',
    children: [
      { label: 'LAIZ - Health Tracking App', link: PROJECT_ROUTES.laiz },
    ],
  },
  // Hidden for now — re-enable when ready to show events again
  // {
  //   label: 'Events',
  //   link: '/events',
  //   children: [
  //     { label: 'LAIZ - Health Tracking App Birthday Launch Party', link: EVENT_ROUTES.laizBirthdayLaunchParty },
  //   ],
  // },
  {
    label: 'Team',
    link: TEAM_ROUTES.index,
  },
  {
    label: 'Pricing',
    link: '/#business-models',
  },
  {
    label: 'Faq',
    link: '/#faq',
  },
]
