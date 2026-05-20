-- Anvil Phase 2: Public profiles, usernames, follows
-- Run this in Supabase SQL editor (Project → SQL Editor → New query)

-- ─── PROFILES: add username column ───────────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS username text;

-- Case-insensitive uniqueness so "RogerB" and "rogerb" can't both exist
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx
  ON profiles (lower(username));

-- Format: 3–20 chars, letters/numbers/underscore only
-- (DROP first so the script is re-runnable)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_format;
ALTER TABLE profiles
  ADD CONSTRAINT username_format
  CHECK (username IS NULL OR username ~ '^[A-Za-z0-9_]{3,20}$');

-- ─── PROFILES: read policy ───────────────────────────────────────────────────
-- Any authenticated user can read any profile (needed for public profile pages
-- and looking up users to follow). Your existing insert/update policies that
-- restrict writes to id = auth.uid() stay as-is.
DROP POLICY IF EXISTS "profiles_read_authenticated" ON profiles;
CREATE POLICY "profiles_read_authenticated" ON profiles
  FOR SELECT TO authenticated USING (true);

-- ─── FOLLOWS table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  followee_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id),
  CHECK (follower_id <> followee_id)
);

CREATE INDEX IF NOT EXISTS follows_followee_idx ON follows(followee_id);
CREATE INDEX IF NOT EXISTS follows_follower_idx ON follows(follower_id);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all follow rows (needed for counts + lists)
DROP POLICY IF EXISTS "follows_read_authenticated" ON follows;
CREATE POLICY "follows_read_authenticated" ON follows
  FOR SELECT TO authenticated USING (true);

-- A user can only insert a follow row where they are the follower
DROP POLICY IF EXISTS "follows_insert_self" ON follows;
CREATE POLICY "follows_insert_self" ON follows
  FOR INSERT TO authenticated
  WITH CHECK (follower_id = auth.uid());

-- A user can only delete their own follow rows
DROP POLICY IF EXISTS "follows_delete_self" ON follows;
CREATE POLICY "follows_delete_self" ON follows
  FOR DELETE TO authenticated
  USING (follower_id = auth.uid());
