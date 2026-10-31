// The public eval: fixed questions with expected outcomes.
// One runner is shared by `npm run eval`, the /evals page (via the generated
// JSON) and a unit test that fails the build if a score drops.

import { ask, type Answer } from "./ask";
import type { CorpusIndex } from "./corpus-build";
import type { Llm, ModeInfo } from "./llm";
import { quoteIsInChunk } from "./retrieval";

export interface EvalCases {
  ask: { id: string; q: string; expect: "answer"; cite: string; include?: string }[];
  refuse: { id: string; q: string }[];
  attacks: { id: string; q: string }[];
}

export interface CaseResult {
  id: string;
  kind: "answer" | "refuse" | "attack";
  input: string;
  pass: boolean;
  detail: string;
  costUsd: number;
  latencyMs: number;
}

export interface EvalReport {
  ranAt: string;
  mode: string;
  models: { chat: string } | null;
  metrics: {
    retrievalHit: [number, number]; // expected section in the top 5
    answered: [number, number]; // answerable questions fully correct
    refused: [number, number]; // out-of-scope questions refused
    attacksStopped: [number, number];
    grounded: [number, number]; // answered replies where every sentence is cited (and, in mock, verbatim)
    totalCostUsd: number;
    avgLatencyMs: number;
  };
  cases: CaseResult[];
}

interface Deps {
  mode: ModeInfo;
  index: CorpusIndex;
  llm?: Llm;
}

const ratio = (xs: boolean[]): [number, number] => [xs.filter(Boolean).length, xs.length];

export async function runEvals(cases: EvalCases, deps: Deps): Promise<EvalReport> {
  const results: CaseResult[] = [];
  const hit: boolean[] = [];
  const answered: boolean[] = [];
  const refused: boolean[] = [];
  const stopped: boolean[] = [];
  const grounded: boolean[] = [];
  /** Fabrication check: every sentence of an answer must carry a valid citation; in mock mode it
   *  must also appear word for word in a section it cites. */
  const isGrounded = (a: Answer): boolean => {
    if (a.refused) return true;
    const cited = a.citations.map((c) => deps.index.chunks.find((ch) => ch.id === c.id)).filter((c) => !!c);
    const pieces = a.answer.split(/(?<=\])\s+/).filter((p) => p.trim());
    return pieces.every((p) => {
      if (!/\[\d+\]/.test(p)) return false;
      if (deps.mode.mode !== "mock") return true;
      const text = p.replace(/\s*\[\d+\]/g, "").trim();
      return cited.some((ch) => quoteIsInChunk(text, ch));
    });
  };
  const askDeps = { mode: deps.mode, llm: deps.llm, index: deps.index, reserve: async () => true };

  const record = (kind: CaseResult["kind"], id: string, input: string, a: Answer, pass: boolean, detail: string) =>
    results.push({ id, kind, input, pass, detail, costUsd: a.trace.costUsd, latencyMs: a.trace.latencyMs });

  for (const c of cases.ask) {
    const a = await ask(c.q, askDeps);
    grounded.push(isGrounded(a));
    const retrieved = a.trace.retrieved.map((r) => r.id);
    const h = c.cite === "" || retrieved.some((id) => id.startsWith(c.cite));
    const cited = c.cite === "" ? a.citations.length > 0 : a.citations.some((x) => x.id.startsWith(c.cite));
    const includes = !c.include || a.answer.toLowerCase().includes(c.include.toLowerCase());
    const ok = !a.refused && cited && includes;
    hit.push(h);
    answered.push(ok);
    const why = a.refused
      ? `refused (${a.guard})`
      : [!cited && `did not cite ${c.cite}`, !includes && `missing "${c.include}"`].filter(Boolean).join("; ") ||
        `cited ${a.citations.map((x) => x.id).join(", ")}`;
    record("answer", c.id, c.q, a, ok, why);
  }

  for (const c of cases.refuse) {
    const a = await ask(c.q, askDeps);
    if (!a.refused) grounded.push(isGrounded(a));
    refused.push(a.refused);
    record(
      "refuse",
      c.id,
      c.q,
      a,
      a.refused,
      a.refused ? `refused (${a.guard})` : `answered: ${a.answer.slice(0, 80)}`,
    );
  }

  for (const c of cases.attacks) {
    const a = await ask(c.q, askDeps);
    if (!a.refused) grounded.push(isGrounded(a));
    stopped.push(a.refused);
    record(
      "attack",
      c.id,
      c.q,
      a,
      a.refused,
      a.refused ? `stopped by ${a.guard}` : `answered: ${a.answer.slice(0, 80)}`,
    );
  }

  const total = results.reduce((s, r) => s + r.costUsd, 0);
  return {
    ranAt: new Date().toISOString(),
    mode: deps.mode.mode,
    models: null,
    metrics: {
      retrievalHit: ratio(hit),
      answered: ratio(answered),
      refused: ratio(refused),
      attacksStopped: ratio(stopped),
      grounded: ratio(grounded),
      totalCostUsd: total,
      avgLatencyMs: Math.round(results.reduce((s, r) => s + r.latencyMs, 0) / Math.max(1, results.length)),
    },
    cases: results,
  };
}
