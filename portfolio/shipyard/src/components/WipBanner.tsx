import Link from 'next/link';

interface Props {
  wipCount: number;
}

export default function WipBanner({ wipCount }: Props) {
  if (wipCount <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
      <p className="font-mono-label text-[11px] text-danger">
        <span className="mr-1">&#9888;&#65039;</span>
        {wipCount} SHIPS UNDER CONSTRUCTION · WIP LIMIT IS 1
      </p>
      <Link
        href="/wip"
        className="rounded-md bg-steel px-3 py-1 font-mono-label text-[10px] text-white transition-colors hover:bg-accent-hover"
      >
        Pick active focus &rarr;
      </Link>
    </div>
  );
}
