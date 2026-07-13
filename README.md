# Cheesewiththat

Phase 1 of `cheesewiththat.com`: Mihir’s personal brand, professional portfolio, consulting, training, photography and future commerce platform.

Current release: **v0.1.3 — Map & Engagement Flow Fixes**.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

## Architecture

- Next.js 15 App Router with strict TypeScript
- Server Components by default; small client islands for navigation, preference, selectors and preview forms
- Typed content collections in `src/content`
- Provider contracts in `src/lib/adapters`
- Typed intake schemas plus route-scoped Calendly scheduling and confirmed-booking events
- Route-isolated Google Maps integration with an accessible no-key fallback
- Allow-listed local or remote photography resolution
- Local placeholder artwork in `public/images`
- CSS design tokens and Tailwind utilities
- AWS Amplify build definition in `amplify.yml`

Direction Check, Expert Session, Working Session and Idea Lab proceed from reviewed preparation directly to their matching Calendly events; they do not call the website email endpoint. Consulting, training, speaking, employment/leadership, CV, general contact and print forms submit through `/api/forms/submit` and Amazon SES without opening Calendly. Success is shown only after the relevant provider confirms it. Payment, checkout and fulfilment remain inactive.

The interactive map requires both `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` at build time. Without either—or if Google fails—the filters and accessible location list remain available with a polished fallback panel. Public environment-variable changes in Amplify require a new deployment.

Local email delivery requires `FORM_NOTIFICATION_TO_EMAIL`, `FORM_NOTIFICATION_FROM_EMAIL`, `SES_REGION`, and AWS credentials supplied through the default SDK credential chain. `SES_REGION` is application configuration and avoids Amplify’s reserved `AWS` prefix. Never prefix email settings or credentials with `NEXT_PUBLIC_`.

See [architecture](docs/architecture.md), [content guide](docs/content-guide.md), [media workflow](docs/media.md), [integrations](docs/integrations.md), [deployment](docs/deployment.md), and [implementation plan](docs/implementation-plan.md).
