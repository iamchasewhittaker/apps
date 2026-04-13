import React, { useState } from "react";
import { T } from "../theme";
import { SCRIPTURES } from "../data/scriptures";
import { WIFE_REMINDERS } from "../data/reminders";

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px", ...style }}>
      {children}
    </div>
  );
}

function InputRow({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14 }} />
    </div>
  );
}

// ── LAYOFF DATE SETTING ────────────────────────────────────────────────────
function LayoffDateSection({ layoffDate, setLayoffDate }) {
  return (
    <Card>
      <SectionHeader title="Layoff Date" subtitle="Used to calculate days since layoff — the number that should motivate urgency." />
      <InputRow label="Date of layoff" value={layoffDate} onChange={setLayoffDate} type="date" />
      {layoffDate && (
        <div style={{ fontSize: 12, color: T.muted }}>
          The counter on your morning mission shows how long your family has been waiting.
        </div>
      )}
    </Card>
  );
}

// ── DAILY TARGETS ──────────────────────────────────────────────────────────
function TargetsSection({ targets, setTargets }) {
  const update = (key, val) => setTargets(prev => ({ ...prev, [key]: Number(val) }));
  return (
    <Card>
      <SectionHeader title="Daily Minimums" subtitle="Non-negotiable floors. Adjust only to make them harder, not easier." />
      <InputRow label={`Job Search Actions (current: ${targets.jobActions})`} value={targets.jobActions} onChange={v => update("jobActions", v)} type="number" placeholder="5" />
      <InputRow label={`Productive Hours (current: ${targets.productiveHours})`} value={targets.productiveHours} onChange={v => update("productiveHours", v)} type="number" placeholder="6" />
      <InputRow label={`Scripture Minutes (current: ${targets.scriptureMinutes})`} value={targets.scriptureMinutes} onChange={v => update("scriptureMinutes", v)} type="number" placeholder="15" />
      <div style={{ fontSize: 11, color: T.red, marginTop: 4 }}>
        Lowering these numbers is making excuses. Raise the bar — don't lower it.
      </div>
    </Card>
  );
}

// ── WIFE'S REMINDERS ───────────────────────────────────────────────────────
function RemindersSection({ reminders, setReminders }) {
  const [newText, setNewText] = useState("");
  const allReminders = [...WIFE_REMINDERS, ...reminders];

  const addReminder = () => {
    if (!newText.trim()) return;
    setReminders(prev => [...prev, { text: newText.trim(), area: "general" }]);
    setNewText("");
  };

  const removeCustom = (i) => setReminders(prev => prev.filter((_, idx) => idx !== i));

  return (
    <Card>
      <SectionHeader title="Her Words" subtitle="Rotated daily on your morning mission. These are from her letter — don't delete them." />
      {WIFE_REMINDERS.map((r, i) => (
        <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13, color: T.muted, fontStyle: "italic" }}>
          "{r.text}"
        </div>
      ))}
      {reminders.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Your Additions</div>
          {reminders.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ flex: 1, fontSize: 13, color: T.text, fontStyle: "italic" }}>"{r.text}"</div>
              <button onClick={() => removeCustom(i)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input value={newText} onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addReminder()}
          placeholder="Add another reminder…"
          style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13 }} />
        <button onClick={addReminder} style={{ padding: "8px 14px", borderRadius: 8, background: T.accent, border: "none", color: "#0a0d14", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Add
        </button>
      </div>
      <div style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>Total reminders in rotation: {allReminders.length}</div>
    </Card>
  );
}

// ── SCRIPTURE BANK ─────────────────────────────────────────────────────────
function ScripturesSection({ scriptures, setScriptures }) {
  const [newRef, setNewRef] = useState("");
  const [newText, setNewText] = useState("");

  const addScripture = () => {
    if (!newRef.trim() || !newText.trim()) return;
    setScriptures(prev => [...prev, { ref: newRef.trim(), text: newText.trim(), theme: "custom", convictionMsg: "Apply this scripture to your daily mission." }]);
    setNewRef(""); setNewText("");
  };

  const removeCustom = (i) => setScriptures(prev => prev.filter((_, idx) => idx !== i));

  return (
    <Card>
      <SectionHeader title="Scripture Bank" subtitle={`${SCRIPTURES.length} built-in scriptures + ${scriptures.length} custom. Rotate daily.`} />
      <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 12 }}>
        {SCRIPTURES.map((s, i) => (
          <div key={i} style={{ padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>{s.ref}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{s.text.slice(0, 80)}…</div>
          </div>
        ))}
      </div>
      {scriptures.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Your Additions</div>
          {scriptures.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: T.accent }}>{s.ref}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{s.text.slice(0, 60)}…</div>
              </div>
              <button onClick={() => removeCustom(i)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <input value={newRef} onChange={e => setNewRef(e.target.value)} placeholder="Reference (e.g. D&C 58:27)"
          style={{ padding: "8px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13 }} />
        <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Scripture text…"
          style={{ padding: "8px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, resize: "vertical", minHeight: 60, fontFamily: "inherit" }} />
        <button onClick={addScripture} style={{ padding: "8px 14px", borderRadius: 8, background: T.accent, border: "none", color: "#0a0d14", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Add Scripture
        </button>
      </div>
    </Card>
  );
}

// ── DATA MANAGEMENT ────────────────────────────────────────────────────────
function DataSection({ dailyLogs, setDailyLogs }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ dailyLogs }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `clarity-command-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <SectionHeader title="Data" subtitle={`${dailyLogs.length} days logged.`} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={exportData} style={{ padding: "8px 14px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, cursor: "pointer" }}>
          Export JSON
        </button>
        {!confirmClear ? (
          <button onClick={() => setConfirmClear(true)} style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", border: `1px solid ${T.red}`, color: T.red, fontSize: 13, cursor: "pointer" }}>
            Clear All Logs
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setDailyLogs([]); setConfirmClear(false); }} style={{ padding: "8px 14px", borderRadius: 8, background: T.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Yes, Clear
            </button>
            <button onClick={() => setConfirmClear(false)} style={{ padding: "8px 14px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── MAIN SETTINGS TAB ──────────────────────────────────────────────────────
export default function SettingsTab({ layoffDate, setLayoffDate, scriptures, setScriptures, reminders, setReminders, targets, setTargets, dailyLogs, setDailyLogs }) {
  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 2 }}>Settings</div>
        <div style={{ fontSize: 12, color: T.muted }}>Configure your accountability system. Be honest with yourself.</div>
      </div>
      <LayoffDateSection layoffDate={layoffDate} setLayoffDate={setLayoffDate} />
      <TargetsSection targets={targets} setTargets={setTargets} />
      <RemindersSection reminders={reminders} setReminders={setReminders} />
      <ScripturesSection scriptures={scriptures} setScriptures={setScriptures} />
      <DataSection dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} />
      <div style={{ fontSize: 11, color: T.muted, textAlign: "center", paddingBottom: 20 }}>
        Clarity Command v1.0 · Built to hold you accountable.
      </div>
    </div>
  );
}
