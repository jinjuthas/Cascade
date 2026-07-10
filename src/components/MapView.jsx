import { useMemo, useState } from "react";
import {
  settlements,
  powerOutageZone,
  mobileOutageZone,
  vulnerabilityZones,
  mastSites,
  displayPsrCount,
  weatherTimeline,
  cableRiskPoints,
  cableRiskLevel,
  sunTimes,
  weatherHeatmapPoints,
} from "../data/mockData";

const conditionIcon = { sunny: "☀️", cloudy: "⛅", rain: "🌧️", storm: "⛈️" };
const conditionLabel = { sunny: "Sunny", cloudy: "Cloudy", rain: "Rain", storm: "Storm" };

// Compass bearing wind is blowing FROM (standard met convention).
const FROM_DEGREES = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Rotation for a "↑" glyph so it visually points in the direction the wind is blowing TOWARD.
function windArrowRotation(dir) {
  return (FROM_DEGREES[dir] + 180) % 360;
}

// Cold-to-warm gradient across a fixed 8-24°C range, used only for the temperature heat map —
// independent of, and does not affect, the existing wind-severity colour scale below.
function tempColor(tempC) {
  const clamped = Math.max(8, Math.min(24, tempC));
  const cold = [37, 99, 235];
  const mid = [16, 185, 129];
  const warm = [249, 115, 22];
  const pos = (clamped - 8) / 16;
  const [c1, c2, local] = pos < 0.5 ? [cold, mid, pos / 0.5] : [mid, warm, (pos - 0.5) / 0.5];
  const rgb = c1.map((v, i) => Math.round(v + (c2[i] - v) * local));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

const statusStyle = {
  "on-backup": "bg-amber-100 text-amber-800 ring-amber-300",
  "critical-backup": "bg-rose-100 text-rose-800 ring-rose-300",
  "awaiting-auto-restart": "bg-teal-100 text-teal-800 ring-teal-300",
  "manual-required": "bg-rose-100 text-rose-800 ring-rose-300",
};

const welfarePinColor = {
  reported: "#dc2626",
  "in-progress": "#d97706",
  resolved: "#16a34a",
};

const welfareStatusLabel = {
  reported: "Reported",
  "in-progress": "In progress",
  resolved: "Resolved",
};

export default function MapView({ onPlanRoute, welfareTasks = [] }) {
  const [showVulnerability, setShowVulnerability] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showWelfarePins, setShowWelfarePins] = useState(true);
  const [showForecast, setShowForecast] = useState(false);
  const [hourIndex, setHourIndex] = useState(6); // index 6 = hourOffset 0 ("Now")
  const [selected, setSelected] = useState(null); // { type: "mast" | "welfare", id }

  const selectedMast = selected?.type === "mast" ? mastSites.find((m) => m.id === selected.id) : null;
  const selectedWelfare = selected?.type === "welfare" ? welfareTasks.find((w) => w.id === selected.id) : null;
  const currentHour = weatherTimeline[hourIndex];
  const nowWeather = weatherTimeline.find((h) => h.hourOffset === 0);
  const nowSeverity = cableRiskLevel(nowWeather.gustMph);

  const riskReadings = useMemo(
    () =>
      cableRiskPoints.map((p) => {
        const effectiveGust = Math.round(currentHour.gustMph * p.exposure);
        return { ...p, effectiveGust, risk: cableRiskLevel(effectiveGust) };
      }),
    [currentHour]
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Outage Overlay Map</h2>
              <p className="text-xs text-slate-500">Wickham Cross &amp; Blythe Fen area, rural Suffolk, UK</p>
            </div>
            <button
              onClick={() => setShowForecast((v) => !v)}
              aria-expanded={showForecast}
              aria-label="Toggle weather forecast"
              className={`flex items-center gap-1.5 text-sm font-medium rounded-full pl-2 pr-3 py-1 border transition-colors ${
                showForecast ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="text-lg leading-none">{conditionIcon[nowWeather.condition]}</span>
              <span>{nowWeather.tempC}°C</span>
              <span className="inline-block" style={{ transform: `rotate(${windArrowRotation(nowWeather.windDir)}deg)` }}>
                ↑
              </span>
              <span>{nowWeather.windDir}</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 select-none cursor-pointer bg-slate-50 border border-slate-200 rounded-full pl-3 pr-1 py-1">
              Weather layer
              <button
                type="button"
                role="switch"
                aria-checked={showWeather}
                onClick={() => setShowWeather((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  showWeather ? "bg-sky-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    showWeather ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 select-none cursor-pointer bg-slate-50 border border-slate-200 rounded-full pl-3 pr-1 py-1">
              Vulnerability layer
              <button
                type="button"
                role="switch"
                aria-checked={showVulnerability}
                onClick={() => setShowVulnerability((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  showVulnerability ? "bg-amber-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    showVulnerability ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 select-none cursor-pointer bg-slate-50 border border-slate-200 rounded-full pl-3 pr-1 py-1">
              Welfare pins
              <button
                type="button"
                role="switch"
                aria-checked={showWelfarePins}
                onClick={() => setShowWelfarePins((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  showWelfarePins ? "bg-rose-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    showWelfarePins ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {showForecast && (
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-left">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{conditionIcon[nowWeather.condition]}</span>
                <div>
                  <p className="text-xl font-semibold text-slate-900">{nowWeather.tempC}°C</p>
                  <p className="text-xs text-slate-500">
                    Feels like {nowWeather.feelsLikeC}°C · {conditionLabel[nowWeather.condition]}
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-600">
                <p className="text-slate-500">Rain</p>
                <p className="font-semibold">{nowWeather.rainMm} mm/hr</p>
              </div>
              <div className="text-xs text-slate-600">
                <p className="text-slate-500">Wind</p>
                <p className="font-semibold flex items-center gap-1">
                  {nowWeather.gustMph} mph
                  <span className="inline-block" style={{ transform: `rotate(${windArrowRotation(nowWeather.windDir)}deg)` }}>
                    ↑
                  </span>
                  {nowWeather.windDir} ·{" "}
                  <span style={{ color: nowSeverity.color }} className="capitalize">
                    {nowSeverity.level}
                  </span>
                </p>
              </div>
              <div className="text-xs text-slate-600">
                <p className="text-slate-500">Sunrise / Sunset</p>
                <p className="font-semibold">
                  ☀️ {sunTimes.sunrise} · 🌙 {sunTimes.sunset}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Temperature by area
              </p>
              <div className="flex flex-wrap gap-2">
                {weatherHeatmapPoints.map((p) => {
                  const temp = Math.round((nowWeather.tempC + p.tempOffsetC) * 10) / 10;
                  return (
                    <span
                      key={p.id}
                      className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-full pl-1.5 pr-2.5 py-1"
                    >
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: tempColor(temp) }} />
                      {p.label}: <span className="font-semibold">{temp}°C</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Past &amp; predicted (-6h to +6h)
              </p>
              <div className="overflow-x-auto -mx-1">
                <div className="flex gap-1 px-1 min-w-max">
                  {weatherTimeline.map((h) => {
                    const isNow = h.hourOffset === 0;
                    const hourSeverity = cableRiskLevel(h.gustMph);
                    return (
                      <div
                        key={h.hourOffset}
                        className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-2 w-[66px] shrink-0 ${
                          isNow ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700"
                        }`}
                      >
                        <p className={`text-[10px] font-semibold ${isNow ? "text-white" : "text-slate-500"}`}>{h.label}</p>
                        <span className="text-lg leading-none">{conditionIcon[h.condition]}</span>
                        <p className="text-xs font-semibold">{h.tempC}°C</p>
                        <p className={`text-[10px] ${isNow ? "text-slate-300" : "text-slate-500"}`}>{h.rainMm}mm</p>
                        <p className={`text-[10px] flex items-center gap-0.5 ${isNow ? "text-slate-300" : "text-slate-500"}`}>
                          <span className="inline-block" style={{ transform: `rotate(${windArrowRotation(h.windDir)}deg)` }}>
                            ↑
                          </span>
                          {h.gustMph}
                        </p>
                        <span
                          className="text-[9px] font-medium capitalize rounded-full px-1 mt-0.5"
                          style={{
                            color: isNow ? "#0f172a" : hourSeverity.color,
                            background: isNow ? "white" : `${hourSeverity.color}1a`,
                          }}
                        >
                          {hourSeverity.level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Wind severity uses the same scale as the Weather layer below (unchanged).
            </p>
          </div>
        )}

        {showWeather && (
          <div className="px-4 py-3 border-b border-slate-200 bg-sky-50/60">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <label htmlFor="weather-scrubber" className="text-xs font-medium text-slate-700">
                Forecast time: <span className="font-semibold text-slate-900">{currentHour.label}</span>
                {currentHour.forecast && <span className="text-sky-700"> (forecast)</span>}
              </label>
              <span className="text-xs font-semibold text-slate-700">Base gust: {currentHour.gustMph} mph</span>
            </div>
            <input
              id="weather-scrubber"
              type="range"
              min="0"
              max={weatherTimeline.length - 1}
              step="1"
              value={hourIndex}
              onChange={(e) => setHourIndex(Number(e.target.value))}
              className="w-full accent-sky-600"
              aria-valuetext={`${currentHour.label}, base gust ${currentHour.gustMph} mph`}
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>-6h</span>
              <span>Now</span>
              <span>+6h</span>
            </div>
          </div>
        )}

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
              fill="#2563eb"
              fillOpacity="0.25"
              stroke="#1d4ed8"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <polygon
              points={mobileOutageZone.points}
              fill="#dc2626"
              fillOpacity="0.25"
              stroke="#b91c1c"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <polygon
              points={mobileOutageZone.points}
              clipPath="url(#clip-power-zone)"
              fill="#7e22ce"
              fillOpacity="0.55"
              stroke="#6b21a8"
              strokeWidth="2"
            />

            {showWeather &&
              riskReadings.map((p) => (
                <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                  <circle r="10" fill={p.risk.color} fillOpacity="0.85" stroke="white" strokeWidth="2" />
                  <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">
                    {p.effectiveGust}
                  </text>
                  <text y="-16" textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b" className="capitalize">
                    {p.risk.level}
                  </text>
                </g>
              ))}

            {showVulnerability &&
              vulnerabilityZones.map((z) => {
                const r = 14 + Math.sqrt(z.psrCount) * 4;
                return (
                  <g key={z.id}>
                    <circle cx={z.x} cy={z.y} r={r} fill="#d97706" fillOpacity="0.25" stroke="#d97706" strokeWidth="1.5" />
                    <circle cx={z.x} cy={z.y} r="3" fill="#92400e" />
                    <text x={z.x} y={z.y - r - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="#92400e">
                      {displayPsrCount(z.psrCount)} PSR
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

            {showWelfarePins &&
              welfareTasks.map((w) => {
                const isSelected = selected?.type === "welfare" && selected.id === w.id;
                return (
                  <g
                    key={w.id}
                    transform={`translate(${w.x}, ${w.y})`}
                    onClick={() => setSelected(isSelected ? null : { type: "welfare", id: w.id })}
                    className="cursor-pointer"
                  >
                    {isSelected && <circle r="16" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="3 3" />}
                    <circle r="7" fill={welfarePinColor[w.status]} stroke="white" strokeWidth="2" />
                  </g>
                );
              })}

            {mastSites.map((m) => {
              const isSelected = selected?.type === "mast" && selected.id === m.id;
              const needsAttention = m.intervention;
              return (
                <g
                  key={m.id}
                  transform={`translate(${m.x}, ${m.y})`}
                  onClick={() => setSelected(isSelected ? null : { type: "mast", id: m.id })}
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
              <span className="h-3 w-3 rounded-sm bg-blue-600/40 border border-blue-700" /> Power outage zone
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-red-600/40 border border-red-700" /> Mobile outage zone
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-purple-700/60 border border-purple-800" /> Dual outage (overlap)
            </div>
            {showWelfarePins && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="h-3 w-3 rounded-full" style={{ background: welfarePinColor.reported }} />
                <span className="h-3 w-3 rounded-full" style={{ background: welfarePinColor["in-progress"] }} />
                <span className="h-3 w-3 rounded-full" style={{ background: welfarePinColor.resolved }} />
                <span>Welfare case (reported / in progress / resolved)</span>
              </div>
            )}
            {showVulnerability && (
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-600/30 border border-amber-700" /> PSR-flagged density
              </div>
            )}
            {showWeather && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="h-3 w-3 rounded-full" style={{ background: "#16a34a" }} />
                <span className="h-3 w-3 rounded-full" style={{ background: "#eab308" }} />
                <span className="h-3 w-3 rounded-full" style={{ background: "#f97316" }} />
                <span className="h-3 w-3 rounded-full" style={{ background: "#b91c1c" }} />
                <span>Cable wind risk (low → severe)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Site detail</h3>
          {selectedMast && (
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
              {onPlanRoute && (
                <button
                  onClick={() => onPlanRoute(selectedMast.id)}
                  className="w-full mt-1 bg-slate-900 text-white text-xs font-medium rounded-lg py-2"
                >
                  Plan safest route to site →
                </button>
              )}
            </div>
          )}
          {selectedWelfare && (
            <div className="space-y-2 text-left">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{selectedWelfare.title}</p>
                <span
                  className="shrink-0 h-2.5 w-2.5 rounded-full mt-1"
                  style={{ background: welfarePinColor[selectedWelfare.status] }}
                />
              </div>
              <p className="text-xs text-slate-500">{selectedWelfare.location}</p>
              <span className="inline-flex ring-1 ring-slate-200 bg-slate-50 rounded-full px-2 py-0.5 text-xs font-medium text-slate-700">
                {welfareStatusLabel[selectedWelfare.status]}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedWelfare.detail}</p>
              <div className="pt-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Reference notes</p>
                <ul className="space-y-1">
                  {selectedWelfare.history.map((h, i) => (
                    <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                      <span className="font-mono text-slate-400 shrink-0">{h.time}</span>
                      <span>{h.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {!selectedMast && !selectedWelfare && (
            <p className="text-sm text-slate-500">Select a mast marker or welfare pin on the map to see its status.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Weather layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Wind gust exposure at each overhead-line cable run, scrubbed across a -6h to +6h
            forecast window so planners can see how cable risk builds and eases as the storm
            passes. Ratings are relative and for demonstration only.
          </p>
          {showWeather && (
            <ul className="mt-3 space-y-1.5 text-xs">
              {riskReadings.map((p) => (
                <li key={p.id} className="flex items-center justify-between border-b border-slate-100 py-1 last:border-0">
                  <span className="text-slate-700">{p.label}</span>
                  <span className="font-semibold capitalize" style={{ color: p.risk.color }}>
                    {p.effectiveGust} mph · {p.risk.level}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Vulnerability layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Shows anonymised, aggregate counts of Priority Services Register (PSR) flagged households per zone only.
            No names, addresses or personal data are displayed on this dashboard, consistent with GDPR data
            minimisation requirements — individual welfare actions are coordinated via the Welfare Task Board.
            Zone counts below 5 are shown as "&lt;5" rather than an exact figure, since a precise small number in a
            rural hamlet can be enough to identify an individual.
          </p>
          {showVulnerability && (
            <ul className="mt-3 space-y-1.5 text-xs">
              {vulnerabilityZones.map((z) => (
                <li key={z.id} className="flex items-center justify-between border-b border-slate-100 py-1 last:border-0">
                  <span className="text-slate-700">{z.label}</span>
                  <span className="font-semibold text-amber-700">{displayPsrCount(z.psrCount)} PSR · {displayPsrCount(z.households)} households</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
