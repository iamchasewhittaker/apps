import { EXPANDED_SEED } from "./expandedSeeds.js";
import { TAXONOMY_SEED } from "./taxonomySeeds.js";

// Storage
export const STORE = "chase_knowledge_base_v1";
export const STORE_SEED_VERSION = "chase_knowledge_base_seed_version";
export const SEED_VERSION = 10;

/** Bump when `SEED_FOLDERS` structure changes; triggers folder merge in App. */
export const FOLDER_LAYOUT_VERSION = 1;
export const STORE_FOLDER_LAYOUT_VERSION = "chase_knowledge_base_folder_layout_v";

/** Merge stored folders with canonical seed (by id: update name, parentId, order; keep user-only folders). */
export const mergeFolderTrees = (stored, seed) => {
  if (!stored || stored.length === 0) return [...seed];
  const byId = new Map(stored.map((f) => [f.id, { ...f }]));
  const seedIds = new Set(seed.map((s) => s.id));
  const merged = seed.map((sf) => {
    const cur = byId.get(sf.id);
    return cur ? { ...cur, name: sf.name, parentId: sf.parentId, order: sf.order } : { ...sf };
  });
  for (const f of stored) {
    if (!seedIds.has(f.id)) merged.push({ ...f });
  }
  return merged;
};

const LEGACY_WEB_APP_IDS = new Set([156, 157, 158, 159, 162, 169, 261, 262, 263, 264]);
const LEGACY_IOS_APP_IDS = new Set([160, 161, 163, 164, 165, 166, 167, 168]);

/** Idempotent layout fixes: My Projects split + Community category rename. */
export const migrateLegacyBookmarkLayout = (b) => {
  let x = { ...b };
  if (LEGACY_WEB_APP_IDS.has(b.id) && (b.folderId === "f_my_projects" || b.category === "My Projects")) {
    x = { ...x, folderId: "f_my_projects_web", category: "Web apps" };
  } else if (LEGACY_IOS_APP_IDS.has(b.id) && (b.folderId === "f_my_projects" || b.category === "My Projects")) {
    x = { ...x, folderId: "f_my_projects_ios", category: "iOS apps" };
  }
  if (x.category === "Community") {
    x = { ...x, category: "Newsletters & voices" };
  }
  return x;
};

export const normalizeBookmarkUrl = (b) => {
  let url = String(b.url || "").trim();
  if (!url) return b;
  if (!/^https?:\/\//i.test(url)) url = `https://${url.replace(/^\/+/, "")}`;
  return { ...b, url };
};

/** Optional: map bookmark id → canonical URL from latest seed (one-time URL hygiene). */
export const buildSeedUrlLookup = (seedList) => {
  const m = new Map();
  for (const row of seedList) {
    if (row.id != null && row.url) m.set(row.id, row.url);
  }
  return m;
};

/** Optional id → URL corrections applied once per `STORE_URL_PATCH_VERSION`. */
export const SEED_URL_OVERLAYS = {};

export const STORE_URL_PATCH_VERSION = "chase_knowledge_base_url_patch_v";
export const URL_PATCH_VERSION = 2;

/** On URL patch bump, sync these bookmark ids from current `SEED` URLs (one-time hygiene). */
export const SEED_URL_PATCH_IDS = new Set([396, 397, 425]);

/** Daily Prompt workflow rows — copy-prompt UX in BookmarkRow / home. */
export const DAILY_PROMPT_BOOKMARK_IDS = new Set([265, 266, 267]);
export const load = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE));
    if (!parsed) return null;
    // Migrate old flat array format → { bookmarks, categoryOrder }
    if (Array.isArray(parsed)) return { bookmarks: parsed, categoryOrder: null, folders: null, favorites: [] };
    // Ensure new fields exist
    return {
      bookmarks: parsed.bookmarks || [],
      categoryOrder: parsed.categoryOrder || null,
      folders: parsed.folders || null,
      favorites: parsed.favorites || [],
    };
  } catch { return null; }
};
export const save = (data) => { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch {} };

// Status / importance display constants
export const statusColor = { not_started: "#3f3f46", in_progress: "#2563eb", completed: "#10b981" };
export const statusLabel = { not_started: "Not Started", in_progress: "In Progress", completed: "Completed" };
export const importanceColor = { 0: "#3f3f46", 1: "#3b82f6", 2: "#f59e0b", 3: "#ef4444" };
export const importanceLabel = { 0: "None", 1: "Low", 2: "Medium", 3: "High" };

// Folder hierarchy for seed data
// Maps category name → folder ID for bookmark assignment
const CATEGORY_TO_FOLDER = {
  "Claude": "f_claude", "ChatGPT": "f_chatgpt", "Gemini": "f_gemini",
  "Cursor": "f_cursor", "Perplexity": "f_perplexity", "Prompting": "f_prompting",
  "Swift": "f_swift", "Apple Developer": "f_apple_dev", "iOS Dev": "f_ios_dev",
  "Web Dev": "f_web_dev", "Dev Tools": "f_dev_tools", "GitHub": "f_github",
  "Coding": "f_coding", "Architecture": "f_architecture",
  "Learning": "f_learning",
  "Job Search": "f_job_search", "GMAT": "f_gmat", "Making Money": "f_making_money",
  "Sales Tools": "f_sales_tools",
  "Newsletters & voices": "f_community", "Community": "f_community", "Blogs": "f_blogs", "Reddit": "f_reddit",
  "Low Vision & RP": "f_low_vision", "Gospel Study": "f_gospel", "Tools": "f_tools",
  "Scripting": "f_scripting", "Python": "f_python",
  "Design": "f_design", "Idea Generation": "f_idea_gen",
  "Web apps": "f_my_projects_web",
  "iOS apps": "f_my_projects_ios",
  "Skills & guides": "f_my_projects_skills",
  "My Projects": "f_my_projects_web",
  "Daily Prompts": "f_my_projects_prompts",
  "Theme & Colors": "f_my_projects_theme",
  "Development Details": "f_my_projects_dev",
};
export const categoryToFolderId = (cat) => CATEGORY_TO_FOLDER[cat] || "f_other";

/**
 * Seed policy — AI Tools vs Learning: default is “by job” (daily reference vs structured study).
 * Duplicate URLs are OK when titles clarify intent; use description cross-pointers sparingly.
 */

/** Lowercase unique tags for bookmarks (Forever-notes style cross-links). */
export const normalizeBookmarkTags = (b) => ({
  ...b,
  tags: Array.isArray(b.tags)
    ? [...new Set(b.tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean))]
    : [],
});

