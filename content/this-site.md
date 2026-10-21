---
title: This site
slug: this-site
order: 10
summary: How this portfolio's fit check and chat work, and what they cost.
---

## How the fit check and chat work

This portfolio is itself an AI system Aashar built. Every fact on it lives in a markdown corpus with a source line per section. At build time the corpus becomes chunks and a BM25 index, so retrieval needs no embedding API and costs nothing. The fit check extracts a job description's requirements with Claude Haiku, searches the corpus for each one, and has Claude Sonnet judge the evidence; code then checks every quoted citation against its source and drops any that don't match. The chat answers with Claude Haiku from the top five chunks and refuses, without calling a model, when nothing in the corpus covers the question.

> Source: this repository (src/lib/fit.ts, src/lib/ask.ts, src/lib/retrieval.ts)

## Cost controls on this site

Each answer shows its retrieved chunks, scores, tokens, cost in cents and latency. Spending is capped by a hard daily budget (default $0.50) that reserves each call's worst-case cost before it runs, a per-network rate limit, a cache for repeated questions, and input length limits. Without an API key it runs in a clearly labelled mock mode at $0.

> Source: this repository (src/lib/guard.ts, .env.example)
