import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { expertise } from "@/content/site";
export default function Work() {
  return (
    <>
      <PageIntro
        eyebrow="Professional work"
        title="Useful outcomes through product, systems and delivery."
      >
        <p>
          Credible structure for the professional story, without pretending the
          work was simple or publishing claims before they are verified.
        </p>
      </PageIntro>
      <section className="bg-cream px-5 py-16 lg:px-10">
        <div className="mx-auto grid max-w-page gap-5 md:grid-cols-2">
          <Link className="card bg-cobalt p-8 text-white" href="/work/profile">
            <h2 className="font-serif text-5xl">Professional profile</h2>
            <p className="mt-5">
              Builder. Operator. Commercial leader. Advisor.
            </p>
          </Link>
          <Link className="card p-8" href="/work/selected-work">
            <h2 className="font-serif text-5xl">Selected work</h2>
            <p className="mt-5">Anonymised sample case-study structures.</p>
          </Link>
        </div>
        <div className="mx-auto mt-14 grid max-w-page gap-4 md:grid-cols-3">
          {expertise.map((x) => (
            <div className="border-t border-ink pt-4" key={x.title}>
              <h3 className="font-semibold">{x.title}</h3>
              <p className="mt-2 text-sm">{x.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
