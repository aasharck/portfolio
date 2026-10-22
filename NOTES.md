# Portfolio v2: notes

**For Aashar, in 5 lines (Thu Oct 22):**
1. **Ready to deploy on Saturday**, in mock mode it's complete: all pages, the fit check, chat, evals, break-it, CV + PDF. Nothing is pushed or deployed; $0 spent.
2. **Look at first:** run it (`npm run build && npm start`) and scroll the home page on a laptop, then paste a real job description into the fit check.
3. **Not yet proven:** the live models (OpenAI chat, Claude fit check) have never run. `DEPLOY.md` step 5 is a 10-minute smoke test.
4. **Live eval:** `EVAL_LIVE=1 npm run eval` costs about **25¢** (38 cases) and replaces the mock scores on /evals once you commit `evals/results/live.json`.
5. **Known misses** (mock mode, shown on /evals): false premises like "Has he worked at Google?" get an off-target but true quote. Zero fabricated sentences across all 38 cases.

**Open these 3 screenshots:** `docs/key-screens/1-hero.jpg` · `docs/key-screens/9-fit-report.jpg` · `docs/key-screens/11-evals.jpg`

---

# Part 1 notes (Wed Oct 21 2026, morning run)

> **Update 3, Oct 21:** art-yakushev.com is now the only reference: ring and letter wall removed; his motion rebuilt with the same libraries (GSAP ScrollTrigger + SplitText + ScrambleText, Lenis smooth scroll): rising name, blur-to-sharp statement, growing pinned project with a cover panel, lighting services list, revealed footer. Phones get a simpler, readable layout. Tests: 42 unit, 28 e2e (incl. a motion on/off test), axe 0 violations. Lighthouse `/`: mobile 96/100/100/100, desktop 100s. Key screens in `docs/key-screens/` follow the scroll order.
>
> **Update 2, Oct 21:** redesigned again from Aashar's picks in a reference gallery (art-yakushev.com as the base, plus ideas from wodniack.dev and olhalazarieva.com): black stage, grotesk + italic serif, giant name, live Dubai clock, 3D text ring, kinetic WORK wall. Tests: 42 unit, 26 e2e, axe 0 violations (light + dark). Lighthouse: `/` mobile 98/100/100/100, desktop 100s; `/work/sitesgen` and `/fit` mobile 98. See DECISIONS.md.
>
> **Update 1, Oct 21 after review:** redesigned in the "Bold Swiss studio" direction Aashar picked (Host Grotesk, grey/ink/acid-lime, magnetic CTAs, marquee, cursor previews); hero rewritten in plain words with "Available immediately"; SitesGen moved to Selected work; chat now on OpenAI `gpt-6-luna`, fit check still on Claude. Tests after the redesign: 42 unit, 26 e2e (axe 0 violations, light + dark), Lighthouse mobile 98/100/100/100 on `/`, `/work/sitesgen`, `/fit`, `/ask`, desktop 100s. Key screenshots in `docs/key-screens/` are the new design. Details in DECISIONS.md.

Branch `v2`, 4 commits on top of `main`, **nothing pushed, nothing deployed, $0 spent** (no API key on this machine; every AI path ran in mock mode). Choices and reasons: `DECISIONS.md`.

## What's built

A Next.js 16.4 site where the AI features are the proof.

| Page | What it does |
|---|---|
| `/` | Hero ("I build AI systems that ship, and I can show the receipts"), SitesGen cost receipt ($0.17 + $0.07 + $0.05 + $0.04 + $0.00 ≈ $0.33), fit check, work (SitesGen feature + TraccoAI, support agent, supabase-rls-check, also shipped), ask, experience, security (4 High / 2 Medium), contact |
| `/fit` | **Paste a JD.** Extracts requirements → searches the corpus per requirement → verdict per requirement (evidence / partial / no evidence) with verbatim quotes linked to their source section → honest summary with gaps. Every quote is verified in code. |
| `/ask` | Chat that answers only from the corpus with `[n]` sources; refuses ("I don't have evidence for that…") before any model call when nothing covers the question; grounding guard drops uncited answers. |
| every answer | **Under the hood** (`<details>`, works with JS off): mode, steps (tool / model / check), retrieved chunks with BM25 score, coverage and matched terms, tokens, cost in cents, latency, cached flag. |
| `/work/sitesgen` | Case study: pipeline diagram (SVG, model per agent), cost breakdown, then 12 sections: agents, cost and how it came down, plans-not-markup, tenancy and queue, resumable jobs, discovery, security, launch, what's next. |
| `/notes`, `/notes/[slug]` | The corpus itself: 10 docs, 45 sections, each with its source line. Every citation lands here. |
| `/how-it-works` | Retrieval, refusals, models, guardrails, mock mode, explained. |

