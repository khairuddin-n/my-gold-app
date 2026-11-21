# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the owner's brief and the existing app (2026-11-21); the owner asked to execute directly without an interview round.

## Platform

web

## Stack

delegated: static HTML/CSS/JS PWA on GitHub Pages (same pattern as the owner's Hutang Lu and okane PWAs). Data and logic stay in the existing Google Apps Script project + Google Sheet, called through a token-protected `doPost` JSON API.

## Users

One person: the owner. Indonesian, checks the app on an Android phone, usually in the morning after GMI (Gold Merchant Indonesia / Antam Certieye app) publishes the day's prices. Not for anyone else; features that only make sense for this one user are fine.

## Product Purpose

Track a personal physical-gold portfolio bought through GMI: what the gold is worth today at buyback price, how far it is from break-even, and whether today is a good day to buy more, hold, or sell. Success = in one glance each morning the owner knows the value, the change, and the advice, and logging the day's prices takes under a minute.

## Positioning

Unlike generic gold-price apps, it values the owner's own pieces at the real GMI buyback price, and compares the GMI price with the world gold price (premium) to give a concrete BELI / TUNGGU / NETRAL / JUAL signal.

## Operating Context

- Daily ritual: screenshot the "Update Harga" page in the GMI app → hand it to this app → Gemini (fallback Drive OCR) reads date + buy/buyback prices per size → review → save to the sheet.
- A daily 09:00 WIB Apps Script trigger refreshes world prices (Yahoo GC=F + ECB USD/IDR) and emails reminders/advice changes.
- Sizes: 1, 2, 3, 5, 10, 25, 50, 100 g. Holdings and summary formulas live in the sheet tabs Gold, Ringkasan, Update Harga, Pasar, Aturan.

## Capabilities and Constraints

- Home: total value, unrealised P/L, change since previous price, weight/modal/break-even, advice card, break-even progress, 1 g buyback chart with ranges, holdings list, sold total, world premium, buyback table.
- Update prices: multiple screenshots, manual entry, sanity checks vs previous prices, overwrite existing dates, save.
- Never change the sheet structure; the sheet formulas are the source of truth for summary numbers.
- Language: Indonesian UI.

## Brand Commitments

- Name: "My Gold" (installed app name). Logo/icon colour: yellow (owner's explicit request).
- Principle from the owner: clean and professional. Owner dislikes clutter, redundant info, and forecasts (see okane / Hutang Lu feedback).

## Evidence on Hand

Real data comes from the owner's sheet at runtime. No demo data ships in the app.

## Product Principles

1. One glance answers "how much is it worth and what should I do today".
2. Logging prices must be faster than opening the sheet.
3. Show facts from the sheet; never invent projections.
4. Every number appears once, in the place it means the most.
