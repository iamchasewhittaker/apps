import React, { useState } from "react";
import { T } from "../theme";
import { Card, SectionLabel, ChoiceButton, MultiChip, Rating, TriToggle, MedBadge, Divider, ProgressBar } from "../ui";

// ══════════════════════════════════════════════════════════════════════════
// TRACKER SECTIONS
// ══════════════════════════════════════════════════════════════════════════

export const MORNING_SECTIONS = ["sleep", "morning_start"];
export const EVENING_SECTIONS = [
  "med_checkin", "health_lifestyle", "end_of_day"
];
export const ALL_SECTIONS = [...MORNING_SECTIONS, ...EVENING_SECTIONS];

export const SECTION_LABELS = {
  sleep: "🌙 Sleep",
  morning_start: "☀️ Morning Start",
  ocd: "🧠 OCD",
  mood_wellbeing: "💭 Mood & Wellbeing",
  adhd: "⚡ ADHD",
  side_effects: "💊 Side Effects",
  med_checkin: "🩺 Daily Tracker",
  health_lifestyle: "🌿 Health & Lifestyle",
  end_of_day: "🌅 End of Day",
};

// Determine check-in mode by time of day
// After 8pm → evening; before noon → morning; noon–8pm → morning (evening not unlocked yet)
export const getCheckinMode = () => {
  const hour = new Date().getHours();
  return hour >= 20 ? "evening" : "morning";
};

