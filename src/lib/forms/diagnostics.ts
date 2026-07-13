import type { FormType } from "./types";

export type EmailFailureClassification =
  | "missing-configuration"
  | "credentials-unavailable"
  | "access-denied"
  | "identity-not-verified"
  | "region-mismatch"
  | "provider-timeout"
  | "message-rejected"
  | "provider-error";

export class EmailConfigurationError extends Error {
  constructor(
    message: string,
    readonly classification: Extract<
      EmailFailureClassification,
      "missing-configuration" | "region-mismatch"
    > = "missing-configuration",
  ) {
    super(message);
    this.name = "EmailConfigurationError";
  }
}

function errorDetails(error: unknown) {
  if (!error || typeof error !== "object")
    return { name: "UnknownError", message: "" };
  const candidate = error as { name?: unknown; message?: unknown };
  return {
    name: typeof candidate.name === "string" ? candidate.name : "UnknownError",
    message:
      typeof candidate.message === "string"
        ? candidate.message.toLowerCase()
        : "",
  };
}

export function classifyEmailFailure(
  error: unknown,
): EmailFailureClassification {
  if (error instanceof EmailConfigurationError) return error.classification;
  const { name, message } = errorDetails(error);
  if (
    ["CredentialsProviderError", "CredentialsProviderTimeoutError"].includes(
      name,
    )
  )
    return "credentials-unavailable";
  if (
    ["AccessDenied", "AccessDeniedException", "UnauthorizedException"].includes(
      name,
    )
  )
    return "access-denied";
  if (
    ["InvalidSignatureException", "SignatureDoesNotMatch"].includes(name) ||
    message.includes("credential should be scoped to a valid region") ||
    message.includes("invalid region")
  )
    return "region-mismatch";
  if (
    (message.includes("identity") ||
      message.includes("identities") ||
      message.includes("email address")) &&
    (message.includes("not verified") || message.includes("verification"))
  )
    return "identity-not-verified";
  if (
    [
      "AbortError",
      "TimeoutError",
      "RequestTimeout",
      "RequestTimeoutException",
    ].includes(name)
  )
    return "provider-timeout";
  if (["MessageRejected", "MessageRejectedException"].includes(name))
    return "message-rejected";
  return "provider-error";
}

export function logEmailDeliveryFailure(
  input: {
    submissionId: string;
    formType: FormType;
    error: unknown;
    timestamp?: Date;
    environment?: Record<string, string | undefined>;
  },
  logger: (
    label: string,
    details: Record<string, unknown>,
  ) => void = console.error,
) {
  const environment = input.environment ?? process.env;
  const { name } = errorDetails(input.error);
  logger("Form email delivery failed", {
    submissionId: input.submissionId,
    formType: input.formType,
    timestamp: (input.timestamp ?? new Date()).toISOString(),
    sesRegionConfigured: Boolean(environment.SES_REGION?.trim()),
    senderConfigured: Boolean(environment.FORM_NOTIFICATION_FROM_EMAIL?.trim()),
    recipientConfigured: Boolean(
      environment.FORM_NOTIFICATION_TO_EMAIL?.trim(),
    ),
    awsErrorName: name,
    classification: classifyEmailFailure(input.error),
  });
}
