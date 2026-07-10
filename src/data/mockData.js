// Mock data for the Cascade prototype.
// Scenario: combined power + telecoms outage across a rural Suffolk area,
// declared as a major incident. All names, sites and figures are fictional.

export const incident = {
  name: "Wickham Cross & Blythe Fen Combined Outage",
  region: "Rural Suffolk, UK",
  declaredAt: "2026-07-08T06:42:00",
  status: "Active — Joint Response",
};

// Villages / hamlets shown as labels on the map (SVG coordinate space 0-800 x 0-520)
export const settlements = [
  { id: "wickham-cross", name: "Wickham Cross", x: 190, y: 150, population: 640 },
  { id: "blythe-fen", name: "Blythe Fen", x: 330, y: 230, population: 410 },
  { id: "ashcombe-parva", name: "Ashcombe Parva", x: 470, y: 190, population: 265 },
  { id: "netherstow", name: "Netherstow", x: 590, y: 300, population: 520 },
  { id: "cold-marsh-green", name: "Cold Marsh Green", x: 260, y: 380, population: 180 },
];

// Power outage zone polygon (energy DNO)
export const powerOutageZone = {
  id: "power-zone-a",
  label: "Power Outage — Feeder 11kV/Blythe",
  points: "120,90 300,80 380,150 360,270 260,320 150,260 100,180",
};

// Mobile network outage / degraded coverage zone polygon (MNO)
export const mobileOutageZone = {
  id: "mobile-zone-b",
  label: "Mobile Outage — RAN Cluster 4",
  points: "260,140 460,120 560,190 540,340 400,360 300,300 250,220",
};

// Wind gust forecast timeline, hourly from -6h (past) to +6h (forecast), storm peaking at "now".
// Gust speed is a base reading (mph) applied to each cable risk point via its exposureMph below.
// Wind gust readings (gustMph) and their severity banding are load-bearing for the Map View
// weather layer — do not change existing values or cableRiskLevel() thresholds/colors when
// extending this timeline. Temperature/rain/wind-direction/condition fields below are additive
// and only used by the Weather tab.
export const weatherTimeline = [
  { hourOffset: -6, label: "-6h", gustMph: 22, tempC: 19, feelsLikeC: 18, rainMm: 0.2, windDir: "SW", condition: "cloudy" },
  { hourOffset: -5, label: "-5h", gustMph: 26, tempC: 18, feelsLikeC: 17, rainMm: 0.5, windDir: "SW", condition: "cloudy" },
  { hourOffset: -4, label: "-4h", gustMph: 32, tempC: 17, feelsLikeC: 15, rainMm: 1.2, windDir: "SW", condition: "rain" },
  { hourOffset: -3, label: "-3h", gustMph: 38, tempC: 16, feelsLikeC: 14, rainMm: 2.8, windDir: "SW", condition: "rain" },
  { hourOffset: -2, label: "-2h", gustMph: 45, tempC: 15, feelsLikeC: 12, rainMm: 4.5, windDir: "W", condition: "storm" },
  { hourOffset: -1, label: "-1h", gustMph: 51, tempC: 14, feelsLikeC: 10, rainMm: 6.2, windDir: "W", condition: "storm" },
  { hourOffset: 0, label: "Now", gustMph: 58, tempC: 14, feelsLikeC: 9, rainMm: 7.8, windDir: "W", condition: "storm" },
  { hourOffset: 1, label: "+1h", gustMph: 54, forecast: true, tempC: 14, feelsLikeC: 10, rainMm: 5.5, windDir: "NW", condition: "storm" },
  { hourOffset: 2, label: "+2h", gustMph: 47, forecast: true, tempC: 15, feelsLikeC: 12, rainMm: 3.1, windDir: "NW", condition: "rain" },
  { hourOffset: 3, label: "+3h", gustMph: 39, forecast: true, tempC: 16, feelsLikeC: 13, rainMm: 1.4, windDir: "NW", condition: "rain" },
  { hourOffset: 4, label: "+4h", gustMph: 31, forecast: true, tempC: 17, feelsLikeC: 15, rainMm: 0.4, windDir: "N", condition: "cloudy" },
  { hourOffset: 5, label: "+5h", gustMph: 25, forecast: true, tempC: 18, feelsLikeC: 16, rainMm: 0.1, windDir: "N", condition: "cloudy" },
  { hourOffset: 6, label: "+6h", gustMph: 20, forecast: true, tempC: 19, feelsLikeC: 17, rainMm: 0, windDir: "N", condition: "sunny" },
];

