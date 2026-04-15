import React from "react";
import { T } from "../../theme";
import { Card } from "../../ui";
import { MORNING_SECTIONS, EVENING_SECTIONS, SECTION_LABELS, getTodayQuote } from "./constants";
import SleepSection from "./SleepSection";
import MorningStartSection from "./MorningStartSection";
import OcdSection from "./OcdSection";
import MoodWellbeingSection from "./MoodWellbeingSection";
import AdhdSection from "./AdhdSection";
import MedCheckinSection from "./MedCheckinSection";
import SideEffectsSection from "./SideEffectsSection";
import HealthLifestyleSection from "./HealthLifestyleSection";
import EndOfDaySection from "./EndOfDaySection";

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
