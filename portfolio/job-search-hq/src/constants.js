// ── STORAGE ─────────────────────────────────────────────────────────────────
export const STORAGE_KEY = "chase_job_search_v1";
export const API_KEY_STORAGE = "chase_anthropic_key";
export const BACKUP_FOLDER_KEY = "chase_job_search_backup_folder";

// ── BACKUP / RESTORE ─────────────────────────────────────────────────────────
const getBackupBlob = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : {};
  return new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
};
const getBackupFilename = () =>
  `job-search-backup-${new Date().toISOString().slice(0, 10)}.json`;
const fallbackDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};
export const backupData = async () => {
  const blob = getBackupBlob();
  const filename = getBackupFilename();
  if (window.showDirectoryPicker) {
    try {
      let dirHandle = null;
      try {
        const stored = localStorage.getItem(BACKUP_FOLDER_KEY);
        if (stored) dirHandle = JSON.parse(stored);
      } catch {}
      if (!dirHandle) {
        dirHandle = await window.showDirectoryPicker({ id: "job-search-backups", mode: "readwrite", startIn: "documents" });
        try { localStorage.setItem(BACKUP_FOLDER_KEY, JSON.stringify(dirHandle)); } catch {}
      }
      const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      alert(`✅ Backup saved:\n${filename}`);
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  fallbackDownload(blob, filename);
};

export const restoreData = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.applications || !Array.isArray(parsed.applications)) {
        alert("Invalid backup file — must contain an applications list.");
        return;
      }
      if (!window.confirm("Restore from this backup? Your current data will be replaced.")) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      window.location.reload();
    } catch {
      alert("Could not read backup file. Make sure it's a valid JSON backup.");
    }
  };
  input.click();
};

// ── PIPELINE ──────────────────────────────────────────────────────────────────
export const STAGES = ["Interested", "Applied", "Phone Screen", "Interview", "Final Round", "Offer", "Rejected", "Withdrawn"];
export const STAGE_COLORS = {
  "Interested": "#6b7280", "Applied": "#3b82f6", "Phone Screen": "#8b5cf6",
  "Interview": "#f59e0b", "Final Round": "#10b981", "Offer": "#22c55e",
  "Rejected": "#ef4444", "Withdrawn": "#9ca3af",
};

// ── CONTACT TYPES & OUTREACH STATUSES ────────────────────────────────────────
export const CONTACT_TYPES = [
  { value: "hiring_manager", label: "Hiring Manager", color: "#3b82f6" },
  { value: "recruiter",      label: "Recruiter",       color: "#8b5cf6" },
  { value: "alumni",         label: "Alumni",          color: "#10b981" },
  { value: "other",          label: "Other",           color: "#6b7280" },
];
export const OUTREACH_STATUSES = [
  { value: "none",       label: "No Outreach", color: "#4b5563" },
  { value: "sent",       label: "Sent",        color: "#f59e0b" },
  { value: "replied",    label: "Replied",     color: "#3b82f6" },
  { value: "meeting",    label: "Meeting",     color: "#10b981" },
  { value: "intro_made", label: "Intro Made",  color: "#8b5cf6" },
];

// ── JOB SEARCH ────────────────────────────────────────────────────────────────
export const JOB_SEARCH_QUERIES = [
  "Implementation Specialist fintech payments remote",
  "Customer Success Manager payments platform remote",
  "Account Executive inbound fintech payments",
  "Merchant Success Manager payment gateway remote",
  "Implementation Consultant SaaS fintech remote",
];

// ── AI CONTEXT ────────────────────────────────────────────────────────────────
export const CHASE_CONTEXT = `CANDIDATE BACKGROUND (always use this):
Name: Chase Whittaker
Location: Vineyard, UT — remote only (cannot drive due to vision impairment)
Salary Target: $75,000–$95,000
Years Experience: 6+ years in digital payments

STRONGEST EXPERIENCE — always lead with this:
- Authorize.Net SMB Inside Sales (Feb 2019–Aug 2023): Inbound leads only. Guided merchants end-to-end from application through live transaction processing. 98% integration issue resolution rate. Built onboarding materials. Exceeded KPIs 10–15% consistently. This is his proof point for implementation roles.
- CyberSource Enterprise SDR (Aug 2023–Feb 2025): Outbound prospecting. Struggled with cold outreach and quota. Do NOT frame him back into a pure outbound SDR role.
- Select Bankcard (2016–2018): Dispute/chargeback specialist and underwriting. Deep fraud and risk knowledge.

KEY SKILLS: Payment gateways (Authorize.Net, CyberSource/Visa), fraud prevention, chargeback management, merchant onboarding, CRM hygiene (Salesforce, Microsoft Dynamics), systematic documentation, cross-team collaboration, inbound sales.

AVOID: Do not frame Chase as a cold-outbound SDR or pure quota-driven salesperson. He excels at implementation, merchant support, and inbound/consultative roles.`;