// Sunrise/sunset for the incident day (rural Suffolk, UK, July — long BST days).
export const sunTimes = { sunrise: "04:47", sunset: "21:22" };

// Points for the temperature heat map — reuses the settlement layout so it reads as the same
// rural area shown elsewhere. tempOffsetC is a small microclimate variation from the base
// timeline temperature (e.g. low-lying fen vs. more sheltered village).
export const weatherHeatmapPoints = [
  { id: "whp-1", label: "Wickham Cross", x: 190, y: 150, tempOffsetC: 0.3 },
  { id: "whp-2", label: "Blythe Fen", x: 330, y: 230, tempOffsetC: -0.6 },
  { id: "whp-3", label: "Ashcombe Parva", x: 470, y: 190, tempOffsetC: 0.5 },
  { id: "whp-4", label: "Netherstow", x: 590, y: 300, tempOffsetC: 0.8 },
  { id: "whp-5", label: "Cold Marsh Green", x: 260, y: 380, tempOffsetC: -0.4 },
];

// Overhead-line cable runs exposed to wind — each has an exposure multiplier reflecting terrain
// (open fen vs. sheltered village) applied to the base gust reading above.
export const cableRiskPoints = [
  { id: "crp-1", label: "Blythe Fen overhead run", x: 300, y: 195, exposure: 1.25 },
  { id: "crp-2", label: "Wickham Cross overhead run", x: 160, y: 205, exposure: 1.0 },
  { id: "crp-3", label: "Ashcombe Parva overhead run", x: 480, y: 260, exposure: 0.85 },
  { id: "crp-4", label: "Netherstow overhead run", x: 560, y: 340, exposure: 0.9 },
];

// Wind risk banding for overhead cables, roughly aligned to UK Met Office gust-warning thresholds.
export function cableRiskLevel(effectiveGustMph) {
  if (effectiveGustMph >= 55) return { level: "severe", color: "#b91c1c" };
  if (effectiveGustMph >= 40) return { level: "high", color: "#f97316" };
  if (effectiveGustMph >= 28) return { level: "moderate", color: "#eab308" };
  return { level: "low", color: "#16a34a" };
}

// Vulnerability hotspot zones — aggregate PSR-flagged counts only, no personal data.
// GDPR / small-numbers rule: never add per-resident fields (name, address, condition) here.
// Any new field on this object must be a zone-level aggregate, not an individual record.
export const vulnerabilityZones = [
  { id: "vz-1", label: "Blythe Fen", x: 330, y: 230, psrCount: 23, households: 14 },
  { id: "vz-2", label: "Wickham Cross", x: 190, y: 150, psrCount: 9, households: 7 },
  { id: "vz-3", label: "Ashcombe Parva", x: 470, y: 190, psrCount: 6, households: 5 },
  { id: "vz-4", label: "Netherstow", x: 590, y: 300, psrCount: 4, households: 3 },
];

// Small-numbers disclosure control: counts below this are never shown as an exact figure,
// since a low count in a small rural hamlet can be enough to identify an individual.
export const PSR_DISCLOSURE_THRESHOLD = 5;

export function displayPsrCount(count) {
  return count < PSR_DISCLOSURE_THRESHOLD ? `<${PSR_DISCLOSURE_THRESHOLD}` : String(count);
}

