import type { CSSProperties } from "react";

/** A ring of letters turning in 3D (pure CSS). Decorative: the same words are in the page text. */
export function TextRing({ text }: { text: string }) {
  const chars = [...text];
  const style = { "--step": `${360 / chars.length}deg` } as CSSProperties;
  return (
    <div className="ring-stage" aria-hidden="true">
      <div className="ring">
        <div className="ring-spin" style={style}>
          {chars.map((c, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties}>
              {c === " " ? " " : c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