// ── QUOTES ────────────────────────────────────────────────────────────────
export const QUOTES = [
  // Faith / scripture
  { text: "I can do all things through Christ who strengthens me.", source: "Philippians 4:13", tag: "faith" },
  { text: "The Lord is my shepherd; I shall not want.", source: "Psalm 23:1", tag: "faith" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", source: "Joshua 1:9", tag: "faith" },
  { text: "Cast all your anxiety on him because he cares for you.", source: "1 Peter 5:7", tag: "faith" },
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.", source: "Jeremiah 29:11", tag: "faith" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", source: "Proverbs 3:5", tag: "faith" },
  { text: "Come to me, all you who are weary and burdened, and I will give you rest.", source: "Matthew 11:28", tag: "faith" },
  { text: "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning.", source: "Lamentations 3:22–23", tag: "faith" },
  // ADHD / mental health resilience
  { text: "You don't have to be perfect to be worthy of rest.", source: "ADHD wisdom", tag: "adhd" },
  { text: "A bad day with ADHD doesn't erase a good one. The data point is never the whole picture.", source: "Chase's tracker", tag: "adhd" },
  { text: "Medication is a tool, not a crutch. Using a tool well is a skill.", source: "ADHD wisdom", tag: "adhd" },
  { text: "The intention gap is not a character flaw. It's a symptom. Keep showing up.", source: "ADHD wisdom", tag: "adhd" },
  { text: "Showing up is the whole thing. Some days showing up is all there is.", source: "Mental health", tag: "adhd" },
  { text: "OCD lies. The thought is not the truth. The urge is not a command.", source: "ERP principle", tag: "adhd" },
  { text: "Every check-in is a data point for your doctor — not a grade for yourself.", source: "Chase's tracker", tag: "adhd" },
  { text: "Rest is not earned. Rest is required.", source: "Mental health", tag: "adhd" },
  // Stoic / grounding
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", source: "Marcus Aurelius", tag: "stoic" },
  { text: "It's not what happens to you, but how you react to it that matters.", source: "Epictetus", tag: "stoic" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", source: "Marcus Aurelius", tag: "stoic" },
  { text: "The obstacle is the way.", source: "Marcus Aurelius", tag: "stoic" },
  { text: "If it is not right, do not do it. If it is not true, do not say it.", source: "Marcus Aurelius", tag: "stoic" },
  { text: "He who fears death will never do anything worthy of a living man.", source: "Seneca", tag: "stoic" },
  { text: "Begin at once to live, and count each separate day as a separate life.", source: "Seneca", tag: "stoic" },
  { text: "Make the best use of what is in your power, and take the rest as it happens.", source: "Epictetus", tag: "stoic" },
  // Motivational / job search hustle
  { text: "Your background in payments isn't a niche — it's a moat. Very few people understand both the enterprise sales motion and the infrastructure.", source: "Chase's tracker", tag: "hustle" },
  { text: "The job search is a numbers game played with a qualitative edge. Show up, follow up, stand out.", source: "Chase's tracker", tag: "hustle" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", source: "Robert Collier", tag: "hustle" },
  { text: "The most certain way to succeed is always to try just one more time.", source: "Thomas Edison", tag: "hustle" },
  { text: "Hard work beats talent when talent doesn't work hard.", source: "Tim Notke", tag: "hustle" },
  { text: "Your family is watching. Not with judgment — with hope. Give them something to point to.", source: "Chase's tracker", tag: "hustle" },
  { text: "Every great salesperson was once in a job search. This is the rep.", source: "Chase's tracker", tag: "hustle" },
  { text: "Don't count the days. Make the days count.", source: "Muhammad Ali", tag: "hustle" },
];

export function getTodayQuote() {
  const dayIdx = Math.floor(Date.now() / 86400000);
  return QUOTES[dayIdx % QUOTES.length];
}

const textareaStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: `1.5px solid ${T.border}`, background: T.surface,
  color: T.text, fontSize: 16, fontFamily: "inherit",
  boxSizing: "border-box", resize: "vertical",
};

function SleepSection({ data, set }) {
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

function MorningStartSection({ data, set, meds = [] }) {
  return (
    <div>
      <div style={{ padding: "10px 14px", background: T.accentLight, borderRadius: 8, marginBottom: 16, fontSize: 12, color: T.accent, lineHeight: 1.5 }}>
        ☀️ <strong>Best time:</strong> Right after your 7–8am meds. Takes about 2 minutes.
      </div>
      <SectionLabel num={1}>How am I waking up feeling today...</SectionLabel>
      {[
        { v: "rough", e: "🔴", l: "Rough — dreading the day, low energy" },
        { v: "low", e: "🟠", l: "Low — not great but I'll get through it" },
        { v: "neutral", e: "🟡", l: "Neutral — nothing remarkable" },
        { v: "okay", e: "🟢", l: "Okay — feeling decent" },
        { v: "good", e: "💚", l: "Good — actually ready for today" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.morningFeel === o.v} onClick={() => set("morningFeel", o.v)} />)}

      <Divider />
      <SectionLabel num={2}>Medications taken this morning</SectionLabel>
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
      <SectionLabel num={3}>Today's capacity — how many focused hours do I realistically have?</SectionLabel>
      {[
        { v: "survival", e: "😔", l: "Survival — 1 hour or less. Just keeping the lights on." },
        { v: "limited", e: "😐", l: "Limited — 1–2 hours. Low but functional." },
        { v: "average", e: "🙂", l: "Average — 2–4 hours. Normal day." },
        { v: "strong", e: "💪", l: "Strong — 4+ hours. Good day to push on something real." },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.capacity === o.v} onClick={() => set("capacity", o.v)} />)}

      <Divider />
      <SectionLabel num={4}>Medication timing <span style={{fontSize:10, color: T.muted, fontWeight:400}}>(optional — tap to log time taken)</span></SectionLabel>
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
      <SectionLabel num={5}>Anything already on my mind this morning...</SectionLabel>
      <textarea value={data.morningNote || ""} onChange={e => set("morningNote", e.target.value)}
        placeholder="Worries, intentions, something from last night still lingering... (optional)"
        rows={2} style={textareaStyle} />
    </div>
  );
}

function OcdSection({ data, set }) {
  const ocdMeds = ["Sertraline", "Buspar"];
  const themes = [
    "Worrying I hurt someone or something bad will happen",
    "Feeling like something is dirty, contaminated, or wrong",
    "Doubting a relationship or whether someone is upset with me",
    "Whether I did something wrong morally or spiritually",
    "Something feeling 'off' or 'not right' until I fixed it",
    "My own health or something being wrong with my body",
    "Needing to check something over and over",
    "Big existential questions I couldn't stop turning over",
    "Thoughts about myself that felt shameful or frightening",
    "Hard to describe — just a general stuck/anxious feeling",
    "Nothing specific — it was a quiet day",
  ];
  return (
    <div>
      <MedBadge meds={ocdMeds} />

      <SectionLabel num={1}>My brain got stuck on something today and wouldn't let go...</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, fontStyle: "italic", lineHeight: 1.5 }}>e.g. a physical symptom you kept checking mentally, replaying something you said, needing to resolve a decision before you could move on</div>
      {[
        { v: "hijacked",  l: "Completely hijacked — OCD ran the show today" },
        { v: "exhausting", l: "Stuck most of the day — it was exhausting" },
        { v: "some",      l: "Got stuck a few times, took effort to get free" },
        { v: "little",    l: "A little, but I moved through it okay" },
        { v: "quiet",     l: "Barely at all — quiet day" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.stuck === o.v} onClick={() => set("stuck", o.v)} />)}

      <Divider />
      <SectionLabel num={2}>I did something to make an anxious thought feel safer...</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, fontStyle: "italic", lineHeight: 1.5 }}>e.g. googled a symptom, re-read a text you sent, asked someone "are we okay?", mentally reviewed a past decision, checked your body for something</div>
      {[
        { v: "constantly", l: "Did it a lot — felt like I couldn't stop" },
        { v: "several",    l: "Did it several times" },
        { v: "once",       l: "Once or twice" },
        { v: "urge_only",  l: "Had the urge but didn't act on it — good day" },
        { v: "no_urge",    l: "Didn't feel the need to" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.compulsions === o.v} onClick={() => set("compulsions", o.v)} />)}

      <Divider />
      <SectionLabel num={3}>I avoided something today because of a sticky thought or anxiety...</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, fontStyle: "italic", lineHeight: 1.5 }}>e.g. didn't make a call because you weren't sure how it would go, put off a decision because it didn't feel "right" yet, stayed away from something that triggered an intrusive thought</div>
      {[
        { v: "a_lot",     l: "Significantly changed my plans because of it" },
        { v: "few",       l: "Avoided a few things" },
        { v: "one",       l: "Avoided one thing" },
        { v: "almost",    l: "Almost avoided something but pushed through" },
        { v: "none",      l: "No avoidance — went about my day normally" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.avoidance === o.v} onClick={() => set("avoidance", o.v)} />)}

      <Divider />
      <SectionLabel num={4}>When a sticky thought or urge came, I was able to let it pass without acting on it...</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, fontStyle: "italic", lineHeight: 1.5 }}>e.g. noticed the thought, didn't google it, didn't ask for reassurance, sat with the discomfort and moved on anyway</div>
      {[
        { v: "couldnt",    l: "Couldn't let anything pass — gave in every time" },
        { v: "struggled",  l: "Let a few pass but struggled with most" },
        { v: "half",       l: "About half and half" },
        { v: "mostly",     l: "Let most pass — felt reasonably in control" },
        { v: "strong",     l: "Felt strong today — thoughts came and went" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.letting === o.v} onClick={() => set("letting", o.v)} />)}

      <Divider />
      <SectionLabel num={5}>Overall, OCD today was...</SectionLabel>
      {[
        { v: "quiet",        e: "🟢", l: "Quiet — barely part of my day" },
        { v: "present",      e: "🟡", l: "Present — there, but I functioned" },
        { v: "overwhelming", e: "🔴", l: "Overwhelming — it shaped my whole day" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.overall === o.v} onClick={() => set("overall", o.v)} />)}

      <Divider />
      <SectionLabel num={6}>The sticky thoughts today were mostly about... <span style={{fontSize:10, color:T.muted, fontWeight:400}}>(select all that apply)</span></SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: 4 }}>
        {themes.map(t => (
          <MultiChip key={t} label={t}
            selected={(data.themes || []).includes(t)}
            onClick={() => {
              const curr = data.themes || [];
              set("themes", curr.includes(t) ? curr.filter(x => x !== t) : [...curr, t]);
            }} />
        ))}
      </div>
    </div>
  );
}

