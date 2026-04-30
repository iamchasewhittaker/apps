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
    <div className="space-y-3">
      <h1 className={className ?? 'font-display font-bold text-4xl text-white gold-rule inline-block'}>
        {label}
      </h1>
      {subtitle && <p className="text-base text-steel">{subtitle}</p>}
    </div>
  );
}
