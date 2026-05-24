// PoolLens Chemical & Equipment Data
// Dosing factors sourced from Pool Math (TFP) verified formulas
// Volume formulas: standard industry calculations

window.CHEM_DATA = {

  // Pool Math verified dosing factors
  // Unit: amount per 1 ppm change per 10,000 gallons
  dosing: {
    fc: {
      label: "Free Chlorine (FC)",
      unit: "ppm", min: 2, max: 10, ideal: "3-6",
      products: [
        { id:"liquid10",   label:"Liquid Chlorine 10%",     unit:"fl oz", factor:12.85,  note:"Retail bleach. Reduces pH slightly." },
        { id:"liquid125",  label:"Liquid Chlorine 12.5%",   unit:"fl oz", factor:10.28,  note:"Commercial grade. Reduces pH slightly." },
        { id:"calHypo65",  label:"Cal-Hypo 65%",            unit:"oz dry",factor: 1.55,  note:"Raises calcium. Use for shock. Don't add directly to skimmer." },
        { id:"calHypo73",  label:"Cal-Hypo 73% (shock)",    unit:"oz dry",factor: 1.38,  note:"Strong shock. Pre-dissolve in bucket." },
        { id:"trichlor",   label:"Trichlor tabs/granular",  unit:"oz dry",factor: 1.10,  note:"Lowers pH and raises CYA. Tabs only for dispensers." },
        { id:"dichlor56",  label:"Dichlor 56%",             unit:"oz dry",factor: 1.56,  note:"Raises CYA faster than trichlor. Good for first-time use." },
        { id:"bleach825",  label:"Household Bleach 8.25%",  unit:"fl oz", factor:15.63,  note:"No stabilizer. Good for SLAM. Reduces pH." }
      ]
    },
    ph: {
      label: "pH",
      unit: "", min: 7.2, max: 7.8, ideal: "7.4-7.6",
      raise: [
        { id:"sodaAsh",    label:"Soda Ash (pH Up)",         unit:"oz dry", note:"Raises pH and TA. 6oz per 0.2pH per 10k gal at TA=100 (approx)" },
        { id:"borates",    label:"Sodium Tetraborate",       unit:"oz dry", note:"Raises pH. Stabilizes pH long-term." }
      ],
      lower: [
        { id:"muriaticAcid",label:"Muriatic Acid 31.45%",   unit:"fl oz",  note:"Lowers pH and TA. Pre-dilute in bucket of water." },
        { id:"dryAcid",    label:"Dry Acid (Sodium Bisulfate)", unit:"oz dry", note:"Lowers pH and TA. Safer to handle than muriatic." }
      ],
      // pH adjust factors: more complex due to TA dependence
      // fl oz muriatic per 0.1 pH decrease per 10k gallons (at various TA levels)
      muriaticFactor: { 50: 2.0, 75: 2.8, 100: 3.5, 125: 4.2, 150: 5.0 }, // TA → fl oz
      sodaAshFactor: 3.0  // oz dry per 0.1 pH increase per 10k gal (rough — varies with TA)
    },
    ta: {
      label: "Total Alkalinity (TA)",
      unit: "ppm", min: 80, max: 120, ideal: "80-100",
      raise: [
        { id:"bakingSoda", label:"Baking Soda (Sodium Bicarbonate)", unit:"lbs",
          factor: 1.5,  // lbs per 10 ppm per 10,000 gal
          note:"Raises TA with minor pH impact. Standard TA increaser." }
      ],
      lower: [
        { id:"muriaticAcid",label:"Muriatic Acid 31.45%", unit:"fl oz",
          note:"Add acid to lower TA, then aerate to raise pH back up. Multiple doses needed." }
      ]
    },
    ch: {
      label: "Calcium Hardness (CH)",
      unit: "ppm", min: 200, max: 400, ideal: "200-400",
      raise: [
        { id:"calciumChloride", label:"Calcium Chloride (dry)", unit:"lbs",
          factor: 1.25,  // lbs per 10 ppm per 10,000 gal
          note:"Pre-dissolve in bucket — extremely exothermic. Add slowly." }
      ],
      lower: [ { id:"drain", label:"Partial drain / dilution only", unit:"", note:"No chemical lowers CH. Must dilute with fresh water." } ]
    },
    cya: {
      label: "Cyanuric Acid / Stabilizer (CYA)",
      unit: "ppm", min: 30, max: 80, ideal: "30-50",
      raise: [
        { id:"cyanuricAcid", label:"Cyanuric Acid (Stabilizer)", unit:"lbs",
          factor: 0.73,  // lbs per 10 ppm per 10,000 gal
          note:"Add inside a sock hung in the skimmer. Dissolves slowly — takes 1-2 weeks to read accurately." }
      ],
      lower: [ { id:"drain", label:"Partial drain / dilution only", unit:"", note:"No chemical removes CYA. Must drain and dilute." } ]
    }
  },

  // SLAM protocol targets (FC = CYA × multiplier)
  slam: {
    greenPool:    { label:"Green Pool / Algae Kill",   mult: 0.40, note:"Maintain until: CC < 0.5 + water clear + passes OCLT" },
    maintenance:  { label:"Maintenance Shock",          mult: 0.20, note:"Standard weekly shock level" },
    mustardAlgae: { label:"Mustard (Yellow) Algae",     mult: 0.60, note:"Harder to kill — requires thorough brushing and sustained high FC" },
    blackAlgae:   { label:"Black Algae",                mult: 0.80, note:"Very resistant. Must physically scrub spots. Consider a long SLAM." },
    clearPool:    { label:"Already Clear Pool",         mult: 0.10, note:"Normal operating target" }
  },

  // Chemical addition order and wait times
  additionOrder: [
    { step:1, chem:"Muriatic Acid",        wait:"30 min (circulating)", reason:"Lower pH first so shock works efficiently. Pump running." },
    { step:2, chem:"Sodium Bicarbonate",   wait:"15 min",               reason:"Raise TA if needed before shocking. Spread across surface." },
    { step:3, chem:"Calcium Chloride",     wait:"4 hours",              reason:"Pre-dissolve in bucket. Allow to fully disperse before next addition." },
    { step:4, chem:"Cyanuric Acid",        wait:"24 hours",             reason:"Add to skimmer sock. Does not interact with other chems but slow to dissolve." },
    { step:5, chem:"Chlorine (liquid)",    wait:"Circulate 15 min",     reason:"Add last. Distribute around perimeter. Never mix directly with acid." },
    { step:6, chem:"Cal-Hypo Shock",       wait:"Pre-dissolve first",   reason:"NEVER add directly to skimmer. Pre-dissolve in bucket, then pour around pool." }
  ],

  // Ideal chemistry ranges
  ranges: {
    fc:   { low: 2,   high: 10,  ideal: "3-6",     unit: "ppm" },
    cc:   { low: 0,   high: 0.5, ideal: "0-0.2",   unit: "ppm", note:"Combined chlorine — above 0.5 = shock needed" },
    ph:   { low: 7.2, high: 7.8, ideal: "7.4-7.6", unit: "" },
    ta:   { low: 80,  high: 120, ideal: "80-100",   unit: "ppm" },
    ch:   { low: 200, high: 400, ideal: "200-400",  unit: "ppm", note:"Plaster/gunite pools lean 250-350; vinyl/fiberglass 150-250 OK" },
    cya:  { low: 30,  high: 80,  ideal: "30-50",    unit: "ppm", note:"Salt pools: 60-80. Above 100 = drain to dilute." },
    salt: { low: 2700, high: 3400, ideal: "3000-3200", unit: "ppm", note:"Only for salt chlorinator pools" },
    tds:  { low: 0,  high: 2000, ideal: "<1500",    unit: "ppm", note:"Above 1500: water quality degrading. Partial drain recommended." }
  },

  // Partial drain calculator data
  drainCalc: {
    description: "Used when CYA, CH, or TDS is too high. Calculate % to drain and replace with fresh water.",
    // Target = current × (1 - drain_pct) + 0 × drain_pct  →  drain_pct = 1 - (target / current)
  }
};

