import { Suspense } from "react";
import { PageIntro } from "@/components/PageIntro";
import { BookingFlow } from "@/components/BookingFlow";

export default function Book() {
  return (
    <>
      <PageIntro
        eyebrow="Find, explore and book"
        title="Choose the shape of the useful conversation."
      >
        <p>
          Select a conversation, provide only the relevant context, review it,
          then schedule when the matching Calendly event is configured.
        </p>
      </PageIntro>
      <section className="px-5 pb-20 lg:px-10">
        <Suspense fallback={<p>Preparing the booking flow…</p>}>
          <BookingFlow />
        </Suspense>
      </section>
    </>
  );
}
