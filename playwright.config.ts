import { defineConfig, devices } from "@playwright/test";

// Uses the installed Google Chrome (channel "chrome"), so no browser download.
// The server runs a production build in forced mock mode: $0, deterministic.
const PORT = 3200;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, channel: "chrome", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { MOCK_LLM: "1", RATE_FIT_PER_10MIN: "1000", RATE_ASK_PER_10MIN: "1000" },
  },
});
