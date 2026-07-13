import { describe, expect, it } from "vitest";
import {
  buildBookingSummary,
  buildCalendlyUrl,
  getCalendlyEventName,
  isBookingCompletion,
  isTrustedCalendlyMessage,
  resolveCalendlyEvent,
  subscribeToCalendlyEvents,
  type CalendlyConfiguration,
} from "./calendly";
import { getEngagementWorkflow, intakeSchemas, validateIntake } from "./intake";
import {
  getMapConfigurationDiagnostic,
  getVisibleMapLocations,
  hasGoogleMapsConfiguration,
  validateLocation,
} from "./locations";
import { isLocalMediaPath, resolveMediaPath } from "./media";
import { completeReviewWorkflow, enquirySuccessMessage } from "./workflows";
import { workflowByType } from "./forms/types";
import { locations } from "@/content/site";

const calendly: CalendlyConfiguration = {
  fifteen: "https://calendly.com/mihirsatokar/15-minute-meeting",
  thirty: "https://calendly.com/mihirsatokar/30min",
  sixty: "https://calendly.com/mihirsatokar/60-minute-meeting",
  ninety: "https://calendly.com/mihirsatokar/idea-lab",
  fallback:
    "https://calendly.com/mihirsatokar?hide_landing_page_details=1&hide_gdpr_banner=1",
};

describe("v0.1.3 configuration and validation", () => {
  it("provides different conditional schemas", () => {
    expect(intakeSchemas.direction.fields.map((field) => field.name)).toContain(
      "question",
    );
    expect(intakeSchemas.training.fields.map((field) => field.name)).toContain(
      "participants",
    );
    expect(intakeSchemas.career.fields.map((field) => field.name)).toContain(
      "roleTitle",
    );
    expect(
      intakeSchemas.direction.fields.map((field) => field.name),
    ).not.toContain("participants");
  });
  it("validates required, email and spam fields", () => {
    expect(validateIntake("direction", {}, 3000).valid).toBe(false);
    expect(
      validateIntake(
        "direction",
        {
          name: "Mihir",
          email: "mihir@example.com",
          topic: "Product",
          question: "What should happen next?",
          context: "Enough useful context for a focused answer.",
        },
        3000,
      ).valid,
    ).toBe(true);
    expect(
      validateIntake("direction", { companyWebsite: "spam" }, 100).errors.form,
    ).toBeDefined();
  });
  it("falls back without complete Google Maps configuration", () => {
    expect(hasGoogleMapsConfiguration(undefined, undefined)).toBe(false);
    expect(getMapConfigurationDiagnostic(undefined, "map-id")).toBe(
      "api-key-missing",
    );
    expect(getMapConfigurationDiagnostic("key", undefined)).toBe(
      "map-id-missing",
    );
    expect(hasGoogleMapsConfiguration("key", "map-id")).toBe(true);
  });
  it("validates all public sample locations", () => {
    expect(
      locations.every((location) => validateLocation(location).valid),
    ).toBe(true);
    expect(
      validateLocation({ ...locations[0], coordinates: [100, 200] }).valid,
    ).toBe(false);
    expect(
      validateLocation({ ...locations[0], coordinates: [Number.NaN, 0] }).valid,
    ).toBe(false);
  });
  it("filters hidden, invalid and inactive map markers before fitting", () => {
    const records = [
      locations[0],
      { ...locations[1], public: false },
      { ...locations[2], coordinates: [Number.NaN, 0] as [number, number] },
    ];
    const visible = getVisibleMapLocations(records, locations[0].categories);
    expect(visible).toEqual([locations[0]]);
  });
  it("resolves local and allow-listed remote media paths", () => {
    expect(isLocalMediaPath("/images/local.svg")).toBe(true);
    expect(
      resolveMediaPath("/images/local.svg", "https://media.example.com/base"),
    ).toBe("/images/local.svg");
    expect(
      resolveMediaPath(
        "photography/web/large/a.jpg",
        "https://media.example.com/assets",
      ),
    ).toBe("https://media.example.com/assets/photography/web/large/a.jpg");
    expect(
      resolveMediaPath("photography/a.jpg", "http://unsafe.example.com"),
    ).toBe("photography/a.jpg");
  });
});

describe("Calendly event mapping", () => {
  const cases = [
    ["direction", "/mihirsatokar/15-minute-meeting"],
    ["expert", "/mihirsatokar/30min"],
    ["working", "/mihirsatokar/60-minute-meeting"],
    ["idea", "/mihirsatokar/idea-lab"],
  ] as const;
  it.each(cases)("maps %s to %s", (kind, path) => {
    expect(
      new URL(resolveCalendlyEvent(kind, calendly, "production").url!).pathname,
    ).toBe(path);
  });
  it("uses general scheduling in production when an event is missing", () => {
    const result = resolveCalendlyEvent(
      "direction",
      { ...calendly, fifteen: undefined },
      "production",
    );
    expect(result.fallback).toBe(true);
    expect(result.url).toContain("hide_landing_page_details=1");
  });
  it("reports the missing key without crashing in development", () => {
    const result = resolveCalendlyEvent(
      "idea",
      { ...calendly, ninety: undefined },
      "development",
    );
    expect(result.url).toBeUndefined();
    expect(result.missing).toBe("NEXT_PUBLIC_CALENDLY_90_URL");
  });
});

