# Deploying the portfolio (Saturday Oct 24)

About 45 minutes. Nothing here has been done yet: the branch `v2` has never been pushed or deployed.
Costs: Vercel Hobby and Upstash free tiers are $0. (The brief allowed Upstash or Supabase for the budget store; only Upstash is implemented.) Model spend is capped at **$0.50 a day** by the site itself (≈ $15/month worst case), and you should also set a limit in each provider's console (step 3).

## 0. Before you start

- Accounts: GitHub, Vercel, Upstash, Anthropic Console, OpenAI Platform.
- The old site's Vercel deployment no longer exists. If the old **Vercel project** is still there (Vercel → Projects), reuse it so you keep `aashar.vercel.app`; otherwise create a new one in step 4.
- Read `DECISIONS.md` once; it says why things are the way they are.

## 1. Push the code

```bash
cd ~/Projects/portfolio
git push -u origin v2
```

Open a pull request from `v2` into `main` on GitHub and merge it (the old 2023 site stays in `main`'s history; its files are in `legacy-2023/` and can be deleted later with `git rm -r legacy-2023`).

## 2. Upstash Redis (budget, rate limits, cache)

1. console.upstash.com → Create database → Redis, free plan, in the same region as your Vercel Functions (Vercel's default is Washington, D.C., `iad1`, so pick US East; if you change the Functions region in Vercel → Settings → Functions, match it).
2. On the database page, under **REST API**, copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

Without these two, live mode stays off even with API keys: a per-instance counter can't enforce a daily budget.

## 3. Model keys, with a provider-side limit too

- **Anthropic** (fit check): console.anthropic.com → API keys → create `portfolio`. Set a monthly spend limit for the workspace (Settings → Limits), e.g. $10.
- **OpenAI** (chat): platform.openai.com → API keys → create a project key for a project named `portfolio`. Set the project's monthly budget, e.g. $5.

The site's own $0.50/day cap is the first line; the provider limits are the backstop if something is misconfigured.

## 4. Vercel project

1. vercel.com → Add New → Project → import the GitHub repo. Framework: Next.js (detected). Build command: default (`npm run build`; it builds the corpus and runs the mock eval first, so a broken corpus or a dropped eval score fails the deploy). Node: 22.x.
2. Settings → Environment Variables, for **Production** (and Preview if you want live previews):

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | from step 3 |
| `OPENAI_API_KEY` | from step 3 |
| `UPSTASH_REDIS_REST_URL` | from step 2 |
| `UPSTASH_REDIS_REST_TOKEN` | from step 2 |
| `DAILY_BUDGET_USD` | `0.50` |
| `IP_SALT` | any random string, e.g. output of `openssl rand -hex 16` |
| `NEXT_PUBLIC_SITE_URL` | the final URL, e.g. `https://aashar.vercel.app` |

Leave the rest unset; defaults are in `.env.example` (models, rate limits, max JD length).

3. Deploy. Then Settings → Domains if you have a custom domain; update `NEXT_PUBLIC_SITE_URL` to match and redeploy.

## 5. Smoke test (10 minutes, about 10¢)

1. Open the site on your phone and laptop. Hero video plays on the laptop; the phone shows the still layout.
2. **Ask**: "What does a SitesGen site cost in model spend?" → an answer with `[1]`-style sources. Open *Under the hood*: mode **live**, model `gpt-6-luna`, tokens and cost in cents.
3. **Ask**: "Does he know Kubernetes?" → refused, and the trace says the model wasn't called.
4. **Fit check**: click *Use a sample JD* → *Run the fit check*. The flag says **Live**; Kubernetes is "no evidence"; every quote links to `/notes/...`. Read it for tone.
5. **Break it**: try one attack; the scoreboard counts it.
6. Upstash → Data Browser: you should see `budget:<today>` (micro-dollars spent), `rl:ask:…` keys and `cache:…` keys.
7. Share the URL in a private chat (WhatsApp/LinkedIn message to yourself) and check the preview card shows the name and portrait.

If anything says **Mock** in production, a key or the Upstash pair is missing: the trace's mode line names which.

## 6. Live eval (once, about 25¢)

Locally, with the two keys in your shell:

```bash
EVAL_LIVE=1 ANTHROPIC_API_KEY=… OPENAI_API_KEY=… npm run eval
```

38 cases: 33 chat answers on `gpt-6-luna` (≈ 2¢ in total) and 5 fit reports on Haiku + Sonnet (≈ 4–5¢ each). It writes `evals/results/live.json`. Read the failures it prints, then commit that file and push: `/evals` shows the live scores from then on (builds keep running the free mock eval as a regression check).

## When the content changes

Edit `content/*.md`, then regenerate the CV PDF (it's a static file): `npm run build && npx next start -p 3100`, and in another terminal `npm run cv:pdf`. Commit `public/aashar-ck-cv.pdf`. `npm run eval:save` refreshes the committed mock eval results.

## Kill switches

- Pause AI spend without redeploying code: set `DAILY_BUDGET_USD=0` (everything refuses politely) or `MOCK_LLM=1` (mock mode), then Redeploy.
- Roll back: Vercel → Deployments → previous deployment → Promote to Production.
- Rotate a leaked key in the provider console, update it in Vercel, redeploy.

## Not set up (on purpose)

Analytics and error monitoring (Sentry/PostHog) aren't wired in. Vercel's built-in Web Analytics can be switched on from the dashboard with no code change.
