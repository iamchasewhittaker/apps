'use client';

import { useLabel } from '@/components/ModeProvider';

export function LogoLabel() {
  const sublabel = useLabel('fleetCommand');
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-xl font-bold text-white">Shipyard</span>
      <span className="text-xs text-steel mt-0.5 capitalize">
        {sublabel.toLowerCase()}
      </span>
    </div>
  );
}
