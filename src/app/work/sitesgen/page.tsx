import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Prose } from "@/components/prose";
import { chunksOf } from "@/lib/corpus";

export const metadata: Metadata = {
  title: "SitesGen case study",
  description:
    "Eight Claude agents, a resumable job queue, row-level-security tenancy and about $0.33 of model spend per generated site. Built and launched solo in about a month.",
};

// Stages of the pipeline as drawn in the diagram. Model names and costs are from the README.
const STAGES = [
  { x: 10, name: "Discovery", model: "rules · no model", y: 40 },
  { x: 150, name: "Screening", model: "Haiku", y: 40 },
  { x: 290, name: "Visual check", model: "Haiku", y: 40 },
  { x: 470, name: "Photo reader", model: "Haiku · $0.04", y: 40 },
  { x: 610, name: "UI/UX plan", model: "Opus · $0.17", y: 40 },
  { x: 750, name: "Build", model: "code · $0.00", y: 40 },
  { x: 890, name: "Outreach", model: "Opus · $0.05", y: 40 },
];

function Diagram() {
  return (
    <figure className="diagram" aria-labelledby="dg-cap" tabIndex={0}>
      <svg viewBox="0 0 1040 300" role="img" aria-labelledby="dg-title dg-desc">
        <title id="dg-title">SitesGen agent pipeline</title>
        <desc id="dg-desc">
          Discovery, Screening and Visual check run on a scan. The user approves a prospect. Photo reader, UI/UX plan,
          Build and Outreach run as queued jobs. Design review critiques a built page and sends plan changes back to the
          planner. All jobs run from a Postgres queue drained by a worker, and every table is scoped to a workspace by
          row-level security.
        </desc>
        <style>{`
          .dg-box{fill:var(--bg);stroke:var(--ink);stroke-width:1.2}
          .dg-hot{fill:var(--accent);stroke:var(--ink);stroke-width:1.2}
          .dg-t{fill:var(--ink);font:500 13px var(--font-mono),monospace}
          .dg-s{fill:var(--muted);font:11px var(--font-mono),monospace}
          .dg-line{stroke:var(--ink);stroke-width:1.2;fill:none}
          .dg-dash{stroke:var(--muted);stroke-width:1.2;fill:none;stroke-dasharray:4 3}
          .dg-gate{fill:var(--ink)}
          .dg-acc{fill:var(--accent-ink)}
          .dg-band{fill:var(--bg-2);stroke:var(--rule)}
        `}</style>
        <defs>
          <marker
            id="arr"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" style={{ fill: "var(--ink)" }} />
          </marker>
        </defs>
        {STAGES.map((s, i) => (
          <g key={s.name}>
            <rect className={s.name === "Build" ? "dg-hot" : "dg-box"} x={s.x} y={s.y} width="125" height="56" />
            <text className={s.name === "Build" ? "dg-t dg-acc" : "dg-t"} x={s.x + 10} y={s.y + 24}>
              {s.name}
            </text>
            <text className={s.name === "Build" ? "dg-s dg-acc" : "dg-s"} x={s.x + 10} y={s.y + 43}>
              {s.model}
            </text>
            {i < STAGES.length - 1 && i !== 2 && (
              <line
                className="dg-line"
                x1={s.x + 125}
                y1={s.y + 28}
                x2={STAGES[i + 1].x - 2}
                y2={s.y + 28}
                markerEnd="url(#arr)"
              />
            )}
          </g>
        ))}
        {/* human approval gate between scan and build */}
        <line className="dg-line" x1="415" y1="68" x2="468" y2="68" markerEnd="url(#arr)" />
        <rect className="dg-gate" x="434" y="56" width="16" height="24" />
        <text className="dg-s" x="404" y="122">
          you approve
        </text>
        <rect className="dg-gate" x="1020" y="56" width="12" height="24" />
        <text className="dg-s" x="968" y="122">
          you send
        </text>
        {/* design review loop */}
        <rect className="dg-box" x="680" y="150" width="140" height="50" />
        <text className="dg-t" x="690" y="172">
          Design review
        </text>
        <text className="dg-s" x="690" y="190">
          Sonnet · plan diffs
        </text>
        <path className="dg-dash" d="M812 96 V150" markerEnd="url(#arr)" />
        <path className="dg-dash" d="M690 150 V98" markerEnd="url(#arr)" />
        {/* infrastructure band */}
        <rect className="dg-band" x="10" y="226" width="1020" height="60" />
        <text className="dg-t" x="24" y="250">
          Postgres job queue · pg_cron worker · checkpoints resume across 300 s ticks
        </text>
        <text className="dg-s" x="24" y="270">
          every table scoped by workspace_id under RLS · browser key is read-only · writes via server actions after plan
          checks
        </text>
      </svg>
      <figcaption id="dg-cap" className="hint" style={{ marginTop: "0.5rem" }}>
        Model per agent and cost per stage from the SitesGen README. Each site also carries a $0.07 share of the scan
        that found it.
      </figcaption>
    </figure>
  );
}

