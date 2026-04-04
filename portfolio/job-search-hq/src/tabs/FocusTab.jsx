import React from "react";
import { s, DAILY_BLOCKS } from "../constants";
import ErrorBoundary from "../ErrorBoundary";

export default function FocusTab({ expandedBlock, setExpandedBlock, completedBlocks, setCompletedBlocks, todayDone }) {
  return (
    <ErrorBoundary name="Daily Focus">
      <div style={s.content}>
        <div style={s.focusHeader}>
          <div>
            <div style={s.focusTitle}>Tonight's focus</div>
            <div style={s.focusSub}>Pick ONE block. Set a timer. Do it. That's a successful evening.</div>
          </div>
          <div style={s.focusCount}>
            <div style={s.focusCountNum}>{todayDone}</div>
            <div style={s.focusCountLabel}>done today</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {DAILY_BLOCKS.map(block => {
            const isOpen = expandedBlock === block.id;
            const isDone = completedBlocks[block.id];
            return (
              <div key={block.id} style={{ ...s.focusBlock, ...(isDone ? s.focusBlockDone : {}) }}>
                <div style={s.focusBlockHeader} onClick={() => setExpandedBlock(isOpen ? null : block.id)}>
                  <div style={s.focusBlockLeft}>
                    <span style={{ fontSize: 18 }}>{block.emoji}</span>
                    <div>
                      <div style={s.focusBlockTitle}>{block.title}</div>
                      <div style={s.focusBlockTime}>{block.time}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ ...s.focusTag, background: block.tagColor + "22", color: block.tagColor }}>{block.tag}</span>
                    <span style={{ color: "#6b7280", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={s.focusBlockBody}>
                    <div style={s.focusSteps}>
                      {block.steps.map((step, i) => (
                        <div key={i} style={s.focusStep}>
                          <span style={s.focusStepNum}>{i + 1}</span>
                          <span style={s.focusStepText}>{step}</span>
                        </div>
                      ))}
                    </div>
                    <div style={s.focusAdhdTip}>
                      <span style={{ color: "#f59e0b" }}>⚡ ADHD tip:</span> {block.adhd}
                    </div>
                    <button
                      style={{ ...s.btnPrimary, ...(isDone ? { background: "#14532d" } : {}), marginTop: 12 }}
                      onClick={() => {
                        setCompletedBlocks(prev => ({ ...prev, [block.id]: !isDone }));
                        if (!isDone) setExpandedBlock(null);
                      }}
                    >
                      {isDone ? "✓ Completed — undo" : "Mark done"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={s.weeklyRhythm}>
          <div style={s.sectionLabel}>Weekly rhythm</div>
          {[
            ["Mon", "Research block — 1 company deep dive"],
            ["Tue", "Application block — 1 tailored application"],
            ["Wed", "Skill building — cert or course module"],
            ["Thu", "Networking block — 2 LinkedIn connections"],
            ["Fri", "Follow-up block — check pipeline, send follow-ups"],
            ["Sat", "Optional — only if you have energy"],
            ["Sun", "Weekly review — 15 min in Sunsama only"],
          ].map(([day, task]) => (
            <div key={day} style={s.weekRow}>
              <span style={s.weekDay}>{day}</span>
              <span style={s.weekTask}>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
