import { weatherTimeline, sunTimes, weatherHeatmapPoints, cableRiskLevel } from "../data/mockData";

const conditionIcon = { sunny: "☀️", cloudy: "⛅", rain: "🌧️", storm: "⛈️" };
const conditionLabel = { sunny: "Sunny", cloudy: "Cloudy", rain: "Rain", storm: "Storm" };

// Compass bearing wind is blowing FROM (standard met convention).
const FROM_DEGREES = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Rotation for a "↑" glyph so it visually points in the direction the wind is blowing TOWARD.
function windArrowRotation(dir) {
  return (FROM_DEGREES[dir] + 180) % 360;
}

// Cold-to-warm gradient across a fixed 8-24°C range, used only for the heat map — independent
// of, and does not affect, the existing wind-severity colour scale in cableRiskLevel().
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

export default function WeatherForecast() {
  const now = weatherTimeline.find((h) => h.hourOffset === 0);
  const severity = cableRiskLevel(now.gustMph);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
        <h2 className="text-base font-semibold text-slate-900">Weather Forecast</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Rural Suffolk, UK — Wickham Cross &amp; Blythe Fen area. Demonstration data only.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Current conditions</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-5xl">{conditionIcon[now.condition]}</span>
            <div>
              <p className="text-4xl font-semibold text-slate-900">{now.tempC}°C</p>
              <p className="text-xs text-slate-500">
                Feels like {now.feelsLikeC}°C · {conditionLabel[now.condition]}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            <div className="bg-slate-50 rounded-md p-2.5">
              <p className="text-slate-500">Rain</p>
              <p className="font-semibold text-slate-800">{now.rainMm} mm/hr</p>
            </div>
            <div className="bg-slate-50 rounded-md p-2.5">
              <p className="text-slate-500">Wind</p>
              <p className="font-semibold text-slate-800 flex items-center gap-1">
                {now.gustMph} mph
                <span
                  className="inline-block"
                  style={{ transform: `rotate(${windArrowRotation(now.windDir)}deg)` }}
                >
                  ↑
                </span>
                {now.windDir}
              </p>
            </div>
            <div className="bg-slate-50 rounded-md p-2.5">
              <p className="text-slate-500">Wind severity</p>
              <p className="font-semibold capitalize" style={{ color: severity.color }}>
                {severity.level}
              </p>
            </div>
            <div className="bg-slate-50 rounded-md p-2.5">
              <p className="text-slate-500">Sunrise / Sunset</p>
              <p className="font-semibold text-slate-800">
                ☀️ {sunTimes.sunrise} · 🌙 {sunTimes.sunset}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Wind severity uses the same scale as the Map View weather layer (unchanged).
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Temperature heat map</h3>
          <p className="text-xs text-slate-500 mb-2">Current temperature by area, relative to the surrounding fen.</p>
          <div className="relative bg-[#eef3ea] rounded-lg overflow-hidden">
            <svg viewBox="0 0 800 480" className="w-full h-auto block" role="img" aria-label="Temperature heat map">
              <defs>
                <pattern id="fields-weather" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="#eef3ea" />
                  <path d="M0 40 L40 0" stroke="#dde7d6" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="800" height="480" fill="url(#fields-weather)" />
              <path d="M0 400 Q 250 360 400 410 T 800 380" stroke="#a9cbe8" strokeWidth="10" fill="none" opacity="0.7" />

              {weatherHeatmapPoints.map((p) => {
                const temp = Math.round((now.tempC + p.tempOffsetC) * 10) / 10;
                const color = tempColor(temp);
                return (
                  <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                    <circle r="34" fill={color} fillOpacity="0.35" />
                    <circle r="9" fill={color} stroke="white" strokeWidth="2" />
                    <text y="-18" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1e293b">
                      {p.label}
                    </text>
                    <text y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e293b">
                      {temp}°C
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span>Cooler</span>
            <span
              className="h-2 flex-1 rounded-full"
              style={{ background: "linear-gradient(90deg, rgb(37,99,235), rgb(16,185,129), rgb(249,115,22))" }}
            />
            <span>Warmer</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Hourly forecast</h3>
          <p className="text-xs text-slate-500">-6h to +6h around the current incident time</p>
        </div>
        <div className="overflow-x-auto">
          <div className="flex divide-x divide-slate-100 min-w-max">
            {weatherTimeline.map((h) => {
              const isNow = h.hourOffset === 0;
              const hourSeverity = cableRiskLevel(h.gustMph);
              return (
                <div
                  key={h.hourOffset}
                  className={`flex flex-col items-center gap-1 px-4 py-3 w-[92px] shrink-0 ${
                    isNow ? "bg-slate-900 text-white" : "text-slate-700"
                  }`}
                >
                  <p className={`text-xs font-semibold ${isNow ? "text-white" : "text-slate-500"}`}>{h.label}</p>
                  <span className="text-2xl">{conditionIcon[h.condition]}</span>
                  <p className="text-sm font-semibold">{h.tempC}°C</p>
                  <p className={`text-[11px] ${isNow ? "text-slate-300" : "text-slate-500"}`}>{h.rainMm} mm</p>
                  <p className={`text-[11px] flex items-center gap-0.5 ${isNow ? "text-slate-300" : "text-slate-500"}`}>
                    <span className="inline-block" style={{ transform: `rotate(${windArrowRotation(h.windDir)}deg)` }}>
                      ↑
                    </span>
                    {h.gustMph} {h.windDir}
                  </p>
                  <span
                    className="text-[10px] font-medium capitalize rounded-full px-1.5 py-0.5 mt-0.5"
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
    </div>
  );
}
