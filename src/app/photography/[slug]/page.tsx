import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { photographs } from "@/content/site";
import { resolveMediaPath } from "@/lib/media";
export function generateStaticParams() {
  return photographs.map((p) => ({ slug: p.slug }));
}
export default async function Photo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = photographs.find(
    (x) => x.slug === slug && x.visibility === "public",
  );
  if (!p) notFound();
  return (
    <article className="bg-ink px-5 py-14 text-cream lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/photography" className="text-sm">
          ← Photography
        </Link>
        <div
          className="relative mt-8"
          style={{ aspectRatio: `${p.width}/${p.height}` }}
        >
          <Image
            src={resolveMediaPath(p.image)}
            alt={p.alt}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain"
          />
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow">
              {p.location}, {p.country} · {p.year}
            </p>
            <h1 className="mt-4 font-serif text-6xl">{p.title}</h1>
          </div>
          <div>
            <p className="text-cream/75 leading-relaxed">{p.story}</p>
            {p.availableAsPrint && (
              <Link
                className="button mt-6 bg-cream text-ink"
                href={`/collect/prints/${p.printProduct}`}
              >
                View print preview
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
