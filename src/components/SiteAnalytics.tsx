"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getProductionAnalyticsId } from "@/lib/analytics-config";

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
