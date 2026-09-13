# Casio FX-991EX ClassWiz — PWA Calculator

A fully working, offline-capable clone of the Casio FX-991EX ClassWiz scientific calculator, installable as a native app on phones, tablets, and desktops.

**Try it live:** https://1szco1.github.io/casio-ex991fx-classwiz-pwa/

## Features

- 552 functions: constants, unit conversion, solve, statistics, memory registers, history
- Scientific notation, degree/minute/second (DMS), nPr/nCr, GCD, factorials, percentages
- Real QR code (OPTN key) — scan to reopen the exact calculation or search it on Google
- 100% offline after first load (service worker + app shell caching)
- Installable PWA with app icons for Android, iOS, and desktop

## Install (add to home screen)

1. Open the live URL on your phone/desktop.
2. Tap the **Install** pill in the bottom-right corner (iOS: Share → "Add to Home Screen").
3. Launch it like a normal app — it works offline.

## Share

Press the blue **OPTN** key while holding **SHIFT** to generate a QR code for the current calculation:
open it back in the calculator, or search it on Google.

## Development

- `index.html` — the entire app (markup, styles, engine) plus inlined QR library
- `sw.js` — service worker (network-first navigations, offline app shell)
- `manifest.json` — PWA metadata and icons
- `og-image.png` — 1200×630 Open Graph share poster

To redeploy: commit to `main`; GitHub Pages builds automatically.