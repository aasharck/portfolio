---
title: HypeSlide
slug: hypeslide
order: 3.2
summary: AI SaaS that finds the TikTok slideshows going viral in a product's niche and remakes them for that product. Layout reader, copywriter and renderer as separate agents, plus an MCP server.
url: https://hypeslide.com
---

## What it is

HypeSlide is a SaaS for founders who market an app, SaaS or website on TikTok. You paste your product's link; it works out what the product does and which niche it lives in, finds the photo slideshows going viral in that niche, explains why each one worked, and remakes the ones you pick for your product as 1080×1920 slides, ready to post. Aashar is the founder and sole engineer. It is live at hypeslide.com, with paid plans from $19 a month (billed yearly).

> Source: HypeSlide README (intro); HypeSlide HANDOVER.md §1 (what this product is); hypeslide.com landing and pricing, checked Nov 16 2026

## Stack

Next.js 16 (App Router, TypeScript strict), Supabase (Postgres, auth, storage, row-level security), Anthropic models, Higgsfield for AI images, Dodo Payments for billing, Resend for email, Upstash for rate limits, Sentry and PostHog, Vitest and Playwright, deployed on Vercel. Slides are rendered server-side with @napi-rs/canvas, with Arabic and right-to-left support, and zipped with fflate.

> Source: HypeSlide README (stack); HypeSlide HANDOVER.md §3 (stack and versions)

## The agents: one model per job

Each AI step is its own agent on its own model, set by environment variable. A layout reader (Opus, with vision) reads every slide of a viral post once: the background, every photo box, every text block with its position, size, weight, colour and outline, and whether the post advertises a product. Its result is cached and shared by every user. A copywriter (Opus) writes new text for every block and a photo search or image prompt for every box, once per remake. A breakdown agent explains why the post worked (hook, structure, text style, call to action), and Haiku tags topics in bulk. Measured live: reading 10 slides took 21 seconds and $0.07; writing a 5-slide remake took 12 seconds and $0.025.

> Source: HypeSlide PROGRESS.md (exact layout copies and AI agents, 2026-11-13)

## Remakes that copy the layout, not a template

Early remakes picked from a few fixed layouts, so a 4-photo grid or a screenshot in a frame came out as a plain slide. Now the renderer redraws the layout the reader measured, in the original's real shape (4:5, square or 9:16, measured from the image rather than guessed). Text size is calibrated by fitting the original wording into its measured box, because the model's own size estimate was about 15% off, and then the new text is fitted into the same box. When the original advertises something, the remake puts the user's own product, logo and screenshots in its place. Drawn infographics are redrawn by the image model using a crop of the original figure as a style reference, so a cartoon figure stays a cartoon figure.

> Source: HypeSlide PROGRESS.md (exact layout copies and AI agents; cross-niche remakes and illustrated infographics, 2026-11-13)

## Getting the niche right

A founder reported that a book-summary app's feed showed hair, environment and TikTok-growth posts. The causes, found on production: a post's niche came from whichever account a scan found first, and the relevance check read only captions, which on viral slideshows are often empty. The fix reads each post's topic from its first two slide images with Haiku (about $0.0002 a post), keeps a find hidden until it has been judged on that topic, and stopped a batch check from failing open. A dry run on that app's feed kept 12 of 45 posts, all on topic, for about a cent.

> Source: HypeSlide PROGRESS.md (niche accuracy: topics read from the slides, 2026-11-13)

## Architecture: queue, tenancy and spend caps

Every table has row-level security, with 61 RLS tests and 12 tests of the database functions. Credits, quotas, spend caps and the job queue live in SECURITY DEFINER functions in Postgres. Jobs run from a Postgres queue drained every minute by cron workers, each with a time budget, per-job timeouts, backoff and a dead-letter state; the long AI steps run on their own worker with a 270-second budget. External services sit behind interfaces with mock modes, so tests and the seed never spend real API credits. The public free tools have their own $2 a day AI budget, separate from paying customers', and fall back to templates when it is spent.

> Source: HypeSlide README (architecture notes); HypeSlide PROGRESS.md (status by module; free tools spend limits, 2026-11-14)

## For agents: an MCP server

HypeSlide ships a remote MCP server, so Claude Code, Cursor and other agents can ask what is going viral in a niche, get a breakdown of a post and start a remake. Access is by scoped API keys, stored hashed, included in every plan.

> Source: HypeSlide README (agents); HypeSlide docs/mcp.md

## The library

Live TikTok search returns different results from one call to the next, so the product stands on a shared library of proven viral slideshows that grows and is reused, plus each customer's own scan. On Nov 13 2026 the production library held about 18,500 slideshows. A read of it showed that a post's own reach fades after about three months but formats last: 64% of formats proven six or more months earlier had produced new viral posts in the last 60 days. That is why the feed ranks first by how recently a post's format last went viral.

> Source: HypeSlide PROGRESS.md (library-first launch, 2026-11-11; apps like yours and format-freshness ranking, 2026-11-13)

## Testing and shipping

At the last full count, 392 unit and integration tests and 48 Playwright end-to-end tests passed, with Core Web Vitals and JavaScript-size budgets checked in the end-to-end suite. A security review found nothing at 80% confidence or above. When the first production build with 151 free SEO tools failed, the cause was found and fixed: the sitemap read the whole library at build time, past Vercel's limit, and a cached dataset was over Next's 2 MB cache limit.

> Source: HypeSlide PROGRESS.md (free tools for SEO, 2026-11-14; status by module); HypeSlide HANDOVER.md §2
