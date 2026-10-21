"use server";

import { headers } from "next/headers";
import { ask, type Answer } from "@/lib/ask";
import { assessFit, type FitReport } from "@/lib/fit";
import { LIMITS, getStore } from "@/lib/guard";
import { anthropicLlm, currentMode, openaiLlm } from "@/lib/llm";
import { guarded } from "@/lib/run";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export interface FitState {
  jd: string;
  report?: FitReport;
  error?: string;
}

export async function fitAction(_prev: FitState, form: FormData): Promise<FitState> {
  const jd = String(form.get("jd") ?? "").trim();
  if (jd.length < LIMITS.jdMinChars) return { jd, error: "Paste the full job description (at least a few lines)." };
  if (jd.length > LIMITS.jdChars) {
    return {
      jd,
      error: `That's ${jd.length.toLocaleString()} characters; the limit is ${LIMITS.jdChars.toLocaleString()}. Trim the company blurb and benefits.`,
    };
  }
  const mode = currentMode("fit");
  const llm = mode.mode === "live" ? anthropicLlm() : undefined;
  const res = await guarded({
    route: "fit",
    input: jd,
    ip: await clientIp(),
    store: getStore(),
    mode,
    run: (reserve) => assessFit(jd, { mode, llm, reserve }),
  });
  return res.ok ? { jd, report: res.value } : { jd, error: res.message };
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
  const mode = currentMode("ask");
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
