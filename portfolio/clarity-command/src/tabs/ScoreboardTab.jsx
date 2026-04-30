import React, { useState } from "react";
import { T, daysSince, computeStreak, today } from "../theme";

// Returns "met" | "partial" | "missed" | "future" for a given log entry
function getDayStatus(log, targets) {
  if (!log) return "missed";
  const a = log.areas || {};
  const jobs = log.jobActions || [];
  const checks = [
    jobs.length >= targets.jobActions,
    (a.time || 0) >= targets.productiveHours,
    !!a.budget,
    (a.scripture || 0) >= targets.scriptureMinutes,
    !!a.prayer?.morning && !!a.prayer?.evening,
    !!a.wellness?.activity,
  ];
  const metCount = checks.filter(Boolean).length;
  if (metCount === checks.length) return "met";
  if (metCount > 0) return "partial";
  return "missed";
}

function statusColor(status) {
  if (status === "met") return T.green;
  if (status === "partial") return T.yellow;
  if (status === "missed") return T.red;
  return T.border;
}

// ── WEEK GRID ──────────────────────────────────────────────────────────────
function WeekGrid({ dailyLogs, targets }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const log = dailyLogs.find(l => l.date === dateStr) || null;
    const status = getDayStatus(log, targets);
    days.push({ dateStr, label: d.toLocaleDateString("en-US", { weekday: "short" }), dayNum: d.getDate(), status, log });
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6 }}>
        {days.map(d => (
          <div key={d.dateStr} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>{d.label}</div>
            <div style={{
              height: 36, borderRadius: 8,
              background: d.status === "met" ? T.greenLight : d.status === "partial" ? T.yellowLight : d.status === "missed" ? T.redLight : T.surface,
              border: `1px solid ${statusColor(d.status)}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: statusColor(d.status),
            }}>
              {d.dayNum}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10, justifyContent: "center" }}>
        {[["met", "All Met"], ["partial", "Partial"], ["missed", "Missed"]].map(([s, l]) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: statusColor(s) }} />
            <span style={{ fontSize: 11, color: T.muted }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AREA STREAKS ───────────────────────────────────────────────────────────
function AreaStreaks({ dailyLogs, targets }) {
  const areas = [
    {
      key: "jobs",
      label: "Job Search",
      icon: "💼",
      met: (l) => (l.jobActions || []).length >= targets.jobActions,
    },
    {
      key: "time",
      label: "Productive Hours",
      icon: "⏱",
      met: (l) => (l.areas?.time || 0) >= targets.productiveHours,
    },
    {
      key: "budget",
      label: "Budget Check",
      icon: "💰",
      met: (l) => !!l.areas?.budget,
    },
    {
      key: "scripture",
      label: "Scripture",
      icon: "📖",
      met: (l) => (l.areas?.scripture || 0) >= targets.scriptureMinutes,
    },
    {
      key: "prayer",
      label: "Prayer",
      icon: "🙏",
      met: (l) => !!l.areas?.prayer?.morning && !!l.areas?.prayer?.evening,
    },
    {
      key: "activity",
      label: "Activity",
      icon: "🏃",
      met: (l) => !!l.areas?.wellness?.activity,
    },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {areas.map(area => {
        const streak = computeStreak(dailyLogs.map(l => ({ date: l.date, met: area.met(l) })));
        return (
          <div key={area.key} style={{
            flex: "1 1 calc(50% - 4px)", background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>{area.icon}</span>
            <div>
              <div style={{ fontSize: 12, color: T.muted }}>{area.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: streak > 0 ? T.green : T.muted, lineHeight: 1.1 }}>
                {streak}<span style={{ fontSize: 11, fontWeight: 400, color: T.muted }}> day{streak !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MONTHLY CALENDAR ───────────────────────────────────────────────────────
function MonthCalendar({ dailyLogs, targets }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 18, padding: "0 4px" }}>‹</button>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{monthName}</div>
        <button onClick={nextMonth} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 18, padding: "0 4px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: T.muted, textAlign: "center", paddingBottom: 4 }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const log = dailyLogs.find(l => l.date === dateStr) || null;
          const todayStr = new Date().toISOString().slice(0, 10);
          const isFuture = dateStr > todayStr;
          const status = isFuture ? "future" : getDayStatus(log, targets);
          const isToday = dateStr === todayStr;
          return (
            <div key={dateStr} style={{
              aspectRatio: "1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              background: status === "met" ? T.greenLight : status === "partial" ? T.yellowLight : status === "missed" && !isFuture ? T.redLight : "transparent",
              border: isToday ? `2px solid ${T.accent}` : `1px solid ${isFuture ? "transparent" : statusColor(status)}`,
              fontSize: 11, fontWeight: isToday ? 700 : 400,
              color: isFuture ? T.muted : statusColor(status),
            }}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STATS ROW ──────────────────────────────────────────────────────────────
function StatsRow({ dailyLogs, targets, layoffDate }) {
  const daysSinceLayoff = daysSince(layoffDate);
  const allMetLogs = dailyLogs.map(l => ({ date: l.date, met: getDayStatus(l, targets) === "met" }));
  const overallStreak = computeStreak(allMetLogs);
  const totalDaysLogged = dailyLogs.length;
  const totalPerfectDays = dailyLogs.filter(l => getDayStatus(l, targets) === "met").length;
  const perfectPct = totalDaysLogged > 0 ? Math.round((totalPerfectDays / totalDaysLogged) * 100) : 0;
  const totalJobActions = dailyLogs.reduce((sum, l) => sum + (l.jobActions || []).length, 0);

  const stats = [
    { label: "Days Since Layoff", value: daysSinceLayoff !== null ? daysSinceLayoff : "—", color: T.red },
    { label: "Current Streak", value: overallStreak, color: overallStreak > 0 ? T.green : T.muted },
    { label: "Perfect Days", value: `${totalPerfectDays}`, sub: `${perfectPct}%`, color: T.accent },
    { label: "Total Job Actions", value: totalJobActions, color: T.blue },
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {stats.map(s => (
        <div key={s.label} style={{
          flex: "1 1 calc(50% - 4px)", background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "12px 14px",
        }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>
            {s.value}{s.sub && <span style={{ fontSize: 13, color: T.muted, marginLeft: 4 }}>{s.sub}</span>}
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── LIVE APP DATA ─────────────────────────────────────────────────────────
function LiveAppData({ jobSearchDaily, wellnessDaily, timeDaily, budgetDaily, growthDaily }) {
  const todayStr = today();
  const hasAny = jobSearchDaily || wellnessDaily || timeDaily || budgetDaily || growthDaily;
  if (!hasAny) return null;

  const rowStyle = (isLast) => ({
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: isLast ? "none" : `1px solid ${T.border}`,
  });

  const isToday = (d) => d?.date === todayStr;

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
        Live App Data
      </div>
      {/* Job Search HQ */}
      {jobSearchDaily && (
        <div style={rowStyle(false)}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Job Search HQ</div>
            <div style={{ fontSize: 11, color: T.muted }}>{isToday(jobSearchDaily) ? "Today" : jobSearchDaily.date}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: jobSearchDaily.met ? T.green : T.accent }}>
              {jobSearchDaily.count}/{5} actions{jobSearchDaily.met ? " ✓" : ""}
            </span>
            {!isToday(jobSearchDaily) && <div style={{ fontSize: 10, color: T.muted }}>last sync</div>}
          </div>
        </div>
      )}
      {/* Wellness Tracker */}
      {wellnessDaily && (
        <div style={rowStyle(false)}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Wellness Tracker</div>
            <div style={{ fontSize: 11, color: T.muted }}>{isToday(wellnessDaily) ? "Today" : wellnessDaily.date}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 16 }} title="Morning check-in">{wellnessDaily.morningDone ? "☀️" : "⬜"}</span>
            <span style={{ fontSize: 16 }} title="Evening check-in">{wellnessDaily.eveningDone ? "🌙" : "⬜"}</span>
            <span style={{ fontSize: 16 }} title="Activity">{wellnessDaily.activityDone === "yes" ? "🏃" : "⬜"}</span>
            {wellnessDaily.excusesEvening === "no" && <span style={{ fontSize: 11, color: T.green }}>✓</span>}
          </div>
        </div>
      )}
      {/* Clarity Time */}
      {timeDaily && (
        <div style={rowStyle(false)}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Clarity Time</div>
            <div style={{ fontSize: 11, color: T.muted }}>{isToday(timeDaily) ? "Today" : timeDaily.date}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: timeDaily.met ? T.green : T.accent }}>
              {timeDaily.sessionMinutes}m
            </span>
            <span style={{ fontSize: 11, color: T.muted }}>
              {timeDaily.sessionCount} session{timeDaily.sessionCount !== 1 ? "s" : ""}
            </span>
            {timeDaily.scriptureDone && <span style={{ fontSize: 13 }} title="Scripture done">{"📖"}</span>}
            {!isToday(timeDaily) && <span style={{ fontSize: 10, color: T.muted }}>last sync</span>}
          </div>
        </div>
      )}
      {/* Clarity Budget */}
      {budgetDaily && (
        <div style={rowStyle(false)}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Clarity Budget</div>
            <div style={{ fontSize: 11, color: T.muted }}>{isToday(budgetDaily) ? "Today" : budgetDaily.date}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: budgetDaily.met ? T.green : T.red }}>
              ${(Math.abs(budgetDaily.wantsRemainingCents) / 100).toFixed(0)} {budgetDaily.met ? "left" : "over"}
            </span>
            {!isToday(budgetDaily) && <div style={{ fontSize: 10, color: T.muted }}>last sync</div>}
          </div>
        </div>
      )}
      {/* Clarity Growth */}
      {growthDaily && (
        <div style={rowStyle(true)}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Clarity Growth</div>
            <div style={{ fontSize: 11, color: T.muted }}>{isToday(growthDaily) ? "Today" : growthDaily.date}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: growthDaily.met ? T.green : T.accent }}>
              {growthDaily.growthMinutes}m
            </span>
            {growthDaily.areas.length > 0 && (
              <span style={{ fontSize: 11, color: T.muted }}>
                {growthDaily.areas.length} area{growthDaily.areas.length !== 1 ? "s" : ""}
              </span>
            )}
            {!isToday(growthDaily) && <span style={{ fontSize: 10, color: T.muted }}>last sync</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN SCOREBOARD TAB ────────────────────────────────────────────────────
export default function ScoreboardTab({ dailyLogs, layoffDate, targets, jobSearchDaily, wellnessDaily, timeDaily, budgetDaily, growthDaily }) {
  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 2 }}>Scoreboard</div>
        <div style={{ fontSize: 12, color: T.muted }}>Your consistency. Your accountability. No hiding.</div>
      </div>

      <LiveAppData jobSearchDaily={jobSearchDaily} wellnessDaily={wellnessDaily} timeDaily={timeDaily} budgetDaily={budgetDaily} growthDaily={growthDaily} />

      <StatsRow dailyLogs={dailyLogs} targets={targets} layoffDate={layoffDate} />

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Last 7 Days</div>
        <WeekGrid dailyLogs={dailyLogs} targets={targets} />
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Area Streaks</div>
        <AreaStreaks dailyLogs={dailyLogs} targets={targets} />
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Monthly View</div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px" }}>
          <MonthCalendar dailyLogs={dailyLogs} targets={targets} />
        </div>
      </div>

      {dailyLogs.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: T.muted, fontSize: 14 }}>
          No data yet. Complete your first day to see your scoreboard.
        </div>
      )}
    </div>
  );
}
