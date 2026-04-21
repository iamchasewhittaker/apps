// ── STORAGE ─────────────────────────────────────────────────────────────────
export const STORAGE_KEY = "chase_job_search_v1";
export const BACKUP_FOLDER_KEY = "chase_job_search_backup_folder";

// ── DATE HELPER ───────────────────────────────────────────────────────────────
export const today = () => new Date().toISOString().slice(0, 10);

// ── DAILY ACTION TYPES ────────────────────────────────────────────────────────
export const JOB_ACTION_TYPES = [
  { value: "application", label: "Application", icon: "📄" },
  { value: "outreach",    label: "Outreach",    icon: "📧" },
  { value: "interview",   label: "Interview",   icon: "🎤" },
  { value: "prep",        label: "Prep",        icon: "📝" },
  { value: "learning",    label: "Learning",    icon: "📚" },
  { value: "other",       label: "Other",       icon: "⚡" },
];

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

export const NEXT_STEP_TYPES = [
  { value: "",              label: "— type —" },
  { value: "apply",         label: "Apply" },
  { value: "follow_up",     label: "Follow Up" },
  { value: "prep",          label: "Interview Prep" },
  { value: "send_materials",label: "Send Materials" },
  { value: "thank_you",     label: "Thank You Note" },
  { value: "negotiate",     label: "Negotiate" },
  { value: "other",         label: "Other" },
];

export const CONNECT_SCENARIOS = [
  { label: "Cold Outreach",      text: "Cold outreach — exploring implementation/CS roles in their space" },
  { label: "Post-Application",   text: "I recently applied to a role at their company and wanted to connect with the team" },
  { label: "Alumni / Mutual",    text: "We share a mutual connection or similar background in payments/fintech" },
  { label: "Recruiter",          text: "Connecting with a recruiter about open opportunities in payments or fintech" },
];

export const FOLLOWUP_SCENARIOS = [
  { label: "No Reply",           text: "Sent a message a few days ago with no response — gentle follow-up" },
  { label: "Post-Interview",     text: "Sending a thank you / follow-up after a recent interview or phone call" },
  { label: "After Rejection",    text: "Following up after a rejection — keeping the door open and asking for feedback" },
  { label: "Reconnect",          text: "Reconnecting after some time — sharing a relevant update" },
];

// ── JOB SEARCH ────────────────────────────────────────────────────────────────
// Ordered by direction priority — IC/SE first, AE backup last. See identity/direction.md.
export const JOB_SEARCH_QUERIES = [
  "Implementation Consultant payments remote",
  "Solutions Engineer payment gateway remote",
  "Sales Engineer fintech implementation remote",
  "Technical Account Manager payments remote",
  "Implementation Specialist Stripe OR Adyen OR Checkout.com",
  "Solutions Consultant merchant onboarding remote",
  "Customer Success Manager payments platform remote",
  // Backup AE queries:
  "Account Executive inbound fintech payments",
  "Merchant Success Manager payment gateway remote",
];

// ── LAYOFF + DAILY FLOOR (Kassie's urgency layer) ────────────────────────────
// Day 0 was the last day at Visa (Feb 15, 2025). Used for "Day N since Visa" counter.
export const LAYOFF_DATE = "2025-02-15";

// Non-negotiable daily minimums. Weekdays only — Sunday is rest.
export const DAILY_MINIMUMS = {
  applications: 5,
  outreach: 3,
  restDay: 0, // Sunday
};

