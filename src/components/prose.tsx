import { Fragment } from "react";

/** Renders the small markdown subset used in content/: paragraphs and "- " lists. */
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="prose">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && " "}
                {l}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
