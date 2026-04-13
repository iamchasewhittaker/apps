import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, X, Check, ExternalLink, Star, ChevronDown, ChevronRight } from "lucide-react";
import { SEED, SEED_VERSION, STORE_SEED_VERSION, load, save, s, css } from "./constants";
import ErrorBoundary from "./ErrorBoundary";

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", url: "", category: "", description: "", status: "not_started", progress: 0, notes: "" });
  const [collapsed, setCollapsed] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  // Seed migration loader
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

  const persist = (next) => { setBookmarks(next); save(next); };

  // Category ordering: alphabetical, My Projects always last
  const sortedCategories = (cats) => {
    return [...cats].sort((a, b) => {
      if (a === "My Projects") return 1;
      if (b === "My Projects") return -1;
      return a.localeCompare(b);
    });
  };

  // All categories from non-pinned bookmarks
  const allCategories = sortedCategories(
    Array.from(new Set(bookmarks.filter(b => !b.pinned).map(b => b.category)))
  );
  const filterPills = ["All", ...sortedCategories(Array.from(new Set(bookmarks.map(b => b.category))))];

  // Search filter applied to a list of bookmarks
  const applySearch = (list) => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.description || "").toLowerCase().includes(q)
    );
  };

  // Pinned bookmarks (excluded from category groups)
  const pinnedBookmarks = applySearch(bookmarks.filter(b => b.pinned));

  // Toggle pin
  const togglePin = (id) => persist(bookmarks.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b));

  // Toggle collapse
  const toggleCollapse = (cat) => setCollapsed(c => ({ ...c, [cat]: !c[cat] }));

  // Click a link: track visits + lastVisited
  const handleLinkClick = (e, b) => {
    e.preventDefault();
    const next = bookmarks.map(x => x.id === b.id
      ? { ...x, visits: (x.visits || 0) + 1, lastVisited: new Date().toISOString() }
      : x
    );
    persist(next);
    window.open(b.url, "_blank", "noopener,noreferrer");
  };

  // Update a single field on a bookmark (for inline notes/progress/status)
  const updateField = (id, field, value) => {
    persist(bookmarks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  // Submit add/edit form
  const submit = () => {
    if (!form.title.trim() || !form.url.trim()) return;
    let url = form.url.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const category = form.category.trim() || "Other";
    if (editId !== null) {
      persist(bookmarks.map(b => b.id === editId ? { ...b, ...form, url, category } : b));
    } else {
      persist([...bookmarks, { id: Date.now(), ...form, url, category, visits: 0 }]);
    }
    setForm({ title: "", url: "", category: "", description: "", status: "not_started", progress: 0, notes: "" });
    setEditId(null);
    setShowAdd(false);
  };

  const startEdit = (b) => {
    setEditId(b.id);
    setForm({
      title: b.title, url: b.url, category: b.category,
      description: b.description || "", status: b.status || "not_started",
      progress: b.progress || 0, notes: b.notes || ""
    });
    setShowAdd(true);
  };

  const del = (id) => persist(bookmarks.filter(b => b.id !== id));

  // Status helpers
  const statusColor = { not_started: "#3f3f46", in_progress: "#2563eb", completed: "#10b981" };
  const statusLabel = { not_started: "Not Started", in_progress: "In Progress", completed: "Completed" };

  // Bookmark row renderer
  const renderRow = (b, i, total) => {
    const isExpanded = expandedId === b.id;
    const isPinned = b.pinned;
    return (
      <div key={b.id}>
        <div
          className="kb-row"
          style={{ ...s.listRow, ...(i !== total - 1 || isExpanded ? s.listRowBorder : {}) }}
        >
          {/* Star/pin button */}
          <button
            className={`kb-star${isPinned ? " pinned" : ""}`}
            onClick={() => togglePin(b.id)}
            style={s.starBtn}
            title={isPinned ? "Unpin" : "Pin to top"}
          >
            <Star size={14} fill={isPinned ? "#facc15" : "none"} />
          </button>

          {/* Category badge */}
          <span style={s.categoryBadge}>{b.category}</span>

          {/* Title link + description */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <a
              href={b.url}
              onClick={(e) => handleLinkClick(e, b)}
              style={s.linkArea}
            >
              <span style={s.linkTitle}>{b.title}</span>
              <ExternalLink size={12} style={s.linkIcon} />
            </a>
            {b.description && <div style={s.descText}>{b.description}</div>}
          </div>

          {/* Status pill */}
          {b.status && b.status !== "not_started" && (
            <span style={{ ...s.statusPill, background: statusColor[b.status] || "#3f3f46", color: "#fff" }}>
              {statusLabel[b.status] || b.status}
            </span>
          )}

          {/* Visit count */}
          {(b.visits || 0) > 0 && (
            <span style={s.visitsBadge}>{b.visits}&times;</span>
          )}

          {/* Expand / collapse detail panel */}
          <button
            className="kb-expand"
            onClick={() => setExpandedId(isExpanded ? null : b.id)}
            style={s.expandBtn}
            title="Details"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Edit / delete */}
          <div className="kb-actions" style={{ display: "flex", gap: 4 }}>
            <button className="kb-act" onClick={() => startEdit(b)} style={s.actionBtn}>
              <Edit2 size={14} />
            </button>
            <button className="kb-act kb-del" onClick={() => del(b.id)} style={s.actionBtn}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Detail panel */}
        {isExpanded && (
          <div style={s.detailPanel}>
            {/* Status */}
            <div style={s.detailRow}>
              <span style={s.detailLabel}>Status</span>
              <div style={s.statusBtns}>
                {["not_started", "in_progress", "completed"].map(st => (
                  <button
                    key={st}
                    className="kb-status-btn"
                    onClick={() => updateField(b.id, "status", st)}
                    style={b.status === st || (!b.status && st === "not_started")
                      ? { ...s.statusBtnActive, background: statusColor[st], color: "#fff" }
                      : s.statusBtn
                    }
                  >
                    {statusLabel[st]}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div style={s.detailRow}>
              <span style={s.detailLabel}>Progress</span>
              <div style={s.progressWrap}>
                <div style={s.progressTrack}>
                  <div style={{ ...s.progressFill, width: `${b.progress || 0}%` }} />
                </div>
                <input
                  type="range"
                  min={0} max={100} step={5}
                  value={b.progress || 0}
                  onChange={(e) => updateField(b.id, "progress", Number(e.target.value))}
                  style={{ width: 80 }}
                />
                <span style={s.progressLabel}>{b.progress || 0}%</span>
              </div>
            </div>

            {/* Notes */}
            <div style={s.detailRow}>
              <span style={s.detailLabel}>Notes</span>
              <textarea
                style={s.notesArea}
                value={b.notes || ""}
                onChange={(e) => updateField(b.id, "notes", e.target.value)}
                placeholder="Notes, takeaways, where you left off..."
              />
            </div>

            {/* Last visited */}
            {b.lastVisited && (
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Last visited</span>
                <span style={s.detailMeta}>{new Date(b.lastVisited).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <ErrorBoundary name="Knowledge Base">
      <div style={s.root}>
        <style>{css}</style>
        <div style={s.container}>
          <header style={s.header}>
            <h1 style={s.headerTitle}>Knowledge Base</h1>
            <p style={s.headerSub}>{bookmarks.length} bookmarks across {new Set(bookmarks.map(b => b.category)).size} categories</p>
          </header>

          {/* Search + Add */}
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
              onClick={() => { setShowAdd(!showAdd); setEditId(null); setForm({ title: "", url: "", category: "", description: "", status: "not_started", progress: 0, notes: "" }); }}
              style={s.addBtn}
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Category filter pills */}
          <div style={s.pillRow}>
            {filterPills.map(c => (
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

          {/* Add/Edit form */}
          {showAdd && (
            <div style={s.formCard}>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" style={s.formInput} />
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="URL" style={s.formInput} />
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (optional)" style={s.formInput} />
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" style={s.formInput} />
              {/* Status buttons */}
              <div style={{ ...s.statusBtns, marginBottom: 8 }}>
                {["not_started", "in_progress", "completed"].map(st => (
                  <button
                    key={st}
                    className="kb-status-btn"
                    onClick={() => setForm({ ...form, status: st })}
                    style={form.status === st
                      ? { ...s.statusBtnActive, background: statusColor[st], color: "#fff" }
                      : s.statusBtn
                    }
                  >
                    {statusLabel[st]}
                  </button>
                ))}
              </div>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optional)" style={{ ...s.notesArea, marginBottom: 8 }} />
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
          ) : (
            <div style={s.listWrap}>
              {/* Pinned section */}
              {pinnedBookmarks.length > 0 && (
                <div style={s.groupWrap}>
                  <div style={s.pinnedHeader}>
                    <div style={s.groupHeaderLeft}>
                      <span style={s.pinnedTitle}>Pinned</span>
                      <span style={s.groupCount}>{pinnedBookmarks.length}</span>
                    </div>
                  </div>
                  <div style={s.listWrapInner}>
                    {pinnedBookmarks.map((b, i) => renderRow(b, i, pinnedBookmarks.length))}
                  </div>
                </div>
              )}

              {/* Category groups */}
              {allCategories
                .filter(cat => filter === "All" || filter === cat)
                .map(cat => {
                  const catBookmarks = applySearch(
                    bookmarks.filter(b => !b.pinned && b.category === cat)
                  );
                  if (catBookmarks.length === 0) return null;
                  const isCollapsed = collapsed[cat];
                  return (
                    <div key={cat} style={s.groupWrap}>
                      <div
                        className="kb-group-header"
                        style={s.groupHeader}
                        onClick={() => toggleCollapse(cat)}
                      >
                        <div style={s.groupHeaderLeft}>
                          <span style={s.groupTitle}>{cat}</span>
                          <span style={s.groupCount}>{catBookmarks.length}</span>
                        </div>
                        {isCollapsed
                          ? <ChevronRight size={16} style={s.groupChevron} />
                          : <ChevronDown size={16} style={s.groupChevron} />
                        }
                      </div>
                      {!isCollapsed && (
                        <div style={s.listWrapInner}>
                          {catBookmarks.map((b, i) => renderRow(b, i, catBookmarks.length))}
                        </div>
                      )}
                    </div>
                  );
                })
              }

              {/* Empty state */}
              {pinnedBookmarks.length === 0 &&
               allCategories.filter(cat => filter === "All" || filter === cat)
                 .every(cat => applySearch(bookmarks.filter(b => !b.pinned && b.category === cat)).length === 0) && (
                <p style={s.empty}>No bookmarks found.</p>
              )}
            </div>
          )}

          <p style={s.footer}>{bookmarks.length} bookmarks saved</p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
