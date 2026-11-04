import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js reads .env.local. dotenv's default import reads only .env.
// Load .env.local first so it wins; neither file overrides an existing shell var.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
