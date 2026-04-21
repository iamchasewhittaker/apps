/**
 * Markdown prompts to copy into ChatGPT, Claude, or another assistant.
 * No in-browser API — HQ stays the system of record.
 */
import { CHASE_CONTEXT, blankPrepSections, PREP_SECTIONS, normalizePrepSections } from "./constants";

export function buildProfileContextBlock(data) {
  const p = data.profile;
  return `${CHASE_CONTEXT}

PROFILE DETAILS:
Target Roles: ${p.targetRoles}
Target Industries: ${p.targetIndustries}
Salary Target: ${p.salaryTarget}
Top Achievements: ${p.topAchievements}
Additional Context: ${p.notes}`.trim();
}

const ANTI_AI_RESUME_RULES = `CRITICAL WRITING RULES:
- Write like a human, not an AI. Avoid buzzwords: leveraged, spearheaded, passionate, results-driven, dynamic, innovative.
- Use plain verbs: handled, built, resolved, managed, worked, helped, ran, cut, grew.
- ATS: single-column plain text, section headers in ALL CAPS, bullets with •`;

// Applied to every drafting prompt so downstream assistants write in Chase's
// voice and default to the Implementation-Consultant / Sales-Engineer frame.
const VOICE_DIRECTION_FOOTER = `
---
VOICE + DIRECTION (use when drafting):
- Frame the candidate for Implementation Consultant / Sales Engineer / Solutions Consultant at payments-adjacent companies (Stripe, Adyen, Checkout.com, Finix, etc.). AE at a payments SaaS is the backup, not the lead.
- Lead with merchant-live implementation wins (Authorize.Net onboarding, 98% integration resolution, SOPs adopted by the team) — not cold-outbound pipeline metrics.
- Write in Chase's voice: warm, direct, no hype. Short sentences.
- NO em-dashes. NO rule-of-threes. NO consultant phrasing ("compounds future optionality", "unlocks growth", "synergy", "leverages"). NO hype words ("amazing", "incredible", "thrilled", "passionate").
- Lean naturally into his 5 strengths — Harmony, Developer, Consistency, Context, Individualization — but don't name-drop "CliftonStrengths." Let the traits show through.
- Gap note (only if the 14-month gap comes up): "After Visa in Feb 2025 I spent 14 months building a portfolio of Next.js + Supabase apps — shipping real product with AI-assisted workflows. I wanted to be credible in technical conversations with merchants and engineers, not just sales conversations." Don't apologize for it.`;

export function buildTailorResumePrompt(resumeType, data, jd) {
  const profile = buildProfileContextBlock(data);
  const icRules = `Key framing:
- Implementation Consultant / Sales Engineer at a payments-adjacent company (Stripe, Adyen, Checkout.com, Finix, NMI, Rainforest Pay, etc.)
- Lead with Authorize.Net merchant-live experience: 98% integration resolution, SOPs adopted by the team, ~200 merchants/month
- Highlight technical troubleshooting, API/webhook comfort, and the 14-month Next.js + Supabase portfolio as proof of staying credible with engineers
- Do NOT frame as cold-outbound SDR or pure AE`;
  const aeRules = `Key framing:
- Consultative, inbound-heavy AE at a payments SaaS (Stripe, Adyen, Checkout.com, Finix)
- Payments expertise, 10–15% above KPI, Authorize.Net / CyberSource
- Do NOT frame as quota-chasing SDR`;
  const pmRules = `Key framing:
- Implementation / PM (legacy framing — prefer IC unless the role is explicitly PM)
- Project lifecycle management, 98% resolution, onboarding materials
- Include Google PM Certificate (in progress), Asana/Jira/Linear`;
  const rulesByType = { IC: icRules, AE: aeRules, PM: pmRules };
  const labelByType = {
    IC: "Implementation Consultant / Sales Engineer targeting.",
    AE: "Account Executive targeting.",
    PM: "Implementation / PM targeting.",
  };
  const mode = `${labelByType[resumeType] || labelByType.IC}\n${rulesByType[resumeType] || icRules}`;
  return `# Tailor resume (${resumeType})

${profile}

${ANTI_AI_RESUME_RULES}

${mode}

BASE RESUME:
${data.baseResume}

JOB DESCRIPTION:
${jd}

Output ONLY the tailored resume text (no preamble).
${VOICE_DIRECTION_FOOTER}`;
}

