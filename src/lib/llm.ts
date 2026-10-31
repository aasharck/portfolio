// The only file that talks to the model provider. Everything else depends on the
// small `Llm` interface so tests can swap in a scripted client and mock mode can
// skip the model entirely.

import OpenAI from "openai";

// OpenAI id and prices from developers.openai.com/api/docs/pricing (read 2026-10-21).
export const MODELS = {
  chat: process.env.CHAT_MODEL || "gpt-6-luna",
};

// USD per million tokens: [input, output, cache read]
const PRICES: Record<string, [number, number, number]> = {
  "gpt-6-luna": [0.1, 0.5, 0.01],
  "gpt-5-nano": [0.05, 0.4, 0.005],
};
/** A model set through CHAT_MODEL that isn't priced above: assume it is expensive. */
const UNKNOWN_PRICE: [number, number, number] = [4, 20, 0.2];

export interface Usage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
}

export function costUsd(u: Usage): number {
  const p = PRICES[u.model] ?? UNKNOWN_PRICE;
  return (u.inputTokens * p[0] + u.outputTokens * p[1] + u.cacheReadTokens * p[2]) / 1_000_000;
}

/** Worst-case cost of a call, used to reserve budget before making it. */
export function worstCaseUsd(model: string, inputChars: number, maxTokens: number): number {
  return costUsd({ model, inputTokens: Math.ceil(inputChars / 3), outputTokens: maxTokens, cacheReadTokens: 0 });
}

export type Mode = "live" | "mock";

export interface ModeInfo {
  mode: Mode;
  reason: string;
}

export function currentMode(): ModeInfo {
  if (process.env.MOCK_LLM === "1") return { mode: "mock", reason: "MOCK_LLM=1" };
  if (!process.env.OPENAI_API_KEY) return { mode: "mock", reason: "no OPENAI_API_KEY" };
  // Live calls are only allowed when a shared store can enforce the daily budget.
  // Without one, every serverless instance would have its own counter.
  if (!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)) {
    return { mode: "mock", reason: "no budget store (UPSTASH_REDIS_REST_URL/TOKEN)" };
  }
  return { mode: "live", reason: "OPENAI_API_KEY and budget store set" };
}

export interface LlmCall<T> {
  output: T;
  usage: Usage;
  ms: number;
  stopReason: string | null;
}

export interface Llm {
  text(args: {
    model: string;
    system: string;
    user: string;
    maxTokens: number;
    effort: "low" | "medium" | "high";
  }): Promise<LlmCall<string>>;
}

export function openaiLlm(client = new OpenAI({ timeout: 30_000, maxRetries: 1 })): Llm {
  return {
    async text({ model, system, user, maxTokens, effort }) {
      const t0 = Date.now();
      const res = await client.responses.create({
        model,
        instructions: system,
        input: user,
        max_output_tokens: maxTokens,
        reasoning: { effort },
      });
      const cached = res.usage?.input_tokens_details?.cached_tokens ?? 0;
      return {
        output: res.output_text,
        usage: {
          model,
          inputTokens: (res.usage?.input_tokens ?? 0) - cached,
          outputTokens: res.usage?.output_tokens ?? 0,
          cacheReadTokens: cached,
        },
        ms: Date.now() - t0,
        stopReason: res.status ?? null,
      };
    },
  };
}
