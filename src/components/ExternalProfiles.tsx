"use client";

import { externalProfiles } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

export function ExternalProfiles({ compact = false }: { compact?: boolean }) {
  const configured = externalProfiles.filter(
    (profile) => profile.configured && profile.href,
  );
  if (!configured.length) return null;
  return (
    <section
      aria-labelledby={
        compact ? "find-me-elsewhere-footer" : "find-me-elsewhere"
      }
    >
      <h2
        id={compact ? "find-me-elsewhere-footer" : "find-me-elsewhere"}
        className="eyebrow"
      >
        Find me elsewhere
      </h2>
      <ul className={`mt-4 flex flex-wrap ${compact ? "gap-4" : "gap-3"}`}>
        {configured.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("external_link_clicked", {
                  link_label: profile.label,
                  destination_type: profile.id,
                })
              }
              className={
                compact
                  ? "underline decoration-white/30 hover:decoration-white"
                  : "border-current/25 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-ink hover:text-cream"
              }
            >
              {profile.label} <span aria-hidden>↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