// ── RESUME TEMPLATES ──────────────────────────────────────────────────────────
export const RESUME_TEMPLATE_PM = `CHASE WHITTAKER
chase.t.whittaker@gmail.com  |  801-960-0082  |  Vineyard, UT (Remote)  |  linkedin.com/in/chase-whittaker

[TARGET ROLE]  |  [TARGET COMPANY]

SUMMARY
Payments professional with 6+ years helping merchants get up and running on Authorize.Net and CyberSource. My work has always been implementation-focused — guiding people through the process, troubleshooting integrations, and making sure everything works before closing out an account. I'm organized, good at managing a lot of moving pieces at once, and I enjoy the problem-solving side of onboarding.

SKILLS
Implementation: Merchant onboarding, go-live support, integration troubleshooting, client lifecycle management
Project Skills: Process documentation, SOP development, milestone tracking, cross-team coordination
Payments: Authorize.Net, CyberSource/Visa, fraud prevention, chargeback management, transaction flows
Tools: Salesforce, Microsoft Dynamics, Asana, Linear, Jira, Microsoft Teams

EXPERIENCE

Inside Sales Representative – SMB | Visa Inc. — Authorize.Net    Feb 2019 – Aug 2023
- Onboarded ~200 merchants per month — handled the full process from application through first live transaction
- Resolved 98% of integration issues directly, troubleshooting with merchants over the phone and coordinating internally when needed
- Managed ~100 calls a day while keeping multiple active onboardings moving at different stages
- Built onboarding docs and process guides that reduced repeat questions and helped new team members ramp faster
- Worked both independently on SMB accounts and alongside account executives on larger deals up to $100K
- Exceeded KPI targets by 10–15% consistently across four-plus years

Enterprise SDR – Implementation Liaison | Visa Inc. — CyberSource    Aug 2023 – Feb 2025
- Managed ~50 enterprise accounts simultaneously, keeping engagements on track and handoffs clean
- Built prospect engagement workflows the team adopted — improved consistency and reduced dropped follow-ups
- Served as the go-between for prospects and AEs throughout the sales cycle
- Kept CRM data current and accurate in both Salesforce and Microsoft Dynamics

Dispute & Support Specialist | Select Bankcard    Jan 2018 – Oct 2018
- Resolved 50–100 chargeback cases per week across Visa, Mastercard, Discover, and Amex
- Identified recurring dispute patterns and shared recommendations with merchants to reduce future losses

Underwriting Specialist | Select Bankcard    Jun 2016 – Dec 2017
- Reviewed merchant applications and financials for risk assessment
- Trained new team members and handled escalated merchant communications

EDUCATION & CERTIFICATIONS
Bachelor of Business Administration & Technology Management — Utah Valley University
Sandler Sales Training — Certified  |  Visa Bronze Certified  |  Google Project Management Certificate (in progress)  |  Asana Academy (in progress)`;

