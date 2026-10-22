---
title: TraccoAI
slug: traccoai
order: 4
summary: LLM visibility analytics. Tracks how often ChatGPT, Claude, Gemini and Perplexity recommend a brand, over time and against competitors.
url: https://www.traccoai.com
---

## What it is

TraccoAI is a multi-tenant platform that measures how often a brand gets recommended by ChatGPT, Claude, Gemini and Perplexity, shown as trends over time and side by side against competitors. The problem it solves: brands can't see whether AI assistants recommend them. Aashar is the sole architect and engineer, and built and launched it solo (2025 to present). It is live at traccoai.com.

> Source: CV (projects); Upwork portfolio notes (TraccoAI)

## How it works

It sends each brand's category prompts to all four models on a schedule and tracks appearance rate, share of voice and mention quality over time, side by side with competitors. The dashboard is React, Next.js and TypeScript with Recharts; a scheduled Node.js backend queries the four LLM APIs; PostgreSQL is indexed to stay fast as scan history grows.

> Source: CV (projects); Upwork portfolio notes (TraccoAI)
