import { PageIntro } from "@/components/PageIntro";
import { EnquiryForm } from "@/components/EnquiryForm";
import { cvRequest } from "@/content/site";
export default function CV() {
  return (
    <>
      <PageIntro
        eyebrow="CV request"
        title="Looking for the formal version of me?"
      >
        <p>{cvRequest.supportingCopy}</p>
      </PageIntro>
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-2xl">
          <EnquiryForm kind="cv" />
        </div>
      </section>
    </>
  );
}
