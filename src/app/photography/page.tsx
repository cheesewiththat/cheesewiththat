import { PageIntro } from "@/components/PageIntro";
import { PhotoGrid } from "@/components/PhotoGrid";
import { photographs } from "@/content/site";
export default function Photography() {
  const cats = Array.from(new Set(photographs.flatMap((p) => p.categories)));
  return (
    <>
      <PageIntro dark eyebrow="Photography" title="Things I’ve seen and kept.">
        <p>
          An image-first collection of cities, architecture, travel, street,
          nature, cars and details. Phase 1 uses local abstract placeholders
          pending approved photographs.
        </p>
      </PageIntro>
      <section className="bg-ink px-5 pb-20 text-white lg:px-10">
        <div className="mx-auto max-w-page">
          <div
            aria-label="Photography categories"
            className="mb-8 flex flex-wrap gap-2"
          >
            {cats.map((c) => (
              <span
                className="rounded-full border border-white/30 px-3 py-1 text-xs"
                key={c}
              >
                {c}
              </span>
            ))}
          </div>
          <PhotoGrid />
        </div>
      </section>
    </>
  );
}