export const RESUME_TEMPLATE_AE = `CHASE WHITTAKER
chase.t.whittaker@gmail.com  |  801-960-0082  |  Vineyard, UT (Remote)  |  linkedin.com/in/chase-whittaker

[TARGET ROLE]  |  [TARGET COMPANY]

SUMMARY
Sales professional with 6+ years in digital payments. I've helped hundreds of merchants get set up and processing — handling everything from inbound calls and application review to live troubleshooting. I know Authorize.Net and CyberSource inside out, and I'm comfortable talking payments with both technical teams and business owners. I'm at my best in consultative, relationship-driven roles where I can actually solve problems for customers.

SKILLS
Payments: Authorize.Net, CyberSource, Visa Acceptance Solutions, fraud prevention, chargebacks, tokenization
Sales: Inbound sales, consultative selling, pipeline management, value-based selling, quota attainment
CRM & Tools: Salesforce, Microsoft Dynamics, LinkedIn Sales Navigator, Microsoft Teams, Zoom
Strengths: CRM hygiene, merchant onboarding, technical troubleshooting, cross-team collaboration

EXPERIENCE

Enterprise Sales Development Representative | Visa Inc. — CyberSource    Aug 2023 – Feb 2025
- Managed a portfolio of ~50 enterprise accounts, targeting C-suite decision-makers and introducing Visa's payment solutions
- Worked alongside a team of 6 SDRs to build and qualify pipeline for the Account Executive team
- Kept Salesforce and Microsoft Dynamics accurate and up to date — clean handoffs were a big part of how our team operated
- Built out prospect engagement sequences that helped the team stay consistent and cut down on dropped leads

Inside Sales Representative – SMB | Visa Inc. — Authorize.Net    Feb 2019 – Aug 2023
- Handled ~100 calls a day (50 inbound, 50 outbound) and onboarded around 200 merchants per month
- Managed a mix of SMB accounts (most under $5K) and larger deals up to $100K — handled both ends of the market
- Resolved 98% of integration issues without escalation, working directly with merchants to get them live
- Built onboarding guides and process docs that the team still uses — cut down on repeat questions and escalations
- Consistently hit KPI targets 10–15% above goal across four-plus years

Dispute & Support Specialist | Select Bankcard    Jan 2018 – Oct 2018
- Worked through 50–100 chargeback cases a week across Visa, Mastercard, Discover, and Amex
- Caught recurring dispute patterns and flagged them to merchants so they could tighten up their processes

Underwriting Specialist | Select Bankcard    Jun 2016 – Dec 2017
- Reviewed merchant applications, credit reports, and financials for risk
- Helped train new team members and handled escalated merchant calls

EDUCATION & CERTIFICATIONS
Bachelor of Business Administration & Technology Management — Utah Valley University
Sandler Sales Training — Certified  |  Visa Bronze Certified  |  HubSpot Sales Software (in progress)`;

// ── DEFAULT DATA ──────────────────────────────────────────────────────────────
export const defaultData = {
  applications: [],
  contacts: [],
  baseResume: RESUME_TEMPLATE_PM,
  profile: {
    name: "Chase Whittaker",
    email: "chase.t.whittaker@gmail.com",
    phone: "801-960-0082",
    linkedin: "linkedin.com/in/chase-whittaker",
    location: "Vineyard, UT (Remote Only)",
    targetRoles: "Implementation Specialist, Customer Success Manager, Account Executive (inbound)",
    targetIndustries: "Fintech, Payments, SaaS, B2B",
    yearsExp: "6",
    topAchievements: "• Onboarded ~200 merchants/month at Authorize.Net — guided each from application through first live transaction\n• 98% integration issue resolution rate — resolved the vast majority without escalation\n• Exceeded KPI targets 10–15% consistently across four-plus years\n• Built onboarding docs and process guides adopted by the full team\n• Managed both SMB accounts solo and larger deals up to $100K alongside AEs",
    salaryTarget: "$75,000–$95,000",
    notes: "6+ years digital payments. Strongest experience: Authorize.Net merchant onboarding and implementation (inbound, 98% resolution rate). Remote only. Looking for implementation, CS, or inbound AE roles — NOT cold outbound SDR.",
  },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || "";
}

export async function callClaude(system, userMsg, maxTokens = 1000) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("NO_API_KEY");
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
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
  } catch {
    throw new Error("NETWORK_ERROR");
  }
  if (res.status === 401) throw new Error("AUTH_ERROR");
  if (res.status === 529) throw new Error("OVERLOADED");
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || "API error");
  return json.content?.map(b => b.text || "").join("") || "Error — no response.";
}

export function blankApp() {
  return { id: generateId(), company: "", title: "", stage: "Interested", appliedDate: "", url: "", nextStep: "", jobDescription: "", notes: "", prepNotes: "" };
}
export function blankContact() {
  return {
    id: generateId(), name: "", company: "", role: "", email: "", linkedin: "",
    lastContact: "", notes: "", appIds: [],
    // v8.4 networking fields
    type: "other", outreachStatus: "none", outreachDate: "",
    source: "linkedin", companySize: "", industry: "", isHiring: false,
  };
}

