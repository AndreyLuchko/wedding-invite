ALTER TABLE rsvp_responses
  ADD COLUMN greeting_text text NOT NULL DEFAULT '';

UPDATE rsvp_responses
SET greeting_text = guests.greeting_text
FROM guests
WHERE rsvp_responses.guest_id = guests.id
  AND rsvp_responses.greeting_text = '';
