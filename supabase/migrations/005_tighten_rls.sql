-- Tighten Row Level Security.
--
-- Before: anyone holding the public (publishable) key could list every guest,
-- insert RSVP rows for any guest directly via the REST API, and any signed-up
-- user counted as an admin. After: guests and RSVPs are only reachable through
-- server code (service role) or by users listed in admin_users.
--
-- IMPORTANT: right after applying this, add yourself as an admin:
--   INSERT INTO admin_users (user_id) SELECT id FROM auth.users WHERE email = '<admin email>';
-- otherwise the admin panel shows no data.

-- Admin allowlist. No policies on purpose: only the service role / SQL editor
-- can read or change it.
CREATE TABLE admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = (SELECT auth.uid())
  )
$$;

-- Public guest list and direct RSVP inserts are no longer allowed.
-- The invitation page and submitRsvp() use the service role on the server.
DROP POLICY "public_read_guests" ON guests;
DROP POLICY "public_insert_rsvp" ON rsvp_responses;

-- Admin access: "any authenticated user" -> "users in admin_users".
DROP POLICY "admin_all_guests"   ON guests;
DROP POLICY "admin_all_rsvp"     ON rsvp_responses;
DROP POLICY "admin_all_config"   ON site_config;
DROP POLICY "admin_all_wishlist" ON wishlist_items;

CREATE POLICY "admin_all_guests"
  ON guests FOR ALL TO authenticated
  USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "admin_all_rsvp"
  ON rsvp_responses FOR ALL TO authenticated
  USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "admin_all_config"
  ON site_config FOR ALL TO authenticated
  USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "admin_all_wishlist"
  ON wishlist_items FOR ALL TO authenticated
  USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
