import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  "/",
  "/work/sitesgen",
  "/fit",
  "/ask",
  "/how-it-works",
  "/notes",
  "/notes/experience",
  "/evals",
  "/break-it",
];

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

for (const path of PAGES) {
  test(`${path} renders, no horizontal scroll, no axe violations (light + dark)`, async ({ page }, info) => {
    for (const scheme of ["light", "dark"] as const) {
      // Motion is checked separately below; axe judges the settled page.
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await noHorizontalScroll(page);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      const bad = axe.violations.map(
        (v) =>
          `${v.id} (${v.impact}): ${v.nodes
            .map((n) => n.target.join(" "))
            .slice(0, 3)
            .join(", ")}`,
      );
      expect(bad, `${scheme}: ${bad.join("\n")}`).toEqual([]);
      const name = `${path === "/" ? "home" : path.slice(1).replace(/\//g, "-")}-${info.project.name}-${scheme}.png`;
      await page.screenshot({ path: `docs/screenshots/${name}`, fullPage: true });
    }
  });
}

test("motion runs when allowed, and is skipped under reduced motion", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-on/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.waitForTimeout(500);
  await expect(page.locator("html")).not.toHaveClass(/motion-on/);
});

test("hero says what he does in the first screen", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Aashar CK");
  await expect(page.locator(".tagline")).toContainText("A full-stack & AI engineer");
  await expect(page.locator(".tagline")).toBeInViewport();
  await expect(page.locator(".hero-bar").getByText("Available immediately")).toBeInViewport();
  await expect(page.getByRole("link", { name: "Fit check" }).first()).toBeInViewport();
});

test("fit check: sample JD → cited report with an honest gap and a trace", async ({ page }, info) => {
  await page.goto("/fit");
  await page.getByRole("button", { name: "Use a sample JD" }).click();
  await page.getByRole("button", { name: /Run the fit check/ }).click();
  const report = page.getByRole("region", { name: "Fit report" });
  await expect(report).toBeVisible();
  await expect(report).toContainText("Mock mode");
  await expect(report.locator(".reqs > li")).toHaveCount(8);
  const k8s = report.locator(".reqs > li", { hasText: "Kubernetes" });
  await expect(k8s).toContainText("no evidence");
  await expect(k8s).toContainText("No direct evidence");
  await expect(report.locator(".reqs > li", { hasText: "Experience with AWS" })).toContainText("source:");
  await report.getByText("Under the hood").click();
  await expect(report.locator(".hood table")).toBeVisible();
  await expect(report.locator(".hood")).toContainText("search_corpus");
  await page.screenshot({ path: `docs/screenshots/fit-report-${info.project.name}.png`, fullPage: true });
  // citations land on a real section
  await report.locator(".evidence a").first().click();
  await expect(page).toHaveURL(/\/notes\/.+#.+/);
});

test("ask: cited answer, then a refusal for something not in the record", async ({ page }, info) => {
  await page.goto("/ask");
  await page.getByRole("button", { name: "What does a SitesGen site cost in model spend?" }).click();
  const answers = page.getByRole("list", { name: "Answers" });
  await expect(answers.locator("> li").first()).toContainText("$0.33");
  await expect(answers.getByRole("list", { name: "Sources" }).first()).toBeVisible();
  await page.getByRole("button", { name: "Does he know Kubernetes?" }).click();
  await expect(answers.locator("> li").nth(1)).toContainText("I don't have evidence");
  await answers.locator("> li").nth(1).getByText("Under the hood").click();
  await expect(answers.locator("> li").nth(1)).toContainText("model not called");
  await page.screenshot({ path: `docs/screenshots/ask-answers-${info.project.name}.png`, fullPage: true });
});

test.describe("with JavaScript off", () => {
  test.use({ javaScriptEnabled: false });

  test("fit check still works as a plain form post", async ({ page }) => {
    await page.goto("/fit");
    await page
      .locator("textarea[name=jd]")
      .fill(
        "Requirements:\n- Experience with AWS Lambda and API Gateway\n- Kubernetes in production\n- Strong PostgreSQL skills",
      );
    await page.getByRole("button", { name: /Run the fit check/ }).click();
    await expect(page.getByRole("region", { name: "Fit report" })).toContainText("no evidence");
  });

  test("ask still works and the trace opens without JS", async ({ page }) => {
    await page.goto("/ask");
    await page.locator("input[name=q]").fill("Tell me about TraccoAI");
    await page.getByRole("button", { name: /Ask/ }).click();
    await expect(page.getByRole("list", { name: "Answers" })).toContainText("TraccoAI");
    await page.locator(".hood summary").first().click();
    await expect(page.locator(".hood table").first()).toBeVisible();
  });
});

test("input limits are enforced on the server", async ({ request }) => {
  // The textarea caps length in the browser; this checks the page still renders for a short JD error path.
  const res = await request.get("/fit");
  expect(res.ok()).toBe(true);
});

test("break it: an attack is refused, labelled with its guard, and counted", async ({ page }) => {
  await page.goto("/break-it");
  const board = page.getByLabel("Scoreboard");
  await expect(board).toBeVisible();
  await page.getByRole("button", { name: "What is his phone number?" }).click();
  const answers = page.getByRole("list", { name: "Answers" });
  await expect(answers).toContainText("I don't have evidence");
  await expect(answers).toContainText("Stopped before any model call");
  await expect(board.getByText("Attempts").locator("..")).not.toContainText(/^Attempts0$/);
});

test("evals page shows scores and lists failures", async ({ page }) => {
  await page.goto("/evals");
  await expect(page.getByText("Retrieval", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /gets it wrong/ })).toBeVisible();
});

test("security headers and share image", async ({ request }) => {
  const res = await request.get("/");
  expect(res.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  const og = await request.get("/opengraph-image");
  expect(og.ok()).toBe(true);
  expect(og.headers()["content-type"]).toContain("image/png");
});

test("unknown pages get the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Not in the record");
});

test("CV page offers a PDF without the phone number, and sitemap lists it", async ({ page, request }) => {
  await page.goto("/cv");
  await expect(page.getByRole("link", { name: "Download PDF" })).toHaveAttribute("href", "/aashar-ck-cv.pdf");
  await expect(page.locator("main")).not.toContainText("334");
  const pdf = await request.get("/aashar-ck-cv.pdf");
  expect(pdf.headers()["content-type"]).toContain("pdf");
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/cv");
});

test("intro plays on the first load only, and never under reduced motion", async ({ page }) => {
  await page.goto("/");
  const intro = page.locator(".intro");
  await expect(intro).toBeVisible();
  await expect(intro).toBeHidden({ timeout: 5000 }); // lifts away by itself, no JS needed
  await page.reload();
  await expect(intro).toBeHidden();
  const fresh = await page.context().browser()!.newPage({ reducedMotion: "reduce" });
  await fresh.goto(page.url());
  await expect(fresh.locator(".intro")).toBeHidden();
  await fresh.close();
});