// Mast sites in the affected area
export const mastSites = [
  {
    id: "WCX-014",
    name: "Wickham Cross",
    x: 150, y: 95,
    village: "Wickham Cross",
    mainsPower: "out",
    backupHoursRemaining: 6.5,
    autoRestart: "enabled",
    status: "on-backup",
    intervention: false,
    notes: "Backup generator stable. No manual action needed yet.",
  },
  {
    id: "BLF-002",
    name: "Blythe Fen Church Rd",
    x: 340, y: 250,
    village: "Blythe Fen",
    mainsPower: "out",
    backupHoursRemaining: 1.2,
    autoRestart: "enabled",
    status: "critical-backup",
    intervention: true,
    notes: "In dual-outage zone. Backup critical — generator dispatch requested 07:10.",
  },
  {
    id: "ASP-031",
    name: "Ashcombe Parva Water Tower",
    x: 450, y: 210,
    village: "Ashcombe Parva",
    mainsPower: "restored",
    backupHoursRemaining: 3.8,
    autoRestart: "pending",
    status: "awaiting-auto-restart",
    intervention: false,
    notes: "Mains power back at 07:55. Auto-restart sequence queued, ETA 15 min.",
  },
  {
    id: "NTS-019",
    name: "Netherstow Exchange",
    x: 570, y: 290,
    village: "Netherstow",
    mainsPower: "on",
    backupHoursRemaining: null,
    autoRestart: "failed",
    status: "manual-required",
    intervention: true,
    notes: "Mains never lost — outage is backhaul fibre cut. Auto-restart not applicable, needs field engineer to re-patch backhaul.",
  },
];

// Generator fleet — deployed and in-stock units. fuelPercent is remaining fuel; autoHandover
// describes whether the unit switches back to mains automatically once power is restored, or
// needs a field engineer to do it manually.
export const initialGeneratorFleet = [
  {
    id: "GEN-01",
    status: "deployed",
    location: "Blythe Fen Church Rd (BLF-002)",
    x: 352,
    y: 262,
    fuelPercent: 62,
    mainsRestored: false,
    autoHandover: "enabled",
    assignedTo: "J. Okafor — Energy DNO Field Team 3",
    notes: "Dispatched 07:10 to the critical dual-outage mast. Running stable.",
  },
  {
    id: "GEN-02",
    status: "deployed",
    location: "Wickham Cross mast (WCX-014)",
    x: 165,
    y: 112,
    fuelPercent: 18,
    mainsRestored: false,
    autoHandover: "manual",
    assignedTo: "J. Okafor — Energy DNO Field Team 3",
    notes: "Fuel running low — refuel or swap needed within ~3 hrs. Auto-handover relay faulty, will need manual switch-over when mains returns.",
  },
  {
    id: "GEN-05",
    status: "deployed",
    location: "Orchard Court sheltered housing, Blythe Fen",
    x: 352,
    y: 205,
    fuelPercent: 45,
    mainsRestored: false,
    autoHandover: "enabled",
    assignedTo: "R. Whitfield — Energy DNO Control",
    notes: "Providing backup lighting/heating for the sheltered housing welfare case pending mains restoration.",
  },
  {
    id: "GEN-03",
    status: "in-stock",
    location: "Wickham Cross Joint Response Depot",
    fuelPercent: 100,
    mainsRestored: null,
    autoHandover: "enabled",
    assignedTo: "Unassigned",
    notes: "Ready for dispatch.",
  },
  {
    id: "GEN-04",
    status: "in-stock",
    location: "Wickham Cross Joint Response Depot",
    fuelPercent: 100,
    mainsRestored: null,
    autoHandover: "enabled",
    assignedTo: "Unassigned",
    notes: "Ready for dispatch.",
  },
  {
    id: "GEN-06",
    status: "in-stock",
    location: "Wickham Cross Joint Response Depot",
    fuelPercent: 88,
    mainsRestored: null,
    autoHandover: "enabled",
    assignedTo: "Unassigned",
    notes: "Returned from routine test run — topped up, ready for dispatch.",
  },
];

