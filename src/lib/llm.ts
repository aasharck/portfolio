// The only file that talks to Anthropic. Everything else depends on the small
// `Llm` interface so tests can swap in a scripted client and mock mode can skip
// the model entirely.

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

// Model ids from the claude-api skill (cached 2026-10-06). Cheapest current model
// for chat; Sonnet for the JD report, where judgement quality is the product.
export const MODELS = {
  chat: process.env.CHAT_MODEL || "claude-haiku-5-5",
  extract: process.env.EXTRACT_MODEL || "claude-haiku-5-5",
  report: process.env.REPORT_MODEL || "claude-sonnet-5-5",
};

// USD per million tokens: [input, output, cache read]
const PRICES: Record<string, [number, number, number]> = {
  "claude-haiku-5-5": [0.1, 0.5, 0.01],
  "claude-sonnet-5-5": [2, 10, 0.2],
  "claude-opus-5-5": [4, 20, 0.2],
};

export interface Usage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
}

export function costUsd(u: Usage): number {
  const p = PRICES[u.model] ?? PRICES["claude-opus-5-5"]; // unknown model: assume the dearest
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
  if (!process.env.ANTHROPIC_API_KEY) return { mode: "mock", reason: "no ANTHROPIC_API_KEY" };
  // Live calls are only allowed when a shared store can enforce the daily budget.
  // Without one, every serverless instance would have its own counter.
  if (!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)) {
    return { mode: "mock", reason: "no budget store (UPSTASH_REDIS_REST_URL/TOKEN)" };
  }
  return { mode: "live", reason: "ANTHROPIC_API_KEY and budget store set" };
}

export interface LlmCall<T> {
  output: T;
  usage: Usage;
  ms: number;
  stopReason: string | null;
}

export interface Llm {
  structured<S extends z.ZodType>(args: {
    model: string;
    system: string;
    user: string;
    schema: S;
    maxTokens: number;
    effort: "low" | "medium" | "high";
  }): Promise<LlmCall<z.infer<S>>>;
  text(args: {
    model: string;
    system: string;
    user: string;
    maxTokens: number;
    effort: "low" | "medium" | "high";
  }): Promise<LlmCall<string>>;
}

// Server-side refusal fallback ("default" routing) is available on Sonnet and Opus,
// not on Haiku (claude-api skill).
function fallbackParams(model: string) {
  return model.startsWith("claude-haiku")
    ? {}
    : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };
}

function usageOf(model: string, u: Anthropic.Beta.BetaUsage): Usage {
  return {
    model,
    inputTokens: u.input_tokens + (u.cache_creation_input_tokens ?? 0),
    outputTokens: u.output_tokens,
    cacheReadTokens: u.cache_read_input_tokens ?? 0,
  };
}

export function anthropicLlm(client = new Anthropic({ timeout: 45_000, maxRetries: 1 })): Llm {
  return {
    async structured({ model, system, user, schema, maxTokens, effort }) {
      const t0 = Date.now();
      const res = await client.beta.messages.parse({
        model,
        max_tokens: maxTokens,
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: user }],
        output_config: { effort, format: betaZodOutputFormat(schema) },
        ...fallbackParams(model),
      });
      if (res.stop_reason === "refusal") throw new Error("model declined the request");
      if (res.parsed_output == null) throw new Error(`no parseable output (stop: ${res.stop_reason})`);
      return {
        output: res.parsed_output as z.infer<typeof schema>,
        usage: usageOf(res.model, res.usage),
        ms: Date.now() - t0,
        stopReason: res.stop_reason,
      };
    },
    async text({ model, system, user, maxTokens, effort }) {
      const t0 = Date.now();
      const res = await client.beta.messages.create({
        model,
        max_tokens: maxTokens,
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: user }],
        output_config: { effort },
        ...fallbackParams(model),
      });
      if (res.stop_reason === "refusal") throw new Error("model declined the request");
      const text = res.content
        .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
        .map((b) => b.text)
        .join("");
      return { output: text, usage: usageOf(res.model, res.usage), ms: Date.now() - t0, stopReason: res.stop_reason };
    },
  };
}
