import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { photographs, prints } from "@/content/site";
import { resolveMediaPath } from "@/lib/media";
export default function Prints() {
  return (
    <>
      <PageIntro
        eyebrow="From My Lens"
        title="A gallery of photographs I’m proud of."
      >
        <p>
          Print previews only. Checkout, fulfilment and final production
          specifications are not yet active.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <div className="mx-auto grid max-w-page gap-5 md:grid-cols-2">
          {prints.map((p) => {
            const photo = photographs.find((x) => x.id === p.photograph)!;
            return (
              <Link
                href={`/collect/prints/${p.slug}`}
                className="card overflow-hidden"
                key={p.id}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={resolveMediaPath(photo.thumbnail)}
                    alt={photo.alt}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="eyebrow">
                    {p.collection} · {p.edition} edition
                  </p>
                  <h2 className="mt-4 font-serif text-4xl">{p.title}</h2>
                  <p className="mt-3">
                    Register interest · checkout not active
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
