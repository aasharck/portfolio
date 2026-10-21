"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export interface WorkItem {
  title: string;
  href: string;
  what: string;
  stack: string;
  meta: string;
  image?: { src: string; alt: string };
}

/** Big project rows; on desktop a screenshot follows the cursor over the row. */
export function WorkList({ items }: { items: WorkItem[] }) {
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const shown = active !== null ? items[active].image : undefined;

  return (
    <>
      <ul
        className="work"
        onPointerMove={(e) => {
          if (preview.current) preview.current.style.left = `${e.clientX}px`;
          if (preview.current) preview.current.style.top = `${e.clientY}px`;
        }}
        onPointerLeave={() => setActive(null)}
      >
        {items.map((w, i) => (
          <li key={w.title} className="reveal">
            <Link className="row" href={w.href} onPointerEnter={() => setActive(w.image ? i : null)}>
              {w.image && (
                <span className="thumb">
                  <Image src={w.image.src} alt="" width={800} height={600} sizes="100vw" />
                </span>
              )}
              <h3>{w.title}</h3>
              <p className="what">
                {w.what}
                <small>{w.stack}</small>
              </p>
              <span className="meta">{w.meta}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={preview} className={`preview${shown ? " on" : ""}`} aria-hidden="true">
        {items.map((w, i) =>
          w.image ? (
            <Image
              key={w.title}
              src={w.image.src}
              alt=""
              width={800}
              height={600}
              sizes="26rem"
              style={{ display: i === active ? "block" : "none" }}
            />
          ) : null,
        )}
      </div>
    </>
  );
}
