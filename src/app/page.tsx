import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AskTool } from "@/components/ask-tool";
import { Clock } from "@/components/clock";
import { FitTool } from "@/components/fit-tool";
import { TextRing } from "@/components/text-ring";

interface Show {
  id: string;
  title: ReactNode;
  cats: string;
  text: string;
  media: { src: string; alt: string; w: number; h: number } | null;
  links: { href: string; label: string; external?: boolean }[];
}

const SHOWS: Show[] = [
  {
    id: "00-1",
    title: "SitesGen",
    cats: "Multi-agent AI · SaaS · Founder",
    text: "An app that finds local businesses with weak websites, builds each one a new site automatically and writes the sales pitch. Eight AI agents, about 33¢ of AI cost per site. Built and launched solo in about a month; live, with a first customer on a paid trial.",
    media: { src: "/work/sitesgen-hero.jpg", alt: "SitesGen landing page", w: 1270, h: 760 },
    links: [
      { href: "/work/sitesgen", label: "Case study" },
      { href: "https://www.sitesgen.com", label: "Visit site", external: true },
    ],
  },
  {
    id: "00-2",
    title: (
      <>
        Tracco<em>AI</em>
      </>
    ),
    cats: "LLM analytics · Dashboard · Solo build",
    text: "Shows brands how often ChatGPT, Claude, Gemini and Perplexity recommend them, tracked over time and against competitors. A scheduled Node.js backend queries all four models; PostgreSQL keeps the history fast.",
    media: { src: "/work/traccoai-home.jpg", alt: "TraccoAI landing page with its dashboard", w: 1400, h: 1050 },
    links: [
      { href: "/notes/traccoai", label: "Notes" },
      { href: "https://www.traccoai.com", label: "Visit site", external: true },
    ],
  },
  {
    id: "00-3",
    title: (
      <>
        Support <em>agent</em>
      </>
    ),
    cats: "RAG · Tool use · Evals · Demo",
    text: "Answers customer questions only from a shop's own help pages, cites every answer, says “I don't know” instead of guessing, and looks up orders safely. 47 tests and a 15-question eval. A demo for a made-up shop.",
    media: { src: "/work/support-agent.jpg", alt: "The support agent answering with a cited source", w: 1400, h: 1050 },
    links: [{ href: "/notes/ai-support-agent", label: "Notes" }],
  },
  {
    id: "00-4",
    title: (
      <>
        RLS <em>check</em>
      </>
    ),
    cats: "Security · CLI · Postgres",
    text: "A command-line check that finds the database settings that leak data in Supabase apps, with the SQL to fix each one. Read-only by design, and it fails CI on a high-severity finding.",
    media: null,
    links: [{ href: "/notes/supabase-rls-check", label: "Notes" }],
  },
];

const SKILLS = [
  ["AI agents", "Multi-agent pipelines on Claude, tool use, structured outputs"],
  ["RAG & evals", "Retrieval with citations, refusals, eval sets, cost per answer"],
  ["Full-stack", "React, Next.js, TypeScript, Node.js, Python (FastAPI)"],
  ["Data", "Postgres, Supabase with RLS, AWS Glue and Athena, ETL"],
  ["Cloud", "AWS Lambda, API Gateway, AppSync, DynamoDB, Vercel"],
  ["Security", "Smart-contract audits, application security reviews"],
];

const JOBS = [
  {
    when: "2024 – now",
    role: "Full-Stack Engineer",
    where: "iBloxx Studios DMCC, Dubai",
    what: "React, Next.js and FastAPI apps, including an NFT marketplace and an analytics dashboard; serverless AWS services; Glue/Athena data workflows; Jenkins CI/CD; Solidity contracts; a Telegram mini-game taken to live users.",
  },
  {
    when: "2023",
    role: "Full-Stack Engineer",
    where: "Dunesberry, Riyadh",
    what: "Introduced React across the organisation; it became the front-end standard for later projects. Client sites and apps on React, Next.js, Node.js and MongoDB.",
  },
  {
    when: "2022 – 2023",
    role: "Full-Stack Engineer, freelance",
    where: "Independent, remote",
    what: "Web apps for international clients, decentralised apps with Ethers.js and Solidity, and competitive smart-contract audits.",
  },
  {
    when: "2020 – 2022",
    role: "Programmer Analyst, ETL",
    where: "Cognizant, remote",
    what: "Production data pipelines in Informatica PowerCenter across Oracle, Salesforce and flat files, at enterprise volume.",
  },
];

