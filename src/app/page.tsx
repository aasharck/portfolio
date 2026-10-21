import Image from "next/image";
import Link from "next/link";
import { AskTool } from "@/components/ask-tool";
import { FitTool } from "@/components/fit-tool";

const WORK = [
  {
    n: "02",
    title: "TraccoAI",
    href: "/notes/traccoai",
    ext: "https://www.traccoai.com",
    line: "Tracks how often ChatGPT, Claude, Gemini and Perplexity recommend a brand, over time and against competitors. Built and launched solo.",
    tags: "Next.js · React · Recharts · Node.js scheduler · PostgreSQL · four LLM APIs",
  },
  {
    n: "03",
    title: "AI support agent",
    href: "/notes/ai-support-agent",
    line: "Answers only from a shop's own docs, cites every answer, says “I don't know”, looks up orders safely. 47 tests, 15-question eval. A demo, not a client project.",
    tags: "RAG · pgvector · Claude tool use + citations · zod · Vitest · Playwright",
  },
  {
    n: "04",
    title: "supabase-rls-check",
    href: "/notes/supabase-rls-check",
    line: "Read-only CLI that finds the Supabase misconfigurations that leak data, with the SQL to fix each one. Exits non-zero for CI.",
    tags: "TypeScript · node-postgres · Postgres catalogs · node:test",
  },
  {
    n: "05",
    title: "Also shipped",
    href: "/notes/other-work",
    line: "SwitchBoardAI, a multi-agent coordination platform with per-agent memory; AqarMetrics, a Dubai real-estate dashboard; stashlr.com, grown to 30,000 pageviews a month through SEO.",
    tags: "multi-agent · dashboards · SEO",
  },
];

