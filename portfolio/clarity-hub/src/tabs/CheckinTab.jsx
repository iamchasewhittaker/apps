import React, { useEffect, useMemo, useState } from "react";
import { T, today } from "../theme";

const MEDS = ["Adderall", "Vyvanse"];
const ADHD_OPTIONS = ["Yes", "Mild", "No"];

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 70, resize: "vertical" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  btn: { padding: "10px 16px", borderRadius: 10, background: T.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  label: { fontSize: 12, color: T.muted, marginBottom: 5, display: "block" },
};

const DEFAULT_MORNING = {
  sleepOnset: 5,
  sleepQuality: 5,
  morningReadiness: 5,
  notes: "",
};

const DEFAULT_EVENING = {
  medsChecked: [],
  focus: 5,
  mood: 5,
  adhdSymptoms: "",
  dayQuality: 5,
  spendingNotes: "",
  tomorrowFocus: "",
};

const DEFAULT_PULSE = {
  mood: 5,
  note: "",
};

function upsertEntry(entries, date, patch) {
  const idx = entries.findIndex((item) => item.date === date);
  if (idx === -1) return [{ id: date, date, ...patch }, ...entries];
  const next = [...entries];
  next[idx] = { ...next[idx], ...patch };
  return next;
}

function sliderRow(label, value, setValue) {
  return (
    <div>
      <label style={S.label}>{label}: {value}</label>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}

function MorningSection({ blob, setBlob, dateKey, todayEntry }) {
  const [morningForm, setMorningForm] = useState(DEFAULT_MORNING);

  useEffect(() => {
    const existing = todayEntry?.morning;
    setMorningForm(existing ? {
      sleepOnset: existing.sleepOnset ?? 5,
      sleepQuality: existing.sleepQuality ?? 5,
      morningReadiness: existing.morningReadiness ?? 5,
      notes: existing.notes ?? "",
    } : DEFAULT_MORNING);
  }, [todayEntry]);

  const saveMorning = () => {
    const payload = {
      sleepOnset: morningForm.sleepOnset,
      sleepQuality: morningForm.sleepQuality,
      morningReadiness: morningForm.morningReadiness,
      notes: morningForm.notes.trim(),
      savedAt: new Date().toISOString(),
    };
    setBlob((prev) => ({
      ...prev,
      entries: upsertEntry(prev.entries || [], dateKey, { morning: payload }),
      savedMorning: dateKey,
    }));
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Morning Check-in</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sliderRow("Sleep onset", morningForm.sleepOnset, (v) => setMorningForm((p) => ({ ...p, sleepOnset: v })))}
        {sliderRow("Sleep quality", morningForm.sleepQuality, (v) => setMorningForm((p) => ({ ...p, sleepQuality: v })))}
        {sliderRow("Morning readiness", morningForm.morningReadiness, (v) => setMorningForm((p) => ({ ...p, morningReadiness: v })))}
        <div>
          <label style={S.label}>Notes</label>
          <textarea style={S.textarea} value={morningForm.notes} onChange={(e) => setMorningForm((p) => ({ ...p, notes: e.target.value }))} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 12, color: blob.savedMorning === dateKey ? T.green : T.muted }}>
            {blob.savedMorning === dateKey ? "Saved for today" : "Not saved today"}
          </div>
          <button style={S.btn} onClick={saveMorning}>Save Morning</button>
        </div>
      </div>
    </div>
  );
}

function EveningSection({ blob, setBlob, dateKey, todayEntry }) {
  const [eveningForm, setEveningForm] = useState(DEFAULT_EVENING);

  useEffect(() => {
    const existing = todayEntry?.evening;
    setEveningForm(existing ? {
      medsChecked: Array.isArray(existing.medsChecked) ? existing.medsChecked : [],
      focus: existing.focus ?? 5,
      mood: existing.mood ?? 5,
      adhdSymptoms: existing.adhdSymptoms ?? "",
      dayQuality: existing.dayQuality ?? 5,
      spendingNotes: existing.spendingNotes ?? "",
      tomorrowFocus: existing.tomorrowFocus ?? "",
    } : DEFAULT_EVENING);
  }, [todayEntry]);

  const toggleMed = (med) => {
    setEveningForm((prev) => {
      const has = prev.medsChecked.includes(med);
      return { ...prev, medsChecked: has ? prev.medsChecked.filter((m) => m !== med) : [...prev.medsChecked, med] };
    });
  };

  const saveEvening = () => {
    const payload = {
      medsChecked: eveningForm.medsChecked,
      focus: eveningForm.focus,
      mood: eveningForm.mood,
      adhdSymptoms: eveningForm.adhdSymptoms || null,
      sideEffects: null,
      exercise: null,
      eating: null,
      stress: null,
      faith: null,
      caffeine: null,
      dayQuality: eveningForm.dayQuality,
      spendingNotes: eveningForm.spendingNotes.trim(),
      tomorrowFocus: eveningForm.tomorrowFocus.trim(),
      savedAt: new Date().toISOString(),
    };
    setBlob((prev) => ({
      ...prev,
      entries: upsertEntry(prev.entries || [], dateKey, { evening: payload }),
      savedEvening: dateKey,
    }));
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Evening Check-in</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label style={S.label}>Meds taken</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MEDS.map((med) => {
              const active = eveningForm.medsChecked.includes(med);
              return (
                <button
                  key={med}
                  onClick={() => toggleMed(med)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    border: `1px solid ${active ? T.accent : T.border}`,
                    background: active ? T.accentLight : T.surfaceHigh,
                    color: active ? T.accent : T.text,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {med}
                </button>
              );
            })}
          </div>
        </div>
        {sliderRow("Focus", eveningForm.focus, (v) => setEveningForm((p) => ({ ...p, focus: v })))}
        {sliderRow("Mood", eveningForm.mood, (v) => setEveningForm((p) => ({ ...p, mood: v })))}
        {sliderRow("Day quality", eveningForm.dayQuality, (v) => setEveningForm((p) => ({ ...p, dayQuality: v })))}
        <div>
          <label style={S.label}>ADHD symptoms</label>
          <select style={S.select} value={eveningForm.adhdSymptoms} onChange={(e) => setEveningForm((p) => ({ ...p, adhdSymptoms: e.target.value }))}>
            <option value="">Select</option>
            {ADHD_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Tomorrow focus</label>
          <textarea style={S.textarea} value={eveningForm.tomorrowFocus} onChange={(e) => setEveningForm((p) => ({ ...p, tomorrowFocus: e.target.value }))} />
        </div>
        <div>
          <label style={S.label}>Spending notes</label>
          <textarea style={S.textarea} value={eveningForm.spendingNotes} onChange={(e) => setEveningForm((p) => ({ ...p, spendingNotes: e.target.value }))} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 12, color: blob.savedEvening === dateKey ? T.green : T.muted }}>
            {blob.savedEvening === dateKey ? "Saved for today" : "Not saved today"}
          </div>
          <button style={S.btn} onClick={saveEvening}>Save Evening</button>
        </div>
      </div>
    </div>
  );
}

