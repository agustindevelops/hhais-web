export type ContractDates = {
  clientSignedAt: Date | null;
  hhaisSignedAt: Date | null;
  lockedAt: Date | null;
};

const progressRank = {
  "Not started": 0,
  Submitted: 1,
  Draft: 2,
  "HHAIS signed": 3,
  "Client signed": 4,
  Signed: 5,
  Executed: 6,
} as const;

export function contractStatus(contract: ContractDates) {
  if (contract.lockedAt) {
    return "Executed";
  }
  if (contract.clientSignedAt && contract.hhaisSignedAt) {
    return "Signed";
  }
  if (contract.clientSignedAt) {
    return "Client signed";
  }
  if (contract.hhaisSignedAt) {
    return "HHAIS signed";
  }
  return "Draft";
}

export function projectProgress(project: {
  submittedAt: Date | null;
  contracts: ContractDates[];
}) {
  if (project.contracts.length === 0) {
    return project.submittedAt ? "Submitted" : "Not started";
  }

  return project.contracts.map(contractStatus).reduce((best, status) => {
    return progressRank[status] > progressRank[best] ? status : best;
  });
}

export function projectTitle(name: string) {
  const trimmed = name.trim();
  return trimmed || "Untitled project";
}
