function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

interface ShortfallBannerProps {
  shortfall: number | null;
}

export function ShortfallBanner({ shortfall }: ShortfallBannerProps) {
  if (shortfall == null || shortfall <= 0.01) return null;

  return (
    <div className="flex gap-3 rounded-xl border border-warning/35 bg-surface/80 backdrop-blur-sm p-3.5">
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-warning"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.517 11.59c.75 1.334-.213 2.98-1.742 2.98H3.482c-1.53 0-2.493-1.646-1.743-2.98l6.518-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className="text-sm font-semibold">Obligations gap</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">
          About {fmt(shortfall)} still needed for mortgage, bills, and essentials this
          month. Fund those in YNAB first.
        </p>
      </div>
    </div>
  );
}
