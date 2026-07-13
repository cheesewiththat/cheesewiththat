import type { FormSubmissionResponse } from "@/lib/forms/types";
import { getEngagementWorkflow, type EngagementKind } from "@/lib/intake";

export type ReviewWorkflowResult =
  | { destination: "calendly" }
  | { destination: "sent"; submissionId: string }
  | {
      destination: "retry";
      response: Exclude<FormSubmissionResponse, { ok: true }>;
    };

export const enquirySuccessMessage =
  "Thanks — your message has been sent to Mihir. He’ll review it and get back to you.";

export async function completeReviewWorkflow(
  kind: EngagementKind,
  sendEnquiry: () => Promise<FormSubmissionResponse>,
): Promise<ReviewWorkflowResult> {
  if (getEngagementWorkflow(kind) === "booking") {
    return { destination: "calendly" };
  }
  const response = await sendEnquiry();
  return response.ok
    ? { destination: "sent", submissionId: response.submissionId }
    : { destination: "retry", response };
}
