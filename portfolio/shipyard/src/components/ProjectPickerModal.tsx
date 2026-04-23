'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { writeVisibleSet } from '@/lib/visible-projects';

export interface PickerProject {
  slug: string;
  name: string;
  type: string | null;
  family: string | null;
  status?: string | null;
}

interface Props {
  projects: PickerProject[];
  open: boolean;
  initial?: string[] | null;
  onClose: () => void;
  firstVisit?: boolean;
}

export function ProjectPickerModal({
  projects,
  open,
  initial,
  onClose,
  firstVisit = false,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial ?? []));
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(new Set(initial ?? []));
      setQuery('');
    }
  }, [open, initial]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? projects.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q) ||
            (p.family ?? '').toLowerCase().includes(q) ||
            (p.type ?? '').toLowerCase().includes(q),
        )
      : projects;

    const map = new Map<string, PickerProject[]>();
    for (const p of filtered) {
      const key = (p.family ?? 'unfiled').toString();
      const arr = map.get(key) ?? [];
      arr.push(p);
      map.set(key, arr);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([family, items]) => ({
        family,
        items: items.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [projects, query]);

  const visibleSlugs = useMemo(
    () => groups.flatMap((g) => g.items.map((i) => i.slug)),
    [groups],
  );

  if (!open) return null;

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function selectAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const slug of visibleSlugs) next.add(slug);
      return next;
    });
  }

  function clearAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const slug of visibleSlugs) next.delete(slug);
      return next;
    });
  }

  async function handleSave() {
    if (selected.size === 0) return;
    setSaving(true);
    writeVisibleSet([...selected]);
    router.refresh();
    setSaving(false);
    onClose();
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (firstVisit) return;
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Choose visible projects"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg border border-dimmer bg-surface shadow-2xl">
        <header className="border-b border-dimmer px-6 py-5">
          <p className="font-mono-label text-xs text-dim">FLEET SETUP</p>
          <h2 className="mt-1 font-display text-3xl text-white">
            {firstVisit ? 'Pick your fleet' : 'Manage visible projects'}
          </h2>
          <p className="mt-2 text-sm text-dim">
            Only the projects you check will appear across Fleet, WIP, Captain&rsquo;s Log,
            Charts, and Showcase. You can change this anytime in Settings.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2 border-b border-dimmer px-6 py-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="flex-1 min-w-[200px] rounded-md border border-dimmer bg-bg px-3 py-2 text-sm text-white placeholder:text-dim focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={selectAllVisible}
            className="rounded-md border border-dimmer px-3 py-2 text-xs font-mono-label text-dim hover:border-gold hover:text-gold transition-colors"
          >
            Select all{query ? ' shown' : ''}
          </button>
          <button
            type="button"
            onClick={clearAllVisible}
            className="rounded-md border border-dimmer px-3 py-2 text-xs font-mono-label text-dim hover:border-gold hover:text-gold transition-colors"
          >
            Clear{query ? ' shown' : ''}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {groups.length === 0 ? (
            <p className="text-sm text-dim">No projects match &ldquo;{query}&rdquo;.</p>
          ) : (
            groups.map(({ family, items }) => (
              <section key={family} className="space-y-2">
                <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold">
                  {family} <span className="text-dim">· {items.length}</span>
                </h3>
                <ul className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                  {items.map((p) => {
                    const checked = selected.has(p.slug);
                    return (
                      <li key={p.slug}>
                        <label
                          className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 transition-colors ${
                            checked
                              ? 'border-gold/60 bg-gold/10'
                              : 'border-dimmer bg-bg hover:border-gold/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(p.slug)}
                            className="mt-0.5 h-4 w-4 accent-gold"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">{p.name}</div>
                            <div className="font-mono-label text-[11px] text-dim">
                              {p.type ?? '—'}
                            </div>
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-dimmer px-6 py-4">
          <span className="font-mono-label text-xs text-dim">
            {selected.size} of {projects.length} selected
          </span>
          <div className="flex gap-2">
            {!firstVisit && (
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-md border border-dimmer px-4 py-2 text-sm text-dim hover:border-gold hover:text-gold transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={selected.size === 0 || saving}
              className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-bg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold/90 transition-colors"
            >
              {saving ? 'Saving…' : firstVisit ? 'Set up fleet' : 'Save'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
