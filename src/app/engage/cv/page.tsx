import { PageIntro } from "@/components/PageIntro";
import { EnquiryForm } from "@/components/EnquiryForm";
export default function CV() {
  return (
    <>
      <PageIntro
        eyebrow="CV request"
        title="Looking for the formal version of me?"
      >
        <p>
          The CV is request-based in Phase 1, keeping distribution intentional
          and allowing the version to match the context. No downloadable file is
          publicly exposed.
        </p>
      </PageIntro>
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-2xl">
          <EnquiryForm kind="cv" />
        </div>
      </section>
    </>
  );
}
