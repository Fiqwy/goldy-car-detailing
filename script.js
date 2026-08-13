// ============================================================
// GOLDY CAR DETAILING — APP SCRIPT
// Renders from content.js, wires Lenis + GSAP, motion layer.
// ============================================================
import { content } from './content.js';
import { initConfigurator, currencyAU } from './configurator.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NO_HOVER = matchMedia('(hover: none)').matches;
document.documentElement.classList.add('has-js');

// Set by the condition slider, read by every booking path. Stays null until the
// visitor actually moves it — a default we picked for them isn't their answer.
let conditionPick = null;

// Every booking link carries the visitor's condition pick so Gracie can see what
// she's walking into before she quotes. Any anchor with a data-sms-body gets its
// href rebuilt from that base plus the current condition.
//
// ORDER MATTERS. Every message ends with blank prompts the visitor types into,
// so the body is composed in three parts:
//   details  (what they picked)  →  condition  (optional)  →  fill-ins  (last)
// data-sms-body therefore holds the DETAILS ONLY — never the trailing blanks.
// Anything appended after the fill-ins lands inside the visitor's own answer
// ("Vehicle: Condition: ...") and destroys the prompt.
const SMS_FILL_INS = 'My name: , Suburb: , Vehicle: ';

function conditionSuffix() {
  if (!conditionPick) return '';
  // Carry the surcharge the visitor was shown, so the number Gracie reads in the
  // text is the same number that was on their screen. Level 1 has no uplift.
  const s = conditionPick.upliftPct ? ` +${conditionPick.upliftPct}% for condition.` : '';
  return `Condition: ${conditionPick.label}.${s}`;
}
// A link can override the blanks via data-sms-fill when it already knows some of
// them (the price builder asks the vehicle up front, so it never re-asks).
function buildSmsHref(details, fillIns = SMS_FILL_INS) {
  const lead = [String(details || '').trim(), conditionSuffix()].filter(Boolean).join(' ');
  return `${content.booking.smsHref}?&body=${encodeURIComponent(lead ? `${lead} ${fillIns}` : fillIns)}`;
}
function refreshSmsLinks() {
  document.querySelectorAll('[data-sms-body]').forEach(a => {
    a.href = buildSmsHref(a.dataset.smsBody, a.dataset.smsFill || SMS_FILL_INS);
  });
}
// A compact condition picker that rides along with EVERY booking flow, so
// Gracie always learns how dirty the car is no matter which package or path the
// visitor takes. Any `[data-cond-chips]` mount gets one; they all drive the same
// `conditionPick` and stay in sync with the big slider in #condition.
// ---- The condition slider, as a reusable component -------------------------
// The full version lives in #condition; compact copies ride along inside every
// booking flow (price-builder result, build-your-own, maintenance) so the
// visitor can show the state of their car right where they're quoting, and
// Gracie always learns it. `--dirt` is written to the ROOT element, not to one
// panel, so every stage on the page animates from a single source of truth and
// the copies can never disagree with each other.
const CONDITION_MAX = 100;

function conditionBand(v) {
  const L = content.condition.levels;
  return Math.min(L.length - 1, Math.floor(v / (CONDITION_MAX / L.length)));
}
function conditionValueFor(i) {
  return Math.round((i + 0.5) * (CONDITION_MAX / content.condition.levels.length));
}
// Five photographic frames of the SAME interior at the same angle, each one
// dirtier than the last. --dirt cross-fades between them (see .cond-frame in
// styles.css), which replaced the old drawn-on grime stack. Frames 2-5 are
// decorative — the base image carries the alt text for the whole figure.
function conditionStageHTML(c) {
  const frames = [2, 3, 4, 5].map(n =>
    `<img class="cond-frame" data-frame="${n}" src="assets/condition/stage-${n}.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">`
  ).join('\n    ');
  return `
    <img class="cond-base" src="${c.photoClean.src}" alt="${c.photoClean.alt}" loading="lazy" decoding="async">
    ${frames}`;
}

// Single entry point. Everything that changes the condition calls this.
function setCondition(v, touched = true) {
  const c = content.condition;
  const t = Math.min(1, Math.max(0, v / CONDITION_MAX));
  const i = conditionBand(v);
  const l = c.levels[i];
  const p = content.packages.find(x => x.id === l.packageId);

  // Root-level so every stage (full + compact) animates off the same value.
  document.documentElement.style.setProperty('--dirt', t.toFixed(4));
  document.documentElement.style.setProperty('--wipe', t.toFixed(4));

  document.querySelectorAll('.cond-range').forEach(r => {
    if (+r.value !== v) r.value = v;
    r.setAttribute('aria-valuetext', `${l.label} — ${p.tier}`);
  });
  // Gracie's condition surcharge. Level 1 is the advertised package price, so
  // its uplift is 0. Rounded to the nearest $5 — nobody quotes to the cent.
  const uplift = l.uplift || 0;
  const estimate = Math.round((p.priceFrom * (1 + uplift)) / 5) * 5;
  const upliftPct = Math.round(uplift * 100);

  document.querySelectorAll('[data-cond-level-out]').forEach(e => { e.textContent = l.label; });
  document.querySelectorAll('[data-cond-tier-out]').forEach(e => {
    const ctx = e.closest('[data-cond-base-price]');
    const baseP = ctx ? Number(ctx.dataset.condBasePrice) : p.priceFrom;
    const tier  = ctx ? (ctx.dataset.condBaseTier || p.tier) : p.tier;
    const est   = Math.round((baseP * (1 + uplift)) / 5) * 5;
    e.textContent = uplift
      ? `${tier} · from ${currencyAU(est)} (+${upliftPct}% ${content.condition.upliftLabel})`
      : `${tier} · from ${currencyAU(est)}`;
  });

  conditionPick = touched ? { id: l.id, label: l.label, tier: p.tier, upliftPct, estimate } : null;
  syncConditionChip();
  refreshSmsLinks();
  // estimate/upliftPct ride along so every readout quotes ONE number.
  document.dispatchEvent(new CustomEvent('goldy:condition', { detail: { level: l, pkg: p, estimate, upliftPct } }));
  return { level: l, pkg: p };
}