window.SAND_FILTER_DATA = {
  // Sand weight by tank diameter (inches) → pounds of #20 silica sand
  sandByDiameter: [
    { dia:16,  sand:50,  flow:"25-35 GPM",  sqft:1.4, commonModels:["Hayward S166T","Pentair TR40","Sand Dollar SD40"] },
    { dia:18,  sand:75,  flow:"35-50 GPM",  sqft:1.77, commonModels:["Hayward S180T","Pentair TR40C","Jacuzzi SL15"] },
    { dia:19,  sand:100, flow:"40-55 GPM",  sqft:1.97, commonModels:["Hayward S194T","Pentair TR60","AquaPro 19\""] },
    { dia:20,  sand:100, flow:"45-60 GPM",  sqft:2.16, commonModels:["Hayward S200T","Pentair TR60-C","Sta-Rite S7M400"] },
    { dia:21,  sand:150, flow:"50-70 GPM",  sqft:2.40, commonModels:["Hayward S210T","Custom 21"] },
    { dia:22,  sand:150, flow:"55-75 GPM",  sqft:2.64, commonModels:["Hayward S220T","Pentair TR100","Sand Dollar SD75"] },
    { dia:24,  sand:200, flow:"65-90 GPM",  sqft:3.14, commonModels:["Hayward S244T","Pentair TR140","Waterway Crystal Water 30\""] },
    { dia:26,  sand:250, flow:"75-100 GPM", sqft:3.69, commonModels:["Hayward S270T","Pentair TR100C"] },
    { dia:28,  sand:300, flow:"85-110 GPM", sqft:4.28, commonModels:["Hayward S311T","Commercial 28\""] },
    { dia:30,  sand:350, flow:"100-130 GPM",sqft:4.91, commonModels:["Pentair TR200","Commercial 30\""] },
    { dia:36,  sand:500, flow:"130-175 GPM",sqft:7.07, commonModels:["Commercial only"] }
  ],
  // Backwash guidance
  backwash: {
    triggerPSI: 8,   // psi above clean starting pressure
    durationSec: 120, // 2 minutes typical
    rinseMode: true,
    rinseSec: 30,
    note: "Always run on RINSE for 15-30 seconds after backwash before returning to FILTER."
  },
  // Sand replacement schedule
  replacement: {
    residential: "Every 3-5 years",
    commercial:  "Every 1-2 years",
    signs:["Filter pressure constantly high even after backwash","Cloudy water despite good chemistry","Sand channeling (water passing through without filtration)","Sand appearing in pool (broken lateral)"]
  },
  // Alternative media
  alternatMedia: [
    { name:"ZeoSand (Zeolite)",    amount:"lbs = sand_lbs × 0.5", note:"50% less by weight. Better filtration to 2-3 microns. Good for high-bather loads." },
    { name:"FilterGlass",          amount:"lbs = sand_lbs × 0.75", note:"Lasts 10+ years. Better filtration. No biological growth." },
    { name:"Polybead (Polyester)", amount:"lbs = sand_lbs × 0.5", note:"Environmentally friendly. Better than sand on small particles." }
  ]
};

