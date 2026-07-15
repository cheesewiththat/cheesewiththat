import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const productionBranch = "main";
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

export function isAmplifyProductionBuild(environment) {
  return Boolean(
    environment.AWS_APP_ID?.trim() &&
    environment.AWS_BRANCH === productionBranch &&
    !environment.AWS_PULL_REQUEST_ID?.trim(),
  );
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

  const analyticsEnabled = isAmplifyProductionBuild(environment);
  const measurementId = environment.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (analyticsEnabled && !measurementId) {
    throw new Error(
      "NEXT_PUBLIC_GA_MEASUREMENT_ID is required for the production Amplify branch.",
    );
  }

  const configuredVariables = [...serverVariables, ...publicVariables].filter(
    (name) => environment[name] !== undefined,
  );
  const lines = configuredVariables.map(
    (name) => `${name}=${sanitizeEnvironmentValue(environment[name])}`,
  );

  if (analyticsEnabled) {
    configuredVariables.push(
      "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      "NEXT_PUBLIC_GA_ENABLED",
    );
    lines.push(
      `NEXT_PUBLIC_GA_MEASUREMENT_ID=${sanitizeEnvironmentValue(measurementId)}`,
      "NEXT_PUBLIC_GA_ENABLED=true",
    );
  }

  return { analyticsEnabled, configuredVariables, lines };
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
    `Prepared .env.production with ${prepared.configuredVariables.length} allow-listed variables; production analytics ${prepared.analyticsEnabled ? "enabled" : "disabled"}.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  writeAmplifyEnvironment();
}
