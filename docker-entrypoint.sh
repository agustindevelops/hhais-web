#!/bin/sh
set -e

echo "Waiting for Postgres and applying Prisma migrations..."
i=0
until yarn prisma migrate deploy; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "Prisma migrate deploy failed after 30 attempts."
    exit 1
  fi
  echo "Database not ready yet (attempt $i/30). Retrying in 2s..."
  sleep 2
done

echo "Seeding database..."
yarn prisma db seed

echo "Starting hhais-web..."
exec yarn start
