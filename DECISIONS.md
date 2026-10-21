# Decisions (part 1, Wed Oct 21 2026 morning run)

Made while Aashar was away. Each one is easy to reverse; the reason is next to it.

## Repo and framework

- **Branch `v2`**, nothing pushed, nothing deployed, $0 spent (no API key used; every AI path ran in mock mode).
- **Old 2023 site moved to `legacy-2023/` with `git mv`**, not deleted. The tool I run in refused a bulk delete of tracked files, so moving was the safe equivalent. It's also in git history on `main`. Delete the folder whenever you like: `git rm -r legacy-2023`.
- **Next.js 16.4.2** (latest from create-next-app), App Router, React 19.3, TypeScript strict, `src/` dir. Kept the scaffold's `cacheComponents: true` + `partialPrefetching: true` (Next's current default). Pages are static; the two AI features are server actions.
- **Server actions + `useActionState`** for the fit check and chat, so both forms work with JavaScript off (progressive enhancement). The "Under the hood" panel is a native `<details>`, also JS-free.
- **No Tailwind, no component library.** One hand-written stylesheet (`src/app/globals.css`) with CSS variables for light/dark. Keeps the look from drifting toward the shadcn/AI-template look.

## Content

- **`content/*.md` is the single source of truth.** One file per topic, `## ` sections, each ending in a `> Source:` line. The pages, the fit check and the chat all read it. `/notes` renders it so every citation lands on a real, visible section.
- **Facts used only from the listed sources.** Where sources disagreed, the more conservative one won:
  - SitesGen customer: CV says "a first customer on a paid trial"; the Upwork notes say "first paying customer". Used the CV wording.
  - SitesGen cost: README/CV say "about $0.33 per site". HANDOFF §3ab says a later pass measured about $0.18. Headline uses $0.33 (CV); the case study mentions the $0.18 pass with its source. **Check which you want to lead with.**
  - Number of design kits: README says ten, HANDOFF says twenty-three built. Left the count out.
