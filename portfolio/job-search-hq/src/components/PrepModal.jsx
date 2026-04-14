import React, { useState } from "react";
import { s, PREP_SECTIONS, normalizePrepSections, prepSectionsHasContent, prepSectionsToText } from "../constants";

export default function PrepModal({ app, onRun, onSave, onClose }) {
  const [prepSections, setPrepSections] = useState(normalizePrepSections(app.prepSections, app.prepNotes));
  const [loading, setLoading] = useState(false);
  const [currentApp, setCurrentApp] = useState(app);
  const [errorText, setErrorText] = useState("");

  async function generate() {
    setLoading(true);
    setErrorText("");
    await onRun(currentApp, (result, updated) => {
      if (result && typeof result === "object" && !Array.isArray(result)) {
        const normalized = normalizePrepSections(result, "");
        setPrepSections(normalized);
        setCurrentApp(updated || currentApp);
      } else if (typeof result === "string") {
        setErrorText(result);
      }
    });
    setLoading(false);
  }

  const hasPrep = prepSectionsHasContent(prepSections);
  const hasGeneratedError = !!errorText && errorText.startsWith("Something went wrong");

  function setSection(key, value) {
    setPrepSections(prev => ({ ...prev, [key]: value }));
  }

  function saveSections() {
    const updated = { ...currentApp, prepSections: normalizePrepSections(prepSections, ""), prepNotes: "" };
    onSave(updated);
    setCurrentApp(updated);
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 660 }} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <div>
            <span>🎯 Interview Prep</span>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 400, marginTop: 2 }}>
              {app.company} — {app.title} · {app.stage}
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          {!app.jobDescription && !hasPrep && (
            <div style={s.warnSmall}>⚠️ No JD saved for this application — prep will be based on the role title only. Add a JD in the pipeline card for better results.</div>
          )}
          {!hasPrep && !loading && !hasGeneratedError && (
            <div style={s.tipBox}>
              <p>Generates a structured prep framework with four sections: company research, role analysis, STAR stories, and questions to ask.</p>
              {app.jobDescription && <p style={{ color: "#10b981", marginTop: 4 }}>✓ JD is saved — prep will be tailored to this specific role.</p>}
            </div>
          )}
          {hasGeneratedError && (
            <div style={s.warnSmall}>{errorText}</div>
          )}
          {loading && (
            <div style={{ textAlign: "center", padding: "32px 20px", color: "#6b7280" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎯</div>
              <div style={{ fontSize: 14 }}>Generating your interview prep…</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>This takes about 15 seconds</div>
            </div>
          )}
          {hasPrep && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={s.resultBox}>
                <div style={s.resultHeader}>
                  <span>Structured Interview Prep</span>
                  <button style={s.copyBtn} onClick={() => navigator.clipboard.writeText(prepSectionsToText(prepSections))}>Copy all</button>
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
          )}
        </div>
        <div style={s.modalFooter}>
          {hasPrep && (
            <>
              <button style={s.btnSecondary} onClick={generate} disabled={loading}>
                {loading ? "Regenerating…" : "↻ Regenerate"}
              </button>
              <button style={s.btnPrimary} onClick={saveSections}>Save Sections</button>
            </>
          )}
          <div style={{ flex: 1 }} />
          <button style={s.btnSecondary} onClick={onClose}>Close</button>
          {!hasPrep && (
            <button
              style={{ ...s.btnPrimary, opacity: loading ? 0.5 : 1 }}
              disabled={loading}
              onClick={generate}
            >
              {loading ? "Generating…" : "🎯 Generate Prep"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
