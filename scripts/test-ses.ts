import { classifyEmailFailure } from "../src/lib/forms/diagnostics";
import {
  createSesProvider,
  getEmailConfiguration,
} from "../src/lib/forms/email";

async function main() {
  try {
    const configuration = getEmailConfiguration();
    const provider = createSesProvider(configuration.region);
    await provider.send({
      from: configuration.from,
      to: configuration.to,
      replyTo: configuration.from,
      subject: "[Cheesewiththat] SES delivery diagnostic",
      text: "This minimal message confirms the configured server-side SES provider can deliver email.",
      html: "<p>This minimal message confirms the configured server-side SES provider can deliver email.</p>",
    });
    console.info("SES diagnostic succeeded.");
  } catch (error) {
    const errorName =
      error && typeof error === "object" && "name" in error
        ? String(error.name)
        : "UnknownError";
    console.error("SES diagnostic failed.", {
      awsErrorName: errorName,
      classification: classifyEmailFailure(error),
    });
    process.exitCode = 1;
  }
}

void main();
