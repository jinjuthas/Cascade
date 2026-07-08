import { useState } from "react";
import { incident, initialTimeline } from "./data/mockData";
import MapView from "./components/MapView";
import RestartPanel from "./components/RestartPanel";
import Timeline from "./components/Timeline";
import WelfareBoard from "./components/WelfareBoard";
import RoutePlanner from "./components/RoutePlanner";

const TABS = [
  { id: "map", label: "Map View" },
  { id: "restart", label: "Auto-Restart Status" },
  { id: "route", label: "Route Planner" },
  { id: "timeline", label: "Shared Timeline" },
  { id: "welfare", label: "Welfare Task Board" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [routeDestinationId, setRouteDestinationId] = useState("BLF-002");
  const [timelineEvents, setTimelineEvents] = useState(initialTimeline);

  function goToRoutePlanner(destinationId) {
    setRouteDestinationId(destinationId);
    setActiveTab("route");
  }

  function postTimelineEvent(entry) {
    setTimelineEvents((prev) => [...prev, entry]);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg overflow-hidden flex shrink-0 shadow-sm ring-1 ring-slate-200">
              <div className="w-1/2 h-full bg-blue-600" />
              <div className="w-1/2 h-full bg-red-600" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-semibold leading-tight tracking-tight">Cascade</h1>
              <p className="text-xs text-slate-500 leading-tight">Joint outage &amp; vulnerability dashboard</p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2 text-left">
            <span className="inline-flex h-2 w-2 rounded-full bg-rose-600 animate-pulse shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-800 leading-tight">{incident.name}</p>
              <p className="text-xs text-slate-500 leading-tight">
                {incident.region} · {incident.status}
              </p>
            </div>
          </div>
        </div>

        <nav className="mx-auto max-w-[1600px] px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-[1600px] px-4 sm:px-6 py-5">
        {activeTab === "map" && <MapView onPlanRoute={goToRoutePlanner} />}
        {activeTab === "restart" && <RestartPanel onPlanRoute={goToRoutePlanner} />}
        {activeTab === "route" && (
          <RoutePlanner destinationId={routeDestinationId} onSelectDestination={setRouteDestinationId} onDispatch={postTimelineEvent} />
        )}
        {activeTab === "timeline" && <Timeline events={timelineEvents} onPost={postTimelineEvent} />}
        {activeTab === "welfare" && <WelfareBoard onPlanRoute={goToRoutePlanner} />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-3">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 flex items-center justify-between text-xs text-slate-400">
          <span>Cascade prototype · demonstration data only</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-blue-600" /> Energy DNO
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-red-600" /> Telecom MNO
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}
