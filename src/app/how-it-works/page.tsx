import type { Metadata } from "next";
import Link from "next/link";
import { ANSWER_MIN_COVERAGE } from "@/lib/ask";
import { corpus } from "@/lib/corpus";
import { LIMITS } from "@/lib/guard";
import { MODELS } from "@/lib/llm";

export const metadata: Metadata = {
  title: "Under the hood",
  description:
    "How this site's chat works: build-time BM25 retrieval, verified citations, refusals, and a hard daily budget.",
};

const STEPS = [
  {
    h: "One corpus",
    p: `Every fact lives in content/*.md, one section per topic, each ending in a "Source:" line naming the CV, README or handoff note it came from. At build time the sections become ${corpus.chunks.length} chunks and a BM25 index. The pages and the chat all read that one corpus.`,
  },
  {
    h: "Retrieval at $0",
    p: "BM25 over the chunks, with headings weighted up and a small hand-written alias table (Claude ↔ LLM, Lambda ↔ serverless). No embedding API and no model download: at this size, lexical search is accurate, instant and explainable. Each hit also gets a coverage score: the idf-weighted share of the question's terms it covers. A term the corpus has never seen (\"Kubernetes\") weighs the most, so it can't be papered over.",
  },
  {
    h: "Refuse before spending",
    p: `If the best chunk covers less than ${ANSWER_MIN_COVERAGE * 100}% of the question, the chat replies "I don't have evidence for that" and never calls a model. The model's own instructions repeat the rule, and a grounding guard in code discards any answer that has no valid [n] citation.`,
  },
  {
    h: "Chat",
    p: `OpenAI ${MODELS.chat} (the newest small OpenAI model, $0.10 / $0.50 per million tokens) at low reasoning effort, with the top 5 chunks as numbered sources and a 120-word limit. About $0.0005 an answer.`,
  },
  {
    h: "Guardrails",
    p: `Questions up to ${LIMITS.questionChars} characters. Per network: ${LIMITS.rate.ask.max} questions per 10 minutes. A hard daily budget of $${LIMITS.dailyBudgetUsd.toFixed(2)}: each call reserves its worst-case cost in Redis before it runs and settles to the real cost after, so concurrent requests can't overshoot. Repeat questions are served from a cache at no cost. Live mode stays off unless both the API key and the shared Redis store are configured.`,
  },
  {
    h: "Mock mode",
    p: "Without an API key the site runs in mock mode, labelled on every answer: extractive answers that quote the best sentence of each matching chunk. Retrieval, citation checks, refusals, rate limits and the trace are the same code as live mode.",
  },
];

export default function HowItWorks() {
  return (
    <>
      <header className="doc-head">
        <p className="crumbs">Under the hood</p>
        <h1>
          How this site answers, <em>and why it won&apos;t make things up.</em>
        </h1>
        <p>
          Every answer on this site has an &ldquo;Under the hood&rdquo; panel with the retrieved chunks and their
          scores, each step, tokens, cost in cents and latency. This page explains what you are looking at.
        </p>
      </header>
      {STEPS.map((s, i) => (
        <section key={s.h} className="doc-sec" aria-labelledby={`s-${i}`}>
          <div className="rail">
            <b>{String(i + 1).padStart(2, "0")}</b>
          </div>
          <div>
            <h2 id={`s-${i}`}>{s.h}</h2>
            <p className="prose">{s.p}</p>
          </div>
        </section>
      ))}
      <section className="doc-sec" aria-labelledby="s-src">
        <div className="rail">
          <b>{String(STEPS.length + 1).padStart(2, "0")}</b>
        </div>
        <div>
          <h2 id="s-src">Read the corpus yourself</h2>
          <p className="prose">
            <Link href="/notes">All {corpus.docs.length} documents and their sources →</Link>
            <br />
            <Link href="/evals">The public eval: every case and every failure →</Link>
            <br />
            <Link href="/break-it">Try to break it →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
