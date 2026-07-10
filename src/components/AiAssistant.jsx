import { useState } from "react";
import { mastSites, initialGeneratorFleet, vulnerabilityZones, displayPsrCount } from "../data/mockData";

const SUGGESTIONS = [
  "How many welfare checks are outstanding?",
  "How many generators are dispatched?",
  "Which mast sites need manual intervention?",
  "How many people are PSR-flagged in the dual-outage zone?",
];

function answerQuery(query, welfareTasks) {
  const q = query.toLowerCase();

  if (q.includes("welfare")) {
    const outstanding = welfareTasks.filter((t) => t.status !== "resolved");
    const reported = outstanding.filter((t) => t.status === "reported").length;
    const inProgress = outstanding.filter((t) => t.status === "in-progress").length;
    return `${outstanding.length} welfare check${outstanding.length === 1 ? "" : "s"} outstanding — ${reported} reported, ${inProgress} in progress. ${welfareTasks.length - outstanding.length} resolved so far.`;
  }

  if (q.includes("generator")) {
    const deployed = initialGeneratorFleet.filter((g) => g.status === "deployed");
    const lowFuel = deployed.filter((g) => g.fuelPercent <= 20);
    const inStock = initialGeneratorFleet.filter((g) => g.status === "in-stock");
    return `${deployed.length} generator${deployed.length === 1 ? "" : "s"} dispatched (${deployed.map((g) => g.id).join(", ")}), ${inStock.length} in stock at the depot. ${lowFuel.length} deployed unit${lowFuel.length === 1 ? "" : "s"} at ≤20% fuel: ${lowFuel.length ? lowFuel.map((g) => g.id).join(", ") : "none"}.`;
  }

  if (q.includes("intervention") || q.includes("mast")) {
    const flagged = mastSites.filter((m) => m.intervention);
    return `${flagged.length} of ${mastSites.length} mast sites are flagged for manual intervention: ${flagged.map((m) => `${m.id} (${m.village})`).join(", ")}.`;
  }

  if (q.includes("psr") || q.includes("vulnerab") || q.includes("dual")) {
    const total = vulnerabilityZones.reduce((sum, z) => sum + z.psrCount, 0);
    const lines = vulnerabilityZones.map((z) => `${z.label}: ${displayPsrCount(z.psrCount)}`).join("; ");
    return `Aggregate PSR-flagged counts by zone — ${lines}. Approx. ${total} PSR-flagged residents across the affected area (zone-level aggregates only, per GDPR data minimisation).`;
  }

  return "I don't have a computed answer for that yet — try asking about welfare checks, generators, mast intervention, or PSR/vulnerability counts.";
}

function formatTime(date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function AiAssistant({ welfareTasks }) {
  const [query, setQuery] = useState("");
  const [log, setLog] = useState([]);

  function ask(text) {
    const prompt = text.trim();
    if (!prompt) return;
    const response = answerQuery(prompt, welfareTasks);
    setLog((prev) => [...prev, { id: `log-${prev.length}-${Date.now()}`, time: new Date(), prompt, response }]);
    setQuery("");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">AI Coordination Assistant</h2>
          <p className="text-xs text-slate-500">
            Computed answers from current operational data only — not a verified human feed. Kept separate from
            the Shared Timeline; use it to sanity-check counts, not to log decisions.
          </p>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-100"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(query)}
              placeholder="Ask about welfare checks, generators, masts, or PSR counts…"
              aria-label="Ask the AI coordination assistant a question"
              className="flex-1 text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              onClick={() => ask(query)}
              disabled={!query.trim()}
              className="bg-slate-900 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg px-4"
            >
              Ask
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {log.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">
                Ask a question above, or try one of the suggestions.
              </p>
            )}
            {log
              .slice()
              .reverse()
              .map((entry) => (
                <div key={entry.id} className="space-y-1">
                  <p className="text-sm font-medium text-slate-900 text-left">You asked: {entry.prompt}</p>
                  <p className="text-sm text-slate-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-left leading-relaxed">
                    {entry.response}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Prompt &amp; response audit log</h3>
        <p className="text-xs text-slate-500 mb-3">
          Every question and computed answer is logged here for audit and review, independent of the chat view above.
        </p>
        {log.length === 0 ? (
          <p className="text-xs text-slate-400">No queries logged yet this session.</p>
        ) : (
          <ol className="space-y-2 max-h-[520px] overflow-y-auto">
            {log.map((entry, i) => (
              <li key={entry.id} className="text-xs border-b border-slate-100 pb-2 last:border-0">
                <div className="flex items-center justify-between text-slate-400 font-mono">
                  <span>#{i + 1}</span>
                  <span>{formatTime(entry.time)}</span>
                </div>
                <p className="text-slate-800 font-medium mt-0.5">{entry.prompt}</p>
                <p className="text-slate-600 mt-0.5">{entry.response}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
