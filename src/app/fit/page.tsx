import type { Metadata } from "next";
import { FitTool } from "@/components/fit-tool";

export const metadata: Metadata = {
  title: "Fit check",
  description: "Paste a job description and get Aashar's evidence for each requirement, with sources, or a plain \"no direct evidence\".",
};

export default function FitPage() {
  return (
    <>
      <header className="doc-head">
        <p className="crumbs">Fit check</p>
        <h1>Does Aashar fit your role? Ask the evidence.</h1>
        <p>
          Paste a job description. The agent extracts each requirement, searches his CV and project notes, and either quotes
          the evidence with a link to its source or says &ldquo;no direct evidence&rdquo;. It ends with an honest summary,
          gaps included.
        </p>
      </header>
      <section className="sec" aria-label="Fit check tool">
        <div className="rail">
          <b>→</b>Paste
        </div>
        <FitTool headingLevel={2} />
      </section>
    </>
  );
}