function MoodWellbeingSection({ data, set }) {
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

function AdhdSection({ data, set }) {
  return (
    <div>
      <MedBadge meds={["Adderall", "Wellbutrin"]} />
      <div style={{ fontSize: 11, color: T.muted, background: T.faint, padding: "8px 12px", borderRadius: 8, marginBottom: 14, lineHeight: 1.5 }}>
        Compare to your last few days — not some perfect version of yourself. Mixed is always a valid answer.
      </div>

      <SectionLabel num={1}>Getting things started today felt like... <span style={{fontSize:10, color: T.warn, fontWeight:700}}>← Adderall</span></SectionLabel>
      {[
        { v: "boulder",  l: "Almost impossible — everything felt like pushing a boulder" },
        { v: "hard",     l: "Hard — I knew what to do but couldn't make myself begin" },
        { v: "mixed",    l: "Inconsistent — started some things fine, hit walls on others" },
        { v: "flowed",   l: "Things flowed — I mostly just did what I needed to do" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.starting === o.v} onClick={() => set("starting", o.v)} />)}

      <Divider />
      <SectionLabel num={2}>Once I started something, staying with it felt like...</SectionLabel>
      {[
        { v: "couldnt",  l: "Couldn't stay with anything for more than a few minutes" },
        { v: "pulled",   l: "Got pulled off track repeatedly, hard to recover" },
        { v: "drifted",  l: "Drifted a fair amount but pulled myself back" },
        { v: "followed", l: "Followed through well — finished what I started" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.staying === o.v} onClick={() => set("staying", o.v)} />)}

      <Divider />
      <SectionLabel num={3}>My brain today felt... <span style={{fontSize:10, color: T.accent, fontWeight:700}}>← Wellbutrin + Adderall</span></SectionLabel>
      {[
        { v: "scattered", l: "Scattered — jumping around, couldn't land anywhere" },
        { v: "sluggish",  l: "Slow and sluggish — like thinking through mud" },
        { v: "mixed",     l: "Mixed — sharp in moments, lost in others" },
        { v: "normal",    l: "Normal for me — nothing remarkable" },
        { v: "sharp",     l: "Sharp and connected — thoughts came easily" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.brain === o.v} onClick={() => set("brain", o.v)} />)}

      <Divider />
      <SectionLabel num={4}>The gap between what I planned and what I actually did was...</SectionLabel>
      {[
        { v: "huge",       l: "Huge — completely disconnected day" },
        { v: "large",      l: "Large — intentions and reality barely matched" },
        { v: "noticeable", l: "Noticeable — got some done, missed some" },
        { v: "small",      l: "Small — I did most of what I set out to do" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.intentionGap === o.v} onClick={() => set("intentionGap", o.v)} />)}

      <Divider />
      <SectionLabel num={5}>The Adderall today felt like it... <span style={{fontSize:10, color: T.warn, fontWeight:700}}>← Adderall ⚠️</span></SectionLabel>
      {[
        { v: "nothing",   l: "Didn't seem to do much today" },
        { v: "wore_off",  l: "Worked for a while then wore off" },
        { v: "mixed",     l: "Hard to tell — mixed signals" },
        { v: "worked",    l: "Worked well — I could feel it doing its job" },
        { v: "one_dose",  l: "Only took one dose / skipped today" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.adderall === o.v} onClick={() => set("adderall", o.v)} />)}

      <Divider />
      <SectionLabel num={6}>Background noise while trying to focus today... <span style={{fontSize:10, color: T.warn, fontWeight:700}}>← Adderall</span></SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>TV, podcast, music, YouTube — anything playing in the background</div>
      {[
        { v: "yes_hurt",  l: "Had background noise — and it felt distracting" },
        { v: "yes_fine",  l: "Had background noise — seemed fine or neutral" },
        { v: "yes_helped",l: "Had background noise — actually seemed to help me focus" },
        { v: "none",      l: "No background noise today — worked in quiet" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.bgNoise === o.v} onClick={() => set("bgNoise", o.v)} />)}

      <Divider />
      <SectionLabel num={7}>Compared to the last few days, today's ADHD was...</SectionLabel>
      {[
        { v: "allover",  l: "All over the place — hard to compare" },
        { v: "worse",    l: "Worse than usual" },
        { v: "same",     l: "About the same" },
        { v: "better",   l: "Better than usual" },
      ].map(o => <ChoiceButton key={o.v} label={o.l} selected={data.compared === o.v} onClick={() => set("compared", o.v)} />)}
    </div>
  );
}


// ── MED CHECK-IN SECTION ────────────────────────────────────────────────────
function MedCheckinSection({ data, set, meds = [], setMeds }) {
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

// ── PULSE CHECK MODAL ────────────────────────────────────────────────────────
export function PulseCheckModal({ onClose, onSave }) {
  const NUM_SCALE = [1,2,3,4,5,6,7,8,9,10];
  const [focus, setFocus] = React.useState(null);
  const [mood, setMood] = React.useState(null);
  const [anxiety, setAnxiety] = React.useState(null);
  const [sideEffects, setSideEffects] = React.useState("no");
  const [sideEffectDetail, setSideEffectDetail] = React.useState("");
  const [medsHelpful, setMedsHelpful] = React.useState(null);

  const NumRow = ({ value, onChange, color }) => (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      {NUM_SCALE.map(n => (
        <button key={n} onClick={() => onChange(n)} style={{
          width: 40, height: 40, borderRadius: 7, fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          border: "2px solid " + (value === n ? color : T.border),
          background: value === n ? color + "22" : T.surface,
          color: value === n ? color : T.muted,
        }}>{n}</button>
      ))}
    </div>
  );

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const handleSave = () => {
    onSave({
      time: now.toISOString(),
      timeLabel: timeStr,
      focus,
      mood,
      anxiety,
      sideEffects,
      sideEffectDetail: sideEffects === "yes" ? sideEffectDetail : "",
      medsHelpful,
    });
    onClose();
  };

  const canSave = focus !== null || mood !== null || anxiety !== null || medsHelpful !== null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: T.surface, borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 500, maxHeight: "88vh", overflowY: "auto", padding: "20px 20px 36px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Pulse Check</div>
            <div style={{ fontSize: 11, color: T.muted }}>{timeStr} - about 30 seconds</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: T.muted, cursor: "pointer" }}>x</button>
        </div>

        <div style={{ height: 1, background: T.border, margin: "12px 0" }} />

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>1</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Focus and concentration</div></div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = cannot focus, 10 = locked in</div>
          <NumRow value={focus} onChange={setFocus} color={T.warn} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>2</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Mood (anxiety or depression)</div></div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = very low, 10 = great</div>
          <NumRow value={mood} onChange={setMood} color={T.blue} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Anxiety</div></div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = none, 10 = overwhelming</div>
          <NumRow value={anxiety} onChange={setAnxiety} color={"#7B5EA7"} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>4</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Side effects right now?</div></div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {[{ v: "no", l: "None" }, { v: "yes", l: "Yes" }].map(o => (
              <button key={o.v} onClick={() => setSideEffects(o.v)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                border: "2px solid " + (sideEffects === o.v ? T.accent : T.border),
                background: sideEffects === o.v ? T.accentLight : T.surface,
                color: sideEffects === o.v ? T.accent : T.muted,
              }}>{o.l}</button>
            ))}
          </div>
          {sideEffects === "yes" && (
            <input value={sideEffectDetail} onChange={e => setSideEffectDetail(e.target.value)}
              placeholder="e.g. headache, jittery, appetite gone, too wired..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid " + T.border, background: T.surface, color: T.text, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }} />
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>5</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Did meds feel helpful today?</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ v: "helpful", l: "Helpful" }, { v: "not_enough", l: "Not enough" }, { v: "too_much", l: "Too much" }].map(o => (
              <button key={o.v} onClick={() => setMedsHelpful(o.v)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                border: "2px solid " + (medsHelpful === o.v ? T.warn : T.border),
                background: medsHelpful === o.v ? T.warn + "22" : T.surface,
                color: medsHelpful === o.v ? T.warn : T.muted,
              }}>{o.l}</button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={!canSave} style={{
          width: "100%", padding: "14px 0", borderRadius: 10, fontSize: 15, fontWeight: 700,
          cursor: canSave ? "pointer" : "default", fontFamily: "inherit", border: "none",
          background: canSave ? T.accent : T.border,
          color: canSave ? "#fff" : T.muted,
        }}>Save Pulse Check</button>
        {!canSave && (
          <div style={{ textAlign: "center", fontSize: 11, color: T.muted, marginTop: 8 }}>Answer at least one question to save</div>
        )}
      </div>
    </div>
  );
}

