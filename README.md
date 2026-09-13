# Casio FX-991EX ClassWiz — PWA Calculator

A fully working, offline-capable clone of the Casio FX-991EX ClassWiz scientific calculator, installable as a native app on phones, tablets, and desktops.

**Try it live:** https://1szco1.github.io/casio-ex991fx-classwiz-pwa/

## Features

- 552 functions: constants, unit conversion, solve, statistics, memory registers, history
- Natural Textbook display: stacked fractions, superscript powers, radical overbars, integral/summation bounds
- Exact result forms (π multiples, surds, fractions) with S⇔D toggle
- ∫, Σ, ∏, d/dx, log(a,b), Pol/Rec, prime factorization (FACT)
- TABLE mode: parametric Start/End/Step slots + rendered 2-column grid
- Real QR code (OPTN key) — scan to reopen the exact calculation or search it on Google
- Icon menu display (4×3 grid with mode badges and tinted icons)
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

## Design credits

Button/keyboard and display art techniques are adapted (with thanks) from these open-source projects:

- [jdan/98.css](https://github.com/jdan/98.css) (MIT) — the four-layer raised/sunken button bevel technique
- [ManzDev/twitch-casio-fx39](https://github.com/ManzDev/twitch-casio-fx39) (MIT) — cardboard light-source key borders, press-sink physics, glass-LCD glare band
- [mondalsurojit/Casio-fx-991ES_Plus](https://github.com/mondalsurojit/Casio-fx-991ES_Plus) — per-key vertical gradients + theme tokens, pressed inset shadows
- [YALDAKHOSHPEY/Calculator_pro](https://github.com/YALDAKHOSHPEY/Calculator_pro) — gradient/glow hover amplification and press-scale micro-interactions