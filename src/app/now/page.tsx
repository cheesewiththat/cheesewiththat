import { PageIntro } from "@/components/PageIntro";
import { interests } from "@/content/site";
export default function Now() {
  return (
    <>
      <PageIntro eyebrow="Now" title="A slowly changing snapshot.">
        <p>
          What has my attention at the moment—maintained as structured content,
          not buried in components.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <dl className="mx-auto max-w-page">
          {interests.map((i) => (
            <div
              className="border-ink/25 grid gap-2 border-t py-7 md:grid-cols-3"
              key={i.label}
            >
              <dt className="eyebrow">{i.label}</dt>
              <dd className="font-serif text-3xl md:col-span-2">{i.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
