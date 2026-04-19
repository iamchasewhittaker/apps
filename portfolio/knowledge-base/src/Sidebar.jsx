import { Search, Star, Clock, AlertTriangle, Plus, FolderPlus, ChevronLeft, ChevronRight, ExternalLink, Download, Upload } from "lucide-react";
import { s } from "./constants";
import FolderTree from "./FolderTree";

export default function Sidebar({
  // Layout
  collapsed, onToggleCollapse,
  // Search
  query, onQueryChange,
  // Selection
  selectedFolderId, onSelectFolder,
  // Folder tree
  folders, bookmarks, expandedFolderIds, onToggleFolderExpand, onFolderAction,
  // Favorites
  favorites,
  // Actions
  onNewFolder, onNewBookmark,
  // Import / export
  onExport, onImport,
  // Link click tracking
  onLinkClick,
  // Tags (Forever-notes style cross-cutting filter)
  tagSummaries = [],
  selectedTag,
  onSelectTag,
}) {
  const favoriteBookmarks = favorites
    .map(id => bookmarks.find(b => b.id === id))
    .filter(Boolean)
    .slice(0, 12);

  if (collapsed) {
    return (
      <div style={s.sidebarCollapsed}>
        <button
          className="kb-sidebar-toggle"
          onClick={onToggleCollapse}
          style={{ ...s.sidebarToggleBtn, margin: "12px auto", display: "flex" }}
          title="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
        {/* Smart folder icons */}
        <button
          className="kb-folder-row"
          title="Important"
          onClick={() => onSelectFolder("__important__")}
          style={{ ...s.collapsedIconBtn, background: selectedFolderId === "__important__" ? "#1f2937" : "transparent" }}
        >
          <AlertTriangle size={16} style={{ color: "#ef4444" }} />
        </button>
        <button
          className="kb-folder-row"
          title="Recent"
          onClick={() => onSelectFolder("__recent__")}
          style={{ ...s.collapsedIconBtn, background: selectedFolderId === "__recent__" ? "#1f2937" : "transparent" }}
        >
          <Clock size={16} style={{ color: "#3b82f6" }} />
        </button>
        {/* Favorites icons */}
        {favoriteBookmarks.map(b => (
          <a
            key={b.id}
            href={b.url}
            onClick={(e) => onLinkClick(e, b)}
            title={b.title}
            style={s.collapsedFavBtn}
          >
            <Star size={14} style={{ color: "#facc15" }} />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div style={s.sidebar}>
      {/* Header */}
      <div style={s.sidebarHeader}>
        <span style={s.sidebarTitle}>Knowledge Base</span>
        <button
          className="kb-sidebar-toggle"
          onClick={onToggleCollapse}
          style={s.sidebarToggleBtn}
          title="Collapse sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Search */}
      <div style={s.sidebarSearchWrap}>
        <Search size={14} style={s.sidebarSearchIcon} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search…"
          style={s.sidebarSearchInput}
          className="kb-sidebar-search"
          aria-label="Search bookmarks"
        />
      </div>

      {/* Smart folders */}
      <div style={s.sidebarSection}>
        <span style={s.sidebarSectionLabel}>Smart Folders</span>
        <button
          className={`kb-smart-folder${selectedFolderId === "__important__" ? " selected" : ""}`}
          onClick={() => onSelectFolder("__important__")}
          style={{ ...s.smartFolderBtn, background: selectedFolderId === "__important__" ? "#1f2937" : "transparent" }}
        >
          <AlertTriangle size={13} style={{ color: "#ef4444", flexShrink: 0 }} />
          <span style={s.smartFolderName}>Important</span>
        </button>
        <button
          className={`kb-smart-folder${selectedFolderId === "__recent__" ? " selected" : ""}`}
          onClick={() => onSelectFolder("__recent__")}
          style={{ ...s.smartFolderBtn, background: selectedFolderId === "__recent__" ? "#1f2937" : "transparent" }}
        >
          <Clock size={13} style={{ color: "#3b82f6", flexShrink: 0 }} />
          <span style={s.smartFolderName}>Recent</span>
        </button>
      </div>

      {tagSummaries.length > 0 && onSelectTag && (
        <div style={s.sidebarSection}>
          <span style={s.sidebarSectionLabel}>Tags</span>
          <div style={s.tagBar}>
            {tagSummaries.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                className="kb-tag-chip"
                onClick={() => onSelectTag(tag)}
                style={{ ...s.tagChip, ...(selectedTag === tag ? s.tagChipActive : {}) }}
                title={`${count} bookmarks`}
              >
                #{tag}
                <span style={{ opacity: 0.65, marginLeft: 4 }}>{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Favorites shelf */}
      {favoriteBookmarks.length > 0 && (
        <div style={s.sidebarSection}>
          <span style={s.sidebarSectionLabel}>Favorites</span>
          <div style={s.favsList}>
            {favoriteBookmarks.map(b => (
              <a
                key={b.id}
                href={b.url}
                onClick={(e) => onLinkClick(e, b)}
                style={s.favItem}
                className="kb-fav-item"
                title={b.url}
              >
                <Star size={11} style={{ color: "#facc15", flexShrink: 0 }} />
                <span style={s.favTitle}>{b.title}</span>
                <ExternalLink size={10} style={{ color: "#52525b", flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Folder tree — this section gets remaining height and scrolls internally */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={s.sidebarSectionLabel}>Folders</span>
          <button className="kb-sidebar-act" onClick={onNewFolder} style={s.sidebarActBtn} title="New folder">
            <FolderPlus size={13} />
          </button>
        </div>
        {/* All bookmarks row */}
        <button
          className={`kb-folder-row${selectedFolderId === null && !selectedTag ? " selected" : ""}`}
          onClick={() => onSelectFolder(null)}
          style={{ ...s.allBooksBtn, background: selectedFolderId === null && !selectedTag ? "#1f2937" : "transparent" }}
        >
          <span style={{ ...s.folderName, color: selectedFolderId === null && !selectedTag ? "#f3f4f6" : "#6b7280" }}>All Bookmarks</span>
          <span style={s.folderCount}>{bookmarks.length}</span>
        </button>
        <FolderTree
          folders={folders}
          bookmarks={bookmarks}
          selectedFolderId={selectedFolderId}
          onSelectFolder={onSelectFolder}
          expandedFolderIds={expandedFolderIds}
          onToggleFolderExpand={onToggleFolderExpand}
          onFolderAction={onFolderAction}
        />
      </div>

      {/* Bottom actions */}
      <div style={{ ...s.sidebarFooter, flexDirection: "column", gap: 6 }}>
        <button className="kb-add" onClick={onNewBookmark} style={s.sidebarAddBtn}>
          <Plus size={14} /> New Bookmark
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="kb-sidebar-act" onClick={onExport} style={{ ...s.sidebarActBtn, flex: 1, justifyContent: "center", gap: 5, fontSize: 12, padding: "5px 8px", color: "#a1a1aa" }} title="Export bookmarks as JSON">
            <Download size={13} /> Export
          </button>
          <button className="kb-sidebar-act" onClick={onImport} style={{ ...s.sidebarActBtn, flex: 1, justifyContent: "center", gap: 5, fontSize: 12, padding: "5px 8px", color: "#a1a1aa" }} title="Import bookmarks from JSON">
            <Upload size={13} /> Import
          </button>
        </div>
      </div>
    </div>
  );
}