export const daysSinceLayoff = (now = new Date()) => {
  const start = new Date(LAYOFF_DATE + "T00:00:00");
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

// ── DIRECTION (source of truth for UI — mirrors identity/direction.md) ──────
export const DIRECTION = {
  primaryRole: "Implementation Consultant / Sales Engineer",
  primaryCompanies: [
    "Stripe", "Adyen", "Checkout.com", "Finix", "Rainforest Pay",
    "Spreedly", "Fiserv", "FIS", "Braintree", "NMI", "Worldpay", "Global Payments",
    "Nuvei", "Paddle", "Stax", "Tilled", "Payrix", "Chargebee", "Recurly", "Zuora",
  ],
  secondaryCompanies: [
    "Vercel", "Supabase", "Clerk", "Neon", "Retool", "Anthropic",
    "Linear", "PostHog", "Sentry", "Railway", "Render",
  ],
  backupRole: "Account Executive at payments SaaS or inbound-heavy fintech",
  committedDate: "2026-04-21",
  reassessWeek4: "2026-05-19",
  reassessWeek10: "2026-06-30",
};

// Direction track codes — filed per-application so the market tells us what's working.
export const DIRECTION_TRACKS = [
  { value: "IC", label: "Implementation / SE (payments-adjacent)", color: "#10b981" },
  { value: "SE", label: "SE (dev-tools)",                         color: "#3b82f6" },
  { value: "AE", label: "AE (backup)",                            color: "#8b5cf6" },
  { value: "Other", label: "Other",                               color: "#6b7280" },
];

// ── STRENGTHS (CliftonStrengths Top 5) ───────────────────────────────────────
export const STRENGTHS_SUMMARY = [
  {
    name: "HARMONY",
    descriptors: ["Collaborative", "Peaceful", "Conflict-reducing"],
    workExample: "Reads the room and de-escalates when a merchant call is going sideways; finds the thread everyone can agree on.",
    jobSearchLeverage: "Calm under pressure is a hiring signal for Implementation Consultant roles where escalations are daily.",
  },
  {
    name: "DEVELOPER",
    descriptors: ["Patient", "Encouraging", "Others-oriented"],
    workExample: "Coaches merchants through integrations instead of doing it for them; builds onboarding docs the team still uses.",
    jobSearchLeverage: "This is the exact energy IC/SE bring to merchant go-lives. Lead with it.",
  },
  {
    name: "CONSISTENCY",
    descriptors: ["Fair", "Consistent", "Practical"],
    workExample: "Runs the same playbook per merchant; keeps CRM data clean; builds SOPs so the team operates the same way whether he's there or not.",
    jobSearchLeverage: "Resume bullet: 'Built onboarding SOPs adopted by the full SMB team — reduced repeat questions and helped new hires ramp faster.'",
  },
  {
    name: "CONTEXT",
    descriptors: ["Historical", "Insightful", "Reflective"],
    workExample: "Pattern-recognizes: 'I've seen this before — last quarter three merchants had the same webhook issue. Here's what worked.'",
    jobSearchLeverage: "In IC technical rounds, pattern library from 200+ merchants/month is a killer asset.",
  },
  {
    name: "INDIVIDUALIZATION",
    descriptors: ["Perceptive", "People-oriented", "Tailored"],
    workExample: "Doesn't send the same outreach twice; reads each merchant's real need, not just the stated ask.",
    jobSearchLeverage: "Every outreach message is personalized — natural mode. Don't use templates.",
  },
];

// ── FRIEND FEEDBACK (Chase's own survey of what his people say about him) ───
export const FRIEND_FEEDBACK = [
  {
    name: "Brandon", relation: "Former colleague",
    quotes: [
      "You are best at people. Your ability to connect and relate with people... establish rapport and make people feel at ease.",
      "Your strengths are communication (you ask good questions, confirm others' understanding), thoughtfulness (you genuinely care about others), and establishing trust/credibility.",
    ],
  },
  {
    name: "Holly", relation: "Former colleague",
    quotes: [
      "Your strengths are your kindness, your willingness to help, and the positive way you interact with people. You have a calm, steady temperament that makes you easy to be around.",
      "You're great at talking to people and making them feel at ease.",
    ],
  },
  {
    name: "Ben", relation: "Friend",
    quotes: [
      "You are a positive person who does a good job connecting with people.",
    ],
  },
  {
    name: "Travis", relation: "Former colleague",
    quotes: [
      "You are friendly, easy to talk to, and easy to connect with. So you're great at working with people.",
      "You are also dedicated and hard working. I can trust that you'll get things done.",
      "You do a great job of delegating and following up with others, so you would do well managing and mentoring others.",
    ],
  },
  {
    name: "Josh", relation: "Friend",
    quotes: [
      "Personable & communicative — very good at relating to others. Dependable / reliable. Funny. Humble / willing to learn. Kind. Team player.",
    ],
  },
  {
    name: "Andrew", relation: "Friend",
    quotes: [
      "You are loyal, committed, consistent, and dependable. Those are at least a few words that I think really describe you.",
    ],
  },
  {
    name: "Kassie", relation: "Wife",
    quotes: [
      "— to be added (see chase/identity/kassie-notes.md) —",
    ],
  },
];

export const FRIEND_FEEDBACK_CONSENSUS = [
  "Great at connecting with people",
  "Calm, steady temperament",
  "Dependable / reliable",
  "Humble",
  "Asks good questions",
  "Establishes trust and rapport",
];

// Rotating Kassie excerpts for the FocusTab accountability card (one per session).
export const KASSIE_EXCERPTS = [
  "I need you to be a bad A job hunting machine.",
  "You are wasting time.",
  "You can do better.",
  "I can't carry the weight of everything anymore.",
  "You have a little family counting on you. Please do more.",
  "You are so indecisive and can never make a choice.",
  "Stop making excuses and feeling sorry for yourself.",
];

// ── AI CONTEXT ────────────────────────────────────────────────────────────────
export const CHASE_CONTEXT = `CANDIDATE BACKGROUND (always use this):
Name: Chase Whittaker
Location: Vineyard, UT — remote only (cannot drive due to vision impairment)
Salary Target: [see profile]
Years Experience: 6+ years in digital payments

STRONGEST EXPERIENCE — always lead with this:
- Authorize.Net SMB Inside Sales (Feb 2019–Aug 2023): Inbound leads only. Guided merchants end-to-end from application through live transaction processing. 98% integration issue resolution rate. Built onboarding materials. Exceeded KPIs 10–15% consistently. This is his proof point for implementation roles.
- CyberSource Enterprise SDR (Aug 2023–Feb 2025): Outbound prospecting. Struggled with cold outreach and quota. Do NOT frame him back into a pure outbound SDR role.
- Select Bankcard (2016–2018): Dispute/chargeback specialist and underwriting. Deep fraud and risk knowledge.

KEY SKILLS: Payment gateways (Authorize.Net, CyberSource/Visa), fraud prevention, chargeback management, merchant onboarding, CRM hygiene (Salesforce, Microsoft Dynamics), systematic documentation, cross-team collaboration, inbound sales.

AVOID: Do not frame Chase as a cold-outbound SDR or pure quota-driven salesperson. He excels at implementation, merchant support, and inbound/consultative roles.

DIRECTION (primary frame for all drafts — committed 2026-04-21):
Target role: Implementation Consultant / Sales Engineer / Solutions Consultant
Target companies (payments-adjacent, PRIMARY): Stripe, Adyen, Checkout.com, Finix, Rainforest Pay, Spreedly, Fiserv, FIS, Braintree, NMI, Worldpay, Global Payments, Nuvei, Paddle, Stax, Tilled, Payrix, Chargebee, Recurly, Zuora.
Secondary target (dev-tools): Vercel, Supabase, Clerk, Neon, Retool, Anthropic, Linear, PostHog, Sentry, Railway, Render.
Backup path: AE at a payments SaaS or inbound-heavy fintech.
Why this fits: 6 yrs Authorize.Net + CyberSource implementation experience is the exact credential payments-adjacent IC/SE hiring managers want on day one. Chase's energy is ~70% implementation, ~20% building/demoing, ~10% coaching peers.

STRENGTHS (CliftonStrengths Top 5):
- HARMONY — frames interactions around reducing friction and finding common ground
- DEVELOPER — naturally coaches/encourages peers; loves watching others level up
- CONSISTENCY — fair, process-driven, dependable; protects against chaos
- CONTEXT — reflective, pattern-recognizer; uses history to make better decisions
- INDIVIDUALIZATION — reads people well; tailors approach per person, not per script

FRIEND-FEEDBACK CONSENSUS: great at connecting with people, calm/steady temperament, dependable, humble, asks good questions, establishes trust and rapport.

VOICE RULES (how to write as Chase):
- Warm, direct, no hype. Short sentences.
- No em-dashes. No rule-of-threes. No consultant phrasing ("compounds future optionality", "unlocks growth", "synergy", "leverages").
- No hype words ("amazing", "incredible", "thrilled", "passionate").
- Real questions when unsure. Thank people by name. Lead with what's useful for the reader.
- Use his words: "get them up and running", "walk through", "figure out", "happy to".

GAP NARRATIVE (use when the 14-month gap comes up — adjust per company, never apologize):
"After Visa in Feb 2025 I spent 14 months building a portfolio of Next.js + Supabase apps — shipping real product with AI-assisted workflows. I wanted to be credible in technical conversations with merchants and engineers, not just sales conversations. That's the exact gap Implementation Consultants and Sales Engineers at payments-adjacent companies fill every day."`;

// ── RESUME TEMPLATES ──────────────────────────────────────────────────────────
export const RESUME_TEMPLATE_PM = `CHASE WHITTAKER
chase.t.whittaker@gmail.com  |  [PHONE]  |  Vineyard, UT (Remote)  |  linkedin.com/in/chase-whittaker

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

// Primary template — leads with implementation/merchant-live wins for IC/SE roles
// at payments-adjacent companies (Stripe, Adyen, Finix, Checkout.com, etc.).
export const RESUME_TEMPLATE_IC = `CHASE WHITTAKER
chase.t.whittaker@gmail.com  |  [PHONE]  |  Vineyard, UT (Remote)  |  linkedin.com/in/chase-whittaker

[TARGET ROLE]  |  [TARGET COMPANY]

SUMMARY
Payments implementation specialist with 6+ years guiding merchants from application through live transaction processing on Authorize.Net and CyberSource. Resolved 98% of integration issues without escalation. Comfortable walking both business owners and engineers through payment flows, webhooks, tokenization, and fraud controls. Looking for an Implementation Consultant or Sales Engineer seat at a payments-adjacent company where a day-one credential beats a ramp.

SKILLS
Payments: Authorize.Net, CyberSource / Visa Acceptance, tokenization, 3DS, recurring billing, webhooks, fraud controls
Implementation: Merchant onboarding, go-live support, integration troubleshooting, SOP authoring, cross-team escalation management
Technical: Reading API docs, reproducing merchant issues in a sandbox, basic JS/HTML/CSS (portfolio of Next.js + Supabase apps shipped 2025–26)
Tools: Salesforce, Microsoft Dynamics, Postman, Stripe/Adyen dashboards (familiar), Git, Linear, Jira, Microsoft Teams

EXPERIENCE

Inside Sales Representative – SMB (Implementation-focused) | Visa Inc. — Authorize.Net    Feb 2019 – Aug 2023
- Got ~200 merchants up and running each month — owned the full path from application through first live transaction
- Resolved 98% of integration issues directly: webhook wiring, tokenization, fraud rules, API key handoffs
- Built onboarding SOPs the full SMB team still runs — cut repeat questions and shortened new-hire ramp
- Kept 15–20 active onboardings moving in parallel across different stages; exceeded KPI 10–15% for four-plus years
- Partnered with AEs on deals up to $100K — owned the technical half of the conversation so the AE stayed on commercials

Enterprise Implementation Liaison / SDR | Visa Inc. — CyberSource    Aug 2023 – Feb 2025
- Managed ~50 enterprise accounts — kept engagements on track and handoffs clean between prospect, AE, and solutions team
- Authored prospect engagement workflows the team adopted — reduced dropped follow-ups and improved CRM hygiene
- Served as the technical go-between for prospects and AEs, translating merchant asks into implementation scope

Independent Portfolio Work — Next.js + Supabase apps    Feb 2025 – present
- Shipped a portfolio of production-grade web apps (Next.js, React, Supabase, Vercel) with AI-assisted workflows
- Built for credibility in technical conversations with merchants and engineers, not just commercial ones
- Representative: a job-search cockpit (pipeline, contacts CRM, interview prep, Chrome MV3 extension) used daily

Dispute & Support Specialist | Select Bankcard    Jan 2018 – Oct 2018
- Worked 50–100 chargeback cases per week across Visa, Mastercard, Discover, and Amex
- Spotted recurring dispute patterns and flagged them to merchants so they could tighten processes

Underwriting Specialist | Select Bankcard    Jun 2016 – Dec 2017
- Reviewed merchant applications and financials for risk
- Trained new team members and handled escalated merchant calls

EDUCATION & CERTIFICATIONS
Bachelor of Business Administration & Technology Management — Utah Valley University
Sandler Sales Training — Certified  |  Visa Bronze Certified  |  Google Project Management Certificate (in progress)`;

export const RESUME_TEMPLATE_AE = `CHASE WHITTAKER
chase.t.whittaker@gmail.com  |  [PHONE]  |  Vineyard, UT (Remote)  |  linkedin.com/in/chase-whittaker

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
  starStories: [],
  dailyActions: [], // { id, date, type, note, time }
  wins: [],         // { id, date, type, source, title, note, autoLogged }
  baseResume: RESUME_TEMPLATE_IC,
  profile: {
    name: "Chase Whittaker",
    email: "chase.t.whittaker@gmail.com",
    phone: "",
    linkedin: "linkedin.com/in/chase-whittaker",
    location: "Vineyard, UT (Remote Only)",
    targetRoles: "Implementation Consultant, Sales Engineer, Solutions Consultant (payments-adjacent); AE at a payments SaaS as backup",
    targetIndustries: "Payments, Fintech, Dev Tools, B2B SaaS",
    yearsExp: "6",
    topAchievements: "• Onboarded ~200 merchants/month at Authorize.Net — guided each from application through first live transaction\n• 98% integration issue resolution rate — resolved the vast majority without escalation\n• Exceeded KPI targets 10–15% consistently across four-plus years\n• Built onboarding SOPs adopted by the full SMB team — cut repeat questions and shortened new-hire ramp\n• Managed both SMB accounts solo and larger deals up to $100K alongside AEs",
    salaryTarget: "",
    notes: "6+ years digital payments. Strongest experience: Authorize.Net merchant onboarding + integration troubleshooting (inbound, 98% resolution). Remote only. Target: Implementation Consultant / Sales Engineer at payments-adjacent companies (Stripe, Adyen, Checkout.com, Finix, etc.). AE at payments SaaS is the backup path, not the lead. Not a cold-outbound SDR.",
    weeklyTarget: 5,
  },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function blankApp() {
  return {
    id: generateId(), company: "", title: "", stage: "Interested", appliedDate: "", url: "",
    nextStep: "", nextStepDate: "", nextStepType: "", jobDescription: "", notes: "",
    prepNotes: "", // legacy fallback
    prepSections: blankPrepSections(),
    prepStageKey: "", // phone_screen | interview | final_round — last template applied (optional)
    interviewLog: [],
    offerDetails: blankOfferDetails(),
    track: "IC", // IC | SE | AE | Other — direction tracker (2026-04-21)
  };
}

// ── WINS LOG (Kassie's urgency layer — visible evidence of forward motion) ──
export const WIN_TYPES = [
  { value: "response",     label: "Response",        color: "#3b82f6" },
  { value: "progression",  label: "Stage progression", color: "#10b981" },
  { value: "daily_target", label: "Daily target hit", color: "#f59e0b" },
  { value: "manual",       label: "Manual",          color: "#8b5cf6" },
];

export function blankWin() {
  return {
    id: generateId(),
    date: today(),
    type: "manual",
    source: null,      // 'app:<id>' | 'contact:<id>' | null
    title: "",
    note: "",
    autoLogged: false,
  };
}

export function normalizeWins(wins = []) {
  if (!Array.isArray(wins)) return [];
  return wins.map(w => ({
    id: w.id || generateId(),
    date: w.date || today(),
    type: w.type || "manual",
    source: w.source ?? null,
    title: w.title || "",
    note: w.note || "",
    autoLogged: !!w.autoLogged,
  }));
}

// Direction split — counts + response-rate per track across active applications.
// "Response" = any non-Interested stage (Applied, Phone Screen, Interview, Final
// Round, Offer all imply the application got a signal back).
export function getDirectionSplit(applications = []) {
  const tracks = ["IC", "SE", "AE", "Other"];
  const out = Object.fromEntries(tracks.map(t => [t, { count: 0, responded: 0, responseRate: 0 }]));
  applications.forEach(app => {
    const track = tracks.includes(app.track) ? app.track : "Other";
    out[track].count += 1;
    if (app.stage && app.stage !== "Interested") out[track].responded += 1;
  });
  tracks.forEach(t => {
    const row = out[t];
    row.responseRate = row.count ? Math.round((row.responded / row.count) * 100) : 0;
  });
  return out;
}

export const DEBRIEF_ROUND_TYPES = [
  { value: "phone_screen", label: "Phone Screen" },
  { value: "technical",    label: "Technical" },
  { value: "onsite",       label: "On-site / Panel" },
  { value: "final_round",  label: "Final Round" },
  { value: "other",        label: "Other" },
];

export const DEBRIEF_IMPRESSIONS = [
  { value: "positive", label: "Positive", color: "#10b981" },
  { value: "neutral",  label: "Neutral",  color: "#f59e0b" },
  { value: "negative", label: "Negative", color: "#ef4444" },
];

export function blankDebriefEntry() {
  return {
    id: generateId(),
    date: today(),
    interviewerName: "",
    roundType: "phone_screen",
    impression: "neutral",
    confidence: 3,
    strengths: "",
    gaps: "",
    redFlags: "",
    keyQuestions: "",
    notes: "",
  };
}

export function normalizeInterviewLog(log = []) {
  if (!Array.isArray(log)) return [];
  return log.map(entry => ({
    id: entry.id || generateId(),
    date: entry.date || today(),
    interviewerName: entry.interviewerName || "",
    roundType: entry.roundType || "other",
    impression: entry.impression || "neutral",
    confidence: entry.confidence ?? 3,
    strengths: entry.strengths || "",
    gaps: entry.gaps || "",
    redFlags: entry.redFlags || "",
    keyQuestions: entry.keyQuestions || "",
    notes: entry.notes || "",
  }));
}

// ── OUTREACH LOG (Wave 4 #3) ──────────────────────────────────────────────────
export const OUTREACH_EVENT_TYPES = [
  { value: "sent",       label: "Sent",       color: "#f59e0b" },
  { value: "replied",    label: "Replied",    color: "#3b82f6" },
  { value: "meeting",    label: "Meeting",    color: "#10b981" },
  { value: "intro_made", label: "Intro Made", color: "#8b5cf6" },
  { value: "note",       label: "Note",       color: "#6b7280" },
];

export const OUTREACH_METHODS = [
  { value: "linkedin",  label: "LinkedIn" },
  { value: "email",     label: "Email" },
  { value: "phone",     label: "Phone" },
  { value: "in_person", label: "In person" },
  { value: "other",     label: "Other" },
];

export function blankOutreachEntry() {
  return {
    id: generateId(),
    date: today(),
    type: "sent",
    method: "linkedin",
    notes: "",
  };
}

export function normalizeOutreachLog(log = []) {
  if (!Array.isArray(log)) return [];
  return log.map(entry => ({
    id: entry.id || generateId(),
    date: entry.date || today(),
    type: entry.type || "sent",
    method: entry.method || "linkedin",
    notes: entry.notes || "",
  }));
}

// Migrate legacy single outreachDate/outreachStatus into a seed log entry
// when the log is empty and those fields exist.
export function normalizeContact(contact = {}) {
  const c = { ...contact };
  c.appIds = Array.isArray(c.appIds) ? c.appIds : [];
  const existingLog = normalizeOutreachLog(c.outreachLog);
  if (existingLog.length === 0 && c.outreachDate && c.outreachStatus && c.outreachStatus !== "none") {
    existingLog.push({
      id: generateId(),
      date: c.outreachDate,
      type: c.outreachStatus,
      method: c.source || "linkedin",
      notes: "",
    });
  }
  c.outreachLog = existingLog;
  return c;
}

export function nextStepUrgency(nextStepDate) {
  if (!nextStepDate) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(nextStepDate + "T00:00:00");
  const diff = Math.round((due - today) / 86400000);
  if (diff < 0) return { label: "Overdue", color: "#ef4444", bg: "#450a0a" };
  if (diff === 0) return { label: "Due Today", color: "#f59e0b", bg: "#451a03" };
  if (diff <= 3) return { label: `In ${diff}d`, color: "#60a5fa", bg: "#1e3a5f" };
  return null;
}

const ACTIVE_STAGE_PRIORITY = {
  "Offer": 5,
  "Final Round": 4,
  "Interview": 3,
  "Phone Screen": 2,
  "Applied": 1,
  "Interested": 0,
};

function daysSinceDate(value, now = new Date()) {
  if (!value) return null;
  const date = new Date(value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return null;
  return Math.round((now - date) / 86400000);
}

function getPriorityTone(score) {
  if (score >= 115) return { label: "High", color: "#ef4444", bg: "#450a0a" };
  if (score >= 85) return { label: "Next", color: "#f59e0b", bg: "#451a03" };
  return { label: "Queue", color: "#60a5fa", bg: "#1e3a5f" };
}

export function buildOutreachPriorityList(contacts = [], applications = []) {
  const activeApps = applications.filter(a => !["Rejected", "Withdrawn"].includes(a.stage));
  const appsById = new Map(activeApps.map(a => [a.id, a]));
  const appsByCompany = new Map();
  activeApps.forEach(app => {
    const key = (app.company || "").trim().toLowerCase();
    if (!key) return;
    const list = appsByCompany.get(key) || [];
    list.push(app);
    appsByCompany.set(key, list);
  });

  return contacts
    .map(contact => {
      const status = contact.outreachStatus || "none";
      const companyKey = (contact.company || "").trim().toLowerCase();
      const linkedById = (contact.appIds || []).map(id => appsById.get(id)).filter(Boolean);
      const linkedByCompany = companyKey ? (appsByCompany.get(companyKey) || []) : [];
      const linkedApps = [...new Map([...linkedById, ...linkedByCompany].map(a => [a.id, a])).values()];
      const topApp = linkedApps.sort((a, b) => (ACTIVE_STAGE_PRIORITY[b.stage] || 0) - (ACTIVE_STAGE_PRIORITY[a.stage] || 0))[0] || null;

      const daysSinceOutreach = daysSinceDate(contact.outreachDate);
      const daysSinceLastTouch = daysSinceDate(contact.lastContact || contact.outreachDate);
      let score = 0;
      let primaryReason = "";

      if (status === "replied") {
        score += 130;
        primaryReason = "They replied - respond today";
      } else if (status === "meeting") {
        score += 105;
        primaryReason = "Meeting in play - keep momentum";
      } else if (status === "sent") {
        if (daysSinceOutreach >= 7) {
          score += 95;
          primaryReason = `No reply in ${daysSinceOutreach}d - follow up now`;
        } else if (daysSinceOutreach >= 3) {
          score += 78;
          primaryReason = `Sent ${daysSinceOutreach}d ago - plan follow up`;
        } else {
          score += 45;
          primaryReason = "Recently sent - monitor and prep next touch";
        }
      } else if (status === "intro_made") {
        score += 72;
        primaryReason = "Intro made - send thank-you and next step";
      } else {
        score += 40;
        primaryReason = "No outreach yet - start a warm intro";
      }

      if (topApp) {
        score += 18 + (ACTIVE_STAGE_PRIORITY[topApp.stage] || 0) * 7;
        const appUrgency = nextStepUrgency(topApp.nextStepDate);
        if (appUrgency?.label === "Overdue") score += 24;
        else if (appUrgency?.label === "Due Today") score += 20;
        else if (appUrgency) score += 10;
      }

      if (contact.isHiring) score += 8;
      if (daysSinceLastTouch >= 21 && !["replied", "meeting"].includes(status)) score += 12;

      const contextBits = [];
      if (topApp) contextBits.push(`${topApp.company} - ${topApp.stage}`);
      if (daysSinceLastTouch != null) contextBits.push(`last touch ${daysSinceLastTouch}d ago`);
      if (contact.isHiring) contextBits.push("hiring signal");

      const draftPrompt = `Draft a concise LinkedIn outreach message to ${contact.name || "this contact"}${contact.role ? ` (${contact.role})` : ""}${contact.company ? ` at ${contact.company}` : ""}. Goal: ${primaryReason.toLowerCase()}. Keep it to 2-4 sentences, friendly and specific to digital payments experience. End with a low-friction CTA.`;
      const tone = getPriorityTone(score);

      return {
        id: contact.id,
        contact,
        score,
        tone,
        primaryReason,
        context: contextBits.join(" • "),
        linkedApp: topApp,
        draftPrompt,
      };
    })
    .filter(item => item.score >= 50)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aName = (a.contact.name || "").toLowerCase();
      const bName = (b.contact.name || "").toLowerCase();
      return aName.localeCompare(bName);
    })
    .slice(0, 6);
}

