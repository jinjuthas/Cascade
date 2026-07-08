import { useMemo, useState } from "react";
import {
  depot,
  hazards,
  dispatchDestinations,
  routeOptions,
  scoreRoute,
  mastSites,
  powerOutageZone,
  mobileOutageZone,
} from "../data/mockData";

const hazardGlyph = {
  flood: "\u{1F30A}",
  "power-line": "⚡",
  "road-closure": "\u{1F333}",
};

const hazardColor = {
  flood: "#2563eb",
  "power-line": "#d97706",
  "road-closure": "#57534e",
};

function formatTime(date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function RoutePlanner({ destinationId, onSelectDestination, onDispatch }) {
  const [dispatchLog, setDispatchLog] = useState({});
  const [hoveredRoute, setHoveredRoute] = useState(null);

  const destination = dispatchDestinations.find((d) => d.id === destinationId) || dispatchDestinations[0];
  const linkedMast = mastSites.find((m) => m.id === destination.id);

  const scoredRoutes = useMemo(() => {
    const candidates = routeOptions[destination.id] || [];
    return candidates
      .map((r) => ({ ...r, score: scoreRoute(r) }))
      .sort((a, b) => b.score - a.score);
  }, [destination.id]);

  const recommended = scoredRoutes[0];

  function handleDispatch(route) {
    const now = new Date();
    setDispatchLog((prev) => ({
      ...prev,
      [destination.id]: { routeLabel: route.label, time: now },
    }));
    onDispatch({
      id: `t-${Date.now()}`,
      time: now.toISOString(),
      org: "joint",
      author: "Cascade Route Planner",
      text: `Field team dispatched to ${destination.label} via "${route.label}" (${route.distanceMiles} mi, est. ${route.etaMinutes} min, ${route.energyKwh} kWh) — ${
        route.id === recommended.id ? "recommended safest/most efficient route" : "manually selected route"
      }.`,
    });
  }

  const dispatched = dispatchLog[destination.id];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Route Optimizer</h2>
          <p className="text-xs text-slate-500">
            Safest and most energy-efficient route from the joint response depot to the selected field site.
          </p>
        </div>

        <div className="relative bg-[#eef3ea]">
          <svg viewBox="0 0 800 520" className="w-full h-auto block" role="img" aria-label="Route planning map">
            <defs>
              <clipPath id="clip-power-zone-route">
                <polygon points={powerOutageZone.points} />
              </clipPath>
              <pattern id="fields-route" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#eef3ea" />
                <path d="M0 40 L40 0" stroke="#dde7d6" strokeWidth="1" />
              </pattern>
            </defs>

            <rect x="0" y="0" width="800" height="520" fill="url(#fields-route)" />
            <path d="M0 420 Q 250 380 400 430 T 800 400" stroke="#a9cbe8" strokeWidth="10" fill="none" opacity="0.7" />

            <polygon points={powerOutageZone.points} fill="#2563eb" fillOpacity="0.1" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="6 4" />
            <polygon points={mobileOutageZone.points} fill="#dc2626" fillOpacity="0.1" stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="6 4" />
            <polygon points={mobileOutageZone.points} clipPath="url(#clip-power-zone-route)" fill="#7e22ce" fillOpacity="0.2" stroke="#6b21a8" strokeWidth="1.5" />

            {scoredRoutes
              .slice()
              .reverse()
              .map((r) => {
                const isRecommended = r.id === recommended.id;
                const isHovered = hoveredRoute === r.id;
                return (
                  <polyline
                    key={r.id}
                    points={r.path}
                    fill="none"
                    stroke={isRecommended ? "#059669" : "#94a3b8"}
                    strokeWidth={isRecommended ? 5 : 3.5}
                    strokeDasharray={isRecommended ? undefined : "8 6"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isHovered || (!hoveredRoute && isRecommended) ? 1 : 0.55}
                  />
                );
              })}

            <g transform={`translate(${depot.x}, ${depot.y})`}>
              <rect x="-12" y="-10" width="24" height="20" rx="3" fill="#0f172a" stroke="white" strokeWidth="2" />
              <text x="0" y="4" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">D</text>
              <text x="0" y="26" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">Depot</text>
            </g>

            {hazards.map((h) => (
              <g key={h.id} transform={`translate(${h.x}, ${h.y})`}>
                <polygon points="0,-11 10,8 -10,8" fill={hazardColor[h.type]} stroke="white" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="10">{hazardGlyph[h.type]}</text>
              </g>
            ))}

            <g transform={`translate(${destination.x}, ${destination.y})`}>
              <circle r="14" fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="0,-11 10,8 -10,8" fill="#0f172a" stroke="white" strokeWidth="2" />
              <text x="0" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">{destination.id === "cold-marsh-green" ? "Cold Marsh Green" : destination.id}</text>
            </g>
          </svg>

          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-sm px-3 py-2 text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1 w-5 rounded-full bg-emerald-600" /> Recommended route
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-5 rounded-full bg-slate-400" style={{ backgroundImage: "repeating-linear-gradient(90deg,#94a3b8 0 4px,transparent 4px 7px)" }} /> Alternate route
            </div>
            <div className="flex items-center gap-2">
              <span>{hazardGlyph.flood}</span> Flood hazard
              <span>{hazardGlyph["power-line"]}</span> Downed line
              <span>{hazardGlyph["road-closure"]}</span> Road blocked
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Destination</h3>
          <select
            value={destination.id}
            onChange={(e) => onSelectDestination(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {dispatchDestinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
          {linkedMast && (
            <p className="text-xs text-slate-500 mt-2">
              Backup remaining: <span className="font-semibold text-slate-700">{linkedMast.backupHoursRemaining != null ? `${linkedMast.backupHoursRemaining} hrs` : "N/A"}</span>
              {linkedMast.intervention && <span className="text-rose-600 font-medium"> · manual intervention flagged</span>}
            </p>
          )}
          {dispatched && (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1.5 mt-2">
              Dispatched at {formatTime(dispatched.time)} via "{dispatched.routeLabel}"
            </p>
          )}
        </div>

        <div className="space-y-3">
          {scoredRoutes.map((r) => {
            const isRecommended = r.id === recommended.id;
            return (
              <div
                key={r.id}
                onMouseEnter={() => setHoveredRoute(r.id)}
                onMouseLeave={() => setHoveredRoute(null)}
                className={`bg-white rounded-xl border shadow-sm p-4 text-left ${
                  isRecommended ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{r.label}</p>
                  {isRecommended && (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 rounded-full px-2 py-0.5">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div className="bg-slate-50 rounded-md p-1.5">
                    <p className="text-slate-500">Distance</p>
                    <p className="font-semibold text-slate-800">{r.distanceMiles} mi</p>
                  </div>
                  <div className="bg-slate-50 rounded-md p-1.5">
                    <p className="text-slate-500">ETA</p>
                    <p className="font-semibold text-slate-800">{r.etaMinutes} min</p>
                  </div>
                  <div className="bg-slate-50 rounded-md p-1.5">
                    <p className="text-slate-500">Energy</p>
                    <p className="font-semibold text-slate-800">{r.energyKwh} kWh</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">{r.notes}</p>
                {r.hazardsOnRoute.length > 0 ? (
                  <p className="text-[11px] font-medium text-amber-700 mt-1">
                    ⚠ Passes {r.hazardsOnRoute.length} known hazard{r.hazardsOnRoute.length > 1 ? "s" : ""}
                  </p>
                ) : (
                  <p className="text-[11px] font-medium text-emerald-700 mt-1">No known hazards on this route</p>
                )}
                <button
                  onClick={() => handleDispatch(r)}
                  className={`w-full mt-3 text-xs font-medium rounded-lg py-2 ${
                    isRecommended ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
                  }`}
                >
                  Confirm dispatch via this route
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
