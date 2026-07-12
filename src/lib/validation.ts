export type EnquiryInput = {
  name: string;
  email: string;
  brief: string;
  companyWebsite?: string;
};
export function validateEnquiry(input: EnquiryInput) {
  const errors: string[] = [];
  if (input.companyWebsite) errors.push("Submission rejected");
  if (input.name.trim().length < 2 || input.name.length > 80)
    errors.push("Enter a valid name");
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
    input.email.length > 120
  )
    errors.push("Enter a valid email");
  if (input.brief.trim().length < 20 || input.brief.length > 1200)
    errors.push("Add 20–1200 characters of context");
  return { valid: errors.length === 0, errors };
}
