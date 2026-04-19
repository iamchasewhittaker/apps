import { useState, useEffect, useRef, useMemo } from "react";
import { Menu, Plus, X, Check, Edit2, Trash2, FolderPlus, FolderOpen, AlertTriangle, Clock, Star, Copy } from "lucide-react";
import {
  SEED, SEED_FOLDERS, SEED_VERSION, STORE_SEED_VERSION, categoryToFolderId,
  FOLDER_LAYOUT_VERSION, STORE_FOLDER_LAYOUT_VERSION,
  mergeFolderTrees, migrateLegacyBookmarkLayout, normalizeBookmarkUrl,
  buildSeedUrlLookup, SEED_URL_OVERLAYS, SEED_URL_PATCH_IDS,
  URL_PATCH_VERSION, STORE_URL_PATCH_VERSION,
  DAILY_PROMPT_BOOKMARK_IDS,
  load, save, s, css,
  statusColor, statusLabel, importanceColor, importanceLabel,
  normalizeBookmarkTags, parseTagsInput,
} from "./constants";
import ErrorBoundary from "./ErrorBoundary";
import Sidebar from "./Sidebar";
import BookmarkList from "./BookmarkList";
import BookmarkRow from "./BookmarkRow";
import AddEditForm from "./AddEditForm";

