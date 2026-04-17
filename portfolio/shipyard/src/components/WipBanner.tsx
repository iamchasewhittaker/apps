import Link from 'next/link';

interface Props {
  wipCount: number;
}

export default function WipBanner({ wipCount }: Props) {
  if (wipCount <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
      <p className="text-sm font-medium text-red-300">
        <span className="mr-1">&#9888;&#65039;</span>
        {wipCount} ships under construction. WIP limit is 1.
      </p>
      <Link
        href="/wip"
        className="rounded-md bg-amber-600/80 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
      >
        Pick your active focus &rarr;
      </Link>
    </div>
  );
}
