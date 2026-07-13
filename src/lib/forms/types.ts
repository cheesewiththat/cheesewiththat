import {
  type EngagementKind,
  type EngagementWorkflow,
  type EnquiryEngagementKind,
  intakeSchemas,
} from "@/lib/intake";

export type FormType = EnquiryEngagementKind | "cv" | "print" | "general";
export type PublicWorkflowType = EngagementKind | "cv" | "print" | "general";

export const formTypes: FormType[] = [
  "training",
  "consulting",
  "speaking",
  "career",
  "cv",
  "print",
  "general",
];

export const formTypeLabels: Record<FormType, string> = {
  training: "Training",
  consulting: "Consulting",
  speaking: "Speaking",
  career: "Employment or Leadership",
  cv: "CV Request",
  print: "Print",
  general: "General Contact",
};

export const engagementEnquiryFormTypes: EnquiryEngagementKind[] = [
  "training",
  "consulting",
  "speaking",
  "career",
];

export const workflowByType: Record<PublicWorkflowType, EngagementWorkflow> = {
  direction: intakeSchemas.direction.workflow,
  expert: intakeSchemas.expert.workflow,
  working: intakeSchemas.working.workflow,
  idea: intakeSchemas.idea.workflow,
  training: intakeSchemas.training.workflow,
  consulting: intakeSchemas.consulting.workflow,
  speaking: intakeSchemas.speaking.workflow,
  career: intakeSchemas.career.workflow,
  cv: "enquiry",
  general: "enquiry",
  print: "enquiry",
};

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
