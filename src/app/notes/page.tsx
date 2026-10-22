import type { Metadata } from "next";
import Link from "next/link";
import { corpus } from "@/lib/corpus";

export const metadata: Metadata = {
  title: "The corpus",
  description: "Every fact on this site, with its source. The fit check and the chat answer only from these notes.",
};

export default function NotesIndex() {
  return (
    <>
      <header className="doc-head">
        <p className="crumbs">Corpus</p>
        <h1>
          Every fact on this site, <em>with its source.</em>
        </h1>
        <p>
          The pages, the fit check and the chat all read from these notes and nothing else. {corpus.docs.length}{" "}
          documents, {corpus.chunks.length} sections, each ending in the line it came from.
        </p>
      </header>
      <ol className="rows" style={{ marginTop: 0, borderTop: 0 }}>
        {corpus.docs.map((d, i) => (
          <li key={d.slug}>
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            <h2 style={{ fontSize: "1.3rem" }}>
              <Link href={d.slug === "sitesgen" ? "/work/sitesgen" : `/notes/${d.slug}`}>{d.title}</Link>
            </h2>
            <p>{d.summary}</p>
            <span className="go">{corpus.chunks.filter((c) => c.doc === d.slug).length} sections</span>
          </li>
        ))}
      </ol>
    </>
  );
}
