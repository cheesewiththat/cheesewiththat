"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { buildCalendlyUrl } from "@/lib/calendly";
import { CalendlyEmbed } from "@/components/calendly/CalendlyEmbed";
import { submitPublicForm } from "@/lib/forms/client";
import { runWithSubmissionLock } from "@/lib/forms/submission-lock";
import { trackEvent } from "@/lib/analytics";
import { completeReviewWorkflow, enquirySuccessMessage } from "@/lib/workflows";
import {
  type EngagementKind,
  isBookingEngagement,
  intakeSchemas,
  validateIntake,
} from "@/lib/intake";

const engagementKinds = Object.keys(intakeSchemas) as EngagementKind[];

export function BookingFlow({ fixedKind }: { fixedKind?: EngagementKind }) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("type") as EngagementKind | null;
  const initialKind =
    fixedKind ??
    (requested && engagementKinds.includes(requested)
      ? requested
      : "direction");
  const [kind, setKind] = useState<EngagementKind>(initialKind);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(
    fixedKind || requested ? 2 : 1,
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startedAt] = useState(() => Date.now());
  const [confirmed, setConfirmed] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "submitting" | "failed" | "sent"
  >("idle");
  const [emailError, setEmailError] = useState("");
  const [submissionId, setSubmissionId] = useState<string>();
  const [clientSubmissionKey] = useState(
    () => `booking_${crypto.randomUUID().replaceAll("-", "")}`,
  );
  const emailStatusRef = useRef<HTMLDivElement>(null);
  const emailSubmissionLock = useRef(false);
  const schema = intakeSchemas[kind];
  const isBooking = isBookingEngagement(kind);
  const calendly = useMemo(
    () =>
      isBookingEngagement(kind)
        ? buildCalendlyUrl(kind, schema.title, values)
        : undefined,
    [kind, schema.title, values],
  );
  const confirmBooking = useCallback(() => setConfirmed(true), []);

  function update(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    setSubmissionId(undefined);
    setEmailStatus("idle");
    setEmailError("");
  }

  async function completeReview() {
    if (submissionId) return;
    if (!isBooking) {
      setEmailStatus("submitting");
      setEmailError("");
    }
    const complete = () =>
      completeReviewWorkflow(kind, () =>
        submitPublicForm({
          formType: kind as "training" | "consulting" | "speaking" | "career",
          values,
          sourcePage: window.location.pathname,
          startedAt,
          clientSubmissionKey,
        }),
      );
    const result = isBooking
      ? await complete()
      : await runWithSubmissionLock(emailSubmissionLock, complete);
    if (!result) return;
    if (result.destination === "calendly") {
      trackEvent("calendly_clicked", { destination_type: kind });
      setStep(4);
      return;
    }
    if (result.destination === "sent") {
      trackEvent("enquiry_submitted", { destination_type: kind });
      setSubmissionId(result.submissionId);
      setEmailStatus("sent");
      setStep(4);
      window.requestAnimationFrame(() => emailStatusRef.current?.focus());
      return;
    }
    setEmailStatus("failed");
    setEmailError(result.response.message);
    window.requestAnimationFrame(() => emailStatusRef.current?.focus());
  }
  function review() {
    const result = validateIntake(kind, values, Date.now() - startedAt);
    setErrors(result.errors);
    if (result.valid) setStep(3);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div
        aria-label="Engagement progress"
        className="mb-8 grid grid-cols-4 gap-2"
      >
        {["Choose", "Intake", "Review", isBooking ? "Schedule" : "Sent"].map(
          (label, index) => (
            <div
              key={label}
              className={`border-t-4 pt-2 text-xs ${step >= index + 1 ? "border-cobalt font-semibold" : "border-ink/15"}`}
            >
              <span className="sr-only">Step {index + 1}: </span>
              {label}
            </div>
          ),
        )}
      </div>

      {step === 1 && (
        <section>
          <h2 className="font-serif text-5xl">Choose a conversation</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {engagementKinds.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setKind(item);
                  setValues({});
                  setStep(2);
                }}
                className="card p-5 text-left hover:border-cobalt"
              >
                <span className="font-serif text-3xl">
                  {intakeSchemas[item].title}
                </span>
                <span className="mt-2 block text-sm">
                  {intakeSchemas[item].description}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <p className="eyebrow">Intake · {schema.title}</p>
          <h2 className="mt-4 font-serif text-5xl">
            The useful context first.
          </h2>
          <p className="mt-3 max-w-2xl">
            {isBooking
              ? "Your answers stay in this browser and are used only to prepare and prefill the matching Calendly booking after review."
              : "Your answers stay in this browser until you review them, then they are sent securely to Mihir by email."}
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {schema.fields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label
                  htmlFor={`intake-${field.name}`}
                  className="mb-2 block text-sm font-semibold"
                >
                  {field.label}
                  {field.required && <span aria-hidden> *</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={`intake-${field.name}`}
                    value={values[field.name] ?? ""}
                    onChange={(event) => update(field.name, event.target.value)}
                    rows={4}
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={
                      errors[field.name] ? `error-${field.name}` : undefined
                    }
                    className="border-ink/25 w-full rounded-lg bg-white"
                  />
                ) : field.type === "select" ? (
                  <select
                    id={`intake-${field.name}`}
                    value={values[field.name] ?? ""}
                    onChange={(event) => update(field.name, event.target.value)}
                    aria-invalid={Boolean(errors[field.name])}
                    className="border-ink/25 w-full rounded-lg bg-white"
                  >
                    <option value="">Select one</option>
                    {field.options?.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`intake-${field.name}`}
                    type={field.type}
                    value={values[field.name] ?? ""}
                    onChange={(event) => update(field.name, event.target.value)}
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={
                      errors[field.name] ? `error-${field.name}` : undefined
                    }
                    className="border-ink/25 w-full rounded-lg bg-white"
                  />
                )}
                {errors[field.name] && (
                  <p
                    id={`error-${field.name}`}
                    role="alert"
                    className="mt-2 text-sm text-racing"
                  >
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="hidden" aria-hidden>
            <label htmlFor="companyWebsite">Company website confirmation</label>
            <input
              id="companyWebsite"
              tabIndex={-1}
              autoComplete="off"
              value={values.companyWebsite ?? ""}
              onChange={(event) => update("companyWebsite", event.target.value)}
            />
          </div>
          {errors.form && (
            <p role="alert" className="mt-4 text-racing">
              {errors.form}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {!fixedKind && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="button border border-ink"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={review}
              className="button bg-ink text-cream"
            >
              Review information
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <p className="eyebrow">Review · nothing has been sent</p>
          <h2 className="mt-4 font-serif text-5xl">Check the context.</h2>
          <dl className="divide-ink/15 border-ink/20 mt-8 divide-y rounded-xl border bg-cream px-5">
            {schema.fields
              .filter((field) => values[field.name])
              .map((field) => (
                <div
                  key={field.name}
                  className="grid gap-2 py-4 md:grid-cols-3"
                >
                  <dt className="text-sm font-semibold">{field.label}</dt>
                  <dd className="whitespace-pre-wrap md:col-span-2">
                    {values[field.name]}
                  </dd>
                </div>
              ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="button border border-ink"
            >
              Back and edit
            </button>
            <button
              type="button"
              onClick={completeReview}
              disabled={emailStatus === "submitting"}
              className="button bg-ink text-cream"
            >
              {isBooking
                ? "Continue to scheduling"
                : emailStatus === "submitting"
                  ? "Sending securely…"
                  : "Send enquiry"}
            </button>
          </div>
          {emailStatus === "failed" && (
            <div
              ref={emailStatusRef}
              role="alert"
              tabIndex={-1}
              className="card mt-5 border-racing bg-cream p-5"
            >
              <p>{emailError}</p>
              <button
                type="button"
                onClick={completeReview}
                className="button mt-4 border border-ink"
              >
                Try again
              </button>
            </div>
          )}
        </section>
      )}

      {step === 4 && (
        <section>
          <p className="eyebrow">
            {isBooking ? "Schedule" : "Enquiry sent"} · {schema.title}
          </p>
          {!isBooking ? (
            <div
              ref={emailStatusRef}
              tabIndex={-1}
              className="card mt-5 border-teal bg-cream p-7"
              role="status"
            >
              <h2 className="font-serif text-5xl">Message sent.</h2>
              <p className="mt-3 font-semibold">{enquirySuccessMessage}</p>
              {submissionId && (
                <p className="mt-3 font-mono text-xs">
                  Submission {submissionId.slice(0, 8)}
                </p>
              )}
            </div>
          ) : confirmed ? (
            <div role="status" className="card bg-chartreuse/30 mt-5 p-7">
              <h2 className="font-serif text-5xl">Booking confirmed.</h2>
              <p className="mt-3">
                Calendly reported a completed booking. Check your email for the
                calendar details.
              </p>
            </div>
          ) : calendly?.url ? (
            <>
              {calendly.fallback && (
                <p className="card mt-5 border-brass bg-cream p-4 text-sm">
                  The specific event is unavailable, so this opens general
                  scheduling without implying a duration.
                </p>
              )}
              <CalendlyEmbed url={calendly.url} onScheduled={confirmBooking} />
            </>
          ) : (
            <div className="card mt-5 border-brass bg-cream p-7">
              <p className="eyebrow">Scheduling not configured</p>
              <h2 className="mt-4 font-serif text-5xl">
                Your information is still here.
              </h2>
              <p className="mt-4">
                The Calendly URL for this conversation has not been configured,
                so no widget or false confirmation is shown. Nothing has been
                delivered.
              </p>
              <p className="mt-3 font-mono text-xs">
                Configure {calendly?.missing ?? schema.calendlyEnvironment} to
                enable scheduling.
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setStep(3)}
            className="button mt-7 border border-ink"
          >
            Back to review
          </button>
        </section>
      )}
    </div>
  );
}
