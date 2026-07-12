import type { EngagementKind } from "@/lib/intake";

export type FormType = EngagementKind | "cv" | "print" | "general";

export const formTypes: FormType[] = [
  "direction",
  "expert",
  "working",
  "idea",
  "training",
  "consulting",
  "speaking",
  "career",
  "cv",
  "print",
  "general",
];

export const formTypeLabels: Record<FormType, string> = {
  direction: "Direction Check",
  expert: "Expert Session",
  working: "Working Session",
  idea: "Idea Clinic",
  training: "Training",
  consulting: "Consulting",
  speaking: "Speaking",
  career: "Employment or Leadership",
  cv: "CV Request",
  print: "Print",
  general: "General Contact",
};

export const bookableFormTypes: FormType[] = [
  "direction",
  "expert",
  "working",
  "idea",
  "training",
  "consulting",
  "speaking",
  "career",
];

export type FormSubmissionRequest = {
  formType: FormType;
  values: Record<string, string>;
  sourcePage: string;
  startedAt: number;
  clientSubmissionKey: string;
};

export type FormSubmissionResponse =
  | { ok: true; submissionId: string }
  | {
      ok: false;
      code: string;
      message: string;
      errors?: Record<string, string>;
    };
