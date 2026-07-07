# Cascade

Cascade is a prototype joint cross-sector outage and vulnerability dashboard for control-room staff at an energy DNO and a mobile network operator, used during combined power/telecoms outages in a rural area.

This is a demo-only prototype: all data is mocked and held in local React state. There is no backend and no real customer data.

## Preloaded scenario

The prototype loads with a single dual-outage incident in rural Suffolk — the "Wickham Cross & Blythe Fen Combined Outage" — covering:

- A power outage zone and a mobile network outage zone with a highlighted overlap ("dual outage")
- 4 mast sites with backup power, auto-restart status, and manual intervention flags
- A PSR-flagged vulnerability density layer (aggregate counts only — no personal data)
- A shared incident timeline that both organisations post to
- A welfare task board (Reported → In Progress → Resolved) for informal welfare checks

## Screens

1. **Map View** — power outage / mobile outage overlay with a toggleable vulnerability density layer
2. **Auto-Restart Status** — mast site backup power, auto-restart status, and manual intervention flags
3. **Shared Timeline** — single chronological incident log both organisations post to
4. **Welfare Task Board** — kanban board for tracking welfare checks

## Stack

React + Vite + Tailwind CSS v4. No backend — all mock data lives in [`src/data/mockData.js`](src/data/mockData.js) and local component state.

## Getting started

```bash
npm install
npm run dev
```

## Design

Light theme with a two-tone visual identity (amber for the energy DNO, teal for the telecom MNO) to signal joint ownership rather than single-company branding. Built to work on a large control-room monitor as well as tablets used by field staff.
