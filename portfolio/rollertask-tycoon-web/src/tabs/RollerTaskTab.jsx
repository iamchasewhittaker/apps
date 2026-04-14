import React, { useMemo, useState } from "react";
import { T, today } from "../theme";

const CATEGORIES = ["Job Search", "Family", "Health", "Finance", "Other"];
const POINT_VALUES = [10, 25, 50, 100];

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  btn: { padding: "10px 16px", borderRadius: 10, background: T.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  btnSmall: { padding: "7px 14px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontWeight: 600, fontSize: 13, cursor: "pointer" },
  btnDanger: { padding: "7px 14px", borderRadius: 8, background: "transparent", border: `1px solid ${T.red}`, color: T.red, fontWeight: 600, fontSize: 13, cursor: "pointer" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  label: { fontSize: 12, color: T.muted, marginBottom: 5, display: "block" },
};

const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

// ── CASH DISPLAY ────────────────────────────────────────────────────────────

function CashDisplay({ cash }) {
  return (
    <div style={{ ...S.card, textAlign: "center", padding: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Total Points</div>
      <div style={{ fontSize: 48, fontWeight: 800, color: T.gold, letterSpacing: 1, lineHeight: 1 }}>{cash || 0}</div>
      <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>pts earned</div>
    </div>
  );
}

// ── TASKS LIST ──────────────────────────────────────────────────────────────

function TasksList({ blob, setBlob }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [points, setPoints] = useState(POINT_VALUES[0]);

  const sortedTasks = useMemo(() => {
    return [...(blob.tasks || [])].sort((a, b) => Number(a.isComplete) - Number(b.isComplete));
  }, [blob.tasks]);

  const addTask = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const task = {
      id: makeId(),
      title: trimmed,
      category,
      points,
      isComplete: false,
      createdDate: today(),
    };
    setBlob((prev) => ({ ...prev, tasks: [task, ...(prev.tasks || [])] }));
    setTitle("");
  };

  const completeTask = (task) => {
    if (task.isComplete) return;
    const ledgerEntry = {
      id: makeId(),
      label: task.title,
      points: task.points,
      date: today(),
      timestampMs: Date.now(),
    };
    setBlob((prev) => ({
      ...prev,
      cash: (prev.cash || 0) + task.points,
      tasks: (prev.tasks || []).map((t) => (t.id === task.id ? { ...t, isComplete: true } : t)),
      ledger: [ledgerEntry, ...(prev.ledger || [])],
    }));
  };

  const deleteTask = (id) => {
    setBlob((prev) => ({ ...prev, tasks: (prev.tasks || []).filter((t) => t.id !== id) }));
  };

  const pointColor = (pts) => {
    if (pts >= 100) return T.gold;
    if (pts >= 50) return T.accent;
    if (pts >= 25) return T.green;
    return T.muted;
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Tasks</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 90px", gap: 8, marginBottom: 10 }}>
        <input style={S.input} placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select style={S.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select style={S.select} value={points} onChange={(e) => setPoints(parseInt(e.target.value))}>
          {POINT_VALUES.map((v) => <option key={v} value={v}>{v} pts</option>)}
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button style={S.btn} onClick={addTask}>Add Task</button>
      </div>
      {sortedTasks.length === 0 && <div style={{ fontSize: 13, color: T.muted }}>No tasks yet. Add one above!</div>}
      {sortedTasks.map((task) => (
        <div key={task.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center", borderBottom: `1px solid ${T.border}`, padding: "8px 0" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: task.isComplete ? T.muted : T.text, textDecoration: task.isComplete ? "line-through" : "none" }}>{task.title}</div>
            <div style={{ fontSize: 11, color: T.muted }}>{task.category}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: pointColor(task.points), padding: "2px 8px", borderRadius: 6, background: T.surfaceHigh }}>{task.points}pts</span>
          {!task.isComplete && (
            <button style={{ ...S.btnSmall, background: T.greenLight, border: `1px solid ${T.green}`, color: T.green }} onClick={() => completeTask(task)}>Done</button>
          )}
          {task.isComplete && <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>Earned</span>}
          <button style={S.btnDanger} onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ── LEDGER SECTION ──────────────────────────────────────────────────────────

function LedgerSection({ blob }) {
  const entries = useMemo(() => {
    return [...(blob.ledger || [])].sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0)).slice(0, 15);
  }, [blob.ledger]);

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Earnings Ledger</div>
      {entries.length === 0 && <div style={{ fontSize: 13, color: T.muted }}>No earnings yet.</div>}
      {entries.map((entry) => (
        <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ flex: 1, fontSize: 13, color: T.text }}>{entry.label}</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>+{entry.points}pts</span>
          <span style={{ fontSize: 11, color: T.muted }}>{entry.date}</span>
        </div>
      ))}
    </div>
  );
}

// ── RESET BUTTON ────────────────────────────────────────────────────────────

function ResetButton({ setBlob }) {
  const [confirming, setConfirming] = useState(false);

  const reset = () => {
    setBlob((prev) => ({
      ...prev,
      cash: 0,
      tasks: (prev.tasks || []).filter((t) => !t.isComplete),
      ledger: [],
    }));
    setConfirming(false);
  };

  return (
    <div style={{ ...S.card, background: T.surfaceHigh }}>
      {!confirming ? (
        <button style={{ ...S.btnDanger, width: "100%" }} onClick={() => setConfirming(true)}>Reset Progress</button>
      ) : (
        <div>
          <div style={{ fontSize: 13, color: T.warn, fontWeight: 600, marginBottom: 10 }}>This will clear all completed tasks, reset points to 0, and clear the ledger. Active tasks are kept.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...S.btnDanger, flex: 1 }} onClick={reset}>Confirm Reset</button>
            <button style={{ ...S.btnSmall, flex: 1 }} onClick={() => setConfirming(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function RollerTaskTab({ blob, setBlob }) {
  return (
    <div style={{ padding: 16 }}>
      <CashDisplay cash={blob.cash} />
      <TasksList blob={blob} setBlob={setBlob} />
      <LedgerSection blob={blob} />
      <ResetButton setBlob={setBlob} />
    </div>
  );
}
