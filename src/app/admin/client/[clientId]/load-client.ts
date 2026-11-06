import "server-only";

import { prisma } from "@/lib/prisma";

export function loadAdminClient(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      accessTokens: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          expiresAt: true,
          revokedAt: true,
          createdAt: true,
        },
      },
      business: {
        include: {
          contacts: {
            orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
          },
        },
      },
    },
  });
}

export type AdminClient = NonNullable<Awaited<ReturnType<typeof loadAdminClient>>>;

const contractLink = {
  orderBy: { contract: { updatedAt: "desc" as const } },
  include: {
    contract: {
      select: {
        id: true,
        clientSignedAt: true,
        hhaisSignedAt: true,
        lockedAt: true,
        updatedAt: true,
      },
    },
  },
} as const;

export function loadClientProjects(clientId: string) {
  return prisma.project.findMany({
    where: { business: { clientId } },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      fee: true,
      submittedAt: true,
      updatedAt: true,
      contracts: contractLink,
    },
  });
}

export function loadClientProject(clientId: string, projectId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, business: { clientId } },
    include: {
      paymentPlan: { select: { name: true, description: true } },
      features: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true },
      },
      integrations: {
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true },
      },
      attachments: {
        select: { id: true },
      },
      contracts: contractLink,
    },
  });
}

export function loadClientContracts(clientId: string) {
  return prisma.contract.findMany({
    where: {
      projects: { some: { project: { business: { clientId } } } },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      projects: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
              business: { select: { clientId: true } },
            },
          },
        },
      },
    },
  });
}
