---
title: Security work
slug: security
order: 8
summary: Competitive smart-contract audits (4 High, 2 Medium), plus application security in his own products.
---

## Competitive smart-contract audits

Aashar audited smart contracts competitively on Code4rena and Sherlock, identifying 4 High and 2 Medium severity vulnerabilities under adversarial review conditions. This was during his freelance period (July 2022 to July 2023).

> Source: CV (freelance experience)

## Application security in his own products

The same habit carries into his web work. On SitesGen he found that row-level security let signed-in users write straight to the database with their own token, moved every write behind server-side checks, and proved the fix with a real user token. He wrote supabase-rls-check, a read-only CLI that finds the Supabase misconfigurations that leak data. His support-agent demo refuses to reveal an order unless the order number and email both match, and answers "no match" the same way in both failure cases so it can't be used to discover orders.

> Source: SitesGen HANDOFF.md §3h; supabase-rls-check README; ai-support-agent README (guardrails)
