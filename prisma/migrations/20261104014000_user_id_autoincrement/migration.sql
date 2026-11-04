-- AlterTable
CREATE SEQUENCE "User_id_seq";

ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER USING nextval('"User_id_seq"'),
ALTER COLUMN "id" SET DEFAULT nextval('"User_id_seq"'),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

ALTER SEQUENCE "User_id_seq" OWNED BY "User"."id";

SELECT setval(
  '"User_id_seq"',
  GREATEST(COALESCE((SELECT MAX("id") FROM "User"), 0), 1),
  (SELECT COUNT(*) FROM "User") > 0
);