export function buildCoverLetterPrompt(data, jd) {
  const profile = buildProfileContextBlock(data);
  return `# Cover letter

${profile}

Write a compelling 3-paragraph cover letter. Sound human — no generic opener. Lead with Authorize.Net implementation results. Plain direct language.

BASE RESUME:
${data.baseResume}

JOB DESCRIPTION:
${jd}

Output ONLY the cover letter text.
${VOICE_DIRECTION_FOOTER}`;
}

export function buildApplyKitPrompt(resumeType, data, app) {
  const jd = app.jobDescription || "";
  const profile = buildProfileContextBlock(data);
  return `# Apply kit — ${app.company} — ${app.title}

${profile}

${ANTI_AI_RESUME_RULES}

## Part 1 — Tailored resume (${resumeType})
${resumeType === "PM"
  ? "Lead with implementation/PM framing (legacy — see tailor prompt rules for PM)."
  : resumeType === "AE"
    ? "Lead with consultative AE framing (backup path — see tailor prompt rules for AE)."
    : "Lead with Implementation Consultant / Sales Engineer framing for payments-adjacent companies — merchant-live implementation wins first."}

BASE RESUME:
${data.baseResume}

JOB DESCRIPTION:
${jd}

---

## Part 2 — Cover letter
Same constraints as a standalone cover letter prompt. 3 paragraphs. Human voice.

After both parts, label clearly: === RESUME === and === COVER LETTER ===.
${VOICE_DIRECTION_FOOTER}`;
}

export function buildLinkedInHeadlinePrompt(data, currentHeadline) {
  const profile = buildProfileContextBlock(data);
  return `# LinkedIn headline (under 220 characters)

${profile}

CURRENT HEADLINE: ${currentHeadline || "(none)"}

BASE RESUME:
${data.baseResume}

Output ONLY the headline text. Lead with implementation/payments value.`;
}

export function buildLinkedInAboutPrompt(data, currentAbout) {
  const profile = buildProfileContextBlock(data);
  return `# LinkedIn About (1st person, ~250 words, 3 paragraphs)

${profile}

CURRENT ABOUT: ${currentAbout || "(none)"}

BASE RESUME:
${data.baseResume}

Output ONLY the About section. Open with Authorize.Net merchant implementation hook; reference 98% resolution; end with soft CTA for implementation/CS/AE roles.`;
}

export function buildKeywordAnalysisPrompt(data, keywordText) {
  const profile = buildProfileContextBlock(data);
  return `# LinkedIn keyword analysis

${profile}

PROFILE TEXT:
${keywordText}

List: (1) missing high-value keywords for implementation/CS/payments, (2) keywords present, (3) concrete edits for headline and About. Terms: implementation specialist, customer success, payment gateway, Authorize.Net, CyberSource, merchant onboarding, fraud, chargeback.`;
}

export function buildConnectMessagePrompt(data, contact, context) {
  const profile = buildProfileContextBlock(data);
  return `# LinkedIn connection note (under 300 characters)

${profile}

PERSON: ${contact.name} | ${contact.role} at ${contact.company}

CONTEXT:
${context || "Cold outreach — exploring Implementation / Sales Engineer roles at payments-adjacent companies"}

Output ONLY the note text.
${VOICE_DIRECTION_FOOTER}`;
}

