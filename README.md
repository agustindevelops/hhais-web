# HHAIS Web

Standalone Next.js site for Helping Hand AI Solutions. Extracted from `hhais-monorepo/apps/hhais/web`.

## Setup

```sh
cp .env.example .env
# paste BREVO_API_KEY and DATABASE_URL from the old apps/hhais/web/.env
yarn
yarn db:up
yarn prisma:generate
yarn prisma:migrate
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

`yarn db:up` starts only Postgres so Next.js can hot-reload on the host. To run the production image as well:

```sh
yarn docker:up
```
