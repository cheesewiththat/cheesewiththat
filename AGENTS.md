# Cheesewiththat — Agent Instructions

## Project purpose

This repository contains `cheesewiththat.com`, Mihir’s public personal brand, professional portfolio, consulting, training, photography and commerce website. Balance professional credibility, editorial elegance, technical depth, personal warmth, controlled eccentricity and clear commercial routes. Never turn it into a generic résumé or a novelty site. The guiding phrase is “Mihir—with context.”

## Technology and conventions

- Next.js 15 App Router, strict TypeScript, Tailwind CSS, npm and AWS Amplify Hosting.
- Prefer Server Components. Use Client Components only for real interaction.
- Keep content in `src/content`; keep provider boundaries in `src/lib/adapters`.
- Avoid unnecessary dependencies and never commit credentials or private personal data.
- Do not fabricate outcomes, clients, reviews, availability, prices or transactions.
- Meet WCAG 2.2 AA fundamentals and respect reduced motion.

## Standard commands

Before completing a task, run the applicable commands:

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

Update documentation when architecture, content conventions, deployment or integrations change.
