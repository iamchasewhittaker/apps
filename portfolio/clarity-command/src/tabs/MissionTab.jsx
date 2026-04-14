import React, { useState } from "react";
import { T, today, daysSince, computeStreak } from "../theme";
import { getTodayScripture } from "../data/scriptures";
import { getTodayReminder } from "../data/reminders";

// ── CONVICTION MESSAGES (shown when targets were missed yesterday) ──────────
function convictionMessage(area, count, target, reminder, scripture) {
  const her = reminder ? `"${reminder.text}"` : null;
  const ref = scripture ? `(${scripture.ref})` : "";

  const msgs = {
    jobs: `You logged ${count} of ${target} job actions yesterday. ${her ? her + " — " : ""}Get back to work today. ${ref}`,
    time: `You tracked ${count} of ${target} productive hours yesterday. "You are wasting time." Every hour matters. ${ref}`,
    budget: `You didn't check your budget yesterday. Financial pressure is real for your family — stay aware. ${ref}`,
    scripture: `You skipped scripture study yesterday. How can you lead your family spiritually if you're not feeding your own spirit? 'I will go and do.' (1 Ne 3:7)`,
    prayer: `You skipped prayer yesterday. Start there — that's where strength comes from.`,
    wellness: `You didn't complete your wellness check-ins yesterday. You can't lead your family if you're running on empty.`,
  };
  return msgs[area] || `You missed your ${area} target yesterday. Get back on track today.`;
}

// ── CONVICTION PANEL ───────────────────────────────────────────────────────
function ConvictionPanel({ yesterdayLog, targets, reminders, scripture }) {
  if (!yesterdayLog) return null;
  const { areas } = yesterdayLog;
  const missed = [];

  if ((areas.jobs || 0) < targets.jobActions) missed.push({ area: "jobs", count: areas.jobs || 0, target: targets.jobActions });
  if ((areas.time || 0) < targets.productiveHours) missed.push({ area: "time", count: areas.time || 0, target: targets.productiveHours });
  if (!areas.budget) missed.push({ area: "budget", count: 0, target: 1 });
  if ((areas.scripture || 0) < targets.scriptureMinutes) missed.push({ area: "scripture", count: areas.scripture || 0, target: targets.scriptureMinutes });
  if (!areas.prayer?.morning || !areas.prayer?.evening) missed.push({ area: "prayer", count: 0, target: 1 });
  if (!areas.wellness?.morning || !areas.wellness?.evening) missed.push({ area: "wellness", count: 0, target: 1 });

  if (missed.length === 0) return null;

  const todayReminder = getTodayReminder(reminders);

  return (
    <div style={{ margin: "16px 16px 0", borderRadius: 12, overflow: "hidden", border: `1px solid ${T.red}` }}>
      <div style={{ background: T.redLight, padding: "10px 14px", fontWeight: 700, fontSize: 13, color: T.red, display: "flex", alignItems: "center", gap: 8 }}>
        <span>⚠</span> Yesterday you fell short. No excuses — respond today.
      </div>
      {missed.map(m => (
        <div key={m.area} style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, background: T.surface, fontSize: 13, color: T.text, lineHeight: 1.5 }}>
          {convictionMessage(m.area, m.count, m.target, todayReminder, scripture)}
        </div>
      ))}
    </div>
  );
}

// ── SCRIPTURE CARD ─────────────────────────────────────────────────────────
function ScriptureCard({ scripture }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ margin: "16px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: T.accentLight, padding: "8px 14px", fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: 1, textTransform: "uppercase" }}>
        Today's Identity Truth
      </div>
      <div style={{ padding: "14px 14px 10px" }}>
        <div style={{ fontSize: 14, color: T.text, lineHeight: 1.65, fontStyle: "italic", marginBottom: 8 }}>
          "{scripture.text}"
        </div>
        <div style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>{scripture.ref}</div>
        {expanded && (
          <div style={{ marginTop: 10, padding: "10px 12px", background: T.surfaceHigh, borderRadius: 8, fontSize: 12, color: T.muted, lineHeight: 1.55 }}>
            {scripture.convictionMsg}
          </div>
        )}
        <button onClick={() => setExpanded(e => !e)} style={{ marginTop: 8, background: "none", border: "none", color: T.muted, fontSize: 11, cursor: "pointer", padding: 0 }}>
          {expanded ? "Less" : "Apply this →"}
        </button>
      </div>
    </div>
  );
}

