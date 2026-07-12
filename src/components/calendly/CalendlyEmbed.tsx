"use client";

import { useEffect, useRef, useState } from "react";
import {
  type CalendlyEventName,
  isBookingCompletion,
  subscribeToCalendlyEvents,
} from "@/lib/calendly";

const scriptUrl = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: {
          name?: string;
          email?: string;
          customAnswers?: Record<string, string>;
        };
      }): void;
    };
  }
}

export function getCalendlyEmbedOptions(urlValue: string) {
  const url = new URL(urlValue);
  const name = url.searchParams.get("name") ?? undefined;
  const email = url.searchParams.get("email") ?? undefined;
  const summary = url.searchParams.get("a1") ?? undefined;
  url.searchParams.delete("name");
  url.searchParams.delete("email");
  url.searchParams.delete("a1");
  return {
    url: url.toString(),
    prefill: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(summary ? { customAnswers: { a1: summary } } : {}),
    },
  };
}

let scriptPromise: Promise<void> | undefined;

export function getOrCreateCalendlyScript(documentObject: Document) {
  const existing = documentObject.querySelector<HTMLScriptElement>(
    'script[data-calendly-widget="true"]',
  );
  if (existing) return { script: existing, created: false };
  const script = documentObject.createElement("script");
  script.src = scriptUrl;
  script.async = true;
  script.dataset.calendlyWidget = "true";
  documentObject.head.appendChild(script);
  return { script, created: true };
}

function loadCalendlyScript() {
  if (window.Calendly) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const { script } = getOrCreateCalendlyScript(document);
    const loaded = () => resolve();
    const failed = () => reject(new Error("Calendly failed to load"));
    script.addEventListener("load", loaded, { once: true });
    script.addEventListener("error", failed, { once: true });
    if (window.Calendly) resolve();
  });
  return scriptPromise;
}

const eventMessages: Partial<Record<CalendlyEventName, string>> = {
  "calendly.profile_page_viewed": "Scheduler opened.",
  "calendly.event_type_viewed": "Event details loaded.",
  "calendly.date_and_time_selected":
    "Date and time selected. Complete the final Calendly step to confirm.",
};

export function CalendlyEmbed({
  url,
  heading = "Choose a time that works.",
  onScheduled,
}: {
  url: string;
  heading?: string;
  onScheduled: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const scheduled = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [activity, setActivity] = useState("Loading secure scheduling…");

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      if (active && !window.Calendly) setStatus("error");
    }, 15000);
    const unsubscribe = subscribeToCalendlyEvents(
      window,
      () => container.current?.querySelector("iframe")?.contentWindow ?? null,
      (eventName) => {
        if (isBookingCompletion(eventName)) {
          if (!scheduled.current) {
            scheduled.current = true;
            onScheduled();
          }
          return;
        }
        const message = eventMessages[eventName];
        if (message) setActivity(message);
      },
    );
    void loadCalendlyScript()
      .then(() => {
        if (!active || !window.Calendly || !container.current) return;
        container.current.replaceChildren();
        const options = getCalendlyEmbedOptions(url);
        window.Calendly.initInlineWidget({
          ...options,
          parentElement: container.current,
        });
        setStatus("ready");
        setActivity("Scheduler ready.");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
      window.clearTimeout(timeout);
      unsubscribe();
    };
  }, [url, onScheduled]);

  return (
    <section aria-labelledby="calendly-heading" className="mt-7 min-w-0">
      <h2 id="calendly-heading" className="font-serif text-4xl md:text-5xl">
        {heading}
      </h2>
      <p className="mt-3 text-sm">
        Calendly loads only at this step. Its privacy and cookie practices apply
        to the embedded scheduler.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {activity}
      </p>
      {status === "loading" && (
        <div className="card mt-6 grid min-h-40 place-items-center bg-cream p-6 text-center">
          <div>
            <p className="eyebrow">Preparing Calendly</p>
            <p className="mt-3">Loading available times…</p>
          </div>
        </div>
      )}
      {status === "error" ? (
        <div role="alert" className="card mt-6 border-brass bg-cream p-6">
          <p className="eyebrow">Scheduling could not load</p>
          <p className="mt-3">
            You can retry by reloading this page or open the selected Calendly
            event in a new tab.
          </p>
          <a
            className="button mt-5 bg-ink text-cream"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Calendly <span aria-hidden>↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      ) : (
        <div
          ref={container}
          data-testid="calendly-embed"
          className={`${status === "loading" ? "sr-only" : "block"} mt-6 h-[760px] min-h-[700px] w-full min-w-0 overflow-hidden rounded-xl bg-white md:h-[700px]`}
        />
      )}
    </section>
  );
}
