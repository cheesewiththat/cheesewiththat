import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CalendlyEmbed,
  getCalendlyEmbedOptions,
  getOrCreateCalendlyScript,
} from "./CalendlyEmbed";

describe("CalendlyEmbed", () => {
  it("renders an accessible responsive container", () => {
    const markup = renderToStaticMarkup(
      <CalendlyEmbed
        url="https://calendly.com/mihirsatokar/30min"
        onScheduled={() => undefined}
      />,
    );
    expect(markup).toContain("Choose a time that works.");
    expect(markup).toContain("min-h-[700px]");
    expect(markup).toContain("w-full");
    expect(markup).toContain('role="status"');
  });
  it("does not create the widget script more than once", () => {
    let stored: HTMLScriptElement | null = null;
    let appended = 0;
    const fakeDocument = {
      querySelector: () => stored,
      createElement: () => ({ dataset: {} }),
      head: {
        appendChild: (script: HTMLScriptElement) => {
          stored = script;
          appended += 1;
        },
      },
    } as unknown as Document;
    expect(getOrCreateCalendlyScript(fakeDocument).created).toBe(true);
    expect(getOrCreateCalendlyScript(fakeDocument).created).toBe(false);
    expect(appended).toBe(1);
  });
  it("converts encoded URL values to structured Calendly prefill", () => {
    const options = getCalendlyEmbedOptions(
      "https://calendly.com/mihirsatokar/30min?name=Calendly+QA&email=qa%40example.com&a1=Useful+context",
    );
    expect(options.url).toBe("https://calendly.com/mihirsatokar/30min");
    expect(options.prefill).toEqual({
      name: "Calendly QA",
      email: "qa@example.com",
      customAnswers: { a1: "Useful context" },
    });
  });
});
