import { describe, expect, it } from "vitest";
// @ts-expect-error The Amplify build helper is intentionally plain ESM for Node.
import * as amplifyEnvironment from "../../scripts/write-amplify-env.mjs";

const { isAmplifyProductionBuild, prepareAmplifyEnvironment } =
  amplifyEnvironment;

const requiredEnvironment = {
  FORM_NOTIFICATION_TO_EMAIL: "recipient@example.com",
  FORM_NOTIFICATION_FROM_EMAIL: "sender@example.com",
  SES_REGION: "ap-south-1",
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-1G3R8K61VF",
};

describe("Amplify analytics environment", () => {
  it("enables GA only for the Amplify main production branch", () => {
    const environment = {
      ...requiredEnvironment,
      AWS_APP_ID: "example-app",
      AWS_BRANCH: "main",
    };
    expect(isAmplifyProductionBuild(environment)).toBe(true);
    expect(prepareAmplifyEnvironment(environment)).toMatchObject({
      analyticsEnabled: true,
      lines: expect.arrayContaining([
        "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1G3R8K61VF",
        "NEXT_PUBLIC_GA_ENABLED=true",
      ]),
    });
  });

  it.each([
    ["local production build", {}],
    ["automated test", { NODE_ENV: "test" }],
    ["non-production branch", { AWS_APP_ID: "app", AWS_BRANCH: "develop" }],
    [
      "pull-request preview",
      { AWS_APP_ID: "app", AWS_BRANCH: "main", AWS_PULL_REQUEST_ID: "7" },
    ],
  ])("omits GA for a %s", (_, context) => {
    const prepared = prepareAmplifyEnvironment({
      ...requiredEnvironment,
      ...context,
    });
    expect(prepared.analyticsEnabled).toBe(false);
    expect(prepared.lines.join("\n")).not.toContain("GA_MEASUREMENT_ID");
    expect(prepared.lines.join("\n")).not.toContain("GA_ENABLED");
  });

  it("fails an Amplify production build when its GA ID is missing", () => {
    expect(() =>
      prepareAmplifyEnvironment({
        ...requiredEnvironment,
        NEXT_PUBLIC_GA_MEASUREMENT_ID: "",
        AWS_APP_ID: "app",
        AWS_BRANCH: "main",
      }),
    ).toThrow("NEXT_PUBLIC_GA_MEASUREMENT_ID is required");
  });
});
