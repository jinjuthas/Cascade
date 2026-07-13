import { engineerStatus, formatRelativeMinutes } from "../data/mockData";

const orgDot = { energy: "bg-blue-600", telecom: "bg-red-600" };

const statusPill = {
  ok: "bg-emerald-100 text-emerald-800 ring-emerald-300",
  "due-soon": "bg-amber-100 text-amber-800 ring-amber-300",
  overdue: "bg-rose-100 text-rose-800 ring-rose-300",
  sos: "bg-rose-600 text-white ring-rose-700",
};

export default function EngineerSafety({ engineers, onCheckIn, onTriggerSOS, onResolveSOS }) {
  const sosEngineers = engineers.filter((e) => e.sosActive);
  const overdueEngineers = engineers.filter((e) => !e.sosActive && engineerStatus(e).level === "overdue");

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
        <h2 className="text-base font-semibold text-slate-900">Engineer Check-in &amp; Safety</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Field engineers check in every 1-2 hours while working alone in the outage area. Overdue
          check-ins and SOS alerts are flagged here immediately for control-room follow-up.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Engineers in field</p>
          <p className="text-2xl font-semibold text-slate-900">{engineers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Overdue check-in</p>
          <p className="text-2xl font-semibold text-amber-700">{overdueEngineers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">SOS active</p>
          <p className="text-2xl font-semibold text-rose-600">{sosEngineers.length}</p>
        </div>
      </div>

      {sosEngineers.length > 0 && (
        <div className="space-y-3">
          {sosEngineers.map((e) => (
            <div key={e.id} className="bg-rose-600 text-white rounded-xl p-4 text-left shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold flex items-center gap-1.5">🚨 SOS — {e.name}</p>
                  <p className="text-xs text-rose-100">{e.role} · {e.assignment}</p>
                  <p className="text-xs text-rose-100 mt-1">Triggered {formatRelativeMinutes(e.sosTime)}</p>
                </div>
                <button
                  onClick={() => onResolveSOS(e.id)}
                  className="shrink-0 bg-white text-rose-700 text-xs font-semibold rounded-lg px-3 py-2 hover:bg-rose-50"
                >
                  Confirm safe / resolve
                </button>
              </div>
              {e.sosNote && <p className="text-xs text-rose-50 bg-rose-700/60 rounded-md px-2 py-1.5 mt-2">{e.sosNote}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engineers.map((e) => {
          const status = engineerStatus(e);
          return (
            <div key={e.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${orgDot[e.org]}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                    <p className="text-xs text-slate-500">{e.role}</p>
                  </div>
                </div>
                <span className={`shrink-0 inline-flex ring-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusPill[status.level]}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{e.assignment}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-md p-2">
                  <p className="text-slate-500">Last check-in</p>
                  <p className="font-semibold text-slate-800">{formatRelativeMinutes(e.lastCheckIn)}</p>
                </div>
                <div className="bg-slate-50 rounded-md p-2">
                  <p className="text-slate-500">Check-in interval</p>
                  <p className="font-semibold text-slate-800">Every {e.checkInIntervalMinutes / 60}h</p>
                </div>
              </div>

              {e.sosActive ? (
                <button
                  onClick={() => onResolveSOS(e.id)}
                  className="w-full text-xs font-semibold text-white bg-rose-600 rounded-lg py-2 hover:bg-rose-700"
                >
                  Confirm safe / resolve SOS
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => onCheckIn(e.id)}
                    className="flex-1 text-xs font-medium text-white bg-slate-900 rounded-lg py-2 hover:bg-slate-800"
                  >
                    Check in now
                  </button>
                  <button
                    onClick={() => onTriggerSOS(e.id)}
                    className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 hover:bg-rose-100"
                  >
                    Flag SOS
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