describe("booking and enquiry workflows", () => {
  it.each(["direction", "expert", "working", "idea"] as const)(
    "classifies %s as booking",
    (kind) => expect(getEngagementWorkflow(kind)).toBe("booking"),
  );
  it.each(["training", "consulting", "speaking", "career"] as const)(
    "classifies %s as enquiry",
    (kind) => expect(getEngagementWorkflow(kind)).toBe("enquiry"),
  );
  it.each(["cv", "general", "print"] as const)(
    "classifies %s as enquiry",
    (kind) => expect(workflowByType[kind]).toBe("enquiry"),
  );
  it("moves bookings directly to Calendly without calling email", async () => {
    let emailCalls = 0;
    const result = await completeReviewWorkflow("direction", async () => {
      emailCalls += 1;
      return { ok: true, submissionId: "not-used" };
    });
    expect(result).toEqual({ destination: "calendly" });
    expect(emailCalls).toBe(0);
  });
  it("sends enquiries by email and never routes them to Calendly", async () => {
    let emailCalls = 0;
    const result = await completeReviewWorkflow("consulting", async () => {
      emailCalls += 1;
      return { ok: true, submissionId: "sent-id" };
    });
    expect(result).toEqual({ destination: "sent", submissionId: "sent-id" });
    expect(emailCalls).toBe(1);
    expect(enquirySuccessMessage).toBe(
      "Thanks — your message has been sent to Mihir. He’ll review it and get back to you.",
    );
  });
  it("returns retry without mutating enquiry data when email fails", async () => {
    const values = { name: "Jane", challenge: "Useful context" };
    const before = { ...values };
    const result = await completeReviewWorkflow("training", async () => ({
      ok: false,
      code: "delivery_failed",
      message: "Try again",
    }));
    expect(result.destination).toBe("retry");
    expect(values).toEqual(before);
  });
});

describe("Calendly prefill and events", () => {
  it("prefills name, email and a concise summary", () => {
    const result = buildCalendlyUrl(
      "expert",
      "30-minute Expert Session",
      {
        name: "Mihir",
        email: "mihir@example.com",
        company: "Example Co",
        topic: "AI product",
        desiredOutcome: "A decision",
      },
      calendly,
      "production",
    );
    const url = new URL(result.url!);
    expect(url.searchParams.get("name")).toBe("Mihir");
    expect(url.searchParams.get("email")).toBe("mihir@example.com");
    expect(url.searchParams.get("a1")).toContain("Example Co");
  });
  it("omits empty prefill fields", () => {
    const url = new URL(
      buildCalendlyUrl(
        "direction",
        "Direction Check",
        {},
        calendly,
        "production",
      ).url!,
    );
    expect(url.searchParams.has("name")).toBe(false);
    expect(url.searchParams.has("email")).toBe(false);
  });
  it("truncates and sanitizes long summary values", () => {
    const summary = buildBookingSummary("direction", "Direction Check", {
      topic: "x".repeat(1000),
      question: "hello\u0000world",
      context: "y".repeat(1000),
    });
    expect(summary.length).toBeLessThanOrEqual(480);
    expect(summary).not.toContain("\u0000");
  });
  it("recognises supported events but completes only on scheduled", () => {
    expect(
      getCalendlyEventName({ event: "calendly.date_and_time_selected" }),
    ).toBe("calendly.date_and_time_selected");
    expect(isBookingCompletion("calendly.date_and_time_selected")).toBe(false);
    expect(isBookingCompletion("calendly.event_scheduled")).toBe(true);
    expect(getCalendlyEventName({ event: "made.up.success" })).toBeUndefined();
  });
  it("rejects invalid origins and message sources", () => {
    const source = {} as MessageEventSource;
    expect(
      isTrustedCalendlyMessage(
        {
          origin: "https://evil.example",
          source,
          data: { event: "calendly.event_scheduled" },
        },
        source,
      ),
    ).toBe(false);
    expect(
      isTrustedCalendlyMessage(
        {
          origin: "https://calendly.com",
          source: {} as MessageEventSource,
          data: { event: "calendly.event_scheduled" },
        },
        source,
      ),
    ).toBe(false);
    expect(
      isTrustedCalendlyMessage(
        {
          origin: "https://calendly.com",
          source,
          data: { event: "calendly.event_scheduled" },
        },
        source,
      ),
    ).toBe(true);
  });
  it("removes the message listener during cleanup", () => {
    let added: EventListener | undefined;
    let removed: EventListener | undefined;
    const target = {
      addEventListener: (_type: string, listener: EventListener) => {
        added = listener;
      },
      removeEventListener: (_type: string, listener: EventListener) => {
        removed = listener;
      },
    } as unknown as Pick<Window, "addEventListener" | "removeEventListener">;
    const cleanup = subscribeToCalendlyEvents(
      target,
      () => null,
      () => undefined,
    );
    cleanup();
    expect(removed).toBe(added);
  });
});
