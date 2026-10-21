"use client";

import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:";

function dubaiTime(d = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .toUpperCase();
}

/** Local time in Dubai. When the minute changes the letters scramble, then settle. */
export function Clock() {
  const [shown, setShown] = useState("--:-- --");

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = "";
    let raf = 0;
    const settle = (target: string) => {
      if (reduce) return setShown(target);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 600);
        const fixed = Math.floor(p * target.length);
        setShown(
          [...target]
            .map((ch, i) => (i < fixed || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
            .join(""),
        );
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const update = () => {
      const t = dubaiTime();
      if (t !== current) {
        current = t;
        settle(t);
      }
    };
    update();
    const id = setInterval(update, 5000);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span>
      Dubai <span className="mono">{shown}</span>
    </span>
  );
}
