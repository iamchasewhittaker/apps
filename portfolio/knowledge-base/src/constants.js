// Storage
export const STORE = "chase_knowledge_base_v1";
export const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || null; } catch { return null; } };
export const save = (data) => { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch {} };

// Seed bookmarks
export const SEED = [
  { id: 1, title: "Claude Docs", url: "https://docs.claude.com", category: "Claude" },
  { id: 2, title: "Claude Code", url: "https://docs.claude.com/en/docs/claude-code/overview", category: "Claude" },
  { id: 3, title: "Claude API", url: "https://docs.claude.com/en/api", category: "Claude" },
  { id: 4, title: "ChatGPT Help", url: "https://help.openai.com", category: "ChatGPT" },
  { id: 5, title: "OpenAI Platform Docs", url: "https://platform.openai.com/docs", category: "ChatGPT" },
  { id: 6, title: "Codex (OpenAI)", url: "https://developers.openai.com/codex", category: "ChatGPT" },
  { id: 7, title: "Gemini API Docs", url: "https://ai.google.dev/gemini-api/docs", category: "Gemini" },
  { id: 8, title: "Gemini App Help", url: "https://support.google.com/gemini", category: "Gemini" },
  { id: 9, title: "Antigravity (Google)", url: "https://antigravity.google/docs", category: "Gemini" },
  { id: 10, title: "Cursor Docs", url: "https://cursor.com/docs", category: "Cursor" },
  { id: 11, title: "Anthropic Prompt Engineering", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview", category: "Prompting" },
  { id: 12, title: "OpenAI Cookbook", url: "https://cookbook.openai.com", category: "Prompting" },
  { id: 13, title: "Google Prompting Guide 101", url: "https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf", category: "Prompting" },
  { id: 14, title: "Learn Prompting", url: "https://learnprompting.org", category: "Prompting" },
  { id: 15, title: "Anthropic Courses (GitHub)", url: "https://github.com/anthropics/courses", category: "Learning" },
  { id: 16, title: "DeepLearning.AI Short Courses", url: "https://www.deeplearning.ai/short-courses", category: "Learning" },
  { id: 17, title: "Aider", url: "https://aider.chat", category: "Dev Tools" },
  { id: 18, title: "Continue.dev", url: "https://continue.dev", category: "Dev Tools" },
  { id: 19, title: "Simon Willison's Blog", url: "https://simonwillison.net", category: "Community" },
  { id: 20, title: "r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI", category: "Community" },
  { id: 21, title: "r/LocalLLaMA", url: "https://www.reddit.com/r/LocalLLaMA", category: "Community" },
  { id: 22, title: "Hacker News", url: "https://news.ycombinator.com", category: "Community" },
  { id: 23, title: "Wellness Tracker", url: "https://wellnes-tracker.vercel.app", category: "My Projects" },
  { id: 24, title: "Job Search HQ", url: "https://job-search-hq.vercel.app", category: "My Projects" },
  { id: 25, title: "App Forge", url: "https://app-forge-fawn.vercel.app", category: "My Projects" },
  { id: 26, title: "RollerTask Tycoon (iOS)", url: "https://github.com/iamchasewhittaker/roller-task-tycoon", category: "My Projects" },
  { id: 27, title: "YNAB Clarity (iOS)", url: "https://github.com/iamchasewhittaker/apps", category: "My Projects" },
  { id: 28, title: "Spend Clarity", url: "https://github.com/iamchasewhittaker/apps", category: "My Projects" },
  { id: 29, title: "Knowledge Base", url: "https://github.com/iamchasewhittaker/apps", category: "My Projects" },
];

// Inline styles (replaces Tailwind classes)
export const s = {
  root: { minHeight: "100vh", background: "#09090b", color: "#f4f4f5", padding: 16, fontFamily: "system-ui, -apple-system, sans-serif" },
  container: { maxWidth: 896, margin: "0 auto" },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 30, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 },
  headerSub: { fontSize: 14, color: "#a1a1aa" },

  // Search row
  searchRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  searchWrap: { position: "relative", flex: 1, minWidth: 200 },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#71717a" },
  searchInput: { width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: 8, paddingLeft: 40, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, color: "#f4f4f5", outline: "none", boxSizing: "border-box" },
  addBtn: { background: "#f4f4f5", color: "#18181b", borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" },

  // Category pills
  pillRow: { display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 },
  pill: { padding: "4px 12px", borderRadius: 9999, fontSize: 12, whiteSpace: "nowrap", border: "1px solid #27272a", background: "#18181b", color: "#d4d4d8", cursor: "pointer" },
  pillActive: { background: "#f4f4f5", color: "#18181b", borderColor: "#f4f4f5" },

  // Add/Edit form
  formCard: { background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: 16, marginBottom: 16 },
  formInput: { width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: 4, padding: "8px 12px", fontSize: 14, color: "#f4f4f5", outline: "none", marginBottom: 8, boxSizing: "border-box" },
  formActions: { display: "flex", gap: 8 },
  formBtnSave: { background: "#10b981", color: "#09090b", borderRadius: 4, padding: "6px 12px", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
  formBtnCancel: { background: "#27272a", color: "#d4d4d8", borderRadius: 4, padding: "6px 12px", fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },

  // Bookmark list
  listWrap: { border: "1px solid #27272a", borderRadius: 8, overflow: "hidden" },
  listRow: { display: "flex", alignItems: "center", gap: 12, padding: 12 },
  listRowBorder: { borderBottom: "1px solid #27272a" },
  categoryBadge: { fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#27272a", color: "#d4d4d8", whiteSpace: "nowrap" },
  linkArea: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" },
  linkTitle: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 },
  linkIcon: { color: "#71717a", flexShrink: 0 },
  actionBtn: { padding: 6, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#a1a1aa", display: "flex", alignItems: "center" },

  // Footer + empty
  footer: { fontSize: 12, color: "#52525b", marginTop: 16, textAlign: "center" },
  empty: { fontSize: 14, color: "#71717a", textAlign: "center", padding: "32px 0" },
};

// CSS for hover effects (can't do inline)
export const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
input:focus { border-color: #52525b !important; }
.kb-row:hover { background: #18181b; }
.kb-row .kb-actions { opacity: 0; transition: opacity 0.15s; }
.kb-row:hover .kb-actions { opacity: 1; }
.kb-add:hover { background: #fff; }
.kb-save:hover { background: #34d399; }
.kb-cancel:hover { background: #3f3f46; }
.kb-pill:hover { border-color: #3f3f46; }
.kb-act:hover { background: #27272a; color: #f4f4f5; }
.kb-del:hover { color: #f87171 !important; }
`;