// Compact animated slider for the booking flows.
function renderConditionInline(mount) {
  const c = content.condition;
  if (!mount || !c || !c.enabled) return;
  const start = conditionValueFor(c.defaultIndex ?? 2);
  mount.innerHTML = `
    <div class="cond-inline">
      <figure class="cond-stage cond-stage-sm">${conditionStageHTML(c)}</figure>
      <div class="cond-inline-body">
        <label class="cond-inline-label" for="${mount.id || 'ci'}-r">How dirty is it? <span>drag it — Gracie brings the right gear</span></label>
        <input class="cond-range" id="${mount.id || 'ci'}-r" type="range" min="0" max="${CONDITION_MAX}" step="1" value="${start}">
        <p class="cond-inline-read"><strong data-cond-level-out></strong> <span data-cond-tier-out></span></p>
      </div>
    </div>`;
}
function syncConditionChips() {
  document.querySelectorAll('[data-cond-chips]').forEach(m => { if (!m.children.length) renderConditionInline(m); });
}

// One delegated handler drives every slider on the page, however late it renders.
document.addEventListener('input', e => {
  if (e.target.classList && e.target.classList.contains('cond-range')) setCondition(+e.target.value, true);
});
// Track the finger instantly while dragging; ease only for taps and keyboard.
['pointerdown', 'touchstart'].forEach(ev => document.addEventListener(ev, e => {
  if (e.target.classList && e.target.classList.contains('cond-range')) document.documentElement.classList.add('cond-dragging');
}, { passive: true }));
['pointerup', 'pointercancel', 'touchend'].forEach(ev => document.addEventListener(ev, () => {
  document.documentElement.classList.remove('cond-dragging');
}, { passive: true }));

// configurator.js re-renders its result on demand and fires this when it does.
document.addEventListener('goldy:sms-refresh', () => {
  syncConditionChips();
  // A freshly-rendered copy must adopt the current position, not its default.
  const any = document.querySelector('.cond-range');
  if (any) setCondition(+any.value, !!conditionPick);
  refreshSmsLinks();
});

// ============================================================
// 0. CONTENT RENDER — populate everything from content.js
// ============================================================

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function renderHero() {
  const h = content.hero;
  $('#heroBefore').src = h.beforeAfter.before;
  $('#heroBefore').alt = `${h.beforeAfter.label} — before`;
  $('#heroAfter').src = h.beforeAfter.after;
  $('#heroAfter').alt = `${h.beforeAfter.label} — after`;

  $('#heroEyebrow span:last-child').textContent = h.eyebrow;

  const title = $('#heroTitle');
  // Source the two lines from the editable scalars when present (Content Studio),
  // else fall back to the headlineLines array. Each line lands in a stable,
  // selectable wrapper (.hero-line-1 / .hero-line-2) so the editor can target it.
  // Appearance is unchanged: the .line class and the 2nd-line gold-grad stay put.
  const headlineLines = [
    h.headlineLine1 != null ? h.headlineLine1 : h.headlineLines[0],
    h.headlineLine2 != null ? h.headlineLine2 : h.headlineLines[1]
  ];
  title.innerHTML = headlineLines
    .map((line, i) =>
      `<span class="line hero-line-${i + 1}${i === 1 ? ' gold-grad' : ''}">${splitWords(line)}</span>`
    ).join('');

  $('#heroSub').textContent = h.sub;

  $('#heroCtas').innerHTML = `
    <div class="hero-cta-row">
      <a href="${h.primaryCta.href}" class="btn btn-primary">${h.primaryCta.label} <span class="arrow">→</span></a>
      <a href="${h.secondaryCta.href}" class="btn btn-ghost" data-sms-body="Hi Gracie! I'd like to book a detail.">${h.secondaryCta.label}</a>
    </div>
    <a href="${h.maintenanceCta.href}" class="btn btn-ghost btn-maint">${h.maintenanceCta.label} <span class="arrow">→</span></a>
  `;

  $('#heroBeforeLabel').textContent = h.beforeAfter.label;
}

function renderTrust() {
  $('#trustRow').innerHTML = content.trustStrip.map(t => {
    const numeric = !isNaN(parseFloat(t.value)) && isFinite(t.value);
    const countAttr = numeric ? `data-count-to="${parseFloat(t.value)}"` : '';
    return `
    <div class="trust-cell" data-reveal>
      <div class="trust-num" ${countAttr}>${t.value}${t.suffix ? `<span class="suffix">${t.suffix}</span>` : ''}</div>
      <div class="trust-label">${t.label}</div>
    </div>`;
  }).join('');
}

function renderMaintenance() {
  const m = content.maintenancePlan;
  if (!m || !m.enabled) return;
  const mount = $('#maintenanceMount');
  if (!mount) return;

  const DEFAULT = 'Fortnightly';
  const chips = m.cadenceOptions.map(c =>
    `<button type="button" class="cadence-chip${c === DEFAULT ? ' is-selected' : ''}" data-cadence="${c}" aria-pressed="${c === DEFAULT}">${c}</button>`
  ).join('');

  mount.innerHTML = `
    <div class="maintenance-copy" data-reveal>
      <p class="eyebrow"><span class="dot"></span> ${m.eyebrow}</p>
      <h2 class="split maintenance-title">${m.title}</h2>
      <p class="maintenance-blurb">${m.blurb}</p>
    </div>
    <div class="maintenance-pick" data-reveal>
      <div class="cadence-label">How often?</div>
      <div class="cadence-chips" id="cadenceChips">${chips}</div>
      <div data-cond-chips></div>
      <div class="maintenance-ctas">
        <a href="#" class="btn btn-primary" id="maintBook">${m.bookCta.label} <span class="arrow">→</span></a>
        <a href="#" class="btn btn-ghost" id="maintEnquire">${m.enquireCta.label}</a>
      </div>
      <p class="maintenance-micro">${m.microcopy}</p>
    </div>
  `;

  let cadence = DEFAULT;
  const bookEl = $('#maintBook');
  const enquireEl = $('#maintEnquire');

  function syncCtas() {
    const body = intro => `Hi Gracie! ${intro} Preferred cadence: ${cadence}.`;
    bookEl.dataset.smsBody = body("I'm a returning client and I'd like to book my next clean.");
    enquireEl.dataset.smsBody = body("I'd like to enquire about joining your maintenance plan.");
    refreshSmsLinks();
  }
  syncCtas();

  $('#cadenceChips').addEventListener('click', e => {
    const btn = e.target.closest('[data-cadence]');
    if (!btn) return;
    cadence = btn.dataset.cadence;
    $$('.cadence-chip', mount).forEach(c => {
      const on = c === btn;
      c.classList.toggle('is-selected', on);
      c.setAttribute('aria-pressed', String(on));
    });
    syncCtas();
  });
}

