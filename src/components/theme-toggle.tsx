"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function read(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const listeners = new Set<() => void>();
function subscribe(fn: () => void) {
  listeners.add(fn);
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", fn);
  return () => {
    listeners.delete(fn);
    mq.removeEventListener("change", fn);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null);
  // Server render / JS off: keep the button's space (no layout shift) but hide it;
  // the OS preference applies.
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      style={theme ? undefined : { visibility: "hidden" }}
      aria-hidden={theme ? undefined : true}
      tabIndex={theme ? undefined : -1}
      aria-label={`Switch to ${next} theme`}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {}
        listeners.forEach((l) => l());
      }}
    >
      {theme === "dark" ? "light" : "dark"}
    </button>
  );
}
