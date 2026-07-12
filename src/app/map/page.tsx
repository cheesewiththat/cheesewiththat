import { PageIntro } from "@/components/PageIntro";
import { MihirMap } from "@/components/MihirMap";

export default function MapPage() {
  return (
    <>
      <PageIntro
        eyebrow="One Mihir map"
        title="Work, wandering and what stayed with me."
      >
        <p>
          A privacy-conscious map using approximate public coordinates only. It
          never displays a live location, address or precise private travel
          record.
        </p>
      </PageIntro>
      <section className="min-w-0 px-5 pb-20 lg:px-10">
        <div className="mx-auto min-w-0 max-w-page">
          <MihirMap />
        </div>
      </section>
    </>
  );
}
