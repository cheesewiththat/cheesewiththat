import { PageIntro } from "@/components/PageIntro";
export default function Privacy() {
  return (
    <>
      <PageIntro eyebrow="Privacy" title="Collect less. Explain it clearly.">
        <p>
          This foundation uses a local preference and server-side form delivery.
          It has no analytics, accounts or payment processing.
        </p>
      </PageIntro>
      <div className="mx-auto max-w-3xl space-y-7 px-5 pb-20">
        <h2 className="font-serif text-4xl">Phase 1 behaviour</h2>
        <p>
          The “Add the cheese” setting is stored in your browser. When form
          delivery is configured, submitted details are validated by this site
          and emailed to Mihir through Amazon SES. The application does not keep
          a form-submission database. Bookable forms pass only limited prefill
          data to Calendly after the email succeeds.
        </p>
        <h2 className="font-serif text-4xl">Location privacy</h2>
        <p>
          The map uses approximate, intentionally public sample information and
          never publishes a current location, home address or precise private
          travel details.
        </p>
      </div>
    </>
  );
}
