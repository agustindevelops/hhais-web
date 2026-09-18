import "server-only";

import type { Contract } from "../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";

/** Create the Contract row if the project is submitted and none exists yet. */
export async function ensureContract(projectId: string): Promise<Contract | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      submittedAt: true,
      contract: true,
    },
  });

  if (!project?.submittedAt) {
    return null;
  }

  if (project.contract) {
    return project.contract;
  }

  return prisma.contract.create({
    data: { projectId: project.id },
  });
}

export async function getContractLockForProject(
  projectId: string,
): Promise<{ lockedAt: Date | null } | null> {
  return prisma.contract.findUnique({
    where: { projectId },
    select: { lockedAt: true },
  });
}
