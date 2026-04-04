import React, { useState } from "react";
import { s } from "../constants";

export default function PrepModal({ app, onRun, onClose }) {
  const [prepText, setPrepText] = useState(app.prepNotes || "");
  const [loading, setLoading] = useState(false);
  const [currentApp, setCurrentApp] = useState(app);

  async function generate() {
    setLoading(true);
    setPrepText("");
    await onRun(currentApp, (result, updated) => {
      if (typeof result === "string" && !result.startsWith("Something went wrong")) {
        setPrepText(result);
        setCurrentApp(updated || currentApp);
      } else if (typeof result === "string") {
        setPrepText(result);
      }
    });
    setLoading(false);
  }

  const hasPrep = !!prepText;

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
          {!hasPrep && !loading && (
            <div style={s.tipBox}>
              <p>Generates 5 questions covering: behavioral (STAR), role-specific, company fit, and compensation — with talking points anchored to your Authorize.Net experience.</p>
              {app.jobDescription && <p style={{ color: "#10b981", marginTop: 4 }}>✓ JD is saved — questions will be tailored to this specific role.</p>}
            </div>
          )}
          {loading && (
            <div style={{ textAlign: "center", padding: "32px 20px", color: "#6b7280" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎯</div>
              <div style={{ fontSize: 14 }}>Generating your interview prep…</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>This takes about 15 seconds</div>
            </div>
          )}
          {hasPrep && !loading && (
            <div style={s.resultBox}>
              <div style={s.resultHeader}>
                <span>5 Questions + Talking Points</span>
                <button style={s.copyBtn} onClick={() => navigator.clipboard.writeText(prepText)}>Copy all</button>
              </div>
              <pre style={{ ...s.resultText, maxHeight: 480, fontSize: 13, lineHeight: 1.65 }}>{prepText}</pre>
            </div>
          )}
        </div>
        <div style={s.modalFooter}>
          {hasPrep && (
            <button style={s.btnSecondary} onClick={generate} disabled={loading}>
              {loading ? "Regenerating…" : "↻ Regenerate"}
            </button>
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
