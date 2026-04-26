import React, { useEffect, useMemo, useState } from "react";
import { s, today, DAILY_MINIMUMS } from "../constants";
import { buildTailorResumePrompt, buildCoverLetterPrompt } from "../applyPrompts";

// Single-screen guided modal that walks one Interested app through 7 steps to Applied.
// Triggered from TodaysQueue (Option A) so daily flow never leaves the Focus tab.
const STEPS = [
  { num: 1, label: "Confirm" },
  { num: 2, label: "Job description" },
  { num: 3, label: "Tailor resume" },
  { num: 4, label: "Cover letter" },
  { num: 5, label: "Apply" },
  { num: 6, label: "Log + follow-up" },
  { num: 7, label: "Next" },
];

function buildNextQueue(applications, currentId) {
  return (applications || [])
    .filter(a => a.stage === "Interested" && a.id !== currentId)
    .sort((a, b) => {
      const aJd = a.jobDescription ? 1 : 0;
      const bJd = b.jobDescription ? 1 : 0;
      if (bJd !== aJd) return bJd - aJd;
      return (a.id || "").localeCompare(b.id || "");
    });
}

export default function ApplyWizardModal({
  app: initialApp,
  data,
  applications,
  saveApp,
  addDailyAction,
  onClose,
  showError,
}) {
  const [app, setApp] = useState(initialApp);
  const [step, setStep] = useState(1);
  const [jdDraft, setJdDraft] = useState(initialApp?.jobDescription || "");
  const [tailorCopied, setTailorCopied] = useState(false);
  const [coverCopied, setCoverCopied] = useState(false);
  const [resumeType] = useState("IC"); // primary lane per Confidence Bedrock

  const todayStr = today();
  const todayApps = (data.dailyActions || []).filter(a => a.date === todayStr && a.type === "application").length;
  const target = DAILY_MINIMUMS.applications;

  const nextQueue = useMemo(() => buildNextQueue(applications, app?.id), [applications, app?.id]);

  useEffect(() => {
    setApp(initialApp);
    setJdDraft(initialApp?.jobDescription || "");
    setStep(1);
    setTailorCopied(false);
    setCoverCopied(false);
  }, [initialApp?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!app) return null;

  const progressPct = Math.round((step / STEPS.length) * 100);
  const stepMeta = STEPS[step - 1];

  async function copy(text, setter) {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2200);
    } catch {
      showError?.("Could not copy — select the text above and copy manually.");
    }
  }

  function saveJdAndAdvance() {
    const next = { ...app, jobDescription: jdDraft };
    setApp(next);
    saveApp(next);
    setStep(3);
  }

  function markApplied() {
    const sevenDaysOut = (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().slice(0, 10);
    })();
    const nextApp = {
      ...app,
      stage: "Applied",
      appliedDate: todayStr,
      nextStep: app.nextStep || "Follow up",
      nextStepType: app.nextStepType || "follow_up",
      nextStepDate: app.nextStepDate || sevenDaysOut,
    };
    setApp(nextApp);
    saveApp(nextApp);
    addDailyAction("application", `Applied to ${nextApp.company || "role"}`);
    setStep(7);
  }

  function pickNext() {
    const nextApp = nextQueue[0];
    if (!nextApp) {
      onClose();
      return;
    }
    setApp(nextApp);
    setJdDraft(nextApp.jobDescription || "");
    setStep(1);
    setTailorCopied(false);
    setCoverCopied(false);
  }

  return (
    <div style={s.overlay}>
      <div style={s.wizModal}>
        <div style={s.modalHeader}>
          <div>
            <div>🚀 Apply Wizard</div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400, marginTop: 2 }}>
              {app.company || "(no company)"} · {app.title || "(no title)"}
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.wizStepLabel}>
          Step {step} of {STEPS.length} — {stepMeta.label}
        </div>
        <div style={s.wizProgressTrack}>
          <div style={{ ...s.wizProgressFill, width: `${progressPct}%` }} />
        </div>

        <div style={s.wizBody}>
          {step === 1 && (
            <>
              <div style={s.wizPrompt}>
                Walking <strong style={{ color: "#f3f4f6" }}>{app.company || "this app"}</strong> from
                Interested to Applied. Should take 8–12 minutes if you have the JD ready.
              </div>
              <div style={{ background: "#0a0d14", border: "1px solid #1f2937", borderRadius: 8, padding: 12, fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>
                <div><strong style={{ color: "#f3f4f6" }}>Company:</strong> {app.company || "—"}</div>
                <div><strong style={{ color: "#f3f4f6" }}>Title:</strong> {app.title || "—"}</div>
                {app.url && (
                  <div style={{ marginTop: 4 }}>
                    <strong style={{ color: "#f3f4f6" }}>URL:</strong>{" "}
                    <a href={app.url} target="_blank" rel="noopener noreferrer" style={s.link}>{app.url}</a>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={s.wizPrompt}>
                Paste the job description so the tailor and cover prompts have something to work with.
                Skip allowed — but the tailor result will be generic without it.
              </div>
              <textarea
                value={jdDraft}
                onChange={e => setJdDraft(e.target.value)}
                placeholder="Paste the JD here…"
                style={{ ...s.textarea, minHeight: 220 }}
              />
            </>
          )}

          {step === 3 && (
            <>
              <div style={s.wizPrompt}>
                Copy the tailor-resume prompt, paste into ChatGPT or Claude, then save the result.
                Voice + direction footer is already baked in.
              </div>
              <button
                onClick={() => copy(buildTailorResumePrompt(resumeType, data, jdDraft), setTailorCopied)}
                style={tailorCopied ? s.wizCtaCopied : s.wizCta}
              >
                {tailorCopied ? "✓ Copied — paste into ChatGPT or Claude" : "📋 Copy tailor-resume prompt"}
              </button>
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
                Resume type: <strong style={{ color: "#9ca3af" }}>{resumeType}</strong> (primary).
                Edit the type later from Apply Tools if you need AE or PM framing.
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div style={s.wizPrompt}>
                Cover letter prompt — same flow. Copy, paste, generate.
              </div>
              <button
                onClick={() => copy(buildCoverLetterPrompt(data, jdDraft), setCoverCopied)}
                style={coverCopied ? s.wizCtaCopied : s.wizCta}
              >
                {coverCopied ? "✓ Copied — paste into ChatGPT or Claude" : "📋 Copy cover-letter prompt"}
              </button>
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
                The prompt enforces 3 paragraphs, plain language, Authorize.Net leading.
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div style={s.wizPrompt}>
                Open the apply URL, paste the tailored resume + cover letter, and submit.
                Come back here when it's in.
              </div>
              {app.url ? (
                <button
                  onClick={() => window.open(app.url, "_blank", "noopener,noreferrer")}
                  style={s.wizCta}
                >
                  🔗 Open apply URL
                </button>
              ) : (
                <div style={{ background: "#1c1a0a", border: "1px solid #78350f", borderRadius: 8, padding: 12, fontSize: 12, color: "#fbbf24" }}>
                  No URL on this app. Apply on the company's career site, then come back.
                </div>
              )}
              <button onClick={markApplied} style={{ ...s.wizCta, background: "#14532d" }}>
                ✓ I submitted — mark Applied
              </button>
            </>
          )}

          {step === 6 && (
            <div style={s.wizDoneBadge}>
              Logged. Stage advanced to Applied, follow-up scheduled in 7 days.
            </div>
          )}

          {step === 7 && (
            <>
              <div style={s.wizDoneBadge}>
                ✅ {app.company} — Applied. Today: <strong>{todayApps}/{target}</strong> applications.
                {todayApps >= target && " Daily floor met."}
              </div>
              {nextQueue.length > 0 ? (
                <>
                  <div style={s.wizPrompt}>
                    Next in queue: <strong style={{ color: "#f3f4f6" }}>{nextQueue[0].company}</strong>
                    {" — "}{nextQueue[0].title || "(no title)"}.
                    {nextQueue[0].jobDescription
                      ? <span style={{ color: "#10b981" }}> JD ready ✓</span>
                      : <span style={{ color: "#6b7280" }}> No JD yet</span>}
                  </div>
                  <button onClick={pickNext} style={s.wizCta}>
                    → Apply to {nextQueue[0].company}
                  </button>
                </>
              ) : (
                <div style={s.wizPrompt}>
                  Queue empty. Add more roles via Discovery Sprint or the Pipeline tab.
                </div>
              )}
            </>
          )}
        </div>

        <div style={s.wizFooter}>
          <button onClick={onClose} style={s.wizSecondary}>
            {step === 7 ? "Done for today" : "Close"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={s.wizCounter}>{todayApps}/{target} today</span>
            {step > 1 && step < 7 && (
              <button onClick={() => setStep(step - 1)} style={s.wizSecondary}>← Back</button>
            )}
            {step === 1 && (
              <button onClick={() => setStep(2)} style={s.wizCta}>This one ✓</button>
            )}
            {step === 2 && (
              <button onClick={saveJdAndAdvance} style={s.wizCta}>
                {jdDraft.trim() ? "Save JD →" : "Skip →"}
              </button>
            )}
            {step === 3 && (
              <button onClick={() => setStep(4)} style={s.wizCta}>Next →</button>
            )}
            {step === 4 && (
              <button onClick={() => setStep(5)} style={s.wizCta}>Next →</button>
            )}
            {step === 6 && (
              <button onClick={() => setStep(7)} style={s.wizCta}>Next →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
