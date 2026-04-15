import { T } from "../../theme";

// ══════════════════════════════════════════════════════════════════════════
// TRACKER SECTIONS
// ══════════════════════════════════════════════════════════════════════════

export const MORNING_SECTIONS = ["sleep", "morning_start"];
export const EVENING_SECTIONS = [
  "med_checkin", "health_lifestyle", "end_of_day"
];
export const ALL_SECTIONS = [...MORNING_SECTIONS, ...EVENING_SECTIONS];

export const SECTION_LABELS = {
  sleep: "🌙 Sleep",
  morning_start: "☀️ Morning Start",
  ocd: "🧠 OCD",
  mood_wellbeing: "💭 Mood & Wellbeing",
  adhd: "⚡ ADHD",
  side_effects: "💊 Side Effects",
  med_checkin: "🩺 Daily Tracker",
  health_lifestyle: "🌿 Health & Lifestyle",
  end_of_day: "🌅 End of Day",
};

// Determine check-in mode by time of day
// After 8pm → evening; before noon → morning; noon–8pm → morning (evening not unlocked yet)
export const getCheckinMode = () => {
  const hour = new Date().getHours();
  return hour >= 20 ? "evening" : "morning";
};

// ── QUOTES ────────────────────────────────────────────────────────────────
export const QUOTES = [
  // Faith / scripture
  { text: "I can do all things through Christ who strengthens me.", source: "Philippians 4:13", tag: "faith" },
  { text: "The Lord is my shepherd; I shall not want.", source: "Psalm 23:1", tag: "faith" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", source: "Joshua 1:9", tag: "faith" },
  { text: "Cast all your anxiety on him because he cares for you.", source: "1 Peter 5:7", tag: "faith" },
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.", source: "Jeremiah 29:11", tag: "faith" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", source: "Proverbs 3:5", tag: "faith" },
  { text: "Come to me, all you who are weary and burdened, and I will give you rest.", source: "Matthew 11:28", tag: "faith" },
  { text: "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning.", source: "Lamentations 3:22–23", tag: "faith" },
  // ADHD / mental health resilience
  { text: "You don't have to be perfect to be worthy of rest.", source: "ADHD wisdom", tag: "adhd" },
  { text: "A bad day with ADHD doesn't erase a good one. The data point is never the whole picture.", source: "Chase's tracker", tag: "adhd" },
  { text: "Medication is a tool, not a crutch. Using a tool well is a skill.", source: "ADHD wisdom", tag: "adhd" },
  { text: "The intention gap is not a character flaw. It's a symptom. Keep showing up.", source: "ADHD wisdom", tag: "adhd" },
  { text: "Showing up is the whole thing. Some days showing up is all there is.", source: "Mental health", tag: "adhd" },
  { text: "OCD lies. The thought is not the truth. The urge is not a command.", source: "ERP principle", tag: "adhd" },
  { text: "Every check-in is a data point for your doctor — not a grade for yourself.", source: "Chase's tracker", tag: "adhd" },
  { text: "Rest is not earned. Rest is required.", source: "Mental health", tag: "adhd" },
  // Stoic / grounding
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", source: "Marcus Aurelius", tag: "stoic" },
  { text: "It's not what happens to you, but how you react to it that matters.", source: "Epictetus", tag: "stoic" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", source: "Marcus Aurelius", tag: "stoic" },
  { text: "The obstacle is the way.", source: "Marcus Aurelius", tag: "stoic" },
  { text: "If it is not right, do not do it. If it is not true, do not say it.", source: "Marcus Aurelius", tag: "stoic" },
  { text: "He who fears death will never do anything worthy of a living man.", source: "Seneca", tag: "stoic" },
  { text: "Begin at once to live, and count each separate day as a separate life.", source: "Seneca", tag: "stoic" },
  { text: "Make the best use of what is in your power, and take the rest as it happens.", source: "Epictetus", tag: "stoic" },
  // Motivational / job search hustle
  { text: "Your background in payments isn't a niche — it's a moat. Very few people understand both the enterprise sales motion and the infrastructure.", source: "Chase's tracker", tag: "hustle" },
  { text: "The job search is a numbers game played with a qualitative edge. Show up, follow up, stand out.", source: "Chase's tracker", tag: "hustle" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", source: "Robert Collier", tag: "hustle" },
  { text: "The most certain way to succeed is always to try just one more time.", source: "Thomas Edison", tag: "hustle" },
  { text: "Hard work beats talent when talent doesn't work hard.", source: "Tim Notke", tag: "hustle" },
  { text: "Your family is watching. Not with judgment — with hope. Give them something to point to.", source: "Chase's tracker", tag: "hustle" },
  { text: "Every great salesperson was once in a job search. This is the rep.", source: "Chase's tracker", tag: "hustle" },
  { text: "Don't count the days. Make the days count.", source: "Muhammad Ali", tag: "hustle" },
];

export function getTodayQuote() {
  const dayIdx = Math.floor(Date.now() / 86400000);
  return QUOTES[dayIdx % QUOTES.length];
}

export const textareaStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: `1.5px solid ${T.border}`, background: T.surface,
  color: T.text, fontSize: 16, fontFamily: "inherit",
  boxSizing: "border-box", resize: "vertical",
};
