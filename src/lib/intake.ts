export type EngagementKind =
  | "direction"
  | "expert"
  | "working"
  | "idea"
  | "training"
  | "consulting"
  | "career"
  | "speaking";
export type BookingEngagementKind = "direction" | "expert" | "working" | "idea";
export type EnquiryEngagementKind = Exclude<
  EngagementKind,
  BookingEngagementKind
>;
export type EngagementWorkflow = "booking" | "enquiry";
export type IntakeField = {
  name: string;
  label: string;
  type: "text" | "email" | "url" | "textarea" | "number" | "date" | "select";
  required?: boolean;
  options?: string[];
  hint?: string;
};
export type IntakeSchema = {
  id: EngagementKind;
  workflow: EngagementWorkflow;
  title: string;
  description: string;
  fields: IntakeField[];
  calendlyEnvironment?: string;
};
const identity = (nameLabel = "Name"): IntakeField[] => [
  { name: "name", label: nameLabel, type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
];

export const intakeSchemas: Record<EngagementKind, IntakeSchema> = {
  direction: {
    id: "direction",
    workflow: "booking",
    title: "15-minute Direction Check",
    description: "One focused question and the context needed to answer it.",
    calendlyEnvironment: "NEXT_PUBLIC_CALENDLY_15_URL",
    fields: [
      ...identity(),
      { name: "topic", label: "Topic", type: "text", required: true },
      {
        name: "question",
        label: "The one question you want answered",
        type: "textarea",
        required: true,
      },
      {
        name: "context",
        label: "Short context",
        type: "textarea",
        required: true,
      },
      { name: "relevantLink", label: "Relevant link", type: "url" },
    ],
  },
  expert: {
    id: "expert",
    workflow: "booking",
    title: "30-minute Expert Session",
    description: "Focused perspective on a product, AI or telecom question.",
    calendlyEnvironment: "NEXT_PUBLIC_CALENDLY_30_URL",
    fields: [
      ...identity(),
      { name: "company", label: "Company", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "topic", label: "Topic", type: "text", required: true },
      {
        name: "currentSituation",
        label: "Current situation",
        type: "textarea",
        required: true,
      },
      {
        name: "desiredOutcome",
        label: "Desired outcome",
        type: "textarea",
        required: true,
      },
      { name: "relevantLinks", label: "Relevant links", type: "textarea" },
    ],
  },
  working: {
    id: "working",
    workflow: "booking",
    title: "60-minute Working Session",
    description: "Work through a problem and leave with a practical output.",
    calendlyEnvironment: "NEXT_PUBLIC_CALENDLY_60_URL",
    fields: [
      ...identity(),
      { name: "company", label: "Company", type: "text", required: true },
      { name: "website", label: "Website", type: "url" },
      {
        name: "problem",
        label: "Problem statement",
        type: "textarea",
        required: true,
      },
      {
        name: "currentApproach",
        label: "Current approach",
        type: "textarea",
        required: true,
      },
      {
        name: "requiredOutput",
        label: "Decision or output required",
        type: "textarea",
        required: true,
      },
      {
        name: "attendees",
        label: "Expected attendees",
        type: "number",
        required: true,
      },
      { name: "documents", label: "Documents or links", type: "textarea" },
    ],
  },
  idea: {
    id: "idea",
    workflow: "booking",
    title: "90-minute Idea Lab",
    description: "Pressure-test an idea, proposition, roadmap or programme.",
    calendlyEnvironment: "NEXT_PUBLIC_CALENDLY_90_URL",
    fields: [
      ...identity(),
      {
        name: "company",
        label: "Company or idea name",
        type: "text",
        required: true,
      },
      { name: "website", label: "Website if available", type: "url" },
      {
        name: "customer",
        label: "Target customer",
        type: "text",
        required: true,
      },
      {
        name: "problem",
        label: "Problem being solved",
        type: "textarea",
        required: true,
      },
      {
        name: "stage",
        label: "Current stage",
        type: "select",
        required: true,
        options: ["Idea", "Discovery", "Prototype", "Pilot", "Live product"],
      },
      {
        name: "requiredOutput",
        label: "Desired session output",
        type: "textarea",
        required: true,
      },
    ],
  },
  training: {
    id: "training",
    workflow: "enquiry",
    title: "Training discussion",
    description: "Shape a useful programme for the audience and context.",
    fields: [
      ...identity("Contact name"),
      {
        name: "organisation",
        label: "Organisation",
        type: "text",
        required: true,
      },
      { name: "website", label: "Organisation website", type: "url" },
      { name: "role", label: "Contact role", type: "text", required: true },
      {
        name: "audience",
        label: "Audience description",
        type: "textarea",
        required: true,
      },
      {
        name: "participants",
        label: "Approximate participant count",
        type: "number",
        required: true,
      },
      { name: "topic", label: "Training topic", type: "text", required: true },
      {
        name: "skillLevel",
        label: "Current skill level",
        type: "text",
        required: true,
      },
      {
        name: "format",
        label: "Preferred delivery format",
        type: "select",
        required: true,
        options: [
          "One-to-one coaching",
          "Corporate workshop",
          "Half-day",
          "Full-day",
          "Multi-week programme",
          "Conference session",
          "Guest lecture",
        ],
      },
      { name: "dates", label: "Preferred dates", type: "text" },
      {
        name: "location",
        label: "Location and time zone",
        type: "text",
        required: true,
      },
      {
        name: "objectives",
        label: "Learning objectives",
        type: "textarea",
        required: true,
      },
      { name: "context", label: "Additional context", type: "textarea" },
    ],
  },
  consulting: {
    id: "consulting",
    workflow: "enquiry",
    title: "Consulting discovery",
    description:
      "Give enough context to qualify the most useful next conversation.",
    fields: [
      ...identity("Contact name"),
      {
        name: "organisation",
        label: "Organisation",
        type: "text",
        required: true,
      },
      { name: "website", label: "Website", type: "url" },
      { name: "industry", label: "Industry", type: "text", required: true },
      {
        name: "challenge",
        label: "Business or technology challenge",
        type: "textarea",
        required: true,
      },
      {
        name: "environment",
        label: "Existing systems or environment",
        type: "textarea",
      },
      {
        name: "outcome",
        label: "Required outcome",
        type: "textarea",
        required: true,
      },
      {
        name: "timeline",
        label: "Indicative timeline",
        type: "text",
        required: true,
      },
      { name: "stakeholders", label: "Key stakeholders", type: "textarea" },
      {
        name: "model",
        label: "Preferred engagement model",
        type: "select",
        required: true,
        options: [
          "Focused advisory",
          "Defined consulting project",
          "Fractional support",
          "Not sure yet",
        ],
      },
      { name: "context", label: "Additional context", type: "textarea" },
    ],
  },
  career: {
    id: "career",
    workflow: "enquiry",
    title: "Employment or leadership conversation",
    description:
      "Share the role context without requesting sensitive personal information.",
    fields: [
      { name: "name", label: "Contact name", type: "text", required: true },
      { name: "email", label: "Work email", type: "email", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "website", label: "Website", type: "url" },
      { name: "roleTitle", label: "Role title", type: "text", required: true },
      {
        name: "engagementType",
        label: "Employment or engagement type",
        type: "select",
        required: true,
        options: ["Full-time", "Fractional", "Interim", "Advisory"],
      },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "reportingLine", label: "Reporting line", type: "text" },
      {
        name: "remit",
        label: "Brief role remit",
        type: "textarea",
        required: true,
      },
      { name: "salary", label: "Salary range (optional)", type: "text" },
      { name: "jobLink", label: "Job description link", type: "url" },
      { name: "context", label: "Additional context", type: "textarea" },
    ],
  },
  speaking: {
    id: "speaking",
    workflow: "enquiry",
    title: "Speaking enquiry",
    description: "Describe the event, audience and proposed contribution.",
    fields: [
      ...identity("Contact name"),
      {
        name: "organisation",
        label: "Organisation",
        type: "text",
        required: true,
      },
      { name: "event", label: "Event name", type: "text", required: true },
      { name: "website", label: "Event website", type: "url" },
      { name: "audience", label: "Audience", type: "textarea", required: true },
      { name: "topic", label: "Proposed topic", type: "text", required: true },
      { name: "format", label: "Format", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      {
        name: "location",
        label: "Location or virtual",
        type: "text",
        required: true,
      },
      { name: "attendance", label: "Expected attendance", type: "number" },
      {
        name: "budget",
        label: "Budget information if available",
        type: "text",
      },
      { name: "context", label: "Additional context", type: "textarea" },
    ],
  },
};

export const bookingEngagementKinds = Object.values(intakeSchemas)
  .filter((schema) => schema.workflow === "booking")
  .map((schema) => schema.id);

export const enquiryEngagementKinds = Object.values(intakeSchemas)
  .filter((schema) => schema.workflow === "enquiry")
  .map((schema) => schema.id);

export function getEngagementWorkflow(kind: EngagementKind) {
  return intakeSchemas[kind].workflow;
}

export function isBookingEngagement(
  kind: EngagementKind,
): kind is BookingEngagementKind {
  return getEngagementWorkflow(kind) === "booking";
}

export function validateIntake(
  kind: EngagementKind,
  values: Record<string, string>,
  elapsedMs = 3000,
) {
  const errors: Record<string, string> = {};
  if (values.companyWebsite) errors.form = "Submission rejected.";
  if (elapsedMs < 1500)
    errors.form = "Please take a moment to review the form.";
  for (const field of intakeSchemas[kind].fields) {
    const value = values[field.name]?.trim() ?? "";
    if (field.required && !value)
      errors[field.name] = `${field.label} is required.`;
    if (
      value &&
      field.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
      errors[field.name] = "Enter a valid email address.";
    if (value && field.type === "url") {
      try {
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        errors[field.name] = "Enter a full http or https URL.";
      }
    }
    if (value.length > 2000)
      errors[field.name] = "Keep this response under 2,000 characters.";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
