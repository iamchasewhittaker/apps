'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { QueueRow } from './QueueRow';
import { updateRanks, seedRanksByCommit } from './actions';
import type { Project } from '@/lib/types';

type SortMode = 'priority' | 'last_updated' | 'mvp_step' | 'name' | 'money';
const STORAGE_KEY = 'shipyard_wip_sort_mode';

interface Props {
  ships: Project[];
}

export function QueueList({ ships: initialShips }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('last_updated');
  const [ships, setShips] = useState<Project[]>(initialShips);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SortMode | null;
      if (stored && ['priority', 'last_updated', 'mvp_step', 'name', 'money'].includes(stored)) {
        setSortMode(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setShips(initialShips);
  }, [initialShips]);

  function handleSortChange(next: SortMode) {
    setSortMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  const activeShip = ships.find((s) => s.status === 'active');
  const queue = useMemo(() => ships.filter((s) => s.slug !== activeShip?.slug), [ships, activeShip]);

  const sortedQueue = useMemo(() => {
    const copy = [...queue];
    switch (sortMode) {
      case 'priority':
        copy.sort((a, b) => {
          const ar = a.priority_rank ?? Number.POSITIVE_INFINITY;
          const br = b.priority_rank ?? Number.POSITIVE_INFINITY;
          if (ar !== br) return ar - br;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'last_updated':
        copy.sort((a, b) => {
          const ad = a.last_commit_date ? new Date(a.last_commit_date).getTime() : 0;
          const bd = b.last_commit_date ? new Date(b.last_commit_date).getTime() : 0;
          return bd - ad;
        });
        break;
      case 'mvp_step':
        copy.sort((a, b) => (b.mvp_step_actual ?? 0) - (a.mvp_step_actual ?? 0));
        break;
      case 'name':
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'money':
        copy.sort((a, b) => {
          const ar = a.revenue_potential ?? -1;
          const br = b.revenue_potential ?? -1;
          if (ar !== br) return br - ar;
          const am = a.monthly_revenue_usd ?? -1;
          const bm = b.monthly_revenue_usd ?? -1;
          if (am !== bm) return bm - am;
          return a.name.localeCompare(b.name);
        });
        break;
    }
    return copy;
  }, [queue, sortMode]);

  const unrankedCount = queue.filter((s) => s.priority_rank === null).length;
  const allUnranked = sortMode === 'priority' && unrankedCount === queue.length && queue.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedQueue.findIndex((s) => s.slug === active.id);
    const newIndex = sortedQueue.findIndex((s) => s.slug === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(sortedQueue, oldIndex, newIndex);
    const entries = reordered.map((s, idx) => ({
      slug: s.slug,
      priority_rank: (idx + 1) * 10,
    }));

    const rankMap = new Map(entries.map((e) => [e.slug, e.priority_rank]));
    setShips((prev) =>
      prev.map((s) => {
        const newRank = rankMap.get(s.slug);
        return newRank !== undefined ? { ...s, priority_rank: newRank } : s;
      }),
    );

    const result = await updateRanks(entries);
    if (!result.ok) {
      setError(result.error ?? 'Failed to save ranks');
      setShips(initialShips);
    } else {
      setError(null);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    setError(null);
    const sortedByCommit = [...queue].sort((a, b) => {
      const ad = a.last_commit_date ? new Date(a.last_commit_date).getTime() : 0;
      const bd = b.last_commit_date ? new Date(b.last_commit_date).getTime() : 0;
      return bd - ad;
    });
    const slugs = sortedByCommit.map((s) => s.slug);
    const rankMap = new Map(slugs.map((slug, idx) => [slug, (idx + 1) * 10]));
    setShips((prev) =>
      prev.map((s) => {
        const newRank = rankMap.get(s.slug);
        return newRank !== undefined ? { ...s, priority_rank: newRank } : s;
      }),
    );

    const result = await seedRanksByCommit(slugs);
    if (!result.ok) {
      setError(result.error ?? 'Failed to seed ranks');
      setShips(initialShips);
    }
    setSeeding(false);
  }

  return (
    <div className="space-y-4">
      {activeShip && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Active Focus
          </h2>
          <QueueRow ship={activeShip} isActive={true} draggable={false} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Queue ({queue.length})
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="sort-mode" className="text-muted">
            Sort by
          </label>
          <select
            id="sort-mode"
            value={sortMode}
            onChange={(e) => handleSortChange(e.target.value as SortMode)}
            className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none"
          >
            <option value="priority">Priority</option>
            <option value="last_updated">Last Updated</option>
            <option value="money">Money</option>
            <option value="mvp_step">MVP Step</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
          {error}
        </div>
      )}

      {allUnranked && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold">
          <span>Drag to set your priorities, or seed from last commit date.</span>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="rounded-md border border-gold/40 bg-gold/20 px-2.5 py-1 text-[11px] font-medium text-gold hover:bg-gold/30 disabled:opacity-50"
          >
            {seeding ? 'Seeding…' : 'Seed from commit date'}
          </button>
        </div>
      )}

      {sortedQueue.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted">No ships in the queue.</p>
        </div>
      ) : sortMode === 'priority' ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sortedQueue.map((s) => s.slug)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sortedQueue.map((ship) => (
                <QueueRow key={ship.slug} ship={ship} isActive={false} draggable={true} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-2">
          {sortedQueue.map((ship) => (
            <QueueRow key={ship.slug} ship={ship} isActive={false} draggable={false} />
          ))}
        </div>
      )}
    </div>
  );
}