function SideEffectsSection({ data, set }) {
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

function HealthLifestyleSection({ data, set }) {
  const exerciseTypes = ["Walking / hiking", "Weightlifting", "Cardio", "Yoga / stretching", "Sports", "Physical work", "None today"];
  const stressSources = ["Work / job search", "Family / parenting", "Finances", "Health / medical", "Relationships", "Nothing specific", "No real stress today"];

  return (
    <div>
      <SectionLabel num={1}>Physical energy today... <span style={{fontSize:10, color: T.muted, fontWeight:400}}>(if you're always exhausted, log it every day — it's important data for your prescriber)</span></SectionLabel>
      {[
        { v: "exhausted", e: "🔴", l: "Exhausted / running on empty" },
        { v: "low", e: "🟠", l: "Low — got through it but felt drained" },
        { v: "okay", e: "🟡", l: "Okay — average" },
        { v: "good", e: "🟢", l: "Good — felt physically well" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.energy === o.v} onClick={() => set("energy", o.v)} />)}

      <Divider />
      <SectionLabel num={2}>Exercise or movement today...</SectionLabel>
      {[
        { v: "none", e: "🔴", l: "None — sedentary most of the day" },
        { v: "light", e: "🟡", l: "Light — short walk, some stretching" },
        { v: "moderate", e: "🟢", l: "Moderate — 20–40 min workout, active day" },
        { v: "heavy", e: "💚", l: "Heavy — intense training, long workout" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.exercise === o.v} onClick={() => set("exercise", o.v)} />)}
      <div style={{ marginTop: 8, marginBottom: 6, fontSize: 20, color: T.muted }}>Type of movement (select all)</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {exerciseTypes.map(t => (
          <MultiChip key={t} label={t}
            selected={(data.exerciseTypes || []).includes(t)}
            onClick={() => {
              const curr = data.exerciseTypes || [];
              set("exerciseTypes", curr.includes(t) ? curr.filter(x => x !== t) : [...curr, t]);
            }} />
        ))}
      </div>
      {data.exercise && data.exercise !== "none" && (
        <>
          <div style={{ marginTop: 10, marginBottom: 6, fontSize: 20, color: T.muted }}>Exercise affected my mood/energy...</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {["Significantly helped", "Helped a little", "No noticeable effect", "Actually drained me"].map(e => (
              <MultiChip key={e} label={e} selected={data.exerciseEffect === e} onClick={() => set("exerciseEffect", e)} />
            ))}
          </div>
        </>
      )}

      <Divider />
      <SectionLabel num={3}>Eating today...</SectionLabel>
      {[
        { v: "barely", e: "🔴", l: "Barely ate — skipped meals, no appetite ⚠️" },
        { v: "less", e: "🟠", l: "Ate less than usual — light meals only" },
        { v: "okay", e: "🟡", l: "Okay — hit the basics" },
        { v: "good", e: "🟢", l: "Good — ate well and consistently" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.eating === o.v} onClick={() => set("eating", o.v)} />)}

      <Divider />
      <SectionLabel num={4}>Meal timing today...</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {["Skipped breakfast/lunch", "Ate late in the day", "Somewhat regular times", "Consistent meals all day"].map(t => (
          <MultiChip key={t} label={t} selected={data.mealTiming === t} onClick={() => set("mealTiming", t)} />
        ))}
      </div>

      <Divider />
      <SectionLabel num={5}>Food quality today was mostly...</SectionLabel>
      {[
        { v: "junk", e: "🔴", l: "Processed / fast food / junk" },
        { v: "mixed", e: "🟠", l: "Mixed — some okay, some not great" },
        { v: "decent", e: "🟡", l: "Decent — mostly whole foods" },
        { v: "good", e: "🟢", l: "Good — nutritious, balanced meals" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.foodQuality === o.v} onClick={() => set("foodQuality", o.v)} />)}

      <Divider />
      <SectionLabel num={6}>Sugar / junk food today...</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {["Heavy — multiple times", "Some — a treat or two", "Minimal", "None"].map(s => (
          <MultiChip key={s} label={s} selected={data.sugar === s} onClick={() => set("sugar", s)} />
        ))}
      </div>

      <Divider />
      <SectionLabel num={7}>Water intake today...</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {["Poor — mostly caffeine/soda", "Okay — some water", "Good — well hydrated"].map(w => (
          <MultiChip key={w} label={w} selected={data.water === w} onClick={() => set("water", w)} />
        ))}
      </div>

      <Divider />
      <SectionLabel num={8}>Stress level today...</SectionLabel>
      {[
        { v: "overwhelming", e: "🔴", l: "Overwhelming — couldn't cope, felt paralyzed" },
        { v: "high", e: "🟠", l: "High — managing but it took everything I had" },
        { v: "moderate", e: "🟡", l: "Moderate — present but functional" },
        { v: "low", e: "🟢", l: "Low — relaxed, no major pressures" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.stress === o.v} onClick={() => set("stress", o.v)} />)}
      <div style={{ marginTop: 8, marginBottom: 6, fontSize: 20, color: T.muted }}>Stress mainly from... (select all)</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {stressSources.map(s => (
          <MultiChip key={s} label={s}
            selected={(data.stressSources || []).includes(s)}
            onClick={() => {
              const curr = data.stressSources || [];
              set("stressSources", curr.includes(s) ? curr.filter(x => x !== s) : [...curr, s]);
            }} />
        ))}
      </div>

      <Divider />
      <SectionLabel num={9}>Social interaction today felt...</SectionLabel>
      {[
        { v: "isolated", e: "🔴", l: "Completely isolated — avoided everyone" },
        { v: "minimal", e: "🟠", l: "Mostly alone — minimal contact, felt disconnected" },
        { v: "some", e: "🟡", l: "Some interaction — functional but surface level" },
        { v: "connected", e: "🟢", l: "Connected — had meaningful contact with people I care about" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.social === o.v} onClick={() => set("social", o.v)} />)}

      <Divider />
      <SectionLabel num={10}>Recreational screen time today...</SectionLabel>
      {[
        { v: "5plus", e: "🔴", l: "5+ hours — felt like I couldn't stop" },
        { v: "3_5", e: "🟠", l: "3–5 hours — more than I wanted" },
        { v: "1_3", e: "🟡", l: "1–3 hours — reasonable" },
        { v: "under_1", e: "🟢", l: "Under 1 hour — minimal" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.screenTime === o.v} onClick={() => set("screenTime", o.v)} />)}

      <Divider />
      <SectionLabel num={11}>Time outside / sunlight today...</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {["None", "Under 15 min", "15–30 min", "30–60 min", "60+ min"].map(t => (
          <MultiChip key={t} label={t} selected={data.sunlight === t} onClick={() => set("sunlight", t)} />
        ))}
      </div>

      <Divider />
      <SectionLabel num={12}>Faith / spiritual practice today...</SectionLabel>
      {[
        { v: "none", e: "⚪", l: "None — didn't engage today" },
        { v: "brief", e: "🟡", l: "Brief — quick prayer or moment of gratitude" },
        { v: "moderate", e: "🟢", l: "Moderate — scripture, devotional, or prayer time" },
        { v: "meaningful", e: "💚", l: "Meaningful — felt genuinely connected and grounded" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.faith === o.v} onClick={() => set("faith", o.v)} />)}
      {data.faith && data.faith !== "none" && (
        <>
          <div style={{ marginTop: 8, marginBottom: 6, fontSize: 20, color: T.muted }}>Faith felt like...</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {["A source of peace today", "Neutral — went through motions", "Struggled / felt distant"].map(f => (
              <MultiChip key={f} label={f} selected={data.faithQuality === f} onClick={() => set("faithQuality", f)} />
            ))}
          </div>
        </>
      )}

      <Divider />
      <SectionLabel num={13}>Caffeine today (energy drinks, soda, coffee)... <span style={{fontSize:10, color: T.warn, fontWeight:700}}>← Adderall interaction</span></SectionLabel>
      {[
        { v: "none",     e: "⚪", l: "None" },
        { v: "light",    e: "🟢", l: "Light — 1 drink, before noon" },
        { v: "moderate", e: "🟡", l: "Moderate — 2 drinks, or one after noon" },
        { v: "heavy",    e: "🔴", l: "Heavy — 3+ drinks or drinking into the evening" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.caffeine === o.v} onClick={() => set("caffeine", o.v)} />)}

      <Divider />
      <SectionLabel num={14}>After caffeine today I felt...</SectionLabel>
      {[
        { v: "anxious", e: "🔴", l: "More anxious or jittery" },
        { v: "racing",  e: "🔴", l: "Heart racing or overstimulated" },
        { v: "fine",    e: "🟢", l: "Fine — no noticeable effect" },
        { v: "focused", e: "🟢", l: "Actually helped me focus" },
        { v: "na",      e: "⚪", l: "Didn't have caffeine" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.caffeineEffect === o.v} onClick={() => set("caffeineEffect", o.v)} />)}
    </div>
  );
}



function EndOfDaySection({ data, set }) {
  return (
    <div>
      <SectionLabel num={1}>Overall, today felt like...</SectionLabel>
      {[
        { v: "hardest", e: "🔴", l: "One of my harder days" },
        { v: "rough", e: "🟠", l: "Rough but got through it" },
        { v: "average", e: "🟡", l: "Average — nothing notable" },
        { v: "good", e: "🟢", l: "A good day" },
        { v: "best", e: "💚", l: "One of my better days lately" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.overall === o.v} onClick={() => set("overall", o.v)} />)}

      <Divider />
      <SectionLabel num={2}>Compared to yesterday, today felt...</SectionLabel>
      {[
        { v: "much_worse", e: "🔴", l: "Much worse" },
        { v: "little_worse", e: "🟠", l: "A little worse" },
        { v: "same", e: "🟡", l: "About the same" },
        { v: "little_better", e: "🟢", l: "A little better" },
        { v: "much_better", e: "💚", l: "Much better" },
      ].map(o => <ChoiceButton key={o.v} emoji={o.e} label={o.l} selected={data.vsYesterday === o.v} onClick={() => set("vsYesterday", o.v)} />)}

      <Divider />
      <SectionLabel num={3}>💵 Money — did you spend anything today you felt uncertain about?</SectionLabel>
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
          <SectionLabel num={4}>Before spending I felt... (select all)</SectionLabel>
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
      <SectionLabel num={5}>Today in one word...</SectionLabel>
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
      <SectionLabel num={6}>Biggest thing that affected my day...</SectionLabel>
      <textarea
        value={data.biggestThing || ""}
        onChange={e => set("biggestThing", e.target.value)}
        placeholder="e.g. bad sleep, OCD bad in the morning, felt really clear-headed, stressful call..."
        rows={2} style={textareaStyle}
      />

      <Divider />
      <SectionLabel num={7}>One thing I want my doctor to know about today... (optional)</SectionLabel>
      <textarea
        value={data.doctorNote || ""}
        onChange={e => set("doctorNote", e.target.value)}
        placeholder="Anything you want flagged for your appointment..."
        rows={2} style={textareaStyle}
      />

      <Divider />
      <div style={{ background: T.blueLight, border: `1.5px solid ${T.blue}44`, borderRadius: 10, padding: "14px 16px" }}>
        <SectionLabel num={8} color={T.blue}>🌙 What does tomorrow need to be about?</SectionLabel>
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

export default function TrackerTab({ entries, formData, setFormData, sectionIdx, setSectionIdx, savedMorning, savedEvening, setSavedMorning, setSavedEvening, hasDraft, setHasDraft, checkinMode, setCheckinMode, setTab, saveEntry, resetTracker, clearDraft, meds = [], setMeds }) {
  const activeSections = checkinMode === "morning" ? MORNING_SECTIONS : EVENING_SECTIONS;
  const saved = checkinMode === "morning" ? savedMorning : savedEvening;

  const todayStr = new Date().toDateString();
  const todayEntry = entries.find(e => new Date(e.date).toDateString() === todayStr);
  const morningDone = !!(todayEntry?.morningDone);
  const eveningDone = !!(todayEntry?.eveningDone);

  const currentSection = activeSections[sectionIdx];
  const progress = saved ? 100 : Math.round(((sectionIdx) / activeSections.length) * 100);

  const setSectionData = (section, key, val) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [key]: val }
    }));
  };

  const sectionData = (section) => formData[section] || {};

  const renderSection = () => {
    const d = sectionData(currentSection);
    const set = (k, v) => setSectionData(currentSection, k, v);
    // eslint-disable-next-line no-unused-vars
    switch (currentSection) {
      case "sleep": return <SleepSection data={d} set={set} />;
      case "morning_start": return <MorningStartSection data={d} set={set} meds={meds} />;
      case "ocd": return <OcdSection data={d} set={set} />;
      case "mood_wellbeing": return <MoodWellbeingSection data={d} set={set} />;
      case "adhd": return <AdhdSection data={d} set={set} />;
      case "side_effects": return <SideEffectsSection data={d} set={set} />;
      case "med_checkin": return <MedCheckinSection data={d} set={set} meds={meds} setMeds={setMeds} />;
      case "health_lifestyle": return <HealthLifestyleSection data={d} set={set} />;
      case "end_of_day": return <EndOfDaySection data={d} set={set} />;
      default: return null;
    }
  };

  return (
    <div className="fade">

      {/* Daily Quote */}
      {(() => {
        const q = getTodayQuote();
        return (
          <div style={{
            margin: "14px 0 10px",
            padding: "14px 16px",
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderLeft: `4px solid ${T.accent}`,
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, fontStyle: "italic", marginBottom: 6 }}>"{q.text}"</div>
            <div style={{ fontSize: 11, color: T.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>— {q.source}</span>
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 10, fontWeight: 700,
                background: q.tag === "faith" ? T.accentLight : q.tag === "adhd" ? T.blueLight : q.tag === "stoic" ? T.faint : T.warnLight,
                color: q.tag === "faith" ? T.accent : q.tag === "adhd" ? T.blue : q.tag === "stoic" ? T.muted : T.warn,
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>{q.tag === "hustle" ? "hustle" : q.tag}</span>
            </div>
          </div>
        );
      })()}

      {/* Morning / Evening switcher */}
      <div style={{ paddingTop: 4, marginBottom: 4 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {[
            { id: "morning", label: "☀️ Morning", sub: "~2 min · after 7–8am meds", done: morningDone },
            { id: "evening", label: "🌙 Evening", sub: "~4 min · available after 8pm", done: eveningDone },
          ].map(m => (
            <button key={m.id} onClick={() => { setCheckinMode(m.id); setSectionIdx(0); setFormData({}); clearDraft(); setHasDraft(false); }} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              border: `2px solid ${checkinMode === m.id ? T.accent : T.border}`,
              background: checkinMode === m.id ? T.accentLight : T.surface,
              color: checkinMode === m.id ? T.accent : T.muted, textAlign: "center",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{m.label} {m.done ? "✓" : ""}</div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.8 }}>{m.sub}</div>
            </button>
          ))}
        </div>
        {morningDone && eveningDone && (
          <div style={{ fontSize: 11, color: T.accent, textAlign: "center", padding: "4px 0" }}>
            ✓ Both check-ins complete for today
          </div>
        )}
      </div>

      {!saved ? (
        <>
          {/* Draft restore banner */}
          {hasDraft && (
            <div style={{
              background: T.blueLight, border: "1.5px solid " + T.blue,
              borderRadius: 10, padding: "12px 16px", marginBottom: 4,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.blue }}>📋 Draft restored</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Your progress was saved. Pick up where you left off.</div>
              </div>
              <button onClick={() => { clearDraft(); setFormData({}); setSectionIdx(0); setHasDraft(false); }} style={{
                padding: "5px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                background: T.surface, border: "1px solid " + T.border, color: T.muted,
                fontFamily: "inherit",
              }}>Start over</button>
            </div>
          )}

          {/* Section progress */}
          <div style={{ padding: "10px 0 6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: T.muted }}>
              <span>{SECTION_LABELS[currentSection]}</span>
              <span>{sectionIdx + 1} of {activeSections.length}</span>
            </div>
            <div style={{ height: 4, background: T.border, borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: T.accent, borderRadius: 2, transition: "width 0.3s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
              {activeSections.map((s, i) => (
                <button key={s} onClick={() => setSectionIdx(i)} style={{
                  flexShrink: 0, padding: "5px 10px", borderRadius: 20, fontSize: 11,
                  border: `1.5px solid ${i === sectionIdx ? T.accent : T.border}`,
                  background: i < sectionIdx ? T.accentLight : i === sectionIdx ? T.accent : T.surface,
                  color: i === sectionIdx ? "#fff" : i < sectionIdx ? T.accent : T.muted,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                }}>{SECTION_LABELS[s].split(" ").slice(1).join(" ")}</button>
              ))}
            </div>
          </div>

          <Card>
            <div className="fade" key={currentSection}>{renderSection()}</div>
          </Card>

          <div style={{ display: "flex", gap: 10, paddingBottom: 100 }}>
            {sectionIdx > 0 && (
              <button onClick={() => { setSectionIdx(sectionIdx - 1); window.scrollTo({ top: 0, behavior: 'instant' }); }} style={{
                flex: "0 0 auto", padding: "13px 20px", borderRadius: 8,
                border: `1.5px solid ${T.border}`, background: T.surface,
                color: T.muted, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}>← Back</button>
            )}
            {sectionIdx < activeSections.length - 1 ? (
              <button onClick={() => { setSectionIdx(sectionIdx + 1); window.scrollTo({ top: 0, behavior: 'instant' }); }} style={{
                flex: 1, padding: "13px", borderRadius: 8, border: "none",
                background: T.accent, color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>Next: {SECTION_LABELS[activeSections[sectionIdx + 1]]} →</button>
            ) : (
              <button onClick={saveEntry} style={{
                flex: 1, padding: "13px", borderRadius: 8, border: "none",
                background: T.accent, color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>✓ Save {checkinMode === "morning" ? "Morning" : "Evening"} Check-In</button>
            )}
          </div>
        </>
      ) : (
        <div className="fade" style={{ paddingTop: 16 }}>
          <Card style={{ textAlign: "center", padding: "32px 24px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{checkinMode === "morning" ? "☀️" : "🌙"}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {checkinMode === "morning" ? "Morning Check-In Saved" : "Evening Check-In Saved"}
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.6 }}>
              {checkinMode === "morning"
                ? "Good start. Come back tonight after the kids are down for your evening check-in."
                : "Done for today. Every entry builds the picture your doctor needs."}
            </div>
            {checkinMode === "morning" && !eveningDone && (
              <div style={{ padding: "10px 12px", background: T.faint, borderRadius: 8, fontSize: 12, color: T.muted, marginBottom: 16 }}>
                🌙 Evening check-in available after noon · best after 8–9pm
              </div>
            )}
            {formData.end_of_day?.doctorNote && (
              <div style={{ padding: "12px 14px", background: T.blueLight, border: `1px solid ${T.blue}44`, borderRadius: 8, fontSize: 12, color: T.blue, textAlign: "left", marginBottom: 16 }}>
                🩺 Flagged for doctor: "{formData.end_of_day.doctorNote}"
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={resetTracker} style={{
                flex: 1, padding: "11px", borderRadius: 8,
                border: `1.5px solid ${T.border}`, background: T.surface,
                color: T.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}>Redo this check-in</button>
              {checkinMode === "morning" && !eveningDone ? (
                <button onClick={() => { setCheckinMode("evening"); setSectionIdx(0); setFormData({}); }} style={{
                  flex: 1, padding: "11px", borderRadius: 8,
                  border: `1.5px solid ${T.accent}`, background: T.accentLight,
                  color: T.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>Switch to Evening →</button>
              ) : (
                <button onClick={() => setTab("history")} style={{
                  flex: 1, padding: "11px", borderRadius: 8,
                  border: `1.5px solid ${T.accent}`, background: T.accentLight,
                  color: T.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>View History →</button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
