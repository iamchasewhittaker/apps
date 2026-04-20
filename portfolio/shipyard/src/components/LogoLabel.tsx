'use client';

import { useLabel } from '@/components/ModeProvider';

export function LogoLabel() {
  const sublabel = useLabel('fleetCommand');
  return (
    <div className="flex flex-col leading-none">
      <span className="font-display text-xl text-white">SHIPYARD</span>
      <span className="font-mono-label text-[9px] text-dim mt-1">
        {sublabel}
      </span>
    </div>
  );
}
