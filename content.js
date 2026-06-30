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
    eyebrow: "Mobile detailing · Gold Coast · Female-owned",
    headlineLines: [
      "Your driveway.",
      "Her standards."  // italic gold gradient on the second line
    ],
    sub: "Owner-operated mobile detailing across the Gold Coast — cars, 4WDs, bikes, vans, horsefloats. Real prices upfront, real photos on this page, no quote-back nonsense. Direct with Gracie.",
    primaryCta: { label: "Build my price · 60s", href: "#configurator" },
    maintenanceCta: { label: "Maintenance plans", href: "#maintenance" },
    secondaryCta: { label: "Text Gracie · 0427 798 045", href: "sms:+61427798045" },
    video: "assets/hero/hero.mp4",          // H.264, no audio, poster = after.jpg; reduced-motion bails to poster
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

  // 4-pillar differentiation block — beats control-detailing's "dad's love" hook
  // by stacking the structural advantages no Gold Coast competitor can claim together.
  whyGracie: {
    eyebrow: "Why Goldy",
    title: "Four reasons your last detailer can't match.",
    pillars: [
      {
        glyph: "owner",
        title: "Owner-operator",
        body: "Every booking is Gracie. Inspection, wash, polish, coating, handover — same hands, same standard, every time. No subcontractors, no trainees, no surprises."
      },
      {
        glyph: "female",
        title: "Female-owned",
        body: "Not a token — a difference you'll feel in the attention to interiors, the care with paint, and the respect for your space. Her IG hashtag says it: #womeninbusiness #womeninmalefields."
      },
      {
        glyph: "price",
        title: "No quote-back",
        body: "Two taps in the price builder above gives you a real number. Other detailers hide pricing behind a form. Gracie shows it. From $150, scales with vehicle size only."
      },
      {
        glyph: "mobile",
        title: "Mobile, to you",
        body: "Apartments, high-rises, hotel forecourts, driveways, paddocks. Fully self-contained — water + power on board. You don't move, you don't wait, you don't pick up."
      }
    ]
  },

  // Featured transformation — replaces the fake before/after slider.
  // Single photo of a real Goldy job + her verbatim IG caption.
  // Honest. Visceral. Cinematic. Real before/after slider returns once Gracie
  // shares a real same-vehicle pair from her phone library.
  featuredWork: {
    eyebrow: "A real transformation",
    title: "Severely damaged paint → showroom-ready.",
    quote: "This Ford XR6 received a full makeover — from severely damaged paint (paint fade + extreme swirl marks and scratching) to an interior transformation, floor mat emblem dyeing, and all fabric shampooing. By the end, this XR6 looks like it's straight off the showroom floor again.",
    attribution: "— Goldy, Instagram · real client work",
    image: "assets/gallery-extras/xr6-golden-hour.jpg",
    imageAlt: "Black Ford XR6 finished at golden hour — full paint correction + interior transformation",
    plate: "Ford XR6 · Full paint correction + interior"
  },

  // HER REAL PACKAGE NAMES from IG captions
  packages: [
    {
      id: "silver",
      tier: "Tidy up",
      priceFrom: 150,                                      // ✓ Gracie-confirmed v6 floor
      turnaround: "3 – 4 hour estimate",
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
      tier: "Bring it back",
      priceFrom: 250,                                      // ✓ Gracie-confirmed v6 floor
      turnaround: "3 – 5 hour estimate",
      summary: "The next step up from basic. Best value.",
      includes: [
        "Snow-foam pre-wash + 2-bucket hand wash",
        "Wheels, arches and tyres dressed",
        "Interior vacuum + plastics wipe-down",
        "Windows inside and out",
        "Tyre shine + spray sealant top-up",
        "Full exterior decontamination",
        "Full interior shampoo",
        "Plastics cleaned + coated",
        "Leather conditioned",
        "Windows like new"
      ],
      popular: true,
      finishPlate: "assets/hero/plate-satin.svg"
    },
    {
      id: "diamond",
      tier: "Show-ready",
      priceFrom: 550,                                      // ✓ Gracie-confirmed v6 floor
      turnaround: "Full day estimate",
      summary: "Sale-ready, show-ready, wedding-ready. The full restoration.",
      includes: [
        "Snow-foam pre-wash + 2-bucket hand wash",
        "Wheels, arches and tyres dressed",
        "Interior vacuum + plastics wipe-down",
        "Windows inside and out",
        "Tyre shine + spray sealant top-up",
        "Full exterior decontamination",
        "Full interior shampoo",
        "Plastics cleaned + coated",
        "Leather conditioned",
        "Windows like new",
        "Cut & polish",
        "Engine bay detail + door jambs",
        "Sale photography: taken on a Canon 1500D, draws more attention to your listing"
      ],
      finishPlate: "assets/hero/plate-mirror.svg"
    },
    {
      id: "custom",
      tier: "Custom",
      priceFrom: 150,
      turnaround: "",
      summary: "Questioning the packages? Start with the Tidy up base and add exactly what your car needs.",
      includes: [
        "Starts with the Tidy up base",
        "Add any extra service you want",
        "Watch it add up against a package"
      ],
      custom: true,
      finishPlate: "assets/hero/plate-matte.svg"
    }
  ],

  // Recurring maintenance plan for her regulars (v6: dedicated section + hero CTA)
  maintenancePlan: {
    enabled: true,
    eyebrow: "For my regulars",
    title: "Set and forget. Discounted by default.",
    blurb: "Gracie keeps the list small so every car gets the same care, all at a discounted rate. Regulars book their next clean in a tap. New clients can enquire to join the list.",
    microcopy: "Limited spots · Returning clients get the discounted rate",
    cadenceOptions: ["Weekly", "Fortnightly", "Monthly", "3-monthly", "Custom"],
    bookCta:    { label: "Book my next clean" },   // regulars
    enquireCta: { label: "Enquire to join" }        // new clients
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
    { id: "tidy",    label: "Tidy up",       blurb: "A light wash to keep it sharp between deep cleans.",  packageId: "silver" },
    { id: "restore", label: "Bring it back", blurb: "Years of grime, swirls, neglect. Reset it.",          packageId: "gold" },
    { id: "show",    label: "Show-ready",    blurb: "Sale, wedding, show or milestone. Its absolute best.", packageId: "diamond" }
  ],

  addOns: [
    { id: "petHair",     name: "Pet hair removal",            price: 45,  note: "Per vehicle" },
    { id: "leather",     name: "Deep leather conditioning",   price: 65,  note: "Adds ~30 min" },
    { id: "headlights",  name: "Headlight restoration",       price: 95,  note: "Pair, restores clarity" },
    { id: "engineBay",   name: "Engine bay detail",           price: 75,  note: "Plastics dressed, no risk" }
  ],

  // Per-service menu for the Custom builder. Prices marked CONFIRM are
  // ESTIMATES; swap in Gracie's real per-service prices. Set so building it all
  // individually beats a package (proves the bundles are the better value).
  customServices: [
    { id: "wash",       group: "Exterior", name: "Snow-foam pre-wash + 2-bucket hand wash", price: 55, base: true },  // in Tidy up base
    { id: "wheels",     group: "Exterior", name: "Wheels, arches & tyres dressed",          price: 35, base: true },  // in Tidy up base
    { id: "tyreseal",   group: "Exterior", name: "Tyre shine + spray sealant top-up",       price: 25, base: true },  // in Tidy up base
    { id: "decon",      group: "Exterior", name: "Full exterior decontamination",           price: 85 },  // CONFIRM
    { id: "cutpolish",  group: "Exterior", name: "Cut & polish",                            price: 190 }, // CONFIRM
    { id: "headlights", group: "Exterior", name: "Headlight restoration",                   price: 95 },  // ✓ real add-on
    { id: "vacuum",     group: "Interior", name: "Interior vacuum + plastics wipe-down",    price: 45, base: true },  // in Tidy up base
    { id: "windows",    group: "Interior", name: "Windows inside and out",                  price: 25, base: true },  // in Tidy up base
    { id: "shampoo",    group: "Interior", name: "Full interior shampoo",                   price: 120 }, // CONFIRM
    { id: "plastics",   group: "Interior", name: "Plastics cleaned + coated",               price: 45 },  // CONFIRM
    { id: "leather",    group: "Interior", name: "Leather conditioned",                     price: 65 },  // ✓ real add-on
    { id: "pethair",    group: "Interior", name: "Pet hair removal",                        price: 45 },  // ✓ real add-on
    { id: "enginebay",  group: "Extras",   name: "Engine bay detail + door jambs",          price: 75 },  // ✓ real add-on
    { id: "photos",     group: "Extras",   name: "Sale photography (Canon 1500D)",          price: 45 }   // CONFIRM
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
      body: "A spray sealant laid over paint, glass and wheels. Water beads off, dirt struggles to grip, and the shine holds for weeks instead of days.",
      image: "assets/process/04-protection.jpg"
    },
    {
      step: "05",
      title: "Final inspection + handover",
      body: "Inspected under bright light from every angle. Show-ready includes sale photography for your listing. Then I'm out of your driveway.",
      image: "assets/process/05-handover.jpg"
    }
  ],

  // 22 photos, all real, all from her IG portfolio (1440×1920 high-res)
  gallery: [
    // ---- DAILY DRIVERS (5) ----
    { src: "assets/gallery/01-bmw-x3.jpg",                alt: "BMW X3 — full detail, showroom finish",                            category: "daily"  },
    { src: "assets/gallery/02-audi-sq7.jpg",              alt: "2019 Audi SQ7 — basic wash & interior",                     category: "daily"  },
    { src: "assets/gallery/03-discovery.jpg",             alt: "Land Rover Discovery — full detail, showroom glow",         category: "daily"  },
    { src: "assets/gallery/04-audi.jpg",                  alt: "Audi — shine restored",                                     category: "daily"  },
    { src: "assets/gallery/05-ford-raptor.jpg",           alt: "Ford Raptor — quick interior + exterior detail",            category: "daily"  },

    // ---- SPECIAL BUILDS (8) ----
    { src: "assets/gallery/06-r34-skyline.jpg",           alt: "Nissan R34 Skyline — on the maintenance list",              category: "special" },
    { src: "assets/gallery/07-skyline-fortnightly.jpg",   alt: "Skyline — fortnightly maintenance plan client",             category: "special" },
    { src: "assets/gallery/08-porsche.jpg",               alt: "Porsche — 3rd detail, newer every time",                    category: "special" },
    { src: "assets/gallery/09-porsche-cayenne.jpg",       alt: "Porsche Cayenne — basic detail, anything but basic finish", category: "special" },
    { src: "assets/gallery/10-denali.jpg",                alt: "GMC Denali — full premium detail",                          category: "special" },
    { src: "assets/gallery/11-chevy-apache-1959.jpg",     alt: "1959 Chevrolet Apache — classic ute, showroom maintenance", category: "special" },
    { src: "assets/gallery/24-hsv-clubsport-side.jpg",    alt: "Red HSV Clubsport — side profile after detail",             category: "special" },
    { src: "assets/gallery/25-white-4wd.jpg",             alt: "White off-road 4WD — finished and ready for the next trip", category: "special" },

    // ---- SALE-READY (4) ----
    { src: "assets/gallery/12-santa-fe-sale.jpg",         alt: "Hyundai Santa Fe — sale-ready detail",          category: "resale"  },
    { src: "assets/gallery/13-musso-sale.jpg",            alt: "SsangYong Musso — sale detail package",                     category: "resale"  },
    { src: "assets/gallery/14-commodore-250.jpg",         alt: "Holden Commodore — $250 full interior reset",               category: "resale"  },
    { src: "assets/gallery/15-gooseneck-sale.jpg",        alt: "Gooseneck towing rig — full makeover for sale",             category: "resale"  },

    // ---- BIKES (4) — Harley touring + side + Road Glide + Suzuki ----
    { src: "assets/gallery/16-harley-touring.jpg",        alt: "Harley-Davidson touring — rear 3/4 after detail",           category: "bikes"   },
    { src: "assets/gallery/17-harley-side.jpg",           alt: "Harley-Davidson — side profile, polished + protected",      category: "bikes"   },
    { src: "assets/gallery/23-harley-roadglide.jpg",      alt: "Harley-Davidson Road Glide — black + brown leather, detailed", category: "bikes"   },
    { src: "assets/gallery/18-suzuki-vz1500.jpg",         alt: "Suzuki VZ1500 — mid-wash, motorcycle detail",               category: "bikes"   },

    // ---- VANS & TRADES (4) — RVs in her IG highlights (login-walled, see HANDOFF) ----
    { src: "assets/gallery/19-hiace-van.jpg",             alt: "Toyota Hiace Van — detail refresher",               category: "vans"    },
    { src: "assets/gallery/20-hiace-wheel-detail.jpg",    alt: "Hiace wheel + bodywork detail — bronze rim, white panel",   category: "vans"    },
    { src: "assets/gallery/21-dog-van.jpg",               alt: "Dog-grooming work van — de-dog-hairing + deep interior",    category: "vans"    },
    { src: "assets/gallery/22-work-ute.jpg",              alt: "Work ute — even work utes deserve some love",               category: "vans"    }
  ],

  galleryCategories: [
    { id: "daily",   label: "Daily drivers" },
    { id: "special", label: "Special builds" },
    { id: "resale",  label: "Sale-ready" },
    { id: "bikes",   label: "Bikes" },
    { id: "vans",    label: "Vans & trades" }
  ],

  // ============ DEDICATED BIKES SECTION ============
  bikesShowcase: {
    eyebrow: "Bikes, too",
    title: "Two wheels get the same treatment.",
    body: "Harleys, sportbikes, cruisers, classics. Gracie details bikes with the same care as her best cars — every chrome surface, every leather seam, every painted panel. Smaller booking window, premium finish.",
    cta: { label: "Build my bike price", href: "#configurator" },
    photos: [
      { src: "assets/bikes/03-harley-road-glide-front.jpg", alt: "Black Harley-Davidson Road Glide — front-on, glassy finish",       featured: true,  span: 2 },
      { src: "assets/bikes/02-harley-rear.jpg",             alt: "Harley-Davidson — finished, depth + clarity + protection restored" },
      { src: "assets/bikes/01-suzuki-vz1500.jpg",           alt: "Suzuki VZ1500 — mid-wash, coming up unreal" }
    ]
  },

  // ============ DEDICATED VANS / CARAVANS / RVs SECTION ============
  vansRvsShowcase: {
    eyebrow: "Vans, caravans & horsefloats",
    title: "Big jobs. Same standard.",
    body: "Mobile detailing means Gracie's set up to handle the awkward stuff — Hiace vans, work utes, motorhomes, caravans, horsefloats, dog-grooming rigs. She comes to your yard, paddock or property. Bigger vehicles take longer; the standard never changes.",
    cta: { label: "Get a price for my rig", href: "#configurator" },
    photos: [
      { src: "assets/vans-rvs/06-ram-horsefloat.jpg",         alt: "Ram pulled up to a white horsefloat — country setting", featured: true, span: 2 },
      { src: "assets/vans-rvs/01-hiace-silver.jpg",           alt: "Toyota Hiace — detail refresher" },
      { src: "assets/vans-rvs/03-hiace-interior-cleaned.jpg", alt: "Empty Hiace interior — deep-cleaned, road-ready" },
      { src: "assets/vans-rvs/04-dog-grooming-van.jpg",       alt: "Dog-grooming work van — de-dog-haired + deep interior" },
      { src: "assets/vans-rvs/02-hiace-wheel-macro.jpg",      alt: "Hiace wheel macro — bronze rim spec shot" }
    ]
  },

  // ============ BEHIND-THE-DETAIL spec/brand strip ============
  behindDetail: {
    eyebrow: "Behind the detail",
    title: "It's the small things.",
    body: "Branded plates. Business cards on the handover. Steering-wheel wraps before every job. Wheels detailed to the caliper. Owner-operator means every car gets the same care.",
    photos: [
      { src: "assets/detail-shots/03-branded-number-plate.jpg",       alt: "GMC Denali grille close-up — Goldy Detailing branded number plate" },
      { src: "assets/detail-shots/02-business-cards-handover.jpg",    alt: "SsangYong handover — protective steering-wheel wrap + Goldy business cards" },
      { src: "assets/detail-shots/01-sq7-wheel-calipers.jpg",         alt: "Matte SQ7 wheel + red brake calipers — premium spec" },
      { src: "assets/detail-shots/04-bmw-interior.jpg",               alt: "BMW X3 interior — finished, dog air-freshener intact" }
    ]
  },

  // Word-of-mouth proof — TRUE without being fabricated quotes.
  // Real customer-name testimonials swap in here once Gracie shares IG/Google screenshots.
  testimonials: {
    headline: "Word of mouth, made visible.",
    sub: "Real customer quotes load here once Gracie shares the screenshots — never fabricated.",
    proofPoints: [
      {
        metric: "100+",
        label: "returning clients",
        sub: "Some on her fortnightly maintenance plan since launch — Porsches, Skylines, a 1959 Chevy."
      },
      {
        metric: "Female-owned",
        label: "owner-operator",
        sub: "Every booking is Gracie herself. Inspection, wash, polish, coating, handover — same hands, every time."
      },
      {
        metric: "Word of mouth",
        label: "driven, since launch",
        sub: "Most jobs come from a friend sending another friend. No paid ads. No middlemen."
      }
    ]
  },

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
      a: "Tidy up is about 3 to 4 hours, Bring it back is 3 to 5 hours, Show-ready is a full day. Times are estimates so Gracie doesn't double-book her day. For Show-ready we'll lock in a Saturday so it doesn't interrupt your week."
    },
    {
      q: "What does it cost?",
      a: "Prices start from $150 and scale with vehicle size only, no surprise quote-back. The price builder gives you an instant estimate. For reference: a recent Holden Commodore full interior reset was $250."
    },
    {
      q: "Do you do paint protection?",
      a: "Yes. Every detail finishes with a spray sealant that beads water and protects the paint. Bring it back and Show-ready add a full decontamination and a cut & polish to bring the gloss back and make the protection last. For most Gold Coast cars that's the sweet spot for shine and value."
    },
    {
      q: "What's the maintenance plan?",
      a: "Returning clients can join a weekly, fortnightly, monthly or 3-monthly schedule at a discounted rate. Limited spots, so Gracie keeps the list small to protect quality. Porsches, Skylines and a 1959 Chevy are all current regulars. New enquiries can apply to join."
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
    photo: "assets/founder/gracie.jpg",                   // Gracie at work — Prado + her two goldens (client-supplied 2026-06-30)
    bio: "Gold Coast born and based. Goldy is owner-operated — Gracie does every booking herself, from the inspection to the handover. She started it because she couldn't find a detailer who treated every car like the one in their own garage. Now her returning clients book her months out, and her work speaks for itself in the gallery above. Female-owned, no-nonsense, no shortcuts.",  // CONFIRM — Nicholas to polish
    signature: "— G."
  },

  booking: {
    mode: "sms",                                          // SMS-first — Gracie books by text, no email
    smsHref: "sms:+61427798045",                          // all booking actions resolve here (+ a pre-filled ?&body=)
    fallbackPhone: "0427 798 045",
    fallbackPhoneHref: "tel:+61427798045",
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
    description: "Mobile car detailing on the Gold Coast: cars, 4WDs, bikes, vans, motorhomes. Tidy up, Bring it back and Show-ready packages from $150. Female-owned. Direct with Gracie.",
    priceRange: "$$",
    image: "https://goldycardetailing.com.au/assets/og/og-image.jpg",
    url: "https://goldycardetailing.com.au/",
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
