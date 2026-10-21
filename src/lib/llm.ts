// The only file that talks to model providers. Everything else depends on the
// small `Llm` interface so tests can swap in a scripted client and mock mode can
// skip the model entirely. Chat runs on OpenAI; the fit report runs on Claude.

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import OpenAI from "openai";
import type { z } from "zod";

// Claude ids from the claude-api skill (cached 2026-10-06); OpenAI id and prices
// from developers.openai.com/api/docs/pricing (read 2026-10-21). Cheapest current
// small model for chat; Sonnet for the JD judgement, where quality is the product.
export const MODELS = {
  chat: process.env.CHAT_MODEL || "gpt-6-luna",
  extract: process.env.EXTRACT_MODEL || "claude-haiku-5-5",
  report: process.env.REPORT_MODEL || "claude-sonnet-5-5",
};

// USD per million tokens: [input, output, cache read]
const PRICES: Record<string, [number, number, number]> = {
  "gpt-6-luna": [0.1, 0.5, 0.01],
  "gpt-5-nano": [0.05, 0.4, 0.005],
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

export type Feature = "ask" | "fit";
const KEY_FOR: Record<Feature, "OPENAI_API_KEY" | "ANTHROPIC_API_KEY"> = {
  ask: "OPENAI_API_KEY",
  fit: "ANTHROPIC_API_KEY",
};

export function currentMode(feature: Feature): ModeInfo {
  const key = KEY_FOR[feature];
  if (process.env.MOCK_LLM === "1") return { mode: "mock", reason: "MOCK_LLM=1" };
  if (!process.env[key]) return { mode: "mock", reason: `no ${key}` };
  // Live calls are only allowed when a shared store can enforce the daily budget.
  // Without one, every serverless instance would have its own counter.
  if (!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)) {
    return { mode: "mock", reason: "no budget store (UPSTASH_REDIS_REST_URL/TOKEN)" };
  }
  return { mode: "live", reason: `${key} and budget store set` };
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

/** Chat only needs plain text, so the OpenAI client implements just `text`. */
export function openaiLlm(client = new OpenAI({ timeout: 30_000, maxRetries: 1 })): Pick<Llm, "text"> {
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
