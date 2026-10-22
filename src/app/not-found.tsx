import Link from "next/link";

export default function NotFound() {
  return (
    <section className="doc-head notfound" aria-labelledby="nf-title">
      <p className="crumbs">Error 404</p>
      <h1 id="nf-title">
        Not in the record. <em>Like Kubernetes.</em>
      </h1>
      <p>This page doesn&apos;t exist. The fit check and the chat would tell you the same thing, with sources.</p>
      <div className="actions">
        <Link className="btn" href="/">
          Home
        </Link>
        <Link className="btn ghost" href="/fit">
          Check my fit
        </Link>
        <Link className="btn ghost" href="/notes">
          Everything that is in the record
        </Link>
      </div>
    </section>
  );
}
