import React from "react";
import { T } from "../../theme";
import { SectionLabel, ChoiceButton, Divider, MultiChip } from "../../ui";
import { textareaStyle } from "./constants";

export default function EndOfDaySection({ data, set }) {
  return (
    <div>
      {/* ── Accountability: Excuses ── */}
      <div style={{ padding: "12px 14px", background: "#1a1608", border: "1.5px solid #c8a84b33", borderRadius: 8, marginBottom: 16 }}>
        <SectionLabel num={1}>Did I make excuses today?</SectionLabel>
        {[
          { v: "yes",     e: "🔴", l: "Yes — I coasted and know it" },
          { v: "partial", e: "🟡", l: "Partial — some excuses but pushed through some" },
          { v: "no",      e: "🟢", l: "No — I showed up and did the work" },
        ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.excusesEvening === o.v} onClick={() => set("excusesEvening", o.v)} />)}
      </div>

      {/* ── Accountability: Activity ── */}
      <div style={{ padding: "12px 14px", background: "#0d1f18", border: "1.5px solid #3d997033", borderRadius: 8, marginBottom: 16 }}>
        <SectionLabel num={2}>Physical activity completed today? (20+ min)</SectionLabel>
        {[
          { v: "yes", e: "✅", l: "Yes — done" },
          { v: "no",  e: "🚫", l: "No" },
        ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.activityDone === o.v} onClick={() => set("activityDone", o.v)} />)}
      </div>

      <SectionLabel num={3}>Overall, today felt like...</SectionLabel>
      {[
        { v: "hardest", e: "🔴", l: "One of my harder days" },
        { v: "rough", e: "🟠", l: "Rough but got through it" },
        { v: "average", e: "🟡", l: "Average — nothing notable" },
        { v: "good", e: "🟢", l: "A good day" },
        { v: "best", e: "💚", l: "One of my better days lately" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.overall === o.v} onClick={() => set("overall", o.v)} />)}

      <Divider />
      <SectionLabel num={4}>Compared to yesterday, today felt...</SectionLabel>
      {[
        { v: "much_worse", e: "🔴", l: "Much worse" },
        { v: "little_worse", e: "🟠", l: "A little worse" },
        { v: "same", e: "🟡", l: "About the same" },
        { v: "little_better", e: "🟢", l: "A little better" },
        { v: "much_better", e: "💚", l: "Much better" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.vsYesterday === o.v} onClick={() => set("vsYesterday", o.v)} />)}

      <Divider />
      <SectionLabel num={5}>💵 Money — did you spend anything today you felt uncertain about?</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10 }}>Not about planning — just how you felt about it after.</div>
      {[
        { v: "significant", e: "🔴", l: "Yes — and I regret it or it's weighing on me" },
        { v: "small",       e: "🟠", l: "Small purchase — not sure it was the right call" },
        { v: "maybe",       e: "🟡", l: "Spent something I told myself was a need, but not sure" },
        { v: "no",          e: "🟢", l: "No — felt good or neutral about everything today" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.unplanned === o.v} onClick={() => set("unplanned", o.v)} />)}

      {data.unplanned && data.unplanned !== "no" && (
        <>
          <Divider />
          <SectionLabel num={6}>Before spending I felt... (select all)</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {["Anxious or stressed", "Bored", "Excited / impulsive", "Justified — genuinely needed it"].map(f => (
              <MultiChip key={f} label={f}
                selected={(data.beforeSpending || []).includes(f)}
                onClick={() => {
                  const curr = data.beforeSpending || [];
                  set("beforeSpending", curr.includes(f) ? curr.filter(x => x !== f) : [...curr, f]);
                }} />
            ))}
          </div>
        </>
      )}

      <Divider />
      <SectionLabel num={7}>Today in one word...</SectionLabel>
      <input
        value={data.oneWord || ""}
        onChange={e => set("oneWord", e.target.value)}
        placeholder="e.g. foggy, hopeful, overwhelmed, steady..."
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 8,
          border: `1.5px solid ${T.border}`, background: T.surface,
          color: T.text, fontSize: 20, fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      />

      <Divider />
      <SectionLabel num={8}>Biggest thing that affected my day...</SectionLabel>
      <textarea
        value={data.biggestThing || ""}
        onChange={e => set("biggestThing", e.target.value)}
        placeholder="e.g. bad sleep, OCD bad in the morning, felt really clear-headed, stressful call..."
        rows={2} style={textareaStyle}
      />

      <Divider />
      <SectionLabel num={9}>One thing I want my doctor to know about today... (optional)</SectionLabel>
      <textarea
        value={data.doctorNote || ""}
        onChange={e => set("doctorNote", e.target.value)}
        placeholder="Anything you want flagged for your appointment..."
        rows={2} style={textareaStyle}
      />

      <Divider />
      <div style={{ background: T.blueLight, border: `1.5px solid ${T.blue}44`, borderRadius: 10, padding: "14px 16px" }}>
        <SectionLabel num={10} color={T.blue}>🌙 What does tomorrow need to be about?</SectionLabel>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, lineHeight: 1.5 }}>
          One word or one sentence. You're deciding now so morning-you doesn't have to. Could be a task, a feeling, a person, or an area of life.
        </div>
        <input
          value={data.tomorrowFocus || ""}
          onChange={e => set("tomorrowFocus", e.target.value)}
          placeholder="e.g. job search, just show up for the kids, GMAT, rest..."
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8,
            border: `1.5px solid ${T.blue}44`, background: T.surface,
            color: T.text, fontSize: 16, fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}
