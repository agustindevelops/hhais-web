import "server-only";

import type { Contract } from "../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";

/** Create a contract and link it when a submitted project has none yet. */
export async function ensureContract(projectId: string): Promise<Contract | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      submittedAt: true,
      contracts: {
        orderBy: { contract: { updatedAt: "desc" } },
        take: 1,
        include: { contract: true },
      },
    },
  });

  if (!project?.submittedAt) {
    return null;
  }

  const existing = project.contracts[0]?.contract;
  if (existing) {
    return existing;
  }

  return prisma.contract.create({
    data: {
      projects: {
        create: { projectId: project.id },
      },
    },
  });
}

export async function getContractLockForProject(
  projectId: string,
): Promise<{ lockedAt: Date | null } | null> {
  const locked = await prisma.projectContract.findFirst({
    where: {
      projectId,
      contract: { lockedAt: { not: null } },
    },
    orderBy: { contract: { lockedAt: "desc" } },
    select: { contract: { select: { lockedAt: true } } },
  });

  if (locked) {
    return { lockedAt: locked.contract.lockedAt };
  }

  const link = await prisma.projectContract.findFirst({
    where: { projectId },
    select: { contract: { select: { lockedAt: true } } },
  });

  return link ? { lockedAt: link.contract.lockedAt } : null;
}
