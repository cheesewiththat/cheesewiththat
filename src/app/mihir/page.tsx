import Image from "next/image";
import Link from "next/link";
import { ExternalProfiles } from "@/components/ExternalProfiles";
import { PageIntro } from "@/components/PageIntro";
import { aboutMihir, roles } from "@/content/site";
export default function Mihir() {
  return (
    <>
      <PageIntro
        eyebrow="The person, in context"
        title="More than a sequence of job titles."
      >
        <p>
          A story-led view of how Mihir builds, operates, commercialises and
          advises—alongside the places and curiosities that shape the work.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <div className="mx-auto grid max-w-page gap-5 md:grid-cols-2">
          {roles.map((r) => (
            <article key={r.title} className="card p-7">
              <h2 className="font-serif text-5xl">{r.title}</h2>
              <p className="mt-4">{r.body}</p>
            </article>
          ))}
        </div>
        <section
          aria-labelledby="about-mihir-heading"
          className="border-ink/15 mx-auto mt-20 grid max-w-page items-start gap-8 border-t pt-12 md:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.7fr)] md:gap-12 lg:mt-24 lg:gap-16"
        >
          <figure className="max-w-sm md:max-w-none">
            <div className="bg-charcoal/5 aspect-square overflow-hidden rounded-[0.35rem]">
              <Image
                src={aboutMihir.portrait.src}
                alt={aboutMihir.portrait.alt}
                width={aboutMihir.portrait.width}
                height={aboutMihir.portrait.height}
                className="h-full w-full object-cover object-center"
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 30vw, 80vw"
              />
            </div>
            {aboutMihir.portrait.caption ? (
              <figcaption className="text-ink/65 mt-3 max-w-xs font-mono text-xs leading-relaxed">
                {aboutMihir.portrait.caption}
              </figcaption>
            ) : null}
          </figure>
          <div>
            <h2
              id="about-mihir-heading"
              className="font-serif text-5xl leading-none sm:text-6xl"
            >
              {aboutMihir.heading}
            </h2>
            <div className="text-ink/80 mt-7 space-y-5 text-base leading-8 lg:text-lg lg:leading-9">
              {aboutMihir.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
        <div className="mx-auto mt-16 max-w-page border-l-4 border-vermilion pl-6">
          <p className="font-serif text-4xl">
            Looking for the formal version of me?
          </p>
          <Link href="/engage/cv" className="button mt-5 bg-ink text-cream">
            Request the CV
          </Link>
        </div>
        <div className="mx-auto mt-16 max-w-page">
          <ExternalProfiles />
        </div>
      </section>
    </>
  );
}
