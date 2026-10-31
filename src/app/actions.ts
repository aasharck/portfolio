"use server";

import { headers } from "next/headers";
import { ask, type Answer } from "@/lib/ask";
import { readScore, recordAttempt, type BreakScore } from "@/lib/break";
import { LIMITS, getStore } from "@/lib/guard";
import { currentMode, openaiLlm } from "@/lib/llm";
import { guarded } from "@/lib/run";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export interface AskState {
  turns: Answer[];
  error?: string;
}

export async function askAction(prev: AskState, form: FormData): Promise<AskState> {
  const question = String(form.get("q") ?? "").trim();
  const turns = prev?.turns ?? [];
  if (!question) return { turns, error: "Type a question first." };
  if (question.length > LIMITS.questionChars) {
    return { turns, error: `Keep questions under ${LIMITS.questionChars} characters.` };
  }
  const mode = currentMode();
  const llm = mode.mode === "live" ? openaiLlm() : undefined;
  const res = await guarded({
    route: "ask",
    input: question,
    ip: await clientIp(),
    store: getStore(),
    mode,
    run: (reserve) => ask(question, { mode, llm, reserve }),
  });
  // Keep the last 6 turns so the round-tripped state stays small.
  return res.ok ? { turns: [...turns, res.value].slice(-6) } : { turns, error: res.message };
}

export interface BreakState {
  turns: Answer[];
  error?: string;
  score?: BreakScore;
}

/** Same pipeline and limits as the chat; each attempt is counted by the safeguard that handled it. */
export async function breakAction(prev: BreakState, form: FormData): Promise<BreakState> {
  const res = await askAction({ turns: prev?.turns ?? [] }, form);
  if (res.error) return { ...res, score: prev?.score };
  const last = res.turns.at(-1);
  const store = getStore();
  if (last) await recordAttempt(store, last.guard);
  return { turns: res.turns, score: await readScore(store) };
}
