# Map and scheduling configuration

## Google Maps

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` in Amplify before building. Enable Google Cloud billing and the Maps JavaScript API. Restrict the browser key to that API and authorize `https://cheesewiththat.com/*`, `https://www.cheesewiththat.com/*`, plus the active Amplify hostname while it remains in use. Redeploy after changing either public variable. The map route loads the API once on demand, uses `AdvancedMarkerElement`, fits valid visible public locations and retains filters, a keyboard-accessible list and a branded fallback when configuration or Google fails.

Location data remains typed and approximate. Import preparation lives at `docs/templates/locations-template.csv`; use pipe-delimited categories when a city has more than one. Do not import private addresses, real-time locations or private itineraries.

## Google Analytics 4

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Amplify for production. `SiteAnalytics` renders the official `@next/third-parties` Google Analytics component once in the root layout only when that ID is present and Next.js is running in production mode. Leave the variable blank in local development and tests.

Amplify pull-request previews expose `AWS_PULL_REQUEST_ID`. The environment writer omits the ID for that context, and `amplify.yml` also unsets any inherited `NEXT_PUBLIC_GA_MEASUREMENT_ID` for the preview build command. This prevents the public value from being embedded by Next.js in preview output. No separate deployment-environment variable or generated analytics enable flag is required. GA Enhanced Measurement must have browser-history page-view tracking enabled so App Router client navigation is measured without duplicate manual page-view events.

The typed client helper in `src/lib/analytics.ts` emits only allow-listed, non-sensitive parameters for successful enquiries, CV requests, Calendly scheduling actions, external links and map interactions. Analytics being absent, blocked or failing never interrupts those actions. No cookie-consent manager currently exists; review consent and privacy treatment before broader campaigns or audience activation.

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

## Amazon SES

Email-only enquiries use the Node.js `/api/forms/submit` Route Handler and SES v2 in `ap-south-1`. Amplify persists only the explicit environment allow-list during the build; From and To remain fixed server configuration, and the visitor email is validated before becoming Reply-To. AWS credentials come exclusively from the Amplify SSR compute role/default SDK provider chain. Safe delivery classifications are written to Amplify compute logs, while the browser receives one generic retryable error. `npm run test:ses` is a deliberate local diagnostic that sends one real minimal message through the same provider; it is never exposed publicly.
