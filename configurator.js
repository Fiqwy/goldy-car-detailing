// ============================================================
// CONFIGURATOR — 2-step instant pricing for the 3 set packages
// State: { vehicle, goal }  →  package + price computed on demand.
// (Custom / build-your-own lives in its own #build-your-own section.)
// ============================================================

export function currencyAU(n) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
  }).format(n);
}

// Inline SVG glyphs for each vehicle size
const ICONS = {
  hatch: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h26"/><path d="M5 21V15l3-5h13l5 5v6"/><circle cx="9" cy="22" r="2.4"/><circle cx="23" cy="22" r="2.4"/></svg>`,
  suv:   `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21h28"/><path d="M4 21v-7l4-5h15l5 5v7"/><circle cx="10" cy="22" r="2.4"/><circle cx="23" cy="22" r="2.4"/></svg>`,
  ute:   `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h28"/><path d="M4 22v-6l3-6h11v6h11v6"/><circle cx="10" cy="23" r="2.4"/><circle cx="24" cy="23" r="2.4"/></svg>`,
  fourwd:`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h28"/><path d="M3 22v-8l4-6h18l4 6v8"/><circle cx="10" cy="23" r="2.6"/><circle cx="23" cy="23" r="2.6"/></svg>`,
  motorhome:`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h28"/><rect x="3" y="8" width="23" height="14" rx="1.5"/><path d="M26 14l4 4v4h-4"/><circle cx="9" cy="23" r="2.4"/><circle cx="22" cy="23" r="2.4"/></svg>`,
  bike:     `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="22" r="5"/><circle cx="25" cy="22" r="5"/><path d="M7 22l5-12h7l4 8"/><path d="M14 10h4"/></svg>`
};

export function initConfigurator(content) {
  const root = document.getElementById('cfg');
  if (!root) return;

  const state = { vehicle: null, goal: null };

  // ---- RENDER STEP 1: vehicle ----
  const vGrid = document.getElementById('cfgVehicleGrid');
  vGrid.innerHTML = Object.entries(content.sizeMultipliers).map(([id, v]) => `
    <button type="button" class="cfg-opt" data-vehicle="${id}">
      <span class="cfg-opt-icon">${ICONS[v.icon] || ICONS.hatch}</span>
      <span class="cfg-opt-label">${v.label}</span>
      <span class="cfg-opt-blurb">${v.multiplier === 1 ? 'Base size' : `×${v.multiplier.toFixed(2)} of base`}</span>
    </button>
  `).join('');

  // ---- RENDER STEP 2: goal ----
  const gGrid = document.getElementById('cfgGoalGrid');
  gGrid.innerHTML = content.goals.map(g => `
    <button type="button" class="cfg-opt" data-goal="${g.id}">
      <span class="cfg-opt-label">${g.label}</span>
      <span class="cfg-opt-blurb">${g.blurb}</span>
    </button>
  `).join('');

  // ---- INTERACTIONS ----
  vGrid.addEventListener('click', e => {
    const btn = e.target.closest('[data-vehicle]');
    if (!btn) return;
    state.vehicle = btn.dataset.vehicle;
    selectIn(vGrid, btn);
    setTimeout(() => goStep(2), 240);
  });

  gGrid.addEventListener('click', e => {
    const btn = e.target.closest('[data-goal]');
    if (!btn) return;
    state.goal = btn.dataset.goal;
    selectIn(gGrid, btn);
    setTimeout(() => {
      renderResult(content, state);
      goStep(3);
    }, 240);
  });

  root.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => goStep(parseInt(btn.dataset.back, 10)));
  });
}

function selectIn(grid, btn) {
  grid.querySelectorAll('.cfg-opt').forEach(o => o.classList.remove('is-selected'));
  btn.classList.add('is-selected');
}

function goStep(n) {
  document.querySelectorAll('.cfg-step').forEach(s => {
    s.classList.toggle('is-active', s.dataset.step === String(n));
  });
  document.querySelectorAll('.cfg-pip').forEach(p => {
    p.classList.toggle('is-active', parseInt(p.dataset.pip, 10) <= n);
  });
}

function renderResult(content, state) {
  const goal = content.goals.find(g => g.id === state.goal);
  const pkg = content.packages.find(p => p.id === goal.packageId);
  const vehicle = content.sizeMultipliers[state.vehicle];
  const price = Math.round(pkg.priceFrom * vehicle.multiplier / 5) * 5; // round to nearest $5

  const TEL = "tel:+61427798045";
  const PHONE = "0427 798 045";
  const HEDGE = "Times are estimates so Gracie doesn't double-book her day.";

  // SMS-first: fold the build into a concise text body (SMS has no subject).
  const smsBody = encodeURIComponent(
    `Hi Gracie! Price builder: ${vehicle.label} · ${goal.label} · ${pkg.tier} · ${currencyAU(price)}. My name: , Suburb: `
  );
  const smsHref = `${content.booking.smsHref}?&body=${smsBody}`; // ?&body= works on both iOS + Android

  const includesList = pkg.includes.map(i => `<li>${i}</li>`).join('');

  document.getElementById('cfgResult').innerHTML = `
    <div class="cfg-result-head">
      <div>
        <div class="eyebrow"><span class="dot"></span> Suggested package</div>
        <div class="cfg-result-tier">${pkg.tier}</div>
        <div class="cfg-result-summary">${pkg.summary}</div>
      </div>
      <div class="cfg-price">${currencyAU(price)}<small>from · ${pkg.turnaround}</small></div>
    </div>
    <details class="cfg-includes-accordion">
      <summary>What's included</summary>
      <ul class="cfg-includes">${includesList}</ul>
    </details>
    <div class="hero-ctas cfg-ctas">
      <a href="${smsHref}" class="btn btn-primary">Text my booking <span class="arrow">→</span></a>
      <a href="${TEL}" class="btn btn-ghost">Call · ${PHONE}</a>
    </div>
    <p class="cfg-hedge">${HEDGE}</p>
    <p class="cfg-foot">${content.booking.responseTimeLabel} · Prefer to pick service by service? Build your own below.</p>
  `;
}
