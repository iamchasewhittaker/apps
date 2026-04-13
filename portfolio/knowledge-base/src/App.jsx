import { useState, useEffect, useRef } from "react";
import { Menu, Plus, X, Check, Edit2, Trash2, FolderPlus, FolderOpen, AlertTriangle, Clock, Star } from "lucide-react";
import {
  SEED, SEED_FOLDERS, SEED_VERSION, STORE_SEED_VERSION, categoryToFolderId,
  load, save, s, css,
  statusColor, statusLabel, importanceColor, importanceLabel,
} from "./constants";
import ErrorBoundary from "./ErrorBoundary";
import Sidebar from "./Sidebar";
import BookmarkList from "./BookmarkList";
import BookmarkRow from "./BookmarkRow";
import AddEditForm from "./AddEditForm";

const EMPTY_FORM = { title: "", url: "", folderId: "", description: "", status: "not_started", progress: 0, notes: "", importance: 0 };

export default function App() {
  // ── Persisted data ────────────────────────────────────────────────────────
  const [bookmarks, setBookmarks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [selectedFolderId, setSelectedFolderId] = useState(null); // null = home
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [expandedFolderIds, setExpandedFolderIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Form / edit
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Folder actions
  const [contextMenu, setContextMenu] = useState(null); // { folderId, x, y }
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [movingBookmarkId, setMovingBookmarkId] = useState(null);
  const contextMenuRef = useRef(null);

  // ── Seed + migration loader ───────────────────────────────────────────────
  useEffect(() => {
    const data = load();
    const v = Number(localStorage.getItem(STORE_SEED_VERSION)) || 1;

    let storedBm = [], storedFolders = null, storedFavs = [];
    if (data) {
      storedBm = data.bookmarks || [];
      storedFolders = data.folders || null;
      storedFavs = data.favorites || [];
    }

    // Merge new seed bookmarks
    let mergedBm = storedBm;
    if (v < SEED_VERSION || !data) {
      const ids = new Set(storedBm.map(b => b.id));
      mergedBm = [...storedBm, ...SEED.filter(b => !ids.has(b.id))];
    }

    // Ensure every bookmark has a folderId
    mergedBm = mergedBm.map(b => b.folderId ? b : { ...b, folderId: categoryToFolderId(b.category || "Other") });

    // Use SEED_FOLDERS if first migration
    const nextFolders = storedFolders && storedFolders.length > 0 ? storedFolders : SEED_FOLDERS;

    // Migrate pinned → favorites on first run
    let nextFavs = storedFavs;
    if (!storedFolders) {
      const pinnedIds = mergedBm.filter(b => b.pinned).map(b => b.id);
      const favSet = new Set(storedFavs);
      pinnedIds.forEach(id => favSet.add(id));
      nextFavs = [...favSet];
    }

    setBookmarks(mergedBm);
    setFolders(nextFolders);
    setFavorites(nextFavs);
    save({ bookmarks: mergedBm, categoryOrder: null, folders: nextFolders, favorites: nextFavs });
    localStorage.setItem(STORE_SEED_VERSION, String(SEED_VERSION));
    setLoading(false);
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const handler = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) setContextMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [contextMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      if (e.key === "/" ) { e.preventDefault(); document.querySelector(".kb-sidebar-search")?.focus(); }
      if (e.key === "n" && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openNewBookmark(); }
      if (e.key === "Escape") { setContextMenu(null); setShowAdd(false); setMovingBookmarkId(null); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Persist helpers ───────────────────────────────────────────────────────
  const saveAll = (nextBm, nextFolders, nextFavs) =>
    save({ bookmarks: nextBm, categoryOrder: null, folders: nextFolders, favorites: nextFavs });

  const persist = (nextBm) => { setBookmarks(nextBm); saveAll(nextBm, folders, favorites); };
  const persistFolders = (nextF) => { setFolders(nextF); saveAll(bookmarks, nextF, favorites); };
  const persistFavorites = (nextFav) => { setFavorites(nextFav); saveAll(bookmarks, folders, nextFav); };
  const persistBmAndFolders = (nextBm, nextF) => { setBookmarks(nextBm); setFolders(nextF); saveAll(nextBm, nextF, favorites); };

  // ── Bookmark CRUD ─────────────────────────────────────────────────────────
  const handleLinkClick = (e, b) => {
    e.preventDefault();
    persist(bookmarks.map(x => x.id === b.id ? { ...x, visits: (x.visits || 0) + 1, lastVisited: new Date().toISOString() } : x));
    window.open(b.url, "_blank", "noopener,noreferrer");
  };

  const updateField = (id, field, value) => persist(bookmarks.map(b => b.id === id ? { ...b, [field]: value } : b));

  const togglePin = (id) => {
    const nextBm = bookmarks.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b);
    const isFav = favorites.includes(id);
    const nextFav = isFav ? favorites.filter(f => f !== id) : [...favorites, id];
    setBookmarks(nextBm); setFavorites(nextFav);
    saveAll(nextBm, folders, nextFav);
  };

  const openNewBookmark = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, folderId: typeof selectedFolderId === "string" && !selectedFolderId.startsWith("__") ? selectedFolderId : "" });
    setShowAdd(true);
  };

  const startEdit = (b) => {
    setEditId(b.id);
    setForm({ title: b.title, url: b.url, folderId: b.folderId || "", description: b.description || "", status: b.status || "not_started", progress: b.progress || 0, notes: b.notes || "", importance: b.importance || 0 });
    setShowAdd(true);
  };

  const submit = () => {
    if (!form.title.trim() || !form.url.trim()) return;
    let url = form.url.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const folderId = form.folderId || (folders[0]?.id || "f_other");
    const folder = folders.find(f => f.id === folderId);
    const category = folder ? folder.name : "Other";
    if (editId !== null) {
      persist(bookmarks.map(b => b.id === editId ? { ...b, ...form, url, folderId, category } : b));
    } else {
      persist([...bookmarks, { id: Date.now(), ...form, url, folderId, category, visits: 0 }]);
    }
    setEditId(null); setShowAdd(false);
  };

  const del = (id) => persist(bookmarks.filter(b => b.id !== id));

  // ── Folder CRUD ───────────────────────────────────────────────────────────
  const createFolder = (parentId = null) => {
    const newId = "f_" + Date.now();
    const siblings = folders.filter(f => f.parentId === parentId);
    const nextFolders = [...folders, { id: newId, name: "New Folder", parentId, order: siblings.length }];
    persistFolders(nextFolders);
    setRenamingFolderId(newId);
    setRenameValue("New Folder");
    // Expand parent so new folder is visible
    if (parentId) setExpandedFolderIds(prev => new Set([...prev, parentId]));
    setContextMenu(null);
  };

  const confirmRenameFolder = () => {
    const name = renameValue.trim();
    if (!name) { setRenamingFolderId(null); return; }
    persistFolders(folders.map(f => f.id === renamingFolderId ? { ...f, name } : f));
    // Also update category field on bookmarks in that folder
    const nextBm = bookmarks.map(b => b.folderId === renamingFolderId ? { ...b, category: name } : b);
    persistBmAndFolders(nextBm, folders.map(f => f.id === renamingFolderId ? { ...f, name } : f));
    setRenamingFolderId(null);
  };

  const deleteFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    // Reparent direct children to folder's parent
    const nextFolders = folders
      .filter(f => f.id !== folderId)
      .map(f => f.parentId === folderId ? { ...f, parentId: folder.parentId } : f);
    // Move bookmarks in this folder to parent folder (or first top-level)
    const fallback = folder.parentId || folders.find(f => f.parentId === null && f.id !== folderId)?.id || "";
    const nextBm = bookmarks.map(b => b.folderId === folderId ? { ...b, folderId: fallback } : b);
    if (selectedFolderId === folderId) setSelectedFolderId(null);
    persistBmAndFolders(nextBm, nextFolders);
    setContextMenu(null);
  };

  const moveBookmarkToFolder = (bookmarkId, targetFolderId) => {
    const folder = folders.find(f => f.id === targetFolderId);
    const nextBm = bookmarks.map(b => b.id === bookmarkId
      ? { ...b, folderId: targetFolderId, category: folder ? folder.name : b.category }
      : b
    );
    persist(nextBm);
    setMovingBookmarkId(null);
  };

  const handleFolderAction = (folderId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({ folderId, x: rect.right + 4, y: rect.top });
  };

  const toggleFolderExpand = (folderId) => {
    setExpandedFolderIds(prev => {
      const next = new Set(prev);
      next.has(folderId) ? next.delete(folderId) : next.add(folderId);
      return next;
    });
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const isSearch = !!query;
  const isHome = selectedFolderId === null && !isSearch;

  const applySearch = (list) => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      (b.category || "").toLowerCase().includes(q) ||
      (b.description || "").toLowerCase().includes(q)
    );
  };

  const getDescendantFolderIds = (folderId) => {
    const result = new Set([folderId]);
    const children = folders.filter(f => f.parentId === folderId);
    children.forEach(child => getDescendantFolderIds(child.id).forEach(id => result.add(id)));
    return result;
  };

  const getFolderPath = (folderId) => {
    const parts = [];
    let current = folders.find(f => f.id === folderId);
    while (current) {
      parts.unshift(current.name);
      current = folders.find(f => f.id === current.parentId);
    }
    return parts.join(" › ");
  };

  // Build indented folder options for FolderPicker
  const buildFolderOptions = (parentId, depth) => {
    const children = folders.filter(f => f.parentId === parentId).sort((a, b) => a.order - b.order);
    return children.flatMap(f => [{ id: f.id, label: "\u00a0".repeat(depth * 3) + f.name }, ...buildFolderOptions(f.id, depth + 1)]);
  };

  // What to show in the content area
  const visibleBookmarks = (() => {
    if (isSearch) {
      // Search: filter within selected folder (or all if no folder selected)
      const pool = (selectedFolderId && !selectedFolderId.startsWith("__"))
        ? bookmarks.filter(b => getDescendantFolderIds(selectedFolderId).has(b.folderId))
        : bookmarks;
      return applySearch(pool);
    }
    if (selectedFolderId === "__important__")
      return bookmarks.filter(b => (b.importance || 0) >= 1).sort((a, b) => (b.importance || 0) - (a.importance || 0));
    if (selectedFolderId === "__recent__")
      return bookmarks.filter(b => b.lastVisited).sort((a, b) => new Date(b.lastVisited) - new Date(a.lastVisited)).slice(0, 15);
    if (selectedFolderId === null) return []; // home view handled separately
    // Folder selected: show bookmarks in this folder and all descendants
    const ids = getDescendantFolderIds(selectedFolderId);
    return bookmarks.filter(b => ids.has(b.folderId));
  })();

  const selectedFolder = folders.find(f => f.id === selectedFolderId);
  const contentTitle = isSearch ? `"${query}"`
    : selectedFolderId === "__important__" ? "Important"
    : selectedFolderId === "__recent__" ? "Recent"
    : selectedFolder ? getFolderPath(selectedFolderId)
    : "Home";

  // Home view data
  const recentBookmarks = bookmarks.filter(b => b.lastVisited).sort((a, b) => new Date(b.lastVisited) - new Date(a.lastVisited)).slice(0, 10);
  const importantBookmarks = bookmarks.filter(b => (b.importance || 0) >= 1).sort((a, b) => (b.importance || 0) - (a.importance || 0)).slice(0, 10);
  const favoriteBookmarks = favorites.map(id => bookmarks.find(b => b.id === id)).filter(Boolean);

  // ── Render ────────────────────────────────────────────────────────────────
  const sidebarProps = {
    collapsed: sidebarCollapsed,
    onToggleCollapse: () => setSidebarCollapsed(v => !v),
    query, onQueryChange: setQuery,
    selectedFolderId, onSelectFolder: (id) => { setSelectedFolderId(id); setQuery(""); setSidebarMobileOpen(false); },
    folders, bookmarks, expandedFolderIds,
    onToggleFolderExpand: toggleFolderExpand,
    onFolderAction: handleFolderAction,
    favorites,
    onNewFolder: () => createFolder(typeof selectedFolderId === "string" && !selectedFolderId.startsWith("__") ? selectedFolderId : null),
    onNewBookmark: openNewBookmark,
    onLinkClick: handleLinkClick,
  };

  const bookmarkRowProps = {
    expandedId, onToggleExpand: (id) => setExpandedId(prev => prev === id ? null : id),
    onTogglePin: togglePin, onEdit: startEdit, onDelete: del,
    onUpdateField: updateField, onLinkClick: handleLinkClick,
  };

  return (
    <ErrorBoundary name="Knowledge Base">
      <div style={s.root}>
        <style>{css}</style>

        {/* Mobile overlay backdrop */}
        {sidebarMobileOpen && (
          <div style={s.backdrop} onClick={() => setSidebarMobileOpen(false)} />
        )}

        {/* Sidebar — desktop sticky / mobile overlay */}
        <div
          className={sidebarMobileOpen ? undefined : "kb-sidebar-desktop"}
          style={sidebarMobileOpen ? s.sidebarOverlay : undefined}
        >
          <Sidebar {...sidebarProps} />
        </div>

        {/* Content area */}
        <div style={s.content}>
          {/* Mobile header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h1 style={s.contentTitle}>{contentTitle}</h1>
              {!isHome && (
                <p style={s.contentSubtitle}>
                  {loading ? "Loading…" : `${visibleBookmarks.length} bookmark${visibleBookmarks.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                className="kb-mobile-menu-btn"
                style={{ ...s.mobileMenuBtn, display: "flex" }}
                onClick={() => setSidebarMobileOpen(v => !v)}
                aria-label="Open sidebar"
              >
                <Menu size={18} />
              </button>
              <button className="kb-add" onClick={openNewBookmark} style={{ ...s.sidebarAddBtn, width: "auto", padding: "7px 14px" }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Add/Edit form */}
          {showAdd && (
            <div style={{ marginBottom: 20 }}>
              <AddEditForm
                form={form} setForm={setForm} folders={folders}
                editId={editId} onSubmit={submit}
                onCancel={() => { setShowAdd(false); setEditId(null); }}
              />
            </div>
          )}

          {loading && <p style={s.empty}>Loading…</p>}

          {/* ── Home view ── */}
          {!loading && isHome && (
            <div>
              {/* Favorites */}
              {favoriteBookmarks.length > 0 && (
                <div style={s.homeSection}>
                  <p style={s.homeSectionTitle}>Favorites</p>
                  <div style={s.homeCardGrid}>
                    {favoriteBookmarks.map(b => (
                      <a key={b.id} href={b.url} onClick={(e) => handleLinkClick(e, b)} style={s.homeCard} className="kb-home-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Star size={12} style={{ color: "#facc15", flexShrink: 0 }} />
                          <span style={s.homeCardTitle}>{b.title}</span>
                        </div>
                        {b.description && <span style={s.homeCardDesc}>{b.description}</span>}
                        <span style={s.homeCardMeta}>{b.category}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent */}
              {recentBookmarks.length > 0 && (
                <div style={s.homeSection}>
                  <p style={s.homeSectionTitle}>Recently Visited</p>
                  <div style={s.homeCardGrid}>
                    {recentBookmarks.map(b => (
                      <a key={b.id} href={b.url} onClick={(e) => handleLinkClick(e, b)} style={s.homeCard} className="kb-home-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Clock size={12} style={{ color: "#3b82f6", flexShrink: 0 }} />
                          <span style={s.homeCardTitle}>{b.title}</span>
                        </div>
                        {b.description && <span style={s.homeCardDesc}>{b.description}</span>}
                        <span style={s.homeCardMeta}>{b.category} · {new Date(b.lastVisited).toLocaleDateString()}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Important */}
              {importantBookmarks.length > 0 && (
                <div style={s.homeSection}>
                  <p style={s.homeSectionTitle}>Important</p>
                  <div style={s.homeCardGrid}>
                    {importantBookmarks.map(b => (
                      <a key={b.id} href={b.url} onClick={(e) => handleLinkClick(e, b)} style={s.homeCard} className="kb-home-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <AlertTriangle size={12} style={{ color: importanceColor[b.importance], flexShrink: 0 }} />
                          <span style={s.homeCardTitle}>{b.title}</span>
                        </div>
                        {b.description && <span style={s.homeCardDesc}>{b.description}</span>}
                        <span style={s.homeCardMeta}>{b.category}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              {favoriteBookmarks.length === 0 && recentBookmarks.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: 48 }}>
                  <FolderOpen size={40} style={{ color: "#1f2937", margin: "0 auto 16px" }} />
                  <p style={{ ...s.empty, padding: 0 }}>{bookmarks.length} bookmarks across {folders.filter(f => f.parentId !== null || folders.some(c => c.parentId === f.id) === false).length} folders</p>
                  <p style={{ fontSize: 13, color: "#52525b", marginTop: 8 }}>Select a folder in the sidebar to browse, or star bookmarks to add favorites.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Folder / smart folder / search view ── */}
          {!loading && (isSearch || selectedFolderId !== null) && (
            <div style={s.listWrap}>
              {/* Search results — grouped by folder path */}
              {query ? (
                visibleBookmarks.length === 0
                  ? <p style={s.empty}>No bookmarks match "{query}".</p>
                  : (
                    <div style={s.groupWrap}>
                      <div style={s.groupHeader}>
                        <div style={s.groupHeaderLeft}>
                          <span style={s.groupTitle}>Results</span>
                          <span style={s.groupCount}>{visibleBookmarks.length}</span>
                        </div>
                      </div>
                      <div style={s.listWrapInner}>
                        {visibleBookmarks.map((b, i) => (
                          <div key={b.id}>
                            <p style={{ ...s.searchResultPath, padding: "4px 12px 0", fontSize: 10 }}>{getFolderPath(b.folderId)}</p>
                            <BookmarkRow
                              bookmark={b} isExpanded={expandedId === b.id}
                              isLastRow={i === visibleBookmarks.length - 1}
                              {...bookmarkRowProps}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              ) : (
                /* Normal folder / smart folder view */
                visibleBookmarks.length === 0
                  ? (
                    <div style={{ textAlign: "center", paddingTop: 40 }}>
                      <p style={s.empty}>
                        {selectedFolderId === "__important__" ? "No bookmarks marked as important yet." :
                         selectedFolderId === "__recent__" ? "No bookmarks visited yet." :
                         "This folder is empty."}
                      </p>
                    </div>
                  )
                  : (
                    <BookmarkList
                      bookmarks={visibleBookmarks}
                      title={contentTitle}
                      isCollapsible={false}
                      isCollapsed={false}
                      {...bookmarkRowProps}
                    />
                  )
              )}
            </div>
          )}

          {/* Move bookmark picker overlay */}
          {movingBookmarkId && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#161b27", border: "1px solid #1f2937", borderRadius: 12, padding: 20, minWidth: 280, maxWidth: 360 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#f3f4f6", marginBottom: 12 }}>Move to folder</p>
                <select
                  size={8}
                  style={{ width: "100%", background: "#0f1117", border: "1px solid #1f2937", borderRadius: 6, padding: 8, fontSize: 13, color: "#f3f4f6", outline: "none", cursor: "pointer" }}
                  onChange={(e) => moveBookmarkToFolder(movingBookmarkId, e.target.value)}
                >
                  {buildFolderOptions(null, 0).map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <button onClick={() => setMovingBookmarkId(null)} style={{ marginTop: 10, padding: "6px 12px", background: "#1f2937", border: "none", borderRadius: 6, color: "#6b7280", cursor: "pointer", fontSize: 13 }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <p style={s.footer}>{bookmarks.length} bookmarks</p>
        </div>

        {/* Folder rename inline modal */}
        {renamingFolderId && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#161b27", border: "1px solid #1f2937", borderRadius: 12, padding: 20, minWidth: 280 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#f3f4f6", marginBottom: 12 }}>Rename folder</p>
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmRenameFolder(); if (e.key === "Escape") setRenamingFolderId(null); }}
                style={{ ...s.formInput, marginBottom: 12 }}
                autoFocus
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button className="kb-save" onClick={confirmRenameFolder} style={s.formBtnSave}><Check size={14} /> Save</button>
                <button className="kb-cancel" onClick={() => setRenamingFolderId(null)} style={s.formBtnCancel}><X size={14} /> Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Folder context menu */}
        {contextMenu && (
          <div
            ref={contextMenuRef}
            style={{ ...s.contextMenu, left: Math.min(contextMenu.x, window.innerWidth - 170), top: contextMenu.y }}
          >
            <button className="kb-ctx-item" style={s.contextMenuItem}
              onClick={() => { setRenamingFolderId(contextMenu.folderId); setRenameValue(folders.find(f => f.id === contextMenu.folderId)?.name || ""); setContextMenu(null); }}>
              <Edit2 size={13} /> Rename
            </button>
            <button className="kb-ctx-item" style={s.contextMenuItem}
              onClick={() => createFolder(contextMenu.folderId)}>
              <FolderPlus size={13} /> New Subfolder
            </button>
            <div style={{ borderTop: "1px solid #1f2937", margin: "4px 0" }} />
            <button className="kb-ctx-item kb-ctx-item-danger" style={{ ...s.contextMenuItem, color: "#f87171" }}
              onClick={() => deleteFolder(contextMenu.folderId)}>
              <Trash2 size={13} /> Delete Folder
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
