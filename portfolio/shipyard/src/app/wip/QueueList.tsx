'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShipCard } from '@/components/ShipCard';
import WipActions from './WipActions';
import type { Project } from '@/lib/types';

type SortMode = 'priority' | 'last_updated' | 'mvp_step' | 'name' | 'money';
const STORAGE_KEY = 'shipyard_wip_sort_mode';

interface Props {
  ships: Project[];
}

export function QueueList({ ships: initialShips }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('last_updated');
  const [ships, setShips] = useState<Project[]>(initialShips);

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

  return (
    <div className="space-y-6">
      {activeShip && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
            Active Focus
          </h2>
          <ShipCard project={activeShip} highlight />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
          Queue ({queue.length})
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="sort-mode" className="text-steel">
            Sort by
          </label>
          <select
            id="sort-mode"
            value={sortMode}
            onChange={(e) => handleSortChange(e.target.value as SortMode)}
            className="rounded-md border border-dimmer bg-surface/80 backdrop-blur-sm px-2 py-1 text-xs text-white focus:border-gold focus:outline-none"
          >
            <option value="priority">Priority</option>
            <option value="last_updated">Last Updated</option>
            <option value="money">Money</option>
            <option value="mvp_step">MVP Step</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {sortedQueue.length === 0 ? (
        <div className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-8 text-center">
          <p className="text-sm text-steel">No ships in the queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedQueue.map((ship) => (
            <div key={ship.slug} className="flex flex-col gap-1.5">
              <ShipCard project={ship} />
              <div className="flex justify-end px-1">
                <WipActions slug={ship.slug} isActive={false} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
