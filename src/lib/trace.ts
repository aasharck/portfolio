import type { Hit } from "./retrieval";
import { costUsd, type Mode, type Usage } from "./llm";

export interface TraceStep {
  kind: "tool" | "model" | "check" | "cache" | "guard";
  name: string;
  detail: string;
  ms: number;
}

export interface RetrievedRow {
  id: string;
  label: string;
  url: string;
  score: number;
  coverage: number;
  matched: string[];
  query?: string;
}

export interface Trace {
  mode: Mode;
  modeReason: string;
  steps: TraceStep[];
  retrieved: RetrievedRow[];
  usage: Usage[];
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  latencyMs: number;
  cached: boolean;
}

export class Tracer {
  private t0 = Date.now();
  steps: TraceStep[] = [];
  retrieved: RetrievedRow[] = [];
  usage: Usage[] = [];
  constructor(
    private mode: Mode,
    private modeReason: string,
  ) {}

  async step<T>(kind: TraceStep["kind"], name: string, fn: () => Promise<T> | T, detail: (r: T) => string): Promise<T> {
    const s = Date.now();
    const r = await fn();
    this.steps.push({ kind, name, detail: detail(r), ms: Date.now() - s });
    return r;
  }

  note(kind: TraceStep["kind"], name: string, detail: string) {
    this.steps.push({ kind, name, detail, ms: 0 });
  }

  hits(hits: Hit[], query?: string) {
    for (const h of hits) {
      this.retrieved.push({
        id: h.chunk.id,
        label: `${h.chunk.docTitle} › ${h.chunk.heading}`,
        url: h.chunk.url,
        score: Math.round(h.score * 100) / 100,
        coverage: Math.round(h.coverage * 100) / 100,
        matched: h.matched,
        query,
      });
    }
  }

  done(cached = false): Trace {
    const tokensIn = this.usage.reduce((a, u) => a + u.inputTokens + u.cacheReadTokens, 0);
    const tokensOut = this.usage.reduce((a, u) => a + u.outputTokens, 0);
    return {
      mode: this.mode,
      modeReason: this.modeReason,
      steps: this.steps,
      retrieved: this.retrieved,
      usage: this.usage,
      tokensIn,
      tokensOut,
      costUsd: this.usage.reduce((a, u) => a + costUsd(u), 0),
      latencyMs: Date.now() - this.t0,
      cached,
    };
  }
}