- **Left out:** phone number (as asked); AqarMetrics link (its backend was offline on Oct 17 per the Upwork notes; mentioned by name only); TraccoAI's repo README is the create-next-app boilerplate, so TraccoAI facts come from the CV and Upwork notes only.
- **Voice:** pages speak as "I" (it's your site); corpus notes are third person so the agent says "Aashar" and "he".

## AI design

- **Retrieval: BM25 at build time, no embeddings.** 45 chunks. Lexical search with heading weighting and a ~20-group alias table (Claude ↔ LLM, Lambda ↔ serverless…) is accurate at this size, instant, explainable (scores in the trace) and needs nothing at runtime. transformers.js was the alternative; rejected because the ONNX runtime + model would bloat the serverless function and cold starts for a small gain on 45 chunks. Revisit if the corpus grows past a few hundred chunks.
- **Coverage score** alongside BM25: the idf-weighted share of the query's terms a chunk covers. Unseen terms (e.g. "Kubernetes") get maximum weight, so a question can't be "answered" by matching only its filler words. It drives the refusal gate (chat: < 0.45 → refuse without calling a model) and the mock verdicts (≥ 0.6 strong, ≥ 0.35 partial).
- **Models** (from the claude-api skill, cached 2026-10-06, not guessed):
  - Chat: `claude-haiku-5-5` ($0.10/$0.50 per MTok), effort low. Cheapest current model.
  - Fit check extraction: `claude-haiku-5-5`, structured output.
  - Fit check judgement: `claude-sonnet-5-5` ($2/$10), effort medium, structured output. The stronger model where quality is the product, at half Opus 5.5's price; a report should cost about 3–4¢. Swap with `REPORT_MODEL=claude-opus-5-5` if quality needs it.
  - Server-side refusal fallback (`fallbacks: "default"`, beta `server-side-fallback-2026-07-01`) is on for Sonnet/Opus calls, as the skill recommends. Haiku has none.
- **Citations are verified in code, not trusted.** The JD judge must quote verbatim from a chunk retrieved *for that requirement*; any quote that isn't found is dropped and a verdict left without evidence becomes "no direct evidence". Chat answers must carry valid `[n]` markers or they are replaced by the refusal.
- **Mock mode** when `ANTHROPIC_API_KEY` is missing, labelled on every answer: rule-based requirement extraction (bullets under requirement-like headings) and verdicts from coverage; extractive chat answers. Everything else (retrieval, citation checks, refusals, rate limit, trace) is the same code as live.

## Guardrails

- **Live mode requires Upstash Redis** as well as the API key. Serverless instances don't share memory, so an in-process budget counter can't enforce a daily cap. Without Upstash the site stays in mock mode even with a key. Supabase was the other option in the brief; Upstash's REST API needs no client library and no schema, so only Upstash is implemented.
- **Budget:** reserve the worst-case cost (input chars/3 tokens + max_tokens) with `INCRBY` before each call, refund if it would cross the cap, settle to the real cost after. Counted in micro-dollars per UTC day. Failed calls keep their reservation (they may have been billed).
- **Rate limit:** fixed 10-minute window per hashed IP (12 questions, 4 fit checks). IPs are hashed with `IP_SALT` before use.
- **Cache:** answers keyed by normalised input + mode + corpus build time, 7 days. A cached answer shows "cached" and $0 in the trace.
- **Limits:** 500-char questions, 8,000-char JDs.

## Not done in part 1 (on purpose)

- Public evals page, "try to break it" challenge, DEPLOY.md: tonight's part 2.
- Supabase budget store, streaming answers, multi-turn context in chat (each question is retrieved on its own).

## Added in review loop 2

- **The "This site" note is never evidence in the fit check.** It describes the portfolio's own pipeline, so citing it for "RAG experience" would be circular. The chat can still use it to answer "how does this site work?".
- **Live reports: strengths and gaps are rebuilt from the verified verdicts.** Only the one-line headline is the model's text, so a requirement whose citation failed verification can't still be listed as a strength.
- **Security headers** (nosniff, DENY framing, referrer and permissions policy) in `next.config.ts`. No CSP yet: the inline theme script would need a nonce or hash. Part 2 candidate.
- **Screenshots:** the full set (every page, desktop + phone, light + dark) is regenerated by `npm run e2e` into `docs/screenshots/` and git-ignored (30 MB). Five compressed key shots are committed in `docs/key-screens/`.

## Changed Oct 21 (after Aashar's review)

- **"Available immediately" added** (hero, contact, corpus `profile.md`), at Aashar's request.
- **Redesign: "Bold Swiss studio"** (Aashar picked it from four directions with references: dennissnellenberg.com, rauno.me; alternatives were a 3D hero, a desktop-OS metaphor and quiet minimal). Host Grotesk at extreme sizes (not Inter/Geist), cool grey ground, near-black ink, one acid-lime accent used only as a fill (never as text, so contrast never depends on it). Motion: magnetic round CTAs, a name marquee, cursor-following project previews on desktop, CSS scroll reveals that only translate (never fade from zero). All of it switches off under reduced motion. No 3D: in this direction type and motion carry the look, and it keeps phones at Lighthouse 98.
- **Hero no longer leads with SitesGen.** It says plainly what Aashar is ("Full-stack & AI engineer"), what he builds, and that he's available immediately, with the fit check as the one call to action. SitesGen moved to the top of "Selected work", described in plain words ("an app that finds local businesses with weak websites, builds each a new site and writes the pitch").
- **Chat moved to OpenAI** at Aashar's request: `gpt-6-luna` ($0.10 / $0.50 per 1M tokens, the newest small model on OpenAI's pricing page, read Oct 21) via the Responses API, low reasoning effort. Same price as Claude Haiku 5.5, so it's about $0.0005 an answer either way. The fit check stays on Claude (Haiku 5.5 extracts, Sonnet 5.5 judges). Each feature has its own mode: chat goes live with `OPENAI_API_KEY` + Upstash, the fit check with `ANTHROPIC_API_KEY` + Upstash.
