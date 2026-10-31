import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ask, checkMarkers, REFUSAL } from "@/lib/ask";
import { buildIndex } from "@/lib/corpus-build";
import type OpenAI from "openai";
import { openaiLlm, type Llm, type ModeInfo, type Usage } from "@/lib/llm";

const dir = join(process.cwd(), "content");
const index = buildIndex(
  readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readFileSync(join(dir, f), "utf8")),
);
const MOCK: ModeInfo = { mode: "mock", reason: "test" };
const LIVE: ModeInfo = { mode: "live", reason: "test" };

/** A scripted stand-in for the model: returns queued outputs and records calls. */
function fakeLlm(outputs: string[]): Llm & { calls: { model: string; user: string }[] } {
  const calls: { model: string; user: string }[] = [];
  const usage = (model: string): Usage => ({ model, inputTokens: 1000, outputTokens: 200, cacheReadTokens: 0 });
  return {
    calls,
    async text({ model, user }) {
      calls.push({ model, user });
      return { output: String(outputs.shift()), usage: usage(model), ms: 5, stopReason: "end_turn" };
    },
  };
}

describe("ask: refusals", () => {
  it.each(["Does he know Kubernetes?", "What is his favourite food?", "What's his salary expectation?"])(
    "refuses %s without calling a model",
    async (q) => {
      const llm = fakeLlm([]);
      const a = await ask(q, { mode: LIVE, llm, index });
      expect(a.refused).toBe(true);
      expect(a.answer).toBe(REFUSAL);
      expect(llm.calls).toHaveLength(0);
      expect(a.trace.costUsd).toBe(0);
    },
  );
});

describe("ask: mock mode", () => {
  it("answers with citations that point at retrieved chunks", async () => {
    const a = await ask("What does a SitesGen site cost in model spend?", { mode: MOCK, index });
    expect(a.refused).toBe(false);
    expect(a.answer).toMatch(/\$0\.33/);
    expect(a.citations.length).toBeGreaterThan(0);
    for (const c of a.citations) expect(a.trace.retrieved.map((r) => r.id)).toContain(c.id);
    expect(a.trace.mode).toBe("mock");
  });
});

describe("ask: live path (scripted model)", () => {
  it("keeps valid [n] markers, drops invalid ones, and reports cost", async () => {
    const llm = fakeLlm(["About $0.33 per site in model spend [1]. Also see [9]."]);
    const a = await ask("What does a SitesGen site cost in model spend?", {
      mode: LIVE,
      llm,
      index,
      reserve: async () => true,
    });
    expect(a.refused).toBe(false);
    expect(a.answer).not.toContain("[9]");
    expect(a.citations.map((c) => c.n)).toEqual([1]);
    expect(llm.calls[0].model).toBe("gpt-6-luna");
    expect(llm.calls[0].user).toContain("[1]");
    expect(a.trace.costUsd).toBeCloseTo((1000 * 0.1 + 200 * 0.5) / 1e6, 10);
  });

  it("grounding guard: an uncited answer is replaced by the refusal", async () => {
    const llm = fakeLlm(["He is great at everything."]);
    const a = await ask("What does a SitesGen site cost in model spend?", {
      mode: LIVE,
      llm,
      index,
      reserve: async () => true,
    });
    expect(a.refused).toBe(true);
    expect(a.answer).toBe(REFUSAL);
  });

  it("does not call the model when the budget is spent", async () => {
    const llm = fakeLlm(["unused [1]"]);
    const a = await ask("What does a SitesGen site cost in model spend?", {
      mode: LIVE,
      llm,
      index,
      reserve: async () => false,
    });
    expect(a.refused).toBe(true);
    expect(llm.calls).toHaveLength(0);
  });

  it("checkMarkers handles adjacent and out-of-range markers", () => {
    expect(checkMarkers("a [1][2] b [0] c [3]", 2)).toEqual({ text: "a [1][2] b  c", used: [1, 2], dropped: 2 });
  });
});

describe("openai chat client", () => {
  it("maps Responses API usage (cached tokens split out) and sends the right request", async () => {
    let sent: Record<string, unknown> = {};
    const fake = {
      responses: {
        create: async (req: Record<string, unknown>) => {
          sent = req;
          return {
            output_text: "Answer [1]",
            status: "completed",
            usage: { input_tokens: 1200, input_tokens_details: { cached_tokens: 200 }, output_tokens: 80 },
          };
        },
      },
    };
    const llm = openaiLlm(fake as unknown as OpenAI);
    const r = await llm.text({ model: "gpt-6-luna", system: "sys", user: "q", maxTokens: 600, effort: "low" });
    expect(sent).toMatchObject({
      model: "gpt-6-luna",
      instructions: "sys",
      input: "q",
      max_output_tokens: 600,
      reasoning: { effort: "low" },
    });
    expect(r.output).toBe("Answer [1]");
    expect(r.usage).toEqual({ model: "gpt-6-luna", inputTokens: 1000, outputTokens: 80, cacheReadTokens: 200 });
  });
});