export const parseTagsInput = (s) =>
  String(s || "")
    .split(/[,#\s]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

export const SEED_FOLDERS = [
  // Top-level parent folders (My Projects + Job Search + Sales first)
  { id: "f_my_projects", name: "My Projects", parentId: null, order: 0 },
  { id: "f_job_search_parent", name: "Job Search", parentId: null, order: 1 },
  { id: "f_sales_tools_parent", name: "Sales Tools", parentId: null, order: 2 },
  { id: "f_ai_tools", name: "AI Tools", parentId: null, order: 3 },
  { id: "f_apple", name: "Apple", parentId: null, order: 4 },
  { id: "f_web_and_dev", name: "Web & Dev", parentId: null, order: 5 },
  { id: "f_learning_parent", name: "Learning", parentId: null, order: 6 },
  { id: "f_career", name: "Career", parentId: null, order: 7 },
  { id: "f_community_parent", name: "Industry radar", parentId: null, order: 8 },
  { id: "f_life", name: "Life", parentId: null, order: 9 },
  { id: "f_creative", name: "Creative", parentId: null, order: 10 },

  // AI Tools children
  { id: "f_claude", name: "Claude", parentId: "f_ai_tools", order: 0 },
  { id: "f_chatgpt", name: "ChatGPT", parentId: "f_ai_tools", order: 1 },
  { id: "f_gemini", name: "Gemini", parentId: "f_ai_tools", order: 2 },
  { id: "f_cursor", name: "Cursor", parentId: "f_ai_tools", order: 3 },
  { id: "f_perplexity", name: "Perplexity", parentId: "f_ai_tools", order: 4 },
  { id: "f_prompting", name: "Prompting", parentId: "f_ai_tools", order: 5 },

  // Apple children
  { id: "f_swift", name: "Swift", parentId: "f_apple", order: 0 },
  { id: "f_apple_dev", name: "Apple Developer", parentId: "f_apple", order: 1 },
  { id: "f_ios_dev", name: "iOS Dev", parentId: "f_apple", order: 2 },

  // Web & Dev children (Scripting + Python live here)
  { id: "f_web_dev", name: "Web Dev", parentId: "f_web_and_dev", order: 0 },
  { id: "f_dev_tools", name: "Dev Tools", parentId: "f_web_and_dev", order: 1 },
  { id: "f_github", name: "GitHub", parentId: "f_web_and_dev", order: 2 },
  { id: "f_coding", name: "Coding", parentId: "f_web_and_dev", order: 3 },
  { id: "f_scripting", name: "Scripting", parentId: "f_web_and_dev", order: 4 },
  { id: "f_python", name: "Python", parentId: "f_web_and_dev", order: 5 },
  { id: "f_architecture", name: "Architecture", parentId: "f_web_and_dev", order: 6 },

  // Learning child
  { id: "f_learning", name: "Learning", parentId: "f_learning_parent", order: 0 },

  // Job Search (top-level section)
  { id: "f_job_search", name: "Job Search", parentId: "f_job_search_parent", order: 0 },

  // Sales Tools (top-level section)
  { id: "f_sales_tools", name: "Sales Tools", parentId: "f_sales_tools_parent", order: 0 },

  // Career children (GMAT + Making Money only)
  { id: "f_gmat", name: "GMAT", parentId: "f_career", order: 0 },
  { id: "f_making_money", name: "Making Money", parentId: "f_career", order: 1 },

  // Industry radar children (was Community)
  { id: "f_community", name: "Newsletters & voices", parentId: "f_community_parent", order: 0 },
  { id: "f_blogs", name: "Blogs", parentId: "f_community_parent", order: 1 },
  { id: "f_reddit", name: "Reddit", parentId: "f_community_parent", order: 2 },

  // Life children (no Scripting / Python)
  { id: "f_low_vision", name: "Low Vision & RP", parentId: "f_life", order: 0 },
  { id: "f_gospel", name: "Gospel Study", parentId: "f_life", order: 1 },
  { id: "f_tools", name: "Tools", parentId: "f_life", order: 2 },

  // Creative children
  { id: "f_design", name: "Design", parentId: "f_creative", order: 0 },
  { id: "f_idea_gen", name: "Idea Generation", parentId: "f_creative", order: 1 },

  // My Projects children
  { id: "f_my_projects_web", name: "Web apps", parentId: "f_my_projects", order: 0 },
  { id: "f_my_projects_prompts", name: "Daily Prompts", parentId: "f_my_projects", order: 1 },
  { id: "f_my_projects_skills", name: "Skills & guides", parentId: "f_my_projects", order: 2 },
  { id: "f_my_projects_theme", name: "Theme & Colors", parentId: "f_my_projects", order: 3 },
  { id: "f_my_projects_dev", name: "Development Details", parentId: "f_my_projects", order: 4 },
  { id: "f_my_projects_ios", name: "iOS apps", parentId: "f_my_projects", order: 5 },
];

// Seed bookmarks — folderId links each bookmark to its folder in SEED_FOLDERS
export const SEED = [
  // --- Claude (1–9) ---
  { id: 1, title: "Claude Docs", url: "https://docs.anthropic.com", category: "Claude", folderId: "f_claude", description: "Official Anthropic documentation hub for Claude models and APIs" },
  { id: 2, title: "Claude Code", url: "https://docs.anthropic.com/en/docs/claude-code/overview", category: "Claude", folderId: "f_claude", description: "Claude's agentic coding tool for terminals and IDEs" },
  { id: 3, title: "Claude API", url: "https://docs.anthropic.com/en/api", category: "Claude", folderId: "f_claude", description: "REST API reference for integrating Claude into applications" },
  { id: 4, title: "Claude.ai", url: "https://claude.ai", category: "Claude", folderId: "f_claude", description: "Claude's main chat interface for conversation and reasoning tasks" },
  { id: 5, title: "Anthropic Console", url: "https://console.anthropic.com", category: "Claude", folderId: "f_claude", description: "Manage API keys, billing, usage, and Workbench playground" },
  { id: 6, title: "Anthropic Research", url: "https://www.anthropic.com/research", category: "Claude", folderId: "f_claude", description: "Anthropic's AI safety and capabilities research publications" },
  { id: 7, title: "Anthropic News", url: "https://www.anthropic.com/news", category: "Claude", folderId: "f_claude", description: "Official Anthropic blog and product announcements" },
  { id: 8, title: "Claude Status", url: "https://status.anthropic.com", category: "Claude", folderId: "f_claude", description: "Real-time Anthropic service health and incident history" },
  { id: 9, title: "Claude Cookbooks", url: "https://github.com/anthropics/claude-cookbooks", category: "Claude", folderId: "f_claude", description: "Official example notebooks and code recipes for Claude" },

  // --- ChatGPT (10–17) ---
  { id: 10, title: "ChatGPT", url: "https://chatgpt.com", category: "ChatGPT", folderId: "f_chatgpt", description: "OpenAI's main AI chat interface" },
  { id: 11, title: "ChatGPT Help", url: "https://help.openai.com", category: "ChatGPT", folderId: "f_chatgpt", description: "OpenAI help center for ChatGPT and API support" },
  { id: 12, title: "OpenAI Platform Docs", url: "https://platform.openai.com/docs", category: "ChatGPT", folderId: "f_chatgpt", description: "Developer docs for OpenAI models, fine-tuning, and APIs" },
  { id: 13, title: "OpenAI Playground", url: "https://platform.openai.com/playground", category: "ChatGPT", folderId: "f_chatgpt", description: "Interactive browser-based testing for OpenAI models" },
  { id: 14, title: "OpenAI Developer Forum", url: "https://community.openai.com", category: "ChatGPT", folderId: "f_chatgpt", description: "Official developer community Q&A and discussion" },
  { id: 15, title: "OpenAI Blog", url: "https://openai.com/blog", category: "ChatGPT", folderId: "f_chatgpt", description: "OpenAI research announcements and product updates" },
  { id: 16, title: "OpenAI Status", url: "https://status.openai.com", category: "ChatGPT", folderId: "f_chatgpt", description: "Real-time OpenAI service health and incident history" },
  { id: 17, title: "OpenAI Cookbook", url: "https://cookbook.openai.com", category: "ChatGPT", folderId: "f_chatgpt", description: "Official code examples and guides for OpenAI APIs" },

  // --- Gemini (18–25) ---
  { id: 18, title: "Gemini API Docs", url: "https://ai.google.dev/gemini-api/docs", category: "Gemini", folderId: "f_gemini", description: "Official Gemini API reference and quickstarts" },
  { id: 19, title: "Google AI Studio", url: "https://aistudio.google.com", category: "Gemini", folderId: "f_gemini", description: "Browser-based playground for prototyping with Gemini models" },
  { id: 20, title: "Gemini App", url: "https://gemini.google.com", category: "Gemini", folderId: "f_gemini", description: "Google's main Gemini chat interface" },
  { id: 21, title: "Gemini App Help", url: "https://support.google.com/gemini", category: "Gemini", folderId: "f_gemini", description: "Support docs for the Gemini consumer app" },
  { id: 22, title: "NotebookLM", url: "https://notebooklm.google.com", category: "Gemini", folderId: "f_gemini", description: "Google's AI research assistant grounded in your uploaded sources" },
  { id: 23, title: "Google Colab", url: "https://colab.research.google.com", category: "Gemini", folderId: "f_gemini", description: "Free hosted Jupyter notebooks with GPU access" },
  { id: 24, title: "Gemini Cookbook", url: "https://github.com/google-gemini/cookbook", category: "Gemini", folderId: "f_gemini", description: "Official Gemini API example notebooks and guides" },
  { id: 25, title: "Google AI Blog", url: "https://blog.google/technology/ai", category: "Gemini", folderId: "f_gemini", description: "Google's AI announcements, research, and product updates" },

  // --- Cursor (26–29) ---
  { id: 26, title: "Cursor Docs", url: "https://cursor.com/docs", category: "Cursor", folderId: "f_cursor", description: "Official documentation for the Cursor AI code editor" },
  { id: 27, title: "Cursor Blog", url: "https://cursor.com/blog", category: "Cursor", folderId: "f_cursor", description: "Cursor product announcements and engineering posts" },
  { id: 28, title: "Cursor Changelog", url: "https://cursor.com/changelog", category: "Cursor", folderId: "f_cursor", description: "Running list of Cursor releases and feature updates" },
  { id: 29, title: "Cursor Forum", url: "https://forum.cursor.com", category: "Cursor", folderId: "f_cursor", description: "Official Cursor community for support and discussion" },

  // --- Perplexity (30–34) ---
  { id: 30, title: "Perplexity", url: "https://perplexity.ai", category: "Perplexity", folderId: "f_perplexity", description: "AI-powered search engine with cited, conversational answers" },
  { id: 31, title: "Perplexity API Docs", url: "https://docs.perplexity.ai", category: "Perplexity", folderId: "f_perplexity", description: "API reference for Perplexity's Sonar search models" },
  { id: 32, title: "Perplexity Guides", url: "https://perplexity.ai/hub", category: "Perplexity", folderId: "f_perplexity", description: "Perplexity blog, product announcements, and guides" },
  { id: 33, title: "Perplexity Changelog", url: "https://perplexity.ai/changelog", category: "Perplexity", folderId: "f_perplexity", description: "Recent Perplexity product updates and new features" },
  { id: 34, title: "Perplexity Help Center", url: "https://perplexity.ai/help-center/en", category: "Perplexity", folderId: "f_perplexity", description: "Support docs for Perplexity accounts and features" },

  // --- Prompting (35–38) ---
  { id: 35, title: "Anthropic Prompt Engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", category: "Prompting", folderId: "f_prompting", description: "Anthropic's official guide to writing effective prompts for Claude" },
  { id: 36, title: "OpenAI Cookbook", url: "https://cookbook.openai.com", category: "Prompting", folderId: "f_prompting", description: "Code examples and prompting recipes for OpenAI models" },
  { id: 37, title: "Google Prompting Guide 101", url: "https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf", category: "Prompting", folderId: "f_prompting", description: "Google's beginner-to-intermediate prompting guide for Gemini" },
  { id: 38, title: "Learn Prompting", url: "https://learnprompting.org", category: "Prompting", folderId: "f_prompting", description: "Free open-source guide to prompt engineering across all major models" },

  // --- Learning (39–46) ---
  { id: 39, title: "Anthropic Courses", url: "https://github.com/anthropics/courses", category: "Learning", folderId: "f_learning", description: "Official Anthropic structured courses on Claude and the API" },
  { id: 40, title: "DeepLearning.AI Short Courses", url: "https://www.deeplearning.ai/short-courses", category: "Learning", folderId: "f_learning", description: "Free bite-sized AI courses from Andrew Ng and top AI labs" },
  { id: 41, title: "Hugging Face Learn", url: "https://huggingface.co/learn", category: "Learning", folderId: "f_learning", description: "Official courses on LLMs, agents, diffusion, and MCP from Hugging Face" },
  { id: 42, title: "Fast.ai", url: "https://course.fast.ai", category: "Learning", folderId: "f_learning", description: "Practical, code-first deep learning course; top-down teaching approach" },
  { id: 43, title: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course", category: "Learning", folderId: "f_learning", description: "Free Google course covering ML fundamentals with TensorFlow examples" },
  { id: 44, title: "Vercel AI SDK Docs", url: "https://ai-sdk.dev/docs/introduction", category: "Learning", folderId: "f_learning", description: "Official docs for building AI-powered apps with Vercel's AI SDK" },
  { id: 45, title: "LangChain Docs", url: "https://docs.langchain.com", category: "Learning", folderId: "f_learning", description: "Framework docs for building LLM-powered chains and agents" },
  { id: 46, title: "LlamaIndex Docs", url: "https://docs.llamaindex.ai", category: "Learning", folderId: "f_learning", description: "Docs for the LlamaIndex framework for RAG and data-connected LLM apps" },

  // --- Dev Tools (47–54) ---
  { id: 47, title: "Aider", url: "https://aider.chat", category: "Dev Tools", folderId: "f_dev_tools", description: "AI pair programmer that edits code in your local git repo via CLI" },
  { id: 48, title: "Continue.dev", url: "https://continue.dev", category: "Dev Tools", folderId: "f_dev_tools", description: "Open-source AI coding assistant extension for VS Code and JetBrains" },
  { id: 49, title: "MCP Docs", url: "https://modelcontextprotocol.io", category: "Dev Tools", folderId: "f_dev_tools", description: "Official spec and guides for the Model Context Protocol standard" },
  { id: 50, title: "v0 by Vercel", url: "https://v0.app", category: "Dev Tools", folderId: "f_dev_tools", description: "Vercel's AI tool for generating UI components from text prompts" },
  { id: 51, title: "Windsurf Docs", url: "https://docs.windsurf.com", category: "Dev Tools", folderId: "f_dev_tools", description: "Documentation for Windsurf, Codeium's AI-powered code editor" },
  { id: 52, title: "Ollama", url: "https://ollama.com", category: "Dev Tools", folderId: "f_dev_tools", description: "Run large language models locally on Mac, Linux, and Windows" },
  { id: 53, title: "LM Studio", url: "https://lmstudio.ai", category: "Dev Tools", folderId: "f_dev_tools", description: "GUI app for downloading and running local LLMs with a chat interface" },
  { id: 54, title: "GitHub Copilot Docs", url: "https://docs.github.com/en/copilot", category: "Dev Tools", folderId: "f_dev_tools", description: "Official docs for GitHub Copilot AI coding assistant setup and features" },

  // --- Community (55–62) ---
  { id: 55, title: "Simon Willison's Blog", url: "https://simonwillison.net", category: "Newsletters & voices", folderId: "f_community", description: "Daily AI and developer news from a leading practitioner and OSS author" },
  { id: 56, title: "Latent Space", url: "https://www.latent.space", category: "Newsletters & voices", folderId: "f_community", description: "The top AI engineering podcast and newsletter by swyx and Alessio" },
  { id: 57, title: "TLDR AI", url: "https://tldr.tech/ai", category: "Newsletters & voices", folderId: "f_community", description: "Daily 5-minute newsletter covering the most important AI news" },
  { id: 58, title: "The Batch", url: "https://www.deeplearning.ai/the-batch", category: "Newsletters & voices", folderId: "f_community", description: "Andrew Ng's weekly newsletter on AI research and industry trends" },
  { id: 59, title: "Chip Huyen's Blog", url: "https://huyenchip.com/blog", category: "Newsletters & voices", folderId: "f_community", description: "In-depth writing on ML systems, AI engineering, and production ML" },
  { id: 60, title: "r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI", category: "Newsletters & voices", folderId: "f_community", description: "Reddit community for Claude users and developers" },
  { id: 61, title: "r/LocalLLaMA", url: "https://www.reddit.com/r/LocalLLaMA", category: "Newsletters & voices", folderId: "f_community", description: "Reddit's largest community for running and discussing local LLMs" },
  { id: 62, title: "Hacker News", url: "https://news.ycombinator.com", category: "Newsletters & voices", folderId: "f_community", description: "Tech-focused link aggregator; consistently surfaces important AI news" },

  // --- GitHub (63–70) ---
  { id: 63, title: "GitHub", url: "https://github.com", category: "GitHub", folderId: "f_github", description: "The world's largest code hosting platform for version control and collaboration" },
  { id: 64, title: "GitHub Docs", url: "https://docs.github.com/en", category: "GitHub", folderId: "f_github", description: "Official documentation for all GitHub features, APIs, and workflows" },
  { id: 65, title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", category: "GitHub", folderId: "f_github", description: "CI/CD workflow documentation: syntax, runners, triggers, and reference" },
  { id: 66, title: "GitHub CLI", url: "https://cli.github.com", category: "GitHub", folderId: "f_github", description: "Command-line tool for GitHub: PRs, issues, repos, workflows from the terminal" },
  { id: 67, title: "GitHub Skills", url: "https://skills.github.com", category: "GitHub", folderId: "f_github", description: "Interactive hands-on learning courses using real repos and GitHub Actions" },
  { id: 68, title: "GitHub Blog", url: "https://github.blog", category: "GitHub", folderId: "f_github", description: "Engineering posts, product announcements, and security research from GitHub" },
  { id: 69, title: "GitHub Status", url: "https://www.githubstatus.com", category: "GitHub", folderId: "f_github", description: "Real-time and historical service health across all GitHub systems" },
  { id: 70, title: "GitHub Marketplace", url: "https://github.com/marketplace", category: "GitHub", folderId: "f_github", description: "Actions, apps, and integrations to extend GitHub workflows" },

  // --- Swift (71–78) ---
  { id: 71, title: "Swift.org", url: "https://www.swift.org", category: "Swift", folderId: "f_swift", description: "Official Swift language home: downloads, documentation, and community" },
  { id: 72, title: "Swift Evolution", url: "https://www.swift.org/swift-evolution", category: "Swift", folderId: "f_swift", description: "Accepted and active proposals for Swift language changes by version" },
  { id: 73, title: "Swift Forums", url: "https://forums.swift.org", category: "Swift", folderId: "f_swift", description: "Official Swift community forums for evolution, server, and language discussion" },
  { id: 74, title: "Swift Blog", url: "https://www.swift.org/blog", category: "Swift", folderId: "f_swift", description: "Official Swift release announcements and monthly \"What's New\" posts" },
  { id: 75, title: "Swift Package Index", url: "https://swiftpackageindex.com", category: "Swift", folderId: "f_swift", description: "Apple-backed index of Swift packages with compatibility and build status" },
  { id: 76, title: "swiftlang GitHub Org", url: "https://github.com/swiftlang", category: "Swift", folderId: "f_swift", description: "Open-source home of the Swift compiler, stdlib, and official tooling" },
  { id: 77, title: "Swift on Server", url: "https://www.swift.org/documentation/server", category: "Swift", folderId: "f_swift", description: "Official Swift Server Workgroup guides for Linux deployment and production" },
  { id: 78, title: "Vapor", url: "https://vapor.codes", category: "Swift", folderId: "f_swift", description: "The most widely used Swift web framework for server-side Swift development" },

  // --- Apple Developer (79–87) ---
  { id: 79, title: "Apple Developer Account", url: "https://developer.apple.com/account", category: "Apple Developer", folderId: "f_apple_dev", description: "Manage your Apple Developer Program membership, certificates, and provisioning" },
  { id: 80, title: "SwiftUI Documentation", url: "https://developer.apple.com/documentation/swiftui", category: "Apple Developer", folderId: "f_apple_dev", description: "Apple's full SwiftUI API reference with declarative UI examples" },
  { id: 81, title: "Xcode Documentation", url: "https://developer.apple.com/documentation/xcode", category: "Apple Developer", folderId: "f_apple_dev", description: "Official Xcode IDE docs: build settings, debugging, Instruments, and testing" },
  { id: 82, title: "Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines", category: "Apple Developer", folderId: "f_apple_dev", description: "Apple's design standards for iOS, macOS, watchOS, and visionOS" },
  { id: 83, title: "App Store Connect", url: "https://appstoreconnect.apple.com", category: "Apple Developer", folderId: "f_apple_dev", description: "Manage app submissions, metadata, pricing, and TestFlight builds" },
  { id: 84, title: "WWDC Sessions", url: "https://developer.apple.com/videos", category: "Apple Developer", folderId: "f_apple_dev", description: "Archive of all Apple WWDC and Tech Talk session videos" },
  { id: 85, title: "TestFlight", url: "https://developer.apple.com/testflight", category: "Apple Developer", folderId: "f_apple_dev", description: "Beta testing platform for distributing pre-release iOS and macOS apps" },
  { id: 86, title: "Apple Developer Forums", url: "https://developer.apple.com/forums", category: "Apple Developer", folderId: "f_apple_dev", description: "Official Apple developer Q&A community for platform questions" },
  { id: 87, title: "Swift Documentation", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language", category: "Apple Developer", folderId: "f_apple_dev", description: "The canonical Swift language reference book, always current" },

  // --- iOS Dev (88–94) ---
  { id: 88, title: "Hacking with Swift", url: "https://www.hackingwithswift.com", category: "iOS Dev", folderId: "f_ios_dev", description: "Paul Hudson's encyclopedic iOS site: 100 Days of SwiftUI, SwiftUI by Example" },
  { id: 89, title: "Swift by Sundell", url: "https://www.swiftbysundell.com", category: "iOS Dev", folderId: "f_ios_dev", description: "In-depth articles on Swift patterns, architecture, and SwiftUI best practices" },
  { id: 90, title: "Point-Free", url: "https://www.pointfree.co", category: "iOS Dev", folderId: "f_ios_dev", description: "Advanced Swift video series; creators of The Composable Architecture (TCA)" },
  { id: 91, title: "Kodeco", url: "https://www.kodeco.com", category: "iOS Dev", folderId: "f_ios_dev", description: "Structured SwiftUI learning paths, books, and tutorials from Ray Wenderlich" },
  { id: 92, title: "Use Your Loaf", url: "https://useyourloaf.com", category: "iOS Dev", folderId: "f_ios_dev", description: "Precise, practical iOS/Swift articles on layout, Foundation, and Xcode" },
  { id: 93, title: "WWDC Notes", url: "https://wwdcnotes.com", category: "iOS Dev", folderId: "f_ios_dev", description: "Community-written summaries for every WWDC session, preserving removed talks" },
  { id: 94, title: "TCA (GitHub)", url: "https://github.com/pointfreeco/swift-composable-architecture", category: "iOS Dev", folderId: "f_ios_dev", description: "The Composable Architecture: leading opinionated iOS architecture library" },

  // --- Web Dev (95–101) ---
  { id: 95, title: "React Docs", url: "https://react.dev", category: "Web Dev", folderId: "f_web_dev", description: "Official React documentation, fully rewritten with hooks-first interactive examples" },
  { id: 96, title: "MDN Web Docs", url: "https://developer.mozilla.org", category: "Web Dev", folderId: "f_web_dev", description: "The authoritative HTML, CSS, and JavaScript reference from Mozilla" },
  { id: 97, title: "JavaScript.info", url: "https://javascript.info", category: "Web Dev", folderId: "f_web_dev", description: "Deep guide to modern JavaScript from fundamentals to advanced async patterns" },
  { id: 98, title: "web.dev", url: "https://web.dev", category: "Web Dev", folderId: "f_web_dev", description: "Google's platform for Core Web Vitals, performance, PWA, and accessibility" },
  { id: 99, title: "CSS-Tricks", url: "https://css-tricks.com", category: "Web Dev", folderId: "f_web_dev", description: "Comprehensive CSS almanac with the best Flexbox and Grid guides available" },
  { id: 100, title: "Can I Use", url: "https://caniuse.com", category: "Web Dev", folderId: "f_web_dev", description: "Browser support tables for every web platform feature and API" },
  { id: 101, title: "Bundlephobia", url: "https://bundlephobia.com", category: "Web Dev", folderId: "f_web_dev", description: "Check npm package bundle sizes before installing to protect app performance" },

  // --- Coding (102–106) ---
  { id: 102, title: "Exercism", url: "https://exercism.org", category: "Coding", folderId: "f_coding", description: "82-language coding tracks with mentor feedback; great for Swift and JS" },
  { id: 103, title: "Codewars", url: "https://www.codewars.com", category: "Coding", folderId: "f_coding", description: "Kata-style coding challenges ranked by difficulty with community solutions" },
  { id: 104, title: "Advent of Code", url: "https://adventofcode.com", category: "Coding", folderId: "f_coding", description: "Annual December puzzle series with archives; excellent for Swift practice" },
  { id: 105, title: "Project Euler", url: "https://projecteuler.net", category: "Coding", folderId: "f_coding", description: "800+ math-heavy programming problems for deepening algorithmic thinking" },
  { id: 106, title: "Grind 75", url: "https://www.techinterviewhandbook.org/grind75", category: "Coding", folderId: "f_coding", description: "Customizable curated LeetCode problem set; better ROI than Blind 75" },

  // --- Design (107–115) ---
  { id: 107, title: "Refactoring UI", url: "https://www.refactoringui.com", category: "Design", folderId: "f_design", description: "The essential design book for developers: hierarchy, spacing, color, typography" },
  { id: 108, title: "Nielsen Norman Group", url: "https://www.nngroup.com/articles", category: "Design", folderId: "f_design", description: "1,100+ free research-backed UX articles; the gold standard for interaction design" },
  { id: 109, title: "Figma Learn", url: "https://help.figma.com", category: "Design", folderId: "f_design", description: "Official Figma courses and tutorials from beginner to advanced; free" },
  { id: 110, title: "Coolors", url: "https://coolors.co", category: "Design", folderId: "f_design", description: "The fastest color palette generator; spacebar to iterate, includes contrast checker" },
  { id: 111, title: "WebAIM Contrast Checker", url: "https://webaim.org/resources/contrastchecker", category: "Design", folderId: "f_design", description: "Instant WCAG 2.1 AA/AAA contrast ratio checking for any color pair" },
  { id: 112, title: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge", category: "Design", folderId: "f_design", description: "Typography theory and type-pairing guidance alongside Google's free font library" },
  { id: 113, title: "Mobbin", url: "https://mobbin.com", category: "Design", folderId: "f_design", description: "400,000+ searchable real iOS and web app screenshots for UI pattern research" },
  { id: 114, title: "Dribbble", url: "https://dribbble.com", category: "Design", folderId: "f_design", description: "Designer portfolio community for visual style and UI aesthetic exploration" },
  { id: 115, title: "Figma Design Systems", url: "https://www.figma.com/resource-library/design-system-examples", category: "Design", folderId: "f_design", description: "Curated real-world design system examples from Figma's resource library" },

  // --- Architecture (116–119) ---
  { id: 116, title: "Refactoring Guru", url: "https://refactoring.guru", category: "Architecture", folderId: "f_architecture", description: "Visual language-agnostic guide to all 23 GoF design patterns and refactoring" },
  { id: 117, title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", category: "Architecture", folderId: "f_architecture", description: "The most-referenced free guide to large-scale system design with diagrams" },
  { id: 118, title: "ByteByteGo", url: "https://blog.bytebytego.com", category: "Architecture", folderId: "f_architecture", description: "Weekly visual system design deep dives from Alex Xu (System Design Interview author)" },
  { id: 119, title: "Awesome Software Architecture", url: "https://github.com/mehdihadeli/awesome-software-architecture", category: "Architecture", folderId: "f_architecture", description: "Curated articles, videos, and resources on architecture patterns and principles" },

  // --- Job Search (120–141) ---
  { id: 120, title: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs", category: "Job Search", folderId: "f_job_search", description: "The largest professional job network; essential for recruiter visibility and networking" },
  { id: 121, title: "Wellfound", url: "https://wellfound.com", category: "Job Search", folderId: "f_job_search", description: "Startup-focused job board with 150K+ tech roles and salary transparency" },
  { id: 122, title: "Dice", url: "https://www.dice.com", category: "Job Search", folderId: "f_job_search", description: "Tech-only job board with high signal for engineering and data science roles" },
  { id: 123, title: "Built In", url: "https://builtin.com", category: "Job Search", folderId: "f_job_search", description: "Tech company profiles with full benefit, culture, and stack details plus job listings" },
  { id: 124, title: "We Work Remotely", url: "https://weworkremotely.com", category: "Job Search", folderId: "f_job_search", description: "Top remote-first job board, heavily weighted toward software engineering roles" },
  { id: 125, title: "aijobs.ai", url: "https://aijobs.ai", category: "Job Search", folderId: "f_job_search", description: "Leading specialized board for AI, ML, and data science roles" },
  { id: 126, title: "Teal HQ", url: "https://www.tealhq.com", category: "Job Search", folderId: "f_job_search", description: "All-in-one job tracker, resume builder, and JD keyword matcher" },
  { id: 127, title: "Jobscan", url: "https://www.jobscan.co", category: "Job Search", folderId: "f_job_search", description: "ATS optimization tool that scores your resume against a job description" },
  { id: 128, title: "LeetCode", url: "https://leetcode.com", category: "Job Search", folderId: "f_job_search", description: "Industry-standard coding practice platform with 3,000+ problems and company tags" },
  { id: 129, title: "NeetCode", url: "https://neetcode.io", category: "Job Search", folderId: "f_job_search", description: "Curated NeetCode 150 problem list with best-in-class video explanations" },
  { id: 130, title: "AlgoMonster", url: "https://algo.monster", category: "Job Search", folderId: "f_job_search", description: "Pattern-based algorithm learning with interactive content; structured alternative to grinding" },
  { id: 131, title: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org", category: "Job Search", folderId: "f_job_search", description: "Free comprehensive guide covering coding, system design, and behavioral interviews" },
  { id: 132, title: "ByteByteGo System Design", url: "https://bytebytego.com", category: "Job Search", folderId: "f_job_search", description: "Alex Xu's animated system design video explainers and newsletter" },
  { id: 133, title: "Hello Interview", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction", category: "Job Search", folderId: "f_job_search", description: "FAANG hiring manager-built system design crash course" },
  { id: 134, title: "Levels.fyi", url: "https://www.levels.fyi", category: "Job Search", folderId: "f_job_search", description: "The most trusted source for real total compensation data at tech companies" },
  { id: 135, title: "Glassdoor", url: "https://www.glassdoor.com", category: "Job Search", folderId: "f_job_search", description: "Salary data, company reviews, and interview experience reports" },
  { id: 136, title: "Blind", url: "https://www.teamblind.com", category: "Job Search", folderId: "f_job_search", description: "Anonymous verified-employee community for candid salary data and company intel" },
  { id: 137, title: "MentorCruise", url: "https://mentorcruise.com", category: "Job Search", folderId: "f_job_search", description: "Platform to find paid mentors who are senior engineers at top companies" },
  { id: 138, title: "Crunchbase", url: "https://www.crunchbase.com", category: "Job Search", folderId: "f_job_search", description: "Funding rounds, investor data, and growth metrics for startup research" },
  { id: 139, title: "Pragmatic Engineer", url: "https://newsletter.pragmaticengineer.com", category: "Job Search", folderId: "f_job_search", description: "Gergely Orosz's newsletter on tech company internals and engineering culture" },
  { id: 140, title: "Kaggle", url: "https://www.kaggle.com", category: "Job Search", folderId: "f_job_search", description: "ML competition platform that doubles as a portfolio builder for data science roles" },
  { id: 141, title: "Interviewing.io", url: "https://interviewing.io", category: "Job Search", folderId: "f_job_search", description: "Anonymous mock technical interviews with FAANG-level senior engineers" },

  // --- GMAT (142–153) ---
  { id: 142, title: "GMAT Official Site", url: "https://www.mba.com/exams/gmat-exam", category: "GMAT", folderId: "f_gmat", description: "The official GMAT Focus Edition registration, score reports, and exam info" },
  { id: 143, title: "GMAT Official Prep", url: "https://www.mba.com/exams/gmat-exam/prep-for-the-exam", category: "GMAT", folderId: "f_gmat", description: "Official GMAT prep hub with free practice exams 1 and 2 and strategy guides" },
  { id: 144, title: "GMAT Official Guide 2025-2026", url: "https://www.mba.com/exam-prep/gmat-official-guide-2025-2026-ebook-and-online-question-bank", category: "GMAT", folderId: "f_gmat", description: "Latest official guide with 975+ authentic Focus Edition questions" },
  { id: 145, title: "Target Test Prep", url: "https://gmat.targettestprep.com", category: "GMAT", folderId: "f_gmat", description: "Highly rated GMAT prep platform with AI assist and deep analytics" },
  { id: 146, title: "Manhattan Prep GMAT", url: "https://www.manhattanprep.com/gmat", category: "GMAT", folderId: "f_gmat", description: "2,300+ practice questions with adaptive study calendar and bite-sized lessons" },
  { id: 147, title: "Magoosh GMAT", url: "https://gmat.magoosh.com", category: "GMAT", folderId: "f_gmat", description: "Budget-friendly prep with 200+ video lessons, fully updated for Focus Edition" },
  { id: 148, title: "GMAT Club", url: "https://gmatclub.com", category: "GMAT", folderId: "f_gmat", description: "The largest GMAT community with forums, free mock tests, and score tools" },
  { id: 149, title: "GMAT Club Free Mocks", url: "https://gmatclub.com/gmat-focus-tests", category: "GMAT", folderId: "f_gmat", description: "Free adaptive GMAT Focus Edition mock tests mirroring the official interface" },
  { id: 150, title: "r/GMAT", url: "https://www.reddit.com/r/GMAT", category: "GMAT", folderId: "f_gmat", description: "Active Reddit community for score reports, study strategy, and resource recommendations" },
  { id: 151, title: "e-GMAT Study Plan", url: "https://e-gmat.com/blogs/gmat-focus-study-plan", category: "GMAT", folderId: "f_gmat", description: "Free structured GMAT Focus Edition study plan with section strategy" },
  { id: 152, title: "GMAT Club Score Calculator", url: "https://gmatclub.com/forum/gmat-focus-score-calculator-418782.html", category: "GMAT", folderId: "f_gmat", description: "Free tool to convert section scores to total Focus Edition score with percentiles" },
  { id: 153, title: "GMAT Club Error Log", url: "https://gmatclub.com/blog/gmat-club-error-log-the-best-tool-for-gmat-preparation", category: "GMAT", folderId: "f_gmat", description: "Free error log tool that auto-saves timed practice and tracks question patterns" },

  // --- Tools (154–155) ---
  { id: 154, title: "Sunsama", url: "https://sunsama.com", category: "Tools", folderId: "f_tools", description: "Daily planning tool that pulls from Linear, GitHub, and calendars into one view", tags: ["sunsama", "planning"] },
  { id: 155, title: "Linear", url: "https://linear.app", category: "Tools", folderId: "f_tools", description: "Fast, opinionated project and issue tracker built for software teams", tags: ["linear", "issues"] },

  // --- My Projects (156–169) ---
  { id: 156, title: "Wellness Tracker", url: "https://wellness-tracker-kappa.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Personal wellness check-in and habit tracker web app" },
  { id: 157, title: "Job Search HQ", url: "https://job-search-hq.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Job search pipeline and application tracker web app" },
  { id: 158, title: "App Forge", url: "https://app-forge-fawn.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "App idea generator and product planning tool web app" },
  { id: 159, title: "Knowledge Base", url: "https://knowledge-base-beta-five.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "This bookmark manager and personal knowledge base" },
  { id: 160, title: "RollerTask Tycoon (iOS)", url: "https://github.com/iamchasewhittaker/roller-task-tycoon", category: "iOS apps", folderId: "f_my_projects_ios", description: "Task management iOS app with gamification elements" },
  { id: 161, title: "YNAB Clarity (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/ynab-clarity-ios", category: "iOS apps", folderId: "f_my_projects_ios", description: "iOS app for YNAB budget review and category funding" },
  { id: 162, title: "Spend Clarity", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/spend-clarity", category: "Web apps", folderId: "f_my_projects_web", description: "Python CLI tool for enriching YNAB transactions from Gmail receipts" },
  { id: 163, title: "ClarityUI (Swift pkg)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-ui", category: "iOS apps", folderId: "f_my_projects_ios", description: "Shared SwiftUI component library used across the Clarity iOS app suite" },
  { id: 164, title: "Clarity Check-in (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-checkin-ios", category: "iOS apps", folderId: "f_my_projects_ios", description: "Daily wellness check-in iOS app with mood, meds, and scripture tracking" },
  { id: 165, title: "Clarity Triage (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-triage-ios", category: "iOS apps", folderId: "f_my_projects_ios", description: "iOS app for capacity planning: tasks, ideas, and wins" },
  { id: 166, title: "Clarity Time (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-time-ios", category: "iOS apps", folderId: "f_my_projects_ios", description: "iOS app for time session tracking and scripture streak" },
  { id: 167, title: "Clarity Budget (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-budget-ios", category: "iOS apps", folderId: "f_my_projects_ios", description: "iOS app for dual-scenario budget planning and wants tracking" },
  { id: 168, title: "Clarity Growth (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-growth-ios", category: "iOS apps", folderId: "f_my_projects_ios", description: "iOS app for tracking 7 growth areas with streaks and progress" },
  { id: 169, title: "AI Dev Mastery", url: "https://github.com/iamchasewhittaker/apps/tree/main/projects/ai-dev-mastery", category: "Web apps", folderId: "f_my_projects_web", description: "AI developer course viewer app" },

  // --- Scripting (170–177) ---
  { id: 170, title: "Shortcuts User Guide", url: "https://support.apple.com/guide/shortcuts/welcome/ios", category: "Scripting", folderId: "f_scripting", description: "Apple's official guide to creating and using Shortcuts on iOS and Mac" },
  { id: 171, title: "ShortcutsGallery", url: "https://shortcutsgallery.com", category: "Scripting", folderId: "f_scripting", description: "Curated collection of downloadable iOS Shortcuts organized by category" },
  { id: 172, title: "RoutineHub", url: "https://routinehub.co", category: "Scripting", folderId: "f_scripting", description: "Community sharing platform for iOS Shortcuts with versioning and updates" },
  { id: 173, title: "r/shortcuts", url: "https://www.reddit.com/r/shortcuts", category: "Scripting", folderId: "f_scripting", description: "Reddit community for sharing and troubleshooting iOS Shortcuts" },
  { id: 174, title: "Apps Script Reference", url: "https://developers.google.com/apps-script/reference", category: "Scripting", folderId: "f_scripting", description: "Official Google Apps Script API reference for Sheets, Docs, Drive, and Gmail" },
  { id: 175, title: "Apps Script Guides", url: "https://developers.google.com/apps-script/overview", category: "Scripting", folderId: "f_scripting", description: "Google Apps Script getting-started guides and quickstarts" },
  { id: 176, title: "Clasp (GitHub)", url: "https://github.com/google/clasp", category: "Scripting", folderId: "f_scripting", description: "Google's CLI for developing and deploying Apps Script projects locally" },
  { id: 177, title: "Ben Collins Apps Script", url: "https://www.benlcollins.com/apps-script", category: "Scripting", folderId: "f_scripting", description: "Practical Google Apps Script tutorials focused on Sheets automation" },

  // --- Python (178–185) ---
  { id: 178, title: "Python Docs", url: "https://docs.python.org/3", category: "Python", folderId: "f_python", description: "Official Python 3 documentation and standard library reference" },
  { id: 179, title: "Real Python", url: "https://realpython.com", category: "Python", folderId: "f_python", description: "In-depth Python tutorials, guides, and best practices for all levels" },
  { id: 180, title: "PyPI", url: "https://pypi.org", category: "Python", folderId: "f_python", description: "The Python Package Index — official repo for third-party packages" },
  { id: 181, title: "Click Docs", url: "https://click.palletsprojects.com", category: "Python", folderId: "f_python", description: "Documentation for Click, the Python package for creating CLI interfaces" },
  { id: 182, title: "Typer Docs", url: "https://typer.tiangolo.com", category: "Python", folderId: "f_python", description: "Documentation for Typer, the modern Python CLI framework built on Click" },
  { id: 183, title: "Rich Docs", url: "https://rich.readthedocs.io", category: "Python", folderId: "f_python", description: "Documentation for Rich, the Python library for beautiful terminal output" },
  { id: 184, title: "Ruff Docs", url: "https://docs.astral.sh/ruff", category: "Python", folderId: "f_python", description: "Documentation for Ruff, the fast Python linter and formatter" },
  { id: 185, title: "uv Docs", url: "https://docs.astral.sh/uv", category: "Python", folderId: "f_python", description: "Documentation for uv, the fast Python package and project manager" },

  // --- Blogs (186–195) ---
  { id: 186, title: "Vercel Blog", url: "https://vercel.com/blog", category: "Blogs", folderId: "f_blogs", description: "Vercel product announcements, Next.js updates, and frontend engineering" },
  { id: 187, title: "Next.js Blog", url: "https://nextjs.org/blog", category: "Blogs", folderId: "f_blogs", description: "Official Next.js release notes, RFCs, and framework deep dives" },
  { id: 188, title: "The Pragmatic Engineer", url: "https://blog.pragmaticengineer.com", category: "Blogs", folderId: "f_blogs", description: "Gergely Orosz on engineering culture, career growth, and big tech internals" },
  { id: 189, title: "Overreacted", url: "https://overreacted.io", category: "Blogs", folderId: "f_blogs", description: "Dan Abramov's blog on React internals and programming philosophy" },
  { id: 190, title: "Kent C. Dodds Blog", url: "https://kentcdodds.com/blog", category: "Blogs", folderId: "f_blogs", description: "Practical posts on React testing, patterns, and frontend best practices" },
  { id: 191, title: "Julia Evans Blog", url: "https://jvns.ca", category: "Blogs", folderId: "f_blogs", description: "Approachable deep dives on networking, Linux, debugging, and systems" },
  { id: 192, title: "Daring Fireball", url: "https://daringfireball.net", category: "Blogs", folderId: "f_blogs", description: "John Gruber's commentary on Apple, design, and the tech industry" },
  { id: 193, title: "NSHipster", url: "https://nshipster.com", category: "Blogs", folderId: "f_blogs", description: "Detailed articles on overlooked Swift, Objective-C, and Apple framework APIs" },
  { id: 194, title: "Fatbobman", url: "https://fatbobman.com/en", category: "Blogs", folderId: "f_blogs", description: "In-depth SwiftUI and Core Data articles" },
  { id: 195, title: "Swift by Sundell", url: "https://swiftbysundell.com", category: "Blogs", folderId: "f_blogs", description: "Weekly Swift articles, tips, and podcast on iOS development" },

  // --- Reddit (196–207) ---
  { id: 196, title: "r/programming", url: "https://www.reddit.com/r/programming", category: "Reddit", folderId: "f_reddit", description: "General programming news, articles, and discussion" },
  { id: 197, title: "r/webdev", url: "https://www.reddit.com/r/webdev", category: "Reddit", folderId: "f_reddit", description: "Web development discussion covering frontend, backend, and tooling" },
  { id: 198, title: "r/reactjs", url: "https://www.reddit.com/r/reactjs", category: "Reddit", folderId: "f_reddit", description: "React community for news, questions, and ecosystem discussion" },
  { id: 199, title: "r/iOSProgramming", url: "https://www.reddit.com/r/iOSProgramming", category: "Reddit", folderId: "f_reddit", description: "iOS and SwiftUI development community" },
  { id: 200, title: "r/Python", url: "https://www.reddit.com/r/Python", category: "Reddit", folderId: "f_reddit", description: "Python news, projects, and discussion for all levels" },
  { id: 201, title: "r/MachineLearning", url: "https://www.reddit.com/r/MachineLearning", category: "Reddit", folderId: "f_reddit", description: "Academic and industry ML research discussion and paper reviews" },
  { id: 202, title: "r/ExperiencedDevs", url: "https://www.reddit.com/r/ExperiencedDevs", category: "Reddit", folderId: "f_reddit", description: "Career and technical discussion for senior-level engineers" },
  { id: 203, title: "r/SwiftUI", url: "https://www.reddit.com/r/SwiftUI", category: "Reddit", folderId: "f_reddit", description: "SwiftUI-focused community for code examples and tips" },
  { id: 204, title: "r/ynab", url: "https://www.reddit.com/r/ynab", category: "Reddit", folderId: "f_reddit", description: "~200k-member YNAB budgeting community — strategies and troubleshooting" },
  { id: 205, title: "r/personalfinance", url: "https://www.reddit.com/r/personalfinance", category: "Reddit", folderId: "f_reddit", description: "19M-member community for budgeting, investing, debt, and retirement" },
  { id: 206, title: "r/cscareerquestions", url: "https://www.reddit.com/r/cscareerquestions", category: "Reddit", folderId: "f_reddit", description: "CS career advice — resumes, interviews, offers, and career transitions" },
  { id: 207, title: "r/SideProject", url: "https://www.reddit.com/r/SideProject", category: "Reddit", folderId: "f_reddit", description: "Community for sharing and getting feedback on side projects" },

  // --- Low Vision & RP (208–217) ---
  { id: 208, title: "Foundation Fighting Blindness", url: "https://www.fightingblindness.org", category: "Low Vision & RP", folderId: "f_low_vision", description: "Leading US nonprofit funding RP and inherited retinal disease research" },
  { id: 209, title: "NEI — Retinitis Pigmentosa", url: "https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinitis-pigmentosa", category: "Low Vision & RP", folderId: "f_low_vision", description: "NIH's authoritative RP fact sheet covering symptoms, genetics, and research" },
  { id: 210, title: "Retina International", url: "https://retina-international.org", category: "Low Vision & RP", folderId: "f_low_vision", description: "Global umbrella org connecting national RP patient groups" },
  { id: 211, title: "ClinicalTrials.gov — RP", url: "https://clinicaltrials.gov/search?cond=Retinitis+Pigmentosa", category: "Low Vision & RP", folderId: "f_low_vision", description: "Live NIH database of all open and completed RP trials worldwide" },
  { id: 212, title: "Apple Accessibility — Vision", url: "https://www.apple.com/accessibility/vision/", category: "Low Vision & RP", folderId: "f_low_vision", description: "Apple's built-in vision features: VoiceOver, Magnifier, Display Accommodations" },
  { id: 213, title: "AppleVis", url: "https://www.applevis.com", category: "Low Vision & RP", folderId: "f_low_vision", description: "Community resource for blind and low vision Apple users — app reviews and guides" },
  { id: 214, title: "Hadley", url: "https://hadleyhelps.org", category: "Low Vision & RP", folderId: "f_low_vision", description: "Free online workshops and courses for adults with vision loss" },
  { id: 215, title: "APH ConnectCenter", url: "https://aphconnectcenter.org", category: "Low Vision & RP", folderId: "f_low_vision", description: "American Printing House hub: VisionAware guides, CareerConnect, FamilyConnect" },
  { id: 216, title: "r/blind", url: "https://www.reddit.com/r/blind", category: "Low Vision & RP", folderId: "f_low_vision", description: "Reddit community for blind and low vision users — tech tips and support" },
  { id: 217, title: "r/retinitispigmentosa", url: "https://www.reddit.com/r/retinitispigmentosa", category: "Low Vision & RP", folderId: "f_low_vision", description: "RP-specific subreddit for lived experience, gene therapy updates, peer support" },

  // --- Tools additions (218–222) ---
  { id: 218, title: "YNAB", url: "https://app.ynab.com", category: "Tools", folderId: "f_tools", description: "YNAB web app — zero-based budgeting where you assign every dollar a job", tags: ["ynab", "budget"] },
  { id: 219, title: "YNAB API Docs", url: "https://api.ynab.com", category: "Tools", folderId: "f_tools", description: "Official YNAB REST API reference — primary ref for YNAB Clarity and Spend Clarity", tags: ["ynab", "docs", "api"] },
  { id: 220, title: "YNAB Python SDK", url: "https://github.com/ynab/ynab-sdk-python", category: "Tools", folderId: "f_tools", description: "Official Python client for the YNAB API", tags: ["ynab", "api", "python"] },
  { id: 221, title: "YNAB Blog", url: "https://www.ynab.com/blog", category: "Tools", folderId: "f_tools", description: "Official YNAB blog with budgeting guides and product updates", tags: ["ynab", "blog"] },
  { id: 222, title: "The YNAB Method", url: "https://www.ynab.com/ynab-method", category: "Tools", folderId: "f_tools", description: "The four-rule budgeting framework: Give Every Dollar a Job, Embrace True Expenses", tags: ["ynab", "method"] },

  // --- Job Search additions (223–228) ---
  { id: 223, title: "Work at a Startup (YC)", url: "https://www.workatastartup.com", category: "Job Search", folderId: "f_job_search", description: "Y Combinator's job board — direct access to funded YC startups hiring engineers" },
  { id: 224, title: "Welcome to the Jungle", url: "https://us.welcometothejungle.com", category: "Job Search", folderId: "f_job_search", description: "Recommendation-driven job board with deep company culture profiles (formerly Otta)" },
  { id: 225, title: "Remotive", url: "https://remotive.com", category: "Job Search", folderId: "f_job_search", description: "Curated remote-only job board with 150k+ vetted listings" },
  { id: 226, title: "Peerlist", url: "https://peerlist.io", category: "Job Search", folderId: "f_job_search", description: "Professional network for builders — integrates GitHub and Product Hunt into one portfolio" },
  { id: 227, title: "Candor", url: "https://candor.co/negotiation", category: "Job Search", folderId: "f_job_search", description: "Salary negotiation coaching — pay only if they increase your offer" },
  { id: 228, title: "Rora", url: "https://www.teamrora.com", category: "Job Search", folderId: "f_job_search", description: "Career coaching and salary negotiation for senior technical talent" },

  // --- Making Money (229–238) ---
  { id: 229, title: "Indie Hackers", url: "https://www.indiehackers.com", category: "Making Money", folderId: "f_making_money", description: "Community for bootstrapped founders — interviews, revenue sharing, and forums" },
  { id: 230, title: "MicroConf", url: "https://microconf.com", category: "Making Money", folderId: "f_making_money", description: "Conference and community for self-funded SaaS founders" },
  { id: 231, title: "levels.io", url: "https://levels.io", category: "Making Money", folderId: "f_making_money", description: "Pieter Levels' blog on building profitable solo products" },
  { id: 232, title: "RevenueCat Docs", url: "https://www.revenuecat.com/docs", category: "Making Money", folderId: "f_making_money", description: "Industry-standard SDK for iOS/Android subscription management and paywalls" },
  { id: 233, title: "Lemon Squeezy", url: "https://www.lemonsqueezy.com", category: "Making Money", folderId: "f_making_money", description: "Sell software, templates, and digital products — handles global tax as merchant of record" },
  { id: 234, title: "Gumroad", url: "https://gumroad.com", category: "Making Money", folderId: "f_making_money", description: "Classic creator platform for selling ebooks, courses, templates, and downloads" },
  { id: 235, title: "Beehiiv", url: "https://www.beehiiv.com", category: "Making Money", folderId: "f_making_money", description: "Newsletter platform with 0% fee on paid subscriptions (vs Substack's 10%)" },
  { id: 236, title: "Contra", url: "https://contra.com", category: "Making Money", folderId: "f_making_money", description: "Commission-free freelance network — keep 100% of earnings" },
  { id: 237, title: "Product Hunt", url: "https://www.producthunt.com", category: "Making Money", folderId: "f_making_money", description: "Launch platform for new products — visibility and community feedback" },
  { id: 238, title: "awesome-indie (GitHub)", url: "https://github.com/mezod/awesome-indie", category: "Making Money", folderId: "f_making_money", description: "Curated mega-list of resources for developers making money from code" },

  // --- Gospel Study (239–251) ---
  { id: 239, title: "Gospel Library", url: "https://www.churchofjesuschrist.org/study?lang=eng", category: "Gospel Study", folderId: "f_gospel", description: "Web version of Gospel Library — scriptures, manuals, Conference talks, and annotations" },
  { id: 240, title: "Come Follow Me Hub", url: "https://www.churchofjesuschrist.org/learn/come-follow-me?lang=eng", category: "Gospel Study", folderId: "f_gospel", description: "Official landing page for all Come Follow Me resources and curriculum" },
  { id: 241, title: "Come Follow Me 2026 Manual", url: "https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026?lang=eng", category: "Gospel Study", folderId: "f_gospel", description: "Official weekly study manual — Old Testament for 2026" },
  { id: 242, title: "Leader and Clerk Resources (LCR)", url: "https://lcr.churchofjesuschrist.org", category: "Gospel Study", folderId: "f_gospel", description: "Secure tool for clerks and leaders — membership, finances, callings, and reports" },
  { id: 243, title: "General Handbook", url: "https://www.churchofjesuschrist.org/study/manual/general-handbook?lang=eng", category: "Gospel Study", folderId: "f_gospel", description: "Complete online policy and instruction handbook for Church leaders" },
  { id: 244, title: "My Calling as a Ward Clerk", url: "https://www.churchofjesuschrist.org/study/manual/my-calling-as-a-ward-clerk?lang=eng", category: "Gospel Study", folderId: "f_gospel", description: "Official step-by-step guide covering every ward clerk responsibility" },
  { id: 245, title: "Church Tech Forum — Clerks", url: "https://tech.churchofjesuschrist.org/forum/viewforum.php?f=42", category: "Gospel Study", folderId: "f_gospel", description: "Official community forum for clerks — LCR, finance tools, records, new-clerk help" },
  { id: 246, title: "Scripture Central — CFM", url: "https://scripturecentral.org/come-follow-me", category: "Gospel Study", folderId: "f_gospel", description: "Free weekly Come Follow Me study helps with articles, videos, and KnoWhy insights" },
  { id: 247, title: "Don't Miss This", url: "https://www.dontmissthisstudy.com", category: "Gospel Study", folderId: "f_gospel", description: "Weekly CFM video and study guide by David Butler and Emily Belle Freeman" },
  { id: 248, title: "followHIM Podcast", url: "https://followhim.co", category: "Gospel Study", folderId: "f_gospel", description: "Weekly CFM podcast with Hank Smith and John Bytheway featuring scripture scholars" },
  { id: 249, title: "BYU Religious Studies Center", url: "https://rsc.byu.edu", category: "Gospel Study", folderId: "f_gospel", description: "4,000+ free scholarly articles and commentaries on scriptures and Church history" },
  { id: 250, title: "Scripture Notes", url: "https://scripturenotes.com", category: "Gospel Study", folderId: "f_gospel", description: "Advanced personal scripture study tool with cross-referencing and linked notes" },
  { id: 251, title: "r/latterdaysaints", url: "https://www.reddit.com/r/latterdaysaints", category: "Gospel Study", folderId: "f_gospel", description: "Largest faithful Latter-day Saint community on Reddit" },

  // --- Idea Generation (252–260) ---
  { id: 252, title: "Ideaflow", url: "https://ideaflow.app", category: "Idea Generation", folderId: "f_idea_gen", description: "AI-powered notebook for frictionless idea capture — voice, hashtags, AI search" },
  { id: 253, title: "Whimsical", url: "https://whimsical.com", category: "Idea Generation", folderId: "f_idea_gen", description: "Clean visual canvas for mind maps, flowcharts, wireframes, and user flows" },
  { id: 254, title: "Miro", url: "https://miro.com", category: "Idea Generation", folderId: "f_idea_gen", description: "Collaborative online whiteboard for brainstorming, workshops, and diagramming" },
  { id: 255, title: "Exploding Topics", url: "https://explodingtopics.com", category: "Idea Generation", folderId: "f_idea_gen", description: "Surfaces rapidly growing topics and niches before they peak" },
  { id: 256, title: "Paul Graham Essays", url: "https://www.paulgraham.com/articles.html", category: "Idea Generation", folderId: "f_idea_gen", description: "Foundational essays on startup ideas, including \"How to Get Startup Ideas\"" },
  { id: 257, title: "The Idea Machine (Altucher)", url: "https://archive.jamesaltucher.com/blog/the-ultimate-guide-for-becoming-an-idea-machine", category: "Idea Generation", folderId: "f_idea_gen", description: "The \"10 ideas a day\" practice for building your creative idea muscle" },
  { id: 258, title: "IDEO Design Thinking", url: "https://designthinking.ideo.com", category: "Idea Generation", folderId: "f_idea_gen", description: "Human-centered ideation framework: Empathize, Define, Ideate, Prototype, Test" },
  { id: 259, title: "Taskade", url: "https://www.taskade.com", category: "Idea Generation", folderId: "f_idea_gen", description: "AI workspace where agents brainstorm ideas and route them into project boards" },
  { id: 260, title: "Google Trends", url: "https://trends.google.com", category: "Idea Generation", folderId: "f_idea_gen", description: "Free tool to explore search interest over time — validate idea demand" },

  // --- My Projects additions (261–264) ---
  { id: 261, title: "Clarity Command", url: "https://clarity-command.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Daily accountability hub focused on faith, family, and high-priority execution" },
  { id: 262, title: "Clarity Hub", url: "https://clarity-hub-lilac.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Unified hub for Check-in, Triage, Time, Budget, and Growth workflows" },
  { id: 263, title: "YNAB Clarity Web", url: "https://ynab-clarity-web.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Standalone YNAB dashboard split out from Clarity Hub for budgeting focus" },
  { id: 264, title: "RollerTask Tycoon Web", url: "https://rollertask-tycoon-web.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Standalone tasks-and-points web tracker split out from Clarity Hub" },

  // --- Daily Prompts (265–267) ---
  {
    id: 265,
    title: "Daily Email Triage Prompt",
    url: "https://mail.google.com",
    category: "Daily Prompts",
    folderId: "f_my_projects_prompts",
    description: "Opens Gmail — the prompt text is below; use Copy prompt. See Skills & guides for Cursor skills + app doc map.",
    notes: "You are my executive email assistant. Review today's inbox and produce: 1) critical replies to send today, 2) quick wins under 2 minutes, 3) messages to defer with a proposed reply date, and 4) draft replies for the top 3 priority emails in my tone.\n\n(Sidebar → My Projects → Skills & guides for skills index and portfolio documentation map.)"
  },
  {
    id: 266,
    title: "Daily Planning Prompt",
    url: "https://app.sunsama.com",
    category: "Daily Prompts",
    folderId: "f_my_projects_prompts",
    description: "Opens Sunsama — prompt in notes; use Copy prompt. Skills & guides has your skills + per-app doc map.",
    notes: "Act as my planning coach. Given my tasks, calendar, and current energy level, build a realistic day plan with: top 3 outcomes, time-boxed focus blocks, admin block, communication block, and one buffer block. Flag any overload and suggest what to cut.\n\n(Skills & guides folder in My Projects links the Cursor skills index and portfolio documentation map.)"
  },
  {
    id: 267,
    title: "End-of-Day Review Prompt",
    url: "https://linear.app",
    category: "Daily Prompts",
    folderId: "f_my_projects_prompts",
    description: "Opens Linear — prompt in notes; use Copy prompt. See Skills & guides for skills + app docs.",
    notes: "Run an end-of-day review using my completed and open tasks. Return: wins, blockers, carry-overs, and tomorrow's first task. Then write a short standup-style summary I can paste into my planning notes.\n\n(Skills & guides in My Projects → Cursor Skills index + Portfolio docs by app.)"
  },

  // --- Theme & Colors (268–270) ---
  { id: 268, title: "Portfolio App Branding Template", url: "https://github.com/iamchasewhittaker/apps/blob/main/docs/templates/PORTFOLIO_APP_BRANDING.md", category: "Theme & Colors", folderId: "f_my_projects_theme", description: "Canonical template for app visual identity, palette, and brand decisions" },
  { id: 269, title: "Clarity iOS App Icon Spec", url: "https://github.com/iamchasewhittaker/apps/blob/main/docs/design/CLARITY_IOS_APP_ICON_SPEC.md", category: "Theme & Colors", folderId: "f_my_projects_theme", description: "Shared icon geometry and visual system used across Clarity iOS apps" },
  { id: 270, title: "Wellness Branding Reference", url: "https://github.com/iamchasewhittaker/apps/blob/main/portfolio/wellness-tracker/docs/BRANDING.md", category: "Theme & Colors", folderId: "f_my_projects_theme", description: "Reference implementation of Clarity palette and product-level design guidance" },
  { id: 274, title: "Portfolio App Logo Template", url: "https://github.com/iamchasewhittaker/apps/blob/main/docs/templates/PORTFOLIO_APP_LOGO.md", category: "Theme & Colors", folderId: "f_my_projects_theme", description: "Standard text-based logo format for all apps: SVG templates, accent color palette, sizing guide, and PNG generation instructions" },

  // --- Development Details (271–273) ---
  { id: 271, title: "Portfolio HANDOFF", url: "https://github.com/iamchasewhittaker/apps/blob/main/HANDOFF.md", category: "Development Details", folderId: "f_my_projects_dev", description: "Current development focus, next steps, and session continuity notes" },
  { id: 272, title: "Portfolio Root ROADMAP", url: "https://github.com/iamchasewhittaker/apps/blob/main/ROADMAP.md", category: "Development Details", folderId: "f_my_projects_dev", description: "Cross-app roadmap and priority queue for planning what ships next" },
  { id: 273, title: "Product Build Framework", url: "https://github.com/iamchasewhittaker/apps/blob/main/PRODUCT_BUILD_FRAMEWORK.md", category: "Development Details", folderId: "f_my_projects_dev", description: "Standard product build phases used to define and ship apps consistently" },
  // --- My Projects additions (275–281) ---
  { id: 275, title: "Ash Reader", url: "https://ash-reader.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Mobile tool for chunking and copying the capture system ChatGPT conversation into Ash for therapeutic processing" },
  { id: 276, title: "Shipyard", url: "https://shipyard-l6ywr3psg-iamchasewhittakers-projects.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Fleet command center — tracks all portfolio projects, compliance, and status in one dashboard" },
  { id: 277, title: "Funded Web", url: "https://funded-web.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Standalone YNAB dashboard for budget review and category funding" },
  { id: 278, title: "Summit Push", url: "https://summit-push.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Daily OS for ADHD brains: 4 fixed lanes, lane lock, one-at-a-time focus — mountain-themed accountability" },
  { id: 279, title: "Spend Radar Web", url: "https://spend-radar-web.vercel.app", category: "Web apps", folderId: "f_my_projects_web", description: "Read-only dashboard for Gmail receipt scanning and subscription tracking" },
  { id: 280, title: "Gmail Forge", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/gmail-forge", category: "Web apps", folderId: "f_my_projects_web", description: "DIY Gmail automation: XML filters + Apps Script + Chrome extension for inbox management" },
  { id: 281, title: "Talk to Ash", url: "https://www.talktoash.com", category: "Tools", folderId: "f_tools", description: "Ash — AI mental health companion; the app used to process capture system conversation chunks" },

  ...EXPANDED_SEED,
  ...TAXONOMY_SEED,
];

// Inline styles (replaces Tailwind classes)
export const s = {
  root: { height: "100vh", background: "#0f1117", color: "#f3f4f6", fontFamily: "'DM Sans', system-ui, sans-serif", display: "flex", overflow: "hidden" },

  // ── Layout ──────────────────────────────────────────────────────────────────
  sidebar: {
    width: 280, flexShrink: 0, background: "#0f1117", borderRight: "1px solid #1f2937",
    display: "flex", flexDirection: "column", height: "100vh", overflowY: "hidden",
    transition: "width 0.2s ease",
  },
  sidebarCollapsed: {
    width: 48, flexShrink: 0, background: "#0f1117", borderRight: "1px solid #1f2937",
    display: "flex", flexDirection: "column", alignItems: "center", height: "100vh",
    overflowY: "hidden", transition: "width 0.2s ease",
  },
  content: { flex: 1, padding: "20px 24px", overflowY: "auto", height: "100vh" },

  // ── Sidebar internals ────────────────────────────────────────────────────────
  sidebarHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 12px 10px", borderBottom: "1px solid #1f2937" },
  sidebarTitle: { fontSize: 13, fontWeight: 700, color: "#f3f4f6", letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  sidebarToggleBtn: { padding: 6, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#71717a", display: "flex", alignItems: "center", minHeight: 32 },
  sidebarSearchWrap: { position: "relative", margin: "10px 10px 4px" },
  sidebarSearchIcon: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#52525b" },
  sidebarSearchInput: { width: "100%", background: "#161b27", border: "1px solid #1f2937", borderRadius: 8, paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, fontSize: 13, color: "#f3f4f6", outline: "none", boxSizing: "border-box" },
  sidebarSection: { padding: "8px 8px 4px" },
  sidebarSectionLabel: { fontSize: 10, fontWeight: 600, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4, paddingLeft: 4 },
  sidebarActBtn: { padding: 4, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#52525b", display: "flex", alignItems: "center" },
  sidebarFooter: { padding: "8px 10px 12px", borderTop: "1px solid #1f2937" },
  sidebarAddBtn: { width: "100%", background: "#161b27", color: "#d4d4d8", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 500, border: "1px solid #1f2937", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 36 },

  // Smart folders
  smartFolderBtn: { width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", color: "#d4d4d8", fontSize: 13, textAlign: "left", minHeight: 32, marginBottom: 1 },
  smartFolderName: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  // Favorites shelf
  favsList: { display: "flex", flexDirection: "column", gap: 1 },
  favItem: { display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 6, textDecoration: "none", color: "#d4d4d8", fontSize: 12, minHeight: 28 },
  favTitle: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  // Folder tree rows
  folderTree: { paddingBottom: 8 },
  folderRow: { display: "flex", alignItems: "center", gap: 4, paddingRight: 6, borderRadius: 6, cursor: "pointer", minHeight: 32, marginBottom: 1 },
  folderChevronBtn: { padding: "4px 2px", border: "none", background: "transparent", cursor: "pointer", color: "#52525b", display: "flex", alignItems: "center", flexShrink: 0, minHeight: 28 },
  folderNameBtn: { flex: 1, display: "flex", alignItems: "center", gap: 6, border: "none", background: "transparent", cursor: "pointer", color: "#d4d4d8", fontSize: 13, textAlign: "left", overflow: "hidden", minHeight: 32, padding: 0 },
  folderIcon: { color: "#71717a", flexShrink: 0 },
  folderName: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 },
  folderCount: { fontSize: 11, color: "#52525b", background: "#1f2937", padding: "1px 5px", borderRadius: 9999, flexShrink: 0 },
  folderMoreBtn: { padding: 4, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#52525b", display: "flex", alignItems: "center", flexShrink: 0, opacity: 0, minHeight: 24 },
  allBooksBtn: { width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 12px", borderRadius: 6, border: "none", cursor: "pointer", marginBottom: 4, minHeight: 32 },

  // Collapsed sidebar icons
  collapsedIconBtn: { width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", borderRadius: 8, marginBottom: 2, background: "transparent" },
  collapsedFavBtn: { width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, textDecoration: "none", marginBottom: 2 },

  // ── Content area ─────────────────────────────────────────────────────────────
  contentHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  contentTitle: { fontSize: 22, fontWeight: 700, color: "#f3f4f6" },
  contentSubtitle: { fontSize: 13, color: "#71717a", marginTop: 2 },
  mobileMenuBtn: { padding: 8, borderRadius: 8, border: "1px solid #1f2937", background: "#161b27", cursor: "pointer", color: "#6b7280", display: "none" },

  // Mobile overlay backdrop
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99 },
  sidebarOverlay: { position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 },

  // ── Home view cards ───────────────────────────────────────────────────────────
  homeSection: { marginBottom: 32 },
  homeSectionTitle: { fontSize: 13, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 },
  homeCardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 },
  homeCard: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 8, padding: "10px 14px", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 4, cursor: "pointer" },
  homeCardTitle: { fontSize: 13, fontWeight: 500, color: "#f3f4f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  homeCardDesc: { fontSize: 12, color: "#71717a", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  homeCardMeta: { fontSize: 11, color: "#52525b", marginTop: 2 },

  // Folder context menu
  contextMenu: { position: "fixed", background: "#161b27", border: "1px solid #1f2937", borderRadius: 8, padding: "4px 0", zIndex: 200, minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" },
  contextMenuItem: { width: "100%", padding: "8px 14px", border: "none", background: "transparent", cursor: "pointer", color: "#d4d4d8", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 8, minHeight: 36 },

  // Search results
  searchResultPath: { fontSize: 11, color: "#52525b", marginBottom: 2 },

  // Remaining original styles
  container: { maxWidth: 896, margin: "0 auto" },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 30, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 },
  headerSub: { fontSize: 14, color: "#6b7280" },

  // Search row
  searchRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  searchWrap: { position: "relative", flex: 1, minWidth: 200 },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#71717a" },
  searchInput: { width: "100%", background: "#161b27", border: "1px solid #1f2937", borderRadius: 8, paddingLeft: 40, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, color: "#f3f4f6", outline: "none", boxSizing: "border-box" },
  addBtn: { background: "#f3f4f6", color: "#161b27", borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" },

  // Category toggle button
  catToggleBtn: { background: "#161b27", color: "#d4d4d8", borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500, border: "1px solid #1f2937", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" },
  catToggleBtnActive: { background: "#1f2937", color: "#f3f4f6", borderColor: "#3f3f46" },

  // Category manager panel
  catManagerCard: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 8, padding: 12, marginBottom: 16 },
  catManagerHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #1f2937" },
  catManagerTitle: { fontSize: 13, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  catManagerResetBtn: { fontSize: 12, color: "#71717a", background: "transparent", border: "1px solid #1f2937", borderRadius: 4, padding: "3px 8px", cursor: "pointer" },
  catManagerRow: { display: "flex", alignItems: "center", gap: 8, padding: "6px 4px", borderRadius: 4 },
  catManagerName: { flex: 1, fontSize: 14, color: "#f3f4f6", cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  catManagerCount: { fontSize: 11, color: "#52525b", background: "#1f2937", padding: "1px 6px", borderRadius: 9999, flexShrink: 0 },
  catManagerBtn: { padding: 5, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#71717a", display: "flex", alignItems: "center" },
  catManagerInput: { flex: 1, background: "#0f1117", border: "1px solid #52525b", borderRadius: 4, padding: "3px 8px", fontSize: 14, color: "#f3f4f6", outline: "none" },
  catManagerMergeSelect: { flex: 1, background: "#0f1117", border: "1px solid #1f2937", borderRadius: 4, padding: "3px 8px", fontSize: 13, color: "#f3f4f6", cursor: "pointer", outline: "none" },

  // Category pills
  pillRow: { display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 },
  pill: { padding: "4px 12px", borderRadius: 9999, fontSize: 12, whiteSpace: "nowrap", border: "1px solid #1f2937", background: "#161b27", color: "#d4d4d8", cursor: "pointer" },
  pillActive: { background: "#f3f4f6", color: "#161b27", borderColor: "#f3f4f6" },
  pillImportant: { borderColor: "#ef444466", color: "#ef4444" },

  // Add/Edit form
  formCard: { background: "#161b27", border: "1px solid #1f2937", borderRadius: 8, padding: 16, marginBottom: 16 },
  formInput: { width: "100%", background: "#0f1117", border: "1px solid #1f2937", borderRadius: 4, padding: "8px 12px", fontSize: 14, color: "#f3f4f6", outline: "none", marginBottom: 8, boxSizing: "border-box" },
  formActions: { display: "flex", gap: 8 },
  formBtnSave: { background: "#10b981", color: "#0f1117", borderRadius: 4, padding: "6px 12px", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
  formBtnCancel: { background: "#1f2937", color: "#d4d4d8", borderRadius: 4, padding: "6px 12px", fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },

  // Bookmark list
  listWrap: { display: "flex", flexDirection: "column", gap: 16 },
  listWrapInner: { border: "1px solid #1f2937", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" },
  listRow: { display: "flex", alignItems: "center", gap: 12, padding: 12 },
  listRowBorder: { borderBottom: "1px solid #1f2937" },
  categoryBadge: { fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#1f2937", color: "#d4d4d8", whiteSpace: "nowrap" },
  linkArea: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" },
  linkTitle: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 },
  linkIcon: { color: "#71717a", flexShrink: 0 },
  actionBtn: { padding: 6, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center" },

  // Bookmark row additions
  descText: { fontSize: 12, color: "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },
  visitsBadge: { fontSize: 11, color: "#52525b", whiteSpace: "nowrap", minWidth: 28, textAlign: "right" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4, alignItems: "center" },
  tagChip: {
    fontSize: 10, fontWeight: 500, color: "#a1a1aa", background: "#1f2937", border: "1px solid #27272a",
    borderRadius: 9999, padding: "2px 8px", cursor: "pointer", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis",
  },
  tagChipActive: { color: "#fafafa", background: "#3f3f46", borderColor: "#52525b" },
  tagBar: { display: "flex", flexWrap: "wrap", gap: 4, padding: "6px 10px 8px", borderBottom: "1px solid #1f2937", maxHeight: 120, overflowY: "auto" },
  tagBarLabel: { fontSize: 10, fontWeight: 600, color: "#52525b", width: "100%", marginBottom: 2 },
  starBtn: { padding: 6, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" },

  // Status pills
  statusPill: { fontSize: 11, padding: "2px 7px", borderRadius: 9999, fontWeight: 500, whiteSpace: "nowrap" },

  // Group headers
  groupWrap: { marginBottom: 16 },
  groupHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", cursor: "pointer", borderRadius: "8px 8px 0 0", background: "#161b27", border: "1px solid #1f2937", userSelect: "none" },
  groupHeaderLeft: { display: "flex", alignItems: "center", gap: 10 },
  groupTitle: { fontSize: 15, fontWeight: 600, color: "#f3f4f6" },
  groupCount: { fontSize: 12, color: "#71717a", background: "#1f2937", padding: "1px 8px", borderRadius: 9999 },
  groupChevron: { color: "#71717a", flexShrink: 0, transition: "transform 0.2s" },
  pinnedHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", cursor: "default", borderRadius: "8px 8px 0 0", background: "#161b27", border: "1px solid #facc15", borderBottom: "1px solid #1f2937", userSelect: "none" },
  pinnedTitle: { fontSize: 15, fontWeight: 600, color: "#facc15" },

  // Detail panel (expanded row)
  detailPanel: { padding: "12px 16px", background: "#0f1117", borderTop: "1px solid #1f2937", display: "flex", flexDirection: "column", gap: 12 },
  detailRow: { display: "flex", alignItems: "center", gap: 12 },
  detailLabel: { fontSize: 12, color: "#71717a", width: 80, flexShrink: 0 },
  detailMeta: { fontSize: 11, color: "#52525b" },
  notesArea: { width: "100%", background: "#161b27", border: "1px solid #1f2937", borderRadius: 4, padding: "8px 12px", fontSize: 13, color: "#f3f4f6", outline: "none", resize: "vertical", minHeight: 72, boxSizing: "border-box", fontFamily: "'DM Sans', system-ui, sans-serif" },
  progressWrap: { flex: 1, display: "flex", alignItems: "center", gap: 10 },
  progressTrack: { flex: 1, height: 6, background: "#1f2937", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: "#10b981", borderRadius: 3, transition: "width 0.2s" },
  progressLabel: { fontSize: 12, color: "#6b7280", width: 36, textAlign: "right" },
  statusBtns: { display: "flex", gap: 6 },
  statusBtn: { fontSize: 12, padding: "3px 10px", borderRadius: 9999, border: "1px solid #1f2937", background: "transparent", cursor: "pointer", color: "#71717a" },
  statusBtnActive: { border: "none", cursor: "pointer", fontSize: 12, padding: "3px 10px", borderRadius: 9999 },
  expandBtn: { padding: 6, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#52525b", display: "flex", alignItems: "center" },

  // Footer + empty
  footer: { fontSize: 12, color: "#52525b", marginTop: 16, textAlign: "center" },
  empty: { fontSize: 14, color: "#71717a", textAlign: "center", padding: "32px 0" },
};

// CSS for hover effects (can't do inline)
export const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
input:focus { border-color: #52525b !important; }
select:focus { border-color: #52525b !important; outline: none; }

/* Bookmark rows */
.kb-row:hover { background: #161b27; }
.kb-row .kb-actions { opacity: 0; transition: opacity 0.15s; }
.kb-row:hover .kb-actions { opacity: 1; }
.kb-save:hover { background: #34d399; }
.kb-cancel:hover { background: #3f3f46; }
.kb-act:hover { background: #1f2937; color: #f3f4f6; }
.kb-del:hover { color: #f87171 !important; }
.kb-group-header:hover { background: #1f2937 !important; }
.kb-star { color: #52525b; }
.kb-star:hover { color: #facc15; }
.kb-star.pinned { color: #facc15; }
.kb-expand:hover { color: #6b7280; }
.kb-status-btn:hover { opacity: 0.85; }
input[type=range] { accent-color: #10b981; cursor: pointer; }
textarea:focus { border-color: #52525b !important; }

/* Category manager (legacy, kept for future use) */
.kb-cat-toggle:hover { background: #1f2937 !important; color: #f3f4f6 !important; }
.kb-cat-row:hover { background: #1f2937; }
.kb-cat-mgr-act:hover { background: #1f2937; color: #f3f4f6; }

/* Sidebar */
.kb-sidebar-toggle:hover { background: #1f2937; color: #f3f4f6; }
.kb-sidebar-act:hover { background: #1f2937; color: #6b7280; }
.kb-folder-row:hover { background: #1f2937 !important; }
.kb-folder-row.selected { background: #1f2937 !important; }
.kb-folder-row:hover .kb-folder-more { opacity: 1 !important; }
.kb-smart-folder:hover { background: #1f2937 !important; }
.kb-smart-folder.selected { background: #1f2937 !important; }
.kb-fav-item:hover { background: #1f2937; }
.kb-add:hover { background: #1f2937; }

/* Context menu */
.kb-ctx-item:hover { background: #1f2937; color: #f3f4f6; }
.kb-ctx-item-danger:hover { background: #450a0a; color: #f87171 !important; }

/* Home cards */
.kb-home-card:hover { border-color: #3f3f46; background: #1f2937; }

/* Mobile — sidebar becomes overlay, content takes full width */
@media (max-width: 768px) {
  .kb-mobile-menu-btn { display: flex !important; }
  .kb-sidebar-desktop { display: none !important; }
  .kb-folder-row { min-height: 44px !important; }
  .kb-smart-folder { min-height: 44px !important; }
}
`;
