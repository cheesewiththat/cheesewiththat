import { writeFileSync } from "node:fs";

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
const missing = serverVariables.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  throw new Error(
    `Missing required Amplify server configuration: ${missing.join(", ")}`,
  );
}
if (process.env.SES_REGION?.trim() !== "ap-south-1") {
  throw new Error(
    "SES_REGION must be ap-south-1, matching the verified SES identities.",
  );
}

const configuredVariables = [...serverVariables, ...publicVariables].filter(
  (name) => process.env[name] !== undefined,
);
const lines = configuredVariables.map(
  (name) => `${name}=${process.env[name]?.replace(/[\r\n]/g, "") ?? ""}`,
);

writeFileSync(".env.production", `${lines.join("\n")}\n`, {
  encoding: "utf8",
  mode: 0o600,
});
console.info(
  `Prepared .env.production with ${configuredVariables.length} allow-listed variables.`,
);