// ── DAILY FOCUS BLOCKS ────────────────────────────────────────────────────────
export const DAILY_BLOCKS = [
  {
    id: "research",
    emoji: "🔍",
    title: "Research block",
    time: "20 min",
    tag: "Any role",
    tagColor: "#3b82f6",
    steps: [
      "Pick 1 company from your pipeline (status: Interested)",
      "Read their careers page + 1 LinkedIn post about them (5 min)",
      "Write 2 sentences: \"I want to work here because ___.  My relevant experience is ___\"",
      "Update the pipeline card's Next Step field",
    ],
    adhd: "Open the Pipeline tab first. Find one company. Close everything else.",
  },
  {
    id: "apply",
    emoji: "📝",
    title: "Application block",
    time: "30–45 min",
    tag: "High impact",
    tagColor: "#10b981",
    steps: [
      "Open a job posting you've already researched",
      "Go to AI Tools → Tailor Resume — paste the JD, pick PM or AE, generate",
      "Copy the output into your Word template (in Google Drive)",
      "Apply on their careers page or LinkedIn Easy Apply",
      "Add to Pipeline tracker immediately — set follow-up date to +7 days",
    ],
    adhd: "Set a timer for 45 min. One application only. Done is better than perfect.",
  },
  {
    id: "network",
    emoji: "🤝",
    title: "Networking block",
    time: "15–20 min",
    tag: "Highest ROI",
    tagColor: "#8b5cf6",
    steps: [
      "Search LinkedIn for 1 person at a target company in an Implementation, CS, or Sales role",
      "Go to AI Tools → LinkedIn → Connection Request, select the contact, generate message",
      "Send the connection request with the generated note",
      "Log them in the Contacts tab linked to the company",
    ],
    adhd: "Template: \"Hi [Name] — I have 6+ years in digital payments (Authorize.Net/Visa) and am exploring roles at [Company]. Love to hear about your experience on the team.\"",
  },
  {
    id: "followup",
    emoji: "📬",
    title: "Follow-up block",
    time: "15 min",
    tag: "Stay top of mind",
    tagColor: "#f59e0b",
    steps: [
      "Open Pipeline — look for any Applied applications older than 7 days",
      "Go to AI Tools → LinkedIn → Follow-up, generate a message",
      "Send it and update the card's Next Step",
      "Mark any applications 3+ weeks old with no response as Withdrawn",
    ],
    adhd: "Don't check email while doing this. One follow-up at a time.",
  },
  {
    id: "skills",
    emoji: "📚",
    title: "Skill building block",
    time: "20–30 min",
    tag: "PM track",
    tagColor: "#6b7280",
    steps: [
      "Work on Google PM Certificate on Coursera (highest priority)",
      "OR complete one Asana Academy module (free, 15 min)",
      "OR watch one YouTube video on MEDDIC sales methodology (AE track)",
      "Add any completed cert badge to LinkedIn when done",
    ],
    adhd: "Pick ONE of the three options above. Don't switch between them mid-session.",
  },
];

// ── RESOURCES ─────────────────────────────────────────────────────────────────
export const RESOURCES = [
  { category: "Do this week — free", color: "#f59e0b", items: [
    { title: "Asana Academy Certification", desc: "Free, 2–3 hrs. Gives you a LinkedIn badge immediately. Shows PM tool knowledge.", url: "https://academy.asana.com" },
    { title: "HubSpot Sales Software Cert", desc: "Free, ~4 hrs. Widely recognized for AE roles. Adds badge to LinkedIn.", url: "https://academy.hubspot.com/courses/sales-software" },
    { title: "Update LinkedIn headline", desc: "Change to: \"B2B Sales & Implementation Pro | Digital Payments | Authorize.Net | CyberSource | Open to New Opportunities\"", url: "https://linkedin.com" },
  ]},
  { category: "This month — highest PM priority", color: "#3b82f6", items: [
    { title: "Google Project Management Certificate", desc: "~6 months at your pace, ~$50/mo on Coursera. Single best ROI for getting a PM title without one on your resume.", url: "https://www.coursera.org/professional-certificates/google-project-management" },
    { title: "Jira Fundamentals Badge", desc: "Free, 90 min on Atlassian University. Required at most tech companies.", url: "https://university.atlassian.com" },
  ]},
  { category: "Month 2 — AE track", color: "#8b5cf6", items: [
    { title: "Salesforce Trailhead — Sales Trail", desc: "Free. Most AE roles require Salesforce. Complete the Sales trail for badges on your profile.", url: "https://trailhead.salesforce.com" },
    { title: "MEDDIC/MEDDPICC Framework", desc: "Free. Search YouTube. The sales qualification framework every AE interviewer expects you to know.", url: "https://www.youtube.com/results?search_query=MEDDIC+sales+framework" },
  ]},
  { category: "LinkedIn quick wins", color: "#10b981", items: [
    { title: "Turn on Open to Work", desc: "Set to Recruiters Only for privacy. Increases recruiter outreach with no downside.", url: "https://linkedin.com" },
    { title: "Update About section", desc: "Remove Visa-specific language. Add forward-looking statement about implementation/CS/AE roles. Add a CTA.", url: "https://linkedin.com" },
  ]},
];

