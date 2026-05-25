// ============================================================
// GOLDY CAR DETAILING — SINGLE SOURCE OF TRUTH
// ============================================================
// Built from a full IG scrape of @goldycardetailing (2026-05-25).
// Real packages, real prices, real phone, real cars detailed.
// Every `// CONFIRM` still needs Gracie's final sign-off.
// ============================================================

export const content = Object.freeze({

  brand: {
    name: "Goldy Car Detailing",
    wordmark: "GOLDY",
    tagline: "Showroom finish. At your driveway.",
    phone: "0427 798 045",                              // ✓ pulled from IG captions
    phoneHref: "tel:+61427798045",
    email: "goldycardetailing@gmail.com",                // CONFIRM with Gracie
    instagram: "@goldycardetailing",
    instagramUrl: "https://www.instagram.com/goldycardetailing/",
    abn: "",                                             // CONFIRM
    region: "Gold Coast, QLD",
    founderPositioning: "Female-owned · Gold Coast born",// ✓ from IG hashtags
    suburbsServed: [
      "Surfers Paradise", "Broadbeach", "Burleigh Heads",
      "Mermaid Beach", "Robina", "Burleigh Waters",
      "Palm Beach", "Currumbin", "Varsity Lakes", "Tugun"
    ]
  },

  hero: {
    eyebrow: "Mobile detailing · Gold Coast",
    headlineLines: [
      "Showroom finish.",
      "At your driveway."  // italic gold gradient
    ],
    sub: "Hand-finished mobile detailing — cars, 4WDs, bikes, vans, motorhomes. Booked direct with Gracie. No call centre. No quote-back. No shortcuts.",
    primaryCta: { label: "Build my price · 60s", href: "#configurator" },
    secondaryCta: { label: "Text Gracie · 0427 798 045", href: "sms:+61427798045" },
    beforeAfter: {
      before: "assets/hero/before.jpg",       // ig-17 HSV Clubsport (dimmed via CSS filter)
      after:  "assets/hero/after.jpg",        // ig-17 HSV Clubsport (vivid via CSS filter)
      label:  "Scroll to see the difference"
    }
  },

  // Benefits-led trust strip — only one stat is rounded, rest are factual badges
  trustStrip: [
    { value: "100", suffix: "+", label: "cars detailed · Gold Coast" },     // ✓ approx from 84 IG posts
    { value: "5",   suffix: "★", label: "word of mouth driven" },           // CONFIRM — based on returning clients
    { value: "0",   label: "shop visits — Gracie comes to you" },
    { value: "FREE",label: "personalised quote · ~15 min reply" }
  ],

  // HER REAL PACKAGE NAMES from IG captions
  packages: [
    {
      id: "silver",
      tier: "Silver Package",
      priceFrom: 189,                                      // CONFIRM with Gracie
      turnaround: "90 min – 2 hrs",
      summary: "The refresher. Keeps a clean car looking sharp between deeper details.",
      includes: [
        "Snow-foam pre-wash + 2-bucket hand wash",
        "Wheels, arches and tyres dressed",
        "Interior vacuum + plastics wipe-down",
        "Windows inside and out",
        "Tyre shine + spray sealant top-up"
      ],
      finishPlate: "assets/hero/plate-matte.svg"
    },
    {
      id: "gold",
      tier: "Gold 🥇 Package",
      priceFrom: 329,                                      // CONFIRM
      turnaround: "3–4 hours",
      summary: "Brings a car back to looking like new. Inside and out, every surface.",
      includes: [
        "Full exterior decontamination (iron + tar removal)",
        "Clay treatment for glass-smooth paint",
        "Single-stage machine polish — light swirls removed",
        "Full interior shampoo (seats, carpets, mats)",
        "Plastics cleaned + coated · leather conditioned · windows like new"
      ],
      popular: true,
      finishPlate: "assets/hero/plate-satin.svg"
    },
    {
      id: "diamond",
      tier: "Diamond 💎 Package",
      priceFrom: 549,                                      // CONFIRM
      turnaround: "Full day",
      summary: "Sale-ready, show-ready, wedding-ready. The full restoration.",
      includes: [
        "Everything in Gold 🥇 Package",
        "Two-stage paint correction (deeper swirls + holograms removed)",
        "9-month ceramic coating on paint, glass + wheels",
        "Engine bay detail + door jambs",
        "Photo handover — before/after for your records"
      ],
      finishPlate: "assets/hero/plate-mirror.svg"
    }
  ],

  // Bonus offer — Gracie's actual maintenance plan (referenced 5x in captions)
  maintenancePlan: {
    enabled: true,
    title: "Maintenance Plan",
    badge: "Limited spots",
    blurb: "Fortnightly or 5-week recurring detail — set and forget. Returning clients only.",
    priceFrom: 129,                                        // CONFIRM
    cadenceOptions: ["Fortnightly", "Monthly", "5-weekly"]
  },

  sizeMultipliers: {
    small:    { label: "Hatch / sedan",         multiplier: 1.0,  icon: "hatch" },
    mid:      { label: "Wagon / mid SUV",       multiplier: 1.15, icon: "suv" },
    suv:      { label: "Large SUV / Ute",       multiplier: 1.3,  icon: "ute" },
    fourwd:   { label: "4WD / Van",             multiplier: 1.45, icon: "fourwd" },
    motorhome:{ label: "Motorhome / Caravan",   multiplier: 2.0,  icon: "motorhome" },
    bike:     { label: "Motorcycle",            multiplier: 0.7,  icon: "bike" }   // Harley + Suzuki VZ1500 in her IG
  },

  goals: [
    { id: "shine",    label: "Maintenance shine",     blurb: "Keep it sharp between deep cleans.",         packageId: "silver" },
    { id: "restore",  label: "Bring it back",          blurb: "Years of grime, swirls, neglect — reset it.", packageId: "gold" },
    { id: "sale",     label: "Sale-ready",             blurb: "Hand it to the buyer at its best.",          packageId: "diamond" },
    { id: "special",  label: "Special occasion",       blurb: "Wedding, show, milestone, gift.",            packageId: "diamond" }
  ],

  addOns: [
    { id: "petHair",     name: "Pet hair removal",            price: 45,  note: "Per vehicle" },
    { id: "leather",     name: "Deep leather conditioning",   price: 65,  note: "Adds ~30 min" },
    { id: "headlights",  name: "Headlight restoration",       price: 95,  note: "Pair, restores clarity" },
    { id: "engineBay",   name: "Engine bay detail",           price: 75,  note: "Plastics dressed, no risk" },
    { id: "ceramic9",    name: "Upgrade to 24-month ceramic", price: 220, note: "Diamond tier only" }
  ],

  // 5-step process — the journey, with real photos
  process: [
    {
      step: "01",
      title: "Inspection + plan",
      body: "Every detail starts with the paint. Gauge, inspection light, walk-around. Every car gets a different plan, never a template.",
      image: "assets/process/01-assessment.jpg"
    },
    {
      step: "02",
      title: "Decontamination",
      body: "Snow foam pre-wash, two-bucket wash, iron remover, tar remover, then a clay treatment until the paint is glass-smooth to the touch.",
      image: "assets/process/02-decon.jpg"
    },
    {
      step: "03",
      title: "Correction",
      body: "Single or two-stage machine polish, refining the finish until light bounces clean off the panel. No haze, no swirls, no shortcuts.",
      image: "assets/process/03-correction.jpg"
    },
    {
      step: "04",
      title: "Protection",
      body: "Ceramic coating bonded to paint, glass and wheels. Water beads off, dirt struggles to grip, the shine sticks around for months — not days.",
      image: "assets/process/04-protection.jpg"
    },
    {
      step: "05",
      title: "Final inspection + handover",
      body: "Inspected under bright light from every angle. Diamond tier includes a photo handover for your records. Then I'm out of your driveway.",
      image: "assets/process/05-handover.jpg"
    }
  ],

  // 15 cars, all real, all from her IG portfolio
  gallery: [
    { src: "assets/gallery/01-bmw-x3.jpg",                alt: "BMW X3 — Gold Package finish",                              category: "daily"   },
    { src: "assets/gallery/02-audi-sq7.jpg",              alt: "2019 Audi SQ7 — basic wash & interior",                     category: "daily"   },
    { src: "assets/gallery/03-discovery.jpg",             alt: "Land Rover Discovery — full detail, showroom glow",         category: "daily"   },
    { src: "assets/gallery/04-audi.jpg",                  alt: "Audi — shine restored",                                     category: "daily"   },
    { src: "assets/gallery/05-ford-raptor.jpg",           alt: "Ford Raptor — quick interior + exterior detail",            category: "daily"   },
    { src: "assets/gallery/06-r34-skyline.jpg",           alt: "Nissan R34 Skyline — on maintenance list",                  category: "special" },
    { src: "assets/gallery/07-skyline-fortnightly.jpg",   alt: "Skyline — fortnightly maintenance plan",                    category: "special" },
    { src: "assets/gallery/08-porsche.jpg",               alt: "Porsche — 3rd detail, looks newer every time",              category: "special" },
    { src: "assets/gallery/09-porsche-cayenne.jpg",       alt: "Porsche Cayenne — basic detail, anything but basic finish", category: "special" },
    { src: "assets/gallery/10-denali.jpg",                alt: "GMC Denali — full care, premium results",                   category: "special" },
    { src: "assets/gallery/11-chevy-apache-1959.jpg",     alt: "1959 Chevrolet Apache — classic ute, showroom maintenance", category: "special" },
    { src: "assets/gallery/12-santa-fe-sale.jpg",         alt: "Hyundai Santa Fe — Diamond Package, sale-ready",            category: "resale"  },
    { src: "assets/gallery/13-musso-sale.jpg",            alt: "SsangYong Musso — sale detail package",                     category: "resale"  },
    { src: "assets/gallery/14-commodore-250.jpg",         alt: "Holden Commodore — $250 full reset",                        category: "resale"  },
    { src: "assets/gallery/15-gooseneck-sale.jpg",        alt: "Gooseneck towing package — full makeover for sale",         category: "resale"  }
  ],

  galleryCategories: [
    { id: "daily",   label: "Daily drivers" },
    { id: "special", label: "Special builds" },
    { id: "resale",  label: "Sale-ready" },
    { id: "bikes",   label: "Bikes" },        // ig-11 Suzuki + ig-22 Harley both detailed
    { id: "vans",    label: "Vans & RVs" }   // ig-18 Hiace + ig-23 dog van + motorhome highlight
  ],

  // SHIP HONEST — one placeholder marked as such until Gracie shares real screenshots.
  // Suggested Phase-2 sources: IG comment screenshots, Google Reviews, DMs (with permission).
  testimonials: [
    {
      name: "Real reviews coming soon",
      suburb: "Gold Coast",
      vehicle: "—",
      quote: "Gracie's IG comments + DMs are full of returning-client praise. Once she shares the screenshots (with names she has permission to use), they swap in here. Nothing fake gets shipped.",
      rating: 5,
      source: "placeholder"
    }
  ],

  faq: [
    {
      q: "How do I book?",
      a: "Fastest is the price builder above — two taps and Gracie has your enquiry. Or text her direct on 0427 798 045, or DM @goldycardetailing on Instagram. Replies usually inside 15 minutes during the day."
    },
    {
      q: "Do you come to me?",
      a: "Yes — mobile across the Gold Coast. Surfers, Broadbeach, Burleigh, Mermaid, Robina, Palm Beach and surrounding. Just need a flat space and a tap nearby. Apartments and high-rises welcome — Gracie's done plenty."
    },
    {
      q: "What do you actually detail?",
      a: "Cars (daily drivers to Porsches), 4WDs, utes, vans, motorbikes (Harleys and sportbikes), motorhomes, caravans, horsefloats. If it has wheels, Gracie can detail it."
    },
    {
      q: "How long does it take?",
      a: "Silver Package is about 90 minutes to 2 hours. Gold 🥇 is 3–4 hours. Diamond 💎 is a full day — we'll lock in a Saturday so it doesn't interrupt your week."
    },
    {
      q: "What does it cost?",
      a: "Prices start from $189 and scale with vehicle size only — no surprise quote-back. The price builder gives you an instant estimate. For reference: a recent Holden Commodore full interior reset was $250."
    },
    {
      q: "Do you do ceramic coatings?",
      a: "Yes. Gold 🥇 includes a 3-month spray sealant. Diamond 💎 includes a proper 9-month bonded ceramic coating on paint, glass and wheels. 24-month upgrade available as an add-on."
    },
    {
      q: "What's the maintenance plan?",
      a: "Returning clients can join a fortnightly, monthly or 5-weekly schedule. Limited spots — Gracie keeps the list small to protect quality. Porsches, Skylines and a 1959 Chevy are all current regulars."
    },
    {
      q: "What if I'm not happy?",
      a: "Gracie comes back and re-does anything you're not 100% on. No fuss, no charge. Detailing is a one-shot first impression — she'd rather get it right twice than lose your trust."
    },
    {
      q: "Are you insured?",
      a: "Fully insured for damage and liability. Documentation available on request."   // CONFIRM
    }
  ],

  founder: {
    name: "Gracie",                                       // CONFIRM full name
    role: "Owner & detailer",
    photo: "assets/founder/gracie.jpg",                   // ig-02 "I Know Ball"
    bio: "Gold Coast born and based. Goldy is owner-operated — Gracie does every booking herself, from the inspection to the handover. She started it because she couldn't find a detailer who treated every car like the one in their own garage. Now her returning clients book her months out, and her work speaks for itself in the gallery above. Female-owned, no-nonsense, no shortcuts.",  // CONFIRM — Nicholas to polish
    signature: "— G."
  },

  booking: {
    mode: "mailto",
    mailtoTarget: "goldycardetailing@gmail.com",          // CONFIRM
    fallbackPhone: "0427 798 045",
    fallbackPhoneHref: "tel:+61427798045",
    smsHref: "sms:+61427798045",
    responseTimeLabel: "Gracie replies in ~15 min during the day",
    instagramDm: "https://ig.me/m/goldycardetailing"
  },

  suburbs: [
    {
      slug: "surfers-paradise",
      name: "Surfers Paradise",
      region: "Central Gold Coast",
      heroImage: "assets/hero/after.jpg",
      built: true,
      blurb: "Mobile car detailing in Surfers Paradise — apartments, high-rises, hotel forecourts and home driveways.",
      neighbourhoods: ["Cypress Ave", "Garfield Tce", "View Ave", "Northcliffe Tce"]
    },
    { slug: "broadbeach",     name: "Broadbeach",      region: "Central Gold Coast",  built: false },
    { slug: "burleigh-heads", name: "Burleigh Heads",  region: "Southern Gold Coast", built: false },
    { slug: "mermaid-beach",  name: "Mermaid Beach",   region: "Central Gold Coast",  built: false },
    { slug: "robina",         name: "Robina",          region: "Central Gold Coast",  built: false }
  ],

  schema: {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    additionalType: "https://schema.org/AutoDetailing",
    name: "Goldy Car Detailing",
    description: "Mobile car detailing on the Gold Coast — cars, 4WDs, bikes, vans, motorhomes. Silver, Gold and Diamond packages from $189. Female-owned. Direct with Gracie.",
    priceRange: "$$",
    image: "https://fiqwy.github.io/goldy-car-detailing/assets/og/og-image.jpg",
    url: "https://fiqwy.github.io/goldy-car-detailing/",
    telephone: "+61427798045",
    areaServed: { "@type": "City", name: "Gold Coast" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gold Coast",
      addressRegion: "QLD",
      addressCountry: "AU"
    },
    sameAs: ["https://www.instagram.com/goldycardetailing/"]
  },

  theme: {
    // gold: "#E0B872",   // override here if Gracie's brand wants warmer/cooler
  }
});
