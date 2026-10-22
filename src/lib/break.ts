// "Try to break it": counts attempts and which safeguard stopped each one.
// Only counters are stored, never the text people type.
import type { Guard } from "./ask";
import type { Store } from "./guard";

const YEAR = 365 * 86400;
export const OUTCOMES = ["refusal_gate", "grounding_guard", "model_declined", "budget", "answered"] as const;
export type Outcome = (typeof OUTCOMES)[number];
export type BreakScore = Record<Outcome | "total", number>;

export const OUTCOME_LABEL: Record<Outcome, string> = {
  refusal_gate: "Stopped before any model call: nothing in the record covers it",
  grounding_guard: "Stopped after the model: the answer cited no source",
  model_declined: "The model itself said the sources don't answer it",
  budget: "Not run: today's budget was used up",
  answered: "Answered, with citations to the record",
};

export async function recordAttempt(store: Store, guard: Guard): Promise<void> {
  await store.incrBy("break:total", 1, YEAR);
  await store.incrBy(`break:${guard ?? "answered"}`, 1, YEAR);
}

export async function readScore(store: Store): Promise<BreakScore> {
  const keys = ["total", ...OUTCOMES] as const;
  const values = await Promise.all(keys.map((k) => store.get(`break:${k}`)));
  return Object.fromEntries(keys.map((k, i) => [k, Number(values[i] ?? 0)])) as BreakScore;
}
