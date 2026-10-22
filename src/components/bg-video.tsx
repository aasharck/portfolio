"use client";

import { useEffect, useRef } from "react";

type Conn = { saveData?: boolean; effectiveType?: string };

/**
 * A decorative, muted, looping video. Nothing is fetched until after hydration.
 * - Wide screens: poster, then the full video.
 * - Phones: a lighter portrait version, only if one is given, attached after the page
 *   has finished loading (so it never competes with the first paint), and only on a
 *   fast connection without data saver.
 * Reduced motion: never plays (wide screens keep the poster).
 */
export function BgVideo({
  src,
  poster,
  mobileSrc,
  mobilePoster,
  className,
}: {
  src: string;
  poster: string;
  mobileSrc?: string;
  mobilePoster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = matchMedia("(min-width: 861px)").matches;
    const play = (s: string, p: string) => {
      v.poster = p;
      if (reduce || conn?.saveData) return;
      v.src = s;
      v.play().catch(() => {});
    };

    if (wide) {
      play(src, poster);
      return;
    }
    if (!mobileSrc || !mobilePoster || reduce || conn?.saveData) return;
    // effectiveType is Chromium-only; elsewhere (e.g. Safari) assume a good connection.
    if (conn?.effectiveType && conn.effectiveType !== "4g") return;
    const start = () => play(mobileSrc, mobilePoster);
    if (document.readyState === "complete") {
      const t = setTimeout(start, 300);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [src, poster, mobileSrc, mobilePoster]);

  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
  );
}