function initHeroVideo() {
  if (REDUCED || !content.hero.video) return;   // reduced motion → static poster (after.jpg)
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  // The video IS the hero background — autoplays on landing, covers the stills.
  const v = document.createElement('video');
  v.className = 'hero-video is-ready';
  v.muted = true;
  v.defaultMuted = true;
  v.loop = true;
  v.autoplay = true;
  v.playsInline = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  v.setAttribute('autoplay', '');
  v.setAttribute('loop', '');
  v.setAttribute('preload', 'auto');
  v.poster = content.hero.beforeAfter.after;   // after.jpg = first paint, no black flash
  v.src = content.hero.video;
  bg.appendChild(v);
  const p = v.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

function renderPackages() {
  // Plates that morph behind
  const stack = $('#pkgStack');
  content.packages.forEach((p, i) => {
    const plate = document.createElement('div');
    plate.className = 'pkg-plate';
    plate.style.backgroundImage = `url(${p.finishPlate})`;
    plate.dataset.plate = p.id;
    if (i === 1) plate.classList.add('is-active');
    stack.prepend(plate);
  });

  $('#pkgGrid').innerHTML = content.packages.map(p => `
    <article class="pkg ${p.popular ? 'is-popular' : ''}" data-pkg="${p.id}" data-reveal>
      ${p.popular ? `<span class="pkg-badge">Most picked</span>` : ''}
      <h3 class="pkg-tier">${p.tier}</h3>
      <p class="pkg-summary">${p.summary}</p>
      <div class="pkg-price">
        <span class="pkg-price-num">${currencyAU(p.priceFrom)}</span>
        <small>from</small>
      </div>
      ${p.turnaround ? `<div class="pkg-turnaround">${p.turnaround}</div>` : ''}
      <div class="pkg-divider"></div>
      <ul class="pkg-includes">${p.includes.slice(0, 5).map(i => `<li>${i}</li>`).join('')}</ul>
      ${p.includes.length > 5 ? `<details class="pkg-more"><summary>See full list <span class="pkg-more-count">+${p.includes.length - 5}</span></summary><ul class="pkg-includes">${p.includes.slice(5).map(i => `<li>${i}</li>`).join('')}</ul></details>` : ''}
      <div class="pkg-cta"><a href="${p.custom ? '#build-your-own' : '#configurator'}" class="btn btn-ghost">${p.custom ? 'Build your own price' : 'Get my price'} <span class="arrow">→</span></a></div>
    </article>
  `).join('');
}

function renderCustomBuilder() {
  const services = content.customServices;
  const mount = $('#buildMount');
  if (!mount || !services) return;

  const basePkg = content.packages.find(p => p.id === 'silver'); // the Tidy up base
  const BASE_PRICE = basePkg ? basePkg.priceFrom : 150;
  const BASE_NAME = basePkg ? basePkg.tier : 'Tidy up';
  const SHOWREADY = 550;

  const baseServices = services.filter(s => s.base);
  const extras = services.filter(s => !s.base);
  const extraGroups = [];
  extras.forEach(s => { if (!extraGroups.includes(s.group)) extraGroups.push(s.group); });
  const selected = new Set(); // extras only — the base is always included

  const baseList = baseServices.map(s => `<li>${s.name}</li>`).join('');
  const extrasHtml = extraGroups.map(g => `
    <div class="build-group">
      <div class="cfg-svc-group-title">${g}</div>
      ${extras.filter(s => s.group === g).map(s => `
        <button type="button" class="cfg-svc" data-svc="${s.id}" aria-pressed="false">
          <span class="cfg-svc-check" aria-hidden="true"></span>
          <span class="cfg-svc-name">${s.name}</span>
          <span class="cfg-svc-price">+${currencyAU(s.price)}</span>
        </button>`).join('')}
    </div>`).join('');

  mount.innerHTML = `
    <div class="section-head">
      <p class="eyebrow"><span class="dot"></span> Build your own</p>
      <h2 class="split">Not sure a package fits? Build it yourself.</h2>
      <p>Start with the ${BASE_NAME} base, then add anything you want. Watch it add up. Packages usually work out cheaper.</p>
    </div>
    <div class="build-panel" data-reveal>
      <div class="build-base">
        <div class="build-base-head">
          <span class="build-base-title">${BASE_NAME} base <span class="build-base-tag">Included</span></span>
          <span class="build-base-price">${currencyAU(BASE_PRICE)}</span>
        </div>
        <details class="cfg-includes-accordion build-base-acc">
          <summary>What's in the base</summary>
          <ul class="cfg-includes">${baseList}</ul>
        </details>
      </div>
      <div class="build-add-label">Add to it</div>
      <div class="build-menu">${extrasHtml}</div>
      <div class="build-summary">
        <div class="build-total">
          <span class="build-total-label">Your build</span>
          <span class="build-total-num" id="buildTotal">${currencyAU(BASE_PRICE)}</span>
        </div>
        <p class="cfg-compare" id="buildCompare"></p>
        <div class="hero-ctas build-ctas">
          <a href="#" class="btn btn-primary" id="buildBook">Book this build <span class="arrow">→</span></a>
          <a href="tel:+61427798045" class="btn btn-ghost">Call or text · 0427 798 045</a>
        </div>
        <div data-cond-chips id="buildCond"></div>
        <p class="cfg-foot">Prices are per service. Gracie confirms the final total for your vehicle.</p>
      </div>
    </div>
  `;

  const totalEl = $('#buildTotal');
  const cmpEl = $('#buildCompare');
  const bookEl = $('#buildBook');

  function total() {
    let t = BASE_PRICE;
    selected.forEach(id => { const s = extras.find(x => x.id === id); if (s) t += s.price; });
    return t;
  }
  function buildSmsBody() {
    const picked = [...selected].map(id => {
      const s = extras.find(x => x.id === id);
      return s ? `${s.name} (+${currencyAU(s.price)})` : null;
    }).filter(Boolean);
    return `Hi Gracie! Custom detail from the site. Base: ${BASE_NAME} (${currencyAU(BASE_PRICE)}). ` +
      `Added: ${picked.length ? picked.join(', ') : 'nothing extra yet'}. ` +
      `Total: ${currencyAU(total())}.`;
  }
  function sync() {
    const t = total();
    totalEl.textContent = currencyAU(t);
    bookEl.dataset.smsBody = buildSmsBody();
    const cm = $('#buildCond');
    if (cm) { cm.dataset.condBasePrice = String(t); cm.dataset.condBaseTier = 'Your build'; }
    refreshSmsLinks();
    let msg;
    if (t <= BASE_PRICE) msg = `That's the ${BASE_NAME} package. Add anything below and watch it climb.`;
    else if (t <= SHOWREADY) msg = `Building it up service by service. Show-ready does the lot for ${currencyAU(SHOWREADY)}, so a package usually works out cheaper.`;
    else msg = `That's ${currencyAU(t - SHOWREADY)} more than the Show-ready package (${currencyAU(SHOWREADY)}), which includes the lot. The package is the better deal.`;
    cmpEl.textContent = msg;
  }
  sync();

  mount.querySelector('.build-menu').addEventListener('click', e => {
    const btn = e.target.closest('[data-svc]');
    if (!btn) return;
    const id = btn.dataset.svc;
    if (selected.has(id)) { selected.delete(id); btn.classList.remove('is-selected'); btn.setAttribute('aria-pressed', 'false'); }
    else { selected.add(id); btn.classList.add('is-selected'); btn.setAttribute('aria-pressed', 'true'); }
    sync();
  });
}

// Rail 1 = every work photo. Rail 2 = category cards that filter Rail 1.
// Filtering toggles a class rather than re-rendering: reveal animations are
// wired once at boot, so re-injected nodes would never animate, and a class
// toggle is far cheaper than re-decoding 30 images on every tap.
function renderGallery() {
  const track  = $('#workTrack');
  const rail   = $('#workRail');
  const fTrack = $('#filterTrack');
  if (!track || !rail || !fTrack) return;

  const hint = $('#railHint');
  if (hint) hint.textContent = (content.gallerySection || {}).filterHint || '';

  track.innerHTML = content.gallery.map((g, i) => {
    const cat = content.galleryCategories.find(c => c.id === g.category);
    return `
      <figure class="work-card" data-cat="${g.category}">
        <img src="${g.src}" alt="${g.alt}" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async"
             onerror="this.parentElement.style.background='var(--bg-elev)';this.remove()">
        ${cat ? `<figcaption class="work-card-tag">${cat.label}</figcaption>` : ''}
      </figure>`;
  }).join('');

  // Only render a filter card for a category that actually has photos —
  // we never advertise a type of work we can't show.
  const counts = content.gallery.reduce((m, g) => (m[g.category] = (m[g.category] || 0) + 1, m), {});
  const cats = content.galleryCategories.filter(c => c.id === 'all' || counts[c.id] > 0);

  fTrack.innerHTML = cats.map((c, i) => {
    const lead = c.lead || (content.gallery.find(g => g.category === c.id) || {}).src;
    const n = c.id === 'all' ? content.gallery.length : counts[c.id];
    return `
      <button type="button" class="filter-card${i === 0 ? ' is-selected' : ''}"
              data-filter="${c.id}" aria-pressed="${i === 0}">
        ${lead ? `<img src="${lead}" alt="" loading="lazy" decoding="async" onerror="this.remove()">` : ''}
        <span class="filter-card-meta">
          <span class="filter-card-label">${c.label}</span>
          <span class="filter-card-count">${n}</span>
        </span>
      </button>`;
  }).join('');

  const cards  = $$('.work-card', track);
  const btns   = $$('.filter-card', fTrack);
  const status = $('#workStatus');
  let active = 'all';

  function applyFilter(id) {
    if (id === active) return;
    active = id;
    const cat = content.galleryCategories.find(c => c.id === id);

    let shown = 0;
    cards.forEach(card => {
      const on = id === 'all' || card.dataset.cat === id;
      card.classList.toggle('is-filtered', !on);
      if (on) shown++;
    });
    btns.forEach(b => {
      const on = b.dataset.filter === id;
      b.classList.toggle('is-selected', on);
      b.setAttribute('aria-pressed', String(on));
    });

    // Filtering changes scrollWidth — put the visitor back at the start.
    rail.scrollTo({ left: 0, behavior: REDUCED ? 'auto' : 'smooth' });

    if (status) {
      status.textContent = `Showing ${shown} of ${content.gallery.length} photos` +
        (id === 'all' ? '.' : ` — ${cat ? cat.label : id}.`);
    }
    // One composited animation on the track, never one per card.
    if (!REDUCED) {
      track.classList.remove('is-swapping');
      void track.offsetWidth;
      track.classList.add('is-swapping');
    }
  }

  fTrack.addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (btn) applyFilter(btn.dataset.filter);
  });

  // Desktop-only arrows + click-drag. Touch uses native momentum scrolling.
  if (!NO_HOVER) {
    const prev = $('#workPrev'), next = $('#workNext');
    if (prev && next) {
      const step = () => Math.max(240, rail.clientWidth * 0.8);
      const syncNav = () => {
        const max = rail.scrollWidth - rail.clientWidth - 2;
        prev.disabled = rail.scrollLeft <= 2;
        next.disabled = rail.scrollLeft >= max;
      };
      prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
      next.addEventListener('click', () => rail.scrollBy({ left:  step(), behavior: 'smooth' }));
      let navT;
      rail.addEventListener('scroll', () => {
        if (navT) return;
        navT = requestAnimationFrame(() => { navT = null; syncNav(); });
      }, { passive: true });
      syncNav();
    }

    let down = false, startX = 0, startLeft = 0;
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      down = true; startX = e.clientX; startLeft = rail.scrollLeft;
      rail.classList.add('is-grabbing');
    });
    rail.addEventListener('pointermove', e => {
      if (!down) return;
      e.preventDefault();
      rail.scrollLeft = startLeft - (e.clientX - startX);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
      rail.addEventListener(ev, () => { down = false; rail.classList.remove('is-grabbing'); }));
  }
}

