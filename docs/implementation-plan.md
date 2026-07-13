# Phase 1 implementation plan

## v0.1.2 — Personalise, Connect & Enquire

### Release scope

- Added typed biography content and the approved local waterfront portrait to the Mihir page without changing its CV request flow.
- Completed central Calendly configuration, engagement-specific review flows and email-before-scheduling behavior.
- Connected booking, CV and print enquiries to the validated server-only SES delivery boundary.
- Preserved accessible, honest fallback states for unconfigured email, Google Maps, remote media and Calendly integrations.
- Prepared the complete Next.js 15 application and AWS Amplify build configuration for review through a release pull request.

### Production verification

- `npm install` — dependencies are current.
- `npm run format:check` — passed.
- `npm run lint` — passed with no warnings or errors; Next.js reports its upstream command deprecation notice.
- `npm run typecheck` — passed.
- `npm test` — passed: 5 files and 50 tests.
- `npm run build` — passed with Next.js 15.5.7; all 28 pages were generated, including sitemap, robots and the dynamic form endpoint.

### Production configuration

- Required public scheduling configuration: `NEXT_PUBLIC_CALENDLY_15_URL`, `NEXT_PUBLIC_CALENDLY_30_URL`, `NEXT_PUBLIC_CALENDLY_60_URL`, `NEXT_PUBLIC_CALENDLY_90_URL` and `NEXT_PUBLIC_CALENDLY_FALLBACK_URL`.
- Required server-only email configuration: `FORM_NOTIFICATION_TO_EMAIL`, `FORM_NOTIFICATION_FROM_EMAIL` and `SES_REGION`. The application-specific region name avoids Amplify’s reserved `AWS` prefix and does not fall back to AWS SDK region variables. Runtime AWS credentials must come from Amplify’s IAM role/default credential chain, never browser variables.
- Optional public configuration with local fallback: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` and `NEXT_PUBLIC_MEDIA_BASE_URL`.
- `NEXT_PUBLIC_SITE_URL` may remain unset because the application defaults to the canonical `https://cheesewiththat.com` origin.
- Dedicated training, consulting, career and speaking Calendly variables are not implemented; those workflows intentionally use the central 30-minute event mapping for this release.

## Secure form email delivery

### Form inventory

- Bookable intake flows: Direction Check, Expert Session, Working Session, Idea Clinic, Training, Consulting, Speaking, and Employment/Leadership.
- Email-only forms: CV Request and photography Print Enquiry/Register Interest.
- `EnquiryForm` has a reusable `general` type, but no standalone general-contact route currently exists.

### Delivery plan

- Add one JSON-only `POST /api/forms/submit` Route Handler with an allow-listed form type, payload limit, schema validation, normalization, honeypot, completion-time checks, rate limiting and duplicate protection.
- Add an injectable Amazon SES v2 delivery adapter using the default AWS credential provider chain and server-only sender/recipient/region configuration.
- Generate escaped HTML and plain-text notification templates with a UUID submission ID; never accept From or To values from the browser.
- Submit bookable intake only after review and reveal Calendly only after SES confirms success. Preserve values and provide retry on failure.
- Convert CV and print forms from browser-only preview confirmation to verified server submission with accessible pending, error and success states.
- Document SES identity verification, sandbox/production access, Amplify configuration and remaining inactive capabilities.

### Email delivery completed

- Connected all eight bookable intake types plus CV, print and reusable general enquiries to the JSON Route Handler.
- Added SES v2 delivery with fixed server-only From/To configuration and visitor Reply-To.
- Added escaped HTML/plain-text templates, UUID submission IDs, Calendly “not yet scheduled” context, safe provider failures and retryable client states.
- Added honeypot, completion timing, allow-list/schema validation, strict email/URL/header validation, payload limits, best-effort rate limiting and concurrent duplicate suppression.
- Calendly now remains unavailable until SES confirms the corresponding context email; CV and print forms show success only after SES confirms delivery.
- Verification: formatting, lint and type checking passed; 50 tests across 5 files passed; the Next.js 15.5.7 production build generated all 28 pages successfully, including the dynamic form endpoint.

## v0.1.1 — Find, Explore & Book

This incremental release preserves the Phase 1 architecture and routes while adding focused discovery, media, map and engagement capabilities.

### Planned

- Correct the visible brand title to the exact casing `Cheesewiththat` while retaining “Mihir—with context.”
- Add typed external profile configuration and a reusable accessible “Find me elsewhere” component.
- Add secure, allow-listed remote media URL resolution while keeping local photography functional.
- Replace the static map prototype with an isolated Google Maps client using `AdvancedMarkerElement`, category filters, accessible listing, selected-city detail and an API-key-free fallback.
- Add typed engagement-specific intake schemas, conditional validation, multi-step review, Calendly configuration and an on-demand inline embed.
- Add the location CSV template and document media, map and Calendly configuration.
- Add focused tests for brand casing, social rendering, forms, Calendly routing/configuration, map fallback, locations and image paths.
- Run formatting, lint, type checking, tests and production build; record results below.

### v0.1.1 assumptions

