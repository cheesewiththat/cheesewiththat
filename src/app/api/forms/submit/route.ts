import { NextResponse } from "next/server";
import { checkFormRateLimit } from "@/lib/forms/rate-limit";
import { logEmailDeliveryFailure } from "@/lib/forms/diagnostics";
import { createSubmissionId } from "@/lib/forms/email";
import { deliverFormSubmission } from "@/lib/forms/service";
import { validateSubmissionPayload } from "@/lib/forms/validation";

export const runtime = "nodejs";
const maximumBodyBytes = 32 * 1024;

export async function POST(request: Request) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_content_type",
        message: "Submit the form as JSON.",
      },
      { status: 415 },
    );
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maximumBodyBytes)
    return NextResponse.json(
      {
        ok: false,
        code: "payload_too_large",
        message: "The form submission was too large.",
      },
      { status: 413 },
    );
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maximumBodyBytes)
    return NextResponse.json(
      {
        ok: false,
        code: "payload_too_large",
        message: "The form submission was too large.",
      },
      { status: 413 },
    );
  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_json",
        message: "The form submission was invalid.",
      },
      { status: 400 },
    );
  }
  const validation = validateSubmissionPayload(input);
  if (!validation.valid)
    return NextResponse.json(
      {
        ok: false,
        code: validation.code,
        message: validation.message,
        errors: validation.errors,
      },
      { status: 400 },
    );
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const rateLimit = checkFormRateLimit(forwarded || "anonymous");
  if (!rateLimit.allowed)
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        message: "Too many attempts. Please wait and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  const submissionId = createSubmissionId();
  try {
    const deliveredSubmissionId = await deliverFormSubmission(
      validation.submission,
      { submissionId },
    );
    return NextResponse.json({ ok: true, submissionId: deliveredSubmissionId });
  } catch (error) {
    logEmailDeliveryFailure({
      submissionId,
      formType: validation.submission.formType,
      error,
    });
    return NextResponse.json(
      {
        ok: false,
        code: "delivery_failed",
        message:
          "We couldn’t send your details just now. Your information is still here, so you can try again.",
      },
      { status: 503 },
    );
  }
}
