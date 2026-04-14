import React, { useMemo, useState } from "react";
import { T, today } from "../theme";

const CATEGORIES = ["Job Search", "Family", "Health", "Finance", "Other"];
const SIZES = ["Small", "Medium", "Large"];
const IDEA_STAGES = ["Raw", "Exploring", "Committed", "Shipped"];

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 64, resize: "vertical" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  btn: { padding: "10px 14px", borderRadius: 10, background: T.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  btnSmall: { padding: "7px 10px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontWeight: 600, fontSize: 12, cursor: "pointer" },
  btnDanger: { padding: "7px 10px", borderRadius: 8, background: "transparent", border: `1px solid ${T.red}`, color: T.red, fontWeight: 600, fontSize: 12, cursor: "pointer" },
  label: { fontSize: 12, color: T.muted, marginBottom: 5, display: "block" },
};

const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

function CollapsibleCard({ title, open, onToggle, children }) {
  return (
    <div style={S.card}>
      <button
        onClick={onToggle}
        style={{ width: "100%", background: "none", border: "none", color: T.text, padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
      >
        <span style={S.cardTitle}>{title}</span>
        <span style={{ color: T.muted, fontSize: 12 }}>{open ? "Hide" : "Show"}</span>
      </button>
      {open ? <div style={{ marginTop: 12 }}>{children}</div> : null}
    </div>
  );
}

function CapacitySection({ blob, setBlob }) {
  const todayStr = today();
  const isToday = blob.capacityDate === todayStr;
  const [value, setValue] = useState(isToday ? blob.capacity || 5 : 5);

  const statusColor = value >= 7 ? T.green : value >= 4 ? T.yellow : T.red;

  const saveCapacity = () => {
    setBlob((prev) => ({ ...prev, capacity: value, capacityDate: todayStr }));
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>
        {isToday ? `Saved for today: ${blob.capacity}/10` : "Capacity not set today"}
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={S.label}>Capacity: {value}/10</label>
        <input type="range" min={0} max={10} value={value} onChange={(e) => setValue(Number(e.target.value))} style={{ width: "100%" }} />
      </div>
      <div style={{ height: 12, borderRadius: 999, overflow: "hidden", background: T.surfaceHigh, border: `1px solid ${T.border}`, marginBottom: 10 }}>
        <div style={{ width: `${value * 10}%`, background: statusColor, height: "100%", transition: "width 0.2s" }} />
      </div>
      <button style={S.btn} onClick={saveCapacity}>Save Capacity</button>
    </div>
  );
}

function TasksSection({ blob, setBlob }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [filter, setFilter] = useState("All");

  const filteredTasks = useMemo(() => {
    const source = blob.tasks || [];
    const byCategory = filter === "All" ? source : source.filter((task) => task.category === filter);
    return [...byCategory].sort((a, b) => Number(a.isComplete) - Number(b.isComplete));
  }, [blob.tasks, filter]);

  const addTask = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const task = {
      id: makeId(),
      title: trimmed,
      category,
      size,
      isComplete: false,
      createdDate: today(),
    };
    setBlob((prev) => ({ ...prev, tasks: [task, ...(prev.tasks || [])] }));
    setTitle("");
  };

  const toggleTask = (id) => {
    setBlob((prev) => ({
      ...prev,
      tasks: (prev.tasks || []).map((task) => (task.id === id ? { ...task, isComplete: !task.isComplete } : task)),
    }));
  };

  const deleteTask = (id) => {
    setBlob((prev) => ({ ...prev, tasks: (prev.tasks || []).filter((task) => task.id !== id) }));
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px", gap: 8, marginBottom: 10 }}>
        <input style={S.input} placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select style={S.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select style={S.select} value={size} onChange={(e) => setSize(e.target.value)}>
          {SIZES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button style={S.btn} onClick={addTask}>Add Task</button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {["All", ...CATEGORIES].map((item) => {
          const active = item === filter;
          return (
            <button
              key={item}
              onClick={() => setFilter(item)}
              style={{
                ...S.btnSmall,
                border: `1px solid ${active ? T.accent : T.border}`,
                color: active ? T.accent : T.text,
                background: active ? T.accentLight : T.surfaceHigh,
              }}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div>
        {filteredTasks.length === 0 ? (
          <div style={{ fontSize: 12, color: T.muted }}>No tasks in this filter.</div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} style={{ display: "grid", gridTemplateColumns: "22px 1fr auto auto", gap: 8, alignItems: "center", borderBottom: `1px solid ${T.border}`, padding: "8px 0" }}>
              <input type="checkbox" checked={!!task.isComplete} onChange={() => toggleTask(task.id)} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: T.text, textDecoration: task.isComplete ? "line-through" : "none" }}>{task.title}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{task.category} • {task.size}</div>
              </div>
              <span style={{ fontSize: 11, color: T.muted }}>{task.createdDate}</span>
              <button style={S.btnDanger} onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function IdeasSection({ blob, setBlob }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const grouped = useMemo(() => {
    const buckets = IDEA_STAGES.map(() => []);
    (blob.ideas || []).forEach((idea) => {
      const idx = Number.isInteger(idea.stage) ? Math.max(0, Math.min(3, idea.stage)) : 0;
      buckets[idx].push(idea);
    });
    return buckets;
  }, [blob.ideas]);

  const addIdea = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const idea = {
      id: makeId(),
      title: trimmed,
      stage: 0,
      note: note.trim(),
      createdDate: today(),
    };
    setBlob((prev) => ({ ...prev, ideas: [idea, ...(prev.ideas || [])] }));
    setTitle("");
    setNote("");
  };

  const bumpStage = (id) => {
    setBlob((prev) => ({
      ...prev,
      ideas: (prev.ideas || []).map((idea) => (idea.id === id ? { ...idea, stage: Math.min(3, (idea.stage || 0) + 1) } : idea)),
    }));
  };

  const deleteIdea = (id) => {
    setBlob((prev) => ({ ...prev, ideas: (prev.ideas || []).filter((idea) => idea.id !== id) }));
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
        <input style={S.input} placeholder="Idea title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea style={S.textarea} placeholder="Idea note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button style={S.btn} onClick={addIdea}>Add Idea</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        {IDEA_STAGES.map((stageLabel, stageIdx) => (
          <div key={stageLabel} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 10, background: T.surfaceHigh }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 6 }}>{stageLabel}</div>
            {grouped[stageIdx].length === 0 ? (
              <div style={{ fontSize: 12, color: T.muted }}>No ideas here.</div>
            ) : (
              grouped[stageIdx].map((idea) => (
                <div key={idea.id} style={{ borderTop: `1px solid ${T.border}`, paddingTop: 8, marginTop: 8 }}>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{idea.title}</div>
                  {idea.note ? <div style={{ fontSize: 12, color: T.muted, margin: "4px 0 6px" }}>{idea.note}</div> : null}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={S.btnSmall} onClick={() => bumpStage(idea.id)} disabled={idea.stage >= 3}>
                      {idea.stage >= 3 ? "Final Stage" : "Advance"}
                    </button>
                    <button style={S.btnDanger} onClick={() => deleteIdea(idea.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WinsSection({ blob, setBlob }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState("");

  const wins = useMemo(
    () => [...(blob.wins || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 10),
    [blob.wins]
  );

  const addWin = () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    const win = {
      id: makeId(),
      category,
      note: trimmed,
      date: today(),
      timestamp: Date.now(),
    };
    setBlob((prev) => ({ ...prev, wins: [win, ...(prev.wins || [])] }));
    setNote("");
  };

  const deleteWin = (id) => {
    setBlob((prev) => ({ ...prev, wins: (prev.wins || []).filter((win) => win.id !== id) }));
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, marginBottom: 10 }}>
        <select style={S.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input style={S.input} placeholder="Win note" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button style={S.btn} onClick={addWin}>Log Win</button>
      </div>
      {wins.length === 0 ? (
        <div style={{ fontSize: 12, color: T.muted }}>No wins logged yet.</div>
      ) : (
        wins.map((win) => (
          <div key={win.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr auto auto", gap: 8, alignItems: "center", borderBottom: `1px solid ${T.border}`, padding: "8px 0" }}>
            <div style={{ fontSize: 11, color: T.muted }}>{win.date}</div>
            <div style={{ fontSize: 13, color: T.text }}>{win.note}</div>
            <div style={{ fontSize: 11, color: T.muted }}>{win.category}</div>
            <button style={S.btnDanger} onClick={() => deleteWin(win.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default function TriageTab({ blob, setBlob }) {
  const [open, setOpen] = useState({
    capacity: true,
    tasks: true,
    ideas: true,
    wins: true,
  });

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ padding: 16 }}>
      <CollapsibleCard title="Capacity" open={open.capacity} onToggle={() => toggle("capacity")}>
        <CapacitySection blob={blob} setBlob={setBlob} />
      </CollapsibleCard>

      <CollapsibleCard title="Tasks" open={open.tasks} onToggle={() => toggle("tasks")}>
        <TasksSection blob={blob} setBlob={setBlob} />
      </CollapsibleCard>

      <CollapsibleCard title="Ideas Pipeline" open={open.ideas} onToggle={() => toggle("ideas")}>
        <IdeasSection blob={blob} setBlob={setBlob} />
      </CollapsibleCard>

      <CollapsibleCard title="Wins Log" open={open.wins} onToggle={() => toggle("wins")}>
        <WinsSection blob={blob} setBlob={setBlob} />
      </CollapsibleCard>
    </div>
  );
}
