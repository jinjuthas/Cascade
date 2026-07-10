import { useEffect, useRef, useState } from "react";
import { mastSites, initialGeneratorFleet, vulnerabilityZones, displayPsrCount } from "../data/mockData";

const SUGGESTIONS = [
  "Welfare checks outstanding?",
  "Generators dispatched?",
  "Masts needing intervention?",
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

export default function AiAssistantWidget({ welfareTasks }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function ask(text) {
    const prompt = text.trim();
    if (!prompt) return;
    const response = answerQuery(prompt, welfareTasks);
    const time = new Date();
    setMessages((prev) => [
      ...prev,
      { id: `u-${prev.length}-${Date.now()}`, role: "user", text: prompt, time },
      { id: `a-${prev.length}-${Date.now()}`, role: "assistant", text: response, time },
    ]);
    setQuery("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[340px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <p className="text-sm font-semibold leading-tight">AI Coordination Assistant</p>
              <p className="text-[11px] text-slate-300 leading-tight">Computed from live data — not a verified feed</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI assistant"
              className="text-slate-300 hover:text-white text-lg leading-none px-1"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[160px]">
            {messages.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                Ask a question, or try a suggestion below. Every exchange is kept here for audit and review.
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed text-left ${
                    m.role === "user"
                      ? "bg-slate-900 text-white rounded-br-sm"
                      : "bg-sky-50 border border-sky-200 text-slate-700 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                  <div className={`text-[10px] mt-1 ${m.role === "user" ? "text-slate-400" : "text-slate-400"}`}>
                    {formatTime(m.time)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-slate-100 shrink-0 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 hover:bg-slate-100"
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
                placeholder="Ask a question…"
                aria-label="Ask the AI coordination assistant a question"
                className="flex-1 text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <button
                onClick={() => ask(query)}
                disabled={!query.trim()}
                className="bg-slate-900 disabled:bg-slate-300 text-white text-xs font-medium rounded-lg px-3"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className="h-14 w-14 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-slate-800 transition-colors"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
