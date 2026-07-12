# AWS Amplify deployment

## GitHub connection

Connect the `cheesewiththat` repository to AWS Amplify Hosting using the AWS Amplify GitHub App. Do not provide AWS root credentials to Codex, create root access keys or store AWS/GitHub credentials in this repository.

Use a least-privilege AWS identity for configuration. Amplify should build pull requests as previews and the chosen production branch as the live site.

## Build

`amplify.yml` runs `npm ci` followed by `npm run build`, publishes the Next.js `.next` output and caches dependencies/build cache. Pin the Amplify build image to a Node.js 20+ runtime.

Set the following Amplify environment variable:

```text
NEXT_PUBLIC_SITE_URL=https://cheesewiththat.com
```

Optional public integration configuration is documented in `.env.example` and `docs/integrations.md`. Restrict the Google browser key by domain and API. `NEXT_PUBLIC_MEDIA_BASE_URL` must be the single HTTPS web-media origin/path prefix; AWS credentials and private originals remain server-side and outside the site.

Configure all five Calendly variables in Amplify. The four event variables select the exact event types and `NEXT_PUBLIC_CALENDLY_FALLBACK_URL` provides general scheduling only when an event URL is unavailable in production. These are public URLs, not secrets. Verify each production/preview booking flow and Calendly consent behaviour before launch.

## Amazon SES form delivery

Set these server-only Amplify environment variables:

```text
FORM_NOTIFICATION_TO_EMAIL=mihirsatokar@gmail.com
FORM_NOTIFICATION_FROM_EMAIL=mihir@cheesewiththat.com
AWS_SES_REGION=<verified SES region>
```

Do not use `NEXT_PUBLIC_`. Attach a least-privilege IAM role allowing `ses:SendEmail` for the verified Cheesewiththat identity; do not store access keys in Git. Verify `mihir@cheesewiththat.com` or the entire `cheesewiththat.com` domain in the same SES region. While the SES account is in sandbox, delivery is restricted to verified recipients; request production access before accepting public submissions. Confirm SPF, DKIM and DMARC as part of launch readiness.

The fixed recipient is `mihirsatokar@gmail.com`, the fixed sender is `mihir@cheesewiththat.com`, and Reply-To is the validated visitor email. The browser cannot override sender or recipient. Local development uses the same default AWS credential chain; without a region, verified identity and credentials, the form deliberately shows its retryable failure state.

Future provider secrets must be server-only variables without the `NEXT_PUBLIC_` prefix.

## Domain

Attach `cheesewiththat.com` in Amplify and follow its generated DNS validation/target records in Route 53. Confirm the apex and preferred `www` redirect, TLS certificate, canonical URL, sitemap and robots output after deployment.

## Pre-production checklist

Run lint, type checking, tests and production build; verify preview deployment keyboard navigation and responsive layouts; replace sample content; connect production form delivery with server validation and rate limiting; review privacy and terms; and configure consent before analytics.
