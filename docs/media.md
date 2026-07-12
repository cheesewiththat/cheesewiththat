# Photography media workflow

Set `NEXT_PUBLIC_MEDIA_BASE_URL` to one HTTPS CloudFront distribution or S3 web-media origin. The hostname and configured path prefix become the only remote image pattern allowed by Next.js. Local `/images/...` placeholders continue to work when the variable is absent.

Do not place AWS credentials in browser variables or this repository. Keep the bucket private and use CloudFront origin access control or an equivalent least-privilege delivery design. Infrastructure provisioning and uploads are outside v0.1.1.

## Logical object layout

```text
photography/originals/        private archival sources; never used by the site
photography/web/large/        public display derivatives
photography/web/thumbnails/   public listing derivatives
photography/print-previews/   watermarked or appropriately sized previews
photography/metadata/         versioned manifests
```

Only `web/large`, `web/thumbnails` and safe `print-previews` belong in public page data. High-resolution print masters remain separate and private.

## Future manifest

Each record should map `id`, `largeImage`, `thumbnail`, `printPreview`, `width`, `height`, `title`, `location`, `year`, `categories`, `alt`, and `availableAsPrint`. Paths are relative to `NEXT_PUBLIC_MEDIA_BASE_URL`; local absolute paths beginning with `/` remain local. Validate IDs, dimensions, allowed extensions, visibility and duplicate slugs during import.
