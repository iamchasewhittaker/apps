import Link from 'next/link';
import type { ReviewCadence } from '@/lib/types';
import { computeChipState, chipColor, chipLabel } from '@/lib/review-cadence';

interface Props {
  cadences: ReviewCadence[];
}

export default function ReviewCountdownChips({ cadences }: Props) {
  return (
    <div className="flex gap-2">
      {cadences.map((c) => {
        const chip = computeChipState(c);
        return (
          <Link
            key={chip.kind}
            href={`/review?kind=${chip.kind}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:brightness-125 ${chipColor(chip.state)}`}
          >
            {chipLabel(chip)}
          </Link>
        );
      })}
    </div>
  );
}
