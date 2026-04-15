import React from "react";
import { T } from "../../theme";
import { MedBadge, SectionLabel, ChoiceButton, Divider, MultiChip } from "../../ui";

export default function OcdSection({ data, set }) {
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
