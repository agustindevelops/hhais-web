import "server-only";

import type { Contract } from "../../../generated/prisma/client";

import { validateAccessToken } from "@/lib/client-access";
import { ensureContract } from "@/lib/contract/ensure";
import { buildExhibits } from "@/lib/contract/exhibits";
import { generateExecutedPdf } from "@/lib/contract/generate-pdf";
import type {
  ContractPageData,
  ContractRecordView,
  SignContractPayload,
  SignContractResult,
} from "@/lib/contract/types";
import {
  bootstrapIntake,
  getCurrentProject,
  loadProjectForDocument,
  type BootstrappedBusiness,
} from "@/lib/intake/bootstrap";
import { loadIntakeSnapshot } from "@/lib/intake/persist";
import { toIntakeSnapshot } from "@/lib/intake/snapshot";
import { prisma } from "@/lib/prisma";
import { buildContractS3Key } from "@/lib/storage/config";
import { getObjectBytes, putObject } from "@/lib/storage/s3";

function toDataUrl(bytes: Uint8Array, contentType = "image/png"): string {
  return `data:${contentType};base64,${Buffer.from(bytes).toString("base64")}`;
}

async function loadSignatureDataUrl(
  path: string | null,
): Promise<string | null> {
  if (!path) {
    return null;
  }
  try {
    const object = await getObjectBytes(path);
    if (!object) {
      return null;
    }
    return toDataUrl(object.bytes, object.contentType ?? "image/png");
  } catch {
    return null;
  }
}

async function toContractView(
  contract: Contract,
): Promise<ContractRecordView> {
  const [clientSignatureDataUrl, hhaisSignatureDataUrl] = await Promise.all([
    loadSignatureDataUrl(contract.clientSignaturePath),
    loadSignatureDataUrl(contract.hhaisSignaturePath),
  ]);

  return {
    id: contract.id,
    client: {
      signedAt: contract.clientSignedAt?.toISOString() ?? null,
      signerName: contract.clientSignerName,
      signatureDataUrl: clientSignatureDataUrl,
    },
    hhais: {
      signedAt: contract.hhaisSignedAt?.toISOString() ?? null,
      signerName: contract.hhaisSignerName,
      signatureDataUrl: hhaisSignatureDataUrl,
    },
    finalPdfPath: contract.finalPdfPath,
    lockedAt: contract.lockedAt?.toISOString() ?? null,
  };
}

export async function loadContractPage(
  token: string | undefined,
  isAdmin: boolean,
): Promise<ContractPageData | null> {
  const snapshot = await loadIntakeSnapshot(token);
  if (!snapshot) {
    return null;
  }

  let contract = await ensureContract(snapshot.project.id);

  // Self-heal: both signed but PDF/lock never completed (e.g. transient storage error).
  if (
    contract &&
    contract.clientSignedAt &&
    contract.hhaisSignedAt &&
    !contract.lockedAt
  ) {
    const access = await validateAccessToken(token);
    if (access) {
      try {
        contract = await finalizeExecutedContract({
          contractId: contract.id,
          clientId: access.clientId,
          token: snapshot.token,
          isAdmin,
        });
      } catch {
        // Leave unlocked; UI can show a retry state.
      }
    }
  }

  const exhibits = buildExhibits(snapshot);

  return {
    snapshot,
    contract: contract ? await toContractView(contract) : null,
    exhibits,
    isAdmin,
  };
}

export type AdminContractProjectLink = {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
};

/** Full agreement for one contract, shown from this client's latest linked project. */
export async function loadAdminContractDocument(input: {
  clientId: string;
  contractId: string;
}): Promise<{
  page: ContractPageData;
  projects: AdminContractProjectLink[];
  canSign: boolean;
} | null> {
  const contract = await prisma.contract.findUnique({
    where: { id: input.contractId },
    include: {
      projects: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
              updatedAt: true,
              business: {
                select: {
                  clientId: true,
                  client: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!contract) {
    return null;
  }

  const projects = contract.projects.map((link) => ({
    id: link.project.id,
    name: link.project.name,
    updatedAt: link.project.updatedAt,
    clientId: link.project.business.clientId,
    clientName: link.project.business.client.name,
  }));
  const forClient = projects.filter((project) => project.clientId === input.clientId);
  if (forClient.length === 0) {
    return null;
  }

  const documentProject = [...forClient].sort(
    (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime(),
  )[0];
  const record = await loadProjectForDocument(documentProject.id);
  const contact =
    record?.business.contacts.find((item) => item.isPrimary) ??
    record?.business.contacts[0];
  if (!record || !contact) {
    return null;
  }

  const [paymentPlans, latestToken, latestLink] = await Promise.all([
    prisma.paymentPlan.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, slug: true, name: true, description: true },
    }),
    prisma.clientAccessToken.findFirst({
      where: { clientId: input.clientId },
      orderBy: { createdAt: "desc" },
      select: { token: true },
    }),
    prisma.projectContract.findFirst({
      where: { projectId: documentProject.id },
      orderBy: { contract: { updatedAt: "desc" } },
      select: { contractId: true },
    }),
  ]);

  const business = {
    ...record.business,
    projects: [record],
  } as BootstrappedBusiness;
  const snapshot = toIntakeSnapshot({
    token: latestToken?.token ?? "",
    business,
    project: record,
    paymentPlans,
  });

  return {
    page: {
      snapshot,
      contract: await toContractView(contract),
      exhibits: buildExhibits(snapshot),
      isAdmin: true,
    },
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      clientId: project.clientId,
      clientName: project.clientName,
    })),
    canSign: latestLink?.contractId === contract.id,
  };
}