window.POOL_VOLUME_DATA = {
  shapes: [
    {
      id:"rectangle", label:"Rectangle / Square",
      fields:["length","width","shallowEnd","deepEnd"],
      formula: (l,w,s,d) => l * w * ((s+d)/2) * 7.48,
      tip:"Measure inside wall to inside wall."
    },
    {
      id:"oval", label:"Oval / Ellipse",
      fields:["length","width","shallowEnd","deepEnd"],
      formula: (l,w,s,d) => l * w * 0.785 * ((s+d)/2) * 7.48,
      tip:"Measure longest length and widest point."
    },
    {
      id:"round", label:"Round / Circle",
      fields:["diameter","shallowEnd","deepEnd"],
      formula: (dia,_,s,d) => Math.PI * Math.pow(dia/2,2) * ((s+d)/2) * 7.48,
      tip:"Measure diameter across the center."
    },
    {
      id:"kidney", label:"Kidney",
      fields:["length","width1","width2","shallowEnd","deepEnd"],
      formula: (l,w1,w2,s,d) => (l * (w1+w2)/2 * 0.45) * ((s+d)/2) * 7.48,
      tip:"Measure length, then both widths (at widest bulges). 0.45 is standard kidney factor."
    },
    {
      id:"lshape", label:"L-Shape",
      fields:["length1","width1","length2","width2","shallowEnd","deepEnd"],
      formula: (l1,w1,l2,w2,s,d) => (l1*w1 + l2*w2) * ((s+d)/2) * 7.48,
      tip:"Divide the L into two rectangles. Measure each independently."
    },
    {
      id:"freeform", label:"Freeform (estimate)",
      fields:["surfaceAreaEst","shallowEnd","deepEnd"],
      formula: (area,_,s,d) => area * ((s+d)/2) * 7.48,
      tip:"Estimate surface area by overlaying a rectangle and subtracting ~20-30% for irregular edges."
    }
  ]
};