- Unknown social profile URLs remain empty configuration values. Calendly uses exact local event configuration with documented production fallback behaviour.
- The known external URLs are the previous blog and `0-1products.com`; no LinkedIn, Facebook, X or current-work URL is inferred.
- Public browser environment variables are configuration identifiers, not secrets. Google API restrictions must be enforced in Google Cloud; AWS credentials never enter the application.
- Intake data stays in browser memory until review, then is submitted to the validated server endpoint for SES delivery. Bookable data is retained in memory for limited Calendly prefill only after email delivery succeeds.
- Google Maps and Calendly scripts load only after their relevant route/step requires them.

### v0.1.1 completed

- Version bumped from `0.1.0` to `0.1.1` with changelog entry.
- Brand title corrected across visible branding, metadata and WebSite structured data.
- Typed external profiles and reusable accessible discovery links added; unknown URLs remain unconfigured.
- Secure media-base resolution, Next.js origin/path allow-listing and photography workflow documentation added.
- Route-isolated Google Maps client added with advanced markers, filters, active city details, bounds fitting, keyboard-accessible listing and a responsive no-key fallback.
- Eight typed conditional intake schemas, validation, honeypot/timing protection, review/edit flow and on-demand Calendly embed added.
- Location CSV template and integration documentation added.
- Focused release tests added.

### v0.1.1 verification

- `npm run format:check` — passed.
- `npm run lint` — passed with no warnings or errors (the Next.js 15 command reports its upstream deprecation notice).
- `npm run typecheck` — passed.
- `npm test` — passed: 4 files, 28 tests, including complete Calendly mapping, prefill, event trust, cleanup, responsiveness and script deduplication coverage.
- `npm run build` — passed: 27 routes generated with Next.js 15.5.7.

## Objective

Create a production-quality first release of cheesewiththat.com: an editorial, responsive personal platform that establishes the design system, typed content architecture, core routes, accessible navigation, the “Add the Cheese” preference, and integration-ready engagement, map, photography, editorial, and commerce foundations.

## Assumptions

- Phase 1 uses curated sample and placeholder content. Demonstration case studies are labelled and contain no customer names, confidential details, or fabricated metrics.
- Photography uses repository-owned abstract placeholder artwork until Mihir supplies approved photographs.
- Booking, payment, fulfilment, transactional email, newsletter, analytics, CMS, and secure CV delivery remain adapters or documented extension points. No transaction is simulated.
- Enquiry forms use the validated server route and SES adapter. They show success only after provider confirmation and retain honest retry states when delivery is unavailable; durable consent records remain deferred.
- The map is a lightweight, non-geographic editorial prototype with approximate sample coordinates. No current or private location is represented.
- Local MDX support is represented by a typed article content layer and a sample article. Full MDX compilation is deferred until editorial workflow requirements are confirmed, avoiding an unnecessary runtime dependency now.
- The canonical production origin is `https://cheesewiththat.com` and can be overridden with `NEXT_PUBLIC_SITE_URL`.
- AWS Amplify connects to GitHub through the Amplify GitHub App. No AWS credentials belong in this repository.

## Implementation sequence

1. Scaffold Next.js 15, strict TypeScript, Tailwind, ESLint, Prettier, Vitest, and Amplify configuration.
2. Establish CSS design tokens, typography, layout primitives, accessibility defaults, and responsive navigation.
3. Create typed, central content collections for profile, expertise, work, engagement, services, training, locations, photography, prints, articles, current interests, and links.
4. Build the polished homepage and site-wide “Professional view / Add the cheese” preference.
5. Build thoughtful route foundations for profile, work, ideas, map, photography, collect, engage, now, privacy, and terms, including dynamic detail routes.
6. Add metadata, JSON-LD foundations, sitemap, robots, local image assets, form validation, and provider adapter contracts.
7. Document architecture, content conventions, deployment, completed work, and deferred integrations.
8. Run formatting checks, lint, type checking, unit tests, and a production build; fix all failures.

## Completed

- Repository audit, scope definition and durable agent guidance.
- Next.js 15 App Router scaffold with strict TypeScript, Tailwind, ESLint, Prettier, Vitest and Amplify configuration.
- Controlled Eclecticism design tokens, responsive navigation, accessibility defaults and reduced-motion support.
- Polished homepage with visitor pathways, roles, expertise, sample work, local photography montage, current interests and engagement preview.
- All requested core and dynamic route foundations (27 generated routes in the production build).
- Site-level, locally stored “Add the cheese” preference with optional notes that never conceal essential content.
- Typed content collections and provider adapter interfaces.
- Editorial ideas, privacy-aware map, image-first photography, print preview and engagement/CV request foundations.
- Metadata, canonical origin, sitemap, robots and Person structured data foundation.
- Local placeholder artwork with explicit dimensions and alt text.
- Architecture, content, deployment and repository documentation.

## Deferred intentionally

- Intake delivery, checkout, payments, fulfilment, email delivery, CV file delivery, accounts, CMS, newsletter, analytics/consent, conversational assistant, visitor modes, and dynamic CV generation.
- Real professional claims, career chronology, photographs, prices, availability, and personal travel records pending approved source content.

## Verification record

- `npm run format:check` — passed after formatting.
- `npm run lint` — passed with no warnings or errors.
- `npm run typecheck` — passed.
- `npm test` — passed (2 validation utility tests).
- `npm run build` — passed; 27 routes generated with Next.js 15.5.7.
