#!/usr/bin/env bash
set -euo pipefail
# Creates only disposable local databases. Never uses the inherited DATABASE_URL.
cd "$(dirname "$0")/.."
mkdir -p work
mosaic_test_container="mosaic-profile-test-$$"
docker_local() { env -u DOCKER_HOST -u DOCKER_CONTEXT -u DOCKER_TLS -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH docker --host=unix:///var/run/docker.sock "$@"; }
trap 'docker_local rm -f "$mosaic_test_container" >/dev/null 2>&1 || true' EXIT
docker_local run -d --name "$mosaic_test_container" -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_DB=mosaic_clean -p 127.0.0.1::5432 postgres:16-alpine >/dev/null
for attempt in {1..30}; do
  if docker_local exec "$mosaic_test_container" pg_isready -U postgres >/dev/null 2>&1; then break; fi
  sleep 1
done
mosaic_test_port="$(docker_local port "$mosaic_test_container" 5432/tcp | cut -d: -f2)"
DATABASE_URL="postgresql://postgres@127.0.0.1:$mosaic_test_port/mosaic_clean" DIRECT_URL="postgresql://postgres@127.0.0.1:$mosaic_test_port/mosaic_clean" npx prisma migrate deploy
# Use the exact pre-feature schema to check existing-account compatibility.
git show f489524167e0168fa832188b61d362ee8cfeb087:prisma/schema.prisma > work/profile-baseline.prisma
npx prisma migrate diff --from-empty --to-schema-datamodel work/profile-baseline.prisma --script > work/profile-baseline.sql
docker_local exec "$mosaic_test_container" psql -U postgres -c 'CREATE DATABASE mosaic_legacy' >/dev/null
docker_local exec -i "$mosaic_test_container" psql -v ON_ERROR_STOP=1 -U postgres -d mosaic_legacy < work/profile-baseline.sql >/dev/null
docker_local exec -i "$mosaic_test_container" psql -v ON_ERROR_STOP=1 -U postgres -d mosaic_legacy <<'SQL'
INSERT INTO "User" (id,"clerkId",username,"createdAt","dateOfBirth",hobbies) VALUES
('old-b','legacy-b','Same','2020-02-01','1990-06-05','Books, Chess'),
('old-a','legacy-a','same','2020-01-01','1992-03-21','Reading'),
('old-c','legacy-c','third','2020-02-01',NULL,NULL);
SQL
for migration in prisma/migrations/20261009000*/migration.sql; do
  docker_local exec -i "$mosaic_test_container" psql -v ON_ERROR_STOP=1 -U postgres -d mosaic_legacy < "$migration" >/dev/null
done
MOSAIC_TEST_DATABASE_URL="postgresql://postgres@127.0.0.1:$mosaic_test_port/mosaic_legacy" npx vitest run lib/__tests__/profile-database.test.ts