window.CLOSING_CHECKLIST = [
  { phase:"Chemistry — Pre-Close (do first, run pump 24h after)", steps:[
    "Test all 6: FC, CC, pH, TA, CH, CYA",
    "Adjust pH to 7.2–7.4 — slightly low prevents winter scale",
    "Adjust TA to 80–100 ppm",
    "Adjust CH to 200–400 ppm",
    "Shock pool to 10+ ppm FC using Cal-Hypo — big kill before cover goes on",
    "Add PolyQuat 60 algaecide per label (preferred — no foaming, works under cover)",
    "Add phosphate remover if phosphates were above 500 ppb",
    "Add metal sequestrant if source water is high in iron or copper",
    "DO NOT add extra CYA — it persists and you waste stabilizer"
  ]},
  { phase:"Equipment Shutdown", steps:[
    "Run pump/filter minimum 24 hours after adding closing chemicals",
    "Backwash sand/DE filter OR clean cartridge elements before shutdown",
    "For DE filters: disassemble and hose off grids — rinse thoroughly",
    "Turn off heater FIRST — allow 15 min to cool before shutting pump off",
    "Shut off salt chlorinator — clean cell with acid wash per spec",
    "Remove and store salt cell indoors for winter",
    "Disconnect and store automation equipment and remote controls",
    "Clean pump strainer basket thoroughly",
    "Turn off main power at breaker panel — tape breaker if pool is near public access"
  ]},
  { phase:"Winterize Plumbing", steps:[
    "Lower water level below skimmer opening (or mid-tile on vinyl/fiberglass)",
    "Blow out return lines with compressor — work pump → returns",
    "Insert Gizzmo / winterization plug into each skimmer throat",
    "Blow out skimmer line — plug when water clears",
    "Blow out main drain line — close valve or plug if accessible",
    "Add propylene glycol antifreeze to lines in hard-freeze climates (NEVER ethylene glycol)",
    "Drain pump completely — remove drain plug and store in basket",
    "Drain filter tank — remove drain cap",
    "Drain heater heat exchanger and chlorinator — open all unions",
    "Store all drain plugs in pump basket or labeled bag"
  ]},
  { phase:"Cover Installation", steps:[
    "Vacuum and skim pool surface before covering",
    "Install underwater return plugs before installing cover",
    "Install safety cover: all anchors fully seated and tensioned evenly",
    "For mesh safety covers: use water tubes or sandbags at perimeter against wind",
    "For solid covers: install submersible cover pump — must drain rain/snowmelt",
    "For above-ground: install air pillow first to absorb ice expansion pressure",
    "Verify cover cannot be lifted by wind — check all attachment points"
  ]},
  { phase:"Final Steps", steps:[
    "Photograph equipment pad — show plugs removed, drains open (reference for spring)",
    "Wrap exposed pipe unions with foam pipe insulation in freeze climates",
    "Lock and secure equipment enclosure",
    "Log closing date, all chemical levels, and any issues in notes",
    "Schedule spring opening 2–3 weeks before first use (chemistry needs time to stabilize)"
  ]}
];

window.WEEKLY_CHECKLIST = [
  { phase:"Water Testing", steps:[
    "Test Free Chlorine (FC) — target 3–6 ppm (salt pools: 3–5 ppm)",
    "Test pH — target 7.4–7.6",
    "Test Combined Chlorine (CC) — must stay below 0.5 ppm",
    "If CC ≥ 0.5: shock to breakpoint chlorination (see SLAM calculator)",
    "Spot-check CYA after heavy rain or significant splash-out",
    "Check salt level if applicable — verify 2700–3400 ppm",
    "Adjust any out-of-range parameters using the Dosing Calculator"
  ]},
  { phase:"Physical Maintenance", steps:[
    "Skim surface — remove leaves, insects, pollen, debris",
    "Brush all walls, steps, and corners — algae anchors here first",
    "Brush waterline tile to prevent calcium ring buildup",
    "Vacuum pool floor — use WASTE mode for heavy debris (bypasses filter)",
    "Clean pump strainer basket — reduced flow = reduced filtration",
    "Clean skimmer basket",
    "Empty robotic cleaner bag / filter tray if applicable"
  ]},
  { phase:"Equipment Check", steps:[
    "Note current filter PSI — compare to your clean baseline",
    "Backwash sand/DE filter if pressure is 8+ PSI above clean baseline",
    "Verify pump is primed and running — no air bubbles in sight glass",
    "Confirm heater is reaching set temperature",
    "Check salt cell display — inspect for scale if output is low",
    "Verify automation timers / schedules are correct",
    "Look for any drips or wet spots at unions, valves, and fittings"
  ]}
];

