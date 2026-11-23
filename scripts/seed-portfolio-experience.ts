import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const PORTFOLIO_USERNAME = "agustin";

const experience = [
  {
    role: "Full Stack Senior Software Developer",
    company: "BIDFTA",
    url: "https://www.bidfta.com/",
    location: "Cincinnati, OH",
    dates: "May 2022 – May 2026",
    highlights: [
      "Owned full-stack development across a large auction marketplace, warehouse operations, content infrastructure, applied AI, and authentication systems.",
      "Built and maintained a Next.js auction marketplace serving more than 1.2 million users, including BigCommerce integrations, real-time bidding, Stripe payments, and Java APIs.",
      "Replaced an underperforming machine-learning model with an OpenAI pipeline that categorized hundreds of millions of products for customer filtering.",
      "Architected a Strapi CMS on AWS using EC2, RDS/MySQL, S3, and Bitbucket pipelines, giving marketing teams control of pages, campaigns, and promotional content.",
      "Built warehouse tools for inventory, product lotting, transaction history, search, and auditing using Next.js, Auth0, Python, and Elasticsearch; added Spanish-language support.",
      "Architected a zero-downtime migration of 1.2 million accounts to Firebase Authentication using a dual-authentication strategy and supported release of the company’s cross-platform mobile application.",
    ],
  },
  {
    role: "Full Stack Web Developer",
    company: "Texas A&M Health Science Center, Rural and Community Health Institute",
    url: "https://architexas.org/",
    location: "College Station, TX",
    dates: "May 2020 – June 2022",
    highlights: [
      "Developed secure full-stack web applications supporting healthcare peer review programs, building HIPAA-conscious workflows for collecting, reviewing, and reporting on protected health information (PHI) used by hospitals and medical professionals.",
      "Developed secure, multi-stage workflows for collecting and reviewing clinical incident data across administrators, physicians, and other permission-based user roles.",
      "Built configurable reporting tools that aggregated clinical incident data into printable reports, charts, and visual summaries based on user-selected criteria.",
      "Designed full-stack application features using React, Express, Sequelize, Redux, and relational database models.",
      "Integrated FusionAuth authentication and authorization to enforce role-based access to sensitive healthcare data.",
      "Collaborated directly with healthcare stakeholders to gather requirements, refine workflows, and deliver improvements based on user feedback.",
      "Translated Figma designs into responsive, production-ready interfaces while accounting for usability, security, and PHI-handling requirements.",
    ],
  },
  {
    role: "Web Developer",
    company: "Marketing for Change",
    url: "https://marketingforchange.com/",
    location: "Alexandria, VA",
    dates: "December 2021 – May 2022",
    highlights: [
      "Developed and maintained lightweight, performance-focused websites supporting digital marketing and public-interest campaigns.",
      "Modernized multiple legacy PHP applications by upgrading them from Laravel 5 to Laravel 8, resolving framework, dependency, and compatibility issues.",
      "Developed lightweight frontend features using HTML, CSS, and JavaScript, prioritizing page performance and SEO best practices.",
      "Updated and styled content across the company website and campaign projects, integrating frontend components with Webflow and other marketing tools.",
    ],
  },
] as const;

async function main() {
  const { prisma } = await import("../src/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { username: PORTFOLIO_USERNAME },
    select: { id: true, username: true },
  });

  if (!user) {
    throw new Error(`No user named ${PORTFOLIO_USERNAME}`);
  }

  for (const [sortOrder, job] of experience.entries()) {
    const existing = await prisma.experience.findFirst({
      where: {
        userId: user.id,
        company: job.company,
        dates: job.dates,
      },
      select: { id: true },
    });

    const data = {
      role: job.role,
      company: job.company,
      url: job.url,
      location: job.location,
      dates: job.dates,
      highlights: [...job.highlights],
      sortOrder,
    };

    if (existing) {
      await prisma.experience.update({ where: { id: existing.id }, data });
      console.log(`updated ${job.company}`);
      continue;
    }

    await prisma.experience.create({
      data: {
        userId: user.id,
        ...data,
      },
    });
    console.log(`created ${job.company}`);
  }

  console.log(
    `Portfolio experience is ready at /api/portfolio/${user.username}/experience`,
  );
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