export function buildCompanyBoard(applications = [], contacts = []) {
  const activeApps = applications.filter(a => !["Rejected", "Withdrawn"].includes(a.stage));
  return DIRECTION.primaryCompanies.map(company => {
    const lc = company.toLowerCase();
    const app = activeApps.find(a => (a.company || "").toLowerCase() === lc);
    const contact = contacts.find(c => (c.company || "").toLowerCase() === lc);
    return { company, app, contact };
  }).sort((a, b) => {
    const score = r => (r.app ? 2 : 0) + (r.contact ? 1 : 0);
    return score(a) - score(b);
  });
}

export function getOutreachCadenceNudge(contact, linkedApp = null) {
  if (!contact || contact.outreachStatus !== "sent" || !contact.outreachDate) return null;

  const sent = new Date(contact.outreachDate + "T00:00:00");
  if (Number.isNaN(sent.getTime())) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Math.round((today - sent) / 86400000);
  if (days < 3) return null;

  const appContext = linkedApp
    ? ` for the ${linkedApp.title} role at ${linkedApp.company}`
    : (contact.company ? ` at ${contact.company}` : "");
  const personName = contact.name || "there";

  if (days >= 7) {
    return {
      label: "Day 7 follow-up",
      color: "#ef4444",
      bg: "#450a0a",
      message: `No reply in ${days} days - send a stronger second follow-up today.`,
      prompt: `Draft a concise second LinkedIn follow-up message to ${personName}${appContext}. Tone: warm and confident. Mention this is a brief follow-up, reinforce relevant digital payments implementation experience, and end with one specific CTA. Keep it 2-4 sentences.`,
    };
  }

  return {
    label: "Day 3 follow-up",
    color: "#f59e0b",
    bg: "#451a03",
    message: `Sent ${days} days ago - send a gentle check-in follow-up now.`,
    prompt: `Draft a short first follow-up message to ${personName}${appContext}. Tone: polite and low-pressure. Reference the previous outreach briefly and ask one light next-step question. Keep it 2-3 sentences.`,
  };
}

