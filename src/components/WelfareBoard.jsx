import { useState } from "react";
import { initialWelfareTasks } from "../data/mockData";

const COLUMNS = [
  { id: "reported", label: "Reported" },
  { id: "in-progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
];

const STAFF = [
  "Unassigned",
  "J. Okafor — Energy DNO Field Team 3",
  "R. Whitfield — Energy DNO Control",
  "M. Iqbal — Telecom MNO Field Ops",
  "S. Odame — Telecom MNO NOC",
];

const priorityStyle = {
  high: "bg-rose-100 text-rose-700 ring-rose-200",
  medium: "bg-amber-100 text-amber-700 ring-amber-200",
  low: "bg-slate-100 text-slate-600 ring-slate-200",
};

function orgOf(assignedTo) {
  if (assignedTo.includes("Energy DNO")) return "energy";
  if (assignedTo.includes("Telecom MNO")) return "telecom";
  return "none";
}

const orgDot = {
  energy: "bg-amber-500",
  telecom: "bg-teal-600",
  none: "bg-slate-300",
};

function TaskCard({ task, onMove, onAssign }) {
  const idx = COLUMNS.findIndex((c) => c.id === task.status);
  const org = orgOf(task.assignedTo);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 space-y-2 text-left">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 leading-snug">{task.title}</p>
        <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wide ring-1 rounded px-1.5 py-0.5 ${priorityStyle[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-xs text-slate-500">{task.location}</p>
      <p className="text-xs text-slate-600 leading-relaxed">{task.detail}</p>

      <div className="flex items-center gap-1.5 pt-1">
        <span className={`h-1.5 w-1.5 rounded-full ${orgDot[org]}`} />
        <select
          value={task.assignedTo}
          onChange={(e) => onAssign(task.id, e.target.value)}
          className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-slate-300"
        >
          {STAFF.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onMove(task.id, COLUMNS[idx - 1]?.id)}
          disabled={idx === 0}
          className="text-xs font-medium text-slate-500 disabled:text-slate-200 hover:text-slate-800 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          onClick={() => onMove(task.id, COLUMNS[idx + 1]?.id)}
          disabled={idx === COLUMNS.length - 1}
          className="text-xs font-medium text-white bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 rounded-md px-2.5 py-1 disabled:cursor-not-allowed"
        >
          {idx === COLUMNS.length - 2 ? "Mark resolved" : "Move forward →"}
        </button>
      </div>
    </div>
  );
}

export default function WelfareBoard() {
  const [tasks, setTasks] = useState(initialWelfareTasks);

  function moveTask(id, newStatus) {
    if (!newStatus) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  }

  function assignTask(id, assignedTo) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, assignedTo } : t)));
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
        <h2 className="text-base font-semibold text-slate-900">Welfare Task Board</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Informal welfare checks for vulnerable residents in the outage area — assignable to either company's field staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="bg-slate-100/70 rounded-xl p-3 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-slate-700">{col.label}</h3>
                <span className="text-xs font-medium text-slate-500 bg-white rounded-full h-5 w-5 flex items-center justify-center border border-slate-200">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[80px]">
                {colTasks.map((t) => (
                  <TaskCard key={t.id} task={t} onMove={moveTask} onAssign={assignTask} />
                ))}
                {colTasks.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
