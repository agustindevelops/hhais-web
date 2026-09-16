import type { FaqType, FooterLinkType, NavbarLinkProps, ProjectType } from '@/types/data'
import type { FeatureType, PricingType, ToolType } from './types'
import { PROJECT_LINKS } from '@/utils/links'
import aseImg from '@/assets/images/projects/ase.png'
import prospectigatorImg from '@/assets/images/projects/prospectigator.webp'
import nutritionImg from '@/assets/images/projects/nutrAition.png'
import haisImg from '@/assets/images/projects/hais.png'

export const tools: ToolType[] = [
  {
    name: 'Social Media',
    icon: 'lucide:dribbble',
    iconClass: 'bg-red-500/20 text-red-500',
  },
  {
    name: 'Design',
    icon: 'lucide:component',
    iconClass: 'bg-sky-500/20 text-sky-500',
  },
  {
    name: 'Coding',
    icon: 'lucide:code-xml',
    iconClass: 'bg-default-500/20 text-default-500',
  },
  {
    name: 'Marketing',
    icon: 'lucide:badge-dollar-sign',
    iconClass: 'bg-indigo-500/20 text-indigo-500',
  },
  {
    name: 'Seo',
    icon: 'lucide:aperture',
    iconClass: 'bg-yellow-500/20 text-yellow-500',
  },
  {
    name: 'Design Builder',
    icon: 'lucide:compass',
    iconClass: 'bg-teal-500/20 text-teal-500',
  },
  {
    name: 'Free Ai Image',
    icon: 'lucide:image',
    iconClass: 'bg-pink-500/20 text-pink-500',
  },
  {
    name: 'Free Repository',
    icon: 'lucide:github',
    iconClass: 'bg-white/20 text-white',
  },
]

export const features: FeatureType[] = [
  {
    icon: 'lucide:file-text',
    title: 'Articles and Blog Posts',
    description:
      'AI can create informative articles or blog posts on a wide range of topics.',
  },
  {
    icon: 'lucide:pen',
    title: 'Creative Writing',
    description:
      'AI can generate short stories, poetry, or other creative pieces.',
  },
  {
    icon: 'lucide:database',
    title: 'Data Analysis and Reporting',
    description:
      'AI can analyze data and generate reports with insights and Financial Reports.',
  },
  {
    icon: 'lucide:gitlab',
    title: 'Code and Programming',
    description:
      'AI can generate code snippets in various programming languages.',
  },
  {
    icon: 'lucide:palette',
    title: 'Design and Visual Content',
    description: 'AI can generate images, logos, and other visual content.',
  },
  {
    icon: 'lucide:case-sensitive',
    title: 'Language Translation',
    description:
      'AI can translate text from one language to another and can any language of your choice.',
  },
]

export const pricingPlans: PricingType[] = [
  {
    name: 'Essential',
    description: 'Our new Customers for a free one month of service offers.',
    price: 19.0,
    features: [
      {
        name: 'All limited links',
        icon: 'lucide:circle-check',
        variant: 'text-primary',
      },
      {
        name: 'Own analytics platform',
        icon: 'lucide:circle-check',
        variant: 'text-primary',
      },
      { name: 'Chat support', icon: 'lucide:circle-check', variant: 'text-primary' },
      {
        name: 'Optimize hashtags',
        icon: 'lucide:circle-check',
        variant: 'text-primary',
      },
      { name: 'Mobile app', icon: 'lucide:circle-x', variant: 'text-red-500' },
      { name: 'Unlimited users', icon: 'lucide:circle-x', variant: 'text-red-500' },
    ],
  },
  {
    name: 'Premium',
    description: 'Our new Customers for a free one month of service offers.',
    price: 29.0,
    features: [
      {
        name: 'All limited links',
        icon: 'lucide:circle-check',
        variant: 'text-primary',
      },
      {
        name: 'Own analytics platform',
        icon: 'lucide:circle-check',
        variant: 'text-primary',
      },
      { name: 'Chat support', icon: 'lucide:circle-check', variant: 'text-primary' },
      {
        name: 'Optimize hashtags',
        icon: 'lucide:circle-check',
        variant: 'text-primary',
      },
      { name: 'Mobile app', icon: 'lucide:circle-check', variant: 'text-primary' },
      {
        name: 'Unlimited users',
        icon: 'lucide:circle-check',
        variant: 'text-primary',
      },
    ],
  },
]

export const faqsData: FaqType[] = [
  {
    id: 1,
    question: 'Who are produces sit pleasure?',
    answer:
      'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem',
  },
  {
    id: 2,
    question: 'What is quo voluptas nulla pariatur?',
    answer:
      'Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Duis leo. Sed fringilla mauris sit amet nibh.',
  },
  {
    id: 3,
    question: 'How to do transactions using iMbank?',
    answer:
      'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem',
  },
  {
    id: 4,
    question: 'How to activate iMbank service?',
    answer:
      'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem',
  },
  {
    id: 5,
    question: 'Who is eligible to open iMbank account?',
    answer:
      'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem',
  },
  {
    id: 6,
    question: 'Will I be given a passbook?',
    answer:
      'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem',
  },
]

