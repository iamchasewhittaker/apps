import React from "react";
import { T } from "../../theme";
import { MedBadge, SectionLabel, ChoiceButton, Divider, Rating } from "../../ui";

export default function MoodWellbeingSection({ data, set }) {
  return (
    <div>
      <MedBadge meds={["Sertraline", "Buspar", "Wellbutrin"]} />
      <div style={{ fontSize: 11, color: T.muted, background: T.faint, padding: "8px 12px", borderRadius: 8, marginBottom: 14, lineHeight: 1.5 }}>
        Mood, anxiety, and emotional wellbeing combined. Med callouts show which drug each question tracks.
      </div>

      <SectionLabel num={1}>Overall mood today felt... (1–10) <span style={{fontSize:10, color: T.blue, fontWeight:700}}>← Sertraline + Wellbutrin</span></SectionLabel>
      <Rating value={data.mood} onChange={v => set("mood", v)} />

      <Divider />
      <SectionLabel num={2}>I was able to enjoy or care about things today (anhedonia check) <span style={{fontSize:10, color: T.accent, fontWeight:700}}>← Wellbutrin</span></SectionLabel>
      {[
        { v: "not_at_all", e: "🔴", l: "Not at all — felt flat or numb most of the day" },
        { v: "barely",     e: "🟠", l: "Barely — brief moments but mostly flat" },
        { v: "somewhat",   e: "🟡", l: "Somewhat — felt things but muted" },
        { v: "mostly",     e: "🟢", l: "Mostly — engaged and present" },
        { v: "fully",      e: "💚", l: "Fully — felt like myself" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.anhedonia === o.v} onClick={() => set("anhedonia", o.v)} />)}

      <Divider />
      <SectionLabel num={3}>Background anxiety today (separate from OCD) <span style={{fontSize:10, color: "#7B5EA7", fontWeight:700}}>← Buspar + Sertraline</span></SectionLabel>
      {[
        { v: "severe",    e: "🔴", l: "Severe — hard to function, overwhelming" },
        { v: "high",      e: "🟠", l: "High — present and distracting most of the day" },
        { v: "moderate",  e: "🟡", l: "Moderate — noticeable but manageable" },
        { v: "low",       e: "🟢", l: "Low — barely there" },
        { v: "none",      e: "💚", l: "None — felt calm" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.anxiety === o.v} onClick={() => set("anxiety", o.v)} />)}

      <Divider />
      <SectionLabel num={4}>Irritability today... <span style={{fontSize:10, color: T.warn, fontWeight:700}}>← Adderall / Sertraline</span></SectionLabel>
      {[
        { v: "very",    e: "🔴", l: "Very irritable — snapping, short fuse, hard to be around" },
        { v: "some",    e: "🟠", l: "Some — noticeable but I kept it together" },
        { v: "little",  e: "🟡", l: "A little — a few moments" },
        { v: "none",    e: "🟢", l: "None — felt even and calm" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.irritability === o.v} onClick={() => set("irritability", o.v)} />)}

      <Divider />
      <SectionLabel num={5}>Emotional regulation — when something frustrating happened, I... <span style={{fontSize:10, color: T.blue, fontWeight:700}}>← Sertraline</span></SectionLabel>
      {[
        { v: "lost_it",     e: "🔴", l: "Completely lost it — way out of proportion" },
        { v: "overreacted", e: "🟠", l: "Overreacted but caught myself" },
        { v: "managed",     e: "🟡", l: "Felt it but managed it okay" },
        { v: "even",        e: "🟢", l: "Handled it pretty evenly" },
        { v: "na",          e: "⚪", l: "Nothing upsetting happened today" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.regulation === o.v} onClick={() => set("regulation", o.v)} />)}

      <Divider />
      <SectionLabel num={6}>The way I talked to myself today was mostly... <span style={{fontSize:10, color: T.blue, fontWeight:700}}>← Sertraline + Wellbutrin</span></SectionLabel>
      {[
        { v: "very_critical", e: "🔴", l: "Very critical / harsh — beat myself up a lot" },
        { v: "negative",      e: "🟠", l: "Negative but aware of it" },
        { v: "neutral",       e: "🟡", l: "Neutral" },
        { v: "kind",          e: "🟢", l: "Kind and reasonable" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.selfTalk === o.v} onClick={() => set("selfTalk", o.v)} />)}

      <Divider />
      <SectionLabel num={7}>Hopeless or negative thoughts today... <span style={{fontSize:10, color: T.blue, fontWeight:700}}>← Sertraline</span></SectionLabel>
      {[
        { v: "hard",       e: "🔴", l: "Yes — hard to shake, felt very real" },
        { v: "recognized", e: "🟠", l: "Yes — but I could recognize them as symptoms" },
        { v: "brief",      e: "🟡", l: "Brief moments — passed quickly" },
        { v: "no",         e: "🟢", l: "No — thinking was mostly balanced" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.negThoughts === o.v} onClick={() => set("negThoughts", o.v)} />)}

      <Divider />
      <SectionLabel num={8}>Emotional numbness today... <span style={{fontSize:10, color: T.blue, fontWeight:700}}>← Sertraline (high dose)</span></SectionLabel>
      {[
        { v: "yes",      e: "🔴", l: "Yes — felt disconnected from my own emotions" },
        { v: "somewhat", e: "🟠", l: "Somewhat — muted but still felt things" },
        { v: "no",       e: "🟢", l: "No — emotions felt appropriate and present" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.numbness === o.v} onClick={() => set("numbness", o.v)} />)}
      <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>Emotional blunting is a known Sertraline side effect at high doses — worth tracking for your prescriber.</div>

      <Divider />
      <SectionLabel num={9}>Did you feel like a burden to others today?</SectionLabel>
      {[
        { v: "yes",       e: "🔴", l: "Yes — strongly" },
        { v: "somewhat",  e: "🟠", l: "Somewhat" },
        { v: "not_really",e: "🟡", l: "Not really" },
        { v: "no",        e: "🟢", l: "No" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.burden === o.v} onClick={() => set("burden", o.v)} />)}

      <Divider />
      <SectionLabel num={10}>Connection with family today felt...</SectionLabel>
      {[
        { v: "disconnected", e: "🔴", l: "Disconnected / withdrawn" },
        { v: "surface",      e: "🟠", l: "Surface level — present but not really there" },
        { v: "normal",       e: "🟡", l: "Normal" },
        { v: "warm",         e: "🟢", l: "Warm and engaged" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.family === o.v} onClick={() => set("family", o.v)} />)}
    </div>
  );
}
