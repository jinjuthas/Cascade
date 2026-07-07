import { useState } from "react";
import { initialTimeline, orgMeta } from "../data/mockData";

const orgStyle = {
  energy: { dot: "bg-amber-500", pill: "bg-amber-100 text-amber-800" },
  telecom: { dot: "bg-teal-600", pill: "bg-teal-100 text-teal-800" },
  joint: { dot: "bg-slate-500", pill: "bg-slate-100 text-slate-700" },
};

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function Timeline() {
  const [events, setEvents] = useState(initialTimeline);
  const [draft, setDraft] = useState("");
  const [author, setAuthor] = useState("");
  const [org, setOrg] = useState("energy");

  function postUpdate() {
    if (!draft.trim()) return;
    const entry = {
      id: `t-${Date.now()}`,
      time: new Date().toISOString(),
      org,
      author: author.trim() || "Control Room Operator",
      text: draft.trim(),
    };
    setEvents((prev) => [...prev, entry]);
    setDraft("");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Shared Incident Timeline</h2>
          <p className="text-xs text-slate-500">Single chronological log — visible to both Energy DNO and Telecom MNO control room staff</p>
        </div>

        <ol className="p-4 space-y-0">
          {events.map((e, i) => {
            const meta = orgStyle[e.org];
            return (
              <li key={e.id} className="relative pl-6 pb-5 last:pb-0 text-left">
                {i !== events.length - 1 && (
                  <span className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-200" />
                )}
                <span className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white ${meta.dot}`} />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{formatTime(e.time)}</span>
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${meta.pill}`}>
                    {orgMeta[e.org].label}
                  </span>
                  <span className="text-xs font-medium text-slate-600">{e.author}</span>
                </div>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed">{e.text}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-fit space-y-3 text-left">
        <h3 className="text-sm font-semibold text-slate-900">Post an update</h3>

        <div>
          <label className="text-xs font-medium text-slate-600">Posting as</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              onClick={() => setOrg("energy")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                org === "energy" ? "bg-amber-500 text-white border-amber-500" : "border-slate-200 text-slate-600"
              }`}
            >
              Energy DNO
            </button>
            <button
              onClick={() => setOrg("telecom")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                org === "telecom" ? "bg-teal-600 text-white border-teal-600" : "border-slate-200 text-slate-600"
              }`}
            >
              Telecom MNO
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Name / role</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. A. Novak, Field Ops"
            className="mt-1 w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Update</label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="e.g. Generator deployed to Blythe Fen Church Rd mast site"
            className="mt-1 w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
          />
        </div>

        <button
          onClick={postUpdate}
          disabled={!draft.trim()}
          className="w-full bg-slate-900 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg py-2 transition-colors"
        >
          Post to shared timeline
        </button>
      </div>
    </div>
  );
}
