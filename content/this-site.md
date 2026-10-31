---
title: This site
slug: this-site
order: 10
summary: How this portfolio's chat works, and what it costs.
---

## How the chat works

This portfolio runs its own retrieval and citation pipeline. Every fact on it lives in a markdown corpus with a source line per section. At build time the corpus becomes chunks and a BM25 index, so retrieval needs no embedding API and costs nothing. The chat answers with OpenAI's gpt-6-luna from the top five chunks and refuses, without calling a model, when nothing in the corpus covers the question. Code then discards any answer without a valid citation.

> Source: this repository (src/lib/ask.ts, src/lib/retrieval.ts)

## Cost controls on this site

Each answer shows its retrieved chunks, scores, tokens, cost in cents and latency. Spending is capped by a hard daily budget (default $0.50) that reserves each call's worst-case cost before it runs, a per-network rate limit, a cache for repeated questions, and input length limits. Without an API key it runs in a clearly labelled mock mode at $0.

> Source: this repository (src/lib/guard.ts, .env.example)
