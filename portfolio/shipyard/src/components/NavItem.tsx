'use client';

import Link from 'next/link';
import { useLabel } from '@/components/ModeProvider';
import type { LabelKey } from '@/lib/labels';

interface NavItemProps {
  href: string;
  labelKey: LabelKey;
}

export function NavItem({ href, labelKey }: NavItemProps) {
  const label = useLabel(labelKey);
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded-md font-mono-label text-[11px] text-dim hover:text-white hover:bg-dimmer/60 transition-colors"
      >
        <span className="w-4 text-center text-gold">/</span>
        {label}
      </Link>
    </li>
  );
}
