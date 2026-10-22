"use client";

import { useEffect, useRef } from "react";

/**
 * A decorative, muted, looping video. Nothing is fetched until after hydration:
 * on wide screens the poster and then the video are attached, unless reduced
 * motion or data saver is on (then the poster alone). Phones fetch neither.
 */
export function BgVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!matchMedia("(min-width: 861px)").matches) return;
    v.poster = poster;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;
    v.src = src;
    v.play().catch(() => {});
  }, [src, poster]);

  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
  );
}