- **Corpus:** `content/*.md`, every fact from the CV, SitesGen README/HANDOFF, demo READMEs and Upwork notes, each section ending in `> Source:`. Phone number left off (a unit test checks).
- **Retrieval at $0:** build-time BM25 (`scripts/build-corpus.ts` → `src/generated/corpus.json`), heading weighting, alias table, idf-weighted coverage score.
- **Models:** chat `gpt-6-luna` (OpenAI, since the redesign; was `claude-haiku-5-5`); JD extraction `claude-haiku-5-5`; JD judgement `claude-sonnet-5-5` with server-side refusal fallback. Structured outputs via `betaZodOutputFormat`. All overridable by env.
- **Guardrails:** live mode needs `ANTHROPIC_API_KEY` **and** Upstash Redis; hard daily budget (default $0.50, reserve worst case → settle actual); per-IP rate limit (12 questions / 4 fit checks per 10 min); 7-day answer cache; 500 / 8,000 char limits. All in `.env.example`.

## Results

| Check | Result |
|---|---|
| Unit tests (Vitest) | **41 passed**: retrieval, corpus integrity, refusals (no model call), citation markers, grounding guard, mock + live fit report against a scripted Claude (invented quotes and wrong-source quotes dropped, verdict downgraded), budget (cap, settle, UTC reset, 20 concurrent reservations never overshoot), rate limit, cache, mode gating, Upstash pipeline shape |
| E2E (Playwright, installed Chrome) | **26 passed** on desktop 1440×900 and Pixel 7: every page 200 with one h1 and no horizontal scroll; fit check + ask flows; both work with **JavaScript off** |
| Accessibility (axe, WCAG 2.2 AA) | **0 violations** on 7 pages × desktop/phone × light/dark |
| Lighthouse (prod build, local) | mobile: `/` 96/100/100/100, `/work/sitesgen` 96/100/100/100, `/fit` 96/100/100/100, `/ask` 96/100/100/100; desktop: 100/100/100/100 on all three tested (perf/a11y/best-practices/SEO) |
| TypeScript strict, ESLint | clean |
| `next build` | clean, all pages static; AI features are server actions |

Commands: `npm test`, `npm run e2e`, `npm run typecheck`, `npm run lint`. Lighthouse JSON is written to `lighthouse/` (git-ignored).

## Screenshots

Committed (compressed): `docs/key-screens/` — home desktop light, home phone dark, SitesGen case study desktop dark, a full fit report (desktop), chat with a cited answer and a refusal (phone).
Full set (every page × desktop/phone × light/dark, plus fit and ask flows): run `npm run e2e`, then look in `docs/screenshots/`.

## Not verified

- **The live Claude path has never run.** It's covered by unit tests against a scripted client only. First live run will show real token counts and cost; check one fit report by eye.
- Upstash store tested against a mocked fetch only.
- Mock-mode quote picking is rule-based and sometimes picks a weaker sentence (e.g. the RAG requirement). Live mode picks its own quotes.

## For Aashar to decide

1. Lead with **$0.33** per site (CV/README) or the later **≈ $0.18** (HANDOFF §3ab)? Site uses $0.33, mentions $0.18 in the case study.
2. ~~"Available immediately"~~ added Oct 21 at Aashar's request.
3. `legacy-2023/` holds the old site (moved, not deleted). `git rm -r legacy-2023` when you're happy.

## Part 2: done (Thu Oct 22)

Branch `v2`, still not pushed or deployed, $0 spent.