export const PREP_SECTIONS = [
  { key: "companyResearch", label: "Company research" },
  { key: "roleAnalysis", label: "Role analysis" },
  { key: "starStories", label: "STAR stories" },
  { key: "questionsToAsk", label: "Questions to ask" },
];

export function blankPrepSections() {
  return {
    companyResearch: "",
    roleAnalysis: "",
    starStories: "",
    questionsToAsk: "",
  };
}

export function normalizePrepSections(prepSections, prepNotes = "") {
  const base = blankPrepSections();
  if (prepSections && typeof prepSections === "object") {
    return {
      companyResearch: prepSections.companyResearch || "",
      roleAnalysis: prepSections.roleAnalysis || "",
      starStories: prepSections.starStories || "",
      questionsToAsk: prepSections.questionsToAsk || "",
    };
  }
  if (typeof prepNotes === "string" && prepNotes.trim()) {
    return { ...base, roleAnalysis: prepNotes.trim() };
  }
  return base;
}

export function prepSectionsHasContent(prepSections, prepNotes = "") {
  const normalized = normalizePrepSections(prepSections, prepNotes);
  return PREP_SECTIONS.some(section => normalized[section.key].trim());
}

export function prepSectionsToText(prepSections, prepNotes = "") {
  const normalized = normalizePrepSections(prepSections, prepNotes);
  return PREP_SECTIONS
    .filter(section => normalized[section.key].trim())
    .map(section => `${section.label.toUpperCase()}\n${normalized[section.key].trim()}`)
    .join("\n\n");
}

