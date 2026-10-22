// The public eval: fixed questions and job descriptions with expected outcomes.
// One runner is shared by `npm run eval`, the /evals page (via the generated
// JSON) and a unit test that fails the build if a score drops.

import { ask, type Answer } from "./ask";
import type { CorpusIndex } from "./corpus-build";
import { assessFit, type FitReport, type Verdict } from "./fit";
import type { Llm, ModeInfo } from "./llm";
import { quoteIsInChunk } from "./retrieval";

export interface EvalCases {
  ask: { id: string; q: string; expect: "answer"; cite: string; include?: string }[];
  refuse: { id: string; q: string }[];
  attacks: { id: string; q: string }[];
  fit: { id: string; title: string; jd: string; expect: { req: string; verdict: Verdict[] }[] }[];
}

export interface CaseResult {
  id: string;
  kind: "answer" | "refuse" | "attack" | "fit";
  input: string;
  pass: boolean;
  detail: string;
  costUsd: number;
  latencyMs: number;
}

export interface EvalReport {
  ranAt: string;
  mode: string;
  models: { chat: string; report: string } | null;
  metrics: {
    retrievalHit: [number, number]; // expected section in the top 5
    answered: [number, number]; // answerable questions fully correct
    refused: [number, number]; // out-of-scope questions refused
    attacksStopped: [number, number];
    fitVerdicts: [number, number]; // requirement verdicts matching expectation
    citationsVerified: [number, number]; // fit evidence quotes found verbatim in their source
    totalCostUsd: number;
    avgLatencyMs: number;
  };
  cases: CaseResult[];
}

interface Deps {
  mode: ModeInfo;
  index: CorpusIndex;
  chatLlm?: Pick<Llm, "text">;
  fitLlm?: Llm;
}

const ratio = (xs: boolean[]): [number, number] => [xs.filter(Boolean).length, xs.length];

export async function runEvals(cases: EvalCases, deps: Deps): Promise<EvalReport> {
  const results: CaseResult[] = [];
  const hit: boolean[] = [];
  const answered: boolean[] = [];
  const refused: boolean[] = [];
  const stopped: boolean[] = [];
  const verdicts: boolean[] = [];
  const verified: boolean[] = [];
  const askDeps = { mode: deps.mode, llm: deps.chatLlm, index: deps.index, reserve: async () => true };

  const record = (
    kind: CaseResult["kind"],
    id: string,
    input: string,
    a: Answer | FitReport,
    pass: boolean,
    detail: string,
  ) => results.push({ id, kind, input, pass, detail, costUsd: a.trace.costUsd, latencyMs: a.trace.latencyMs });

  for (const c of cases.ask) {
    const a = await ask(c.q, askDeps);
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

  for (const c of cases.fit) {
    const r = await assessFit(c.jd, {
      mode: deps.mode,
      llm: deps.fitLlm,
      index: deps.index,
      reserve: async () => true,
    });
    const misses: string[] = [];
    for (const e of c.expect) {
      const item = r.items.find((i) => i.text.toLowerCase().includes(e.req.toLowerCase()));
      const ok = !!item && e.verdict.includes(item.verdict);
      verdicts.push(ok);
      if (!ok) misses.push(`${e.req}: got ${item?.verdict ?? "not extracted"}, want ${e.verdict.join("/")}`);
    }
    for (const item of r.items) {
      for (const ev of item.evidence) {
        const chunk = deps.index.chunks.find((ch) => ch.id === ev.id);
        verified.push(!!chunk && quoteIsInChunk(ev.quote, chunk));
      }
    }
    record(
      "fit",
      c.id,
      c.title,
      r,
      misses.length === 0,
      misses.join("; ") || `${c.expect.length}/${c.expect.length} verdicts as expected`,
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
      fitVerdicts: ratio(verdicts),
      citationsVerified: ratio(verified),
      totalCostUsd: total,
      avgLatencyMs: Math.round(results.reduce((s, r) => s + r.latencyMs, 0) / Math.max(1, results.length)),
    },
    cases: results,
  };
}
