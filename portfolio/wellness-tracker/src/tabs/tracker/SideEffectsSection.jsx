import React from "react";
import { T } from "../../theme";
import { SectionLabel, ChoiceButton, Divider, MultiChip, TriToggle } from "../../ui";

export default function SideEffectsSection({ data, set }) {
  const groups = [
    {
      med: "Sertraline 200mg", color: T.blue,
      effects: ["Nausea / upset stomach", "Reduced sex drive", "Excessive sweating", "Unusual fatigue", "Restlessness / agitation"],
    },
    {
      med: "Adderall 20mg x2", color: T.warn,
      effects: ["Decreased appetite / forgot to eat", "Racing heart or chest tightness ⚠️", "Increased anxiety / jitteriness ⚠️", "Irritability or mood crash", "Trouble falling asleep"],
    },
    {
      med: "Wellbutrin 150mg", color: T.accent,
      effects: ["Headaches", "Dry mouth", "Feeling wired or jittery", "Insomnia or vivid dreams"],
    },
    {
      med: "Buspar 10mg x2", color: "#7B5EA7",
      effects: ["Dizziness / lightheadedness", "Nausea", "Headaches", "Spacey or detached feeling"],
    },
    {
      med: "Trazodone 50–100mg", color: T.yellow,
      effects: ["Morning grogginess / sleep hangover", "Dry mouth", "Vivid dreams or nightmares", "Next-day mental fog"],
    },
  ];

  return (
    <div>
      {groups.map(g => (
        <div key={g.med} style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 20, fontWeight: 700, color: g.color,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10
          }}>{g.med}</div>
          {g.effects.map(e => (
            <div key={e} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 10, gap: 10,
            }}>
              <span style={{ fontSize: 16, color: T.text, flex: 1 }}>{e}</span>
              <TriToggle value={data[e]} onChange={v => set(e, v)} />
            </div>
          ))}
        </div>
      ))}
      <Divider />
      <SectionLabel num={1} color={T.warn}>⚠️ Interaction Flags</SectionLabel>
      {["Anxiety felt worse on days I took Adderall", "Felt unusually wired or overstimulated today"].map(e => (
        <div key={e} style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 10, gap: 10,
        }}>
          <span style={{ fontSize: 16, color: T.text, flex: 1 }}>{e}</span>
          <TriToggle value={data[e]} onChange={v => set(e, v)} />
        </div>
      ))}
      <Divider />
      <SectionLabel num={2}>Did you take all medications as prescribed today?</SectionLabel>
      {[
        { v: "all", e: "🟢", l: "Yes — all taken on time" },
        { v: "mostly", e: "🟡", l: "Mostly — missed one dose" },
        { v: "no", e: "🔴", l: "No — missed multiple or all" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.adherence === o.v} onClick={() => set("adherence", o.v)} />)}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 20, color: T.muted, marginBottom: 6 }}>Adderall doses today</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["Both doses on schedule", "First dose only", "Second dose only", "Neither"].map(d => (
            <MultiChip key={d} label={d} selected={data.adderallDoses === d} onClick={() => set("adderallDoses", d)} />
          ))}
        </div>
      </div>
    </div>
  );
}
