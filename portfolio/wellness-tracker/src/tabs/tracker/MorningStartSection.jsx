import React from "react";
import { T } from "../../theme";
import { SectionLabel, ChoiceButton, Divider, MultiChip } from "../../ui";
import { textareaStyle } from "./constants";

export default function MorningStartSection({ data, set, meds = [] }) {
  return (
    <div>
      <div style={{ padding: "10px 14px", background: T.accentLight, borderRadius: 8, marginBottom: 16, fontSize: 12, color: T.accent, lineHeight: 1.5 }}>
        ☀️ <strong>Best time:</strong> Right after your 7–8am meds. Takes about 2 minutes.
      </div>

      {/* ── Accountability: Excuses ── */}
      <div style={{ padding: "12px 14px", background: "#1a1608", border: "1.5px solid #c8a84b33", borderRadius: 8, marginBottom: 16 }}>
        <SectionLabel num={1}>Am I making excuses today?</SectionLabel>
        {[
          { v: "yes",     e: "🔴", l: "Yes — I'm already planning to coast" },
          { v: "pushing", e: "🟡", l: "I'm pushing through anyway" },
          { v: "no",      e: "🟢", l: "No — I'm locked in today" },
        ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.excusesMorning === o.v} onClick={() => set("excusesMorning", o.v)} />)}
      </div>

      {/* ── Accountability: Activity ── */}
      <div style={{ padding: "12px 14px", background: "#0d1f18", border: "1.5px solid #3d997033", borderRadius: 8, marginBottom: 16 }}>
        <SectionLabel num={2}>Physical activity planned today? (20+ min)</SectionLabel>
        {[
          { v: "yes", e: "✅", l: "Yes — 20+ min planned" },
          { v: "no",  e: "🚫", l: "Not today" },
        ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.activityPlanned === o.v} onClick={() => set("activityPlanned", o.v)} />)}
      </div>

      <SectionLabel num={3}>How am I waking up feeling today...</SectionLabel>
      {[
        { v: "rough", e: "🔴", l: "Rough — dreading the day, low energy" },
        { v: "low", e: "🟠", l: "Low — not great but I'll get through it" },
        { v: "neutral", e: "🟡", l: "Neutral — nothing remarkable" },
        { v: "okay", e: "🟢", l: "Okay — feeling decent" },
        { v: "good", e: "💚", l: "Good — actually ready for today" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.morningFeel === o.v} onClick={() => set("morningFeel", o.v)} />)}

      <Divider />
      <SectionLabel num={4}>Medications taken this morning</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>Select all taken so far</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {meds.map(m => (
          <MultiChip key={m} label={m}
            selected={(data.morningMeds || []).includes(m)}
            onClick={() => {
              const curr = data.morningMeds || [];
              set("morningMeds", curr.includes(m) ? curr.filter(x => x !== m) : [...curr, m]);
            }} color={T.accent} />
        ))}
      </div>

      <Divider />
      <SectionLabel num={5}>Today's capacity — how many focused hours do I realistically have?</SectionLabel>
      {[
        { v: "survival", e: "😔", l: "Survival — 1 hour or less. Just keeping the lights on." },
        { v: "limited", e: "😐", l: "Limited — 1–2 hours. Low but functional." },
        { v: "average", e: "🙂", l: "Average — 2–4 hours. Normal day." },
        { v: "strong", e: "💪", l: "Strong — 4+ hours. Good day to push on something real." },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.capacity === o.v} onClick={() => set("capacity", o.v)} />)}

      <Divider />
      <SectionLabel num={6}>Medication timing <span style={{fontSize:10, color: T.muted, fontWeight:400}}>(optional — tap to log time taken)</span></SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10 }}>Helps connect timing to focus crashes, sleep issues, and Adderall effectiveness.</div>
      {[
        { key: "timeSertraline",  label: "Sertraline 200mg",    color: T.blue },
        { key: "timeAdderall1",   label: "Adderall 20mg (1st)", color: "#D4A017" },
        { key: "timeWellbutrin",  label: "Wellbutrin 150mg",    color: T.accent },
        { key: "timeBuspar1",     label: "Buspar 10mg (AM)",    color: "#7B5EA7" },
        { key: "timeAdderall2",   label: "Adderall 20mg (2nd)", color: "#C4622D" },
        { key: "timeBuspar2",     label: "Buspar 10mg (PM)",    color: "#7B5EA7" },
      ].map(m => (
        <div key={m.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 12, color: T.text }}>{m.label}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {data[m.key] && <span style={{ fontSize: 12, color: m.color, fontWeight: 700 }}>{data[m.key]}</span>}
            <button onClick={() => {
              const now = new Date();
              const t = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
              set(m.key, data[m.key] ? null : t);
            }} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
              border: `1px solid ${data[m.key] ? m.color : T.border}`,
              background: data[m.key] ? m.color + "22" : T.surface,
              color: data[m.key] ? m.color : T.muted, fontWeight: 600,
            }}>{data[m.key] ? "✓ Logged" : "Tap to log"}</button>
          </div>
        </div>
      ))}

      <Divider />
      <SectionLabel num={7}>Anything already on my mind this morning...</SectionLabel>
      <textarea value={data.morningNote || ""} onChange={e => set("morningNote", e.target.value)}
        placeholder="Worries, intentions, something from last night still lingering... (optional)"
        rows={2} style={textareaStyle} />
    </div>
  );
}
