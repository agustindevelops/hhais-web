-- CreateTable
CREATE TABLE "ProjectContract" (
    "projectId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectContract_pkey" PRIMARY KEY ("projectId","contractId")
);

-- Keep the existing one-to-one links as the first many-to-many rows.
INSERT INTO "ProjectContract" ("projectId", "contractId", "createdAt")
SELECT "projectId", "id", "createdAt" FROM "Contract";

-- CreateIndex
CREATE INDEX "ProjectContract_contractId_idx" ON "ProjectContract"("contractId");

-- AddForeignKey
ALTER TABLE "ProjectContract" ADD CONSTRAINT "ProjectContract_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectContract" ADD CONSTRAINT "ProjectContract_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_projectId_fkey";

-- DropIndex
DROP INDEX "Contract_projectId_key";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "projectId";
