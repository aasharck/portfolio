---
title: AI support agent (RAG demo)
slug: ai-support-agent
order: 5
summary: A support agent that answers only from a shop's own docs, cites every answer, says "I don't know", and can look up orders. A demo for a made-up shop, not a client project.
---

## What it is

A chat assistant for a small business's website that answers customer questions using only the business's own help pages and PDF manuals, shows exactly where each answer came from, says "I don't know" instead of making something up, and can check an order or open a support ticket. It is a demo built for Tamp & Bloom, a made-up coffee-equipment shop; it is not a client project. Every reply shows its model, latency and cost.

> Source: ai-support-agent README (Freelancing/demos/ai-support-agent)

## How it works

Help pages (Markdown) and PDF manuals are split into sections by heading and indexed in Postgres with pgvector. Each question retrieves the 5 best-matching sections, at most 3 from any one file. Claude answers using only those sections with native citations, or calls a tool (order lookup, new ticket). Tool inputs are validated with strict zod schemas, and the tool loop stops after 5 rounds. A grounding guard in code replaces any factual reply that has no citation and no tool result with the "I don't know" reply. Locally it runs on PGlite (Postgres compiled to WASM) with nothing to set up.

> Source: ai-support-agent README (how it works, embeddings, guardrails)

## Guardrails

Order lookup needs both the order number and the email on the order, and gives the same "no match" reply whether the order doesn't exist or the email is wrong, so it can't be used to discover orders. One email address can open at most 3 tickets an hour. Tables have row-level security on with no policies, so Supabase's public anon key can't read orders or tickets.

> Source: ai-support-agent README (guardrails)

## Evaluation

47 automated tests run with no network and no API key, including the live Claude path against a scripted fake client. A 15-question eval (10 answerable, 2 that must be refused, 3 that need a tool, including one where the wrong email must not reveal the order): retrieval finds the right section for 10 of 10 doc questions, and 13 of 15 answers are fully correct in the free mock mode. It has not been run with a live API key yet.

> Source: ai-support-agent README (tests, how well it answers); Upwork portfolio notes (ai-support-agent.md)

## Stack

Next.js 16, TypeScript, Postgres + pgvector (Supabase, or PGlite in memory locally), Claude API with tool use and native citations, zod, Vitest, Playwright.

> Source: ai-support-agent README (for developers)
