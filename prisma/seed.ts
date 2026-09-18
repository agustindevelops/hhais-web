import { prisma } from "../src/lib/prisma";

const TARGET_CLIENT_EMAIL = "cc.aegisfs@gmail.com";
const TARGET_CLIENT_NAME = "Aegis Financial Solutions";
const SEED_ACCESS_TOKEN =
  "9d64ad44d7edbcf8318fb62d05a08df98b3c4e1a7f2b9c0d8e6a5b4c3d2e1f0a";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function markdown(value: string) {
  return value.replace(/^\n/, "").trim();
}

const PAYMENT_PLANS = [
  {
    slug: "pay_in_full",
    name: "Pay in full",
    description: "Pay the full project fee up front.",
    sortOrder: 1,
  },
  {
    slug: "pay_half",
    name: "Pay half now, half when done",
    description:
      "Pay half of the project fee now and the remaining half when the project is complete.",
    sortOrder: 2,
  },
  {
    slug: "pay_monthly",
    name: "Pay monthly",
    description:
      "Pay a $100 deposit now, then pay monthly for the next 4 months.",
    sortOrder: 3,
  },
] as const;

async function seedPaymentPlans() {
  for (const plan of PAYMENT_PLANS) {
    await prisma.paymentPlan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        description: plan.description,
        sortOrder: plan.sortOrder,
      },
      create: plan,
    });
  }
}