// Where a review was left, in words. Anything unrecognised falls back to no label
// rather than printing the raw key at a customer.
const TMT_SOURCES = {
  google: 'Google review',
  facebook: 'Facebook review',
  instagram: 'Instagram',
  direct: 'Sent to Gracie directly'
};

// "2026-03-14" -> "March 2026". A day-of-the-month on a review reads like a receipt,
// and anything we can't parse is simply left out.
function tmtWhen(iso) {
  const m = /^(\d{4})-(\d{2})/.exec(String(iso || ''));
  if (!m) return '';
  const d = new Date(Number(m[1]), Number(m[2]) - 1, 1);
  return isNaN(d) ? '' : d.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
}

// Real reviews Gracie has pasted in through her content portal. Built with
// createElement + textContent rather than an innerHTML template like the proof cards
// below it: this is the one block on the site whose words come from outside this repo,
// and text that can never be parsed as markup is a stronger guarantee than a server
// that promises to have stripped it.
function tmtQuoteCard(q) {
  const card = document.createElement('article');
  card.className = 'tmt tmt-quote';
  card.setAttribute('data-reveal', '');

  const quote = document.createElement('p');
  quote.className = 'tmt-sub';
  quote.textContent = `“${q.quote}”`;
  card.appendChild(quote);

  const author = document.createElement('div');
  author.className = 'tmt-label';
  author.textContent = q.author;
  card.appendChild(author);

  const meta = [TMT_SOURCES[q.source] || '', q.suburb || '', tmtWhen(q.date)].filter(Boolean);
  if (meta.length) {
    const line = document.createElement('p');
    line.className = 'tmt-sub';
    line.textContent = meta.join(' · ');
    card.appendChild(line);
  }
  return card;
}

