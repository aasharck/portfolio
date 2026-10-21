// Cost guardrails: input limits, per-IP rate limit, a hard daily budget and an
// answer cache. Backed by Upstash Redis (REST) when configured, otherwise by an
// in-process store, which is only good enough for mock mode and tests. Live mode
// refuses to start without Upstash (see currentMode in llm.ts).

import { createHash } from "node:crypto";

export interface Store {
  incrBy(key: string, by: number, ttlSec: number): Promise<number>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSec: number): Promise<void>;
}

export function memoryStore(now: () => number = Date.now): Store {
  const data = new Map<string, { v: string; exp: number }>();
  const live = (k: string) => {
    const e = data.get(k);
    if (e && e.exp <= now()) data.delete(k);
    return data.get(k);
  };
  return {
    async incrBy(key, by, ttlSec) {
      const e = live(key);
      const v = (e ? Number(e.v) : 0) + by;
      data.set(key, { v: String(v), exp: e ? e.exp : now() + ttlSec * 1000 });
      return v;
    },
    async get(key) {
      return live(key)?.v ?? null;
    },
    async set(key, value, ttlSec) {
      data.set(key, { v: value, exp: now() + ttlSec * 1000 });
    },
  };
}

export function upstashStore(url: string, token: string): Store {
  async function pipeline(cmds: (string | number)[][]): Promise<unknown[]> {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`upstash ${res.status}`);
    const out = (await res.json()) as { result?: unknown; error?: string }[];
    return out.map((r) => {
      if (r.error) throw new Error(`upstash: ${r.error}`);
      return r.result;
    });
  }
  return {
    async incrBy(key, by, ttlSec) {
      // NX: only set the expiry when the key is new, so a window never extends itself.
      const [v] = await pipeline([
        ["INCRBY", key, by],
        ["EXPIRE", key, ttlSec, "NX"],
      ]);
      return Number(v);
    },
    async get(key) {
      const [v] = await pipeline([["GET", key]]);
      return (v as string | null) ?? null;
    },
    async set(key, value, ttlSec) {
      await pipeline([["SET", key, value, "EX", ttlSec]]);
    },
  };
}

let defaultStore: Store | null = null;
export function getStore(): Store {
  if (!defaultStore) {
    const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
    defaultStore = url && token ? upstashStore(url, token) : memoryStore();
  }
  return defaultStore;
}

// ---- limits -------------------------------------------------------------

export const LIMITS = {
  questionChars: 500,
  jdChars: Number(process.env.MAX_JD_CHARS || 8000),
  jdMinChars: 80,
  dailyBudgetUsd: Number(process.env.DAILY_BUDGET_USD || 0.5),
  rate: {
    ask: { max: Number(process.env.RATE_ASK_PER_10MIN || 12), windowSec: 600 },
    fit: { max: Number(process.env.RATE_FIT_PER_10MIN || 4), windowSec: 600 },
  },
};

export type Route = keyof typeof LIMITS.rate;

export function hashKey(...parts: string[]): string {
  return createHash("sha256").update(parts.join("\u0000")).digest("hex").slice(0, 24);
}

export interface RateResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export async function rateLimit(store: Store, route: Route, ip: string, now = Date.now()): Promise<RateResult> {
  const { max, windowSec } = LIMITS.rate[route];
  const window = Math.floor(now / 1000 / windowSec);
  // IPs are hashed with a salt so the store never holds a raw address.
  const key = `rl:${route}:${hashKey(process.env.IP_SALT || "portfolio", ip)}:${window}`;
  const count = await store.incrBy(key, 1, windowSec);
  const retryAfterSec = windowSec - (Math.floor(now / 1000) % windowSec);
  return { ok: count <= max, remaining: Math.max(0, max - count), retryAfterSec };
}

// Budget is counted in micro-dollars so Redis can use integer INCRBY.
const MICRO = 1_000_000;

export function budgetKey(now = new Date()): string {
  return `budget:${now.toISOString().slice(0, 10)}`; // UTC day
}

export interface Reservation {
  ok: boolean;
  reservedUsd: number;
  spentTodayUsd: number;
  capUsd: number;
}

/** Reserve the worst-case cost before calling a model. Denied if it would cross the cap. */
export async function reserveBudget(
  store: Store,
  usd: number,
  capUsd = LIMITS.dailyBudgetUsd,
  now = new Date(),
): Promise<Reservation> {
  const micro = Math.ceil(usd * MICRO);
  const after = await store.incrBy(budgetKey(now), micro, 2 * 86400);
  if (after > capUsd * MICRO) {
    await store.incrBy(budgetKey(now), -micro, 2 * 86400);
    return { ok: false, reservedUsd: 0, spentTodayUsd: (after - micro) / MICRO, capUsd };
  }
  return { ok: true, reservedUsd: usd, spentTodayUsd: after / MICRO, capUsd };
}

/** After the call: replace the reservation with what it actually cost. */
export async function settleBudget(
  store: Store,
  reservedUsd: number,
  actualUsd: number,
  now = new Date(),
): Promise<void> {
  const delta = Math.ceil(actualUsd * MICRO) - Math.ceil(reservedUsd * MICRO);
  if (delta !== 0) await store.incrBy(budgetKey(now), delta, 2 * 86400);
}

export async function spentToday(store: Store, now = new Date()): Promise<number> {
  return Number((await store.get(budgetKey(now))) ?? 0) / MICRO;
}

// ---- answer cache --------------------------------------------------------

export function normaliseForCache(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[?!.]+$/, "")
    .trim();
}

export async function cacheGet<T>(store: Store, route: Route, input: string, mode: string): Promise<T | null> {
  const raw = await store.get(`cache:${route}:${mode}:${hashKey(normaliseForCache(input))}`);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function cacheSet(store: Store, route: Route, input: string, mode: string, value: unknown): Promise<void> {
  await store.set(`cache:${route}:${mode}:${hashKey(normaliseForCache(input))}`, JSON.stringify(value), 7 * 86400);
}
