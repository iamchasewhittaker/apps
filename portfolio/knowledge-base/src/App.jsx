import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, X, Check, ExternalLink, Star, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Settings, GitMerge } from "lucide-react";
import { SEED, SEED_VERSION, STORE_SEED_VERSION, load, save, s, css } from "./constants";
import ErrorBoundary from "./ErrorBoundary";

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", url: "", category: "", description: "", status: "not_started", progress: 0, notes: "", importance: 0 });
  const [collapsed, setCollapsed] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [showCatManager, setShowCatManager] = useState(false);
  const [renamingCat, setRenamingCat] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [mergingCat, setMergingCat] = useState(null);

  // Seed migration loader
  useEffect(() => {
    const data = load();
    if (data) {
      const { bookmarks: stored, categoryOrder: storedOrder } = data;
      setCategoryOrder(storedOrder || null);
      const v = Number(localStorage.getItem(STORE_SEED_VERSION)) || 1;
      if (v < SEED_VERSION) {
        const ids = new Set(stored.map(b => b.id));
        const merged = [...stored, ...SEED.filter(b => !ids.has(b.id))];
        save({ bookmarks: merged, categoryOrder: storedOrder || null });
        localStorage.setItem(STORE_SEED_VERSION, String(SEED_VERSION));
        setBookmarks(merged);
      } else {
        setBookmarks(stored);
      }
    } else {
      setBookmarks(SEED);
      save({ bookmarks: SEED, categoryOrder: null });
      localStorage.setItem(STORE_SEED_VERSION, String(SEED_VERSION));
    }
    setLoading(false);
  }, []);

  // Persist helpers — each closes over current state values
  const persist = (next) => { setBookmarks(next); save({ bookmarks: next, categoryOrder }); };
  const persistAll = (nextBookmarks, nextOrder) => {
    setBookmarks(nextBookmarks); setCategoryOrder(nextOrder);
    save({ bookmarks: nextBookmarks, categoryOrder: nextOrder });
  };
  const persistOrder = (nextOrder) => { setCategoryOrder(nextOrder); save({ bookmarks, categoryOrder: nextOrder }); };

  // Category ordering: custom order if set, otherwise alphabetical (My Projects last)
  const defaultSort = (cats) => [...cats].sort((a, b) => {
    if (a === "My Projects") return 1;
    if (b === "My Projects") return -1;
    return a.localeCompare(b);
  });
  const effectiveCategories = (cats) => {
    if (categoryOrder && categoryOrder.length > 0) {
      const ordered = categoryOrder.filter(c => cats.includes(c));
      const unordered = cats.filter(c => !categoryOrder.includes(c)).sort((a, b) => a.localeCompare(b));
      return [...ordered, ...unordered];
    }
    return defaultSort(cats);
  };

  const allCats = Array.from(new Set(bookmarks.map(b => b.category)));
  const allCategories = effectiveCategories(
    Array.from(new Set(bookmarks.filter(b => !b.pinned).map(b => b.category)))
  );
  const filterPills = ["All", "Important", ...effectiveCategories(allCats)];

  // Search filter
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

  const pinnedBookmarks = applySearch(bookmarks.filter(b => b.pinned));

  const importantBookmarks = filter === "Important"
    ? applySearch(bookmarks.filter(b => (b.importance || 0) >= 1))
        .sort((a, b) => (b.importance || 0) - (a.importance || 0) || a.title.localeCompare(b.title))
    : [];

  const togglePin = (id) => persist(bookmarks.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b));
  const toggleCollapse = (cat) => setCollapsed(c => ({ ...c, [cat]: !c[cat] }));

  const handleLinkClick = (e, b) => {
    e.preventDefault();
    persist(bookmarks.map(x => x.id === b.id
      ? { ...x, visits: (x.visits || 0) + 1, lastVisited: new Date().toISOString() }
      : x
    ));
    window.open(b.url, "_blank", "noopener,noreferrer");
  };

  const updateField = (id, field, value) => {
    persist(bookmarks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const resetForm = () => setForm({ title: "", url: "", category: "", description: "", status: "not_started", progress: 0, notes: "", importance: 0 });

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
    resetForm();
    setEditId(null);
    setShowAdd(false);
  };

  const startEdit = (b) => {
    setEditId(b.id);
    setForm({
      title: b.title, url: b.url, category: b.category,
      description: b.description || "", status: b.status || "not_started",
      progress: b.progress || 0, notes: b.notes || "", importance: b.importance || 0
    });
    setShowAdd(true);
  };

  const del = (id) => persist(bookmarks.filter(b => b.id !== id));

  // Status helpers
  const statusColor = { not_started: "#3f3f46", in_progress: "#2563eb", completed: "#10b981" };
  const statusLabel = { not_started: "Not Started", in_progress: "In Progress", completed: "Completed" };

  // Importance helpers
  const importanceColor = { 0: "#3f3f46", 1: "#3b82f6", 2: "#f59e0b", 3: "#ef4444" };
  const importanceLabel = { 0: "None", 1: "Low", 2: "Medium", 3: "High" };

  // ── Category Manager ─────────────────────────────────────────────────────
  const managedCategories = effectiveCategories(allCats);

  const moveCat = (cat, dir) => {
    const base = categoryOrder && categoryOrder.length > 0 ? categoryOrder : defaultSort(allCats);
    const full = [...base.filter(c => allCats.includes(c)), ...allCats.filter(c => !base.includes(c))];
    const idx = full.indexOf(cat);
    if (idx === -1) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= full.length) return;
    const next = [...full];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    persistOrder(next);
  };

  const startRename = (cat) => { setRenamingCat(cat); setRenameValue(cat); setMergingCat(null); };
  const confirmRename = () => {
    const newName = renameValue.trim();
    if (!newName || newName === renamingCat) { setRenamingCat(null); return; }
    const nextBookmarks = bookmarks.map(b => b.category === renamingCat ? { ...b, category: newName } : b);
    const nextOrder = categoryOrder ? categoryOrder.map(c => c === renamingCat ? newName : c) : null;
    if (filter === renamingCat) setFilter(newName);
    setCollapsed(c => {
      const next = { ...c };
      if (next[renamingCat] !== undefined) { next[newName] = next[renamingCat]; delete next[renamingCat]; }
      return next;
    });
    setRenamingCat(null);
    persistAll(nextBookmarks, nextOrder);
  };

  const startMerge = (cat) => { setMergingCat(cat); setRenamingCat(null); };
  const confirmMerge = (target) => {
    if (!target || target === mergingCat) { setMergingCat(null); return; }
    const nextBookmarks = bookmarks.map(b => b.category === mergingCat ? { ...b, category: target } : b);
    const nextOrder = categoryOrder ? categoryOrder.filter(c => c !== mergingCat) : null;
    if (filter === mergingCat) setFilter(target);
    setMergingCat(null);
    persistAll(nextBookmarks, nextOrder);
  };

  const deleteEmptyCat = (cat) => {
    const nextOrder = categoryOrder ? categoryOrder.filter(c => c !== cat) : defaultSort(allCats).filter(c => c !== cat);
    if (filter === cat) setFilter("All");
    persistOrder(nextOrder);
  };
  // ─────────────────────────────────────────────────────────────────────────

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
          {/* Star/pin */}
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
            <a href={b.url} onClick={(e) => handleLinkClick(e, b)} style={s.linkArea}>
              <span style={s.linkTitle}>{b.title}</span>
              <ExternalLink size={12} style={s.linkIcon} />
            </a>
            {b.description && <div style={s.descText}>{b.description}</div>}
          </div>

          {/* Importance badge */}
          {(b.importance || 0) > 0 && (
            <span style={{ ...s.statusPill, background: importanceColor[b.importance], color: "#fff" }}>
              {importanceLabel[b.importance]}
            </span>
          )}

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

          {/* Expand detail */}
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

            {/* Importance */}
            <div style={s.detailRow}>
              <span style={s.detailLabel}>Importance</span>
              <div style={s.statusBtns}>
                {[0, 1, 2, 3].map(val => (
                  <button
                    key={val}
                    className="kb-status-btn"
                    onClick={() => updateField(b.id, "importance", val)}
                    style={(b.importance || 0) === val
                      ? { ...s.statusBtnActive, background: importanceColor[val], color: "#fff" }
                      : s.statusBtn
                    }
                  >
                    {importanceLabel[val]}
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
                  type="range" min={0} max={100} step={5}
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

          {/* Search + Categories + Add */}
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
              className="kb-cat-toggle"
              onClick={() => setShowCatManager(v => !v)}
              style={{ ...s.catToggleBtn, ...(showCatManager ? s.catToggleBtnActive : {}) }}
              title="Manage categories"
            >
              <Settings size={16} /> Categories
            </button>
            <button
              className="kb-add"
              onClick={() => { setShowAdd(!showAdd); setEditId(null); resetForm(); }}
              style={s.addBtn}
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Category manager panel */}
          {showCatManager && (
            <div style={s.catManagerCard}>
              <div style={s.catManagerHeader}>
                <span style={s.catManagerTitle}>Organize Categories</span>
                <button
                  className="kb-cat-mgr-act"
                  onClick={() => persistOrder(null)}
                  style={s.catManagerResetBtn}
                  title="Reset to A–Z order"
                >
                  Reset A–Z
                </button>
              </div>
              {managedCategories.map((cat, idx) => {
                const count = bookmarks.filter(b => b.category === cat).length;
                const isRenaming = renamingCat === cat;
                const isMerging = mergingCat === cat;
                return (
                  <div key={cat} className="kb-cat-row" style={s.catManagerRow}>
                    {/* Reorder arrows */}
                    <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                      <button
                        className="kb-cat-mgr-act"
                        onClick={() => moveCat(cat, -1)}
                        style={{ ...s.catManagerBtn, opacity: idx === 0 ? 0.25 : 1 }}
                        disabled={idx === 0}
                        title="Move up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        className="kb-cat-mgr-act"
                        onClick={() => moveCat(cat, 1)}
                        style={{ ...s.catManagerBtn, opacity: idx === managedCategories.length - 1 ? 0.25 : 1 }}
                        disabled={idx === managedCategories.length - 1}
                        title="Move down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    {/* Name / rename input */}
                    {isRenaming ? (
                      <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmRename();
                          if (e.key === "Escape") setRenamingCat(null);
                        }}
                        style={s.catManagerInput}
                        autoFocus
                      />
                    ) : (
                      <span style={s.catManagerName} onClick={() => startRename(cat)} title="Click to rename">
                        {cat}
                      </span>
                    )}
                    <span style={s.catManagerCount}>{count}</span>

                    {/* Row actions */}
                    <div style={{ display: "flex", gap: 4, marginLeft: "auto", flexShrink: 0 }}>
                      {isRenaming ? (
                        <>
                          <button className="kb-cat-mgr-act" onClick={confirmRename} style={{ ...s.catManagerBtn, color: "#10b981" }} title="Save"><Check size={12} /></button>
                          <button className="kb-cat-mgr-act" onClick={() => setRenamingCat(null)} style={s.catManagerBtn} title="Cancel"><X size={12} /></button>
                        </>
                      ) : isMerging ? (
                        <>
                          <select
                            onChange={(e) => confirmMerge(e.target.value)}
                            defaultValue=""
                            style={s.catManagerMergeSelect}
                          >
                            <option value="" disabled>Merge into…</option>
                            {managedCategories.filter(c => c !== cat).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <button className="kb-cat-mgr-act" onClick={() => setMergingCat(null)} style={s.catManagerBtn} title="Cancel"><X size={12} /></button>
                        </>
                      ) : (
                        <>
                          <button className="kb-cat-mgr-act" onClick={() => startRename(cat)} style={s.catManagerBtn} title="Rename"><Edit2 size={12} /></button>
                          <button className="kb-cat-mgr-act" onClick={() => startMerge(cat)} style={s.catManagerBtn} title="Merge into another category"><GitMerge size={12} /></button>
                          {count === 0 && (
                            <button className="kb-cat-mgr-act" onClick={() => deleteEmptyCat(cat)} style={{ ...s.catManagerBtn, color: "#f87171" }} title="Delete empty category"><Trash2 size={12} /></button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Category filter pills */}
          <div style={s.pillRow}>
            {filterPills.map(c => (
              <button
                key={c}
                className="kb-pill"
                onClick={() => setFilter(c)}
                style={{
                  ...s.pill,
                  ...(filter === c ? s.pillActive : {}),
                  ...(c === "Important" && filter !== c ? s.pillImportant : {}),
                }}
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
              <div style={{ ...s.statusBtns, marginBottom: 8 }}>
                {["not_started", "in_progress", "completed"].map(st => (
                  <button key={st} className="kb-status-btn" onClick={() => setForm({ ...form, status: st })}
                    style={form.status === st ? { ...s.statusBtnActive, background: statusColor[st], color: "#fff" } : s.statusBtn}>
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
              {filter === "Important" ? (
                /* Important view: flat list ranked by importance */
                importantBookmarks.length > 0 ? (
                  <div style={s.groupWrap}>
                    <div style={{ ...s.pinnedHeader, borderColor: "#ef4444" }}>
                      <div style={s.groupHeaderLeft}>
                        <span style={{ ...s.pinnedTitle, color: "#ef4444" }}>Important</span>
                        <span style={s.groupCount}>{importantBookmarks.length}</span>
                      </div>
                    </div>
                    <div style={s.listWrapInner}>
                      {importantBookmarks.map((b, i) => renderRow(b, i, importantBookmarks.length))}
                    </div>
                  </div>
                ) : (
                  <p style={s.empty}>No bookmarks marked as important yet. Open any bookmark's detail panel to set importance.</p>
                )
              ) : (
                <>
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
                          <div className="kb-group-header" style={s.groupHeader} onClick={() => toggleCollapse(cat)}>
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
                </>
              )}
            </div>
          )}

          <p style={s.footer}>{bookmarks.length} bookmarks saved</p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
