import { Check, X } from "lucide-react";
import { s, statusColor, statusLabel } from "./constants";

export default function AddEditForm({ form, setForm, folders, editId, onSubmit, onCancel }) {
  // Build indented folder options for the picker
  const buildOptions = (parentId, depth) => {
    const children = folders
      .filter(f => f.parentId === parentId)
      .sort((a, b) => a.order - b.order);
    return children.flatMap(f => [
      { id: f.id, label: "\u00a0".repeat(depth * 3) + f.name },
      ...buildOptions(f.id, depth + 1),
    ]);
  };
  const folderOptions = buildOptions(null, 0);

  return (
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
      {/* Folder picker */}
      <select
        value={form.folderId || ""}
        onChange={(e) => setForm({ ...form, folderId: e.target.value })}
        style={{ ...s.formInput, cursor: "pointer" }}
      >
        <option value="">Select a folder…</option>
        {folderOptions.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
      <input
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description (optional)"
        style={s.formInput}
      />
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
      <textarea
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        placeholder="Notes (optional)"
        style={{ ...s.notesArea, marginBottom: 8 }}
      />
      <div style={s.formActions}>
        <button className="kb-save" onClick={onSubmit} style={s.formBtnSave}>
          <Check size={16} /> {editId !== null ? "Save" : "Add"}
        </button>
        <button className="kb-cancel" onClick={onCancel} style={s.formBtnCancel}>
          <X size={16} /> Cancel
        </button>
      </div>
    </div>
  );
}
