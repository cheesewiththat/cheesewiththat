import { PageIntro } from "@/components/PageIntro";
import { BookingFlow } from "@/components/BookingFlow";
import { Suspense } from "react";
import { services } from "@/content/site";
export default function Consulting() {
  return (
    <>
      <PageIntro
        eyebrow="Consulting"
        title="Independent help where product, technology and delivery meet."
      >
        <p>
          Structured services that can become focused advice, a defined piece of
          work or ongoing fractional support.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <div className="mx-auto grid max-w-page gap-5 md:grid-cols-2">
          {services.map((s) => (
            <article className="card p-7" key={s.slug}>
              <h2 className="font-serif text-4xl">{s.title}</h2>
              <p className="mt-3">{s.intro}</p>
              <ul className="mt-6 grid gap-2 text-sm">
                {s.capabilities.map((c) => (
                  <li key={c}>— {c}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-4xl">
          <Suspense fallback={<p>Preparing the consulting intake…</p>}>
            <BookingFlow fixedKind="consulting" />
          </Suspense>
        </div>
      </section>
    </>
  );
}
