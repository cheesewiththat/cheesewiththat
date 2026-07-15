"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

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

export function SiteAnalytics({
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  enabled = process.env.NEXT_PUBLIC_GA_ENABLED === "true",
}: {
  measurementId?: string;
  enabled?: boolean;
}) {
  const [approvedId, setApprovedId] = useState<string>();

  useEffect(() => {
    setApprovedId(
      getProductionAnalyticsId({
        measurementId,
        enabled,
        hostname: window.location.hostname,
      }),
    );
  }, [enabled, measurementId]);

  if (!approvedId) return null;
  return <GoogleAnalytics gaId={approvedId} />;
}
