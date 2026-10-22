---
title: SitesGen
slug: sitesgen
order: 3
summary: Multi-tenant AI SaaS, built and launched solo in about a month. Eight agents on Claude, about $0.33 of model spend per generated site.
url: https://www.sitesgen.com
---

## What it is

SitesGen is a multi-tenant SaaS for agencies and freelancers who sell websites. It finds local businesses whose websites are letting them down, designs and builds each one a better website from its own photos and reviews, and writes the pitch used to sell it, by email, WhatsApp, LinkedIn or in person. Aashar is the founder and sole engineer. He built and launched it solo in about a month, with subscription billing and a first customer on a paid trial. It is live at sitesgen.com.

> Source: CV (projects); SitesGen README (intro)

## Stack

Next.js 16, TypeScript, Supabase (Postgres, auth, row-level security), shadcn/ui, Puppeteer, background workers, and subscription billing with Dodo Payments. Error monitoring with Sentry and product analytics with PostHog, both switched off unless their keys are set.

> Source: SitesGen README; Upwork portfolio notes (SitesGen); SitesGen HANDOFF.md §3x

## The eight agents

A prospect moves across a board in one direction (Discovered, Approved, In progress, Ready to send, Sent, Replied, Won) and the user approves the two moments that matter: which businesses are worth building for, and whether the pitch is good enough to send.

- Discovery: maps every business in an area, audits each website, scores the opportunity. Rules only, no model.
- Screening: decides which are independent businesses worth approaching and picks the design kit. Claude Haiku.
- Visual check: screenshots each surviving prospect's homepage and judges how dated it looks. Claude Haiku.
- Photo reader: captions the business's and customers' photos, keeps faces off the page, transcribes a photographed menu board. Claude Haiku.
- UI/UX: reads reviews, photos and menu, chooses colourway and typefaces inside the kit, plans the sections and writes every word. Claude Opus.
- Build: assembles the plan into one self-contained HTML file from the kit's sections. Deterministic, no model, $0.
- Outreach: finds the owner's published contact details and writes the pitch for each channel. Claude Opus.
- Design review: screenshots the built page, critiques it and proposes plan changes. Claude Sonnet.

Each agent runs on its own model and effort, set per environment. A claude-* model id routes to the Anthropic SDK; anything else goes to an OpenAI-compatible endpoint. Responses are schema-constrained on both providers.

> Source: SitesGen README (how it works, the agents)

## Cost per site

Producing one website costs about $0.33 in model spend on the default models, measured rather than estimated: $0.17 for the design plan, $0.04 for the photo reader, $0.05 for the pitch and a $0.07 share of the scan that found it. The build step costs nothing. Every job records its own tokens and cost, attributed to the member who asked for it. Sonnet was tried for the plan and the pitch and rejected on quality, because the site and the pitch are the product.

> Source: SitesGen README (cost); CV (projects)

## How the cost came down

An earlier version of the design plan sent about 27k input tokens. A Haiku call now pre-picks the design kit for under a cent, and the planner's prompt carries only that kit's catalogue in a cached system block, so input fell to about 4k tokens and a plan's cost from about $0.26 to about $0.17. A later pass, choosing model and effort per agent against output quality, measured about $0.18 per site. Plans are still priced at $0.40 a site for headroom.

> Source: SitesGen HANDOFF.md §3i (cost pass) and §3ab (cost re-measured)

## Models write plans, code writes HTML

A model never writes markup. It writes a JSON plan (kit, colourway, typefaces, sections, copy) constrained by enums, and code renders it from hand-built kit sections. That is why a build is free and has no failure path, why the editor can re-render instantly, and why two pages never look like siblings. Letting the model write markup was tried in an experiment and rejected on quality. The document head, meta tags and LocalBusiness structured data are assembled in code from facts on record, so the new site provably fixes the technical faults the audit reported. The generated page is then checked against the promises the pitch will make (one h1, semantic landmarks, the primary action present, no scripts); violations go back to the model as a named repair list.

> Source: SitesGen README (architecture, what the rebuild guarantees); SitesGen HANDOFF.md §1–2

## Architecture: tenancy and the queue

Every table is keyed by workspace_id behind row-level security. The browser's key can only read its own workspace; every write goes through a server action or the worker using the service role, after the session and the plan have been checked, so nothing a client sends to Supabase directly gets past a plan cap. Agents hand off by queueing the next job rather than calling it directly, so a long pipeline never blocks a request and a failure stops at the step that failed. A failed generation is refunded to the plan allowance. Supabase's own pg_cron and pg_net call the worker every minute, only when work is queued.

> Source: SitesGen README (architecture, background worker); SitesGen HANDOFF.md §3aa

## Resumable jobs

A worker invocation has 300 seconds on Vercel. Rather than fit every job inside it, a job can stop partway and hand back a checkpoint; the worker re-queues it with its state and the next tick continues. A Dubai Marina scan finds 564 businesses, so scans now insert qualified prospects after every batch of 12, stop new checks 60 seconds before the deadline, and resume on the next tick. Jobs stuck running for more than 12 minutes are failed with a plain reason and refunded.

> Source: SitesGen HANDOFF.md §3p and §3q

## Discovery: getting the data right

Businesses come from Google Maps (via Serper) with OpenStreetMap as the free fallback, merged by name. OpenStreetMap records a website for only about a fifth of businesses, which made it the biggest source of bad prospects; Google knows the website for about 95% and adds the rating and review count. Each website is audited over plain HTTP and scored out of 100 for speed, mobile, search, trust and whether it is gone entirely. Several checks exist only to avoid false alarms: a 401/403/429 is recorded as "not allowed to look", never as a broken site, and a redirect to another domain is only called a hijack when it shares nothing with the business. Chains are removed in three passes, cheapest first, with a single batched model call at the end that costs a fraction of a cent per neighbourhood.

> Source: SitesGen README (how discovery decides)

## Security work on SitesGen

A security pass found that row-level security allowed members to write directly through Supabase REST with their JWT, so a user could have queued a job past their cap or set their own plan. Writes were revoked from client roles and moved behind server actions, then proved with a real user JWT (update, insert and upsert denied; select still works). Previews of generated sites are served with script-src 'none'. Outreach email was locked down so it cannot be used as an open relay (own prospects only, per-prospect and per-day limits).

> Source: SitesGen HANDOFF.md §3h (security pass) and §3y

## Shipping it

He ran the whole loop end to end on production as a fresh user the night before launch (sign-in, scan, build, pitch, contact form, design review), found and fixed the failures (worker auth lost on a redirect, scans dying at Vercel's 300 second limit, serverless Chrome that never launched), then verified live billing on launch morning with a real $1 payment that arrived through the webhook and started a trial.

> Source: SitesGen HANDOFF.md §3p and §3z

## What he'd do next

From the project's own backlog: carry a business's real menus, price lists and opening hours verbatim onto the generated page (built on a branch with 19 offline tests, not merged yet); team invites; usage top-ups for extra sites; an onboarding email sequence; and browsing archived prospects.

> Source: SitesGen HANDOFF.md §3ai and §5 (loose ends, not built)
