import type { Client, ClientAccessToken } from "../../generated/prisma/client";

import { prisma } from "./prisma";

export type ValidClientAccess = ClientAccessToken & {
  client: Client;
};

export async function validateAccessToken(
  token: string | undefined,
): Promise<ValidClientAccess | null> {
  if (!token) {
    return null;
  }

  const access = await prisma.clientAccessToken.findUnique({
    where: { token },
    include: { client: true },
  });

  if (!access) {
    return null;
  }

  if (access.revokedAt) {
    return null;
  }

  if (access.expiresAt && access.expiresAt < new Date()) {
    return null;
  }

  return access;
}
