import { initialGeneratorFleet, resolveGeneratorDestinationId } from "../data/mockData";

function FuelBar({ percent }) {
  const color = percent <= 20 ? "bg-rose-500" : percent <= 40 ? "bg-amber-500" : "bg-teal-600";
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-slate-800">{percent}%</span>
        <span className="text-[11px] text-slate-400">fuel</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function ResourcePanel({ onPlanRoute }) {
  const fleet = initialGeneratorFleet;
  const deployed = fleet.filter((g) => g.status === "deployed");
  const inStock = fleet.filter((g) => g.status === "in-stock");
  const lowFuel = deployed.filter((g) => g.fuelPercent <= 20);
  const manualHandover = deployed.filter((g) => g.autoHandover === "manual");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Fleet size</p>
          <p className="text-2xl font-semibold text-slate-900">{fleet.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Deployed</p>
          <p className="text-2xl font-semibold text-blue-700">{deployed.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">In stock at depot</p>
          <p className="text-2xl font-semibold text-teal-700">{inStock.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
          <p className="text-xs text-slate-500">Low fuel (&le;20%)</p>
          <p className="text-2xl font-semibold text-rose-600">{lowFuel.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Generator Fleet</h2>
          <p className="text-xs text-slate-500">
            Deployed and in-stock backup generators — location, fuel, mains status, and handover mode
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                <th className="px-4 py-2.5 font-medium">Unit</th>
                <th className="px-4 py-2.5 font-medium">Location</th>
                <th className="px-4 py-2.5 font-medium w-40">Fuel</th>
                <th className="px-4 py-2.5 font-medium">Mains restored</th>
                <th className="px-4 py-2.5 font-medium">Handover</th>
                <th className="px-4 py-2.5 font-medium">Assigned to</th>
                <th className="px-4 py-2.5 font-medium">Notes</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((g) => (
                <tr key={g.id} className="border-b border-slate-100 last:border-0 align-top">
                  <td className="px-4 py-3 text-left">
                    <p className="font-semibold text-slate-900">{g.id}</p>
                    <span
                      className={`inline-flex mt-0.5 ring-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        g.status === "deployed"
                          ? "bg-blue-100 text-blue-800 ring-blue-300"
                          : "bg-teal-100 text-teal-800 ring-teal-300"
                      }`}
                    >
                      {g.status === "deployed" ? "Deployed" : "In stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left text-xs text-slate-700 max-w-[160px]">{g.location}</td>
                  <td className="px-4 py-3">
                    <FuelBar percent={g.fuelPercent} />
                  </td>
                  <td className="px-4 py-3 text-left">
                    {g.mainsRestored === null ? (
                      <span className="text-xs text-slate-400">N/A</span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          g.mainsRestored ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${g.mainsRestored ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {g.mainsRestored ? "Yes" : "No"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <span className={`text-xs font-medium ${g.autoHandover === "manual" ? "text-amber-700" : "text-slate-700"}`}>
                      {g.autoHandover === "manual" ? "Manual required" : "Automatic"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left text-xs text-slate-600">{g.assignedTo}</td>
                  <td className="px-4 py-3 text-left text-xs text-slate-600 max-w-xs">{g.notes}</td>
                  <td className="px-4 py-3 text-left">
                    {onPlanRoute && g.status === "deployed" && g.fuelPercent <= 40 && (
                      <button
                        onClick={() => onPlanRoute(resolveGeneratorDestinationId(g.id))}
                        className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 whitespace-nowrap hover:bg-slate-100"
                      >
                        Plan fuel delivery →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {manualHandover.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-xs text-amber-800">
          ⚠ {manualHandover.map((g) => g.id).join(", ")} {manualHandover.length > 1 ? "have" : "has"} a faulty
          auto-handover relay — a field engineer will need to manually switch the site back to mains power once
          it's restored, rather than the generator handing back automatically.
        </div>
      )}
    </div>
  );
}