export default function SitesGenCaseStudy() {
  const chunks = chunksOf("sitesgen");
  const byAnchor = Object.fromEntries(chunks.map((c) => [c.anchor, c]));
  const order = [
    "what-it-is",
    "the-eight-agents",
    "cost-per-site",
    "how-the-cost-came-down",
    "models-write-plans-code-writes-html",
    "architecture-tenancy-and-the-queue",
    "resumable-jobs",
    "discovery-getting-the-data-right",
    "security-work-on-sitesgen",
    "shipping-it",
    "stack",
    "what-he-d-do-next",
  ];
  const ordered = [
    ...order.map((a) => byAnchor[a]).filter(Boolean),
    ...chunks.filter((c) => !order.includes(c.anchor)),
  ];

  return (
    <article>
      <header className="doc-head">
        <p className="crumbs">
          <Link href="/#work">Work</Link> / SitesGen
        </p>
        <h1>SitesGen: eight agents, one queue, about 33 cents a site.</h1>
        <p>
          A multi-tenant SaaS that finds local businesses with failing websites, builds each a new one and writes the
          pitch. I built and launched it solo in about a month. It is live, with subscription billing and a first
          customer on a paid trial.
        </p>
        <div className="actions">
          <a className="btn ghost" href="https://www.sitesgen.com" rel="noopener">
            sitesgen.com ↗
          </a>
          <Link className="btn ghost" href="/fit">
            Check my fit for your role →
          </Link>
        </div>
      </header>

      <section className="doc-sec" aria-labelledby="arch">
        <div className="rail">
          <b>00</b>Architecture
        </div>
        <div>
          <h2 id="arch">The pipeline at a glance</h2>
          <Diagram />
          <h3 style={{ fontSize: "1.2rem", marginTop: "2rem" }}>Where the $0.33 goes</h3>
          <div className="costbar" aria-hidden="true">
            <div style={{ flex: 17 }}>plan $0.17</div>
            <div style={{ flex: 7 }}>scan $0.07</div>
            <div style={{ flex: 5 }}>pitch</div>
            <div style={{ flex: 4, background: "var(--rule)", color: "var(--ink)" }}>photos</div>
          </div>
          <ul className="costkey">
            <li>
              <span>UI/UX design plan (Opus)</span>
              <span>$0.17</span>
            </li>
            <li>
              <span>share of the neighbourhood scan</span>
              <span>$0.07</span>
            </li>
            <li>
              <span>pitch (Opus)</span>
              <span>$0.05</span>
            </li>
            <li>
              <span>photo reader (Haiku)</span>
              <span>$0.04</span>
            </li>
            <li>
              <span>build (code, no model)</span>
              <span>$0.00</span>
            </li>
            <li>
              <strong>per site, measured</strong>
              <strong>≈ $0.33</strong>
            </li>
          </ul>
          <figure className="figure">
            <Image
              src="/work/sitesgen-examples.jpg"
              alt="Example websites generated by SitesGen for demo businesses, each in a different design kit."
              width={1270}
              height={760}
              sizes="(max-width: 900px) 100vw, 46rem"
            />
            <figcaption className="hint">
              Example sites from sitesgen.com, rendered by the app for demo businesses
            </figcaption>
          </figure>
        </div>
      </section>

      {ordered.map((c, i) => (
        <section key={c.id} id={c.anchor} className="doc-sec" aria-labelledby={`h-${c.anchor}`}>
          <div className="rail">
            <b>{String(i + 1).padStart(2, "0")}</b>
            {c.heading.split(/[:,]/)[0]}
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
