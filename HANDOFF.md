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

## What's placeholder vs real (UPDATED 2026-05-25 — v2 carousel walk + dedicated sections)

| Bucket | Status |
|---|---|
| Hero before / after | ✅ Real (ig-17 HSV Clubsport). Same file for both layers — CSS filter on `.hero-bg img` dims the before, `.hero-bg .after-layer img` brightens the after, so the clip-path reveal reads as a real transformation of the same car. |
| Hero "morph plates" (matte/satin/mirror) | SVG placeholders. Higgsfield image-to-image in Phase 2. |
| Gallery (~25 tiles, HD 1440px+) | ✅ All real. Daily drivers / Special builds / Sale-ready rows. Includes carousel-slide bonus shots (Blue Audi Q7, Discovery rear, Porsche Cayenne, Ranger Raptor golden hour, Red R34 Skyline, R32 GTR, '59 Chevy Apache warehouse, HSV Clubsport, XR6 golden hour, green Jeep, Santa Fe bush, red Commodore SV, Porsche Macan). |
| **Bikes dedicated section** | ✅ NEW. 3 real photos — Harley Road Glide (front, featured), Harley (rear), Suzuki VZ1500. Lives at `#bikes`. |
| **Caravans / Vans / Horsefloats section** | ✅ NEW. 6 real photos — Ram + horsefloat (featured), Hiace Silver Package, Hiace interior cleaned, dog van, green Jeep 7-hr, Hiace wheel macro. Lives at `#caravans`. |
| **Behind the Detail strip** | ✅ NEW. 4 real photos — Goldy branded number plate, business-card handover, SQ7 wheel + red calipers, BMW X3 interior. Shows craft + brand. Lives at `#behind`. |
| Process (5 step images) | ✅ All real: work rig → Suzuki mid-wash → Ford XR6 transformation → Harley protected → Porsche immaculate. |
| Founder portrait | ✅ Real (ig-02 "I Know Ball" — Gracie's hands/feet on a steering wheel + footwell shot). |
| Phone | ✅ Real (0427 798 045 — pulled verbatim from her captions). |
| Email / ABN | CONFIRM — `goldycardetailing@gmail.com` guessed. |
| Packages | ✅ Real names: Silver / Gold 🥇 / Diamond 💎 (matched verbatim to her IG captions). Prices still need her sign-off. |
| Testimonials | One honest placeholder badge — Phase-2 swap with real IG comment screenshots or Google reviews. |
| OG image | ✅ Real (ig-17). |
| Suburb hero | ✅ Real (uses hero/after.jpg). |

## v2 carousel-walk gains (2026-05-25 PM)
Walked all 27 known post URLs through Playwright. **Findings:**
- Original 27 grid scrape = 311–1080px thumbnails. Walking individual posts → **HD originals (1440–3072px)**. All 25 in-gallery photos upgraded.
- 21 additional **carousel slides** unlocked (slides 2-5 of multi-image posts). Used to populate the new Bikes, Caravans, and Behind-the-Detail sections.
- Key finds: real Harley Road Glide front-on (`new-05`), real **Ram + white horsefloat** (`new-03`), real **Goldy-branded number plate macro** (`new-21`), SsangYong handover with **business cards on steering wheel wrap** (`new-10`), Hiace interior cleaned + wheel macro (`new-16`, `new-07`).
- **No Higgsfield needed** — every photo on the site is now Gracie's real work.
- IG's logged-out "More posts from goldycardetailing" carousel didn't expose any of her #28-84 posts. To pull the remaining 57 (which include more Motorhomes / Horsefloats content from her highlights), Nicholas runs `assets/_source/ig/SCRAPE-SNIPPET.md` in his logged-in Chrome — 60 seconds, drops a JSON file, I process it.

## What we learned from the IG scrape
- 84 posts · 200 followers · 14 following
- **Female-owned** (#womeninbusiness #womeninmalefields)
- Story highlights: B&A (before/after), Reviews, Insights, Horsefloats, Motorhomes
- **Maintenance Plan** = recurring revenue offer (fortnightly / monthly / 5-weekly). Limited spots. Porsche on her 5-week plan, Skyline on fortnightly, 1959 Chevy on maintenance list.
- Real price anchor: **$250** for a Holden Commodore full interior reset (seats/carpets shampooed, plastics cleaned + coated, leather conditioned, vacuum, windows like new, foamy wash)
- Voice: "We don't gate keep around here", educational posts (rain damage care)
- Service breadth: cars, 4WDs, vans, motorbikes (Harley + Suzuki VZ1500), motorhomes, caravans, horsefloats, dog-grooming vans
- Vehicles in portfolio: Porsche ×3, BMW X3, Audi SQ7 ×2, Range Rover/Discovery, R34 Skyline ×2, Ford XR6, Ford Raptor, GMC Denali, HSV Clubsport, 1959 Chevy Apache, Hyundai Santa Fe, SsangYong Musso, Holden Commodore, Suzuki VZ1500, Harley-Davidson, Toyota Hiace Van, gooseneck towing rig

## Open with Nicholas before show-and-tell
1. Email — `goldycardetailing@gmail.com` guess in `content.js`. Confirm or replace.
2. ABN — empty. Add if she wants it in the footer.
3. Pricing floors — Silver $189 / Gold $329 / Diamond $549 / Maintenance Plan $129. Calibrated against her real $250 Commodore reference. Confirm.
4. Founder bio — written from public signals. Refine with real story.
5. Real testimonials — pull from her IG comment screenshots or Google reviews (with permission).
6. Maintenance Plan UI — currently described in copy + FAQ. Wire a real recurring booking option in Phase 2.

## Raw scrape artifacts
- `assets/_source/ig/ig-01.jpg` through `ig-27.jpg` — all originals from the public profile
- `assets/_source/ig/_provenance.json` — full caption + dimensions + sourceUrlBase for every photo
- `assets/_source/ig/SCRAPE-SNIPPET.md` — DevTools snippet for getting all 84 posts via your logged-in Chrome (Phase 2)
- `scripts/import-ig.py` — companion script that processes the snippet's JSON dump

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