export function buildFollowupMessagePrompt(data, contact, context) {
  const profile = buildProfileContextBlock(data);
  return `# LinkedIn follow-up (2–3 sentences)

${profile}

PERSON: ${contact.name} | ${contact.role} at ${contact.company}

CONTEXT:
${context || "Had a brief conversation about my job search"}

Output ONLY the message.
${VOICE_DIRECTION_FOOTER}`;
}

export function buildStarDraftPrompt(data, source) {
  const profile = buildProfileContextBlock(data);
  return `# STAR story (JSON)

${profile}

SOURCE MATERIAL:
${source}

Return ONLY valid JSON:
{"title":"","competency":"","situation":"","task":"","action":"","result":"","takeaway":""}

Build one interview-ready STAR from the source. Action = longest field. Result = measurable impact.
${VOICE_DIRECTION_FOOTER}`;
}

export function buildInterviewPrepExternalPrompt(data, app) {
  const profile = buildProfileContextBlock(data);
  const jd = app.jobDescription || "";
  return `# Interview prep (structured JSON)

${profile}

ROLE: ${app.company} — ${app.title}
STAGE: ${app.stage}

JOB DESCRIPTION:
${jd || "(none — infer from title + profile)"}

Return ONLY valid JSON with keys: companyResearch, roleAnalysis, starStories, questionsToAsk
- Each field: concise, practical, specific to the role.
- starStories: at least 3 STAR-ready bullets.
- questionsToAsk: at least 5 thoughtful questions for the interviewer.
- Ground in Chase's background (Authorize.Net, integrations, KPIs, payments).
No markdown fences.
${VOICE_DIRECTION_FOOTER}`;
}

