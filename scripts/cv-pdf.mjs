// Regenerates public/aashar-ck-cv.pdf from the /cv page (print styles, A4).
// Run against a running build: npx next start -p 3100, then `npm run cv:pdf`.
// Re-run whenever content/ changes, and commit the PDF.
import { chromium } from "@playwright/test";

const base = process.env.CV_URL || "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
await page.goto(`${base}/cv`, { waitUntil: "networkidle" });
await page.pdf({ path: "public/aashar-ck-cv.pdf", format: "A4", printBackground: false, preferCSSPageSize: true });
await browser.close();
console.log("wrote public/aashar-ck-cv.pdf");
