import type { EngagementKind } from "./intake";

export type CalendlyConfiguration = {
  fifteen?: string;
  thirty?: string;
  sixty?: string;
  ninety?: string;
  fallback?: string;
};

export type CalendlyEventName =
  | "calendly.profile_page_viewed"
  | "calendly.event_type_viewed"
  | "calendly.date_and_time_selected"
  | "calendly.event_scheduled";

export const calendlyConfiguration: CalendlyConfiguration = {
  fifteen: process.env.NEXT_PUBLIC_CALENDLY_15_URL,
  thirty: process.env.NEXT_PUBLIC_CALENDLY_30_URL,
  sixty: process.env.NEXT_PUBLIC_CALENDLY_60_URL,
  ninety: process.env.NEXT_PUBLIC_CALENDLY_90_URL,
  fallback: process.env.NEXT_PUBLIC_CALENDLY_FALLBACK_URL,
};

export const engagementToCalendlyEvent: Record<
  EngagementKind,
  keyof Pick<CalendlyConfiguration, "fifteen" | "thirty" | "sixty" | "ninety">
> = {
  direction: "fifteen",
  expert: "thirty",
  working: "sixty",
  idea: "ninety",
  training: "thirty",
  consulting: "thirty",
  speaking: "thirty",
  career: "thirty",
};

export const temporaryDiscoveryKinds: EngagementKind[] = [
  "training",
  "consulting",
  "speaking",
  "career",
];

const knownFallback =
  "https://calendly.com/mihirsatokar?hide_landing_page_details=1&hide_gdpr_banner=1";

function validCalendlyUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      (url.hostname === "calendly.com" ||
        url.hostname.endsWith(".calendly.com"))
      ? url
      : undefined;
  } catch {
    return undefined;
  }
}

export function resolveCalendlyEvent(
  kind: EngagementKind,
  configuration: CalendlyConfiguration = calendlyConfiguration,
  environment = process.env.NODE_ENV,
) {
  const configurationKey = engagementToCalendlyEvent[kind];
  const specific = validCalendlyUrl(configuration[configurationKey]);
  if (specific) {
    return { url: specific.toString(), fallback: false, missing: undefined };
  }
  const missing = `NEXT_PUBLIC_CALENDLY_${{ fifteen: "15", thirty: "30", sixty: "60", ninety: "90" }[configurationKey]}_URL`;
  if (environment === "development") {
    return { url: undefined, fallback: false, missing };
  }
  const fallback =
    validCalendlyUrl(configuration.fallback) ?? new URL(knownFallback);
  return { url: fallback.toString(), fallback: true, missing };
}

const summaryFields: Partial<Record<EngagementKind, string[]>> = {
  direction: ["topic", "question", "context"],
  expert: ["company", "topic", "desiredOutcome"],
  working: ["company", "problem", "requiredOutput"],
  idea: ["company", "customer", "problem", "requiredOutput"],
  training: ["organisation", "topic", "objectives"],
  consulting: ["organisation", "challenge", "outcome"],
  speaking: ["organisation", "event", "topic"],
  career: ["company", "roleTitle", "remit"],
};

function cleanPrefillValue(value: string, limit: number) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

export function buildBookingSummary(
  kind: EngagementKind,
  title: string,
  values: Record<string, string>,
  limit = 480,
) {
  const parts = [`Engagement: ${title}`];
  for (const field of summaryFields[kind] ?? []) {
    const value = values[field];
    if (value?.trim()) parts.push(`${field}: ${cleanPrefillValue(value, 140)}`);
  }
  return cleanPrefillValue(parts.join(" | "), limit);
}

export function buildCalendlyUrl(
  kind: EngagementKind,
  title: string,
  values: Record<string, string>,
  configuration: CalendlyConfiguration = calendlyConfiguration,
  environment = process.env.NODE_ENV,
) {
  const resolution = resolveCalendlyEvent(kind, configuration, environment);
  if (!resolution.url) return resolution;
  const url = new URL(resolution.url);
  const name = cleanPrefillValue(values.name ?? "", 100);
  const email = cleanPrefillValue(values.email ?? "", 160);
  const summary = buildBookingSummary(kind, title, values);
  if (name) url.searchParams.set("name", name);
  if (email) url.searchParams.set("email", email);
  if (summary) url.searchParams.set("a1", summary);
  return { ...resolution, url: url.toString() };
}

export function getCalendlyEventName(
  data: unknown,
): CalendlyEventName | undefined {
  if (typeof data !== "object" || data === null || !("event" in data))
    return undefined;
  const event = (data as { event?: unknown }).event;
  return [
    "calendly.profile_page_viewed",
    "calendly.event_type_viewed",
    "calendly.date_and_time_selected",
    "calendly.event_scheduled",
  ].includes(String(event))
    ? (event as CalendlyEventName)
    : undefined;
}

export function isBookingCompletion(eventName: CalendlyEventName) {
  return eventName === "calendly.event_scheduled";
}

export function isTrustedCalendlyMessage(
  event: Pick<MessageEvent, "origin" | "source" | "data">,
  expectedSource: MessageEventSource | null,
) {
  return (
    event.origin === "https://calendly.com" &&
    Boolean(expectedSource) &&
    event.source === expectedSource &&
    Boolean(getCalendlyEventName(event.data))
  );
}

export function subscribeToCalendlyEvents(
  target: Pick<Window, "addEventListener" | "removeEventListener">,
  expectedSource: () => MessageEventSource | null,
  listener: (eventName: CalendlyEventName) => void,
) {
  const receive = (event: MessageEvent) => {
    if (!isTrustedCalendlyMessage(event, expectedSource())) return;
    const eventName = getCalendlyEventName(event.data);
    if (eventName) listener(eventName);
  };
  target.addEventListener("message", receive as EventListener);
  return () => target.removeEventListener("message", receive as EventListener);
}
