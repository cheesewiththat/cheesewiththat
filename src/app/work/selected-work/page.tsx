import { PageIntro } from "@/components/PageIntro";
import { work } from "@/content/site";
export default function SelectedWork() {
  return (
    <>
      <PageIntro
        eyebrow="Selected work · sample content"
        title="Structures for telling complicated stories clearly."
      >
        <p>
          These anonymised cards demonstrate the eventual case-study system.
          They contain no named customers, metrics or unsupported claims.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <div className="mx-auto grid max-w-page gap-5 md:grid-cols-2">
          {work.map((w) => (
            <article className="card p-7" key={w.slug}>
              <p className="eyebrow">Demonstration</p>
              <h2 className="mt-10 font-serif text-4xl">{w.title}</h2>
              <p className="mt-4">{w.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