export function normalizeApplication(app = {}) {
  return {
    ...app,
    prepSections: normalizePrepSections(app.prepSections, app.prepNotes),
    interviewLog: normalizeInterviewLog(app.interviewLog),
    offerDetails: normalizeOfferDetails(app.offerDetails),
  };
}

// ── OFFER DETAILS (Wave 4 #4) ─────────────────────────────────────────────────
export const OFFER_FIELDS = [
  { key: "baseSalary",    label: "Base salary",   type: "currency" },
  { key: "bonusTarget",   label: "Bonus target",  type: "currency" },
  { key: "signOnBonus",   label: "Sign-on bonus", type: "currency" },
  { key: "equity",        label: "Equity (yr)",   type: "currency" },
];

export const OFFER_TERM_FIELDS = [
  { key: "startDate",     label: "Start date",    type: "date" },
  { key: "decisionBy",    label: "Decide by",     type: "date" },
  { key: "ptoWeeks",      label: "PTO (weeks)",   type: "number" },
  { key: "location",      label: "Location",      type: "text" },
  { key: "remoteFlex",    label: "Remote / flex", type: "text" },
];

export function blankOfferDetails() {
  return {
    receivedDate: "",
    baseSalary: "",
    bonusTarget: "",
    bonusType: "target", // target | guaranteed | discretionary
    signOnBonus: "",
    equity: "",          // annualized vest value in USD
    equityNotes: "",
    ptoWeeks: "",
    benefitsNotes: "",
    startDate: "",
    location: "",
    remoteFlex: "",
    decisionBy: "",
    notes: "",
  };
}

export function normalizeOfferDetails(o = {}) {
  const base = blankOfferDetails();
  if (!o || typeof o !== "object") return base;
  return {
    receivedDate:  o.receivedDate  || "",
    baseSalary:    o.baseSalary    ?? "",
    bonusTarget:   o.bonusTarget   ?? "",
    bonusType:     o.bonusType     || "target",
    signOnBonus:   o.signOnBonus   ?? "",
    equity:        o.equity        ?? "",
    equityNotes:   o.equityNotes   || "",
    ptoWeeks:      o.ptoWeeks      ?? "",
    benefitsNotes: o.benefitsNotes || "",
    startDate:     o.startDate     || "",
    location:      o.location      || "",
    remoteFlex:    o.remoteFlex    || "",
    decisionBy:    o.decisionBy    || "",
    notes:         o.notes         || "",
  };
}

