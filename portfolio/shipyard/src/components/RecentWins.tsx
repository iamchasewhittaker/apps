import Link from 'next/link';
import { getRecentWins, type JobSearchWin } from '@/lib/wins';

const TYPE_LABEL: Record<JobSearchWin['type'], string> = {
  response: 'Reply',
  progression: 'Stage',
  daily_target: 'Floor',
  manual: 'Win',
};

const TYPE_COLOR: Record<JobSearchWin['type'], string> = {
  response: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  progression: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
  daily_target: 'border-gold/40 bg-gold/10 text-gold',
  manual: 'border-dimmer bg-ghost text-dim',
};

// Surfaces "Chase shipped N wins this week" from Job Search HQ on the
// Shipyard fleet page. Read-only — Shipyard never writes to job-search data.
export default async function RecentWins() {
  const { count, recent, windowDays } = await getRecentWins(7);

  return (
    <div className="rounded-lg border border-dimmer bg-surface">
      <div className="flex items-center justify-between border-b border-dimmer px-4 py-3">
        <div>
          <p className="font-mono-label text-xs text-dim">JOB SEARCH HQ — TRAILING {windowDays}D</p>
          <p className="font-display text-xl text-white mt-0.5">
            {count === 0 ? 'NO WINS LOGGED THIS WEEK' : `${count} WIN${count === 1 ? '' : 'S'} THIS WEEK`}
          </p>
        </div>
        <Link
          href="https://job-search-hq.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-label text-xs text-steel underline underline-offset-2 hover:text-white"
        >
          Open HQ ↗
        </Link>
      </div>

      {recent.length > 0 && (
        <ul className="flex flex-col gap-2 p-4">
          {recent.map((w) => (
            <li
              key={w.id}
              className="flex items-center gap-3 rounded border border-dimmer bg-ghost px-3 py-2"
            >
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-mono-label ${TYPE_COLOR[w.type] ?? TYPE_COLOR.manual}`}
              >
                {TYPE_LABEL[w.type] ?? w.type.toUpperCase()}
              </span>
              <span className="font-mono-label text-[10px] text-dim shrink-0">{w.date}</span>
              <span className="text-sm text-white truncate">{w.title}</span>
            </li>
          ))}
        </ul>
      )}

      {count === 0 && (
        <div className="px-4 py-3 text-sm text-dim">
          No wins logged in the last {windowDays} days. Auto-logs fire on stage progression
          and replies; manual wins via the WinsLog card on Job Search HQ.
        </div>
      )}
    </div>
  );
}
