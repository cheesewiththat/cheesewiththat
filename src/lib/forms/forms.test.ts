import { describe, expect, it, beforeEach } from "vitest";
import { POST } from "@/app/api/forms/submit/route";
import { intakeSchemas, type EngagementKind } from "@/lib/intake";
import { canProceedToScheduling, submitPublicForm } from "./client";
import {
  buildNotificationEmail,
  escapeHtml,
  getEmailConfiguration,
  type EmailMessage,
  type EmailProvider,
} from "./email";
import { resetFormRateLimits } from "./rate-limit";
import { deliverFormSubmission, resetSubmissionDeduplication } from "./service";
import { formTypes, type FormSubmissionRequest, type FormType } from "./types";
import { validateSubmissionPayload } from "./validation";

const now = Date.now();

function valuesFor(formType: FormType) {
  if (["cv", "print", "general"].includes(formType)) {
    return {
      name: "Jane Smith",
      email: "jane@example.com",
      brief: "This is a sufficiently detailed enquiry for Mihir.",
      ...(formType === "print"
        ? { product: "Blue Hour", preferredSize: "A2" }
        : {}),
    };
  }
  return Object.fromEntries(
    intakeSchemas[formType as EngagementKind].fields.map((field) => [
      field.name,
      field.name === "name"
        ? "Jane Smith"
        : field.name === "email"
          ? "jane@example.com"
          : field.type === "url"
            ? "https://example.com/context"
            : field.type === "number"
              ? "12"
              : field.type === "date"
                ? "2026-09-01"
                : field.type === "select"
                  ? (field.options?.[0] ?? "Selected")
                  : `Useful response for ${field.label}`,
    ]),
  );
}

function submission(
  formType: FormType,
  overrides: Partial<FormSubmissionRequest> = {},
): FormSubmissionRequest {
  return {
    formType,
    values: valuesFor(formType),
    sourcePage: "/engage/book",
    startedAt: now - 3000,
    clientSubmissionKey: `submission_${formType}_123456789`,
    ...overrides,
  };
}

class RecordingProvider implements EmailProvider {
  messages: EmailMessage[] = [];
  constructor(private readonly failure = false) {}
  async send(message: EmailMessage) {
    this.messages.push(message);
    if (this.failure) throw new Error("Sensitive provider failure");
  }
}

beforeEach(() => {
  resetSubmissionDeduplication();
  resetFormRateLimits();
});

describe("form submission validation", () => {
  it.each(formTypes)("accepts valid %s submissions", (formType) => {
    expect(validateSubmissionPayload(submission(formType), now).valid).toBe(
      true,
    );
  });
  it("rejects unknown forms", () => {
    expect(
      validateSubmissionPayload(
        { ...submission("general"), formType: "unknown" },
        now,
      ),
    ).toMatchObject({ valid: false, code: "unknown_form" });
  });
  it("rejects invalid email and URL fields", () => {
    expect(
      validateSubmissionPayload(
        submission("general", {
          values: { ...valuesFor("general"), email: "invalid" },
        }),
        now,
      ),
    ).toMatchObject({ valid: false });
    expect(
      validateSubmissionPayload(
        submission("working", {
          values: { ...valuesFor("working"), website: "not-a-url" },
        }),
        now,
      ),
    ).toMatchObject({ valid: false });
  });
  it("rejects header injection, honeypots, fast and oversized requests", () => {
    expect(
      validateSubmissionPayload(
        submission("general", {
          values: {
            ...valuesFor("general"),
            email: "jane@example.com\nBcc:x@example.com",
          },
        }),
        now,
      ),
    ).toMatchObject({ valid: false, code: "invalid_email" });
    expect(
      validateSubmissionPayload(
        submission("general", {
          values: { ...valuesFor("general"), companyWebsite: "spam" },
        }),
        now,
      ),
    ).toMatchObject({ valid: false, code: "spam_check" });
    expect(
      validateSubmissionPayload(
        submission("general", { startedAt: now - 100 }),
        now,
      ),
    ).toMatchObject({ valid: false, code: "spam_check" });
    expect(
      validateSubmissionPayload(
        submission("general", {
          values: { ...valuesFor("general"), brief: "x".repeat(3000) },
        }),
        now,
      ),
    ).toMatchObject({ valid: false, code: "payload_too_large" });
  });
  it("rejects browser attempts to override routing addresses", () => {
    expect(
      validateSubmissionPayload(
        submission("general", {
          values: {
            ...valuesFor("general"),
            to: "attacker@example.com",
            from: "attacker@example.com",
          },
        }),
        now,
      ),
    ).toMatchObject({ valid: false, code: "invalid_request" });
  });
});