// Portable comms units (satellite phone / mesh radio kits) — deployable backup comms for
// welfare coordination when the mobile network is down. Status moves in-storage → pre-positioned
// (staged ahead of a forecast risk) → deployed. Checklist is the field usage/training steps.
export const initialCommsUnits = [
  {
    id: "PCU-01",
    status: "deployed",
    location: "Blythe Fen (dual-outage zone)",
    x: 320,
    y: 220,
    assignedTo: "M. Iqbal — Telecom MNO Field Ops",
    notes: "Deployed to restore emergency comms for welfare coordination in the dual-outage zone.",
    checklist: [
      { step: "Unit powered on and self-test passed", done: true },
      { step: "Paired with NOC control channel", done: true },
      { step: "Site contact briefed on use", done: true },
    ],
  },
  {
    id: "PCU-02",
    status: "pre-positioned",
    location: "Wickham Cross depot cache",
    x: 120,
    y: 430,
    assignedTo: "Unassigned",
    notes: "Pre-positioned ahead of the forecast wind peak per the storm track, ready for rapid deployment.",
    checklist: [
      { step: "Unit powered on and self-test passed", done: true },
      { step: "Paired with NOC control channel", done: false },
      { step: "Site contact briefed on use", done: false },
    ],
  },
  {
    id: "PCU-03",
    status: "in-storage",
    location: "Wickham Cross Joint Response Depot",
    assignedTo: "Unassigned",
    notes: "Ready for pre-positioning or deployment.",
    checklist: [
      { step: "Unit powered on and self-test passed", done: false },
      { step: "Paired with NOC control channel", done: false },
      { step: "Site contact briefed on use", done: false },
    ],
  },
  {
    id: "PCU-04",
    status: "in-storage",
    location: "Wickham Cross Joint Response Depot",
    assignedTo: "Unassigned",
    notes: "Ready for pre-positioning or deployment.",
    checklist: [
      { step: "Unit powered on and self-test passed", done: false },
      { step: "Paired with NOC control channel", done: false },
      { step: "Site contact briefed on use", done: false },
    ],
  },
];

// Shared chronological incident log / timeline. Both organisations post to the same feed.
export const initialTimeline = [
  {
    id: "t1",
    time: "2026-07-08T06:42:00",
    org: "energy",
    author: "R. Whitfield (DNO Control)",
    text: "11kV feeder fault confirmed at Blythe substation. Power outage declared for Wickham Cross, Blythe Fen and part of Ashcombe Parva. ~1,200 customers affected.",
  },
  {
    id: "t2",
    time: "2026-07-08T06:58:00",
    org: "telecom",
    author: "S. Odame (NOC)",
    text: "RAN Cluster 4 reporting degraded coverage following loss of mains at 3 mast sites. Masts running on battery/backup power.",
  },
  {
    id: "t3",
    time: "2026-07-08T07:05:00",
    org: "joint",
    author: "Cascade System",
    text: "Dual-outage zone identified: Blythe Fen and southern Ashcombe Parva are without both power and mobile coverage.",
  },
  {
    id: "t4",
    time: "2026-07-08T07:10:00",
    org: "energy",
    author: "R. Whitfield (DNO Control)",
    text: "Generator dispatched to Blythe Fen Church Rd mast site (BLF-002) — backup power critical, 1.2 hrs remaining.",
  },
  {
    id: "t5",
    time: "2026-07-08T07:22:00",
    org: "telecom",
    author: "S. Odame (NOC)",
    text: "Netherstow Exchange (NTS-019) shows mains power fine but backhaul fibre appears cut — likely same trenching fault. Field engineer being assigned.",
  },
  {
    id: "t6",
    time: "2026-07-08T07:40:00",
    org: "energy",
    author: "Field Team 3 (J. Okafor)",
    text: "Welfare check requested for Meriden Close, Blythe Fen — elderly resident (Harmeet) on PSR register, home oxygen concentrator. Flagged to welfare board.",
  },
  {
    id: "t7",
    time: "2026-07-08T07:55:00",
    org: "energy",
    author: "R. Whitfield (DNO Control)",
    text: "Mains power restored to Ashcombe Parva. Repair crew moving to Blythe substation to restore remaining feeder.",
  },
  {
    id: "t8",
    time: "2026-07-08T08:03:00",
    org: "telecom",
    author: "S. Odame (NOC)",
    text: "ASP-031 auto-restart sequence started following mains restoration. ETA 15 minutes to full service.",
  },
];

