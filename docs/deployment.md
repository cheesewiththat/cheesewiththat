# AWS Amplify deployment

## GitHub connection

Connect the `cheesewiththat` repository to AWS Amplify Hosting using the AWS Amplify GitHub App. Do not provide AWS root credentials to Codex, create root access keys or store AWS/GitHub credentials in this repository.

Use a least-privilege AWS identity for configuration. Amplify should build pull requests as previews and the chosen production branch as the live site.

## Build

`amplify.yml` runs `npm ci`, validates and writes the explicit environment allow-list to `.env.production`, then runs `npm run build`. It publishes the Next.js `.next` output and caches dependencies/build cache. Pin the Amplify build image to a Node.js 20+ runtime. A missing server email variable or a region other than `ap-south-1` fails the build instead of deploying a form that cannot deliver.

Set the following Amplify environment variable:

```text
NEXT_PUBLIC_SITE_URL=https://cheesewiththat.com
```

Optional public integration configuration is documented in `.env.example` and `docs/integrations.md`. Restrict the Google browser key by domain and API. `NEXT_PUBLIC_MEDIA_BASE_URL` must be the single HTTPS web-media origin/path prefix; AWS credentials and private originals remain server-side and outside the site.

## Google Analytics 4

Set this public variable in Amplify:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1G3R8K61VF
```

The application loads GA only when this value is configured and Next.js is running in production mode. Amplify identifies pull-request previews with `AWS_PULL_REQUEST_ID`; `scripts/write-amplify-env.mjs` omits the ID in that context and `amplify.yml` unsets any inherited value for the preview build command. Leave the ID blank in local development and tests. No separate deployment-environment variable or generated enable flag is required. Adding or changing the measurement ID requires a new production build and deployment. Confirm GA Enhanced Measurement includes page changes based on browser history events. No consent manager currently gates production analytics, so review consent and privacy treatment before broader campaigns.

Amplify pull-request previews must remain analytics-free. When web previews are enabled for `main`, opening the PR triggers a unique preview deployment; verify its HTML contains no `googletagmanager.com` request before merge.

## Google Maps

Set both public variables in Amplify before the build that should enable the interactive map:

```text
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<restricted browser key>
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=<Google Cloud map ID>
```

Enable billing and the Maps JavaScript API in the Google Cloud project. Restrict the key to that API and authorize `https://cheesewiththat.com/*`, `https://www.cheesewiththat.com/*`, plus the active Amplify production or preview hostname while it is used. Public Next.js variables are embedded at build time, so save the variables and redeploy `main`. If either value is missing or Google fails, the route keeps its filters, location list and polished fallback instead of rendering a blank map.

Configure all five Calendly variables in Amplify. The four event variables select the exact timed booking types and `NEXT_PUBLIC_CALENDLY_FALLBACK_URL` provides general scheduling only when a timed event URL is unavailable in production. These are public URLs, not secrets. Consulting, training, speaking and employment/leadership are email-only and do not use Calendly. Verify each production/preview booking flow and Calendly consent behaviour before launch.

## Amazon SES form delivery

Set these server-only Amplify environment variables:

```text
FORM_NOTIFICATION_TO_EMAIL=mihirsatokar@gmail.com
FORM_NOTIFICATION_FROM_EMAIL=mihir@cheesewiththat.com
SES_REGION=ap-south-1
```

Do not use `NEXT_PUBLIC_` or a custom variable with Amplify’s reserved `AWS` prefix. `SES_REGION` is application-specific and server-only. The application and build validation require `ap-south-1`, matching the verified Mumbai identities; there is no region fallback. Attach a least-privilege Amplify SSR compute role allowing `ses:SendEmail` for the verified Cheesewiththat identity; do not store access keys in Git. The AWS SDK receives only the region and obtains credentials through its default provider chain. Verify `mihir@cheesewiththat.com` or the entire `cheesewiththat.com` domain in `ap-south-1`. While the SES account is in sandbox, delivery is restricted to verified recipients; request production access before accepting public submissions. Confirm SPF, DKIM and DMARC as part of launch readiness.

The fixed recipient is `mihirsatokar@gmail.com`, the fixed sender is `mihir@cheesewiththat.com`, and Reply-To is the validated visitor email. The browser cannot override sender or recipient. Local development uses the same default AWS credential chain; without a region, verified identity and credentials, the form deliberately shows its retryable failure state.

After deployment, reproduce one failed enquiry and inspect **AWS Amplify console → app → Monitoring → Hosting compute logs → main branch log group** for `Form email delivery failed`. The structured entry contains the submission ID, form type, timestamp, three configuration-presence booleans, AWS error name and a safe classification. It contains no submitted answers or environment values. Build-time variable validation appears in the branch deployment log. To test deliberately outside the UI, load the same server variables and default AWS credentials locally and run `npm run test:ses`; it sends one real minimal email and is not a public endpoint.

Future provider secrets must be server-only variables without the `NEXT_PUBLIC_` prefix.

## Domain

Attach `cheesewiththat.com` in Amplify and follow its generated DNS validation/target records in Route 53. Confirm the apex and preferred `www` redirect, TLS certificate, canonical URL, sitemap and robots output after deployment.

## Pre-production checklist

Run lint, type checking, tests and production build; verify preview deployment keyboard navigation and responsive layouts; replace sample content; connect production form delivery with server validation and rate limiting; review privacy and terms; and review analytics consent before broader campaigns.
