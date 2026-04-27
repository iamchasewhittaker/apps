// Heuristic email classifier — same posture as parseRecruiterEmail in
// constants.js. Regex + sender-domain rules. Accepts the edge-case miss rate.
//
// Returns: { kind, confidence, parsed }
//   kind ∈ "recruiter" | "ats_update" | "interview_invite" | "linkedin" | "other"

import { parseRecruiterEmail } from "../constants";

export const ATS_SENDER_DOMAINS = [
  // Match the @host portion (no subdomain assumption — covers both
  // "noreply@us.greenhouse.io" and "no-reply@hire.lever.co" via .endsWith)
  "greenhouse-mail.io",
  "greenhouse.io",
  "hire.lever.co",
  "lever.co",
  "myworkday.com",
  "workday.com",
  "ashbyhq.com",
  "smartrecruiters.com",
  "jobvite.com",
  "bamboohr.com",
  "workable.com",
  "recruitee.com",
  "rippling.com",
  "icims.com",
  "taleo.net",
  "successfactors.com",
];

export const LINKEDIN_DOMAINS = ["linkedin.com", "e.linkedin.com", "el.linkedin.com"];

export const SCHEDULING_URL_PATTERNS = [
  /calendly\.com/i,
  /goodtime\.io/i,
  /calendar\.x\.ai/i,
  /chilipiper\.com/i,
  /savvycal\.com/i,
  /cal\.com/i,
  /zcal\.co/i,
  /scheduler\.zoom\.us/i,
];

const PERSONAL_PROVIDERS = /(?:gmail|yahoo|outlook|hotmail|icloud|me\.com|proton)\./i;

function domainMatches(domain, list) {
  if (!domain) return false;
  const lower = domain.toLowerCase();
  return list.some(d => lower === d || lower.endsWith("." + d));
}

function plainTextOf(msg) {
  if (msg.bodyText) return msg.bodyText;
  if (msg.bodyHtml) {
    return msg.bodyHtml
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }
  return msg.snippet || "";
}

function classifyAtsSubKind(subject, text) {
  const subj = (subject || "").toLowerCase();
  const body = (text || "").toLowerCase();
  if (/unfortunately|not moving forward|other candidates|decided not to|will not be moving|chosen to move forward with another/i.test(body) || /not moving forward|update on your application/.test(subj)) {
    return { subKind: "auto_reject", suggestedStage: "Rejected" };
  }
  if (/thank you for applying|application received|thanks for applying|we received your application/i.test(subj + " " + body)) {
    return { subKind: "application_received", suggestedStage: "Applied" };
  }
  if (/(assessment|coding challenge|take.?home)/i.test(subj + " " + body)) {
    return { subKind: "assessment", suggestedStage: "Phone Screen" };
  }
  if (/(phone screen|recruiter screen|initial conversation|chat with)/i.test(subj + " " + body)) {
    return { subKind: "next_step", suggestedStage: "Phone Screen" };
  }
  if (/(final round|onsite|on-site|panel interview)/i.test(subj + " " + body)) {
    return { subKind: "next_step", suggestedStage: "Final Round" };
  }
  if (/interview/i.test(subj + " " + body)) {
    return { subKind: "next_step", suggestedStage: "Interview" };
  }
  return { subKind: "update", suggestedStage: null };
}

function classifyLinkedInSubKind(subject) {
  const subj = (subject || "").toLowerCase();
  if (/inmail|sent you a message|messaged you/.test(subj)) return "inmail";
  if (/accepted your invitation|connection accepted/.test(subj)) return "connection_accepted";
  if (/jobs for you|new jobs|recommended jobs|job alert/.test(subj)) return "job_alert";
  if (/viewed your profile/.test(subj)) return "profile_view";
  return "other";
}

// Try to extract the company a recruiter or ATS email is *about* (not the sender).
function extractCompanyFromBody(text) {
  if (!text) return "";
  const m = text.match(/\b(?:at|with|join(?:ing)?|opportunity at)\s+([A-Z][A-Za-z0-9&.\- ]{1,40})/);
  if (m) return m[1].trim().replace(/[.,;:]+$/, "");
  return "";
}

function extractSchedulingUrl(text) {
  if (!text) return "";
  for (const re of SCHEDULING_URL_PATTERNS) {
    const m = text.match(new RegExp(`https?:\\/\\/[^\\s<>)"']*${re.source.replace(/^\/|\/[a-z]*$/g, "")}[^\\s<>)"']*`, "i"));
    if (m) return m[0];
  }
  return "";
}

export function classifyMessage(msg) {
  const subject = msg.subject || "";
  const fromDomain = (msg.from?.domain || "").toLowerCase();
  const fromEmail = (msg.from?.email || "").toLowerCase();
  const text = plainTextOf(msg);
  const headerCT = (msg.headers?.["content-type"] || "").toLowerCase();
  const isCalendar = headerCT.includes("text/calendar");

  // 1) LinkedIn — very confident
  if (domainMatches(fromDomain, LINKEDIN_DOMAINS)) {
    const subKind = classifyLinkedInSubKind(subject);
    return {
      kind: "linkedin",
      confidence: 0.95,
      parsed: { subKind, subject, snippet: msg.snippet || "" },
    };
  }

  // 2) ATS sender — very confident
  if (domainMatches(fromDomain, ATS_SENDER_DOMAINS)) {
    const sub = classifyAtsSubKind(subject, text);
    const company = extractCompanyFromBody(text) || (msg.from?.name || "").replace(/\s*at\s+[\w &]+$/i, "").trim();
    return {
      kind: "ats_update",
      confidence: 0.9,
      parsed: { ...sub, subject, company },
    };
  }

  // 3) Calendar invite — strong signal regardless of sender
  if (isCalendar) {
    const schedulingUrl = extractSchedulingUrl(text);
    return {
      kind: "interview_invite",
      confidence: 0.95,
      parsed: { subject, schedulingUrl, source: "calendar_attachment" },
    };
  }

  // 4) Subject + scheduling URL → interview invite
  const subjLower = subject.toLowerCase();
  const subjectInterview = /(interview|schedule|availability|time to chat|meeting|chat (with|about))/i.test(subjLower);
  const schedulingUrl = extractSchedulingUrl(text);
  if (subjectInterview && schedulingUrl) {
    return {
      kind: "interview_invite",
      confidence: 0.85,
      parsed: { subject, schedulingUrl, source: "scheduling_link" },
    };
  }

  // 5) Recruiter outreach — reuse existing parseRecruiterEmail
  if (fromEmail && !PERSONAL_PROVIDERS.test(fromEmail)) {
    const synthetic = `From: "${msg.from?.name || ""}" <${fromEmail}>\nSubject: ${subject}\n\n${text}`;
    const parsed = parseRecruiterEmail(synthetic);
    const filledFields = ["name", "email", "company", "role"].filter(k => !!parsed[k]).length;
    if (filledFields >= 3) {
      return {
        kind: "recruiter",
        confidence: 0.6 + Math.min(0.3, (filledFields - 3) * 0.1),
        parsed: { ...parsed, subject },
      };
    }
  }

  return {
    kind: "other",
    confidence: 0,
    parsed: { subject, snippet: msg.snippet || "" },
  };
}
