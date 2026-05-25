// ============================================================
// GOLDY CAR DETAILING — APP SCRIPT
// Renders from content.js, wires Lenis + GSAP, motion layer.
// ============================================================
import { content } from './content.js';
import { initConfigurator, currencyAU } from './configurator.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NO_HOVER = matchMedia('(hover: none)').matches;
document.documentElement.classList.add('has-js');

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
  title.innerHTML = h.headlineLines
    .map((line, i) =>
      `<span class="line${i === 1 ? ' gold-grad' : ''}">${splitWords(line)}</span>`
    ).join('');

  $('#heroSub').textContent = h.sub;

  $('#heroCtas').innerHTML = `
    <a href="${h.primaryCta.href}" class="btn btn-primary">${h.primaryCta.label} <span class="arrow">→</span></a>
    <a href="${h.secondaryCta.href}" class="btn btn-ghost">${h.secondaryCta.label}</a>
  `;

  $('#heroBeforeLabel').textContent = h.beforeAfter.label;
}

function renderTrust() {
  $('#trustRow').innerHTML = content.trustStrip.map(t => `
    <div class="trust-cell" data-reveal>
      <div class="trust-num" data-count-to="${parseFloat(t.value)}">${t.value}${t.suffix ? `<span class="suffix">${t.suffix}</span>` : ''}</div>
      <div class="trust-label">${t.label}</div>
    </div>
  `).join('');
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
      <div class="pkg-turnaround">${p.turnaround}</div>
      <div class="pkg-divider"></div>
      <ul class="pkg-includes">${p.includes.map(i => `<li>${i}</li>`).join('')}</ul>
      <div class="pkg-cta"><a href="#configurator" class="btn btn-ghost">Build this price <span class="arrow">→</span></a></div>
    </article>
  `).join('');
}

function renderProcess() {
  $('#processTrack').innerHTML = content.process.map(s => `
    <article class="process-card" data-reveal>
      <div class="process-card-text">
        <div class="process-step">${s.step}</div>
        <h3 class="process-title">${s.title}</h3>
        <p class="process-body">${s.body}</p>
      </div>
      <div class="process-img">
        <img src="${s.image}" alt="${s.title}" loading="lazy" onerror="this.style.display='none'">
      </div>
    </article>
  `).join('');
}

function renderGallery() {
  const cells = content.gallery;
  // Decorate every 5th tile as 'wide' and every 7th as 'tall' for organic masonry
  $('#galleryGrid').innerHTML = cells.map((g, i) => {
    const cls = i % 5 === 2 ? 'wide' : (i % 7 === 4 ? 'tall' : '');
    const cat = content.galleryCategories.find(c => c.id === g.category);
    return `
      <figure class="gallery-tile ${cls}" data-reveal>
        <img src="${g.src}" alt="${g.alt}" loading="lazy" onerror="this.parentElement.style.background='var(--bg-elev)';this.remove()">
        ${cat ? `<figcaption class="tag">${cat.label}</figcaption>` : ''}
      </figure>
    `;
  }).join('');

  // Occasion rail — one card per category, lead photo from gallery
  $('#occasionTrack').innerHTML = content.galleryCategories.map(c => {
    const lead = content.gallery.find(g => g.category === c.id);
    return `
      <div class="occasion-card">
        ${lead ? `<img src="${lead.src}" alt="${c.label}" loading="lazy" onerror="this.parentElement.style.background='var(--bg-elev)';this.remove()">` : ''}
        <div class="occasion-card-caption">${c.label}</div>
      </div>
    `;
  }).join('');
}

function renderTestimonials() {
  $('#tmtGrid').innerHTML = content.testimonials.map(t => `
    <article class="tmt" data-reveal>
      <div class="tmt-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
      <p class="tmt-quote">"${t.quote}"</p>
      <div class="tmt-meta">
        <span class="tmt-name">${t.name}${t.suburb ? ` · ${t.suburb}` : ''}</span>
        ${t.source === 'placeholder'
          ? `<span class="tmt-placeholder">Placeholder</span>`
          : `<span class="tmt-vehicle">${t.vehicle}</span>`}
      </div>
    </article>
  `).join('');
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

function renderContact() {
  const b = content.booking;
  $('#contactChannels').innerHTML = `
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
    <a class="channel" href="mailto:${b.mailtoTarget}">
      <span class="channel-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      </span>
      <div class="channel-meta">
        <span class="channel-label">Email</span>
        <span class="channel-value">${b.mailtoTarget}</span>
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
    <li><a href="${content.brand.phoneHref}">${content.brand.phone}</a></li>
    <li><a href="${content.booking.instagramDm}">${content.brand.instagram}</a></li>
    <li><a href="mailto:${content.booking.mailtoTarget}">Email Gracie</a></li>
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

// Split-text utility — wraps every word for the .split reveal
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
renderPackages();
renderProcess();
renderGallery();
renderTestimonials();
renderAbout();
renderSuburbs();
renderFaq();
renderContact();
renderFooter();
renderNav();
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
const lenis = new Lenis({
  duration: 1.15,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
  wheelMultiplier: 1
});
function rafLoop(time) {
  lenis.raf(time);
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

if (window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.normalizeScroll(true);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
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
    lenis.scrollTo(target, { offset: -60, duration: 1.2 });
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
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  open ? closeDrawer() : openDrawer();
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

  // Gallery tile float
  $$('.gallery-tile img').forEach(img => {
    gsap.fromTo(img, { y: -8 }, {
      y: 8,
      ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
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
// 10. PROCESS — HORIZONTAL PINNED (desktop ≥1025)
// ============================================================
function initProcessTimeline() {
  if (window.innerWidth < 1025 || REDUCED || !window.ScrollTrigger) return;
  const track = $('#processTrack');
  const wrap = $('#processTrackWrap');
  if (!track || !wrap) return;

  // Compute total travel
  const trackW = track.scrollWidth;
  const wrapW = wrap.offsetWidth;
  const distance = trackW - wrapW + 80;
  if (distance <= 0) return;

  gsap.to(track, {
    x: -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: wrap,
      start: 'top top',
      end: () => `+=${distance + window.innerHeight * 0.4}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });
}
initProcessTimeline();

// ============================================================
// 11. WEBGL HERO SHADER — dust + light leak (hand-rolled)
// ============================================================
function initHeroShader() {
  if (REDUCED) return;
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
// 12. CONTACT FORM — mailto fallback (no real submit yet)
// ============================================================
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subj = encodeURIComponent(`New enquiry — ${data.get('name') || 'Goldy site'}`);
  const body = encodeURIComponent(
    `Name: ${data.get('name') || '-'}\n` +
    `Phone: ${data.get('phone') || '-'}\n` +
    `Vehicle: ${data.get('vehicle') || '-'}\n\n` +
    `Message:\n${data.get('message') || '-'}`
  );
  window.location.href = `mailto:${content.booking.mailtoTarget}?subject=${subj}&body=${body}`;
});

// ============================================================
// 13. KICK OFF
// ============================================================
initConfigurator(content);
initHeroShader();

// Run overture last, then refresh ScrollTrigger so any layout-shifted
// triggers fire correctly
runOverture().then(() => {
  if (window.ScrollTrigger) ScrollTrigger.refresh();
});

// Re-init process timeline on resize (cross-breakpoint)
let resizeT;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, 200);
});
