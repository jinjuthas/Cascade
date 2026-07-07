import { mastSites } from "../data/mockData";

const statusConfig = {
  "on-backup": { label: "On backup power", pill: "bg-amber-100 text-amber-800 ring-amber-300" },
  "critical-backup": { label: "Critical — backup low", pill: "bg-rose-100 text-rose-800 ring-rose-300" },
  "awaiting-auto-restart": { label: "Auto-restart pending", pill: "bg-teal-100 text-teal-800 ring-teal-300" },
  "manual-required": { label: "Manual intervention required", pill: "bg-rose-100 text-rose-800 ring-rose-300" },
};

function BackupBar({ hours }) {
  if (hours == null) {
    return <span className="text-xs text-slate-400">N/A</span>;
  }
  const pct = Math.max(0, Math.min(100, (hours / 8) * 100));
  const color = hours <= 2 ? "bg-rose-500" : hours <= 4 ? "bg-amber-500" : "bg-teal-600";
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-slate-800">{hours} hrs</span>
        <span className="text-[11px] text-slate-400">remaining</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function RestartPanel() {
  const interventionCount = mastSites.filter((m) => m.intervention).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Sites in area</p>
          <p className="text-2xl font-semibold text-slate-900">{mastSites.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">On backup power</p>
          <p className="text-2xl font-semibold text-amber-600">
            {mastSites.filter((m) => m.mainsPower === "out").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Auto-restart pending</p>
          <p className="text-2xl font-semibold text-teal-700">
            {mastSites.filter((m) => m.autoRestart === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Need manual action</p>
          <p className="text-2xl font-semibold text-rose-600">{interventionCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Mast Site Auto-Restart Status</h2>
          <p className="text-xs text-slate-500">Backup power and restoration status for affected sites</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                <th className="px-4 py-2.5 font-medium">Site</th>
                <th className="px-4 py-2.5 font-medium">Mains power</th>
                <th className="px-4 py-2.5 font-medium w-48">Backup remaining</th>
                <th className="px-4 py-2.5 font-medium">Auto-restart</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {mastSites.map((m) => {
                const cfg = statusConfig[m.status];
                return (
                  <tr key={m.id} className="border-b border-slate-100 last:border-0 align-top">
                    <td className="px-4 py-3 text-left">
                      <p className="font-semibold text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.id} · {m.village}</p>
                    </td>
                    <td className="px-4 py-3 text-left">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          m.mainsPower === "out" ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${m.mainsPower === "out" ? "bg-rose-500" : "bg-emerald-500"}`} />
                        {m.mainsPower === "out" ? "Off" : m.mainsPower === "restored" ? "Restored" : "On"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <BackupBar hours={m.backupHoursRemaining} />
                    </td>
                    <td className="px-4 py-3 text-left">
                      <span className="text-xs font-medium capitalize text-slate-700">{m.autoRestart}</span>
                    </td>
                    <td className="px-4 py-3 text-left">
                      <span className={`inline-flex ring-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${cfg.pill}`}>
                        {cfg.label}
                      </span>
                      {m.intervention && (
                        <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
                          ⚠ Manual intervention flagged
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-left text-xs text-slate-600 max-w-xs">{m.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
