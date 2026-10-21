"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import { askAction, type AskState } from "@/app/actions";
import { Hood } from "./hood";

const SUGGESTIONS = [
  "What does a SitesGen site cost in model spend?",
  "How do the SitesGen agents hand off work?",
  "Has he built a RAG system?",
  "What did he find in smart-contract audits?",
  "Does he know Kubernetes?",
];

export function AskTool() {
  const [state, action, pending] = useActionState<AskState, FormData>(askAction, { turns: [] });
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="tool">
      {state.turns.length > 0 && (
        <ol className="chat" aria-label="Answers">
          {state.turns.map((t, i) => (
            <li key={i}>
              <p className="q">› {t.question}</p>
              <p className={`a${t.refused ? " refused" : ""}`}>{t.answer}</p>
              {t.citations.length > 0 && (
                <ul className="cites" aria-label="Sources">
                  {t.citations.map((c) => (
                    <li key={c.n}>
                      [{c.n}] <Link href={c.url}>{c.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
              <Hood trace={t.trace} />
            </li>
          ))}
        </ol>
      )}

      <div className="suggest" aria-label="Suggested questions">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            disabled={pending}
            onClick={() => {
              if (inputRef.current && formRef.current) {
                inputRef.current.value = s;
                formRef.current.requestSubmit();
              }
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <form action={action} ref={formRef}>
        <label className="field">
          <span className="field-label">
            <span>Your question</span>
            <span>answers only from the corpus, with sources</span>
          </span>
          <input ref={inputRef} type="text" name="q" required maxLength={500} autoComplete="off" placeholder="e.g. What did he build on AWS?" />
        </label>
        <div className="tool-row">
          <button className="btn" type="submit" disabled={pending}>
            {pending ? <span className="pending-dot">Searching</span> : "Ask →"}
          </button>
        </div>
      </form>
      <div aria-live="polite">{state.error && <p className="error">{state.error}</p>}</div>
    </div>
  );
}
