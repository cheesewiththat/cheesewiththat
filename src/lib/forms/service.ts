import {
  buildNotificationEmail,
  createSesProvider,
  createSubmissionId,
  getEmailConfiguration,
  type EmailProvider,
} from "./email";
import type { FormSubmissionRequest } from "./types";

const completed = new Map<
  string,
  { submissionId: string; expiresAt: number }
>();
const inFlight = new Map<string, Promise<string>>();

export async function deliverFormSubmission(
  submission: FormSubmissionRequest,
  dependencies?: {
    provider?: EmailProvider;
    now?: Date;
    configuration?: { from: string; to: string; region: string };
  },
) {
  const now = dependencies?.now ?? new Date();
  const existing = completed.get(submission.clientSubmissionKey);
  if (existing && existing.expiresAt > now.getTime())
    return existing.submissionId;
  const pending = inFlight.get(submission.clientSubmissionKey);
  if (pending) return pending;
  const promise = (async () => {
    const configuration =
      dependencies?.configuration ?? getEmailConfiguration();
    const provider =
      dependencies?.provider ?? createSesProvider(configuration.region);
    const submissionId = createSubmissionId();
    const message = buildNotificationEmail(
      submission,
      submissionId,
      configuration,
      now,
    );
    await provider.send(message);
    completed.set(submission.clientSubmissionKey, {
      submissionId,
      expiresAt: now.getTime() + 10 * 60 * 1000,
    });
    return submissionId;
  })();
  inFlight.set(submission.clientSubmissionKey, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(submission.clientSubmissionKey);
  }
}

export function resetSubmissionDeduplication() {
  completed.clear();
  inFlight.clear();
}
