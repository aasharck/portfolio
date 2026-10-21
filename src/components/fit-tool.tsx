"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import { fitAction, type FitState } from "@/app/actions";
import { Hood } from "./hood";

export const SAMPLE_JD = `Senior AI Engineer (sample job description written for this demo)

What you'll do:
- Build LLM-powered features and agent workflows that run in production
- Own the TypeScript / Node.js backend and React front end for them

Requirements:
- 5+ years of experience with React and TypeScript
- Experience building RAG systems with vector search and citations
- Hands-on experience with the Claude or OpenAI APIs, including tool use
- Strong PostgreSQL skills
- Experience with AWS (Lambda, API Gateway)
- Kubernetes and Terraform in production

Nice to have:
- Security background or experience with audits
- Experience with evaluation of LLM outputs`;

const LABEL = { strong: "evidence", partial: "partial", none: "no evidence" } as const;

export function FitTool({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [state, action, pending] = useActionState<FitState, FormData>(fitAction, { jd: "" });
  const ref = useRef<HTMLTextAreaElement>(null);
  const H = headingLevel === 2 ? "h2" : "h3";
  const r = state.report;

  return (
    <div className="tool">
      <form action={action}>
        <label className="field">
          <span className="field-label">
            <span>Job description</span>
            <span>max 8,000 characters</span>
          </span>
          <textarea
            ref={ref}
            name="jd"
            defaultValue={state.jd}
            key={state.jd}
            required
            minLength={80}
            maxLength={8000}
            placeholder="Paste the whole job post: requirements, responsibilities, nice-to-haves."
          />
        </label>
        <div className="tool-row">
          <button className="btn" type="submit" disabled={pending}>
            {pending ? <span className="pending-dot">Reading the JD</span> : "Run the fit check →"}
          </button>
          <button
            type="button"
            className="linkish"
            onClick={() => {
              if (ref.current) {
                ref.current.value = SAMPLE_JD;
                ref.current.focus();
              }
            }}
          >
            Use a sample JD
          </button>
          <span className="hint">Takes a few seconds. Nothing you paste is stored, except as a cache key hash.</span>
        </div>
      </form>

      <div aria-live="polite">
        {state.error && <p className="error">{state.error}</p>}
        {r && (
          <section className="report" aria-label="Fit report">
            <span className={`mode-flag ${r.trace.mode}`}>
              {r.trace.mode === "mock"
                ? "Mock mode: rule-based extraction and verdicts, no model called. Retrieval and citation checks are real."
                : "Live: Claude extracted and judged; every citation was checked in code."}
            </span>
            <H>{r.roleTitle ? `Fit for: ${r.roleTitle}` : "Fit report"}</H>
            <p className="tally">
              <span className="v-strong verdict">{r.counts.strong} evidence</span>
              <span className="v-partial verdict">{r.counts.partial} partial</span>
              <span className="v-none verdict">{r.counts.none} no evidence</span>
            </p>
            <ol className="reqs">
              {r.items.map((it, i) => (
                <li key={i}>
                  <span className={`verdict v-${it.verdict}`}>{LABEL[it.verdict]}</span>
                  <div>
                    <p className="req-text">
                      {it.text}
                      {it.priority === "nice" && <span className="pri">nice to have</span>}
                    </p>
                    {it.evidence.length ? (
                      <ul className="evidence">
                        {it.evidence.map((e) => (
                          <li key={e.id}>
                            <q>{e.quote}</q>
                            <Link href={e.url}>source: {e.label}</Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="note">No direct evidence in Aashar&apos;s CV or project notes.</p>
                    )}
                    {it.evidence.length > 0 && <p className="note">{it.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
            <div className="summary-box">
              <p style={{ margin: 0 }}>{r.summary.headline}</p>
              {r.summary.strengths.length > 0 && (
                <>
                  <h4>Strongest evidence</h4>
                  <ul>
                    {r.summary.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
              {r.summary.gaps.length > 0 && (
                <>
                  <h4>Gaps to discuss</h4>
                  <ul>
                    {r.summary.gaps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <Hood trace={r.trace} />
          </section>
        )}
      </div>
    </div>
  );
}
