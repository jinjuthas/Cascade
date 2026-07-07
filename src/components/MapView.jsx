import { useState } from "react";
import {
  settlements,
  powerOutageZone,
  mobileOutageZone,
  vulnerabilityZones,
  mastSites,
} from "../data/mockData";

const statusStyle = {
  "on-backup": "bg-amber-100 text-amber-800 ring-amber-300",
  "critical-backup": "bg-rose-100 text-rose-800 ring-rose-300",
  "awaiting-auto-restart": "bg-teal-100 text-teal-800 ring-teal-300",
  "manual-required": "bg-rose-100 text-rose-800 ring-rose-300",
};

export default function MapView() {
  const [showVulnerability, setShowVulnerability] = useState(false);
  const [selected, setSelected] = useState(null);

  const selectedMast = mastSites.find((m) => m.id === selected);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Outage Overlay Map</h2>
            <p className="text-xs text-slate-500">Wickham Cross &amp; Blythe Fen area, rural Suffolk</p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 select-none cursor-pointer bg-slate-50 border border-slate-200 rounded-full pl-3 pr-1 py-1">
            Vulnerability layer
            <button
              type="button"
              role="switch"
              aria-checked={showVulnerability}
              onClick={() => setShowVulnerability((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                showVulnerability ? "bg-purple-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  showVulnerability ? "translate-x-5" : ""
                }`}
              />
            </button>
          </label>
        </div>

        <div className="relative bg-[#eef3ea]">
          <svg viewBox="0 0 800 520" className="w-full h-auto block" role="img" aria-label="Outage overlay map">
            <defs>
              <clipPath id="clip-power-zone">
                <polygon points={powerOutageZone.points} />
              </clipPath>
              <pattern id="fields" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#eef3ea" />
                <path d="M0 40 L40 0" stroke="#dde7d6" strokeWidth="1" />
              </pattern>
            </defs>

            <rect x="0" y="0" width="800" height="520" fill="url(#fields)" />
            <path d="M0 420 Q 250 380 400 430 T 800 400" stroke="#a9cbe8" strokeWidth="10" fill="none" opacity="0.7" />
            <path d="M40 40 L 760 480" stroke="#d8d2c4" strokeWidth="6" fill="none" opacity="0.6" />
            <path d="M760 60 L 60 460" stroke="#d8d2c4" strokeWidth="4" fill="none" opacity="0.5" />

            <polygon
              points={powerOutageZone.points}
              fill="#f59e0b"
              fillOpacity="0.28"
              stroke="#d97706"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <polygon
              points={mobileOutageZone.points}
              fill="#0d9488"
              fillOpacity="0.28"
              stroke="#0f766e"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <polygon
              points={mobileOutageZone.points}
              clipPath="url(#clip-power-zone)"
              fill="#be123c"
              fillOpacity="0.55"
              stroke="#9f1239"
              strokeWidth="2"
            />

            {showVulnerability &&
              vulnerabilityZones.map((z) => {
                const r = 14 + Math.sqrt(z.psrCount) * 4;
                return (
                  <g key={z.id}>
                    <circle cx={z.x} cy={z.y} r={r} fill="#7c3aed" fillOpacity="0.25" stroke="#7c3aed" strokeWidth="1.5" />
                    <circle cx={z.x} cy={z.y} r="3" fill="#5b21b6" />
                    <text x={z.x} y={z.y - r - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="#5b21b6">
                      {z.psrCount} PSR
                    </text>
                  </g>
                );
              })}

            {settlements.map((s) => (
              <g key={s.id}>
                <circle cx={s.x} cy={s.y} r="4" fill="#334155" />
                <text x={s.x + 8} y={s.y + 4} fontSize="12" fill="#334155" fontWeight="500">
                  {s.name}
                </text>
              </g>
            ))}

            {mastSites.map((m) => {
              const isSelected = selected === m.id;
              const needsAttention = m.intervention;
              return (
                <g
                  key={m.id}
                  transform={`translate(${m.x}, ${m.y})`}
                  onClick={() => setSelected(isSelected ? null : m.id)}
                  className="cursor-pointer"
                >
                  <polygon
                    points="0,-13 11,9 -11,9"
                    fill={needsAttention ? "#e11d48" : "#0f172a"}
                    stroke="white"
                    strokeWidth="2"
                  />
                  {needsAttention && (
                    <circle cx="8" cy="-10" r="5" fill="#fbbf24" stroke="white" strokeWidth="1" />
                  )}
                  {isSelected && <circle r="20" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="3 3" />}
                  <text x="0" y="24" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                    {m.id}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-sm px-3 py-2 text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-amber-500/40 border border-amber-600" /> Power outage zone
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-teal-600/40 border border-teal-700" /> Mobile outage zone
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-rose-700/60 border border-rose-800" /> Dual outage (overlap)
            </div>
            {showVulnerability && (
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-purple-600/30 border border-purple-700" /> PSR-flagged density
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Site detail</h3>
          {selectedMast ? (
            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold text-slate-900">{selectedMast.name}</p>
              <p className="text-xs text-slate-500">{selectedMast.id} · {selectedMast.village}</p>
              <span className={`inline-flex ring-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[selectedMast.status]}`}>
                {selectedMast.status.replace(/-/g, " ")}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedMast.notes}</p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-slate-50 rounded-md p-2">
                  <p className="text-slate-500">Mains power</p>
                  <p className="font-semibold text-slate-800 capitalize">{selectedMast.mainsPower}</p>
                </div>
                <div className="bg-slate-50 rounded-md p-2">
                  <p className="text-slate-500">Backup remaining</p>
                  <p className="font-semibold text-slate-800">
                    {selectedMast.backupHoursRemaining != null ? `${selectedMast.backupHoursRemaining} hrs` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Select a mast marker on the map to see its status.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Vulnerability layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Shows anonymised, aggregate counts of Priority Services Register (PSR) flagged households per zone only.
            No names, addresses or personal data are displayed on this dashboard, consistent with GDPR data
            minimisation requirements — individual welfare actions are coordinated via the Welfare Task Board.
          </p>
          {showVulnerability && (
            <ul className="mt-3 space-y-1.5 text-xs">
              {vulnerabilityZones.map((z) => (
                <li key={z.id} className="flex items-center justify-between border-b border-slate-100 py-1 last:border-0">
                  <span className="text-slate-700">{z.label}</span>
                  <span className="font-semibold text-purple-700">{z.psrCount} PSR · {z.households} households</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
