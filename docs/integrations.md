# Map and scheduling configuration

## Google Maps

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` in Amplify. Restrict the browser key in Google Cloud to the production and preview domains and only the Maps JavaScript API. The map route loads the API on demand, uses `AdvancedMarkerElement`, fits visible public locations and retains a keyboard-accessible list and branded fallback.

Location data remains typed and approximate. Import preparation lives at `docs/templates/locations-template.csv`; use pipe-delimited categories when a city has more than one. Do not import private addresses, real-time locations or private itineraries.

## Calendly

Configure the four exact event URLs and the general fallback URL using the variables in `.env.example`. The mapping is centralized in `src/lib/calendly.ts`:

- Direction Check → 15-minute event
- Expert Session → 30-minute event
- Working Session → 60-minute event
- Idea Clinic → 90-minute Idea Lab event
- Training, Consulting, Speaking and Employment/Leadership → 30-minute discovery event

The final four are temporary discovery-call mappings. When dedicated events exist, add new typed configuration keys and change only the central mapping—not page components.

The widget script loads only after a visitor completes and reviews the relevant intake. Name, email and a short sanitized allow-listed summary are passed through supported Calendly parameters. Long values are truncated and empty values omitted. A booking is confirmed only after the relevant Calendly iframe reports `calendly.event_scheduled` from `https://calendly.com`; profile, event-type and date/time events update status but never confirm.

In development, a missing event variable produces a developer-facing configuration message. In production, the general profile URL is used and labelled as general scheduling without claiming an event duration. Script-load failure provides a direct Calendly fallback link rather than an empty container.

Intake answers remain in browser memory and are not delivered in v0.1.1. Before production use, confirm Calendly consent/cookie requirements and decide which answers should be passed as supported custom questions without putting sensitive data in URLs.