// Problem-type categories for welfare cases — shown as an icon/tag on the kanban board and the
// map so coordinators can scan case type at a glance, separate from the red/amber/green status.
export const welfareCategories = {
  health: { label: "Health", icon: "🏥", color: "#dc2626" },
  mobility: { label: "Mobility", icon: "🦽", color: "#7c3aed" },
  utilities: { label: "Heating/Power", icon: "🔥", color: "#ea580c" },
  family: { label: "Family/Children", icon: "🧒", color: "#d97706" },
  food: { label: "Food/Supplies", icon: "🥫", color: "#16a34a" },
};

// Welfare task board — informal welfare checks, assignable to either company's field staff.
// x/y place each case as a pin on the map; history is a short reference log of what happened,
// where, and why, kept attached to the case for coordinators (not personal/clinical data).
export const initialWelfareTasks = [
  {
    id: "w1",
    title: "Welfare check — Harmeet, Meriden Close",
    location: "Blythe Fen",
    detail: "PSR-flagged resident, home oxygen concentrator. No response on landline (mobile down in area).",
    assignedTo: "J. Okafor — Energy DNO Field Team 3",
    priority: "high",
    status: "reported",
    category: "health",
    x: 315,
    y: 248,
    history: [
      { time: "06:42", note: "Case opened — cross-referenced against PSR register after power outage declared." },
      { time: "07:40", note: "Field Team 3 requested for in-person check. No response on landline; mobile down in area." },
    ],
  },
  {
    id: "w2",
    title: "Welfare check — sheltered housing scheme",
    location: "Blythe Fen, Orchard Court",
    detail: "12 residents, warden on site but no comms. Confirm backup lighting/heating adequate.",
    assignedTo: "Unassigned",
    priority: "high",
    status: "reported",
    category: "utilities",
    x: 352,
    y: 213,
    history: [
      { time: "07:15", note: "Warden confirmed on-site via neighbour relay, but scheme itself uncontactable." },
    ],
  },
  {
    id: "w3",
    title: "Check on dialysis patient",
    location: "Wickham Cross, The Maltings",
    detail: "Requires powered medical equipment. Property on priority services register.",
    assignedTo: "M. Iqbal — Telecom MNO Field Ops",
    priority: "high",
    status: "in-progress",
    category: "health",
    x: 208,
    y: 168,
    history: [
      { time: "06:50", note: "Property flagged via PSR cross-reference — powered medical equipment on site." },
      { time: "07:35", note: "M. Iqbal dispatched, ETA 10 min. Backup power confirmed available at property." },
    ],
  },
  {
    id: "w4",
    title: "Farm with young children, no landline",
    location: "Ashcombe Parva",
    detail: "Family confirmed reliant on mobile for welfare calls. Checked in via generator-powered neighbour.",
    assignedTo: "J. Okafor — Energy DNO Field Team 3",
    priority: "medium",
    status: "resolved",
    category: "family",
    x: 470,
    y: 206,
    history: [
      { time: "07:00", note: "Reported by neighbour — family relies on mobile, currently down in this area." },
      { time: "08:20", note: "Checked in via generator-powered neighbour's landline. Family confirmed safe and well." },
    ],
  },
  {
    id: "w5",
    title: "Elderly couple, mobility issues",
    location: "Cold Marsh Green",
    detail: "Outside dual-outage zone but requested reassurance call given proximity.",
    assignedTo: "M. Iqbal — Telecom MNO Field Ops",
    priority: "low",
    category: "mobility",
    x: 260,
    y: 396,
    history: [
      { time: "07:50", note: "Reassurance call requested by family member, though property is outside the dual-outage zone." },
      { time: "08:10", note: "Call completed — couple confirmed unaffected, no further action needed." },
    ],
    status: "resolved",
  },
  {
    id: "w6",
    title: "Food/welfare supply check — isolated household",
    location: "Netherstow",
    detail: "Elderly resident relies on a weekly food delivery; this week's delivery missed due to road access. Confirm welfare and arrange alternative supply.",
    assignedTo: "Unassigned",
    priority: "medium",
    status: "reported",
    category: "food",
    x: 570,
    y: 318,
    history: [
      { time: "08:15", note: "Flagged by community volunteer — usual food delivery missed due to local road closure." },
    ],
  },
];

