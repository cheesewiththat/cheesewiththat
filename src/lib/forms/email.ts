import { randomUUID } from "node:crypto";
import {
  SendEmailCommand,
  SESv2Client,
  type SESv2ClientConfig,
} from "@aws-sdk/client-sesv2";
import { intakeSchemas, type EnquiryEngagementKind } from "@/lib/intake";
import { EmailConfigurationError } from "./diagnostics";
import {
  engagementEnquiryFormTypes,
  formTypeLabels,
  type FormSubmissionRequest,
  type FormType,
} from "./types";

export type EmailMessage = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export function getEmailConfiguration(
  environment: Record<string, string | undefined> = process.env,
) {
  const to = environment.FORM_NOTIFICATION_TO_EMAIL?.trim();
  const from = environment.FORM_NOTIFICATION_FROM_EMAIL?.trim();
  const region = environment.SES_REGION?.trim();
  if (!to || !from || !region)
    throw new EmailConfigurationError("Email delivery is not configured");
  if (
    ![to, from].every((value) =>
      /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(value),
    )
  )
    throw new EmailConfigurationError(
      "Email delivery configuration is invalid",
    );
  if (region !== "ap-south-1")
    throw new EmailConfigurationError(
      "Email delivery region does not match the verified SES identity region",
      "region-mismatch",
    );
  return { to, from, region };
}

export class SesEmailProvider implements EmailProvider {
  constructor(private readonly client: SESv2Client) {}
  async send(message: EmailMessage) {
    await this.client.send(
      new SendEmailCommand({
        FromEmailAddress: message.from,
        Destination: { ToAddresses: [message.to] },
        ReplyToAddresses: [message.replyTo],
        Content: {
          Simple: {
            Subject: { Data: message.subject, Charset: "UTF-8" },
            Body: {
              Html: { Data: message.html, Charset: "UTF-8" },
              Text: { Data: message.text, Charset: "UTF-8" },
            },
          },
        },
      }),
    );
  }
}

export function getSesClientConfiguration(region: string): SESv2ClientConfig {
  return { region };
}

export function createSesProvider(region: string) {
  return new SesEmailProvider(
    new SESv2Client(getSesClientConfiguration(region)),
  );
}

export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
}

const genericLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  brief: "Message",
  product: "Print product",
  preferredSize: "Preferred size",
};

function answerLabels(formType: FormType) {
  if (!engagementEnquiryFormTypes.includes(formType as EnquiryEngagementKind))
    return genericLabels;
  return Object.fromEntries(
    intakeSchemas[formType as EnquiryEngagementKind].fields.map((field) => [
      field.name,
      field.label,
    ]),
  );
}

export function buildNotificationEmail(
  submission: FormSubmissionRequest,
  submissionId: string,
  configuration: { from: string; to: string },
  submittedAt = new Date(),
): EmailMessage {
  const label = formTypeLabels[submission.formType];
  const name = submission.values.name;
  const email = submission.values.email;
  if (!name || !email || /[\r\n]/.test(email))
    throw new Error("Invalid reply address");
  const labels = answerLabels(submission.formType);
  const rows = Object.entries(submission.values).filter(
    ([key, value]) =>
      value && !["companyWebsite", "company_website"].includes(key),
  );
  const summary: Array<[string, string]> = [
    ["Form type", label],
    ["Submission ID", submissionId],
    ["Submitted", submittedAt.toISOString()],
    ["Visitor name", name],
    ["Visitor email", email],
    ["Selected engagement", label],
    ["Source page", submission.sourcePage],
  ];
  const organisation =
    submission.values.company || submission.values.organisation;
  if (organisation) summary.push(["Company or organisation", organisation]);
  if (submission.values.website)
    summary.push(["Website", submission.values.website]);
  if (submission.formType === "training" && submission.values.location)
    summary.push(["Visitor time zone", submission.values.location]);
  const textLines = [
    ...summary.map(([key, value]) => `${key}: ${value}`),
    "",
    "Submitted answers",
    ...rows.map(([key, value]) => `${labels[key] ?? key}: ${value}`),
  ];
  const htmlRows = (items: Array<[string, string]>) =>
    items
      .map(
        ([key, value]) =>
          `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(key)}</th><td style="padding:6px 0">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
      )
      .join("");
  return {
    from: configuration.from,
    to: configuration.to,
    replyTo: email,
    subject: `[Cheesewiththat] New ${label}${label === "CV Request" ? "" : " enquiry"} — ${name} — ${submissionId.slice(0, 8)}`,
    text: textLines.join("\n"),
    html: `<h1>New ${escapeHtml(label)} enquiry</h1><h2>Submission summary</h2><table>${htmlRows(summary)}</table><h2>Submitted answers</h2><table>${htmlRows(rows.map(([key, value]) => [labels[key] ?? key, value]))}</table>`,
  };
}

export function createSubmissionId() {
  return randomUUID();
}
