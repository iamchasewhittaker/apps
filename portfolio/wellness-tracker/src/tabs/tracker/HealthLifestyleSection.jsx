import React from "react";
import { T } from "../../theme";
import { SectionLabel, ChoiceButton, Divider, MultiChip } from "../../ui";

export default function HealthLifestyleSection({ data, set }) {
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
