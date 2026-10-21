import { expect, it, vi } from "vitest";
import { validateProductionDatabase, vercelBuild, redactDatabaseUrls } from "./vercel-build.mjs";

function config(reference = "productionproject123") {
  return {
    VERCEL_ENV: "production",
    NEXT_PUBLIC_SUPABASE_URL: `https://${reference}.supabase.co`,
    DATABASE_URL: `postgresql://postgres.${reference}:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true`,
    DIRECT_URL: `postgresql://postgres.${reference}:password@aws-0-region.pooler.supabase.com:5432/postgres`,
  };
}
it("runs production migration and verifies status before building the new app", () => {
  const run = vi.fn();
  vercelBuild(config(), run, vi.fn());
  expect(run.mock.calls.map(([, args]) => args)).toEqual([["migrate", "deploy"], ["migrate", "status"], ["build"]]);
});
it.each(["preview", "development", undefined])("does not migrate from a %s build", (target) => {
  const run = vi.fn();
  vercelBuild({ VERCEL_ENV: target }, run, vi.fn());
  expect(run.mock.calls.map(([, args]) => args)).toEqual([["build"]]);
});
it("rejects the known Preview project on Production", () => {
  const run = vi.fn();
  expect(() => vercelBuild(config("dzmpzrehpzvfiqpnvrqg"), run, vi.fn())).toThrow("must not use mosaic-preview");
  expect(run).not.toHaveBeenCalled();
});
it("rejects URLs belonging to different projects before any command runs", () => {
  const env = { ...config(), DIRECT_URL: config("otherproject").DIRECT_URL };
  const run = vi.fn();
  expect(() => vercelBuild(env, run, vi.fn())).toThrow("different Supabase projects");
  expect(run).not.toHaveBeenCalled();
});
it("rejects transaction pooling for the migration connection", () => {
  const env = config(); env.DIRECT_URL = env.DATABASE_URL;
  expect(() => validateProductionDatabase(env)).toThrow("session pooler");
});
it("accepts a direct Supabase migration connection", () => {
  const env = config(); env.DIRECT_URL = "postgresql://postgres:password@db.productionproject123.supabase.co:5432/postgres";
  expect(validateProductionDatabase(env)).toBe("productionproject123");
});
it("does not build the app when migration fails", () => {
  const run = vi.fn(() => { throw new Error("migration failed"); });
  expect(() => vercelBuild(config(), run, vi.fn())).toThrow("migration failed");
  expect(run).toHaveBeenCalledTimes(1);
});
it("does not build the app when migration status fails", () => {
  const run = vi.fn().mockImplementationOnce(() => {}).mockImplementationOnce(() => { throw new Error("status failed"); });
  expect(() => vercelBuild(config(), run, vi.fn())).toThrow("status failed");
  expect(run).toHaveBeenCalledTimes(2);
});
it("redacts connection credentials from CLI output", () => {
  const message = `${config().DATABASE_URL}\n${config().DIRECT_URL}`;
  expect(redactDatabaseUrls(message)).not.toContain("password");
  expect(redactDatabaseUrls(message)).toBe("[database URL redacted]\n[database URL redacted]");
});