// ── HER WORDS CARD ─────────────────────────────────────────────────────────
function HerWordsCard({ reminder }) {
  return (
    <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: "#1a1020", padding: "8px 14px", fontSize: 11, fontWeight: 700, color: "#c084fc", letterSpacing: 1, textTransform: "uppercase" }}>
        From Your Wife
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ fontSize: 15, color: T.text, lineHeight: 1.6, fontStyle: "italic" }}>
          "{reminder.text}"
        </div>
      </div>
    </div>
  );
}

// ── COUNTER BANNER ─────────────────────────────────────────────────────────
function CounterBanner({ layoffDate, streak }) {
  const daysSinceLayoff = daysSince(layoffDate);
  return (
    <div style={{ display: "flex", margin: "12px 16px 0", gap: 10 }}>
      <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.red, lineHeight: 1 }}>
          {daysSinceLayoff !== null ? daysSinceLayoff : "—"}
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>Days Since Layoff</div>
      </div>
      <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: streak > 0 ? T.green : T.muted, lineHeight: 1 }}>
          {streak}
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>Day Streak</div>
      </div>
    </div>
  );
}

// ── COMMIT BUTTON ──────────────────────────────────────────────────────────
function CommitButton({ committed, onCommit }) {
  if (committed) {
    return (
      <div style={{ margin: "16px 16px 0", background: T.greenLight, border: `1px solid ${T.green}`, borderRadius: 12, padding: "14px", textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.green }}>Mission Accepted</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>You committed to today. Now go do it.</div>
      </div>
    );
  }
  return (
    <div style={{ margin: "16px 16px 0" }}>
      <button onClick={onCommit} style={{
        width: "100%", padding: "16px", borderRadius: 12, background: T.accent,
        border: "none", color: "#0a0d14", fontWeight: 800, fontSize: 16, cursor: "pointer",
        letterSpacing: 0.5,
      }}>
        I Accept Today's Mission
      </button>
      <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginTop: 6 }}>
        Acknowledge your targets. Commit before you start.
      </div>
    </div>
  );
}

