# HHAIS Web

Standalone Next.js site for Helping Hand AI Solutions. Extracted from `hhais-monorepo/apps/hhais/web`.

## Setup

```sh
cp .env.example .env
# paste BREVO_API_KEY and DATABASE_URL from the old apps/hhais/web/.env
yarn
yarn prisma:generate
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).
