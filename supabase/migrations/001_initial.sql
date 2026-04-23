-- Guests: one row per invited person/family
CREATE TABLE guests (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  language    text        NOT NULL CHECK (language IN ('ru', 'ro')),
  created_at  timestamptz DEFAULT now()
);

-- RSVP responses: one per guest
CREATE TABLE rsvp_responses (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id     uuid        NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  attending    boolean     NOT NULL,
  guest_count  integer     NOT NULL DEFAULT 1,
  meal_pref    text,
  transport    boolean,
  song_request text,
  custom_data  jsonb,
  submitted_at timestamptz DEFAULT now()
);

-- Wishlist: reserved for future item-reservation feature
CREATE TABLE wishlist_items (
  id          uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text  NOT NULL,
  amount      integer,
  link        text,
  reserved_by text
);

-- Site config: key-value store for couple names, card number, etc.
CREATE TABLE site_config (
  key   text PRIMARY KEY,
  value text NOT NULL
);

-- Seed initial config rows
INSERT INTO site_config (key, value) VALUES
  ('couple_names',          'Andrii & ____'),
  ('card_number',           ''),
  ('telegram_link',         ''),
  ('venue_name',            ''),
  ('venue_address',         ''),
  ('google_maps_embed_url', '');

-- Row Level Security
ALTER TABLE guests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Public: read guests and config
CREATE POLICY "public_read_guests"
  ON guests FOR SELECT USING (true);

CREATE POLICY "public_read_config"
  ON site_config FOR SELECT USING (true);

-- Public: submit RSVP
CREATE POLICY "public_insert_rsvp"
  ON rsvp_responses FOR INSERT WITH CHECK (true);

-- Authenticated admin: full access
CREATE POLICY "admin_all_guests"
  ON guests FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_rsvp"
  ON rsvp_responses FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_config"
  ON site_config FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_wishlist"
  ON wishlist_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