window.MONTHLY_CHECKLIST = [
  { phase:"Full Water Balance Panel", steps:[
    "Test all 6 parameters: FC, CC, pH, TA, CH, CYA",
    "Test TDS if possible — above 1500 ppm consider partial drain",
    "Test phosphates — above 500 ppb treat with phosphate remover before algae starts",
    "Check CH trend — calcium only goes up; if above 400 consider dilution",
    "Verify CYA hasn't crept above 80 ppm — drain to lower it",
    "Add metal sequestrant if source water has elevated iron or copper",
    "Calculate LSI (Langelier Saturation Index) if plaster pool — target -0.3 to +0.3"
  ]},
  { phase:"Filter Service", steps:[
    "Backwash sand or DE filter regardless of current PSI reading",
    "For DE filters: inspect grids for tears — a single torn grid bypasses all filtration",
    "For cartridge filters: remove, hose off pleats, inspect for wear or tears",
    "Log post-service pressure — this is your updated clean baseline",
    "Check multi-port or push-pull valve for bypassing or stiff handle",
    "Inspect sight glass — should clear within 15–30 seconds of backwash",
    "Check for sand channeling: water should spread across sand surface, not sinkhole"
  ]},
  { phase:"Equipment Deep Inspection", steps:[
    "Listen to pump motor — unusual noise or heat = bearing or capacitor issue",
    "Check all O-rings and unions — lubricate with Teflon-compatible lube (not petroleum)",
    "Inspect pump lid O-ring — replace if cracked, compressed flat, or leaking",
    "Inspect heater burner compartment for debris, spider nests, or carbon buildup",
    "Check gas line connections with soapy water — bubbles = leak, call a tech",
    "Acid wash salt cell if output is low (muriatic 4:1 dilution, 15 min max)",
    "Inspect all return jets — verify directional flow is sweeping the pool",
    "Inspect main drain cover for cracks — must be VGB anti-vortex compliant"
  ]},
  { phase:"Surfaces & Waterline", steps:[
    "Treat waterline tile with calcium lime remover or dilute muriatic on rag",
    "Brush corners, steps, and any discolored spots before they anchor",
    "Identify stains before treating — metal, organic, and mineral stains need different chemicals",
    "Inspect pool light lens for moisture intrusion or cracking",
    "Check deck drains for flow direction — must drain away from pool",
    "Inspect coping and expansion joints — seal cracks before water infiltrates and freezes"
  ]}
];

window.OPENING_CHECKLIST = [
  { phase:"Before Filling", steps:[
    "Remove and store winter cover — clean before storing",
    "Remove all winterization plugs and gizzmos from returns and skimmer",
    "Re-install all return fittings and drain plugs",
    "Reinstall main drain cover (check VGB compliance — anti-vortex cover required)",
    "Remove ice compensation bags / pillows (above-ground)",
    "Check equipment pad: look for freeze damage on heater unions, pump, filter",
    "Check all plumbing for cracks from freeze expansion"
  ]},
  { phase:"Fill & Equipment Start", steps:[
    "Fill pool to middle of skimmer opening",
    "Prime pump — fill pump basket and housing with water",
    "Start pump — verify priming within 2-3 minutes",
    "Check filter pressure at startup (note as your 'clean baseline' for the season)",
    "Bleed air from filter tank (on DE/cartridge: open air relief valve until water flows)",
    "Turn heater on — check for error codes (E01, E05 most common on cold startup)",
    "Verify all returns are flowing",
    "Check for any water leaks at unions, fittings, or filter"
  ]},
  { phase:"Water Chemistry — Test First", steps:[
    "Test: pH, FC, TC/CC, TA, CH, CYA (all 6 before adding anything)",
    "If water is green/cloudy: SLAM protocol (see Dosing Calculator)",
    "Balance in ORDER: pH → TA → CH → CYA → then chlorine last",
    "If CYA is 0 (fresh water): add stabilizer first — takes 1-2 weeks to absorb",
    "If CYA > 80: partial drain recommended before shocking",
    "Shock to breakpoint: FC should be 10× CC reading (or 10× CYA for SLAM)"
  ]},
  { phase:"Filter & Cleanup", steps:[
    "Backwash sand or DE filter (winter debris in filter)",
    "For DE filter: breakdown and hose off grids if not done at closing",
    "Brush all pool surfaces — algae hides in corners and on steps",
    "Vacuum to waste if heavy debris on bottom (bypass filter to avoid clogging)",
    "Run filter 24/7 until water is clear",
    "Check salt cell reading if applicable (clean with acid wash if needed)",
    "Test automation/timer settings for the season",
    "Check light fixtures for moisture intrusion"
  ]}
];
