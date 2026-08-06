# Goldy Car Detailing — Handover

Live: **https://goldycardetailing.com.au** · Repo: `Fiqwy/goldy-car-detailing` · Hosting: GitHub Pages (`main` branch, root), custom domain via `CNAME`.

Owner: **Gracie** — solo mobile car detailer, Gold Coast QLD. Phone **0427 798 045**. IG **@goldycardetailing**.

---

## The one rule

**`content.js` is the single source of truth.** Almost every word, price and photo path on the site lives in that one file, and `script.js` renders from it. To change copy, prices, photos or categories you edit `content.js` — you should rarely need to touch the HTML.

There is **no build step**. Edit, save, commit, push. GitHub Pages redeploys in a minute or two.

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

Opening `index.html` directly will fail — `script.js` is an ES module and browsers block modules on `file://`. Always use the local server.

---

## Files

| File | What it does |
|---|---|
| `content.js` | **All content and data.** Brand, hero, packages, prices, gallery + categories, showcases, condition-slider levels, FAQ, suburbs, JSON-LD. |
| `index.html` | Section shells only. Most inner markup is rendered by JS into mount points. |
| `script.js` | Renders everything from `content.js`; Lenis + GSAP motion layer; the work rails, condition slider, drawer, contact form. |
| `configurator.js` | The 2-step price builder (vehicle → goal → price). |
| `styles.css` | All styling, design tokens at the top. |
| `sw.js` | Self-destructing service worker. Evicts the old GoDaddy site's cached SW from returning visitors' phones. Safe to delete once traffic has cycled through. |
| `suburbs/surfers-paradise.html` | Standalone SEO landing page. Does **not** load `script.js`. |
| `assets/_source/` | Original scraped photos. **Not served** (GitHub Pages skips `_`-prefixed paths). Reference only. |

---

## Booking is SMS-only

There is **no email anywhere on this site**, by design — Gracie books by text. Every call-to-action opens the visitor's Messages app with a pre-written text to 0427 798 045.

The message body is assembled in three parts, **in this order**:

```
details (what they picked)  →  condition (optional)  →  fill-in blanks (ALWAYS LAST)
```

`data-sms-body` on a link holds the **details only**. `SMS_FILL_INS` in `script.js` holds the trailing `My name: , Suburb: , Vehicle: ` prompts. If you add a booking link, follow that pattern — anything appended *after* the blanks lands inside the customer's own answer and destroys the prompt. (That was a real bug; it corrupted every enquiry until it was fixed.)

The **"How rough is it?" condition slider** (section `#condition`) feeds every booking path. If the visitor sets it, their answer is inserted into whichever CTA they use, so Gracie sees what she's walking into before she quotes.

---

## Sections, in page order

Hero (autoplay video) · Trust strip · Maintenance plan · Why Goldy · Price builder · Packages · Build your own · Featured transformation · **Work rails** · Bikes · Vans/caravans/horsefloats · Behind the detail · Testimonials · About Gracie · Suburbs · FAQ · CTA strip · **How rough is it?** · Contact · Footer

**Work rails** (the gallery) are two horizontal rows: the top rail carries every work photo, the bottom rail is category cards that **filter** the top one. Categories come from `content.galleryCategories`; a category with zero photos is never rendered, so you can't advertise a type of work with nothing to show.

**Removed in v7** at the client's request: the "Process — five steps" section and the old vertical masonry gallery. Don't reintroduce them without asking.

---

## Non-negotiable standards

