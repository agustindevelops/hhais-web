import { spawn } from "node:child_process";

const url = process.env.DATABASE_URL ?? "";
let host = "";

try {
  host = new URL(url.replace(/^postgres(ql)?:/i, "http:")).hostname;
} catch {
  host = "";
}

const localHosts = new Set(["localhost", "127.0.0.1", "db"]);

if (!url || localHosts.has(host)) {
  console.error(
    "Refusing to migrate: DATABASE_URL is missing or points at local Docker.",
  );
  process.exit(1);
}

console.log(`Applying Prisma migrations to ${host}...`);

const child = spawn("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
