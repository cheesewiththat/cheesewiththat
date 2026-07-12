# Cheesewiththat

Phase 1 of `cheesewiththat.com`: Mihir’s personal brand, professional portfolio, consulting, training, photography and future commerce platform.

Current release: **v0.1.1 — Find, Explore & Book**.

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

Calendly booking is active when its public event URLs are configured. Public forms submit through `/api/forms/submit` and Amazon SES when the server-only notification addresses, SES region, verified sender identity and AWS credentials are configured. Payment, checkout and fulfilment remain inactive. Do not add secrets to the repository; use Amplify environment variables and IAM roles.

Local email delivery requires `FORM_NOTIFICATION_TO_EMAIL`, `FORM_NOTIFICATION_FROM_EMAIL`, `AWS_SES_REGION`, and AWS credentials supplied through the default SDK credential chain. Never prefix email settings or credentials with `NEXT_PUBLIC_`.

See [architecture](docs/architecture.md), [content guide](docs/content-guide.md), [media workflow](docs/media.md), [integrations](docs/integrations.md), [deployment](docs/deployment.md), and [implementation plan](docs/implementation-plan.md).
