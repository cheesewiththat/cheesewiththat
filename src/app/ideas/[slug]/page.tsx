import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articles } from "@/content/site";
export function generateStaticParams() {
  return articles.filter((a) => !a.draft).map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return a ? { title: a.seo.title, description: a.seo.description } : {};
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug && !x.draft);
  if (!a) notFound();
  return (
    <article className="mx-auto max-w-4xl px-5 py-20">
      <p className="eyebrow text-plum">
        Sample article · {a.category} · {a.readingTime}
      </p>
      <h1 className="display mt-6 text-6xl md:text-8xl">{a.title}</h1>
      <p className="mt-8 text-xl leading-relaxed">{a.excerpt}</p>
      <div className="border-ink/20 mt-12 border-y py-4 font-mono text-xs">
        By {a.author} · {a.published}
      </div>
      <div className="mt-12 space-y-12">
        {a.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-serif text-4xl">{s.heading}</h2>
            <p className="mt-5 text-lg leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
