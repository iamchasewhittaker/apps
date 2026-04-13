import { ChevronDown, ChevronRight } from "lucide-react";
import { s } from "./constants";
import BookmarkRow from "./BookmarkRow";

export default function BookmarkList({ bookmarks, title, titleColor, borderColor, isCollapsible, isCollapsed, onToggleCollapse, expandedId, onToggleExpand, onTogglePin, onEdit, onDelete, onUpdateField, onLinkClick }) {
  if (!bookmarks || bookmarks.length === 0) return null;

  const headerStyle = borderColor
    ? { ...s.pinnedHeader, borderColor, borderBottom: "1px solid #1f2937" }
    : s.groupHeader;
  const titleStyle = titleColor
    ? { ...s.pinnedTitle, color: titleColor }
    : s.groupTitle;

  return (
    <div style={s.groupWrap}>
      <div
        className={isCollapsible ? "kb-group-header" : undefined}
        style={headerStyle}
        onClick={isCollapsible ? onToggleCollapse : undefined}
      >
        <div style={s.groupHeaderLeft}>
          <span style={titleStyle}>{title}</span>
          <span style={s.groupCount}>{bookmarks.length}</span>
        </div>
        {isCollapsible && (
          isCollapsed
            ? <ChevronRight size={16} style={s.groupChevron} />
            : <ChevronDown size={16} style={s.groupChevron} />
        )}
      </div>
      {!isCollapsed && (
        <div style={s.listWrapInner}>
          {bookmarks.map((b, i) => (
            <BookmarkRow
              key={b.id}
              bookmark={b}
              isExpanded={expandedId === b.id}
              isLastRow={i === bookmarks.length - 1}
              onToggleExpand={onToggleExpand}
              onTogglePin={onTogglePin}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateField={onUpdateField}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
