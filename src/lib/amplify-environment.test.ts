import { describe, expect, it } from "vitest";
// @ts-expect-error The Amplify build helper is intentionally plain ESM for Node.
import * as amplifyEnvironment from "../../scripts/write-amplify-env.mjs";

const { isAmplifyPullRequestPreview, prepareAmplifyEnvironment } =
  amplifyEnvironment;
const requiredEnvironment = {
  FORM_NOTIFICATION_TO_EMAIL: "recipient@example.com",
  FORM_NOTIFICATION_FROM_EMAIL: "sender@example.com",
  SES_REGION: "ap-south-1",
};

describe("Amplify analytics environment", () => {
  it("includes the configured ID for a non-preview build", () => {
    const prepared = prepareAmplifyEnvironment({
      ...requiredEnvironment,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-1G3R8K61VF",
    });
    expect(prepared).toMatchObject({
      analyticsConfigured: true,
      isPullRequestPreview: false,
      lines: expect.arrayContaining([
        "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1G3R8K61VF",
      ]),
    });
  });

  it("omits the ID when it is not configured", () => {
    const prepared = prepareAmplifyEnvironment(requiredEnvironment);
    expect(prepared.analyticsConfigured).toBe(false);
    expect(prepared.lines.join("\n")).not.toContain("GA_MEASUREMENT_ID");
  });

  it("identifies AWS_PULL_REQUEST_ID as preview context", () => {
    expect(isAmplifyPullRequestPreview({ AWS_PULL_REQUEST_ID: "7" })).toBe(
      true,
    );
    expect(isAmplifyPullRequestPreview({})).toBe(false);
  });

  it("strips an inherited ID from a pull-request preview", () => {
    const prepared = prepareAmplifyEnvironment({
      ...requiredEnvironment,
      AWS_PULL_REQUEST_ID: "7",
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-1G3R8K61VF",
    });
    expect(prepared.analyticsConfigured).toBe(false);
    expect(prepared.isPullRequestPreview).toBe(true);
    expect(prepared.lines.join("\n")).not.toContain("GA_MEASUREMENT_ID");
  });
});
