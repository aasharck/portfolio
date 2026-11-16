import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrowhead, Box, CaseSections, DIAGRAM_CSS } from "@/components/case-sections";

export const metadata: Metadata = {
  title: "Hareef case study",
  description:
    "An AI football coach for young players in the Gulf: an Arabic-first iOS app on Expo, with a Claude coach and video clip review behind subscription-checked, rate-limited edge functions. Live on the App Store.",
};

const APP_STORE = "https://apps.apple.com/app/id6832931407";

// Models, caps and cache times are from the Hareef README.
function Diagram() {
  return (
    <figure className="diagram" aria-labelledby="dg-cap" tabIndex={0}>
      <svg viewBox="0 0 1040 310" role="img" aria-labelledby="dg-title dg-desc">
        <title id="dg-title">Hareef request path</title>
        <desc id="dg-desc">
          The iPhone app has no accounts: a random device id, with the profile kept on the phone. Coach and clip
          requests go to Supabase edge functions, which check the subscription with RevenueCat, rebuild and validate the
          input and apply daily caps, then call Claude Haiku for the coach or Claude Sonnet for a 12-frame clip review.
          XP goes to a separate function with a daily cap before it reaches the leaderboard.
        </desc>
        <style>{DIAGRAM_CSS}</style>
        <Arrowhead />
        <Box x={10} y={60} w={200} name="iPhone app" sub="device id · data on phone" />
        <Box x={260} y={60} w={190} name="Subscriber check" sub="RevenueCat · 10 min cache" />
        <Box x={490} y={60} w={190} name="Validate + cap" sub="60 msgs · 5 clips a day" />
        <Box x={730} y={20} w={220} name="Coach chat" sub="Claude Haiku" />
        <Box x={730} y={100} w={220} name="Clip review" sub="Claude Sonnet · 12 frames" hot />
        <line className="dg-line" x1="210" y1="88" x2="258" y2="88" markerEnd="url(#arr)" />
        <line className="dg-line" x1="450" y1="88" x2="488" y2="88" markerEnd="url(#arr)" />
        <path className="dg-line" d="M680 80 H705 V48 H728" markerEnd="url(#arr)" />
        <path className="dg-line" d="M680 96 H705 V128 H728" markerEnd="url(#arr)" />
        {/* XP path */}
        <path className="dg-dash" d="M110 116 V198 H488" markerEnd="url(#arr)" />
        <Box x={490} y={170} w={190} name="XP function" sub="400 XP daily cap" />
        <line className="dg-line" x1="680" y1="198" x2="728" y2="198" markerEnd="url(#arr)" />
        <Box x={730} y={170} w={220} name="Leaderboard" sub="Postgres · service role only" />
        {/* infrastructure band */}
        <rect className="dg-band" x="10" y="244" width="1020" height="56" />
        <text className="dg-t" x="24" y="266">
          Supabase Postgres + Deno edge functions · per-address rate limits · refund on server failure
        </text>
        <text className="dg-s" x="24" y="286">
          no sign-up: trust lives on the server · coach context rebuilt from a whitelist · 60 new device ids per address
          per hour
        </text>
      </svg>
      <figcaption id="dg-cap" className="hint" style={{ marginTop: "0.5rem" }}>
        The phone never decides who has paid or how much XP counts; every edge function checks for itself.
      </figcaption>
    </figure>
  );
}

export default function HareefCaseStudy() {
  const order = [
    "what-it-is",
    "the-ai-coach-and-clip-review",
    "no-accounts-still-safe",
    "arabic-first",
    "what-is-built",
    "shipping-it",
    "stack",
  ];

  return (
    <article>
      <header className="doc-head">
        <p className="crumbs">
          <Link href="/#work">Work</Link> / Hareef
        </p>
        <h1>
          Hareef: an AI football coach, <em>Arabic first.</em>
        </h1>
        <p>
          A training app for young players in the Gulf: a weekly plan for their position, an AI coach to ask anything,
          and clip reviews that score a skill and say what to fix. I built it solo, from first commit to App Store
          submission in about a week. It is live on the App Store.
        </p>
        <div className="actions">
          <a className="btn ghost" href={APP_STORE} rel="noopener">
            App Store ↗
          </a>
          <a className="btn ghost" href="https://hareefapp.com" rel="noopener">
            hareefapp.com ↗
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
          <h2 id="arch">The request path at a glance</h2>
          <Diagram />
          <figure className="figure">
            <Image
              src="/work/hareef-app.jpg"
              alt="Hareef App Store screenshots: a personal training plan, today's drills, a step-by-step drill guide and the weekly leaderboard."
              width={1400}
              height={800}
              sizes="(max-width: 900px) 100vw, 46rem"
            />
            <figcaption className="hint">Hareef&apos;s App Store screenshots (English)</figcaption>
          </figure>
        </div>
      </section>

      <CaseSections slug="hareef" order={order} />
    </article>
  );
}
