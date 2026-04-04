import React, { useState, useEffect } from "react";
import { T } from "../theme";

// ══════════════════════════════════════════════════════════════════════════
// TIME TRACKER TAB
// ══════════════════════════════════════════════════════════════════════════

const TIME_CATEGORIES = [
  {
    id: "kids", label: "Kid Care", icon: "👶", color: "#7B5EA7",
    tags: ["📚 Read a book","🧸 Played together","🍽️ Fed / snack","🛁 Bath / ready","🌳 Outside","📺 TV together","🎨 Creative play","😴 Nap routine","🚗 School run"],
    suggestions: ["Focus play — put the phone down","Read a book together","Outside time — even 10 min","Independent play — just supervise","Bath + wind-down routine"],
  },
  {
    id: "work", label: "Meaningful Work", icon: "💼", color: "#4a7fc0",
    tags: ["📋 Job applications","🔍 Job research","📄 Resume / LinkedIn","📚 GMAT study","🎓 PM course","🤖 AI course","📧 Networking"],
    suggestions: ["Search and apply to 1 job","Update resume for 20 min","Study one GMAT concept","Watch one PM course lesson","Update LinkedIn profile","Research one company"],
  },
  {
    id: "house", label: "Household", icon: "🏠", color: T.warn,
    tags: ["🍽️ Dishes / kitchen","👕 Laundry","🧹 Vacuuming","🛒 Groceries","🗑️ Trash","🧺 Tidying up"],
    suggestions: ["Clean the kitchen","One load of laundry","Vacuum one room","Wipe down bathroom","Take out trash","Quick tidy"],
  },
  {
    id: "move", label: "Movement", icon: "🏃", color: T.accent,
    tags: ["🚶 Walk","🏋️ Workout","🧘 Stretch","🚴 Bike","⚽ Active with kids","🏊 Swim"],
    suggestions: ["Walk around the block","10 min stretch","Stroller walk to the park","20 min bodyweight workout","Just go outside"],
  },
  {
    id: "scripture", label: "Scripture", icon: "📖", color: "#C4622D",
    tags: ["📖 Book of Mormon","📚 Come Follow Me","🙏 Prayer","✍️ Journaling","🎧 Listening","📝 Deep study","👨‍👩‍👧 Family scripture"],
    suggestions: ["Even one chapter counts — start there","Morning prayer before anything else","Listen to scriptures during kid care","Family scripture time after dinner","Journal one insight from reading"],
  },
  {
    id: "church", label: "Church", icon: "⛪", color: "#4a7fc0",
    tags: ["⛪ Sacrament Meeting","📚 Sunday School","👨‍👩‍👧 Elders Quorum","🤝 Bishopric Meeting","🏛️ Ward Council","🙏 Temple","📊 Membership records","📋 Meeting minutes","💰 Tithing / finances","📥 Reporting","📞 Stake coordination","🖨️ Bulletins","💻 LCR / system updates"],
    suggestions: ["Prepare for Bishopric Meeting","Update membership records in LCR","Prepare meeting minutes","Review tithing / finance reports"],
  },
  {
    id: "rest", label: "Rest", icon: "😴", color: T.muted,
    tags: ["😴 Lying down","🪑 Sitting quietly","🧘 Meditating","📖 Easy reading","☀️ Outside quietly"],
    suggestions: ["Close your eyes for 10 min","Sit outside without your phone","Do nothing on purpose — it counts","Read something easy and enjoyable"],
  },
  {
    id: "social", label: "Social", icon: "🤝", color: T.yellow,
    tags: ["💬 Quality time with wife","📞 Phone / video call","💌 Meaningful texts","🎉 Social outing","👨‍👩‍👧 Family activity"],
    suggestions: ["Put the phone down and just be present","Text someone you've been meaning to reach out to","Plan something small with your wife","Call a friend or family member"],
  },
  {
    id: "winddown", label: "Wind-Down", icon: "🌙", color: "#7B5EA7",
    tags: ["📚 Physical book","📱 Kindle","💻 iPhone / screen reading","🎧 Audio / Endel","🙏 Prayer","✍️ Journaling","🧘 Stretching","📺 TV (winding down)","💬 Talking with wife","🛁 Bath / shower"],
    suggestions: ["Put the phone across the room and grab a physical book","Open Endel and set a sleep timer","Write down anything on your mind","Do 5 min of stretching","No screens for 30 min — see how you feel"],
  },
  {
    id: "tv", label: "TV / Screen", icon: "📺", color: T.red,
    tags: ["📺 Watching TV / movie","📱 Social media","▶️ YouTube","🌐 Browsing","🎮 Gaming"],
    suggestions: ["This is okay — rest matters","Set a timer if you want a boundary","Notice how you feel after"],
  },
  {
    id: "untracked", label: "Untracked", icon: "❓", color: T.border,
    tags: ["🌀 Lost track","🔀 Switching between things","📝 Filling in after the fact"],
    suggestions: ["That's okay — just be honest from now","Log your best guess and move on"],
  },
];

