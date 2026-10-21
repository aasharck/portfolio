"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// Dark is the site's default; light is an explicit choice.
function read(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

const listeners = new Set<() => void>();
function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null);
  // Server render / JS off: keep the button's space (no layout shift) but hide it.
  const next: Theme = theme === "light" ? "dark" : "light";
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
      {next}
    </button>
  );
}
