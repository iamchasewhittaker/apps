// ARCHIVED — original Claude artifact. See src/App.jsx for the CRA version.
import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, X, Check, ExternalLink } from "lucide-react";

const SEED = [
  // Official docs
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

  // Prompting guides
  { id: 11, title: "Anthropic Prompt Engineering", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview", category: "Prompting" },
  { id: 12, title: "OpenAI Cookbook", url: "https://cookbook.openai.com", category: "Prompting" },
  { id: 13, title: "Google Prompting Guide 101", url: "https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf", category: "Prompting" },
  { id: 14, title: "Learn Prompting", url: "https://learnprompting.org", category: "Prompting" },

  // Courses
  { id: 15, title: "Anthropic Courses (GitHub)", url: "https://github.com/anthropics/courses", category: "Learning" },
  { id: 16, title: "DeepLearning.AI Short Courses", url: "https://www.deeplearning.ai/short-courses", category: "Learning" },

  // Dev tools
  { id: 17, title: "Aider", url: "https://aider.chat", category: "Dev Tools" },
  { id: 18, title: "Continue.dev", url: "https://continue.dev", category: "Dev Tools" },

  // Community & news
  { id: 19, title: "Simon Willison's Blog", url: "https://simonwillison.net", category: "Community" },
  { id: 20, title: "r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI", category: "Community" },
  { id: 21, title: "r/LocalLLaMA", url: "https://www.reddit.com/r/LocalLLaMA", category: "Community" },
  { id: 22, title: "Hacker News", url: "https://news.ycombinator.com", category: "Community" },

  // My Projects
  { id: 23, title: "Wellness Tracker", url: "https://wellness-tracker.vercel.app", category: "My Projects" },
  { id: 24, title: "Job Search HQ", url: "https://job-search-hq.vercel.app", category: "My Projects" },
  { id: 25, title: "App Forge", url: "https://app-forge-fawn.vercel.app", category: "My Projects" },
  { id: 26, title: "RollerTask Tycoon (iOS)", url: "https://github.com/iamchasewhittaker/roller-task-tycoon", category: "My Projects" },
  { id: 27, title: "YNAB Clarity (iOS)", url: "https://github.com/iamchasewhittaker/apps", category: "My Projects" },
  { id: 28, title: "Spend Clarity", url: "https://github.com/iamchasewhittaker/apps", category: "My Projects" },
  { id: 29, title: "Knowledge Base", url: "https://github.com/iamchasewhittaker/apps", category: "My Projects" },
];

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", url: "", category: "" });

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("bookmarks:all");
        if (res?.value) {
          setBookmarks(JSON.parse(res.value));
        } else {
          setBookmarks(SEED);
          await window.storage.set("bookmarks:all", JSON.stringify(SEED));
        }
      } catch {
        setBookmarks(SEED);
        try { await window.storage.set("bookmarks:all", JSON.stringify(SEED)); } catch {}
      }
      setLoading(false);
    })();
  }, []);

  const save = async (next) => {
    setBookmarks(next);
    try { await window.storage.set("bookmarks:all", JSON.stringify(next)); } catch {}
  };

  const categories = ["All", ...Array.from(new Set(bookmarks.map(b => b.category)))];
  const filtered = bookmarks.filter(b => {
    const matchCat = filter === "All" || b.category === filter;
    const q = query.toLowerCase();
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const submit = () => {
    if (!form.title.trim() || !form.url.trim()) return;
    let url = form.url.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const category = form.category.trim() || "Other";
    if (editId !== null) {
      save(bookmarks.map(b => b.id === editId ? { ...b, title: form.title.trim(), url, category } : b));
    } else {
      save([...bookmarks, { id: Date.now(), title: form.title.trim(), url, category }]);
    }
    setForm({ title: "", url: "", category: "" });
    setEditId(null);
    setShowAdd(false);
  };

  const startEdit = (b) => {
    setEditId(b.id);
    setForm({ title: b.title, url: b.url, category: b.category });
    setShowAdd(true);
  };

  const del = (id) => save(bookmarks.filter(b => b.id !== id));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Knowledge Base</h1>
          <p className="text-zinc-400 text-sm">Your personal knowledge base</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>
          <button
            onClick={() => { setShowAdd(!showAdd); setEditId(null); setForm({ title: "", url: "", category: "" }); }}
            className="bg-zinc-100 text-zinc-900 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-white"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border ${filter === c ? "bg-zinc-100 text-zinc-900 border-zinc-100" : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {showAdd && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4 space-y-2">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            />
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="URL"
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            />
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Category (optional)"
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            />
            <div className="flex gap-2">
              <button onClick={submit} className="bg-emerald-500 text-zinc-950 rounded px-3 py-1.5 text-sm font-medium flex items-center gap-1 hover:bg-emerald-400">
                <Check className="w-4 h-4" /> {editId !== null ? "Save" : "Add"}
              </button>
              <button onClick={() => { setShowAdd(false); setEditId(null); }} className="bg-zinc-800 text-zinc-300 rounded px-3 py-1.5 text-sm flex items-center gap-1 hover:bg-zinc-700">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-zinc-500 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">No bookmarks found.</p>
        ) : (
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            {filtered.map((b, i) => (
              <div key={b.id} className={`flex items-center gap-3 p-3 hover:bg-zinc-900 group ${i !== filtered.length - 1 ? "border-b border-zinc-800" : ""}`}>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 min-w-fit">{b.category}</span>
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="truncate font-medium">{b.title}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                </a>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => startEdit(b)} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => del(b.id)} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-zinc-600 text-xs mt-4 text-center">{bookmarks.length} bookmarks saved</p>
      </div>
    </div>
  );
}
