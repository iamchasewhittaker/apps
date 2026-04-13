import { ChevronRight, ChevronDown, Folder, FolderOpen, MoreHorizontal, Plus } from "lucide-react";
import { s } from "./constants";

export default function FolderTree({ folders, bookmarks, selectedFolderId, onSelectFolder, expandedFolderIds, onToggleFolderExpand, onFolderAction }) {

  const countInFolder = (folderId) => {
    // Count bookmarks in this folder and all descendants
    const descendantIds = getDescendantIds(folderId);
    descendantIds.add(folderId);
    return bookmarks.filter(b => descendantIds.has(b.folderId)).length;
  };

  const getDescendantIds = (folderId) => {
    const result = new Set();
    const children = folders.filter(f => f.parentId === folderId);
    children.forEach(child => {
      result.add(child.id);
      getDescendantIds(child.id).forEach(id => result.add(id));
    });
    return result;
  };

  const renderFolder = (folder, depth) => {
    const children = folders
      .filter(f => f.parentId === folder.id)
      .sort((a, b) => a.order - b.order);
    const hasChildren = children.length > 0;
    const isExpanded = expandedFolderIds.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const count = countInFolder(folder.id);

    return (
      <div key={folder.id}>
        <div
          className={`kb-folder-row${isSelected ? " selected" : ""}`}
          style={{
            ...s.folderRow,
            paddingLeft: 12 + depth * 16,
            background: isSelected ? "#1f2937" : "transparent",
          }}
        >
          {/* Expand/collapse toggle */}
          <button
            style={s.folderChevronBtn}
            onClick={(e) => { e.stopPropagation(); if (hasChildren) onToggleFolderExpand(folder.id); }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {hasChildren
              ? (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />)
              : <span style={{ width: 12 }} />
            }
          </button>

          {/* Folder icon + name */}
          <button
            style={s.folderNameBtn}
            onClick={() => onSelectFolder(folder.id)}
            aria-selected={isSelected}
          >
            {isSelected || isExpanded
              ? <FolderOpen size={14} style={s.folderIcon} />
              : <Folder size={14} style={s.folderIcon} />
            }
            <span style={s.folderName}>{folder.name}</span>
          </button>

          {/* Count badge */}
          {count > 0 && <span style={s.folderCount}>{count}</span>}

          {/* "..." context menu trigger */}
          <button
            className="kb-folder-more"
            style={s.folderMoreBtn}
            onClick={(e) => { e.stopPropagation(); onFolderAction(folder.id, e); }}
            title="Folder actions"
          >
            <MoreHorizontal size={12} />
          </button>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const topLevel = folders
    .filter(f => f.parentId === null)
    .sort((a, b) => a.order - b.order);

  return (
    <div style={s.folderTree} role="tree" aria-label="Bookmark folders">
      {topLevel.map(f => renderFolder(f, 0))}
    </div>
  );
}
