# Architecture

## Shape

The application is a Next.js 15 App Router site. Route files compose reusable UI with typed content from `src/content/site.ts`. Content objects conform to interfaces in `src/content/types.ts`, keeping migration to a CMS mechanical rather than forcing page rewrites.

The root layout owns global metadata, Person structured data, navigation, the cheese preference and footer. Pages are Server Components unless browser state is required. Client islands are limited to the mobile menu, local preference, print selector and preview enquiry confirmation.

## Design system

CSS variables in `src/app/globals.css` define the neutral and accent palette. Pages select one primary neutral, one section accent and at most one surprise colour. Typography uses the requested families when locally available, with carefully chosen system fallbacks to avoid network font dependencies and layout shift. Approved, self-hosted font files can later be loaded with `next/font/local`.

## Content domains

Typed collections cover profile roles, expertise, work, services, training, engagement types, locations, photographs, prints, articles, interests and navigation. Photography dimensions are explicit to prevent cumulative layout shift. Sample and preview states are part of the data model.

## Integration boundaries

`src/lib/adapters/providers.ts` retains the future server-side scheduling, payment, commerce and map contracts. Calendly’s public browser integration is implemented separately through `src/lib/calendly.ts` and `src/components/calendly/CalendlyEmbed.tsx`.

Public form delivery uses the Node.js Route Handler at `POST /api/forms/submit`. `src/lib/forms/validation.ts` normalizes and validates the allow-listed form types; `email.ts` creates escaped HTML and plain-text notifications; `service.ts` handles successful-send deduplication; and the SES v2 adapter uses the AWS SDK default credential provider chain. Sender and recipient are read only from server environment variables. The visitor’s validated address is Reply-To. No form is persisted by the application.

Future integrations: durable rate limiting/deduplication, payment, print fulfilment, newsletter, CMS, secure CV file delivery, accounts, conversational assistant, guided visitor modes, dynamic CV generation, and consent-aware analytics.

v0.1.1 adds browser-only intake and route-isolated provider clients without changing that server-side integration boundary. `BookingFlow` renders from typed schemas and retains state across edit/review steps. `CalendlyEmbed` loads the supported widget script only at scheduling, validates the Calendly origin and iframe message source, and confirms only `calendly.event_scheduled`. `MihirMap` loads Google Maps only on `/map`, uses advanced markers when configured and otherwise retains the accessible location experience. Remote photography is restricted to the single HTTPS origin and path prefix configured at build time.

Bookable flow sequencing is: edit → review → submit email → email confirmed → Calendly → Calendly-confirmed booking. Email failure preserves values and blocks scheduling. Email success never implies a booking. CV and print enquiries stop after confirmed email delivery.

Spam controls include a honeypot, minimum completion time, 32 KB request limit, per-field and total normalized-size limits, strict email/URL/header validation, an in-memory rate-limit abstraction, and a ten-minute idempotency key. The in-memory protections are best effort per server instance; production should move them to a shared store when traffic warrants it and can later add Turnstile at the same service boundary.

## Accessibility and security

The site uses landmarks, semantic headings, a skip link, visible focus, labelled controls, a switch pattern, form constraints, useful alt text and reduced-motion handling. Public location data is approximate. A honeypot field and shared validation utility establish the spam-prevention boundary; production forms additionally require server validation, rate limiting, CSRF/origin controls and a delivery provider.

## SEO

The root metadata uses a configurable canonical origin. Sitemap and robots routes include static and typed dynamic content. Person JSON-LD is present; Article, ProfessionalService and Product JSON-LD can be added once claims and commercial data are final.