const aegisData = {
  business: {
    name: "Aegis Financial Solutions",
    legalName: null as string | null,
    domain: "aegisfs.com",
    website: null as string | null,
  },
  project: {
    name: "Aegis Financial Solutions Website",
    descriptionMarkdown: markdown(`
Build a professional customer-facing website for Aegis Financial Solutions.

The website will provide information about Aegis and its insurance services, make it easy for prospective customers to request information or a quote, and provide clear ways to contact the business.

The overall experience should feel **warm and inviting**.

Aegis serves **Texas & Florida**.

Primary service areas:

- Medicare
- Individual & Family Health Insurance
- Ancillary Benefits
- Life Insurance
`),
    additionalNotesMarkdown: markdown(`
## Domain

The planned domain is **aegisfs.com**.

The domain will be purchased through **GoDaddy after the project is purchased/approved**.

## Content & Branding

Aegis does not need to upload all branding information during this project confirmation step.

Branding assets, images, and other website content will be provided and managed through the website CMS.

The CMS for this project will be **Contentful**.

Contentful will also be used to host and manage website images/files that belong to the site's content.

## Future / Pending Items

- Resources section/page is planned for later and is not currently part of the initial launch.
- Agent CRM / AI integration tools were discussed as a possible future direction.
- Final footer copyright/disclaimer language still needs to be determined.
- Any required insurance, Medicare, carrier, licensing, or regulatory disclaimers must be provided or approved by Aegis.
`),
    fee: "8500.00",
    priorities: ["quality", "time", "budget"],
    paymentPlanSlug: "pay_in_full",
  },
  features: [
    {
      name: "Website Design & Content",
      sortOrder: 1,
      descriptionMarkdown: markdown(`
Design and build the primary customer-facing website for Aegis Financial Solutions.

The site should be:

- Warm and inviting
- Professional
- Responsive across desktop and mobile
- Appropriate for a financial and insurance services business
- Easy for Aegis to maintain after launch

## Branding & Content

Aegis will provide branding information, images, and website content through the **Contentful CMS**.

Contentful will act as the central location for the website's editable content and associated images/files.

The initial project intake does not require Aegis to provide all branding assets now.
`),
    },
    {
      name: "Website Pages & Content Structure",
      sortOrder: 2,
      descriptionMarkdown: markdown(`
Build the primary informational pages for the Aegis Financial Solutions website.

## Navigation

- Home
- About
- Medicare
- Individual & Family Health
- Ancillary
- Life
- Contact

A **Resources** page is planned for a future phase and is not part of the initial launch.

## Home

Include:

- Request a Free Quote
- Schedule a Consultation
- Save/download contact information
- "Serving Texas & Florida"
- Social media links for resources, tips, and information

## About

Include:

- "What does Aegis mean?"
- Pronunciation
- Definition
- Explanation of how the meaning connects to the business
- CEO/founder profile
- Business history
- Roots
- Purpose
- Bio
- Vision
- Mission

## Medicare

Header:

> Medicare Made Simple: Clear Guidance. Personalized Support.

Include:

- Schedule a Medicare Consultation
- Medicare Advantage (Part C)
- Medicare Supplement (Medigap)
- Prescription Drug Plans (Part D)
- Extra Help & Medicaid Coordination
- Medicare visual breakdown
- Medicare FAQs

## Individual & Family Health

Header:

> Coverage for Every Stage of Life

Include:

- ACA Marketplace Plans
- Off-Marketplace Plans
- Short-Term Medical
- Request a Health Insurance Quote
- Informational coverage sections
- Special Enrollment Period information

## Ancillary

Include information about:

- Dental
- Vision
- Travel Insurance

Include self-enrollment links for approved products.

Currently discussed:

- Humana Dental
- Ameritas Dental
- Ameritas Vision
- Travel Insurance

## Life

Include:

- Term Life Insurance
- Whole Life Insurance
- IUL
- Final Expense
- Mortgage Protection
- Retirement
- Request a Life Insurance Quote

## Contact

Include:

- Phone
- Email
- Se Habla Español
- Save My Contact
- Social media links
- Google reviews/testimonials
- Request a Quote
- Appointment scheduling

## Global Requirements

The bottom of primary pages should provide access to the Request a Free Quote form.

Relevant service pages should include a promotional or motivational section related to the service.

The footer should contain appropriate copyright and disclaimer information.
`),
    },
    {
      name: "Quote Request / Customer Intake Form",
      sortOrder: 3,
      descriptionMarkdown: markdown(`
Allow prospective customers to request information or a quote through the website.

## Current fields

- Full Name
- Phone Number
- Email
- ZIP Code
- Type of Coverage Interested In
- Additional Message (Optional)

Additional information may be collected depending on the selected insurance product.

Potential additional information discussed:

- Date of Birth
- Household information
- Household income
- Medicare interest/eligibility

Submitted customer information will be stored in the project's database so Aegis can access and use the lead information.
`),
    },
    {
      name: "Appointment Scheduling",
      sortOrder: 4,
      descriptionMarkdown: markdown(`
Allow prospective customers to schedule an appointment or consultation from the website.

Expected flow:

1. Select a service
2. Select an available date
3. Select an available time
4. Provide required contact information
5. Book the appointment

Calls to action may include:

- Schedule a Consultation
- Schedule a Medicare Consultation
- Book Appointment

The scheduling implementation and calendar provider will be finalized during development.
`),
    },
    {
      name: "Save Contact / Digital Business Card",
      sortOrder: 5,
      descriptionMarkdown: markdown(`
Allow website visitors to save Aegis Financial Solutions contact information directly to their phone or device.

Possible information includes:

- Contact name
- Business name
- Phone
- Email
- Website
- Job title
`),
    },
    {
      name: "Social Media & Reviews",
      sortOrder: 6,
      descriptionMarkdown: markdown(`
Connect website visitors with Aegis Financial Solutions social profiles and customer reviews.

Platforms currently discussed:

- Facebook
- Instagram
- TikTok

The website should encourage users to follow Aegis for:

- Resources
- Tips
- Information

The website can also provide access to:

- Google reviews
- Approved customer testimonials
`),
    },
    {
      name: "Self-Enrollment Links",
      sortOrder: 7,
      descriptionMarkdown: markdown(`
Provide approved external links allowing customers to self-enroll for selected ancillary insurance products.

Currently discussed:

- Humana Dental
- Ameritas Dental
- Ameritas Vision
- Travel Insurance

Aegis will provide or confirm the appropriate authorized enrollment URLs.
`),
    },
    {
      name: "Website Analytics",
      sortOrder: 8,
      descriptionMarkdown: markdown(`
Provide Aegis Financial Solutions with visibility into website usage and traffic.

Analytics may include:

- Website visitors
- Page views
- Traffic sources
- Visitor activity
- Other useful website performance metrics

Google Analytics will be used for website analytics.
`),
    },
    {
      name: "Content Management",
      sortOrder: 9,
      descriptionMarkdown: markdown(`
Provide Aegis with the ability to manage appropriate website content after launch.

**Contentful** will be used as the website CMS.

Aegis will use Contentful to provide and manage content such as:

- Branding information
- Logos
- Images
- Website copy
- Other site content and files

Contentful will also host the images and files associated with CMS-managed website content.

The website will integrate with Contentful so published CMS content appears on the live website.
`),
    },
  ],
  integrations: [
    {
      name: "Contentful",
      descriptionMarkdown: markdown(`
Contentful will be used as the content management system for the Aegis Financial Solutions website.

Aegis will use Contentful to provide and manage:

- Branding information
- Logos
- Images
- Website copy
- Other website content and content-related files

The website will retrieve and display published content from Contentful.

Aegis will need to create or own the Contentful account used for the project.
`),
      accountStatus: "needs_creation",
      featureNames: [
        "Website Design & Content",
        "Website Pages & Content Structure",
        "Content Management",
      ],
    },
    {
      name: "Google Analytics",
      descriptionMarkdown: markdown(`
Google Analytics will be connected to the production website so Aegis Financial Solutions can view website traffic and visitor activity.

Aegis should own or control the Google account used for the Analytics property.
`),
      accountStatus: "needs_creation",
      featureNames: ["Website Analytics"],
    },
    {
      name: "Prisma Postgres",
      descriptionMarkdown: markdown(`
Prisma Postgres will be used for the application's database.

The database will store application data required by the website, including customer information submitted through website forms where applicable.

The client database will be connected to the website through the application's Prisma data layer.
`),
      accountStatus: "needs_creation",
      featureNames: ["Quote Request / Customer Intake Form"],
    },
  ],
};