export const footerLinks: FooterLinkType[] = [
  {
    title: 'About Us',
    links: [
      { name: 'Support Center' },
      { name: 'Customer Support' },
      { name: 'About Us' },
      { name: 'Copyright' },
      { name: 'Popular Campaign' },
      { name: 'Return Policy' },
      { name: 'Privacy Policy' },
      { name: 'Terms & Conditions' },
    ],
  },
  {
    title: 'My Account',
    links: [
      { name: 'Press Inquiries' },
      { name: 'Social Media Directories' },
      { name: 'Images & B-roll' },
      { name: 'Site Map' },
    ],
  },
]


export const navLinks:NavbarLinkProps[] = [
  {
    label: 'Home',
    link: '#home',
  },
  {
    label: 'Tools',
    link: '#tools',
  },
  {
    label: 'Features',
    link: '#features',
  },
  {
    label: 'Price',
    link: '#price',
  },
  {
    label: 'Faq',
    link: '#faq',
  },
]

export const ProjectsData: ProjectType[] = [
  {
    projectId: 3,
    title: 'LAIZ - Health Tracking App',
    subTitle: 'Progress over Perfection — our motto.',
    content: [
      'LAIZ is our vision of what practical AI should look like—intuitive, invisible, and genuinely helpful. Currently in development, this health tracking app uses everyday intelligence to understand what you eat, what’s in your fridge, and how your habits evolve over time.',
      "Unlike typical calorie trackers, LAIZ learns from context. Dump info to a chatbot—let it sort, organize, and give you good estimates, insights, and recommendations. I've lost 20lbs in 100 days using this new method.",
      "For us, LAIZ represents more than a health app—it’s a proof of concept for our core mission: making AI tools that simplify daily life without adding complexity. Progress over Perfection."
    ],
    cta: {
      url: PROJECT_LINKS.laiz.landing,
      hook: 'Explore the full story and vision behind LAIZ—see how practical AI can change your daily health habits.',
      label: 'Sign up for early access to LAIZ',
      icon: 'lucide:app-window',
    },
    image: nutritionImg,
  },
  {
    projectId: 1,
    title: 'Aniah Social Events',
    subTitle: 'Empowering event planning with AI-driven solutions.',
    content: [
      'Aniah Social Events is a premier wedding and event planning company known for creating immersive, unforgettable experiences. From intimate ceremonies to large-scale events, their team crafts every moment with intention and style.',
      'Helping Hand AI Solutions partnered with Aniah Social Events to build internal AI tools that automate research and vendor discovery. These systems help planners quickly find the best venues, photographers, florists, and vendors that align with each client’s vision — cutting hours of manual searching into seconds.',
      'Beyond AI automation, we also manage their digital presence, including their website and backend systems. Our collaboration allows the Aniah Social Events team to focus more on creativity and client relationships while technology handles the tedious work behind the scenes.'
    ],
    image: aseImg,
    cta: {
      url: 'https://www.aniahsocialevents.com',
      hook: 'Planning a wedding or Corporate Event?',
      label: 'Checkout Aniah Social Events',
      icon: 'lucide:clipboard-check',
    },
  },
  {
    projectId: 2,
    title: 'Prospectigator',
    subTitle: 'AI-powered lead generation built in partnership with Lucerna Digital',
    content: [
      'When existing tools couldn’t meet Lucerna Digital’s standards, we joined forces to build Prospectigator — an AI-assisted research engine designed to transform how businesses find and qualify leads. Built with the same AI expertise we bring to all client projects, Prospectigator goes beyond contact lists to deliver deep, actionable intelligence.',
      'We partnered closely with Lucerna to develop the underlying automation and data intelligence systems that power their platform. Our contribution focused on multi-model analysis pipelines, company profiling automation, and lead scoring logic that turns raw data into clear, context-rich account briefs.',
      'Together, we’ve helped Lucerna scale a lead generation service that blends intelligent discovery with human review, producing verified, high-quality prospects ready for outreach. It’s a testament to how collaboration between technical innovation and marketing insight can redefine what AI-driven growth looks like.'
    ],
    image: prospectigatorImg,
    cta: {
      url: 'https://www.lucernadigital.com/lead-generation',
      hook: 'AI Lead Intelligence in Action',
      label: 'See Prospectigator Live',
      icon: 'lucide:rocket',
    },
  },
  {
    projectId: 4,
    title: 'HH AI Solutions',
    subTitle: 'Streamlining the software development process, one customer at a time.',
    content: [
      'Helping Hand AI Solutions was founded with a simple belief — technology should make growth easier, not harder. We partner with businesses to design, automate, and scale their operations through practical AI and efficient software systems.',
      'Our work spans from building custom AI tools to optimizing internal workflows, always with a focus on clarity, speed, and measurable results. Whether it’s integrating automation into existing infrastructure or crafting entirely new digital solutions, our mission stays the same: to help every client work smarter and move faster.',
      'This ongoing initiative represents our core commitment — delivering innovation that’s approachable, reliable, and tailored to each customer’s needs. For those ready to start transforming their process, our consultation call is the first step toward that future.'
    ],
    image: haisImg,
    cta: {
      url: '/consultation',
      hook: 'Start Your Transformation',
      label: 'Book a Consultation',
      icon: 'lucide:calendar-check',
    },
  }
]