export const orgMeta = {
  energy: { label: "Energy DNO", color: "blue" },
  telecom: { label: "Telecom MNO", color: "red" },
  joint: { label: "Joint / System", color: "slate" },
};

// Joint response vehicle depot — starting point for all field dispatch routes.
export const depot = {
  id: "depot",
  name: "Wickham Cross Joint Response Depot",
  x: 70,
  y: 470,
};

// Known road hazards affecting route safety in the affected area.
export const hazards = [
  {
    id: "h1",
    type: "flood",
    label: "Flooded ford — Fen Causeway (River Blythe)",
    x: 250,
    y: 410,
  },
  {
    id: "h2",
    type: "power-line",
    label: "Downed line — Church Road, Blythe Fen",
    x: 300,
    y: 265,
  },
  {
    id: "h3",
    type: "road-closure",
    label: "Fallen tree — Ashcombe Lane partially blocked",
    x: 430,
    y: 245,
  },
];

// Dispatch destinations for the route planner — mast sites, one welfare-only location
// (Cold Marsh Green has no mast but has an active welfare task), and one generator-only
// location (Orchard Court has GEN-05 but no mast of its own).
export const dispatchDestinations = [
  { id: "WCX-014", label: "Wickham Cross mast (WCX-014)", shortLabel: "WCX-014", x: 150, y: 95, kind: "mast" },
  { id: "BLF-002", label: "Blythe Fen Church Rd mast (BLF-002)", shortLabel: "BLF-002", x: 340, y: 250, kind: "mast" },
  { id: "ASP-031", label: "Ashcombe Parva Water Tower (ASP-031)", shortLabel: "ASP-031", x: 450, y: 210, kind: "mast" },
  { id: "NTS-019", label: "Netherstow Exchange (NTS-019)", shortLabel: "NTS-019", x: 570, y: 290, kind: "mast" },
  { id: "cold-marsh-green", label: "Cold Marsh Green (welfare visit)", shortLabel: "Cold Marsh Green", x: 260, y: 380, kind: "settlement" },
  { id: "orchard-court", label: "Orchard Court, Blythe Fen (generator GEN-05)", shortLabel: "Orchard Court", x: 352, y: 205, kind: "generator" },
];

// Maps a welfare task's free-text location to the nearest route-planner destination.
export function resolveDestinationId(location) {
  const known = [
    ["Blythe Fen", "BLF-002"],
    ["Wickham Cross", "WCX-014"],
    ["Ashcombe Parva", "ASP-031"],
    ["Netherstow", "NTS-019"],
    ["Cold Marsh Green", "cold-marsh-green"],
  ];
  const match = known.find(([name]) => location.includes(name));
  return match ? match[1] : null;
}

// Maps a deployed generator to the nearest route-planner destination, for the
// "Plan fuel delivery" action on the Resources panel.
export function resolveGeneratorDestinationId(generatorId) {
  const map = { "GEN-01": "BLF-002", "GEN-02": "WCX-014", "GEN-05": "orchard-court" };
  return map[generatorId] || null;
}

