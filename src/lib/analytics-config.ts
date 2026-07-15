const productionHosts = new Set([
  "cheesewiththat.com",
  "www.cheesewiththat.com",
]);

export function getProductionAnalyticsId({
  measurementId,
  enabled,
  hostname,
}: {
  measurementId?: string;
  enabled: boolean;
  hostname: string;
}) {
  const configuredId = measurementId?.trim();
  return enabled && configuredId && productionHosts.has(hostname)
    ? configuredId
    : undefined;
}

export function getBrowserProductionAnalyticsId() {
  if (typeof window === "undefined") return undefined;
  return getProductionAnalyticsId({
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    enabled: process.env.NEXT_PUBLIC_GA_ENABLED === "true",
    hostname: window.location.hostname,
  });
}
