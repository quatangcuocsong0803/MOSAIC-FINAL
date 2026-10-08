BEGIN;
LOCK TABLE "User" IN ACCESS EXCLUSIVE MODE;
ALTER TABLE "User" ADD COLUMN "mid" INTEGER;
WITH ordered AS (SELECT id, row_number() OVER (ORDER BY "createdAt" ASC, id ASC)::integer AS mid FROM "User")
UPDATE "User" u SET mid = ordered.mid FROM ordered WHERE u.id = ordered.id;
ALTER TABLE "User" ALTER COLUMN "mid" SET NOT NULL;
-- Identity prevents user-supplied IDs. PostgreSQL sequence allocation is atomic,
-- non-transactional and never recycles deleted IDs or IDs from rolled-back inserts.
ALTER TABLE "User" ALTER COLUMN "mid" ADD GENERATED ALWAYS AS IDENTITY (START WITH 1 MAXVALUE 9999999 NO CYCLE);
SELECT setval(pg_get_serial_sequence('"User"','mid'), COALESCE((SELECT MAX(mid) FROM "User"),1), EXISTS(SELECT 1 FROM "User"));
CREATE UNIQUE INDEX "User_mid_key" ON "User" (mid);
ALTER TABLE "User" ADD CONSTRAINT "User_mid_range" CHECK (mid BETWEEN 1 AND 9999999);
CREATE FUNCTION mosaic_mid_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.mid IS DISTINCT FROM OLD.mid THEN RAISE EXCEPTION 'Mosaic ID is immutable'; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER mosaic_mid_immutable BEFORE UPDATE OF mid ON "User" FOR EACH ROW EXECUTE FUNCTION mosaic_mid_immutable();
COMMIT;