async function ensureClient() {
  const existing = await prisma.client.findFirst({
    where: { email: TARGET_CLIENT_EMAIL },
  });

  if (existing) {
    return prisma.client.update({
      where: { id: existing.id },
      data: { name: TARGET_CLIENT_NAME, email: TARGET_CLIENT_EMAIL },
    });
  }

  return prisma.client.create({
    data: {
      name: TARGET_CLIENT_NAME,
      email: TARGET_CLIENT_EMAIL,
    },
  });
}

async function ensureAccessToken(clientId: string) {
  const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS);

  await prisma.clientAccessToken.upsert({
    where: { token: SEED_ACCESS_TOKEN },
    update: {
      clientId,
      expiresAt,
      revokedAt: null,
    },
    create: {
      token: SEED_ACCESS_TOKEN,
      clientId,
      expiresAt,
      revokedAt: null,
    },
  });
}

async function seedAegisIntake() {
  const client = await ensureClient();
  await ensureAccessToken(client.id);

  const paymentPlan = await prisma.paymentPlan.findUniqueOrThrow({
    where: { slug: aegisData.project.paymentPlanSlug },
    select: { id: true },
  });

  const business = await prisma.business.upsert({
    where: { clientId: client.id },
    update: {
      name: aegisData.business.name,
      legalName: aegisData.business.legalName,
      domain: aegisData.business.domain,
      website: aegisData.business.website,
    },
    create: {
      clientId: client.id,
      name: aegisData.business.name,
      legalName: aegisData.business.legalName,
      domain: aegisData.business.domain,
      website: aegisData.business.website,
    },
  });

  const existingContact = await prisma.contact.findFirst({
    where: {
      businessId: business.id,
      email: client.email,
    },
  });

  if (existingContact) {
    await prisma.contact.update({
      where: { id: existingContact.id },
      data: {
        name: client.name,
        email: client.email,
        isPrimary: true,
      },
    });
  } else {
    await prisma.contact.create({
      data: {
        businessId: business.id,
        name: client.name,
        email: client.email,
        isPrimary: true,
      },
    });
  }

  await prisma.contact.updateMany({
    where: {
      businessId: business.id,
      email: { not: client.email },
      isPrimary: true,
    },
    data: { isPrimary: false },
  });

  let project = await prisma.project.findFirst({
    where: {
      businessId: business.id,
      name: aegisData.project.name,
    },
  });

  if (project) {
    project = await prisma.project.update({
      where: { id: project.id },
      data: {
        descriptionMarkdown: aegisData.project.descriptionMarkdown,
        additionalNotesMarkdown: aegisData.project.additionalNotesMarkdown,
        fee: aegisData.project.fee,
        priorities: aegisData.project.priorities,
        paymentPlanId: paymentPlan.id,
        submittedAt: project.submittedAt ?? new Date(),
      },
    });
  } else {
    project = await prisma.project.create({
      data: {
        businessId: business.id,
        name: aegisData.project.name,
        descriptionMarkdown: aegisData.project.descriptionMarkdown,
        additionalNotesMarkdown: aegisData.project.additionalNotesMarkdown,
        fee: aegisData.project.fee,
        priorities: aegisData.project.priorities,
        paymentPlanId: paymentPlan.id,
        submittedAt: new Date(),
      },
    });
  }

  await prisma.contract.upsert({
    where: { projectId: project.id },
    update: {},
    create: { projectId: project.id },
  });

  const featuresByName = new Map<string, string>();
  const featureNames = aegisData.features.map((item) => item.name);

  for (const item of aegisData.features) {
    const existingFeature = await prisma.feature.findFirst({
      where: {
        projectId: project.id,
        name: item.name,
      },
    });

    const feature = existingFeature
      ? await prisma.feature.update({
          where: { id: existingFeature.id },
          data: {
            descriptionMarkdown: item.descriptionMarkdown,
            sortOrder: item.sortOrder,
          },
        })
      : await prisma.feature.create({
          data: {
            projectId: project.id,
            name: item.name,
            descriptionMarkdown: item.descriptionMarkdown,
            sortOrder: item.sortOrder,
          },
        });

    featuresByName.set(feature.name, feature.id);
  }

  await prisma.feature.deleteMany({
    where: {
      projectId: project.id,
      name: { notIn: featureNames },
    },
  });

  const integrationNames = aegisData.integrations.map((item) => item.name);

  for (const item of aegisData.integrations) {
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        projectId: project.id,
        name: item.name,
      },
    });

    const integration = existingIntegration
      ? await prisma.integration.update({
          where: { id: existingIntegration.id },
          data: {
            descriptionMarkdown: item.descriptionMarkdown,
            accountStatus: item.accountStatus,
          },
        })
      : await prisma.integration.create({
          data: {
            projectId: project.id,
            name: item.name,
            descriptionMarkdown: item.descriptionMarkdown,
            accountStatus: item.accountStatus,
          },
        });

    const linkedFeatureIds: string[] = [];

    for (const featureName of item.featureNames) {
      const featureId = featuresByName.get(featureName);
      if (!featureId) {
        throw new Error(`Feature "${featureName}" was not found.`);
      }
      linkedFeatureIds.push(featureId);

      await prisma.featureIntegration.upsert({
        where: {
          featureId_integrationId: {
            featureId,
            integrationId: integration.id,
          },
        },
        update: {},
        create: {
          featureId,
          integrationId: integration.id,
        },
      });
    }

    await prisma.featureIntegration.deleteMany({
      where: {
        integrationId: integration.id,
        featureId: { notIn: linkedFeatureIds },
      },
    });
  }

  await prisma.integration.deleteMany({
    where: {
      projectId: project.id,
      name: { notIn: integrationNames },
    },
  });

  console.log("Aegis Financial Solutions intake seeded successfully.");
  console.log(
    `Intake URL: http://localhost:3000/intake?token=${SEED_ACCESS_TOKEN}`,
  );
  console.log(
    `Contract URL (client): http://localhost:3000/contract?token=${SEED_ACCESS_TOKEN}`,
  );
  console.log(
    `Contract URL (HHAIS): http://localhost:3000/contract?token=${SEED_ACCESS_TOKEN}&admin=true`,
  );
}

async function main() {
  await seedPaymentPlans();
  await seedAegisIntake();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
