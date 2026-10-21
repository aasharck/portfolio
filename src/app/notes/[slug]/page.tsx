import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { chunksOf, corpus, docOf } from "@/lib/corpus";

export function generateStaticParams() {
  return corpus.docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = docOf(slug);
  return doc ? { title: doc.title, description: doc.summary } : {};
}

export default async function NotePage(props: PageProps<"/notes/[slug]">) {
  const { slug } = await props.params;
  const doc = docOf(slug);
  if (!doc) notFound();
  const chunks = chunksOf(slug);
  return (
    <article>
      <header className="doc-head">
        <p className="crumbs">
          <Link href="/notes">Corpus</Link> / {doc.slug}
        </p>
        <h1>{doc.title}</h1>
        <p>{doc.summary}</p>
        {doc.url && (
          <p className="mono hint">
            <a href={doc.url} rel="noopener">
              {doc.url.replace(/^https?:\/\/(www\.)?/, "")} ↗
            </a>
          </p>
        )}
        {slug === "sitesgen" && (
          <p className="mono hint">
            <Link href="/work/sitesgen">Read it as a case study, with the architecture diagram →</Link>
          </p>
        )}
      </header>
      {chunks.map((c, i) => (
        <section key={c.id} id={c.anchor} className="doc-sec" aria-labelledby={`h-${c.anchor}`}>
          <div className="rail">
            <b>{String(i + 1).padStart(2, "0")}</b>
            <a href={`#${c.anchor}`} aria-label={`Link to ${c.heading}`}>
              #{c.anchor.slice(0, 18)}
            </a>
          </div>
          <div>
            <h2 id={`h-${c.anchor}`}>{c.heading}</h2>
            <Prose text={c.text} />
            <p className="source">Source: {c.source}</p>
          </div>
        </section>
      ))}
    </article>
  );
}