export const JOB_SEARCH_EXTERNAL_LINKS = [
  { label: "LinkedIn Jobs", buildUrl: (q) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}` },
  { label: "Indeed", buildUrl: (q) => `https://www.indeed.com/jobs?q=${encodeURIComponent(q)}` },
  { label: "Google", buildUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(q + " jobs remote")}` },
];

/**
 * WHI-24 — stage-specific prep templates (static). Merges into existing sections where those are empty.
 */
export const PREP_STAGE_PRESETS = {
  phone_screen: {
    label: "Phone screen",
    sections: {
      companyResearch: `• What does the company do and who do they sell to?
• Recent news or funding (1–2 bullets)
• Why this company fits your payments/implementation background`,
      roleAnalysis: `• What problems does this role solve day-to-day?
• Technical tools or stack mentioned in the JD
• How your Authorize.Net / onboarding experience maps to their asks
• 2–3 talking points for "why you" in 15 minutes`,
      starStories: `• One story: resolving a tough integration or merchant issue under time pressure
• One story: cross-functional coordination (sales, risk, product)
• Keep each under 90 seconds spoken`,
      questionsToAsk: `• What does success look like in the first 90 days?
• How is the implementation team structured vs CS vs sales?
• What traits do your strongest ICs share?
• Timeline and next steps after this call?`,
    },
  },
  interview: {
    label: "Interview",
    sections: {
      companyResearch: `• Business model, customers, competitors
• Product differentiators and roadmap (public info)
• Culture signals from site, interviews, Glassdoor (light touch)
• How they make money and what "growth" means for this team`,
      roleAnalysis: `• Deep map: JD requirements → your proof points
• Prepare 2 metrics stories (resolution rate, volume, revenue influence)
• Anticipate objections (e.g., lack of traditional PM title) and short reframes
• Role-specific scenarios: implementation crisis, stakeholder conflict`,
      starStories: `• 4–5 full STAR stories across competencies; prioritize from JD
• For each: situation, obstacle, what YOU did, quantified result
• One "failure" or ambiguity story with lesson learned`,
      questionsToAsk: `• Team priorities this quarter vs next year
• Biggest implementation or customer pain today
• How success is measured for this role
• Collaboration model with sales/product/engineering
• Closing: interest in next steps and timeline`,
    },
  },
  final_round: {
    label: "Final round",
    sections: {
      companyResearch: `• Executive priorities and recent earnings/themes (if public)
• Strategic bets: product lines, partnerships, risk/compliance
• Your narrative: why you + why now + why them (tight 60s)
• Any final diligence questions (team, territory, remote policy)`,
      roleAnalysis: `• Executive-level framing: business impact, not only tasks
• Scenarios: executive stakeholder pushback, exec-level communication
• Compensation framing: total picture, flexibility, growth (notes only — not negotiation script)
• Proof of long-term ownership and low drama under pressure`,
      starStories: `• 2–3 "hero" stories with business outcomes
• One story showing judgment when data was incomplete
• One story on influencing without authority
• Optional: customer executive-facing moment`,
      questionsToAsk: `• What would make someone fail in this role in year one?
• How does leadership measure ROI for this function?
• What is the team's biggest risk this year?
• What do you need to see from me to move forward?
• (If appropriate) timeline and decision process`,
    },
  },
};

export function buildWeeklyReviewPrompt(data) {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isThisWeek = dateStr => dateStr && new Date(dateStr + "T12:00:00") >= weekAgo;

  const apps = data.applications || [];
  const contacts = data.contacts || [];

  const stageCount = {};
  for (const app of apps) stageCount[app.stage] = (stageCount[app.stage] || 0) + 1;
  const pipelineLines = Object.entries(stageCount).map(([stage, n]) => `  - ${stage}: ${n}`).join("\n");

  const newAppsThisWeek = apps.filter(a => isThisWeek(a.appliedDate));
  const interviewsThisWeek = apps.flatMap(a => (a.interviewLog || []).filter(e => isThisWeek(e.date)));
  const contactsThisWeek = contacts.filter(c => isThisWeek(c.outreachDate) || isThisWeek(c.lastContact));
  const activeStages = ["Phone Screen", "Interview", "Final Round", "Offer"];
  const activeApps = apps.filter(a => activeStages.includes(a.stage));

  const profileName = data.profile?.name || "Chase";
  const weekLabel = `${fmt(weekAgo)} – ${fmt(now)}`;

  return `# Weekly Job Search Review — ${weekLabel}

You are a job search coach reviewing ${profileName}'s weekly progress. Give:
1. An honest read of the week — what moved, what stalled
2. The #1 bottleneck based on the data
3. 3 specific actions for next week (concrete, not vague)

---

## Pipeline snapshot (total: ${apps.length})
${pipelineLines || "  No applications yet."}

## Active / in-progress (${activeApps.length})
${activeApps.map(a => `  - ${a.company} — ${a.title} (${a.stage})${a.nextStep ? ` | Next: ${a.nextStep}` : ""}`).join("\n") || "  None in active stages."}

## This week (${weekLabel})
- Applications submitted: ${newAppsThisWeek.length}
- Interviews / debrief entries logged: ${interviewsThisWeek.length}
- Contacts outreached or touched: ${contactsThisWeek.length}

## Interview debrief notes (this week)
${interviewsThisWeek.length === 0
  ? "  None this week."
  : interviewsThisWeek.map(e => `  - ${e.roundType} · ${e.impression} · confidence ${e.confidence}/5${e.gaps ? ` | gaps: ${e.gaps.slice(0, 80)}` : ""}`).join("\n")}

## Contacts outreached this week
${contactsThisWeek.map(c => `  - ${c.name} (${c.company}) · ${c.outreachStatus || "no status"}`).join("\n") || "  None logged this week."}

---

Please give a focused coaching review based on this data.`;
}

export function mergePrepStageTemplate(stageId, existingPrep) {
  const preset = PREP_STAGE_PRESETS[stageId];
  if (!preset) return normalizePrepSections(existingPrep, "");
  const cur = normalizePrepSections(existingPrep, "");
  const merged = { ...blankPrepSections() };
  for (const { key } of PREP_SECTIONS) {
    const next = (preset.sections && preset.sections[key]) || "";
    merged[key] = cur[key]?.trim() ? cur[key] : (next || "");
  }
  return merged;
}
