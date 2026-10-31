// One guarded path for the chat: input limits → rate limit → cache →
// budget reservation → run → settle → cache. Kept out of the server action so
// tests can drive it with a memory store and a fake model.

import { corpus } from "./corpus";
import { LIMITS, cacheGet, cacheSet, rateLimit, reserveBudget, settleBudget, type Route, type Store } from "./guard";
import type { ModeInfo } from "./llm";
import type { Trace } from "./trace";

export type Guarded<T> = { ok: true; value: T } | { ok: false; message: string };

export async function guarded<T extends { trace: Trace }>(opts: {
  route: Route;
  input: string;
  ip: string;
  store: Store;
  mode: ModeInfo;
  run: (reserve: (usd: number) => Promise<boolean>) => Promise<T>;
}): Promise<Guarded<T>> {
  const { route, input, ip, store, mode } = opts;

  const rl = await rateLimit(store, route, ip);
  if (!rl.ok) {
    return {
      ok: false,
      message: `Too many requests from your network. Try again in ${Math.ceil(rl.retryAfterSec / 60)} min.`,
    };
  }

  // The corpus build time is part of the key, so a content change invalidates old answers.
  const cacheMode = `${mode.mode}:${corpus.builtAt}`;
  const hit = await cacheGet<T>(store, route, input, cacheMode);
  if (hit) {
    return { ok: true, value: { ...hit, trace: { ...hit.trace, cached: true, costUsd: 0, latencyMs: 0 } } };
  }

  let reserved = 0;
  let denied = false;
  const reserve = async (usd: number) => {
    const r = await reserveBudget(store, usd, LIMITS.dailyBudgetUsd);
    if (r.ok) reserved += usd;
    else denied = true;
    return r.ok;
  };

  let value: T;
  try {
    value = await opts.run(reserve);
  } catch (e) {
    // Keep the reservation on failure: a request may have been billed before it failed.
    if (denied) return { ok: false, message: budgetMessage() };
    console.error(`[${route}]`, e);
    return { ok: false, message: "The model call failed. Nothing was charged to you; try again in a minute." };
  }
  if (reserved) await settleBudget(store, reserved, value.trace.costUsd);
  if (denied) return { ok: false, message: budgetMessage() };
  await cacheSet(store, route, input, cacheMode, value);
  return { ok: true, value };
}

export function budgetMessage(): string {
  return `Today's AI budget ($${LIMITS.dailyBudgetUsd.toFixed(2)}) is used up, so live answers are paused until 00:00 UTC. Everything on this site is still readable, and the corpus is at /notes.`;
}
