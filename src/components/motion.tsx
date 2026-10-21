"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Page motion, modelled on art-yakushev.com: Lenis smooth scroll, GSAP ScrollTrigger,
 * SplitText and ScrambleText. Everything is opt-in through data attributes, loaded
 * after first paint, and skipped entirely under prefers-reduced-motion. Initial
 * states are set from JS only, so the page reads in full with JavaScript off.
 *
 *   data-chars     letters rise into place on load (hero name)
 *   data-blur      words sharpen from a blur as the block scrolls through
 *   data-rise      element drifts up into place as it enters (giant numerals)
 *   data-scramble  text decodes from random letters when it enters, and on hover
 *   data-grow      featured media grows from a small tilted card to full screen
 *   data-fade-out  hero background blurs and fades as you leave the hero
 *   data-step      list items light up as they pass the middle of the screen
 */
export function Motion() {
  const pathname = usePathname();
  // Colours are read from CSS variables, so a theme switch rebuilds the animations.
  const [theme, setTheme] = useState(0);
  useEffect(() => {
    const onTheme = () => setTheme((t) => t + 1);
    window.addEventListener("themechange", onTheme);
    return () => window.removeEventListener("themechange", onTheme);
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { ScrambleTextPlugin }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/SplitText"),
          import("gsap/ScrambleTextPlugin"),
          import("lenis"),
        ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
      document.documentElement.classList.add("motion-on");

      const lenis = new Lenis({ lerp: 0.09 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

      const ctx = gsap.context(() => {
        // Desktop only: on phones the name is the largest paint, so it renders at once.
        for (const el of matchMedia("(min-width: 861px)").matches ? q("[data-chars]") : []) {
          const split = SplitText.create(el, { type: "chars", mask: "chars" });
          gsap.from(split.chars, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.035, delay: 0.15 });
        }

        for (const el of q("[data-fade-out]")) {
          gsap.to(el, {
            opacity: 0,
            filter: "blur(24px)",
            ease: "none",
            scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: true },
          });
        }

        // Words start in the muted grey (which already passes contrast) and sharpen to
        // full ink, so the statement stays legible at every frame of the reveal.
        const css = getComputedStyle(document.documentElement);
        const muted = css.getPropertyValue("--muted").trim();
        const ink = css.getPropertyValue("--ink").trim();
        for (const el of q("[data-blur]")) {
          const split = SplitText.create(el, { type: "words" });
          gsap.fromTo(
            split.words,
            { color: muted, filter: "blur(8px)" },
            {
              color: ink,
              filter: "blur(0px)",
              ease: "none",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 66%", scrub: true },
            },
          );
        }

        for (const el of q("[data-rise]")) {
          gsap.from(el, {
            yPercent: 55,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom 75%", scrub: true },
          });
        }

        // The grow-and-pin effect is desktop only; phones get a plain image (see CSS).
        for (const el of matchMedia("(min-width: 861px)").matches ? q("[data-grow]") : []) {
          gsap.fromTo(
            el,
            { scale: 0.42, rotateX: 24, rotateZ: -4, yPercent: 8 },
            {
              scale: 1,
              rotateX: 0,
              rotateZ: 0,
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("[data-grow-wrap]") ?? el,
                start: "top 85%",
                end: "top top",
                scrub: true,
              },
            },
          );
        }

        for (const el of q("[data-scramble]")) {
          const text = el.textContent ?? "";
          const run = () =>
            gsap.to(el, {
              duration: 0.9,
              scrambleText: { text, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", speed: 0.7 },
            });
          ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: run });
          el.addEventListener("mouseenter", run);
        }

        for (const el of q("[data-step]")) {
          ScrollTrigger.create({ trigger: el, start: "top 62%", end: "bottom 38%", toggleClass: "is-on" });
        }
      });

      // Images and fonts change heights after load; re-measure once they settle.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);

      cleanup = () => {
        window.removeEventListener("load", refresh);
        ctx.revert();
        document.documentElement.classList.remove("motion-on");
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pathname, theme]);

  return null;
}
