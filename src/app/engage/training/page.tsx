import { PageIntro } from "@/components/PageIntro";
import { BookingFlow } from "@/components/BookingFlow";
import { Suspense } from "react";
import { training } from "@/content/site";
export default function Training() {
  return (
    <>
      <PageIntro
        eyebrow="Training"
        title="Practical learning for complicated work."
      >
        <p>
          Programmes designed for shared language, usable tools and decisions
          that survive the workshop.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <div className="mx-auto grid max-w-page gap-5 md:grid-cols-2">
          {training.map((t) => (
            <article className="card p-7" key={t.slug}>
              <h2 className="font-serif text-4xl">{t.title}</h2>
              <p className="mt-4">
                <strong>For:</strong> {t.audience}
              </p>
              <p className="mt-4 text-sm">
                <strong>Formats:</strong> {t.modes.join(" · ")}
              </p>
              <p className="mt-2 text-sm">
                <strong>Duration:</strong> {t.durations.join(" · ")}
              </p>
              <ul className="mt-5 text-sm">
                {t.outcomes.map((o) => (
                  <li key={o}>— {o}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-4xl">
          <Suspense fallback={<p>Preparing the training intake…</p>}>
            <BookingFlow fixedKind="training" />
          </Suspense>
        </div>
      </section>
    </>
  );
}
