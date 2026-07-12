import Link from "next/link";
import { PhotoGrid } from "@/components/PhotoGrid";
import { engagements, expertise, interests, roles, work } from "@/content/site";
export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden px-5 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-page">
          <p className="eyebrow mb-7">Mihir—with context.</p>
          <div className="editorial-grid gap-y-10">
            <div className="col-span-12 lg:col-span-9">
              <h1 className="display text-[clamp(5rem,14vw,13rem)]">
                I’m Mihir.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-relaxed md:text-3xl">
                I build products, commercialise technology, solve complicated
                telecom problems and occasionally remember unnecessary details
                about car engines.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/work" className="button bg-ink text-cream">
                  Explore my work
                </Link>
                <Link href="/engage" className="button border border-ink">
                  Engage me
                </Link>
              </div>
            </div>
            <aside className="col-span-12 flex flex-col justify-end gap-3 lg:col-span-3">
              <Link href="/now" className="border-b border-ink py-3 text-sm">
                See what I’m building →
              </Link>
              <Link href="/mihir" className="border-b border-ink py-3 text-sm">
                Meet the person →
              </Link>
              <p className="cheese-note mt-4 rotate-1 bg-vermilion p-4 font-mono text-xs text-white">
                Horsepower is not the only important number. It is merely the
                first one.
              </p>
            </aside>
          </div>
        </div>
      </section>
      <section className="bg-cream px-5 py-16 lg:px-10">
        <div className="mx-auto grid max-w-page gap-5 md:grid-cols-2">
          <Link href="/work" className="card group bg-cobalt p-8 text-white">
            <p className="eyebrow">Path 01</p>
            <h2 className="mt-12 font-serif text-5xl">I’m here for the work</h2>
            <p className="mt-4 max-w-md">
              Products, programmes, telecom systems, AI and commercial outcomes.
            </p>
            <span className="mt-8 block">Enter through the work →</span>
          </Link>
          <Link href="/mihir" className="card group bg-bone p-8">
            <p className="eyebrow">Path 02</p>
            <h2 className="mt-12 font-serif text-5xl">I’m here for Mihir</h2>
            <p className="mt-4 max-w-md">
              Ideas, photographs, places, machines and the useful context around
              them.
            </p>
            <span className="mt-8 block">Meet the whole person →</span>
          </Link>
        </div>
      </section>
      <section className="px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-page">
          <p className="eyebrow">Four ways of working</p>
          <div className="bg-ink/20 mt-8 grid gap-px overflow-hidden rounded-2xl md:grid-cols-4">
            {roles.map((r, i) => (
              <article key={r.title} className="bg-bone p-6">
                <span className="font-mono text-xs">0{i + 1}</span>
                <h2 className="mt-10 font-serif text-4xl">{r.title}</h2>
                <p className="mt-4 text-sm leading-relaxed">{r.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-charcoal px-5 py-20 text-cream lg:px-10">
        <div className="mx-auto max-w-page">
          <p className="eyebrow text-chartreuse">Selected expertise</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {expertise.map((x) => (
              <article key={x.title} className="border-cream/25 border-t pt-5">
                <h2 className="font-serif text-3xl">{x.title}</h2>
                <p className="text-cream/70 mt-3 text-sm">{x.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-page">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="display mt-4 text-6xl">
                Complicated, made useful.
              </h2>
            </div>
            <Link
              href="/work/selected-work"
              className="hidden underline md:block"
            >
              All selected work
            </Link>
          </div>
          <p className="mt-4 text-sm">
            Demonstration content · structures only, no customer claims
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {work.slice(0, 4).map((w) => (
              <article key={w.slug} className="card p-6">
                <div className="flex flex-wrap gap-2">
                  {w.disciplines.map((d) => (
                    <span
                      key={d}
                      className="eyebrow bg-ink/5 rounded-full px-2 py-1"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <h3 className="mt-10 font-serif text-4xl">{w.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed">
                  {w.summary}
                </p>
                <p className="cheese-note mt-5 font-mono text-xs text-vermilion">
                  Yes, this project really did need six integrations.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-ink px-5 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-page">
          <p className="eyebrow">Photography</p>
          <h2 className="display my-6 text-6xl md:text-8xl">
            Things I’ve seen and kept.
          </h2>
          <PhotoGrid limit={3} />
          <Link href="/photography" className="button mt-8 bg-cream text-ink">
            See the collection
          </Link>
        </div>
      </section>
      <section className="px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-page">
          <p className="eyebrow">Now</p>
          <h2 className="display mt-5 text-7xl">Currently.</h2>
          <dl className="bg-ink/20 mt-10 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2">
            {interests.map((i) => (
              <div key={i.label} className="bg-bone p-5">
                <dt className="eyebrow">{i.label}</dt>
                <dd className="mt-4 font-serif text-2xl">{i.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="bg-plum px-5 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-page">
          <p className="eyebrow">Work together</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {engagements.slice(0, 3).map((e) => (
              <Link
                href="/engage/book"
                key={e.slug}
                className="card border-white/25 p-6"
              >
                <p className="eyebrow">{e.duration}</p>
                <h2 className="mt-8 font-serif text-3xl">{e.title}</h2>
                <p className="mt-3 text-sm text-white/70">{e.description}</p>
              </Link>
            ))}
            <Link href="/engage" className="card bg-brass p-6 text-ink">
              <p className="eyebrow">Also</p>
              <h2 className="mt-8 font-serif text-3xl">
                Consulting, training, speaking and leadership
              </h2>
            </Link>
            <Link href="/engage/cv" className="card border-white/25 p-6">
              <p className="eyebrow">Formal version</p>
              <h2 className="mt-8 font-serif text-3xl">Request the CV</h2>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
