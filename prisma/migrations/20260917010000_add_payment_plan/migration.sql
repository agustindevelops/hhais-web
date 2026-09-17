-- CreateTable
CREATE TABLE "PaymentPlan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentPlan_slug_key" ON "PaymentPlan"("slug");

-- CreateIndex
CREATE INDEX "PaymentPlan_sortOrder_idx" ON "PaymentPlan"("sortOrder");

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "paymentPlanId" TEXT;

-- CreateIndex
CREATE INDEX "Project_paymentPlanId_idx" ON "Project"("paymentPlanId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "PaymentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