function PulseSection({ blob, setBlob, dateKey }) {
  const [pulseForm, setPulseForm] = useState(DEFAULT_PULSE);
  const recent = useMemo(
    () => [...(blob.pulseChecks || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 3),
    [blob.pulseChecks]
  );

  const addPulse = () => {
    const nextPulse = {
      id: crypto.randomUUID(),
      mood: pulseForm.mood,
      note: pulseForm.note.trim(),
      date: dateKey,
      timestamp: Date.now(),
    };
    setBlob((prev) => ({ ...prev, pulseChecks: [nextPulse, ...(prev.pulseChecks || [])] }));
    setPulseForm(DEFAULT_PULSE);
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Pulse Check</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sliderRow("Mood", pulseForm.mood, (v) => setPulseForm((p) => ({ ...p, mood: v })))}
        <div>
          <label style={S.label}>Quick note (optional)</label>
          <textarea style={S.textarea} value={pulseForm.note} onChange={(e) => setPulseForm((p) => ({ ...p, note: e.target.value }))} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={S.btn} onClick={addPulse}>Save Pulse</button>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 12, paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 8 }}>Last 3 pulses</div>
        {recent.length === 0 ? (
          <div style={{ fontSize: 12, color: T.muted }}>No pulse checks yet.</div>
        ) : (
          recent.map((pulse) => (
            <div key={pulse.id} style={{ padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>Mood {pulse.mood}/10</div>
              <div style={{ fontSize: 11, color: T.muted }}>{pulse.date}</div>
              {pulse.note ? <div style={{ fontSize: 12, color: T.text, marginTop: 4 }}>{pulse.note}</div> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function HistorySection({ blob, dateKey }) {
  const entries = blob.entries || [];
  const dates = useMemo(() => {
    const base = new Date(dateKey + "T00:00:00");
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(base);
      d.setDate(base.getDate() - idx);
      return d.toISOString().slice(0, 10);
    });
  }, [dateKey]);

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>7-Day History</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {dates.map((date) => {
          const entry = entries.find((item) => item.date === date);
          const readiness = entry?.morning?.morningReadiness;
          const mood = entry?.evening?.mood;
          const morningDone = !!entry?.morning;
          const eveningDone = !!entry?.evening;
          return (
            <div key={date} style={{ display: "grid", gridTemplateColumns: "110px 1fr auto", alignItems: "center", gap: 8, borderBottom: `1px solid ${T.border}`, padding: "8px 0" }}>
              <div style={{ fontSize: 12, color: date === dateKey ? T.accent : T.muted }}>{date === dateKey ? "Today" : date}</div>
              <div style={{ fontSize: 12, color: T.text }}>
                MR: {readiness ?? "-"} &middot; Mood: {mood ?? "-"}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <span title="Morning saved" style={{ color: morningDone ? T.green : T.muted, fontSize: 10 }}>●</span>
                <span title="Evening saved" style={{ color: eveningDone ? T.accent : T.muted, fontSize: 10 }}>●</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CheckinTab({ blob, setBlob }) {
  const dateKey = today();
  const todayEntry = useMemo(() => (blob.entries || []).find((item) => item.date === dateKey), [blob.entries, dateKey]);

  return (
    <div style={{ padding: 16 }}>
      <MorningSection blob={blob} setBlob={setBlob} dateKey={dateKey} todayEntry={todayEntry} />
      <EveningSection blob={blob} setBlob={setBlob} dateKey={dateKey} todayEntry={todayEntry} />
      <PulseSection blob={blob} setBlob={setBlob} dateKey={dateKey} />
      <HistorySection blob={blob} dateKey={dateKey} />
    </div>
  );
}
