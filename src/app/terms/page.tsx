import { PageIntro } from "@/components/PageIntro";
export default function Terms() {
  return (
    <>
      <PageIntro
        eyebrow="Terms"
        title="Clear expectations, before transactions exist."
      >
        <p>
          This is a Phase 1 foundation and not a substitute for final launch
          terms reviewed for the operating business and jurisdictions.
        </p>
      </PageIntro>
      <div className="mx-auto max-w-3xl space-y-7 px-5 pb-20">
        <h2 className="font-serif text-4xl">Preview content</h2>
        <p>
          Sample case studies and placeholder artwork demonstrate structure
          only. They do not represent named customers, verified results or
          products currently for sale.
        </p>
        <h2 className="font-serif text-4xl">No active commerce</h2>
        <p>
          Booking, prices, checkout, fulfilment and payment are not active. An
          enquiry or register-interest interaction does not create an order or
          booking.
        </p>
      </div>
    </>
  );
}
