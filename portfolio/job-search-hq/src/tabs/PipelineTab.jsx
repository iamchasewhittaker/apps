import React, { useState } from "react";
import { s, STAGES, STAGE_COLORS, callClaude, blankApp } from "../constants";
import ErrorBoundary from "../ErrorBoundary";
import AppCard from "../components/AppCard";

export default function PipelineTab({ activeApps, archivedApps, contacts, saveApp, setAppModal, setPrepModal, setKitApp, setKitResumeResult, setKitCoverResult, setTab, setResumeTab, apiKey }) {
  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);

  async function parseJobUrl() {
    const url = urlInput.trim();
    if (!url || !apiKey) return;
    setUrlLoading(true);
    try {
      const raw = await callClaude(
        `You are a job posting parser. Extract key details from job posting pages. Return ONLY a JSON object with these fields: title, company, location, jobDescription (full text of the posting, preserve all requirements and responsibilities). If a field is unknown use an empty string.`,
        `Parse this job posting URL and extract the details: ${url}\n\nReturn valid JSON only, no other text.`,
        2000
      );
      let parsed;
      try { parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()); } catch { parsed = {}; }
      setAppModal({ mode: "new", app: { ...blankApp(), url, title: parsed.title || "", company: parsed.company || "", jobDescription: parsed.jobDescription || "" } });
      setUrlInput("");
    } catch {
      setAppModal({ mode: "new", app: { ...blankApp(), url } });
      setUrlInput("");
    }
    setUrlLoading(false);
  }

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
        {apiKey && (
          <div style={s.urlPasteBar}>
            <input
              style={s.urlPasteInput}
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && parseJobUrl()}
              placeholder="Paste a job URL to auto-fill title, company & JD…"
            />
            <button style={{ ...s.btnPrimary, opacity: (!urlInput.trim() || urlLoading) ? 0.5 : 1 }} disabled={!urlInput.trim() || urlLoading} onClick={parseJobUrl}>
              {urlLoading ? "Parsing…" : "Import"}
            </button>
          </div>
        )}
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