describe("SES notification construction", () => {
  const configuration = {
    from: "mihir@cheesewiththat.com",
    to: "mihirsatokar@gmail.com",
    region: "ap-southeast-2",
  };
  it("uses only server sender/recipient and validated visitor reply-to", () => {
    const message = buildNotificationEmail(
      submission("consulting"),
      "81d12345-test",
      configuration,
      new Date("2026-07-12T00:00:00Z"),
    );
    expect(message.from).toBe(configuration.from);
    expect(message.to).toBe(configuration.to);
    expect(message.replyTo).toBe("jane@example.com");
  });
  it("reads fixed addressing and region from server-only configuration", () => {
    expect(
      getEmailConfiguration({
        FORM_NOTIFICATION_TO_EMAIL: configuration.to,
        FORM_NOTIFICATION_FROM_EMAIL: configuration.from,
        AWS_SES_REGION: configuration.region,
      }),
    ).toEqual(configuration);
  });
  it("escapes HTML and includes HTML, text, submitted fields and unscheduled Calendly status", () => {
    const dangerous = submission("direction", {
      values: {
        ...valuesFor("direction"),
        context: "<script>alert('x')</script>",
      },
    });
    const message = buildNotificationEmail(
      dangerous,
      "abc12345-test",
      configuration,
    );
    expect(message.html).not.toContain("<script>");
    expect(message.html).toContain("&lt;script&gt;");
    expect(message.text).toContain("Not yet scheduled");
    expect(message.html).toContain("Useful response for Topic");
    expect(escapeHtml("<&")).toBe("&lt;&amp;");
  });
});

describe("delivery, deduplication and safe responses", () => {
  const configuration = {
    from: "mihir@cheesewiththat.com",
    to: "mihirsatokar@gmail.com",
    region: "ap-southeast-2",
  };
  it("returns a unique submission ID only after provider success", async () => {
    const provider = new RecordingProvider();
    const id = await deliverFormSubmission(submission("cv"), {
      provider,
      configuration,
    });
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(provider.messages).toHaveLength(1);
  });
  it("does not send duplicate actions twice", async () => {
    const provider = new RecordingProvider();
    const item = submission("print");
    const [first, second] = await Promise.all([
      deliverFormSubmission(item, { provider, configuration }),
      deliverFormSubmission(item, { provider, configuration }),
    ]);
    expect(first).toBe(second);
    expect(provider.messages).toHaveLength(1);
  });
  it("returns a safe endpoint error when SES/configuration fails", async () => {
    const request = new Request("http://localhost/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        submission("general", {
          clientSubmissionKey: "endpoint_failure_123456",
        }),
      ),
    });
    const response = await POST(request);
    const result = await response.json();
    expect(response.status).toBe(503);
    expect(result).toEqual({
      ok: false,
      code: "delivery_failed",
      message:
        "We couldn’t send your details just now. Your information is still here, so you can try again.",
    });
    expect(JSON.stringify(result)).not.toContain("AWS");
  });
  it("gates Calendly on successful email and preserves the submitted object on failure", async () => {
    const success = { ok: true as const, submissionId: "id" };
    const failure = {
      ok: false as const,
      code: "delivery_failed",
      message: "Try again",
    };
    expect(canProceedToScheduling(success)).toBe(true);
    expect(canProceedToScheduling(failure)).toBe(false);
    const original = submission("direction");
    const fetcher = async () =>
      new Response(JSON.stringify(failure), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    await submitPublicForm(original, fetcher as typeof fetch);
    expect(original.values).toEqual(valuesFor("direction"));
  });
});
