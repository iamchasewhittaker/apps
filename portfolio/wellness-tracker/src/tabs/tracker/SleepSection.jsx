import React from "react";
import { T } from "../../theme";
import { MedBadge, SectionLabel, ChoiceButton, Divider, Rating, MultiChip } from "../../ui";

export default function SleepSection({ data, set }) {
  return (
    <div>
      <MedBadge meds={["Trazodone"]} />
      <SectionLabel num={1}>After last night's Trazodone, I fell asleep... <span style={{fontSize:10, color: T.yellow, fontWeight:700}}>← Trazodone</span></SectionLabel>
      {[
        { v: "never", e: "🔴", l: "Never really fell asleep / took forever" },
        { v: "over_hour", e: "🟠", l: "Eventually — took over an hour" },
        { v: "30_60", e: "🟡", l: "Within 30–60 minutes" },
        { v: "under_30", e: "🟢", l: "Within 30 minutes or less" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.onset === o.v} onClick={() => set("onset", o.v)} />)}

      <Divider />
      <SectionLabel num={2}>During the night I...</SectionLabel>
      {[
        { v: "struggled", e: "🔴", l: "Woke multiple times, struggled to get back to sleep" },
        { v: "few_times", e: "🟠", l: "Woke a few times but fell back asleep" },
        { v: "once", e: "🟡", l: "Woke once — got back to sleep okay" },
        { v: "through", e: "🟢", l: "Slept mostly straight through" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.staying === o.v} onClick={() => set("staying", o.v)} />)}

      <Divider />
      <SectionLabel num={3}>Sleep quality felt... (1–10) <span style={{fontSize:10, color: T.yellow, fontWeight:700}}>← Trazodone</span></SectionLabel>
      <Rating value={data.quality} onChange={v => set("quality", v)} />

      <Divider />
      <SectionLabel num={4}>Waking up this morning felt...</SectionLabel>
      {[
        { v: "drugged", e: "🔴", l: "Couldn't get up — felt drugged or groggy for hours" },
        { v: "rough", e: "🟠", l: "Pretty rough — took a long time to feel alert" },
        { v: "slow", e: "🟡", l: "A little slow — wore off within an hour" },
        { v: "normal", e: "🟢", l: "Normal — felt okay getting up" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.groggy === o.v} onClick={() => set("groggy", o.v)} />)}

      <Divider />
      <SectionLabel num={5}>Trazodone dose last night</SectionLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["50mg", "75mg", "100mg", "Skipped"].map(d => (
          <MultiChip key={d} label={d} selected={data.dose === d} onClick={() => set("dose", d)} />
        ))}
      </div>

      <Divider />
      <SectionLabel num={6}>Hours slept (approximate)</SectionLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["< 4hrs", "4–5hrs", "5–6hrs", "6–7hrs", "7–8hrs", "8+ hrs"].map(h => (
          <MultiChip key={h} label={h} selected={data.hours === h} onClick={() => set("hours", h)} />
        ))}
      </div>

      <Divider />
      <div style={{ background: T.faint, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 10 }}>
          💍 Oura Scores <span style={{ fontWeight: 400, fontSize: 10, textTransform: "none", letterSpacing: 0 }}>(optional — open Oura app to find)</span>
        </div>
        {[
          { key: "ouraReadiness", label: "Readiness", color: T.accent, hint: "Overall score" },
          { key: "ouraSleep",     label: "Sleep",     color: T.blue,   hint: "Sleep score" },
          { key: "ouraHrv",       label: "HRV",       color: "#7B5EA7", hint: "ms, from sleep" },
        ].map(field => (
          <div key={field.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
            <div>
              <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{field.label}</span>
              <span style={{ fontSize: 11, color: T.muted, marginLeft: 8 }}>{field.hint}</span>
            </div>
            <input
              type="number"
              value={data[field.key] || ""}
              onChange={e => set(field.key, e.target.value ? Number(e.target.value) : null)}
              placeholder="—"
              style={{
                width: 64, padding: "5px 8px", borderRadius: 6, textAlign: "center",
                border: `1.5px solid ${data[field.key] ? field.color : T.border}`,
                background: data[field.key] ? field.color + "15" : T.surface,
                color: data[field.key] ? field.color : T.muted,
                fontSize: 14, fontWeight: 700, fontFamily: "inherit",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
