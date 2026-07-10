import { useState } from "react";
import { initialCommsUnits } from "../data/mockData";

const STATUS_ORDER = ["in-storage", "pre-positioned", "deployed"];

const statusConfig = {
  "in-storage": { label: "In storage", pill: "bg-slate-100 text-slate-700 ring-slate-300" },
  "pre-positioned": { label: "Pre-positioned", pill: "bg-amber-100 text-amber-800 ring-amber-300" },
  deployed: { label: "Deployed", pill: "bg-blue-100 text-blue-800 ring-blue-300" },
};

export default function CommsDeployment() {
  const [units, setUnits] = useState(initialCommsUnits);

  function toggleChecklistItem(unitId, stepIndex) {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? { ...u, checklist: u.checklist.map((c, i) => (i === stepIndex ? { ...c, done: !c.done } : c)) }
          : u
      )
    );
  }

  function advanceStatus(unitId) {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        const idx = STATUS_ORDER.indexOf(u.status);
        if (idx >= STATUS_ORDER.length - 1) return u;
        return { ...u, status: STATUS_ORDER[idx + 1] };
      })
    );
  }

  const deployed = units.filter((u) => u.status === "deployed").length;
  const prePositioned = units.filter((u) => u.status === "pre-positioned").length;
  const inStorage = units.filter((u) => u.status === "in-storage").length;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
        <h2 className="text-base font-semibold text-slate-900">Portable Comms Deployment</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Satellite phone / mesh radio kits for backup welfare comms — pre-positioned ahead of storms via the
          depot cache network, then deployed to site as needed.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">In storage</p>
          <p className="text-2xl font-semibold text-slate-700">{inStorage}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Pre-positioned</p>
          <p className="text-2xl font-semibold text-amber-700">{prePositioned}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Deployed</p>
          <p className="text-2xl font-semibold text-blue-700">{deployed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {units.map((u) => {
          const cfg = statusConfig[u.status];
          const idx = STATUS_ORDER.indexOf(u.status);
          const doneCount = u.checklist.filter((c) => c.done).length;
          return (
            <div key={u.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{u.id}</p>
                  <p className="text-xs text-slate-500">{u.location}</p>
                </div>
                <span className={`shrink-0 inline-flex ring-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.pill}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{u.notes}</p>
              <p className="text-xs text-slate-500">Assigned to: <span className="font-medium text-slate-700">{u.assignedTo}</span></p>

              <div className="pt-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Training/usage checklist ({doneCount}/{u.checklist.length})
                </p>
                <ul className="space-y-1">
                  {u.checklist.map((c, i) => (
                    <li key={i}>
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={c.done}
                          onChange={() => toggleChecklistItem(u.id, i)}
                          className="h-3.5 w-3.5 accent-blue-600"
                        />
                        <span className={c.done ? "line-through text-slate-400" : ""}>{c.step}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => advanceStatus(u.id)}
                disabled={idx >= STATUS_ORDER.length - 1}
                className="w-full mt-2 text-xs font-medium text-white bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 rounded-lg py-2 disabled:cursor-not-allowed"
              >
                {idx === STATUS_ORDER.length - 2 ? "Deploy to site" : idx === STATUS_ORDER.length - 1 ? "Deployed" : "Pre-position unit"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
