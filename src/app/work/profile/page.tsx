import { PageIntro } from "@/components/PageIntro";
import { roles } from "@/content/site";
import Link from "next/link";
const foundations = [
  "Career timeline",
  "Locations worked",
  "Industries",
  "Core capabilities",
  "Certifications",
  "Selected outcomes",
  "Product and platform experience",
];
export default function Profile() {
  return (
    <>
      <PageIntro
        eyebrow="Professional profile"
        title="The formal shape, with the useful context left in."
      >
        <p>
          This foundation is ready for an approved career chronology and
          verified outcomes. It does not duplicate a résumé or invent detail.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <div className="mx-auto max-w-page">
          <div className="grid gap-4 md:grid-cols-4">
            {roles.map((r) => (
              <div className="card p-5" key={r.title}>
                <h2 className="font-serif text-3xl">{r.title}</h2>
                <p className="mt-3 text-sm">{r.body}</p>
              </div>
            ))}
          </div>
          <h2 className="display mt-20 text-6xl">Profile foundations</h2>
          <div className="bg-ink/20 mt-8 grid gap-px md:grid-cols-2">
            {foundations.map((x) => (
              <div className="bg-bone p-6" key={x}>
                <h3 className="font-serif text-3xl">{x}</h3>
                <p className="mt-3 text-sm">
                  Approved content to be added through the central profile
                  collection.
                </p>
              </div>
            ))}
          </div>
          <Link href="/engage/cv" className="button mt-10 bg-ink text-cream">
            Request CV
          </Link>
        </div>
      </section>
    </>
  );
}
