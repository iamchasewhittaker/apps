import React, { useState } from "react";
import { T } from "../../theme";
import { SectionLabel, ChoiceButton, Divider, MultiChip } from "../../ui";
import { textareaStyle } from "./constants";

export default function MedCheckinSection({ data, set, meds = [], setMeds }) {
  const NUM_SCALE = [1,2,3,4,5,6,7,8,9,10];

  const NumGrid = ({ field, color }) => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
      {NUM_SCALE.map(n => (
        <button key={n} onClick={() => set(field, n)} style={{
          width: 44, height: 44, borderRadius: 8, fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          border: `2px solid ${data[field] === n ? color : T.border}`,
          background: data[field] === n ? color + "22" : T.surface,
          color: data[field] === n ? color : T.muted,
        }}>{n}</button>
      ))}
    </div>
  );

  const ChipRow = ({ field, options }) => (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {options.map(chip => (
        <MultiChip key={chip} label={chip}
          selected={(data[field] || []).includes(chip)}
          onClick={() => {
            const curr = data[field] || [];
            set(field, curr.includes(chip) ? curr.filter(x => x !== chip) : [...curr, chip]);
          }} />
      ))}
    </div>
  );

  const sideEffectOptions = [
    "Headache","Nausea","Appetite down","Appetite up",
    "Trouble sleeping","Irritable","Too wired","Too flat / numb",
    "Racing heart","Increased anxiety","Mood crash","Morning grogginess",
  ];

  const [editOpen, setEditOpen] = useState(false);
  const [newMed, setNewMed] = useState("");

  const addMed = () => {
    const trimmed = newMed.trim();
    if (!trimmed || meds.includes(trimmed)) return;
    setMeds([...meds, trimmed]);
    setNewMed("");
  };

  return (
    <div>
      <div style={{ padding: "10px 14px", background: T.blueLight, borderRadius: 8, marginBottom: 16, fontSize: 12, color: T.blue, lineHeight: 1.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span>From your therapist. Daily medication tracking — try it all, cut what does not stick.</span>
        <button onClick={() => setEditOpen(o => !o)} style={{
          flexShrink: 0, background: "none", border: `1px solid ${editOpen ? T.blue : T.blueLight}`,
          borderRadius: 6, color: T.blue, cursor: "pointer", fontSize: 14, padding: "2px 6px",
          fontFamily: "inherit", lineHeight: 1,
        }} title="Edit meds list">⚙️</button>
      </div>

      {editOpen && (
        <div style={{ padding: "12px 14px", background: T.faint, border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Your medications</div>
          <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 10 }}>
            {meds.map(m => (
              <button key={m} onClick={() => setMeds(meds.filter(x => x !== m))} style={{
                padding: "5px 10px", borderRadius: 20, margin: "3px 4px 3px 0",
                border: `1.5px solid ${T.border}`, background: T.surface,
                color: T.text, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                {m} <span style={{ color: T.muted, fontSize: 12 }}>✕</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={newMed}
              onChange={e => setNewMed(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addMed()}
              placeholder="Add medication..."
              style={{ flex: 1, padding: "7px 10px", borderRadius: 7, border: `1.5px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 14, fontFamily: "inherit" }}
            />
            <button onClick={addMed} style={{
              padding: "7px 14px", borderRadius: 7, border: "none",
              background: T.blue, color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>Add</button>
          </div>
        </div>
      )}

      <SectionLabel num={1}>Focus today (1-10)</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = could not focus, 10 = locked in all day</div>
      <NumGrid field="focusScore" color={T.warn} />
      <div style={{ fontSize: 11, color: T.muted, marginTop: 10, marginBottom: 6 }}>Today I was able to... (select all)</div>
      <ChipRow field="taskAbility" options={["Start tasks","Stay on track","Finish tasks","Felt scattered"]} />

      <Divider />

      <SectionLabel num={2}>Mood today (1-10)</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = very low / depressed, 10 = great</div>
      <NumGrid field="medMoodScore" color={T.blue} />
      <div style={{ fontSize: 11, color: T.muted, marginTop: 10, marginBottom: 6 }}>Mood felt like... (select all)</div>
      <ChipRow field="moodState" options={["Calm","Overwhelmed","Low / down","Emotionally steady"]} />

      <Divider />

      <SectionLabel num={3}>Anxiety today (1-10)</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = none, 10 = overwhelming</div>
      <NumGrid field="anxietyScore" color={"#7B5EA7"} />

      <Divider />

      <SectionLabel num={4}>Energy today</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["Low","Medium","High"].map(v => (
          <button key={v} onClick={() => set("energyLevel", v)} style={{
            flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            border: "2px solid " + (data.energyLevel === v ? T.accent : T.border),
            background: data.energyLevel === v ? T.accentLight : T.surface,
            color: data.energyLevel === v ? T.accent : T.muted,
          }}>{v}</button>
        ))}
      </div>
      <ChipRow field="energyState" options={["Motivated","Restless / jittery","Calm / steady","Fatigued"]} />

      <Divider />

      <SectionLabel num={5}>Side effects today (select all that apply)</SectionLabel>
      <div style={{ marginBottom: 8 }}>
        <MultiChip label="None" selected={(data.sideEffectList || []).includes("None")}
          onClick={() => set("sideEffectList", ["None"])} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {sideEffectOptions.map(e => (
          <MultiChip key={e} label={e}
            selected={(data.sideEffectList || []).filter(x => x !== "None").includes(e)}
            onClick={() => {
              const curr = (data.sideEffectList || []).filter(x => x !== "None");
              set("sideEffectList", curr.includes(e) ? curr.filter(x => x !== e) : [...curr, e]);
            }} />
        ))}
      </div>
      {(data.sideEffectList || []).some(x => x !== "None") && (
        <>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 8, marginBottom: 6 }}>Other side effects...</div>
          <input value={data.sideEffectOther || ""} onChange={e => set("sideEffectOther", e.target.value)}
            placeholder="e.g. headache at 3pm, dry mouth..."
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid " + T.border, background: T.surface, color: T.text, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }} />
        </>
      )}

      <Divider />

      <SectionLabel num={6}>Adderall timing today</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10 }}>When did it wear off? (optional)</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: T.text }}>Wore off around:</span>
        <input type="time" value={data.adderallWoreOff || ""}
          onChange={e => set("adderallWoreOff", e.target.value)}
          style={{ padding: "6px 10px", borderRadius: 7, border: "1.5px solid " + T.border, background: T.surface, color: T.text, fontSize: 14, fontFamily: "inherit" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {["Smooth","Crash","Not sure"].map(v => (
          <MultiChip key={v} label={v} selected={data.adderallTiming === v} onClick={() => set("adderallTiming", v)} />
        ))}
      </div>

      <Divider />

      <SectionLabel num={7}>Overall, today dose felt...</SectionLabel>
      {[
        { v: "helpful",    e: "green_circle",  l: "Helpful - worked the way it should" },
        { v: "not_enough", e: "yellow_circle", l: "Not enough - could have used more support" },
        { v: "too_much",   e: "red_circle",    l: "Too much - felt overstimulated or wired" },
        { v: "skipped",    e: "white_circle",  l: "Only took one dose / skipped today" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.doseFelt === o.v} onClick={() => set("doseFelt", o.v)} />)}

      <Divider />

      <SectionLabel num={8}>Notes for your doctor (optional)</SectionLabel>
      <textarea value={data.medNotes || ""} onChange={e => set("medNotes", e.target.value)}
        placeholder="Anything worth flagging - timing, patterns, questions to ask..."
        rows={3} style={textareaStyle} />
    </div>
  );
}
