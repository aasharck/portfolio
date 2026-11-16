import { Prose } from "@/components/prose";
import { chunksOf } from "@/lib/corpus";

/** Shared SVG styles for the case-study diagrams (colours come from the theme tokens). */
export const DIAGRAM_CSS = `
  .dg-box{fill:var(--bg);stroke:var(--ink);stroke-width:1.2}
  .dg-hot{fill:var(--red);stroke:var(--red);stroke-width:1.2}
  .dg-t{fill:var(--ink);font:500 13px var(--font-mono),monospace}
  .dg-s{fill:var(--muted);font:11px var(--font-mono),monospace}
  .dg-line{stroke:var(--ink);stroke-width:1.2;fill:none}
  .dg-dash{stroke:var(--muted);stroke-width:1.2;fill:none;stroke-dasharray:4 3}
  .dg-gate{fill:var(--ink)}
  .dg-acc{fill:#fff}
  .dg-band{fill:var(--panel-2);stroke:var(--rule)}
`;

export function Arrowhead() {
  return (
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
  );
}

/** A labelled box in a diagram; `hot` marks the step the story is about. */
export function Box(p: { x: number; y: number; w?: number; name: string; sub: string; hot?: boolean }) {
  const w = p.w ?? 125;
  return (
    <g>
      <rect className={p.hot ? "dg-hot" : "dg-box"} x={p.x} y={p.y} width={w} height="56" />
      <text className={p.hot ? "dg-t dg-acc" : "dg-t"} x={p.x + 10} y={p.y + 24}>
        {p.name}
      </text>
      <text className={p.hot ? "dg-s dg-acc" : "dg-s"} x={p.x + 10} y={p.y + 43}>
        {p.sub}
      </text>
    </g>
  );
}

/** Renders a corpus document's sections in the given order (unlisted ones go last). */
export function CaseSections({ slug, order }: { slug: string; order: string[] }) {
  const chunks = chunksOf(slug);
  const byAnchor = Object.fromEntries(chunks.map((c) => [c.anchor, c]));
  const ordered = [
    ...order.map((a) => byAnchor[a]).filter(Boolean),
    ...chunks.filter((c) => !order.includes(c.anchor)),
  ];
  return ordered.map((c, i) => (
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
  ));
}
