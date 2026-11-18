-- AlterTable
ALTER TABLE "User" ADD COLUMN "availability" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ADD COLUMN "timeZone" TEXT NOT NULL DEFAULT 'America/Chicago';
ALTER TABLE "User" ADD COLUMN "slotMinutes" INTEGER NOT NULL DEFAULT 30;
ALTER TABLE "User" ADD COLUMN "horizonDays" INTEGER NOT NULL DEFAULT 14;
ALTER TABLE "User" ADD COLUMN "minNoticeHours" INTEGER NOT NULL DEFAULT 4;
ALTER TABLE "User" ADD COLUMN "googleRefreshToken" TEXT;
ALTER TABLE "User" ADD COLUMN "googleEmail" TEXT;

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "googleEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Consultation_userId_startsAt_idx" ON "Consultation"("userId", "startsAt");

-- CreateIndex
CREATE INDEX "Consultation_startsAt_idx" ON "Consultation"("startsAt");

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
