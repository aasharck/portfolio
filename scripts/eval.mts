// npm run eval:save       → same, and commits-ready copy at evals/results/mock.json
// npm run eval            → mock mode ($0). Writes src/generated/evals.json for the /evals page,
//                            together with the last committed live run, if there is one.
// EVAL_LIVE=1 npm run eval → real models (a few cents). Also saves evals/results/live.json:
//                            commit it, so builds (which only run mock) keep showing it.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CorpusIndex } from "../src/lib/corpus-build";
import { runEvals, type EvalCases } from "../src/lib/eval";
import { MODELS, anthropicLlm, openaiLlm } from "../src/lib/llm";

const root = process.cwd();
const cases = JSON.parse(readFileSync(join(root, "evals/cases.json"), "utf8")) as EvalCases;
const index = JSON.parse(readFileSync(join(root, "src/generated/corpus.json"), "utf8")) as CorpusIndex;

const live = process.env.EVAL_LIVE === "1";
const mode = live
  ? { mode: "live" as const, reason: "EVAL_LIVE=1" }
  : { mode: "mock" as const, reason: "eval in mock mode" };
if (live && !(process.env.OPENAI_API_KEY && process.env.ANTHROPIC_API_KEY)) {
  console.error("EVAL_LIVE=1 needs OPENAI_API_KEY and ANTHROPIC_API_KEY");
  process.exit(1);
}

const report = await runEvals(cases, {
  mode,
  index,
  chatLlm: live ? openaiLlm() : undefined,
  fitLlm: live ? anthropicLlm() : undefined,
});
report.models = live ? { chat: MODELS.chat, report: MODELS.report } : null;

const livePath = join(root, "evals/results/live.json");
if (!live && process.argv.includes("--save")) {
  mkdirSync(join(root, "evals/results"), { recursive: true });
  writeFileSync(join(root, "evals/results/mock.json"), JSON.stringify(report, null, 1));
}
if (live) {
  mkdirSync(join(root, "evals/results"), { recursive: true });
  writeFileSync(livePath, JSON.stringify(report, null, 1));
}
const mock = live ? null : report;
const lastLive = live ? report : existsSync(livePath) ? JSON.parse(readFileSync(livePath, "utf8")) : null;
mkdirSync(join(root, "src/generated"), { recursive: true });
writeFileSync(join(root, "src/generated/evals.json"), JSON.stringify({ mock, live: lastLive }, null, 1));

const m = report.metrics;
const f = ([a, b]: [number, number]) => `${a}/${b}`;
console.log(
  `eval (${report.mode}): retrieval ${f(m.retrievalHit)} · answers ${f(m.answered)} · refusals ${f(m.refused)} · attacks stopped ${f(m.attacksStopped)} · fit verdicts ${f(m.fitVerdicts)} · citations verified ${f(m.citationsVerified)} · grounded ${f(m.grounded)} · $${m.totalCostUsd.toFixed(4)}`,
);
for (const c of report.cases.filter((c) => !c.pass))
  console.log(`  FAIL ${c.id} ${c.input.slice(0, 60)} → ${c.detail}`);