function LetterWall() {
  return (
    <div className="wall" aria-hidden="true">
      {["W", "O", "R", "K"].map((l) => (
        <div className="wall-row" key={l}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      ))}
      <div className="wall-cards">
        <div className="wall-card" style={{ right: "6%", top: "8%" }}>
          <Image src="/work/sitesgen-examples.jpg" alt="" width={1270} height={760} sizes="34vw" />
          <span className="tag mono">
            <span>SITESGEN / GENERATED SITES</span>
            <span>#SG-0001/04</span>
          </span>
        </div>
        <div className="wall-card" style={{ left: "5%", top: "46%" }}>
          <Image src="/work/traccoai-home.jpg" alt="" width={1400} height={1050} sizes="34vw" />
          <span className="tag mono">
            <span>TRACCOAI / DASHBOARD</span>
            <span>#TR-0002/04</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <p className="tagline">
          <em>A full-stack &amp; AI engineer</em> who builds products end to end, and the AI inside them.
        </p>
        <TextRing text="AVAILABLE IMMEDIATELY · FULL-STACK · AI ENGINEER · DUBAI · " />
        <h1 id="hero-title" className="bigname">
          <span className="word">
            <span>Aashar</span>
          </span>{" "}
          <span className="word">
            <span>
              <em>CK</em>
            </span>
          </span>
        </h1>
        <div className="hero-bar caps">
          <Clock />
          <span>
            <a href="https://github.com/aasharck" rel="noopener">
              GitHub
            </a>{" "}
            / <a href="mailto:aasharck@gmail.com">Email</a> / <Link href="#fit">Fit check</Link>
          </span>
          <span className="dot">Available immediately</span>
        </div>
      </section>

      <section className="sec" aria-labelledby="info-title">
        <span className="label">(Info)</span>
        <div className="split">
          <h2 id="info-title" className="statement">
            Five years across the stack, from data pipelines <em>to AI agents in production.</em>
          </h2>
          <div>
            <p className="body">
              I&apos;m Aashar, a full-stack engineer in Dubai. I build web products end to end, and the AI inside them:
              agents that run in production, answers that cite their sources, and model costs that are measured, not
              guessed. I own the architecture, ship it, and document what shipped.
            </p>
            <p className="body">
              Hiring? Paste your job description below and an AI agent checks it against my record, requirement by
              requirement, with sources.
            </p>
            <Link className="textlink" href="#fit">
              Check my fit for your role
            </Link>
          </div>
        </div>
        <div className="numeral" aria-label="5+ years of experience">
          <strong>5+</strong>
          <span className="caps">(Years)</span>
        </div>
      </section>

      <LetterWall />

      <section className="sec" id="work" aria-labelledby="work-title">
        <div className="sec-title">
          <div>
            <span className="label">(Work)</span>
            <h2 id="work-title">
              Selected <em>work</em>
            </h2>
          </div>
          <p className="caps muted">Things I built and shipped (04)</p>
        </div>
        <ol className="shows">
          {SHOWS.map((s) => (
            <li className="show" key={s.id}>
              <div className="show-media">
                <div className="show-head caps muted">
                  <span className="mono">{s.id}</span>
                  <span>{s.media ? "Preview" : "CLI"}</span>
                </div>
                {s.media ? (
                  <Image
                    src={s.media.src}
                    alt={s.media.alt}
                    width={s.media.w}
                    height={s.media.h}
                    sizes="(max-width: 860px) 100vw, 58vw"
                  />
                ) : (
                  <div className="plain mono">$ npm run check</div>
                )}
              </div>
              <div className="show-text">
                <h3>{s.title}</h3>
                <p className="cats caps">{s.cats}</p>
                <p>{s.text}</p>
                <p className="show-links caps">
                  {s.links.map((l) =>
                    l.external ? (
                      <a key={l.href} href={l.href} rel="noopener">
                        → {l.label}
                      </a>
                    ) : (
                      <Link key={l.href} href={l.href}>
                        → {l.label}
                      </Link>
                    ),
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="also body muted">
          Also shipped: SwitchBoardAI, a multi-agent coordination platform with per-agent memory; AqarMetrics, a Dubai
          real-estate dashboard; and stashlr.com, grown to 30,000 pageviews a month through SEO.
        </p>
      </section>

      <section className="sec glow" id="fit" aria-labelledby="fit-title">
        <div className="sec-title">
          <div>
            <span className="label">(Fit check)</span>
            <h2 id="fit-title">
              Paste a job description. <em>See the evidence.</em>
            </h2>
          </div>
          <p className="body">
            An AI agent pulls out each requirement, searches my CV and project notes, and quotes what it finds with a
            link to the source, or says plainly that there is no direct evidence. Open &ldquo;Under the hood&rdquo; to
            see what it retrieved and what it cost.
          </p>
        </div>
        <FitTool />
      </section>

      <section className="sec" id="ask" aria-labelledby="ask-title">
        <div className="sec-title">
          <div>
            <span className="label">(Ask)</span>
            <h2 id="ask-title">
              Ask about <em>my work.</em>
            </h2>
          </div>
          <p className="body">
            Answers come only from my CV and project notes, with numbered sources. If nothing covers the question, it
            says so instead of guessing.
          </p>
        </div>
        <AskTool />
      </section>

      <section className="sec" aria-labelledby="skills-title">
        <span className="label">(What I do)</span>
        <h2 id="skills-title" className="sr-only">
          What I do
        </h2>
        <ul className="biglist">
          {SKILLS.map(([k, v]) => (
            <li key={k}>
              <strong>{k}</strong>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sec" id="experience" aria-labelledby="exp-title">
        <div className="sec-title">
          <div>
            <span className="label">(Experience)</span>
            <h2 id="exp-title">
              From pipelines <em>to agents.</em>
            </h2>
          </div>
          <p className="caps muted">
            B.Tech Computer Science, MITS Kochi, 2020 · <Link href="/notes/experience">Full notes</Link>
          </p>
        </div>
        <ul className="jobs">
          {JOBS.map((j) => (
            <li key={j.when}>
              <span className="caps muted">{j.when}</span>
              <div>
                <h3>{j.role}</h3>
                <p className="where">{j.where}</p>
              </div>
              <p className="what">{j.what}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="sec" id="security" aria-labelledby="sec-title">
        <div className="sec-title">
          <div>
            <span className="label">(Security)</span>
            <h2 id="sec-title">
              I read code <em>like an attacker.</em>
            </h2>
          </div>
          <p className="body">
            Findings from competitive smart-contract audits on Code4rena and Sherlock. On SitesGen I found that users
            could write past their plan limits through the database API, closed it, and proved the fix with a real user
            token. <Link href="/notes/security">More on my security work</Link>
          </p>
        </div>
        <div className="findings" aria-label="Audit findings: 4 High, 2 Medium">
          <div>
            <strong>4</strong>
            <em>High</em>
          </div>
          <div>
            <strong>2</strong>
            <em>Medium</em>
          </div>
        </div>
      </section>

      <section className="contact glow" id="contact" aria-labelledby="contact-title">
        <span className="label">(Contact)</span>
        <div className="contact-grid">
          <h2 id="contact-title" className="statement">
            Let&apos;s build something <em>that ships.</em>
          </h2>
          <dl>
            <dt>
              <em>Email</em>
            </dt>
            <dd>
              <a href="mailto:aasharck@gmail.com">aasharck@gmail.com</a>
            </dd>
            <dt>
              <em>Code</em>
            </dt>
            <dd>
              <a href="https://github.com/aasharck" rel="noopener">
                github.com/aasharck
              </a>
            </dd>
            <dt>
              <em>Based</em>
            </dt>
            <dd>Dubai, UAE</dd>
            <dt>
              <em>Status</em>
            </dt>
            <dd>Available immediately</dd>
          </dl>
        </div>
        <p className="monogram" aria-hidden="true">
          A—CK<em>26</em>
        </p>
      </section>
    </>
  );
}
