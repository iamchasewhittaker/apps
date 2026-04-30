'use client';

import { useState, useRef } from 'react';

interface EditableTextProps {
  slug: string;
  field: 'next_action' | 'recommendation';
  value: string | null;
  placeholder?: string;
}

export function EditableText({ slug, field, value, placeholder = 'Click to add…' }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(value ?? '');
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  async function save() {
    setSaving(true);
    await fetch(`/api/ship/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: current }),
    });
    setSaving(false);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <textarea
          ref={ref}
          autoFocus
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save();
            if (e.key === 'Escape') { setCurrent(value ?? ''); setEditing(false); }
          }}
          rows={3}
          className="w-full rounded-md border border-gold/50 bg-surface/80 px-3 py-2 text-sm text-white focus:outline-none focus:border-gold resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-md border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold hover:bg-gold/20 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={() => { setCurrent(value ?? ''); setEditing(false); }}
            className="rounded-md border border-dimmer px-3 py-1 text-xs font-medium text-steel hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="w-full text-left text-sm group"
    >
      {current ? (
        <span className="text-white group-hover:text-gold transition-colors">
          {current}
        </span>
      ) : (
        <span className="italic text-steel group-hover:text-gold/60 transition-colors">
          {placeholder}
        </span>
      )}
      <span className="ml-1.5 text-[10px] text-steel opacity-0 group-hover:opacity-100 transition-opacity">
        edit
      </span>
    </button>
  );
}

interface EditableStatusProps {
  slug: string;
  value: string;
}

const STATUS_OPTIONS = ['active', 'stalled', 'frozen', 'archived'] as const;

export function EditableStatus({ slug, value }: EditableStatusProps) {
  const [current, setCurrent] = useState(value);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setCurrent(next);
    setSaving(true);
    await fetch(`/api/ship/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={saving}
      className="rounded-md border border-dimmer bg-surface/80 px-2 py-1 text-xs font-medium text-white focus:border-gold focus:outline-none disabled:opacity-50 cursor-pointer"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

interface EditableNumberProps {
  slug: string;
  field: 'revenue_potential' | 'monthly_revenue_usd';
  value: number | null;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export function EditableNumber({
  slug,
  field,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  placeholder = 'Click to set…',
}: EditableNumberProps) {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState<string>(value === null ? '' : String(value));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const payload =
      current.trim() === '' ? null : Number(current);
    await fetch(`/api/ship/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: payload }),
    });
    setSaving(false);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') {
              setCurrent(value === null ? '' : String(value));
              setEditing(false);
            }
          }}
          className="w-28 rounded-md border border-gold/50 bg-surface/80 px-2 py-1 text-sm text-white focus:outline-none focus:border-gold"
        />
        <button
          onClick={save}
          disabled={saving}
          className="rounded-md border border-gold/40 bg-gold/10 px-2 py-1 text-xs font-medium text-gold hover:bg-gold/20 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => {
            setCurrent(value === null ? '' : String(value));
            setEditing(false);
          }}
          className="rounded-md border border-dimmer px-2 py-1 text-xs font-medium text-steel hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-left text-sm group"
    >
      {value === null ? (
        <span className="italic text-steel group-hover:text-gold/60 transition-colors">
          {placeholder}
        </span>
      ) : (
        <span className="text-white group-hover:text-gold transition-colors">
          {prefix ?? ''}
          {value}
          {suffix ?? ''}
        </span>
      )}
      <span className="ml-1.5 text-[10px] text-steel opacity-0 group-hover:opacity-100 transition-opacity">
        edit
      </span>
    </button>
  );
}

interface BlockerManagerProps {
  slug: string;
  initialBlockers: Array<{ id: string; text: string; resolved_at: string | null }>;
}

export function BlockerManager({ slug, initialBlockers }: BlockerManagerProps) {
  const [blockers, setBlockers] = useState(initialBlockers);
  const [newText, setNewText] = useState('');
  const [adding, setAdding] = useState(false);

  async function addBlocker() {
    if (!newText.trim()) return;
    setAdding(true);
    const res = await fetch(`/api/ship/${slug}/blockers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText.trim() }),
    });
    const { blocker } = await res.json();
    if (blocker) setBlockers((prev) => [blocker, ...prev]);
    setNewText('');
    setAdding(false);
  }

  async function resolveBlocker(id: string) {
    await fetch(`/api/ship/${slug}/blockers/${id}`, { method: 'DELETE' });
    setBlockers((prev) =>
      prev.map((b) => b.id === id ? { ...b, resolved_at: new Date().toISOString() } : b),
    );
  }

  return (
    <div className="space-y-3">
      {blockers.length === 0 ? (
        <p className="text-sm italic text-steel">No blockers recorded.</p>
      ) : (
        <ul className="space-y-2">
          {blockers.map((b) => (
            <li
              key={b.id}
              className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
                b.resolved_at
                  ? 'border-dimmer bg-surface/80/50 text-steel line-through'
                  : 'border-danger/30 bg-danger/5 text-white'
              }`}
            >
              <span className="mt-0.5 shrink-0">{b.resolved_at ? '✓' : '●'}</span>
              <span className="flex-1">{b.text}</span>
              {!b.resolved_at && (
                <button
                  onClick={() => resolveBlocker(b.id)}
                  className="shrink-0 text-[10px] text-steel hover:text-success transition-colors"
                >
                  resolve
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addBlocker()}
          placeholder="Add a blocker…"
          className="flex-1 rounded-md border border-dimmer bg-surface/80 px-3 py-1.5 text-sm text-white placeholder:text-steel focus:border-gold focus:outline-none"
        />
        <button
          onClick={addBlocker}
          disabled={adding || !newText.trim()}
          className="rounded-md border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20 transition-colors disabled:opacity-50"
        >
          {adding ? '…' : 'Add'}
        </button>
      </div>
    </div>
  );
}
