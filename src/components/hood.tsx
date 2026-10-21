import Link from "next/link";
import type { Trace } from "@/lib/trace";

export function formatCost(usd: number, mode: string): string {
  if (mode === "mock" && usd === 0) return "0¢ (mock)";
  const cents = usd * 100;
  return `${cents < 0.01 ? cents.toFixed(4) : cents.toFixed(3)}¢`;
}

/** "Under the hood": a <details> element, so it works with JavaScript off. */
export function Hood({ trace }: { trace: Trace }) {
  return (
    <details className="hood">
      <summary>
        <span>▸ Under the hood</span>
        <span>{trace.retrieved.length} chunks</span>
        <span>
          {trace.tokensIn}→{trace.tokensOut} tok
        </span>
        <span>{formatCost(trace.costUsd, trace.mode)}</span>
        <span>{trace.latencyMs} ms</span>
        {trace.cached && <span>cached</span>}
      </summary>
      <div className="hood-body">
        <h4>Mode</h4>
        <p style={{ margin: 0 }}>
          <span className="k">{trace.mode}</span> · {trace.modeReason}
          {trace.cached ? " · served from the answer cache, no new spend" : ""}
        </p>

        <h4>Steps</h4>
        <ol>
          {trace.steps.map((s, i) => (
            <li key={i}>
              <span className="k">{s.kind}</span> {s.name} · {s.detail}
              {s.ms ? ` · ${s.ms} ms` : ""}
            </li>
          ))}
        </ol>

        <h4>Retrieved chunks</h4>
        {trace.retrieved.length ? (
          <table>
            <thead>
              <tr>
                <th scope="col">chunk</th>
                <th scope="col" className="num">
                  bm25
                </th>
                <th scope="col" className="num">
                  coverage
                </th>
                <th scope="col">matched terms</th>
              </tr>
            </thead>
            <tbody>
              {trace.retrieved.map((r, i) => (
                <tr key={`${r.id}-${i}`}>
                  <td>
                    <Link href={r.url}>{r.label}</Link>
                    {r.query ? <div style={{ opacity: 0.75 }}>for: {r.query.slice(0, 80)}</div> : null}
                  </td>
                  <td className="num">{r.score.toFixed(2)}</td>
                  <td className="num">{r.coverage.toFixed(2)}</td>
                  <td>{r.matched.join(" ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ margin: 0 }}>Nothing in the corpus matched.</p>
        )}

        <h4>Tokens and cost</h4>
        {trace.usage.length ? (
          <ol>
            {trace.usage.map((u, i) => (
              <li key={i}>
                {u.model}: {u.inputTokens} in{u.cacheReadTokens ? ` + ${u.cacheReadTokens} cached` : ""} / {u.outputTokens} out
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ margin: 0 }}>No model call: 0 tokens, $0.</p>
        )}
        <p style={{ margin: "0.5rem 0 0" }}>
          total {formatCost(trace.costUsd, trace.mode)} · {trace.latencyMs} ms
        </p>
      </div>
    </details>
  );
}
