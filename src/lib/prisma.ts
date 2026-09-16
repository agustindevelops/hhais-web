import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// pg currently treats require/prefer/verify-ca as verify-full and warns if those
// aliases are used. Keep today's behavior explicit. Prisma dashboards still emit
// sslmode=require.
const pgConnectionString = connectionString.replace(
  /([?&]sslmode=)(require|prefer|verify-ca)(?=&|$)/,
  "$1verify-full",
);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({ connectionString: pgConnectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
