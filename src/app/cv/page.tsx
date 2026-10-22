import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/prose";
import { chunkById, chunksOf } from "@/lib/corpus";

export const metadata: Metadata = {
  title: "CV",
  description: "Aashar CK's CV: full-stack and AI engineer in Dubai. Printable, with a PDF download.",
};

// Built from the same corpus as the rest of the site, so it can't drift from it
// (and it never contains the phone number, which isn't in the corpus).
function Section({ id, title, bare }: { id: string; title?: string; bare?: boolean }) {
  const c = chunkById(id);
  if (!c) return null;
  return (
    <section className="cv-block">
      {!bare && <h3>{title ?? c.heading}</h3>}
      <Prose text={c.text} />
    </section>
  );
}

export default function CvPage() {
  const jobs = chunksOf("experience");
  const skills = chunksOf("skills").filter((c) => c.anchor !== "testing" && c.anchor !== "smart-contracts");
  return (
    <article className="cv">
      <header className="cv-head">
        <div>
          <h1>
            Aashar <em>CK</em>
          </h1>
          <p className="cv-role">Full-stack &amp; AI engineer · Dubai, UAE · Available immediately</p>
        </div>
        <p className="cv-contact">
          <a href="mailto:aasharck@gmail.com">aasharck@gmail.com</a>
          <br />
          <a href="https://github.com/aasharck" rel="noopener">
            github.com/aasharck
          </a>
        </p>
        <p className="cv-actions no-print">
          <a className="btn" href="/aashar-ck-cv.pdf" download>
            Download PDF
          </a>
          <Link className="btn ghost" href="/fit">
            Or check my fit for your role
          </Link>
        </p>
      </header>

      <h2 className="cv-h">Summary</h2>
      <Section id="profile#summary" bare />

      <h2 className="cv-h">Projects</h2>
      <Section id="sitesgen#what-it-is" title="SitesGen · founder and sole engineer · 2026–" />
      <Section id="sitesgen#cost-per-site" title="SitesGen · eight agents, cost per site" />
      <Section id="traccoai#what-it-is" title="TraccoAI · sole architect and engineer · 2025–" />
      <Section id="ai-support-agent#what-it-is" title="AI support agent · demo" />
      <Section id="supabase-rls-check#what-it-is" title="supabase-rls-check · CLI" />

      <h2 className="cv-h">Experience</h2>
      {jobs.map((c) => (
        <section className="cv-block" key={c.id}>
          <h3>{c.heading}</h3>
          <Prose text={c.text} />
        </section>
      ))}

      <h2 className="cv-h">Skills</h2>
      <dl className="cv-skills">
        {skills.map((c) => (
          <div key={c.id}>
            <dt>{c.heading}</dt>
            <dd>{c.text}</dd>
          </div>
        ))}
      </dl>

      <h2 className="cv-h">Security</h2>
      <Section id="security#competitive-smart-contract-audits" title="Competitive smart-contract audits" />

      <h2 className="cv-h">Education and awards</h2>
      <Section id="profile#education" title="Education" />
      <Section id="profile#awards" title="Awards" />
      <Section id="other-work#stashlr-com" title="stashlr.com" />
    </article>
  );
}
