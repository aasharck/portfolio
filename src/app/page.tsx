import Link from "next/link";
import { AskTool } from "@/components/ask-tool";
import { FitTool } from "@/components/fit-tool";
import { Magnetic } from "@/components/magnetic";
import { WorkList, type WorkItem } from "@/components/work-list";

const CAPABILITIES = [
  {
    title: "AI in production",
    text: "Multi-agent pipelines, retrieval with citations, evals and cost controls. SitesGen runs eight AI agents for about 33¢ per website.",
  },
  {
    title: "Full-stack products",
    text: "React, Next.js and TypeScript front ends; Node.js and Python (FastAPI) APIs; Postgres and Supabase with row-level security.",
  },
  {
    title: "Cloud and data",
    text: "Serverless AWS (Lambda, API Gateway, AppSync, DynamoDB), Glue and Athena workflows, and two years of enterprise ETL.",
  },
  {
    title: "Security",
    text: "Competitive smart-contract audits on Code4rena and Sherlock: 4 High and 2 Medium severity findings.",
  },
];

const WORK: WorkItem[] = [
  {
    title: "SitesGen",
    href: "/work/sitesgen",
    what: "An app that finds local businesses with weak websites, builds each one a new site automatically and writes the sales pitch. Built and launched solo in about a month; live, with a first customer on a paid trial.",
    stack: "Eight AI agents · ≈ 33¢ of AI cost per site · Next.js · Supabase · Claude",
    meta: "2026 · Founder",
    image: { src: "/work/sitesgen-hero.jpg", alt: "SitesGen landing page" },
  },
  {
    title: "TraccoAI",
    href: "/notes/traccoai",
    what: "Shows brands how often ChatGPT, Claude, Gemini and Perplexity recommend them, tracked over time and against competitors.",
    stack: "Next.js · Recharts · scheduled Node.js backend · PostgreSQL · four LLM APIs",
    meta: "2025 · Solo build",
    image: { src: "/work/traccoai-home.jpg", alt: "TraccoAI landing page with dashboard" },
  },
  {
    title: "AI support agent",
    href: "/notes/ai-support-agent",
    what: "Answers customer questions only from a shop's own help pages, cites every answer, says “I don't know” instead of guessing, and looks up orders safely. A demo for a made-up shop.",
    stack: "RAG · pgvector · tool use · 47 tests · 15-question eval",
    meta: "2026 · Demo",
    image: { src: "/work/support-agent.jpg", alt: "Support agent answering with a cited source" },
  },
  {
    title: "supabase-rls-check",
    href: "/notes/supabase-rls-check",
    what: "A command-line check that finds the database settings that leak data in Supabase apps, with the SQL to fix each one.",
    stack: "TypeScript · Postgres catalogs · read-only by design",
    meta: "2026 · CLI tool",
  },
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

function Marquee() {
  const run = (
    <>
      <span>Aashar CK —</span>
      <span>
        <i>Full-stack</i> —
      </span>
      <span>AI engineer —</span>
      <span>
        <i>Dubai</i> —
      </span>
    </>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {run}
        {run}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <div className="hero-top">
            <h1 id="hero-title">
              Full-stack <span className="amp">&amp;</span> <br />
              AI engineer.
            </h1>
            <div className="hero-side">
              <span className="arrow" aria-hidden="true">
                ↘
              </span>
              I build web products end to end, and the AI inside them: agents that run in production, answers that cite
              their sources, and model costs that are measured, not guessed.
              <p className="status">
                <span className="live">Available immediately</span>
                <span>Dubai, UAE</span>
                <span>5+ years</span>
              </p>
            </div>
          </div>
          <div className="hero-cta">
            <Magnetic>
              <Link className="orb" href="#fit">
                Check my fit<span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
            <p>
              Paste a job description. An AI agent checks it against my record, requirement by requirement, and shows
              its sources.
            </p>
          </div>
        </div>
        <Marquee />
      </section>

      <section className="sec" aria-labelledby="do-title">
        <div className="sec-head">
          <div>
            <span className="kicker">What I do</span>
            <h2 id="do-title">Products end to end, with the AI inside.</h2>
          </div>
          <p className="lede">
            Five years across the stack, from enterprise data pipelines to multi-agent AI. I own the architecture, ship
            it, and document what shipped.
          </p>
        </div>
        <ul className="caps">
          {CAPABILITIES.map((c, i) => (
            <li key={c.title} className="reveal">
              <span className="n">0{i + 1}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="sec invert" id="fit" aria-labelledby="fit-title">
        <div className="sec-head">
          <div>
            <span className="kicker">Hiring? Try this</span>
            <h2 id="fit-title">Paste a job description. See the evidence.</h2>
          </div>
          <p className="lede">
            An AI agent pulls out each requirement, searches my CV and project notes, and quotes what it finds with a
            link to the source, or says plainly that there is no direct evidence. Open &ldquo;Under the hood&rdquo; to
            see what it retrieved and what it cost.
          </p>
        </div>
        <FitTool />
      </section>

      <section className="sec" id="work" aria-labelledby="work-title">
        <div className="sec-head">
          <div>
            <span className="kicker">Selected work</span>
            <h2 id="work-title">Things I built and shipped.</h2>
          </div>
          <p className="lede">
            Also shipped: SwitchBoardAI, a multi-agent coordination platform; AqarMetrics, a Dubai real-estate
            dashboard; and stashlr.com, grown to 30,000 pageviews a month through SEO.
          </p>
        </div>
        <WorkList items={WORK} />
      </section>

      <section className="sec" id="ask" aria-labelledby="ask-title">
        <div className="sec-head">
          <div>
            <span className="kicker">Ask</span>
            <h2 id="ask-title">Ask about my work.</h2>
          </div>
          <p className="lede">
            Answers come only from my CV and project notes, with numbered sources. If nothing covers the question, it
            says so instead of guessing.
          </p>
        </div>
        <AskTool />
      </section>

      <section className="sec" id="experience" aria-labelledby="exp-title">
        <div className="sec-head">
          <div>
            <span className="kicker">Experience</span>
            <h2 id="exp-title">From data pipelines to AI agents.</h2>
          </div>
          <p className="lede">
            B.Tech in Computer Science, MITS Kochi, 2020. Full detail in my{" "}
            <Link href="/notes/experience">experience notes</Link>.
          </p>
        </div>
        <ul className="timeline">
          {JOBS.map((j) => (
            <li key={j.when} className="reveal">
              <span className="when">{j.when}</span>
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
        <div className="sec-head">
          <div>
            <span className="kicker">Security</span>
            <h2 id="sec-title">I read code like an attacker.</h2>
          </div>
          <p className="lede">
            Findings from competitive smart-contract audits on Code4rena and Sherlock. On SitesGen I found that users
            could write past their plan limits through the database API, closed it, and proved the fix with a real user
            token. <Link href="/notes/security">More on security</Link>
          </p>
        </div>
        <div className="big-numbers" aria-label="Audit findings: 4 High, 2 Medium">
          <div>
            <strong>4</strong>
            <span>High</span>
          </div>
          <div>
            <strong>2</strong>
            <span>Medium</span>
          </div>
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <span className="kicker">Contact</span>
        <h2 id="contact-title">
          Let&apos;s build something
          <br />
          that ships.
        </h2>
        <div className="contact-row">
          <Magnetic>
            <a className="orb" href="mailto:aasharck@gmail.com">
              Email me<span aria-hidden="true">→</span>
            </a>
          </Magnetic>
          <a className="pill" href="mailto:aasharck@gmail.com">
            aasharck@gmail.com
          </a>
          <a className="pill" href="https://github.com/aasharck" rel="noopener">
            github.com/aasharck
          </a>
          <span className="hint">Available immediately · Dubai, UAE</span>
        </div>
      </section>
    </>
  );
}
