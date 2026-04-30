'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLabel } from '@/components/ModeProvider';
import type { LabelKey } from '@/lib/labels';

interface NavItemProps {
  href: string;
  labelKey: LabelKey;
}

export function NavItem({ href, labelKey }: NavItemProps) {
  const label = useLabel(labelKey);
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
          isActive
            ? 'bg-gold/10 text-gold font-semibold'
            : 'text-steel hover:text-white hover:bg-white/5'
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
