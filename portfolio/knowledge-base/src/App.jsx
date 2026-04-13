import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, X, Check, ExternalLink } from "lucide-react";
import { SEED, SEED_VERSION, STORE_SEED_VERSION, load, save, s, css } from "./constants";
import ErrorBoundary from "./ErrorBoundary";

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", url: "", category: "" });

  useEffect(() => {
    const stored = load();
    if (stored) {
      const v = Number(localStorage.getItem(STORE_SEED_VERSION)) || 1;
      if (v < SEED_VERSION) {
        const ids = new Set(stored.map(b => b.id));
        const merged = [...stored, ...SEED.filter(b => !ids.has(b.id))];
        save(merged);
        localStorage.setItem(STORE_SEED_VERSION, String(SEED_VERSION));
        setBookmarks(merged);
      } else {
        setBookmarks(stored);
      }
    } else {
      setBookmarks(SEED);
      save(SEED);
      localStorage.setItem(STORE_SEED_VERSION, String(SEED_VERSION));
    }
    setLoading(false);
  }, []);

  const persist = (next) => {
    setBookmarks(next);
    save(next);
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
      persist(bookmarks.map(b => b.id === editId ? { ...b, title: form.title.trim(), url, category } : b));
    } else {
      persist([...bookmarks, { id: Date.now(), title: form.title.trim(), url, category }]);
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

  const del = (id) => persist(bookmarks.filter(b => b.id !== id));

  return (
    <ErrorBoundary name="Knowledge Base">
      <div style={s.root}>
        <style>{css}</style>
        <div style={s.container}>
          <header style={s.header}>
            <h1 style={s.headerTitle}>Knowledge Base</h1>
            <p style={s.headerSub}>Your personal knowledge base</p>
          </header>

          <div style={s.searchRow}>
            <div style={s.searchWrap}>
              <Search size={16} style={s.searchIcon} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bookmarks..."
                style={s.searchInput}
              />
            </div>
            <button
              className="kb-add"
              onClick={() => { setShowAdd(!showAdd); setEditId(null); setForm({ title: "", url: "", category: "" }); }}
              style={s.addBtn}
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div style={s.pillRow}>
            {categories.map(c => (
              <button
                key={c}
                className="kb-pill"
                onClick={() => setFilter(c)}
                style={{ ...s.pill, ...(filter === c ? s.pillActive : {}) }}
              >
                {c}
              </button>
            ))}
          </div>

          {showAdd && (
            <div style={s.formCard}>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                style={s.formInput}
              />
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="URL"
                style={s.formInput}
              />
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category (optional)"
                style={s.formInput}
              />
              <div style={s.formActions}>
                <button className="kb-save" onClick={submit} style={s.formBtnSave}>
                  <Check size={16} /> {editId !== null ? "Save" : "Add"}
                </button>
                <button className="kb-cancel" onClick={() => { setShowAdd(false); setEditId(null); }} style={s.formBtnCancel}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <p style={s.empty}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={s.empty}>No bookmarks found.</p>
          ) : (
            <div style={s.listWrap}>
              {filtered.map((b, i) => (
                <div
                  key={b.id}
                  className="kb-row"
                  style={{ ...s.listRow, ...(i !== filtered.length - 1 ? s.listRowBorder : {}) }}
                >
                  <span style={s.categoryBadge}>{b.category}</span>
                  <a href={b.url} target="_blank" rel="noopener noreferrer" style={s.linkArea}>
                    <span style={s.linkTitle}>{b.title}</span>
                    <ExternalLink size={12} style={s.linkIcon} />
                  </a>
                  <div className="kb-actions" style={{ display: "flex", gap: 4 }}>
                    <button className="kb-act" onClick={() => startEdit(b)} style={s.actionBtn}>
                      <Edit2 size={14} />
                    </button>
                    <button className="kb-act kb-del" onClick={() => del(b.id)} style={s.actionBtn}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p style={s.footer}>{bookmarks.length} bookmarks saved</p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