const BACKGROUND_OPTIONS = [
  { id: "tv", label: "📺 TV / Movie" },
  { id: "youtube", label: "▶️ YouTube" },
  { id: "podcast", label: "🎙️ Podcast" },
  { id: "music", label: "🎵 Music" },
  { id: "endel", label: "🎵 Endel" },
  { id: "quiet", label: "🔇 Quiet" },
];

function fmt(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function fmtHHMM(ms) {
  const safe = Math.max(0, ms);
  const s = Math.floor(safe / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

function TimeTrackerTab({ timeData, setTimeData, scriptureStreak }) {
  const d = timeData || {};
  const todayStr = new Date().toDateString();

  // Reset if stored day isn't today
  const sessions = (d.day === todayStr ? d.sessions : []) || [];
  const activeSesh = d.day === todayStr ? (d.active || null) : null;

  const [active, setActive] = useState(activeSesh);
  const [sessionList, setSessionList] = useState(sessions);
  const [now, setNow] = useState(Date.now());
  const [pickingCat, setPickingCat] = useState(!activeSesh);
  const [selectedTags, setSelectedTags] = useState([]);
  const [background, setBackground] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [showNoteFor, setShowNoteFor] = useState(null); // session id
  const [editSession, setEditSession] = useState(null);
  const [view, setView] = useState("tracker"); // tracker | log

  // Tick every 30s
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  // Nudge after 2 hours in same category
  useEffect(() => {
    if (!active) return;
    const elapsed = now - active.startTime;
    if (elapsed > 2 * 60 * 60 * 1000 && !active.nudged) {
      const cat = TIME_CATEGORIES.find(c => c.id === active.catId);
      if (window.confirm(`⏱️ You've been in "${cat?.label}" for over 2 hours. Still going?`)) {
        const updated = { ...active, nudged: true };
        setActive(updated);
        persist(sessionList, updated);
      }
    }
  }, [now]);

  const persist = (sl, act) => {
    setTimeData(prev => ({ ...prev, day: todayStr, sessions: sl, active: act || null }));
  };

  const startCategory = (catId) => {
    // Close current session first
    let newList = sessionList;
    if (active) {
      const closed = { ...active, endTime: Date.now(), duration: Date.now() - active.startTime };
      newList = [closed, ...sessionList];
      setSessionList(newList);
    }
    const newActive = { id: Date.now(), catId, startTime: Date.now(), tags: selectedTags, background, note: "", nudged: false };
    setActive(newActive);
    setSelectedTags([]);
    setBackground(null);
    setPickingCat(false);
    persist(newList, newActive);
  };

  const stopCurrent = () => {
    if (!active) return;
    const closed = { ...active, endTime: Date.now(), duration: Date.now() - active.startTime };
    const newList = [closed, ...sessionList];
    setSessionList(newList);
    setActive(null);
    setPickingCat(true);
    setShowNoteFor(closed.id);
    persist(newList, null);
  };

  const saveNote = (sessionId, note) => {
    const updated = sessionList.map(s => s.id === sessionId ? { ...s, note } : s);
    setSessionList(updated);
    setShowNoteFor(null);
    setNoteText("");
    persist(updated, active);
  };

  const deleteSession = (id) => {
    const updated = sessionList.filter(s => s.id !== id);
    setSessionList(updated);
    persist(updated, active);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Summary totals
  // DST fix: if the active session started on a different calendar day, treat elapsed as 0
  const sessionDay = active ? new Date(active.startTime).toDateString() : null;
  const elapsed = active
    ? (sessionDay === todayStr ? Math.max(0, now - active.startTime) : 0)
    : 0;

  const totals = {};
  const allSessions = active
    ? [{ ...active, duration: elapsed }, ...sessionList]
    : sessionList;
  allSessions.forEach(s => {
    totals[s.catId] = (totals[s.catId] || 0) + (s.duration || 0);
  });

  const activeCat = active ? TIME_CATEGORIES.find(c => c.id === active.catId) : null;

  // Scripture streak
  const scriptureToday = allSessions.some(s => s.catId === "scripture");

  return (
    <div style={{ paddingTop: 16, paddingBottom: 100 }}>
      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{id:"tracker",label:"⏱️ Tracker"},{id:"log",label:"📋 Today's Log"}].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
            border: `1.5px solid ${view === v.id ? T.accent : T.border}`,
            background: view === v.id ? T.accentLight : T.surface,
            color: view === v.id ? T.accent : T.muted, fontSize: 13, fontWeight: 700,
          }}>{v.label}</button>
        ))}
      </div>

      {/* ── TRACKER VIEW ── */}
      {view === "tracker" && (
        <div>
          {/* Daily habits — Book of Mormon + Come Follow Me + streak */}
          {(() => {
            const streak = scriptureStreak || { count: 0, lastDate: null };
            const streakCount = streak.count;
            const bomDone = allSessions.some(s => s.catId === "scripture" && (s.tags || []).includes("📖 Book of Mormon"));
            const cfmDone = allSessions.some(s => s.catId === "scripture" && (s.tags || []).includes("📚 Come Follow Me"));
            const habits = [
              { label: "Book of Mormon", icon: "📖", done: bomDone },
              { label: "Come Follow Me", icon: "📚", done: cfmDone },
            ];
            return (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 8 }}>
                  Daily habits
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {habits.map(h => (
                    <div key={h.label} style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: h.done ? "#2b1a0f" : T.surface,
                      border: `1.5px solid ${h.done ? "#C4622D" : T.border}`,
                      color: h.done ? "#C4622D" : T.muted,
                    }}>
                      {h.icon} {h.label} {h.done ? "✓" : "—"}
                    </div>
                  ))}
                  {streakCount >= 2 && (
                    <div style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: "#2b1a0f", border: "1.5px solid #C4622D44",
                      color: "#C4622D",
                    }}>
                      🔥 {streakCount} day streak
                    </div>
                  )}
                </div>
                {(!bomDone || !cfmDone) && (
                  <div style={{
                    marginTop: 8, padding: "8px 12px", borderRadius: 8,
                    background: T.faint, border: `1px solid ${T.border}`,
                    fontSize: 11, color: T.muted, lineHeight: 1.5,
                  }}>
                    {!bomDone && !cfmDone
                      ? "📖 Log a Scripture session and tag Book of Mormon + Come Follow Me to check these off."
                      : !bomDone
                        ? "📖 Book of Mormon not yet — log a Scripture session and tag it."
                        : "📚 Come Follow Me not yet — log a Scripture session and tag it."}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Active session display */}
          {active && activeCat && (
            <div style={{
              background: activeCat.color + "15",
              border: `2px solid ${activeCat.color}`,
              borderRadius: 14, padding: "18px 18px 14px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, color: activeCat.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Currently tracking</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 2 }}>
                {activeCat.icon} {activeCat.label}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: activeCat.color, fontVariantNumeric: "tabular-nums", marginBottom: 10 }}>
                {fmtHHMM(elapsed)}
              </div>
              {active.tags && active.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                  {active.tags.map(t => (
                    <span key={t} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: activeCat.color + "25", color: activeCat.color, border: `1px solid ${activeCat.color}44` }}>{t}</span>
                  ))}
                </div>
              )}
              {active.background && (
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
                  Background: {BACKGROUND_OPTIONS.find(b => b.id === active.background)?.label}
                </div>
              )}
              <button onClick={stopCurrent} style={{
                width: "100%", padding: "11px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                border: `1.5px solid ${activeCat.color}`, background: "transparent",
                color: activeCat.color, fontSize: 14, fontWeight: 700,
              }}>⏹ Stop & switch</button>
            </div>
          )}

          {/* Note prompt after stopping */}
          {showNoteFor && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8 }}>Add a note? <span style={{ color: T.muted, fontWeight: 400 }}>(optional)</span></div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="What happened? What did you do? How did it feel?"
                rows={2}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.faint, color: T.text, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 8 }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => saveNote(showNoteFor, noteText)} style={{ flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", border: `1.5px solid ${T.accent}`, background: T.accentLight, color: T.accent, fontSize: 13, fontWeight: 700 }}>Save note</button>
                <button onClick={() => { setShowNoteFor(null); setNoteText(""); }} style={{ padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", border: `1.5px solid ${T.border}`, background: "transparent", color: T.muted, fontSize: 13 }}>Skip</button>
              </div>
            </div>
          )}

          {/* Category picker */}
          {pickingCat && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 10 }}>What are you doing?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {TIME_CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => {
                    setSelectedTags([]);
                    setBackground(null);
                    // Show tag/bg picker inline
                    setPickingCat(cat.id);
                  }} style={{
                    padding: "12px 10px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                    border: `1.5px solid ${pickingCat === cat.id ? cat.color : T.border}`,
                    background: pickingCat === cat.id ? cat.color + "15" : T.surface,
                    color: pickingCat === cat.id ? cat.color : T.text,
                    fontSize: 13, fontWeight: 600, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.icon}</div>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Tag + background picker for selected category */}
              {typeof pickingCat === "string" && pickingCat !== true && (() => {
                const cat = TIME_CATEGORIES.find(c => c.id === pickingCat);
                if (!cat) return null;
                return (
                  <div style={{ background: T.surface, border: `1.5px solid ${cat.color}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: cat.color, marginBottom: 4 }}>{cat.icon} {cat.label}</div>

                    {/* Suggestions */}
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>Ideas to get started:</div>
                    <div style={{ marginBottom: 12 }}>
                      {cat.suggestions.map((s, i) => (
                        <div key={i} style={{ fontSize: 12, color: T.text, padding: "4px 0", borderBottom: `1px solid ${T.border}` }}>{s}</div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>What specifically? (select all that apply)</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                      {cat.tags.map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag)} style={{
                          padding: "5px 10px", borderRadius: 16, cursor: "pointer", fontFamily: "inherit",
                          border: `1.5px solid ${selectedTags.includes(tag) ? cat.color : T.border}`,
                          background: selectedTags.includes(tag) ? cat.color + "15" : T.faint,
                          color: selectedTags.includes(tag) ? cat.color : T.muted,
                          fontSize: 12,
                        }}>{tag}</button>
                      ))}
                    </div>

                    {/* Background */}
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Background audio/visual?</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                      {BACKGROUND_OPTIONS.map(b => (
                        <button key={b.id} onClick={() => setBackground(background === b.id ? null : b.id)} style={{
                          padding: "5px 10px", borderRadius: 16, cursor: "pointer", fontFamily: "inherit",
                          border: `1.5px solid ${background === b.id ? T.yellow : T.border}`,
                          background: background === b.id ? T.yellowLight : T.faint,
                          color: background === b.id ? T.yellow : T.muted,
                          fontSize: 12,
                        }}>{b.label}</button>
                      ))}
                    </div>

                    <button onClick={() => startCategory(cat.id)} style={{
                      width: "100%", padding: "12px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                      border: "none", background: cat.color, color: "#fff",
                      fontSize: 15, fontWeight: 700,
                    }}>▶ Start {cat.label}</button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Switch category button when active */}
          {active && !pickingCat && (
            <button onClick={() => setPickingCat(true)} style={{
              width: "100%", padding: "11px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
              border: `1.5px solid ${T.border}`, background: T.surface,
              color: T.muted, fontSize: 13, marginBottom: 14,
            }}>↕ Switch category</button>
          )}

          {/* Daily summary */}
          {Object.keys(totals).length > 0 && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px", marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 10 }}>Today so far</div>
              {Object.entries(totals).sort((a,b) => b[1]-a[1]).map(([catId, ms]) => {
                const cat = TIME_CATEGORIES.find(c => c.id === catId);
                if (!cat) return null;
                const pct = Math.min(100, Math.round(ms / (8 * 3600000) * 100));
                return (
                  <div key={catId} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, color: T.text }}>{cat.icon} {cat.label}</span>
                      <span style={{ fontSize: 13, color: cat.color, fontWeight: 700 }}>{fmt(ms)}</span>
                    </div>
                    <div style={{ height: 5, background: T.faint, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: cat.color, borderRadius: 3, transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── LOG VIEW ── */}
      {view === "log" && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 10 }}>Today's sessions</div>
          {active && activeCat && (
            <div style={{ background: activeCat.color + "15", border: `1.5px solid ${activeCat.color}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: activeCat.color }}>{activeCat.icon} {activeCat.label} <span style={{ fontSize: 11, fontWeight: 400 }}>— in progress</span></div>
                  {active.tags?.length > 0 && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{active.tags.join(", ")}</div>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: activeCat.color }}>{fmt(elapsed)}</div>
              </div>
            </div>
          )}
          {sessionList.length === 0 && !active && (
            <div style={{ textAlign: "center", padding: "32px 20px", color: T.muted, fontSize: 13, border: "1px dashed " + T.border, borderRadius: 10 }}>
              No sessions yet today. Start tracking on the Tracker tab.
            </div>
          )}
          {sessionList.map(s => {
            const cat = TIME_CATEGORIES.find(c => c.id === s.catId);
            if (!cat) return null;
            const bg = BACKGROUND_OPTIONS.find(b => b.id === s.background);
            return (
              <div key={s.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cat.icon} {cat.label}</div>
                    {s.tags?.length > 0 && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.tags.join(", ")}</div>}
                    {bg && <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>Background: {bg.label}</div>}
                    {s.note && <div style={{ fontSize: 12, color: T.text, marginTop: 4, fontStyle: "italic" }}>"{s.note}"</div>}
                    {showNoteFor === s.id && (
                      <div style={{ marginTop: 8 }}>
                        <textarea
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Add a note..."
                          rows={2}
                          style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.faint, color: T.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 6 }}
                        />
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => saveNote(s.id, noteText)} style={{ flex: 1, padding: "7px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", border: `1.5px solid ${T.accent}`, background: T.accentLight, color: T.accent, fontSize: 12, fontWeight: 700 }}>Save</button>
                          <button onClick={() => { setShowNoteFor(null); setNoteText(""); }} style={{ padding: "7px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", border: `1.5px solid ${T.border}`, background: "transparent", color: T.muted, fontSize: 12 }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", marginLeft: 10, flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: cat.color }}>{fmt(s.duration || 0)}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{new Date(s.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4, justifyContent: "flex-end" }}>
                      <button onClick={() => { setShowNoteFor(s.id); setNoteText(s.note || ""); }} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 5, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${T.border}`, background: "transparent", color: T.muted }}>✏️</button>
                      <button onClick={() => { if (window.confirm("Delete this session?")) deleteSession(s.id); }} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 5, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${T.border}`, background: "transparent", color: T.muted }}>✕</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TimeTrackerTab;