function toNumber(v) {
  if (v === "" || v == null) return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function offerDetailsHasContent(o) {
  const norm = normalizeOfferDetails(o);
  return Object.entries(norm).some(([k, v]) => {
    if (k === "bonusType") return false; // always defaulted
    return v != null && String(v).trim() !== "";
  });
}

// Annualized total comp estimate (base + bonus target + equity/yr + sign-on/4 as rough annualization).
// Returns null when base salary is missing so the UI can render "—".
export function computeOfferTotal(offer) {
  const o = normalizeOfferDetails(offer);
  const base = toNumber(o.baseSalary);
  if (base == null) return null;
  const bonus = toNumber(o.bonusTarget) || 0;
  const equity = toNumber(o.equity) || 0;
  const signOn = toNumber(o.signOnBonus) || 0;
  return base + bonus + equity + signOn / 4; // amortize sign-on over 4 yrs
}

// Build rows for the side-by-side compare table — one row per app.
export function getOfferCompareRows(offerApps = []) {
  return offerApps
    .map(app => {
      const o = normalizeOfferDetails(app.offerDetails);
      return {
        appId: app.id,
        company: app.company || "—",
        title: app.title || "",
        receivedDate: o.receivedDate,
        base: toNumber(o.baseSalary),
        bonus: toNumber(o.bonusTarget),
        bonusType: o.bonusType,
        signOn: toNumber(o.signOnBonus),
        equity: toNumber(o.equity),
        equityNotes: o.equityNotes,
        pto: toNumber(o.ptoWeeks),
        benefits: o.benefitsNotes,
        start: o.startDate,
        location: o.location,
        remoteFlex: o.remoteFlex,
        decisionBy: o.decisionBy,
        notes: o.notes,
        total: computeOfferTotal(app.offerDetails),
      };
    })
    .sort((a, b) => {
      if (a.total == null && b.total == null) return 0;
      if (a.total == null) return 1;
      if (b.total == null) return -1;
      return b.total - a.total;
    });
}

export function formatCurrency(n) {
  if (n == null) return "—";
  return "$" + Math.round(n).toLocaleString("en-US");
}

export const STAR_COMPETENCIES = [
  "Problem solving",
  "Customer communication",
  "Cross-functional collaboration",
  "Technical troubleshooting",
  "Process improvement",
  "Leadership",
  "Adaptability",
  "Ownership",
  // Strength-anchored — map to Chase's CliftonStrengths Top 5.
  "Conflict reduction (Harmony)",
  "Coaching & enablement (Developer)",
  "Consistency & fairness (Consistency)",
  "Pattern recognition (Context)",
  "Tailored communication (Individualization)",
];

export function blankStarStory() {
  return {
    id: generateId(),
    title: "",
    competency: "",
    situation: "",
    task: "",
    action: "",
    result: "",
    takeaway: "",
  };
}

export function normalizeStarStories(stories = []) {
  if (!Array.isArray(stories)) return [];
  return stories.map(story => ({
    id: story.id || generateId(),
    title: story.title || "",
    competency: story.competency || "",
    situation: story.situation || "",
    task: story.task || "",
    action: story.action || "",
    result: story.result || "",
    takeaway: story.takeaway || "",
  }));
}

export function getWeeklyVelocityData(applications = [], weeksBack = 8) {
  const weeks = [];
  const now = new Date();
  // Find Monday of current week
  const dayOfWeek = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  for (let i = weeksBack - 1; i >= 0; i--) {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const count = applications.filter(app => {
      if (!app.appliedDate) return false;
      const d = new Date(app.appliedDate + "T00:00:00");
      return d >= weekStart && d < weekEnd;
    }).length;

    const label = i === 0
      ? "This wk"
      : `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

    weeks.push({ weekStart: weekStart.toISOString().slice(0, 10), label, count, isCurrent: i === 0 });
  }
  return weeks;
}

export function getOutcomeAnalytics(applications = []) {
  const closed = applications.filter(app => ["Offer", "Rejected", "Withdrawn"].includes(app.stage));
  const counts = {
    Offer: closed.filter(app => app.stage === "Offer").length,
    Rejected: closed.filter(app => app.stage === "Rejected").length,
    Withdrawn: closed.filter(app => app.stage === "Withdrawn").length,
  };
  const total = closed.length;
  return {
    total,
    counts,
    rates: {
      Offer: total ? Math.round((counts.Offer / total) * 100) : 0,
      Rejected: total ? Math.round((counts.Rejected / total) * 100) : 0,
      Withdrawn: total ? Math.round((counts.Withdrawn / total) * 100) : 0,
    },
  };
}
export function blankContact() {
  return {
    id: generateId(), name: "", company: "", role: "", email: "", linkedin: "",
    lastContact: "", notes: "", appIds: [],
    // v8.4 networking fields
    type: "other", outreachStatus: "none", outreachDate: "",
    source: "linkedin", companySize: "", industry: "", isHiring: false,
    // v8.10 — outreach touchpoint history (Wave 4 #3)
    outreachLog: [],
  };
}

// ── EMAIL PARSING ─────────────────────────────────────────────────────────────
export function parseRecruiterEmail(raw) {
  const text = raw || "";

  // All email addresses in the text
  const allEmails = [...text.matchAll(/[\w.+'-]+@[\w-]+\.[a-z]{2,}/gi)].map(m => m[0]);
  // Prefer a non-personal-provider address as the sender
  const senderEmail = allEmails.find(e => !/gmail|yahoo|outlook|hotmail|icloud|me\.com|proton/i.test(e)) || allEmails[0] || "";

  // Company: from email domain (strip TLD, capitalize)
  let company = "";
  if (senderEmail) {
    const domain = senderEmail.split("@")[1] || "";
    const base = domain.split(".")[0];
    company = base.charAt(0).toUpperCase() + base.slice(1);
  }
  // Override with explicit "at <Company>" or "@ <Company>" patterns
  const atMatch = text.match(/(?:recruiter|talent|hiring|sourcer).*?(?:at|@)\s+([A-Z][A-Za-z0-9& ]{1,40})/);
  if (atMatch) company = atMatch[1].trim();

  // Name: "From: Name <email>" header first
  let name = "";
  const fromHeader = text.match(/^From:\s*"?([^"<\n]+)"?\s*(?:<|$)/im);
  if (fromHeader) name = fromHeader[1].trim();
  // Signature fallback: "Best,\nJohn Smith"
  if (!name) {
    const sig = text.match(/(?:Best|Regards|Thanks|Cheers|Sincerely|Warm regards),?\s*\n+\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
    if (sig) name = sig[1].trim();
  }

  // LinkedIn profile URL
  const liMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/([\w%-]+)/i);
  const linkedin = liMatch ? `https://linkedin.com/in/${liMatch[1]}` : "";

  // Job title: various recruiter phrase patterns
  let jobTitle = "";
  const titlePatterns = [
    /(?:for (?:a|an|the)\s+)([\w ]{3,50}?)(?:\s+(?:role|position|opportunity|opening|job))/i,
    /(?:opening for (?:a|an|the)\s+)([\w ]{3,50})/i,
    /(?:hiring (?:a|an|the)\s+)([\w ]{3,50})/i,
    /Subject:[^\n]*?((?:[A-Z][a-z]+ ){1,3}(?:Manager|Engineer|Director|Lead|Analyst|Designer|Developer|Specialist|Coordinator|Consultant|VP|Head))/,
  ];
  for (const p of titlePatterns) {
    const m = text.match(p);
    if (m) { jobTitle = m[1].trim(); break; }
  }

  // Job posting URL: prefer ATS domains
  const atsUrl = text.match(/https?:\/\/[^\s<>)"]+(?:lever\.co|greenhouse\.io|workday|ashby|rippling|myworkday|taleo|icims|jobvite|smartrecruiters)[^\s<>)"']*/i);
  const genericJobUrl = text.match(/https?:\/\/[^\s<>)"']+(?:job|career|position|apply|opening)[^\s<>)"']*/i);
  const jobUrl = (atsUrl || genericJobUrl || [])[0] || "";

  // Recruiter's own role (e.g. "I'm a Senior Recruiter at...")
  let role = "";
  const roleMatch = text.match(/I(?:'m| am) (?:a |an )?([\w ]{3,40}?) at\b/i);
  if (roleMatch) role = roleMatch[1].trim();
  if (!role && (senderEmail || name)) role = "Recruiter";

  return { name, email: senderEmail, company, role, jobTitle, linkedin, jobUrl };
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
      "Go to Apply Tools → Tailor Resume — paste the JD, copy the prompt into ChatGPT or Claude, paste the tailored resume into your template",
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
      "Go to Apply Tools → LinkedIn → Connection Request, select the contact, copy the prompt, paste the draft from your assistant",
      "Send the connection request with your note",
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
      "Go to Apply Tools → LinkedIn → Follow-up, copy the prompt and draft a message in your assistant",
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
  { category: "Networking & Informational Interviews", color: "#22d3ee", items: [
    { title: "Informational interview script", desc: "Lead: \"I'd love 15 minutes to learn how you got to [role] — no pitch, no ask, just learning.\" End with: \"If anyone on your team is worth me meeting, I'd appreciate an intro.\" Short, no hype, zero pressure.", url: "" },
    { title: "Payments-adjacent target list", desc: "Primary IC/SE targets: Stripe, Adyen, Checkout.com, Finix, Rainforest Pay, Spreedly, Fiserv, FIS, Braintree, NMI, Worldpay, Global Payments. Secondary (dev-tools): Vercel, Supabase, Clerk, Neon, Retool, Anthropic.", url: "" },
    { title: "How to ask for an informational interview (First Round Review)", desc: "Reputable free read on framing the ask. Steal the structure, not the language — keep your voice warm and short.", url: "https://review.firstround.com/how-to-ace-an-informational-interview/" },
    { title: "Tactical follow-up rhythm", desc: "Day 0: thank-you note with one specific thing you learned. Day 7: share a link related to what they mentioned. Day 30: short update on your search. No desperation, just signal.", url: "" },
    { title: "Blogs / channels to curate", desc: "Placeholder — 5 slots for Chase to fill: (1) __, (2) __, (3) __, (4) __, (5) __. Lean toward payments infra, dev-tools GTM, or Implementation/SE craft.", url: "" },
  ]},
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
  focusBlock: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 12, overflow: "hidden" },
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
  weeklyRhythm: { background: "#161b27", borderRadius: 12, padding: 16 },
  weekRow: { display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #1f2937", alignItems: "flex-start" },
  weekDay: { fontSize: 12, fontWeight: 600, color: "#6b7280", minWidth: 36, paddingTop: 1 },
  weekTask: { fontSize: 13, color: "#9ca3af", lineHeight: 1.5 },
  resourceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 },
  resourceCard: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 10, padding: 14 },
  resourceTitle: { fontSize: 14, fontWeight: 600, color: "#f3f4f6", marginBottom: 5 },
  resourceDesc: { fontSize: 12, color: "#9ca3af", lineHeight: 1.55 },
  stageBar: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  stagePill: { display: "flex", alignItems: "center", gap: 5, background: "#1f2937", borderRadius: 20, padding: "4px 12px", fontSize: 12 },
  stageDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  stagePillLabel: { color: "#9ca3af" },
  stagePillCount: { color: "#f3f4f6", fontWeight: 600, marginLeft: 2 },
  stageBadge: { display: "flex", alignItems: "center", gap: 5, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 },
  card: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 8 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  cardCompany: { fontWeight: 700, fontSize: 15, color: "#f3f4f6" },
  cardTitle: { fontSize: 13, color: "#9ca3af", marginTop: 2 },
  cardMeta: { fontSize: 12, color: "#6b7280" },
  cardNextStep: { fontSize: 13, color: "#60a5fa", fontStyle: "italic" },
  cardContacts: { display: "flex", flexWrap: "wrap", gap: 4 },
  contactChip: { background: "#312e81", color: "#a5b4fc", fontSize: 11, padding: "2px 8px", borderRadius: 10 },
  appChip: { background: "#1e3a5f", color: "#60a5fa", fontSize: 11, padding: "2px 8px", borderRadius: 10 },
  cardActions: { display: "flex", gap: 6, alignItems: "center", marginTop: 4 },
  stageSelect: { flex: 1, background: "#161b27", border: "1px solid #374151", borderRadius: 6, color: "#d1d5db", fontSize: 12, padding: "4px 6px" },
  actionBtn: { background: "#1f2937", border: "1px solid #374151", color: "#d1d5db", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  actionBtnKit: { background: "#1a2744", border: "none", color: "#60a5fa", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  actionBtnPrep: { background: "#1a2a1a", border: "none", color: "#10b981", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  actionBtnDanger: { background: "#450a0a", border: "none", color: "#f87171", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  archiveSection: { marginTop: 24 },
  archiveSummary: { color: "#6b7280", fontSize: 14, cursor: "pointer", marginBottom: 12 },
  empty: { color: "#4b5563", textAlign: "center", padding: "40px 20px", fontSize: 14 },
  contactList: { display: "flex", flexDirection: "column", gap: 10 },
  contactCard: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 12, padding: 16 },
  contactCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  contactNotes: { fontSize: 13, color: "#9ca3af", marginTop: 4 },
  // Networking stats bar
  statsBar: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  statBox: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 10, padding: "10px 14px", flex: "1 1 120px", minWidth: 100 },
  statNum: { fontSize: 20, fontWeight: 700, color: "#f3f4f6" },
  statLabel: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  // Contact filters
  filterRow: { display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" },
  filterLabel: { fontSize: 12, color: "#6b7280", fontWeight: 500, flexShrink: 0 },
  filterChip: { padding: "4px 12px", borderRadius: 20, border: "1px solid #374151", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: 12 },
  filterChipActive: { background: "#1e3a5f", borderColor: "#3b82f6", color: "#60a5fa" },
  // Company intel view
  ciToggleRow: { display: "flex", gap: 6, marginBottom: 16 },
  ciToggleBtn: { padding: "4px 12px", borderRadius: 20, border: "1px solid #374151", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: 12, fontWeight: 500 },
  ciToggleBtnActive: { background: "#1e3a5f", border: "1px solid #3b82f6", color: "#60a5fa" },
  ciRow: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 12, marginBottom: 8, overflow: "hidden" },
  ciRowHeader: { padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  ciCompanyName: { fontSize: 15, fontWeight: 700, color: "#f3f4f6" },
  ciMeta: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  ciStagePill: { fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 500 },
  ciWarmBadge: { background: "#451a0322", color: "#f59e0b", fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 500, cursor: "pointer", border: "none" },
  ciGhostRow: { background: "#161b27", border: "1px dashed #374151", color: "#6b7280", padding: "12px 16px", borderRadius: 10, marginBottom: 8, fontSize: 13, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 },
  ciCards: { padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 10 },
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
  jobResultCard: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 10, padding: 14 },
  jobResultTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  jobResultTitle: { fontWeight: 600, fontSize: 14, color: "#f3f4f6" },
  jobResultCompany: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  jobResultSnippet: { fontSize: 12, color: "#6b7280", lineHeight: 1.5 },
  jobLink: { background: "#1e3a5f", border: "none", color: "#60a5fa", borderRadius: 6, padding: "4px 10px", fontSize: 12, textDecoration: "none", display: "inline-block" },
  sectionLabel: { fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  profileSectionLabel: { fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 8, paddingTop: 8, borderTop: "1px solid #1f2937" },
  tipBox: { background: "#161b27", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#6b7280" },
  resultBox: { background: "#0c1a0c", border: "1px solid #14532d", borderRadius: 10, overflow: "hidden" },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#14532d22", borderBottom: "1px solid #14532d", fontSize: 13, fontWeight: 600, color: "#6ee7b7" },
  resultText: { padding: 12, fontSize: 12, color: "#d1fae5", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 400, overflowY: "auto", margin: 0, fontFamily: "monospace" },
  copyBtn: { background: "#14532d", border: "none", color: "#6ee7b7", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer" },
  baseResumePreview: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 8, padding: 12, fontSize: 12, color: "#9ca3af", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 400, overflowY: "auto", margin: 0, fontFamily: "monospace" },
  textarea: { width: "100%", background: "#161b27", border: "1px solid #374151", borderRadius: 8, color: "#e5e7eb", fontSize: 13, padding: 10, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 },
  modal: { background: "#161b27", border: "1px solid #374151", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1f2937", fontWeight: 600, fontSize: 15 },
  modalBody: { padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 },
  modalFooter: { display: "flex", gap: 8, padding: "12px 20px", borderTop: "1px solid #1f2937", alignItems: "center" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 4 },
  fieldLabel: { fontSize: 12, color: "#6b7280", fontWeight: 500 },
  input: { background: "#161b27", border: "1px solid #374151", borderRadius: 8, color: "#e5e7eb", fontSize: 13, padding: "8px 10px", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
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
  // Action queue
  aqSection: { marginBottom: 20 },
  aqHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  aqTitle: { fontSize: 15, fontWeight: 700, color: "#f3f4f6" },
  aqBadge: { fontSize: 11, fontWeight: 700, background: "#ef4444", color: "#fff", borderRadius: 20, padding: "2px 8px" },
  aqEmpty: { background: "#0c1a0c", border: "1px solid #14532d", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#6ee7b7", textAlign: "center" },
  aqList: { display: "flex", flexDirection: "column", gap: 6 },
  aqItem: { display: "flex", alignItems: "center", gap: 10, background: "#161b27", borderRadius: 10, padding: "10px 14px" },
  aqItemText: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },
  aqItemTitle: { fontSize: 13, fontWeight: 600, color: "#f3f4f6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  aqItemSub: { fontSize: 11, color: "#6b7280", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  aqActionBtn: { background: "#1f2937", border: "1px solid #374151", color: "#d1d5db", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
  aqLabel: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", padding: "2px 7px", borderRadius: 6, whiteSpace: "nowrap", flexShrink: 0 },
  outreachSection: { marginBottom: 20 },
  outreachHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  outreachTitle: { fontSize: 15, fontWeight: 700, color: "#f3f4f6" },
  outreachCountBadge: { fontSize: 11, fontWeight: 700, background: "#3b82f6", color: "#dbeafe", borderRadius: 20, padding: "2px 8px" },
  outreachEmpty: { background: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#9ca3af", textAlign: "center" },
  outreachList: { display: "flex", flexDirection: "column", gap: 8 },
  outreachItem: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 },
  outreachTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" },
  outreachName: { fontSize: 14, fontWeight: 600, color: "#f3f4f6" },
  outreachReason: { fontSize: 12, color: "#d1d5db" },
  outreachContext: { fontSize: 11, color: "#6b7280" },
  outreachActions: { display: "flex", gap: 6, flexWrap: "wrap" },
  outreachBtnPrimary: { background: "#1e3a5f", border: "none", color: "#60a5fa", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  outreachBtnSecondary: { background: "#1f2937", border: "1px solid #374151", color: "#d1d5db", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
  // Scenario chips
  scenarioRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  scenarioChip: { background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer" },
  scenarioChipActive: { background: "#1e3a5f", border: "1px solid #3b82f6", color: "#60a5fa" },
  // URL paste bar
  urlPasteBar: { display: "flex", gap: 8, marginBottom: 16 },
  urlPasteInput: { flex: 1, background: "#161b27", border: "1px solid #374151", borderRadius: 8, color: "#e5e7eb", fontSize: 13, padding: "8px 12px", fontFamily: "inherit" },
  // Win/loss analytics
  outcomeSection: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 12, padding: 14, marginBottom: 16 },
  outcomeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" },
  outcomeTitle: { fontSize: 14, fontWeight: 700, color: "#f3f4f6" },
  outcomeMeta: { fontSize: 12, color: "#6b7280" },
  outcomeRow: { display: "grid", gridTemplateColumns: "90px 1fr 52px", gap: 10, alignItems: "center", marginBottom: 8 },
  outcomeLabel: { fontSize: 12, color: "#d1d5db" },
  outcomeTrack: { height: 10, borderRadius: 999, background: "#111827", overflow: "hidden" },
  outcomeFill: { height: "100%", borderRadius: 999 },
  outcomeValue: { fontSize: 12, color: "#9ca3af", textAlign: "right" },
  // Next step urgency badge on cards
  urgencyBadge: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", padding: "2px 7px", borderRadius: 6, whiteSpace: "nowrap", flexShrink: 0 },
};

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .card-hover:hover { border-color: #374151 !important; }
  select option { background: #161b27; }
  textarea, input, select { outline: none; }
  textarea:focus, input:focus, select:focus { border-color: #3b82f6 !important; }
  @media (max-width: 700px) {
    div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
  }
`;
