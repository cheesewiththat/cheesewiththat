import { GoogleAnalytics } from "@next/third-parties/google";
import { getProductionAnalyticsId } from "@/lib/analytics-config";

export function SiteAnalytics({
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  nodeEnv = process.env.NODE_ENV,
}: {
  measurementId?: string;
  nodeEnv?: string;
}) {
  const configuredId = getProductionAnalyticsId({ measurementId, nodeEnv });
  if (!configuredId) return null;
  return <GoogleAnalytics gaId={configuredId} />;
}
