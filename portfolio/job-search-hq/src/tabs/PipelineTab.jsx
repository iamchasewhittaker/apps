import React from "react";
import { s, STAGES, STAGE_COLORS } from "../constants";
import ErrorBoundary from "../ErrorBoundary";
import AppCard from "../components/AppCard";

export default function PipelineTab({ activeApps, archivedApps, contacts, saveApp, setAppModal, setPrepModal, setKitApp, setKitResumeResult, setKitCoverResult, setTab, setResumeTab }) {
  function openKit(app) {
    setKitApp(app);
    setKitResumeResult("");
    setKitCoverResult("");
    setTab("ai");
    setResumeTab("kit");
  }

  return (
    <ErrorBoundary name="Pipeline">
      <div style={s.content}>
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
