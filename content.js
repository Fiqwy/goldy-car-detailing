// ============================================================
// GOLDY CAR DETAILING — SINGLE SOURCE OF TRUTH
// ============================================================
// One swap of this file re-skins the whole site.
// Every `// CONFIRM` needs Gracie's sign-off before going live.
// ============================================================

export const content = Object.freeze({

  brand: {
    name: "Goldy Car Detailing",
    wordmark: "GOLDY",
    tagline: "Showroom finish. At your driveway.",
    phone: "0400 000 000",            // CONFIRM with Gracie
    phoneHref: "tel:+61400000000",    // CONFIRM
    email: "hello@goldycardetailing.com.au", // CONFIRM
    instagram: "@goldycardetailing",
    instagramUrl: "https://www.instagram.com/goldycardetailing/",
    abn: "",                          // CONFIRM
    region: "Gold Coast, QLD",
    suburbsServed: [
      "Surfers Paradise", "Broadbeach", "Burleigh Heads",
      "Mermaid Beach", "Robina", "Burleigh Waters",
      "Palm Beach", "Currumbin", "Varsity Lakes", "Tugun"
    ],
    yearFounded: 2024,                // CONFIRM
  },

  hero: {
    eyebrow: "Mobile detailing · Gold Coast",
    headlineLines: [
      "Showroom finish.",
      "At your driveway." // italic gold gradient
    ],
    sub: "Hand-finished mobile detailing for cars that deserve more than a wash. Booked direct with Gracie — no call centres, no upsells, no shortcuts.",
    primaryCta: { label: "Get my price (60s)", href: "#configurator" },
    secondaryCta: { label: "Message Gracie", href: "#contact" },
    beforeAfter: {
      before: "assets/hero/before.svg",  // PLACEHOLDER — swap to .webp from her IG
      after:  "assets/hero/after.svg",   // PLACEHOLDER — swap to .webp from her IG
      label: "Black-on-black, brought back from oxidised"
    }
  },

  trustStrip: [
    { value: "120+", label: "details · Gold Coast" },     // CONFIRM
    { value: "4.9", suffix: "★", label: "average review" },// CONFIRM
    { value: "0", label: "shop visits — we come to you" },
    { value: "100%", label: "satisfaction or we re-detail" }
  ],

  // Three tiers, simple to read, vehicle-size multiplier shown in UI.
  packages: [
    {
      id: "bronze",
      tier: "Express Glow",
      priceFrom: 189,
      turnaround: "90 minutes",
      summary: "The fast reset. Perfect between full details.",
      includes: [
        "Snow-foam pre-wash + 2-bucket hand wash",
        "Wheels + tyres dressed",
        "Interior vacuum + wipe-down",
        "Windows in & out",
        "Tyre shine + spray sealant for 4 weeks of protection"
      ],
      finishPlate: "assets/hero/plate-matte.svg"   // morph background — PLACEHOLDER
    },
    {
      id: "silver",
      tier: "Signature Detail",
      priceFrom: 329,
      turnaround: "3–4 hours",
      summary: "The honest middle ground — every surface, inside and out.",
      includes: [
        "Full exterior decontamination (iron + tar)",
        "Clay treatment for glass-smooth paint",
        "Single-stage machine polish (light swirls removed)",
        "Full interior shampoo + leather conditioner",
        "3-month ceramic spray sealant"
      ],
      popular: true,
      finishPlate: "assets/hero/plate-satin.svg"
    },
    {
      id: "gold",
      tier: "Showroom Restore",
      priceFrom: 549,
      turnaround: "Full day",
      summary: "Wedding, sale, or just love your car too much for less.",
      includes: [
        "Everything in Signature Detail",
        "Two-stage paint correction (deeper swirls + holograms)",
        "9-month ceramic coating on paint, glass, wheels",
        "Engine bay detail + plastic dressing",
        "Photo handover: before/after for your records"
      ],
      finishPlate: "assets/hero/plate-mirror.svg"
    }
  ],

  sizeMultipliers: {
    small:    { label: "Hatch / sedan",       multiplier: 1.0,  icon: "hatch" },
    mid:      { label: "Wagon / mid SUV",     multiplier: 1.15, icon: "suv" },
    suv:      { label: "Large SUV / Ute",     multiplier: 1.3,  icon: "ute" },
    fourwd:   { label: "4WD / Van",           multiplier: 1.45, icon: "fourwd" },
    motorhome:{ label: "Motorhome / RV",      multiplier: 2.0,  icon: "motorhome" } // confirmed from her IG
  },

  // Configurator step 2 → maps to package id
  goals: [
    { id: "shine",     label: "Maintenance shine",     blurb: "Keep it looking sharp between deep cleans.", packageId: "bronze" },
    { id: "restore",   label: "Bring it back",          blurb: "Years of swirls, oxidation, neglect — reset it.", packageId: "silver" },
    { id: "sale",      label: "Sale-ready",             blurb: "Hand it to the buyer at its absolute best.", packageId: "gold" },
    { id: "special",   label: "Special occasion",       blurb: "Wedding, show, gift, milestone.", packageId: "gold" }
  ],

  addOns: [
    { id: "petHair", name: "Pet hair removal",          price: 45,  note: "Per vehicle" },
    { id: "leather", name: "Deep leather conditioning", price: 65,  note: "Adds 30 min" },
    { id: "headlights", name: "Headlight restoration",  price: 95,  note: "Pair, restores clarity" },
    { id: "ceramic9", name: "Upgrade to 24-month ceramic", price: 220, note: "Gold tier only" }
  ],

  // 5 steps — Pagani-timeline style
  process: [
    {
      step: "01",
      title: "Paint Assessment",
      body: "I read the paint with a gauge and inspection light. Swirls, holograms, oxidation, depth — every car gets a different plan.",
      image: "assets/process/01-assessment.webp"
    },
    {
      step: "02",
      title: "Decontamination",
      body: "Snow foam, two-bucket wash, iron remover, then a clay treatment until the paint is glass-smooth to the touch.",
      image: "assets/process/02-decon.webp"
    },
    {
      step: "03",
      title: "Correction",
      body: "Single- or two-stage machine polish, refining the finish until light bounces clean off the panel — no haze, no swirls.",
      image: "assets/process/03-correction.webp"
    },
    {
      step: "04",
      title: "Protection",
      body: "Ceramic coating bonded to the paint, glass, and wheels. Water beads off, dirt struggles to grip, the shine sticks around.",
      image: "assets/process/04-protection.webp"
    },
    {
      step: "05",
      title: "Final inspection + handover",
      body: "Inspected under bright light from every angle. You get photos and care instructions before I drive off your driveway.",
      image: "assets/process/05-handover.webp"
    }
  ],

  // Gallery seeded with placeholder paths — Nicholas will swap in actual IG pull.
  // Categories drive the horizontal "by occasion" row.
  gallery: [
    { src: "assets/gallery/01.webp", alt: "Black sedan, full ceramic finish",      category: "daily" },
    { src: "assets/gallery/02.webp", alt: "White SUV, paint correction",            category: "daily" },
    { src: "assets/gallery/03.webp", alt: "Wedding car, showroom prep",             category: "wedding" },
    { src: "assets/gallery/04.webp", alt: "Range Rover, full interior reset",       category: "daily" },
    { src: "assets/gallery/05.webp", alt: "Black show car under garage lights",     category: "special" },
    { src: "assets/gallery/06.webp", alt: "Motorhome exterior detail, coastal",     category: "motorhome" },
    { src: "assets/gallery/07.webp", alt: "Hilux ute, post-correction shine",       category: "daily" },
    { src: "assets/gallery/08.webp", alt: "Mercedes prepped for resale",            category: "resale" },
    { src: "assets/gallery/09.webp", alt: "BMW M-series at golden hour",            category: "special" },
    { src: "assets/gallery/10.webp", alt: "Tesla interior, leather conditioning",   category: "daily" },
    { src: "assets/gallery/11.webp", alt: "Caravan side-panel decontamination",     category: "motorhome" },
    { src: "assets/gallery/12.webp", alt: "Audi RS finished, ceramic beading",      category: "daily" },
    { src: "assets/gallery/13.webp", alt: "Bridal car, ribbon-ready",               category: "wedding" },
    { src: "assets/gallery/14.webp", alt: "Sale-ready Hyundai for dealer handover", category: "resale" },
    { src: "assets/gallery/15.webp", alt: "GT-R, full paint protection",            category: "special" }
  ],

  galleryCategories: [
    { id: "daily",     label: "Daily drivers" },
    { id: "wedding",   label: "Weddings" },
    { id: "resale",    label: "Sale-ready" },
    { id: "special",   label: "Special occasion" },
    { id: "motorhome", label: "Motorhomes & RVs" }
  ],

  // Ship with ONE honest placeholder if no real reviews are available yet.
  // Source 'placeholder' renders an italicised "Placeholder — review coming" badge in dev only.
  testimonials: [
    {
      name: "Real review pending",
      suburb: "Gold Coast",
      vehicle: "—",
      quote: "Real customer quotes go here once Gracie shares Google or IG comment screenshots.",
      rating: 5,
      source: "placeholder"
    }
  ],

  faq: [
    {
      q: "How do I book?",
      a: "Use the price builder above and hit 'Book this slot' — it sends Gracie the details and she'll confirm a time. Or message her on Instagram, or call direct."
    },
    {
      q: "Do you come to me?",
      a: "Yes. Mobile across the Gold Coast — Surfers, Broadbeach, Burleigh, Mermaid, Robina, Palm Beach and surrounding. Just need a flat space and a tap nearby."
    },
    {
      q: "How long will it take?",
      a: "Express Glow is about 90 minutes. Signature Detail is 3–4 hours. Showroom Restore is a full day — we'll lock in a Saturday so it doesn't interrupt your week."
    },
    {
      q: "What does it cost?",
      a: "Prices start from $189 and scale with vehicle size and condition. The price builder gives you an instant estimate — no quote-back nonsense."
    },
    {
      q: "Do you do ceramic coatings?",
      a: "Yes — entry-level 3-month spray sealant is included in Signature, and proper 9-month coating comes with Showroom Restore. Upgrade to 24-month available."
    },
    {
      q: "What if I'm not happy?",
      a: "I'll come back and re-do anything you're not 100% on. No fuss, no charge. Detailing is a one-shot first impression — I'd rather get it right twice than lose your trust."
    },
    {
      q: "Are you insured?",
      a: "Fully insured for damage and liability. Documentation available on request."   // CONFIRM
    },
    {
      q: "Do you take cash, card, or transfer?",
      a: "All three. Card via tap on the day, bank transfer in advance, or cash when I hand the keys back."
    }
  ],

  founder: {
    name: "Gracie",                                        // CONFIRM full name
    role: "Owner & detailer",
    photo: "assets/founder/gracie.webp",                   // CONFIRM
    bio: "Gold Coast born and based. Started Goldy because she couldn't find a detailer who treated every car like the one in their own garage. Now she's the one her clients call back — and the one they recommend to their mates. Every booking goes through her directly.", // CONFIRM — Nicholas to write the real bio
    signature: "— G."
  },

  // ---- BOOKING (demo mode: mailto only) ----
  booking: {
    mode: "mailto",
    mailtoTarget: "hello@goldycardetailing.com.au",        // CONFIRM
    fallbackPhone: "0400 000 000",                          // CONFIRM
    fallbackPhoneHref: "tel:+61400000000",
    responseTimeLabel: "Gracie replies in ~15 min during the day",
    instagramDm: "https://ig.me/m/goldycardetailing"
  },

  // ---- ONE FULL SUBURB PAGE TEMPLATE — others are stubbed ----
  suburbs: [
    {
      slug: "surfers-paradise",
      name: "Surfers Paradise",
      region: "Central Gold Coast",
      heroImage: "assets/hero/after.webp",
      built: true,
      blurb: "Mobile car detailing in Surfers Paradise — apartments, high-rises, hotel forecourts and home driveways. Gracie comes to you, full water + power supply on board.",
      neighbourhoods: ["Cypress Ave", "Garfield Tce", "View Ave", "Northcliffe Tce"]
    },
    { slug: "broadbeach",     name: "Broadbeach",      region: "Central Gold Coast", built: false },
    { slug: "burleigh-heads", name: "Burleigh Heads",  region: "Southern Gold Coast", built: false },
    { slug: "mermaid-beach",  name: "Mermaid Beach",   region: "Central Gold Coast", built: false },
    { slug: "robina",         name: "Robina",          region: "Central Gold Coast", built: false }
  ],

  // ---- SCHEMA SLOT ----
  schema: {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    additionalType: "https://schema.org/AutoDetailing",
    name: "Goldy Car Detailing",
    description: "Mobile car detailing on the Gold Coast — express glow, signature detail and full ceramic showroom restore. Booked direct with Gracie.",
    priceRange: "$$",
    image: "https://fiqwy.github.io/goldy-car-detailing/assets/og/og-image.jpg",
    url: "https://fiqwy.github.io/goldy-car-detailing/",
    telephone: "+61400000000",
    areaServed: { "@type": "City", name: "Gold Coast" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gold Coast",
      addressRegion: "QLD",
      addressCountry: "AU"
    },
    sameAs: ["https://www.instagram.com/goldycardetailing/"]
  },

  // Visual override — empty = use defaults. Drop overrides here to re-theme.
  theme: {
    // gold: "#E0B872",   // example override
  }
});
