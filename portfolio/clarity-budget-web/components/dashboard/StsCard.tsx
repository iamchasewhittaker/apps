import { T } from "@/lib/constants";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

interface StsCardProps {
  safeM: number | null;
  safeW: number | null;
  safeD: number | null;
  loading: boolean;
}

export function StsCard({ safeM, safeW, safeD, loading }: StsCardProps) {
  if (loading) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: T.border, background: T.surface }}
        aria-busy="true"
        aria-label="Loading YNAB"
      >
        <div className="h-4 w-40 animate-pulse rounded" style={{ background: T.border }} />
        <div
          className="mt-4 h-12 w-3/4 max-w-[220px] animate-pulse rounded-lg"
          style={{ background: T.border }}
        />
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="h-24 animate-pulse rounded-xl" style={{ background: T.border }} />
          <div className="h-24 animate-pulse rounded-xl" style={{ background: T.border }} />
        </div>
      </div>
    );
  }

  if (safeM == null) return null;

  return (
    <div className="space-y-3">
      <section
        className="rounded-[20px] border p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
        style={{
          borderColor: T.border,
          background: `linear-gradient(145deg, ${T.surface} 0%, #121826 100%)`,
        }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: T.muted }}
        >
          This month
        </p>
        <p className="mt-0.5 text-sm" style={{ color: T.muted }}>
          Full pool
        </p>
        <p
          className="mt-2 text-[2.5rem] font-bold leading-none tabular-nums tracking-tight"
          style={{ color: T.safe, fontFeatureSettings: '"tnum" 1' }}
        >
          {fmt(safeM)}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: T.muted }}
          >
            This week
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums">
            {safeW != null ? fmt(safeW) : "—"}
          </p>
          <p className="mt-1 text-[11px] leading-snug" style={{ color: T.muted }}>
            ~7 days at today&apos;s pace
          </p>
        </div>
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: T.muted }}
          >
            Today
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums">
            {safeD != null ? fmt(safeD) : "—"}
          </p>
          <p className="mt-1 text-[11px] leading-snug" style={{ color: T.muted }}>
            Per day left in month
          </p>
        </div>
      </div>
    </div>
  );
}