function renderTestimonials() {
  const t = content.testimonials;
  if (!t) return;
  const grid = $('#tmtGrid');
  const quotes = Array.isArray(t.quotes) ? t.quotes.filter(q => q && q.quote && q.author) : [];

  if (quotes.length) {
    // Real named reviews replace the proof points entirely — they were only ever
    // standing in until Gracie had reviews to show.
    grid.replaceChildren(...quotes.map(tmtQuoteCard));
  } else if (t.proofPoints) {
    grid.innerHTML = t.proofPoints.map(p => `
    <article class="tmt tmt-proof" data-reveal>
      <div class="tmt-metric">${p.metric}</div>
      <div class="tmt-label">${p.label}</div>
      <p class="tmt-sub">${p.sub}</p>
    </article>
  `).join('');
  }
  // Update the section head if a custom headline shipped.
  const head = document.querySelector('.testimonials .section-head');
  if (!head) return;
  const h2 = head.querySelector('h2');
  if (h2 && t.headline) h2.textContent = t.headline;

  // NEVER `head.querySelector('p')` — this head carries no body copy, so its
  // first <p> is the .eyebrow, and writing textContent into it wipes the label
  // AND the <span class="dot"> gold dot inside it.
  const sub = head.querySelector('p:not(.eyebrow)');
  if (t.sub) {
    if (sub) sub.textContent = t.sub;
    else head.insertAdjacentHTML('beforeend', `<p>${t.sub}</p>`);
  } else if (sub) {
    sub.remove();
  }
}

function renderAbout() {
  $('#founderPhoto').src = content.founder.photo;
  $('#founderPhoto').alt = `${content.founder.name}, ${content.founder.role}`;
  $('#founderPhoto').onerror = () => {
    // Placeholder block when photo missing
    const el = $('#founderPhoto');
    el.style.display = 'none';
    el.parentElement.innerHTML += `
      <div style="position:absolute;inset:0;display:grid;place-items:center;color:var(--text-faint);font-family:var(--font-display);font-size:0.78rem;letter-spacing:0.18em;text-transform:uppercase;">
        Portrait — supplied by Gracie
      </div>`;
  };
  $('#aboutBio').textContent = content.founder.bio;
  $('#aboutSig').textContent = content.founder.signature;
}

function renderWhyGracie() {
  const w = content.whyGracie;
  if (!w) return;
  const GLYPHS = {
    owner:  `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="11" r="5"/><path d="M5 28c1.5-6 6-9 11-9s9.5 3 11 9"/></svg>`,
    female: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="13" r="6"/><path d="M16 19v8"/><path d="M12 24h8"/></svg>`,
    price:  `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 6H13a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H10"/><path d="M16 3v3M16 21v3"/></svg>`,
    mobile: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h26"/><path d="M5 22v-6l4-6h13l5 6v6"/><circle cx="10" cy="23" r="2.4"/><circle cx="23" cy="23" r="2.4"/><path d="M19 4l3 3-3 3M22 7H10"/></svg>`
  };
  $('#whyEyebrow').innerHTML = `<span class="dot"></span> ${w.eyebrow}`;
  $('#whyTitle').textContent = w.title;
  $('#whyGrid').innerHTML = w.pillars.map(p => `
    <article class="why-pillar" data-reveal>
      <span class="why-glyph">${GLYPHS[p.glyph] || ''}</span>
      <h3 class="why-pillar-title">${p.title}</h3>
      <p class="why-pillar-body">${p.body}</p>
    </article>
  `).join('');
}

function renderFeaturedWork() {
  const f = content.featuredWork;
  if (!f) return;
  $('#featuredEyebrow').innerHTML = `<span class="dot"></span> ${f.eyebrow}`;
  $('#featuredTitle').textContent = f.title;
  $('#featuredQuote').textContent = `“${f.quote}”`;
  $('#featuredAttribution').textContent = f.attribution;
  $('#featuredImg').src = f.image;
  $('#featuredImg').alt = f.imageAlt;
  $('#featuredPlate').textContent = f.plate;
}

function renderBikesShowcase() {
  const s = content.bikesShowcase;
  if (!s) return;
  $('#bikesEyebrow').innerHTML = `<span class="dot"></span> ${s.eyebrow}`;
  $('#bikesTitle').textContent = s.title;
  $('#bikesBody').textContent = s.body;
  $('#bikesCta').innerHTML = `<a href="${s.cta.href}" class="btn btn-primary">${s.cta.label} <span class="arrow">→</span></a>`;
  $('#bikesPhotos').innerHTML = s.photos.map(p => `
    <figure class="showcase-photo${p.featured ? ' is-featured' : ''}${p.span === 2 ? ' span-2' : ''}" data-reveal>
      <img src="${p.src}" alt="${p.alt}" loading="lazy" onerror="this.parentElement.style.background='var(--bg-elev)';this.remove()">
    </figure>
  `).join('');
}

function renderVansRvsShowcase() {
  const s = content.vansRvsShowcase;
  if (!s) return;
  $('#vansRvsEyebrow').innerHTML = `<span class="dot"></span> ${s.eyebrow}`;
  $('#vansRvsTitle').textContent = s.title;
  $('#vansRvsBody').textContent = s.body;
  $('#vansRvsCta').innerHTML = `<a href="${s.cta.href}" class="btn btn-primary">${s.cta.label} <span class="arrow">→</span></a>`;
  $('#vansRvsPhotos').innerHTML = s.photos.map(p => `
    <figure class="showcase-photo${p.featured ? ' is-featured' : ''}${p.span === 2 ? ' span-2' : ''}" data-reveal>
      <img src="${p.src}" alt="${p.alt}" loading="lazy" onerror="this.parentElement.style.background='var(--bg-elev)';this.remove()">
    </figure>
  `).join('');
}

function renderBehindDetail() {
  const s = content.behindDetail;
  if (!s) return;
  $('#behindEyebrow').innerHTML = `<span class="dot"></span> ${s.eyebrow}`;
  $('#behindTitle').textContent = s.title;
  $('#behindBody').textContent = s.body;
  $('#behindStrip').innerHTML = s.photos.map(p => `
    <figure class="behind-tile" data-reveal>
      <img src="${p.src}" alt="${p.alt}" loading="lazy" onerror="this.parentElement.style.background='var(--bg-elev)';this.remove()">
      <figcaption>${p.alt}</figcaption>
    </figure>
  `).join('');
}

