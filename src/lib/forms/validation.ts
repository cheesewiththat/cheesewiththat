import {
  intakeSchemas,
  validateIntake,
  type EngagementKind,
} from "@/lib/intake";
import { validateEnquiry } from "@/lib/validation";
import {
  bookableFormTypes,
  formTypes,
  type FormSubmissionRequest,
  type FormType,
} from "./types";

const generalFields = ["name", "email", "brief", "product", "preferredSize"];

export function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

export function isFormType(value: unknown): value is FormType {
  return typeof value === "string" && formTypes.includes(value as FormType);
}

function allowedFields(formType: FormType) {
  return bookableFormTypes.includes(formType)
    ? intakeSchemas[formType as EngagementKind].fields.map(
        (field) => field.name,
      )
    : generalFields;
}

export function validateSubmissionPayload(
  input: unknown,
  now = Date.now(),
):
  | { valid: true; submission: FormSubmissionRequest }
  | {
      valid: false;
      code: string;
      message: string;
      errors?: Record<string, string>;
    } {
  if (!input || typeof input !== "object")
    return {
      valid: false,
      code: "invalid_request",
      message: "The form submission was invalid.",
    };
  const raw = input as Record<string, unknown>;
  if (!isFormType(raw.formType))
    return {
      valid: false,
      code: "unknown_form",
      message: "That form type is not supported.",
    };
  if (
    !raw.values ||
    typeof raw.values !== "object" ||
    Array.isArray(raw.values)
  )
    return {
      valid: false,
      code: "invalid_request",
      message: "The submitted answers were invalid.",
    };
  if (
    typeof raw.startedAt !== "number" ||
    now - raw.startedAt < 1500 ||
    now - raw.startedAt > 86_400_000
  )
    return {
      valid: false,
      code: "spam_check",
      message: "Please take a moment to review the form and try again.",
    };
  if (
    typeof raw.sourcePage !== "string" ||
    !raw.sourcePage.startsWith("/") ||
    raw.sourcePage.length > 240
  )
    return {
      valid: false,
      code: "invalid_request",
      message: "The source page was invalid.",
    };
  if (
    typeof raw.clientSubmissionKey !== "string" ||
    !/^[a-zA-Z0-9_-]{12,100}$/.test(raw.clientSubmissionKey)
  )
    return {
      valid: false,
      code: "invalid_request",
      message: "The submission could not be identified.",
    };

  const rawValues = raw.values as Record<string, unknown>;
  if (rawValues.companyWebsite || rawValues.company_website)
    return {
      valid: false,
      code: "spam_check",
      message: "The form could not be submitted.",
    };
  const allowed = new Set([
    ...allowedFields(raw.formType),
    "companyWebsite",
    "company_website",
  ]);
  const values: Record<string, string> = {};
  let totalLength = 0;
  for (const [key, value] of Object.entries(rawValues)) {
    if (!allowed.has(key) || typeof value !== "string")
      return {
        valid: false,
        code: "invalid_request",
        message: "The submitted answers contained unsupported fields.",
      };
    const normalized = normalizeText(value);
    if (normalized.length > 2000)
      return {
        valid: false,
        code: "payload_too_large",
        message: "One or more answers were too long.",
      };
    values[key] = normalized;
    totalLength += normalized.length;
  }
  if (totalLength > 20_000)
    return {
      valid: false,
      code: "payload_too_large",
      message: "The form submission was too large.",
    };
  const email = values.email ?? "";
  const name = values.name ?? "";
  if (name.length < 2 || name.length > 80 || /\r|\n/.test(name))
    return {
      valid: false,
      code: "invalid_name",
      message: "Enter a valid name.",
      errors: { name: "Enter a valid name." },
    };
  if (email.length > 120)
    return {
      valid: false,
      code: "invalid_email",
      message: "Enter a valid email address.",
      errors: { email: "Enter a valid email address." },
    };
  if (/\r|\n/.test(email))
    return {
      valid: false,
      code: "invalid_email",
      message: "Enter a valid email address.",
      errors: { email: "Enter a valid email address." },
    };

  if (bookableFormTypes.includes(raw.formType)) {
    const result = validateIntake(
      raw.formType as EngagementKind,
      values,
      now - raw.startedAt,
    );
    if (!result.valid)
      return {
        valid: false,
        code: "validation_failed",
        message: "Check the highlighted fields and try again.",
        errors: result.errors,
      };
  } else {
    const result = validateEnquiry({
      name: values.name ?? "",
      email,
      brief: values.brief ?? "",
      companyWebsite: values.companyWebsite || values.company_website,
    });
    if (!result.valid)
      return {
        valid: false,
        code: "validation_failed",
        message: "Check the form details and try again.",
        errors: { form: result.errors.join(" ") },
      };
  }

  return {
    valid: true,
    submission: {
      formType: raw.formType,
      values,
      sourcePage: normalizeText(raw.sourcePage),
      startedAt: raw.startedAt,
      clientSubmissionKey: raw.clientSubmissionKey,
    },
  };
}