function faviconUrl(url) {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`; }
  catch { return null; }
}

const EMPTY_FORM = { title: "", url: "", folderId: "", description: "", status: "not_started", progress: 0, notes: "", importance: 0, tagsStr: "" };

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
  const [selectedTag, setSelectedTag] = useState(null);

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
    const layoutVStored = Number(localStorage.getItem(STORE_FOLDER_LAYOUT_VERSION)) || 0;
    const urlPatchStored = Number(localStorage.getItem(STORE_URL_PATCH_VERSION)) || 0;

    let storedBm = [], storedFolders = null, storedFavs = [];
    if (data) {
      storedBm = data.bookmarks || [];
      storedFolders = data.folders || null;
      storedFavs = data.favorites || [];
    }

    // Merge new seed bookmarks (append-only by id)
    let mergedBm = storedBm;
    if (v < SEED_VERSION || !data) {
      const ids = new Set(storedBm.map((b) => b.id));
      mergedBm = [...storedBm, ...SEED.filter((b) => !ids.has(b.id))];
    }

    mergedBm = mergedBm.map((b) => normalizeBookmarkTags(b));
    mergedBm = mergedBm.map(normalizeBookmarkUrl);
    mergedBm = mergedBm.map(migrateLegacyBookmarkLayout);

    if (urlPatchStored < URL_PATCH_VERSION) {
      const seedUrls = buildSeedUrlLookup(SEED);
      mergedBm = mergedBm.map((b) => {
        if (SEED_URL_OVERLAYS[b.id] != null) {
          return { ...b, url: SEED_URL_OVERLAYS[b.id] };
        }
        if (SEED_URL_PATCH_IDS.has(b.id) && seedUrls.has(b.id)) {
          return { ...b, url: seedUrls.get(b.id) };
        }
        return b;
      });
      localStorage.setItem(STORE_URL_PATCH_VERSION, String(URL_PATCH_VERSION));
    }

    // Ensure every bookmark has a folderId
    mergedBm = mergedBm.map((b) =>
      b.folderId ? b : { ...b, folderId: categoryToFolderId(b.category || "Other") },
    );

    const nextFolders = mergeFolderTrees(storedFolders || [], SEED_FOLDERS);
    if (layoutVStored < FOLDER_LAYOUT_VERSION) {
      localStorage.setItem(STORE_FOLDER_LAYOUT_VERSION, String(FOLDER_LAYOUT_VERSION));
    }

    // Migrate pinned → favorites on first run
    let nextFavs = storedFavs;
    if (!storedFolders) {
      const pinnedIds = mergedBm.filter((b) => b.pinned).map((b) => b.id);
      const favSet = new Set(storedFavs);
      pinnedIds.forEach((id) => favSet.add(id));
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
      if (e.key === "Escape") {
        setContextMenu(null);
        setShowAdd(false);
        setMovingBookmarkId(null);
        setSelectedTag(null);
        setSelectedFolderId((fid) => (fid === "__tag_filter__" ? null : fid));
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Persist helpers ───────────────────────────────────────────────────────
  const saveAll = (nextBm, nextFolders, nextFavs) =>
    save({ bookmarks: nextBm, categoryOrder: null, folders: nextFolders, favorites: nextFavs });

  const persist = (nextBm) => { setBookmarks(nextBm); saveAll(nextBm, folders, favorites); };

  const importInputRef = useRef(null);

  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify({ bookmarks, folders, favorites, categoryOrder: null }, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `knowledge-base-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const incomingBm = data.bookmarks || [];
        const incomingFolders = data.folders || [];
        const incomingFavs = data.favorites || [];
        const existingIds = new Set(bookmarks.map(b => b.id));
        const newBm = [...bookmarks, ...incomingBm.filter(b => !existingIds.has(b.id))];
        const existingFolderIds = new Set(folders.map(f => f.id));
        const newFolders = [...folders, ...incomingFolders.filter(f => !existingFolderIds.has(f.id))];
        const newFavs = [...new Set([...favorites, ...incomingFavs])];
        setBookmarks(newBm); setFolders(newFolders); setFavorites(newFavs);
        saveAll(newBm, newFolders, newFavs);
      } catch { /* invalid file */ }
    };
    reader.readAsText(file);
  };
  const persistFolders = (nextF) => { setFolders(nextF); saveAll(bookmarks, nextF, favorites); };
  const persistFavorites = (nextFav) => { setFavorites(nextFav); saveAll(bookmarks, folders, nextFav); };
  const persistBmAndFolders = (nextBm, nextF) => { setBookmarks(nextBm); setFolders(nextF); saveAll(nextBm, nextF, favorites); };

  const copyPromptNotes = async (b) => {
    try {
      await navigator.clipboard.writeText(b.notes || "");
    } catch {
      /* ignore */
    }
  };

  // ── Bookmark CRUD ─────────────────────────────────────────────────────────
  const handleLinkClick = (e, b) => {
    e.preventDefault();
    persist(bookmarks.map(x => x.id === b.id ? { ...x, visits: (x.visits || 0) + 1, lastVisited: new Date().toISOString() } : x));
    window.open(b.url, "_blank", "noopener,noreferrer");
  };

  const renderHomeBookmarkCard = (b, Icon, iconColor, metaLine) => {
    const fav = faviconUrl(b.url);
    const head = (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {fav
            ? <img src={fav} width={12} height={12} style={{ flexShrink: 0, borderRadius: 2 }} alt=""
                onError={e => { e.target.style.display = "none"; }} />
            : <Icon size={12} style={{ color: iconColor, flexShrink: 0 }} />}
          <span style={s.homeCardTitle}>{b.title}</span>
        </div>
        {b.description && <span style={s.homeCardDesc}>{b.description}</span>}
        <span style={s.homeCardMeta}>{metaLine}</span>
      </>
    );
    if (DAILY_PROMPT_BOOKMARK_IDS.has(b.id)) {
      return (
        <div key={b.id} style={{ ...s.homeCard, padding: 0, overflow: "hidden" }} className="kb-home-card">
          <a href={b.url} onClick={(e) => handleLinkClick(e, b)} style={{ ...s.homeCard, border: "none", borderRadius: 0, flex: 1, padding: "10px 14px" }}>
            {head}
          </a>
          <button type="button" onClick={() => copyPromptNotes(b)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", border: "none", borderTop: "1px solid #1f2937", background: "#121620", color: "#a1a1aa", fontSize: 12, padding: "8px 14px", cursor: "pointer" }}>
            <Copy size={12} /> Copy prompt
          </button>
        </div>
      );
    }
    return (
      <a key={b.id} href={b.url} onClick={(e) => handleLinkClick(e, b)} style={s.homeCard} className="kb-home-card">
        {head}
      </a>
    );
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
    setForm({
      title: b.title, url: b.url, folderId: b.folderId || "", description: b.description || "", status: b.status || "not_started", progress: b.progress || 0, notes: b.notes || "", importance: b.importance || 0,
      tagsStr: (b.tags || []).join(", "),
    });
    setShowAdd(true);
  };

  const submit = () => {
    if (!form.title.trim() || !form.url.trim()) return;
    let url = form.url.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const folderId = form.folderId || (folders[0]?.id || "f_other");
    const folder = folders.find(f => f.id === folderId);
    const category = folder ? folder.name : "Other";
    const tags = parseTagsInput(form.tagsStr);
    const { tagsStr, ...restForm } = form;
    if (editId !== null) {
      persist(bookmarks.map(b => b.id === editId ? normalizeBookmarkTags({ ...b, ...restForm, url, folderId, category, tags }) : b));
    } else {
      persist([...bookmarks, normalizeBookmarkTags({ id: Date.now(), ...restForm, url, folderId, category, visits: 0, tags })]);
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
  const isHome = selectedFolderId === null && !isSearch && !selectedTag;

  const applySearch = (list) => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      (b.category || "").toLowerCase().includes(q) ||
      (b.description || "").toLowerCase().includes(q) ||
      (b.tags || []).some((t) => t.includes(q))
    );
  };

  const handleSelectFolder = (id) => {
    setSelectedFolderId(id);
    setSelectedTag(null);
    setQuery("");
    setSidebarMobileOpen(false);
  };

  const handleFilterByTag = (tag) => {
    if (!tag) return;
    if (selectedTag === tag && selectedFolderId === "__tag_filter__") {
      setSelectedTag(null);
      setSelectedFolderId(null);
      return;
    }
    setSelectedTag(tag);
    setSelectedFolderId("__tag_filter__");
    setQuery("");
    setSidebarMobileOpen(false);
  };

  const tagSummaries = useMemo(() => {
    const m = new Map();
    for (const b of bookmarks) {
      for (const t of b.tags || []) {
        m.set(t, (m.get(t) || 0) + 1);
      }
    }
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 48)
      .map(([tag, count]) => ({ tag, count }));
  }, [bookmarks]);

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
      let pool = bookmarks;
      if (selectedFolderId === "__tag_filter__") {
        pool = selectedTag ? bookmarks.filter((b) => (b.tags || []).includes(selectedTag)) : [];
      } else if (selectedFolderId && !selectedFolderId.startsWith("__")) {
        pool = bookmarks.filter((b) => getDescendantFolderIds(selectedFolderId).has(b.folderId));
      }
      if (selectedTag && selectedFolderId !== "__tag_filter__") {
        pool = pool.filter((b) => (b.tags || []).includes(selectedTag));
      }
      return applySearch(pool);
    }
    if (selectedFolderId === "__important__") {
      let list = bookmarks.filter(b => (b.importance || 0) >= 1).sort((a, b) => (b.importance || 0) - (a.importance || 0));
      if (selectedTag) list = list.filter((b) => (b.tags || []).includes(selectedTag));
      return list;
    }
    if (selectedFolderId === "__recent__") {
      let list = bookmarks.filter(b => b.lastVisited).sort((a, b) => new Date(b.lastVisited) - new Date(a.lastVisited)).slice(0, 15);
      if (selectedTag) list = list.filter((b) => (b.tags || []).includes(selectedTag));
      return list;
    }
    if (selectedFolderId === "__tag_filter__") {
      if (!selectedTag) return [];
      return bookmarks.filter((b) => (b.tags || []).includes(selectedTag));
    }
    if (selectedFolderId === null) return []; // home view handled separately
    const ids = getDescendantFolderIds(selectedFolderId);
    let list = bookmarks.filter(b => ids.has(b.folderId));
    if (selectedTag) list = list.filter((b) => (b.tags || []).includes(selectedTag));
    return list;
  })();

  const selectedFolder = folders.find(f => f.id === selectedFolderId);
  const contentTitle = isSearch ? `"${query}"`
    : selectedFolderId === "__important__" ? "Important"
    : selectedFolderId === "__recent__" ? "Recent"
    : selectedFolderId === "__tag_filter__" ? `Tag: ${selectedTag || ""}`
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
    selectedFolderId, onSelectFolder: handleSelectFolder,
    folders, bookmarks, expandedFolderIds,
    onToggleFolderExpand: toggleFolderExpand,
    onFolderAction: handleFolderAction,
    favorites,
    onNewFolder: () => createFolder(typeof selectedFolderId === "string" && !selectedFolderId.startsWith("__") ? selectedFolderId : null),
    onNewBookmark: openNewBookmark,
    onLinkClick: handleLinkClick,
    tagSummaries,
    selectedTag,
    onSelectTag: handleFilterByTag,
    onExport: handleExport,
    onImport: () => importInputRef.current?.click(),
  };

  const bookmarkRowProps = {
    expandedId, onToggleExpand: (id) => setExpandedId(prev => prev === id ? null : id),
    onTogglePin: togglePin, onEdit: startEdit, onDelete: del,
    onUpdateField: updateField, onLinkClick: handleLinkClick,
    selectedTag,
    onTagClick: handleFilterByTag,
  };

  return (
    <ErrorBoundary name="Knowledge Base">
      <div style={s.root}>
        <style>{css}</style>
        <input
          ref={importInputRef} type="file" accept=".json"
          style={{ display: "none" }}
          onChange={e => { if (e.target.files[0]) handleImport(e.target.files[0]); e.target.value = ""; }}
        />

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
                    {favoriteBookmarks.map((b) => renderHomeBookmarkCard(b, Star, "#facc15", b.category))}
                  </div>
                </div>
              )}

              {/* Recent */}
              {recentBookmarks.length > 0 && (
                <div style={s.homeSection}>
                  <p style={s.homeSectionTitle}>Recently Visited</p>
                  <div style={s.homeCardGrid}>
                    {recentBookmarks.map((b) =>
                      renderHomeBookmarkCard(b, Clock, "#3b82f6", `${b.category} · ${new Date(b.lastVisited).toLocaleDateString()}`),
                    )}
                  </div>
                </div>
              )}

              {/* Important */}
              {importantBookmarks.length > 0 && (
                <div style={s.homeSection}>
                  <p style={s.homeSectionTitle}>Important</p>
                  <div style={s.homeCardGrid}>
                    {importantBookmarks.map((b) =>
                      renderHomeBookmarkCard(b, AlertTriangle, importanceColor[b.importance], b.category),
                    )}
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
