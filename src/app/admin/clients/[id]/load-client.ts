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
          token: true,
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
          projects: {
            orderBy: { updatedAt: "desc" },
            include: {
              paymentPlan: {
                select: { name: true, description: true },
              },
              features: {
                orderBy: { sortOrder: "asc" },
                select: {
                  id: true,
                  name: true,
                  descriptionMarkdown: true,
                },
              },
              integrations: {
                orderBy: { createdAt: "asc" },
                select: {
                  id: true,
                  name: true,
                  descriptionMarkdown: true,
                  accountStatus: true,
                  accountEmail: true,
                },
              },
              attachments: {
                orderBy: { createdAt: "asc" },
                select: {
                  id: true,
                  fileName: true,
                  contentType: true,
                  byteSize: true,
                  status: true,
                },
              },
              contract: true,
            },
          },
        },
      },
    },
  });
}

export type AdminClient = NonNullable<Awaited<ReturnType<typeof loadAdminClient>>>;

export function activeAccessToken(client: AdminClient) {
  const now = Date.now();

  return (
    client.accessTokens.find((access) => {
      if (access.revokedAt) {
        return false;
      }
      if (access.expiresAt && access.expiresAt.getTime() <= now) {
        return false;
      }
      return true;
    }) ?? null
  );
}
