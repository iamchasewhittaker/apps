import React from "react";
import { T } from "../../theme";
import { MedBadge, SectionLabel, ChoiceButton, Divider } from "../../ui";

export default function AdhdSection({ data, set }) {
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
