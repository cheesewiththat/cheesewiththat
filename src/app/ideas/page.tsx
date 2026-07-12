import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { articles } from "@/content/site";
export default function Ideas() {
  return (
    <>
      <PageIntro
        eyebrow="Ideas and articles"
        title="Independent thinking, minus the theatre."
      >
        <p>
          Notes on AI, telecom machinery, product, delivery, commercial reality,
          leadership—and opinions too specific to leave alone.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <div className="mx-auto max-w-page">
          {articles.map((a) => (
            <Link
              href={`/ideas/${a.slug}`}
              key={a.slug}
              className="card block bg-cream p-8"
            >
              <p className="eyebrow">
                Sample article · {a.category} · {a.readingTime}
              </p>
              <h2 className="mt-8 max-w-4xl font-serif text-5xl">{a.title}</h2>
              <p className="mt-5 max-w-2xl">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