function renderSuburbs() {
  $('#suburbGrid').innerHTML = content.suburbs.map(s => `
    <a href="${s.built ? `suburbs/${s.slug}.html` : '#contact'}" class="suburb-card" data-reveal>
      <div>
        <div class="suburb-name">${s.name}</div>
        <div class="suburb-region">${s.region}${s.built ? '' : ' · ask Gracie'}</div>
      </div>
      <span class="suburb-arrow">→</span>
    </a>
  `).join('');
}

function renderFaq() {
  $('#faqList').innerHTML = content.faq.map(f => `
    <details class="faq-item" data-reveal>
      <summary class="faq-q">${f.q}</summary>
      <div class="faq-a">${f.a}</div>
    </details>
  `).join('');
}

// "How rough is it?" — a visitor self-assessment control, NOT a before/after
// of Gracie's work. Two real photos of the same angle act as a reference scale.
// All motion is CSS driven off two custom properties; JS writes them once per
// level change (max 4 writes across a full drag), never per frame.
function renderCondition() {
  const c = content.condition;
  const mount = $('#condMount');
  if (!mount || !c || !c.enabled) return;

  const levels = c.levels;
  const last = levels.length - 1;
  const START = Math.min(c.defaultIndex == null ? Math.floor(levels.length / 2) : c.defaultIndex, last);
  const startV = conditionValueFor(START);

  mount.innerHTML = `
    <div class="section-head">
      <p class="eyebrow"><span class="dot"></span> ${c.eyebrow}</p>
      <h2 class="split">${c.title}</h2>
      <p>${c.intro}</p>
    </div>
    <div class="cond-panel" id="condPanel" data-reveal>
      <div class="cond-visual">
        <figure class="cond-stage" id="condStage">${conditionStageHTML(c)}</figure>
        <p class="cond-photo-note">${c.photoNote}</p>
      </div>
      <!-- The slider lives beside the readout it drives, not under the photo: the
           frames are portrait, so a half-width image column towers over the text
           and leaves a dead patch of panel. This also puts the control, the level
           it lands on and the price it implies in one column, in reading order. -->
      <div class="cond-readout">
        <label class="cond-label" for="condRange">${c.sliderLabel}</label>
        <input class="cond-range" id="condRange" type="range" min="0" max="${CONDITION_MAX}" step="1"
               value="${startV}" aria-valuetext="${levels[START].label}">
        <div class="cond-ends" aria-hidden="true">
          <span>${levels[0].label}</span><span>${levels[last].label}</span>
        </div>
        ${c.unsureNote ? `<p class="cond-unsure">${c.unsureNote}</p>` : ''}
        <div class="cond-level" data-cond-level-out></div>
        <p class="cond-blurb" id="condBlurb"></p>
        <div class="cond-suggest" id="condSuggest"></div>
        <div class="cond-ctas">
          <a class="btn btn-primary" id="condSms" href="${content.booking.smsHref}">${c.ctaLabel} <span class="arrow">→</span></a>
          <a class="btn btn-ghost" href="#contact">${c.secondaryCtaLabel}</a>
        </div>
        <p class="cond-foot">${c.disclaimer}</p>
      </div>
    </div>
  `;

  const stage = $('#condStage');
  const range = $('#condRange');

  // The big readout carries copy the compact copies don't, so it listens for
  // the shared update rather than owning the state.
  document.addEventListener('goldy:condition', e => {
    const { level: l, pkg: p, estimate, upliftPct } = e.detail;
    const blurb = $('#condBlurb'); if (blurb) blurb.textContent = l.blurb;
    const sug = $('#condSuggest');
    if (sug) sug.innerHTML = `
      <span class="cond-suggest-label">Probably</span>
      <span class="cond-suggest-tier">${p.tier}</span>
      <span class="cond-suggest-price">${currencyAU(estimate)}<small>from</small></span>
      ${upliftPct ? `<span class="cond-suggest-uplift">includes +${upliftPct}% ${c.upliftLabel}</span>` : ''}`;
    const sms = $('#condSms');
    if (sms) sms.href = `${content.booking.smsHref}?&body=${encodeURIComponent(
      `Hi Gracie! ${c.smsIntro}: ${l.label}. Looks like ${p.tier} ` +
      `(roughly ${currencyAU(estimate)}${upliftPct ? `, incl. +${upliftPct}% for condition` : ''}). ` +
      `My name: , Suburb: , Vehicle: `)}`;
  });

  // Drag straight on the photo - desktop only. On touch this needs
  // touch-action:none, which would swallow vertical page scroll.
  if (!NO_HOVER) {
    let dragging = false;
    const setFromX = e => {
      const r = stage.getBoundingClientRect();
      const v = Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * CONDITION_MAX);
      if (v !== +range.value) setCondition(v, true);
    };
    stage.addEventListener('pointerdown', e => {
      dragging = true; document.documentElement.classList.add('cond-dragging');
      stage.setPointerCapture(e.pointerId); setFromX(e);
    });
    stage.addEventListener('pointermove', e => { if (dragging) setFromX(e); });
    ['pointerup', 'pointercancel'].forEach(ev => stage.addEventListener(ev, e => {
      dragging = false; document.documentElement.classList.remove('cond-dragging');
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    }));
  }

  setCondition(startV, false);   // untouched: conditionPick stays null
}

// Mirrors the chosen condition into the contact form so the visitor can see
// it will travel with their enquiry.
function syncConditionChip() {
  const chip = $('#formCondition');
  if (!chip) return;
  if (!conditionPick) { chip.hidden = true; chip.innerHTML = ''; return; }
  chip.hidden = false;
  chip.innerHTML = `
    <span>Condition you picked: <strong>${conditionPick.label}</strong> · suggested ${conditionPick.tier}</span>
    <button type="button" class="form-condition-clear" id="formConditionClear">Clear</button>`;
}
document.addEventListener('click', e => {
  if (e.target.closest('#formConditionClear')) { conditionPick = null; syncConditionChip(); syncConditionChips(); refreshSmsLinks(); }
});

