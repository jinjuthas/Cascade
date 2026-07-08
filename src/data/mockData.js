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

// Vulnerability hotspot zones — aggregate PSR-flagged counts only, no personal data.
export const vulnerabilityZones = [
  { id: "vz-1", label: "Blythe Fen", x: 330, y: 230, psrCount: 23, households: 14 },
  { id: "vz-2", label: "Wickham Cross", x: 190, y: 150, psrCount: 9, households: 7 },
  { id: "vz-3", label: "Ashcombe Parva", x: 470, y: 190, psrCount: 6, households: 5 },
  { id: "vz-4", label: "Netherstow", x: 590, y: 300, psrCount: 4, households: 3 },
];

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

// Welfare task board — informal welfare checks, assignable to either company's field staff.
export const initialWelfareTasks = [
  {
    id: "w1",
    title: "Welfare check — Harmeet, Meriden Close",
    location: "Blythe Fen",
    detail: "PSR-flagged resident, home oxygen concentrator. No response on landline (mobile down in area).",
    assignedTo: "J. Okafor — Energy DNO Field Team 3",
    priority: "high",
    status: "reported",
  },
  {
    id: "w2",
    title: "Welfare check — sheltered housing scheme",
    location: "Blythe Fen, Orchard Court",
    detail: "12 residents, warden on site but no comms. Confirm backup lighting/heating adequate.",
    assignedTo: "Unassigned",
    priority: "high",
    status: "reported",
  },
  {
    id: "w3",
    title: "Check on dialysis patient",
    location: "Wickham Cross, The Maltings",
    detail: "Requires powered medical equipment. Property on priority services register.",
    assignedTo: "M. Iqbal — Telecom MNO Field Ops",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "w4",
    title: "Farm with young children, no landline",
    location: "Ashcombe Parva",
    detail: "Family confirmed reliant on mobile for welfare calls. Checked in via generator-powered neighbour.",
    assignedTo: "J. Okafor — Energy DNO Field Team 3",
    priority: "medium",
    status: "resolved",
  },
  {
    id: "w5",
    title: "Elderly couple, mobility issues",
    location: "Cold Marsh Green",
    detail: "Outside dual-outage zone but requested reassurance call given proximity.",
    assignedTo: "M. Iqbal — Telecom MNO Field Ops",
    priority: "low",
    status: "resolved",
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

// Dispatch destinations for the route planner — mast sites plus one welfare-only
// location (Cold Marsh Green has no mast but has an active welfare task).
export const dispatchDestinations = [
  { id: "WCX-014", label: "Wickham Cross mast (WCX-014)", x: 150, y: 95, kind: "mast" },
  { id: "BLF-002", label: "Blythe Fen Church Rd mast (BLF-002)", x: 340, y: 250, kind: "mast" },
  { id: "ASP-031", label: "Ashcombe Parva Water Tower (ASP-031)", x: 450, y: 210, kind: "mast" },
  { id: "NTS-019", label: "Netherstow Exchange (NTS-019)", x: 570, y: 290, kind: "mast" },
  { id: "cold-marsh-green", label: "Cold Marsh Green (welfare visit)", x: 260, y: 380, kind: "settlement" },
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
