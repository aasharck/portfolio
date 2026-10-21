import { describe, expect, it } from "vitest";
import {
  cacheGet,
  cacheSet,
  memoryStore,
  rateLimit,
  reserveBudget,
  settleBudget,
  spentToday,
  upstashStore,
} from "@/lib/guard";
import { costUsd, currentMode, worstCaseUsd } from "@/lib/llm";
import { guarded } from "@/lib/run";
import type { Trace } from "@/lib/trace";

const trace = (costUsd: number): Trace => ({
  mode: "live",
  modeReason: "t",
  steps: [],
  retrieved: [],
  usage: [],
  tokensIn: 0,
  tokensOut: 0,
  costUsd,
  latencyMs: 1,
  cached: false,
});

describe("rate limit", () => {
  it("allows the limit then blocks within the window, per IP", async () => {
    const store = memoryStore();
    const now = 1_000_000_000_000;
    for (let i = 0; i < 4; i++) expect((await rateLimit(store, "fit", "1.1.1.1", now)).ok).toBe(true);
    const blocked = await rateLimit(store, "fit", "1.1.1.1", now);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect((await rateLimit(store, "fit", "2.2.2.2", now)).ok).toBe(true);
    expect((await rateLimit(store, "fit", "1.1.1.1", now + 600_000)).ok).toBe(true);
  });
});

describe("daily budget", () => {
  const day = new Date("2026-10-21T10:00:00Z");

  it("reserves until the cap, refuses the call that would cross it, and rolls back the refusal", async () => {
    const store = memoryStore();
    expect((await reserveBudget(store, 0.3, 0.5, day)).ok).toBe(true);
    const r = await reserveBudget(store, 0.3, 0.5, day);
    expect(r.ok).toBe(false);
    expect(await spentToday(store, day)).toBeCloseTo(0.3);
    expect((await reserveBudget(store, 0.2, 0.5, day)).ok).toBe(true);
  });

  it("settles a reservation to the actual cost", async () => {
    const store = memoryStore();
    await reserveBudget(store, 0.1, 0.5, day);
    await settleBudget(store, 0.1, 0.004, day);
    expect(await spentToday(store, day)).toBeCloseTo(0.004, 6);
  });

  it("resets on a new UTC day", async () => {
    const store = memoryStore();
    await reserveBudget(store, 0.5, 0.5, day);
    expect((await reserveBudget(store, 0.1, 0.5, day)).ok).toBe(false);
    expect((await reserveBudget(store, 0.1, 0.5, new Date("2026-10-22T00:00:01Z"))).ok).toBe(true);
  });

  it("concurrent reservations can't overshoot the cap", async () => {
    const store = memoryStore();
    const results = await Promise.all(Array.from({ length: 20 }, () => reserveBudget(store, 0.05, 0.5, day)));
    expect(results.filter((r) => r.ok)).toHaveLength(10);
    expect(await spentToday(store, day)).toBeCloseTo(0.5);
  });
});

describe("costs", () => {
  it("prices by model and assumes the dearest for unknown ids", () => {
    expect(costUsd({ model: "claude-haiku-5-5", inputTokens: 1e6, outputTokens: 1e6, cacheReadTokens: 0 })).toBeCloseTo(
      0.6,
    );
    expect(costUsd({ model: "claude-sonnet-5-5", inputTokens: 1e6, outputTokens: 0, cacheReadTokens: 0 })).toBeCloseTo(
      2,
    );
    expect(costUsd({ model: "claude-new", inputTokens: 1e6, outputTokens: 0, cacheReadTokens: 0 })).toBeCloseTo(4);
    expect(worstCaseUsd("claude-haiku-5-5", 3000, 600)).toBeCloseTo((1000 * 0.1 + 600 * 0.5) / 1e6);
  });
});

describe("mode", () => {
  it("stays in mock mode without a key, or with a key but no budget store", () => {
    const env = { ...process.env };
    try {
      delete process.env.ANTHROPIC_API_KEY;
      delete process.env.MOCK_LLM;
      expect(currentMode().mode).toBe("mock");
      process.env.ANTHROPIC_API_KEY = "sk-test";
      delete process.env.UPSTASH_REDIS_REST_URL;
      expect(currentMode()).toEqual({ mode: "mock", reason: expect.stringMatching(/budget store/) });
      process.env.UPSTASH_REDIS_REST_URL = "https://x";
      process.env.UPSTASH_REDIS_REST_TOKEN = "t";
      expect(currentMode().mode).toBe("live");
      process.env.MOCK_LLM = "1";
      expect(currentMode().mode).toBe("mock");
    } finally {
      process.env = env;
    }
  });
});

describe("guarded run", () => {
  const mode = { mode: "live" as const, reason: "t" };

  it("caches a result and serves the repeat at $0 without running again", async () => {
    const store = memoryStore();
    let runs = 0;
    const run = async (reserve: (u: number) => Promise<boolean>) => {
      runs++;
      await reserve(0.01);
      return { answer: "x", trace: trace(0.002) };
    };
    const a = await guarded({ route: "ask", input: "Same question?", ip: "1", store, mode, run });
    const b = await guarded({ route: "ask", input: "  same QUESTION ", ip: "1", store, mode, run });
    expect(runs).toBe(1);
    expect(a.ok && a.value.trace.cached).toBe(false);
    expect(b.ok && b.value.trace.cached).toBe(true);
    expect(b.ok && b.value.trace.costUsd).toBe(0);
    expect(await spentToday(store)).toBeCloseTo(0.002, 6);
  });

  it("returns a plain message when rate limited", async () => {
    const store = memoryStore();
    const run = async () => ({ trace: trace(0) });
    for (let i = 0; i < 4; i++) await guarded({ route: "fit", input: `jd ${i}`, ip: "9", store, mode, run });
    const r = await guarded({ route: "fit", input: "jd 5", ip: "9", store, mode, run });
    expect(r).toEqual({ ok: false, message: expect.stringMatching(/Too many requests/) });
  });

  it("reports the budget message when a reservation is denied", async () => {
    const store = memoryStore();
    const run = async (reserve: (u: number) => Promise<boolean>) => {
      if (!(await reserve(99))) throw new Error("daily budget reached");
      return { trace: trace(0) };
    };
    const r = await guarded({ route: "fit", input: "jd", ip: "1", store, mode, run });
    expect(r).toEqual({ ok: false, message: expect.stringMatching(/budget/) });
  });

  it("cache entries are separated by mode", async () => {
    const store = memoryStore();
    await cacheSet(store, "ask", "q", "mock:1", { v: 1 });
    expect(await cacheGet(store, "ask", "q", "live:1")).toBeNull();
    expect(await cacheGet(store, "ask", "Q?", "mock:1")).toEqual({ v: 1 });
  });
});

describe("upstash store", () => {
  it("sends INCRBY with EXPIRE NX in one pipeline", async () => {
    const sent: unknown[] = [];
    const orig = globalThis.fetch;
    globalThis.fetch = (async (_url: string, init: RequestInit) => {
      sent.push(JSON.parse(String(init.body)));
      return new Response(JSON.stringify([{ result: 7 }, { result: 1 }]));
    }) as typeof fetch;
    try {
      const v = await upstashStore("https://u", "t").incrBy("k", 2, 60);
      expect(v).toBe(7);
      expect(sent[0]).toEqual([
        ["INCRBY", "k", 2],
        ["EXPIRE", "k", 60, "NX"],
      ]);
    } finally {
      globalThis.fetch = orig;
    }
  });
});
