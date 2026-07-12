# Content guide

Edit structured content in `src/content/site.ts`; add or extend types in `src/content/types.ts`. Do not place personal facts directly in page JSX.

External profiles also live in this collection. Keep an unknown URL unconfigured rather than guessing it; only entries with `configured: true` and a supplied URL are rendered.

Engagement questions live in `src/lib/intake.ts`. Calendly mapping lives in `src/lib/calendly.ts`; never put event URLs into page components. Only add fields to the concise prefill allow-list when they are appropriate to place in a third-party URL. Full intake responses remain local until a delivery backend is deliberately implemented.

## Editorial rules

- Verify names, dates, outcomes and claims before publishing.
- Keep sample case studies labelled `sample: true` until replaced.
- Never name confidential customers or infer revenue/results.
- Store image dimensions, useful alt text, visibility and print eligibility for every photograph.
- Alt text describes what matters visually; it does not repeat the caption.
- Keep “cheese notes” optional, brief and additive. Important professional information must remain visible in both modes.
- Use approximate public map data only—never live position, home address or private itinerary.
- Draft articles must remain `draft: true` and must not enter static params or the sitemap.

## Photography assets

Place approved originals and thumbnails in `public/images` or migrate to an approved image service. Preserve aspect ratios and update width/height. Do not introduce remote stock images without explicit approval.

## CMS migration

Keep slugs stable. A future CMS adapter should transform provider records into the existing domain types, leaving page components independent of the provider.
