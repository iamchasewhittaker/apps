// Wife's words — rotated daily alongside scripture.
// These are direct quotes from her letter. Stored here so Chase can edit/add in Settings.
// Each entry: { text, area } — area ties to a daily minimum for convicting miss messages.

export const WIFE_REMINDERS = [
  {
    text: "You have a little family counting on you.",
    area: "general",
  },
  {
    text: "I need you to look for a job with urgency.",
    area: "jobs",
  },
  {
    text: "You can do better. Please, work hard at finding a job.",
    area: "jobs",
  },
  {
    text: "I can't carry the weight of everything anymore.",
    area: "general",
  },
  {
    text: "Please do more.",
    area: "general",
  },
  {
    text: "Stop making excuses and feeling sorry for yourself. It's not fair.",
    area: "general",
  },
  {
    text: "You are wasting time.",
    area: "time",
  },
  {
    text: "This isn't what I want our life to be like. We can do better.",
    area: "general",
  },
  {
    text: "I need you to go back to work.",
    area: "jobs",
  },
  {
    text: "Put your best foot forward instead of being 'too tired' or 'too busy' to do anything.",
    area: "jobs",
  },
  {
    text: "I don't want to stress about buying our kids a pair of shoes or having enough money for groceries.",
    area: "budget",
  },
  {
    text: "When we first got married you were optimistic and confident and looked forward to the future. I need that person back.",
    area: "wellness",
  },
  {
    text: "Stop making everything harder than it needs to be.",
    area: "general",
  },
  {
    text: "You are great with Reese and Buzz, but I need you to be more than that.",
    area: "general",
  },
  {
    text: "Please, work hard. You can find a job.",
    area: "jobs",
  },
];

// Get today's reminder based on day-of-year rotation
export const getTodayReminder = (customReminders = []) => {
  const all = [...WIFE_REMINDERS, ...customReminders];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return all[dayOfYear % all.length];
};

// Get a reminder tied to a specific missed area
export const getReminderForArea = (area, customReminders = []) => {
  const all = [...WIFE_REMINDERS, ...customReminders];
  const areaMatches = all.filter(r => r.area === area || r.area === "general");
  if (areaMatches.length === 0) return WIFE_REMINDERS[0];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return areaMatches[dayOfYear % areaMatches.length];
};
