-- Enforce one RSVP response per guest at the database level
ALTER TABLE rsvp_responses
  ADD CONSTRAINT rsvp_responses_guest_id_unique UNIQUE (guest_id);