const JOBS = [
  {
    when: "2024 – now",
    role: "Full-Stack Engineer",
    where: "iBloxx Studios DMCC · Dubai",
    what: "React, Next.js and FastAPI apps (an NFT marketplace, an analytics dashboard); serverless AWS services on Lambda, API Gateway, AppSync and DynamoDB; Glue/Athena/S3 data workflows; Jenkins CI/CD; Solidity contracts; a Telegram mini-game taken to live users.",
  },
  {
    when: "2023",
    role: "Full-Stack Engineer",
    where: "Dunesberry · Riyadh",
    what: "Introduced React across the organisation; it became the front-end standard for later projects. Client sites and apps on React, Next.js, Node.js and MongoDB.",
  },
  {
    when: "2022 – 2023",
    role: "Full-Stack Engineer, freelance",
    where: "Independent · remote",
    what: "Web apps for international clients; dApps with Ethers.js and Solidity; competitive smart-contract audits on Code4rena and Sherlock.",
  },
  {
    when: "2020 – 2022",
    role: "Programmer Analyst, ETL",
    where: "Cognizant · remote",
    what: "1.5+ years of production data pipelines in Informatica PowerCenter: Oracle, Salesforce and flat-file sources at enterprise volume; SQL tuning; Autosys scheduling.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div>
            <p className="kicker mono">Full-stack + AI engineer · Dubai, UAE · 5+ years</p>
            <h1 id="hero-title">
              I build AI systems that <em>ship</em>, and I can show the receipts.
            </h1>
            <p className="sub">
              <strong>SitesGen</strong>, my multi-agent SaaS, finds local businesses with failing websites, builds each
              one a new site and writes the pitch. Eight agents on Claude, about <strong>$0.33</strong> of model spend
              per site, built and launched solo in about a month.
            </p>
            <div className="actions">
              <Link className="btn" href="#fit">
                Paste a job description →
              </Link>
              <Link className="btn ghost" href="/work/sitesgen">
                Read the SitesGen case study
              </Link>
            </div>
          </div>
          <aside className="receipt mono" aria-label="Receipt: model spend for one SitesGen site">
            <p className="receipt-head">
              SITESGEN · 1 generated site
              <br />
              model spend, measured per job
            </p>
            <dl>
              <div>
                <dt>design plan · Opus</dt>
                <dd>$0.17</dd>
              </div>
              <div>
                <dt>share of the scan</dt>
                <dd>$0.07</dd>
              </div>
              <div>
                <dt>pitch · Opus</dt>
                <dd>$0.05</dd>
              </div>
              <div>
                <dt>photo reader · Haiku</dt>
                <dd>$0.04</dd>
              </div>
              <div>
                <dt>build · code, no model</dt>
                <dd>$0.00</dd>
              </div>
              <div className="receipt-total">
                <dt>total</dt>
                <dd>≈ $0.33</dd>
              </div>
            </dl>
            <p className="receipt-foot">
              <Link href="/work/sitesgen#cost-per-site">source: SitesGen README →</Link>
            </p>
          </aside>
        </div>
        <dl className="ledger" aria-label="In numbers">
          <div>
            <dt>agents in production</dt>
            <dd>8</dd>
          </div>
          <div>
            <dt>model spend / site</dt>
            <dd>≈ $0.33</dd>
          </div>
          <div>
            <dt>idea to launch, solo</dt>
            <dd>≈ 1 month</dd>
          </div>
          <div>
            <dt>audit findings</dt>
            <dd>4 High · 2 Med</dd>
          </div>
        </dl>
      </section>

      <section className="sec" id="fit" aria-labelledby="fit-title">
        <div className="rail">
          <b>01</b>Fit check
        </div>
        <div>
          <h2 id="fit-title">Paste a job description. Get the evidence, requirement by requirement.</h2>
          <p className="lede">
            An agent pulls out the requirements, searches my CV and project notes for each one, and cites what it finds,
            or says plainly that there is no direct evidence. Every quote is checked against its source in code before
            you see it. Open &ldquo;Under the hood&rdquo; for the retrieved chunks, scores, tokens and cost.
          </p>
          <FitTool />
        </div>
      </section>

      <section className="sec" id="work" aria-labelledby="work-title">
        <div className="rail">
          <b>02</b>Work
        </div>
        <div>
          <h2 id="work-title">The proof is running in production.</h2>
          <div className="feature">
            <figure>
              <Image
                src="/work/sitesgen-hero.jpg"
                alt="The SitesGen landing page: a neighbourhood scan ranking local businesses by how badly they need a new website, next to a generated site."
                width={1270}
                height={760}
                sizes="(max-width: 900px) 100vw, 36rem"
              />
              <figcaption>sitesgen.com · public landing page</figcaption>
            </figure>
            <div>
              <p className="mono hint">01 · Founder and sole engineer · 2026</p>
              <h3>SitesGen</h3>
              <p>
                A multi-tenant SaaS for people who sell websites to local businesses. A pipeline of eight agents scans a
                neighbourhood, scores every business&apos;s website, designs and builds each prospect a new site from
                its own photos and reviews, and writes the pitch.
              </p>
              <ul className="facts">
                <li>
                  <span>Cost</span>
                  <span>≈ $0.33 of model spend per site, measured per job and attributed per member</span>
                </li>
                <li>
                  <span>Design</span>
                  <span>Models write JSON plans; code renders the HTML, so a build costs $0 and can&apos;t fail</span>
                </li>
                <li>
                  <span>Platform</span>
                  <span>
                    Next.js 16, Supabase with row-level security, a resumable job queue, Puppeteer, Dodo billing
                  </span>
                </li>
                <li>
                  <span>Status</span>
                  <span>Live, with subscription billing and a first customer on a paid trial</span>
                </li>
              </ul>
              <div className="actions" style={{ marginTop: "1rem" }}>
                <Link className="btn" href="/work/sitesgen">
                  Case study: architecture, agents, cost →
                </Link>
                <a className="btn ghost" href="https://www.sitesgen.com" rel="noopener">
                  sitesgen.com ↗
                </a>
              </div>
            </div>
          </div>

          <ol className="rows" aria-label="More projects">
            {WORK.map((w) => (
              <li key={w.title}>
                <span className="idx">{w.n}</span>
                <h3>{w.title}</h3>
                <div>
                  <p>{w.line}</p>
                  <p className="tags">{w.tags}</p>
                </div>
                <span className="go">
                  <Link href={w.href} aria-label={`Notes on ${w.title}`}>
                    notes →
                  </Link>
                  {w.ext ? (
                    <>
                      {" · "}
                      <a href={w.ext} rel="noopener" aria-label={`${w.title} website`}>
                        site ↗
                      </a>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec" id="ask" aria-labelledby="ask-title">
        <div className="rail">
          <b>03</b>Ask
        </div>
        <div>
          <h2 id="ask-title">Ask about my work. It answers from the record or not at all.</h2>
          <p className="lede">
            Answers come only from the same corpus as this page, with numbered sources. When nothing covers the question
            it says so instead of guessing, before any model is called.
          </p>
          <AskTool />
        </div>
      </section>

      <section className="sec" id="experience" aria-labelledby="exp-title">
        <div className="rail">
          <b>04</b>Experience
        </div>
        <div>
          <h2 id="exp-title">Five years across the stack, from ETL to agents.</h2>
          <ol className="timeline">
            {JOBS.map((j) => (
              <li key={j.when}>
                <span className="when">{j.when}</span>
                <div>
                  <h3>{j.role}</h3>
                  <p className="where">{j.where}</p>
                  <p>{j.what}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="hint">
            Full detail with sources: <Link href="/notes/experience">experience notes</Link> ·{" "}
            <Link href="/notes/skills">skills</Link> · B.Tech Computer Science, MITS Kochi, 2020
          </p>
        </div>
      </section>

      <section className="sec" id="security" aria-labelledby="sec-title">
        <div className="rail">
          <b>05</b>Security
        </div>
        <div>
          <h2 id="sec-title">I read code like an attacker.</h2>
          <div className="big-numbers" aria-label="Audit findings">
            <div>
              <strong>4</strong>
              <span>High</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Medium</span>
            </div>
          </div>
          <p className="prose">
            Severity findings from competitive smart-contract audits on Code4rena and Sherlock, under adversarial review
            conditions. The habit carries into my web work: on SitesGen I found that signed-in users could write past
            their plan limits through the database API, moved every write behind server-side checks, and proved the fix
            with a real user token. <Link href="/notes/security">More on security work →</Link>
          </p>
        </div>
      </section>

      <section className="sec" id="contact" aria-labelledby="contact-title">
        <div className="rail">
          <b>06</b>Contact
        </div>
        <div>
          <h2 id="contact-title">Hiring for full-stack or AI engineering in Dubai?</h2>
          <p className="contact-line">
            <a href="mailto:aasharck@gmail.com">aasharck@gmail.com</a>
          </p>
          <p className="mono hint">
            <a href="https://github.com/aasharck" rel="noopener">
              github.com/aasharck
            </a>{" "}
            · Dubai, UAE
          </p>
        </div>
      </section>
    </>
  );
}
