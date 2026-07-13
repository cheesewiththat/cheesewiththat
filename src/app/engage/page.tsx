import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { engagements } from "@/content/site";
import { ExternalProfiles } from "@/components/ExternalProfiles";
const paths = [
  { title: "Consulting", href: "/engage/consulting" },
  { title: "Training and workshops", href: "/engage/training" },
  { title: "Speaking", href: "/engage/book?type=speaking" },
  { title: "Fractional leadership", href: "/engage/book" },
  { title: "Full-time leadership roles", href: "/engage/book?type=career" },
  { title: "Advisory opportunities", href: "/engage/book" },
  { title: "CV request", href: "/engage/cv" },
];
export default function Engage() {
  return (
    <>
      <PageIntro dark eyebrow="Engage" title="Bring the complicated thing.">
        <p>
          Focused advice, consulting, training and leadership conversations—with
          clear expectations and no fake urgency.
        </p>
      </PageIntro>
      <section className="bg-charcoal px-5 pb-20 text-cream lg:px-10">
        <div className="mx-auto max-w-page">
          <h2 className="font-serif text-5xl">Working sessions</h2>
          <p className="text-cream/60 mt-3 text-sm">
            Prepare the context, review it, then book the matching session in
            Calendly. No separate website email is sent for these sessions.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {engagements.map((e, index) => (
              <Link
                href={`/engage/book?type=${["direction", "expert", "working", "idea"][index]}`}
                className="card border-cream/20 p-5"
                key={e.slug}
              >
                <p className="eyebrow text-brass">{e.duration}</p>
                <h3 className="mt-8 font-serif text-3xl">{e.title}</h3>
                <p className="text-cream/70 mt-4 text-sm">{e.description}</p>
              </Link>
            ))}
          </div>
          <h2 className="mt-20 font-serif text-5xl">
            Other ways to work together
          </h2>
          <div className="bg-cream/20 mt-8 grid gap-px overflow-hidden rounded-xl md:grid-cols-2">
            {paths.map((p) => (
              <Link
                href={p.href}
                className="bg-charcoal p-6 text-xl hover:bg-cream hover:text-ink"
                key={p.title}
              >
                {p.title} →
              </Link>
            ))}
          </div>
          <div className="border-cream/20 mt-16 border-t pt-8">
            <ExternalProfiles />
          </div>
        </div>
      </section>
    </>
  );
}