function renderContact() {
  const b = content.booking;
  $('#contactChannels').innerHTML = `
    <a class="channel" href="${b.smsHref}" data-sms-body="Hi Gracie! I'd like to book a detail.">
      <span class="channel-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>
      </span>
      <div class="channel-meta">
        <span class="channel-label">Text Gracie</span>
        <span class="channel-value">${content.brand.phone}</span>
      </div>
    </a>
    <a class="channel" href="${content.brand.phoneHref}">
      <span class="channel-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </span>
      <div class="channel-meta">
        <span class="channel-label">Call direct</span>
        <span class="channel-value">${content.brand.phone}</span>
      </div>
    </a>
    <a class="channel" href="${b.instagramDm}">
      <span class="channel-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
      </span>
      <div class="channel-meta">
        <span class="channel-label">Instagram DM</span>
        <span class="channel-value">${content.brand.instagram}</span>
      </div>
    </a>
  `;
  $('#formNote').textContent = b.responseTimeLabel;
}

function renderFooter() {
  $('#footerBlurb').textContent =
    "Hand-finished mobile detailing across the Gold Coast. Direct with Gracie — owner, operator, and the only person who'll touch your car.";
  $('#footerSuburbs').innerHTML = content.suburbs.slice(0, 5).map(s =>
    `<li><a href="${s.built ? `suburbs/${s.slug}.html` : '#suburbs'}">${s.name}</a></li>`
  ).join('');
  $('#footerDirect').innerHTML = `
    <li><a href="${content.booking.smsHref}" data-sms-body="Hi Gracie!">Text Gracie</a></li>
    <li><a href="${content.brand.phoneHref}">${content.brand.phone}</a></li>
    <li><a href="${content.booking.instagramDm}">${content.brand.instagram}</a></li>
  `;
  $('#footerCopy').textContent = `© ${new Date().getFullYear()} ${content.brand.name}${content.brand.abn ? ` · ABN ${content.brand.abn}` : ''}`;
}

function renderNav() {
  $('#navPhone').textContent = content.brand.phone;
  $('#navPhone').href = content.brand.phoneHref;
  $('#drawerPhone').href = content.brand.phoneHref;
  $('#floatCall').href = content.brand.phoneHref;
}

function renderSchema() {
  const list = [
    content.schema,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    },
    ...content.packages.map(p => ({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Car detailing",
      name: p.tier,
      description: p.summary,
      provider: { "@type": "LocalBusiness", name: content.brand.name },
      areaServed: { "@type": "City", name: "Gold Coast" },
      offers: { "@type": "Offer", price: p.priceFrom, priceCurrency: "AUD" }
    }))
  ];
  $('#ldSchema').textContent = JSON.stringify(list, null, 2);
}

// Split-text utility — wraps every word for the .split reveal.
// `transform: translateY(110%)` on the inner span only clips visually
// (CSS transforms don't hide content from screen readers), so the text
// remains live and accessible without needing aria-hidden or sr-only
// duplication.
function splitWords(str) {
  return str.split(/(\s+)/).map(token => {
    if (/^\s+$/.test(token)) return token;
    return `<span class="split-word"><span>${token}</span></span>`;
  }).join('');
}

// Apply splitWords to anything with .split that isn't already done (excluding hero title which is custom)
function applySplits() {
  $$('.split').forEach(el => {
    if (el.dataset.split === 'done' || el.id === 'heroTitle') {
      el.dataset.split = 'done';
      return;
    }
    el.innerHTML = splitWords(el.textContent);
    el.dataset.split = 'done';
  });
}

// ============================================================
// 1. INITIAL RENDER
// ============================================================
renderHero();
renderTrust();
renderMaintenance();
renderPackages();
renderCustomBuilder();
renderWhyGracie();
renderFeaturedWork();
renderGallery();
renderBikesShowcase();
renderVansRvsShowcase();
renderBehindDetail();
renderTestimonials();
renderAbout();
renderSuburbs();
renderFaq();
renderCondition();
renderContact();
renderFooter();
renderNav();
// renderCondition() runs the last refreshSmsLinks() of the render pass, but
// renderContact() and renderFooter() inject data-sms-body anchors AFTER it —
// without this sweep those two open SMS with an empty message until the visitor
// happens to touch the condition slider.
refreshSmsLinks();
renderSchema();
applySplits();

// ============================================================
// 2. PAGE-LOAD OVERTURE
// ============================================================
function runOverture() {
  if (REDUCED) {
    $('#overture').remove();
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const mark = $('#overtureMark');
    const bloom = $('#overtureBloom');
    const chars = mark.textContent.split('');
    mark.innerHTML = chars.map(c => `<span class="char">${c}</span>`).join('');
    const spans = mark.querySelectorAll('.char');

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('#overture', {
          opacity: 0, duration: 0.55, ease: 'power2.inOut',
          onComplete: () => { $('#overture').remove(); resolve(); }
        });
      }
    });
    tl.to(bloom, { scale: 1, duration: 0.7, ease: 'power3.out' }, 0)
      .to(spans, { opacity: 1, y: 0, stagger: 0.045, duration: 0.5, ease: 'power2.out' }, 0.15)
      .to(bloom, { opacity: 0.5, scale: 1.4, duration: 0.5, ease: 'power2.inOut' }, 0.75);
  });
}

// ============================================================
// 3. LENIS + SCROLLTRIGGER BRIDGE
// ============================================================
// Smooth WHEEL on desktop; on touch devices Lenis hands scrolling back to the
// OS (syncTouch:false) so mobile gets native momentum — no JS fighting the finger.
const lenis = new Lenis({
  duration: 1.15,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1
});

if (window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  // normalizeScroll hijacks native touch scrolling — only safe on non-touch.
  // On phones it fought Lenis/native and was a primary cause of janky scroll.
  if (!NO_HOVER) ScrollTrigger.normalizeScroll(true);
  lenis.on('scroll', ScrollTrigger.update);
  // Drive Lenis from a SINGLE source (the GSAP ticker). The previous code also
  // ran a manual requestAnimationFrame loop, double-stepping scroll every frame.
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
} else {
  // Fallback driver only when ScrollTrigger isn't present.
  function rafLoop(time) { lenis.raf(time); requestAnimationFrame(rafLoop); }
  requestAnimationFrame(rafLoop);
}

// Anchor-link smooth scroll via Lenis
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id === '#' || id.length < 2) return;
  const target = document.querySelector(id);
  if (target) {
    e.preventDefault();
    if (lenis && lenis.scrollTo) {
      lenis.scrollTo(target, { offset: -60, duration: NO_HOVER ? 0.6 : 1.2 });
    } else {
      const y = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    closeDrawer();
  }
});

// ============================================================
// 4. NAV / DRAWER / FLOAT-CALL
// ============================================================
const nav = $('#nav');
const burger = $('#burger');
const drawer = $('#drawer');