// ── STYLES ────────────────────────────────────────────────────────────────────
export const s = {
  root: { minHeight: "100vh", background: "#0f1117", color: "#e5e7eb", fontFamily: "'DM Sans', system-ui, sans-serif", paddingBottom: 60 },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 0", gap: 12, flexWrap: "wrap" },
  headerTitle: { fontSize: 22, fontWeight: 700, color: "#f3f4f6", letterSpacing: "-0.5px" },
  headerSub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  headerActions: { display: "flex", gap: 8, flexWrap: "wrap" },
  tabs: { display: "flex", gap: 4, padding: "16px 24px 0", borderBottom: "1px solid #1f2937", flexWrap: "wrap" },
  tabBtn: { padding: "8px 16px", borderRadius: "8px 8px 0 0", border: "none", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: 14, fontWeight: 500 },
  tabBtnActive: { background: "#1f2937", color: "#f3f4f6" },
  subTabs: { display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  subTabBtn: { padding: "6px 14px", borderRadius: 20, border: "1px solid #374151", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: 13 },
  subTabBtnActive: { background: "#1f2937", color: "#f3f4f6", borderColor: "#4b5563" },
  content: { padding: "20px 24px" },
  resumeTypeRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  resumeTypeLabel: { fontSize: 13, color: "#6b7280" },
  resumeTypeBtn: { padding: "6px 14px", borderRadius: 20, border: "1px solid #374151", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: 13 },
  resumeTypeBtnActive: { background: "#1e3a5f", color: "#60a5fa", borderColor: "#3b82f6", fontWeight: 600 },
  focusHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  focusTitle: { fontSize: 18, fontWeight: 700, color: "#f3f4f6" },
  focusSub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  focusCount: { textAlign: "center", background: "#1f2937", borderRadius: 10, padding: "8px 16px", minWidth: 64 },
  focusCountNum: { fontSize: 24, fontWeight: 700, color: "#10b981" },
  focusCountLabel: { fontSize: 11, color: "#6b7280" },
  focusBlock: { background: "#1a1f2e", border: "1px solid #1f2937", borderRadius: 12, overflow: "hidden" },
  focusBlockDone: { opacity: 0.6, borderColor: "#14532d" },
  focusBlockHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", cursor: "pointer" },
  focusBlockLeft: { display: "flex", alignItems: "center", gap: 12 },
  focusBlockTitle: { fontSize: 15, fontWeight: 600, color: "#f3f4f6" },
  focusBlockTime: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  focusTag: { fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500 },
  focusBlockBody: { padding: "0 16px 16px", borderTop: "1px solid #1f2937" },
  focusSteps: { display: "flex", flexDirection: "column", gap: 8, marginTop: 12 },
  focusStep: { display: "flex", gap: 10, alignItems: "flex-start" },
  focusStepNum: { background: "#374151", color: "#9ca3af", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 1 },
  focusStepText: { fontSize: 13, color: "#d1d5db", lineHeight: 1.55 },
  focusAdhdTip: { background: "#1c1a0a", border: "1px solid #78350f", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#fbbf24", marginTop: 12, lineHeight: 1.5 },
  weeklyRhythm: { background: "#111827", borderRadius: 12, padding: 16 },
  weekRow: { display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #1f2937", alignItems: "flex-start" },
  weekDay: { fontSize: 12, fontWeight: 600, color: "#6b7280", minWidth: 36, paddingTop: 1 },
  weekTask: { fontSize: 13, color: "#9ca3af", lineHeight: 1.5 },
  resourceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 },
  resourceCard: { background: "#1a1f2e", border: "1px solid #1f2937", borderRadius: 10, padding: 14 },
  resourceTitle: { fontSize: 14, fontWeight: 600, color: "#f3f4f6", marginBottom: 5 },
  resourceDesc: { fontSize: 12, color: "#9ca3af", lineHeight: 1.55 },
  stageBar: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  stagePill: { display: "flex", alignItems: "center", gap: 5, background: "#1f2937", borderRadius: 20, padding: "4px 12px", fontSize: 12 },
  stageDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  stagePillLabel: { color: "#9ca3af" },
  stagePillCount: { color: "#f3f4f6", fontWeight: 600, marginLeft: 2 },
  stageBadge: { display: "flex", alignItems: "center", gap: 5, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 },
  card: { background: "#1a1f2e", border: "1px solid #1f2937", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 8 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  cardCompany: { fontWeight: 700, fontSize: 15, color: "#f3f4f6" },
  cardTitle: { fontSize: 13, color: "#9ca3af", marginTop: 2 },
  cardMeta: { fontSize: 12, color: "#6b7280" },
  cardNextStep: { fontSize: 13, color: "#60a5fa", fontStyle: "italic" },
  cardContacts: { display: "flex", flexWrap: "wrap", gap: 4 },
  contactChip: { background: "#312e81", color: "#a5b4fc", fontSize: 11, padding: "2px 8px", borderRadius: 10 },
  appChip: { background: "#1e3a5f", color: "#60a5fa", fontSize: 11, padding: "2px 8px", borderRadius: 10 },
  cardActions: { display: "flex", gap: 6, alignItems: "center", marginTop: 4 },
  stageSelect: { flex: 1, background: "#111827", border: "1px solid #374151", borderRadius: 6, color: "#d1d5db", fontSize: 12, padding: "4px 6px" },
  actionBtn: { background: "#1f2937", border: "1px solid #374151", color: "#d1d5db", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  actionBtnKit: { background: "#1a2744", border: "none", color: "#60a5fa", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  actionBtnPrep: { background: "#1a2a1a", border: "none", color: "#10b981", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  actionBtnDanger: { background: "#450a0a", border: "none", color: "#f87171", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  archiveSection: { marginTop: 24 },
  archiveSummary: { color: "#6b7280", fontSize: 14, cursor: "pointer", marginBottom: 12 },
  empty: { color: "#4b5563", textAlign: "center", padding: "40px 20px", fontSize: 14 },
  contactList: { display: "flex", flexDirection: "column", gap: 10 },
  contactCard: { background: "#1a1f2e", border: "1px solid #1f2937", borderRadius: 12, padding: 16 },
  contactCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  contactNotes: { fontSize: 13, color: "#9ca3af", marginTop: 4 },
  // Networking stats bar
  statsBar: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  statBox: { background: "#1a1f2e", border: "1px solid #1f2937", borderRadius: 10, padding: "10px 14px", flex: "1 1 120px", minWidth: 100 },
  statNum: { fontSize: 20, fontWeight: 700, color: "#f3f4f6" },
  statLabel: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  // Contact filters
  filterRow: { display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" },
  filterLabel: { fontSize: 12, color: "#6b7280", fontWeight: 500, flexShrink: 0 },
  filterChip: { padding: "4px 12px", borderRadius: 20, border: "1px solid #374151", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: 12 },
  filterChipActive: { background: "#1e3a5f", borderColor: "#3b82f6", color: "#60a5fa" },
  // Contact card badges & intel
  contactTypeBadge: { fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 500 },
  outreachBadge: { fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 500 },
  companyIntel: { fontSize: 12, color: "#6b7280", display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 },
  // Quick action row on contact cards
  quickActions: { display: "flex", gap: 6, marginTop: 8, alignItems: "center" },
  quickActionDraft: { background: "#1a2744", border: "none", color: "#60a5fa", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", flexShrink: 0 },
  link: { color: "#60a5fa", textDecoration: "none" },
  warnBanner: { background: "#451a03", border: "1px solid #78350f", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#fbbf24", display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  warnBtn: { background: "#78350f", border: "none", color: "#fbbf24", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer" },
  warnSmall: { background: "#451a03", border: "1px solid #78350f", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#fbbf24" },
  aiLayout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "flex-start" },
  aiLeft: { display: "flex", flexDirection: "column", gap: 12 },
  aiRight: { display: "flex", flexDirection: "column", gap: 12 },
  kitLayout: { display: "flex", flexDirection: "column", gap: 12 },
  kitContext: { background: "#1f2937", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" },
  kitResults: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 },
  kitResultCol: { display: "flex", flexDirection: "column", gap: 8 },
  jobsLayout: { display: "flex", flexDirection: "column", gap: 12 },
  jobSearchRow: { display: "flex", gap: 8 },
  quickSearches: { display: "flex", flexWrap: "wrap", gap: 6 },
  quickChip: { background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer" },
  jobResultsList: { display: "flex", flexDirection: "column", gap: 10 },
  jobResultCard: { background: "#1a1f2e", border: "1px solid #1f2937", borderRadius: 10, padding: 14 },
  jobResultTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  jobResultTitle: { fontWeight: 600, fontSize: 14, color: "#f3f4f6" },
  jobResultCompany: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  jobResultSnippet: { fontSize: 12, color: "#6b7280", lineHeight: 1.5 },
  jobLink: { background: "#1e3a5f", border: "none", color: "#60a5fa", borderRadius: 6, padding: "4px 10px", fontSize: 12, textDecoration: "none", display: "inline-block" },
  sectionLabel: { fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  profileSectionLabel: { fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 8, paddingTop: 8, borderTop: "1px solid #1f2937" },
  tipBox: { background: "#111827", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#6b7280" },
  resultBox: { background: "#0c1a0c", border: "1px solid #14532d", borderRadius: 10, overflow: "hidden" },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#14532d22", borderBottom: "1px solid #14532d", fontSize: 13, fontWeight: 600, color: "#6ee7b7" },
  resultText: { padding: 12, fontSize: 12, color: "#d1fae5", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 400, overflowY: "auto", margin: 0, fontFamily: "monospace" },
  copyBtn: { background: "#14532d", border: "none", color: "#6ee7b7", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer" },
  baseResumePreview: { background: "#111827", border: "1px solid #1f2937", borderRadius: 8, padding: 12, fontSize: 12, color: "#9ca3af", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 400, overflowY: "auto", margin: 0, fontFamily: "monospace" },
  textarea: { width: "100%", background: "#111827", border: "1px solid #374151", borderRadius: 8, color: "#e5e7eb", fontSize: 13, padding: 10, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 },
  modal: { background: "#1a1f2e", border: "1px solid #374151", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1f2937", fontWeight: 600, fontSize: 15 },
  modalBody: { padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 },
  modalFooter: { display: "flex", gap: 8, padding: "12px 20px", borderTop: "1px solid #1f2937", alignItems: "center" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 4 },
  fieldLabel: { fontSize: 12, color: "#6b7280", fontWeight: 500 },
  input: { background: "#111827", border: "1px solid #374151", borderRadius: 8, color: "#e5e7eb", fontSize: 13, padding: "8px 10px", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
  closeBtn: { background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 18, lineHeight: 1 },
  btnPrimary: { background: "#3b82f6", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnSecondary: { background: "#1f2937", border: "1px solid #374151", color: "#d1d5db", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" },
  btnWarn: { background: "#451a03", border: "1px solid #78350f", color: "#fbbf24", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" },
  btnDanger: { background: "#450a0a", border: "none", color: "#f87171", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" },
  appToggleChip: { background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: 20, padding: "3px 12px", fontSize: 12, cursor: "pointer" },
  appToggleChipActive: { background: "#1e3a5f", border: "1px solid #3b82f6", color: "#60a5fa" },
  liLayout: { display: "flex", flexDirection: "column", gap: 16 },
  liSubNav: { display: "flex", flexWrap: "wrap", gap: 6, borderBottom: "1px solid #1f2937", paddingBottom: 12 },
  liNavBtn: { padding: "5px 14px", borderRadius: 8, border: "1px solid #374151", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: 13 },
  liNavBtnActive: { background: "#1f2937", color: "#f3f4f6", borderColor: "#4b5563" },
  errorToast: { position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", borderRadius: 10, padding: "12px 20px", zIndex: 200, fontSize: 13, display: "flex", gap: 12, alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.6)", maxWidth: "90vw" },
  toastClose: { background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 },
};

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .card-hover:hover { border-color: #374151 !important; }
  select option { background: #1a1f2e; }
  textarea, input, select { outline: none; }
  textarea:focus, input:focus, select:focus { border-color: #3b82f6 !important; }
  @media (max-width: 700px) {
    div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
  }
`;
