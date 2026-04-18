import React, { useState } from "react";
import { s, STAGES, STAGE_COLORS, blankApp, getOutcomeAnalytics } from "../constants";
import ErrorBoundary from "../ErrorBoundary";
import AppCard from "../components/AppCard";

export default function PipelineTab({ activeApps, archivedApps, contacts, saveApp, setAppModal, setPrepModal, setDebriefModal, setKitApp, setKitResumeResult, setKitCoverResult, setTab, setResumeTab }) {
  const [urlInput, setUrlInput] = useState("");
  const [jdPaste, setJdPaste] = useState("");

  function quickAddFromPaste() {
    const url = urlInput.trim();
    if (!url) return;
    setAppModal({
      mode: "new",
      app: {
        ...blankApp(),
        url,
        jobDescription: jdPaste.trim(),
        stage: "Interested",
      },
    });
    setUrlInput("");
    setJdPaste("");
  }

  function openKit(app) {
    setKitApp(app);
    setKitResumeResult("");
    setKitCoverResult("");
    setTab("ai");
    setResumeTab("kit");
  }

  const outcomes = getOutcomeAnalytics([...(activeApps || []), ...(archivedApps || [])]);

  return (
    <ErrorBoundary name="Pipeline">
      <div style={s.content}>
        <div style={{ ...s.urlPasteBar, flexDirection: "column", alignItems: "stretch", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              style={{ ...s.urlPasteInput, minWidth: 200 }}
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && quickAddFromPaste()}
              placeholder="Job posting URL (required)"
            />
            <button
              style={{ ...s.btnPrimary, opacity: !urlInput.trim() ? 0.5 : 1 }}
              disabled={!urlInput.trim()}
              onClick={quickAddFromPaste}
            >
              + Add application
            </button>
          </div>
          <textarea
            style={{ ...s.textarea, minHeight: 72 }}
            value={jdPaste}
            onChange={e => setJdPaste(e.target.value)}
            placeholder="Optional: paste the full job description here (recommended for Apply Tools + prep). You can also paste it later when editing the card."
          />
        </div>
        <div style={s.stageBar}>
          {STAGES.filter(st => !["Rejected", "Withdrawn"].includes(st)).map(st => {
            const count = activeApps.filter(a => a.stage === st).length;
            return (
              <div key={st} style={s.stagePill}>
                <div style={{ ...s.stageDot, background: STAGE_COLORS[st] }} />
                <span style={s.stagePillLabel}>{st}</span>
                <span style={s.stagePillCount}>{count}</span>
              </div>
            );
          })}
        </div>
        <div style={s.outcomeSection}>
          <div style={s.outcomeHeader}>
            <div style={s.outcomeTitle}>Win/Loss Analytics</div>
            <div style={s.outcomeMeta}>
              {outcomes.total > 0
                ? `${outcomes.total} closed applications`
                : "No closed outcomes yet"}
            </div>
          </div>
          {[
            ["Offer", STAGE_COLORS.Offer],
            ["Rejected", STAGE_COLORS.Rejected],
            ["Withdrawn", STAGE_COLORS.Withdrawn],
          ].map(([label, color]) => {
            const count = outcomes.counts[label];
            const rate = outcomes.rates[label];
            return (
              <div key={label} style={s.outcomeRow}>
                <div style={s.outcomeLabel}>{label}</div>
                <div style={s.outcomeTrack}>
                  <div style={{ ...s.outcomeFill, width: `${rate}%`, background: color }} />
                </div>
                <div style={s.outcomeValue}>{count} ({rate}%)</div>
              </div>
            );
          })}
        </div>
        {activeApps.length === 0 && <div style={s.empty}>No active applications yet. Add your first one — or use the Daily Focus tab to get started.</div>}
        <div style={s.cardGrid}>
          {activeApps
            .sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage))
            .map(app => (
              <AppCard
                key={app.id}
                app={app}
                contacts={contacts}
                onEdit={() => setAppModal({ mode: "edit", app: { ...app } })}
                onStageChange={stage => saveApp({ ...app, stage })}
                onApplyKit={() => openKit(app)}
                onPrep={() => setPrepModal({ app })}
                onDebrief={() => setDebriefModal({ app })}
              />
            ))}
        </div>
        {archivedApps.length > 0 && (
          <details style={s.archiveSection}>
            <summary style={s.archiveSummary}>Archived ({archivedApps.length})</summary>
            <div style={s.cardGrid}>
              {archivedApps.map(app => (
                <AppCard
                  key={app.id} app={app} contacts={contacts}
                  onEdit={() => setAppModal({ mode: "edit", app: { ...app } })}
                  onStageChange={stage => saveApp({ ...app, stage })}
                  onApplyKit={() => openKit(app)}
                  onPrep={() => setPrepModal({ app })}
                  onDebrief={() => setDebriefModal({ app })}
                  archived
                />
              ))}
            </div>
          </details>
        )}
      </div>
    </ErrorBoundary>
  );
}
