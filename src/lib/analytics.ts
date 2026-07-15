"use client";

export type AnalyticsEventName =
  | "cv_request_submitted"
  | "enquiry_submitted"
  | "calendly_clicked"
  | "external_link_clicked"
  | "map_filter_changed"
  | "map_location_selected";

export type AnalyticsParameterKey =
  | "link_label"
  | "destination_type"
  | "location_name"
  | "location_category"
  | "filter_value"
  | "page_path";

export type AnalyticsEventParameters = Partial<
  Record<AnalyticsParameterKey, string>
>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: AnalyticsEventName,
      parameters: AnalyticsEventParameters,
    ) => void;
  }
}

const allowedParameterKeys = new Set<AnalyticsParameterKey>([
  "link_label",
  "destination_type",
  "location_name",
  "location_category",
  "filter_value",
  "page_path",
]);
const duplicateWindowMs = 750;
let previousEvent: { signature: string; sentAt: number } | undefined;

export function trackEvent(
  eventName: AnalyticsEventName,
  parameters: AnalyticsEventParameters = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter(
      ([key, value]) =>
        allowedParameterKeys.has(key as AnalyticsParameterKey) &&
        typeof value === "string" &&
        value.length > 0,
    ),
  ) as AnalyticsEventParameters;
  safeParameters.page_path ??= window.location.pathname;

  const signature = `${eventName}:${JSON.stringify(safeParameters)}`;
  const now = Date.now();
  if (
    previousEvent?.signature === signature &&
    now - previousEvent.sentAt < duplicateWindowMs
  )
    return;

  try {
    window.gtag("event", eventName, safeParameters);
    previousEvent = { signature, sentAt: now };
  } catch {
    // Analytics must never interrupt navigation, forms or integrations.
  }
}

export function resetAnalyticsForTests() {
  previousEvent = undefined;
}