// ── DAILY TARGETS CHECKLIST ────────────────────────────────────────────────
function TargetRow({ label, done, count, target, unit, onToggle, onCount, inputType = "toggle" }) {
  const pct = target > 1 ? Math.min(1, (count || 0) / target) : (done ? 1 : 0);
  const met = pct >= 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
      <div onClick={onToggle} style={{
        width: 22, height: 22, borderRadius: 6, border: `2px solid ${met ? T.green : T.border}`,
        background: met ? T.green : "transparent", cursor: "pointer", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {met && <span style={{ color: "#0a0d14", fontSize: 13, fontWeight: 900 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: met ? T.text : T.muted, fontWeight: met ? 600 : 400 }}>{label}</div>
        {target > 1 && (
          <div style={{ marginTop: 4, height: 3, background: T.border, borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${pct * 100}%`, background: met ? T.green : T.accent, borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        )}
      </div>
      {inputType === "number" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => onCount(Math.max(0, (count || 0) - 1))} style={{ width: 28, height: 28, borderRadius: 6, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, cursor: "pointer", fontSize: 16 }}>−</button>
          <span style={{ fontSize: 14, color: T.text, minWidth: 30, textAlign: "center" }}>{count || 0}/{target}</span>
          <button onClick={() => onCount((count || 0) + 1)} style={{ width: 28, height: 28, borderRadius: 6, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, cursor: "pointer", fontSize: 16 }}>+</button>
        </div>
      )}
    </div>
  );
}

// ── JOB ACTION LOG ─────────────────────────────────────────────────────────
const JOB_ACTION_TYPES = ["Application", "Outreach / Networking", "Recruiter Call", "Interview Prep", "Learning / Skill-building", "Other"];

function JobActionLogger({ jobActions, target, onUpdate }) {
  const [type, setType] = useState(JOB_ACTION_TYPES[0]);
  const [note, setNote] = useState("");

  const add = () => {
    if (!type) return;
    onUpdate([...jobActions, { id: Date.now(), type, note: note.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setNote("");
  };

  const remove = (id) => onUpdate(jobActions.filter(a => a.id !== id));

  const met = jobActions.length >= target;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ fontSize: 13, color: T.muted }}>Log each action as you do it.</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: met ? T.green : T.accent }}>
          {jobActions.length}/{target}
        </div>
      </div>
      {jobActions.map(a => (
        <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, color: T.text }}>{a.type}</span>
            {a.note && <span style={{ fontSize: 12, color: T.muted }}> — {a.note}</span>}
            <span style={{ fontSize: 11, color: T.muted, marginLeft: 6 }}>{a.time}</span>
          </div>
          <button onClick={() => remove(a.id)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <select value={type} onChange={e => setType(e.target.value)} style={{
          flex: 1, minWidth: 140, padding: "8px 10px", borderRadius: 8, background: T.surfaceHigh,
          border: `1px solid ${T.border}`, color: T.text, fontSize: 13,
        }}>
          {JOB_ACTION_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" style={{
          flex: 2, minWidth: 100, padding: "8px 10px", borderRadius: 8, background: T.surfaceHigh,
          border: `1px solid ${T.border}`, color: T.text, fontSize: 13,
        }} onKeyDown={e => e.key === "Enter" && add()} />
        <button onClick={add} style={{
          padding: "8px 14px", borderRadius: 8, background: T.accent, border: "none",
          color: "#0a0d14", fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>+ Add</button>
      </div>
    </div>
  );
}

// ── EVENING REFLECTION ─────────────────────────────────────────────────────
function EveningReflection({ log, onUpdate }) {
  const excuses = log?.excuses || "";
  const notes = log?.notes || "";
  const top3 = log?.top3Tomorrow || ["", "", ""];

  return (
    <div>
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>
        Be honest. This is between you and God.
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>Did you make excuses today? What were they?</label>
        <textarea value={excuses} onChange={e => onUpdate({ excuses: e.target.value })}
          placeholder="Be honest — no one else is reading this."
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, resize: "vertical", minHeight: 70, fontFamily: "inherit" }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>What did you actually accomplish today?</label>
        <textarea value={notes} onChange={e => onUpdate({ notes: e.target.value })}
          placeholder="List it out. Even small wins count."
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, resize: "vertical", minHeight: 70, fontFamily: "inherit" }} />
      </div>
      <div>
        <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 6 }}>Tomorrow's Top 3 — Plan it tonight.</label>
        {top3.map((item, i) => (
          <input key={i} value={item} onChange={e => {
            const updated = [...top3]; updated[i] = e.target.value;
            onUpdate({ top3Tomorrow: updated });
          }} placeholder={`Priority ${i + 1}`}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, marginBottom: 6 }} />
        ))}
      </div>
    </div>
  );
}

// ── SECTION HEADER ─────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ padding: "20px 16px 0" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

// ── MAIN MISSION TAB ───────────────────────────────────────────────────────
export default function MissionTab({ layoffDate, scriptures, reminders, targets, dailyLogs, getTodayLog, upsertTodayLog, jobSearchDaily, wellnessDaily }) {
  const [mode, setMode] = useState("morning"); // "morning" | "evening"

  const todayLog = getTodayLog();
  const scripture = getTodayScripture(scriptures);
  const reminder = getTodayReminder(reminders);
  const streak = computeStreak(dailyLogs.map(l => ({
    date: l.date,
    met: checkAllMet(l, targets),
  })));

  // Yesterday's log for conviction panel
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const yesterdayLog = dailyLogs.find(l => l.date === yesterday) || null;

  const areas = todayLog?.areas || {};
  const jobActions = todayLog?.jobActions || [];
  const committed = todayLog?.committed || false;

  // Live cross-app data — use Job Search HQ count for today if available
  const todayStr = today();
  const liveJobCount = jobSearchDaily?.date === todayStr ? jobSearchDaily.count : null;
  const liveJobMet = jobSearchDaily?.date === todayStr ? jobSearchDaily.met : null;
  const displayJobCount = liveJobCount !== null ? liveJobCount : jobActions.length;
  const displayJobMet = liveJobMet !== null ? liveJobMet : (jobActions.length >= targets.jobActions);
  const jobSynced = liveJobCount !== null;

  const patchAreas = (patch) => upsertTodayLog({ areas: patch });

  const allMetToday = checkAllMet(todayLog, targets);

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Mode toggle */}
      <div style={{ display: "flex", margin: "16px 16px 0", background: T.surface, borderRadius: 10, padding: 3, border: `1px solid ${T.border}` }}>
        {["morning", "evening"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "8px", borderRadius: 8, border: "none",
            background: mode === m ? T.accent : "transparent",
            color: mode === m ? "#0a0d14" : T.muted,
            fontWeight: mode === m ? 700 : 400, fontSize: 13, cursor: "pointer",
          }}>
            {m === "morning" ? "Morning Mission" : "Evening Reflection"}
          </button>
        ))}
      </div>

      {mode === "morning" && (
        <>
          {/* Conviction for yesterday's misses */}
          <ConvictionPanel yesterdayLog={yesterdayLog} targets={targets} reminders={reminders} scripture={scripture} />

          {/* Scripture */}
          <ScriptureCard scripture={scripture} />

          {/* Her words */}
          <HerWordsCard reminder={reminder} />

          {/* Counters */}
          <CounterBanner layoffDate={layoffDate} streak={streak} />

          {/* Top 3 from yesterday */}
          {yesterdayLog?.top3Tomorrow?.some(t => t) && (
            <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Yesterday You Planned</div>
              {yesterdayLog.top3Tomorrow.filter(t => t).map((t, i) => (
                <div key={i} style={{ fontSize: 13, color: T.text, padding: "3px 0" }}>• {t}</div>
              ))}
            </div>
          )}

          {/* Commit button */}
          <CommitButton committed={committed} onCommit={() => upsertTodayLog({ committed: true })} />

          {/* Today's targets */}
          <SectionHeader title="Today's Targets" subtitle="Non-negotiable. Your family is counting on you." />
          <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "4px 14px" }}>
            <TargetRow
              label={jobSynced ? "Job Search Actions 📡" : "Job Search Actions"}
              done={displayJobMet} count={displayJobCount} target={targets.jobActions}
              inputType={jobSynced ? "toggle" : "number"}
              onToggle={() => {}} onCount={() => {}}
            />
            <TargetRow label={`Productive Hours (${targets.productiveHours}h)`} done={(areas.time || 0) >= targets.productiveHours} count={areas.time || 0} target={targets.productiveHours} inputType="number"
              onToggle={() => {}} onCount={v => patchAreas({ time: v })} />
            <TargetRow label="Budget Check-in" done={!!areas.budget} count={areas.budget ? 1 : 0} target={1}
              onToggle={() => patchAreas({ budget: !areas.budget })} onCount={() => {}} />
            <TargetRow label={`Scripture Study (${targets.scriptureMinutes} min)`} done={(areas.scripture || 0) >= targets.scriptureMinutes} count={areas.scripture || 0} target={targets.scriptureMinutes} inputType="number"
              onToggle={() => {}} onCount={v => patchAreas({ scripture: v })} />
            <TargetRow label="Morning Prayer" done={!!areas.prayer?.morning} count={areas.prayer?.morning ? 1 : 0} target={1}
              onToggle={() => patchAreas({ prayer: { ...areas.prayer, morning: !areas.prayer?.morning } })} onCount={() => {}} />
            <TargetRow label="Physical Activity (20 min)" done={!!areas.wellness?.activity} count={areas.wellness?.activity ? 1 : 0} target={1}
              onToggle={() => patchAreas({ wellness: { ...areas.wellness, activity: !areas.wellness?.activity } })} onCount={() => {}} />
          </div>

          {/* Job action log */}
          <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>Job Actions Today</div>
            <JobActionLogger jobActions={jobActions} target={targets.jobActions}
              onUpdate={actions => upsertTodayLog({ jobActions: actions, areas: { ...areas, jobs: actions.length } })} />
          </div>

          {/* Wellness AM check-in */}
          <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10 }}>Morning Check-in</div>
            <TargetRow label="Morning wellness logged" done={!!areas.wellness?.morning} count={areas.wellness?.morning ? 1 : 0} target={1}
              onToggle={() => patchAreas({ wellness: { ...areas.wellness, morning: !areas.wellness?.morning } })} onCount={() => {}} />
          </div>

          {allMetToday && (
            <div style={{ margin: "16px 16px 0", background: T.greenLight, border: `1px solid ${T.green}`, borderRadius: 12, padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.green }}>All targets met today.</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>This is what showing up looks like. Do it again tomorrow.</div>
            </div>
          )}
        </>
      )}

      {mode === "evening" && (
        <>
          <SectionHeader title="Evening Reflection" subtitle="End the day with honesty." />

          {/* Close out remaining targets */}
          <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "4px 14px" }}>
            <TargetRow label="Evening Prayer" done={!!areas.prayer?.evening} count={areas.prayer?.evening ? 1 : 0} target={1}
              onToggle={() => patchAreas({ prayer: { ...areas.prayer, evening: !areas.prayer?.evening } })} onCount={() => {}} />
            <TargetRow label="Evening Wellness Check-in" done={!!areas.wellness?.evening} count={areas.wellness?.evening ? 1 : 0} target={1}
              onToggle={() => patchAreas({ wellness: { ...areas.wellness, evening: !areas.wellness?.evening } })} onCount={() => {}} />
          </div>

          {/* Reflection form */}
          <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px" }}>
            <EveningReflection log={todayLog} onUpdate={upsertTodayLog} />
          </div>

          {/* Today's final scorecard */}
          <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Today's Scorecard</div>
            {[
              { label: "Job Actions", met: jobActions.length >= targets.jobActions, detail: `${jobActions.length}/${targets.jobActions}` },
              { label: "Productive Hours", met: (areas.time || 0) >= targets.productiveHours, detail: `${areas.time || 0}/${targets.productiveHours}h` },
              { label: "Budget Check-in", met: !!areas.budget, detail: areas.budget ? "Done" : "Missed" },
              { label: "Scripture Study", met: (areas.scripture || 0) >= targets.scriptureMinutes, detail: `${areas.scripture || 0}/${targets.scriptureMinutes} min` },
              { label: "Prayer (both)", met: !!areas.prayer?.morning && !!areas.prayer?.evening, detail: `${[areas.prayer?.morning, areas.prayer?.evening].filter(Boolean).length}/2` },
              { label: "Physical Activity", met: !!areas.wellness?.activity, detail: areas.wellness?.activity ? "Done" : "Missed" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, color: T.text }}>{item.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: T.muted }}>{item.detail}</span>
                  <span style={{ fontSize: 16 }}>{item.met ? "✅" : "❌"}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* My Apps — quick links */}
      <div style={{ margin: "20px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          My Apps
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "Job Search HQ", url: "https://job-search-hq.vercel.app" },
            { label: "Wellness", url: "https://wellnes-tracker.vercel.app" },
            { label: "Clarity Hub", url: "https://clarity-hub-lilac.vercel.app" },
            { label: "Knowledge Base", url: "https://knowledge-base-beta-five.vercel.app" },
            { label: "YNAB Clarity", url: "https://ynab-clarity-web.vercel.app" },
            { label: "RollerTask", url: "https://rollertask-tycoon-web.vercel.app" },
            { label: "App Forge", url: "https://app-forge-fawn.vercel.app" },
          ].map(app => (
            <a key={app.label} href={app.url} target="_blank" rel="noopener noreferrer" style={{
              padding: "7px 14px", borderRadius: 8, background: T.surfaceHigh,
              border: `1px solid ${T.border}`, color: T.accent, fontSize: 13,
              fontWeight: 600, textDecoration: "none",
            }}>
              {app.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HELPER: check if a log entry meets all targets ─────────────────────────
function checkAllMet(log, targets) {
  if (!log) return false;
  const a = log.areas || {};
  const jobs = log.jobActions || [];
  return (
    jobs.length >= targets.jobActions &&
    (a.time || 0) >= targets.productiveHours &&
    !!a.budget &&
    (a.scripture || 0) >= targets.scriptureMinutes &&
    !!a.prayer?.morning && !!a.prayer?.evening &&
    !!a.wellness?.activity
  );
}
