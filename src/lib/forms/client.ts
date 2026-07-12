import type { FormSubmissionRequest, FormSubmissionResponse } from "./types";

export async function submitPublicForm(
  submission: FormSubmissionRequest,
  fetcher: typeof fetch = fetch,
): Promise<FormSubmissionResponse> {
  try {
    const response = await fetcher("/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    const result = (await response.json()) as FormSubmissionResponse;
    if (!result || typeof result !== "object" || !("ok" in result))
      throw new Error("Invalid response");
    return result;
  } catch {
    return {
      ok: false,
      code: "network_error",
      message:
        "We couldn’t send your details just now. Your information is still here, so you can try again.",
    };
  }
}

export function canProceedToScheduling(result: FormSubmissionResponse) {
  return result.ok;
}
