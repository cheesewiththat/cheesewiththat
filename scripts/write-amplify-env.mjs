import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const serverVariables = [
  "FORM_NOTIFICATION_TO_EMAIL",
  "FORM_NOTIFICATION_FROM_EMAIL",
  "SES_REGION",
];
const publicVariables = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_MEDIA_BASE_URL",
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  "NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID",
  "NEXT_PUBLIC_CALENDLY_15_URL",
  "NEXT_PUBLIC_CALENDLY_30_URL",
  "NEXT_PUBLIC_CALENDLY_60_URL",
  "NEXT_PUBLIC_CALENDLY_90_URL",
  "NEXT_PUBLIC_CALENDLY_FALLBACK_URL",
];

export function isAmplifyPullRequestPreview(environment) {
  return Boolean(environment.AWS_PULL_REQUEST_ID?.trim());
}

export function prepareAmplifyEnvironment(environment) {
  const missing = serverVariables.filter((name) => !environment[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required Amplify server configuration: ${missing.join(", ")}`,
    );
  }
  if (environment.SES_REGION?.trim() !== "ap-south-1") {
    throw new Error(
      "SES_REGION must be ap-south-1, matching the verified SES identities.",
    );
  }

  const isPullRequestPreview = isAmplifyPullRequestPreview(environment);
  const measurementId = environment.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const analyticsConfigured = Boolean(!isPullRequestPreview && measurementId);
  const configuredVariables = [...serverVariables, ...publicVariables].filter(
    (name) => environment[name] !== undefined,
  );
  const lines = configuredVariables.map(
    (name) => `${name}=${sanitizeEnvironmentValue(environment[name])}`,
  );

  if (analyticsConfigured) {
    configuredVariables.push("NEXT_PUBLIC_GA_MEASUREMENT_ID");
    lines.push(
      `NEXT_PUBLIC_GA_MEASUREMENT_ID=${sanitizeEnvironmentValue(measurementId)}`,
    );
  }

  return {
    analyticsConfigured,
    configuredVariables,
    isPullRequestPreview,
    lines,
  };
}

function sanitizeEnvironmentValue(value) {
  return value?.replace(/[\r\n]/g, "") ?? "";
}

function writeAmplifyEnvironment() {
  const prepared = prepareAmplifyEnvironment(process.env);
  writeFileSync(".env.production", `${prepared.lines.join("\n")}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  console.info(
    `Prepared .env.production with ${prepared.configuredVariables.length} allow-listed variables; analytics ${prepared.analyticsConfigured ? "configured" : "disabled"}${prepared.isPullRequestPreview ? " for pull-request preview" : ""}.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  writeAmplifyEnvironment();
}
