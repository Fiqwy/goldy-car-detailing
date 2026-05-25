// ============================================================
// CONFIGURATOR — 2-step instant pricing
// State: { vehicle, goal, package, priceEstimate }
// Result step is rendered dynamically with mailto + IG CTAs.
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
  motorhome:`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h28"/><rect x="3" y="8" width="23" height="14" rx="1.5"/><path d="M26 14l4 4v4h-4"/><circle cx="9" cy="23" r="2.4"/><circle cx="22" cy="23" r="2.4"/></svg>`
};

export function initConfigurator(content) {
  const root = document.getElementById('cfg');
  if (!root) return;

  const state = { vehicle: null, goal: null };
  const STEPS = ['1', '2', '3'];

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
  const priceEstimate = currencyAU(price);

  // Demo "next free" — static placeholder. Live: hook into Gracie's calendar.
  const nextSlot = computeNextFree();

  const mailtoBody = encodeURIComponent(
    `Hi Gracie,\n\n` +
    `I built a price using the site:\n\n` +
    `Vehicle: ${vehicle.label}\n` +
    `Goal: ${goal.label}\n` +
    `Suggested package: ${pkg.tier}\n` +
    `Estimate: ${priceEstimate}\n` +
    `Slot I'd love: ${nextSlot}\n\n` +
    `My name: \nPhone: \nSuburb: \n\n` +
    `Cheers!`
  );
  const mailtoSubj = encodeURIComponent(`Booking enquiry — ${pkg.tier} for ${vehicle.label}`);
  const mailtoHref = `mailto:${content.booking.mailtoTarget}?subject=${mailtoSubj}&body=${mailtoBody}`;

  const includes = pkg.includes.slice(0, 5).map(i => `<li>${i}</li>`).join('');

  document.getElementById('cfgResult').innerHTML = `
    <div class="cfg-result-head">
      <div>
        <div class="eyebrow"><span class="dot"></span> Suggested package</div>
        <div class="cfg-result-tier">${pkg.tier}</div>
        <div style="color:var(--text-muted);font-size:0.9rem;margin-top:0.3rem;">${pkg.summary}</div>
      </div>
      <div class="cfg-price">${priceEstimate}<small>from · ${pkg.turnaround}</small></div>
    </div>
    <ul class="cfg-includes">${includes}</ul>
    <div class="cfg-slot">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--gold);"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      Next free slot: <strong>${nextSlot}</strong>
    </div>
    <div class="hero-ctas" style="margin-top:0.4rem;">
      <a href="${mailtoHref}" class="btn btn-primary">Book this slot <span class="arrow">→</span></a>
      <a href="${content.booking.instagramDm}" class="btn btn-ghost">Message Gracie on Instagram</a>
    </div>
    <p style="margin-top:0.8rem;font-size:0.82rem;color:var(--text-muted);text-align:center;">
      ${content.booking.responseTimeLabel} · Add-ons available at booking
    </p>
  `;
}

// Placeholder "next free" — picks the next weekday at 9am AEST.
// Live version will read from Gracie's actual calendar.
function computeNextFree() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  // Skip 2 days forward, then bump past weekend if needed
  let d = new Date(now);
  d.setDate(now.getDate() + 2);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}, 9:00am`;
}
