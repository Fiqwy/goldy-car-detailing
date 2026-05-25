# Goldy Car Detailing — HANDOFF

Demo site for Gracie (Nicholas's sister-in-law). Built 2026-05-25 to beat control-detailing as the new personal quality floor. Stack: vanilla HTML + CSS + JS + GSAP/ScrollTrigger + Lenis. Hand-rolled WebGL hero shader (no three.js). No build step.

## Run it

```
cd ~/claude\ code\ projects/goldy-car-detailing/
python3 -m http.server 8000
# open http://localhost:8000
```

Plain `open index.html` will fail — `script.js` is an ES module and the browser blocks module loading on `file://`. Always use the local server.

## File map

| File | What it does |
|---|---|
| `index.html` | Markup scaffold. Almost every visible string is rendered from `content.js`. |
| `content.js` | **Single source of truth.** Brand, packages, pricing, copy, gallery slots, suburbs, schema. Re-skin the site by editing this one file. |
| `styles.css` | Tokens, components, responsive (1024 / 640), reduced-motion bailout. |
| `script.js` | Lenis bridge, IO reveals, cursor glow, magnetic CTAs, hero clip-path scrub, WebGL atmosphere shader, package morph, process timeline pin, content renderers. |
| `configurator.js` | 2-step state machine + price calc + mailto build. |
| `suburbs/surfers-paradise.html` | One built suburb page (template proven). Others stubbed in `content.js`. |
| `assets/_source.json` | Provenance for every visual asset. Marks placeholder vs real vs Higgsfield. |
| `assets/hero/*.svg` | Placeholder hero + 3 morph plates. **Swap to real .webp once IG pull is done.** |

## What's placeholder vs real

| Bucket | Status |
|---|---|
| Hero before / after | SVG gradient placeholders. Swap to real photos from Gracie's IG ASAP. |
| Hero "morph plates" (matte/satin/mirror) | SVG placeholders. Higgsfield image-to-image when ready. |
| Gallery (15 tiles) | All paths reference `.webp` that don't exist yet. `onerror` handler hides broken tiles. Drop real files in `assets/gallery/`. |
| Process (5 step images) | Same as gallery — paths reference `.webp` not on disk yet. |
| Founder portrait | Placeholder block in `about-portrait` until real photo dropped at `assets/founder/gracie.webp`. |
| Phone / email / ABN | Placeholders — every `// CONFIRM` in `content.js` needs Gracie sign-off. |
| Testimonials | One honest "placeholder" badge — replaces with real quotes when Gracie shares them. |

## Decisions made (matches the planning doc)

- **Booking is mailto-only for the demo.** Real n8n SMS webhook is Phase 2 once Gracie's phone is confirmed.
- **GSAP-only motion**, no CSS `animation-timeline: view()` — IG in-app browser parity matters more than the marginal upside.
- **Process timeline pinned only ≥1025px**, vertical stack on mobile (pin+scrub broken on iOS Safari with Lenis).
- **Three.js swapped for raw WebGL fragment shader** (~5KB vs ~150KB lib). Same dust + light-leak effect, no critical-path dependency.
- **Google Fonts via `<link>`** for build speed; self-hosted woff2 is a Phase 2 perf win (~100ms first paint).
- **1 suburb page only** for v1 (Surfers Paradise). 5+ pages once Gracie's confirmed.
- **Higgsfield (never nano-banana)** for any AI-generated image fill, capped at ~12 assets, image-to-image seeded with her real IG cars.

## Decisions outstanding for Nicholas / Gracie

1. **Confirm @goldycardetailing is Gracie's IG** (MEDIUM-confidence match at scrape time).
2. **Phone + email** to swap into `content.js` `brand.phone`, `brand.email`, `brand.phoneHref`, `booking.mailtoTarget`, `booking.fallbackPhone`.
3. **Pricing floors** — currently Bronze $189 / Silver $329 / Gold $549 and `sizeMultipliers` 1.0–2.0. Needs her sign-off before send.
4. **Motorhome** — keep as a size multiplier (current) or break out as own tier?
5. **Founder bio** — Nicholas to write 60 real words. Placeholder bio in `content.founder.bio`.
6. **Testimonials policy** — pull from IG comments (grey area; recommend asking permission) or wait for Google reviews?
7. **Brand colour direction** — currently champagne `#E0B872`. Override via `content.theme` if her IG aesthetic points elsewhere.

## How to re-skin once real content arrives

1. **Photos:** drop real files into `assets/hero/`, `assets/gallery/`, `assets/process/`, `assets/founder/`. Use the existing filenames or update paths in `content.js`. Convert with `sips -s format webp` for `.webp` versions.
2. **Copy:** edit `content.js` — every text string lives there. No HTML edits needed.
3. **Prices:** `packages[].priceFrom` and `sizeMultipliers[].multiplier`. Configurator recalculates instantly.
4. **Suburbs:** flip `suburbs[].built: true` once you've created the matching `suburbs/<slug>.html` (copy `surfers-paradise.html` as the template).

## Verification checklist

- [ ] Lighthouse Performance ≥ 92, A11y ≥ 95, SEO ≥ 100 (mobile)
- [ ] Open at 375 / 768 / 1280 / 1920 — every breakpoint clean
- [ ] iOS Safari real device — process section stacks (not pinned), no broken scroll
- [ ] IG in-app browser (open the GH Pages URL from an IG DM) — animations and shader render
- [ ] macOS Reduce Motion ON — everything static and legible
- [ ] Configurator: every (5 vehicles × 4 goals = 20) combo produces a coherent price + mailto opens correctly
- [ ] Schema: paste into validator.schema.org — zero errors
- [ ] OG image renders in iMessage + WhatsApp preview (after real `og-image.jpg` is generated)

## Phase 2 (post-demo, post-Gracie-signoff)

- Real n8n webhook (reuse Speed-to-Lead template) → SMS + email to Gracie, autoreply to customer
- Calendly embed or real calendar sync replaces "Next free slot" static placeholder
- Google Business Profile setup + real reviews integration (replace placeholder testimonials)
- Expand to 5 built suburb pages with unique local copy
- Self-host Manrope + Inter woff2 (~100ms perf win)
- Domain registration (`goldycardetailing.com.au`) + Cloudflare in front of GitHub Pages
- Higgsfield gen pass for cinematic hero plates + lifestyle category fill (after Gracie confirms aesthetic direction)
