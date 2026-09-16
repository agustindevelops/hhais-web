import { prisma } from "../src/lib/prisma";

const SEED_CLIENT_EMAIL = "jane.client@example.com";
const SEED_CLIENT_NAME = "Jane Client";
const SEED_ACCESS_TOKEN =
  "9d64ad44d7edbcf8318fb62d05a08df98b3c4e1a7f2b9c0d8e6a5b4c3d2e1f0a";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

async function seedClientAccess() {
  let client = await prisma.client.findFirst({
    where: { email: SEED_CLIENT_EMAIL },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        name: SEED_CLIENT_NAME,
        email: SEED_CLIENT_EMAIL,
      },
    });
  } else {
    client = await prisma.client.update({
      where: { id: client.id },
      data: { name: SEED_CLIENT_NAME },
    });
  }

  const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS);

  await prisma.clientAccessToken.upsert({
    where: { token: SEED_ACCESS_TOKEN },
    update: {
      clientId: client.id,
      expiresAt,
      revokedAt: null,
    },
    create: {
      token: SEED_ACCESS_TOKEN,
      clientId: client.id,
      expiresAt,
      revokedAt: null,
    },
  });

  let business = await prisma.business.findUnique({
    where: { clientId: client.id },
  });

  if (!business) {
    business = await prisma.business.create({
      data: {
        clientId: client.id,
        name: client.name,
      },
    });
  }

  const primaryContact = await prisma.contact.findFirst({
    where: { businessId: business.id, isPrimary: true },
  });

  if (!primaryContact) {
    await prisma.contact.create({
      data: {
        businessId: business.id,
        name: client.name,
        email: client.email,
        isPrimary: true,
      },
    });
  }

  const projectCount = await prisma.project.count({
    where: { businessId: business.id },
  });

  if (projectCount === 0) {
    await prisma.project.create({
      data: {
        businessId: business.id,
        name: "",
        descriptionMarkdown: "",
      },
    });
  }

  console.log(
    `Intake URL: http://localhost:3000/intake?token=${SEED_ACCESS_TOKEN}`,
  );
}

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@hhais.dev" },
    update: { name: "Alice" },
    create: { email: "alice@hhais.dev", name: "Alice" },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@hhais.dev" },
    update: { name: "Bob" },
    create: { email: "bob@hhais.dev", name: "Bob" },
  });

  await prisma.post.deleteMany({
    where: {
      title: {
        in: ["Welcome to HHAIS", "Roadmap", "Changelog"],
      },
    },
  });

  await prisma.post.createMany({
    data: [
      {
        title: "Welcome to HHAIS",
        content: "Seeded with Prisma.",
        published: true,
        authorId: alice.id,
      },
      {
        title: "Roadmap",
        content: "Set up your own domain models next.",
        published: false,
        authorId: bob.id,
      },
      {
        title: "Changelog",
        content: "Prisma Postgres is connected.",
        published: true,
        authorId: alice.id,
      },
    ],
  });

  await seedClientAccess();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
