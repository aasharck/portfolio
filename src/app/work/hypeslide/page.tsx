import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrowhead, Box, CaseSections, DIAGRAM_CSS } from "@/components/case-sections";

export const metadata: Metadata = {
  title: "HypeSlide case study",
  description:
    "Finds the TikTok slideshows going viral in a product's niche and remakes them for it. A layout reader, a copywriter and a code renderer as separate agents, a Postgres job queue, spend caps and an MCP server.",
};

// Costs and models are from HypeSlide's PROGRESS.md (measured live, Nov 2026).
function Diagram() {
  return (
    <figure className="diagram" aria-labelledby="dg-cap" tabIndex={0}>
      <svg viewBox="0 0 1040 300" role="img" aria-labelledby="dg-title dg-desc">
        <title id="dg-title">HypeSlide pipeline</title>
        <desc id="dg-desc">
          Find: the product link is read into a market profile, a niche scan searches TikTok and the shared library, a
          topic check reads the slides of each post, and the feed ranks what is left. The user picks a post. Make: a
          layout reader measures every slide, a copywriter writes new text, images are found or generated, and a code
          renderer redraws the layout into 1080 by 1920 slides in a ZIP. An MCP server exposes the same tools to agents.
          Jobs run from a Postgres queue, every table has row-level security, and spend caps live in the database.
        </desc>
        <style>{DIAGRAM_CSS}</style>
        <Arrowhead />
        {/* find */}
        <Box x={10} y={30} w={150} name="Your link" sub="Opus reads product" />
        <Box x={190} y={30} w={150} name="Niche scan" sub="TikTok + library" />
        <Box x={370} y={30} w={150} name="Topic check" sub="Haiku · $0.0002/post" />
        <Box x={550} y={30} w={150} name="Feed" sub="ranked by format" />
        {[160, 340, 520].map((x) => (
          <line key={x} className="dg-line" x1={x} y1="58" x2={x + 28} y2="58" markerEnd="url(#arr)" />
        ))}
        <Box x={880} y={30} w={150} name="MCP server" sub="scoped, hashed keys" />
        <path className="dg-dash" d="M880 58 H704" markerEnd="url(#arr)" />
        <text className="dg-s" x="730" y="50">
          agents
        </text>
        {/* you pick */}
        <path className="dg-line" d="M625 86 V102 H85 V128" markerEnd="url(#arr)" />
        <rect className="dg-gate" x="330" y="96" width="12" height="12" />
        <text className="dg-s" x="300" y="122">
          you pick a post
        </text>
        {/* make */}
        <Box x={10} y={130} w={150} name="Layout reader" sub="Opus · 7¢/10 slides" />
        <Box x={190} y={130} w={150} name="Copywriter" sub="Opus · $0.025" />
        <Box x={370} y={130} w={150} name="Images" sub="stock or Higgsfield" />
        <Box x={550} y={130} w={150} name="Renderer" sub="code · canvas · $0" hot />
        <Box x={730} y={130} w={150} name="ZIP" sub="1080×1920 slides" />
        {[160, 340, 520, 700].map((x) => (
          <line key={x} className="dg-line" x1={x} y1="158" x2={x + 28} y2="158" markerEnd="url(#arr)" />
        ))}
        {/* infrastructure band */}
        <rect className="dg-band" x="10" y="226" width="1020" height="60" />
        <text className="dg-t" x="24" y="250">
          Postgres job queue · cron workers with 50 s and 270 s budgets · backoff and dead-letter
        </text>
        <text className="dg-s" x="24" y="270">
          RLS on every table · credits, quotas and spend caps in SECURITY DEFINER functions · providers mockable in
          tests
        </text>
      </svg>
      <figcaption id="dg-cap" className="hint" style={{ marginTop: "0.5rem" }}>
        Layout reads are cached per post and shared by every user, so the $0.07 is paid once per viral post, not per
        remake.
      </figcaption>
    </figure>
  );
}

export default function HypeSlideCaseStudy() {
  const order = [
    "what-it-is",
    "the-agents-one-model-per-job",
    "remakes-that-copy-the-layout-not-a-template",
    "getting-the-niche-right",
    "the-library",
    "architecture-queue-tenancy-and-spend-caps",
    "for-agents-an-mcp-server",
    "testing-and-shipping",
    "stack",
  ];

  return (
    <article>
      <header className="doc-head">
        <p className="crumbs">
          <Link href="/#work">Work</Link> / HypeSlide
        </p>
        <h1>
          HypeSlide: what&apos;s already viral, <em>remade for your product.</em>
        </h1>
        <p>
          A SaaS for founders marketing on TikTok. Paste your product&apos;s link and it finds the slideshows going
          viral in your niche, explains why they worked and redraws the ones you pick for your product. I built it solo;
          it is live with paid plans.
        </p>
        <div className="actions">
          <a className="btn ghost" href="https://hypeslide.com" rel="noopener">
            hypeslide.com ↗
          </a>
          <Link className="btn ghost" href="/ask">
            Ask about my work →
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
          <figure className="figure">
            <Image
              src="/work/hypeslide-flow.jpg"
              alt="HypeSlide's three steps: it reads your product, finds what's viral in your niche, and remakes a viral slideshow for your product."
              width={1200}
              height={640}
              sizes="(max-width: 900px) 100vw, 46rem"
            />
            <figcaption className="hint">
              From hypeslide.com: link in, viral slideshow out, remade for the product
            </figcaption>
          </figure>
        </div>
      </section>

      <CaseSections slug="hypeslide" order={order} />
    </article>
  );
}
