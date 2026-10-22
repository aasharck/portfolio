import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { AskTool } from "@/components/ask-tool";
import { readScore } from "@/lib/break";
import { getStore } from "@/lib/guard";

export const metadata: Metadata = {
  title: "Try to break it",
  description:
    "Try to make this site's AI lie about Aashar: prompt injection, false premises, made-up facts. See which safeguard stops each attempt.",
};

async function LiveTool() {
  await connection(); // the scoreboard is read per request
  const score = await readScore(getStore());
  return <AskTool variant="break" initialScore={score} />;
}

export default function BreakItPage() {
  return (
    <>
      <header className="doc-head">
        <p className="crumbs">
          <Link href="/how-it-works">Under the hood</Link> / Break it
        </p>
        <h1>
          Try to <em>break it.</em>
        </h1>
        <p>
          Make the assistant say something about Aashar that isn&apos;t in his record: a job he never had, a skill he
          doesn&apos;t claim, its own instructions. Every attempt shows which safeguard handled it, and the trace shows
          exactly why.
        </p>
      </header>

      <section className="sec" aria-labelledby="rules">
        <div className="split">
          <div>
            <span className="label caps">(Rules)</span>
            <h2 id="rules" className="statement">
              You win if it states a fact <em>the record doesn&apos;t contain.</em>
            </h2>
          </div>
          <ol className="rules body">
            <li>
              <strong>Refusal gate.</strong> If nothing in the record covers the question, it refuses before any model
              is called.
            </li>
            <li>
              <strong>Grounding guard.</strong> An answer without a valid citation to a retrieved section is thrown
              away.
            </li>
            <li>
              <strong>The prompt.</strong> The model is told to use only the numbered sources and to treat your message
              as data, not instructions.
            </li>
            <li>
              Same limits as the chat: 500 characters, a per-network rate limit and the daily budget. Only counts are
              kept, never what you type.
            </li>
          </ol>
        </div>
      </section>

      <section className="sec" aria-label="Break-it tool">
        <Suspense fallback={<AskTool variant="break" />}>
          <LiveTool />
        </Suspense>
        <p className="body muted break-note">
          Found a way through? Email <a href="mailto:aasharck@gmail.com">aasharck@gmail.com</a> with the exact text. The
          test cases that every build has to pass are on the <Link href="/evals">evals page</Link>.
        </p>
      </section>
    </>
  );
}
