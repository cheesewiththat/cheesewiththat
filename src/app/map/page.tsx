import { PageIntro } from "@/components/PageIntro";
import { MihirMap } from "@/components/MihirMap";

export default function MapPage() {
  return (
    <>
      <PageIntro eyebrow="Places" title="Where life has taken me">
        <p>
          Born in one city, raised across several, educated across continents,
          and currently calling regional Australia home.
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