**Mobile smoothness is a hard gate.** Before any deploy, test at iPhone 390×844 and confirm: zero console errors, no horizontal overflow, hero video autoplaying, the WebGL hero shader **not** running (it's desktop-only on purpose), tap targets ≥44px, form inputs ≥16px so iOS doesn't zoom. Heavy motion — the shader, per-image scroll parallax, pinned sections — is gated off touch devices deliberately. Don't ungate it.

**Honesty rules.** No fake before/afters. No placeholder admissions ("reviews coming soon"). No unsubstantiated ratings. The condition slider is a *customer self-assessment tool* and must never be captioned as a before/after of Gracie's work — the code comments say so in three places; keep them.

**Australian English** in all copy (colour, optimise, behaviour).

---

## Still outstanding from Gracie

1. **Real per-service prices** for the Build-your-own menu — current numbers are estimates, marked `// CONFIRM`.
2. **Her real numbers** — the site says "100+ cars detailed", approximated from her IG post count. Needs confirming.
3. **Real testimonials** — 3-5 screenshots of IG/Google comments, with permission to use names.
4. **A proper founder bio** — the current one was written for her, not by her.
5. **ABN** for the footer.
6. **Condition surcharge (live 2026-08-05).** Gracie's ladder is in `content.condition.levels[].uplift`: Pretty clean +0%, Little dusty +15%, Lived in +20%, Dirty +25%, Don't judge me +35%. It is applied to **the package the visitor actually chose** (via `data-cond-base-price` on the slider mount), not to the level's own suggestion — otherwise picking "Bring it back" then dragging to the dirtiest level silently re-quoted them a Show-ready price. Estimates round to the nearest $5 and the "this isn't a quote" disclaimer stays on the page.
7. ~~**Replace the drawn grime with the real 5-stage photo.**~~ **DONE 2026-08-06.** The
   condition slider is now photographic. Source is a single wide image — **one Mazda 3
   interior, same angle, five vertical panels, progressively dirtier** (clean → light dust
   → dirt on the floor → heavy → mud everywhere) — kept at
   `assets/_source/condition-5panel.jpg` (1536×867, not served).

   Each panel is 307×867. That is far narrower than 3:4, so the panels were **re-cropped to
   3:5**, anchored low to keep the steering wheel, console, seat and footwell in frame —
   the parts that carry the dirt. Exported to `assets/condition/stage-1..5.jpg` at
   614×1024, ~65-98KB each (452KB total). To regenerate:
   ```bash
   for i in 0 1 2 3 4; do
     ffmpeg -nostdin -y -i assets/_source/condition-5panel.jpg \
       -vf "crop=307:512:$((307*i)):266,scale=614:1024:flags=lanczos" \
       -q:v 5 -frames:v 1 -update 1 "assets/condition/stage-$((i+1)).jpg"
   done
   ```
   `conditionStageHTML()` now emits `stage-1.jpg` as `.cond-base` plus frames 2-5 as
   `.cond-frame`, cross-faded by `--dirt` — each owns a quarter of the travel and is fully
   opaque before the next lifts, so grime builds with no gaps. The ten procedural layers
   (`.cond-floor`, `.cond-dust`, `.cond-grime`, `.cond-hair`, `.cond-grit`, `.cond-bits`,
   `.cond-trash`, `.cond-grain`, `.cond-vig`, `.cond-shine`), their four SVGs and the old
   `clean.jpg`/`dirty.jpg` are deleted. Net page weight +83KB.

   **Layout moved with it.** 3:5 frames are tall, so a half-width image column towered over
   the readout and left a dead patch of panel (visual 929px vs readout 392px). The slider,
   its label and its end labels now live in `.cond-readout` beside the level and price they
   drive; `.cond-visual` holds only the stage and its caption, capped at 372px and
   left-aligned, with the grid at `0.86fr 1.14fr` above 900px. Column gap is now 178px and
   the control sits next to its own readout. Mobile is one column and unaffected.

   **If you want a different crop**, it is one line: `.cond-stage`/`.cond-stage-sm`
   `aspect-ratio` plus the `crop=` height/offset above. 3:4 (`crop=307:409:…:343`) drops the
   steering wheel; the full panel (`crop=307:867:…:0`) keeps the whole dash but renders as a
   narrow column beside the copy on desktop.

   ⚠️ **Honesty note.** The five panels are one interior shown at five levels of grime — a
   reference scale, exactly as the procedural version was. `photoNote` says so. Do **not**
   recaption it as a before/after of Gracie's work, and do not present the panels as five
   separate jobs.
8. **A real before/after pair** (same vehicle, same angle, dirty then clean) would unlock a
   genuine before/after feature. The condition slider is a reference scale, not a matched pair.

Search `content.js` for `CONFIRM` to find every one of these in place.

---

## Deploying

```bash
git add <specific files>
git commit -m "..."
git push origin main
```

Then verify it is actually live (Pages caches):

```bash
curl -s "https://goldycardetailing.com.au/content.js?cb=$(date +%s)" | grep "<something you changed>"
```

---

## Gotchas worth knowing

- **Renderers run in sequence.** If one throws, every renderer after it silently dies and the page half-renders with no visible error. If a section goes blank, check the console for the *first* error.
- **Reveal animations are wired once at boot.** Anything rendered after that never animates — new render functions must be called inside the existing init block.
- **The horizontal rails need `overflow-x: auto` at every breakpoint.** They were once clipped on desktop with no scroll driver, which made the last cards unreachable.
- **Check for duplicate photos before shipping.** Several pairs of byte-identical files with different names once caused the same photo to render twice. `md5` the assets folder if a section looks repetitive.
- **Anything written into a `.section-head`** must target `p:not(.eyebrow)` — writing to the first `<p>` clobbers the gold eyebrow label.
