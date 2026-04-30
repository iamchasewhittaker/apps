import React, { useState, useEffect } from "react";
import {
  s,
  PREP_SECTIONS,
  normalizePrepSections,
  prepSectionsHasContent,
  prepSectionsToText,
} from "../constants";
import { T } from "../tokens";
import {
  PREP_STAGE_PRESETS,
  mergePrepStageTemplate,
  buildInterviewPrepExternalPrompt,
} from "../applyPrompts";

export default function PrepModal({ app, data, onSave, onClose, showError }) {
  const [prepSections, setPrepSections] = useState(normalizePrepSections(app.prepSections, app.prepNotes));
  const [currentApp, setCurrentApp] = useState(app);
  const [stageKey, setStageKey] = useState(app.prepStageKey || "");

  useEffect(() => {
    setPrepSections(normalizePrepSections(app.prepSections, app.prepNotes));
    setCurrentApp(app);
    setStageKey(app.prepStageKey || "");
  }, [app]);

  function setSection(key, value) {
    setPrepSections(prev => ({ ...prev, [key]: value }));
  }

  function saveSections() {
    const updated = {
      ...currentApp,
      prepSections: normalizePrepSections(prepSections, ""),
      prepNotes: "",
      prepStageKey: stageKey || "",
    };
    onSave(updated);
    setCurrentApp(updated);
  }

  function applyStageTemplate() {
    if (!stageKey || !PREP_STAGE_PRESETS[stageKey]) {
      showError?.("Pick a stage first (Phone screen, Interview, or Final round).");
      return;
    }
    const merged = mergePrepStageTemplate(stageKey, prepSections);
    setPrepSections(merged);
  }

  async function copyExternalBrief() {
    const md = buildInterviewPrepExternalPrompt(data, currentApp);
    try {
      await navigator.clipboard.writeText(md);
      showError?.("Copied prep brief — paste into ChatGPT, Claude, or your assistant. Paste JSON or prose back into the sections below.");
    } catch {
      showError?.("Could not copy — select text manually.");
    }
  }

  const hasPrep = prepSectionsHasContent(prepSections);

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 660 }} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <div>
            <span>🎯 Interview Prep</span>
            <div style={{ fontSize: 14, color: T.muted, fontWeight: 400, marginTop: 2 }}>
              {app.company} — {app.title} · {app.stage}
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          {!app.jobDescription && !hasPrep && (
            <div style={s.warnSmall}>⚠️ No JD saved — add one on the pipeline card for stronger prompts and notes.</div>
          )}
          <div style={s.tipBox}>
            <p><strong>No in-app AI.</strong> Use stage templates below, edit in place, and/or copy an external brief for ChatGPT or Claude in another tab.</p>
            {app.jobDescription && <p style={{ color: T.success, marginTop: 4 }}>✓ JD is saved — prompts include it.</p>}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span style={s.sectionLabel}>Stage template (WHI-24)</span>
            <select
              style={{ ...s.input, maxWidth: 220 }}
              value={stageKey}
              onChange={e => setStageKey(e.target.value)}
            >
              <option value="">Select stage…</option>
              {Object.entries(PREP_STAGE_PRESETS).map(([id, { label }]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            <button type="button" style={s.btnSecondary} onClick={applyStageTemplate} disabled={!stageKey}>
              Fill empty fields from template
            </button>
            <button type="button" style={s.btnSecondary} onClick={() => copyExternalBrief()}>
              Copy external prep brief
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={s.resultBox}>
              <div style={s.resultHeader}>
                <span>Structured interview prep</span>
                {hasPrep && (
                  <button style={s.copyBtn} onClick={() => navigator.clipboard.writeText(prepSectionsToText(prepSections))}>Copy all</button>
                )}
              </div>
            </div>
            {PREP_SECTIONS.map(section => (
              <div key={section.key} style={s.fieldGroup}>
                <label style={s.fieldLabel}>{section.label}</label>
                <textarea
                  style={{ ...s.textarea, minHeight: 90 }}
                  value={prepSections[section.key] || ""}
                  onChange={e => setSection(section.key, e.target.value)}
                  placeholder={`Add ${section.label.toLowerCase()} notes...`}
                />
              </div>
            ))}
          </div>
        </div>
        <div style={s.modalFooter}>
          <button style={s.btnPrimary} onClick={() => { saveSections(); onClose(); }}>Save & close</button>
          <button style={s.btnSecondary} onClick={saveSections}>Save sections</button>
          <div style={{ flex: 1 }} />
          <button style={s.btnSecondary} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
