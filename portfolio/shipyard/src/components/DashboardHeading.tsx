'use client';

import { useLabel } from '@/components/ModeProvider';

interface Props {
  total: number;
  lastSyncedRelative: string;
}

export function DashboardHeading({ total, lastSyncedRelative }: Props) {
  const title = useLabel('fleetDashboard');
  const shipsNoun = useLabel('ships');
  return (
    <div className="mb-2">
      <h1 className="text-3xl font-bold text-white leading-tight">{title}</h1>
      <p className="text-base text-steel mt-1">
        {total} {shipsNoun} · last synced {lastSyncedRelative}
      </p>
    </div>
  );
}
