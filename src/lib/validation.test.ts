import { describe, expect, it } from "vitest";
import { validateEnquiry } from "./validation";
describe("validateEnquiry", () => {
  it("accepts a concise valid enquiry", () => {
    expect(
      validateEnquiry({
        name: "Mihir",
        email: "mihir@example.com",
        brief: "I would like help with a product decision.",
      }).valid,
    ).toBe(true);
  });
  it("rejects malformed and honeypot submissions", () => {
    const result = validateEnquiry({
      name: "x",
      email: "nope",
      brief: "short",
      companyWebsite: "spam",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(4);
  });
});
