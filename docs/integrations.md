# Map and scheduling configuration

## Google Maps

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` in Amplify before building. Enable Google Cloud billing and the Maps JavaScript API. Restrict the browser key to that API and authorize `https://cheesewiththat.com/*`, `https://www.cheesewiththat.com/*`, plus the active Amplify hostname while it remains in use. Redeploy after changing either public variable. The map route loads the API once on demand, uses `AdvancedMarkerElement`, fits valid visible public locations and retains filters, a keyboard-accessible list and a branded fallback when configuration or Google fails.

Location data remains typed and approximate. Import preparation lives at `docs/templates/locations-template.csv`; use pipe-delimited categories when a city has more than one. Do not import private addresses, real-time locations or private itineraries.

## Calendly

Configure the four exact event URLs and the general fallback URL using the variables in `.env.example`. The mapping is centralized in `src/lib/calendly.ts`:

- Direction Check → 15-minute event
- Expert Session → 30-minute event
- Working Session → 60-minute event
- Idea Lab → 90-minute Idea Lab event

Training, Consulting, Speaking and Employment/Leadership are email-only enquiries. They are not mapped to Calendly.

The widget script loads only after a visitor completes and reviews the relevant intake. Name, email and a short sanitized allow-listed summary are passed through supported Calendly parameters. Long values are truncated and empty values omitted. A booking is confirmed only after the relevant Calendly iframe reports `calendly.event_scheduled` from `https://calendly.com`; profile, event-type and date/time events update status but never confirm.

In development, a missing event variable produces a developer-facing configuration message. In production, the general profile URL is used and labelled as general scheduling without claiming an event duration. Script-load failure provides a direct Calendly fallback link rather than an empty container.

Booking preparation remains in browser memory and is passed only through supported, sanitized Calendly prefill fields. Email-only enquiries use the validated server endpoint and show success only after provider confirmation. Before production use, confirm Calendly consent/cookie requirements and avoid putting sensitive data in URLs.
