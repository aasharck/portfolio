import type { Metadata } from "next";
import { AskTool } from "@/components/ask-tool";

export const metadata: Metadata = {
  title: "Ask about my work",
  description: "Questions about Aashar's work, answered only from his CV and project notes, with sources.",
};

export default function AskPage() {
  return (
    <>
      <header className="doc-head">
        <p className="crumbs">Ask</p>
        <h1>Ask about my work.</h1>
        <p>
          Answers come only from the corpus behind this site, each with numbered sources. If nothing covers the
          question, it says so instead of guessing.
        </p>
      </header>
      <section className="sec" aria-label="Ask tool">
        <div className="rail">
          <b>→</b>Question
        </div>
        <AskTool />
      </section>
    </>
  );
}
