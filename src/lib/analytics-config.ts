export function getProductionAnalyticsId({
  measurementId,
  nodeEnv,
}: {
  measurementId?: string;
  nodeEnv?: string;
}) {
  const configuredId = measurementId?.trim();
  return nodeEnv === "production" && configuredId ? configuredId : undefined;
}

export function getBrowserProductionAnalyticsId() {
  return getProductionAnalyticsId({
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    nodeEnv: process.env.NODE_ENV,
  });
}