function openDrawer() {
  drawer.classList.add('is-open');
  drawer.removeAttribute('inert');
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  if (lenis && lenis.stop) lenis.stop();           // pause smooth-scroller while menu is open
  const first = drawer.querySelector('a');
  if (first) first.focus();
}
function closeDrawer() {
  if (!drawer.classList.contains('is-open')) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('inert', '');                 // not tabbable while off-screen
  drawer.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  if (lenis && lenis.start) lenis.start();
}
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  open ? closeDrawer() : openDrawer();
});
// Escape closes the drawer and returns focus to the burger
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
    closeDrawer();
    burger.focus();
  }
});

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 30);
  $('#floatCall').classList.toggle('is-visible', window.scrollY > 600);
}, { passive: true });

// ============================================================
// 5. CURSOR GLOW + MAGNETIC CTAS (desktop only)
// ============================================================
if (!NO_HOVER && !REDUCED) {
  const glow = $('#cursorGlow');
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.body.classList.add('has-cursor');
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function loop() {
    cx += (tx - cx) * 0.16;
    cy += (ty - cy) * 0.16;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Magnetic
  $$('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.15;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ============================================================
// 6. IO REVEALS (with 1.5s failsafe)
// ============================================================
const revealEls = $$('[data-reveal], [data-reveal-stagger], .split, .divider');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => {
  // Already in viewport on load? Show immediately.
  const r = el.getBoundingClientRect();
  if (r.top < window.innerHeight && r.bottom > 0) {
    el.classList.add('is-in');
  } else {
    io.observe(el);
  }
});
setTimeout(() => {
  $$('[data-reveal]:not(.is-in), .split:not(.is-in)').forEach(el => el.classList.add('is-in'));
}, 1500);

// ============================================================
// 7. NUMBER COUNTERS
// ============================================================
$$('[data-count-to]').forEach(el => {
  const target = parseFloat(el.dataset.countTo);
  const suffix = el.querySelector('.suffix');
  const decimals = (el.dataset.countTo.split('.')[1] || '').length;
  const raw = el.innerHTML;
  let started = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      if (REDUCED) return;
      const start = performance.now();
      const dur = 1400;
      function tick(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = (target * eased).toFixed(decimals);
        // preserve any leading text (e.g. "100+" → keep "+")
        const trailing = raw.replace(/^\d[\d.]*/, '').split('<')[0];
        el.firstChild.nodeValue = val + trailing;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.4 });
  obs.observe(el);
});

// ============================================================
// 8. HERO CLIP-PATH SCRUB + COPY FADE
// ============================================================
if (window.ScrollTrigger && !REDUCED) {
  gsap.to('#heroAfterLayer', {
    clipPath: 'inset(0 0% 0 0)',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8
    }
  });
  gsap.to('#heroContent', {
    yPercent: -10,
    opacity: 0.35,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6
    }
  });
}

// ============================================================
// 9. PACKAGES — SCROLL MORPHING PLATE
// ============================================================
if (window.ScrollTrigger && !REDUCED) {
  const plates = $$('.pkg-plate');
  $$('#pkgGrid .pkg').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 70%',
      end: 'bottom 30%',
      onToggle: self => {
        if (self.isActive) {
          plates.forEach(p => p.classList.toggle('is-active', p.dataset.plate === card.dataset.pkg));
        }
      }
    });
  });
}

// ============================================================
// 11. WEBGL HERO SHADER — dust + light leak (hand-rolled)
// ============================================================
function initHeroShader() {
  // Desktop only. A full-screen per-pixel fragment shader (screen-blended over
  // the hero video) every frame is the single biggest GPU/battery drain on
  // phones — and the video already carries the hero visually there.
  if (REDUCED || NO_HOVER || window.innerWidth < 1025) return;
  const canvas = $('#heroShader');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) return;

  const vsrc = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main(){
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;
  const fsrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2  u_res;

    // 2D hash + noise (cheap)
    float hash(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
        u.y);
    }

    void main(){
      vec2 uv = v_uv;
      vec2 p  = uv * u_res / 200.0;

      // Light leak — moving warm gold blob top-right
      vec2 leakPos = vec2(0.78 + sin(u_time * 0.08) * 0.04,
                          0.72 + cos(u_time * 0.07) * 0.04);
      float leak = smoothstep(0.55, 0.0, distance(uv, leakPos));
      vec3 leakCol = vec3(0.94, 0.78, 0.45) * leak * 0.55;

      // Secondary leak bottom-left, dimmer
      vec2 leakPos2 = vec2(0.15 + cos(u_time * 0.05) * 0.04,
                           0.28 + sin(u_time * 0.06) * 0.04);
      float leak2 = smoothstep(0.45, 0.0, distance(uv, leakPos2));
      vec3 leakCol2 = vec3(0.72, 0.56, 0.30) * leak2 * 0.30;

      // Dust motes
      float n = noise(p * 1.4 + u_time * 0.05);
      float dust = smoothstep(0.86, 1.0, n) * 0.5;

      // Film grain
      float g = (hash(uv * u_res + u_time) - 0.5) * 0.045;

      vec3 col = leakCol + leakCol2 + vec3(dust) + vec3(g);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('Shader compile:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER, vsrc);
  const fs = compile(gl.FRAGMENT_SHADER, fsrc);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes  = gl.getUniformLocation(prog, 'u_res');

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = canvas.clientWidth | 0;
    const h = canvas.clientHeight | 0;
    canvas.width = Math.max(1, w * dpr);
    canvas.height = Math.max(1, h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let running = true;
  // Pause when hero out of view to save GPU
  const sObs = new IntersectionObserver(es => { running = es[0].isIntersecting; });
  sObs.observe($('#hero'));

  function frame(t) {
    if (running) {
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ============================================================
// 12. CONTACT FORM — hands off to SMS to Gracie (no server submit yet)
// ============================================================
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const cond = conditionPick ? `Condition: ${conditionPick.label} (suggested ${conditionPick.tier}). ` : '';
  const body = encodeURIComponent(
    `Hi Gracie! New enquiry from ${data.get('name') || 'the site'}. ` +
    `Phone: ${data.get('phone') || '-'}. Vehicle: ${data.get('vehicle') || '-'}. ` +
    cond +
    `${data.get('message') || ''}`
  );
  window.location.href = `${content.booking.smsHref}?&body=${body}`;
});

// ============================================================
// 13. KICK OFF
// ============================================================
initConfigurator(content);
initHeroShader();
initHeroVideo();

// Run overture last, then refresh ScrollTrigger so any layout-shifted
// triggers fire correctly
runOverture().then(() => {
  if (window.ScrollTrigger) ScrollTrigger.refresh();
});

// Recompute ScrollTrigger positions after a resize (cross-breakpoint)
let resizeT;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, 200);
});
