import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const previewProject = "dzmpzrehpzvfiqpnvrqg";

function databaseReference(value, name) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} is missing or invalid.`);
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error(`${name} must be a PostgreSQL connection.`);
  }
  const direct = url.hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/);
  const pooled =
    url.hostname.endsWith(".pooler.supabase.com") &&
    decodeURIComponent(url.username).match(/^postgres\.([a-z0-9]+)$/);
  const reference = direct?.[1] || pooled?.[1];
  if (!reference)
    throw new Error(`${name} must identify the existing Supabase project.`);
  if (url.pathname !== "/postgres")
    throw new Error(`${name} must use the postgres database.`);
  return { reference, url };
}

export function validateProductionDatabase(env) {
  let api;
  try {
    api = new URL(env.NEXT_PUBLIC_SUPABASE_URL);
  } catch {
    throw new Error("Production Supabase project URL is missing or invalid.");
  }
  const reference = api.hostname.match(/^([a-z0-9]+)\.supabase\.co$/)?.[1];
  if (!reference || api.protocol !== "https:")
    throw new Error("Production Supabase project URL is invalid.");
  if (reference === previewProject)
    throw new Error("Production must not use mosaic-preview.");
  const app = databaseReference(env.DATABASE_URL, "DATABASE_URL");
  const migration = databaseReference(env.DIRECT_URL, "DIRECT_URL");
  if (app.reference !== reference || migration.reference !== reference) {
    throw new Error(
      "Production database and Storage point to different Supabase projects.",
    );
  }
  if (
    migration.url.port === "6543" ||
    migration.url.searchParams.get("pgbouncer") === "true"
  ) {
    throw new Error(
      "DIRECT_URL must use a direct connection or session pooler for migrations.",
    );
  }
  return reference;
}

// The existing feature branch is explicitly bound to the disposable Preview project.
export function validatePreviewDatabase(env) {
  const app = databaseReference(env.DATABASE_URL, "DATABASE_URL");
  const migration = databaseReference(env.DIRECT_URL, "DIRECT_URL");
  let api;
  try {
    api = new URL(env.NEXT_PUBLIC_SUPABASE_URL);
  } catch {
    throw new Error("Preview Supabase URL is invalid.");
  }
  if (
    app.reference !== previewProject ||
    migration.reference !== previewProject ||
    api.origin !== `https://${previewProject}.supabase.co`
  ) {
    throw new Error(
      "Feature Preview must use the verified mosaic-preview project.",
    );
  }
  if (
    migration.url.port === "6543" ||
    migration.url.searchParams.get("pgbouncer") === "true"
  )
    throw new Error(
      "Preview DIRECT_URL must use a direct connection or session pooler.",
    );
  return previewProject;
}

export function redactDatabaseUrls(text) {
  return String(text || "").replace(
    /postgres(?:ql)?:\/\/[^\s"'<>]+/gi,
    "[database URL redacted]",
  );
}

function runCli(cli, args, env) {
  const result = spawnSync(process.execPath, [resolve(cli), ...args], {
    env,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.stdout) process.stdout.write(redactDatabaseUrls(result.stdout));
  if (result.stderr) process.stderr.write(redactDatabaseUrls(result.stderr));
  if (result.error || result.status !== 0) {
    throw new Error(
      `${args.join(" ")} failed; the new deployment must not be published.`,
    );
  }
}

export function vercelBuild(
  env = process.env,
  run = runCli,
  log = console.log,
) {
  if (env.VERCEL_ENV === "production") {
    const reference = validateProductionDatabase(env);
    log(`[deploy] Verified existing Production Supabase project: ${reference}`);
    run("node_modules/prisma/build/index.js", ["migrate", "deploy"], env);
    run("node_modules/prisma/build/index.js", ["migrate", "status"], env);
  } else if (
    env.VERCEL_ENV === "preview" &&
    env.VERCEL_GIT_COMMIT_REF === "feat/profile-mid-onboarding"
  ) {
    const reference = validatePreviewDatabase(env);
    log(`[deploy] Verified disposable Preview Supabase project: ${reference}`);
    run("node_modules/prisma/build/index.js", ["migrate", "deploy"], env);
    run("node_modules/prisma/build/index.js", ["migrate", "status"], env);
  } else {
    log("[deploy] Preview/local build: database migrations skipped.");
  }
  run("node_modules/next/dist/bin/next", ["build"], env);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    vercelBuild();
  } catch (error) {
    console.error(
      `[deploy] ${redactDatabaseUrls(error instanceof Error ? error.message : "Build failed.")}`,
    );
    process.exitCode = 1;
  }
}
