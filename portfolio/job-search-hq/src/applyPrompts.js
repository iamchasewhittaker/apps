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

export function buildTailorResumePrompt(resumeType, data, jd) {
  const profile = buildProfileContextBlock(data);
  const pmRules = `Key framing:
- Lead with Authorize.Net merchant onboarding as PM/implementation proof
- Frame work as project lifecycle management; 98% resolution, onboarding materials
- Include Google PM Certificate (in progress), Asana/Jira/Linear
- Do NOT frame as cold-outbound SDR`;
  const aeRules = `Key framing:
- Consultative, inbound-heavy AE roles (Stripe, Plaid, etc.)
- Payments expertise, 10–15% above KPI, Authorize.Net / CyberSource
- Do NOT frame as quota-chasing SDR`;
  const mode = resumeType === "PM" ? `Implementation / PM targeting.\n${pmRules}` : `Account Executive targeting.\n${aeRules}`;
  return `# Tailor resume (${resumeType})

${profile}

${ANTI_AI_RESUME_RULES}

${mode}

BASE RESUME:
${data.baseResume}

JOB DESCRIPTION:
${jd}

Output ONLY the tailored resume text (no preamble).`;
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

Output ONLY the cover letter text.`;
}

export function buildApplyKitPrompt(resumeType, data, app) {
  const jd = app.jobDescription || "";
  const profile = buildProfileContextBlock(data);
  return `# Apply kit — ${app.company} — ${app.title}

${profile}

${ANTI_AI_RESUME_RULES}

## Part 1 — Tailored resume (${resumeType})
${resumeType === "PM"
  ? "Lead with implementation/PM framing (see tailor prompt rules for PM)."
  : "Lead with consultative AE framing (see tailor prompt rules for AE)."}

BASE RESUME:
${data.baseResume}

JOB DESCRIPTION:
${jd}

---

## Part 2 — Cover letter
Same constraints as a standalone cover letter prompt. 3 paragraphs. Human voice.

After both parts, label clearly: === RESUME === and === COVER LETTER ===.`;
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
${context || "Cold outreach — exploring implementation/CS roles in their space"}

Output ONLY the note text.`;
}

export function buildFollowupMessagePrompt(data, contact, context) {
  const profile = buildProfileContextBlock(data);
  return `# LinkedIn follow-up (2–3 sentences)

${profile}

PERSON: ${contact.name} | ${contact.role} at ${contact.company}

CONTEXT:
${context || "Had a brief conversation about my job search"}

Output ONLY the message.`;
}

export function buildStarDraftPrompt(data, source) {
  const profile = buildProfileContextBlock(data);
  return `# STAR story (JSON)

${profile}

SOURCE MATERIAL:
${source}

Return ONLY valid JSON:
{"title":"","competency":"","situation":"","task":"","action":"","result":"","takeaway":""}

Build one interview-ready STAR from the source. Action = longest field. Result = measurable impact.`;
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
No markdown fences.`;
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
