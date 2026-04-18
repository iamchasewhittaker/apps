type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, { outer: string; initials: string; sub: string; gap: string }> = {
  sm: { outer: 'w-9 h-9 rounded-lg', initials: 'text-sm', sub: 'text-[6px] mt-0.5', gap: '' },
  md: { outer: 'w-14 h-14 rounded-xl', initials: 'text-xl', sub: 'text-[8px] mt-1', gap: '' },
  lg: { outer: 'w-24 h-24 rounded-2xl', initials: 'text-4xl', sub: 'text-[9px] mt-1.5', gap: '' },
};

export function LogoIcon({ size = 'sm' }: { size?: Size }) {
  const s = sizes[size];
  return (
    <div
      className={`${s.outer} bg-[#1e3a5f] border border-[#2d5a8f] flex flex-col items-center justify-center flex-shrink-0`}
    >
      <span className={`text-[#e2e8f0] font-black tracking-tight leading-none ${s.initials}`}>
        SY
      </span>
      <span className={`text-[#e2e8f0] font-bold tracking-[0.15em] leading-none opacity-75 ${s.sub}`}>
        SHIPYARD
      </span>
    </div>
  );
}
