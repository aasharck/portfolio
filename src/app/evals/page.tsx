import type { Metadata } from "next";
import Link from "next/link";
import evalsJson from "@/generated/evals.json";
import type { CaseResult, EvalReport } from "@/lib/eval";

export const metadata: Metadata = {
  title: "Evals",
  description:
    "The public test set behind this site's AI: answers, refusals, prompt-injection attempts and job-description verdicts, with every failure shown.",
};

// The page shows the last live run when one has been committed, otherwise the mock run.
const data = evalsJson as unknown as { mock: EvalReport | null; live: EvalReport | null };
const report = (data.live ?? data.mock) as EvalReport;

const KIND: Record<CaseResult["kind"], string> = {
  answer: "Should answer, citing the right section",
  refuse: "Should refuse: not in the record",
  attack: "Prompt injection: should not comply",
  fit: "Job description: verdict per requirement",
};

function Metric({ label, value, note }: { label: string; value: [number, number]; note: string }) {
  const [a, b] = value;
  return (
    <div className="metric">
      <strong>
        {a}
        <em>/{b}</em>
      </strong>
      <span className="caps">{label}</span>
      <p className="muted">{note}</p>
    </div>
  );
}

export default function EvalsPage() {
  const m = report.metrics;
  const ran = new Date(report.ranAt).toUTCString().replace(" GMT", " UTC");
  const failures = report.cases.filter((c) => !c.pass);
  return (
    <>
      <header className="doc-head">
        <p className="crumbs">
          <Link href="/how-it-works">Under the hood</Link> / Evals
        </p>
        <h1>
          Evals: <em>what passes, and what doesn&apos;t.</em>
        </h1>
        <p>
          A fixed test set runs against the same code as the chat and the fit check before every build. A score that
          drops fails the build. Failures are listed below, not hidden.
        </p>
        <p className="caps mono muted">
          Last run {ran} · {report.mode} mode
          {report.models ? ` · ${report.models.chat} / ${report.models.report}` : " · no model called, $0"} ·{" "}
          {report.cases.length} cases
        </p>
      </header>

      <section className="sec" aria-labelledby="scores">
        <h2 id="scores" className="sr-only">
          Scores
        </h2>
        <div className="metrics">
          <Metric label="Retrieval" value={m.retrievalHit} note="The right section is in the top five results." />
          <Metric label="Answers" value={m.answered} note="Answered, cited the right section, and stated the fact." />
          <Metric
            label="Refusals"
            value={m.refused}
            note="Said “I don't have evidence” for things not in the record."
          />
          <Metric
            label="Attacks stopped"
            value={m.attacksStopped}
            note="Prompt injections and false premises refused."
          />
          <Metric label="Fit verdicts" value={m.fitVerdicts} note="Requirement verdicts that match the expected one." />
          <Metric
            label="Citations verified"
            value={m.citationsVerified}
            note="Evidence quotes found word for word in their source."
          />
        </div>
        {report.mode === "mock" && (
          <p className="body muted eval-note">
            These are mock-mode scores: rule-based answers and verdicts, no model, $0. Retrieval, refusals, citation
            checks and the guards are the real code. The live run with the real models comes before launch, and its
            scores will replace these.
          </p>
        )}
      </section>

      {failures.length > 0 && (
        <section className="sec" aria-labelledby="fails">
          <span className="label caps">(Failures)</span>
          <h2 id="fails">
            Where it <em>gets it wrong.</em>
          </h2>
          <ul className="eval-list">
            {failures.map((c) => (
              <li key={c.id}>
                <span className="caps mono v-none verdict">{c.id} fail</span>
                <div>
                  <p className="req-text">{c.input}</p>
                  <p className="note">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          {failures.some((c) => c.input.includes("Google")) && (
            <p className="body muted eval-note">
              Why: in mock mode the answer is the best-matching sentence, and &ldquo;Google&rdquo; matches the SitesGen
              note about Google Maps. A rule can&apos;t tell an employer from a product; the live model is told never to
              name an employer the sources don&apos;t name. This stays listed until a live run shows it fixed.
            </p>
          )}
        </section>
      )}

      {(["answer", "refuse", "attack", "fit"] as const).map((kind) => (
        <section key={kind} className="sec eval-group" aria-labelledby={`k-${kind}`}>
          <h2 id={`k-${kind}`} className="eval-h">
            {KIND[kind]}
          </h2>
          <ul className="eval-list">
            {report.cases
              .filter((c) => c.kind === kind)
              .map((c) => (
                <li key={c.id}>
                  <span className={`caps mono verdict ${c.pass ? "v-strong" : "v-none"}`}>
                    {c.id} {c.pass ? "pass" : "fail"}
                  </span>
                  <div>
                    <p className="req-text">{c.input}</p>
                    <p className="note">{c.detail}</p>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <section className="sec" aria-labelledby="run">
        <h2 id="run" className="eval-h">
          Run it yourself
        </h2>
        <p className="body">
          The cases live in <code>evals/cases.json</code>. <code>npm run eval</code> runs them in mock mode;{" "}
          <code>EVAL_LIVE=1 npm run eval</code> runs them against the real models (a few cents). Try your own attacks on
          the <Link href="/break-it">break-it page</Link>.
        </p>
      </section>
    </>
  );
}
