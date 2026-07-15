"use client";

import { FormEvent, useRef, useState } from "react";
import { submitPublicForm } from "@/lib/forms/client";
import { runWithSubmissionLock } from "@/lib/forms/submission-lock";
import { enquirySuccessMessage } from "@/lib/workflows";
import { trackEvent } from "@/lib/analytics";

const labels: Record<string, string> = {
  name: "Name",
  email: "Email",
  brief: "What would be useful?",
  product: "Print product",
  preferredSize: "Preferred size",
};

export const enquiryFailureMessage =
  "We couldn’t send your details just now. Your information is still here, so you can try again.";

export function EnquiryFailureNotice({ message }: { message: string }) {
  return (
    <div role="alert" className="mt-5 rounded-lg border border-racing p-4">
      <p>{message || enquiryFailureMessage}</p>
    </div>
  );
}

export function EnquiryForm({
  kind = "general",
  context = {},
}: {
  kind?: "general" | "cv" | "print";
  context?: Record<string, string>;
}) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    brief: "",
    companyWebsite: "",
  });
  const [status, setStatus] = useState<
    "idle" | "reviewing" | "submitting" | "failed" | "sent"
  >("idle");
  const [message, setMessage] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [clientSubmissionKey] = useState(
    () => `enquiry_${crypto.randomUUID().replaceAll("-", "")}`,
  );
  const statusRef = useRef<HTMLDivElement>(null);
  const submissionLock = useRef(false);

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("reviewing");
    setMessage("");
    window.requestAnimationFrame(() => statusRef.current?.focus());
  }

  async function send() {
    if (status === "submitting" || status === "sent") return;
    await runWithSubmissionLock(submissionLock, async () => {
      setStatus("submitting");
      setMessage("");
      const result = await submitPublicForm({
        formType: kind,
        values: { ...values, ...context },
        sourcePage: window.location.pathname,
        startedAt,
        clientSubmissionKey,
      });
      if (result.ok) {
        trackEvent(
          kind === "cv" ? "cv_request_submitted" : "enquiry_submitted",
          { destination_type: kind },
        );
        setStatus("sent");
        setSubmissionId(result.submissionId);
        window.requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      setStatus("failed");
      setMessage(result.message);
      window.requestAnimationFrame(() => statusRef.current?.focus());
    });
  }

  if (status === "sent")
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="card bg-chartreuse p-6"
      >
        <h3 className="font-serif text-3xl">Message sent.</h3>
        <p className="mt-2">{enquirySuccessMessage}</p>
        <p className="mt-3 font-mono text-xs">
          Submission {submissionId.slice(0, 8)}
        </p>
      </div>
    );

  if (status !== "idle") {
    const reviewValues = { ...values, ...context };
    return (
      <section className="card bg-cream p-6">
        <div ref={statusRef} tabIndex={-1}>
          <p className="eyebrow">Review · nothing has been sent yet</p>
          <h3 className="mt-3 font-serif text-3xl">Check your message.</h3>
        </div>
        <dl className="divide-ink/20 border-ink/20 mt-6 divide-y border-y">
          {Object.entries(reviewValues)
            .filter(([key, value]) => value && key !== "companyWebsite")
            .map(([key, value]) => (
              <div key={key} className="grid gap-2 py-3 sm:grid-cols-3">
                <dt className="text-sm font-semibold">{labels[key] ?? key}</dt>
                <dd className="whitespace-pre-wrap sm:col-span-2">{value}</dd>
              </div>
            ))}
        </dl>
        {status === "failed" && <EnquiryFailureNotice message={message} />}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={status === "submitting"}
            onClick={() => setStatus("idle")}
            className="button border border-ink"
          >
            Back and edit
          </button>
          <button
            type="button"
            disabled={status === "submitting"}
            onClick={send}
            className="button bg-ink text-cream disabled:cursor-wait disabled:opacity-60"
          >
            {status === "submitting"
              ? "Sending securely…"
              : status === "failed"
                ? "Try again"
                : "Send enquiry"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={review}
      className="card grid gap-5 bg-cream p-6"
      aria-label={`${kind} enquiry`}
    >
      <div>
        <label
          htmlFor={`${kind}-name`}
          className="mb-1 block text-sm font-semibold"
        >
          Name
        </label>
        <input
          id={`${kind}-name`}
          name="name"
          required
          maxLength={80}
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          className="w-full rounded-lg border-ink bg-white"
          autoComplete="name"
        />
      </div>
      <div>
        <label
          htmlFor={`${kind}-email`}
          className="mb-1 block text-sm font-semibold"
        >
          Email
        </label>
        <input
          id={`${kind}-email`}
          name="email"
          required
          type="email"
          maxLength={120}
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          className="w-full rounded-lg border-ink bg-white"
          autoComplete="email"
        />
      </div>
      <div>
        <label
          htmlFor={`${kind}-brief`}
          className="mb-1 block text-sm font-semibold"
        >
          What would be useful?
        </label>
        <textarea
          id={`${kind}-brief`}
          name="brief"
          required
          minLength={20}
          maxLength={1200}
          rows={5}
          value={values.brief}
          onChange={(event) => update("brief", event.target.value)}
          className="w-full rounded-lg border-ink bg-white"
        />
      </div>
      <input
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        value={values.companyWebsite}
        onChange={(event) => update("companyWebsite", event.target.value)}
      />
      <p className="text-xs text-ink">
        Your details are sent securely to Mihir and are not published.
      </p>
      <button className="button justify-self-start bg-ink text-cream">
        Review enquiry
      </button>
    </form>
  );
}