async function finalizeExecutedContract(input: {
  contractId: string;
  clientId: string;
  token: string;
  isAdmin: boolean;
}): Promise<Contract> {
  const page = await (async () => {
    const snapshot = await loadIntakeSnapshot(input.token);
    if (!snapshot) {
      throw new Error("Could not reload contract for PDF generation.");
    }
    const contract = await prisma.contract.findUniqueOrThrow({
      where: { id: input.contractId },
    });
    return {
      snapshot,
      contract: await toContractView(contract),
      exhibits: buildExhibits(snapshot),
      isAdmin: input.isAdmin,
    } satisfies ContractPageData;
  })();

  if (!page.contract) {
    throw new Error("Could not reload contract for PDF generation.");
  }

  const pdfBytes = await generateExecutedPdf({
    page,
    clientId: input.clientId,
  });

  const finalPdfPath = buildContractS3Key(
    input.clientId,
    input.contractId,
    "executed.pdf",
  );

  await putObject({
    s3Key: finalPdfPath,
    body: pdfBytes,
    contentType: "application/pdf",
  });

  return prisma.contract.update({
    where: { id: input.contractId },
    data: {
      finalPdfPath,
      lockedAt: new Date(),
    },
  });
}

function parsePngDataUrl(dataUrl: string): Buffer | null {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/=\s]+)$/i.exec(
    dataUrl.trim(),
  );
  if (!match) {
    return null;
  }
  try {
    return Buffer.from(match[1].replace(/\s/g, ""), "base64");
  } catch {
    return null;
  }
}

export async function signContract(
  payload: SignContractPayload,
): Promise<SignContractResult> {
  const access = await validateAccessToken(payload.token);
  if (!access) {
    return {
      ok: false,
      error: "This contract link is invalid or has expired.",
    };
  }

  const signerName = payload.signerName.trim();
  if (!signerName) {
    return { ok: false, error: "Printed name is required." };
  }

  const png = parsePngDataUrl(payload.signatureDataUrl);
  if (!png || png.length < 32) {
    return { ok: false, error: "A valid signature drawing is required." };
  }
  if (png.length > 2_000_000) {
    return { ok: false, error: "Signature image is too large." };
  }

  const { business } = await bootstrapIntake(access.client);
  const project = getCurrentProject(business);
  if (!project) {
    return { ok: false, error: "Project could not be loaded." };
  }
  if (!project.submittedAt) {
    return {
      ok: false,
      error: "Complete and submit intake before signing this agreement.",
    };
  }

  const contract = await ensureContract(project.id);
  if (!contract) {
    return { ok: false, error: "Contract could not be created." };
  }

  if (contract.lockedAt) {
    return {
      ok: false,
      error: "This agreement is locked and can no longer be signed.",
    };
  }

  const role = payload.admin ? "hhais" : "client";

  if (role === "client") {
    if (contract.clientSignedAt) {
      return { ok: false, error: "The client has already signed." };
    }
  } else {
    if (!contract.clientSignedAt) {
      return {
        ok: false,
        error: "The client must sign before HHAIS can sign.",
      };
    }
    if (contract.hhaisSignedAt) {
      return { ok: false, error: "HHAIS has already signed." };
    }
  }

  const fileName =
    role === "client" ? "client-signature.png" : "hhais-signature.png";
  const signaturePath = buildContractS3Key(
    access.clientId,
    contract.id,
    fileName,
  );

  try {
    await putObject({
      s3Key: signaturePath,
      body: png,
      contentType: "image/png",
    });
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to store signature image.",
    };
  }

  const now = new Date();
  let updated = await prisma.contract.update({
    where: { id: contract.id },
    data:
      role === "client"
        ? {
            clientSignedAt: now,
            clientSignerName: signerName,
            clientSignaturePath: signaturePath,
          }
        : {
            hhaisSignedAt: now,
            hhaisSignerName: signerName,
            hhaisSignaturePath: signaturePath,
          },
  });

  if (updated.clientSignedAt && updated.hhaisSignedAt && !updated.lockedAt) {
    try {
      updated = await finalizeExecutedContract({
        contractId: updated.id,
        clientId: access.clientId,
        token: payload.token,
        isAdmin: payload.admin,
      });
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? `Signatures saved, but PDF generation failed: ${error.message}`
            : "Signatures saved, but PDF generation failed.",
      };
    }
  }

  const page = await loadContractPage(payload.token, payload.admin);
  if (!page) {
    return {
      ok: false,
      error: "Signed, but the contract page could not be reloaded.",
    };
  }

  return { ok: true, page };
}

export async function getExecutedPdfForToken(
  token: string | undefined,
): Promise<{
  bytes: Uint8Array;
  fileName: string;
} | null> {
  const access = await validateAccessToken(token);
  if (!access || !token) {
    return null;
  }

  const { business } = await bootstrapIntake(access.client);
  const project = getCurrentProject(business);
  if (!project) {
    return null;
  }

  const link = await prisma.projectContract.findFirst({
    where: {
      projectId: project.id,
      contract: {
        lockedAt: { not: null },
        finalPdfPath: { not: null },
      },
    },
    orderBy: { contract: { updatedAt: "desc" } },
    select: { contract: true },
  });
  const contract = link?.contract;

  if (!contract?.lockedAt || !contract.finalPdfPath) {
    return null;
  }

  const object = await getObjectBytes(contract.finalPdfPath);
  if (!object) {
    return null;
  }

  const clientSlug = (business.legalName || business.name || "client")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    bytes: object.bytes,
    fileName: `hhais-${clientSlug || "agreement"}-executed.pdf`,
  };
}
