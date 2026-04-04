import React, { useState } from "react";
import { s, CHASE_CONTEXT, JOB_SEARCH_QUERIES, API_KEY_STORAGE, callClaude, blankApp } from "../constants";
import ErrorBoundary from "../ErrorBoundary";
import AIResult from "../components/AIResult";

export default function AITab({
  data, apiKey, hasApiKey, profileComplete,
  kitApp, setKitApp, resumeTab, setResumeTab,
  setTab, saveApp,
  showError, setShowApiKeyModal, setProfileModal,
}) {
  const [resumeType, setResumeType] = useState("PM");
  const [jd, setJd] = useState("");
  const [resumeResult, setResumeResult] = useState("");
  const [coverResult, setCoverResult] = useState("");
  const [kitResumeResult, setKitResumeResult] = useState("");
  const [kitCoverResult, setKitCoverResult] = useState("");
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingKit, setLoadingKit] = useState(false);

  const [jobResults, setJobResults] = useState([]);
  const [jobQuery, setJobQuery] = useState("");
  const [searchingJobs, setSearchingJobs] = useState(false);

  const [liTab, setLiTab] = useState("profile");
  const [currentHeadline, setCurrentHeadline] = useState("");
  const [currentAbout, setCurrentAbout] = useState("");
  const [liHeadlineResult, setLiHeadlineResult] = useState("");
  const [liAboutResult, setLiAboutResult] = useState("");
  const [loadingLiProfile, setLoadingLiProfile] = useState(false);
  const [keywordText, setKeywordText] = useState("");
  const [keywordResult, setKeywordResult] = useState("");
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [connectContact, setConnectContact] = useState(null);
  const [connectContext, setConnectContext] = useState("");
  const [connectResult, setConnectResult] = useState("");
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [followupContact, setFollowupContact] = useState(null);
  const [followupContext, setFollowupContext] = useState("");
  const [followupResult, setFollowupResult] = useState("");
  const [loadingFollowup, setLoadingFollowup] = useState(false);

  function profileContext() {
    const p = data.profile;
    return `${CHASE_CONTEXT}\n\nPROFILE DETAILS:\nTarget Roles: ${p.targetRoles}\nTarget Industries: ${p.targetIndustries}\nSalary Target: ${p.salaryTarget}\nTop Achievements: ${p.topAchievements}\nAdditional Context: ${p.notes}`.trim();
  }

  function resumeSystemPrompt(type) {
    const antiAI = `CRITICAL WRITING RULES — these override everything:
- Write like a human wrote it, not an AI. No buzzwords: no "leveraged", "spearheaded", "championed", "orchestrated", "passionate", "results-driven", "dynamic", "innovative", "synergized", "facilitated", "utilized".
- Use plain direct verbs: handled, built, resolved, managed, worked, helped, ran, cut, grew, trained.
- Bullets should read like someone talking about their job, not a LinkedIn headline. Vary sentence length. Some short. Some with more context.
- Keep the voice consistent with the base resume — conversational, specific, grounded. Do not elevate the tone.
- ATS rules: single-column plain text, no tables, no columns, no graphics. Section headers in ALL CAPS. Dates right-aligned (use spaces). No special characters except bullets (•) and pipes (|).
- Output ONLY the resume text. No preamble, no markdown, no commentary.`;
    if (type === "PM") {
      return `You are an expert resume coach helping Chase Whittaker target Implementation Specialist, Customer Success, and Project Manager roles in fintech/payments. ${CHASE_CONTEXT}\n\n${antiAI}\n\nKey framing rules:\n- Lead with his Authorize.Net merchant onboarding work — this IS implementation/PM experience\n- Frame his work as project management: he owned merchant lifecycles from application to live transactions\n- Emphasize: 98% resolution rate, onboarding materials he built, systematic processes, CRM hygiene\n- Include: Google PM Certificate (in progress), Asana, Jira, Linear knowledge\n- Do NOT frame him as a cold-outbound salesperson`;
    }
    return `You are an expert resume coach helping Chase Whittaker target Account Executive roles at inbound-heavy or product-led fintech/payments companies (Stripe, Plaid, Chargebee). ${CHASE_CONTEXT}\n\n${antiAI}\n\nKey framing rules:\n- Target consultative, inbound-heavy AE roles only — NOT pure cold outbound\n- Lead with his payments expertise and merchant relationship skills\n- Emphasize: 10-15% above KPI, inbound pipeline management, consultative selling, technical knowledge\n- Highlight: Authorize.Net product knowledge, CyberSource, fraud prevention\n- Do NOT frame him as a quota-chasing SDR`;
  }

  async function handleClaudeCall(fn, errorSetter) {
    if (!apiKey) { setShowApiKeyModal(true); return; }
    try { await fn(); }
    catch (e) {
      if (e.message === "NO_API_KEY") { setShowApiKeyModal(true); return; }
      if (e.message === "NETWORK_ERROR") {
        showError("Network error — check your connection and try again");
      } else if (e.message === "OVERLOADED") {
        showError("Claude is overloaded right now — wait 30 seconds and try again");
      } else if (e.message === "AUTH_ERROR") {
        localStorage.removeItem(API_KEY_STORAGE);
        setShowApiKeyModal(true);
        showError("API key rejected — please re-enter your key");
      } else {
        showError(e.message || "Something went wrong — check your API key and try again");
        errorSetter?.("Something went wrong. Check your API key in Settings and try again.");
      }
    }
  }

  async function runTailorResume() {
    if (!jd.trim() || !data.baseResume.trim()) return;
    setLoadingResume(true); setResumeResult("");
    await handleClaudeCall(async () => {
      const result = await callClaude(
        resumeSystemPrompt(resumeType),
        `${profileContext()}\n\nBASE RESUME:\n${data.baseResume}\n\nJOB DESCRIPTION:\n${jd}\n\nProduce tailored resume now.`
      );
      setResumeResult(result);
    }, setResumeResult);
    setLoadingResume(false);
  }

  async function runCoverLetter() {
    if (!jd.trim() || !data.baseResume.trim()) return;
    setLoadingCover(true); setCoverResult("");
    await handleClaudeCall(async () => {
      const result = await callClaude(
        `You are an expert cover letter writer for implementation and sales professionals in payments/fintech. ${CHASE_CONTEXT}\n\nWrite a compelling, concise cover letter (3 paragraphs). CRITICAL: Sound like a real human wrote this — not an AI. No buzzwords (leveraged, spearheaded, passionate, results-driven, dynamic). Use plain direct language. Open with a hook about his Authorize.Net implementation results — not 'I am writing to apply'. Be specific, confident, direct. Match the tone of the base resume. Output ONLY the cover letter text.`,
        `${profileContext()}\n\nBASE RESUME:\n${data.baseResume}\n\nJOB DESCRIPTION:\n${jd}\n\nWrite the cover letter now.`
      );
      setCoverResult(result);
    }, setCoverResult);
    setLoadingCover(false);
  }

  async function runApplyKit(app) {
    const jobDesc = app?.jobDescription || "";
    if (!jobDesc.trim() || !data.baseResume.trim()) return;
    setLoadingKit(true); setKitResumeResult(""); setKitCoverResult("");
    await handleClaudeCall(async () => {
      const [resume, cover] = await Promise.all([
        callClaude(resumeSystemPrompt(resumeType), `${profileContext()}\n\nBASE RESUME:\n${data.baseResume}\n\nJOB DESCRIPTION:\n${jobDesc}\n\nTailor now.`),
        callClaude(
          `You are an expert cover letter writer for implementation/fintech roles. ${CHASE_CONTEXT} Write a compelling 3-paragraph cover letter. CRITICAL: Sound like a real human — no buzzwords, no AI-speak. No generic opener. Lead with Authorize.Net implementation results. Use plain direct language. Output ONLY the letter.`,
          `${profileContext()}\n\nBASE RESUME:\n${data.baseResume}\n\nJOB DESCRIPTION:\n${jobDesc}\n\nWrite now.`
        ),
      ]);
      setKitResumeResult(resume);
      setKitCoverResult(cover);
    }, setKitResumeResult);
    setLoadingKit(false);
  }

  async function searchJobs() {
    const q = jobQuery.trim() || "Implementation Specialist fintech payments remote";
    setSearchingJobs(true); setJobResults([]);
    try {
      if (!apiKey) { setShowApiKeyModal(true); setSearchingJobs(false); return; }
      let res;
      try {
        res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            system: `You help Chase Whittaker find implementation, customer success, and inbound AE roles in fintech/payments. Search for remote-friendly roles matching the query. Return results as a JSON array ONLY — no markdown, no preamble, no backticks. Each item: { "title": "", "company": "", "location": "", "url": "", "snippet": "" }. Return 6-8 results max. Prioritize roles at companies like Stripe, Plaid, Sift, Chargebee, Checkout.com and similar.`,
            messages: [{ role: "user", content: `Search for job listings: ${q}. Return JSON array only.` }],
          }),
        });
      } catch {
        showError("Network error — check your connection and try again");
        setSearchingJobs(false);
        return;
      }
      if (res.status === 401) {
        localStorage.removeItem(API_KEY_STORAGE);
        setShowApiKeyModal(true);
        showError("API key rejected — please re-enter your key");
        setSearchingJobs(false);
        return;
      }
      if (res.status === 529) {
        showError("Claude is overloaded right now — wait 30 seconds and try again");
        setSearchingJobs(false);
        return;
      }
      const json = await res.json();
      if (json.error) {
        showError(json.error.message || "Search failed — try again");
        setSearchingJobs(false);
        return;
      }
      const text = json.content?.filter(b => b.type === "text").map(b => b.text).join("") || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      try {
        const parsed = JSON.parse(clean);
        setJobResults(Array.isArray(parsed) ? parsed : []);
      } catch {
        setJobResults([{ title: "Search complete", company: "Results below", location: "", url: "", snippet: clean.slice(0, 400) }]);
      }
    } catch (e) {
      showError(e.message || "Search failed — try again");
      setJobResults([]);
    }
    setSearchingJobs(false);
  }

  async function runLinkedInProfile() {
    if (!data.baseResume.trim()) return;
    setLoadingLiProfile(true); setLiHeadlineResult(""); setLiAboutResult("");
    await handleClaudeCall(async () => {
      const [headline, about] = await Promise.all([
        callClaude(
          `You are a LinkedIn expert for implementation and payments professionals. Write a punchy, keyword-rich LinkedIn headline (under 220 characters). Lead with implementation/payments value. Include: digital payments, Authorize.Net, implementation, open to opportunities. Output ONLY the headline text.`,
          `${profileContext()}\n\nCURRENT HEADLINE: ${currentHeadline || "(none)"}\n\nBASE RESUME:\n${data.baseResume}\n\nWrite the optimized headline now.`
        ),
        callClaude(
          `You are a LinkedIn expert for implementation and payments professionals. Write a compelling LinkedIn About section (1st person, 3 paragraphs, ~250 words). Open with a hook about his Authorize.Net merchant implementation results — not 'I am a sales professional'. Show personality. Reference 98% resolution rate, merchant onboarding, payment gateways. End with a soft CTA about seeking implementation/CS/AE roles. Output ONLY the About section text.`,
          `${profileContext()}\n\nCURRENT ABOUT: ${currentAbout || "(none)"}\n\nBASE RESUME:\n${data.baseResume}\n\nWrite the optimized About section now.`
        ),
      ]);
      setLiHeadlineResult(headline);
      setLiAboutResult(about);
    }, setLiHeadlineResult);
    setLoadingLiProfile(false);
  }

  async function runKeywordOptimizer() {
    if (!keywordText.trim()) return;
    setLoadingKeywords(true); setKeywordResult("");
    await handleClaudeCall(async () => {
      const result = await callClaude(
        `You are a LinkedIn SEO expert for implementation and fintech roles. Analyze the LinkedIn profile text and identify: (1) missing high-value keywords for implementation/CS/payments roles, (2) keywords already present, (3) specific edits to headline and about section. Key terms for Chase's space: implementation specialist, customer success, payment gateway, Authorize.Net, CyberSource, merchant onboarding, fraud prevention, chargeback. Be concrete and actionable.`,
        `${profileContext()}\n\nLINKEDIN PROFILE TEXT TO ANALYZE:\n${keywordText}\n\nProvide keyword analysis now.`
      );
      setKeywordResult(result);
    }, setKeywordResult);
    setLoadingKeywords(false);
  }

  async function runConnectMessage() {
    if (!connectContact) return;
    setLoadingConnect(true); setConnectResult("");
    await handleClaudeCall(async () => {
      const result = await callClaude(
        `You are a LinkedIn messaging expert. Write a short, personalized LinkedIn connection request (under 300 characters — LinkedIn's limit). Sound like a real human. Be specific. No 'I'd love to connect' cliches. Reference Chase's payments background briefly. Output ONLY the message text.`,
        `${profileContext()}\n\nPERSON I'M CONNECTING WITH:\nName: ${connectContact.name}\nRole: ${connectContact.role}\nCompany: ${connectContact.company}\n\nCONTEXT:\n${connectContext || "Cold outreach — exploring implementation/CS roles in their space"}\n\nWrite the connection request now.`
      );
      setConnectResult(result);
    }, setConnectResult);
    setLoadingConnect(false);
  }

  async function runFollowupMessage() {
    if (!followupContact) return;
    setLoadingFollowup(true); setFollowupResult("");
    await handleClaudeCall(async () => {
      const result = await callClaude(
        `You are a LinkedIn messaging expert. Write a warm, professional follow-up message. 2-3 sentences max. Genuine, not salesy. Reference the conversation context. Output ONLY the message text.`,
        `${profileContext()}\n\nPERSON I'M FOLLOWING UP WITH:\nName: ${followupContact.name}\nRole: ${followupContact.role}\nCompany: ${followupContact.company}\n\nCONVERSATION CONTEXT:\n${followupContext || "Had a brief conversation about my job search"}\n\nWrite the follow-up message now.`
      );
      setFollowupResult(result);
    }, setFollowupResult);
    setLoadingFollowup(false);
  }

  return (
    <ErrorBoundary name="AI Tools">
      <div style={s.content}>
        {!hasApiKey && (
          <div style={s.warnBanner}>
            ⚠️ <strong>API key required for AI features.</strong> Add your Anthropic API key to use resume tailoring, cover letters, and LinkedIn tools.
            <button style={s.warnBtn} onClick={() => setShowApiKeyModal(true)}>Add API Key →</button>
          </div>
        )}
        {!profileComplete && (
          <div style={s.warnBanner}>
            ⚠️ <strong>Set up your profile first</strong> — the AI uses it to personalize everything.
            <button style={s.warnBtn} onClick={() => setProfileModal(true)}>Set up now →</button>
          </div>
        )}

        {/* PM / AE Toggle */}
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
          {[["tailor","📄 Tailor Resume"],["cover","✉️ Cover Letter"],["kit","🚀 Apply Kit"],["jobs","🔍 Find Jobs"],["linkedin","💼 LinkedIn"]].map(([key, label]) => (
            <button key={key} style={{ ...s.subTabBtn, ...(resumeTab === key ? s.subTabBtnActive : {}) }} onClick={() => setResumeTab(key)}>{label}</button>
          ))}
        </div>

        {/* TAILOR RESUME */}
        {resumeTab === "tailor" && (
          <div style={s.aiLayout}>
            <div style={s.aiLeft}>
              <div style={s.sectionLabel}>Paste Job Description</div>
              <textarea style={s.textarea} placeholder="Paste the full job description here…" value={jd} onChange={e => setJd(e.target.value)} rows={10} />
              <button
                style={{ ...s.btnPrimary, width: "100%", opacity: (!jd.trim() || !data.baseResume || loadingResume) ? 0.5 : 1 }}
                disabled={!jd.trim() || !data.baseResume || loadingResume}
                onClick={runTailorResume}
              >
                {loadingResume ? "Tailoring…" : `✨ Tailor My ${resumeType} Resume`}
              </button>
              {!data.baseResume && <div style={s.warnSmall}>⚠️ Add your base resume in Profile first.</div>}
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
                <div style={s.sectionLabel}>What the AI does ({resumeType} mode)</div>
                <div style={s.tipBox}>
                  {resumeType === "PM" ? <>
                    <p>✓ Leads with Authorize.Net merchant onboarding as PM proof</p>
                    <p>✓ Frames your work as project lifecycle management</p>
                    <p>✓ Emphasizes 98% resolution rate + onboarding materials</p>
                    <p>✓ Avoids framing you as a cold-outbound SDR</p>
                  </> : <>
                    <p>✓ Targets consultative, inbound-heavy AE roles</p>
                    <p>✓ Leads with payments expertise and merchant relationships</p>
                    <p>✓ Highlights 10–15% KPI overachievement</p>
                    <p>✓ Positions Authorize.Net as customer-facing sales success</p>
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

        {/* COVER LETTER */}
        {resumeTab === "cover" && (
          <div style={s.aiLayout}>
            <div style={s.aiLeft}>
              <div style={s.sectionLabel}>Paste Job Description</div>
              <textarea style={s.textarea} placeholder="Paste the full job description here…" value={jd} onChange={e => setJd(e.target.value)} rows={10} />
              <button
                style={{ ...s.btnPrimary, width: "100%", opacity: (!jd.trim() || !data.baseResume || loadingCover) ? 0.5 : 1 }}
                disabled={!jd.trim() || !data.baseResume || loadingCover}
                onClick={runCoverLetter}
              >
                {loadingCover ? "Writing…" : "✉️ Write Cover Letter"}
              </button>
              {coverResult && <AIResult label="Cover Letter" text={coverResult} />}
            </div>
            <div style={s.aiRight}>
              <div style={s.sectionLabel}>Quick-fill from saved application</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.applications.filter(a => a.jobDescription).map(a => (
                  <button key={a.id} style={s.appToggleChip} onClick={() => setJd(a.jobDescription)}>{a.company} — {a.title}</button>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={s.sectionLabel}>What the AI does</div>
                <div style={s.tipBox}>
                  <p>✓ Opens with your Authorize.Net implementation results — not a generic opener</p>
                  <p>✓ Pulls from your real achievements</p>
                  <p>✓ Matches the company's tone from the JD</p>
                  <p>✓ 3 tight paragraphs, no filler</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPLY KIT */}
        {resumeTab === "kit" && (
          <div style={s.kitLayout}>
            <div style={s.sectionLabel}>🚀 Apply Kit — tailored resume + cover letter in one click</div>
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
                  style={{ ...s.btnPrimary, opacity: (loadingKit || !data.baseResume) ? 0.5 : 1 }}
                  disabled={loadingKit || !data.baseResume}
                  onClick={() => runApplyKit(kitApp)}
                >
                  {loadingKit ? "Generating both…" : "🚀 Generate Apply Kit"}
                </button>
              </div>
            )}
            {!data.baseResume && <div style={s.warnSmall}>⚠️ Add your base resume in Profile first.</div>}
            {(kitResumeResult || kitCoverResult) && (
              <div style={s.kitResults}>
                <div style={s.kitResultCol}><AIResult label={`Tailored ${resumeType} Resume`} text={kitResumeResult} /></div>
                <div style={s.kitResultCol}><AIResult label="Cover Letter" text={kitCoverResult} /></div>
              </div>
            )}
          </div>
        )}

        {/* FIND JOBS */}
        {resumeTab === "jobs" && (
          <div style={s.jobsLayout}>
            <div style={s.sectionLabel}>Find implementation and CS roles matching your background</div>
            <div style={s.jobSearchRow}>
              <input
                style={{ ...s.input, flex: 1 }}
                value={jobQuery}
                onChange={e => setJobQuery(e.target.value)}
                placeholder="e.g. Implementation Specialist payments fintech remote"
                onKeyDown={e => e.key === "Enter" && searchJobs()}
              />
              <button style={{ ...s.btnPrimary, opacity: searchingJobs ? 0.5 : 1 }} disabled={searchingJobs} onClick={searchJobs}>
                {searchingJobs ? "Searching…" : "🔍 Search"}
              </button>
            </div>
            <div style={s.quickSearches}>
              {JOB_SEARCH_QUERIES.map(q => (
                <button key={q} style={s.quickChip} onClick={() => setJobQuery(q)}>{q}</button>
              ))}
            </div>
            {jobResults.length > 0 && (
              <div style={s.jobResultsList}>
                {jobResults.map((job, i) => (
                  <div key={i} style={s.jobResultCard}>
                    <div style={s.jobResultTop}>
                      <div>
                        <div style={s.jobResultTitle}>{job.title}</div>
                        <div style={s.jobResultCompany}>{job.company}{job.location ? ` · ${job.location}` : ""}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        {job.url && <a href={job.url} target="_blank" rel="noreferrer" style={s.jobLink}>Apply ↗</a>}
                        <button style={s.actionBtn} onClick={() => {
                          const app = blankApp();
                          app.company = job.company || "";
                          app.title = job.title || "";
                          app.url = job.url || "";
                          app.notes = job.snippet || "";
                          saveApp(app);
                          setTab("pipeline");
                        }}>+ Pipeline</button>
                      </div>
                    </div>
                    {job.snippet && <div style={s.jobResultSnippet}>{job.snippet}</div>}
                  </div>
                ))}
              </div>
            )}
            {!searchingJobs && jobResults.length === 0 && (
              <div style={s.empty}>Click a quick search or type your own to find relevant roles.</div>
            )}
          </div>
        )}

        {/* LINKEDIN */}
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
                  <textarea style={s.textarea} rows={5} value={currentAbout} onChange={e => setCurrentAbout(e.target.value)} placeholder="Paste your current About section so AI can improve it, or leave blank for a fresh rewrite…" />
                  <button
                    style={{ ...s.btnPrimary, width: "100%", opacity: (!data.baseResume || loadingLiProfile) ? 0.5 : 1 }}
                    disabled={!data.baseResume || loadingLiProfile}
                    onClick={runLinkedInProfile}
                  >
                    {loadingLiProfile ? "Rewriting…" : "✨ Rewrite Headline & About"}
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
                  <div style={s.sectionLabel}>What makes a great LinkedIn for implementation roles</div>
                  <div style={s.tipBox}>
                    <p>✓ Headline: Lead with implementation/payments value, not "SDR"</p>
                    <p>✓ Use: "implementation specialist", "merchant onboarding", "payment gateway", "Authorize.Net"</p>
                    <p>✓ About: Open with your 98% resolution rate or merchant onboarding results</p>
                    <p>✓ First 2 lines show before "see more" — make them count</p>
                    <p>✓ End with: "Open to implementation and customer success roles in fintech"</p>
                  </div>
                </div>
              </div>
            )}

            {liTab === "keywords" && (
              <div style={s.aiLayout}>
                <div style={s.aiLeft}>
                  <div style={s.sectionLabel}>Paste your current LinkedIn profile text</div>
                  <textarea style={s.textarea} rows={10} value={keywordText} onChange={e => setKeywordText(e.target.value)} placeholder="Paste your headline + about + experience sections here." />
                  <button
                    style={{ ...s.btnPrimary, width: "100%", opacity: (!keywordText.trim() || loadingKeywords) ? 0.5 : 1 }}
                    disabled={!keywordText.trim() || loadingKeywords}
                    onClick={runKeywordOptimizer}
                  >
                    {loadingKeywords ? "Analyzing…" : "🔑 Analyze Keywords"}
                  </button>
                  {keywordResult && <AIResult label="Keyword Analysis" text={keywordResult} />}
                </div>
                <div style={s.aiRight}>
                  <div style={s.sectionLabel}>Key terms for your target roles</div>
                  <div style={s.tipBox}>
                    <p>✓ Implementation: "implementation specialist", "merchant onboarding", "go-live support"</p>
                    <p>✓ Payments: "Authorize.Net", "CyberSource", "payment gateway", "fraud prevention"</p>
                    <p>✓ CS: "customer success", "client onboarding", "retention", "technical support"</p>
                    <p>✓ AE: "consultative selling", "inbound sales", "B2B", "fintech"</p>
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
                        onClick={() => { setConnectContact(c); setConnectResult(""); }}
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
                  <div style={s.sectionLabel}>Context / Why you're reaching out</div>
                  <textarea style={s.textarea} rows={3} value={connectContext} onChange={e => setConnectContext(e.target.value)} placeholder="e.g. Saw their post about payments trends, cold outreach exploring implementation roles at their company…" />
                  <button
                    style={{ ...s.btnPrimary, width: "100%", opacity: (!connectContact || loadingConnect) ? 0.5 : 1 }}
                    disabled={!connectContact || loadingConnect}
                    onClick={runConnectMessage}
                  >
                    {loadingConnect ? "Writing…" : "🤝 Write Connection Request"}
                  </button>
                  {connectResult && <AIResult label="Connection Request (copy & paste)" text={connectResult} />}
                </div>
                <div style={s.aiRight}>
                  <div style={s.sectionLabel}>Connection request tips</div>
                  <div style={s.tipBox}>
                    <p>✓ Max 300 characters — LinkedIn's limit</p>
                    <p>✓ One specific reason you're connecting</p>
                    <p>✓ No pitch in the request — just open the door</p>
                    <p>✓ Reference their company or a payments/fintech angle</p>
                    <p>✓ Don't ask for a job — just connect</p>
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
                        onClick={() => { setFollowupContact(c); setFollowupResult(""); }}
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
                  <div style={s.sectionLabel}>What did you discuss / when did you speak?</div>
                  <textarea style={s.textarea} rows={3} value={followupContext} onChange={e => setFollowupContext(e.target.value)} placeholder="e.g. Had a 15-min call about their implementation team, they mentioned they're hiring in Q2…" />
                  <button
                    style={{ ...s.btnPrimary, width: "100%", opacity: (!followupContact || loadingFollowup) ? 0.5 : 1 }}
                    disabled={!followupContact || loadingFollowup}
                    onClick={runFollowupMessage}
                  >
                    {loadingFollowup ? "Writing…" : "💬 Write Follow-up"}
                  </button>
                  {followupResult && <AIResult label="Follow-up Message" text={followupResult} />}
                </div>
                <div style={s.aiRight}>
                  <div style={s.sectionLabel}>Follow-up best practices</div>
                  <div style={s.tipBox}>
                    <p>✓ Send within 24 hours of the conversation</p>
                    <p>✓ Reference one specific thing from your conversation</p>
                    <p>✓ 2–3 sentences max</p>
                    <p>✓ No hard ask — just reinforce the relationship</p>
                    <p>✓ End with an open door, not a deadline</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
