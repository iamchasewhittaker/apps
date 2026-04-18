import React, { useEffect, useState } from "react";
import { s, CONNECT_SCENARIOS, FOLLOWUP_SCENARIOS, STAR_COMPETENCIES, blankStarStory, normalizeStarStories } from "../constants";
import { MOCK_INTERVIEW_SCENARIOS } from "../mockInterviewQuestions";
import ErrorBoundary from "../ErrorBoundary";
import AIResult from "../components/AIResult";
import {
  buildTailorResumePrompt,
  buildCoverLetterPrompt,
  buildApplyKitPrompt,
  buildLinkedInHeadlinePrompt,
  buildLinkedInAboutPrompt,
  buildKeywordAnalysisPrompt,
  buildConnectMessagePrompt,
  buildFollowupMessagePrompt,
  buildStarDraftPrompt,
  buildWeeklyReviewPrompt,
  JOB_SEARCH_EXTERNAL_LINKS,
} from "../applyPrompts";

async function copyToClipboard(text, showError, okMsg) {
  try {
    await navigator.clipboard.writeText(text);
    if (okMsg) showError(okMsg);
  } catch {
    showError("Could not copy — select text manually.");
  }
}

export default function AITab({
  data, profileComplete,
  kitApp, setKitApp, resumeTab, setResumeTab,
  draftContact, clearDraftContact,
  setTab, saveApp, saveStarStories,
  showError, setProfileModal,
}) {
  const [resumeType, setResumeType] = useState("PM");
  const [jd, setJd] = useState("");
  const [resumeResult, setResumeResult] = useState("");
  const [coverResult, setCoverResult] = useState("");
  const [kitResumeResult, setKitResumeResult] = useState("");
  const [kitCoverResult, setKitCoverResult] = useState("");

  const [jobQuery, setJobQuery] = useState("");

  const [liTab, setLiTab] = useState("profile");
  const [currentHeadline, setCurrentHeadline] = useState("");
  const [currentAbout, setCurrentAbout] = useState("");
  const [liHeadlineResult, setLiHeadlineResult] = useState("");
  const [liAboutResult, setLiAboutResult] = useState("");
  const [keywordText, setKeywordText] = useState("");
  const [keywordResult, setKeywordResult] = useState("");
  const [connectContact, setConnectContact] = useState(null);
  const [connectContext, setConnectContext] = useState("");
  const [followupContact, setFollowupContact] = useState(null);
  const [followupContext, setFollowupContext] = useState("");
  const [stories, setStories] = useState(normalizeStarStories(data.starStories));
  const [storyDraft, setStoryDraft] = useState(blankStarStory());
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [storySource, setStorySource] = useState("");

  useEffect(() => {
    setStories(normalizeStarStories(data.starStories));
  }, [data.starStories]);

  useEffect(() => {
    if (!draftContact) return;
    setResumeTab("linkedin");
    setLiTab("connect");
    setConnectContact(draftContact);
    clearDraftContact();
  }, [draftContact]); // eslint-disable-line react-hooks/exhaustive-deps

  function persistStories(nextStories) {
    const normalized = normalizeStarStories(nextStories);
    setStories(normalized);
    saveStarStories(normalized);
  }

  function saveCurrentStory() {
    const nextStory = {
      ...storyDraft,
      title: storyDraft.title.trim() || "Untitled STAR story",
      competency: storyDraft.competency.trim(),
      situation: storyDraft.situation.trim(),
      task: storyDraft.task.trim(),
      action: storyDraft.action.trim(),
      result: storyDraft.result.trim(),
      takeaway: storyDraft.takeaway.trim(),
    };
    if (!nextStory.situation && !nextStory.action && !nextStory.result) return;

    const nextStories = editingStoryId
      ? stories.map(story => story.id === editingStoryId ? nextStory : story)
      : [nextStory, ...stories];
    persistStories(nextStories);
    setStoryDraft(blankStarStory());
    setEditingStoryId(null);
    setStorySource("");
  }

  function editStory(story) {
    setStoryDraft({ ...story });
    setEditingStoryId(story.id);
    setResumeTab("stories");
  }

  function deleteStory(id) {
    persistStories(stories.filter(story => story.id !== id));
    if (editingStoryId === id) {
      setStoryDraft(blankStarStory());
      setEditingStoryId(null);
    }
  }

  async function copyTailorPrompt() {
    if (!jd.trim() || !data.baseResume.trim()) return;
    const text = buildTailorResumePrompt(resumeType, data, jd);
    await copyToClipboard(text, showError, "Copied tailor prompt — paste into your assistant, then paste the resume back here.");
  }

  async function copyCoverPrompt() {
    if (!jd.trim() || !data.baseResume.trim()) return;
    const text = buildCoverLetterPrompt(data, jd);
    await copyToClipboard(text, showError, "Copied cover letter prompt — paste the letter back here when done.");
  }

  async function copyApplyKitPrompts() {
    const app = kitApp;
    const jobDesc = app?.jobDescription || "";
    if (!app || !jobDesc.trim() || !data.baseResume.trim()) return;
    const text = buildApplyKitPrompt(resumeType, data, app);
    await copyToClipboard(text, showError, "Copied apply kit prompt — includes resume + cover instructions in one paste.");
  }

  async function copyLinkedInPrompts() {
    if (!data.baseResume.trim()) return;
    const h = buildLinkedInHeadlinePrompt(data, currentHeadline);
    const a = buildLinkedInAboutPrompt(data, currentAbout);
    await copyToClipboard(`${h}\n\n---\n\n${a}`, showError, "Copied headline + About prompts (stacked).");
  }

  async function copyKeywordPrompt() {
    if (!keywordText.trim()) return;
    const text = buildKeywordAnalysisPrompt(data, keywordText);
    await copyToClipboard(text, showError, "Copied keyword analysis prompt.");
  }

  async function copyConnectPrompt() {
    if (!connectContact) return;
    const text = buildConnectMessagePrompt(data, connectContact, connectContext);
    await copyToClipboard(text, showError, "Copied connection prompt — paste the short note LinkedIn allows.");
  }

  async function copyFollowupPrompt() {
    if (!followupContact) return;
    const text = buildFollowupMessagePrompt(data, followupContact, followupContext);
    await copyToClipboard(text, showError, "Copied follow-up prompt.");
  }

  async function copyStarDraftPrompt() {
    const source = storySource.trim() || data.profile.topAchievements || data.baseResume || "";
    if (!source) return;
    const text = buildStarDraftPrompt(data, source);
    await copyToClipboard(text, showError, "Copied STAR JSON prompt — paste assistant output into the fields below.");
  }

  return (
    <ErrorBoundary name="Apply Tools">
      <div style={s.content}>
        <div style={{ ...s.tipBox, marginBottom: 16 }}>
          <p><strong>Apply Tools</strong> — no API keys. Use <strong>Copy prompt</strong>, paste into ChatGPT or Claude (or any assistant), then paste results into the text areas below for your records.</p>
        </div>
        {!profileComplete && (
          <div style={s.warnBanner}>
            ⚠️ <strong>Set up your profile first</strong> — prompts use it for personalization.
            <button style={s.warnBtn} onClick={() => setProfileModal(true)}>Set up now →</button>
          </div>
        )}

        <div style={s.resumeTypeRow}>
          <span style={s.resumeTypeLabel}>Resume type:</span>
          {[["PM", "📋 Implementation / PM"], ["AE", "💼 Account Executive"]].map(([type, label]) => (
            <button
              key={type}
              style={{ ...s.resumeTypeBtn, ...(resumeType === type ? s.resumeTypeBtnActive : {}) }}
              onClick={() => setResumeType(type)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={s.subTabs}>
          {[["tailor","📄 Tailor Resume"],["cover","✉️ Cover Letter"],["kit","🚀 Apply Kit"],["jobs","🔍 Find Jobs"],["linkedin","💼 LinkedIn"],["stories","⭐ STAR Bank"],["mock","🎤 Mock Interview"],["weekly","📊 Weekly Review"]].map(([key, label]) => (
            <button key={key} style={{ ...s.subTabBtn, ...(resumeTab === key ? s.subTabBtnActive : {}) }} onClick={() => setResumeTab(key)}>{label}</button>
          ))}
        </div>

        {resumeTab === "tailor" && (
          <div style={s.aiLayout}>
            <div style={s.aiLeft}>
              <div style={s.sectionLabel}>Paste Job Description</div>
              <textarea style={s.textarea} placeholder="Paste the full job description here…" value={jd} onChange={e => setJd(e.target.value)} rows={10} />
              <button
                style={{ ...s.btnPrimary, width: "100%", opacity: (!jd.trim() || !data.baseResume) ? 0.5 : 1 }}
                disabled={!jd.trim() || !data.baseResume}
                onClick={copyTailorPrompt}
              >
                📋 Copy tailor prompt
              </button>
              {!data.baseResume && <div style={s.warnSmall}>⚠️ Add your base resume in Profile first.</div>}
              <div style={s.sectionLabel}>Paste tailored resume (optional)</div>
              <textarea style={s.textarea} placeholder="Paste assistant output here to keep a copy…" value={resumeResult} onChange={e => setResumeResult(e.target.value)} rows={12} />
              {resumeResult && <AIResult label={`Tailored ${resumeType} Resume`} text={resumeResult} />}
            </div>
            <div style={s.aiRight}>
              <div style={s.sectionLabel}>Quick-fill from saved application</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.applications.filter(a => a.jobDescription).map(a => (
                  <button key={a.id} style={s.appToggleChip} onClick={() => setJd(a.jobDescription)}>{a.company} — {a.title}</button>
                ))}
                {data.applications.filter(a => a.jobDescription).length === 0 && <span style={{ color: "#4b5563", fontSize: 12 }}>No saved JDs yet — paste them when adding applications.</span>}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={s.sectionLabel}>PM vs AE prompts</div>
                <div style={s.tipBox}>
                  {resumeType === "PM" ? <>
                    <p>✓ Leads with Authorize.Net merchant onboarding as PM proof</p>
                    <p>✓ Frames your work as project lifecycle management</p>
                  </> : <>
                    <p>✓ Targets consultative, inbound-heavy AE roles</p>
                    <p>✓ Leads with payments expertise and merchant relationships</p>
                  </>}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={s.sectionLabel}>Base Resume</div>
                {data.baseResume
                  ? <pre style={s.baseResumePreview}>{data.baseResume}</pre>
                  : <div style={s.empty}>Add your resume via Profile (top right).</div>}
              </div>
            </div>
          </div>
        )}

        {resumeTab === "cover" && (
          <div style={s.aiLayout}>
            <div style={s.aiLeft}>
              <div style={s.sectionLabel}>Paste Job Description</div>
              <textarea style={s.textarea} placeholder="Paste the full job description here…" value={jd} onChange={e => setJd(e.target.value)} rows={10} />
              <button
                style={{ ...s.btnPrimary, width: "100%", opacity: (!jd.trim() || !data.baseResume) ? 0.5 : 1 }}
                disabled={!jd.trim() || !data.baseResume}
                onClick={copyCoverPrompt}
              >
                📋 Copy cover letter prompt
              </button>
              <div style={s.sectionLabel}>Paste cover letter (optional)</div>
              <textarea style={s.textarea} placeholder="Paste assistant output here…" value={coverResult} onChange={e => setCoverResult(e.target.value)} rows={14} />
              {coverResult && <AIResult label="Cover Letter" text={coverResult} />}
            </div>
            <div style={s.aiRight}>
              <div style={s.sectionLabel}>Quick-fill from saved application</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.applications.filter(a => a.jobDescription).map(a => (
                  <button key={a.id} style={s.appToggleChip} onClick={() => setJd(a.jobDescription)}>{a.company} — {a.title}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {resumeTab === "kit" && (
          <div style={s.kitLayout}>
            <div style={s.sectionLabel}>🚀 Apply Kit — copy one prompt, get resume + cover letter instructions</div>
            <div style={s.sectionLabel}>Select application (must have a saved job description)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {data.applications.filter(a => a.jobDescription).map(a => (
                <button
                  key={a.id}
                  style={{ ...s.appToggleChip, ...(kitApp?.id === a.id ? s.appToggleChipActive : {}) }}
                  onClick={() => { setKitApp(a); setKitResumeResult(""); setKitCoverResult(""); }}
                >
                  {a.company} — {a.title}
                </button>
              ))}
              {data.applications.filter(a => a.jobDescription).length === 0 && (
                <span style={{ color: "#4b5563", fontSize: 12 }}>No applications with saved JDs yet. Add them in the pipeline.</span>
              )}
            </div>
            {kitApp && (
              <div style={s.kitContext}>
                <div>
                  <strong>{kitApp.company}</strong> — {kitApp.title}
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Stage: {kitApp.stage} · Resume type: {resumeType}</div>
                </div>
                <button
                  style={{ ...s.btnPrimary, opacity: !data.baseResume ? 0.5 : 1 }}
                  disabled={!data.baseResume}
                  onClick={copyApplyKitPrompts}
                >
                  📋 Copy apply kit prompt
                </button>
              </div>
            )}
            {!data.baseResume && <div style={s.warnSmall}>⚠️ Add your base resume in Profile first.</div>}
            <div style={s.sectionLabel}>Paste results (optional)</div>
            <div style={s.kitResults}>
              <div style={s.kitResultCol}>
                <textarea style={s.textarea} placeholder="Tailored resume from assistant…" value={kitResumeResult} onChange={e => setKitResumeResult(e.target.value)} rows={14} />
                {kitResumeResult && <AIResult label={`Tailored ${resumeType} Resume`} text={kitResumeResult} />}
              </div>
              <div style={s.kitResultCol}>
                <textarea style={s.textarea} placeholder="Cover letter from assistant…" value={kitCoverResult} onChange={e => setKitCoverResult(e.target.value)} rows={14} />
                {kitCoverResult && <AIResult label="Cover Letter" text={kitCoverResult} />}
              </div>
            </div>
          </div>
        )}

        {resumeTab === "jobs" && (
          <div style={s.jobsLayout}>
            <div style={s.sectionLabel}>Open job search on the web (no in-app search)</div>
            <div style={s.jobSearchRow}>
              <input
                style={{ ...s.input, flex: 1 }}
                value={jobQuery}
                onChange={e => setJobQuery(e.target.value)}
                placeholder="e.g. Implementation Specialist payments fintech remote"
              />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {JOB_SEARCH_EXTERNAL_LINKS.map(({ label, buildUrl }) => (
                <a
                  key={label}
                  href={buildUrl(jobQuery.trim() || "Implementation Specialist fintech payments remote")}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...s.jobLink, textAlign: "center" }}
                >
                  {label} ↗
                </a>
              ))}
            </div>
            <div style={{ ...s.tipBox, marginTop: 12 }}>
              <p>Use LinkedIn, Indeed, or Google in another tab. Save interesting roles with the Pipeline tab or the Chrome extension.</p>
            </div>
          </div>
        )}

        {resumeTab === "linkedin" && (
          <div style={s.liLayout}>
            <div style={s.liSubNav}>
              {[["profile","✍️ Headline & About"],["keywords","🔑 Keywords"],["connect","🤝 Connection Request"],["followup","💬 Follow-up"]].map(([key, label]) => (
                <button key={key} style={{ ...s.liNavBtn, ...(liTab === key ? s.liNavBtnActive : {}) }} onClick={() => setLiTab(key)}>{label}</button>
              ))}
            </div>

            {liTab === "profile" && (
              <div style={s.aiLayout}>
                <div style={s.aiLeft}>
                  <div style={s.sectionLabel}>Current Headline (optional)</div>
                  <input style={s.input} value={currentHeadline} onChange={e => setCurrentHeadline(e.target.value)} placeholder="Your current LinkedIn headline…" />
                  <div style={s.sectionLabel}>Current About Section (optional)</div>
                  <textarea style={s.textarea} rows={5} value={currentAbout} onChange={e => setCurrentAbout(e.target.value)} placeholder="Paste your current About section…" />
                  <button
                    style={{ ...s.btnPrimary, width: "100%", opacity: !data.baseResume ? 0.5 : 1 }}
                    disabled={!data.baseResume}
                    onClick={copyLinkedInPrompts}
                  >
                    📋 Copy headline + About prompts
                  </button>
                  {!data.baseResume && <div style={s.warnSmall}>⚠️ Add your base resume in Profile first.</div>}
                  {liHeadlineResult && (
                    <div>
                      <AIResult label="New Headline" text={liHeadlineResult} />
                      <div style={{ marginTop: 8 }}><AIResult label="New About Section" text={liAboutResult} /></div>
                    </div>
                  )}
                </div>
                <div style={s.aiRight}>
                  <div style={s.sectionLabel}>Paste assistant output below (optional)</div>
                  <textarea style={s.textarea} placeholder="Headline…" value={liHeadlineResult} onChange={e => setLiHeadlineResult(e.target.value)} rows={2} />
                  <textarea style={s.textarea} placeholder="About…" value={liAboutResult} onChange={e => setLiAboutResult(e.target.value)} rows={8} />
                </div>
              </div>
            )}

            {liTab === "keywords" && (
              <div style={s.aiLayout}>
                <div style={s.aiLeft}>
                  <div style={s.sectionLabel}>Paste your current LinkedIn profile text</div>
                  <textarea style={s.textarea} rows={10} value={keywordText} onChange={e => setKeywordText(e.target.value)} placeholder="Paste your headline + about + experience sections here." />
                  <button
                    style={{ ...s.btnPrimary, width: "100%", opacity: !keywordText.trim() ? 0.5 : 1 }}
                    disabled={!keywordText.trim()}
                    onClick={copyKeywordPrompt}
                  >
                    📋 Copy keyword analysis prompt
                  </button>
                  <textarea style={s.textarea} placeholder="Paste analysis here…" value={keywordResult} onChange={e => setKeywordResult(e.target.value)} rows={10} />
                  {keywordResult && <AIResult label="Keyword Analysis" text={keywordResult} />}
                </div>
                <div style={s.aiRight}>
                  <div style={s.sectionLabel}>Key terms for your target roles</div>
                  <div style={s.tipBox}>
                    <p>✓ Implementation, payments, Authorize.Net, merchant onboarding</p>
                    <p>✓ Customer success, consultative selling, B2B fintech</p>
                  </div>
                </div>
              </div>
            )}

            {liTab === "connect" && (
              <div style={s.aiLayout}>
                <div style={s.aiLeft}>
                  <div style={s.sectionLabel}>Who are you connecting with?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {data.contacts.map(c => (
                      <button
                        key={c.id}
                        style={{ ...s.appToggleChip, ...(connectContact?.id === c.id ? s.appToggleChipActive : {}) }}
                        onClick={() => { setConnectContact(c); }}
                      >
                        {c.name} · {c.company}
                      </button>
                    ))}
                  </div>
                  {data.contacts.length === 0 && <div style={s.warnSmall}>Add contacts first in the Contacts tab.</div>}
                  {connectContact && (
                    <div style={s.kitContext}>
                      <div>
                        <strong>{connectContact.name}</strong> · {connectContact.role}
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{connectContact.company}</div>
                      </div>
                    </div>
                  )}
                  <div style={s.sectionLabel}>Scenario</div>
                  <div style={s.scenarioRow}>
                    {CONNECT_SCENARIOS.map(sc => (
                      <button key={sc.label} style={{ ...s.scenarioChip, ...(connectContext === sc.text ? s.scenarioChipActive : {}) }} onClick={() => setConnectContext(sc.text)}>{sc.label}</button>
                    ))}
                  </div>
                  <div style={s.sectionLabel}>Context / Why you&apos;re reaching out</div>
                  <textarea style={s.textarea} rows={2} value={connectContext} onChange={e => setConnectContext(e.target.value)} placeholder="e.g. Saw their post about payments trends…" />
                  <button
                    style={{ ...s.btnPrimary, width: "100%", opacity: !connectContact ? 0.5 : 1 }}
                    disabled={!connectContact}
                    onClick={copyConnectPrompt}
                  >
                    📋 Copy connection prompt
                  </button>
                </div>
                <div style={s.aiRight}>
                  <div style={s.sectionLabel}>Tips</div>
                  <div style={s.tipBox}>
                    <p>✓ Max 300 characters for the LinkedIn note</p>
                    <p>✓ One specific reason you&apos;re connecting</p>
                  </div>
                </div>
              </div>
            )}

            {liTab === "followup" && (
              <div style={s.aiLayout}>
                <div style={s.aiLeft}>
                  <div style={s.sectionLabel}>Who are you following up with?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {data.contacts.map(c => (
                      <button
                        key={c.id}
                        style={{ ...s.appToggleChip, ...(followupContact?.id === c.id ? s.appToggleChipActive : {}) }}
                        onClick={() => { setFollowupContact(c); }}
                      >
                        {c.name} · {c.company}
                      </button>
                    ))}
                  </div>
                  {data.contacts.length === 0 && <div style={s.warnSmall}>Add contacts first in the Contacts tab.</div>}
                  {followupContact && (
                    <div style={s.kitContext}>
                      <div>
                        <strong>{followupContact.name}</strong> · {followupContact.role}
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{followupContact.company}</div>
                      </div>
                    </div>
                  )}
                  <div style={s.sectionLabel}>Scenario</div>
                  <div style={s.scenarioRow}>
                    {FOLLOWUP_SCENARIOS.map(sc => (
                      <button key={sc.label} style={{ ...s.scenarioChip, ...(followupContext === sc.text ? s.scenarioChipActive : {}) }} onClick={() => setFollowupContext(sc.text)}>{sc.label}</button>
                    ))}
                  </div>
                  <div style={s.sectionLabel}>What did you discuss / when did you speak?</div>
                  <textarea style={s.textarea} rows={2} value={followupContext} onChange={e => setFollowupContext(e.target.value)} placeholder="e.g. Had a 15-min call about their implementation team…" />
                  <button
                    style={{ ...s.btnPrimary, width: "100%", opacity: !followupContact ? 0.5 : 1 }}
                    disabled={!followupContact}
                    onClick={copyFollowupPrompt}
                  >
                    📋 Copy follow-up prompt
                  </button>
                </div>
                <div style={s.aiRight}>
                  <div style={s.sectionLabel}>Tips</div>
                  <div style={s.tipBox}>
                    <p>✓ Reference one specific thing from your conversation</p>
                    <p>✓ 2–3 sentences max</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {resumeTab === "stories" && (
          <div style={s.aiLayout}>
            <div style={s.aiLeft}>
              <div style={s.sectionLabel}>STAR Story Bank</div>
              <div style={s.tipBox}>
                <p>Build reusable interview stories by competency.</p>
              </div>

              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  style={s.input}
                  placeholder="Story title (e.g. Resolved complex integration blocker)"
                  value={storyDraft.title}
                  onChange={e => setStoryDraft(d => ({ ...d, title: e.target.value }))}
                />
                <select
                  style={s.input}
                  value={storyDraft.competency}
                  onChange={e => setStoryDraft(d => ({ ...d, competency: e.target.value }))}
                >
                  <option value="">Select competency</option>
                  {STAR_COMPETENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <textarea style={s.textarea} rows={3} placeholder="Situation" value={storyDraft.situation} onChange={e => setStoryDraft(d => ({ ...d, situation: e.target.value }))} />
                <textarea style={s.textarea} rows={2} placeholder="Task" value={storyDraft.task} onChange={e => setStoryDraft(d => ({ ...d, task: e.target.value }))} />
                <textarea style={s.textarea} rows={4} placeholder="Action (what you did)" value={storyDraft.action} onChange={e => setStoryDraft(d => ({ ...d, action: e.target.value }))} />
                <textarea style={s.textarea} rows={3} placeholder="Result (impact, metrics)" value={storyDraft.result} onChange={e => setStoryDraft(d => ({ ...d, result: e.target.value }))} />
                <textarea style={s.textarea} rows={2} placeholder="Takeaway / why this matters for target roles" value={storyDraft.takeaway} onChange={e => setStoryDraft(d => ({ ...d, takeaway: e.target.value }))} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={s.btnPrimary} onClick={saveCurrentStory}>{editingStoryId ? "Update Story" : "Save Story"}</button>
                  {editingStoryId && (
                    <button style={s.btnSecondary} onClick={() => { setStoryDraft(blankStarStory()); setEditingStoryId(null); }}>Cancel Edit</button>
                  )}
                </div>
              </div>
            </div>

            <div style={s.aiRight}>
              <div style={s.sectionLabel}>Copy STAR drafting prompt</div>
              <textarea
                style={s.textarea}
                rows={5}
                value={storySource}
                onChange={e => setStorySource(e.target.value)}
                placeholder="Paste a resume bullet or achievement to draft into STAR format."
              />
              <button
                style={{ ...s.btnPrimary, width: "100%" }}
                onClick={copyStarDraftPrompt}
              >
                📋 Copy STAR JSON prompt
              </button>

              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={s.sectionLabel}>Saved stories ({stories.length})</div>
                {stories.length === 0 && <div style={s.empty}>No STAR stories saved yet.</div>}
                {stories.map(story => (
                  <div key={story.id} style={{ ...s.card, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#f3f4f6" }}>{story.title || "Untitled STAR story"}</div>
                        {story.competency && <div style={{ fontSize: 11, color: "#60a5fa", marginTop: 2 }}>{story.competency}</div>}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={s.actionBtn} onClick={() => editStory(story)}>Edit</button>
                        <button style={s.actionBtnDanger} onClick={() => deleteStory(story.id)}>✕</button>
                      </div>
                    </div>
                    <pre style={{ ...s.resultText, maxHeight: 180, marginTop: 8 }}>
{`Situation: ${story.situation}
Task: ${story.task}
Action: ${story.action}
Result: ${story.result}
Takeaway: ${story.takeaway}`}
                    </pre>
                    <button
                      style={s.copyBtn}
                      onClick={() => navigator.clipboard.writeText(`Situation: ${story.situation}\nTask: ${story.task}\nAction: ${story.action}\nResult: ${story.result}\nTakeaway: ${story.takeaway}`)}
                    >
                      Copy STAR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {resumeTab === "mock" && (
          <MockInterviewPanel showError={showError} />
        )}

        {resumeTab === "weekly" && (
          <WeeklyReviewPanel data={data} showError={showError} />
        )}
      </div>
    </ErrorBoundary>
  );
}

function WeeklyReviewPanel({ data, showError }) {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const isThisWeek = dateStr => dateStr && new Date(dateStr + "T12:00:00") >= weekAgo;

  const apps = data.applications || [];
  const contacts = data.contacts || [];

  const newAppsThisWeek = apps.filter(a => isThisWeek(a.appliedDate));
  const interviewsThisWeek = apps.flatMap(a => (a.interviewLog || []).filter(e => isThisWeek(e.date)));
  const contactsThisWeek = contacts.filter(c => isThisWeek(c.outreachDate) || isThisWeek(c.lastContact));
  const activeStages = ["Phone Screen", "Interview", "Final Round", "Offer"];
  const activeApps = apps.filter(a => activeStages.includes(a.stage));

  const stageCount = {};
  for (const app of apps) stageCount[app.stage] = (stageCount[app.stage] || 0) + 1;

  async function copyPrompt() {
    const text = buildWeeklyReviewPrompt(data);
    try {
      await navigator.clipboard.writeText(text);
      showError("Copied weekly review prompt — paste into ChatGPT or Claude for coaching feedback.");
    } catch {
      showError("Could not copy — select manually.");
    }
  }

  const statCard = (label, value, sub) => (
    <div style={{ background: "#0a0d14", border: "1.5px solid #1f2937", borderRadius: 10, padding: "12px 16px", flex: "1 1 120px", minWidth: 100 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#f3f4f6" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={s.aiLayout}>
      <div style={s.aiLeft}>
        <div style={s.sectionLabel}>This week at a glance</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          {statCard("apps submitted", newAppsThisWeek.length, "this week")}
          {statCard("interviews logged", interviewsThisWeek.length, "debrief entries")}
          {statCard("contacts touched", contactsThisWeek.length, "outreach / follow-up")}
          {statCard("active pipeline", activeApps.length, "phone screen → offer")}
        </div>

        <div style={s.sectionLabel}>Pipeline snapshot</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {Object.entries(stageCount).length === 0
            ? <div style={s.empty}>No applications yet.</div>
            : Object.entries(stageCount).map(([stage, n]) => (
              <div key={stage} style={{ display: "flex", justifyContent: "space-between", background: "#0a0d14", border: "1.5px solid #1f2937", borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontSize: 13, color: "#d1d5db" }}>{stage}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#f3f4f6" }}>{n}</span>
              </div>
            ))}
        </div>

        <button style={{ ...s.btnPrimary, width: "100%" }} onClick={copyPrompt}>
          📋 Copy weekly review prompt
        </button>
        <div style={{ ...s.tipBox, marginTop: 12 }}>
          <p>Paste into ChatGPT or Claude for a coaching review — what moved, what stalled, 3 actions for next week.</p>
        </div>
      </div>

      <div style={s.aiRight}>
        {activeApps.length > 0 && (
          <>
            <div style={s.sectionLabel}>Active roles ({activeApps.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {activeApps.map(a => (
                <div key={a.id} style={{ background: "#0a0d14", border: "1.5px solid #1f2937", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f3f4f6" }}>{a.company}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{a.title} · {a.stage}</div>
                  {a.nextStep && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>→ {a.nextStep}</div>}
                </div>
              ))}
            </div>
          </>
        )}
        {interviewsThisWeek.length > 0 && (
          <>
            <div style={s.sectionLabel}>Debriefs this week ({interviewsThisWeek.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {interviewsThisWeek.map((e, i) => {
                const impColors = { positive: "#10b981", neutral: "#f59e0b", negative: "#ef4444" };
                const col = impColors[e.impression] || "#6b7280";
                return (
                  <div key={i} style={{ background: "#0a0d14", border: `1.5px solid ${col}33`, borderRadius: 8, padding: "8px 12px" }}>
                    <div style={{ fontSize: 12, color: col, fontWeight: 700 }}>{e.roundType} · {e.impression} · {e.confidence}/5</div>
                    {e.gaps && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>△ {e.gaps.slice(0, 80)}{e.gaps.length > 80 ? "…" : ""}</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MockInterviewPanel({ showError }) {
  const [scenarioKey, setScenarioKey] = useState(MOCK_INTERVIEW_SCENARIOS[0].key);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [sessionLog, setSessionLog] = useState([]);

  const scenario = MOCK_INTERVIEW_SCENARIOS.find(s => s.key === scenarioKey) || MOCK_INTERVIEW_SCENARIOS[0];
  const question = scenario.questions[qIndex];
  const isLast = qIndex >= scenario.questions.length - 1;

  function changeScenario(key) {
    setScenarioKey(key);
    setQIndex(0);
    setAnswer("");
  }

  function nextQuestion() {
    if (answer.trim()) {
      setSessionLog(prev => [...prev, { question, answer: answer.trim(), scenario: scenario.label }]);
    }
    setAnswer("");
    setQIndex(i => Math.min(i + 1, scenario.questions.length - 1));
  }

  function restart() {
    setQIndex(0);
    setAnswer("");
    setSessionLog([]);
  }

  async function copyFeedbackPrompt() {
    if (!answer.trim()) return;
    const text = `You are a senior hiring manager coaching a candidate.\n\nQuestion: "${question}"\n\nCandidate answer:\n"${answer.trim()}"\n\nPlease give structured feedback:\n1. What worked well\n2. What was missing or unclear\n3. A suggested improved version (2-3 sentences)\n4. One follow-up question the interviewer might ask`;
    try {
      await navigator.clipboard.writeText(text);
      showError("Copied feedback prompt — paste into ChatGPT or Claude, then paste the feedback back here.");
    } catch {
      showError("Could not copy — select manually.");
    }
  }

  return (
    <div style={s.aiLayout}>
      <div style={s.aiLeft}>
        <div style={s.sectionLabel}>Scenario</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {MOCK_INTERVIEW_SCENARIOS.map(sc => (
            <button
              key={sc.key}
              onClick={() => changeScenario(sc.key)}
              style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                background: scenarioKey === sc.key ? "#1e3a5f" : "#161b27",
                border: `1.5px solid ${scenarioKey === sc.key ? "#3b82f6" : "#1f2937"}`,
                color: scenarioKey === sc.key ? "#3b82f6" : "#6b7280",
              }}
            >{sc.label}</button>
          ))}
        </div>

        <div style={{ background: "#0a0d14", border: "1.5px solid #1f2937", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 6 }}>
            Question {qIndex + 1} of {scenario.questions.length}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#f3f4f6", lineHeight: 1.5 }}>{question}</div>
        </div>

        <div style={s.sectionLabel}>Your answer</div>
        <textarea
          style={{ ...s.textarea, minHeight: 120 }}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer here — or speak aloud, then summarize key points…"
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <button
            style={{ ...s.btnSecondary, opacity: !answer.trim() ? 0.5 : 1 }}
            disabled={!answer.trim()}
            onClick={copyFeedbackPrompt}
          >
            📋 Copy feedback prompt
          </button>
          <button style={s.btnPrimary} onClick={nextQuestion} disabled={isLast && !answer.trim()}>
            {isLast ? "Finish" : "Next question →"}
          </button>
          <button style={s.btnSecondary} onClick={restart}>Restart</button>
        </div>

        <div style={{ ...s.tipBox, marginTop: 14 }}>
          <p>Copy the feedback prompt → paste into ChatGPT or Claude → paste the coach feedback back here as a note.</p>
        </div>
      </div>

      <div style={s.aiRight}>
        <div style={s.sectionLabel}>Session log ({sessionLog.length})</div>
        {sessionLog.length === 0 ? (
          <div style={{ fontSize: 12, color: "#4b5563" }}>Complete a question to see it here. Resets on reload.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sessionLog.map((entry, i) => (
              <div key={i} style={{ background: "#0a0d14", border: "1.5px solid #1f2937", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 4 }}>{entry.scenario} · Q{i + 1}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6, fontStyle: "italic" }}>"{entry.question}"</div>
                <div style={{ fontSize: 12, color: "#d1d5db" }}>{entry.answer}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
