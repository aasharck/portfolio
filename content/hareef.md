---
title: Hareef
slug: hareef
order: 3.4
summary: AI football coach for young players in the Gulf. iOS app in Arabic and English, built on Expo with an AI coach and video clip review on Claude. Live on the App Store.
url: https://hareefapp.com
---

## What it is

Hareef (حريف) is a mobile training app for young football players in the Gulf. It is Arabic-first, in Gulf dialect, with an English version, and it builds a weekly training plan around the player's position, level and training days. An AI coach answers questions and reviews short video clips of the player; players earn XP, keep a streak and compete on a leaderboard. Aashar built it solo, and it is live on the App Store as "Hareef: AI Soccer Coach", with monthly and yearly subscriptions.

> Source: Hareef README (intro); Hareef BACKLOG.md (subscriptions, 2026-11-11); App Store listing, checked Nov 16 2026

## What is built

Onboarding with eight questions and a projected rating, then a paywall. A home screen with today's session, streak and rank. A weekly plan and a library of 22 drills that work offline, each with a step-by-step animation drawn in code and Bronze, Silver and Gold targets. A 12-week position program with phase tests, a guided session player with timers and spoken cues in both languages, a skill test, a reaction trainer, a shareable player card, and global, city and weekly leaderboards with leagues.

> Source: Hareef README (what is built)

## Stack

Expo SDK 58, React Native, TypeScript and Expo Router, with Reanimated and react-native-svg for the drill animations. RevenueCat for subscriptions. Supabase for Postgres and Deno edge functions; the AI calls use the Anthropic SDK from the edge functions. Cloud builds and over-the-air updates with EAS. PostHog for events only and Sentry for crashes, both without personal data.

> Source: Hareef README (tech stack; how it works)

## The AI coach and clip review

The coach chat knows the player's profile, rank and recent results and runs on Claude Haiku. Clip review takes a clip of up to 30 seconds, extracts 12 frames on the device and sends them to Claude Sonnet, which returns a score and what to fix. Both go through edge functions that first ask RevenueCat whether the device has an active subscription: grace periods count, a yes is cached for 10 minutes and a no for 1 minute, and failed lookups are never cached. Paying users are capped at 60 coach messages and 5 clip reviews a day, and a use is refunded if the call fails on the server.

> Source: Hareef README (how it works: AI calls)

## No accounts, still safe

There is no sign-up. The app makes a random device id on first launch and uses it as the subscription user id; profile, history and chat stay on the device. That puts the trust boundary on the server: the coach's context and the player profile are rebuilt on the server from a whitelist with length limits, clips must be 1 to 12 JPEG frames of limited size, every function limits requests per network address, and one address can introduce only 60 new device ids an hour. Leaderboard XP is counted by a server function, not the app, with per-kind daily limits and a 400 XP daily cap, and the database functions behind it are callable only by the service role.

> Source: Hareef README (how it works: identity, AI calls, rate limits, leaderboard XP); Hareef BACKLOG.md (pre-launch review, 2026-11-10)

## Arabic first

Language follows layout direction: Arabic runs right-to-left and English left-to-right, and a one-tap switch flips the direction and restarts the app. A device with Arabic in its language list, or in a Gulf region, starts in Arabic. Details that only show up in Arabic were fixed before launch: parts of a line are joined with the Arabic comma, because a middle dot next to Arabic digits reads as a zero, and button arrows point the right way. Long names are sized to fit on the player card and the headlines rather than cut off.

> Source: Hareef README (how it works: language); Hareef BACKLOG.md (pre-launch review, 2026-11-10)

## Shipping it

He took it from first commit to an App Store submission in about a week (Nov 8 to Nov 12, 2026): subscriptions and a one-time discount offer in RevenueCat, the store listing in five localizations, seven store screenshots per language, App Privacy answers, crash reporting and analytics, and a pre-launch review that locked database functions to the service role, stopped caching failed subscription checks, added in-app server-data deletion and added rate limits and XP caps.

> Source: Hareef git history (first commit 2026-11-08); Hareef BACKLOG.md (before store submission; pre-launch review)
