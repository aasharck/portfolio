---
title: supabase-rls-check
slug: supabase-rls-check
order: 6
summary: A read-only CLI that finds the Supabase misconfigurations that leak data, with the SQL to fix each one.
---

## What it is

A read-only command-line tool that connects to a Postgres or Supabase database and reports the mistakes that leak data: tables without row-level security, policies that allow every row (USING (true)), tables the anon role can write to, SECURITY DEFINER functions exposed to the API, and views that bypass RLS. Each finding has a severity and the exact SQL to fix it, in a Markdown report. Apps built fast, especially with Lovable, Bolt or Cursor, often ship with at least one of these, and with Supabase the anon key is public by design, so row-level security is the only thing between the data and the internet.

> Source: supabase-rls-check README (Freelancing/demos/supabase-rls-check); Upwork portfolio notes

## How it is built

Read-only by design: every query runs inside a read-only transaction with a 15 second statement timeout and only reads Postgres's catalogs (pg_class, pg_policies, pg_proc), never the rows. It exits with code 1 on a high-severity finding so it can run in CI. TypeScript on Node with node-postgres, tested with node:test against a throwaway local Postgres loaded with a demo app full of the usual mistakes.

> Source: supabase-rls-check README (usage, try it, stack)

## Limits

It checks configuration, not logic: a policy like using (user_id = auth.uid()) passes even if the app sets user_id wrongly. Storage buckets, Edge Functions and API keys in client code are out of scope. It is a starting point for a review, not a replacement for one.

> Source: supabase-rls-check README (limits)
