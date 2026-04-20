'use client';

import { useLabel } from '@/components/ModeProvider';
import type { LabelKey } from '@/lib/labels';

interface Props {
  labelKey: LabelKey;
  subtitle?: string;
  className?: string;
}

export function ModeHeading({ labelKey, subtitle, className }: Props) {
  const label = useLabel(labelKey);
  return (
    <div className="space-y-1">
      <h1 className={className ?? 'text-2xl font-bold tracking-tight text-accent'}>
        {label}
      </h1>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
