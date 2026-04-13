import { ExternalLink, Star, ChevronDown, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { s, statusColor, statusLabel, importanceColor, importanceLabel } from "./constants";

export default function BookmarkRow({ bookmark: b, isExpanded, onToggleExpand, onTogglePin, onEdit, onDelete, onUpdateField, onLinkClick, isLastRow }) {
  const isPinned = b.pinned;
  return (
    <div>
      <div
        className="kb-row"
        style={{ ...s.listRow, ...(!isLastRow || isExpanded ? s.listRowBorder : {}) }}
      >
        {/* Star/pin */}
        <button
          className={`kb-star${isPinned ? " pinned" : ""}`}
          onClick={() => onTogglePin(b.id)}
          style={s.starBtn}
          title={isPinned ? "Remove from favorites" : "Add to favorites"}
        >
          <Star size={14} fill={isPinned ? "#facc15" : "none"} />
        </button>

        {/* Category badge */}
        <span style={s.categoryBadge}>{b.category}</span>

        {/* Title link + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <a href={b.url} onClick={(e) => onLinkClick(e, b)} style={s.linkArea}>
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
          onClick={() => onToggleExpand(b.id)}
          style={s.expandBtn}
          title="Details"
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Edit / delete */}
        <div className="kb-actions" style={{ display: "flex", gap: 4 }}>
          <button className="kb-act" onClick={() => onEdit(b)} style={s.actionBtn}>
            <Edit2 size={14} />
          </button>
          <button className="kb-act kb-del" onClick={() => onDelete(b.id)} style={s.actionBtn}>
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
                  onClick={() => onUpdateField(b.id, "status", st)}
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
                  onClick={() => onUpdateField(b.id, "importance", val)}
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
                onChange={(e) => onUpdateField(b.id, "progress", Number(e.target.value))}
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
              onChange={(e) => onUpdateField(b.id, "notes", e.target.value)}
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
}
