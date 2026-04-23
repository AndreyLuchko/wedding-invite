export type Language = 'ru' | 'ro'

export interface Guest {
  id: string
  slug: string
  name: string
  language: Language
  created_at: string
}

export interface RsvpResponse {
  id: string
  guest_id: string
  attending: boolean
  guest_count: number
  meal_pref: string | null
  transport: boolean | null
  song_request: string | null
  custom_data: Record<string, unknown> | null
  submitted_at: string
}

export interface GuestWithRsvp extends Guest {
  rsvp_responses: RsvpResponse[]
}