// Candidate routes from the depot to each destination. Distances in miles,
// energy in kWh (electric fleet vehicles), safetyScore 1-10 (10 = safest).
// The Route Planner scores these live rather than trusting a fixed "best" flag.
export const routeOptions = {
  "WCX-014": [
    {
      id: "wcx-r1",
      label: "Direct via Fen Causeway",
      path: "70,470 160,420 210,300 170,180 150,95",
      distanceMiles: 5.6,
      etaMinutes: 15,
      energyKwh: 2.3,
      safetyScore: 5,
      hazardsOnRoute: ["h1"],
      notes: "Shortest route but crosses the flooded ford at Fen Causeway.",
      mode: "truck",
      resourcesRequired: ["4x4 recommended — fords Fen Causeway"],
      dataSource: { type: "satellite", asOf: "90 min ago", stale: true },
    },
    {
      id: "wcx-r2",
      label: "Via Wickham Road (north)",
      path: "70,470 90,340 100,220 130,140 150,95",
      distanceMiles: 6.1,
      etaMinutes: 17,
      energyKwh: 2.4,
      safetyScore: 9,
      hazardsOnRoute: [],
      notes: "Slightly longer, stays clear of all known hazards.",
      mode: "truck",
      resourcesRequired: [],
      dataSource: { type: "self-reported", asOf: "20 min ago", stale: false },
    },
  ],
  "BLF-002": [
    {
      id: "blf-r1",
      label: "Direct via Church Road",
      path: "70,470 180,430 260,360 300,265 340,250",
      distanceMiles: 4.4,
      etaMinutes: 12,
      energyKwh: 1.8,
      safetyScore: 4,
      hazardsOnRoute: ["h2"],
      notes: "Fastest route but passes the downed power line on Church Road.",
      mode: "truck",
      resourcesRequired: ["Caution — live downed line reported nearby"],
      dataSource: { type: "self-reported", asOf: "35 min ago", stale: false },
    },
    {
      id: "blf-r2",
      label: "Via Cold Marsh Green bypass",
      path: "70,470 180,440 260,395 330,330 360,280 340,250",
      distanceMiles: 5.2,
      etaMinutes: 14,
      energyKwh: 2.0,
      safetyScore: 9,
      hazardsOnRoute: [],
      notes: "Avoids the downed line, minor detour south of Blythe Fen.",
      mode: "truck",
      resourcesRequired: [],
      dataSource: { type: "self-reported", asOf: "12 min ago", stale: false },
    },
    {
      id: "blf-r3",
      label: "Drone resupply drop",
      path: "70,470 150,380 220,320 280,285 340,250",
      distanceMiles: 4.9,
      etaMinutes: 6,
      energyKwh: 0.3,
      safetyScore: 10,
      hazardsOnRoute: [],
      notes: "Bypasses all ground hazards entirely. Small payload only (radio batteries, spares) — not suitable for generator delivery.",
      mode: "drone",
      resourcesRequired: ["Drone operator — typically a military or fire/rescue asset, not usually available to field engineering teams directly"],
      dataSource: { type: "drone", asOf: "Live", stale: false },
      payloadLimited: true,
    },
  ],
  "ASP-031": [
    {
      id: "asp-r1",
      label: "Direct via Ashcombe Lane",
      path: "70,470 220,420 340,330 400,270 450,210",
      distanceMiles: 6.0,
      etaMinutes: 16,
      energyKwh: 2.4,
      safetyScore: 5,
      hazardsOnRoute: ["h3"],
      notes: "Ashcombe Lane has a fallen tree partially blocking the carriageway.",
      mode: "truck",
      resourcesRequired: ["Chainsaw/clearance crew may be needed"],
      dataSource: { type: "drone", asOf: "45 min ago", stale: false },
    },
    {
      id: "asp-r2",
      label: "Via Blythe Fen & B-road",
      path: "70,470 180,440 300,340 380,260 430,220 450,210",
      distanceMiles: 6.6,
      etaMinutes: 18,
      energyKwh: 2.6,
      safetyScore: 8,
      hazardsOnRoute: [],
      notes: "Longer but clear road, avoids the Ashcombe Lane obstruction.",
      mode: "truck",
      resourcesRequired: [],
      dataSource: { type: "satellite", asOf: "3 hrs ago", stale: true },
    },
  ],
  "NTS-019": [
    {
      id: "nts-r1",
      label: "Direct via B-road east",
      path: "70,470 220,430 380,360 480,320 570,290",
      distanceMiles: 7.8,
      etaMinutes: 19,
      energyKwh: 3.0,
      safetyScore: 8,
      hazardsOnRoute: [],
      notes: "Clear B-road route, no known hazards, good surface for EV range.",
      mode: "truck",
      resourcesRequired: [],
      dataSource: { type: "self-reported", asOf: "40 min ago", stale: false },
    },
    {
      id: "nts-r2",
      label: "Via Ashcombe Parva (shortcut)",
      path: "70,470 220,420 340,330 430,260 500,270 570,290",
      distanceMiles: 7.2,
      etaMinutes: 18,
      energyKwh: 2.9,
      safetyScore: 5,
      hazardsOnRoute: ["h3"],
      notes: "Slightly shorter but crosses the Ashcombe Lane obstruction.",
      mode: "truck",
      resourcesRequired: ["Chainsaw/clearance crew may be needed"],
      dataSource: { type: "drone", asOf: "45 min ago", stale: false },
    },
  ],
  "cold-marsh-green": [
    {
      id: "cmg-r1",
      label: "Direct via depot lane",
      path: "70,470 150,440 200,410 260,380",
      distanceMiles: 2.1,
      etaMinutes: 6,
      energyKwh: 0.9,
      safetyScore: 9,
      hazardsOnRoute: [],
      notes: "Short, clear local route.",
      mode: "foot",
      resourcesRequired: [],
      dataSource: { type: "self-reported", asOf: "15 min ago", stale: false },
    },
    {
      id: "cmg-r2",
      label: "Via Fen Causeway",
      path: "70,470 160,430 250,410 260,380",
      distanceMiles: 2.4,
      etaMinutes: 7,
      energyKwh: 1.0,
      safetyScore: 6,
      hazardsOnRoute: ["h1"],
      notes: "Marginally longer and crosses the flooded ford — unnecessary detour here.",
      mode: "dinghy",
      resourcesRequired: ["Dinghy required — ford impassable to vehicles"],
      dataSource: { type: "satellite", asOf: "90 min ago", stale: true },
    },
  ],
  "orchard-court": [
    {
      id: "orc-r1",
      label: "Via Blythe Fen high street",
      path: "70,470 180,430 260,360 320,290 352,240 352,205",
      distanceMiles: 4.9,
      etaMinutes: 13,
      energyKwh: 1.9,
      safetyScore: 9,
      hazardsOnRoute: [],
      notes: "Clear approach to the sheltered housing scheme, avoids Church Road.",
      mode: "truck",
      resourcesRequired: [],
      dataSource: { type: "self-reported", asOf: "18 min ago", stale: false },
    },
    {
      id: "orc-r2",
      label: "Direct via Church Road",
      path: "70,470 180,430 260,360 300,265 330,230 352,205",
      distanceMiles: 4.2,
      etaMinutes: 11,
      energyKwh: 1.7,
      safetyScore: 4,
      hazardsOnRoute: ["h2"],
      notes: "Shorter but passes the same downed power line flagged on Church Road.",
      mode: "truck",
      resourcesRequired: ["Caution — live downed line reported nearby"],
      dataSource: { type: "self-reported", asOf: "35 min ago", stale: false },
    },
  ],
};

// Scores a candidate route — higher is better. Safety is weighted most heavily
// (each hazard on the route is penalised), then energy use, then journey time.
export function scoreRoute(route) {
  const hazardPenalty = route.hazardsOnRoute.length * 2.5;
  const safety = route.safetyScore - hazardPenalty;
  const energyPenalty = route.energyKwh * 1.2;
  const timePenalty = (route.etaMinutes / 10) * 0.5;
  return safety * 2 - energyPenalty - timePenalty;
}
