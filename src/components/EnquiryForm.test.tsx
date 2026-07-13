import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EnquiryFailureNotice, enquiryFailureMessage } from "./EnquiryForm";

describe("EnquiryForm failure state", () => {
  it("renders the production retry message once in an accessible alert", () => {
    const markup = renderToStaticMarkup(
      <EnquiryFailureNotice message={enquiryFailureMessage} />,
    );

    expect(markup).toContain('role="alert"');
    expect(markup.split(enquiryFailureMessage)).toHaveLength(2);
    expect(markup).not.toContain(
      ">Your information is still here, so you can try again.<",
    );
  });
});
