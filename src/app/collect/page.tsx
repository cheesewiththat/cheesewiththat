import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
export default function Collect() {
  return (
    <>
      <PageIntro eyebrow="Collect" title="Objects and ideas worth keeping.">
        <p>
          The future home of prints, templates, guides, frameworks and workshop
          resources. Phase 1 begins with photography print previews.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <Link
          href="/collect/prints"
          className="card mx-auto block max-w-page bg-brass p-8"
        >
          <p className="eyebrow">From My Lens</p>
          <h2 className="mt-10 font-serif text-6xl">
            A gallery of photographs I’m proud of.
          </h2>
          <p className="mt-5">Explore planned prints →</p>
        </Link>
      </section>
    </>
  );
}
