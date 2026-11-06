import "server-only";

import type { Client } from "../../../generated/prisma/client";

import { prisma } from "../prisma";

const intakeInclude = {
  contacts: true,
  projects: {
    orderBy: { updatedAt: "desc" as const },
    take: 1,
    include: {
      features: {
        orderBy: { sortOrder: "asc" as const },
        include: {
          featureIntegrations: true,
          attachments: {
            where: { status: "uploaded" },
            orderBy: { createdAt: "asc" as const },
          },
        },
      },
      integrations: {
        orderBy: { createdAt: "asc" as const },
        include: {
          featureIntegrations: true,
          attachments: {
            where: { status: "uploaded" },
            orderBy: { createdAt: "asc" as const },
          },
        },
      },
      attachments: {
        where: { status: "uploaded" },
        orderBy: { createdAt: "asc" as const },
      },
      paymentPlan: true,
    },
  },
} as const;

export type BootstrappedBusiness = Awaited<
  ReturnType<typeof bootstrapIntake>
>["business"];

export type CurrentProject = BootstrappedBusiness["projects"][number];

export function loadIntakeBusiness(clientId: string) {
  return prisma.business.findUnique({
    where: { clientId },
    include: intakeInclude,
  });
}

export async function bootstrapIntake(client: Client) {
  let business = await prisma.business.findUnique({
    where: { clientId: client.id },
    include: intakeInclude,
  });

  if (!business) {
    await prisma.business.create({
      data: {
        clientId: client.id,
        name: client.name,
        contacts: {
          create: {
            name: client.name,
            email: client.email,
            isPrimary: true,
          },
        },
        projects: {
          create: {
            name: "",
            descriptionMarkdown: "",
          },
        },
      },
    });

    business = await prisma.business.findUniqueOrThrow({
      where: { clientId: client.id },
      include: intakeInclude,
    });
  }

  const primaryContact = business.contacts.find((contact) => contact.isPrimary);

  if (!primaryContact) {
    await prisma.contact.create({
      data: {
        businessId: business.id,
        name: client.name,
        email: client.email,
        isPrimary: true,
      },
    });
  }

  if (business.projects.length === 0) {
    await prisma.project.create({
      data: {
        businessId: business.id,
        name: "",
        descriptionMarkdown: "",
      },
    });
  }

  if (!primaryContact || business.projects.length === 0) {
    business = await prisma.business.findUniqueOrThrow({
      where: { clientId: client.id },
      include: intakeInclude,
    });
  }

  return { business };
}

export function getPrimaryContact(business: BootstrappedBusiness) {
  return (
    business.contacts.find((contact) => contact.isPrimary) ??
    business.contacts[0]
  );
}

export function getCurrentProject(business: BootstrappedBusiness) {
  return business.projects[0];
}