- **Public evals** (`/evals`, `evals/cases.json`, `src/lib/eval.ts`, `npm run eval`): 38 cases: 18 answerable questions, 7 that must be refused, 8 prompt-injection and made-up-claim traps, and 5 job descriptions (AI engineer, full-stack Next.js, data engineer, frontend, and a poor fit: native iOS) with an accepted verdict per requirement. Runs in mock mode before every build; a unit test fails the build if any score drops. Mock scores: retrieval 18/18, answers 17/18, refusals 5/7, attacks stopped 7/8, fit verdicts 24/26, citations verified 34/34, grounded answers 21/21 (zero fabrication). Committed mock results: `evals/results/mock.json`. The one known miss is listed on the page: in mock mode "Has he worked at Google?" quotes the SitesGen note about Google Maps (a rule can't tell an employer from a product; the live model is told not to name employers the sources don't). `EVAL_LIVE=1 npm run eval` saves `evals/results/live.json`; commit it and the page shows the live run.
- Fixes the eval found: build/built didn't match; "orchestration" was wrongly an agent synonym (Airflow got partial credit); JD filler ("expert", "how long", "take") counted as skills; the mock quoted fragments like "Dubai, UAE." when no sentence matched; the email question cited the support agent's ticket rules.
- **Try to break it** (`/break-it`): the chat pipeline framed as a challenge, with attack chips, a per-answer label naming the safeguard that handled it (refusal gate / grounding guard / model declined / budget / answered with sources) and a live scoreboard. Only counters are stored, never the text.
- **Polish:** Content-Security-Policy (no nonces, which would make every page dynamic; inline scripts allowed for Next's RSC payload, everything else same-origin, `frame-ancestors 'none'`); Open Graph card with name and portrait; generated favicon and Apple icon (scaffold `favicon.ico` removed); footer links to Evals and Break it.
- **DEPLOY.md:** push, Upstash, keys with provider-side limits, Vercel env vars, smoke test, live eval (≈ 25¢), content updates, kill switches. No `vercel.json` needed.
- **Also added** (from the part-2 brief in Notion): `/cv`, a print-friendly CV built from the corpus with a generated 4-page A4 PDF (`npm run cv:pdf`; no phone number); a 404 page; `sitemap.xml` and `robots.txt`; CV in the top nav; your new portrait (sent Oct 22) in the (Info) block and the share card; side marks moved into the margin so they never sit on text.
- Review loops: hiring-manager pass (name, role and availability in the first screen, CV one click away), code pass (guard field, shared eval runner, counters-only scoreboard), two screenshot passes of every page at desktop and phone.
- Tests: 43 unit, 42 e2e (axe clean on 10 pages × desktop/phone × light/dark; break-it flow, 404, CV/PDF/sitemap, CSP and share card). Lighthouse mobile: `/` 96, `/work/sitesgen` 97, `/cv` 98, `/evals` 98, `/break-it` 99, with accessibility, best practices and SEO at 100; desktop 100s.
- Not done: streaming answers (answers arrive whole); the live model path still has never run, which is step 5 and 6 of DEPLOY.md on Saturday.

## Part 2 plan (as written in part 1)

1. **Public evals page** (`/evals`): a fixed set of ~20 questions + 3 JDs with expected outcomes (answer must cite X / must refuse / requirement must be "none"), run in mock mode in CI and once live; show retrieval hit-rate, refusal accuracy, citation-verification drop rate, cost per run. The unit tests already contain most of the cases to seed it.
2. **"Try to break it" challenge**: a page inviting prompt-injection and "make it claim something false" attempts, logging (hashed) attempts and showing the guardrail that stopped each (refusal gate, citation drop, grounding guard). Keep it on the same budget.
3. **Polish:** CSP with a hash for the inline theme script; Open Graph image; favicon (still the scaffold's); phone nav (theme toggle wraps to its own line); streaming answers.
4. **DEPLOY.md** for Saturday: Vercel project, env vars (from `.env.example`), Upstash database, `DAILY_BUDGET_USD`, `NEXT_PUBLIC_SITE_URL`, point the domain, first live smoke test (one question, one fit report, check the trace and the budget key in Redis).
5. Before going live: run the eval once with the real key (cents), and read three fit reports for tone.
